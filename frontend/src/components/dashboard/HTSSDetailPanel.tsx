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

export const HTSSDetailPanel: React.FC<Props> = ({
  temperature, humidity, windSpeed, solarRadiation,
  htss, riskCategory, wbgt, utci, heatIndex, humidex, wetBulbTemp,
  dataTimestamp,
}) => {
  const [expanded, setExpanded] = useState(false);

  const n_wbgt = Math.round(Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100)) * 10) / 10;
  const n_utci = Math.round(Math.min(100, Math.max(0, ((utci - 20) / 25) * 100)) * 10) / 10;
  const n_temp = Math.round(Math.min(100, Math.max(0, ((temperature - 20) / 25) * 100)) * 10) / 10;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[26px] p-5 sm:p-6 border border-white/90 shadow-[0_10px_30px_rgba(30,100,200,0.06)]">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2 cursor-pointer select-none text-left"
        type="button"
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-2 rounded-xl bg-[#EDF5FD] text-blue-600 border border-blue-100/80 shadow-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            HTSS Biometeorology Formula &amp; Audit Trace
          </span>
          <span className="text-[11px] px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 font-extrabold shadow-xs">
            {htss}/100 — {riskCategory}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold px-3 py-1 rounded-full bg-[#EDF5FD] border border-blue-100/60">
          <Info className="w-3.5 h-3.5" />
          <span>{expanded ? 'Hide Details' : 'View Formula'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="mt-5 space-y-4 text-xs animate-fadeIn border-t border-slate-100 pt-4">
          {/* Calculation Inputs */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">
              Calculation Inputs (Open-Meteo Multi-Model Telemetry)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <InputPill label="Temperature" value={`${temperature} °C`} />
              <InputPill label="Rel. Humidity" value={`${humidity} %`} />
              <InputPill label="Wind Speed" value={`${windSpeed} km/h`} />
              <InputPill label="Solar Radiation" value={`${solarRadiation} W/m²`} />
            </div>
          </div>

          {/* Thermal Indicators */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">
              Sub-Indices (Deterministic Thermodynamic Calculations)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
              {wetBulbTemp !== undefined && <InputPill label="Wet Bulb" value={`${wetBulbTemp} °C`} />}
              <InputPill label="WBGT" value={`${wbgt} °C`} />
              <InputPill label="UTCI" value={`${utci} °C`} />
              <InputPill label="Heat Index" value={`${heatIndex} °C`} />
              {humidex !== undefined && <InputPill label="Humidex" value={`${humidex}`} />}
            </div>
          </div>

          {/* Formula */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">
              Verified Weighting Equation
            </h4>
            <div className="p-4 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 space-y-1.5 text-xs text-slate-700">
              <div>
                1. Normalize WBGT: <span className="text-blue-600 font-bold">n_wbgt</span> = (WBGT − 20) / 15 × 100 = <span className="text-slate-900 font-extrabold">{n_wbgt}</span>
              </div>
              <div>
                2. Normalize UTCI: <span className="text-blue-600 font-bold">n_utci</span> = (UTCI − 20) / 25 × 100 = <span className="text-slate-900 font-extrabold">{n_utci}</span>
              </div>
              <div>
                3. Normalize Temp: <span className="text-blue-600 font-bold">n_temp</span> = (Temp − 20) / 25 × 100 = <span className="text-slate-900 font-extrabold">{n_temp}</span>
              </div>
              <div className="pt-2 border-t border-blue-200/60 text-slate-900 font-medium">
                <span className="text-blue-600 font-black">HTSS</span> = 0.45 × {n_wbgt} + 0.35 × {n_utci} + 0.20 × {n_temp}
                = <span className="text-blue-700 font-black text-base">{htss}</span>
              </div>
            </div>
          </div>

          {/* Risk Thresholds */}
          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">
              Classification Scale
            </h4>
            <div className="flex flex-wrap gap-2">
              <ThresholdPill label="LOW" range="< 40" active={htss < 40} color="text-emerald-700 bg-emerald-50 border-emerald-300" />
              <ThresholdPill label="MODERATE" range="40–59" active={htss >= 40 && htss < 60} color="text-amber-800 bg-amber-50 border-amber-300" />
              <ThresholdPill label="HIGH" range="60–74" active={htss >= 60 && htss < 75} color="text-orange-700 bg-orange-50 border-orange-300" />
              <ThresholdPill label="EXTREME" range="≥ 75" active={htss >= 75} color="text-red-700 bg-red-50 border-red-300" />
            </div>
          </div>

          {/* Data Timestamp */}
          {dataTimestamp && (
            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              Telemetry synchronized at: <span className="text-slate-800 font-semibold">{formatISTTimestamp(dataTimestamp)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function InputPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-[#EDF5FD] border border-blue-100/70 shadow-xs">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{label}</div>
      <div className="text-sm text-slate-900 font-extrabold">{value}</div>
    </div>
  );
}

function ThresholdPill({ label, range, active, color }: { label: string; range: string; active: boolean; color: string }) {
  return (
    <span className={`px-3 py-1 rounded-xl border text-[11px] font-bold ${
      active ? `${color} shadow-xs` : 'text-slate-500 bg-white border-slate-200'
    }`}>
      {label} ({range}) {active && '← Active'}
    </span>
  );
}
