import React, { useState, useMemo } from 'react';
import { useWeather, useThermalStress, useRisk, useAlerts } from '../hooks/useApi';
import { ThermalStressGauge } from '../components/dashboard/ThermalStressGauge';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { ThermalIndexCard } from '../components/dashboard/ThermalIndexCard';
import { RiskContributionBar } from '../components/dashboard/RiskContributionBar';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { HeatwaveProbability } from '../components/dashboard/HeatwaveProbability';
import { DataProvenancePanel } from '../components/dashboard/DataProvenancePanel';
import { HTSSDetailPanel } from '../components/dashboard/HTSSDetailPanel';
import { HTSSAuditView } from '../components/dashboard/HTSSAuditView';
import { OfficialThresholdReconciliation } from '../components/common/OfficialThresholdReconciliation';
import { useAppStore } from '../stores/appStore';
import { buildWeatherProvenance } from '../lib/dataProvenance';
import { computeFullAudit, calculateHeatIndex, calculateHumidex, calculateWetBulb } from '../lib/htssEngine';
import { MapPin, RefreshCw, AlertTriangle } from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { selectedLocation } = useAppStore();
  const { data: weather, isLoading: wLoading, isError: wError } = useWeather();
  const { data: thermal, isLoading: tLoading, isError: tError } = useThermalStress();
  const { data: risk, isLoading: rLoading, isError: rError } = useRisk();
  const { data: alerts, isLoading: aLoading } = useAlerts();
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const { userRole } = useAppStore();

  // Compute provenance from weather data
  const provenance = useMemo(() => {
    if (!weather || !weather.isLive) {
      return buildWeatherProvenance({
        location: selectedLocation.name,
        apiStatus: 'FAILED',
        dataType: 'LIVE_WEATHER',
      });
    }
    return buildWeatherProvenance({
      source: weather.source || 'Open-Meteo',
      lastUpdated: weather.apiTimestamp || weather.timestamp,
      location: selectedLocation.name,
      apiStatus: 'SUCCESS',
      calculationTime: weather.timestamp,
      dataType: 'LIVE_WEATHER',
    });
  }, [weather, selectedLocation.name]);

  // Compute full HTSS audit when needed
  const auditData = useMemo(() => {
    if (!weather || !thermal) return null;
    return computeFullAudit(
      weather.temperature,
      weather.humidity,
      weather.windSpeed,
      weather.solarRadiation,
      weather.source || 'Open-Meteo'
    );
  }, [weather, thermal]);

  if (wLoading || tLoading || rLoading || aLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="font-mono text-sm text-gray-300">Fetching live weather telemetry from Open-Meteo...</p>
      </div>
    );
  }

  // Strictly enforce: If API request fails or no verified live response is received, display DATA UNAVAILABLE
  if (wError || tError || rError || !weather || !thermal || !risk || !alerts || !weather.isLive) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 max-w-lg shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-400" />
          <h2 className="text-2xl font-black font-mono tracking-wider text-red-400">DATA UNAVAILABLE</h2>
          <p className="text-sm text-gray-300 font-mono mt-3">
            Unable to retrieve verified live telemetry from Open-Meteo API for {selectedLocation.name}.
          </p>
          <p className="text-xs text-gray-500 font-mono mt-2">
            Mock and synthetic weather data fallbacks are strictly disabled.
          </p>
          <div className="mt-4">
            <DataProvenancePanel provenance={provenance} compact={false} />
          </div>
        </div>
      </div>
    );
  }

  const fmt = (val: number | undefined) => (typeof val === 'number' ? Math.round(val * 10) / 10 : val ?? 0);

  // Compute additional thermal indicators for the detail panel
  const wetBulbTemp = calculateWetBulb(weather.temperature, weather.humidity);
  const humidex = calculateHumidex(weather.temperature, weather.humidity);
  const heatIndex = thermal.heatIndex ?? calculateHeatIndex(weather.temperature, weather.humidity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* HEADER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl neu-well text-orange-400">
            <MapPin className="w-5 h-5 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {selectedLocation.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400 mt-1">
              <span className="font-bold tracking-wide">LIVE WEATHER — Open-Meteo</span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-300">
                Updated: {weather.apiTimestamp || weather.timestamp}
              </span>
            </div>
          </div>
        </div>

        {/* ONLY DISPLAY REAL-TIME BADGE UPON VERIFIED SUCCESSFUL API RESPONSE */}
        {weather.isLive && (
          <span className="skeuo-pill px-3.5 py-1.5 text-xs font-black tracking-wider flex items-center gap-2 text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            🟢 LIVE
          </span>
        )}
      </div>

      {/* DATA PROVENANCE PANEL */}
      <DataProvenancePanel provenance={provenance} compact={true} />

      {/* PRIMARY INSTRUMENTS ROW (HTSS DIAL + 4 CORE OPEN-METEO TELEMETRY FIELDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ThermalStressGauge score={fmt(thermal.htss)} level={thermal.htssCategory || risk.level} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <WeatherCard title="Air Temp" value={fmt(weather.temperature)} unit="°C" icon="Thermometer" color="#f97316" />
          <WeatherCard title="Humidity" value={fmt(weather.humidity)} unit="%" icon="Droplets" color="#3b82f6" />
          <WeatherCard title="Wind Speed" value={fmt(weather.windSpeed)} unit="km/h" icon="Wind" color="#10b981" />
          <WeatherCard title="Solar Rad" value={fmt(weather.solarRadiation)} unit="W/m²" icon="Sun" color="#eab308" />
        </div>
      </div>

      {/* HTSS CALCULATION DETAILS (expandable) */}
      <HTSSDetailPanel
        temperature={weather.temperature}
        humidity={weather.humidity}
        windSpeed={weather.windSpeed}
        solarRadiation={weather.solarRadiation}
        htss={fmt(thermal.htss) as number}
        riskCategory={thermal.htssCategory || risk.level}
        wbgt={fmt(thermal.wbgt) as number}
        utci={fmt(thermal.utci) as number}
        heatIndex={fmt(heatIndex) as number}
        humidex={humidex}
        wetBulbTemp={wetBulbTemp}
        dataTimestamp={weather.apiTimestamp || weather.timestamp}
      />

      {/* ADDITIONAL ATMOSPHERIC API TELEMETRY (REAL OPEN-METEO FIELDS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <WeatherCard
          title="Pressure MSL"
          value={fmt(weather.pressureMsl)}
          unit="hPa"
          icon="Gauge"
          color="#a855f7"
        />
        <WeatherCard
          title="Dew Point"
          value={fmt(weather.dewPoint)}
          unit="°C"
          icon="CloudRain"
          color="#06b6d4"
        />
        <WeatherCard
          title="Wind Direction"
          value={fmt(weather.windDirection)}
          unit="°"
          icon="Compass"
          color="#14b8a6"
        />
        <WeatherCard
          title="UV Index"
          value={weather.uvIndex !== undefined ? Math.round(weather.uvIndex * 10) / 10 : '0'}
          unit=""
          icon="SunMedium"
          color="#f43f5e"
        />
      </div>

      {/* SECONDARY THERMAL INDICES (LOCALLY CALCULATED VIA DETERMINISTIC FORMULAS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ThermalIndexCard
          title="Heat Index (HI)"
          value={fmt(thermal.heatIndex)}
          max={60}
          unit="°C"
          category={thermal.heatIndex >= 41 ? 'Extreme' : thermal.heatIndex >= 32 ? 'High' : thermal.heatIndex >= 27 ? 'Moderate' : 'Low'}
        />
        <ThermalIndexCard
          title="Outdoor WBGT"
          value={fmt(thermal.wbgt)}
          max={40}
          unit="°C"
          category={thermal.wbgt >= 32 ? 'Extreme' : thermal.wbgt >= 29 ? 'High' : thermal.wbgt >= 25 ? 'Moderate' : 'Low'}
        />
        <ThermalIndexCard
          title="UTCI Index"
          value={fmt(thermal.utci)}
          max={50}
          unit="°C"
          category={thermal.utci >= 38 ? 'Extreme' : thermal.utci >= 32 ? 'High' : thermal.utci >= 26 ? 'Moderate' : 'Low'}
        />
      </div>
 
      {/* STATUTORY IMD VS AI HTSS RECONCILIATION */}
      <OfficialThresholdReconciliation
        currentTemp={Number(weather.temperature)}
        currentHtss={Number(thermal.htss)}
      />

      {/* HEAT STRESS FACTOR DECOMPOSITION */}
      <RiskContributionBar factors={risk.primaryFactors} />

      {/* TERTIARY DIAGNOSTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HeatwaveProbability probability={risk.probability} trend="up" />
        </div>
        <div className="lg:col-span-1">
          <AlertPanel alerts={alerts} />
        </div>
        <div className="lg:col-span-1">
          <RecommendationCard risk={risk} />
        </div>
      </div>

      {/* HTSS AUDIT VIEW — accessible via button (gov users) or keyboard shortcut */}
      {userRole === 'gov' && auditData && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsAuditOpen(true)}
            className="text-[10px] font-mono text-gray-500 hover:text-orange-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-orange-500/20 cursor-pointer"
            type="button"
          >
            🔍 Open HTSS Audit View
          </button>
        </div>
      )}

      {auditData && (
        <HTSSAuditView
          audit={auditData}
          isOpen={isAuditOpen}
          onClose={() => setIsAuditOpen(false)}
        />
      )}
    </div>
  );
};
