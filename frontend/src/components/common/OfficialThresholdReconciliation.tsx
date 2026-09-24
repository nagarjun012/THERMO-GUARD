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
    <div className="bg-white/95 backdrop-blur-md rounded-[28px] border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)] overflow-hidden" role="region" aria-label={tr.threshold.title}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-[#EDF5FD]">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
          {tr.threshold.title}
        </h3>
        <p className="text-xs text-amber-900 mt-1 font-semibold">
          ⚠️ {tr.threshold.imdPriority}
        </p>
        {(currentTemp !== undefined || currentHtss !== undefined) && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs bg-white p-2.5 rounded-xl border border-blue-100/80 shadow-xs">
            <span className="text-slate-500 font-medium">Station Telemetry Check:</span>
            {currentTemp !== undefined && (
              <span className="font-bold text-slate-800 bg-[#EDF5FD] px-2.5 py-0.5 rounded-lg border border-blue-100/60">
                Air Temp: {currentTemp}°C
              </span>
            )}
            {currentHtss !== undefined && (
              <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                AI HTSS: {currentHtss}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Two-column comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-slate-100">
        {/* Official IMD */}
        <div className="p-6 space-y-3.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">{tr.threshold.imdTitle}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{tr.threshold.imdDesc}</p>
          <p className="text-[10px] text-slate-400 italic">{thresholds.reference}</p>

          {/* Plains thresholds */}
          <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80">
            <h5 className="text-xs font-bold text-slate-800 mb-2">{tr.threshold.plains}</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.heatwave}
                </span>
                <span className="text-slate-600">{thresholds.criteria.plains.heatwave}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.severeHeatwave}
                </span>
                <span className="text-slate-600">{thresholds.criteria.plains.severeHeatwave}</span>
              </div>
            </div>
          </div>

          {/* Coastal thresholds */}
          <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80">
            <h5 className="text-xs font-bold text-slate-800 mb-2">{tr.threshold.coastal}</h5>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.heatwave}
                </span>
                <span className="text-slate-600">{thresholds.criteria.coastal.heatwave}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-bold text-[10px] whitespace-nowrap">
                  {tr.threshold.severeHeatwave}
                </span>
                <span className="text-slate-600">{thresholds.criteria.coastal.severeHeatwave}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THERMOS AI HTSS */}
        <div className="p-6 space-y-3.5 border-t md:border-t-0 border-slate-100">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" aria-hidden="true" />
            <h4 className="text-sm font-bold text-slate-900">{tr.threshold.htssTitle}</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{tr.threshold.htssDesc}</p>

          {/* HTSS scale */}
          <div className="space-y-1.5">
            {[
              { range: '10 – 39', label: 'Low', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { range: '40 – 59', label: 'Moderate', color: 'bg-amber-50 text-amber-800 border-amber-200' },
              { range: '60 – 74', label: 'High', color: 'bg-orange-50 text-orange-800 border-orange-200' },
              { range: '75 – 99', label: 'Extreme', color: 'bg-red-50 text-red-800 border-red-200' },
            ].map((tier) => (
              <div key={tier.label} className="flex items-center gap-2 text-xs">
                <span className={`px-2.5 py-0.5 rounded-md border font-bold text-[10px] min-w-[70px] text-center ${tier.color}`}>
                  {tier.range}
                </span>
                <span className={`px-2 py-0.5 rounded-md border font-extrabold text-[10px] ${tier.color}`}>
                  {tier.label}
                </span>
              </div>
            ))}
          </div>

          {/* Model details */}
          <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 mt-2">
            <h5 className="text-xs font-bold text-slate-800 mb-1.5">Formula Weights</h5>
            {GOV_CONFIG.htssModel.formulas.map((f) => (
              <div key={f.name} className="flex items-center gap-2 text-xs text-slate-600 py-0.5">
                <span className="font-extrabold text-blue-700 min-w-[35px]">{(f.weight * 100).toFixed(0)}%</span>
                <span>{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
