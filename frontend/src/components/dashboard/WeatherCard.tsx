import React from 'react';
import * as LucideIcons from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  icon: keyof typeof LucideIcons;
  color?: string;
}

export const WeatherCard: React.FC<Props> = ({ title, value, unit, icon, color = '#3b82f6' }) => {
  const Icon = (LucideIcons[icon] as React.ElementType) || LucideIcons.Activity;

  return (
    <div className="neu-card neu-card-hover card-3d-subtle p-5 flex flex-col justify-between overflow-hidden relative group">
      {/* AMBIENT CORNER GLOW */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: color }}
      />

      {/* HEADER WITH SUNKEN ICON WELL */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
          {title}
        </h3>
        <div className="neu-well p-2 rounded-lg text-center flex items-center justify-center">
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>

      {/* VALUE READOUT */}
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-gray-400 font-mono ml-0.5">
            {unit}
          </span>
        )}
      </div>

      {/* BOTTOM METRIC ACCENT LINE */}
      <div className="w-full bg-white/5 h-1 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: '100%', backgroundColor: `${color}60` }}
        />
      </div>
    </div>
  );
};
