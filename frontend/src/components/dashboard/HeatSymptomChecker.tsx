import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  HeartPulse,
  AlertTriangle,
  ShieldAlert,
  Phone,
  CheckCircle2,
  X,
  RefreshCw,
  Mic,
  Square,
} from 'lucide-react';
import { speakEmergencyAdvisory, stopEmergencyAdvisory, playEmergencyChime, triggerHapticAlert } from '../../services/notificationService';
import { useAppStore } from '../../stores/appStore';

interface Symptom {
  id: string;
  label: string;
  description: string;
  isCritical: boolean;
}

const SYMPTOM_LIST: Symptom[] = [
  // Critical Symptoms (Heat Stroke Indicators)
  {
    id: 'confusion',
    label: 'Confusion, Delirium, or Slurred Speech',
    description: 'Difficulty speaking clearly, disorientation, or unresponsiveness',
    isCritical: true,
  },
  {
    id: 'no_sweat',
    label: 'Hot, Dry Skin (Absence of Sweating)',
    description: 'Skin feels burning hot to touch with cessation of sweat despite extreme heat',
    isCritical: true,
  },
  {
    id: 'fainting',
    label: 'Loss of Consciousness or Fainting',
    description: 'Blacking out, falling, or experiencing seizures',
    isCritical: true,
  },
  {
    id: 'persistent_vomiting',
    label: 'Persistent Vomiting or Inability to Drink',
    description: 'Inability to keep fluids down, severe gastrointestinal distress',
    isCritical: true,
  },

  // Moderate Symptoms (Heat Exhaustion Indicators)
  {
    id: 'heavy_sweating',
    label: 'Heavy Profuse Sweating',
    description: 'Excessive perspiration soaking clothing',
    isCritical: false,
  },
  {
    id: 'dizziness',
    label: 'Dizziness, Lightheadedness, or Weakness',
    description: 'Feeling faint when standing, unsteadiness, or severe fatigue',
    isCritical: false,
  },
  {
    id: 'muscle_cramps',
    label: 'Muscle Spasms or Painful Cramps',
    description: 'Severe cramping in legs, calves, arms, or abdomen from salt loss',
    isCritical: false,
  },
  {
    id: 'headache',
    label: 'Throbbing Headache',
    description: 'Persistent frontal or temple pain worsening in direct sun',
    isCritical: false,
  },
  {
    id: 'rapid_pulse',
    label: 'Rapid, Weak Heartbeat',
    description: 'Noticeable heart racing with faint pulse',
    isCritical: false,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HeatSymptomChecker: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const language = useAppStore((s) => s.language);

  if (!isOpen) return null;

  const toggleSymptom = (id: string) => {
    const next = new Set(selectedSymptoms);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      const sym = SYMPTOM_LIST.find((s) => s.id === id);
      if (sym?.isCritical) {
        playEmergencyChime('Extreme');
        triggerHapticAlert('Extreme');
      }
    }
    setSelectedSymptoms(next);
  };

  const resetSymptoms = () => {
    setSelectedSymptoms(new Set());
    stopEmergencyAdvisory();
    setIsSpeaking(false);
  };

  const handleClose = () => {
    stopEmergencyAdvisory();
    setIsSpeaking(false);
    onClose();
  };

  // Triage Calculation
  const hasCritical = Array.from(selectedSymptoms).some(
    (id) => SYMPTOM_LIST.find((s) => s.id === id)?.isCritical
  );
  const moderateCount = Array.from(selectedSymptoms).filter(
    (id) => !SYMPTOM_LIST.find((s) => s.id === id)?.isCritical
  ).length;

  let triageStatus: 'SAFE' | 'EXHAUSTION' | 'STROKE_EMERGENCY' = 'SAFE';
  if (hasCritical) {
    triageStatus = 'STROKE_EMERGENCY';
  } else if (moderateCount >= 1) {
    triageStatus = 'EXHAUSTION';
  }

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopEmergencyAdvisory();
      setIsSpeaking(false);
      return;
    }

    let speechText = '';
    if (triageStatus === 'STROKE_EMERGENCY') {
      speechText =
        'Emergency Alert! Critical Heat Stroke detected. Call 108 Ambulance immediately! Move the person into shade, douse with cold water or ice packs on neck and armpits. Do not force drinks if unconscious.';
    } else if (triageStatus === 'EXHAUSTION') {
      speechText =
        'Heat Exhaustion Warning. Move to shade or air-conditioned area immediately. Drink cool water with electrolytes or ORS. Rest for 45 minutes. If symptoms worsen, call 108.';
    } else {
      speechText =
        'No dangerous heat symptoms selected. Keep drinking 250ml water every 30 minutes and stay alert in extreme temperatures.';
    }

    speakEmergencyAdvisory(speechText, language);
    setIsSpeaking(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-0 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 py-12 relative z-10 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          className="pointer-events-auto relative w-full max-w-2xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn"
        >
          {/* HEADER */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-red-400">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black font-mono tracking-tight">
                  HEAT ILLNESS CLINICAL TRIAGE
                </h2>
                <p className="text-xs text-blue-200">
                  Instant physiological symptom self-check for outdoor laborers &amp; citizens
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetSymptoms}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Reset Selection"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* TRIAGE RESULT BANNER */}
            {triageStatus === 'STROKE_EMERGENCY' && (
              <div
                className="p-5 rounded-2xl bg-red-600 text-white shadow-lg border-2 border-red-700 animate-pulse space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-6 h-6 shrink-0" />
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest bg-red-800 px-2 py-0.5 rounded font-black">
                        CRITICAL MEDICAL EMERGENCY
                      </span>
                      <h3 className="text-base sm:text-lg font-black mt-1">
                        HEAT STROKE SUSPECTED — CALL 108 IMMEDIATELY
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={handleReadAloud}
                    className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer shrink-0"
                  >
                    {isSpeaking ? <Square className="w-3.5 h-3.5 fill-red-700" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
                <p className="text-xs text-red-100 font-medium leading-relaxed">
                  Heat stroke is life-threatening. The body has lost its ability to regulate temperature. Immediate aggressive cooling is mandatory while waiting for the ambulance.
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="tel:108"
                    className="flex-1 min-w-[200px] py-3 px-4 rounded-xl bg-white text-red-700 hover:bg-red-50 font-black text-xs font-mono flex items-center justify-center gap-2 shadow-md"
                  >
                    <Phone className="w-4 h-4" /> DIAL 108 (EMERGENCY AMBULANCE)
                  </a>
                  <a
                    href="tel:112"
                    className="py-3 px-4 rounded-xl bg-red-900 hover:bg-red-950 text-white font-bold text-xs font-mono flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> DIAL 112
                  </a>
                </div>
              </div>
            )}

            {triageStatus === 'EXHAUSTION' && (
              <div className="p-5 rounded-2xl bg-amber-500 text-white shadow-lg border-2 border-amber-600 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest bg-amber-700 px-2 py-0.5 rounded font-black">
                        MODERATE RISK
                      </span>
                      <h3 className="text-base sm:text-lg font-black mt-1">
                        HEAT EXHAUSTION DETECTED
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={handleReadAloud}
                    className="px-3 py-1.5 rounded-xl bg-white text-amber-800 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer shrink-0"
                  >
                    {isSpeaking ? <Square className="w-3.5 h-3.5 fill-amber-800" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
                <p className="text-xs text-amber-50 font-medium leading-relaxed">
                  Move into shade or an air-conditioned room immediately. Drink cool water or ORS electrolyte water. Apply wet cloths to neck and forehead. Rest for 45 minutes.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold font-mono"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call 108 if not improved in 30 mins
                  </a>
                </div>
              </div>
            )}

            {triageStatus === 'SAFE' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black uppercase font-mono tracking-wider text-emerald-900">
                      NO CRITICAL SYMPTOMS SELECTED
                    </h4>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Select any symptoms you or your coworker are currently experiencing below to run instant clinical triage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SYMPTOM CHECKLIST */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-red-600 flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Red Flag Symptoms (Heat Stroke Risk):</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYMPTOM_LIST.filter((s) => s.isCritical).map((symptom) => {
                    const isChecked = selectedSymptoms.has(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-red-50 border-red-500 shadow-sm ring-2 ring-red-400/30'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer pointer-events-none"
                        />
                        <div>
                          <h4 className={`text-xs font-bold ${isChecked ? 'text-red-950' : 'text-slate-900'}`}>
                            {symptom.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {symptom.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-black uppercase tracking-wider text-amber-700 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Moderate Heat Exhaustion Symptoms:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SYMPTOM_LIST.filter((s) => !s.isCritical).map((symptom) => {
                    const isChecked = selectedSymptoms.has(symptom.id);
                    return (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isChecked
                            ? 'bg-amber-50 border-amber-500 shadow-sm ring-2 ring-amber-400/30'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer pointer-events-none"
                        />
                        <div>
                          <h4 className={`text-xs font-bold ${isChecked ? 'text-amber-950' : 'text-slate-900'}`}>
                            {symptom.label}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                            {symptom.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              {selectedSymptoms.size} symptom{selectedSymptoms.size === 1 ? '' : 's'} selected
            </span>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow transition"
            >
              Done &amp; Return
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
