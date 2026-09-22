import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
} from 'lucide-react';
import { useIndustrialStore } from '../../stores/industrialStore';

export const AlertActionModal: React.FC = () => {
  const { activeAlertModal, openAlertModal, acknowledgeAlert, resolveAlert, escalateAlert } =
    useIndustrialStore();

  const [note, setNote] = useState('');
  const [operatorName] = useState('K. Raman (Safety Shift Lead)');

  if (!activeAlertModal) return null;

  const isCritical = activeAlertModal.severity === 'CRITICAL';

  const handleAcknowledge = () => {
    acknowledgeAlert(
      activeAlertModal.id,
      note.trim() || 'Visual and telemetry check completed. Protocols active.',
      operatorName
    );
    setNote('');
  };

  const handleResolve = () => {
    resolveAlert(
      activeAlertModal.id,
      note.trim() || 'Thermal levels restored below safe limit.',
      operatorName
    );
    setNote('');
  };

  const handleEscalate = () => {
    escalateAlert(
      activeAlertModal.id,
      note.trim() || 'Temperature sustained above critical threshold. Requesting immediate dispatch.'
    );
    setNote('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-industrial-850 border border-industrial-700 rounded-lg max-w-lg w-full shadow-2xl overflow-hidden text-industrial-100">
        {/* Header */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between ${
            isCritical
              ? 'bg-red-950/80 border-red-800 text-red-100'
              : 'bg-amber-950/80 border-amber-800 text-amber-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 text-red-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <div>
              <span className="text-xs font-mono font-bold tracking-wider uppercase block">
                {activeAlertModal.id} • {activeAlertModal.severity} ALERT
              </span>
              <span className="text-sm font-semibold">{activeAlertModal.zoneName}</span>
            </div>
          </div>

          <button
            onClick={() => openAlertModal(null)}
            className="p-1 rounded text-industrial-400 hover:text-industrial-100 hover:bg-black/20"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 space-y-4 text-xs">
          {/* Headline & Metrics */}
          <div className="p-3 rounded bg-industrial-900 border border-industrial-750 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-industrial-400 uppercase font-semibold">
                Detected Thermal Exceedance
              </div>
              <div className="text-sm font-semibold text-industrial-50 mt-0.5">
                {activeAlertModal.title}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xl font-bold text-amber-400">
                {activeAlertModal.reading.toFixed(1)}°C
              </div>
              <div className="text-[10px] text-industrial-400 font-mono">
                Threshold: {activeAlertModal.threshold.toFixed(1)}°C
              </div>
            </div>
          </div>

          {/* Location & Time details */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded bg-industrial-900/60 border border-industrial-750">
              <span className="text-industrial-400 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-industrial-400" /> Location
              </span>
              <span className="font-medium text-industrial-200">{activeAlertModal.zoneName}</span>
            </div>

            <div className="p-2.5 rounded bg-industrial-900/60 border border-industrial-750">
              <span className="text-industrial-400 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-industrial-400" /> Detected Time
              </span>
              <span className="font-medium text-industrial-200">{activeAlertModal.detectedAt}</span>
            </div>
          </div>

          {/* Recommended Operational Action */}
          <div className="p-3 rounded bg-amber-950/30 border border-amber-900/40 text-amber-200/90 text-[11px]">
            <span className="font-bold text-amber-300 block mb-1">RECOMMENDED STANDARD OPERATING PROCEDURE:</span>
            {activeAlertModal.recommendedAction}
          </div>

          {/* Operator Action Form */}
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] font-semibold text-industrial-300">
              Operator Log Note / Response Protocol:
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Inspecting coolant valve bypass. Rotating outdoor staff into recovery lounge..."
              className="w-full h-20 p-2.5 rounded bg-industrial-950 border border-industrial-700 text-xs text-industrial-100 placeholder-industrial-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between text-[11px] text-industrial-400">
            <span>
              Current Status:{' '}
              <strong className="text-industrial-200 font-mono">{activeAlertModal.status}</strong>
            </span>
            <span>
              Assigned: <strong className="text-industrial-200">{activeAlertModal.owner || 'Unassigned'}</strong>
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-industrial-900 border-t border-industrial-700 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <a
              href="tel:108"
              className="px-2.5 py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 flex items-center gap-1.5 font-medium transition-colors"
              title="Call Emergency Services"
            >
              <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              <span>Call 108 / 112</span>
            </a>

            <button
              onClick={handleEscalate}
              className="px-2.5 py-1.5 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-300 border border-industrial-700 transition-colors"
            >
              Escalate Alert
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeAlertModal.status === 'ACTIVE' ? (
              <button
                onClick={handleAcknowledge}
                className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-industrial-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Acknowledge Protocol</span>
              </button>
            ) : (
              <button
                onClick={handleResolve}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-industrial-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
