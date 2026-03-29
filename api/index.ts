/**
 * Vercel: use legacy Node (req, res) handler so Express is invoked correctly.
 * Subpaths are preserved via `vercel.json` → `__v_path` query (see server/app.ts).
 */
import type { VercelApiHandler } from '@vercel/node';
import app from '../server/app.js';

export const config = {
  maxDuration: 60,
};

const handler: VercelApiHandler = (req, res) => {
  app(req, res);
};

export default handler;
