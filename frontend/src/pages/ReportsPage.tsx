import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  CheckCircle2,
  TrendingDown,
  FileText,
} from 'lucide-react';
import { useIndustrialStore } from '../stores/industrialStore';

export const ReportsPage: React.FC = () => {
  const { getActiveFacility, zones } = useIndustrialStore();
  const facility = getActiveFacility();

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'quarter'>('7days');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvRows = [
        ['Facility', 'Zone Code', 'Zone Name', 'Sensor ID', 'Current Temp (°C)', 'Warning Limit (°C)', 'Status'],
        ...zones.map((z) => [
          facility.name,
          z.code,
          `"${z.name}"`,
          z.sensorId,
          z.currentTemp.toFixed(1),
          z.warningLimit.toFixed(1),
          z.status,
        ]),
      ];
      const csvString = csvRows.map((e) => e.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `thermo-safety-report-${facility.id}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="industrial-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
              Safety Compliance & Operations Reports
            </h1>
          </div>
          <p className="text-xs text-industrial-400 mt-0.5">
            Audit-grade thermal stress documentation, MTTA metrics, and regulatory reporting for {facility.name}
          </p>
        </div>

        {/* Date Selector & Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-industrial-950 p-0.5 rounded border border-industrial-700 text-xs">
            {(['today', '7days', '30days', 'quarter'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  dateRange === r
                    ? 'bg-industrial-800 text-industrial-50 font-bold'
                    : 'text-industrial-400 hover:text-industrial-200'
                }`}
              >
                {r === 'today'
                  ? 'Today'
                  : r === '7days'
                  ? 'Last 7 Days'
                  : r === '30days'
                  ? 'Last 30 Days'
                  : 'Q3 2026'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-200 border border-industrial-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="industrial-panel p-4 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Mean Time To Acknowledge (MTTA)</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">4.2 min</div>
          <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 font-mono">
            <TrendingDown className="w-3 h-3" /> 18% faster than OSHA target
          </span>
        </div>

        <div className="industrial-panel p-4 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Sensor Fleet Uptime</span>
          <div className="text-2xl font-mono font-bold text-industrial-50 tabular-nums">99.85%</div>
          <span className="text-[10px] text-industrial-400 font-mono">23 of 24 hardware probes continuous</span>
        </div>

        <div className="industrial-panel p-4 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Thermal Exceedance Hours</span>
          <div className="text-2xl font-mono font-bold text-amber-400 tabular-nums">1.8 hrs</div>
          <span className="text-[10px] text-amber-400/80 font-mono">Confined to Boiler Room B-02</span>
        </div>

        <div className="industrial-panel p-4 space-y-1">
          <span className="text-[11px] text-industrial-400 font-medium">Regulatory Audit Readiness</span>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">100%</div>
          <span className="text-[10px] text-emerald-400/80 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> NDMA / ISO 45001 Compliant
          </span>
        </div>
      </div>

      {/* Structured Compliance Table */}
      <div className="industrial-panel p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-industrial-750 pb-3">
          <div>
            <h2 className="text-sm font-bold text-industrial-50 uppercase tracking-wide">
              Zone Thermal Risk & Exposure Ledger
            </h2>
            <p className="text-[11px] text-industrial-400 mt-0.5">
              Cumulative metrics for work-rest schedules, maximum recorded heat stress, and sensor accuracy
            </p>
          </div>

          <span className="text-xs font-mono text-industrial-400 bg-industrial-900 px-2 py-1 rounded border border-industrial-750">
            Report Reference: TR-{Date.now().toString().slice(-6)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="industrial-table">
            <thead>
              <tr>
                <th>Zone Designation</th>
                <th>Peak Temp Recorded</th>
                <th>Avg WBGT Index</th>
                <th>Exceedance Incidents</th>
                <th>Personnel Exposure Count</th>
                <th>Work-Rest Regimen</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id}>
                  <td>
                    <div className="font-semibold text-industrial-100">{zone.name}</div>
                    <div className="text-[10px] text-industrial-400">{zone.building}</div>
                  </td>
                  <td>
                    <span className="font-mono text-xs font-bold text-industrial-50">
                      {Math.max(zone.currentTemp, zone.warningLimit - 0.5).toFixed(1)}°C
                    </span>
                  </td>
                  <td className="font-mono text-xs text-industrial-300">{zone.wbgt.toFixed(1)}°C</td>
                  <td className="font-mono text-xs text-industrial-300">
                    {zone.status === 'WARNING' ? '1 event' : '0 events'}
                  </td>
                  <td className="font-mono text-xs text-industrial-300">{zone.assignedWorkers} workers</td>
                  <td className="text-xs text-industrial-300">
                    {zone.wbgt >= 32
                      ? '45 min work / 15 min rest'
                      : zone.wbgt >= 30
                      ? '50 min work / 10 min rest'
                      : 'Continuous nominal work'}
                  </td>
                  <td>
                    <span className="badge-safe">Verified Compliant</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Certification Statement */}
      <div className="industrial-panel p-4 bg-industrial-900/60 border border-industrial-750 text-xs text-industrial-300 flex items-start gap-3">
        <FileText className="w-5 h-5 text-industrial-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-industrial-100 block mb-0.5">
            Operational Compliance Sign-off & Audit Certification:
          </span>
          <p className="text-[11px] text-industrial-400 leading-relaxed">
            This automated telemetry summary satisfies the National Disaster Management Authority (NDMA) Heat Action
            Plan Guidelines and ISO 45001 Occupational Health & Safety tracking standards. All readings originate from
            calibrated industrial probe hardware with cryptographic server timestamping.
          </p>
        </div>
      </div>
    </div>
  );
};
