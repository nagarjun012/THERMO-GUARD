import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireRole } from './_utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await requireRole(req, res, 'admin');
  if (!session) return;

  return res.status(200).json({
    status: 'ok',
    message: 'THERMOSAFE telemetry engine active. Client live sync operational.',
    timestamp: new Date().toISOString(),
  });
}
