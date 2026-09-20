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
} from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { LoginModal } from '../auth/LoginModal';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole, setUserRole, logout } = useAppStore();

  // Filter navigation links based on user role:
  // - USER LOGIN: Show Dashboard, Live Map, Learn, About (Gov Portal is HIDDEN)
  // - GOV LOGIN: Show Gov Portal, Learn, About (Dashboard and Live Map are HIDDEN)
  const links =
    userRole === 'gov'
      ? [
          { to: '/government', label: 'Gov Portal', icon: Activity },
          { to: '/learn', label: 'Learn THERMOS', icon: BookOpen },
          { to: '/about', label: 'About', icon: Info },
        ]
      : [
          { to: '/dashboard', label: 'Dashboard', icon: Home },
          { to: '/map', label: 'Live Map', icon: Map },
          { to: '/learn', label: 'Learn THERMOS', icon: BookOpen },
          { to: '/about', label: 'About', icon: Info },
        ];

  const handleSwitchRole = () => {
    if (userRole === 'gov') {
      setUserRole('user');
      navigate('/dashboard');
    } else {
      setUserRole('gov');
      navigate('/government');
    }
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
            {/* BRAND LOGO WITH SKEUOMORPHIC SHIELD EMBLEM */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center gap-3 group">
                <div className="relative p-2 rounded-xl bg-gradient-to-b from-orange-500/20 to-red-600/20 border border-orange-500/40 shadow-inner group-hover:scale-105 transition-transform duration-200">
                  <ShieldAlert className="w-6 h-6 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 font-mono">
                    THERMOSAFE
                  </span>
                  <span className="text-[9px] font-mono tracking-widest text-gray-400 uppercase -mt-0.5">
                    Heat Defense Telemetry
                  </span>
                </div>
              </NavLink>
            </div>

            {/* DESKTOP NAV TABS (DYNAMICALLY FILTERED BY LOGIN ROLE) */}
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5 p-1 bg-dark-900/60 rounded-2xl border border-white/5 shadow-inner">
                {links.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `skeuo-btn btn-shimmer flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'skeuo-btn-dark text-white border-accent/50 shadow-[0_2px_10px_rgba(59,130,246,0.3)]'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`w-3.5 h-3.5 transition-colors ${
                            isActive
                              ? 'text-accent drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]'
                              : 'text-gray-400'
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
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>GOV LOGIN</span>
                  </span>
                  <button
                    onClick={handleSwitchRole}
                    type="button"
                    className="skeuo-btn px-3 py-1.5 text-xs font-bold font-mono rounded-xl text-blue-300 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Switch to User Login"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Switch to User</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>USER LOGIN</span>
                  </span>
                  <button
                    onClick={handleSwitchRole}
                    type="button"
                    className="skeuo-btn px-3 py-1.5 text-xs font-bold font-mono rounded-xl text-amber-300 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Switch to Government Login"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Switch to Gov</span>
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                type="button"
                className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
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
        initialRole={userRole}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
