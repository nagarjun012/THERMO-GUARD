import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Map,
  Activity,
  Info,
  BookOpen,
  ShieldAlert,
  LogOut,
  HeartPulse,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { TRANSLATIONS } from '../../i18n/translations';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole, logout, language } = useAppStore();
  const t = TRANSLATIONS[language];

  // Filter navigation links based on user role:
  // - USER LOGIN: Show Dashboard, Live Map, Safety Guide, Learn, About (Gov Portal is HIDDEN)
  // - GOV LOGIN: Show Gov Portal, Safety Guide, Learn, About (Dashboard and Live Map are HIDDEN)
  const links =
    userRole === 'gov'
      ? [
          { to: '/government', label: t.nav.govPortal, icon: Activity },
          { to: '/safety', label: t.nav.safety, icon: HeartPulse },
          { to: '/learn', label: t.nav.learn, icon: BookOpen },
          { to: '/about', label: t.nav.about, icon: Info },
        ]
      : [
          { to: '/dashboard', label: t.nav.dashboard, icon: Home },
          { to: '/map', label: t.nav.liveMap, icon: Map },
          { to: '/safety', label: t.nav.safety, icon: HeartPulse },
          { to: '/learn', label: t.nav.learn, icon: BookOpen },
          { to: '/about', label: t.nav.about, icon: Info },
        ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-blue-200/60 shadow-[0_4px_25px_rgba(20,80,180,0.06)] safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* BRAND LOGO WITH HIGH-PRECISION SHIELD EMBLEM */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center gap-2.5 group">
                <div className="p-2 rounded-xl bg-[#EDF5FD] border border-blue-200/80 group-hover:border-blue-300 transition-colors shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight text-slate-900 font-mono">
                    THERMOSAFE
                  </span>
                  <span className="text-[9px] font-mono font-bold tracking-wider text-blue-600 uppercase -mt-0.5">
                    Heat Defense Telemetry
                  </span>
                </div>
              </NavLink>
            </div>

            {/* DESKTOP NAV TABS (DYNAMICALLY FILTERED BY LOGIN ROLE) */}
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5 p-1.5 bg-[#EDF5FD] rounded-2xl border border-blue-200/70 shadow-inner">
                {links.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md -translate-y-[0.5px]'
                          : 'text-slate-600 hover:text-blue-700 hover:bg-white/80 border border-transparent'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`w-3.5 h-3.5 transition-colors duration-200 ${
                            isActive ? 'text-white' : 'text-slate-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ROLE BADGE & AUTH SWITCH CONTROLS */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={handleLogout}
                type="button"
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 active:scale-95 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl bg-[#EDF5FD] border border-blue-200/70 text-slate-700 hover:text-slate-900 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-blue-100 px-4 pt-3 pb-5 space-y-2 animate-fadeIn shadow-lg">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-[#EDF5FD]'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-3 text-xs font-bold rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
