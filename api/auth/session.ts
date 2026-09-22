import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSession } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Prevent caching of session responses
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  const session = getSession(req);
  if (!session) {
    return res.status(200).json({
      authenticated: false,
      role: 'user',
      user: null,
    });
  }

  return res.status(200).json({
    authenticated: true,
    role: session.role === 'CITIZEN' ? 'user' : 'gov',
    userRole: session.role,
    user: {
      userId: session.userId,
      name: session.name,
      department: session.department,
      role: session.role,
      expiresAt: session.expiresAt,
    },
  });
}
