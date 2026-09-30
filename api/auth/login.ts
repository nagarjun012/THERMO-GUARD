import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createSessionCookie } from '../_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { govId, department } = req.body || {};

  // Server-side validation
  if (!govId || typeof govId !== 'string' || govId.trim().length === 0) {
    return res.status(400).json({ error: 'Valid Officer ID is required' });
  }

  // TODO: Replace this mock validation with real database lookup if needed.
  // For now, we enforce a basic check to prevent just any empty string, 
  // and we assign the role 'gov'. If govId starts with 'ADMIN', we can make them admin.
  let role: 'gov' | 'admin' = 'gov';
  if (govId.startsWith('ADMIN-')) {
    role = 'admin';
  }

  // Create session payload
  const sessionCookie = await createSessionCookie({
    role,
    officerId: govId,
    department: department || 'General',
  });

  // Set the cookie header
  res.setHeader('Set-Cookie', sessionCookie);

  return res.status(200).json({ 
    success: true, 
    role,
    message: 'Authentication successful' 
  });
}
