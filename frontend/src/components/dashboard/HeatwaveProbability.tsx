import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface Props {
  probability: number;
  trend: 'up' | 'down' | 'flat';
}

export const HeatwaveProbability: React.FC<Props> = ({ probability }) => {
  const color = probability > 75 ? '#ef4444' : probability > 40 ? '#f97316' : '#10b981';

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 flex flex-col items-center justify-center relative overflow-hidden h-full border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]">
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-50 border border-orange-200/60 text-orange-600 shadow-xs">
            <Flame className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Heatwave Forecast
          </h3>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-[#EDF5FD] rounded-full border border-blue-100/60">
          72h Model
        </span>
      </div>

      <div className="my-2 relative flex items-center justify-center">
        <svg width="130" height="130" className="transform -rotate-90">
          <circle cx="65" cy="65" r="50" fill="none" stroke="#EDF5FD" strokeWidth="12" />
          <motion.circle
            cx="65"
            cy="65"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray="314.16"
            initial={{ strokeDashoffset: 314.16 }}
            animate={{ strokeDashoffset: 314.16 - (314.16 * probability) / 100 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {probability}%
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-bold">Probability</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center mt-3 font-medium">
        {probability > 60
          ? 'Elevated heatwave occurrence likelihood over the upcoming 72-hour forecast horizon.'
          : 'Low atmospheric probability of severe synoptic heatwave formation.'}
      </p>
    </div>
  );
};
