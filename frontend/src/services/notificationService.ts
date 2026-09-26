/**
 * notificationService.ts
 *
 * Multi-channel emergency notification dispatch for High & Extreme HTSS thermal stress.
 * Integrates:
 * 1. Web Notification API (Native OS desktop/Android notification bubbles)
 * 2. Capacitor Haptics / Web Vibration API (Physical tactile alerts)
 * 3. Web Audio API (Synthesized emergency chime with zero external audio assets)
 *
 * 100% additive, non-disruptive, gracefully handles environments where permissions are denied.
 */

import { isNativePlatform } from '../utils/nativeApp';

export type AlertChannel = 'system' | 'haptic' | 'audio' | 'modal';

export interface HeatAlertPayload {
  level: 'High' | 'Extreme';
  htss: number;
  locationName: string;
  title: string;
  message: string;
  actions: string[];
  timestamp: number;
}

/** Check if Web Notification API is supported in the current environment */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/** Get the current browser notification permission status */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/** Request user permission for system-level notifications */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('[NotificationService] Permission request failed:', err);
    return Notification.permission;
  }
}

/**
 * Synthesize an emergency acoustic alert chime using Web Audio API.
 * High clarity two-tone pulse (D5 587Hz -> A5 880Hz).
 * Safe, completely client-side, zero MP3 assets needed.
 */
export function playEmergencyChime(severity: 'High' | 'Extreme' = 'High'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = severity === 'Extreme' ? 'sawtooth' : 'sine';
    osc2.type = 'sine';

    // Emergency two-tone frequency
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880.00, now + 0.15); // A5

    osc2.frequency.setValueAtTime(740.00, now + 0.05); // F#5

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(severity === 'Extreme' ? 0.35 : 0.2, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (severity === 'Extreme' ? 0.65 : 0.45));

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  } catch {
    // Audio autoplay restrictions or headless environment - gracefully ignore
  }
}

/**
 * Trigger physical haptic vibration warning.
 * Uses Capacitor Haptics on native builds and navigator.vibrate on web.
 */
export async function triggerHapticAlert(severity: 'High' | 'Extreme' = 'High'): Promise<void> {
  const pattern = severity === 'Extreme' ? [400, 150, 400, 150, 600] : [300, 150, 300];

  // Try Capacitor Haptics on mobile
  if (isNativePlatform()) {
    try {
      const { Haptics, NotificationType } = await import('@capacitor/haptics');
      await Haptics.notification({
        type: severity === 'Extreme' ? NotificationType.Error : NotificationType.Warning,
      });
      await Haptics.vibrate({ duration: severity === 'Extreme' ? 600 : 350 });
      return;
    } catch {
      // Fall through to browser vibration
    }
  }

  // Web Vibration API fallback
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignored
    }
  }
}

/**
 * Send an OS system notification bubble (desktop toast / Android status bar).
 * Safe no-op if permission is not granted.
 */
export function sendSystemNotification(payload: HeatAlertPayload): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const isExtreme = payload.level === 'Extreme';
    const notification = new Notification(payload.title, {
      body: payload.message,
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚨</text></svg>',
      tag: `htss-alert-${payload.level.toLowerCase()}`,
      requireInteraction: isExtreme,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (err) {
    console.warn('[NotificationService] System notification display error:', err);
    return false;
  }
}

/**
 * Construct alert payload formatted for High or Extreme HTSS risk.
 */
export function formatHeatAlertPayload(
  htss: number,
  locationName: string,
  level: 'High' | 'Extreme'
): HeatAlertPayload {
  const isExtreme = level === 'Extreme';

  if (isExtreme) {
    return {
      level: 'Extreme',
      htss,
      locationName,
      title: `🚨 CRITICAL HEAT EMERGENCY (HTSS: ${htss})`,
      message: `Extreme heat stress in ${locationName}. Life-threatening heat stroke danger. Mandatory outdoor work stoppage. Seek cooling centers immediately.`,
      actions: [
        'Mandatory outdoor work stoppage — do not perform physical exertion outdoors.',
        'Move indoors into air-conditioned spaces or designated public cooling centers.',
        'Drink cold oral rehydration solutions (ORS) or electrolyte water immediately.',
        'Check on elderly neighbors, infants, and high-risk individuals.',
        'Call 108 Ambulance immediately if anyone shows confusion, fainting, or cessation of sweating.',
      ],
      timestamp: Date.now(),
    };
  }

  return {
    level: 'High',
    htss,
    locationName,
    title: `⚠️ DANGEROUS HEAT ADVISORY (HTSS: ${htss})`,
    message: `High thermal stress in ${locationName}. Severe risk of heat exhaustion for outdoor workers, elders, and children. Take immediate precautions.`,
    actions: [
      'Avoid direct sun exposure, especially between 11:00 AM and 4:00 PM.',
      'Mandatory 15-minute rest breaks in shaded areas for every 45 minutes of activity.',
      'Drink 500ml of water or electrolyte fluids every hour even if not thirsty.',
      'Wear loose, light-colored cotton clothing and wide-brimmed hats.',
      'Monitor for early warning signs: dizziness, muscle cramps, and excessive thirst.',
    ],
    timestamp: Date.now(),
  };
}

/**
 * Audible Speech Synthesizer for illiterate / visually impaired citizens & outdoor laborers.
 * Automatically adapts speech language to Tamil ('ta-IN'), Hindi ('hi-IN'), or English ('en-IN').
 */
export function speakEmergencyAdvisory(text: string, lang: string = 'en'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'ta') {
      utterance.lang = 'ta-IN';
    } else if (lang === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('[NotificationService] Speech synthesis error:', err);
  }
}

/**
 * Stop any currently playing synthesized speech advisory.
 */
export function stopEmergencyAdvisory(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {}
}
