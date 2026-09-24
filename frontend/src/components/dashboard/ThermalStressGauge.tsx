import React from 'react';
import { motion } from 'framer-motion';
import { getRiskColor } from '../../utils/helpers';
import { Activity } from 'lucide-react';

interface Props {
  score: number;
  level: string;
}

export const ThermalStressGauge: React.FC<Props> = ({ score, level }) => {
  const color = getRiskColor(level);

  const radius = 115;
  const stroke = 18;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 flex flex-col items-center justify-center relative border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)] transition-all duration-500 overflow-hidden h-full group">
      {/* AMBIENT HEADER */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#EDF5FD] border border-blue-100/80 text-blue-600 shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold tracking-wider text-slate-700 uppercase">
            HTSS Heat Strain Dial
          </h2>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold text-slate-500 bg-[#EDF5FD] rounded-full border border-blue-100/60">
          Biometeorology
        </span>
      </div>

      {/* GAUGE BODY */}
      <div className="my-2 relative flex items-center justify-center">
        <div className="p-3 relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="gaugeGlowLight" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Inactive Track */}
            <circle
              stroke="#EBF3FC"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            {/* Active Graduated Arc */}
            <motion.circle
              stroke={color}
              filter="url(#gaugeGlowLight)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>

          {/* CENTER DIAL HUB */}
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span
              className="text-5xl font-black tracking-tight"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider mt-0.5 font-bold">
              Score / 100
            </span>
            <div
              className="mt-2.5 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full border shadow-xs"
              style={{
                color,
                borderColor: `${color}40`,
                backgroundColor: `${color}14`,
              }}
            >
              {level} Risk
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between mt-3 text-[11px] font-bold text-slate-400 px-4">
        <span>0 Safe</span>
        <span>50 Moderate</span>
        <span>100 Extreme</span>
      </div>
    </div>
  );
};
