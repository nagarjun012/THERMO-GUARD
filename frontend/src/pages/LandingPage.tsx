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
  Sparkles,
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
      desc: 'Visualizing municipal wards, urban heat islands, and local thermal zones.',
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* TOP NAVBAR */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🌡️</span>
            <span className="font-mono tracking-tight font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              THERMOSAFE
            </span>
          </div>

          {/* DUAL LOGIN BUTTONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => openLogin('user')}
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold rounded-xl text-blue-300 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all cursor-pointer shadow-[0_0_12px_rgba(59,130,246,0.2)]"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>USER LOGIN</span>
            </button>

            <button
              onClick={() => openLogin('gov')}
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold rounded-xl text-amber-300 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.2)]"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>GOV LOGIN</span>
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-mono font-bold mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>DUAL-TIER HEAT RISK INTELLIGENCE ARCHITECTURE</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 font-mono tracking-tight"
            >
              AI-Powered Extreme Heat Early Warning
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Protecting lives through intelligent thermal stress monitoring, predictive forecasting,
              and targeted interventions for vulnerable populations across India.
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
                className="neu-card p-6 text-left rounded-3xl border border-blue-500/30 bg-blue-950/20 hover:border-blue-400 hover:bg-blue-950/40 transition-all cursor-pointer group shadow-[0_0_25px_rgba(59,130,246,0.15)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-full bg-blue-500/10">
                    PUBLIC / CITIZEN
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white mb-1 group-hover:text-blue-300 transition-colors">
                  USER LOGIN
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  Citizen Dashboard, live GIS heat risk maps, 72-hour forecast, and clinical advisories.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter User Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* GATEWAY 2: GOV LOGIN */}
              <div
                onClick={() => handleQuickLogin('gov')}
                className="neu-card p-6 text-left rounded-3xl border border-amber-500/30 bg-amber-950/20 hover:border-amber-400 hover:bg-amber-950/40 transition-all cursor-pointer group shadow-[0_0_25px_rgba(245,158,11,0.15)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full bg-amber-500/10">
                    OFFICIAL AUTHORITIES
                  </span>
                </div>
                <h3 className="text-xl font-bold font-mono text-white mb-1 group-hover:text-amber-300 transition-colors">
                  GOV LOGIN
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                  National heat risk intelligence across all 788 districts, Section 144 triggers, and hospital bed monitoring.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                  <span>Access Government Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* SYSTEM CAPABILITIES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300 group"
                >
                  <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent group-hover:text-accent-light" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
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
