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
    <div className="bg-white/95 backdrop-blur-md rounded-[26px] p-5 sm:p-6 flex flex-col justify-between border border-white/90 shadow-[0_10px_30px_rgba(30,100,200,0.06)] hover:shadow-[0_14px_36px_rgba(30,100,200,0.1)] transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
            {title}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {unit}
            </span>
          </div>
        </div>
        <span
          className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border shadow-xs"
          style={{
            backgroundColor: `${color}15`,
            borderColor: `${color}35`,
            color,
          }}
        >
          {category}
        </span>
      </div>

      {/* LIGHT RECESSED INDICATOR CHANNEL */}
      <div className="h-2 rounded-full overflow-hidden p-[1px] mt-2 bg-[#EDF5FD] border border-blue-100/50">
        <div
          className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
