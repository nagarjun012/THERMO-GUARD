import React from 'react';
import { motion } from 'framer-motion';
import { getRiskColor, getRiskGlowClass } from '../../utils/helpers';
import { Activity } from 'lucide-react';

interface Props {
  score: number;
  level: string;
}

export const ThermalStressGauge: React.FC<Props> = ({ score, level }) => {
  const color = getRiskColor(level);
  const glow = getRiskGlowClass(level);

  const radius = 115;
  const stroke = 18;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`neu-card p-7 flex flex-col items-center justify-center relative ${glow} transition-all duration-500 overflow-hidden group`}>
      {/* AMBIENT REFLECTION HEADER */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg neu-well text-orange-400">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold tracking-wider text-gray-200 uppercase font-mono">
            HTSS Heat Dial
          </h2>
        </div>
        <span className="skeuo-pill px-2.5 py-0.5 text-[10px] font-mono font-bold text-gray-300">
          Stull &amp; Liljegren
        </span>
      </div>

      {/* METALLIC GAUGE CHASSIS & SUNKEN NEUMORPHIC WELL */}
      <div className="metallic-bezel my-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="neu-well-deep p-4 relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Inactive Track - Recessed dark line */}
            <circle
              stroke="#0f1523"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />

            {/* Active Graduated Arc */}
            <motion.circle
              stroke={color}
              filter="url(#gaugeGlow)"
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

          {/* SKEUOMORPHIC CENTER DIAL HUB */}
          <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
            <span
              className="text-5xl font-black font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-[10px] font-mono text-gray-500 uppercase -mt-1 font-bold">
              Score / 100
            </span>
            <div
              className="skeuo-pill mt-2 px-3 py-0.5 text-xs font-black uppercase tracking-widest border shadow-lg"
              style={{
                color,
                borderColor: `${color}60`,
                backgroundColor: `${color}18`,
                textShadow: `0 0 12px ${color}80`,
              }}
            >
              {level}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-400 max-w-xs text-center leading-relaxed">
        Deterministic composite thermodynamics computed from live Air Temp, Humidity, Outdoor WBGT, and UTCI.
      </p>
    </div>
  );
};
