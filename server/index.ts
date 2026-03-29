import app from './app';

/** Default 3005 — avoids clashing with Vite’s port fallback when 3002 is busy */
const PORT = Number(process.env.API_PORT || 3005);

if (!process.env.VERCEL) {
  app
    .listen(PORT, '127.0.0.1', () => {
      console.log(`[api] http://127.0.0.1:${PORT}`);
    })
    .on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `[api] Port ${PORT} is already in use. Stop the other process or set API_PORT in .env to a free port (e.g. 3006).`
        );
      } else {
        console.error('[api] listen error', err);
      }
      process.exit(1);
    });
}
