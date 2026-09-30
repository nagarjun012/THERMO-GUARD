import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifySession } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await verifySession(req);

  if (!session) {
    return res.status(401).json({ isAuthenticated: false, role: 'user' });
  }

  return res.status(200).json({ 
    isAuthenticated: true, 
    role: session.role,
    officerId: session.officerId,
    department: session.department
  });
}
