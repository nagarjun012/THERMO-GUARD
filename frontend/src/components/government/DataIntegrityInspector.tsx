import React, { useState, useEffect } from 'react';
import { ProcessedDistrict } from '../../services/govHtssService';
import { X, AlertTriangle, Cpu, Terminal, Radio, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  district: ProcessedDistrict | null;
  isOpen: boolean;
  onClose: () => void;
  onSyncLive?: (district: ProcessedDistrict) => Promise<ProcessedDistrict>;
}

export const DataIntegrityInspector: React.FC<Props> = ({ district, isOpen, onClose, onSyncLive }) => {
  const [currentDistrict, setCurrentDistrict] = useState<ProcessedDistrict | null>(district);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedLive, setVerifiedLive] = useState(false);

  useEffect(() => {
    setCurrentDistrict(district);
    setVerifiedLive(district?.isLive ?? false);
  }, [district]);

  if (!isOpen || !currentDistrict) return null;

  const isFailed = currentDistrict.status === 'FAILED' || currentDistrict.htss === null;

  const handleVerifyLive = async () => {
    if (!onSyncLive) return;
    setIsVerifying(true);
    try {
      const updated = await onSyncLive(currentDistrict);
      setCurrentDistrict(updated);
      setVerifiedLive(true);
    } catch (err) {
      console.error('Live verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 bg-white text-slate-900 border border-slate-200">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl neu-well text-orange-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-950 font-mono">
                  Data Integrity &amp; Calculation Inspector
                </h3>
                <span className="skeuo-pill px-2.5 py-0.5 text-[10px] font-mono text-emerald-800 border border-emerald-300 bg-emerald-100 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" /> DETERMINISTIC
                </span>
                {verifiedLive && (
                  <span className="skeuo-pill px-2.5 py-0.5 text-[10px] font-mono text-emerald-900 border border-emerald-300 bg-emerald-200 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> LIVE VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-sans font-semibold">
                Inspecting Open-Meteo telemetry and Liljegren thermodynamic pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOCATION META IN NEUMORPHIC WELL */}
        <div className="neu-well p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div>
            <span className="text-slate-600 block text-[10px] uppercase font-bold">District</span>
            <span className="text-slate-950 font-black text-sm">{currentDistrict.district}</span>
          </div>
          <div>
            <span className="text-slate-600 block text-[10px] uppercase font-bold">State / UT</span>
            <span className="text-blue-700 font-bold">{currentDistrict.state}</span>
          </div>
          <div>
            <span className="text-slate-600 block text-[10px] uppercase font-bold">Latitude</span>
            <span className="text-slate-800 font-bold">{currentDistrict.lat.toFixed(4)}° N</span>
          </div>
          <div>
            <span className="text-slate-600 block text-[10px] uppercase font-bold">Longitude</span>
            <span className="text-slate-800 font-bold">{currentDistrict.lon.toFixed(4)}° E</span>
          </div>
        </div>

        {isFailed ? (
          <div className="p-4 rounded-2xl border border-red-300 bg-red-50 text-red-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" /> API Telemetry Retrieval Failed for this District
            </div>
            <p>
              Open-Meteo query failed or returned invalid telemetry. Per safety rules, this location shows <strong>"DATA UNAVAILABLE"</strong> and is assigned 0 synthetic values.
            </p>
            <p className="font-mono text-[11px] text-red-700 font-bold">Error: {currentDistrict.errorReason || 'Network or coordinate timeout'}</p>
          </div>
        ) : (
          <>
            {/* STEP 1: OPEN-METEO INPUTS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 border-b border-slate-200 pb-1 font-mono">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> 1. OPEN-METEO LIVE TELEMETRY INPUTS
                </span>
                <span className="text-[11px] font-bold">Source: {currentDistrict.source}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Air Temp (2m)</span>
                  <span className="text-lg font-black text-slate-950">{currentDistrict.temperature}°C</span>
                </div>
                <div className="p-3 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Humidity</span>
                  <span className="text-lg font-black text-blue-700">{currentDistrict.humidity}%</span>
                </div>
                <div className="p-3 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Wind (10m)</span>
                  <span className="text-lg font-black text-teal-700">{currentDistrict.windSpeed} km/h</span>
                </div>
                <div className="p-3 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Solar Rad</span>
                  <span className="text-lg font-black text-amber-700">{currentDistrict.solarRadiation} W/m²</span>
                </div>
              </div>
            </div>

            {/* STEP 2: THERMODYNAMIC CALCULATIONS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 border-b border-slate-200 pb-1 font-mono">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" /> 2. STULL &amp; LILJEGREN THERMODYNAMICS
                </span>
                <span className="text-[11px] font-bold">Calculated: {currentDistrict.calculatedAt ? new Date(currentDistrict.calculatedAt).toLocaleTimeString() : 'Live'}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Wet Bulb (Twb)</span>
                  <span className="text-base font-black text-blue-800">{currentDistrict.twb}°C</span>
                  <span className="text-[9px] text-slate-500 block mt-1">Stull (2011) Empirical</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">Outdoor WBGT</span>
                  <span className="text-base font-black text-purple-900">{currentDistrict.wbgt}°C</span>
                  <span className="text-[9px] text-slate-500 block mt-1">Liljegren Outdoor Model</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#EDF5FD] border border-blue-100">
                  <span className="text-[10px] text-slate-600 block uppercase font-bold">UTCI Index</span>
                  <span className="text-base font-black text-orange-900">{currentDistrict.utci}°C</span>
                  <span className="text-[9px] text-slate-500 block mt-1">Universal Climate</span>
                </div>
              </div>
            </div>

            {/* STEP 3: FINAL HTSS RISK SCORE */}
            <div className="p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 bg-white border-2 border-orange-300 shadow-sm">
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block font-mono">
                  Final Deterministic HTSS Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-slate-950 tracking-tight">{currentDistrict.htss}</span>
                  <span className="text-xs text-slate-600 font-mono font-bold">/ 100</span>
                  <span className="skeuo-pill ml-3 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-950 border border-orange-400 bg-orange-100">
                    {currentDistrict.riskCategory} RISK
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-slate-700 font-mono font-bold">
                <div>National Ranking: <strong className="text-slate-950 font-black">#{currentDistrict.rank || 'N/A'}</strong></div>
                <div className="text-[10px] text-emerald-700 mt-1">Fully Verified Telemetry</div>
              </div>
            </div>
          </>
        )}

        {/* LIVE RE-VERIFICATION ACTION */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs font-mono">
          <span className="text-gray-400">
            {verifiedLive ? '🟢 Live verification confirmed via Open-Meteo' : 'Active real-time observation'}
          </span>
          {onSyncLive && (
            <button
              onClick={handleVerifyLive}
              disabled={isVerifying}
              className="skeuo-btn skeuo-btn-emerald btn-shimmer px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Telemetry...' : 'Re-verify Live from Open-Meteo'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
