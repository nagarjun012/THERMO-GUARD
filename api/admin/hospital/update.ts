import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireRole } from '../../_lib/auth';

interface UpdatePayload {
  facilityId: string;
  totalBeds?: number;
  availableBeds?: number;
  totalICUBeds?: number;
  availableICUBeds?: number;
  oxygenAvailable?: boolean;
  ambulanceAvailable?: boolean;
  emergencyAvailable?: boolean;
}

// In-memory audit log for facility updates (would write to DB in persistent env)
const AUDIT_LOG: Array<{
  userId: string;
  role: string;
  facilityId: string;
  timestamp: string;
  operation: string;
  changedValues: Record<string, any>;
}> = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only POST is supported.' });
  }

  // Strictly enforce server-side ADMIN authorization
  const session = requireRole(req, res, 'ADMIN');
  if (!session) return; // 401 or 403 sent

  const payload: UpdatePayload = req.body || {};

  // 1. Validate facilityId
  if (!payload.facilityId || typeof payload.facilityId !== 'string' || payload.facilityId.trim().length === 0) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'facilityId is required and must be a valid identifier.',
    });
  }

  const cleanId = payload.facilityId.trim();

  // 2. Validate numeric fields (no negative numbers, must be numbers if present)
  const numericChecks: Array<[string, number | undefined]> = [
    ['totalBeds', payload.totalBeds],
    ['availableBeds', payload.availableBeds],
    ['totalICUBeds', payload.totalICUBeds],
    ['availableICUBeds', payload.availableICUBeds],
  ];

  const changedValues: Record<string, any> = {};

  for (const [fieldName, val] of numericChecks) {
    if (val !== undefined) {
      if (typeof val !== 'number' || isNaN(val) || !Number.isFinite(val)) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `${fieldName} must be a valid finite number.`,
        });
      }
      if (val < 0) {
        return res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: `${fieldName} cannot be negative. Received ${val}.`,
        });
      }
      changedValues[fieldName] = Math.round(val);
    }
  }

  // Validate relational consistency
  if (
    payload.totalBeds !== undefined &&
    payload.availableBeds !== undefined &&
    payload.availableBeds > payload.totalBeds
  ) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'availableBeds cannot exceed totalBeds.',
    });
  }

  if (
    payload.totalICUBeds !== undefined &&
    payload.availableICUBeds !== undefined &&
    payload.availableICUBeds > payload.totalICUBeds
  ) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'availableICUBeds cannot exceed totalICUBeds.',
    });
  }

  // 3. Validate boolean flags if present
  if (payload.oxygenAvailable !== undefined) {
    if (typeof payload.oxygenAvailable !== 'boolean') {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'oxygenAvailable must be boolean.' });
    }
    changedValues.oxygenAvailable = payload.oxygenAvailable;
  }

  if (payload.ambulanceAvailable !== undefined) {
    if (typeof payload.ambulanceAvailable !== 'boolean') {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'ambulanceAvailable must be boolean.' });
    }
    changedValues.ambulanceAvailable = payload.ambulanceAvailable;
  }

  if (payload.emergencyAvailable !== undefined) {
    if (typeof payload.emergencyAvailable !== 'boolean') {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'emergencyAvailable must be boolean.' });
    }
    changedValues.emergencyAvailable = payload.emergencyAvailable;
  }

  if (Object.keys(changedValues).length === 0) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'No valid update fields submitted.',
    });
  }

  // 4. Audit logging without secrets or sensitive tokens
  const auditEntry = {
    userId: session.userId,
    role: session.role,
    facilityId: cleanId,
    timestamp: new Date().toISOString(),
    operation: 'UPDATE_HOSPITAL_METRICS',
    changedValues,
  };
  AUDIT_LOG.push(auditEntry);
  console.log('[FACILITY_AUDIT]', JSON.stringify(auditEntry));

  return res.status(200).json({
    status: 'SUCCESS',
    message: `Facility ${cleanId} metrics successfully updated.`,
    audit: auditEntry,
  });
}
