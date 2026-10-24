/**
 * BananaGo Image Preparation Service
 * Xử lý nén ảnh trên trình duyệt bằng HTML5 Canvas:
 * - Thu nhỏ kích thước cạnh lớn nhất về <= 1600px giữ nguyên tỷ lệ
 * - Chuyển đổi sang chuẩn JPEG chất lượng 0.85
 * - Đảm bảo payload gửi lên Vercel Serverless Function luôn < 1.5MB (tránh lỗi 413 Payload Too Large)
 */

export const DEFAULT_PREP_OPTIONS = {
  maxDimension: 1600,
  quality: 0.85,
  outputMimeType: 'image/jpeg',
};

/**
 * Loại bỏ tiền tố Data URL (ví dụ: "data:image/jpeg;base64,") để lấy chuỗi Base64 thuần
 * @param {string} dataUrl 
 * @returns {string}
 */
export function stripBase64Prefix(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return '';
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex !== -1 ? dataUrl.slice(commaIndex + 1) : dataUrl;
}

/**
 * Đọc file thành Data URL dạng chuỗi (dùng cho preview hoặc fallback)
 * @param {File|Blob} file 
 * @returns {Promise<string>}
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Tệp ảnh không tồn tại.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Tính toán kích thước mới giữ nguyên tỷ lệ cạnh
 * @param {number} width 
 * @param {number} height 
 * @param {number} maxDimension 
 * @returns {{ width: number, height: number }}
 */
export function calculateAspectRatioFit(width, height, maxDimension = 1600) {
  if (!width || !height) return { width: maxDimension, height: maxDimension };
  
  const maxOriginal = Math.max(width, height);
  if (maxOriginal <= maxDimension) {
    return { width, height };
  }

  const ratio = maxDimension / maxOriginal;
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

/**
 * Chuẩn bị và nén ảnh phục vụ gửi phân tích AI
 * @param {File|Blob} file 
 * @param {object} [customOptions]
 * @returns {Promise<{
 *   data: string,
 *   mimeType: string,
 *   dataUrl: string,
 *   width: number,
 *   height: number,
 *   originalSize: number,
 *   compressedSize: number
 * }>}
 */
export async function prepareImageForAnalysis(file, customOptions = {}) {
  const options = { ...DEFAULT_PREP_OPTIONS, ...customOptions };
  const originalSize = file ? file.size : 0;

  // Nếu không ở trong môi trường trình duyệt (Node.js test), fallback an toàn
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      data: '',
      mimeType: options.outputMimeType,
      dataUrl: '',
      width: 0,
      height: 0,
      originalSize,
      compressedSize: originalSize,
    };
  }

  // Bước 1: Đọc ảnh nguồn thành Image Object
  const dataUrl = await fileToDataUrl(file);
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không thể giải mã dữ liệu ảnh nguồn.'));
    img.src = dataUrl;
  });

  // Bước 2: Tính toán kích thước mới (cạnh lớn nhất <= maxDimension)
  const { width: newWidth, height: newHeight } = calculateAspectRatioFit(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    options.maxDimension
  );

  // Bước 3: Vẽ lên HTML5 Canvas và xuất ra JPEG nén
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Nếu không lấy được context 2D, dùng luôn dataUrl gốc
    return {
      data: stripBase64Prefix(dataUrl),
      mimeType: file.type || options.outputMimeType,
      dataUrl,
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
      originalSize,
      compressedSize: originalSize,
    };
  }

  // Khử răng cưa và vẽ chất lượng cao
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, newWidth, newHeight);

  // Xuất chuỗi Data URL JPEG với chất lượng xác định (mặc định 0.85)
  const compressedDataUrl = canvas.toDataURL(options.outputMimeType, options.quality);
  const base64Data = stripBase64Prefix(compressedDataUrl);

  // Ước tính dung lượng sau nén từ độ dài chuỗi base64
  const compressedSize = Math.round((base64Data.length * 3) / 4);

  return {
    data: base64Data,
    mimeType: options.outputMimeType,
    dataUrl: compressedDataUrl,
    width: newWidth,
    height: newHeight,
    originalSize,
    compressedSize,
  };
}
