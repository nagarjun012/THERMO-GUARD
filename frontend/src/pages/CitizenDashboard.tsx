import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { resolveLocationFromCoords } from '../services/locationService';
import { ThermalStressGauge } from '../components/dashboard/ThermalStressGauge';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { ThermalIndexCard } from '../components/dashboard/ThermalIndexCard';
import { RiskContributionBar } from '../components/dashboard/RiskContributionBar';
import { AlertPanel } from '../components/dashboard/AlertPanel';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';
import { HeatwaveProbability } from '../components/dashboard/HeatwaveProbability';
import { HTSSDetailPanel } from '../components/dashboard/HTSSDetailPanel';
import { HTSSAuditView } from '../components/dashboard/HTSSAuditView';
import { OfficialThresholdReconciliation } from '../components/common/OfficialThresholdReconciliation';
import { useAppStore } from '../stores/appStore';
import { computeFullAudit, calculateHeatIndex, calculateHumidex, calculateWetBulb, computeRealThermalRisk, VULNERABILITY_PROFILES, type VulnerabilityProfile } from '../utils/thermalEngine';
import { MapPin, AlertTriangle, Users, Crosshair, RefreshCw, Activity } from 'lucide-react';

export interface CurrentDashboardLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  displayName: string;
}

export const CitizenDashboard: React.FC = () => {
  const { selectedLocation, vulnerabilityProfile, setVulnerabilityProfile, userRole } = useAppStore();

  // Authoritative real-time current-location state for the Dashboard
  // Never initialized with hardcoded, mock, or cached coordinates
  const [currentLocation, setCurrentLocation] = useState<CurrentDashboardLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<'locating' | 'ready' | 'unavailable'>('locating');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  // Authoritative real-time browser Geolocation request
  const requestFreshLocation = useCallback(() => {
    setIsLocating(true);
    setLocationStatus((prev) => (prev === 'ready' ? 'ready' : 'locating'));
    setErrorMessage(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setCurrentLocation(null);
      setLocationStatus('unavailable');
      setErrorMessage('Geolocation API is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    const onGpsSuccess = async (pos: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = pos.coords;
      try {
        const resolved = await resolveLocationFromCoords(latitude, longitude, true, accuracy);
        const freshLocation: CurrentDashboardLocation = {
          latitude,
          longitude,
          accuracy,
          timestamp: pos.timestamp || Date.now(),
          displayName: resolved.displayName || `${resolved.district}, ${resolved.state}`,
        };
        setCurrentLocation(freshLocation);
        setLocationStatus('ready');
        setLastUpdated(Date.now());
        setIsLocating(false);

        // Keep Map and appStore synchronized with the user's real verified browser position
        useAppStore.getState().setIndiaLocation(
          resolved.state,
          resolved.district,
          latitude,
          longitude,
          true,
          'LIVE',
          resolved.locality && resolved.locality.toLowerCase() !== resolved.district.toLowerCase() ? resolved.locality : undefined,
          true, // isGpsLive = true
          false,
          accuracy,
          pos.timestamp || Date.now()
        );
      } catch (err) {
        console.warn('Reverse geocode fallback for coordinates:', err);
        const freshLocation: CurrentDashboardLocation = {
          latitude,
          longitude,
          accuracy,
          timestamp: pos.timestamp || Date.now(),
          displayName: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
        };
        setCurrentLocation(freshLocation);
        setLocationStatus('ready');
        setLastUpdated(Date.now());
        setIsLocating(false);
      }
    };

    const onGpsError = (err: GeolocationPositionError) => {
      console.warn('Dashboard browser geolocation error:', err);
      setIsLocating(false);
      // Strictly enforce: never fall back to fake, stored or IP location!
      // Only mark unavailable if no verified GPS position has been established in this session
      setCurrentLocation((prev) => {
        if (!prev) {
          setLocationStatus('unavailable');
        }
        return prev;
      });
      if (err.code === 1) {
        setErrorMessage('Location permission denied — enable browser location access in your address bar.');
      } else if (err.code === 2) {
        setErrorMessage('Position unavailable from device GPS sensor.');
      } else if (err.code === 3) {
        setErrorMessage('Location request timed out. Please click "Use My Location" to retry.');
      } else {
        setErrorMessage('Current location unavailable — enable browser location access.');
      }
    };

    // Eagerly request High-Accuracy GPS (maximumAge: 0 enforces strictly fresh coordinates)
    navigator.geolocation.getCurrentPosition(
      onGpsSuccess,
      () => {
        // Fallback to standard accuracy if high-accuracy satellite lock takes too long
        navigator.geolocation.getCurrentPosition(
          onGpsSuccess,
          onGpsError,
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 0 }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0,
      }
    );
  }, []);

  // Request fresh location on component mount
  useEffect(() => {
    requestFreshLocation();
  }, [requestFreshLocation]);

  // Synchronize dashboard location only if appStore has genuine verified GPS (e.g. from Map's "Locate Me")
  useEffect(() => {
    if (selectedLocation?.isGpsLive && selectedLocation.lat && selectedLocation.lon && selectedLocation.name) {
      setCurrentLocation((prev) => {
        if (
          prev &&
          prev.displayName === selectedLocation.name &&
          Math.abs(prev.latitude - selectedLocation.lat) < 0.0001 &&
          Math.abs(prev.longitude - selectedLocation.lon) < 0.0001
        ) {
          return prev;
        }
        return {
          latitude: selectedLocation.lat,
          longitude: selectedLocation.lon,
          accuracy: selectedLocation.accuracy || 50,
          timestamp: selectedLocation.timestamp || Date.now(),
          displayName: selectedLocation.name,
        };
      });
      setLocationStatus('ready');
      setLastUpdated(selectedLocation.timestamp || Date.now());
    }
  }, [selectedLocation]);

  // Listen for "Use My Location" trigger from Header or other controls
  useEffect(() => {
    const handler = () => {
      requestFreshLocation();
    };
    window.addEventListener('thermo:refresh-location', handler);
    return () => window.removeEventListener('thermo:refresh-location', handler);
  }, [requestFreshLocation]);

  // Weather query strictly using fresh real-time coordinates (never hardcoded or default)
  const { data: weather, isLoading: wLoading, isError: wError } = useQuery({
    queryKey: ['dashboard-weather', currentLocation?.latitude, currentLocation?.longitude],
    queryFn: () => apiService.getWeather(currentLocation!.latitude, currentLocation!.longitude),
    enabled: !!currentLocation,
    staleTime: 30000,
  });

  const { data: thermal, isLoading: tLoading, isError: tError } = useQuery({
    queryKey: ['dashboard-thermal', currentLocation?.latitude, currentLocation?.longitude],
    queryFn: () => apiService.getThermalStress(currentLocation!.latitude, currentLocation!.longitude),
    enabled: !!currentLocation,
    staleTime: 30000,
  });

  const { data: risk, isLoading: rLoading, isError: rError } = useQuery({
    queryKey: ['dashboard-risk', currentLocation?.latitude, currentLocation?.longitude],
    queryFn: () => apiService.getRisk(currentLocation!.latitude, currentLocation!.longitude),
    enabled: !!currentLocation,
    staleTime: 30000,
  });

  const { data: alerts, isLoading: aLoading } = useQuery({
    queryKey: ['dashboard-alerts', currentLocation?.latitude, currentLocation?.longitude],
    queryFn: () => apiService.getAlerts(currentLocation!.latitude, currentLocation!.longitude),
    enabled: !!currentLocation,
    staleTime: 30000,
  });

  // Compute personalized thermal risk dynamically based on selected demographic vulnerability profile
  const activeThermal = useMemo(() => {
    if (!weather) return null;
    return computeRealThermalRisk(
      weather.temperature,
      weather.humidity,
      weather.windSpeed,
      weather.solarRadiation,
      vulnerabilityProfile
    );
  }, [weather, vulnerabilityProfile]);


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

  // If locating or location is unavailable, DO NOT show fake or previously stored location
  if (locationStatus === 'locating' || !currentLocation) {
    if (locationStatus === 'unavailable') {
      return (
        <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 max-w-lg shadow-[0_0_30px_rgba(245,158,11,0.15)] space-y-3">
            <MapPin className="w-12 h-12 mx-auto text-amber-400 animate-bounce" />
            <h2 className="text-xl font-black font-mono tracking-wider text-white">CURRENT LOCATION UNAVAILABLE</h2>
            <p className="text-sm text-gray-300 font-mono">
              {errorMessage || 'Current location unavailable — enable browser location access.'}
            </p>
            <p className="text-xs text-gray-500 font-mono">
              THERMOS strictly requires real-time device geolocation. Mock, cached, and assumed coordinates are prohibited.
            </p>
            <div className="pt-2">
              <button
                onClick={requestFreshLocation}
                className="skeuo-btn skeuo-btn-emerald px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Crosshair className="w-4 h-4" />
                <span>Enable / Retry Location Access</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="font-mono text-sm text-gray-300">Acquiring current browser GPS coordinates...</p>
      </div>
    );
  }

  if (wLoading || tLoading || rLoading || aLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="font-mono text-sm text-gray-300">Fetching live weather telemetry for {currentLocation.displayName}...</p>
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
            Unable to retrieve verified live telemetry from Open-Meteo API for {currentLocation.displayName}.
          </p>
          <p className="text-xs text-gray-500 font-mono mt-2">
            Mock and synthetic weather data fallbacks are strictly disabled.
          </p>
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
          <div className="p-2.5 rounded-xl neu-well text-orange-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {currentLocation.displayName}
            </h1>
          </div>
        </div>

        {/* CONTROLS & REAL-TIME BADGE */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={requestFreshLocation}
            disabled={isLocating}
            className="skeuo-btn px-3 py-1.5 text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10 hover:border-orange-500/30"
            title="Request fresh real-time browser location"
          >
            <Crosshair className={`w-3.5 h-3.5 text-orange-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
          </button>

          {lastUpdated && (
            <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
              Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}

          {weather.isLive && (
            <span className="skeuo-pill px-3.5 py-1.5 text-xs font-bold tracking-wider flex items-center gap-2 text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>LIVE TELEMETRY</span>
            </span>
          )}
        </div>
      </div>

      {/* DATA PROVENANCE PANEL — hidden for production */}

      {/* PERSONALIZED VULNERABILITY PROFILE SELECTOR */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-800/80 border border-white/10 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold font-mono tracking-wider text-slate-200 uppercase">
              Personalized Biometeorological Strain Profile
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            {VULNERABILITY_PROFILES[vulnerabilityProfile].description}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(VULNERABILITY_PROFILES) as VulnerabilityProfile[]).map((profKey) => {
            const prof = VULNERABILITY_PROFILES[profKey];
            const isActive = vulnerabilityProfile === profKey;
            return (
              <button
                key={profKey}
                onClick={() => setVulnerabilityProfile(profKey)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 text-left flex flex-col gap-0.5 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-b from-orange-500/25 via-orange-600/15 to-orange-700/20 border-orange-400/60 text-orange-300 shadow-[0_4px_16px_rgba(249,115,22,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] -translate-y-0.5'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600/80 hover:bg-slate-800/60 hover:-translate-y-0.5 active:translate-y-0'
                }`}
                type="button"
              >
                <span>{prof.label}</span>
                <span className={`text-[10px] font-normal transition-colors ${isActive ? 'text-orange-200/80' : 'text-slate-400'}`}>
                  {prof.metabolicOffset > 0 ? `+${prof.metabolicOffset} HTSS Strain` : 'Standard 150 W/m²'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRIMARY INSTRUMENTS ROW (HTSS DIAL + 4 CORE OPEN-METEO TELEMETRY FIELDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ThermalStressGauge
            score={fmt(activeThermal?.htss ?? thermal.htss)}
            level={activeThermal?.level ?? (thermal.htssCategory as any) ?? risk.level}
          />
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

      {/* AIR QUALITY & DUAL-HAZARD COUPLING (OPEN-METEO AIR QUALITY TELEMETRY) */}
      {weather.airQuality && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-white/10 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold font-mono text-white tracking-wide">
                  AIR QUALITY & DUAL-HAZARD COUPLING
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Live atmospheric particulate & ground-level ozone telemetry (Open-Meteo Air Quality)
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              (weather.airQuality.aqi ?? 50) > 150
                ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                : (weather.airQuality.aqi ?? 50) > 100
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400'
                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}>
              AQI {weather.airQuality.aqi} — {weather.airQuality.aqiCategory}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">PM2.5 Particulate</span>
              <span className="text-lg font-bold text-white">{weather.airQuality.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">PM10 Coarse Dust</span>
              <span className="text-lg font-bold text-white">{weather.airQuality.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Ground Ozone (O₃)</span>
              <span className="text-lg font-bold text-white">{weather.airQuality.ozone} <span className="text-xs font-normal text-slate-400">µg/m³</span></span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Compounding CHPI</span>
              <span className="text-lg font-bold text-orange-400">{weather.chpi ?? activeThermal?.htss ?? thermal.htss} <span className="text-xs font-normal text-slate-400">/ 100</span></span>
            </div>
          </div>
        </div>
      )}

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
            <Activity className="w-3 h-3 inline-block mr-1 text-orange-400/80" />
            Open HTSS Audit View
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
