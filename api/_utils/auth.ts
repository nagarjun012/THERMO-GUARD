import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cookie from 'cookie';
import { SignJWT, jwtVerify } from 'jose';

// JWT Secret - ideally from environment variables
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_for_thermosafe_auth_2026'
);

export const COOKIE_NAME = 'thermosafe_session';

export interface SessionPayload {
  role: 'gov' | 'admin';
  officerId: string;
  department: string;
  [key: string]: any;
}

/**
 * Creates a signed JWT session cookie
 */
export async function createSessionCookie(payload: SessionPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h') // Session expires in 8 hours
    .sign(JWT_SECRET);

  return cookie.serialize(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 60 * 60, // 8 hours in seconds
  });
}

/**
 * Parses and verifies the session cookie from the request
 */
export async function verifySession(req: VercelRequest): Promise<SessionPayload | null> {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookie.parse(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null; // Invalid or expired token
  }
}

/**
 * Middleware-like function to require authentication
 */
export async function requireAuth(req: VercelRequest, res: VercelResponse): Promise<SessionPayload | null> {
  const session = await verifySession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: No valid session found' });
    return null;
  }
  return session;
}

/**
 * Middleware-like function to require a specific role
 */
export async function requireRole(req: VercelRequest, res: VercelResponse, role: 'gov' | 'admin'): Promise<SessionPayload | null> {
  const session = await requireAuth(req, res);
  if (!session) return null;

  if (session.role !== role && session.role !== 'admin') {
    // Admin has access to gov routes, but gov doesn't have access to admin
    res.status(403).json({ error: 'Forbidden: Insufficient role permissions' });
    return null;
  }

  return session;
}
