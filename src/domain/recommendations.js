/**
 * BananaGo Dish Recommendation Engine (Domain Logic)
 * Điều phối logic lựa chọn và lọc công thức món ăn theo giai đoạn chuối.
 * 
 * QUY TẮC NGHIỆP VỤ:
 * 1. Giới hạn trả về tối đa 5 món ăn (từ 0 đến 5 món).
 * 2. Giai đoạn 1 (Chuối non): Luôn trả về 0 món kèm giải thích nông học.
 * 3. Nếu có cảnh báo hỏng hóc/mốc (spoilage_detected): Khóa toàn bộ đề xuất (0 món) vì an toàn thực phẩm.
 * 4. Mọi món ăn đề xuất đều bảo toàn cờ `reviewed: false`.
 */

import { MOCK_RECIPES } from '../data/mockData.js';
import { getStageDishMapping } from '../data/stageDishMap.js';

export const MAX_RECOMMENDED_DISHES = 5;

/**
 * Tra cứu công thức chi tiết từ kho 56 món ăn
 * @param {string} recipeId 
 * @returns {object|null}
 */
export function getRecipeById(recipeId) {
  if (!recipeId) return null;
  return MOCK_RECIPES.find((r) => r.id === recipeId) || null;
}

/**
 * Lấy danh sách món ăn gợi ý theo giai đoạn chuối
 * @param {number|string} stageId - Giai đoạn chuối từ 1 đến 6
 * @param {object} [options]
 * @param {number} [options.maxItems=5] - Giới hạn số lượng món (tối đa 5)
 * @param {string} [options.category] - Lọc theo nhóm món ('vegetarian', 'savory', 'sweet', 'all')
 * @param {boolean} [options.hasQualityWarning=false] - Cờ cảnh báo chuối mốc hoặc hỏng
 * @returns {{
 *   dishes: Array<object>,
 *   count: number,
 *   stageId: number,
 *   notice: string|null,
 *   isBlockedByQualityWarning: boolean
 * }}
 */
export function getRecommendedDishes(stageId, options = {}) {
  const numericStageId = Number(stageId);
  const maxItems = Math.min(
    Math.max(Number(options.maxItems) || MAX_RECOMMENDED_DISHES, 0),
    MAX_RECOMMENDED_DISHES
  );
  const categoryFilter = options.category || 'all';
  const hasQualityWarning = Boolean(options.hasQualityWarning);

  // Trường hợp 1: Có cảnh báo nấm mốc hoặc thối rữa -> Khóa 0 món
  if (hasQualityWarning) {
    return {
      dishes: [],
      count: 0,
      stageId: numericStageId,
      notice: 'Hệ thống phát hiện dấu hiệu bất thường về chất lượng hoặc nghi ngờ nấm mốc. Vì an toàn thực phẩm, BananaGo không gợi ý chế biến cho quả có dấu hiệu này.',
      isBlockedByQualityWarning: true,
    };
  }

  // Trường hợp 2: Giai đoạn 1 (Chuối non) -> 0 món thương phẩm
  if (numericStageId === 1) {
    const stage1Mapping = getStageDishMapping(1);
    return {
      dishes: [],
      count: 0,
      stageId: 1,
      notice: stage1Mapping.traditionalNotice,
      isBlockedByQualityWarning: false,
    };
  }

  // Trường hợp 3: Tra cứu bảng ánh xạ cho các giai đoạn 2 đến 6
  const mapping = getStageDishMapping(numericStageId);
  const candidateDishes = mapping.dishes || [];

  // Ghép dữ liệu chi tiết từ MOCK_RECIPES
  const enrichedDishes = [];
  for (const item of candidateDishes) {
    const fullRecipe = getRecipeById(item.recipeId);
    if (!fullRecipe) continue;

    // Lọc theo nhóm danh mục nếu có yêu cầu
    if (categoryFilter !== 'all' && fullRecipe.category !== categoryFilter) {
      continue;
    }

    enrichedDishes.push({
      ...fullRecipe,
      suitabilityReason: item.suitabilityReason,
      reviewed: false, // Bắt buộc: luôn giữ trạng thái chưa thẩm định chuyên gia
    });
  }

  // Giới hạn số lượng không vượt quá maxItems (mặc định tối đa 5 món)
  const finalDishes = enrichedDishes.slice(0, maxItems);

  return {
    dishes: finalDishes,
    count: finalDishes.length,
    stageId: numericStageId,
    notice: mapping.traditionalNotice || null,
    isBlockedByQualityWarning: false,
  };
}
