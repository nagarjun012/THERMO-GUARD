import React from 'react';
import { ShieldCheck, Brain, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { translations } from '../../i18n/translations';
import { GOV_CONFIG } from '../../config/governmentConfig';

interface OfficialThresholdReconciliationProps {
  currentTemp?: number;
  currentHtss?: number;
}

export const OfficialThresholdReconciliation: React.FC<OfficialThresholdReconciliationProps> = ({
  currentTemp,
  currentHtss,
}) => {
  const { language } = useAppStore();
  const tr = translations[language];
  const thresholds = GOV_CONFIG.officialThresholds;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden" role="region" aria-label={tr.threshold.title}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-r from-amber-500/5 to-transparent">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
          {tr.threshold.title}
        </h3>
        <p className="text-xs text-amber-300 mt-1 font-semibold">
          ⚠️ {tr.threshold.imdPriority}
        </p>
        {(currentTemp !== undefined || currentHtss !== undefined) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs bg-white/5 p-2 rounded-lg border border-white/5">
            <span className="text-gray-400">Current Station Values:</span>
            {currentTemp !== undefined && (
              <span className="font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded border border-white/10">
                Temp: {currentTemp}°C
              </span>
            )}
            {currentHtss !== undefined && (
              <span className="font-mono font-bold text-amber-300 bg-black/30 px-2 py-0.5 rounded border border-amber-500/20">
                AI HTSS: {currentHtss}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-white/5">
        {/* Official IMD */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" aria-hidden="true" />
            <h4 className="text-sm font-bold text-green-300">{tr.threshold.imdTitle}</h4>
          </div>
          <p className="text-xs text-gray-400">{tr.threshold.imdDesc}</p>
          <p className="text-[10px] text-gray-500 italic">{thresholds.reference}</p>

          {/* Plains thresholds */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <h5 className="text-xs font-bold text-gray-300 mb-1.5">{tr.threshold.plains}</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-300 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.heatwave}
                </span>
                <span className="text-gray-400">{thresholds.criteria.plains.heatwave}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.severeHeatwave}
                </span>
                <span className="text-gray-400">{thresholds.criteria.plains.severeHeatwave}</span>
              </div>
            </div>
          </div>

          {/* Coastal thresholds */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
            <h5 className="text-xs font-bold text-gray-300 mb-1.5">{tr.threshold.coastal}</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-orange-300 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.heatwave}
                </span>
                <span className="text-gray-400">{thresholds.criteria.coastal.heatwave}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-300 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.severeHeatwave}
                </span>
                <span className="text-gray-400">{thresholds.criteria.coastal.severeHeatwave}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THERMOS AI HTSS */}
        <div className="p-5 space-y-3 border-t md:border-t-0 border-white/5">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" aria-hidden="true" />
            <h4 className="text-sm font-bold text-blue-300">{tr.threshold.htssTitle}</h4>
          </div>
          <p className="text-xs text-gray-400">{tr.threshold.htssDesc}</p>

          {/* HTSS scale */}
          <div className="space-y-1.5">
            {[
              { range: '10 – 39', label: 'Low', color: 'bg-green-500/10 border-green-500/20 text-green-300' },
              { range: '40 – 59', label: 'Moderate', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' },
              { range: '60 – 74', label: 'High', color: 'bg-orange-500/10 border-orange-500/20 text-orange-300' },
              { range: '75 – 99', label: 'Extreme', color: 'bg-red-500/10 border-red-500/20 text-red-300' },
            ].map((tier) => (
              <div key={tier.label} className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded border font-mono font-bold text-[10px] min-w-[70px] text-center ${tier.color}`}>
                  {tier.range}
                </span>
                <span className={`px-1.5 py-0.5 rounded border font-bold text-[10px] ${tier.color}`}>
                  {tier.label}
                </span>
              </div>
            ))}
          </div>

          {/* Model details */}
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 mt-2">
            <h5 className="text-xs font-bold text-gray-300 mb-1.5">Formula Weights</h5>
            {GOV_CONFIG.htssModel.formulas.map((f) => (
              <div key={f.name} className="flex items-center gap-2 text-xs text-gray-400 py-0.5">
                <span className="font-mono font-bold text-blue-300 min-w-[35px]">{(f.weight * 100).toFixed(0)}%</span>
                <span>{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
