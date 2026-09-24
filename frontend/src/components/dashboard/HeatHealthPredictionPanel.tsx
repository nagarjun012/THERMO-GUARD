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
      <div className="p-6 sm:p-7 rounded-[30px] bg-white/95 border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)] animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-24 bg-slate-100 rounded-2xl mb-4" />
        <div className="grid grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !forecast || !forecast.daily_predictions?.length) {
    return null;
  }

  const activeDay: DayPrediction = forecast.daily_predictions[selectedDayIndex] || forecast.daily_predictions[0];
  const vulnerableAlerts: VulnerableGroupAlert[] = forecast.localized_vulnerable_alerts || [];

  return (
    <div className="p-6 sm:p-7 rounded-[30px] bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)] space-y-6 text-slate-800">
      {/* HEADER ROW */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-[#EDF5FD] border border-blue-100/80 text-blue-600 shadow-xs">
              <Calendar className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                3–5 DAY HEAT-HEALTH WARNING & PREPAREDNESS WINDOW
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Multi-horizon biometeorological hazard forecast & modeled epidemiological relative risk indices
                {locationName ? ` • ${locationName}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* METADATA BADGES & BENCHMARK TRIGGER */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-xs">
            <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="font-bold">LIVE TELEMETRY:</span>
            <span className="truncate max-w-[200px] sm:max-w-none text-emerald-950">
              {forecast.telemetry_source || 'Open-Meteo GFS / ECMWF'}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#EDF5FD] border border-blue-100 text-slate-700 font-medium">
            Model: <span className="text-blue-700 font-bold">{forecast.model_version}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-[#EDF5FD] border border-blue-100 text-slate-700 font-medium">
            Threshold: <span className="text-amber-700 font-bold">θ={forecast.operating_threshold}</span>
          </span>
          <button
            onClick={() => setShowBenchmarkModal(true)}
            className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Inspect Model Comparison & Threshold Optimization Report"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Validation Benchmarks</span>
          </button>
        </div>
      </div>

      {/* REAL DATA TELEMETRY PROVENANCE STRIP */}
      <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold text-slate-900">VERIFIED METEOROLOGICAL TELEMETRY:</span>
          <span className="text-slate-600">
            Real multi-model telemetry for coordinates ({Number(lat).toFixed(3)}°N, {Number(lon).toFixed(3)}°E).
          </span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium">
          Freshness: {new Date(forecast.generated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Live)
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
              className={`p-4 rounded-2xl text-left transition-all border cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/25 -translate-y-0.5'
                  : 'bg-[#EDF5FD] border-blue-100/70 hover:bg-[#E2F0FD] text-slate-700'
              }`}
            >
              {/* Top Accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: riskColor }}
              />

              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-extrabold text-slate-900">Day +{day.day_offset}</span>
                <span className="text-[10px] font-semibold">{day.target_date}</span>
              </div>

              <div className="text-[11px] text-blue-700 font-bold mb-2 truncate">
                {day.warning_stage.replace('_', ' ')}
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-extrabold text-slate-900">{day.predicted_temperature_max}°C</span>
                <span className="text-xs text-slate-500">{day.predicted_temperature_min}°C min</span>
              </div>

              {/* Risk Level Badge */}
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-xs"
                  style={{ backgroundColor: `${riskColor}18`, color: riskColor, border: `1px solid ${riskColor}35` }}
                >
                  {day.risk_level}
                </span>
                <span className="text-[11px] text-slate-600 font-bold">
                  HTSS {day.predicted_htss}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ACTIVE DAY DETAILED EPIDEMIOLOGICAL RISK CARD */}
      <div className="p-5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200/60 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-extrabold text-slate-900">
              DAY +{activeDay.day_offset} EVALUATION ({activeDay.target_date})
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white text-blue-700 font-bold border border-blue-200/60 shadow-xs">
              Stage: {activeDay.warning_stage}
            </span>
          </div>

          {activeDay.requires_human_review && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Mandatory Authorized Review Flagged</span>
            </div>
          )}
        </div>

        {/* EPIDEMIOLOGICAL SURGE & MORTALITY INDICES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Heat-Health Risk Score */}
          <div className="p-4 rounded-2xl bg-white border border-blue-100/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold">Heat-Health Risk Score</span>
              <span className="font-extrabold text-slate-900 text-sm">{activeDay.heat_health_risk_score} / 100</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${activeDay.heat_health_risk_score}%`,
                  backgroundColor: getRiskColor(activeDay.risk_level),
                }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Calculated composite biometeorological risk across temperature ({activeDay.predicted_temperature_max}°C), humidity ({activeDay.predicted_humidity}%), and solar load.
            </p>
          </div>

          {/* Hospitalization Surge Risk Index */}
          <div className="p-4 rounded-2xl bg-white border border-blue-100/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Hospitalization Surge Risk</span>
              </span>
              <span className="font-extrabold text-blue-700 text-sm">{activeDay.hospitalization_risk_index} / 100</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${activeDay.hospitalization_risk_index}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Modeled relative surge in emergency admissions (cardiorespiratory, dehydration, heat stroke) based on exposure-response functions.
            </p>
          </div>

          {/* Mortality Hazard Index */}
          <div className="p-4 rounded-2xl bg-white border border-blue-100/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1 font-bold">
                <HeartPulse className="w-3.5 h-3.5 text-red-600" />
                <span>Excess Mortality Hazard</span>
              </span>
              <span className="font-extrabold text-red-600 text-sm">{activeDay.mortality_risk_index} / 100</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all duration-500"
                style={{ width: `${activeDay.mortality_risk_index}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Driven by sustained daytime extremes ({activeDay.predicted_temperature_max}°C) and nocturnal heat entrapment ({activeDay.predicted_temperature_min}°C min).
            </p>
          </div>
        </div>

        {/* CONTRIBUTING BIOMETEOROLOGICAL FACTORS */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Primary Contributing Hazard Factors (Live Model)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {activeDay.primary_contributing_factors.map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-white border border-blue-100/70 shadow-xs text-xs">
                <span className="text-[11px] text-slate-500 block truncate">{f.factor}</span>
                <span className="font-extrabold text-slate-800 block mt-0.5">{f.impact}</span>
                <span className="text-[11px] text-blue-700 font-bold">
                  {f.contribution_pct}% relative weight
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PREPAREDNESS ACTION CHECKLIST */}
        <div className="space-y-2 border-t border-blue-200/60 pt-3">
          <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Target Preparedness Actions ({activeDay.warning_stage})</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {activeDay.action_checklist.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white border border-blue-100 text-slate-700 flex items-start gap-2 shadow-xs"
              >
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOCALIZED ADVISORIES FOR VULNERABLE GROUPS */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Localized Protection Protocols for High-Risk Populations
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Target Tier: <span className="text-slate-900 font-bold">{activeDay.risk_level}</span> Risk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vulnerableAlerts.map((grp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900">{grp.group_name}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  grp.urgency === 'extreme'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {grp.urgency} Urgency
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                {grp.vulnerability_description}
              </p>
              <div className="space-y-1.5 pt-1">
                {grp.recommended_interventions.map((action, aidx) => (
                  <div key={aidx} className="flex items-start gap-2 text-[11px] text-slate-700">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HUMAN-IN-THE-LOOP & EPIDEMIOLOGICAL GOVERNANCE NOTICE */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-extrabold text-blue-950">
            Decision-Support & Governance Protocol (Non-Autonomous Interventions)
          </p>
          <p className="text-[11px] text-blue-800">
            {forecast.human_in_the_loop_protocol?.governing_principle ||
              'AI outputs are strictly for decision-support. Autonomous activation of emergency powers, hospital surge reallocations, or civic restrictions is prohibited without authorized municipal officer confirmation.'}
          </p>
          <p className="text-[10px] text-blue-700 italic">
            Status: {forecast.health_outcome_status} — Epidemiological hospitalization and mortality indices represent modeled relative risk based on biometeorological exposure-response functions.
          </p>
        </div>
      </div>

      {/* BENCHMARK TRANSPARENCY MODAL */}
      {showBenchmarkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Model Comparison & Asymmetric Threshold Tuning Report
                </h3>
                <p className="text-xs text-slate-500">
                  Validation across TimeSeriesSplit (5 chronological splits, zero future data leakage)
                </p>
              </div>
              <button
                onClick={() => setShowBenchmarkModal(false)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-extrabold text-amber-950 block mb-1">
                  Why Asymmetric Threshold Tuning?
                </span>
                In public health heat early warning, missing a life-threatening heatwave (False Negative) is far more dangerous than advance precautionary staging (False Alarm). The system optimizes:
                <div className="mt-2 p-2.5 rounded-xl bg-white font-mono text-slate-900 font-bold text-center border border-amber-200 shadow-xs">
                  Cost = 4.0 × False_Negatives + 1.0 × False_Positives
                </div>
              </div>

              {(benchmarks || []).map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#EDF5FD] border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{m.model_name}</span>
                    <span className="text-xs font-bold text-blue-700">Optimal θ = {m.optimal_threshold}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100/60 shadow-xs">
                      <span className="text-slate-500 block text-[10px]">Precision</span>
                      <span className="font-extrabold text-slate-900">{m.metrics_at_optimized_threshold?.precision}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100/60 shadow-xs">
                      <span className="text-slate-500 block text-[10px]">Recall (Sensitivity)</span>
                      <span className="font-extrabold text-emerald-700">{m.metrics_at_optimized_threshold?.recall}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100/60 shadow-xs">
                      <span className="text-slate-500 block text-[10px]">F2-Score (β=2)</span>
                      <span className="font-extrabold text-blue-700">{m.metrics_at_optimized_threshold?.f2}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-blue-100/60 shadow-xs">
                      <span className="text-slate-500 block text-[10px]">Missed Event Rate</span>
                      <span className="font-extrabold text-red-600">{m.metrics_at_optimized_threshold?.missed_event_rate}</span>
                    </div>
                  </div>

                  {m.decision_threshold_gain && (
                    <div className="text-[11px] text-slate-700 bg-white p-3 rounded-xl border border-blue-100/60 space-y-1 shadow-xs">
                      <div className="flex justify-between">
                        <span>Operational Cost Reduction:</span>
                        <span className="font-extrabold text-emerald-700">
                          {m.decision_threshold_gain.cost_reduction_percent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Missed Emergencies Prevented:</span>
                        <span className="font-extrabold text-emerald-700">
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
