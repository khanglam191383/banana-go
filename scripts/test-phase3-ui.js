/**
 * BananaGo — Phase 3 UI, Results & Recipe Mapping Verification Script
 * Chạy độc lập bằng Node.js: node scripts/test-phase3-ui.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
console.log('BANANAGO PHASE 3 UI & RECIPE MAPPING TEST SUITE');
console.log('====================================================\n');

// 1. Kiểm tra RecipesPage.jsx
console.log('1. Kiểm tra tích hợp Modal qua Query Param (RecipesPage.jsx):');
const recipesPagePath = path.resolve(__dirname, '../src/pages/RecipesPage.jsx');
const recipesPageContent = fs.readFileSync(recipesPagePath, 'utf-8');

assert(recipesPageContent.includes("useSearchParams"), 'RecipesPage import useSearchParams từ react-router-dom.');
assert(recipesPageContent.includes("searchParams.get('recipe')"), 'RecipesPage đọc tham số ?recipe từ URL.');
assert(recipesPageContent.includes("handleCloseModal"), 'RecipesPage có hàm handleCloseModal để dọn query param khi đóng.');
assert(recipesPageContent.includes("nextParams.delete('recipe')"), 'handleCloseModal xóa đúng tham số recipe khỏi URL khi người dùng đóng modal.');

// 2. Kiểm tra AiBananaPage.jsx
console.log('\n2. Kiểm tra giao diện kết quả và điều phối UI (AiBananaPage.jsx):');
const aiPagePath = path.resolve(__dirname, '../src/pages/AiBananaPage.jsx');
const aiPageContent = fs.readFileSync(aiPagePath, 'utf-8');

assert(aiPageContent.includes("validateImageFile"), 'AiBananaPage sử dụng validateImageFile kiểm tra định dạng và dung lượng.');
assert(aiPageContent.includes("analyzeBananaImage"), 'AiBananaPage kết nối với analyzeService.');
assert(aiPageContent.includes("setDemoMode"), 'AiBananaPage có công tắc chuyển đổi Chế độ Demo / AI Live.');
assert(aiPageContent.includes("analysisResult.source === 'gemini'"), 'AiBananaPage hiển thị rõ nguồn gốc kết quả (Gemini vs Mock Fallback).');
assert(aiPageContent.includes("analysisResult.confidenceLabel"), 'AiBananaPage hiển thị nhãn tin cậy định tính (Cao / Trung bình / Thấp).');
assert(aiPageContent.includes("spoilage_detected"), 'AiBananaPage có banner màu đỏ cảnh báo nấm mốc hoặc thối rữa an toàn thực phẩm.');
assert(aiPageContent.includes("qualityIssues"), 'AiBananaPage có cảnh báo chất lượng ảnh (ảnh mờ, nhiều quả, không phải chuối).');
assert(aiPageContent.includes("BANANA_CHIPS"), 'AiBananaPage hiển thị sản phẩm trọng tâm BananaGo: Chuối sấy giòn (Chips).');
assert(aiPageContent.includes("SUGAR_COATED_BANANA"), 'AiBananaPage hiển thị sản phẩm trọng tâm BananaGo: Chuối chiên ngào đường.');
assert(aiPageContent.includes("BANANA_NUT_ROLL"), 'AiBananaPage hiển thị sản phẩm trọng tâm BananaGo: Chuối dẻo cuộn hạt.');
assert(aiPageContent.includes("analysisResult.stageId === 1"), 'AiBananaPage xử lý riêng thông báo nông học cho Giai đoạn 1 (Chuối non).');
assert(aiPageContent.includes("`/recipes?recipe=${dish.id}`"), 'Card món ăn liên kết chính xác tới /recipes?recipe=<id>.');

console.log('\n====================================================');
console.log(`KẾT QUẢ KIỂM THỬ: ${passed} PASS, ${failed} FAIL`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
