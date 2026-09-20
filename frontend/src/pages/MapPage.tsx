import React, { useState } from 'react';
import { useGovernmentDashboard } from '../hooks/useApi';
import { useAppStore } from '../stores/appStore';
import { HeatRiskMap } from '../components/map/HeatRiskMap';
import { MapLegend } from '../components/map/MapLegend';
import { MapEducationalModal } from '../components/map/MapEducationalModal';
import { Info, Layers, MapPin, Sliders, Activity, Sparkles } from 'lucide-react';


import { LocationSelector } from '../components/location/LocationSelector';

export const MapPage: React.FC = () => {
  const { data, isLoading } = useGovernmentDashboard();
  const { selectedLocation } = useAppStore();

  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [gisResolution, setGisResolution] = useState('Hyper-Local Ward GIS Risk');
  const [layerFilter, setLayerFilter] = useState<'all' | 'risk' | 'temp' | 'wbgt' | 'hi'>('all');

  if (isLoading || !data) {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center bg-dark-900 text-gray-400">
        <div className="flex flex-col items-center gap-3">
          <Activity className="w-8 h-8 text-orange-500 animate-spin" />
          <span className="text-sm font-semibold">Loading Live Heat Risk GIS Map...</span>
        </div>
      </div>
    );
  }

  const locationName = selectedLocation?.name || 'Delhi, India';
  const currentCenter: [number, number] = [selectedLocation.lat, selectedLocation.lon];

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-dark-900">
      {/* GIS MAP CONTAINER */}
      <HeatRiskMap
        cities={data.cities}
        center={currentCenter}
        activeLayer={layerFilter}
        gisResolution={gisResolution}
        onSelectResolution={(res) => setGisResolution(res)}
      />

      {/* TOP FLOATING OVERLAY BAR WITH MAP CONTROLS */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between gap-3 pointer-events-none">
        
        {/* LEFT: UNIFIED HORIZONTAL COMMAND STRIP */}
        <div className="pointer-events-auto flex items-center gap-2 max-w-[calc(100%-220px)]">
          <div className="glass-card px-3.5 py-1.5 bg-dark-900/90 backdrop-blur-xl border border-dark-600/90 shadow-2xl rounded-2xl flex items-center gap-3 text-xs overflow-hidden">
            {/* LIVE DATA PILL */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px] flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>

            {/* LOCATION SELECTOR TRIGGER */}
            <button
              onClick={() => setShowLocationSelector(!showLocationSelector)}
              className="flex items-center gap-1.5 hover:text-orange-400 font-bold text-white transition-colors cursor-pointer group flex-shrink-0"
              title="Click to switch location"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="text-orange-400 underline underline-offset-2 font-black truncate max-w-[180px] sm:max-w-[240px]">
                {locationName}
              </span>
            </button>

            <div className="h-4 w-px bg-dark-700 hidden sm:block flex-shrink-0" />

            {/* GIS RESOLUTION SELECTOR */}
            <div className="flex items-center gap-1 text-[11px] text-gray-300 flex-shrink-0">
              <Sliders className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
              <span className="text-gray-400 font-medium hidden md:inline">GIS:</span>
              <select
                value={gisResolution}
                onChange={(e) => setGisResolution(e.target.value)}
                className="bg-dark-800 text-white font-semibold rounded-lg px-2 py-1 border border-dark-600 text-xs focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="Hyper-Local Ward GIS Risk">🏙️ Ward Level</option>
                <option value="All-India District Overview">🌐 All-India</option>
                <option value="District / City Level Risk">🌆 City Level</option>
                <option value="State / Regional Level Risk">🗺️ State Level</option>
              </select>
            </div>

            <div className="h-4 w-px bg-dark-700 hidden md:block flex-shrink-0" />

            {/* LAYER FILTER SELECTOR */}
            <div className="flex items-center gap-1 text-[11px] text-gray-300 hidden sm:flex flex-shrink-0">
              <Layers className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
              <span className="text-gray-400 font-medium hidden lg:inline">Layer:</span>
              <select
                value={layerFilter}
                onChange={(e) => setLayerFilter(e.target.value as any)}
                className="bg-dark-800 text-white font-semibold rounded-lg px-2 py-1 border border-dark-600 text-xs focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="all">Ward Risk Overlay</option>
                <option value="risk">Thermal Heatmap</option>
                <option value="temp">Air Temp (°C)</option>
                <option value="wbgt">WBGT Index</option>
                <option value="hi">Heat Index</option>
              </select>
            </div>

            <div className="h-4 w-px bg-dark-700 hidden sm:block flex-shrink-0" />

            {/* MAP GUIDE TRIGGER */}
            <button
              onClick={() => setIsEduModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/10 hover:from-orange-500/30 hover:to-red-500/30 text-orange-300 hover:text-white border border-orange-500/30 font-bold text-xs transition-all cursor-pointer flex-shrink-0 group"
              title="Open Map Guide & HTSS Science Documentation"
            >
              <Info className="w-3.5 h-3.5 text-orange-400 group-hover:rotate-12 transition-transform" />
              <span>Map Guide</span>
              <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
            </button>
          </div>

          {/* MODAL OVERLAY FOR LOCATION SELECTOR */}
          {showLocationSelector && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn pointer-events-auto">
              <div className="relative w-full max-w-lg bg-dark-900 border border-orange-500/30 rounded-2xl p-2 shadow-2xl">
                <div className="flex justify-end p-2 pb-0">
                  <button
                    onClick={() => setShowLocationSelector(false)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-dark-800 text-gray-400 hover:text-white border border-dark-600 transition cursor-pointer"
                  >
                    Close ✕
                  </button>
                </div>
                <div onClick={() => setShowLocationSelector(false)}>
                  <LocationSelector />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAP LEGEND OVERLAY */}
      <MapLegend onOpenGuide={() => setIsEduModalOpen(true)} />

      {/* EDUCATIONAL GLASSMORPHISM MODAL PANEL */}
      <MapEducationalModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        currentLocationName={locationName}
      />
    </div>
  );
};
