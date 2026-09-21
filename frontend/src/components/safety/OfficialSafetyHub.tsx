import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  Activity,
  HeartPulse,
  Users,
  CheckCircle2,
  ChevronRight,
  Sun,
  Thermometer,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { TRANSLATIONS } from '../../i18n/translations';

export const OfficialSafetyHub: React.FC = () => {
  const { language } = useAppStore();
  const t = TRANSLATIONS[language] ?? TRANSLATIONS.en;
  const [selectedTier, setSelectedTier] = useState<'low' | 'moderate' | 'high' | 'extreme'>('high');

  const tierColors = {
    low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', badge: 'bg-emerald-500 text-slate-950' },
    moderate: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', badge: 'bg-amber-500 text-slate-950' },
    high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500 text-slate-950' },
    extreme: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', badge: 'bg-red-500 text-white' },
  };

  const riskTiers = {
    low: {
      label: t.safety.lowTitle,
      description: 'Normal Precautions (HTSS < 40) — Minimal thermal stress for the general public.',
      advice: t.safety.lowActions.join(' '),
    },
    moderate: {
      label: t.safety.moderateTitle,
      description: 'Increased Vigilance (HTSS 40–59) — Heightened awareness for sensitive groups and workers.',
      advice: t.safety.moderateActions.join(' '),
    },
    high: {
      label: t.safety.highTitle,
      description: 'High Danger (HTSS 60–74) — Serious risk of heat exhaustion with prolonged exposure.',
      advice: t.safety.highActions.join(' '),
    },
    extreme: {
      label: t.safety.extremeTitle,
      description: 'Life-Threatening Emergency (HTSS ≥ 75) — Extreme heat illness risk for entire population.',
      advice: t.safety.extremeActions.join(' '),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-xs tracking-wide uppercase">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>National Disaster Management Guidelines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.safety.title}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            {t.safety.subtitle}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="tel:108"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 108 (Ambulance)</span>
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Call 112 (Disaster / Police)</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4-Tier Interactive Advisory Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            Heat Risk Advisory Tiers &amp; Protective Measures
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Select tier to view specific instructions
          </span>
        </div>

        {/* Tier Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['low', 'moderate', 'high', 'extreme'] as const).map((tierKey) => {
            const isSelected = selectedTier === tierKey;
            const tierData = riskTiers[tierKey];
            const cfg = tierColors[tierKey];

            return (
              <button
                key={tierKey}
                onClick={() => setSelectedTier(tierKey)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${cfg.bg} ${cfg.border} ring-2 ring-amber-400/40 shadow-lg`
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>
                    {tierKey}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-sm font-semibold text-white truncate">{tierData.label}</div>
              </button>
            );
          })}
        </div>

        {/* Active Tier Instruction Card */}
        <div className={`p-6 rounded-2xl border ${tierColors[selectedTier].bg} ${tierColors[selectedTier].border} space-y-3`}>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase ${tierColors[selectedTier].badge}`}>
              {selectedTier} RISK LEVEL
            </span>
            <h3 className="text-base font-bold text-white">
              {riskTiers[selectedTier].label}
            </h3>
          </div>
          <p className="text-sm text-slate-300">
            {riskTiers[selectedTier].description}
          </p>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              Prescribed Action Directive
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {riskTiers[selectedTier].advice}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Diagnosis: Heat Exhaustion vs. Heatstroke */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-400" />
          Clinical Recognition: Heat Exhaustion vs. Heatstroke
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heat Exhaustion Card */}
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Early Warning Phase
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{t.symptoms.exhaustionTitle}</h3>
              </div>
              <Thermometer className="w-6 h-6 text-amber-400" />
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {t.symptoms.exhaustionSymptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-amber-300">Immediate Action: </strong>
              Move to a cool or air-conditioned area immediately, loosen tight clothing, apply cool wet towels, and sip cool water.
            </div>
          </div>

          {/* Heatstroke Card */}
          <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-red-600 animate-pulse" />
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white animate-pulse">
                  CRITICAL EMERGENCY
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{t.symptoms.heatstrokeTitle}</h3>
              </div>
              <Activity className="w-6 h-6 text-red-400" />
            </div>

            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              {t.symptoms.heatstrokeSymptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 leading-relaxed font-semibold">
              <strong className="text-white uppercase">Critical Protocol: </strong>
              {t.symptoms.heatstrokeWarning}
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Heatstroke First Aid Protocol */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{t.firstAid.title}</h3>
            <p className="text-xs text-slate-400">{t.firstAid.subtitle} (Call 108)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.firstAid.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerable Groups Guide */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          {t.vulnerable.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.vulnerable.groups.map((grp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5"
            >
              <h4 className="text-sm font-semibold text-white">{grp.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{grp.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
