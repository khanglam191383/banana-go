import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot,
  BrainCircuit, 
  UploadCloud, 
  Camera, 
  CheckCircle2, 
  AlertTriangle,
  AlertOctagon,
  RefreshCw, 
  ShieldCheck, 
  Lightbulb, 
  UtensilsCrossed,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { validateImageFile } from '../domain/imageValidation.js';
import { analyzeBananaImage } from '../services/analyzeService.js';

// 3 mẫu ảnh chuẩn đại diện cho 3 giai đoạn để người dùng test nhanh trong 1 click
const SAMPLE_BANANAS = [
  {
    id: 'sample-green',
    stageId: 3,
    label: 'Chuối xanh già (GĐ 3)',
    thumbnail: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    desc: 'Vỏ xanh mướt, giàu tinh bột kháng',
  },
  {
    id: 'sample-turning',
    stageId: 4,
    label: 'Bắt đầu chín (GĐ 4)',
    thumbnail: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80',
    desc: 'Vàng điểm xanh, ngọt thanh dẻo',
  },
  {
    id: 'sample-ripe',
    stageId: 5,
    label: 'Chuối chín vàng (GĐ 5)',
    thumbnail: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80',
    desc: 'Vàng đều, thơm nồng đậm đà',
  },
];

const AiBananaPage = () => {
  const { success, error, info } = useToast();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [demoMode, setDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'vegetarian' | 'savory' | 'sweet'

  // Xử lý chọn tệp ảnh với kiểm thực Client-side
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      error(validation.error);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Chọn ảnh mẫu có sẵn để thử nghiệm nhanh
  const handleSelectSample = async (sample) => {
    setSelectedFile(null);
    setSelectedImage(sample.thumbnail);
    setAnalysisResult(null);
    info(`Đã nạp mẫu: ${sample.label}`);

    // Tự động kích hoạt phân tích mẫu
    await triggerAnalysis(sample.thumbnail, { forceDemoMode: true, demoStageId: sample.stageId });
  };

  // Bắt đầu quy trình phân tích AI qua analyzeService
  const handleStartAnalysis = async () => {
    if (!selectedImage && !selectedFile) {
      error('Vui lòng tải lên hoặc chụp một ảnh trái chuối cần phân tích!');
      return;
    }
    await triggerAnalysis(selectedFile || selectedImage, { forceDemoMode: demoMode });
  };

  // Thực hiện phân tích và cập nhật tiến trình
  const triggerAnalysis = async (input, options = {}) => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisResult(null);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => (prev >= 85 ? 85 : prev + 15));
    }, 200);

    try {
      const res = await analyzeBananaImage(input, options);
      clearInterval(interval);
      setAnalysisProgress(100);

      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisResult(res);
        if (res.source === 'gemini') {
          success('AI Google Gemini đã hoàn tất phân tích ảnh trực tiếp! 🍌');
        } else {
          info('Đã hoàn tất phân tích với Dữ liệu mẫu Demo dự phòng.');
        }
      }, 350);
    } catch (err) {
      clearInterval(interval);
      setIsAnalyzing(false);
      error(err.message || 'Lỗi phân tích ảnh chuối.');
    }
  };

  // Lọc danh sách món gợi ý theo Tab
  const allRecommendedDishes = analysisResult?.dishRecommendations?.dishes || [];
  const tabDishes = allRecommendedDishes.filter((dish) => {
    if (activeTab === 'all') return true;
    return dish.category === activeTab;
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-5xl space-y-12">
      
      {/* ==================== 1. HEADER AI BANANA ==================== */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-primary-300 shadow-sm">
            <Bot size={18} className="text-leaf" />
            <span className="font-display font-extrabold text-xs sm:text-sm text-leaf">
              BananaGo AI Vision Engine
            </span>
          </div>

          {/* Toggle Chế độ Demo / Live */}
          <button
            type="button"
            onClick={() => {
              setDemoMode(!demoMode);
              info(demoMode ? 'Đã chuyển sang: Chế độ AI Live (Google Gemini API)' : 'Đã bật: Chế độ Demo (Mock Offline)');
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm ${
              demoMode
                ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Nhấp để chuyển đổi giữa AI thật và dữ liệu mẫu"
          >
            {demoMode ? (
              <><span>🧪</span> Chế độ Demo (Offline)</>
            ) : (
              <><span>⚡</span> Chế độ AI Live</>
            )}
          </button>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brown-dark leading-tight">
          Phân Tích Độ Chín TRÁI CHUỐI, <br className="hidden sm:inline" />
          <span className="text-leaf">Gợi Ý Chế Biến Giảm Lãng Phí</span>
        </h1>

        <p className="text-brown/70 text-sm sm:text-base leading-relaxed">
          Tải ảnh quả chuối lên để mô hình AI phân loại vào đúng 1 trong 6 giai đoạn phát triển theo tài liệu chuẩn BananaGo, nhận diện đặc tính cảm quan và khám phá món ăn phù hợp nhất.
        </p>
      </div>

      {/* ==================== 2. KHU VỰC TẢI ẢNH & SCAN AI ==================== */}
      <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border-3 border-primary-200 shadow-pop space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* CỘT TẢI ẢNH (KÉO THẢ / CHỌN TỆP) */}
          <div className="lg:col-span-7">
            {selectedImage ? (
              <div className="relative rounded-3xl overflow-hidden border-3 border-primary-300 h-80 sm:h-96 bg-cream shadow-inner flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Chuối cần phân tích"
                  className="w-full h-full object-cover"
                />

                {/* Nút xóa ảnh */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null);
                    setAnalysisResult(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-brown/70 text-white hover:bg-brown shadow-md"
                  title="Chọn ảnh khác"
                >
                  <X size={18} />
                </button>

                {/* Hiệu ứng quét Laser AI khi đang phân tích */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-leaf/10 backdrop-blur-[1px] flex flex-col justify-center items-center overflow-hidden">
                    <motion.div
                      className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#F4C542]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-pop text-center space-y-2 border border-primary-300 max-w-xs mx-4">
                      <div className="w-10 h-10 mx-auto animate-pulse text-leaf">
                        <BrainCircuit size={36} />
                      </div>
                      <p className="font-display font-extrabold text-sm text-leaf">
                        {demoMode ? 'Đang trích xuất dữ liệu mẫu...' : 'Gemini AI đang phân tích vỏ quả...'} {analysisProgress}%
                      </p>
                      <span className="text-[11px] text-brown/60 block">
                        Đang đối chiếu với 6 giai đoạn chuẩn BananaGo
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <label className="border-3 border-dashed border-primary-300 hover:border-leaf rounded-3xl h-80 sm:h-96 flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-cream/50 hover:bg-cream transition-all group">
                <div className="w-20 h-20 rounded-full bg-primary-100 group-hover:scale-110 text-leaf flex items-center justify-center mb-4 transition-transform shadow-sm">
                  <UploadCloud size={38} />
                </div>
                <h3 className="font-display font-extrabold text-lg text-brown-dark mb-1">
                  Kéo thả hoặc tải ảnh quả chuối lên
                </h3>
                <p className="text-xs text-brown/60 max-w-xs mb-4">
                  Hỗ trợ JPG, PNG, WEBP tối đa 10MB (ảnh sẽ tự động nén tối ưu trước khi phân tích)
                </p>
                <span className="btn-primary py-2 px-5 text-xs shadow-sm">
                  <Camera size={16} /> Chọn ảnh từ thiết bị
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* CỘT NÚT PHÂN TÍCH & ẢNH MẪU SẴN */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="font-display font-extrabold text-xl text-brown-dark mb-2">
                Bắt Đầu Phân Tích
              </h3>
              <p className="text-xs text-brown/70 leading-relaxed mb-4">
                Hệ thống gửi ảnh qua máy chủ bảo mật để AI phân loại chính xác vào 1 trong 6 giai đoạn quả và đề xuất món chế biến phù hợp.
              </p>

              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || (!selectedImage && !selectedFile)}
                className="btn-primary w-full py-3.5 text-base shadow-banana disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    <span>Đang Phân Tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>{demoMode ? 'Chạy Phân Tích (Demo Mock)' : 'Phân Tích Độ Chín Bằng AI'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="h-px bg-primary-100"></div>

            {/* Thử nhanh với 3 ảnh mẫu */}
            <div>
              <h4 className="font-display font-bold text-sm text-brown mb-2 flex items-center gap-1.5">
                <span>💡</span> Thử nhanh với 3 ảnh mẫu:
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                {SAMPLE_BANANAS.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 rounded-2xl border-2 border-primary-200 hover:border-leaf bg-white hover:bg-cream transition-all text-center flex flex-col items-center group"
                  >
                    <div className="w-full h-16 rounded-xl overflow-hidden mb-1.5 shadow-sm">
                      <img
                        src={sample.thumbnail}
                        alt={sample.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-brown leading-tight block">
                      {sample.label}
                    </span>
                    <span className="text-[9px] text-brown/60 truncate w-full mt-0.5">
                      {sample.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ==================== 3. KẾT QUẢ PHÂN TÍCH AI HOÀN CHỈNH ==================== */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-10 border-3 border-leaf shadow-pop space-y-8"
        >
          {/* Header kết quả & Source Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-primary-100">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                {analysisResult.source === 'gemini' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <Bot size={14} /> AI Trực Tiếp (Google Gemini)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <ShieldCheck size={14} /> Dữ Liệu Mẫu Demo (Mock Fallback)
                  </span>
                )}

                {/* Nhãn mức độ tin cậy định tính (không dùng % ảo) */}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  analysisResult.confidenceLabel === 'high'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : analysisResult.confidenceLabel === 'medium'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
                }`}>
                  Tin cậy: {
                    analysisResult.confidenceLabel === 'high' ? 'Cao' :
                    analysisResult.confidenceLabel === 'medium' ? 'Trung bình' : 'Thấp (Phân vân)'
                  }
                </span>
              </div>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brown-dark pt-1">
                Kết Quả: <span className="text-leaf">{analysisResult.stageName}</span>
              </h2>
            </div>
            
            {/* Huy hiệu giai đoạn */}
            {analysisResult.stageId && (
              <div className="px-5 py-2.5 rounded-2xl bg-cream border-2 border-primary-300 text-center">
                <span className="text-[10px] font-bold text-brown/60 uppercase block">Giai đoạn quả</span>
                <span className="font-display font-extrabold text-2xl text-leaf">
                  {analysisResult.stageId} / 6
                </span>
              </div>
            )}
          </div>

          {/* Cảnh báo Fallback (nếu API có sự cố và chuyển sang mock) */}
          {analysisResult.fallbackNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs sm:text-sm flex items-start gap-3">
              <Info size={18} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">Thông báo chế độ dự phòng:</p>
                <p>{analysisResult.fallbackNotice}</p>
              </div>
            </div>
          )}

          {/* CẢNH BÁO AN TOÀN THỰC PHẨM (NẾU PHÁT HIỆN HỎNG / MỐC) */}
          {(analysisResult.possible_quality_warning || analysisResult.qualityWarning || (analysisResult.warnings && analysisResult.warnings.includes('spoilage_detected'))) && (
            <div className="p-4 sm:p-5 rounded-3xl bg-red-50 border-2 border-red-300 text-red-800 text-xs sm:text-sm flex items-start gap-3.5">
              <AlertOctagon size={24} className="shrink-0 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-base text-red-900">
                  Cảnh Báo An Toàn Nông Sản & Thực Phẩm
                </h4>
                <p className="leading-relaxed">
                  {analysisResult.qualityWarning || 'Hệ thống phát hiện dấu hiệu nấm mốc hoặc thối rữa bất thường trên vỏ quả. Không khuyến khích sử dụng chế biến thực phẩm.'}
                </p>
              </div>
            </div>
          )}

          {/* CẢNH BÁO PHÂN VÂN / ẢNH MỜ / NHIỀU QUẢ */}
          {analysisResult.qualityIssues && analysisResult.qualityIssues.length > 0 && (
            <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs flex items-start gap-2.5">
              <AlertTriangle size={16} className="shrink-0 text-yellow-600 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Lưu ý về chất lượng ảnh chụp:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {analysisResult.qualityIssues.includes('multiple_bananas') && (
                    <li>Ảnh chụp nhiều quả chuối: Kết quả trên đại diện cho quả chuối rõ nét nhất trong khung hình.</li>
                  )}
                  {analysisResult.qualityIssues.includes('not_banana') && (
                    <li>Vật thể trong ảnh có thể không phải quả chuối hoặc góc chụp quá khó nhận diện.</li>
                  )}
                  {analysisResult.qualityIssues.includes('uncertain_evidence') && (
                    <li>Ảnh bị thiếu sáng hoặc mờ nét khiến mức độ tin cậy bị giảm. Khuyến nghị chụp lại ở nơi đủ sáng.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* GIẢI THÍCH VÀ BẰNG CHỨNG QUAN SÁT THỊ GIÁC */}
          <div className="p-5 sm:p-6 rounded-3xl bg-cream/70 border border-primary-200 space-y-3">
            <h3 className="font-display font-extrabold text-base text-brown-dark flex items-center gap-2">
              <Bot size={18} className="text-leaf" />
              Tóm Tắt Nhận Định Hình Thái:
            </h3>
            <p className="text-xs sm:text-sm text-brown/90 leading-relaxed">
              {analysisResult.reasoningSummary}
            </p>

            {analysisResult.visualEvidence && analysisResult.visualEvidence.length > 0 && (
              <div className="pt-2 border-t border-primary-100 space-y-1.5">
                <span className="text-[11px] font-bold text-brown/70 block">Dấu hiệu quan sát trực quan:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analysisResult.visualEvidence.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-brown/80">
                      <CheckCircle2 size={14} className="text-leaf shrink-0 mt-0.5" />
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SẢN PHẨM TRỌNG TÂM BANANAGO (BANANA_CHIPS, SUGAR_COATED_BANANA, BANANA_NUT_ROLL) */}
          {analysisResult.recommendedProducts && analysisResult.recommendedProducts.length > 0 && (
            <div className="p-4 sm:p-5 rounded-3xl bg-secondary-50/70 border border-secondary-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-display font-extrabold text-xs text-leaf uppercase tracking-wider block">
                  Định hướng khai thác BananaGo
                </span>
                <span className="text-xs text-brown/70">
                  Phù hợp cho các dòng sản phẩm chế biến trọng điểm:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.recommendedProducts.includes('BANANA_CHIPS') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800 border border-emerald-300 shadow-sm">
                    🍌 Chuối sấy giòn (Chips)
                  </span>
                )}
                {analysisResult.recommendedProducts.includes('SUGAR_COATED_BANANA') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-amber-800 border border-amber-300 shadow-sm">
                    🍯 Chuối chiên ngào đường
                  </span>
                )}
                {analysisResult.recommendedProducts.includes('BANANA_NUT_ROLL') && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-orange-800 border border-orange-300 shadow-sm">
                    🥜 Chuối dẻo cuộn hạt
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ĐẶC TÍNH VỊ GIÁC & LỜI KHUYÊN NÔNG HỌC TỪ BANANAGO.MD */}
          {analysisResult.stageInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-secondary-50 border border-secondary-200 space-y-2">
                <h3 className="font-display font-extrabold text-base text-leaf flex items-center gap-2">
                  <UtensilsCrossed size={18} />
                  Kết Cấu & Vị Giác:
                </h3>
                <p className="text-xs sm:text-sm text-brown/80 leading-relaxed">
                  <strong>Kết cấu:</strong> {analysisResult.stageInfo.texture}
                </p>
                <p className="text-xs sm:text-sm text-brown/80 leading-relaxed">
                  <strong>Vị giác:</strong> {analysisResult.stageInfo.taste}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-primary-50 border border-primary-200 space-y-2">
                <h3 className="font-display font-extrabold text-base text-brown-dark flex items-center gap-2">
                  <Lightbulb size={18} />
                  Lời Khuyên Thu Hoạch & Bảo Quản:
                </h3>
                <p className="text-xs sm:text-sm text-brown/80 leading-relaxed">
                  {analysisResult.stageInfo.farmerAdvice}
                </p>
              </div>
            </div>
          )}

          {/* ==================== ĐỀ XUẤT MÓN THEO GIAI ĐOẠN ==================== */}
          <div className="space-y-6 pt-4 border-t-2 border-primary-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-brown-dark">
                  Món Ngon Đề Xuất Phù Hợp ({tabDishes.length} món)
                </h3>
                <p className="text-xs sm:text-sm text-brown/70">
                  Lựa chọn dựa trên độ giữ cấu trúc và lượng đường tự nhiên của quả chuối:
                </p>
              </div>
              
              <span className="inline-flex items-center text-[11px] text-brown/60 italic">
                * Dữ liệu đề xuất đang ở trạng thái tham khảo sơ bộ
              </span>
            </div>

            {/* Thông báo riêng nếu là Giai đoạn 1 (Chuối non) */}
            {analysisResult.stageId === 1 && (
              <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-2">
                <p className="font-display font-extrabold text-base text-emerald-900">
                  🌱 Lời khuyên nông học từ BananaGo:
                </p>
                <p className="text-xs sm:text-sm text-emerald-800 max-w-xl mx-auto leading-relaxed">
                  Quả chuối non chưa phát triển thịt và chứa nhiều mủ chát, BananaGo không khuyến khích thu hoạch thương phẩm (0 món đề xuất). Hãy giữ buồng trên cây để chuối đạt năng suất và giá trị kinh tế trọn vẹn nhất!
                </p>
              </div>
            )}

            {/* Các Tab lọc danh mục */}
            {analysisResult.stageId !== 1 && allRecommendedDishes.length > 0 && (
              <div className="flex flex-wrap gap-2 border-b border-primary-200 pb-2">
                {[
                  { id: 'all', label: 'Tất cả món' },
                  { id: 'vegetarian', label: '🥗 Món Chay' },
                  { id: 'savory', label: '🍲 Món Mặn' },
                  { id: 'sweet', label: '🍰 Món Ngọt / Tráng Miệng' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-2xl font-display font-bold text-xs sm:text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-leaf text-white shadow-md'
                        : 'bg-cream text-brown/70 hover:bg-primary-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Lưới card món gợi ý */}
            {analysisResult.stageId !== 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tabDishes.length > 0 ? (
                  tabDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-cream/60 rounded-3xl overflow-hidden border-2 border-primary-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-brown/70 backdrop-blur-sm">
                            Chưa thẩm định
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-display font-bold text-base text-leaf">
                            {dish.name}
                          </h4>
                          {dish.suitabilityReason && (
                            <p className="text-xs text-brown/80 leading-relaxed italic bg-white/60 p-2.5 rounded-xl border border-primary-100">
                              💡 {dish.suitabilityReason}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-brown/60 pt-1">
                            <span>⏱️ {dish.cookTime}</span>
                            <span>🔥 {dish.difficulty}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 pt-0">
                        <Link
                          to={`/recipes?recipe=${dish.id}`}
                          className="btn-primary w-full py-2 text-xs"
                        >
                          Xem công thức chi tiết
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-6 text-center text-xs text-brown/60">
                    Chưa có món phù hợp trong danh mục này. Hãy thử bấm &quot;Tất cả món&quot; ở trên nhé!
                  </div>
                )}
              </div>
            )}
          </div>

        </motion.div>
      )}

    </div>
  );
};

export default AiBananaPage;
