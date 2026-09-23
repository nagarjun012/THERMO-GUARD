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
      <nav className="glass-nav glass-specular sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* BRAND LOGO WITH HIGH-PRECISION SHIELD EMBLEM */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center gap-2.5 group">
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 group-hover:border-slate-600 transition-colors">
                  <ShieldAlert className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-white font-mono">
                    THERMOSAFE
                  </span>
                  <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase -mt-0.5">
                    Heat Defense Telemetry
                  </span>
                </div>
              </NavLink>
            </div>

            {/* DESKTOP NAV TABS (DYNAMICALLY FILTERED BY LOGIN ROLE) */}
            <div className="hidden md:block">
              <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/90">
                {links.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-slate-800 text-white border border-slate-700/90 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`w-3.5 h-3.5 transition-colors ${
                            isActive ? 'text-blue-400' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* ROLE BADGE & AUTH SWITCH CONTROLS — hidden for production */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                onClick={handleLogout}
                type="button"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="skeuo-btn skeuo-btn-dark p-2 text-gray-300 hover:text-white focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isOpen && (
          <div className="md:hidden glass-modal border-t border-white/10 px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `skeuo-btn btn-shimmer w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'skeuo-btn-dark text-white border-l-4 border-accent shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <item.icon className="w-4 h-4 text-accent" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-3 text-xs font-mono font-bold rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 flex items-center justify-center gap-2"
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
