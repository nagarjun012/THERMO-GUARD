/**
 * Environment-aware API configuration.
 *
 * In web (local dev + Vercel production) the API is same-origin,
 * so the base URL is empty string ''.
 *
 * In native (Capacitor) builds the web view is served from
 * capacitor://localhost (iOS) or http://localhost (Android),
 * so API calls must be directed to the production server.
 */

// Detect if running inside a Capacitor native shell
function isNativeApp(): boolean {
  try {
    return (
      typeof (window as any).Capacitor !== 'undefined' &&
      (window as any).Capacitor.isNativePlatform?.() === true
    );
  } catch {
    return false;
  }
}

function getPlatform(): 'ios' | 'android' | 'web' {
  try {
    const cap = (window as any).Capacitor;
    if (cap?.getPlatform) {
      return cap.getPlatform() as 'ios' | 'android' | 'web';
    }
  } catch {}
  return 'web';
}

/**
 * Returns the base URL for all /api/* calls.
 *
 * - Web (dev/prod): '' (same origin)
 * - Native (Capacitor): the production Vercel URL
 */
export function getApiBaseUrl(): string {
  if (isNativeApp()) {
    // In native mode, API calls go to the deployed Vercel backend.
    // This env var is set at build time via Vite's `define` or `.env`.
    return (
      import.meta.env.VITE_API_BASE_URL ||
      'https://thermosafe.vercel.app'
    );
  }
  // Web mode: same origin (empty string works for both dev and prod)
  return '';
}

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  isNative: isNativeApp(),
  platform: getPlatform(),
  timeout: 15000,
  retryCount: 2,
} as const;
