import React, { useState } from 'react';
import {
  Cpu,
  Battery,
  Wifi,
  RotateCw,
  Search,
} from 'lucide-react';
import { useIndustrialStore } from '../stores/industrialStore';

export const DevicesPage: React.FC = () => {
  const { sensors, getActiveFacility, refreshTelemetry, lastSyncTime } = useIndustrialStore();
  const facility = getActiveFacility();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredSensors = sensors.filter((sensor) => {
    if (filterStatus !== 'ALL' && sensor.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sensor.id.toLowerCase().includes(q) ||
        sensor.model.toLowerCase().includes(q) ||
        sensor.zoneName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="industrial-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
              IoT Sensor Fleet & Hardware Diagnostics
            </h1>
          </div>
          <p className="text-xs text-industrial-400 mt-0.5">
            Calibrated biometeorological telemetry probes, RF signal health, and battery levels in {facility.name}
          </p>
        </div>

        <button
          onClick={refreshTelemetry}
          className="px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 text-xs font-medium flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <RotateCw className="w-3.5 h-3.5 text-industrial-400" />
          <span>Ping Fleet Hardware</span>
        </button>
      </div>

      {/* Sensor Overview KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="industrial-panel p-3.5 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Total Sensors Deployed</span>
          <div className="text-2xl font-mono font-bold text-industrial-50 tabular-nums">
            {sensors.length} units
          </div>
          <span className="text-[10px] text-industrial-400 font-mono">Modbus TCP / Wireless RF</span>
        </div>

        <div className="industrial-panel p-3.5 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Online & Transmitting</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            {sensors.filter((s) => s.status === 'ONLINE').length} units
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">0 communication dropouts</span>
        </div>

        <div className="industrial-panel p-3.5 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Under Calibration</span>
          <div className="text-2xl font-mono font-bold text-sky-400 tabular-nums">
            {sensors.filter((s) => s.status === 'CALIBRATING').length} unit
          </div>
          <span className="text-[10px] text-sky-400/80 font-mono">Routine 6-month cycle</span>
        </div>

        <div className="industrial-panel p-3.5 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Avg Signal Strength</span>
          <div className="text-2xl font-mono font-bold text-industrial-100 tabular-nums font-mono">
            -60 dBm
          </div>
          <span className="text-[10px] text-industrial-400 font-mono">Excellent RF link margin</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="industrial-panel p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-industrial-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sensor ID, model..."
              className="w-full bg-industrial-950 border border-industrial-700 rounded pl-8 pr-3 py-1.5 text-xs text-industrial-100 placeholder-industrial-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-industrial-400 text-[11px]">Hardware Status:</span>
            <select
              aria-label="Filter by Hardware Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-industrial-900 border border-industrial-700 text-industrial-200 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Units ({sensors.length})</option>
              <option value="ONLINE">Online</option>
              <option value="CALIBRATING">Calibrating</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-industrial-400">
          Last fleet ping: <span className="text-industrial-200 font-semibold">{lastSyncTime}</span>
        </div>
      </div>

      {/* Hardware Table */}
      <div className="industrial-panel p-4 overflow-x-auto">
        <table className="industrial-table">
          <thead>
            <tr>
              <th>Sensor ID</th>
              <th>Hardware Model</th>
              <th>Assigned Heat Zone</th>
              <th>Firmware</th>
              <th>Battery Level</th>
              <th>RF Signal (RSSI)</th>
              <th>Status</th>
              <th>Last Calibration</th>
              <th>Next Due</th>
            </tr>
          </thead>
          <tbody>
            {filteredSensors.map((sensor) => (
              <tr key={sensor.id}>
                <td>
                  <span className="font-mono text-xs font-bold text-amber-300 bg-industrial-900 px-2 py-0.5 rounded border border-industrial-750">
                    {sensor.id}
                  </span>
                </td>

                <td>
                  <div className="font-semibold text-industrial-100">{sensor.model}</div>
                </td>

                <td className="text-xs text-industrial-200 font-medium">
                  {sensor.zoneName}
                </td>

                <td className="font-mono text-xs text-industrial-400">
                  {sensor.firmware}
                </td>

                <td>
                  <div className="flex items-center gap-1.5">
                    <Battery
                      className={`w-3.5 h-3.5 ${
                        sensor.batteryPercent > 50
                          ? 'text-emerald-400'
                          : sensor.batteryPercent > 20
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    />
                    <span className="font-mono text-xs text-industrial-200">
                      {sensor.batteryPercent}%
                    </span>
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-industrial-300">
                    <Wifi className="w-3.5 h-3.5 text-industrial-400" />
                    <span>{sensor.rssi} dBm</span>
                  </div>
                </td>

                <td>
                  <span
                    className={
                      sensor.status === 'ONLINE'
                        ? 'badge-safe'
                        : sensor.status === 'CALIBRATING'
                        ? 'badge-advisory'
                        : 'badge-critical'
                    }
                  >
                    {sensor.status}
                  </span>
                </td>

                <td className="font-mono text-xs text-industrial-400">
                  {sensor.calibrationDate}
                </td>

                <td className="font-mono text-xs text-industrial-400">
                  {sensor.nextCalibration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
