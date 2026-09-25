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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto neu-card border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl bg-gradient-to-b from-dark-800 to-dark-900 my-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          type="button"
          aria-label="Close Audit View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
          <h2 className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
            HTSS AUDIT / DEBUG VIEW
          </h2>
        </div>

        <div className="space-y-3.5 sm:space-y-5 text-[11px] sm:text-xs font-mono">
          {/* Pipeline Visualization */}
          <PipelineStep
            step={1}
            title="Raw API Input"
            status="success"
            content={
              <div className="grid grid-cols-2 gap-2">
                <AuditField label="Temperature" value={`${inputs.temperature} °C`} />
                <AuditField label="Humidity" value={`${inputs.humidity} %`} />
                <AuditField label="Wind Speed" value={`${inputs.windSpeed} km/h`} />
                <AuditField label="Solar Radiation" value={`${inputs.solarRadiation} W/m²`} />
              </div>
            }
          />

          <PipelineArrow />

          <PipelineStep
            step={2}
            title="Thermal Indicators"
            status="success"
            content={
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <AuditField label="Wet Bulb (Stull 2011)" value={`${thermalIndicators.wetBulbTemp} °C`} />
                <AuditField label="Outdoor WBGT (Liljegren)" value={`${thermalIndicators.outdoorWBGT} °C`} />
                <AuditField label="UTCI" value={`${thermalIndicators.utci} °C`} />
                <AuditField label="Heat Index (NOAA)" value={`${thermalIndicators.heatIndex} °C`} />
                <AuditField label="Humidex (Canadian)" value={`${thermalIndicators.humidex}`} />
              </div>
            }
          />

          <PipelineArrow />

          <PipelineStep
            step={3}
            title="Normalization (0–100 Scale)"
            status="success"
            content={
              <div className="space-y-1.5 break-words">
                <div className="text-gray-400">
                  n_wbgt = clamp((WBGT − 20) / 15 × 100, 0, 100) = <span className="text-white font-bold">{normalization.n_wbgt}</span>
                </div>
                <div className="text-gray-400">
                  n_utci = clamp((UTCI − 20) / 25 × 100, 0, 100) = <span className="text-white font-bold">{normalization.n_utci}</span>
                </div>
                <div className="text-gray-400">
                  n_temp = clamp((Temp − 20) / 25 × 100, 0, 100) = <span className="text-white font-bold">{normalization.n_temp}</span>
                </div>
              </div>
            }
          />

          <PipelineArrow />

          <PipelineStep
            step={4}
            title="Weighted Contributions"
            status="success"
            content={
              <div className="space-y-1.5 break-words">
                <div className="text-gray-400">
                  WBGT (45%): 0.45 × {normalization.n_wbgt} = <span className="text-cyan-300 font-bold">{contributions.wbgtContribution}</span>
                </div>
                <div className="text-gray-400">
                  UTCI (35%): 0.35 × {normalization.n_utci} = <span className="text-cyan-300 font-bold">{contributions.utciContribution}</span>
                </div>
                <div className="text-gray-400">
                  Temp (20%): 0.20 × {normalization.n_temp} = <span className="text-cyan-300 font-bold">{contributions.tempContribution}</span>
                </div>
                <div className="pt-1.5 border-t border-white/5 text-gray-300">
                  Raw sum = <span className="text-white font-bold">{contributions.rawWeightedSum}</span>
                </div>
              </div>
            }
          />

          <PipelineArrow />

          <PipelineStep
            step={5}
            title="Final HTSS Score"
            status="success"
            content={
              <div className="flex items-center gap-4">
                <div className="text-2xl sm:text-3xl font-black text-orange-400">
                  {result.htss}<span className="text-base sm:text-lg text-gray-500">/100</span>
                </div>
                <div>
                  <span className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold border ${
                    result.riskCategory === 'EXTREME' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                    result.riskCategory === 'HIGH' ? 'text-orange-400 border-orange-500/30 bg-orange-500/10' :
                    result.riskCategory === 'MODERATE' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                    'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  }`}>
                    {result.riskCategory}
                  </span>
                  <div className="text-[10px] text-gray-500 mt-1">
                    Clamped to [10, 99] range
                  </div>
                </div>
              </div>
            }
          />

          <PipelineArrow />

          <PipelineStep
            step={6}
            title="Factor Decomposition"
            status="success"
            content={
              <div className="space-y-2">
                {factorDecomposition.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-400 w-20 sm:w-24 text-[11px] sm:text-xs truncate">{f.factor}:</span>
                    <div className="flex-1 h-2.5 sm:h-3 bg-dark-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                        style={{ width: `${f.contribution}%` }}
                      />
                    </div>
                    <span className="text-white font-bold w-9 sm:w-10 text-right text-[11px] sm:text-xs">{f.contribution}%</span>
                  </div>
                ))}
              </div>
            }
          />

          {/* Metadata */}
          <div className="pt-4 border-t border-white/10 text-[10px] text-gray-500 space-y-1">
            <div>Data Source: <span className="text-gray-300">{audit.dataSource}</span></div>
            <div>Calculated At: <span className="text-gray-300">{formatISTTimestamp(audit.calculatedAt)}</span></div>
            <div>Engine: <span className="text-gray-300">Stull & Liljegren Psychrometric Thermodynamic Engine</span></div>
            <div>Score Type: <span className="text-gray-300">Deterministic — same inputs always produce same HTSS</span></div>
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
    <div className="p-3 rounded-xl bg-dark-950/40 border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[9px] font-bold text-orange-400">
          {step}
        </span>
        <span className="text-gray-200 font-bold uppercase tracking-wider text-[11px]">{title}</span>
        {status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-auto" />}
      </div>
      {content}
    </div>
  );
}

function PipelineArrow() {
  return (
    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 text-gray-600" />
    </div>
  );
}

function AuditField({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1.5 rounded-lg bg-dark-800/50 border border-white/5">
      <div className="text-[9px] text-gray-500 uppercase">{label}</div>
      <div className="text-white font-bold">{value}</div>
    </div>
  );
}
