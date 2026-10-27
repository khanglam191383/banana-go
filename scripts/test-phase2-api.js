/**
 * BananaGo — Phase 2 Serverless API & Integration Test Suite
 * Chạy độc lập bằng Node.js: node scripts/test-phase2-api.js
 */

import {
  validateImagePayload,
  extractJsonFromText,
  analyzeImageCore,
  STAGE_CODE_TO_ID,
  MAX_BASE64_LENGTH,
} from '../api/_lib/analyzeCore.js';
import handler from '../api/analyze.js';
import { analyzeBananaImage } from '../src/services/analyzeService.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('====================================================');
console.log('BANANAGO PHASE 2 API & SERVERLESS TEST SUITE');
console.log('====================================================\n');

// 1. Kiểm tra validation payload phía server
console.log('1. Kiểm tra Server-side Image Payload Validation:');
assert(validateImagePayload(null).isValid === false, 'Từ chối null payload.');
assert(validateImagePayload({}).isValid === false, 'Từ chối payload rỗng.');
assert(validateImagePayload({ mimeType: 'image/gif', data: 'abc' }).isValid === false, 'Từ chối MIME type GIF.');
assert(validateImagePayload({ mimeType: 'image/jpeg', data: '' }).isValid === false, 'Từ chối base64 rỗng.');
assert(validateImagePayload({ mimeType: 'image/jpeg', data: 'A'.repeat(MAX_BASE64_LENGTH + 1) }).error.code === 'PAYLOAD_TOO_LARGE', 'Bắt lỗi PAYLOAD_TOO_LARGE khi vượt quá 6MB base64.');
assert(validateImagePayload({ mimeType: 'image/jpeg', data: 'iVBORw0KGgoAAAANSUhEUg==' }).isValid === true, 'Chấp nhận JPEG base64 hợp lệ.');
assert(validateImagePayload({ mimeType: 'image/png', data: 'iVBORw0KGgoAAAANSUhEUg==' }).isValid === true, 'Chấp nhận PNG base64 hợp lệ.');
assert(validateImagePayload({ mimeType: 'image/webp', data: 'iVBORw0KGgoAAAANSUhEUg==' }).isValid === true, 'Chấp nhận WebP base64 hợp lệ.');

// 2. Kiểm tra hàm trích xuất JSON từ Gemini phản hồi
console.log('\n2. Kiểm tra Phân Tích JSON từ Text Gemini:');
const cleanJson = extractJsonFromText('{"stage_id": "BANANA_3_MATURE_GREEN"}');
assert(cleanJson?.stage_id === 'BANANA_3_MATURE_GREEN', 'Parse chuỗi JSON sạch thành công.');

const markdownJson = extractJsonFromText('```json\n{"stage_id": "BANANA_4_BEGINNING_RIPE"}\n```');
assert(markdownJson?.stage_id === 'BANANA_4_BEGINNING_RIPE', 'Trích xuất JSON bọc trong markdown ```json thành công.');

const wrappedJson = extractJsonFromText('Dưới đây là kết quả:\n{"stage_id": "BANANA_5_RIPE"}\nHy vọng hữu ích!');
assert(wrappedJson?.stage_id === 'BANANA_5_RIPE', 'Trích xuất JSON có văn bản bao quanh thành công.');

assert(extractJsonFromText('invalid json text') === null, 'Trả về null cho JSON cú pháp sai.');

// 3. Kiểm tra analyzeImageCore với các kịch bản Mock Fetch
console.log('\n3. Kiểm tra analyzeImageCore (Server Coordination Logic):');

// 3.1. Thiếu API Key
const noKeyResult = await analyzeImageCore(
  { image: { mimeType: 'image/jpeg', data: 'abc' } },
  { apiKey: '' }
);
assert(noKeyResult.status === 500 && noKeyResult.body.error.code === 'CONFIG_MISSING', 'Trả về HTTP 500 CONFIG_MISSING khi chưa có API key.');

// 3.2. Payload không hợp lệ
const badPayloadResult = await analyzeImageCore({ image: { mimeType: 'image/bmp', data: 'abc' } }, { apiKey: 'dummy' });
assert(badPayloadResult.status === 400 && badPayloadResult.body.error.code === 'INVALID_IMAGE', 'Trả về HTTP 400 INVALID_IMAGE.');

// 3.3. Gemini API thành công (Giai đoạn 3)
const mockSuccessFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [
      {
        content: {
          parts: [
            {
              text: JSON.stringify({
                stage_id: 'BANANA_3_BEGINNING_RIPE',
                stage_name_vi: 'Giai đoạn 3 – Chuối bắt đầu chín',
                confidence_label: 'high',
                visual_evidence: ['Vỏ chuyển vàng nhạt', 'Đầu núm còn xanh nhẹ'],
                explanation_vi: 'Chuối bắt đầu chín sinh hóa, đường fructose tăng dần.',
                multiple_bananas: false,
                possible_quality_warning: false,
                quality_warning_vi: null,
                recommended_products: ['SUGAR_COATED_BANANA'],
                limitations_vi: [],
              }),
            },
          ],
        },
      },
    ],
  }),
});

const successResult = await analyzeImageCore(
  { image: { mimeType: 'image/jpeg', data: 'validbase64' } },
  { apiKey: 'dummy_key', fetchFn: mockSuccessFetch }
);
assert(successResult.status === 200, 'HTTP Status 200 thành công.');
assert(successResult.body.success === true, 'Response body có success = true.');
assert(successResult.body.stageId === 3, 'stageId được normalize thành số 3.');
assert(successResult.body.stageCode === 'BANANA_3_BEGINNING_RIPE', 'stageCode khớp.');
assert(successResult.body.confidenceLabel === 'high', 'confidenceLabel là high.');
assert(successResult.body.source === 'gemini', 'source là gemini.');
assert(Array.isArray(successResult.body.visualEvidence) && successResult.body.visualEvidence.length === 2, 'Bảo toàn visualEvidence.');

// 3.4. Gemini API bị Rate Limit (HTTP 429)
const mock429Fetch = async () => ({
  ok: false,
  status: 429,
  text: async () => 'RESOURCE_EXHAUSTED',
});
const rateLimitResult = await analyzeImageCore(
  { image: { mimeType: 'image/jpeg', data: 'validbase64' } },
  { apiKey: 'dummy_key', fetchFn: mock429Fetch }
);
assert(rateLimitResult.status === 429 && rateLimitResult.body.error.code === 'AI_RATE_LIMITED', 'Xử lý chuẩn mã lỗi AI_RATE_LIMITED 429.');

// 3.5. Gemini API trả về JSON sai schema
const mockBadJsonFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [{ content: { parts: [{ text: 'This is not json!' }] } }],
  }),
});
const badJsonResult = await analyzeImageCore(
  { image: { mimeType: 'image/jpeg', data: 'validbase64' } },
  { apiKey: 'dummy_key', fetchFn: mockBadJsonFetch }
);
assert(badJsonResult.status === 502 && badJsonResult.body.error.code === 'AI_UPSTREAM_ERROR', 'Xử lý chuẩn mã lỗi AI_UPSTREAM_ERROR khi Gemini trả text lỗi.');

// 3.6. Gemini phát hiện ảnh không phải chuối (NOT_BANANA)
const mockNotBananaFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [{ content: { parts: [{ text: JSON.stringify({
      stage_id: 'NOT_BANANA',
      stage_name_vi: 'Không phải chuối thật',
      explanation_vi: 'Hình ảnh này là một chú chó, không phải quả chuối thật.',
    }) }] } }],
  }),
});
const notBananaResult = await analyzeImageCore(
  { image: { mimeType: 'image/jpeg', data: 'validbase64' } },
  { apiKey: 'dummy_key', fetchFn: mockNotBananaFetch }
);
assert(notBananaResult.status === 400 && notBananaResult.body.error.code === 'NOT_BANANA', 'Báo lỗi HTTP 400 NOT_BANANA khi ảnh không phải quả chuối.');

// 3.7. Gemini phát hiện ảnh quá mờ / không xác định (UNCERTAIN)
const mockUncertainFetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({
    candidates: [{ content: { parts: [{ text: JSON.stringify({
      stage_id: 'UNCERTAIN',
      confidence_label: 'low',
      explanation_vi: 'Hình ảnh bị rung mờ không thể xác định quả chuối.',
    }) }] } }],
  }),
});
const uncertainResult = await analyzeImageCore(
  { image: { mimeType: 'image/jpeg', data: 'validbase64' } },
  { apiKey: 'dummy_key', fetchFn: mockUncertainFetch }
);
assert(uncertainResult.status === 400 && uncertainResult.body.error.code === 'UNCERTAIN_IMAGE', 'Báo lỗi HTTP 400 UNCERTAIN_IMAGE khi ảnh quá mờ hoặc thiếu sáng.');

// 4. Kiểm tra Vercel Serverless Function HTTP Handler (api/analyze.js)
console.log('\n4. Kiểm tra Vercel Serverless Function Handler (api/analyze.js):');

function createMockReqRes(method, body) {
  const req = { method, body };
  let statusCode = 200;
  let headers = {};
  let responseData = null;

  const res = {
    setHeader: (k, v) => { headers[k] = v; },
    status: (code) => { statusCode = code; return res; },
    json: (data) => { responseData = data; return res; },
    end: (str) => { responseData = JSON.parse(str); return res; },
    _getStatusCode: () => statusCode,
    _getData: () => responseData,
  };
  return { req, res };
}

// 4.1. Thử gọi GET vào POST endpoint
const { req: getReq, res: getRes } = createMockReqRes('GET', null);
await handler(getReq, getRes);
assert(getRes._getStatusCode() === 405, 'GET request bị từ chối với status 405 METHOD_NOT_ALLOWED.');

// 4.2. Thử gọi POST không có body
const { req: postEmptyReq, res: postEmptyRes } = createMockReqRes('POST', null);
await handler(postEmptyReq, postEmptyRes);
assert(postEmptyRes._getStatusCode() === 400, 'POST không có body trả về status 400.');

// 5. Kiểm tra Client Service (analyzeService.js)
console.log('\n5. Kiểm tra Client Analyze Service (src/services/analyzeService.js):');

// 5.1. Chế độ Demo Mode
const demoResult = await analyzeBananaImage(null, { forceDemoMode: true, demoStageId: 4 });
assert(demoResult.success === true, 'Chế độ Demo trả về kết quả thành công.');
assert(demoResult.stageId === 4, 'Demo Stage ID 4 khớp.');
assert(demoResult.source === 'mock_fallback', 'source là mock_fallback.');
assert(demoResult.dishRecommendations.dishes.length > 0, 'Gắn kèm danh sách món gợi ý.');

// 5.2. Chế độ Fallback khi API ngoại tuyến
// Thay thế fetch tạm thời để mô phỏng mất mạng
const originalFetch = globalThis.fetch;
globalThis.fetch = async () => { throw new Error('Network offline'); };

const fallbackResult = await analyzeBananaImage('data:image/jpeg;base64,samplebase64', {
  forceDemoMode: false,
  enableFallback: true,
  demoStageId: 3,
});
assert(fallbackResult.success === true, 'Fallback thành công khi API mất mạng.');
assert(fallbackResult.source === 'mock_fallback', 'source được gắn nhãn mock_fallback minh bạch.');
assert(typeof fallbackResult.fallbackNotice === 'string', 'Có thông báo fallbackNotice giải thích cho người dùng.');

globalThis.fetch = originalFetch; // Khôi phục fetch

console.log('\n====================================================');
console.log(`KẾT QUẢ KIỂM THỬ: ${passed} PASS, ${failed} FAIL`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
