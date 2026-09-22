import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { CriticalAlertBanner } from './CriticalAlertBanner';
import { AlertActionModal } from './AlertActionModal';
import { GlobalSearchModal } from './GlobalSearchModal';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Layers, Bell, Cpu, X } from 'lucide-react';
import { useIndustrialStore } from '../../stores/industrialStore';

interface IndustrialShellProps {
  children: React.ReactNode;
}

export const IndustrialShell: React.FC<IndustrialShellProps> = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { alerts } = useIndustrialStore();

  const activeAlertsCount = alerts.filter(
    (a) => a.status === 'ACTIVE' && (a.severity === 'CRITICAL' || a.severity === 'WARNING')
  ).length;

  return (
    <div className="min-h-screen bg-industrial-950 text-industrial-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Top Fixed Critical Alert Ribbon (Emergency Condition) */}
      <CriticalAlertBanner />

      {/* 2. Top Operational Header */}
      <TopHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* 3. Main Body: Sidebar + Dynamic Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Slide-Out Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85%] bg-industrial-900 h-full flex flex-col shadow-2xl z-10">
              <div className="p-3 border-b border-industrial-700 flex items-center justify-between">
                <span className="text-xs font-bold text-industrial-50 uppercase tracking-wider">
                  Industrial Navigation
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-industrial-400 hover:text-industrial-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto" onClick={() => setMobileMenuOpen(false)}>
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto bg-industrial-950 p-4 lg:p-6"
        >
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden h-14 bg-industrial-900 border-t border-industrial-700 flex items-center justify-around px-2 z-30 select-none"
      >
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] ${
              isActive ? 'text-amber-400 font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/monitoring"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] ${
              isActive ? 'text-amber-400 font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`
          }
        >
          <Activity className="w-4 h-4" />
          <span>Monitor</span>
        </NavLink>

        <NavLink
          to="/zones"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] ${
              isActive ? 'text-amber-400 font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`
          }
        >
          <Layers className="w-4 h-4" />
          <span>Zones</span>
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] relative ${
              isActive ? 'text-amber-400 font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`
          }
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-amber-500 text-industrial-950 font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeAlertsCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-[10px] ${
              isActive ? 'text-amber-400 font-semibold' : 'text-industrial-400 hover:text-industrial-200'
            }`
          }
        >
          <Cpu className="w-4 h-4" />
          <span>Devices</span>
        </NavLink>
      </nav>

      {/* 5. Modals & Dialogs */}
      <AlertActionModal />
      <GlobalSearchModal />
    </div>
  );
};
