import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Info } from 'lucide-react';
import { formatISTTimestamp } from '../../lib/dataProvenance';

interface Props {
  temperature: number;
  humidity: number;
  windSpeed: number;
  solarRadiation: number;
  htss: number;
  riskCategory: string;
  wbgt: number;
  utci: number;
  heatIndex: number;
  humidex?: number;
  wetBulbTemp?: number;
  dataTimestamp?: string | null;
}

/**
 * HTSS Calculation Details Panel.
 * Shows the inputs, formula, and intermediate values used to compute the current HTSS score.
 * Expandable — collapsed by default for normal users.
 */
export const HTSSDetailPanel: React.FC<Props> = ({
  temperature, humidity, windSpeed, solarRadiation,
  htss, riskCategory, wbgt, utci, heatIndex, humidex, wetBulbTemp,
  dataTimestamp,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Recompute normalization values for display
  const n_wbgt = Math.round(Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100)) * 10) / 10;
  const n_utci = Math.round(Math.min(100, Math.max(0, ((utci - 20) / 25) * 100)) * 10) / 10;
  const n_temp = Math.round(Math.min(100, Math.max(0, ((temperature - 20) / 25) * 100)) * 10) / 10;

  return (
    <div className="neu-card p-4 rounded-xl border border-white/5">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 cursor-pointer select-none"
        type="button"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">
            HTSS Calculation Details
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 font-bold">
            {htss}/100 — {riskCategory}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Info className="w-3 h-3" />
          <span>{expanded ? 'Hide' : 'Show'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 text-xs font-mono animate-fadeIn">
          {/* Calculation Inputs */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Calculation Inputs (from Open-Meteo API)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <InputPill label="Temperature" value={`${temperature} °C`} />
              <InputPill label="Rel. Humidity" value={`${humidity} %`} />
              <InputPill label="Wind Speed" value={`${windSpeed} km/h`} />
              <InputPill label="Solar Radiation" value={`${solarRadiation} W/m²`} />
            </div>
          </div>

          {/* Thermal Indicators */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Thermal Indicators (Computed)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {wetBulbTemp !== undefined && <InputPill label="Wet Bulb" value={`${wetBulbTemp} °C`} />}
              <InputPill label="WBGT" value={`${wbgt} °C`} />
              <InputPill label="UTCI" value={`${utci} °C`} />
              <InputPill label="Heat Index" value={`${heatIndex} °C`} />
              {humidex !== undefined && <InputPill label="Humidex" value={`${humidex}`} />}
            </div>
          </div>

          {/* Formula */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              HTSS Formula
            </h4>
            <div className="p-3 rounded-xl bg-dark-950/60 border border-white/5 space-y-1.5 text-[11px]">
              <div className="text-gray-400">
                1. Normalize: <span className="text-cyan-300">n_wbgt</span> = (WBGT − 20) / 15 × 100 = <span className="text-white font-bold">{n_wbgt}</span>
              </div>
              <div className="text-gray-400">
                2. Normalize: <span className="text-cyan-300">n_utci</span> = (UTCI − 20) / 25 × 100 = <span className="text-white font-bold">{n_utci}</span>
              </div>
              <div className="text-gray-400">
                3. Normalize: <span className="text-cyan-300">n_temp</span> = (Temp − 20) / 25 × 100 = <span className="text-white font-bold">{n_temp}</span>
              </div>
              <div className="pt-1 border-t border-white/5 text-gray-300">
                <span className="text-orange-400 font-bold">HTSS</span> = 0.45 × {n_wbgt} + 0.35 × {n_utci} + 0.20 × {n_temp}
                = <span className="text-white font-black text-sm">{htss}</span>
              </div>
            </div>
          </div>

          {/* Risk Thresholds */}
          <div>
            <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Risk Thresholds
            </h4>
            <div className="flex flex-wrap gap-2">
              <ThresholdPill label="LOW" range="< 40" active={htss < 40} color="text-emerald-400 border-emerald-500/30" />
              <ThresholdPill label="MODERATE" range="40–59" active={htss >= 40 && htss < 60} color="text-yellow-400 border-yellow-500/30" />
              <ThresholdPill label="HIGH" range="60–74" active={htss >= 60 && htss < 75} color="text-orange-400 border-orange-500/30" />
              <ThresholdPill label="EXTREME" range="≥ 75" active={htss >= 75} color="text-red-400 border-red-500/30" />
            </div>
          </div>

          {/* Data Timestamp */}
          {dataTimestamp && (
            <div className="text-[10px] text-gray-500 pt-2 border-t border-white/5">
              Calculated from weather data updated at: <span className="text-gray-300">{formatISTTimestamp(dataTimestamp)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function InputPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2.5 py-1.5 rounded-lg bg-dark-950/60 border border-white/5">
      <div className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</div>
      <div className="text-sm text-white font-bold">{value}</div>
    </div>
  );
}

function ThresholdPill({ label, range, active, color }: { label: string; range: string; active: boolean; color: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${
      active ? `${color} bg-white/5 shadow-sm` : 'text-gray-600 border-white/5'
    }`}>
      {label} ({range}) {active && '← Current'}
    </span>
  );
}
