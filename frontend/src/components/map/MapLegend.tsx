import React, { useState } from 'react';
import { getRiskColorByCategory } from '../../utils/helpers';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  onOpenGuide?: () => void;
}

export const MapLegend: React.FC<Props> = ({ onOpenGuide }) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    () => (typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  );

  const levels: { name: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME'; range: string; label: string; desc: string }[] = [
    { name: 'LOW', range: '0–24', label: 'Low Risk (Safe / Cool)', desc: 'Minimal thermal strain. Normal outdoor daily activities.' },
    { name: 'MODERATE', range: '25–49', label: 'Moderate Risk (Caution)', desc: 'Mild heat discomfort. Maintain regular hydration.' },
    { name: 'HIGH', range: '50–74', label: 'High Risk (Dangerous Heat)', desc: 'Elevated strain. Take 15-min mandatory shade breaks.' },
    { name: 'EXTREME', range: '75–100', label: 'Extreme Risk (Critical Danger)', desc: 'Life-threatening heat stress. Stop outdoor work immediately.' },
  ];

  return (
    <div className="p-3 sm:p-4 absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-[400] text-xs max-w-[280px] sm:max-w-xs bg-white/95 backdrop-blur-xl border border-blue-200/80 shadow-2xl rounded-2xl space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h4 className="font-black text-slate-900 tracking-wide text-xs uppercase flex items-center gap-1.5">
          <span>🗺️ Risk Level Legend</span>
        </h4>
        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-[11px] text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Open detailed map guide"
            >
              <Info className="w-3 h-3" /> Guide
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[11px] text-slate-800 hover:text-slate-950 font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded-lg border border-slate-300 transition-colors cursor-pointer"
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
                <div key={lvl.name} className="rounded-xl overflow-hidden border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm">
                  <button
                    onClick={() => setSelectedLevel(isSelected ? null : lvl.name)}
                    className="w-full p-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
                      />
                      <span className="text-slate-950 font-black text-xs tracking-wider">{lvl.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-800 font-bold">
                      <span>HTSS {lvl.range}</span>
                      {isSelected ? <ChevronUp className="w-3.5 h-3.5 text-slate-800" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
                    </div>
                  </button>

                  {isSelected && (
                    <div
                      className="p-2.5 pt-2 text-xs border-t border-slate-200 space-y-1 animate-fadeIn"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <p className="font-black text-slate-950">{lvl.label}</p>
                      <p className="font-semibold text-slate-800 leading-snug">{lvl.desc}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-700 font-bold italic text-center pt-2 border-t border-slate-200">
            Click any category for general safety advisories
          </p>
        </>
      )}
    </div>
  );
};
