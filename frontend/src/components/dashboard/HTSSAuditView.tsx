import React from 'react';
import { createPortal } from 'react-dom';
import { X, Bug, ArrowDown, CheckCircle2 } from 'lucide-react';
import { HTSSCalculationAudit } from '../../lib/htssEngine';
import { formatISTTimestamp } from '../../lib/dataProvenance';

interface Props {
  audit: HTSSCalculationAudit;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full HTSS Audit/Debug View Modal.
 * Shows the complete calculation pipeline from raw API input to final risk classification.
 * Intended for government users and evaluator demonstrations.
 */
export const HTSSAuditView: React.FC<Props> = ({ audit, isOpen, onClose }) => {
  if (!isOpen) return null;

  const { inputs, thermalIndicators, normalization, contributions, result, factorDecomposition } = audit;

  const modal = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto bg-white/98 backdrop-blur-2xl border border-blue-200/90 rounded-3xl p-5 sm:p-8 shadow-[0_24px_70px_rgba(15,23,42,0.25)] text-slate-800 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 border border-slate-200 transition-colors cursor-pointer"
          type="button"
          aria-label="Close Audit View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-10">
          <div className="p-2 bg-orange-50 border border-orange-200 rounded-xl text-orange-600 flex-shrink-0">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-mono text-slate-950 tracking-tight">
              HTSS AUDIT / DEBUG VIEW
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Transparent biometeorological formula verification pipeline
            </p>
          </div>
        </div>

        <div className="space-y-3.5 sm:space-y-4 text-xs font-sans">
          {/* 1. RAW API INPUT */}
          <PipelineStep
            step={1}
            title="Raw API Input"
            status="success"
            content={
              <div className="grid grid-cols-2 gap-2.5">
                <AuditField label="Temperature" value={`${inputs.temperature} °C`} />
                <AuditField label="Humidity" value={`${inputs.humidity} %`} />
                <AuditField label="Wind Speed" value={`${inputs.windSpeed} km/h`} />
                <AuditField label="Solar Radiation" value={`${inputs.solarRadiation} W/m²`} />
              </div>
            }
          />

          <PipelineArrow />

          {/* 2. THERMAL INDICATORS */}
          <PipelineStep
            step={2}
            title="Thermal Indicators"
            status="success"
            content={
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <AuditField label="Wet Bulb (Stull 2011)" value={`${thermalIndicators.wetBulbTemp} °C`} />
                <AuditField label="Outdoor WBGT (Liljegren)" value={`${thermalIndicators.outdoorWBGT} °C`} />
                <AuditField label="UTCI" value={`${thermalIndicators.utci} °C`} />
                <AuditField label="Heat Index (NOAA)" value={`${thermalIndicators.heatIndex} °C`} />
                <AuditField label="Humidex (Canadian)" value={`${thermalIndicators.humidex}`} />
              </div>
            }
          />

          <PipelineArrow />

          {/* 3. NORMALIZATION */}
          <PipelineStep
            step={3}
            title="Normalization (0–100 Scale)"
            status="success"
            content={
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>n_wbgt = clamp((WBGT − 20) / 15 × 100, 0, 100)</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg font-black">{normalization.n_wbgt}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>n_utci = clamp((UTCI − 20) / 25 × 100, 0, 100)</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg font-black">{normalization.n_utci}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>n_temp = clamp((Temp − 20) / 25 × 100, 0, 100)</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg font-black">{normalization.n_temp}</span>
                </div>
              </div>
            }
          />

          <PipelineArrow />

          {/* 4. WEIGHTED CONTRIBUTIONS */}
          <PipelineStep
            step={4}
            title="Weighted Contributions"
            status="success"
            content={
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs font-mono text-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>WBGT (45%): 0.45 × {normalization.n_wbgt}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-black">{contributions.wbgtContribution}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>UTCI (35%): 0.35 × {normalization.n_utci}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-black">{contributions.utciContribution}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span>Temp (20%): 0.20 × {normalization.n_temp}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-black">{contributions.tempContribution}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-slate-900">
                  <span>Raw sum:</span>
                  <span className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-black">{contributions.rawWeightedSum}</span>
                </div>
              </div>
            }
          />

          <PipelineArrow />

          {/* 5. FINAL HTSS SCORE */}
          <PipelineStep
            step={5}
            title="Final HTSS Score"
            status="success"
            content={
              <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
                  {result.htss} <span className="text-sm text-slate-400 font-bold">/ 100</span>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                    result.riskCategory === 'EXTREME' ? 'text-purple-800 border-purple-300 bg-purple-50' :
                    result.riskCategory === 'HIGH' ? 'text-red-800 border-red-300 bg-red-50' :
                    result.riskCategory === 'MODERATE' ? 'text-amber-800 border-amber-300 bg-amber-50' :
                    'text-emerald-800 border-emerald-300 bg-emerald-50'
                  }`}>
                    {result.riskCategory}
                  </span>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                    Clamped to [10, 99] range
                  </div>
                </div>
              </div>
            }
          />

          <PipelineArrow />

          {/* 6. FACTOR DECOMPOSITION */}
          <PipelineStep
            step={6}
            title="Factor Decomposition"
            status="success"
            content={
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5">
                {factorDecomposition.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-700 w-24 text-xs font-bold truncate">{f.factor}:</span>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-500"
                        style={{ width: `${f.contribution}%` }}
                      />
                    </div>
                    <span className="text-slate-900 font-black w-10 text-right text-xs font-mono">{f.contribution}%</span>
                  </div>
                ))}
              </div>
            }
          />

          {/* Metadata */}
          <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1 font-medium">
            <div>Data Source: <strong className="text-slate-700">{audit.dataSource}</strong></div>
            <div>Calculated At: <strong className="text-slate-700">{formatISTTimestamp(audit.calculatedAt)}</strong></div>
            <div>Engine: <strong className="text-slate-700">Stull &amp; Liljegren Psychrometric Thermodynamic Engine</strong></div>
            <div>Score Type: <strong className="text-slate-700">Deterministic — verified pure meteorological physics</strong></div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
};

function PipelineStep({ step, title, status, content }: {
  step: number; title: string; status: 'success' | 'error'; content: React.ReactNode;
}) {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-[10px] font-black text-blue-800">
          {step}
        </span>
        <span className="text-slate-900 font-black uppercase tracking-wider text-xs">{title}</span>
        {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
      </div>
      {content}
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 text-blue-400" />
    </div>
  );
}

function AuditField({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
      <div className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{label}</div>
      <div className="text-slate-950 font-black text-xs sm:text-sm mt-0.5 font-mono">{value}</div>
    </div>
  );
}
