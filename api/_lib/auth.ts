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

/**
 * Creates a cryptographically signed HMAC-SHA256 session token
 */
export function signSessionToken(session: UserSession): string {
  const payload = JSON.stringify(session);
  const encodedPayload = base64UrlEncode(payload);
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(encodedPayload);
  const signature = base64UrlEncode(hmac.digest('base64'));
  return `${encodedPayload}.${signature}`;
}

/**
 * Validates and decodes a signed session token. Returns null if forged or expired.
 */
export function verifySessionToken(token: string): UserSession | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, providedSignature] = parts;
  const hmac = crypto.createHmac('sha256', AUTH_SECRET);
  hmac.update(encodedPayload);
  const expectedSignature = base64UrlEncode(hmac.digest('base64'));

  // Constant-time comparison to prevent timing attacks
  const providedBuf = Buffer.from(providedSignature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (providedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) return null;

  try {
    const raw = base64UrlDecode(encodedPayload);
    const session: UserSession = JSON.parse(raw);

    // Check expiration
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

/**
 * Parse standard cookie header into key-value map
 */
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

/**
 * Builds standard HttpOnly, Secure, SameSite session cookie header
 */
export function buildSessionCookieHeader(token: string, isProduction = process.env.NODE_ENV === 'production'): string {
  const secureFlag = isProduction ? '; Secure' : '';
  return `ts_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}${secureFlag}`;
}

/**
 * Builds cookie deletion header for logout
 */
export function buildClearCookieHeader(isProduction = process.env.NODE_ENV === 'production'): string {
  const secureFlag = isProduction ? '; Secure' : '';
  return `ts_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

/**
 * Extracts and verifies session from request cookie or Authorization header
 */
export function getSession(req: any): UserSession | null {
  const cookies = parseCookies(req.headers?.cookie);
  let token = cookies['ts_session'];

  // Optional Bearer token fallback for programmatic API clients
  if (!token && req.headers?.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Reusable middleware helper: Requires a valid authenticated session
 */
export function requireAuth(req: any, res: any): UserSession | null {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Access denied. A valid server-authenticated session is required.',
    });
    return null;
  }
  return session;
}

const ROLE_RANKS: Record<UserRole, number> = {
  CITIZEN: 1,
  OFFICER: 2,
  ADMIN: 3,
};

/**
 * Reusable middleware helper: Requires valid session with minimum specified role
 */
export function requireRole(req: any, res: any, minRole: 'OFFICER' | 'ADMIN'): UserSession | null {
  const session = requireAuth(req, res);
  if (!session) return null;

  const currentRank = ROLE_RANKS[session.role] || 0;
  const requiredRank = ROLE_RANKS[minRole] || 0;

  if (currentRank < requiredRank) {
    res.status(403).json({
      error: 'FORBIDDEN',
      message: `Access denied. Insufficient privileges. Required role: ${minRole}, active role: ${session.role}.`,
    });
    return null;
  }

  return session;
}

/**
 * Validates officer credentials against authorized registry
 */
export function authenticateOfficer(officerId: string, passcode: string): OfficialAccount | null {
  if (!officerId || !passcode) return null;
  const cleanId = officerId.trim().toUpperCase();
  const cleanPass = passcode.trim();

  const account = OFFICIAL_ACCOUNTS.find(
    (a) => a.officerId.toUpperCase() === cleanId && a.passcode === cleanPass
  );

  return account || null;
}
