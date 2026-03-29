/**
 * Catch-all under `/api/*` so `/api/claim/send-code` reaches Express.
 * `api/index.ts` only handled the bare `/api` route on Vercel.
 */
import app from '../server/app';

export default app;
