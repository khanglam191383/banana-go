/**
 * BananaGo — Phase 1 Domain Data Integrity & Validation Verification Script
 * Chạy độc lập bằng Node.js: node scripts/test-phase1-domain.js
 */

import { BANANA_STAGES, getStageById, getStageByCode, isValidStageId, isValidStageCode } from '../src/domain/stages.js';
import { validateImageFile, MAX_IMAGE_SIZE_BYTES, ERROR_CODES } from '../src/domain/imageValidation.js';
import { calculateAspectRatioFit, stripBase64Prefix } from '../src/domain/imagePrep.js';
import { MOCK_FIXTURES, getMockAnalysisFixture } from '../src/data/mockAnalysisFixtures.js';
import { STAGE_DISH_MAPPING, getStageDishMapping } from '../src/data/stageDishMap.js';
import { getRecommendedDishes, getRecipeById, MAX_RECOMMENDED_DISHES } from '../src/domain/recommendations.js';
import { MOCK_RECIPES } from '../src/data/mockData.js';

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
console.log('BANANAGO PHASE 1 DOMAIN INTEGRITY TEST SUITE');
console.log('====================================================\n');

// 1. Kiểm tra 6 Giai đoạn Trái Chuối (stages.js)
console.log('1. Kiểm tra Module Giai đoạn TRÁI CHUỐI (src/domain/stages.js):');
assert(BANANA_STAGES.length === 6, 'Phải có chính xác 6 giai đoạn trái chuối.');

const expectedCodes = [
  'BANANA_1_NON',
  'BANANA_2_DEVELOPING',
  'BANANA_3_MATURE_GREEN',
  'BANANA_4_BEGINNING_RIPE',
  'BANANA_5_RIPE',
  'BANANA_6_FULLY_RIPE',
];

BANANA_STAGES.forEach((stage, idx) => {
  const expectedId = idx + 1;
  const expectedCode = expectedCodes[idx];
  assert(stage.id === expectedId, `Giai đoạn ${expectedId} có ID = ${expectedId}`);
  assert(stage.code === expectedCode, `Giai đoạn ${expectedId} có mã code = ${expectedCode}`);
  assert(typeof stage.name === 'string' && stage.name.length > 0, `Giai đoạn ${expectedId} có tên tiếng Việt`);
  assert(typeof stage.description === 'string' && stage.description.length > 0, `Giai đoạn ${expectedId} có mô tả cảm quan`);
  assert(typeof stage.culinaryUsage === 'string', `Giai đoạn ${expectedId} có hướng dẫn sử dụng ẩm thực`);
  assert(typeof stage.farmerAdvice === 'string', `Giai đoạn ${expectedId} có lời khuyên thu hoạch/bảo quản`);
});

assert(getStageById(3)?.code === 'BANANA_3_MATURE_GREEN', 'getStageById(3) trả về đúng Giai đoạn 3.');
assert(getStageByCode('BANANA_5_RIPE')?.id === 5, 'getStageByCode("BANANA_5_RIPE") trả về đúng ID 5.');
assert(isValidStageId(1) === true && isValidStageId(6) === true, 'isValidStageId hợp lệ cho 1..6.');
assert(isValidStageId(0) === false && isValidStageId(7) === false, 'isValidStageId từ chối các ID ngoài 1..6.');
assert(isValidStageCode('INVALID_CODE') === false, 'isValidStageCode từ chối mã không tồn tại.');

// 2. Kiểm tra Image Validation (imageValidation.js)
console.log('\n2. Kiểm tra Module Kiểm thực Ảnh (src/domain/imageValidation.js):');
assert(validateImageFile(null).isValid === false, 'Từ chối tệp null/undefined (FILE_MISSING).');
assert(validateImageFile({ size: 0, type: 'image/jpeg' }).isValid === false, 'Từ chối tệp 0 bytes (FILE_EMPTY).');
assert(validateImageFile({ size: 1000, type: 'image/gif' }).isValid === false, 'Từ chối định dạng GIF (UNSUPPORTED_TYPE).');
assert(validateImageFile({ size: MAX_IMAGE_SIZE_BYTES + 1, type: 'image/jpeg' }).isValid === false, 'Từ chối tệp > 10MB (FILE_TOO_LARGE).');
assert(validateImageFile({ size: 1024 * 500, type: 'image/jpeg' }).isValid === true, 'Chấp nhận ảnh JPEG 500KB hợp lệ.');
assert(validateImageFile({ size: 1024 * 1024, type: 'image/png' }).isValid === true, 'Chấp nhận ảnh PNG 1MB hợp lệ.');
assert(validateImageFile({ size: 1024 * 200, type: 'image/webp' }).isValid === true, 'Chấp nhận ảnh WebP 200KB hợp lệ.');

// 3. Kiểm tra Image Preparation (imagePrep.js)
console.log('\n3. Kiểm tra Module Chuẩn bị và Nén Ảnh (src/domain/imagePrep.js):');
const fitLarge = calculateAspectRatioFit(3200, 2400, 1600);
assert(fitLarge.width === 1600 && fitLarge.height === 1200, 'Thu nhỏ ảnh 3200x2400 về đúng 1600x1200.');
const fitSmall = calculateAspectRatioFit(800, 600, 1600);
assert(fitSmall.width === 800 && fitSmall.height === 600, 'Giữ nguyên kích thước ảnh nhỏ hơn 1600px.');
const stripped = stripBase64Prefix('data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUg==');
assert(stripped === 'iVBORw0KGgoAAAANSUhEUg==', 'stripBase64Prefix loại bỏ đúng tiền tố Data URL.');

// 4. Kiểm tra Mock Analysis Fixtures (mockAnalysisFixtures.js)
console.log('\n4. Kiểm tra Dữ liệu Phân tích Mẫu (src/data/mockAnalysisFixtures.js):');
[1, 2, 3, 4, 5, 6].forEach((stageId) => {
  const fix = getMockAnalysisFixture(stageId);
  assert(fix.success === true, `Fixture stage ${stageId} có success = true.`);
  assert(fix.stageId === stageId, `Fixture stage ${stageId} có stageId khớp = ${stageId}.`);
  assert(Array.isArray(fix.visual_evidence) && fix.visual_evidence.length > 0, `Fixture stage ${stageId} có danh sách visual_evidence.`);
  assert(typeof fix.explanation_vi === 'string' && fix.explanation_vi.length > 0, `Fixture stage ${stageId} có giải thích tiếng Việt.`);
  assert(Array.isArray(fix.recommended_products), `Fixture stage ${stageId} có mảng recommended_products.`);
  assert(Array.isArray(fix.limitations_vi), `Fixture stage ${stageId} có mảng limitations_vi.`);
});

const fixUncertain = getMockAnalysisFixture('uncertain');
assert(fixUncertain.stage_id === 'UNCERTAIN' && fixUncertain.confidence_label === 'low', 'Fixture uncertain có nhãn LOW và stage UNCERTAIN.');

const fixNotBanana = getMockAnalysisFixture('not_banana');
assert(fixNotBanana.stage_id === 'NOT_BANANA' && fixNotBanana.stageId === null, 'Fixture not_banana có stageId null.');

const fixSpoilage = getMockAnalysisFixture('spoilage');
assert(fixSpoilage.possible_quality_warning === true && fixSpoilage.quality_warning_vi !== null, 'Fixture spoilage kích hoạt cờ cảnh báo an toàn thực phẩm.');

// 5. Kiểm tra Ánh xạ Món ăn và Động cơ Gợi ý (stageDishMap.js & recommendations.js)
console.log('\n5. Kiểm tra Ánh xạ Món ăn và Gợi ý (stageDishMap.js & recommendations.js):');
const allRecipeIds = new Set(MOCK_RECIPES.map((r) => r.id));
assert(allRecipeIds.size === 56, 'Kho dữ liệu gốc chứa đúng 56 công thức món ăn.');

// Xác minh không có recipeId rác
let danglingCount = 0;
let unreviewedViolations = 0;
Object.values(STAGE_DISH_MAPPING).forEach((mapping) => {
  (mapping.dishes || []).forEach((dish) => {
    if (!allRecipeIds.has(dish.recipeId)) {
      danglingCount++;
      console.error(`Lỗi: recipeId ${dish.recipeId} không tồn tại trong MOCK_RECIPES!`);
    }
    if (dish.reviewed !== false) {
      unreviewedViolations++;
    }
  });
});
assert(danglingCount === 0, 'Toàn bộ recipeId trong STAGE_DISH_MAPPING đều tồn tại trong 56 món (0 dangling references).');
assert(unreviewedViolations === 0, '100% món ăn đều giữ nguyên cờ `reviewed: false` (chưa thẩm định chuyên gia).');

// Kiểm tra quy tắc Giai đoạn 1: 0 món đề xuất
const recStage1 = getRecommendedDishes(1);
assert(recStage1.dishes.length === 0, 'Giai đoạn 1 (Chuối non) trả về đúng 0 món ăn.');
assert(typeof recStage1.notice === 'string' && recStage1.notice.length > 0, 'Giai đoạn 1 có thông điệp giải thích nông học.');

// Kiểm tra các giai đoạn 2 đến 6: trả về 1..5 món (không bao giờ vượt quá 5)
[2, 3, 4, 5, 6].forEach((stg) => {
  const rec = getRecommendedDishes(stg);
  assert(rec.dishes.length > 0 && rec.dishes.length <= MAX_RECOMMENDED_DISHES, `Giai đoạn ${stg} trả về ${rec.dishes.length} món (<= 5 món).`);
  rec.dishes.forEach((d) => {
    assert(d.reviewed === false, `Món ${d.id} trong gợi ý bảo toàn reviewed: false.`);
    assert(typeof d.suitabilityReason === 'string', `Món ${d.id} có lý do phù hợp.`);
  });
});

// Kiểm tra giới hạn maxItems
const recLimit2 = getRecommendedDishes(5, { maxItems: 2 });
assert(recLimit2.dishes.length === 2, 'Tùy chọn maxItems = 2 hoạt động chính xác.');

// Kiểm tra khóa khi có cảnh báo mốc/hỏng
const recBlocked = getRecommendedDishes(5, { hasQualityWarning: true });
assert(recBlocked.dishes.length === 0 && recBlocked.isBlockedByQualityWarning === true, 'Cảnh báo hỏng hóc khóa toàn bộ đề xuất món (0 món).');

console.log('\n====================================================');
console.log(`KẾT QUẢ KIỂM THỬ: ${passed} PASS, ${failed} FAIL`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
