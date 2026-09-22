import React from 'react';
import { X, Layers, Check } from 'lucide-react';

export interface ActiveMapLayers {
  thermalRisk: boolean;
  districtBoundaries: boolean;
  stateBoundaries: boolean;
  heatPulseGradient: boolean;
  temperature: boolean;
  humidity: boolean;
  wind: boolean;
  solarRadiation: boolean;
  wbgt: boolean;
  heatIndex: boolean;
  humidex: boolean;
  hospitals?: boolean;
  shelters?: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  layers: ActiveMapLayers;
  onToggleLayer: (key: keyof ActiveMapLayers) => void;
}

export const MapLayerSwitcherModal: React.FC<Props> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
}) => {
  if (!isOpen) return null;

  const layerItems: { key: keyof ActiveMapLayers; label: string; icon: string; group: string }[] = [
    { key: 'thermalRisk', label: 'Thermal Risk Score Layer', icon: '🔥', group: 'Core GIS' },
    { key: 'districtBoundaries', label: 'District Boundaries', icon: '📍', group: 'Core GIS' },
    { key: 'stateBoundaries', label: 'State Boundaries', icon: '🇮🇳', group: 'Core GIS' },
    { key: 'heatPulseGradient', label: 'Animated Heat Pulse Gradient', icon: '🌀', group: 'Visual Effects' },

    { key: 'wbgt', label: 'WBGT Layer (Occupational)', icon: '☀️', group: 'Thermal Indices' },
    { key: 'heatIndex', label: 'Heat Index Layer (Apparent Temp)', icon: '🌡️', group: 'Thermal Indices' },
    { key: 'humidex', label: 'Humidex Layer (Discomfort)', icon: '💧', group: 'Thermal Indices' },

    { key: 'temperature', label: 'Air Temperature (°C)', icon: '🔴', group: 'Weather Telemetry' },
    { key: 'humidity', label: 'Relative Humidity (%)', icon: '🔵', group: 'Weather Telemetry' },
    { key: 'wind', label: 'Wind Speed (km/h)', icon: '💨', group: 'Weather Telemetry' },
    { key: 'solarRadiation', label: 'Solar Radiation (W/m²)', icon: '⚡', group: 'Weather Telemetry' },
  ];

  const groups = Array.from(new Set(layerItems.map((item) => item.group)));

  return (
    <div className="absolute top-[68px] right-16 z-[550] w-80 max-h-[calc(100%-80px)] overflow-y-auto bg-dark-900/95 backdrop-blur-2xl border border-dark-600 shadow-2xl rounded-2xl p-4 text-xs animate-fadeIn">
      <div className="flex items-center justify-between border-b border-dark-700 pb-2.5 mb-3">
        <h4 className="font-black text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-orange-400" /> GIS Layer Control Center
        </h4>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
        {groups.map((grp) => (
          <div key={grp}>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1.5">
              {grp}
            </span>
            <div className="space-y-1">
              {layerItems
                .filter((item) => item.group === grp)
                .map((item) => {
                  const isActive = layers[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => onToggleLayer(item.key)}
                      className={`w-full p-2 rounded-xl flex items-center justify-between border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-orange-500/10 border-orange-500/40 text-white font-bold shadow-md'
                          : 'bg-dark-800/40 border-dark-700 text-gray-400 hover:bg-dark-800 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isActive
                            ? 'bg-orange-500 border-orange-400 text-white'
                            : 'border-dark-600 bg-dark-900'
                        }`}
                      >
                        {isActive && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
