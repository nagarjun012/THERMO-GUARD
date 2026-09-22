import React, { useState } from 'react';
import {
  Layers,
  Users,
  Wind,
  Sliders,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useIndustrialStore } from '../stores/industrialStore';
import { HeatZone } from '../data/industrialData';

export const HeatZonesPage: React.FC = () => {
  const { zones, updateZoneThreshold, getActiveFacility } = useIndustrialStore();
  const facility = getActiveFacility();

  const [selectedZone, setSelectedZone] = useState<HeatZone>(zones[0]);
  const [warningInput, setWarningInput] = useState<number>(zones[0]?.warningLimit || 36.0);
  const [criticalInput, setCriticalInput] = useState<number>(zones[0]?.criticalLimit || 40.0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleZoneSelect = (zone: HeatZone) => {
    setSelectedZone(zone);
    setWarningInput(zone.warningLimit);
    setCriticalInput(zone.criticalLimit);
    setSaveSuccess(false);
  };

  const handleSaveThresholds = () => {
    updateZoneThreshold(selectedZone.id, Number(warningInput), Number(criticalInput));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="industrial-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
              Physical Heat Zone Management
            </h1>
          </div>
          <p className="text-xs text-industrial-400 mt-0.5">
            Microclimate boundaries, biometeorological thresholds, and workforce safety configurations in {facility.name}
          </p>
        </div>
      </div>

      {/* Split Work Area: Left Zone List, Right Detailed Profile & Threshold Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Zone Selection Catalog */}
        <div className="space-y-2 lg:col-span-1">
          <div className="text-xs font-bold text-industrial-400 uppercase tracking-wider px-1">
            Facility Zones ({zones.length})
          </div>

          <div className="space-y-2">
            {zones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => handleZoneSelect(zone)}
                  className={`industrial-panel p-3.5 cursor-pointer transition-colors border ${
                    isSelected
                      ? 'border-amber-500 bg-industrial-800'
                      : 'border-industrial-700 hover:border-industrial-600 bg-industrial-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-industrial-100 text-xs">{zone.name}</span>
                    <span
                      className={
                        zone.status === 'SAFE'
                          ? 'badge-safe'
                          : zone.status === 'WARNING'
                          ? 'badge-warning'
                          : 'badge-advisory'
                      }
                    >
                      {zone.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-industrial-400">
                    <span>{zone.sensorId} • {zone.floor}</span>
                    <span className="font-mono font-bold text-industrial-50">
                      {zone.currentTemp.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (2 cols): Selected Zone Deep-Dive & Threshold Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Zone Detail Card */}
          <div className="industrial-panel p-5 space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-industrial-750">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-industrial-400 tracking-wider">
                  ZONE SPECIFICATION • {selectedZone.code}
                </span>
                <h2 className="text-xl font-bold text-industrial-50 tracking-tight mt-0.5">
                  {selectedZone.name}
                </h2>
                <div className="text-xs text-industrial-400 mt-1">
                  Building: <span className="text-industrial-200">{selectedZone.building}</span> • Floor:{' '}
                  <span className="text-industrial-200">{selectedZone.floor}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-industrial-400">Assigned Sensor:</span>
                <span className="px-2 py-1 rounded bg-industrial-900 border border-industrial-700 font-mono text-xs text-amber-300 font-bold">
                  {selectedZone.sensorId}
                </span>
              </div>
            </div>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded bg-industrial-900 border border-industrial-750">
                <span className="text-industrial-400 block text-[11px]">Current Ambient</span>
                <span className="text-2xl font-mono font-bold text-industrial-50 tabular-nums">
                  {selectedZone.currentTemp.toFixed(1)}°C
                </span>
              </div>

              <div className="p-3 rounded bg-industrial-900 border border-industrial-750">
                <span className="text-industrial-400 block text-[11px]">Outdoor / WBGT</span>
                <span className="text-2xl font-mono font-bold text-industrial-200 tabular-nums">
                  {selectedZone.wbgt.toFixed(1)}°C
                </span>
              </div>

              <div className="p-3 rounded bg-industrial-900 border border-industrial-750">
                <span className="text-industrial-400 block text-[11px]">Relative Humidity</span>
                <span className="text-2xl font-mono font-bold text-industrial-200 tabular-nums">
                  {selectedZone.humidity}%
                </span>
              </div>

              <div className="p-3 rounded bg-industrial-900 border border-industrial-750">
                <span className="text-industrial-400 block text-[11px]">Active Personnel</span>
                <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-amber-400" />
                  {selectedZone.assignedWorkers}
                </span>
              </div>
            </div>

            {/* Operational Systems Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded bg-industrial-900/60 border border-industrial-750 flex items-center justify-between">
                <div>
                  <span className="text-industrial-400 text-[11px] block">Ventilation & HVAC State</span>
                  <span className="font-semibold text-industrial-100 flex items-center gap-1.5 mt-0.5">
                    <Wind className="w-4 h-4 text-sky-400" />
                    {selectedZone.coolingSystem}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">100% Capacity</span>
              </div>

              <div className="p-3 rounded bg-industrial-900/60 border border-industrial-750 flex items-center justify-between">
                <div>
                  <span className="text-industrial-400 text-[11px] block">Evacuation Route Status</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Clear & Illuminated
                  </span>
                </div>
                <span className="text-[10px] font-mono text-industrial-400">Exit Door 4B</span>
              </div>
            </div>

            {/* Zone Environmental Description */}
            <div className="p-3 rounded bg-industrial-900/40 border border-industrial-750 text-xs text-industrial-300">
              <span className="text-[11px] font-semibold text-industrial-400 uppercase tracking-wide block mb-1">
                Field Engineering Notes:
              </span>
              <p className="leading-relaxed">{selectedZone.notes}</p>
            </div>

            {/* Threshold Configuration Controls */}
            <div className="p-4 rounded-lg bg-industrial-900 border border-industrial-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-industrial-100 uppercase tracking-wider">
                    Adjust Biometeorological Alert Boundaries
                  </h3>
                </div>

                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Thresholds Saved & Audited
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Warning Limit Slider / Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold">Warning Threshold</span>
                    <span className="font-mono font-bold text-industrial-50">{warningInput}°C</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={50}
                    step={0.5}
                    value={warningInput}
                    onChange={(e) => setWarningInput(Number(e.target.value))}
                    className="w-full accent-amber-500 bg-industrial-950 cursor-pointer"
                  />
                  <span className="text-[10px] text-industrial-500 block">
                    Triggers supervisory notification & cooling boost
                  </span>
                </div>

                {/* Critical Limit Slider / Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-red-400 font-semibold">Critical Limit</span>
                    <span className="font-mono font-bold text-industrial-50">{criticalInput}°C</span>
                  </div>
                  <input
                    type="range"
                    min={25}
                    max={60}
                    step={0.5}
                    value={criticalInput}
                    onChange={(e) => setCriticalInput(Number(e.target.value))}
                    className="w-full accent-red-500 bg-industrial-950 cursor-pointer"
                  />
                  <span className="text-[10px] text-industrial-500 block">
                    Triggers mandatory work stoppage & personnel evacuation
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  onClick={handleSaveThresholds}
                  className="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-industrial-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Zone Parameters</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
