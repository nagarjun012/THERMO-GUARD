import React from 'react';
import { ForecastPoint } from '../../types';
import { getRiskColor } from '../../utils/helpers';

interface Props {
  timeline: ForecastPoint[];
}

export const ForecastTimeline: React.FC<Props> = ({ timeline }) => {
  return (
    <div className="glass-card p-6 overflow-x-auto">
      <h3 className="text-lg font-medium text-white mb-6">24-Hour Forecast</h3>
      <div className="flex min-w-[600px] justify-between relative">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-dark-600 -translate-y-1/2 z-0" />
        {timeline.map((pt, i) => (
          <div key={i} className="flex flex-col items-center relative z-10 w-24">
            <span className="text-sm text-gray-400 mb-4">{pt.time}</span>
            <div 
              className="w-8 h-8 rounded-full border-4 border-dark-800 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: getRiskColor(pt.riskLevel) }}
            >
              <div className="w-2 h-2 bg-white rounded-full opacity-50" />
            </div>
            <div className="mt-4 flex flex-col items-center">
              <span className="text-lg font-bold">{pt.temperature}°</span>
              <span className="text-xs text-gray-500 mt-1">HTSS: {pt.htss}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
