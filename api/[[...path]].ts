/**
 * Catch-all under `/api/*` (and `/api`). `api/index.ts` only matched bare `/api`, so
 * `/api/claim/send-code` fell through to the SPA rewrite and returned HTML → JSON parse error.
 */
import app from '../server/app';

export default app;
