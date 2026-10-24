/**
 * BananaGo — Core Analysis Coordinator (Server-Side Logic)
 * Quản lý kiểm tra payload, gọi Google Gemini API, validate và chuẩn hóa kết quả.
 */

import { BANANA_SYSTEM_INSTRUCTION } from './bananaPrompt.js';

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_BASE64_LENGTH = 6 * 1024 * 1024; // Khoảng 4.5MB sau khi decode
export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
export const API_TIMEOUT_MS = 10000; // 10 giây timeout

export const STAGE_CODE_TO_ID = {
  BANANA_1_NON: 1,
  BANANA_2_DEVELOPING: 2,
  BANANA_3_MATURE_GREEN: 3,
  BANANA_4_BEGINNING_RIPE: 4,
  BANANA_5_RIPE: 5,
  BANANA_6_FULLY_RIPE: 6,
  NOT_BANANA: null,
  UNCERTAIN: null,
};

/**
 * Trích xuất và parse chuỗi JSON từ phản hồi của Gemini
 * (Xử lý trường hợp Gemini bọc JSON trong Markdown ```json ... ```)
 */
export function extractJsonFromText(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  let cleaned = rawText.trim();
  // Nếu có bọc markdown code fence ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  // Tìm cặp ngoặc nhọn đầu và cuối
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
}

/**
 * Kiểm tra tính hợp lệ của payload ảnh đầu vào
 * @param {object} imagePayload 
 * @returns {{ isValid: boolean, error?: { code: string, message: string } }}
 */
export function validateImagePayload(imagePayload) {
  if (!imagePayload || typeof imagePayload !== 'object') {
    return {
      isValid: false,
      error: {
        code: 'INVALID_IMAGE',
        message: 'Payload yêu cầu trường "image" chứa thông tin ảnh hợp lệ.',
      },
    };
  }

  const { mimeType, data } = imagePayload;

  if (!mimeType || typeof mimeType !== 'string' || !ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_IMAGE',
        message: 'Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận image/jpeg, image/png hoặc image/webp.',
      },
    };
  }

  if (!data || typeof data !== 'string' || data.trim().length === 0) {
    return {
      isValid: false,
      error: {
        code: 'INVALID_IMAGE',
        message: 'Dữ liệu ảnh base64 không được để trống.',
      },
    };
  }

  if (data.length > MAX_BASE64_LENGTH) {
    return {
      isValid: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Dung lượng ảnh vượt quá giới hạn tối đa cho phép trên Serverless Function (4.5MB).',
      },
    };
  }

  return { isValid: true };
}

/**
 * Hàm điều phối chính: xử lý phân tích ảnh qua Gemini và chuẩn hóa kết quả
 * @param {object} body - Request body { image: { mimeType, data } }
 * @param {object} [config] - Tùy chọn cấu hình (apiKey, model, fetchFn)
 * @returns {Promise<{ status: number, body: object }>}
 */
export async function analyzeImageCore(body, config = {}) {
  // 1. Kiểm tra payload
  const imagePayload = body?.image;
  const validation = validateImagePayload(imagePayload);
  if (!validation.isValid) {
    const status = validation.error.code === 'PAYLOAD_TOO_LARGE' ? 413 : 400;
    return {
      status,
      body: {
        success: false,
        error: validation.error,
      },
    };
  }

  // 2. Kiểm tra API Key
  const apiKey = config.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      status: 500,
      body: {
        success: false,
        error: {
          code: 'CONFIG_MISSING',
          message: 'Hệ thống máy chủ chưa được cấu hình biến môi trường GEMINI_API_KEY.',
        },
      },
    };
  }

  const primaryModel = config.model || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-3-flash-preview',
    'gemini-3.5-flash',
    'gemini-1.5-flash',
  ]));
  const fetchFn = config.fetchFn || globalThis.fetch;

  const geminiRequestBody = {
    systemInstruction: {
      parts: [{ text: BANANA_SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: imagePayload.mimeType.toLowerCase(),
              data: imagePayload.data.replace(/^data:image\/[a-z]+;base64,/i, '').trim(),
            },
          },
          {
            text: 'Analyze the attached banana fruit image and output the exact JSON classification.',
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  };

  // 4. Gọi API với Timeout 10 giây (tự động fallback sang model dự phòng nếu 404/503/timeout)
  let response = null;
  let lastErrorText = '';

  for (const currentModel of candidateModels) {
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(currentModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      response = await fetchFn(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geminiRequestBody),
        signal: controller.signal,
      });

      // Nếu model bị 404 (deprecated/chưa hỗ trợ) hoặc 503 (quá tải), thử candidate tiếp theo
      if (response.status === 404 || response.status === 503) {
        lastErrorText = await response.text().catch(() => '');
        response = null;
        continue;
      }
      break;
    } catch (err) {
      if (err.name === 'AbortError') {
        // Hết timeout trên model này, thử model tiếp theo
        continue;
      }
      return {
        status: 502,
        body: {
          success: false,
          error: {
            code: 'AI_UPSTREAM_ERROR',
            message: `Không thể kết nối đến Google Gemini API: ${err.message || 'Lỗi mạng'}`,
          },
        },
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (!response) {
    return {
      status: 504,
      body: {
        success: false,
        error: {
          code: 'AI_TIMEOUT',
          message: 'Thời gian phân tích của mô hình AI vượt quá giới hạn hoặc máy chủ Google đang quá tải. Vui lòng thử lại.',
        },
      },
    };
  }

  // 5. Xử lý phản hồi từ Gemini
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    if (response.status === 429) {
      return {
        status: 429,
        body: {
          success: false,
          error: {
            code: 'AI_RATE_LIMITED',
            message: 'Hạn ngạch Google Gemini API tạm thời quá tải (Rate limit 429). Đề xuất chuyển sang Chế độ Demo.',
          },
        },
      };
    }

    return {
      status: 502,
      body: {
        success: false,
        error: {
          code: 'AI_UPSTREAM_ERROR',
          message: `Dịch vụ Google Gemini phản hồi mã lỗi HTTP ${response.status}: ${errorText.slice(0, 150)}`,
        },
      },
    };
  }

  // 6. Trích xuất văn bản và Parse JSON
  let rawJson;
  try {
    const responseData = await response.json();
    const candidateText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
    rawJson = extractJsonFromText(candidateText);
  } catch (err) {
    rawJson = null;
  }

  if (!rawJson || typeof rawJson !== 'object') {
    return {
      status: 502,
      body: {
        success: false,
        error: {
          code: 'AI_UPSTREAM_ERROR',
          message: 'Mô hình AI trả về dữ liệu không đúng định dạng JSON chuẩn.',
        },
      },
    };
  }

  // 7. Validate và Chuẩn hóa (Normalization) kết quả
  const stageCode = (rawJson.stage_id || '').trim().toUpperCase();
  const stageId = STAGE_CODE_TO_ID.hasOwnProperty(stageCode) ? STAGE_CODE_TO_ID[stageCode] : null;

  const qualityIssues = [];
  if (rawJson.multiple_bananas) qualityIssues.push('multiple_bananas');
  if (stageCode === 'NOT_BANANA') qualityIssues.push('not_banana');
  if (stageCode === 'UNCERTAIN' || rawJson.confidence_label === 'low') qualityIssues.push('uncertain_evidence');

  const warnings = [];
  if (rawJson.possible_quality_warning) {
    warnings.push('spoilage_detected');
  }

  const normalizedResult = {
    success: true,
    stageId,
    stageCode,
    stageName: rawJson.stage_name_vi || (stageId ? `Giai đoạn ${stageId}` : 'Không xác định'),
    confidenceLabel: ['high', 'medium', 'low'].includes(rawJson.confidence_label)
      ? rawJson.confidence_label
      : 'medium',
    reasoningSummary: rawJson.explanation_vi || 'Đã hoàn tất phân tích hình thái quả chuối.',
    visualEvidence: Array.isArray(rawJson.visual_evidence) ? rawJson.visual_evidence : [],
    qualityIssues,
    warnings,
    qualityWarning: rawJson.quality_warning_vi || null,
    recommendedProducts: Array.isArray(rawJson.recommended_products) ? rawJson.recommended_products : [],
    limitations: Array.isArray(rawJson.limitations_vi) ? rawJson.limitations_vi : [],
    source: 'gemini',
  };

  return {
    status: 200,
    body: normalizedResult,
  };
}
