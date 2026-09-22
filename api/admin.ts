import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSession } from './auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only POST supported.' });
  }

  // 1. Verify ADMIN role
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Access denied. A valid server-authenticated session is required.',
    });
  }

  if (session.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Access denied. Requires ADMIN role.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const {
    facilityId,
    totalBeds,
    availableBeds,
    totalICUBeds,
    availableICUBeds,
    oxygenAvailable,
    ambulanceAvailable,
    emergencyAvailable,
  } = body;

  if (!facilityId || typeof facilityId !== 'string') {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'facilityId is required.' });
  }

  if (totalBeds !== undefined && (typeof totalBeds !== 'number' || totalBeds < 0)) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'totalBeds must be non-negative.' });
  }

  if (availableBeds !== undefined && (typeof availableBeds !== 'number' || availableBeds < 0)) {
    return res.status(400).json({ error: 'BAD_REQUEST', message: 'availableBeds must be non-negative.' });
  }

  if (totalBeds !== undefined && availableBeds !== undefined && availableBeds > totalBeds) {
    return res.status(400).json({
      error: 'BAD_REQUEST',
      message: 'availableBeds cannot exceed totalBeds.',
    });
  }

  const auditRecord = {
    userId: session.userId,
    role: session.role,
    facilityId,
    timestamp: new Date().toISOString(),
    operation: 'UPDATE_HOSPITAL_METRICS',
    changedValues: {
      totalBeds,
      availableBeds,
      totalICUBeds,
      availableICUBeds,
      oxygenAvailable,
      ambulanceAvailable,
      emergencyAvailable,
    },
  };

  console.log('[FACILITY_AUDIT]', JSON.stringify(auditRecord));

  return res.status(200).json({
    status: 'SUCCESS',
    message: `Facility ${facilityId} metrics successfully updated.`,
    audit: auditRecord,
  });
}
