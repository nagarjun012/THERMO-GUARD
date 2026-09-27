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
import { TiltCard } from '../components/common/TiltCard';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginCitizen } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<AuthRole>('user');

  const openLogin = (role: AuthRole) => {
    setModalRole(role);
    setModalOpen(true);
  };

  const handleQuickLogin = async (role: AuthRole) => {
    if (role === 'gov') {
      openLogin('gov');
    } else {
      await loginCitizen();
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
    <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] text-slate-900 overflow-x-hidden">
      {/* AMBIENT GRADIENTS WITH FLOATING DRIFT */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/45 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/35 rounded-full blur-[130px]"
        />
      </div>

      <div className="relative z-10">
        {/* TOP NAVBAR */}
        <nav className="p-3.5 sm:p-6 flex justify-between items-center gap-2 max-w-7xl mx-auto safe-top">
          <div className="text-xl sm:text-2xl font-bold flex items-center gap-2 sm:gap-3 shrink-0">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="p-1.5 sm:p-2 rounded-xl bg-white border border-blue-200/80 text-blue-600 shadow-xs cursor-pointer"
            >
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
            <span className="font-mono tracking-tight font-black text-slate-950 text-base sm:text-2xl">
              THERMOSAFE
            </span>
          </div>

          {/* DUAL LOGIN BUTTONS WITH HAPTIC PRESS */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openLogin('user')}
              type="button"
              className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono font-bold rounded-xl text-blue-700 border border-blue-200 bg-white hover:bg-blue-50 shadow-xs transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-600" />
              <span>CITIZEN</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => openLogin('gov')}
              type="button"
              className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono font-bold rounded-xl text-slate-950 border border-blue-300/80 bg-[#EDF5FD] hover:bg-blue-100 shadow-xs transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFICIAL</span>
            </motion.button>
          </div>
        </nav>

        {/* HERO SECTION */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-28">
          <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-blue-200/90 text-blue-900 text-[11px] font-mono font-bold mb-6 shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span className="tracking-wider uppercase">OPERATIONAL HEAT DEFENSE PLATFORM • 788 DISTRICTS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-[1.08] tracking-tight text-slate-950"
            >
              Thermal Stress Intelligence &amp; Early Warning System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Real-time biometeorological monitoring, physical heat index forecasting, and district-level automated mitigation protocols across all Indian states &amp; UTs.
            </motion.p>

            {/* TWO DEDICATED 3D PHYSICS TILT LOGIN ACCESS GATEWAYS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-6 text-left"
            >
              {/* GATEWAY 1: CITIZEN PORTAL */}
              <TiltCard
                onClick={() => handleQuickLogin('user')}
                maxTilt={9}
                depth={16}
                className="double-bezel p-6 sm:p-7 rounded-[2rem] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-2xs">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full bg-blue-50/80">
                      PUBLIC ACCESS
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 mb-2 group-hover:text-blue-600 transition-colors">
                    Citizen Portal
                  </h3>
                  <p className="text-xs text-slate-600 mb-6 leading-relaxed font-medium">
                    Personalized strain profiles, live GIS heat risk maps, 72-hour forecast, and clinical advisories.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>Open Citizen Dashboard</span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:translate-x-1.5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </TiltCard>

              {/* GATEWAY 2: GOVERNMENT COMMAND */}
              <TiltCard
                onClick={() => handleQuickLogin('gov')}
                maxTilt={9}
                depth={16}
                className="double-bezel p-6 sm:p-7 rounded-[2rem] group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform shadow-2xs">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full bg-amber-50/80">
                      OFFICIAL AUTHORITIES
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-950 mb-2 group-hover:text-amber-700 transition-colors">
                    Government Command
                  </h3>
                  <p className="text-xs text-slate-600 mb-6 leading-relaxed font-medium">
                    National heat risk intelligence across all 788 districts, Section 144 triggers, and hospital capacity.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>Access Government Portal</span>
                  <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:translate-x-1.5 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          {/* SYSTEM CAPABILITIES GRID WITH TACTILE TILT & SPRINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <TiltCard
                  key={i}
                  maxTilt={6}
                  depth={8}
                  className="double-bezel p-6 sm:p-7 rounded-[1.75rem] group"
                >
                  <div className="w-11 h-11 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-950 mb-1.5 group-hover:text-blue-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">{f.desc}</p>
                </TiltCard>
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
