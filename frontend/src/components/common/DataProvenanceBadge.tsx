import React from 'react';
import { Activity, Clock, Database, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { translations } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

interface DataProvenanceBadgeProps {
  status: 'LIVE' | 'DELAYED' | 'HISTORICAL' | 'UNAVAILABLE';
  lastUpdated?: string | null;
  source?: string;
  compact?: boolean;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  status,
  lastUpdated,
  source,
  compact = false,
}) => {
  const { language } = useAppStore();
  const tr = translations[language];

  const statusConfig = {
    LIVE: {
      label: tr.provenance.liveData,
      color: 'bg-green-500/10 border-green-500/30 text-green-300',
      dotColor: 'bg-green-400',
      icon: Activity,
    },
    DELAYED: {
      label: tr.provenance.delayedData,
      color: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      dotColor: 'bg-amber-400',
      icon: Clock,
    },
    HISTORICAL: {
      label: tr.provenance.historicalData,
      color: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      dotColor: 'bg-blue-400',
      icon: Database,
    },
    UNAVAILABLE: {
      label: tr.provenance.unavailableData,
      color: 'bg-red-500/10 border-red-500/30 text-red-300',
      dotColor: 'bg-red-400',
      icon: AlertTriangle,
    },
  };

  const cfg = statusConfig[status];
  const IconComponent = cfg.icon;
  const displaySource = source || GOV_CONFIG.dataSources.weather.name;

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold ${cfg.color}`}
        role="status"
        aria-label={`Data status: ${cfg.label}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} ${status === 'LIVE' ? 'animate-pulse' : ''}`} />
        {cfg.label}
      </span>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 rounded-lg border text-xs ${cfg.color}`}
      role="status"
      aria-label={`Data status: ${cfg.label}`}
    >
      <span className="flex items-center gap-1.5 font-bold">
        <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} ${status === 'LIVE' ? 'animate-pulse' : ''}`} />
        {cfg.label}
      </span>

      <span className="text-gray-400">
        {tr.provenance.source}: <span className="text-gray-300">{displaySource}</span>
      </span>

      {lastUpdated && (
        <span className="text-gray-400">
          {tr.provenance.lastUpdated}: <span className="font-mono text-gray-300">{formatTime(lastUpdated)}</span>
        </span>
      )}

      <span className="text-gray-400">
        {tr.provenance.refreshRate}: <span className="font-mono text-gray-300">{GOV_CONFIG.dataSources.weather.refreshIntervalMinutes} {tr.provenance.minutes}</span>
      </span>

      {status === 'UNAVAILABLE' && (
        <span className="w-full text-red-300/80 mt-1">{tr.provenance.liveWeatherUnavailable}</span>
      )}

      {status === 'DELAYED' && (
        <span className="w-full text-amber-300/80 mt-1">{tr.provenance.staleWarning}</span>
      )}
    </div>
  );
};
