import React, { useState } from 'react';
import {
  Shield,
  Thermometer,
  Heart,
  Phone,
  AlertTriangle,
  Users,
  Stethoscope,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { translations } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

export type RiskTierKey = 'low' | 'moderate' | 'high' | 'extreme';

interface TierColorConfig {
  bg: string;
  border: string;
  text: string;
  badge: string;
  dot: string;
  ring: string;
}

export const OfficialSafetyHub: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language] ?? translations.en;
  const [selectedTier, setSelectedTier] = useState<RiskTierKey>('high');

  const tierColors: Record<RiskTierKey, TierColorConfig> = {
    low: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-300',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      ring: 'ring-emerald-400/40',
    },
    moderate: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-300',
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      dot: 'bg-yellow-400',
      ring: 'ring-yellow-400/40',
    },
    high: {
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
      text: 'text-orange-300',
      badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      dot: 'bg-orange-400',
      ring: 'ring-orange-400/40',
    },
    extreme: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-300',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400',
      ring: 'ring-rose-400/40',
    },
  };

  const riskTiers: Record<RiskTierKey, {
    title: string;
    actions: readonly string[];
    riskLabel: string;
    icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
    severity: string;
  }> = {
    low: {
      title: tr.safety.lowTitle,
      actions: tr.safety.lowActions,
      riskLabel: tr.risk.low,
      icon: Shield,
      severity: 'Normal Precautions (HTSS < 40)',
    },
    moderate: {
      title: tr.safety.moderateTitle,
      actions: tr.safety.moderateActions,
      riskLabel: tr.risk.moderate,
      icon: Thermometer,
      severity: 'Increased Vigilance (HTSS 40–59)',
    },
    high: {
      title: tr.safety.highTitle,
      actions: tr.safety.highActions,
      riskLabel: tr.risk.high,
      icon: AlertTriangle,
      severity: 'High Danger (HTSS 60–74)',
    },
    extreme: {
      title: tr.safety.extremeTitle,
      actions: tr.safety.extremeActions,
      riskLabel: tr.risk.extreme,
      icon: ShieldAlert,
      severity: 'Life-Threatening Emergency (HTSS ≥ 75)',
    },
  };

  const activeTierData = riskTiers[selectedTier];
  const activeCfg = tierColors[selectedTier];
  const ActiveIcon = activeTierData.icon;

  return (
    <div className="space-y-6" role="region" aria-label={tr.safety.title}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" aria-hidden="true" />
            {tr.safety.title}
          </h2>
          <p className="text-sm text-gray-300 mt-1">{tr.safety.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold w-fit">
          <Phone className="w-3.5 h-3.5 animate-pulse" />
          <span>National Emergency: 112 / 108</span>
        </div>
      </div>

      {/* ── Interactive 4-Tier Selector Tabs ───────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Select Heat Risk Level to View Actions
          </h3>
          <span className="text-[11px] text-gray-400">Click a tier to inspect protocols</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(['low', 'moderate', 'high', 'extreme'] as const).map((tierKey) => {
            const isSelected = selectedTier === tierKey;
            const tierData = riskTiers[tierKey];
            const cfg = tierColors[tierKey];

            return (
              <button
                key={tierKey}
                type="button"
                onClick={() => setSelectedTier(tierKey)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? `${cfg.bg} ${cfg.border} ring-2 ring-amber-400/40 shadow-lg`
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
                aria-pressed={isSelected}
                aria-label={`${tierData.riskLabel} safety actions`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>
                    {tierKey}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-sm font-semibold text-white truncate">
                  {tierData.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Selected Tier Detail Panel ───────────────────────────── */}
      <div
        className={`rounded-2xl border ${activeCfg.border} ${activeCfg.bg} p-6 space-y-4 transition-all`}
        role="region"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${activeCfg.badge}`}>
              <ActiveIcon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md border text-xs font-bold ${activeCfg.badge}`}>
                  {activeTierData.riskLabel}
                </span>
                <span className="text-xs text-gray-400">{activeTierData.severity}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{activeTierData.title}</h3>
            </div>
          </div>
          <span className="text-xs font-medium text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
            Mandatory Advisory
          </span>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Action Protocols for this Level:
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeTierData.actions.map((action, i) => (
              <li
                key={i}
                className="text-xs text-gray-200 flex items-start gap-2.5 p-3 rounded-xl bg-black/20 border border-white/5"
              >
                <span className="w-5 h-5 rounded-full bg-white/10 text-amber-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Vulnerable Populations Grid ─────────────────────────────────── */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6" role="region" aria-label={tr.vulnerable.title}>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-purple-400" aria-hidden="true" />
          <h3 className="text-base font-bold text-white">{tr.vulnerable.title}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">{tr.vulnerable.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tr.vulnerable.groups.map((g, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors">
              <h4 className="text-xs font-bold text-purple-200">{g.name}</h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{g.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Symptoms Matrix: Heat Exhaustion vs Heatstroke ──────────────── */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden" role="region" aria-label={tr.symptoms.title}>
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            {tr.symptoms.title}
          </h3>
          <span className="text-[11px] text-gray-400">Clinical Distinction</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {/* Heat Exhaustion */}
          <div className="p-5 space-y-3">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" aria-hidden="true" />
              {tr.symptoms.exhaustionTitle}
            </h4>
            <p className="text-xs text-gray-400">Mild to moderate heat illness. Immediate rest and cooling required.</p>
            <ul className="space-y-1.5">
              {tr.symptoms.exhaustionSymptoms.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-amber-400/60 mt-0.5 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Heatstroke */}
          <div className="p-5 space-y-3 bg-red-500/[0.02]">
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" aria-hidden="true" />
              {tr.symptoms.heatstrokeTitle}
            </h4>
            <p className="text-xs text-red-300/80 font-medium">Life-threatening medical emergency! Brain damage or death may occur.</p>
            <ul className="space-y-1.5">
              {tr.symptoms.heatstrokeSymptoms.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-red-400/60 mt-0.5 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-200">
              ⚠️ {tr.symptoms.heatstrokeWarning}
            </div>
          </div>
        </div>
      </div>

      {/* ── First Aid ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6" role="region" aria-label={tr.firstAid.title}>
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          <h3 className="text-base font-bold text-white">{tr.firstAid.title}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">{tr.firstAid.subtitle}</p>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
          {tr.firstAid.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-gray-200 p-3 rounded-xl bg-black/20 border border-white/5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
          <h4 className="text-xs font-bold text-red-300 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            Strictly Prohibited Actions (Do NOT):
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tr.firstAid.doNotDo.map((item, i) => (
              <li key={i} className="text-xs text-red-200/80 flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Emergency Helplines ─────────────────────────────────────────── */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6" role="region" aria-label={tr.emergency.title}>
        <div className="flex items-center gap-2 mb-1">
          <Phone className="w-5 h-5 text-red-400" aria-hidden="true" />
          <h3 className="text-base font-bold text-white">{tr.emergency.title}</h3>
        </div>
        <p className="text-xs text-gray-400 mb-2">{tr.emergency.subtitle}</p>
        <p className="text-xs text-red-300 font-semibold mb-4">{tr.emergency.callImmediately}</p>

        {/* Helpline grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {GOV_CONFIG.emergencyHelplines.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="flex flex-col items-center p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 transition-all text-center group cursor-pointer"
              aria-label={`Call ${h.label} at ${h.number}`}
            >
              <span className="text-2xl font-mono font-bold text-red-200 group-hover:scale-105 transition-transform">{h.number}</span>
              <span className="text-xs text-red-300/80 mt-1">{h.label}</span>
            </a>
          ))}
        </div>

        {/* When to seek emergency care */}
        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
          <h4 className="text-xs font-bold text-white mb-2">{tr.emergency.seekMedical}</h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tr.emergency.seekMedicalConditions.map((c, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
