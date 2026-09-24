import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/api';
import { MultiDayHealthRiskForecast, DayPrediction, VulnerableGroupAlert, ModelBenchmark } from '../../types';
import { getRiskColor } from '../../utils/helpers';
import {
  Calendar,
  HeartPulse,
  Building2,
  Users,
  Clock,
  Info,
  CheckCircle2,
  BarChart3,
  ShieldAlert,
  Radio,
} from 'lucide-react';

interface Props {
  lat: number;
  lon: number;
  locationName?: string;
}

export const HeatHealthPredictionPanel: React.FC<Props> = ({ lat, lon, locationName }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [showBenchmarkModal, setShowBenchmarkModal] = useState<boolean>(false);

  const { data: forecast, isLoading, isError } = useQuery<MultiDayHealthRiskForecast>({
    queryKey: ['healthRiskPrediction', lat, lon],
    queryFn: () => apiService.getHealthRiskPrediction(lat, lon),
    staleTime: 60000,
    retry: 1,
  });

  const { data: benchmarks } = useQuery<ModelBenchmark[]>({
    queryKey: ['modelBenchmarks'],
    queryFn: () => apiService.getModelBenchmarks(),
    staleTime: 300000,
  });

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 shadow-xl animate-pulse">
        <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
        <div className="h-24 bg-white/5 rounded-xl mb-4" />
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !forecast || !forecast.daily_predictions?.length) {
    return null; // Graceful fallback: do not render broken panel if offline
  }

  const activeDay: DayPrediction = forecast.daily_predictions[selectedDayIndex] || forecast.daily_predictions[0];
  const vulnerableAlerts: VulnerableGroupAlert[] = forecast.localized_vulnerable_alerts || [];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 shadow-2xl space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-mono text-white tracking-wide flex items-center gap-2">
                3–5 DAY HEAT-HEALTH WARNING & PREPAREDNESS WINDOW
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Multi-horizon biometeorological hazard forecast & modeled epidemiological relative risk indices
                {locationName ? ` • ${locationName}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* METADATA BADGES & BENCHMARK TRIGGER */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-bold">LIVE TELEMETRY:</span>
            <span className="text-white truncate max-w-[200px] sm:max-w-none">
              {forecast.telemetry_source || 'Open-Meteo GFS / ECMWF'}
            </span>
          </div>

          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
            Model: <span className="text-emerald-400 font-bold">{forecast.model_version}</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
            Threshold: <span className="text-amber-400 font-bold">θ={forecast.operating_threshold}</span> (Recall-Tuned)
          </span>
          <button
            onClick={() => setShowBenchmarkModal(true)}
            className="px-2.5 py-1 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 hover:bg-orange-500/25 transition-colors flex items-center gap-1 cursor-pointer"
            title="Inspect Model Comparison & Threshold Optimization Report"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Validation Benchmarks</span>
          </button>
        </div>
      </div>

      {/* REAL DATA TELEMETRY PROVENANCE STRIP */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            REAL LIVE METEOROLOGICAL DATA:
          </span>
          <span>
            Telemetry generated directly from satellite & numerical weather prediction models for coordinates ({Number(lat).toFixed(3)}°N, {Number(lon).toFixed(3)}°E).
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Telemetry Freshness: {new Date(forecast.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live)
        </div>
      </div>

      {/* 5-DAY HORIZON SELECTOR CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {forecast.daily_predictions.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const riskColor = getRiskColor(day.risk_level);

          return (
            <button
              key={day.day_offset}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-3.5 rounded-xl text-left font-mono transition-all border cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white/10 border-orange-500/60 shadow-lg ring-1 ring-orange-500/40'
                  : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/15'
              }`}
            >
              {/* Top Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: riskColor }}
              />

              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-bold text-white">Day +{day.day_offset}</span>
                <span className="text-[10px] opacity-75">{day.target_date}</span>
              </div>

              <div className="text-[10px] text-orange-400/90 font-semibold mb-2 truncate">
                {day.warning_stage.replace('_', ' ')}
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-black text-white">{day.predicted_temperature_max}°C</span>
                <span className="text-xs text-slate-400">{day.predicted_temperature_min}°C min</span>
              </div>

              {/* Risk Level Badge */}
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: `${riskColor}25`, color: riskColor }}
                >
                  {day.risk_level}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  HTSS {day.predicted_htss}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE DAY DETAILED EPIDEMIOLOGICAL RISK CARD */}
      <div className="p-4 sm:p-5 rounded-xl bg-black/30 border border-white/10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3 font-mono">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-white">
              DETAILED ASSESSMENT: DAY +{activeDay.day_offset} ({activeDay.target_date})
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300">
              Stage: {activeDay.warning_stage}
            </span>
          </div>

          {activeDay.requires_human_review && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Mandatory Authorized Review Flagged</span>
            </div>
          )}
        </div>

        {/* EPIDEMIOLOGICAL SURGE & MORTALITY INDICES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {/* Heat-Health Risk Score */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Heat-Health Risk Score</span>
              <span className="font-bold text-white">{activeDay.heat_health_risk_score} / 100</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${activeDay.heat_health_risk_score}%`,
                  backgroundColor: getRiskColor(activeDay.risk_level),
                }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Real calculated composite biometeorological risk across temperature ({activeDay.predicted_temperature_max}°C), humidity ({activeDay.predicted_humidity}%), and solar load.
            </p>
          </div>

          {/* Hospitalization Surge Risk Index */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Hospitalization Surge Risk Index</span>
              </span>
              <span className="font-bold text-blue-400">{activeDay.hospitalization_risk_index} / 100</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${activeDay.hospitalization_risk_index}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Modeled relative surge in emergency admissions (cardiorespiratory, dehydration, heat stroke) based on exposure-response functions.
            </p>
          </div>

          {/* Mortality Hazard Index */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                <span>Excess Mortality Hazard Index</span>
              </span>
              <span className="font-bold text-red-400">{activeDay.mortality_risk_index} / 100</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${activeDay.mortality_risk_index}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Driven by sustained daytime extremes ({activeDay.predicted_temperature_max}°C) and nocturnal heat entrapment ({activeDay.predicted_temperature_min}°C min).
            </p>
          </div>
        </div>

        {/* CONTRIBUTING BIOMETEOROLOGICAL FACTORS */}
        <div className="space-y-2 font-mono">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Primary Contributing Hazard Factors (Live Model)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {activeDay.primary_contributing_factors.map((f, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-xs">
                <span className="text-[11px] text-slate-400 block truncate">{f.factor}</span>
                <span className="font-bold text-white block mt-0.5">{f.impact}</span>
                <span className="text-[10px] text-orange-400 font-mono">
                  {f.contribution_pct}% relative weight
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PREPAREDNESS ACTION CHECKLIST */}
        <div className="space-y-2 font-mono border-t border-white/5 pt-3">
          <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target Preparedness Actions ({activeDay.warning_stage})</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {activeDay.action_checklist.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15 text-slate-200 flex items-start gap-2"
              >
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOCALIZED ADVISORIES FOR VULNERABLE GROUPS */}
      <div className="space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Localized Protection Protocols for High-Risk Populations
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Target Tier: <span className="text-white font-bold">{activeDay.risk_level}</span> Risk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vulnerableAlerts.map((grp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">{grp.group_name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  grp.urgency === 'extreme'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}>
                  {grp.urgency} Urgency
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {grp.vulnerability_description}
              </p>
              <div className="space-y-1.5 pt-1">
                {grp.recommended_interventions.map((action, aidx) => (
                  <div key={aidx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HUMAN-IN-THE-LOOP & EPIDEMIOLOGICAL GOVERNANCE NOTICE */}
      <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs font-mono text-blue-200/90 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-white">
            Decision-Support & Governance Protocol (Non-Autonomous Interventions)
          </p>
          <p className="text-[11px] text-blue-300/80">
            {forecast.human_in_the_loop_protocol?.governing_principle ||
              'AI outputs are strictly for decision-support. Autonomous activation of emergency powers, hospital surge reallocations, or civic restrictions is prohibited without authorized municipal officer confirmation.'}
          </p>
          <p className="text-[10px] text-slate-400 italic">
            Status: {forecast.health_outcome_status} — Epidemiological hospitalization and mortality indices represent modeled relative risk based on biometeorological exposure-response functions. Real clinical registry linkage is in decision-support state.
          </p>
        </div>
      </div>

      {/* BENCHMARK TRANSPARENCY MODAL */}
      {showBenchmarkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/15 p-6 font-mono space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                  Model Comparison & Asymmetric Threshold Tuning Report
                </h3>
                <p className="text-xs text-slate-400">
                  Validation across TimeSeriesSplit (5 chronological splits, zero future data leakage)
                </p>
              </div>
              <button
                onClick={() => setShowBenchmarkModal(false)}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-slate-300">
                <span className="font-bold text-orange-400 block mb-1">
                  Why Asymmetric Threshold Tuning?
                </span>
                In public health heat early warning, missing a life-threatening heatwave (False Negative) is far more dangerous than advance precautionary staging (False Alarm). The system optimizes:
                <div className="mt-1.5 p-2 rounded bg-black/40 font-mono text-white text-center">
                  Cost = 4.0 × False_Negatives + 1.0 × False_Positives
                </div>
              </div>

              {(benchmarks || []).map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{m.model_name}</span>
                    <span className="text-xs text-amber-400">Optimal θ = {m.optimal_threshold}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2 rounded bg-black/30">
                      <span className="text-slate-400 block text-[10px]">Precision</span>
                      <span className="font-bold text-white">{m.metrics_at_optimized_threshold?.precision}</span>
                    </div>
                    <div className="p-2 rounded bg-black/30">
                      <span className="text-slate-400 block text-[10px]">Recall (Sensitivity)</span>
                      <span className="font-bold text-emerald-400">{m.metrics_at_optimized_threshold?.recall}</span>
                    </div>
                    <div className="p-2 rounded bg-black/30">
                      <span className="text-slate-400 block text-[10px]">F2-Score (β=2)</span>
                      <span className="font-bold text-purple-400">{m.metrics_at_optimized_threshold?.f2}</span>
                    </div>
                    <div className="p-2 rounded bg-black/30">
                      <span className="text-slate-400 block text-[10px]">Missed Event Rate</span>
                      <span className="font-bold text-red-400">{m.metrics_at_optimized_threshold?.missed_event_rate}</span>
                    </div>
                  </div>

                  {m.decision_threshold_gain && (
                    <div className="text-[11px] text-slate-300 bg-white/[0.02] p-2.5 rounded border border-white/5 space-y-1">
                      <div className="flex justify-between">
                        <span>Cost Reduction:</span>
                        <span className="font-bold text-emerald-400">
                          {m.decision_threshold_gain.cost_reduction_percent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Missed Emergencies Prevented:</span>
                        <span className="font-bold text-emerald-400">
                          {m.decision_threshold_gain.missed_events_prevented} cases
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
