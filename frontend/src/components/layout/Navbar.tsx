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
  User,
  Shield,
  LogOut,
  ArrowRightLeft,
  HeartPulse,
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { TRANSLATIONS } from '../../i18n/translations';
import { LoginModal } from '../auth/LoginModal';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [switchTargetRole, setSwitchTargetRole] = useState<'user' | 'gov'>('user');
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

  // Role switch requires re-authentication via LoginModal
  const handleSwitchRole = () => {
    const targetRole = userRole === 'gov' ? 'user' : 'gov';
    setSwitchTargetRole(targetRole);
    setIsModalOpen(true);
  };

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

            {/* ROLE BADGE & AUTH SWITCH CONTROLS */}
            <div className="hidden sm:flex items-center gap-2.5">
              {userRole === 'gov' ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>GOV PORTAL</span>
                  </span>
                  <button
                    onClick={handleSwitchRole}
                    type="button"
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg text-slate-300 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Switch to User Login"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch to Citizen</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>CITIZEN</span>
                  </span>
                  <button
                    onClick={handleSwitchRole}
                    type="button"
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg text-slate-300 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Switch to Government Login"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch to Gov</span>
                  </button>
                </div>
              )}

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
            {/* MOBILE ROLE BADGE */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-gray-400">CURRENT SESSION:</span>
              <span
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${
                  userRole === 'gov'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                }`}
              >
                {userRole === 'gov' ? 'GOV LOGIN' : 'USER LOGIN'}
              </span>
            </div>

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

            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSwitchRole();
                }}
                className="flex-1 py-2 px-3 text-xs font-mono font-bold rounded-xl border border-white/10 bg-white/5 text-gray-200 flex items-center justify-center gap-2"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Switch to {userRole === 'gov' ? 'User Login' : 'Gov Login'}</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="p-2 text-xs font-mono font-bold rounded-xl border border-red-500/20 bg-red-500/10 text-red-300"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isModalOpen}
        initialRole={switchTargetRole}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
