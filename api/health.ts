import type { VercelApiHandler } from '@vercel/node';
import app from '../server/app.js';

export const config = {
  maxDuration: 30,
};

const handler: VercelApiHandler = (req, res) => {
  app(req, res);
};

export default handler;
