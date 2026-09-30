import { AuthRole } from '../stores/appStore';

export interface SessionResponse {
  isAuthenticated: boolean;
  role: AuthRole;
  officerId?: string;
  department?: string;
}

export const authService = {
  async login(govId: string, department: string): Promise<{ success: boolean; role: AuthRole }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ govId, department }),
    });

    if (!res.ok) {
      throw new Error('Authentication failed');
    }

    return res.json();
  },

  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  async getSession(): Promise<SessionResponse> {
    try {
      const res = await fetch('/api/auth/session');
      if (res.ok) {
        return await res.json();
      }
      return { isAuthenticated: false, role: 'user' };
    } catch (e) {
      return { isAuthenticated: false, role: 'user' };
    }
  }
};
