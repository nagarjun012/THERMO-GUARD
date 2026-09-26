import React from 'react';
import {
  X,
  Layers,
  Check,
  Flame,
  MapPin,
  Map,
  Activity,
  Sun,
  Thermometer,
  Droplets,
  ThermometerSun,
  CloudRain,
  Wind,
  Zap,
} from 'lucide-react';

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

  const layerItems: { key: keyof ActiveMapLayers; label: string; icon: React.ComponentType<{ className?: string }>; group: string }[] = [
    { key: 'thermalRisk', label: 'Thermal Risk Score Layer', icon: Flame, group: 'Core GIS' },
    { key: 'districtBoundaries', label: 'District Boundaries', icon: MapPin, group: 'Core GIS' },
    { key: 'stateBoundaries', label: 'State Boundaries', icon: Map, group: 'Core GIS' },
    { key: 'heatPulseGradient', label: 'Animated Heat Pulse Gradient', icon: Activity, group: 'Visual Effects' },

    { key: 'wbgt', label: 'WBGT Layer (Occupational)', icon: Sun, group: 'Thermal Indices' },
    { key: 'heatIndex', label: 'Heat Index Layer (Apparent Temp)', icon: Thermometer, group: 'Thermal Indices' },
    { key: 'humidex', label: 'Humidex Layer (Discomfort)', icon: Droplets, group: 'Thermal Indices' },

    { key: 'temperature', label: 'Air Temperature (°C)', icon: ThermometerSun, group: 'Weather Telemetry' },
    { key: 'humidity', label: 'Relative Humidity (%)', icon: CloudRain, group: 'Weather Telemetry' },
    { key: 'wind', label: 'Wind Speed (km/h)', icon: Wind, group: 'Weather Telemetry' },
    { key: 'solarRadiation', label: 'Solar Radiation (W/m²)', icon: Zap, group: 'Weather Telemetry' },
  ];

  const groups = Array.from(new Set(layerItems.map((item) => item.group)));

  return (
    <div className="absolute top-[68px] right-16 z-[550] w-80 max-h-[calc(100%-80px)] overflow-y-auto bg-white/95 backdrop-blur-xl border border-blue-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.2)] rounded-3xl p-4 text-xs text-slate-800 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
        <h4 className="font-black text-slate-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-600" /> GIS Layer Control Center
        </h4>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 border border-slate-200 transition-colors cursor-pointer"
          title="Close layers"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
        {groups.map((grp) => (
          <div key={grp}>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-1.5">
              {grp}
            </span>
            <div className="space-y-1">
              {layerItems
                .filter((item) => item.group === grp)
                .map((item) => {
                  const isActive = layers[item.key];
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onToggleLayer(item.key)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between border text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 bg-white'
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
