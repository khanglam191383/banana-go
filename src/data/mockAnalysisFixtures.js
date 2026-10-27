/**
 * BananaGo Mock Analysis Fixtures (Dữ liệu mẫu phân tích tất định)
 * Sử dụng khi:
 * 1. Demo ngoại tuyến (Offline Mode)
 * 2. Fallback khi Gemini API gặp lỗi (429 Rate Limit, Quota, Network error)
 * 3. Kiểm thử tự động (Unit / Integration Test)
 * 
 * Định dạng tuân thủ chính xác Schema đặc tả trong Section 6.2 của Kế hoạch triển khai.
 */

export const MOCK_FIXTURES = {
  1: {
    success: true,
    stage_id: 'BANANA_1_NON',
    stageId: 1,
    stage_name_vi: 'Giai đoạn 1 – Chuối non',
    confidence_label: 'high',
    visual_evidence: [
      'Quả có kích thước nhỏ, thân thon nhọn, các gờ cạnh còn rất sắc nét.',
      'Vỏ có màu xanh đậm đồng nhất, bề mặt phủ lớp mủ sáp tự nhiên rõ rệt.',
      'Đầu núm hoa chuối khô còn bám chặt ở đỉnh quả, chưa rụng tự nhiên.',
    ],
    explanation_vi: 'Quả chuối ở giai đoạn phát triển sơ khai, kích thước nhỏ và vỏ xanh đậm. Thịt quả chưa tích lũy tinh bột hay đường tự nhiên, chứa nhiều nhựa chát và chưa đạt độ đẫy đà.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: [],
    limitations_vi: [
      'Không khuyến khích thu hoạch chế biến thương phẩm ở giai đoạn này để tránh lãng phí năng suất cây trồng.',
      'Cần tiếp tục chăm sóc trên cây cho đến khi quả phát triển hoàn chỉnh.',
    ],
    source: 'mock_fallback',
  },

  2: {
    success: true,
    stage_id: 'BANANA_2_GREEN',
    stageId: 2,
    stage_name_vi: 'Giai đoạn 2 – Chuối xanh (Đang phát triển & Xanh già)',
    confidence_label: 'high',
    visual_evidence: [
      'Quả có kích thước từ đang phát triển đến hoàn chỉnh, các góc cạnh đầy đặn, chắc nịch.',
      'Vỏ giữ màu xanh lá tự nhiên đồng nhất, không có đốm nâu hay dấu hiệu chín sớm.',
      'Thịt quả chắc nịch, mặt cắt phẳng mịn, không bị nát dập khi bào mỏng.',
    ],
    explanation_vi: 'Chuối xanh đạt độ già sinh lý tối ưu, thớ thịt quả săn chắc và hàm lượng tinh bột kháng (Resistant Starch) cao. Giữ lát cắt cực tốt khi bào mỏng làm chuối sấy giòn BANANA_CHIPS hoặc nấu các món truyền thống.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: ['BANANA_CHIPS'],
    limitations_vi: [
      'Độ giòn thực tế của chuối sấy phụ thuộc vào độ dày lát cắt, nhiệt độ sấy và lượng dầu/độ ẩm cuối cùng.',
      'Không phù hợp làm chuối dẻo cuộn hạt nếu không qua quy trình ủ chín.',
    ],
    source: 'mock_fallback',
  },

  3: {
    success: true,
    stage_id: 'BANANA_3_BEGINNING_RIPE',
    stageId: 3,
    stage_name_vi: 'Giai đoạn 3 – Chuối bắt đầu chín',
    confidence_label: 'high',
    visual_evidence: [
      'Vỏ bắt đầu chuyển màu: xuất hiện các mảng màu vàng tươi xen kẽ màu xanh lục ở phần thân và sống quả.',
      'Đầu cuống và chóp quả vẫn còn sắc xanh nhẹ, báo hiệu quá trình chín tự nhiên mới bắt đầu.',
      'Thịt quả mềm dần nhưng vẫn giữ được độ săn chắc đàn hồi khi nắn nhẹ.',
    ],
    explanation_vi: 'Giai đoạn trọng tâm nghiên cứu của BananaGo. Tinh bột đang chuyển hóa thành đường tự nhiên, quả bắt đầu dậy mùi thơm và có vị ngọt thanh nhưng thịt quả vẫn đủ vững chắc để cắt lát và ngào đường.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: ['SUGAR_COATED_BANANA', 'BANANA_NUT_ROLL'],
    limitations_vi: [
      'Giai đoạn chuyển hóa rất nhanh (1-2 ngày ở nhiệt độ phòng), cần chế biến sớm hoặc kiểm soát nhiệt độ.',
    ],
    source: 'mock_fallback',
  },

  4: {
    success: true,
    stage_id: 'BANANA_4_RIPE',
    stageId: 4,
    stage_name_vi: 'Giai đoạn 4 – Chuối chín',
    confidence_label: 'high',
    visual_evidence: [
      'Vỏ quả chuyển sang màu vàng tươi hoàn toàn hoặc chỉ còn chút xanh rất mờ ở cuống.',
      'Bề mặt vỏ căng mọng, có thể xuất hiện vài đốm nâu li ti rải rác nhưng không đáng kể.',
      'Cấu trúc thịt quả mềm mịn, dẻo và đàn hồi tốt.',
    ],
    explanation_vi: 'Chuối chín thơm ngào ngạt với hàm lượng đường tự nhiên phong phú và độ dẻo đàn hồi lý tưởng. Đây là nguyên liệu vàng cho dòng sản phẩm chuối dẻo cuộn hạt dinh dưỡng.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: ['BANANA_NUT_ROLL', 'SUGAR_COATED_BANANA'],
    limitations_vi: [
      'Thời gian bảo quản ở nhiệt độ phòng ngắn (2-3 ngày). Cần chế biến nhanh hoặc bảo quản lạnh nhẹ.',
      'Kém phù hợp cho sản phẩm sấy giòn lát mỏng.',
    ],
    source: 'mock_fallback',
  },

  5: {
    success: true,
    stage_id: 'BANANA_5_FULLY_RIPE',
    stageId: 5,
    stage_name_vi: 'Giai đoạn 5 – Chuối chín kỹ',
    confidence_label: 'high',
    visual_evidence: [
      'Vỏ quả xuất hiện nhiều đốm nâu trứng cuốc phủ khắp bề mặt hoặc ngả màu nâu mật sẫm.',
      'Thịt quả rất mềm nhũn, hương thơm chuối mật ngào ngạt lan tỏa.',
      'Không giữ được hình dạng lát cắt nguyên vẹn khi thái mỏng.',
    ],
    explanation_vi: 'Chuối chín kỹ ngọt lịm với hàm lượng chất chống oxy hóa cao nhất. Cấu trúc mềm nhuyễn phù hợp xuất sắc cho các món bánh chuối nướng, sinh tố, puree và mứt chuối dẻo.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: [],
    limitations_vi: [
      'Cần loại bỏ ngay các quả có dấu hiệu mốc, thối rữa hoặc chảy dịch hôi chua.',
    ],
    source: 'mock_fallback',
  },

  6: {
    // Alias hỗ trợ tương thích ngược
    success: true,
    stage_id: 'BANANA_5_FULLY_RIPE',
    stageId: 5,
    stage_name_vi: 'Giai đoạn 5 – Chuối chín kỹ',
    confidence_label: 'high',
    visual_evidence: [
      'Vỏ quả xuất hiện nhiều đốm nâu trứng cuốc phủ khắp bề mặt.',
      'Thịt quả rất mềm nhũn, hương thơm chuối mật ngào ngạt lan tỏa.',
    ],
    explanation_vi: 'Chuối chín kỹ ngọt lịm, cấu trúc mềm nhuyễn phù hợp xuất sắc cho các món bánh chuối nướng, sinh tố và mứt chuối.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: [],
    limitations_vi: [],
    source: 'mock_fallback',
  },

  uncertain: {
    success: true,
    stage_id: 'UNCERTAIN',
    stageId: null,
    stage_name_vi: 'Chưa đủ bằng chứng xác định độ chín',
    confidence_label: 'low',
    visual_evidence: [
      'Hình ảnh bị rung mờ, thiếu sáng hoặc ánh sáng ngược gây chói lóa bề mặt vỏ chuối.',
      'Màu sắc thực của vỏ chuối bị sai lệch do cân bằng trắng máy ảnh hoặc bộ lọc màu.',
    ],
    explanation_vi: 'Hệ thống phát hiện có quả chuối trong ảnh nhưng không thể phân loại chính xác giai đoạn do chất lượng hình ảnh không đảm bảo. Vui lòng chụp lại ở nơi đủ sáng và lấy nét rõ nét vỏ quả.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: [],
    limitations_vi: [
      'Khuyến nghị chụp lại ảnh đơn quả chuối ở cự ly 30-50cm dưới ánh sáng tự nhiên.',
    ],
    source: 'mock_fallback',
  },

  not_banana: {
    success: true,
    stage_id: 'NOT_BANANA',
    stageId: null,
    stage_name_vi: 'Không nhận diện được quả chuối',
    confidence_label: 'high',
    visual_evidence: [
      'Không phát hiện hình thái quả chuối, đường gờ cuống hay màu sắc đặc trưng của chuối trong khung hình.',
    ],
    explanation_vi: 'Hình ảnh được tải lên dường như không chứa quả chuối hoặc góc chụp không nhận diện được vật thể nông sản. Vui lòng chọn ảnh chụp quả chuối để BananaGo hỗ trợ phân tích.',
    multiple_bananas: false,
    possible_quality_warning: false,
    quality_warning_vi: null,
    recommended_products: [],
    limitations_vi: [
      'Hệ thống AI chỉ chuyên biệt hóa cho việc phân tích và nhận diện quả chuối.',
    ],
    source: 'mock_fallback',
  },

  spoilage: {
    success: true,
    stage_id: 'BANANA_6_FULLY_RIPE',
    stageId: 6,
    stage_name_vi: 'Giai đoạn 6 – Chuối chín kỹ (Cảnh báo chất lượng)',
    confidence_label: 'medium',
    visual_evidence: [
      'Vỏ chuối thâm đen diện rộng, cấu trúc vỏ bị rách nứt.',
      'Xuất hiện đốm mốc trắng/xanh hoặc dấu hiệu rỉ dịch ướt bất thường ở phần cuống và thân.',
    ],
    explanation_vi: 'Quả chuối ở giai đoạn chín kỹ nhưng có dấu hiệu suy thoái chất lượng hoặc nghi ngờ nấm mốc. Vì lý do an toàn vệ sinh thực phẩm, không khuyến nghị sử dụng quả có dấu hiệu này để chế biến món ăn.',
    multiple_bananas: false,
    possible_quality_warning: true,
    quality_warning_vi: 'CẢNH BÁO AN TOÀN THỰC PHẨM: Phát hiện dấu hiệu nấm mốc hoặc thối rữa trên bề mặt quả. Vui lòng kiểm tra kỹ và loại bỏ quả hỏng.',
    recommended_products: [],
    limitations_vi: [
      'Ảnh chụp chỉ đưa ra cảnh báo cảm quan sơ bộ, không thể thay thế xét nghiệm vi sinh thực tế.',
      'Tuyệt đối không dùng nông sản đã chảy nước hôi hoặc có tơ nấm mốc.',
    ],
    source: 'mock_fallback',
  },
};

/**
 * Lấy fixture tất định theo stageId (1..6) hoặc khóa đặc biệt ('uncertain', 'not_banana', 'spoilage')
 * @param {number|string} key 
 * @returns {object}
 */
export function getMockAnalysisFixture(key = 3) {
  if (MOCK_FIXTURES[key]) {
    return { ...MOCK_FIXTURES[key] };
  }
  const numericKey = Number(key);
  if (MOCK_FIXTURES[numericKey]) {
    return { ...MOCK_FIXTURES[numericKey] };
  }
  return { ...MOCK_FIXTURES[3] }; // Mặc định trả về Giai đoạn 3 (Chuối xanh già)
}
