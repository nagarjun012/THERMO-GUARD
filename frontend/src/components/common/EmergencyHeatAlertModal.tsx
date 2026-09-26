import React from 'react';
import { createPortal } from 'react-dom';
import {
  Flame,
  Phone,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  X,
  ShieldAlert,
  Mic,
  Square,
} from 'lucide-react';
import { HeatAlertPayload, speakEmergencyAdvisory, stopEmergencyAdvisory } from '../../services/notificationService';
import { useAppStore } from '../../stores/appStore';

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
  const language = useAppStore((s) => s.language);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  React.useEffect(() => {
    return () => {
      stopEmergencyAdvisory();
    };
  }, []);

  if (!isOpen || !alert) return null;

  const isExtreme = alert.level === 'Extreme';

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopEmergencyAdvisory();
      setIsSpeaking(false);
    } else {
      const speechText = `${alert.title}. ${alert.message}. Important actions: ${alert.actions.join('. ')}`;
      speakEmergencyAdvisory(speechText, language);
      setIsSpeaking(true);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      {/* BACKDROP BLUR WITH AMBIENT RISK GLOW */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-0 transition-opacity"
        onClick={onAcknowledge}
        aria-hidden="true"
      />

      {/* SAFE VIEWPORT CENTERING CONTAINER */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 py-12 sm:py-8 relative z-10 pointer-events-none">
        {/* ROCK-SOLID STABLE EMERGENCY DIALOG (NO JITTERING / MOVING) */}
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          className={`pointer-events-auto relative w-full max-w-lg my-auto rounded-3xl p-5 sm:p-8 shadow-2xl border-2 animate-fadeIn ${
            isExtreme
              ? 'bg-white border-red-500 shadow-[0_0_60px_rgba(239,68,68,0.25)]'
              : 'bg-white border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.2)]'
          }`}
        >
          {/* HEADER: SEVERITY BADGE + AUDIO/CLOSE TOGGLE */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2.5 rounded-2xl flex items-center justify-center shadow-md ${
                  isExtreme
                    ? 'bg-red-100 text-red-600 border border-red-300'
                    : 'bg-amber-100 text-amber-600 border border-amber-300'
                }`}
              >
                {isExtreme ? <ShieldAlert className="w-6 h-6" /> : <Flame className="w-6 h-6" />}
              </div>

              <div>
                <span
                  className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-0.5 ${
                    isExtreme ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {isExtreme ? 'CRITICAL EMERGENCY' : 'HIGH THERMAL STRESS'}
                </span>
                <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5 font-semibold">
                  <span className="truncate max-w-[180px] sm:max-w-[240px]">{alert.locationName}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-900">HTSS {alert.htss}/100</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Audible Voice Speech Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  isSpeaking
                    ? 'bg-blue-600 text-white shadow-md animate-pulse'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                }`}
                title={isSpeaking ? 'Stop voice reading' : 'Read advisory aloud'}
                aria-label={isSpeaking ? 'Stop voice reading' : 'Read advisory aloud'}
              >
                {isSpeaking ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isSpeaking ? 'Stop Voice' : 'Listen'}</span>
              </button>

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={onToggleAudio}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                title={isAudioEnabled ? 'Mute alert chime' : 'Enable alert chime'}
                aria-label={isAudioEnabled ? 'Mute alert chime' : 'Enable alert chime'}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onAcknowledge}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN MESSAGE */}
          <h2 id="alert-dialog-title" className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-950 mb-2 leading-snug">
            {alert.title}
          </h2>

          <p className="text-sm text-slate-700 leading-relaxed mb-5 font-medium">
            {alert.message}
          </p>

          {/* CRITICAL ACTIONS CHECKLIST */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 mb-5 space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Immediate Life-Safety Protocols:</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-800">
              {alert.actions.map((act, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                      isExtreme ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SPEED DIAL EMERGENCY SERVICES */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-red-600 hover:bg-red-700 font-mono text-xs font-black text-white transition-all shadow-md active:scale-98"
            >
              <Phone className="w-4 h-4" />
              <span>DIAL 108 (AMBULANCE)</span>
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-mono text-xs font-black text-white transition-all shadow-md active:scale-98"
            >
              <Phone className="w-4 h-4" />
              <span>DIAL 112 (DISASTER)</span>
            </a>
          </div>

          {/* PERMISSION REQUEST BANNER IF NOT GRANTED */}
          {permission === 'default' && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-blue-800">
                <Bell className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Enable OS push alerts for life-critical notifications</span>
              </div>
              <button
                type="button"
                onClick={onRequestPermission}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-[10px] uppercase font-mono tracking-wider cursor-pointer flex-shrink-0"
              >
                ENABLE
              </button>
            </div>
          )}

          {/* ACKNOWLEDGE BUTTON */}
          <button
            type="button"
            onClick={onAcknowledge}
            className={`w-full py-3.5 px-6 rounded-2xl font-mono text-sm font-black tracking-wider text-white transition-all cursor-pointer shadow-lg active:scale-98 ${
              isExtreme
                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300'
            }`}
          >
            I UNDERSTAND &amp; ACKNOWLEDGE (SNOOZE 30 MIN)
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
