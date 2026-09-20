import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Flame } from 'lucide-react';

interface Props {
  probability: number;
  trend: 'up' | 'down' | 'flat';
}

export const HeatwaveProbability: React.FC<Props> = ({ probability, trend }) => {
  const color = probability > 75 ? '#ef4444' : probability > 40 ? '#f97316' : '#10b981';

  return (
    <div className="neu-card p-6 flex flex-col items-center justify-center relative overflow-hidden h-full">
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      <div className="w-full flex items-center justify-between mb-4 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg neu-well text-orange-400">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
            Heatwave Forecast
          </h3>
        </div>
        <span className="skeuo-pill px-2 py-0.5 text-[10px] font-mono text-gray-400">
          72h Model
        </span>
      </div>

      <div className="metallic-bezel p-1.5 my-2">
        <div className="neu-well-deep p-3 relative flex items-center justify-center">
          <svg width="120" height="120" className="transform -rotate-90">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#0f1523" strokeWidth="12" />
            <motion.circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray="301.6"
              initial={{ strokeDashoffset: 301.6 }}
              animate={{ strokeDashoffset: 301.6 - (301.6 * probability) / 100 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {probability}%
            </span>
            <span className="text-[9px] font-mono text-gray-500 uppercase font-bold">Risk</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-mono">
        <span className="text-gray-400 font-medium">Trajectory:</span>
        {trend === 'up' && (
          <span className="skeuo-pill px-2.5 py-0.5 flex items-center gap-1 text-red-400 border border-red-500/30 font-bold">
            <TrendingUp className="w-3.5 h-3.5" /> Rising
          </span>
        )}
        {trend === 'down' && (
          <span className="skeuo-pill px-2.5 py-0.5 flex items-center gap-1 text-emerald-400 border border-emerald-500/30 font-bold">
            <TrendingDown className="w-3.5 h-3.5" /> Falling
          </span>
        )}
        {trend === 'flat' && (
          <span className="skeuo-pill px-2.5 py-0.5 flex items-center gap-1 text-gray-300 border border-white/10 font-bold">
            <Minus className="w-3.5 h-3.5" /> Stable
          </span>
        )}
      </div>
    </div>
  );
};
