import React from 'react';
import { getRiskColor } from '../../utils/helpers';

interface Props {
  title: string;
  value: number;
  max: number;
  unit: string;
  category: string;
}

export const ThermalIndexCard: React.FC<Props> = ({ title, value, max, unit, category }) => {
  const color = getRiskColor(category);
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="neu-card neu-card-hover p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider font-mono">
            {title}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {value}
            </span>
            <span className="text-xs font-semibold text-gray-500 font-mono">
              {unit}
            </span>
          </div>
        </div>
        <span
          className="skeuo-pill px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-md"
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}40`,
            color,
            textShadow: `0 0 8px ${color}60`,
          }}
        >
          {category}
        </span>
      </div>

      {/* SUNKEN RECESSED INDICATOR CHANNEL */}
      <div className="neu-well h-3 rounded-full overflow-hidden p-[2px] mt-2">
        <div
          className="h-full rounded-full transition-all duration-1000 shadow-sm relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}90`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
