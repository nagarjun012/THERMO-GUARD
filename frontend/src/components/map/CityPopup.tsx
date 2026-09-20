import React from 'react';
import { CityData } from '../../types';
import { getRiskColor, formatTemperature } from '../../utils/helpers';

interface Props {
  city: CityData;
}

export const CityPopup: React.FC<Props> = ({ city }) => {
  const riskColor = getRiskColor(city.risk.level);

  return (
    <div className="p-3 min-w-[220px] text-gray-100 font-sans">
      <div className="border-b border-dark-600 pb-2 mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white tracking-wide">{city.name}</h3>
          {city.state && <p className="text-xs text-gray-400 font-medium">{city.state}</p>}
        </div>
        <span
          className="px-2 py-0.5 rounded text-[11px] font-extrabold uppercase"
          style={{ backgroundColor: `${riskColor}25`, color: riskColor, border: `1px solid ${riskColor}` }}
        >
          {city.risk.level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex flex-col bg-dark-800 p-2.5 rounded-lg border border-dark-600">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">HTSS Score</span>
          <span className="font-extrabold text-xl" style={{ color: riskColor }}>
            {city.thermal.htss}
          </span>
        </div>

        <div className="flex flex-col bg-dark-800 p-2.5 rounded-lg border border-dark-600">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Temperature</span>
          <span className="font-bold text-base text-orange-400">
            {formatTemperature(city.weather.temperature)}
          </span>
        </div>

        <div className="flex flex-col bg-dark-800 p-2.5 rounded-lg border border-dark-600">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Wind Speed</span>
          <span className="font-bold text-sm text-emerald-400">
            {city.weather.windSpeed} km/h
          </span>
        </div>

        <div className="flex flex-col bg-dark-800 p-2.5 rounded-lg border border-dark-600">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Solar Radiation</span>
          <span className="font-bold text-sm text-yellow-400">
            {city.weather.solarRadiation} W/m²
          </span>
        </div>
      </div>
    </div>
  );
};
