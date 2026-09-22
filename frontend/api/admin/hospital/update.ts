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

  const session = requireRole(req, res, 'ADMIN');
  if (!session) return;

  const payload: UpdatePayload = req.body || {};

  if (!payload.facilityId || typeof payload.facilityId !== 'string' || payload.facilityId.trim().length === 0) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'facilityId is required and must be a valid identifier.',
    });
  }

  const cleanId = payload.facilityId.trim();

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
