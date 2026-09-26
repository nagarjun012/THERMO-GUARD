import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
import { DynamicWeatherSymbol, getClimateType } from '../components/dashboard/DynamicWeatherSymbol';
import { useAppStore } from '../stores/appStore';
import { computeFullAudit, calculateHeatIndex, calculateHumidex, calculateWetBulb, computeRealThermalRisk, VULNERABILITY_PROFILES, type VulnerabilityProfile } from '../utils/thermalEngine';
import { useHeatStressAlert } from '../hooks/useHeatStressAlert';
import { MapPin, AlertTriangle, Users, Crosshair, RefreshCw, Activity, Wind, Droplets, Droplet, Sun, Flame, ShieldAlert, HeartPulse } from 'lucide-react';
import type { Alert } from '../types';

// Lazy-loaded auxiliary modals & heavy panels to optimize initial bundle and eliminate CPU hydration freeze
const LocationSelector = React.lazy(() =>
  import('../components/location/LocationSelector').then((m) => ({ default: m.LocationSelector }))
);
const EmergencyHeatAlertModal = React.lazy(() =>
  import('../components/common/EmergencyHeatAlertModal').then((m) => ({ default: m.EmergencyHeatAlertModal }))
);
const HeatSymptomChecker = React.lazy(() =>
  import('../components/dashboard/HeatSymptomChecker').then((m) => ({ default: m.HeatSymptomChecker }))
);
const HTSSAuditView = React.lazy(() =>
  import('../components/dashboard/HTSSAuditView').then((m) => ({ default: m.HTSSAuditView }))
);
const HeatHealthPredictionPanel = React.lazy(() =>
  import('../components/dashboard/HeatHealthPredictionPanel').then((m) => ({ default: m.HeatHealthPredictionPanel }))
);
const OfficialThresholdReconciliation = React.lazy(() =>
  import('../components/common/OfficialThresholdReconciliation').then((m) => ({ default: m.OfficialThresholdReconciliation }))
);

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
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);

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

  // Synchronize dashboard location when appStore location changes (from GPS, Map click, or Selector)
  useEffect(() => {
    if (selectedLocation && typeof selectedLocation.lat === 'number' && typeof selectedLocation.lon === 'number' && selectedLocation.name) {
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

  // Automated Alert Messaging for High & Extreme HTSS
  const alertLocation = currentLocation?.displayName || selectedLocation?.name || 'Current Location';
  const {
    activeAlert,
    isModalOpen,
    openAlertModal,
    acknowledgeAlert,
    permission,
    enableSystemNotifications,
    triggerTestAlert,
    isAudioEnabled,
    setIsAudioEnabled,
  } = useHeatStressAlert(activeThermal?.htss, alertLocation);

  // Expose test alert event listener for QA & automated validation
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<'High' | 'Extreme'>;
      triggerTestAlert(custom?.detail || 'Extreme');
    };
    window.addEventListener('thermo:trigger-test-alert', handler);
    return () => window.removeEventListener('thermo:trigger-test-alert', handler);
  }, [triggerTestAlert]);

  // Real-time heat alerts strictly for High & Extreme HTSS scores with authentic user score
  const displayedAlerts = useMemo<Alert[]>(() => {
    // If activeThermal is not High or Extreme, strictly return NO thermal hazard alerts
    if (!activeThermal || (activeThermal.riskCategory !== 'HIGH' && activeThermal.riskCategory !== 'EXTREME')) {
      // Keep only severe air quality pollution dual-hazard alerts if present
      return (alerts || []).filter((a) => a.id.startsWith('alert-aqi-'));
    }

    const isExtreme = activeThermal.riskCategory === 'EXTREME';
    const emergencyAlert: Alert = {
      id: `alert-htss-${activeThermal.htss}-${activeThermal.riskCategory}`,
      title: isExtreme ? 'Critical Heat Emergency' : 'Dangerous Heat Advisory',
      message: isExtreme
        ? `HTSS ${activeThermal.htss}/100 — Life-threatening thermal stress in ${alertLocation}. Mandatory outdoor work stoppage. Seek cooling centers immediately.`
        : `HTSS ${activeThermal.htss}/100 — Severe thermal stress in ${alertLocation}. High risk of heat exhaustion for outdoor workers and vulnerable groups. Rest and hydration required.`,
      severity: isExtreme ? 'red' : 'orange',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: isExtreme
        ? [
            'Mandatory outdoor work stoppage',
            'Move into air-conditioned public cooling centers',
            'Drink oral rehydration solutions (ORS) immediately',
            'Dial 108 Ambulance if symptoms appear',
          ]
        : [
            'Avoid direct midday sun between 11:00 AM and 4:00 PM',
            'Mandatory 15-minute rest in shade every 45 minutes',
            'Drink 500ml of water or electrolytes hourly',
            'Wear loose, light-colored cotton clothing',
          ],
    };

    const severeAqiAlerts = (alerts || []).filter((a) => a.id.startsWith('alert-aqi-'));
    return [emergencyAlert, ...severeAqiAlerts];
  }, [activeThermal, alertLocation, alerts]);


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
          <div className="p-8 rounded-3xl bg-white/95 border border-white/90 text-amber-900 max-w-lg shadow-[0_14px_40px_rgba(20,90,190,0.1)] space-y-3">
            <MapPin className="w-12 h-12 mx-auto text-amber-500 animate-bounce" />
            <h2 className="text-xl font-black tracking-wider text-slate-900">CURRENT LOCATION UNAVAILABLE</h2>
            <p className="text-sm text-slate-600">
              {errorMessage || 'Current location unavailable — enable browser location access.'}
            </p>
            <p className="text-xs text-slate-400">
              THERMOS strictly requires real-time device geolocation. Mock, cached, and assumed coordinates are prohibited.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={requestFreshLocation}
                className="px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
              >
                <Crosshair className="w-4 h-4" />
                <span>Enable / Retry Location Access</span>
              </button>
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="px-5 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Select District Manually</span>
              </button>
            </div>
          </div>
          {isSelectorOpen &&
            createPortal(
              <div
                className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setIsSelectorOpen(false);
                }}
              >
                <div className="relative w-full max-w-lg bg-white border border-blue-100 rounded-3xl p-3 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
                  <div className="flex justify-end p-2 pb-0">
                    <button
                      onClick={() => setIsSelectorOpen(false)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>
                  <div>
                    <React.Suspense fallback={<div className="h-40 flex items-center justify-center"><RefreshCw className="w-5 h-5 animate-spin text-blue-600" /></div>}>
                      <LocationSelector onClose={() => setIsSelectorOpen(false)} />
                    </React.Suspense>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] py-24 flex flex-col items-center justify-center text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">Acquiring current browser GPS coordinates...</p>
      </div>
    );
  }

  if (wLoading || tLoading || rLoading || aLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] py-24 flex flex-col items-center justify-center text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-bold text-slate-700">Fetching live weather telemetry for {currentLocation.displayName}...</p>
      </div>
    );
  }

  // Strictly enforce: If API request fails or no verified live response is received, display DATA UNAVAILABLE
  if (wError || tError || rError || !weather || !thermal || !risk || !alerts || !weather.isLive) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] py-24 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-8 rounded-3xl bg-white/95 border border-red-200 text-red-700 max-w-lg shadow-[0_14px_40px_rgba(239,68,68,0.15)]">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
          <h2 className="text-2xl font-black tracking-wider text-red-600">DATA UNAVAILABLE</h2>
          <p className="text-sm text-slate-600 mt-3">
            Unable to retrieve verified live telemetry from Open-Meteo API for {currentLocation.displayName}.
          </p>
          <p className="text-xs text-slate-400 mt-2">
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
    <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] text-slate-800 pb-20 relative overflow-hidden -mt-2">
      {/* SOFT ATMOSPHERIC REALISTIC SKY CLOUDS (FIGMA REFERENCE) */}
      <div className="absolute top-0 right-0 w-[550px] h-[300px] bg-white/45 rounded-full blur-3xl pointer-events-none -mr-28 -mt-24" />
      <div className="absolute top-72 left-0 w-[600px] h-[350px] bg-white/35 rounded-full blur-3xl pointer-events-none -ml-40" />
      <div className="absolute top-[1200px] right-10 w-[700px] h-[400px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 relative z-10">
        {/* LOCATION HEADER ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white border border-white text-blue-600 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedLocation?.name || currentLocation.displayName}
              </h1>
            </div>
          </div>

          {/* CONTROLS & REAL-TIME BADGE */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={requestFreshLocation}
              disabled={isLocating}
              className="px-4 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 text-slate-700 bg-white/90 hover:bg-white transition-all cursor-pointer border border-white shadow-xs"
              title="Request fresh real-time browser location"
            >
              <Crosshair className={`w-3.5 h-3.5 text-blue-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Use My Location'}</span>
            </button>

            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-full flex items-center gap-1.5 text-slate-700 bg-white/90 hover:bg-white transition-all cursor-pointer border border-white shadow-xs"
              title="Search and select another location"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Change Location</span>
            </button>

            {lastUpdated && (
              <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline bg-white/60 px-3 py-1 rounded-full border border-white/60">
                Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}

            {weather.isLive && (
              <span className="px-3.5 py-1.5 text-xs font-extrabold tracking-wider flex items-center gap-2 text-emerald-800 border border-emerald-200 bg-emerald-50/90 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span>LIVE TELEMETRY</span>
              </span>
            )}

            {/* Real-time High / Extreme Emergency Alert Indicator */}
            {(activeThermal?.riskCategory === 'HIGH' || activeThermal?.riskCategory === 'EXTREME') && (
              <button
                type="button"
                onClick={openAlertModal}
                className={`px-3.5 py-1.5 text-xs font-black tracking-wider flex items-center gap-1.5 rounded-full shadow-md animate-pulse cursor-pointer ${
                  activeThermal.riskCategory === 'EXTREME'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                }`}
                title="View active thermal emergency advisory"
              >
                {activeThermal.riskCategory === 'EXTREME' ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : (
                  <Flame className="w-3.5 h-3.5" />
                )}
                <span>{activeThermal.riskCategory} ALERT (HTSS {activeThermal.htss})</span>
              </button>
            )}

            {/* Heat Illness Symptom Self-Triage Button */}
            <button
              type="button"
              onClick={() => setIsSymptomCheckerOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 text-red-700 bg-red-50/90 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer shadow-xs"
              title="Open Clinical Heat Symptom Self-Check & Triage"
            >
              <HeartPulse className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>Check Symptoms</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC CLIMATE & WEATHER HERO BANNER (EXACT FIGMA REFERENCE LAYOUT) */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 border border-white/90 shadow-[0_14px_40px_rgba(20,90,190,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                  {fmt(weather.temperature)}°C
                </span>
                <span className="text-xs font-extrabold text-blue-700 uppercase px-3 py-1 rounded-full bg-[#EDF5FD] border border-blue-100/70 shadow-xs">
                  {getClimateType(Number(weather.temperature), Number(weather.humidity)).replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-500 pt-1">
                Feels like {fmt(heatIndex)}°C • {weather.windSpeed} km/h wind • {weather.humidity}% humidity
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1.5">
              <DynamicWeatherSymbol
                temp={Number(weather.temperature)}
                humidity={Number(weather.humidity)}
                size="xl"
              />
              <span className="text-xs font-bold text-slate-700 px-3.5 py-1 rounded-full bg-[#EDF5FD] border border-blue-100/80 shadow-xs">
                {Number(weather.temperature) >= 38
                  ? '🔥 High Weather / Heat Stress'
                  : Number(weather.humidity) >= 75
                  ? '🌧️ High Humidity & Rain Showers'
                  : Number(weather.temperature) <= 15
                  ? '❄️ Low Temp / Cold Wave'
                  : '☀️ Clear Atmospheric Conditions'}
              </span>
            </div>
          </div>

          {/* Quick Inset Metric Tiles with Dynamic Weather Symbols */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            {/* 1. Wind Speed Tile */}
            {(() => {
              const spd = Number(weather.windSpeed) || 0;
              const cond =
                spd < 5
                  ? { icon: '🍃', label: 'Calm Air', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
                  : spd < 15
                  ? { icon: '💨', label: 'Gentle Breeze', badge: 'bg-sky-50 text-sky-800 border-sky-200' }
                  : spd < 30
                  ? { icon: '🌬️', label: 'Moderate Wind', badge: 'bg-blue-50 text-blue-800 border-blue-200' }
                  : { icon: '🌪️', label: 'High Gale', badge: 'bg-amber-50 text-amber-800 border-amber-200' };

              return (
                <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 hover:bg-[#E4F0FC] transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-blue-600" />
                      Wind Speed
                    </span>
                    <span className="text-base leading-none" title={cond.label}>{cond.icon}</span>
                  </div>
                  <div className="text-xl font-black text-slate-950 my-0.5">
                    {fmt(weather.windSpeed)} <span className="text-xs font-bold text-slate-600">km/h</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block w-fit mt-1 ${cond.badge}`}>
                    {cond.label}
                  </div>
                </div>
              );
            })()}

            {/* 2. Dew Point Tile */}
            {(() => {
              const dp = Number(weather.dewPoint) || 0;
              const cond =
                dp < 10
                  ? { icon: '🍂', label: 'Dry / Crisp', badge: 'bg-amber-50 text-amber-800 border-amber-200' }
                  : dp < 18
                  ? { icon: '💧', label: 'Comfortable', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
                  : dp < 24
                  ? { icon: '💦', label: 'Humid / Sticky', badge: 'bg-orange-50 text-orange-800 border-orange-200' }
                  : { icon: '♨️', label: 'Oppressive', badge: 'bg-red-50 text-red-800 border-red-200' };

              return (
                <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 hover:bg-[#E4F0FC] transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-teal-600" />
                      Dew Point
                    </span>
                    <span className="text-base leading-none" title={cond.label}>{cond.icon}</span>
                  </div>
                  <div className="text-xl font-black text-slate-950 my-0.5">
                    {fmt(weather.dewPoint)} <span className="text-xs font-bold text-slate-600">°C</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block w-fit mt-1 ${cond.badge}`}>
                    {cond.label}
                  </div>
                </div>
              );
            })()}

            {/* 3. Humidity Tile */}
            {(() => {
              const rh = Number(weather.humidity) || 0;
              const cond =
                rh < 30
                  ? { icon: '🏜️', label: 'Dry Air', badge: 'bg-amber-50 text-amber-800 border-amber-200' }
                  : rh < 60
                  ? { icon: '💧', label: 'Optimal / Fair', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
                  : rh < 80
                  ? { icon: '🌧️', label: 'High Moisture', badge: 'bg-blue-50 text-blue-800 border-blue-200' }
                  : { icon: '⛈️', label: 'Saturated', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' };

              return (
                <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 hover:bg-[#E4F0FC] transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-blue-600" />
                      Humidity
                    </span>
                    <span className="text-base leading-none" title={cond.label}>{cond.icon}</span>
                  </div>
                  <div className="text-xl font-black text-slate-950 my-0.5">
                    {fmt(weather.humidity)} <span className="text-xs font-bold text-slate-600">%</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block w-fit mt-1 ${cond.badge}`}>
                    {cond.label}
                  </div>
                </div>
              );
            })()}

            {/* 4. Solar Radiation Tile */}
            {(() => {
              const rad = Number(weather.solarRadiation) || 0;
              const cond =
                rad <= 0
                  ? { icon: '🌙', label: 'Night / Zero UV', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' }
                  : rad < 250
                  ? { icon: '⛅', label: 'Low Irradiance', badge: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
                  : rad < 600
                  ? { icon: '☀️', label: 'Moderate Sunlight', badge: 'bg-amber-50 text-amber-800 border-amber-200' }
                  : { icon: '🔥', label: 'Intense Solar UV', badge: 'bg-red-50 text-red-800 border-red-200' };

              return (
                <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 hover:bg-[#E4F0FC] transition-colors flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      Solar Radiation
                    </span>
                    <span className="text-base leading-none" title={cond.label}>{cond.icon}</span>
                  </div>
                  <div className="text-xl font-black text-slate-950 my-0.5">
                    {fmt(weather.solarRadiation)} <span className="text-xs font-bold text-slate-600">W/m²</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block w-fit mt-1 ${cond.badge}`}>
                    {cond.label}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* PERSONALIZED VULNERABILITY PROFILE SELECTOR */}
        <div className="p-5 rounded-[28px] bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_10px_32px_rgba(30,100,200,0.07)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-extrabold tracking-wider text-slate-800 uppercase">
                Personalized Biometeorological Strain Profile
              </span>
            </div>
            <span className="text-xs text-blue-700 font-bold">
              {VULNERABILITY_PROFILES[vulnerabilityProfile].description}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(VULNERABILITY_PROFILES) as VulnerabilityProfile[]).map((profKey) => {
              const prof = VULNERABILITY_PROFILES[profKey];
              const isActive = vulnerabilityProfile === profKey;
              return (
                <button
                  key={profKey}
                  onClick={() => setVulnerabilityProfile(profKey)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left flex flex-col gap-0.5 cursor-pointer border ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] -translate-y-0.5'
                      : 'bg-[#EDF5FD] border-blue-100/70 text-slate-700 hover:bg-[#E2F0FD] hover:text-slate-900'
                  }`}
                  type="button"
                >
                  <span>{prof.label}</span>
                  <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
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
          htss={fmt(activeThermal?.htss ?? thermal.htss) as number}
          riskCategory={activeThermal?.level || thermal.htssCategory || risk.level}
          wbgt={fmt(activeThermal?.wbgt ?? thermal.wbgt) as number}
          utci={fmt(activeThermal?.utci ?? thermal.utci) as number}
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
            color="#8b5cf6"
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
            color="#0d9488"
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
          <div className="p-6 rounded-[28px] bg-white/95 backdrop-blur-md border border-white/90 shadow-[0_10px_32px_rgba(30,100,200,0.07)]">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                    AIR QUALITY & DUAL-HAZARD COUPLING
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Live atmospheric particulate & ground-level ozone telemetry (Open-Meteo Air Quality)
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                (weather.airQuality.aqi ?? 50) > 150
                  ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                  : (weather.airQuality.aqi ?? 50) > 100
                  ? 'bg-orange-50 text-orange-800 border-orange-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                AQI {weather.airQuality.aqi} — {weather.airQuality.aqiCategory}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/70">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">PM2.5 Particulate</span>
                <span className="text-lg font-black text-slate-900">{weather.airQuality.pm25} <span className="text-xs font-normal text-slate-500">µg/m³</span></span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/70">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">PM10 Coarse Dust</span>
                <span className="text-lg font-black text-slate-900">{weather.airQuality.pm10} <span className="text-xs font-normal text-slate-500">µg/m³</span></span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/70">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Ground Ozone (O₃)</span>
                <span className="text-lg font-black text-slate-900">{weather.airQuality.ozone} <span className="text-xs font-normal text-slate-500">µg/m³</span></span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#EDF5FD] border border-blue-100/70">
                <span className="text-[11px] font-bold text-slate-500 block uppercase">Compounding CHPI</span>
                <span className="text-lg font-black text-orange-600">{weather.chpi ?? activeThermal?.htss ?? thermal.htss} <span className="text-xs font-normal text-slate-500">/ 100</span></span>
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
      <React.Suspense fallback={null}>
        <OfficialThresholdReconciliation
          currentTemp={Number(weather.temperature)}
          currentHtss={Number(activeThermal?.htss ?? thermal.htss)}
        />
      </React.Suspense>

      {/* 3-5 DAY HEAT-HEALTH WARNING WINDOW & EPIDEMIOLOGICAL RISK INTELLIGENCE */}
      {currentLocation && (
        <React.Suspense fallback={<div className="h-40 bg-white/50 rounded-3xl animate-pulse" />}>
          <HeatHealthPredictionPanel
            lat={currentLocation.latitude}
            lon={currentLocation.longitude}
            locationName={currentLocation.displayName}
          />
        </React.Suspense>
      )}

      {/* HEAT STRESS FACTOR DECOMPOSITION */}
      <RiskContributionBar factors={risk.primaryFactors} />

      {/* TERTIARY DIAGNOSTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HeatwaveProbability probability={risk.probability} trend="up" />
        </div>
        <div className="lg:col-span-1">
          <AlertPanel alerts={displayedAlerts} />
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
        <React.Suspense fallback={null}>
          <HTSSAuditView
            audit={auditData}
            isOpen={isAuditOpen}
            onClose={() => setIsAuditOpen(false)}
          />
        </React.Suspense>
      )}

      {/* EMERGENCY HEAT STRESS ALERT MODAL (HIGH & EXTREME) */}
      <React.Suspense fallback={null}>
        <EmergencyHeatAlertModal
          alert={activeAlert}
          isOpen={isModalOpen}
          onAcknowledge={acknowledgeAlert}
          permission={permission}
          onRequestPermission={enableSystemNotifications}
          isAudioEnabled={isAudioEnabled}
          onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        />
      </React.Suspense>

      {/* HEAT ILLNESS CLINICAL SYMPTOM TRIAGE MODAL */}
      <React.Suspense fallback={null}>
        <HeatSymptomChecker
          isOpen={isSymptomCheckerOpen}
          onClose={() => setIsSymptomCheckerOpen(false)}
        />
      </React.Suspense>

      {/* LOCATION SELECTOR MODAL OVERLAY */}
      {isSelectorOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSelectorOpen(false);
            }}
          >
            <div className="relative w-full max-w-lg bg-white border border-blue-100 rounded-3xl p-3 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex justify-end p-2 pb-0">
                <button
                  onClick={() => setIsSelectorOpen(false)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
              <div>
                <React.Suspense fallback={<div className="h-40 flex items-center justify-center"><RefreshCw className="w-5 h-5 animate-spin text-blue-600" /></div>}>
                  <LocationSelector onClose={() => setIsSelectorOpen(false)} />
                </React.Suspense>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};
