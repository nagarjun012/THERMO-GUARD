import React, { useState } from 'react';
import { WardGisData, getRiskColorByCategory } from '../../data/wardGisData';
import { AnimatedRadialGauge } from './AnimatedRadialGauge';
import {
  X,
  Thermometer,
  Wind,
  Sun,
  ShieldAlert,
  Droplets,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Props {
  ward: WardGisData | null;
  onClose: () => void;
}

export const WardDetailPanel: React.FC<Props> = ({ ward, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast'>('overview');

  if (!ward) return null;

  const color = getRiskColorByCategory(ward.riskCategory);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-dark-900/95 backdrop-blur-2xl border-l border-dark-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[600] flex flex-col overflow-hidden animate-slideLeft">
      {/* HEADER BAR */}
      <div className="p-5 border-b border-dark-700/80 bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 flex items-start justify-between relative">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-lg"
            style={{ backgroundColor: `${color}20`, borderColor: `${color}60` }}
          >
            <Activity className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded bg-dark-800 text-orange-400 border border-orange-500/30">
                {ward.wardCode}
              </span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5 tracking-tight">
              {ward.wardName}
            </h3>
            <p className="text-xs text-gray-400 font-medium">
              {ward.district}, {ward.state}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white transition-colors border border-dark-600"
          title="Close Information Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* DATA AUTHENTICITY VERIFICATION BADGE */}
      <div className="px-5 py-2.5 bg-dark-950 border-b border-dark-700/60 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-extrabold text-emerald-400">
            {ward.authenticity?.boundaryStatus === 'REAL_MUNICIPAL_WARD'
              ? '🟢 REAL MUNICIPAL WARD DATA'
              : '🟡 LIVE TELEMETRY / ESTIMATED WARD MESH'}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 font-mono">Open-Meteo & IMD Verified</span>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-dark-700 bg-dark-950/80 px-4 pt-2 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-dark-900 text-orange-400 border-dark-700 border-b-transparent shadow-md'
              : 'text-gray-400 border-transparent hover:text-gray-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Overview & Risk
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-4 py-2.5 rounded-t-xl border-t border-x transition-all flex items-center gap-1.5 ${
            activeTab === 'forecast'
              ? 'bg-dark-900 text-orange-400 border-dark-700 border-b-transparent shadow-md'
              : 'text-gray-400 border-transparent hover:text-gray-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> 72h Early Warning
        </button>
      </div>

      {/* CONTENT BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
        {activeTab === 'overview' && (
          <>
            {/* ANIMATED RADIAL GAUGE CARD */}
            <div className="glass-card p-5 bg-gradient-to-b from-dark-800/90 to-dark-900 border-dark-600/80 rounded-2xl flex items-center justify-between shadow-xl">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">
                  Thermal Health Risk Score
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">{ward.htssScore}</span>
                  <span className="text-sm font-bold text-gray-400">/ 100 HTSS</span>
                </div>
                <p className="text-xs text-gray-300 font-medium mt-1 max-w-[200px]">
                  Status:{' '}
                  <strong style={{ color }} className="uppercase">
                    {ward.riskCategory} RISK
                  </strong>
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-dark-950/80 border border-dark-700 text-[11px] text-gray-300">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Calculated via WBGT & UTCI</span>
                </div>
              </div>

              <AnimatedRadialGauge score={ward.htssScore} category={ward.riskCategory} size={130} />
            </div>

            {/* ENVIRONMENTAL TELEMETRY GRID */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-orange-400" /> Environmental Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3.5 bg-dark-800/60 border-dark-700 rounded-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Temperature</span>
                    <span className="text-base font-black text-white">{ward.weather.temperature}°C</span>
                  </div>
                </div>

                <div className="glass-card p-3.5 bg-dark-800/60 border-dark-700 rounded-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Humidity</span>
                    <span className="text-base font-black text-white">{ward.weather.humidity}%</span>
                  </div>
                </div>

                <div className="glass-card p-3.5 bg-dark-800/60 border-dark-700 rounded-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Wind className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Wind Speed</span>
                    <span className="text-base font-black text-white">{ward.weather.windSpeed} km/h</span>
                  </div>
                </div>

                <div className="glass-card p-3.5 bg-dark-800/60 border-dark-700 rounded-xl flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Solar Radiation</span>
                    <span className="text-base font-black text-white">{ward.weather.solarRadiation} W/m²</span>
                  </div>
                </div>
              </div>
            </div>

            {/* THERMAL INDICES COMPARISON */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-orange-400" /> Thermal Indices Comparison
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-dark-800/80 rounded-xl border border-dark-700">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">WBGT</span>
                  <span className="text-lg font-black text-orange-400">{ward.indices.wbgt}°C</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Occupational</span>
                </div>
                <div className="p-3 bg-dark-800/80 rounded-xl border border-dark-700">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Heat Index</span>
                  <span className="text-lg font-black text-red-400">{ward.indices.heatIndex}°C</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Apparent Temp</span>
                </div>
                <div className="p-3 bg-dark-800/80 rounded-xl border border-dark-700">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Humidex</span>
                  <span className="text-lg font-black text-yellow-400">{ward.indices.humidex}</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5">Discomfort</span>
                </div>
              </div>
            </div>

            {/* CONTRIBUTING FACTORS */}
            <div>
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-400" /> Key Heat Drivers in {ward.wardName}
              </h4>
              <div className="space-y-2">
                {ward.contributingFactors.map((cf, i) => (
                  <div key={i} className="p-2.5 bg-dark-800/50 rounded-lg border border-dark-700 flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-200">{cf.factor}</span>
                    <span className="font-mono font-bold text-orange-400">{cf.impactScore}% impact</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PREVENTIVE ACTIONS */}
            <div>
              <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider mb-3 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-400" /> Recommended Safety Advisories
              </h4>
              <div className="space-y-2">
                {ward.preventiveActions.map((act, i) => (
                  <div key={i} className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-gray-200 font-medium leading-relaxed flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'forecast' && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" /> 72-Hour Predictive Thermal Warning
              </div>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                Predictive AI modeling forecasts heat stress trends for <strong>{ward.wardName}</strong> over the next 3 days to enable early intervention.
              </p>
            </div>

            <div className="space-y-3">
              {ward.forecast.map((fc, idx) => {
                const fcColor = getRiskColorByCategory(fc.category);
                return (
                  <div key={idx} className="glass-card p-4 bg-dark-800/80 border-dark-700 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-white block">{fc.dayLabel}</span>
                      <span className="text-[11px] text-gray-400">{fc.date}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-lg font-black text-white font-mono">{fc.predictedHtss}</span>
                        <span className="text-[10px] text-gray-400 block">HTSS</span>
                      </div>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-lg border uppercase"
                        style={{
                          color: fcColor,
                          borderColor: `${fcColor}60`,
                          backgroundColor: `${fcColor}15`,
                        }}
                      >
                        {fc.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
