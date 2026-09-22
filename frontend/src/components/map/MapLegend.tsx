import React, { useState } from 'react';
import { getRiskColorByCategory } from '../../utils/helpers';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  onOpenGuide?: () => void;
}

export const MapLegend: React.FC<Props> = ({ onOpenGuide }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const levels: { name: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'; range: string; label: string; desc: string }[] = [
    { name: 'LOW', range: '0–24', label: 'Low Risk (Safe / Cool)', desc: 'Minimal thermal strain. Normal outdoor daily activities.' },
    { name: 'MODERATE', range: '25–49', label: 'Moderate Risk (Caution)', desc: 'Mild heat discomfort. Maintain regular hydration.' },
    { name: 'HIGH', range: '50–74', label: 'High Risk (Dangerous Heat)', desc: 'Elevated strain. Take 15-min mandatory shade breaks.' },
    { name: 'EXTREME', range: '75–100', label: 'Extreme Risk (Critical Danger)', desc: 'Life-threatening heat stress. Stop outdoor work immediately.' },
  ];

  return (
    <div className="glass-card p-4 absolute bottom-6 left-6 z-[400] text-xs max-w-xs bg-dark-900/95 backdrop-blur-md border border-dark-600 shadow-2xl rounded-2xl space-y-3">
      <div className="flex items-center justify-between border-b border-dark-700 pb-2">
        <h4 className="font-extrabold text-white tracking-wide text-xs uppercase flex items-center gap-1.5">
          <span>🗺️ Risk Level Legend</span>
        </h4>
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-0.5"
              title="Open detailed map guide"
            >
              <Info className="w-3 h-3" /> Guide
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[10px] text-gray-400 hover:text-white font-bold bg-dark-800 px-2 py-0.5 rounded border border-dark-600 transition-colors"
          >
            {isCollapsed ? 'Show ▼' : 'Hide ▲'}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-1.5">
            {levels.map((lvl) => {
              const isSelected = selectedLevel === lvl.name;
              const color = getRiskColorByCategory(lvl.name);
              return (
                <div key={lvl.name} className="rounded-lg overflow-hidden border border-dark-700/50">
                  <button
                    onClick={() => setSelectedLevel(isSelected ? null : lvl.name)}
                    className="w-full p-2 flex items-center justify-between text-left hover:bg-dark-700/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/30 flex-shrink-0"
                        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                      />
                      <span className="text-gray-200 font-bold text-xs">{lvl.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                      <span>HTSS {lvl.range}</span>
                      {isSelected ? <ChevronUp className="w-3 h-3 text-orange-400" /> : <ChevronDown className="w-3 h-3 text-gray-500" />}
                    </div>
                  </button>

                  {isSelected && (
                    <div
                      className="p-2.5 pt-1 text-[11px] text-gray-300 border-t border-dark-700/50 space-y-1 animate-fadeIn"
                      style={{ backgroundColor: `${color}10` }}
                    >
                      <p className="font-semibold text-white">{lvl.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-400 italic text-center pt-2 border-t border-dark-700/40">
            Click any category for general safety advisories
          </p>
        </>
      )}
    </div>
  );
};
