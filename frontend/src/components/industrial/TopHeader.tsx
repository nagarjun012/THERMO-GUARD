import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  RefreshCw,
  Search,
  Bell,
  CheckCircle2,
  LogOut,
  PhoneCall,
  Menu,
} from 'lucide-react';
import { useIndustrialStore } from '../../stores/industrialStore';
import { useAppStore } from '../../stores/appStore';
import { useNavigate } from 'react-router-dom';

interface TopHeaderProps {
  onMobileMenuToggle?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    facilities,
    activeFacilityId,
    switchFacility,
    getActiveFacility,
    lastSyncTime,
    refreshTelemetry,
    setSearchModalOpen,
    alerts,
    openAlertModal,
  } = useIndustrialStore();

  const { userRole, currentUser, logout } = useAppStore();
  const navigate = useNavigate();

  const [isFacilityDropdownOpen, setFacilityDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeFacility = getActiveFacility();
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    refreshTelemetry();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="h-14 bg-industrial-900 border-b border-industrial-700 px-4 flex items-center justify-between gap-4 z-20 select-none">
      {/* Left: Mobile hamburger & Facility Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded text-industrial-400 hover:text-industrial-100 hover:bg-industrial-800"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Facility Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setFacilityDropdownOpen(!isFacilityDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-industrial-850 hover:bg-industrial-800 border border-industrial-700 text-xs font-medium text-industrial-100 transition-colors"
          >
            <Building2 className="w-4 h-4 text-industrial-400" />
            <span className="font-semibold text-industrial-50 truncate max-w-[180px] sm:max-w-[240px]">
              {activeFacility.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-industrial-400" />
          </button>

          {isFacilityDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-72 bg-industrial-850 border border-industrial-700 rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-industrial-400 border-b border-industrial-700/60 tracking-wider">
                Select Monitored Facility
              </div>
              {facilities.map((fac) => (
                <button
                  key={fac.id}
                  onClick={() => {
                    switchFacility(fac.id);
                    setFacilityDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex flex-col gap-0.5 hover:bg-industrial-800 transition-colors ${
                    fac.id === activeFacilityId ? 'bg-industrial-800/80 border-l-2 border-amber-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-industrial-100">{fac.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                        fac.overallStatus === 'SAFE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}
                    >
                      {fac.overallStatus}
                    </span>
                  </div>
                  <span className="text-[10px] text-industrial-400 truncate">{fac.location}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Overall Status Pill */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-industrial-700/60">
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold flex items-center gap-1.5 ${
              activeFacility.overallStatus === 'SAFE'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeFacility.overallStatus === 'SAFE' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            {activeFacility.overallStatus}
          </span>
          <span className="text-xs text-industrial-400 font-mono">
            Avg <span className="text-industrial-200">{activeFacility.avgTemperature.toFixed(1)}°C</span>
          </span>
        </div>
      </div>

      {/* Center: Quick Search Trigger */}
      <div className="flex-1 max-w-md hidden sm:block">
        <button
          onClick={() => setSearchModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded bg-industrial-950 border border-industrial-700 text-xs text-industrial-400 hover:border-industrial-600 hover:text-industrial-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-industrial-400" />
            <span>Search zones, sensors, alerts...</span>
          </div>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-industrial-850 rounded border border-industrial-700 text-industrial-400">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Sync, Emergency, Notifications, User */}
      <div className="flex items-center gap-2.5">
        {/* Sync telemetry button */}
        <button
          onClick={handleRefreshClick}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-industrial-850 hover:bg-industrial-800 text-industrial-300 hover:text-industrial-100 border border-industrial-700 text-xs transition-colors"
          title="Poll live sensor telemetry"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span className="hidden xl:inline text-[11px] font-mono text-industrial-400">
            Synced {lastSyncTime}
          </span>
        </button>

        {/* Emergency Call Hotline Button */}
        <a
          href="tel:108"
          className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 text-xs transition-colors"
          title="Emergency Medical Hotline 108"
        >
          <PhoneCall className="w-3.5 h-3.5 text-red-400" />
          <span className="font-mono text-[11px] font-bold">108 / 112</span>
        </a>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!isNotificationOpen)}
            className="p-1.5 rounded bg-industrial-850 hover:bg-industrial-800 text-industrial-300 hover:text-industrial-100 border border-industrial-700 relative transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-industrial-950 font-bold font-mono text-[10px] flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-industrial-850 border border-industrial-700 rounded-md shadow-2xl z-50 py-1">
              <div className="px-3 py-2 border-b border-industrial-700 flex items-center justify-between">
                <span className="text-xs font-bold text-industrial-100 uppercase tracking-wider">
                  Active Alerts ({activeAlerts.length})
                </span>
                <button
                  onClick={() => {
                    setNotificationOpen(false);
                    navigate('/alerts');
                  }}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-industrial-750">
                {activeAlerts.length === 0 ? (
                  <div className="p-4 text-center text-xs text-industrial-400 flex flex-col items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>No active thermal alerts across facility.</span>
                  </div>
                ) : (
                  activeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        openAlertModal(alert);
                        setNotificationOpen(false);
                      }}
                      className="p-3 hover:bg-industrial-800 cursor-pointer transition-colors text-xs flex flex-col gap-1"
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
                      <div className="font-medium text-industrial-100">{alert.title}</div>
                      <div className="text-[11px] text-industrial-400">
                        {alert.zoneName} — {alert.reading.toFixed(1)}°C (Limit: {alert.threshold.toFixed(1)}°C)
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Logout */}
        <div className="flex items-center gap-2 pl-1 border-l border-industrial-700/60">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-semibold text-industrial-100 truncate max-w-[120px]">
              {currentUser?.name || (userRole === 'gov' ? 'Safety Officer' : 'Plant Operator')}
            </span>
            <span className="text-[10px] font-mono text-industrial-400 uppercase">
              {userRole === 'gov' ? 'Control Lead' : 'Operator'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded bg-industrial-850 hover:bg-industrial-800 text-industrial-400 hover:text-red-300 border border-industrial-700 transition-colors"
            title="Log out session"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
