import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Phone,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  X,
  ShieldAlert,
} from 'lucide-react';
import { HeatAlertPayload } from '../../services/notificationService';

interface Props {
  alert: HeatAlertPayload | null;
  isOpen: boolean;
  onAcknowledge: () => void;
  permission: NotificationPermission | 'unsupported';
  onRequestPermission: () => Promise<NotificationPermission | 'unsupported'>;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
}

export const EmergencyHeatAlertModal: React.FC<Props> = ({
  alert,
  isOpen,
  onAcknowledge,
  permission,
  onRequestPermission,
  isAudioEnabled,
  onToggleAudio,
}) => {
  if (!isOpen || !alert) return null;

  const isExtreme = alert.level === 'Extreme';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* BACKDROP BLUR WITH AMBIENT RISK GLOW */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onAcknowledge}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* EMERGENCY DIALOG MODAL */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-2 overflow-hidden z-10 ${
            isExtreme
              ? 'bg-slate-950/95 border-red-500/90 shadow-[0_0_80px_rgba(239,68,68,0.4)]'
              : 'bg-slate-950/95 border-amber-500/90 shadow-[0_0_80px_rgba(245,158,11,0.35)]'
          }`}
        >
          {/* AMBIENT RADAR PULSE IN BACKGROUND */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-2xl">
            <div
              className={`w-full h-full rounded-full ${
                isExtreme ? 'bg-red-500 animate-pulse' : 'bg-amber-500 animate-pulse'
              }`}
            />
          </div>

          {/* HEADER: SEVERITY BADGE + AUDIO/CLOSE TOGGLE */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className={`relative p-2.5 rounded-2xl flex items-center justify-center shadow-lg ${
                  isExtreme ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {/* Ping wave */}
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-2xl opacity-75 ${
                    isExtreme ? 'bg-red-500' : 'bg-amber-500'
                  }`}
                />
                {isExtreme ? <ShieldAlert className="w-6 h-6 relative z-10" /> : <Flame className="w-6 h-6 relative z-10" />}
              </div>

              <div>
                <span
                  className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-0.5 ${
                    isExtreme ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {isExtreme ? 'CRITICAL EMERGENCY' : 'HIGH THERMAL STRESS'}
                </span>
                <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <span>{alert.locationName}</span>
                  <span>•</span>
                  <span className="font-bold text-white">HTSS {alert.htss}/100</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={onToggleAudio}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title={isAudioEnabled ? 'Mute alert chime' : 'Enable alert chime'}
                aria-label={isAudioEnabled ? 'Mute alert chime' : 'Enable alert chime'}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onAcknowledge}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN MESSAGE */}
          <h2 id="alert-dialog-title" className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white mb-2 leading-snug">
            {alert.title}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed mb-5 font-medium">
            {alert.message}
          </p>

          {/* CRITICAL ACTIONS CHECKLIST */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-5 space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Immediate Life-Safety Protocols:</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-200">
              {alert.actions.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      isExtreme ? 'bg-red-400' : 'bg-amber-400'
                    }`}
                  />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EMERGENCY HELPLINES SPEED-DIAL */}
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>DIAL 108 (AMBULANCE)</span>
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-md active:scale-95 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>DIAL 112 (DISASTER)</span>
            </a>
          </div>

          {/* BROWSER NOTIFICATION OPT-IN (IF NOT GRANTED) */}
          {permission !== 'granted' && permission !== 'unsupported' && (
            <div className="mb-5 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-blue-200">
                <Bell className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Get background push alerts when tab is closed:</span>
              </div>
              <button
                type="button"
                onClick={onRequestPermission}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-[11px] shrink-0 cursor-pointer transition-colors"
              >
                ENABLE
              </button>
            </div>
          )}

          {/* ACKNOWLEDGE BUTTON */}
          <button
            type="button"
            onClick={onAcknowledge}
            className={`w-full py-3.5 px-6 rounded-2xl font-mono text-sm font-black tracking-wider text-slate-950 transition-all cursor-pointer shadow-lg active:scale-95 ${
              isExtreme
                ? 'bg-gradient-to-r from-red-400 to-amber-400 hover:from-red-300 hover:to-amber-300'
                : 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200'
            }`}
          >
            I UNDERSTAND &amp; ACKNOWLEDGE (SNOOZE 30 MIN)
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
