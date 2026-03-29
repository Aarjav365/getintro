/**
 * Vercel zero-config Express entry (see https://vercel.com/docs/frameworks/backend/express).
 * Local dev still uses `server/index.ts` + Vite proxy; this file is the production serverless bundle.
 */
export { default } from './server/app.js';
