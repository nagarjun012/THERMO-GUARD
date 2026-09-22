import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Layers,
  Bell,
  FileBarChart,
  Cpu,
  Users,
  Settings,
  MapPin,
  Building2,
  BookOpen,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useIndustrialStore } from '../../stores/industrialStore';

export const Sidebar: React.FC = () => {
  const { isSidebarCollapsed, toggleSidebar, alerts, getActiveFacility } = useIndustrialStore();
  const activeFacility = getActiveFacility();

  const activeAlertsCount = alerts.filter(
    (a) => a.status === 'ACTIVE' && (a.severity === 'CRITICAL' || a.severity === 'WARNING')
  ).length;

  const primaryNavItems = [
    { name: 'Overview', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Live Monitoring', to: '/monitoring', icon: Activity },
    { name: 'Heat Zones', to: '/zones', icon: Layers },
    {
      name: 'Alerts',
      to: '/alerts',
      icon: Bell,
      badge: activeAlertsCount > 0 ? activeAlertsCount : null,
      badgeColor: activeAlertsCount > 0 ? 'bg-amber-900/80 text-amber-200 border-amber-600/50' : '',
    },
    { name: 'Reports', to: '/reports', icon: FileBarChart },
    { name: 'Devices', to: '/devices', icon: Cpu },
    { name: 'Team & Permissions', to: '/team', icon: Users },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const secondaryNavItems = [
    { name: 'Regional Heat Map', to: '/map', icon: MapPin },
    { name: 'National Command', to: '/government', icon: Building2 },
    { name: 'Scientific Model', to: '/learn', icon: BookOpen },
    { name: 'Safety Protocols', to: '/safety', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`bg-industrial-900 border-r border-industrial-700 flex flex-col justify-between transition-all duration-200 z-30 select-none ${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top: Logo & Facility Header */}
      <div>
        <div className="h-14 border-b border-industrial-700 flex items-center px-3.5 justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-industrial-950 font-black shrink-0 shadow-sm">
              <Flame className="w-4 h-4 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-industrial-50 leading-tight">
                  THERMO<span className="text-amber-400">SAFE</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-industrial-400 leading-none">
                  Industrial OS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="p-1 rounded text-industrial-400 hover:text-industrial-100 hover:bg-industrial-800 transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Current Facility Badge in Sidebar */}
        {!isSidebarCollapsed && (
          <div className="px-3 py-2 border-b border-industrial-700/60 bg-industrial-950/40">
            <div className="text-[10px] uppercase tracking-wider text-industrial-400 font-semibold mb-0.5">
              Current Facility
            </div>
            <div className="text-xs font-medium text-industrial-200 truncate" title={activeFacility.name}>
              {activeFacility.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-status-pulse" />
              <span className="text-[10px] font-mono text-emerald-400">
                {activeFacility.sensorsOnline}/{activeFacility.totalSensors} Sensors Online
              </span>
            </div>
          </div>
        )}

        {/* Primary Navigation */}
        <div className="py-2 px-2 space-y-0.5">
          {!isSidebarCollapsed && (
            <div className="px-2 pt-1 pb-1 text-[10px] uppercase font-semibold text-industrial-400 tracking-wider">
              Plant Operations
            </div>
          )}
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors group relative ${
                    isActive
                      ? 'bg-industrial-800 text-industrial-50 border border-industrial-600/60 shadow-sm'
                      : 'text-industrial-300 hover:bg-industrial-850 hover:text-industrial-100 border border-transparent'
                  }`
                }
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <Icon className="w-4 h-4 shrink-0 text-industrial-400 group-hover:text-industrial-200 transition-colors" />
                {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`ml-auto font-mono text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
                      item.badgeColor || 'bg-industrial-800 text-industrial-300 border-industrial-600'
                    } ${isSidebarCollapsed ? 'absolute -top-1 -right-1' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Secondary External Navigation */}
        <div className="py-2 px-2 border-t border-industrial-700/60 space-y-0.5">
          {!isSidebarCollapsed && (
            <div className="px-2 pt-1 pb-1 text-[10px] uppercase font-semibold text-industrial-400 tracking-wider">
              Network & Regional
            </div>
          )}
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-medium transition-colors group ${
                    isActive
                      ? 'bg-industrial-800 text-industrial-50 border border-industrial-600'
                      : 'text-industrial-400 hover:bg-industrial-850 hover:text-industrial-200 border border-transparent'
                  }`
                }
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 text-industrial-400 group-hover:text-industrial-300" />
                {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer / System Status */}
      <div className="p-3 border-t border-industrial-700 bg-industrial-950/60">
        {!isSidebarCollapsed ? (
          <div className="flex flex-col gap-1 text-[10px] text-industrial-400 font-mono">
            <div className="flex items-center justify-between">
              <span>SYSTEM VERSION</span>
              <span className="text-industrial-300 font-semibold">v2.4-IND</span>
            </div>
            <div className="flex items-center justify-between">
              <span>GATEWAY</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                NOMINAL
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="System Status: Nominal">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};
