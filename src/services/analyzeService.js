/**
 * BananaGo — Client Analysis Service (src/services/analyzeService.js)
 * Tích hợp luồng kiểm tra ảnh, nén Canvas, gọi API nội bộ và kích hoạt Fallback.
 */

import { validateImageFile } from '../domain/imageValidation.js';
import { prepareImageForAnalysis } from '../domain/imagePrep.js';
import { getMockAnalysisFixture } from '../data/mockAnalysisFixtures.js';
import { getStageById } from '../domain/stages.js';
import { getRecommendedDishes } from '../domain/recommendations.js';

export const API_ANALYZE_ENDPOINT = '/api/analyze';

/**
 * Phân tích ảnh quả chuối
 * @param {File|Blob|string} imageInput - File ảnh người dùng chọn hoặc chuỗi Base64
 * @param {object} [options]
 * @param {boolean} [options.forceDemoMode=false] - Bắt buộc dùng dữ liệu mẫu demo
 * @param {number} [options.demoStageId=3] - Giai đoạn mẫu mong muốn (1..6)
 * @param {boolean} [options.enableFallback=true] - Tự động fallback sang mock khi API lỗi
 * @returns {Promise<{
 *   success: boolean,
 *   stageId: number|null,
 *   stageCode: string,
 *   stageName: string,
 *   confidenceLabel: string,
 *   reasoningSummary: string,
 *   visualEvidence: string[],
 *   qualityIssues: string[],
 *   warnings: string[],
 *   qualityWarning: string|null,
 *   recommendedProducts: string[],
 *   limitations: string[],
 *   source: 'gemini'|'mock_fallback',
 *   fallbackNotice: string|null,
 *   stageInfo: object|null,
 *   dishRecommendations: object
 * }>}
 */
export async function analyzeBananaImage(imageInput, options = {}) {
  const {
    forceDemoMode = false,
    demoStageId = 3,
    enableFallback = true,
  } = options;

  // 1. Nếu người dùng chủ động chọn "Chế độ Demo" -> Dùng mock fixture trực tiếp
  if (forceDemoMode) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Độ trễ tự nhiên mô phỏng scan
    const mock = getMockAnalysisFixture(demoStageId);
    return enrichAnalysisResult(mock, 'mock_fallback', 'Đang hoạt động ở Chế độ Thử nghiệm Demo (Dữ liệu mẫu ngoại tuyến).');
  }

  // 2. Pre-flight Validation ảnh ở phía Client
  if (imageInput instanceof Blob || (typeof File !== 'undefined' && imageInput instanceof File)) {
    const valResult = validateImageFile(imageInput);
    if (!valResult.isValid) {
      throw new Error(valResult.error);
    }
  }

  // 3. Chuẩn bị và Nén ảnh bằng Canvas
  let imagePayload;
  if (imageInput instanceof Blob || (typeof File !== 'undefined' && imageInput instanceof File)) {
    const prepared = await prepareImageForAnalysis(imageInput);
    imagePayload = {
      mimeType: prepared.mimeType,
      data: prepared.data,
    };
  } else if (typeof imageInput === 'string') {
    // Nếu truyền chuỗi base64 trực tiếp
    const commaIndex = imageInput.indexOf(',');
    const cleanData = commaIndex !== -1 ? imageInput.slice(commaIndex + 1) : imageInput;
    imagePayload = {
      mimeType: 'image/jpeg',
      data: cleanData,
    };
  } else {
    throw new Error('Định dạng đầu vào không hợp lệ. Vui lòng cung cấp tệp ảnh.');
  }

  // 4. Gửi request lên Vercel Serverless Function: POST /api/analyze
  try {
    const response = await fetch(API_ANALYZE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imagePayload,
      }),
    });

    const responseData = await response.json().catch(() => null);

    if (response.ok && responseData && responseData.success) {
      return enrichAnalysisResult(responseData, 'gemini', null);
    }

    // Nếu server trả về lỗi (429, 500, 502, 504...)
    const errorCode = responseData?.error?.code || `HTTP_${response.status}`;
    const errorMessage = responseData?.error?.message || 'Không thể nhận diện ảnh quả chuối.';

    if (enableFallback) {
      console.warn(`[AnalyzeService] API trả về lỗi ${errorCode}: ${errorMessage}. Kích hoạt Mock Fallback an toàn.`);
      const fallbackFixture = getMockAnalysisFixture(demoStageId || 3);
      return enrichAnalysisResult(
        fallbackFixture,
        'mock_fallback',
        `Hệ thống AI bận (${errorCode}: ${errorMessage}). Đã tự động kích hoạt kết quả mẫu để không gián đoạn trải nghiệm.`
      );
    }

    throw new Error(errorMessage);
  } catch (networkOrGeneralError) {
    if (enableFallback) {
      console.warn('[AnalyzeService] Mất kết nối tới API:', networkOrGeneralError.message);
      const fallbackFixture = getMockAnalysisFixture(demoStageId || 3);
      return enrichAnalysisResult(
        fallbackFixture,
        'mock_fallback',
        'Không thể kết nối đến máy chủ AI (Mạng offline hoặc chưa deploy serverless). Đã chuyển sang dữ liệu mẫu Demo.'
      );
    }

    throw networkOrGeneralError;
  }
}

/**
 * Gắn thêm thông tin domain (stageInfo, dishRecommendations) vào kết quả phân tích
 */
function enrichAnalysisResult(rawResult, source = 'gemini', fallbackNotice = null) {
  const stageId = rawResult.stageId || (rawResult.stage_id ? mapCodeToId(rawResult.stage_id) : null);
  const stageInfo = stageId ? getStageById(stageId) : null;
  const hasQualityWarning = Boolean(
    rawResult.possible_quality_warning || (rawResult.warnings && rawResult.warnings.includes('spoilage_detected'))
  );

  const dishRecommendations = getRecommendedDishes(stageId, {
    hasQualityWarning,
    maxItems: 5,
  });

  return {
    ...rawResult,
    stageId,
    source,
    fallbackNotice,
    stageInfo,
    dishRecommendations,
  };
}

function mapCodeToId(code) {
  const map = {
    BANANA_1_NON: 1,
    BANANA_2_DEVELOPING: 2,
    BANANA_3_MATURE_GREEN: 3,
    BANANA_4_BEGINNING_RIPE: 4,
    BANANA_5_RIPE: 5,
    BANANA_6_FULLY_RIPE: 6,
  };
  return map[code] || null;
}
