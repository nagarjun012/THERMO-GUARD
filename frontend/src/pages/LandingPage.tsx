import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Activity,
  BarChart3,
  Bell,
  Smartphone,
  Globe,
  User,
  ShieldAlert,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore, AuthRole } from '../stores/appStore';
import { LoginModal } from '../components/auth/LoginModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<AuthRole>('user');

  const openLogin = (role: AuthRole) => {
    setModalRole(role);
    setModalOpen(true);
  };

  const handleQuickLogin = (role: AuthRole) => {
    setUserRole(role);
    if (role === 'gov') {
      navigate('/government');
    } else {
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      desc: 'Continuous tracking of genuine multi-parameter Open-Meteo telemetry.',
    },
    {
      icon: Shield,
      title: 'Advanced Risk Assessment',
      desc: 'Authoritative biometeorological HTSS model utilizing WBGT and UTCI indices.',
    },
    {
      icon: Bell,
      title: 'Early Warning System',
      desc: 'Actionable clinical alerts tailored for citizens, outdoor laborers, and elders.',
    },
    {
      icon: Globe,
      title: 'Interactive GIS Mapping',
      desc: 'Visualizing district hotspots, urban heat islands, and local thermal zones.',
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      desc: '72-hour forecasting and risk probability modeling for proactive mitigation.',
    },
    {
      icon: Smartphone,
      title: 'Dedicated Dual Portals',
      desc: 'Separate Citizen Dashboard and National Government Intelligence interfaces.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      {/* AMBIENT GRADIENTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      <div className="relative z-10">
        {/* TOP NAVBAR */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-b from-orange-500/20 to-red-600/20 border border-orange-500/30 text-orange-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-mono tracking-tight font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              THERMOSAFE
            </span>
          </div>

          {/* DUAL LOGIN BUTTONS */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openLogin('user')}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg text-slate-300 border border-slate-700 bg-slate-800/90 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>CITIZEN LOGIN</span>
            </button>

            <button
              onClick={() => openLogin('gov')}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg text-amber-300 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>OFFICIAL LOGIN</span>
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono mb-6"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>OPERATIONAL HEAT DEFENSE PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight text-white font-mono"
            >
              Thermal Stress Intelligence &amp; Early Warning System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Real-time biometeorological monitoring, physical heat index forecasting, and district-level automated mitigation protocols across all 788 Indian districts.
            </motion.p>

            {/* TWO DEDICATED LOGIN ACCESS GATEWAYS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-6"
            >
              {/* GATEWAY 1: USER LOGIN */}
              <div
                onClick={() => handleQuickLogin('user')}
                className="neu-card p-6 text-left rounded-2xl border border-slate-700/80 hover:border-blue-500/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-md bg-blue-500/10">
                    PUBLIC / CITIZEN
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono text-white mb-1 group-hover:text-blue-300 transition-colors">
                  Citizen Portal
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Personalized strain profiles, live GIS heat risk maps, 72-hour forecast, and clinical advisories.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Citizen Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* GATEWAY 2: GOV LOGIN */}
              <div
                onClick={() => handleQuickLogin('gov')}
                className="neu-card p-6 text-left rounded-2xl border border-slate-700/80 hover:border-amber-500/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md bg-amber-500/10">
                    OFFICIAL AUTHORITIES
                  </span>
                </div>
                <h3 className="text-lg font-bold font-mono text-white mb-1 group-hover:text-amber-300 transition-colors">
                  Government Command
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  National heat risk intelligence across all 788 districts, Section 144 triggers, and hospital capacity.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Access Government Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* SYSTEM CAPABILITIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="neu-card p-6 border border-slate-800/90 hover:border-slate-700 transition-colors group"
                >
                  <div className="w-10 h-10 bg-slate-800 border border-slate-700/80 rounded-lg flex items-center justify-center mb-4 text-slate-300 group-hover:text-orange-400 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={modalOpen}
        initialRole={modalRole}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
