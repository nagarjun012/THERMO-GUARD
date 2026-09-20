import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import weatherHandler from './api/weather'
import htssHandler from './api/htss'
import refreshHandler from './api/refresh'

function localVercelApiPlugin(): Plugin {
  return {
    name: 'local-vercel-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;

        const query: Record<string, string> = {};
        url.searchParams.forEach((val, key) => {
          query[key] = val;
        });
        (req as any).query = query;

        (res as any).status = function (statusCode: number) {
          res.statusCode = statusCode;
          return res;
        };
        (res as any).json = function (data: any) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        try {
          if (pathname === '/api/weather') {
            await weatherHandler(req as any, res as any);
            return;
          }
          if (pathname === '/api/htss') {
            await htssHandler(req as any, res as any);
            return;
          }
          if (pathname === '/api/refresh') {
            await refreshHandler(req as any, res as any);
            return;
          }
        } catch (err: any) {
          console.error('[local-api-dev] Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Local API Error' }));
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), localVercelApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

