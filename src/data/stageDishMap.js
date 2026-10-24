/**
 * BananaGo Stage-to-Dish Mapping Table (Bảng ánh xạ 6 giai đoạn trái chuối -> Món ăn)
 * 
 * QUY TẮC BẮT BUỘC (AUTHORITATIVE RULES):
 * 1. Tái sử dụng danh mục 56 món ăn trong MOCK_RECIPES.
 * 2. Mọi liên kết đều phải gắn cờ `reviewed: false` (chưa thẩm định chuyên gia ẩm thực/nông học độc lập).
 * 3. Không tự tạo các tuyên bố dinh dưỡng hoặc an toàn thực phẩm chưa được kiểm chứng.
 * 4. Giai đoạn 1 (Chuối non): Trả về mảng rỗng `[]` kèm khuyến nghị nông học bảo vệ buồng chuối trên cây.
 */

export const STAGE_DISH_MAPPING = {
  // Giai đoạn 1 – Chuối non: 0 món thương mại (khuyến nghị giữ trên cây)
  1: {
    stageId: 1,
    stageCode: 'BANANA_1_NON',
    stageName: 'Giai đoạn 1 – Chuối non',
    commercialRecipes: [],
    traditionalNotice: 'Quả chuối non chứa nhiều nhựa chát và chưa tích lũy tinh bột/thịt quả. BananaGo khuyến nghị tiếp tục chăm sóc quả trên cây để đạt hiệu quả kinh tế và chất lượng nông sản cao nhất.',
    dishes: [],
  },

  // Giai đoạn 2 – Chuối đang phát triển: Món nấu chín ở nhiệt độ cao (om, kho, canh)
  2: {
    stageId: 2,
    stageCode: 'BANANA_2_DEVELOPING',
    stageName: 'Giai đoạn 2 – Chuối đang phát triển',
    commercialRecipes: [],
    traditionalNotice: 'Thịt quả săn chắc, giàu tinh bột thô và vị chát nhẹ, thích hợp nhất cho các món truyền thống nấu chín nhừ.',
    dishes: [
      {
        recipeId: 'recipe-19',
        suitabilityReason: 'Chuối đang phát triển khi om với ốc bươu và đậu phụ sẽ hút trọn nước dùng đậm đà, miếng chuối bở bùi mà không bị nát.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-20',
        suitabilityReason: 'Vị bùi chát nhẹ của chuối kết hợp với vị ngọt của cá lóc đồng và nghệ vàng tạo nên hương vị om truyền thống cân bằng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-22',
        suitabilityReason: 'Chuối còn độ giòn cứng vừa phải, om cùng lươn đồng cay nồng giúp giảm ngấy và tạo độ sánh tự nhiên cho nước om.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-02',
        suitabilityReason: 'Món kho chay thanh đạm, miếng chuối thấm đượm gia vị tiêu và nấm rơm, bùi thơm chắc thịt.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-21',
        suitabilityReason: 'Vị béo ngậy của thịt ba chỉ hòa quyện vào cấu trúc tinh bột thô của chuối xanh đang lớn, đượm vị cơm nhà.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-23',
        suitabilityReason: 'Nấu cùng sườn non và lá lốt, miếng chuối chín mềm bở tơi, tạo vị ngọt bùi thanh mát cho canh.',
        reviewed: false,
      },
    ],
  },

  // Giai đoạn 3 – Chuối xanh già: Chuối sấy giòn, chips chiên, xào, giữ lát cắt tốt
  3: {
    stageId: 3,
    stageCode: 'BANANA_3_MATURE_GREEN',
    stageName: 'Giai đoạn 3 – Chuối xanh già',
    commercialRecipes: ['BANANA_CHIPS'],
    traditionalNotice: 'Hàm lượng tinh bột kháng đạt đỉnh, thớ thịt quả chắc nịch giữ nguyên hình dạng lát bào mỏng, lý tưởng cho sản phẩm sấy giòn.',
    dishes: [
      {
        recipeId: 'recipe-47',
        suitabilityReason: 'Sản phẩm chủ lực BANANA_CHIPS: Chuối xanh già thái lát mỏng sấy giòn tan, vị mộc tự nhiên giàu tinh bột kháng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-05',
        suitabilityReason: 'Lát chuối xanh già chiên ngập dầu giòn rụm, lắc phô mai béo mặn là món quà vặt hấp dẫn cho giới trẻ.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-42',
        suitabilityReason: 'Chuối già đập dẹp nướng than hoa rưới mỡ hành, ngoài giòn trong dẻo bùi đặc sản miền Tây.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-24',
        suitabilityReason: 'Chuối xanh già thái con chì xào cùng thịt bò thăn và lá lốt, giữ độ giòn sần sật không bị nát vỡ.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-13',
        suitabilityReason: 'Món xào chay sả ớt đậm vị, từng lát chuối xanh già giữ nguyên hình dáng đẹp mắt và vị bùi béo.',
        reviewed: false,
      },
    ],
  },

  // Giai đoạn 4 – Chuối bắt đầu chín: Chuối chiên ngào đường, chuối nướng, ép dẻo
  4: {
    stageId: 4,
    stageCode: 'BANANA_4_BEGINNING_RIPE',
    stageName: 'Giai đoạn 4 – Chuối bắt đầu chín',
    commercialRecipes: ['SUGAR_COATED_BANANA', 'BANANA_NUT_ROLL'],
    traditionalNotice: 'Thịt quả bắt đầu mềm và có vị ngọt thanh nhưng cấu trúc vẫn đủ săn chắc để chiên ngào đường mà không bị gãy lát.',
    dishes: [
      {
        recipeId: 'recipe-16',
        suitabilityReason: 'Sản phẩm chủ lực SUGAR_COATED_BANANA: Lát chuối bắt đầu chín chiên giòn áo đường thốt nốt và mè rang óng ả.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-45',
        suitabilityReason: 'Chuối ngào đường gừng đỏ dẻo thơm, vị cay ấm của gừng cân bằng hoàn hảo với vị ngọt thanh vừa chớm nở.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-11',
        suitabilityReason: 'Nướng mỡ hành thơm nức, vị ngọt nhẹ của chuối vừa ngả vàng hòa quyện với mỡ hành mặn mòi.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-17',
        suitabilityReason: 'Chuối nướng bơ mật ong bằng nồi chiên không dầu, vỏ ngoài xém cạnh thơm lừng, thịt chuối dẻo ngọt.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-46',
        suitabilityReason: 'Chuối ép dẻo sấy mật ong, độ dẻo đàn hồi tốt của giai đoạn bắt đầu chín giúp miếng chuối không bị chảy nhão.',
        reviewed: false,
      },
    ],
  },

  // Giai đoạn 5 – Chuối chín: Chuối dẻo cuộn hạt, chè chuối, kem chuối, chuối nếp nướng
  5: {
    stageId: 5,
    stageCode: 'BANANA_5_RIPE',
    stageName: 'Giai đoạn 5 – Chuối chín',
    commercialRecipes: ['BANANA_NUT_ROLL', 'SUGAR_COATED_BANANA'],
    traditionalNotice: 'Thịt quả chín vàng dẻo mềm, ngọt đượm và thơm nồng đặc trưng, dễ cán mỏng định hình hoặc nấu chè kem.',
    dishes: [
      {
        recipeId: 'recipe-52',
        suitabilityReason: 'Ứng viên ưu tiên BANANA_NUT_ROLL: Chuối chín dẻo ngọt dễ cuộn định hình cùng phô mai hoặc các loại hạt giòn béo.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-01',
        suitabilityReason: 'Chuối chiên giòn Sài Gòn kinh điển: Vỏ bột phồng xốp giòn rụm bọc lấy miếng chuối chín ngọt lịm tan chảy.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-39',
        suitabilityReason: 'Chuối nếp nướng Bến Tre: Trái chuối chín thơm ngọt được bọc lớp nếp than dẻo thơm nướng giòn vỏ chan cốt dừa béo ngậy.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-18',
        suitabilityReason: 'Chè chuối chưng bột báng nước cốt dừa Nam Bộ, miếng chuối chín mềm ngọt ngào sóng sánh cốt dừa béo ngậy.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-07',
        suitabilityReason: 'Bánh chuối hấp lá dứa nước cốt dừa, thớ bánh dẻo quánh thơm nức mùi chuối chín tự nhiên.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-40',
        suitabilityReason: 'Kem chuối ép đậu phộng nước cốt dừa tuổi thơ, giải nhiệt ngày hè với vị ngọt tự nhiên không cần nhiều đường cát.',
        reviewed: false,
      },
    ],
  },

  // Giai đoạn 6 – Chuối chín kỹ: Bánh chuối nướng, sinh tố, mứt chuối, puree
  6: {
    stageId: 6,
    stageCode: 'BANANA_6_FULLY_RIPE',
    stageName: 'Giai đoạn 6 – Chuối chín kỹ',
    commercialRecipes: [],
    traditionalNotice: 'Đốm nâu trứng cuốc phủ vỏ, lượng đường tự nhiên tối đa, cấu trúc mềm nhuyễn xuất sắc cho các món xay nghiền và nướng bánh.',
    dishes: [
      {
        recipeId: 'recipe-41',
        suitabilityReason: 'Bánh chuối nướng bơ sữa bánh mì kiểu Nam Bộ: Chuối chín kỹ tạo màu đỏ cánh gián tự nhiên và vị ngọt sâu mà không cần phẩm màu.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-08',
        suitabilityReason: 'Bánh chuối yến mạch eat-clean: Chuối chín kỹ dầm nhuyễn thay thế hoàn toàn đường tinh luyện và chất béo nhân tạo.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-48',
        suitabilityReason: 'Bánh pancake chuối bữa sáng thơm mềm, vị ngọt đậm từ chuối chín mật giúp bánh xốp nhẹ tự nhiên.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-50',
        suitabilityReason: 'Bánh muffin chuối chocolate chip, cốt bánh ẩm mọng và thơm nồng hương chuối trứng cuốc.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-49',
        suitabilityReason: 'Sinh tố chuối bơ hạt chia giàu năng lượng, chuối chín kỹ hòa quyện nhuyễn mịn cùng bơ tươi.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-44',
        suitabilityReason: 'Mứt chuối phồng gừng đậu phộng, tận dụng vị ngọt mật đậm đặc của chuối chín muồi dẻo quánh.',
        reviewed: false,
      },
    ],
  },
};

/**
 * Lấy danh sách ánh xạ món ăn theo giai đoạn (1 đến 6)
 * @param {number|string} stageId 
 * @returns {object}
 */
export function getStageDishMapping(stageId) {
  const numericId = Number(stageId);
  return STAGE_DISH_MAPPING[numericId] || {
    stageId: numericId,
    dishes: [],
    traditionalNotice: 'Không tìm thấy dữ liệu ánh xạ cho giai đoạn này.',
  };
}
