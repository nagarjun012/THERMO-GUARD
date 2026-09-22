import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export type UserRole = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export interface UserSession {
  userId: string;
  role: UserRole;
  name: string;
  department?: string;
  issuedAt: number;
  expiresAt: number;
}

export interface OfficialAccount {
  officerId: string;
  passcode: string;
  role: 'OFFICER' | 'ADMIN';
  name: string;
  department: string;
}

// Canonical authorized official registry for Government and Disaster Management access
export const OFFICIAL_ACCOUNTS: OfficialAccount[] = [
  {
    officerId: 'NDMA-HQ-882',
    passcode: 'NDMA@Secure2026',
    role: 'OFFICER',
    name: 'Dr. R. K. Sharma',
    department: 'National Disaster Management Authority (NDMA)',
  },
  {
    officerId: 'IMD-MET-404',
    passcode: 'IMD@Weather2026',
    role: 'OFFICER',
    name: 'S. Chandrasekar',
    department: 'India Meteorological Department (IMD)',
  },
  {
    officerId: 'SDMA-TN-108',
    passcode: 'SDMA@Disaster2026',
    role: 'OFFICER',
    name: 'K. Meenakshi',
    department: 'Tamil Nadu State Disaster Management Authority',
  },
  {
    officerId: 'DISASTER-ADMIN-99',
    passcode: 'Admin@ThermoSafe2026',
    role: 'ADMIN',
    name: 'National Tactical Coordinator',
    department: 'Ministry of Home Affairs — Disaster Management Division',
  },
];

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.SECRET_KEY ||
  'thermosafe-secure-hmac-sha256-auth-token-key-prod-2026';

const SESSION_MAX_AGE_SEC = 8 * 60 * 60; // 8 hours

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) {
    b64 += '=';
  }
  return Buffer.from(b64, 'base64').toString('utf8');
}

export function signSessionToken(session: UserSession): string {
  const payload = JSON.stringify(session);
  const encodedPayload = base64UrlEncode(payload);
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(encodedPayload);
  const signature = base64UrlEncode(hmac.digest('base64'));
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): UserSession | null {
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
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

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

export function parseCookies(header: string | undefined): Record<string, string> {
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

export function buildSessionCookieHeader(token: string): string {
  return `ts_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}`;
}

export function buildClearCookieHeader(): string {
  return `ts_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSession(req: VercelRequest): UserSession | null {
  const cookies = parseCookies(req.headers?.cookie);
  let token = cookies['ts_session'];
  if (!token && req.headers?.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }
  if (!token) return null;
  return verifySessionToken(token);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const rawUrl = req.url || '';
  const subpath = String(
    req.query.subpath ||
    req.headers['x-matched-path'] ||
    req.headers['x-invoke-path'] ||
    rawUrl
  ).toLowerCase();

  // Helper to get parsed JSON body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  // 1. POST /api/auth/login
  if (subpath.includes('login') || (req.method === 'POST' && !subpath.includes('logout'))) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only POST supported for login.' });
    }

    const { role, officerId, passcode, citizenName } = body;

    // Case A: Citizen login
    if (role === 'user' || role === 'CITIZEN' || (!officerId && citizenName)) {
      const now = Date.now();
      const session: UserSession = {
        userId: `CITIZEN-${now}`,
        role: 'CITIZEN',
        name: (citizenName || '').trim() || 'Citizen User',
        issuedAt: now,
        expiresAt: now + 24 * 60 * 60 * 1000,
      };

      const token = signSessionToken(session);
      res.setHeader('Set-Cookie', buildSessionCookieHeader(token));
      return res.status(200).json({
        status: 'authenticated',
        role: 'user',
        user: {
          userId: session.userId,
          name: session.name,
          role: session.role,
        },
      });
    }

    // Case B: Government Officer login
    if (!officerId || typeof officerId !== 'string' || officerId.trim().length === 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Officer ID is required for Government access.',
      });
    }

    if (!passcode || typeof passcode !== 'string' || passcode.trim().length === 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Security Passcode is required for Government access.',
      });
    }

    const account = OFFICIAL_ACCOUNTS.find(
      (a) => a.officerId.toLowerCase() === officerId.trim().toLowerCase()
    );

    if (!account || account.passcode !== passcode.trim()) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication failed. Invalid Officer ID or Security Passcode.',
      });
    }

    const now = Date.now();
    const session: UserSession = {
      userId: account.officerId,
      role: account.role,
      name: account.name,
      department: account.department,
      issuedAt: now,
      expiresAt: now + SESSION_MAX_AGE_SEC * 1000,
    };

    const token = signSessionToken(session);
    res.setHeader('Set-Cookie', buildSessionCookieHeader(token));
    return res.status(200).json({
      status: 'authenticated',
      role: 'gov',
      user: {
        userId: session.userId,
        name: session.name,
        role: session.role,
        department: session.department,
      },
    });
  }

  // 2. POST /api/auth/logout
  if (subpath.includes('logout')) {
    res.setHeader('Set-Cookie', buildClearCookieHeader());
    return res.status(200).json({
      status: 'logged_out',
      authenticated: false,
      message: 'Session successfully invalidated and cookie cleared.',
    });
  }

  // 3. GET /api/auth/session (or default GET on /api/auth)
  if (subpath.includes('session') || req.method === 'GET') {
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

  return res.status(404).json({ error: 'NOT_FOUND', message: 'Unknown auth endpoint' });
}
