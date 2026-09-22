import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { useIndustrialStore } from '../stores/industrialStore';

export const AlertsWorkspacePage: React.FC = () => {
  const { alerts, openAlertModal, getActiveFacility } = useIndustrialStore();
  const facility = getActiveFacility();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'ALL'>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((alert) => {
    if (activeTab !== 'ALL' && alert.status !== activeTab) return false;
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.zoneName.toLowerCase().includes(q) ||
        alert.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const tabCounts = {
    ALL: alerts.length,
    ACTIVE: alerts.filter((a) => a.status === 'ACTIVE').length,
    ACKNOWLEDGED: alerts.filter((a) => a.status === 'ACKNOWLEDGED').length,
    RESOLVED: alerts.filter((a) => a.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="industrial-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
              Safety Alerts & Incident Triage Workspace
            </h1>
          </div>
          <p className="text-xs text-industrial-400 mt-0.5">
            Operational event queue, operator acknowledgement logs, and emergency escalation routing in {facility.name}
          </p>
        </div>

        {/* Tab status switcher */}
        <div className="flex items-center bg-industrial-950 p-0.5 rounded border border-industrial-700 text-xs">
          {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === tab
                  ? 'bg-industrial-800 text-industrial-50 font-bold'
                  : 'text-industrial-400 hover:text-industrial-200'
              }`}
            >
              <span>{tab}</span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-industrial-900 border border-industrial-750">
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="industrial-panel p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-industrial-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, zone, ID..."
              className="w-full bg-industrial-950 border border-industrial-700 rounded pl-8 pr-3 py-1.5 text-xs text-industrial-100 placeholder-industrial-500 focus:outline-none focus:border-industrial-600"
            />
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-industrial-400 text-[11px]">Severity:</span>
            <select
              aria-label="Filter by Severity"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-industrial-900 border border-industrial-700 text-industrial-200 rounded px-2 py-1 text-xs focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="ADVISORY">Advisory</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] font-mono text-industrial-400">
          Showing <span className="text-industrial-100 font-bold">{filteredAlerts.length}</span> recorded events
        </div>
      </div>

      {/* Alerts Table */}
      <div className="industrial-panel p-4 overflow-x-auto">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center text-xs text-industrial-400 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <span className="text-sm font-semibold text-industrial-200">
              No matching alerts found in this view.
            </span>
            <span>All monitored thresholds within acceptable limits.</span>
          </div>
        ) : (
          <table className="industrial-table">
            <thead>
              <tr>
                <th>Alert ID & Severity</th>
                <th>Incident Title</th>
                <th>Affected Zone</th>
                <th>Reading</th>
                <th>Threshold</th>
                <th>Detected</th>
                <th>Status</th>
                <th>Assigned Owner</th>
                <th>Triage Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-950 text-red-300 border border-red-700'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-sky-950 text-sky-300 border border-sky-700'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="font-mono text-[10px] text-industrial-400">{alert.id}</span>
                    </div>
                  </td>

                  <td>
                    <div className="font-semibold text-industrial-100 max-w-xs">{alert.title}</div>
                    <div className="text-[10px] text-industrial-400 truncate max-w-xs">
                      {alert.recommendedAction}
                    </div>
                  </td>

                  <td className="text-xs text-industrial-200 font-medium">{alert.zoneName}</td>

                  <td>
                    <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                      {alert.reading.toFixed(1)}°C
                    </span>
                  </td>

                  <td>
                    <span className="font-mono text-xs text-industrial-400 tabular-nums">
                      {alert.threshold.toFixed(1)}°C
                    </span>
                  </td>

                  <td className="text-xs text-industrial-400 font-mono">{alert.detectedAt}</td>

                  <td>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        alert.status === 'ACTIVE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : alert.status === 'ACKNOWLEDGED'
                          ? 'bg-sky-950 text-sky-300 border border-sky-700'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>

                  <td className="text-xs text-industrial-300">
                    {alert.owner || <span className="text-industrial-500 italic">Unassigned</span>}
                  </td>

                  <td>
                    <button
                      onClick={() => openAlertModal(alert)}
                      className="px-2.5 py-1 rounded bg-industrial-800 hover:bg-industrial-750 text-industrial-100 text-xs font-medium border border-industrial-700 transition-colors flex items-center gap-1"
                    >
                      <span>Triage</span>
                      <ArrowUpRight className="w-3 h-3 text-industrial-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
