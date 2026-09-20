import React, { useEffect, useState } from 'react';
import { getRiskColorByCategory } from '../../data/wardGisData';

interface Props {
  score: number; // 0 to 100
  category: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  size?: number;
  strokeWidth?: number;
}

export const AnimatedRadialGauge: React.FC<Props> = ({
  score,
  category,
  size = 140,
  strokeWidth = 12,
}) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s smooth animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic animation formula
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(easedProgress * score));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  const color = getRiskColorByCategory(category);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Score Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.1s ease-out',
            filter: `drop-shadow(0 0 10px ${color}80)`,
          }}
        />
      </svg>

      {/* Inner Label Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black tracking-tight text-white font-mono">
          {displayScore}
        </span>
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          out of 100
        </span>
        <span
          className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full mt-1 border"
          style={{
            color,
            borderColor: `${color}60`,
            backgroundColor: `${color}15`,
            boxShadow: `0 0 12px ${color}30`,
          }}
        >
          {category}
        </span>
      </div>
    </div>
  );
};
