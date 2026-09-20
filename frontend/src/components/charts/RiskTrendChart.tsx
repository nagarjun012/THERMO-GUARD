import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalData } from '../../types';

interface Props {
  data: HistoricalData;
}

export const RiskTrendChart: React.FC<Props> = ({ data }) => {
  const chartData = data.labels.map((lbl, i) => ({
    name: lbl,
    htss: data.htss[i]
  }));

  return (
    <div className="glass-card p-6 h-80">
      <h3 className="text-lg font-medium text-white mb-4">HTSS Trend (Last 24h)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHtss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#ef4444' }}
          />
          <Area type="monotone" dataKey="htss" stroke="#ef4444" fillOpacity={1} fill="url(#colorHtss)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
