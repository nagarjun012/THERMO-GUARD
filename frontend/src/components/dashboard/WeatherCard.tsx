import React from 'react';
import * as LucideIcons from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  icon: keyof typeof LucideIcons;
  color?: string;
}

export const WeatherCard: React.FC<Props> = ({ title, value, unit, icon, color = '#2563eb' }) => {
  const Icon = (LucideIcons[icon] as React.ElementType) || LucideIcons.Activity;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[26px] p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative group border border-white/90 shadow-[0_10px_30px_rgba(30,100,200,0.06)] hover:shadow-[0_14px_36px_rgba(30,100,200,0.12)] transition-all duration-300 hover:-translate-y-0.5">
      {/* AMBIENT CORNER GLOW */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-20"
        style={{ backgroundColor: color }}
      />

      {/* HEADER WITH LIGHT SKY INSET WELL */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        <div className="p-2 rounded-xl bg-[#EDF5FD] border border-blue-100/80 text-center flex items-center justify-center shadow-xs">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>

      {/* VALUE READOUT */}
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-slate-500 ml-0.5">
            {unit}
          </span>
        )}
      </div>

      {/* BOTTOM METRIC ACCENT LINE */}
      <div className="w-full bg-[#EDF5FD] h-1.5 rounded-full mt-4 overflow-hidden border border-blue-100/40">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: '100%', backgroundColor: color }}
        />
      </div>
    </div>
  );
};
