import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  authenticateOfficer,
  signSessionToken,
  buildSessionCookieHeader,
  UserSession,
} from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are supported.' });
  }

  const { role, officerId, passcode, citizenName } = req.body || {};

  // Case A: Citizen login (Public informational access)
  if (role === 'user' || role === 'CITIZEN' || (!officerId && citizenName)) {
    const now = Date.now();
    const session: UserSession = {
      userId: `CITIZEN-${now}`,
      role: 'CITIZEN',
      name: citizenName?.trim() || 'Citizen User',
      issuedAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000, // 24 hours
    };

    const token = signSessionToken(session);
    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', buildSessionCookieHeader(token, isProduction));
    return res.status(200).json({
      status: 'authenticated',
      role: session.role,
      user: {
        userId: session.userId,
        name: session.name,
        role: session.role,
      },
    });
  }

  // Case B: Government / Disaster Officer login
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

  // Validate credentials server-side against authorized registry
  const verifiedAccount = authenticateOfficer(officerId, passcode);
  if (!verifiedAccount) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Authentication failed. Invalid Officer ID or Security Passcode.',
    });
  }

  const now = Date.now();
  const session: UserSession = {
    userId: verifiedAccount.officerId,
    role: verifiedAccount.role,
    name: verifiedAccount.name,
    department: verifiedAccount.department,
    issuedAt: now,
    expiresAt: now + 8 * 60 * 60 * 1000, // 8 hours
  };

  const token = signSessionToken(session);
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', buildSessionCookieHeader(token, isProduction));

  return res.status(200).json({
    status: 'authenticated',
    role: session.role === 'ADMIN' ? 'gov' : 'gov',
    userRole: session.role,
    user: {
      userId: session.userId,
      name: session.name,
      department: session.department,
      role: session.role,
    },
  });
}
