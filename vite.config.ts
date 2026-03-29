import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    /** Local app URL: http://127.0.0.1:3002 — same UI bundle shape as `vite build` + Vercel. */
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      host: '127.0.0.1',
      port: 3002,
      strictPort: true,
      hmr: process.env.DISABLE_HMR !== 'true',
      ...apiProxy(),
    },
    /** `npm run preview`: production build on 3002 with the same /api proxy as dev (run API on 3005). */
    preview: {
      host: '127.0.0.1',
      port: 3002,
      strictPort: true,
      ...apiProxy(),
    },
  };
});

/** Shared by dev + preview so `/api/*` matches production paths while API runs on 3005 locally. */
function apiProxy() {
  return {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3005',
        changeOrigin: true,
        rewrite: (p: string) => p.replace(/^\/api/, '') || '/',
      },
    },
  } as const;
}
