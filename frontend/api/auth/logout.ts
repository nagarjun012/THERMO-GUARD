import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buildClearCookieHeader } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', buildClearCookieHeader(isProduction));
  return res.status(200).json({
    status: 'logged_out',
    message: 'Session successfully invalidated and cookie cleared.',
  });
}
