import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoricalData } from '../../types';

interface Props {
  data: HistoricalData;
}

export const TemperatureTrendChart: React.FC<Props> = ({ data }) => {
  const chartData = data.labels.map((lbl, i) => ({
    name: lbl,
    temp: data.temperature[i]
  }));

  return (
    <div className="glass-card p-6 h-80">
      <h3 className="text-lg font-medium text-white mb-4">Temperature Trend (°C)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis domain={['auto', 'auto']} stroke="#9ca3af" tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#f97316' }}
          />
          <Line type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
