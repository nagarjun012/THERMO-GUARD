import React from 'react';
import { Shield, Thermometer, Heart, Phone, AlertTriangle, Users, Stethoscope, Cross } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { translations } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

export const OfficialSafetyHub: React.FC = () => {
  const { language } = useAppStore();
  const tr = translations[language];

  const tierConfig = [
    { key: 'low' as const, title: tr.safety.lowTitle, actions: tr.safety.lowActions, borderColor: 'border-green-500/30', bgColor: 'bg-green-500/5', badgeColor: 'bg-green-500/10 text-green-300 border-green-500/30', icon: Shield, riskLabel: tr.risk.low },
    { key: 'moderate' as const, title: tr.safety.moderateTitle, actions: tr.safety.moderateActions, borderColor: 'border-yellow-500/30', bgColor: 'bg-yellow-500/5', badgeColor: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30', icon: Thermometer, riskLabel: tr.risk.moderate },
    { key: 'high' as const, title: tr.safety.highTitle, actions: tr.safety.highActions, borderColor: 'border-orange-500/30', bgColor: 'bg-orange-500/5', badgeColor: 'bg-orange-500/10 text-orange-300 border-orange-500/30', icon: AlertTriangle, riskLabel: tr.risk.high },
    { key: 'extreme' as const, title: tr.safety.extremeTitle, actions: tr.safety.extremeActions, borderColor: 'border-red-500/30', bgColor: 'bg-red-500/5', badgeColor: 'bg-red-500/10 text-red-300 border-red-500/30', icon: AlertTriangle, riskLabel: tr.risk.extreme },
  ];

  return (
    <div className="space-y-6" role="region" aria-label={tr.safety.title}>
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cross className="w-5 h-5 text-red-400" aria-hidden="true" />
          {tr.safety.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1">{tr.safety.subtitle}</p>
      </div>

      {/* ── 4-Tier Safety Actions ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tierConfig.map((tier) => (
          <div
            key={tier.key}
            className={`rounded-xl border ${tier.borderColor} ${tier.bgColor} p-4 space-y-2`}
            role="region"
            aria-label={tier.riskLabel}
          >
            <div className="flex items-center gap-2">
              <tier.icon className="w-4 h-4" aria-hidden="true" />
              <span className={`px-2 py-0.5 rounded-md border text-xs font-bold ${tier.badgeColor}`}>
                {tier.riskLabel}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">{tier.title}</h3>
            <ul className="space-y-1.5">
              {tier.actions.map((action, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-gray-500 mt-0.5 shrink-0">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Vulnerable Groups ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5" role="region" aria-label={tr.vulnerable.title}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Users className="w-4 h-4 text-purple-400" aria-hidden="true" />
          {tr.vulnerable.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{tr.vulnerable.subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tr.vulnerable.groups.map((g, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <h4 className="text-xs font-bold text-gray-200">{g.name}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{g.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Symptoms: Heat Exhaustion vs Heatstroke ───────────────────── */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden" role="region" aria-label={tr.symptoms.title}>
        <div className="px-5 py-3 border-b border-white/10">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            {tr.symptoms.title}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {/* Heat Exhaustion */}
          <div className="p-4">
            <h4 className="text-xs font-bold text-amber-300 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
              {tr.symptoms.exhaustionTitle}
            </h4>
            <ul className="space-y-1">
              {tr.symptoms.exhaustionSymptoms.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-amber-400/60 mt-0.5 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Heatstroke */}
          <div className="p-4">
            <h4 className="text-xs font-bold text-red-300 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" aria-hidden="true" />
              {tr.symptoms.heatstrokeTitle}
            </h4>
            <ul className="space-y-1">
              {tr.symptoms.heatstrokeSymptoms.map((s, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-red-400/60 mt-0.5 shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-bold text-red-300 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              ⚠️ {tr.symptoms.heatstrokeWarning}
            </p>
          </div>
        </div>
      </div>

      {/* ── First Aid ─────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5" role="region" aria-label={tr.firstAid.title}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          {tr.firstAid.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{tr.firstAid.subtitle}</p>

        <ol className="space-y-2 mb-4">
          {tr.firstAid.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-[10px] shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
          <h4 className="text-xs font-bold text-red-300 mb-1.5">❌ Do NOT:</h4>
          <ul className="space-y-1">
            {tr.firstAid.doNotDo.map((item, i) => (
              <li key={i} className="text-xs text-red-200/70 flex items-start gap-2">
                <span className="text-red-400/60 mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Emergency Information ─────────────────────────────────────── */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5" role="region" aria-label={tr.emergency.title}>
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Phone className="w-4 h-4 text-red-400" aria-hidden="true" />
          {tr.emergency.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{tr.emergency.subtitle}</p>
        <p className="text-xs text-red-300 font-semibold mb-3">{tr.emergency.callImmediately}</p>

        {/* Helpline grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
          {GOV_CONFIG.emergencyHelplines.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number}`}
              className="flex flex-col items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors text-center"
              aria-label={`Call ${h.label} at ${h.number}`}
            >
              <span className="text-lg font-mono font-bold text-red-200">{h.number}</span>
              <span className="text-[10px] text-red-300/70 mt-0.5">{h.label}</span>
            </a>
          ))}
        </div>

        {/* When to seek medical attention */}
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
          <h4 className="text-xs font-bold text-white mb-2">{tr.emergency.seekMedical}</h4>
          <ul className="space-y-1">
            {tr.emergency.seekMedicalConditions.map((c, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                <span className="text-red-400/60 mt-0.5 shrink-0">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
