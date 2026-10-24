/**
 * BananaGo — Vercel Serverless Function: POST /api/analyze
 * Endpoint ranh giới an toàn giữa Frontend React và Google Gemini Vision API.
 */

import { analyzeImageCore } from './_lib/analyzeCore.js';

/**
 * Helper gửi JSON response tương thích cả Vercel Serverless và Node HTTP
 */
function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, {
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Endpoint chỉ hỗ trợ phương thức POST.',
      },
    });
  }

  try {
    let body = req.body;
    // Xử lý trường hợp body gửi lên dạng chuỗi JSON chưa parse
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return sendJson(res, 400, {
          success: false,
          error: {
            code: 'INVALID_IMAGE',
            message: 'Định dạng JSON gửi lên không hợp lệ.',
          },
        });
      }
    }

    const result = await analyzeImageCore(body);
    return sendJson(res, result.status, result.body);
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: `Lỗi máy chủ nội bộ: ${error.message || 'Không xác định'}`,
      },
    });
  }
}
