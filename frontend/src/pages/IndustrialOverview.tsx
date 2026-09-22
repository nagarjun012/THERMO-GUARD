import React, { useState } from 'react';
import {
  Thermometer,
  Flame,
  AlertTriangle,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { useIndustrialStore } from '../stores/industrialStore';
import { useNavigate } from 'react-router-dom';

export const IndustrialOverview: React.FC = () => {
  const {
    getActiveFacility,
    zones,
    alerts,
    activities,
    trendPoints,
    trendRange,
    setTrendRange,
    openAlertModal,
    refreshTelemetry,
    lastSyncTime,
  } = useIndustrialStore();

  const navigate = useNavigate();
  const facility = getActiveFacility();

  const [selectedChartZone, setSelectedChartZone] = useState<'all' | 'boiler' | 'assembly' | 'cold'>('all');

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const criticalCount = alerts.filter((a) => a.status === 'ACTIVE' && a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter((a) => a.status === 'ACTIVE' && a.severity === 'WARNING').length;

  return (
    <div className="space-y-6">
      {/* 1. FACILITY SAFETY STATUS MODULE */}
      <section
        aria-label="Facility Safety Status"
        className="industrial-panel p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${
              facility.overallStatus === 'SAFE'
                ? 'bg-emerald-950/70 border-emerald-700/60 text-emerald-400'
                : facility.overallStatus === 'WARNING'
                ? 'bg-amber-950/70 border-amber-700/60 text-amber-400'
                : 'bg-red-950/70 border-red-700/60 text-red-400'
            }`}
          >
            {facility.overallStatus === 'SAFE' ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <Flame className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
                {facility.name}
              </h1>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
                  facility.overallStatus === 'SAFE'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950 text-amber-300 border-amber-700'
                }`}
              >
                STATUS: {facility.overallStatus}
              </span>
            </div>

            <p className="text-xs text-industrial-400 mt-1 flex flex-wrap items-center gap-2">
              <span>{facility.location}</span>
              <span>•</span>
              <span className="font-mono">Code: {facility.code}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-industrial-400" />
                <span>Last updated {lastSyncTime}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Right Status Actions & Health */}
        <div className="flex items-center gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-industrial-750">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase font-mono text-industrial-400">Connection Health</div>
            <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse" />
              <span>{facility.connectionUptime}% Uptime</span>
            </div>
          </div>

          <button
            onClick={refreshTelemetry}
            className="px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-industrial-400" />
            <span>Poll Sensors</span>
          </button>
        </div>
      </section>

      {/* 2. COMPACT KPI METRIC ROW */}
      <section aria-label="Key Performance Indicators" className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* KPI 1: Current Avg Temperature */}
        <div className="industrial-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-industrial-400 text-xs mb-1">
            <span className="font-medium">Avg Temperature</span>
            <Thermometer className="w-4 h-4 text-industrial-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-industrial-50 tabular-nums">
              {facility.avgTemperature.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-industrial-400">°C</span>
          </div>
          <div className="text-[10px] text-industrial-400 mt-1 font-mono">
            Across {facility.totalZones} monitored zones
          </div>
        </div>

        {/* KPI 2: Maximum Hotspot */}
        <div className="industrial-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-industrial-400 text-xs mb-1">
            <span className="font-medium">Maximum Hotspot</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
              {facility.maxHotspot.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-industrial-400">°C</span>
          </div>
          <div className="text-[10px] text-amber-300/80 mt-1 font-mono truncate">
            Boiler Room B-02 (TS-104)
          </div>
        </div>

        {/* KPI 3: Active Alerts */}
        <div className="industrial-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-industrial-400 text-xs mb-1">
            <span className="font-medium">Active Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-mono text-2xl font-bold tabular-nums ${
                criticalCount > 0
                  ? 'text-red-400'
                  : warningCount > 0
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {activeAlerts.length}
            </span>
            <span className="text-xs font-mono text-industrial-400">Active</span>
          </div>
          <div className="text-[10px] text-industrial-400 mt-1 font-mono">
            {criticalCount} Critical • {warningCount} Warning
          </div>
        </div>

        {/* KPI 4: Sensors Online */}
        <div className="industrial-panel p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-industrial-400 text-xs mb-1">
            <span className="font-medium">Sensors Online</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
              {facility.sensorsOnline}
            </span>
            <span className="text-xs font-mono text-industrial-400">/ {facility.totalSensors}</span>
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">
            96% Fleet Active (1 Calibrating)
          </div>
        </div>

        {/* KPI 5: Monitored Heat Zones */}
        <div className="industrial-panel p-3.5 flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-industrial-400 text-xs mb-1">
            <span className="font-medium">Monitored Zones</span>
            <Layers className="w-4 h-4 text-industrial-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-bold text-industrial-50 tabular-nums">
              {facility.totalZones}
            </span>
            <span className="text-xs font-mono text-industrial-400">Zones</span>
          </div>
          <div className="text-[10px] text-industrial-400 mt-1 font-mono">
            65 Workers in Zone Perimeter
          </div>
        </div>
      </section>

      {/* 3. TEMPERATURE TREND CHART & RECENT ACTIVITY DUAL PANEL */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Polished Industrial Temperature Trend Chart */}
        <div className="industrial-panel p-4 md:p-5 lg:col-span-2 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-industrial-100 uppercase tracking-wide">
                  Temperature Trend Telemetry
                </h2>
              </div>
              <p className="text-[11px] text-industrial-400 mt-0.5">
                Continuous biometeorological readings with advisory and critical boundary limits
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2">
              {/* Zone line selector */}
              <select
                aria-label="Filter chart by zone"
                value={selectedChartZone}
                onChange={(e) => setSelectedChartZone(e.target.value as any)}
                className="bg-industrial-900 border border-industrial-700 text-industrial-200 text-xs rounded px-2 py-1 focus:outline-none"
              >
                <option value="all">All Channels</option>
                <option value="boiler">Boiler Room B-02</option>
                <option value="assembly">Assembly Floor</option>
                <option value="cold">Cold Storage</option>
              </select>

              {/* Range toggle */}
              <div className="flex items-center bg-industrial-950 p-0.5 rounded border border-industrial-700 text-xs font-mono">
                {(['24h', '7d', '30d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTrendRange(r)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      trendRange === r
                        ? 'bg-industrial-800 text-industrial-50 font-bold'
                        : 'text-industrial-400 hover:text-industrial-200'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recharts Component */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3E" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="#4A627D"
                  fontSize={11}
                  tickLine={false}
                  tick={{ fill: '#7E93AA', fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  stroke="#4A627D"
                  fontSize={11}
                  domain={[0, 45]}
                  tickLine={false}
                  tick={{ fill: '#7E93AA', fontFamily: 'JetBrains Mono' }}
                  unit="°"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101820',
                    borderColor: '#2D4158',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#E1E9F1',
                    fontFamily: 'JetBrains Mono',
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                {/* Reference Limits */}
                <ReferenceLine
                  y={36}
                  stroke="#F59E0B"
                  strokeDasharray="4 4"
                  label={{ value: 'Warning Limit (36°C)', fill: '#F59E0B', fontSize: 10, position: 'insideTopRight' }}
                />
                <ReferenceLine
                  y={40}
                  stroke="#EF4444"
                  strokeDasharray="4 4"
                  label={{ value: 'Critical Limit (40°C)', fill: '#EF4444', fontSize: 10, position: 'insideTopRight' }}
                />

                {(selectedChartZone === 'all' || selectedChartZone === 'boiler') && (
                  <Line
                    type="monotone"
                    dataKey="boilerRoom"
                    name="Boiler Room B-02"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, stroke: '#F59E0B', strokeWidth: 2 }}
                  />
                )}
                {(selectedChartZone === 'all' || selectedChartZone === 'assembly') && (
                  <Line
                    type="monotone"
                    dataKey="assemblyFloor"
                    name="Assembly Floor"
                    stroke="#38BDF8"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {(selectedChartZone === 'all' || selectedChartZone === 'cold') && (
                  <Line
                    type="monotone"
                    dataKey="coldStorage"
                    name="Cold Storage"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-industrial-750 flex flex-wrap items-center justify-between gap-2 text-[11px] text-industrial-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block" /> Boiler Room B-02
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-sky-400 inline-block" /> Assembly Floor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" /> Cold Storage Unit
              </span>
            </div>
            <span className="font-mono text-[10px]">Sampling: 1-hour interval aggregated</span>
          </div>
        </div>

        {/* Right (1 col): Active Alerts & Recent Activity Timeline */}
        <div className="space-y-6">
          {/* Active Alerts Box */}
          <div className="industrial-panel p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-750 mb-3">
              <span className="text-xs font-bold text-industrial-100 uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Active Alerts ({activeAlerts.length})
              </span>
              <button
                onClick={() => navigate('/alerts')}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeAlerts.length === 0 ? (
                <div className="p-3 text-center text-xs text-industrial-400 flex flex-col items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>No active safety alerts.</span>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => openAlertModal(alert)}
                    className="p-2.5 rounded bg-industrial-900 border border-industrial-750 hover:border-industrial-600 cursor-pointer transition-colors text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border border-red-700'
                            : 'bg-amber-950 text-amber-300 border border-amber-700'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-industrial-400">
                        {alert.detectedAt}
                      </span>
                    </div>

                    <div className="font-semibold text-industrial-100 truncate">{alert.title}</div>
                    <div className="flex items-center justify-between text-[11px] text-industrial-400">
                      <span>{alert.zoneName}</span>
                      <span className="font-mono font-bold text-amber-400">
                        {alert.reading.toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Operational Audit Timeline */}
          <div className="industrial-panel p-4">
            <div className="flex items-center justify-between pb-2 border-b border-industrial-750 mb-3">
              <span className="text-xs font-bold text-industrial-100 uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-industrial-400" />
                Recent Operational Activity
              </span>
            </div>

            <div className="space-y-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="text-xs border-l-2 border-industrial-700 pl-2.5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-industrial-200">{act.action}</span>
                    <span className="text-[10px] font-mono text-industrial-500">{act.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-industrial-400">{act.details}</div>
                  <div className="text-[10px] font-mono text-industrial-500">{act.operator}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. HEAT ZONE STATUS TABLE */}
      <section className="industrial-panel p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-industrial-100 uppercase tracking-wide">
              Heat Zone Status Registry
            </h2>
            <p className="text-[11px] text-industrial-400 mt-0.5">
              Live biometeorological readings, threshold compliance, and sensor health by physical zone
            </p>
          </div>

          <button
            onClick={() => navigate('/zones')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open Zones Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto">
          <table className="industrial-table">
            <thead>
              <tr>
                <th>Zone Name & Building</th>
                <th>Sensor ID</th>
                <th>Current Temp</th>
                <th>Humidity</th>
                <th>WBGT Index</th>
                <th>Warning Limit</th>
                <th>Risk Status</th>
                <th>Sensor Battery</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id}>
                  <td>
                    <div className="font-semibold text-industrial-100">{zone.name}</div>
                    <div className="text-[10px] text-industrial-400">
                      {zone.building} • {zone.floor}
                    </div>
                  </td>

                  <td>
                    <span className="font-mono text-xs text-industrial-300 bg-industrial-900 px-1.5 py-0.5 rounded border border-industrial-750">
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

                  <td className="font-mono text-xs tabular-nums text-industrial-300">
                    {zone.humidity}%
                  </td>

                  <td className="font-mono text-xs tabular-nums text-industrial-300">
                    {zone.wbgt.toFixed(1)}°C
                  </td>

                  <td className="font-mono text-xs tabular-nums text-industrial-400">
                    {zone.warningLimit.toFixed(1)}°C
                  </td>

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

                  <td>
                    <span className="font-mono text-xs text-emerald-400">{zone.sensorBattery}%</span>
                  </td>

                  <td>
                    <button
                      onClick={() => navigate('/zones')}
                      className="px-2 py-1 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-200 text-xs font-medium border border-industrial-700 transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
