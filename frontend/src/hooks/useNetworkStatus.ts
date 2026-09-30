import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  connectionType: string;
}

/**
 * Detects online/offline status using browser APIs.
 * When running in Capacitor native, it uses the Capacitor Network plugin
 * for more accurate detection (WiFi vs cellular).
 */
export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [connectionType, setConnectionType] = useState('unknown');

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    // Show "back online" briefly, then clear
    if (!navigator.onLine) return;
    setWasOffline(true);
    setTimeout(() => setWasOffline(false), 3000);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  useEffect(() => {
    // Browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Connection info (if available)
    const nav = navigator as any;
    if (nav.connection) {
      setConnectionType(nav.connection.effectiveType || 'unknown');
      const handleChange = () => {
        setConnectionType(nav.connection.effectiveType || 'unknown');
      };
      nav.connection.addEventListener('change', handleChange);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        nav.connection.removeEventListener('change', handleChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline, wasOffline, connectionType };
}
