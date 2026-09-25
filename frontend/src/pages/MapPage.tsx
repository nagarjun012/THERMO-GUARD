import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { HeatRiskMap } from '../components/map/HeatRiskMap';
import { MapLegend } from '../components/map/MapLegend';
import { MapEducationalModal } from '../components/map/MapEducationalModal';
import { Info, MapPin, Sliders, Sparkles } from 'lucide-react';

import { LocationSelector } from '../components/location/LocationSelector';

export const MapPage: React.FC = () => {
  const { selectedLocation } = useAppStore();

  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [gisResolution, setGisResolution] = useState('District / City Level Risk');
  const [layerFilter] = useState<'all' | 'risk' | 'temp' | 'wbgt' | 'hi'>('all');

  const locationName = selectedLocation?.name || 'Delhi, India';
  const currentCenter: [number, number] = [selectedLocation.lat, selectedLocation.lon];

  return (
    <div className="h-[calc(100vh-64px)] w-full relative overflow-hidden bg-[#CCE5FD]">
      {/* GIS MAP CONTAINER */}
      <HeatRiskMap
        cities={[]}
        center={currentCenter}
        activeLayer={layerFilter}
        gisResolution={gisResolution}
        onSelectResolution={(res) => setGisResolution(res)}
      />

      {/* TOP FLOATING OVERLAY BAR WITH MAP CONTROLS */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between gap-3 pointer-events-none">
        
        {/* LEFT: UNIFIED HORIZONTAL COMMAND STRIP */}
        <div className="pointer-events-auto flex items-center gap-2 max-w-[calc(100%-220px)]">
          <div className="px-3.5 py-1.5 bg-white/95 backdrop-blur-xl border border-white/80 shadow-lg rounded-2xl flex items-center gap-3 text-xs overflow-hidden">
            {/* LIVE DATA PILL */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono font-bold text-[10px] flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>LIVE</span>
            </div>

            {/* LOCATION SELECTOR TRIGGER */}
            <button
              onClick={() => setShowLocationSelector(!showLocationSelector)}
              className="flex items-center gap-1.5 hover:text-blue-700 font-bold text-slate-800 transition-colors cursor-pointer group flex-shrink-0"
              title="Click to switch location"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
              <span className="text-blue-700 underline underline-offset-2 font-black truncate max-w-[180px] sm:max-w-[240px]">
                {locationName}
              </span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block flex-shrink-0" />

            {/* GIS RESOLUTION SELECTOR */}
            <div className="flex items-center gap-1 text-[11px] text-slate-600 flex-shrink-0">
              <Sliders className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span className="text-slate-500 font-medium hidden md:inline">GIS:</span>
              <select
                value={gisResolution}
                onChange={(e) => setGisResolution(e.target.value)}
                className="bg-[#EDF5FD] text-slate-900 font-bold rounded-lg px-2 py-1 border border-blue-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="District / City Level Risk">District / City Level</option>
                <option value="All-India District Overview">All-India Districts</option>
                <option value="State / Regional Level Risk">State / Regional Level</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block flex-shrink-0" />

            {/* MAP GUIDE TRIGGER */}
            <button
              onClick={() => setIsEduModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-all cursor-pointer flex-shrink-0 group"
              title="Open Map Guide & HTSS Science Documentation"
            >
              <Info className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-12 transition-transform" />
              <span>Map Guide</span>
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            </button>
          </div>

          {/* MODAL OVERLAY FOR LOCATION SELECTOR */}
          {showLocationSelector && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn pointer-events-auto">
              <div className="relative w-full max-w-lg bg-white border border-blue-100 rounded-3xl p-3 shadow-2xl">
                <div className="flex justify-end p-2 pb-0">
                  <button
                    onClick={() => setShowLocationSelector(false)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
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
