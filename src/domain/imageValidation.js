/**
 * BananaGo Image Validation Service (Client-Side & Pre-flight)
 * Kiểm tra tính hợp lệ của tệp ảnh trước khi đưa vào luồng nén và phân tích.
 */

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const ERROR_CODES = {
  FILE_MISSING: 'FILE_MISSING',
  FILE_EMPTY: 'FILE_EMPTY',
  UNSUPPORTED_TYPE: 'UNSUPPORTED_TYPE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.FILE_MISSING]: 'Vui lòng chọn hoặc chụp một tệp ảnh quả chuối.',
  [ERROR_CODES.FILE_EMPTY]: 'Tệp ảnh bạn chọn không có dữ liệu (kích thước 0 bytes).',
  [ERROR_CODES.UNSUPPORTED_TYPE]: 'Định dạng ảnh không được hỗ trợ. Hệ thống chỉ chấp nhận ảnh định dạng JPEG, PNG hoặc WebP.',
  [ERROR_CODES.FILE_TOO_LARGE]: 'Dung lượng ảnh gốc quá lớn (vượt quá giới hạn tối đa 10MB). Vui lòng chọn ảnh nhẹ hơn.',
};

/**
 * Kiểm tra tính hợp lệ của tệp ảnh
 * @param {File|Blob|{size: number, type: string}} file 
 * @returns {{ isValid: boolean, error: string | null, errorCode: string | null }}
 */
export function validateImageFile(file) {
  if (!file) {
    return {
      isValid: false,
      errorCode: ERROR_CODES.FILE_MISSING,
      error: ERROR_MESSAGES[ERROR_CODES.FILE_MISSING],
    };
  }

  // Kiểm tra dung lượng rỗng
  if (typeof file.size !== 'number' || file.size <= 0) {
    return {
      isValid: false,
      errorCode: ERROR_CODES.FILE_EMPTY,
      error: ERROR_MESSAGES[ERROR_CODES.FILE_EMPTY],
    };
  }

  // Kiểm tra định dạng MIME
  const mimeType = (file.type || '').toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      isValid: false,
      errorCode: ERROR_CODES.UNSUPPORTED_TYPE,
      error: ERROR_MESSAGES[ERROR_CODES.UNSUPPORTED_TYPE],
    };
  }

  // Kiểm tra giới hạn 10MB
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      errorCode: ERROR_CODES.FILE_TOO_LARGE,
      error: ERROR_MESSAGES[ERROR_CODES.FILE_TOO_LARGE],
    };
  }

  return {
    isValid: true,
    errorCode: null,
    error: null,
  };
}
