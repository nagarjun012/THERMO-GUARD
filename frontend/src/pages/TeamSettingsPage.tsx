import React, { useState } from 'react';
import {
  Users,
  Settings,
  Bell,
  CheckCircle2,
  Save,
  Server,
} from 'lucide-react';
import { useIndustrialStore } from '../stores/industrialStore';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  accessLevel: 'ADMIN' | 'OPERATOR' | 'SAFETY_OFFICER' | 'AUDITOR';
  contact: string;
  email: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'STANDBY';
}

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'USR-01',
    name: 'Dr. R. K. Sharma',
    role: 'Plant Safety Director',
    department: 'Health, Safety & Environment (HSE)',
    accessLevel: 'ADMIN',
    contact: '+91 94440 12345',
    email: 'rk.sharma@thermosafe.ind',
    status: 'ON_DUTY',
  },
  {
    id: 'USR-02',
    name: 'K. Raman',
    role: 'Control Room Shift Lead',
    department: 'Thermal Operations Division',
    accessLevel: 'SAFETY_OFFICER',
    contact: '+91 98840 54321',
    email: 'k.raman@thermosafe.ind',
    status: 'ON_DUTY',
  },
  {
    id: 'USR-03',
    name: 'S. Mehra',
    role: 'Electrical & Instrumentation Lead',
    department: 'Plant Substation Engineering',
    accessLevel: 'OPERATOR',
    contact: '+91 97720 98765',
    email: 's.mehra@thermosafe.ind',
    status: 'ACTIVE',
  },
  {
    id: 'USR-04',
    name: 'K. Meenakshi',
    role: 'SDMA Liaison & Incident Commander',
    department: 'State Disaster Management Authority',
    accessLevel: 'AUDITOR',
    contact: '+91 94420 11223',
    email: 'k.meenakshi@tn.gov.in',
    status: 'STANDBY',
  },
];

export const TeamSettingsPage: React.FC<{ initialTab?: 'team' | 'settings' }> = ({
  initialTab = 'team',
}) => {
  const { getActiveFacility } = useIndustrialStore();
  const facility = getActiveFacility();

  const [activeTab, setActiveTab] = useState<'team' | 'settings'>(initialTab);
  const [teamMembers] = useState<TeamMember[]>(INITIAL_TEAM);
  const [saveSaved, setSaveSaved] = useState(false);

  // Settings State
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [sirenRelay, setSirenRelay] = useState(true);
  const [pollingFrequency, setPollingFrequency] = useState('15s');
  const [retentionDays, setRetentionDays] = useState('90');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSaved(true);
    setTimeout(() => setSaveSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="industrial-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {activeTab === 'team' ? (
              <Users className="w-5 h-5 text-amber-400" />
            ) : (
              <Settings className="w-5 h-5 text-amber-400" />
            )}
            <h1 className="text-lg md:text-xl font-bold text-industrial-50 tracking-tight">
              {activeTab === 'team'
                ? 'Authorized Safety Personnel & Escalation Tree'
                : 'Facility Alert & Protocol Settings'}
            </h1>
          </div>
          <p className="text-xs text-industrial-400 mt-0.5">
            Role-based permissions, automated dispatch relays, and operational parameters for {facility.name}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-industrial-950 p-0.5 rounded border border-industrial-700 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeTab === 'team'
                ? 'bg-industrial-800 text-industrial-50 font-bold'
                : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team & Access</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
              activeTab === 'settings'
                ? 'bg-industrial-800 text-industrial-50 font-bold'
                : 'text-industrial-400 hover:text-industrial-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Facility Settings</span>
          </button>
        </div>
      </div>

      {activeTab === 'team' ? (
        /* Team Members Table */
        <div className="industrial-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-industrial-750 pb-3">
            <div>
              <h2 className="text-sm font-bold text-industrial-50 uppercase tracking-wide">
                Duty Roster & Security Credentials
              </h2>
              <p className="text-[11px] text-industrial-400 mt-0.5">
                Personnel authorized to acknowledge heat exceedances, adjust thresholds, and dispatch emergency response
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              4 Certified Officers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="industrial-table">
              <thead>
                <tr>
                  <th>Officer Name & ID</th>
                  <th>Operational Role</th>
                  <th>Department</th>
                  <th>Access Clearance</th>
                  <th>Emergency Contact</th>
                  <th>Duty Status</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="font-semibold text-industrial-100">{member.name}</div>
                      <div className="text-[10px] font-mono text-industrial-400">{member.id}</div>
                    </td>

                    <td className="text-xs text-industrial-200 font-medium">
                      {member.role}
                    </td>

                    <td className="text-xs text-industrial-300">
                      {member.department}
                    </td>

                    <td>
                      <span className="font-mono text-xs font-bold text-amber-300 bg-industrial-900 px-2 py-0.5 rounded border border-industrial-750">
                        {member.accessLevel}
                      </span>
                    </td>

                    <td className="text-xs text-industrial-300 font-mono">
                      <div>{member.contact}</div>
                      <div className="text-[10px] text-industrial-400">{member.email}</div>
                    </td>

                    <td>
                      <span
                        className={
                          member.status === 'ON_DUTY'
                            ? 'badge-safe'
                            : member.status === 'ACTIVE'
                            ? 'badge-advisory'
                            : 'badge-neutral'
                        }
                      >
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Facility Settings Form */
        <div className="industrial-panel p-5 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
            {/* Notification routing */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-industrial-100 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Emergency Notification Routing
              </h3>

              <div className="space-y-2.5 text-xs text-industrial-200">
                <label className="flex items-center gap-3 p-3 rounded bg-industrial-900 border border-industrial-750 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-industrial-50 block">
                      Immediate SMS & Cellular Broadcast on Critical Exceedance (≥40.0°C)
                    </span>
                    <span className="text-[11px] text-industrial-400">
                      Dispatches priority alerts directly to Safety Shift Leads and local emergency dispatch.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded bg-industrial-900 border border-industrial-750 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sirenRelay}
                    onChange={(e) => setSirenRelay(e.target.checked)}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <div>
                    <span className="font-semibold text-industrial-50 block">
                      Automatic Plant Control Room Siren & Strobe Relay
                    </span>
                    <span className="text-[11px] text-industrial-400">
                      Activates physical optical strobes in Boiler Room and Production Floor upon sustained warning.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Hardware Polling & Retention */}
            <div className="space-y-3 pt-2 border-t border-industrial-750">
              <h3 className="text-xs font-bold text-industrial-100 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                Telemetry Gateway Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-industrial-400 mb-1">
                    Sensor Array Polling Frequency:
                  </label>
                  <select
                    value={pollingFrequency}
                    onChange={(e) => setPollingFrequency(e.target.value)}
                    className="w-full bg-industrial-950 border border-industrial-700 text-industrial-100 rounded p-2 focus:outline-none"
                  >
                    <option value="5s">Every 5 seconds (High precision)</option>
                    <option value="15s">Every 15 seconds (Standard)</option>
                    <option value="60s">Every 1 minute (Low bandwidth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-industrial-400 mb-1">
                    Telemetry Audit Log Retention:
                  </label>
                  <select
                    value={retentionDays}
                    onChange={(e) => setRetentionDays(e.target.value)}
                    className="w-full bg-industrial-950 border border-industrial-700 text-industrial-100 rounded p-2 focus:outline-none"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days (NDMA Standard)</option>
                    <option value="365">365 Days (Full Year Compliance)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded bg-amber-600 hover:bg-amber-500 text-industrial-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Facility Configuration</span>
              </button>

              {saveSaved && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Configuration Applied to Facility Gateway
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
