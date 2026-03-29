/**
 * Single Express entry for Vercel. Nested `api/claim/*.ts` files are not reliable with
 * current Node function bundling → FUNCTION_INVOCATION_FAILED at runtime.
 * `vercel.json` rewrites `/api/*` → `/api` so all API traffic hits this module.
 */
import app from '../server/app.js';

export const config = {
  maxDuration: 60,
};

export default app;
