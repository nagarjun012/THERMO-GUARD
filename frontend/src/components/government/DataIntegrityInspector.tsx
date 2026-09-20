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
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal relative w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 text-gray-200 border border-white/15">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl neu-well text-orange-400">
              <Cpu className="w-6 h-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-mono">
                  Data Integrity &amp; Calculation Inspector
                </h3>
                <span className="skeuo-pill px-2.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" /> DETERMINISTIC
                </span>
                {verifiedLive && (
                  <span className="skeuo-pill px-2.5 py-0.5 text-[10px] font-mono text-emerald-300 border border-emerald-500/50 bg-emerald-500/20 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> LIVE VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-sans">
                Inspecting Open-Meteo telemetry and Liljegren thermodynamic pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="skeuo-btn skeuo-btn-dark p-2 rounded-xl text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LOCATION META IN NEUMORPHIC WELL */}
        <div className="neu-well p-4 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">District</span>
            <span className="text-white font-black text-sm">{currentDistrict.district}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">State / UT</span>
            <span className="text-orange-400 font-bold">{currentDistrict.state}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">Latitude</span>
            <span className="text-gray-300">{currentDistrict.lat.toFixed(4)}° N</span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-bold">Longitude</span>
            <span className="text-gray-300">{currentDistrict.lon.toFixed(4)}° E</span>
          </div>
        </div>

        {isFailed ? (
          <div className="neu-well p-4 rounded-2xl border border-red-500/40 text-red-400 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" /> API Telemetry Retrieval Failed for this District
            </div>
            <p>
              Open-Meteo query failed or returned invalid telemetry. Per safety rules, this location shows <strong>"DATA UNAVAILABLE"</strong> and is assigned 0 synthetic values.
            </p>
            <p className="font-mono text-[11px] text-gray-400">Error: {currentDistrict.errorReason || 'Network or coordinate timeout'}</p>
          </div>
        ) : (
          <>
            {/* STEP 1: OPEN-METEO INPUTS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-1 font-mono">
                <span className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> 1. OPEN-METEO LIVE TELEMETRY INPUTS
                </span>
                <span className="text-[11px]">Source: {currentDistrict.source}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="neu-card p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Air Temp (2m)</span>
                  <span className="text-lg font-black text-white">{currentDistrict.temperature}°C</span>
                </div>
                <div className="neu-card p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Humidity</span>
                  <span className="text-lg font-black text-blue-400">{currentDistrict.humidity}%</span>
                </div>
                <div className="neu-card p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Wind (10m)</span>
                  <span className="text-lg font-black text-teal-400">{currentDistrict.windSpeed} km/h</span>
                </div>
                <div className="neu-card p-3 rounded-xl">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Solar Rad</span>
                  <span className="text-lg font-black text-amber-400">{currentDistrict.solarRadiation} W/m²</span>
                </div>
              </div>
            </div>

            {/* STEP 2: THERMODYNAMIC CALCULATIONS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-1 font-mono">
                <span className="font-bold text-orange-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" /> 2. STULL &amp; LILJEGREN THERMODYNAMICS
                </span>
                <span className="text-[11px]">Calculated: {currentDistrict.calculatedAt ? new Date(currentDistrict.calculatedAt).toLocaleTimeString() : 'Live'}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="neu-well p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Wet Bulb (Twb)</span>
                  <span className="text-base font-black text-sky-300">{currentDistrict.twb}°C</span>
                  <span className="text-[9px] text-gray-500 block mt-1">Stull (2011) Empirical</span>
                </div>
                <div className="neu-well p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Outdoor WBGT</span>
                  <span className="text-base font-black text-purple-300">{currentDistrict.wbgt}°C</span>
                  <span className="text-[9px] text-gray-500 block mt-1">Liljegren Outdoor Model</span>
                </div>
                <div className="neu-well p-3.5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">UTCI Index</span>
                  <span className="text-base font-black text-orange-300">{currentDistrict.utci}°C</span>
                  <span className="text-[9px] text-gray-500 block mt-1">Universal Climate</span>
                </div>
              </div>
            </div>

            {/* STEP 3: FINAL HTSS RISK SCORE */}
            <div className="neu-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-orange-500/30">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block font-mono">
                  Final Deterministic HTSS Score
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-white tracking-tight">{currentDistrict.htss}</span>
                  <span className="text-xs text-gray-400 font-mono">/ 100</span>
                  <span className="skeuo-pill ml-3 px-3 py-1 text-xs font-black uppercase tracking-wider text-orange-400 border border-orange-500/40 bg-orange-500/15">
                    {currentDistrict.riskCategory} RISK
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-400 font-mono">
                <div>National Ranking: <strong className="text-white">#{currentDistrict.rank || 'N/A'}</strong></div>
                <div className="text-[10px] text-emerald-400 mt-1">Fully Verified Telemetry</div>
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
