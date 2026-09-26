import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CityData } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { useWeather, useThermalStress, useRisk } from '../../hooks/useApi';
import { getRiskColorByCategory } from '../../utils/helpers';
import { computeRealThermalRisk } from '../../utils/thermalEngine';
import { MapControls } from './MapControls';
import { MapLoadingOverlay } from './MapLoadingOverlay';
import { LocationSelector } from '../location/LocationSelector';
import { INDIA_LOCATIONS } from '../../data/indiaLocations';

import { useAllIndiaLiveTelemetry } from '../../hooks/useAllIndiaLiveTelemetry';
import { detectRealtimeLocation, resolveLocationFromCoords } from '../../services/locationService';

interface Props {
  cities: CityData[];
  center?: [number, number];
  zoom?: number;
  activeLayer?: 'all' | 'risk' | 'temp' | 'wbgt' | 'hi';
  gisResolution?: string;
  onSelectResolution?: (res: string) => void;
  onOpenGuide?: () => void;
}

// Click handler component to allow clicking anywhere on the map to set location
const MapClickHandler: React.FC<{ onMapClick: (lat: number, lon: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Controller component for smooth cinematic map camera pan/zoom on location shift
const MapCameraController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  const targetLat = center[0];
  const targetLon = center[1];

  useEffect(() => {
    if (targetLat && targetLon) {
      map.flyTo([targetLat, targetLon], zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [targetLat, targetLon, zoom, map]);

  return null;
};

// Component to register map instance reference for toolbar controls
const MapInstanceRegistrar: React.FC<{ setMap: (map: L.Map) => void }> = ({ setMap }) => {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
};

export const HeatRiskMap: React.FC<Props> = ({
  center,
  zoom,
  gisResolution = 'District / City Level Risk',
  onSelectResolution,
  onOpenGuide,
}) => {
  const { selectedLocation, setIndiaLocation, lowBandwidthMode } = useAppStore();
  const { data: weather } = useWeather();
  const { data: thermal } = useThermalStress();
  const { data: risk } = useRisk();
  const { districts: liveDistricts } = useAllIndiaLiveTelemetry();

  // Resolve current active location's real-time HTSS score, category and color (matching Map Legend)
  const currentLocationHtss = useMemo(() => {
    // 1. Check if selected location matches a live district in liveDistricts
    const matchedDistrict = liveDistricts.find((d) => {
      if (selectedLocation.districtName && d.name.toLowerCase() === selectedLocation.districtName.toLowerCase()) {
        return true;
      }
      const distLat = Math.abs(d.lat - selectedLocation.lat);
      const distLon = Math.abs(d.lon - selectedLocation.lon);
      return distLat < 0.15 && distLon < 0.15;
    });

    let score = matchedDistrict?.htss ?? thermal?.htss ?? risk?.score;

    // 2. If no score yet, compute using thermal engine if weather is available
    if ((score === undefined || score === null) && weather && typeof weather.temperature === 'number' && typeof weather.humidity === 'number') {
      const computed = computeRealThermalRisk(
        weather.temperature,
        weather.humidity,
        weather.windSpeed || 1,
        weather.solarRadiation || 0
      );
      score = computed.htss;
    }

    const finalScore = score !== undefined && score !== null ? Math.round(score) : null;

    // Derive category according to Risk Level Legend (0-24: LOW, 25-49: MODERATE, 50-74: HIGH, 75-100: EXTREME)
    let category: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' = 'LOW';
    if (finalScore !== null) {
      if (finalScore >= 75) category = 'EXTREME';
      else if (finalScore >= 50) category = 'HIGH';
      else if (finalScore >= 25) category = 'MODERATE';
      else category = 'LOW';
    } else if (thermal?.htssCategory) {
      const upper = thermal.htssCategory.toUpperCase();
      if (upper.includes('EXTREME')) category = 'EXTREME';
      else if (upper.includes('HIGH')) category = 'HIGH';
      else if (upper.includes('MODERATE')) category = 'MODERATE';
      else category = 'LOW';
    } else if (risk?.level) {
      const upper = risk.level.toUpperCase();
      if (upper.includes('EXTREME')) category = 'EXTREME';
      else if (upper.includes('HIGH')) category = 'HIGH';
      else if (upper.includes('MODERATE')) category = 'MODERATE';
      else category = 'LOW';
    }

    const color = getRiskColorByCategory(category);

    return {
      score: finalScore,
      category,
      color,
    };
  }, [liveDistricts, selectedLocation, thermal, risk, weather]);

  const currentCenter: [number, number] = center || [selectedLocation.lat, selectedLocation.lon];

  // All-India view toggle check
  const isAllIndiaView = gisResolution === 'All-India District Overview';

  // Dynamic zoom & center calculation based on GIS Resolution selection
  let targetZoom = zoom || 11.5;
  let targetCenter: [number, number] = currentCenter;

  if (isAllIndiaView) {
    targetZoom = 5;
    targetCenter = [22.5937, 78.9629]; // All-India geographic center
  } else if (gisResolution.includes('State')) {
    targetZoom = 7;
  } else if (gisResolution.includes('City')) {
    targetZoom = 12.8;
  } else if (gisResolution.includes('District')) {
    targetZoom = 11.0;
  }

  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Map control toolbar handlers
  const handleZoomIn = () => {
    if (mapInstance) mapInstance.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstance) mapInstance.zoomOut();
  };

  const handleLocateMe = () => {
    detectRealtimeLocation(true);
    if (onSelectResolution) onSelectResolution('District / City Level Risk');
  };

  const handleResetView = () => {
    if (mapInstance) {
      mapInstance.flyTo([selectedLocation.lat, selectedLocation.lon], 11.5, { duration: 1.2 });
    }
  };

  const handleMapClick = async (lat: number, lon: number) => {
    try {
      const resolved = await resolveLocationFromCoords(lat, lon, false);
      setIndiaLocation(
        resolved.state,
        resolved.district,
        lat,
        lon,
        true,
        'LIVE',
        resolved.locality && resolved.locality.toLowerCase() !== resolved.district.toLowerCase() ? resolved.locality : undefined,
        false,
        true
      );
    } catch (err) {
      console.warn('Failed to resolve clicked map location:', err);
    }
  };

  // Fallback telemetry stations if liveDistricts is loading or empty in Low Bandwidth Mode
  const lowBandwidthStations = useMemo(() => {
    if (liveDistricts && liveDistricts.length > 0) {
      return liveDistricts.slice(0, 6);
    }
    const stateObj =
      INDIA_LOCATIONS.find((s) => s.name === selectedLocation.stateName) ||
      INDIA_LOCATIONS.find((s) => s.name === 'Tamil Nadu') ||
      INDIA_LOCATIONS[0];

    return (stateObj?.districts || []).slice(0, 6).map((d) => {
      const baseTemp = weather?.temperature ?? 34;
      const baseRh = weather?.humidity ?? 45;
      const baseHtss = thermal?.htss ?? 58;
      const baseLevel = (risk?.level ?? 'Moderate').toUpperCase();
      return {
        name: d.name,
        temperature: baseTemp,
        rh: baseRh,
        htss: baseHtss,
        level: baseLevel,
      };
    });
  }, [liveDistricts, selectedLocation, weather, thermal, risk]);

  if (lowBandwidthMode) {
    return (
      <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] p-4 sm:p-8 text-slate-800 space-y-6 pt-20 pb-20">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* LOW BANDWIDTH BANNER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/95 border border-amber-300 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
              <div>
                <h3 className="text-sm font-black text-amber-950">Low Bandwidth / Battery Saver Mode Active</h3>
                <p className="text-xs text-amber-800 font-medium">Map tiles, WebGL, and high-data animations are suspended to save data.</p>
              </div>
            </div>
            <button
              onClick={() => useAppStore.getState().setLowBandwidthMode(false)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm hover:shadow transition-all cursor-pointer flex-shrink-0"
            >
              Switch to Interactive Map ➔
            </button>
          </div>

          {/* ACTIVE LOCATION SUMMARY CARD */}
          <div className="p-6 rounded-3xl bg-white border border-blue-100 shadow-[0_8px_24px_rgba(30,100,200,0.06)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-0.5">Active Monitoring Zone</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">{selectedLocation.name}</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-semibold block">Coordinates</span>
                <p className="font-mono text-xs text-slate-800 font-bold">{selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lon.toFixed(4)}°E</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Temperature</span>
                <p className="text-2xl font-black text-slate-950 mt-1">{weather?.temperature !== undefined ? `${weather.temperature}°C` : '--'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Relative Humidity</span>
                <p className="text-2xl font-black text-slate-950 mt-1">{weather?.humidity !== undefined ? `${weather.humidity}%` : '--'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">HTSS Risk Score</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{thermal?.htss !== undefined ? `${thermal.htss} / 100` : '--'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Advisory Level</span>
                <p className="text-2xl font-black text-orange-600 mt-1">{risk?.level ?? thermal?.htssCategory ?? 'Moderate'}</p>
              </div>
            </div>
          </div>

          {/* DISTRICT TELEMETRY GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-950">
                District Monitoring Telemetry Network
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                {lowBandwidthStations.length} stations active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowBandwidthStations.map((dist, idx) => {
                const riskCategory = (dist.level.toUpperCase() as 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW');
                return (
                  <div
                    key={`${dist.name}-${idx}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{dist.name} District</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {dist.temperature}°C • {dist.rh}% RH
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black uppercase border ${
                          riskCategory === 'EXTREME'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : riskCategory === 'HIGH'
                            ? 'bg-red-50 text-red-800 border-red-300'
                            : riskCategory === 'MODERATE'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        HTSS {dist.htss}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-0 overflow-hidden bg-dark-950">
      {/* INITIALIZATION GIS LOADING OVERLAY */}
      {isLoading && <MapLoadingOverlay onComplete={() => setIsLoading(false)} />}

      <MapContainer
        center={targetCenter}
        zoom={targetZoom}
        style={{ height: '100%', width: '100%', background: '#030712' }}
        zoomControl={false}
      >
        {/* Google Satellite Hybrid Theme (High-Resolution Satellite Imagery + Labels) */}
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
          attribution='&copy; <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">Google Maps Satellite</a>'
        />

        <MapCameraController center={targetCenter} zoom={targetZoom} />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapInstanceRegistrar setMap={setMapInstance} />

        {/* ========================================================================= */}
        {/* ALL-INDIA & DISTRICT LEVEL REAL HTSS TELEMETRY OVERLAY                     */}
        {/* ========================================================================= */}
        {liveDistricts.map((dist, i) => {
          const riskCategory = (dist.level.toUpperCase() as 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW');
          const color = getRiskColorByCategory(riskCategory);
          const radius = 8 + dist.htss / 10;

          return (
            <CircleMarker
              key={`${dist.state}-${dist.name}-${i}`}
              center={[dist.lat, dist.lon]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.85,
                color: '#ffffff',
                weight: 1.8,
              }}
              eventHandlers={{
                click: () => {
                  setIndiaLocation(dist.state, dist.name, dist.lat, dist.lon, true, 'LIVE', undefined, false, true);
                  if (onSelectResolution) onSelectResolution('District / City Level Risk');
                },
              }}
            >
              <Popup className="dark-popup font-sans">
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center justify-between gap-2 border-b border-dark-600 pb-1 mb-1.5">
                    <span className="text-[10px] font-black uppercase text-orange-400">{dist.state}</span>
                    <span
                      className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
                      style={{ color, backgroundColor: `${color}20` }}
                    >
                      {riskCategory}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-white">{dist.name} District</h4>
                  <div className="text-xs text-gray-300 mt-1 space-y-0.5">
                    <div>HTSS Risk Score: <strong style={{ color }}>{dist.htss} / 100</strong></div>
                    <div>Live Open-Meteo Temp: <strong>{dist.temperature}°C</strong> | RH: <strong>{dist.rh}%</strong></div>
                    <div>WBGT: <strong>{dist.wbgt}°C</strong> | UTCI: <strong>{dist.utci}°C</strong></div>
                  </div>

                  <button
                    onClick={() => {
                      setIndiaLocation(dist.state, dist.name, dist.lat, dist.lon, true, 'LIVE', undefined, false, true);
                      if (onSelectResolution) onSelectResolution('District / City Level Risk');
                    }}
                    className="mt-3 w-full py-1.5 px-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black text-xs rounded-lg shadow-md transition-all cursor-pointer text-center"
                  >
                    🎯 Monitor This District
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* ========================================================================= */}
        {/* LIVE REAL-TIME LOCATION BEACON & HTSS RISK LEVEL PULSE MARKER             */}
        {/* ========================================================================= */}
        <CircleMarker
          center={[selectedLocation.lat, selectedLocation.lon]}
          radius={30}
          pathOptions={{
            fillColor: currentLocationHtss.color,
            fillOpacity: 0.22,
            color: currentLocationHtss.color,
            weight: 2.5,
            dashArray: '4 4',
          }}
        />
        <CircleMarker
          center={[selectedLocation.lat, selectedLocation.lon]}
          radius={11}
          pathOptions={{
            fillColor: currentLocationHtss.color,
            fillOpacity: 1,
            color: '#ffffff',
            weight: 3.5,
          }}
        >
          <Popup className="dark-popup font-sans" autoPan={true}>
            <div className="p-2 min-w-[240px]">
              <div className="flex items-center justify-between gap-2 border-b border-dark-600 pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5 font-black text-[11px]" style={{ color: currentLocationHtss.color }}>
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: currentLocationHtss.color }}
                  />
                  📍 ACTIVE LOCATION
                </div>
                <span
                  className="text-[10px] font-black uppercase px-2 py-0.5 rounded"
                  style={{
                    color: currentLocationHtss.color,
                    backgroundColor: `${currentLocationHtss.color}20`,
                    border: `1px solid ${currentLocationHtss.color}40`,
                  }}
                >
                  {currentLocationHtss.category}
                </span>
              </div>
              <div className="font-extrabold text-sm text-white font-sans leading-tight">
                {selectedLocation.name}
              </div>
              <div className="text-[11px] text-gray-300 font-mono mt-1.5 bg-dark-800/80 p-1.5 rounded border border-dark-600 space-y-0.5">
                <div>Latitude: <strong>{selectedLocation.lat.toFixed(5)}°N</strong></div>
                <div>Longitude: <strong>{selectedLocation.lon.toFixed(5)}°E</strong></div>
                {currentLocationHtss.score !== null && (
                  <div className="pt-1 mt-1 border-t border-dark-700/60 flex items-center justify-between">
                    <span>HTSS Risk Score:</span>
                    <strong style={{ color: currentLocationHtss.color }}>{currentLocationHtss.score} / 100</strong>
                  </div>
                )}
              </div>
              {weather && (
                <div className="mt-2 text-xs text-gray-200 border-t border-dark-600 pt-1.5 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Live Air Temp:</span>
                    <strong className="text-orange-400">{weather.temperature}°C</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <strong>{weather.humidity}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Wind Speed:</span>
                    <strong>{weather.windSpeed} km/h</strong>
                  </div>
                </div>
              )}
              <div
                className="mt-2.5 text-[10px] font-bold px-2 py-1 rounded text-center border"
                style={{
                  color: currentLocationHtss.color,
                  backgroundColor: `${currentLocationHtss.color}15`,
                  borderColor: `${currentLocationHtss.color}40`,
                }}
              >
                ● {currentLocationHtss.category} RISK LEVEL ({currentLocationHtss.score !== null ? `HTSS ${currentLocationHtss.score}` : 'ACTIVE'})
              </div>
            </div>
          </Popup>
        </CircleMarker>

        {/* CAMERA CONTROLLER */}
        <MapCameraController center={targetCenter} zoom={targetZoom} />
      </MapContainer>

      {/* FLOATING MAP CONTROLS TOOLBAR */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocateMe={handleLocateMe}
        onResetView={handleResetView}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onOpenGuide={onOpenGuide || (() => {})}
      />

      {/* SEARCH LOCATION MODAL OVERLAY (PORTALED TO DOCUMENT.BODY) */}
      {isSearchOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn pointer-events-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSearchOpen(false);
            }}
          >
            <div className="relative w-full max-w-lg bg-white border border-blue-100 rounded-3xl p-3 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex justify-end p-2 pb-0">
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                >
                  Close ✕
                </button>
              </div>
              <div>
                <LocationSelector onClose={() => setIsSearchOpen(false)} />
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
