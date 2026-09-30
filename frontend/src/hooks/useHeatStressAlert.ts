/**
 * useHeatStressAlert.ts
 *
 * Automated detection, anti-spam cooldown, and multi-channel dispatch hook for HTSS High and Extreme levels.
 *
 * Trigger Rules:
 * - High: HTSS >= 60 and < 75
 * - Extreme: HTSS >= 75
 *
 * Cooldown Protection:
 * - 30-minute suppression per location to avoid spamming the user.
 * - Escalation Bypass: If HTSS escalates from High to Extreme during cooldown,
 *   cooldown is immediately bypassed to deliver the life-critical emergency alert.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  HeatAlertPayload,
  formatHeatAlertPayload,
  sendSystemNotification,
  playEmergencyChime,
  triggerHapticAlert,
  getNotificationPermission,
  requestNotificationPermission,
} from '../services/notificationService';

const SNOOZE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface CooldownRecord {
  timestamp: number;
  level: 'High' | 'Extreme';
  location: string;
}

export function useHeatStressAlert(
  htssScore: number | null | undefined,
  locationName: string = 'Current Location'
) {
  const [activeAlert, setActiveAlert] = useState<HeatAlertPayload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(getNotificationPermission());
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Store last alert in ref to persist during renders
  const lastAlertRef = useRef<CooldownRecord | null>(null);
  const snoozedUntilRef = useRef<number>(0);

  // Refresh permission status on mount
  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  /**
   * Core dispatch function: triggers system notification, haptics, audio chime, and modal.
   */
  const dispatchAlert = useCallback(
    (level: 'High' | 'Extreme', score: number, bypassCooldown = false) => {
      const now = Date.now();
      const last = lastAlertRef.current;
      const isUpgrade = last?.level === 'High' && level === 'Extreme';

      // Check anti-spam cooldown and user snooze
      if (!bypassCooldown && !isUpgrade) {
        if (now < snoozedUntilRef.current) {
          return;
        }

        if (last) {
          const isSameLoc =
            last.location === locationName ||
            last.location.toLowerCase().includes(locationName.toLowerCase()) ||
            locationName.toLowerCase().includes(last.location.toLowerCase());

          const elapsed = now - last.timestamp;
          if (isSameLoc && elapsed < SNOOZE_DURATION_MS) {
            return;
          }
        }
      }

      const payload = formatHeatAlertPayload(score, locationName, level);

      // Record this alert in cooldown registry
      lastAlertRef.current = {
        timestamp: now,
        level,
        location: locationName,
      };

      // 1. In-App Emergency Modal
      setActiveAlert(payload);
      setIsModalOpen(true);

      // 2. OS System Notification
      sendSystemNotification(payload);

      // 3. Audio Chime (if enabled)
      if (isAudioEnabled) {
        playEmergencyChime(level);
      }

      // 4. Mobile Haptics
      triggerHapticAlert(level);
    },
    [locationName, isAudioEnabled]
  );

  /**
   * Monitor real-time HTSS score changes and trigger when entering High or Extreme.
   */
  useEffect(() => {
    if (htssScore === null || htssScore === undefined) return;

    if (htssScore >= 75) {
      dispatchAlert('Extreme', htssScore);
    } else if (htssScore >= 60) {
      dispatchAlert('High', htssScore);
    } else {
      // Below 60 (Low or Moderate): strictly NO emergency alert
      setActiveAlert(null);
      setIsModalOpen(false);
    }
  }, [htssScore, dispatchAlert]);

  /**
   * User acknowledges and dismisses the alert (starts standard snooze)
   */
  const acknowledgeAlert = useCallback(() => {
    snoozedUntilRef.current = Date.now() + SNOOZE_DURATION_MS;
    setIsModalOpen(false);
  }, []);

  /**
   * User requests system notification permissions
   */
  const enableSystemNotifications = useCallback(async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    return res;
  }, []);

  /**
   * Manual test trigger for testing or demonstrations
   */
  const triggerTestAlert = useCallback(
    (level: 'High' | 'Extreme' = 'High') => {
      const testScore = level === 'Extreme' ? 82 : 68;
      dispatchAlert(level, testScore, true);
    },
    [dispatchAlert]
  );

  /**
   * Re-open the current alert modal or launch alert advisory
   */
  const openAlertModal = useCallback(() => {
    if (activeAlert) {
      setIsModalOpen(true);
    } else if (htssScore && htssScore >= 60) {
      dispatchAlert(htssScore >= 75 ? 'Extreme' : 'High', htssScore, true);
    } else {
      triggerTestAlert('High');
    }
  }, [activeAlert, htssScore, dispatchAlert, triggerTestAlert]);

  return {
    activeAlert,
    isModalOpen,
    openAlertModal,
    acknowledgeAlert,
    permission,
    enableSystemNotifications,
    triggerTestAlert,
    isAudioEnabled,
    setIsAudioEnabled,
  };
}
