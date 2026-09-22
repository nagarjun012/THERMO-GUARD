import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';
import { useIndustrialStore } from '../../stores/industrialStore';
import { useNavigate } from 'react-router-dom';

export const CriticalAlertBanner: React.FC = () => {
  const { alerts, openAlertModal } = useIndustrialStore();
  const navigate = useNavigate();

  // Find most severe active alert
  const activeCriticalAlert = alerts.find(
    (a) => (a.severity === 'CRITICAL' || a.severity === 'WARNING') && a.status === 'ACTIVE'
  );

  if (!activeCriticalAlert) {
    return null;
  }

  const isCritical = activeCriticalAlert.severity === 'CRITICAL';

  return (
    <div
      role="alert"
      className={`border-b px-4 py-2.5 transition-colors duration-200 ${
        isCritical
          ? 'bg-red-950/90 border-red-700/60 text-red-100'
          : 'bg-amber-950/80 border-amber-700/50 text-amber-100'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Left: Icon, severity, zone, and metrics */}
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded flex items-center justify-center shrink-0 ${
              isCritical ? 'bg-red-900/60 text-red-300' : 'bg-amber-900/60 text-amber-300'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-4 h-4 animate-pulse text-red-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                isCritical
                  ? 'bg-red-900 text-red-200 border border-red-600'
                  : 'bg-amber-900 text-amber-200 border border-amber-600'
              }`}
            >
              {activeCriticalAlert.severity}
            </span>
            <span className="font-semibold text-industrial-50">{activeCriticalAlert.zoneName}:</span>
            <span className="text-industrial-200">{activeCriticalAlert.title}</span>
            <span className="font-mono tabular-nums text-industrial-50 font-bold bg-industrial-900/70 px-1.5 py-0.5 rounded border border-industrial-700">
              {activeCriticalAlert.reading.toFixed(1)}°C
            </span>
            <span className="text-industrial-400">
              (Limit: {activeCriticalAlert.threshold.toFixed(1)}°C)
            </span>
            <span className="text-industrial-400">• Detected {activeCriticalAlert.detectedAt}</span>
          </div>
        </div>

        {/* Right: Operational Actions */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => openAlertModal(activeCriticalAlert)}
            className="px-2.5 py-1 rounded bg-industrial-800 hover:bg-industrial-700 text-industrial-100 border border-industrial-600 font-medium transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-industrial-300" />
            <span>Acknowledge</span>
          </button>

          <button
            onClick={() => navigate('/zones')}
            className="px-2.5 py-1 rounded bg-industrial-850 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 transition-colors flex items-center gap-1"
          >
            <span>View Zone</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <a
            href="tel:108"
            className="px-2 py-1 rounded bg-red-900/40 hover:bg-red-800/60 text-red-200 border border-red-700/60 transition-colors flex items-center gap-1"
            title="Emergency Medical Services Hotline"
          >
            <PhoneCall className="w-3 h-3 text-red-400" />
            <span className="font-mono">108</span>
          </a>
        </div>
      </div>
    </div>
  );
};
