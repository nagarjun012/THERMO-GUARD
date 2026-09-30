import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export interface UserSession {
  userId: string;
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN';
  name: string;
  department?: string;
  issuedAt: number;
  expiresAt: number;
}

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SECRET_KEY ||
  'thermosafe-secure-hmac-sha256-auth-token-key-prod-2026';

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  return Buffer.from(b64, 'base64').toString('utf8');
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function verifySessionToken(token: string): UserSession | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(encodedPayload);
  const expectedSignature = base64UrlEncode(hmac.digest('base64'));

  const providedBuf = Buffer.from(providedSignature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(new Uint8Array(providedBuf), new Uint8Array(expectedBuf))) return null;

  try {
    const raw = base64UrlDecode(encodedPayload);
    const session: UserSession = JSON.parse(raw);
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  const pairs = header.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.substring(0, idx).trim();
    const val = pair.substring(idx + 1).trim();
    cookies[key] = decodeURIComponent(val);
  }
  return cookies;
}

function getSession(req: VercelRequest): UserSession | null {
  const cookies = parseCookies(req.headers?.cookie);
  let token = cookies['ts_session'];
  if (!token && req.headers?.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }
  if (!token && req.headers?.['x-session-token']) {
    token = String(req.headers['x-session-token']).trim();
  }
  if (!token) return null;
  return verifySessionToken(token);
}

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
