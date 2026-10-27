/**
 * BananaGo Domain Model — 6 Giai đoạn phát triển và độ già/chín của TRÁI CHUỐI
 * Nguồn chuẩn xác lập duy nhất (Single Source of Truth): docs/BANANAGO.md
 * 
 * Tuyệt đối không nhầm lẫn giữa vòng đời cây chuối thực vật với 6 giai đoạn của quả chuối.
 */

export const CORE_PRODUCTS = {
  BANANA_CHIPS: {
    id: 'BANANA_CHIPS',
    name: 'Chuối sấy giòn',
    targetStageId: 2,
    description: 'Sản phẩm từ chuối xanh đạt độ tinh bột cao, giữ lát cắt mỏng đều khi làm giòn.',
  },
  SUGAR_COATED_BANANA: {
    id: 'SUGAR_COATED_BANANA',
    name: 'Chuối chiên ngào đường',
    targetStageId: 3,
    description: 'Sản phẩm từ chuối bắt đầu chín, thịt quả còn săn chắc nhưng đã tích lũy hương thơm và vị ngọt thanh.',
  },
  BANANA_NUT_ROLL: {
    id: 'BANANA_NUT_ROLL',
    name: 'Chuối dẻo cuộn hạt',
    targetStageId: 4,
    description: 'Sản phẩm từ chuối chín dẻo mềm, vị ngọt đậm đà, dễ cán mỏng và cuộn cùng các loại hạt dinh dưỡng.',
  },
};

export const STATUS_CODES = {
  NOT_BANANA: 'NOT_BANANA',
  UNCERTAIN: 'UNCERTAIN',
};

export const BANANA_STAGES = [
  {
    id: 1,
    code: 'BANANA_1_NON',
    name: 'Chuối non',
    fullName: 'Giai đoạn 1 – Chuối non',
    ripenessPercent: 10,
    color: '#15803D',
    bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Quả vừa hình thành hoặc ở giai đoạn sớm, kích thước nhỏ, vỏ xanh đậm, cấu trúc cứng, nhiều nhựa, thịt quả chưa phát triển đầy đủ, vị rất chát.',
    texture: 'Thịt quả rất cứng, cấu trúc mô đặc, nhiều mủ nhựa dính.',
    taste: 'Vị chát đậm đặc trưng, không có vị ngọt.',
    starchSugarProfile: 'Chủ yếu là nhựa và mô tế bào sơ khai, chưa tích lũy tinh bột dự trữ, hàm lượng đường tự nhiên rất thấp.',
    culinaryUsage: 'Không khuyến khích thu hoạch chế biến thương phẩm (0 món thương mại đề xuất). Nếu sử dụng trong ẩm thực truyền thống địa phương thì chỉ dùng luộc kỹ hoặc ngâm mặn có điều kiện.',
    farmerAdvice: 'Tiếp tục giữ buồng chuối trên cây để phát triển tự nhiên. Tránh thu hoạch non gây lãng phí năng suất cây trồng.',
    recommendedProducts: [],
    commercialProcessingRecommended: false,
  },
  {
    id: 2,
    code: 'BANANA_2_GREEN',
    name: 'Chuối xanh',
    fullName: 'Giai đoạn 2 – Chuối xanh (Đang phát triển & Xanh già)',
    ripenessPercent: 40,
    color: '#16A34A',
    bgBadge: 'bg-green-100 text-green-800 border-green-300',
    description: 'Vỏ quả thuần màu xanh lá, từ giai đoạn quả đang lớn đến khi đạt kích thước già hoàn chỉnh. Thịt quả chắc nịch, mặt cắt phẳng mịn, giàu tinh bột (bao gồm tinh bột kháng), vị bùi chát nhẹ, giữ hình dạng lát cắt rất tốt khi sơ chế.',
    texture: 'Thịt quả chắc nịch, giòn cứng, mặt cắt phẳng mịn, không bị nát dập khi bào mỏng.',
    taste: 'Vị bùi béo, chát thoảng qua khi nấu chín, thanh đạm, chưa có vị ngọt rõ.',
    starchSugarProfile: 'Hàm lượng tinh bột đạt đỉnh (đặc biệt là tinh bột kháng Resistant Starch), lượng đường tự nhiên rất thấp, chỉ số GI thấp.',
    culinaryUsage: 'Nguyên liệu vàng cho các sản phẩm giòn: Chuối sấy giòn BananaGo (BANANA_CHIPS), snack chuối lát chiên giòn, bột chuối xanh sấy lạnh, nộm/gỏi chuối xanh và các món nấu truyền thống (luộc, hấp, nấu canh, kho cá, ốc om chuối đậu).',
    farmerAdvice: 'Thời điểm vàng để thu hoạch cho kênh thương mại vận chuyển xa hoặc chế biến chuối sấy giòn. Nếu gặp rủi ro thời tiết thu hoạch sớm có thể chuyển sang chế biến món nấu.',
    recommendedProducts: ['BANANA_CHIPS'],
    commercialProcessingRecommended: true,
  },
  {
    id: 3,
    code: 'BANANA_3_BEGINNING_RIPE',
    name: 'Chuối bắt đầu chín',
    fullName: 'Giai đoạn 3 – Chuối bắt đầu chín',
    ripenessPercent: 65,
    color: '#EAB308',
    bgBadge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Vỏ bắt đầu chuyển từ xanh sang vàng (hoặc vàng một phần); thịt quả mềm dần nhưng vẫn giữ cấu trúc; bắt đầu xuất hiện vị ngọt và hương thơm nhẹ.',
    texture: 'Cấu trúc dẻo dai vừa phải, dễ định hình, vẫn chịu được lực ép và thái lát.',
    taste: 'Ngọt thanh dịu dàng, hương thơm thoang thoảng, giảm vị chát đáng kể.',
    starchSugarProfile: 'Giai đoạn thủy phân tinh bột thành đường diễn ra mạnh mẽ; cân bằng hài hòa giữa tinh bột dẻo và đường sucrose/glucose.',
    culinaryUsage: 'Giai đoạn trọng tâm nghiên cứu của BananaGo: Chuối chiên ngào đường (SUGAR_COATED_BANANA), chuối nướng mỡ hành, chuối ép dẻo nướng than hoa, chuối dẻo cuộn hạt (BANANA_NUT_ROLL).',
    farmerAdvice: 'Giai đoạn chuyển giao nhanh (1-2 ngày ở nhiệt độ phòng). Cần phân loại kịp thời và đưa vào quy trình sơ chế/sấy để giữ hương vị tối ưu.',
    recommendedProducts: ['SUGAR_COATED_BANANA', 'BANANA_NUT_ROLL'],
    commercialProcessingRecommended: true,
  },
  {
    id: 4,
    code: 'BANANA_4_RIPE',
    name: 'Chuối chín',
    fullName: 'Giai đoạn 4 – Chuối chín',
    ripenessPercent: 85,
    color: '#F59E0B',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Vỏ vàng hoàn toàn hoặc gần hoàn toàn; thịt mềm mịn, vị ngọt đậm đà, mùi thơm hoa quả rõ nét, lượng đường tự nhiên phong phú.',
    texture: 'Thịt mềm mọng, dễ nghiền nát hoặc cuộn mỏng, độ dẻo đàn hồi cao.',
    taste: 'Vị ngọt đậm đà, thơm nức mùi chuối chín tự nhiên.',
    starchSugarProfile: 'Hầu hết tinh bột đã chuyển hóa thành đường tự nhiên; giàu kali, vitamin B6 và năng lượng tiêu hóa nhanh.',
    culinaryUsage: 'Ứng viên ưu tiên cho Chuối dẻo cuộn hạt BananaGo (BANANA_NUT_ROLL), chè chuối bột báng cốt dừa, kem chuối que, chuối nếp nướng Sài Gòn, bánh chuối hấp dừa.',
    farmerAdvice: 'Tiêu thụ ăn tươi ngay hoặc liên kết chế biến trong 2-3 ngày. Dùng màng bọc quấn cuống hoặc làm lạnh nhẹ để giảm tốc độ thâm vỏ.',
    recommendedProducts: ['BANANA_NUT_ROLL', 'SUGAR_COATED_BANANA'],
    commercialProcessingRecommended: true,
  },
  {
    id: 5,
    code: 'BANANA_5_FULLY_RIPE',
    name: 'Chuối chín kỹ',
    fullName: 'Giai đoạn 5 – Chuối chín kỹ',
    ripenessPercent: 100,
    color: '#D97706',
    bgBadge: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Vỏ có nhiều đốm nâu (trứng cuốc) hoặc mảng nâu; thịt rất mềm, vị ngọt sắc, hương thơm nồng nàn; khó giữ hình dạng lát cắt nguyên vẹn.',
    texture: 'Thịt quả rất mềm nhũn, dễ chảy nước khi cắt, lý tưởng cho món dạng puree/nghiền.',
    taste: 'Ngọt lịm đậm sâu, hương chuối mật thơm nồng.',
    starchSugarProfile: 'Lượng đường tự nhiên đạt mức tối đa, chất chống oxy hóa cao, tinh bột kháng ở mức thấp nhất.',
    culinaryUsage: 'Tuyệt vời cho các món chuối xay/nghiền: Bánh chuối nướng yến mạch, sinh tố chuối bơ đậu phộng, kem chuối sữa chua, mứt chuối mật dẻo. Lưu ý: quả mốc hỏng/chảy dịch phải loại bỏ hoàn toàn.',
    farmerAdvice: 'Bóc vỏ, cấp đông sâu (-18°C) dạng múi hoặc puree để bảo quản dài hạn cho các cơ sở làm bánh kẹo và nước giải khát.',
    recommendedProducts: [],
    commercialProcessingRecommended: true,
  },
];

/**
 * Tra cứu giai đoạn chuối theo ID (1 đến 6)
 * @param {number|string} id 
 * @returns {object|null}
 */
export function getStageById(id) {
  const numericId = Number(id);
  return BANANA_STAGES.find((s) => s.id === numericId) || null;
}

/**
 * Tra cứu giai đoạn chuối theo Mã code (BANANA_1_NON .. BANANA_6_FULLY_RIPE)
 * @param {string} code 
 * @returns {object|null}
 */
export function getStageByCode(code) {
  if (!code || typeof code !== 'string') return null;
  const cleanCode = code.trim().toUpperCase();
  const aliasMap = {
    BANANA_2_DEVELOPING: 'BANANA_2_GREEN',
    BANANA_2_MATURE_GREEN: 'BANANA_2_GREEN',
    BANANA_3_MATURE_GREEN: 'BANANA_2_GREEN',
    BANANA_4_BEGINNING_RIPE: 'BANANA_3_BEGINNING_RIPE',
    BANANA_5_RIPE: 'BANANA_4_RIPE',
    BANANA_6_FULLY_RIPE: 'BANANA_5_FULLY_RIPE',
  };
  const normalized = aliasMap[cleanCode] || cleanCode;
  return BANANA_STAGES.find((s) => s.code === normalized) || null;
}

/**
 * Kiểm tra xem ID có thuộc 5 giai đoạn hợp lệ hay không
 * @param {any} id 
 * @returns {boolean}
 */
export function isValidStageId(id) {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId >= 1 && numericId <= 5;
}

/**
 * Kiểm tra xem Mã code có thuộc 5 giai đoạn hợp lệ hay không
 * @param {any} code 
 * @returns {boolean}
 */
export function isValidStageCode(code) {
  return Boolean(getStageByCode(code));
}
