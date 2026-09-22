import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CityData } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { useWeather, useThermalStress, useRisk } from '../../hooks/useApi';
import { getRiskColorByCategory } from '../../utils/helpers';
import { MapControls } from './MapControls';
import { MapLayerSwitcherModal, ActiveMapLayers } from './MapLayerSwitcherModal';
import { MapLoadingOverlay } from './MapLoadingOverlay';
import { LocationSelector } from '../location/LocationSelector';

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
  activeLayer = 'all',
  gisResolution = 'District / City Level Risk',
  onSelectResolution,
  onOpenGuide,
}) => {
  const { selectedLocation, setIndiaLocation, lowBandwidthMode } = useAppStore();
  const { data: weather } = useWeather();
  const { data: thermal } = useThermalStress();
  const { data: risk } = useRisk();
  const { districts: liveDistricts } = useAllIndiaLiveTelemetry();

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
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Active Map Layer States
  const [mapLayers, setMapLayers] = useState<ActiveMapLayers>({
    thermalRisk: true,
    districtBoundaries: true,
    stateBoundaries: true,
    heatPulseGradient: false,
    temperature: activeLayer === 'temp',
    humidity: false,
    wind: false,
    solarRadiation: false,
    wbgt: activeLayer === 'wbgt',
    heatIndex: activeLayer === 'hi',
    humidex: false,
  });

  const handleToggleLayer = (key: keyof ActiveMapLayers) => {
    setMapLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

  if (lowBandwidthMode) {
    return (
      <div className="w-full h-full overflow-y-auto bg-slate-950 p-4 sm:p-6 text-slate-200 space-y-6">
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white">Low Bandwidth / Battery Saver Mode Active</h3>
              <p className="text-xs text-slate-400">Map tiles, WebGL, and high-data animations are suspended to save data.</p>
            </div>
          </div>
          <button
            onClick={() => useAppStore.getState().setLowBandwidthMode(false)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            Switch to Interactive Map
          </button>
        </div>

        {/* Active Location Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Active Monitoring Zone</span>
              <h2 className="text-lg font-extrabold text-white">{selectedLocation.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Coordinates</span>
              <p className="font-mono text-xs text-slate-300">{selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lon.toFixed(4)}°E</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Temperature</span>
              <p className="text-lg font-bold text-white mt-0.5">{weather?.temperature ?? '--'}°C</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Relative Humidity</span>
              <p className="text-lg font-bold text-white mt-0.5">{weather?.humidity ?? '--'}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">HTSS Risk Score</span>
              <p className="text-lg font-bold text-amber-400 mt-0.5">{thermal?.htss ?? '--'} / 100</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400">Advisory Level</span>
              <p className="text-lg font-bold text-orange-400 mt-0.5">{risk?.level ?? thermal?.htssCategory ?? 'Moderate'}</p>
            </div>
          </div>
        </div>

        {/* District Telemetry Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span>District Monitoring Telemetry Network</span>
            <span className="text-xs text-slate-400 font-normal">{liveDistricts.slice(0, 6).length} stations</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveDistricts.slice(0, 6).map((dist, idx) => {
              const riskCategory = (dist.level.toUpperCase() as 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW');
              return (
                <div
                  key={`${dist.name}-${idx}`}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{dist.name} District</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {dist.temperature}°C • {dist.rh}% RH
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        riskCategory === 'EXTREME'
                          ? 'bg-red-500/20 text-red-300 border border-red-500'
                          : riskCategory === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500'
                          : riskCategory === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
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
        {/* Genuine OpenStreetMap Standard Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
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
        {/* LIVE REAL-TIME LOCATION BEACON & HIGH-PRECISION GPS PULSE MARKER          */}
        {/* ========================================================================= */}
        <CircleMarker
          center={[selectedLocation.lat, selectedLocation.lon]}
          radius={30}
          pathOptions={{
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            color: '#2563eb',
            weight: 2,
            dashArray: '4 4',
          }}
        />
        <CircleMarker
          center={[selectedLocation.lat, selectedLocation.lon]}
          radius={11}
          pathOptions={{
            fillColor: '#2563eb',
            fillOpacity: 1,
            color: '#ffffff',
            weight: 3.5,
          }}
        >
          <Popup className="dark-popup font-sans" autoPan={true}>
            <div className="p-2 min-w-[240px]">
              <div className="flex items-center gap-1.5 text-blue-400 font-black text-[11px] mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                📍 REAL-TIME LOCATION (OPENSTREETMAP)
              </div>
              <div className="font-extrabold text-sm text-white font-sans leading-tight">
                {selectedLocation.name}
              </div>
              <div className="text-[11px] text-gray-300 font-mono mt-1.5 bg-dark-800/80 p-1.5 rounded border border-dark-600">
                <div>Latitude: <strong>{selectedLocation.lat.toFixed(5)}°N</strong></div>
                <div>Longitude: <strong>{selectedLocation.lon.toFixed(5)}°E</strong></div>
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
              <div className="mt-2.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 rounded text-center">
                ✅ 100% GENUINE OPENSTREETMAP POSITION
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
        onToggleLayers={() => setIsLayerModalOpen(!isLayerModalOpen)}
        onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
        onOpenGuide={onOpenGuide || (() => {})}
      />

      {/* SEARCH LOCATION MODAL OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn pointer-events-auto">
          <div className="relative w-full max-w-lg bg-dark-900 border border-orange-500/30 rounded-2xl p-2 shadow-2xl">
            <div className="flex justify-end p-2 pb-0">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-dark-800 text-gray-400 hover:text-white border border-dark-600 transition cursor-pointer"
              >
                Close ✕
              </button>
            </div>
            <div onClick={() => setIsSearchOpen(false)}>
              <LocationSelector />
            </div>
          </div>
        </div>
      )}

      {/* MAP LAYER SWITCHER MODAL */}
      <MapLayerSwitcherModal
        isOpen={isLayerModalOpen}
        onClose={() => setIsLayerModalOpen(false)}
        layers={mapLayers}
        onToggleLayer={handleToggleLayer}
      />
    </div>
  );
};
