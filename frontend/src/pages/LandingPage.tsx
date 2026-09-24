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
    <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] text-slate-900 overflow-hidden">
      {/* AMBIENT GRADIENTS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10">
        {/* TOP NAVBAR */}
        <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-blue-200/80 text-blue-600 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="font-mono tracking-tight font-black text-slate-950">
              THERMOSAFE
            </span>
          </div>

          {/* DUAL LOGIN BUTTONS */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openLogin('user')}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold rounded-xl text-blue-700 border border-blue-200 bg-white hover:bg-blue-50 shadow-xs transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>CITIZEN LOGIN</span>
            </button>

            <button
              onClick={() => openLogin('gov')}
              type="button"
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold rounded-xl text-slate-900 border border-blue-300/80 bg-[#EDF5FD] hover:bg-blue-100 shadow-xs transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFICIAL LOGIN</span>
            </button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="max-w-7xl mx-auto px-6 pt-12 pb-32">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-blue-200 text-blue-800 text-xs font-mono font-bold mb-6 shadow-xs"
            >
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>OPERATIONAL HEAT DEFENSE PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight text-slate-950 font-mono"
            >
              Thermal Stress Intelligence &amp; Early Warning System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-semibold"
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
                className="p-6 text-left rounded-3xl bg-white border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.08)] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-[#EDF5FD] border border-blue-200 text-blue-600 group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-black text-blue-800 border border-blue-200 px-2 py-0.5 rounded-lg bg-[#EDF5FD]">
                    PUBLIC / CITIZEN
                  </span>
                </div>
                <h3 className="text-xl font-black font-mono text-slate-950 mb-1.5 group-hover:text-blue-700 transition-colors">
                  Citizen Portal
                </h3>
                <p className="text-xs text-slate-700 mb-4 leading-relaxed font-medium">
                  Personalized strain profiles, live GIS heat risk maps, 72-hour forecast, and clinical advisories.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 group-hover:translate-x-1.5 transition-transform">
                  <span>Open Citizen Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* GATEWAY 2: GOV LOGIN */}
              <div
                onClick={() => handleQuickLogin('gov')}
                className="p-6 text-left rounded-3xl bg-white border border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.08)] hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 group-hover:scale-105 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-black text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg bg-amber-50">
                    OFFICIAL AUTHORITIES
                  </span>
                </div>
                <h3 className="text-xl font-black font-mono text-slate-950 mb-1.5 group-hover:text-amber-700 transition-colors">
                  Government Command
                </h3>
                <p className="text-xs text-slate-700 mb-4 leading-relaxed font-medium">
                  National heat risk intelligence across all 788 districts, Section 144 triggers, and hospital capacity.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-800 group-hover:translate-x-1.5 transition-transform">
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
                  className="p-6 rounded-3xl bg-white border border-white/90 shadow-[0_8px_24px_rgba(30,100,200,0.06)] hover:-translate-y-0.5 transition-all group"
                >
                  <div className="w-10 h-10 bg-[#EDF5FD] border border-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-105 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950 mb-2">{f.title}</h3>
                  <p className="text-slate-700 text-xs font-medium leading-relaxed">{f.desc}</p>
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
