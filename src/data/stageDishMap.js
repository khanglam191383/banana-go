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
    // Giai đoạn 1 – Chuối non: 3 món dân gian tận dụng (luộc, kho mặn, ngâm chua ngọt)
  1: {
    stageId: 1,
    stageCode: 'BANANA_1_NON',
    stageName: 'Giai đoạn 1 – Chuối non',
    commercialRecipes: [],
    traditionalNotice: 'Quả chuối non tốt nhất nên tiếp tục chăm sóc trên cây để đạt năng suất kinh tế tối ưu. Tuy nhiên, nếu bạn tỉa bớt quả non khi tạo dáng buồng, dưới đây là 3 món ăn dân dã tận dụng tuyệt hảo!',
    dishes: [
      {
        recipeId: 'recipe-stage1-01',
        suitabilityReason: 'Chuối non luộc chín mềm, vị bùi béo tự nhiên chấm muối ớt chanh hoặc mắm ruốc miền Tây.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-stage1-02',
        suitabilityReason: 'Kho cùng thịt ba chỉ béo ngậy, từng khoanh chuối non ngấm đượm gia vị, dẻo bùi đậm đà hao cơm.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-stage1-03',
        suitabilityReason: 'Chuối non ngâm giấm ớt tỏi lên men giòn sần sật, vị chua cay mặn ngọt thanh mát ăn kèm thịt luộc.',
        reviewed: false,
      },
    ],
  },

    // Giai đoạn 2 – Chuối xanh: Chips chuối sấy giòn (BANANA_CHIPS), bột chuối và các món nấu truyền thống (om, kho, canh)
  2: {
    stageId: 2,
    stageCode: 'BANANA_2_GREEN',
    stageName: 'Giai đoạn 2 – Chuối xanh (Đang phát triển & Xanh già)',
    commercialRecipes: ['BANANA_CHIPS'],
    traditionalNotice: 'Thịt quả chắc nịch, giàu tinh bột kháng và giữ lát cắt rất tốt khi sơ chế; lý tưởng cho chuối sấy giòn BANANA_CHIPS cũng như các món om, kho, luộc truyền thống.',
    dishes: [
      {
        recipeId: 'recipe-47',
        suitabilityReason: 'Sản phẩm chủ lực BANANA_CHIPS: Chuối xanh già thái lát mỏng sấy giòn tan, vị mộc tự nhiên giàu tinh bột kháng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-stage2-bot-chuoi',
        suitabilityReason: 'Siêu thực phẩm Bột chuối xanh giàu tinh bột kháng Type 2, hỗ trợ đường ruột khỏe mạnh và dùng pha chế sinh tố.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-19',
        suitabilityReason: 'Chuối xanh già om cùng thịt ba chỉ và đậu hũ vàng nghệ, miếng chuối bở bùi ngấm trọn nước dùng lá lốt thơm lừng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-02',
        suitabilityReason: 'Kho cùng gia vị tiêu ớt đậm đà, từng khoanh chuối xanh bùi dẻo ngấm sốt kho quẹt đưa cơm ngày mưa.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-23',
        suitabilityReason: 'Nấu cùng sườn non và thịt băm ngọt lịm, miếng chuối chín mềm bở tơi tạo vị ngọt thanh mát cho canh.',
        reviewed: false,
      },
    ],
  },

    // Giai đoạn 3 – Chuối bắt đầu chín: Chuối chiên ngào đường, chuối nướng, chuối chiên giòn, chuối sấy dẻo
  3: {
    stageId: 3,
    stageCode: 'BANANA_3_BEGINNING_RIPE',
    stageName: 'Giai đoạn 3 – Chuối bắt đầu chín (Ương / Vàng cuống xanh)',
    commercialRecipes: ['SUGAR_COATED_BANANA', 'BANANA_NUT_ROLL'],
    traditionalNotice: 'Thịt quả bắt đầu mềm và có vị ngọt thanh nhưng cấu trúc vẫn đủ săn chắc để chiên ngào đường mà không bị gãy lát.',
    dishes: [
      {
        recipeId: 'recipe-16',
        suitabilityReason: 'Sản phẩm chủ lực SUGAR_COATED_BANANA: Lát chuối ương chiên giòn áo đường thốt nốt óng ả, cấu trúc săn chắc không ngậm dầu.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-01',
        suitabilityReason: 'Chuối ương chiên phồng xốp giòn rụm bên ngoài, ruột chuối chín dẻo bùi ngọt thanh điểm xuyết mè đen thơm lừng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-11',
        suitabilityReason: 'Chuối nướng than hoa vàng xém cạnh rưới mỡ hành thơm nức, vị ngọt nhẹ hòa quyện béo ngậy đặc sản Nam Bộ.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-46',
        suitabilityReason: 'Chuối vừa ngả vàng sấy dẻo tươm mật tự nhiên, độ dẻo dai đàn hồi hoàn hảo không bị chảy nhão.',
        reviewed: false,
      },
    ],
  },

    // Giai đoạn 4 – Chuối chín: Chuối sấy dẻo rắc hạt, kem chuối bịch, chè chuối bột báng, bánh chuối hấp
  4: {
    stageId: 4,
    stageCode: 'BANANA_4_RIPE',
    stageName: 'Giai đoạn 4 – Chuối chín (Chín vàng hoàn hảo)',
    commercialRecipes: ['BANANA_NUT_ROLL', 'SUGAR_COATED_BANANA'],
    traditionalNotice: 'Thịt quả chín vàng dẻo mềm, ngọt đượm và thơm nồng đặc trưng, hoàn hảo cho món chuối dẻo rắc hạt, chè kem béo ngậy và bánh truyền thống.',
    dishes: [
      {
        recipeId: 'recipe-52',
        suitabilityReason: 'Sản phẩm chủ lực BANANA_NUT_ROLL: Chuối chín dẻo ngọt ép mỏng sấy tươm mật, phủ đẫm hạt điều, hạt bí, hạnh nhân lát và mè rang thơm bùi bổ dưỡng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-40',
        suitabilityReason: 'Kem chuối bịch nước cốt dừa đậu phộng tuổi thơ mát lạnh, vị ngọt thơm tự nhiên từ chuối chín quyện nước cốt dừa béo mịn.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-18',
        suitabilityReason: 'Chè chuối chưng bột báng nước cốt dừa Nam Bộ, từng khoanh chuối chín vàng ngọt đượm sóng sánh cốt dừa béo thơm.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-07',
        suitabilityReason: 'Bánh chuối hấp nước cốt dừa dẻo quánh, từng lát chuối vàng óng cắt hình quả trám rắc đậu phộng và mè rang thơm bùi.',
        reviewed: false,
      },
    ],
  },

    // Giai đoạn 5 – Chuối chín kỹ: Kẹo chuối tươi, bánh chuối nướng, chuối nghiền puree, sốt chuối topping
  5: {
    stageId: 5,
    stageCode: 'BANANA_5_FULLY_RIPE',
    stageName: 'Giai đoạn 5 – Chuối chín kỹ (Đốm nâu trứng cuốc)',
    commercialRecipes: [],
    traditionalNotice: 'Đốm nâu trứng cuốc phủ vỏ, lượng đường tự nhiên đạt cực đại, cấu trúc mềm nhuyễn xuất sắc cho các món kẹo sên, bánh nướng, nghiền puree và làm sốt.',
    dishes: [
      {
        recipeId: 'recipe-44',
        suitabilityReason: 'Kẹo chuối tươi ngào gừng đậu phộng mè rang: Tận dụng độ ngọt mật đậm đặc của chuối chín kỹ để sên kẹo dẻo quánh lên màu hổ phách tự nhiên.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-41',
        suitabilityReason: 'Bánh chuối nướng bơ sữa rượu Rum kiểu Nam Bộ: Chuối chín kỹ nhiều mật khi nướng tạo sắc đỏ cánh gián quyến rũ và hương thơm nồng nàn.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-49',
        suitabilityReason: 'Chuối chín nghiền mịn (Banana Puree): Tinh bột đã chuyển hóa hoàn toàn thành đường tự nhiên dễ tiêu hóa, mềm mịn lý tưởng cho ăn dặm và thực dưỡng.',
        reviewed: false,
      },
      {
        recipeId: 'recipe-50',
        suitabilityReason: 'Sốt chuối chín sánh mịn (Banana Topping & Syrup): Giải pháp tuyệt vời bảo quản chuối chín kỹ làm sốt phủ bánh ngọt, kem, sữa chua và pha chế.',
        reviewed: false,
      },
    ],
  },
};

/**
 * Lấy danh sách ánh xạ món ăn theo giai đoạn (1 đến 5)
 * @param {number|string} stageId 
 * @returns {object}
 */
export function getStageDishMapping(stageId) {
  const numericId = Number(stageId);
  return STAGE_DISH_MAPPING[numericId] || (numericId === 6 ? STAGE_DISH_MAPPING[5] : {
    stageId: numericId,
    dishes: [],
    traditionalNotice: 'Không tìm thấy dữ liệu ánh xạ cho giai đoạn này.',
  });
}
