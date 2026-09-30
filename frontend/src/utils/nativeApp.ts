/**
 * Native app initialization utilities for Capacitor.
 * Handles StatusBar, Keyboard, BackButton, and SplashScreen configuration
 * when running as a native iOS/Android app.
 *
 * In web mode, all calls are no-ops.
 */

import { API_CONFIG } from '../config/apiConfig';

/** Check if running inside Capacitor native shell */
export function isNativePlatform(): boolean {
  return API_CONFIG.isNative;
}

/** Get the current platform (ios | android | web) */
export function getNativePlatform(): 'ios' | 'android' | 'web' {
  return API_CONFIG.platform;
}

/**
 * Initialize native features.
 * Safe to call on web — it's a no-op when Capacitor isn't present.
 */
export async function initNativeApp(): Promise<void> {
  if (!isNativePlatform()) return;

  try {
    // Configure StatusBar
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#A5D2FC' });

    if (getNativePlatform() === 'android') {
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (e) {
    console.warn('[Native] StatusBar init skipped:', e);
  }

  try {
    // Configure Keyboard behavior
    const { Keyboard } = await import('@capacitor/keyboard');
    await Keyboard.setScroll({ isDisabled: false });
    await Keyboard.setAccessoryBarVisible({ isVisible: true });
  } catch (e) {
    console.warn('[Native] Keyboard init skipped:', e);
  }

  try {
    // Hide splash screen after app is ready
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (e) {
    console.warn('[Native] SplashScreen init skipped:', e);
  }

  try {
    // Handle hardware back button on Android
    const { App: CapApp } = await import('@capacitor/app');
    CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        // On the root page, minimize the app instead of closing
        CapApp.minimizeApp();
      }
    });
  } catch (e) {
    console.warn('[Native] BackButton handler skipped:', e);
  }
}

/**
 * Trigger a haptic impact feedback.
 * No-op on web or if haptics plugin is unavailable.
 */
export async function hapticImpact(style: 'Light' | 'Medium' | 'Heavy' = 'Light'): Promise<void> {
  if (!isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle[style] });
  } catch {}
}
