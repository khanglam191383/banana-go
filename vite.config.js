import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/analyze.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Tự động load biến môi trường từ file .env cục bộ
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (env.GEMINI_MODEL) process.env.GEMINI_MODEL = env.GEMINI_MODEL;

  return {
    plugins: [
      react(),
      {
        name: 'local-api-analyze-serverless-middleware',
        configureServer(server) {
          // Bắt route /api/analyze trên dev server cục bộ giống hệt Vercel Serverless
          server.middlewares.use('/api/analyze', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                error: {
                  code: 'METHOD_NOT_ALLOWED',
                  message: 'Endpoint chỉ hỗ trợ phương thức POST.',
                },
              }));
              return;
            }

            const chunks = [];
            req.on('data', (chunk) => {
              chunks.push(chunk);
            });

            req.on('end', async () => {
              try {
                const rawBody = Buffer.concat(chunks).toString('utf-8');
                req.body = rawBody ? JSON.parse(rawBody) : {};
                await handler(req, res);
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: `Lỗi dev server: ${err.message}`,
                  },
                }));
              }
            });
          });
        },
      },
    ],
    server: {
      port: 3000,
      open: true,
    },
  };
});

