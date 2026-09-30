import React from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

/**
 * Floating banner that appears when the device goes offline
 * and briefly shows a "back online" confirmation when connectivity returns.
 */
export const OfflineBanner: React.FC = () => {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${
        !isOnline
          ? 'translate-y-0'
          : wasOffline
          ? 'translate-y-0'
          : '-translate-y-full'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-bold ${
          !isOnline
            ? 'bg-red-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>No internet connection — showing cached data</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Back online</span>
          </>
        )}
      </div>
    </div>
  );
};
