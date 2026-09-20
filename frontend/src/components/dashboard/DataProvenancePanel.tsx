import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, Clock, MapPin, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import {
  DataProvenance,
  formatISTTimestamp,
  freshnessStatusColor,
  freshnessStatusEmoji,
} from '../../lib/dataProvenance';

interface Props {
  provenance: DataProvenance;
  compact?: boolean;
}

/**
 * Reusable Data Provenance Panel.
 * Shows data source, freshness status, timestamps, and API status.
 * Compact by default with an expandable detail view.
 */
export const DataProvenancePanel: React.FC<Props> = ({ provenance, compact = true }) => {
  const [expanded, setExpanded] = useState(!compact);
  const statusColor = freshnessStatusColor(provenance.freshnessStatus);
  const statusEmoji = freshnessStatusEmoji(provenance.freshnessStatus);

  const statusIcon = provenance.freshnessStatus === 'LIVE'
    ? <Wifi className="w-3 h-3" />
    : provenance.freshnessStatus === 'DATA_UNAVAILABLE'
    ? <WifiOff className="w-3 h-3" />
    : <AlertTriangle className="w-3 h-3" />;

  return (
    <div className="neu-card p-3 border border-white/5 rounded-xl text-xs font-mono">
      {/* Compact Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 cursor-pointer select-none"
        type="button"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Database className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="text-gray-400 flex-shrink-0">DATA SOURCE</span>
          <span className="text-gray-200 font-bold truncate">{provenance.source}</span>
          <span className="text-gray-600">•</span>
          <span className={`flex items-center gap-1 font-bold ${statusColor} flex-shrink-0`}>
            {statusIcon}
            <span>{provenance.freshnessStatus.replace('_', ' ')}</span>
          </span>
          {provenance.freshnessStatus === 'LIVE' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 flex-shrink-0">
          <Clock className="w-3 h-3" />
          <span>{formatISTTimestamp(provenance.lastUpdated)}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-[11px]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Source:</span>
              <span className="text-gray-200 font-bold">{provenance.source}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Status:</span>
              <span className={`font-bold ${statusColor}`}>
                {statusEmoji} {provenance.freshnessStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <span className="text-gray-500">Location:</span>
              <span className="text-gray-200 truncate">{provenance.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">API Status:</span>
              <span className={`font-bold ${
                provenance.apiStatus === 'SUCCESS' ? 'text-emerald-400' :
                provenance.apiStatus === 'FAILED' ? 'text-red-400' :
                provenance.apiStatus === 'TIMEOUT' ? 'text-yellow-400' :
                'text-orange-400'
              }`}>
                {provenance.apiStatus}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Weather Updated:</span>
              <span className="text-gray-200">{formatISTTimestamp(provenance.lastUpdated)}</span>
            </div>
            {provenance.calculationTime && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-500">Calculated:</span>
                <span className="text-gray-200">{formatISTTimestamp(provenance.calculationTime)}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Freshness:</span>
              <span className="text-gray-200">{provenance.freshnessLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500">Data Type:</span>
              <span className="text-gray-200">{provenance.dataType.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {provenance.errors && provenance.errors.length > 0 && (
            <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
              <div className="flex items-center gap-1 font-bold text-red-400 mb-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Validation Errors</span>
              </div>
              {provenance.errors.map((err, i) => (
                <div key={i} className="text-[10px] text-red-300/80">• {err}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
