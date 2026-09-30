import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cookie from 'cookie';
import { COOKIE_NAME } from '../_utils/auth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the cookie by setting maxAge to 0 and an expiration date in the past
  const clearCookie = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });

  res.setHeader('Set-Cookie', clearCookie);

  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
