import React, { useState } from 'react';
import {
  Activity,
  Battery,
  Wifi,
  Filter,
  RefreshCw,
  Table as TableIcon,
  Grid as GridIcon,
} from 'lucide-react';
import { useIndustrialStore } from '../stores/industrialStore';

export const LiveMonitoringPage: React.FC = () => {
  const { zones, getActiveFacility, refreshTelemetry, lastSyncTime } = useIndustrialStore();
  const facility = getActiveFacility();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterBuilding, setFilterBuilding] = useState<string>('ALL');

  const buildings = Array.from(new Set(zones.map((z) => z.building)));

  const filteredZones = zones.filter((z) => {
    if (filterRisk !== 'ALL' && z.status !== filterRisk) return false;
    if (filterBuilding !== 'ALL' && z.building !== filterBuilding) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="industrial-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
              Live Facility Monitoring Console
            </h1>
          </div>
          <p className="text-xs text-industrial-400 mt-0.5">
            Real-time multi-sensor telemetry across all physical zones in {facility.name}
          </p>
        </div>

        {/* View Toggle & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-industrial-950 p-0.5 rounded border border-industrial-700 text-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-industrial-800 text-industrial-50 font-semibold'
                  : 'text-industrial-400 hover:text-industrial-200'
              }`}
            >
              <GridIcon className="w-3.5 h-3.5" />
              <span>Zone Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-industrial-800 text-industrial-50 font-semibold'
                  : 'text-industrial-400 hover:text-industrial-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Telemetry Table</span>
            </button>
          </div>

          <button
            onClick={refreshTelemetry}
            className="px-2.5 py-1 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-industrial-400" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="industrial-panel p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-industrial-400 font-semibold uppercase text-[10px] tracking-wider">
            <Filter className="w-3.5 h-3.5" /> Filter By:
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-industrial-400 text-[11px]">Risk:</span>
            <select
              aria-label="Filter by Risk Status"
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-industrial-900 border border-industrial-700 text-industrial-200 rounded px-2 py-0.5 text-xs focus:outline-none"
            >
              <option value="ALL">All Statuses ({zones.length})</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="ATTENTION">Attention</option>
              <option value="SAFE">Safe</option>
            </select>
          </div>

          {/* Building Filter */}
          <div className="flex items-center gap-1">
            <span className="text-industrial-400 text-[11px]">Building:</span>
            <select
              aria-label="Filter by Building"
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="bg-industrial-900 border border-industrial-700 text-industrial-200 rounded px-2 py-0.5 text-xs focus:outline-none"
            >
              <option value="ALL">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-industrial-400">
          Showing <span className="text-industrial-100 font-bold">{filteredZones.length}</span> of{' '}
          {zones.length} active zones • Polled {lastSyncTime}
        </div>
      </div>

      {/* Content Area: Grid View or Table View */}
      {viewMode === 'grid' ? (
        /* Visual Zone Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredZones.map((zone) => {
            const isWarning = zone.status === 'WARNING';
            const isCritical = zone.status === 'CRITICAL';

            return (
              <div
                key={zone.id}
                className={`industrial-panel p-4 flex flex-col justify-between transition-colors border ${
                  isCritical
                    ? 'border-red-600/80 bg-red-950/20'
                    : isWarning
                    ? 'border-amber-600/70 bg-amber-950/20'
                    : 'border-industrial-700 hover:border-industrial-600'
                }`}
              >
                <div>
                  {/* Top Bar: Code, Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-industrial-400 font-bold">
                      {zone.code} • {zone.sensorId}
                    </span>
                    <span
                      className={
                        zone.status === 'SAFE'
                          ? 'badge-safe'
                          : zone.status === 'WARNING'
                          ? 'badge-warning'
                          : zone.status === 'CRITICAL'
                          ? 'badge-critical'
                          : 'badge-advisory'
                      }
                    >
                      {zone.status}
                    </span>
                  </div>

                  {/* Zone Name & Location */}
                  <h3 className="font-bold text-industrial-50 text-sm tracking-tight">{zone.name}</h3>
                  <div className="text-[11px] text-industrial-400 mt-0.5">
                    {zone.building} • {zone.floor}
                  </div>

                  {/* Primary Temperature Readout */}
                  <div className="mt-4 p-3 rounded bg-industrial-900 border border-industrial-750 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-mono text-industrial-400">
                        Current Thermal State
                      </div>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span
                          className={`font-mono text-3xl font-bold tabular-nums ${
                            isCritical
                              ? 'text-red-400'
                              : isWarning
                              ? 'text-amber-400'
                              : 'text-industrial-50'
                          }`}
                        >
                          {zone.currentTemp.toFixed(1)}
                        </span>
                        <span className="text-sm font-mono text-industrial-400">°C</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono space-y-0.5">
                      <div className="text-industrial-300">WBGT: {zone.wbgt.toFixed(1)}°C</div>
                      <div className="text-industrial-400">RH: {zone.humidity}%</div>
                      <div className="text-amber-400/90 text-[10px]">Limit: {zone.warningLimit.toFixed(1)}°C</div>
                    </div>
                  </div>

                  {/* Notes / Context */}
                  <p className="text-[11px] text-industrial-400 mt-3 line-clamp-2 leading-relaxed">
                    {zone.notes}
                  </p>
                </div>

                {/* Footer Hardware & Telemetry Bar */}
                <div className="mt-4 pt-3 border-t border-industrial-750 flex items-center justify-between text-[11px] font-mono text-industrial-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1" title={`Battery: ${zone.sensorBattery}%`}>
                      <Battery className="w-3.5 h-3.5 text-industrial-400" />
                      <span>{zone.sensorBattery}%</span>
                    </span>

                    <span className="flex items-center gap-1" title={`Signal RSSI: ${zone.sensorRssi} dBm`}>
                      <Wifi className="w-3.5 h-3.5 text-industrial-400" />
                      <span>{zone.sensorRssi} dBm</span>
                    </span>
                  </div>

                  <span className="text-industrial-500">{zone.lastReadingTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Telemetry Table */
        <div className="industrial-panel p-4 overflow-x-auto">
          <table className="industrial-table">
            <thead>
              <tr>
                <th>Zone / Code</th>
                <th>Building & Floor</th>
                <th>Sensor ID</th>
                <th>Current Temp</th>
                <th>WBGT Index</th>
                <th>Humidity</th>
                <th>Warning Limit</th>
                <th>Critical Limit</th>
                <th>Risk Status</th>
                <th>Battery</th>
                <th>Signal (RSSI)</th>
                <th>Last Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredZones.map((zone) => (
                <tr key={zone.id}>
                  <td>
                    <div className="font-semibold text-industrial-100">{zone.name}</div>
                    <div className="text-[10px] font-mono text-industrial-400">{zone.code}</div>
                  </td>
                  <td className="text-xs text-industrial-300">
                    {zone.building} • {zone.floor}
                  </td>
                  <td>
                    <span className="font-mono text-xs text-industrial-200 bg-industrial-900 px-1.5 py-0.5 rounded border border-industrial-750">
                      {zone.sensorId}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`font-mono text-sm font-bold tabular-nums ${
                        zone.currentTemp >= zone.criticalLimit
                          ? 'text-red-400'
                          : zone.currentTemp >= zone.warningLimit
                          ? 'text-amber-400'
                          : 'text-industrial-50'
                      }`}
                    >
                      {zone.currentTemp.toFixed(1)}°C
                    </span>
                  </td>
                  <td className="font-mono text-xs tabular-nums text-industrial-300">{zone.wbgt.toFixed(1)}°C</td>
                  <td className="font-mono text-xs tabular-nums text-industrial-300">{zone.humidity}%</td>
                  <td className="font-mono text-xs tabular-nums text-amber-400">{zone.warningLimit.toFixed(1)}°C</td>
                  <td className="font-mono text-xs tabular-nums text-red-400">{zone.criticalLimit.toFixed(1)}°C</td>
                  <td>
                    <span
                      className={
                        zone.status === 'SAFE'
                          ? 'badge-safe'
                          : zone.status === 'WARNING'
                          ? 'badge-warning'
                          : zone.status === 'CRITICAL'
                          ? 'badge-critical'
                          : 'badge-advisory'
                      }
                    >
                      {zone.status}
                    </span>
                  </td>
                  <td className="font-mono text-xs text-emerald-400">{zone.sensorBattery}%</td>
                  <td className="font-mono text-xs text-industrial-300">{zone.sensorRssi} dBm</td>
                  <td className="font-mono text-xs text-industrial-400">{zone.lastReadingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
