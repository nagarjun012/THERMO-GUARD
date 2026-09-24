import { motion } from 'framer-motion';
import { Shield, BookOpen, Database, AlertTriangle, Users, Globe } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent mb-4">
          About THERMOSAFE
        </h1>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto font-medium">
          AI-Powered Extreme Heat Early Warning & Human Thermal Stress Intelligence Platform
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-8 border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900">Our Mission</h2>
        </div>
        <p className="text-slate-700 leading-relaxed font-medium">
          THERMOSAFE is designed to protect lives by providing real-time heatwave early warnings and
          human thermal stress analysis. Built for Smart India Hackathon 2026 (Problem SIH26083), this
          platform serves both citizens and government disaster management authorities across India.
        </p>
      </motion.section>

      {/* Methodology */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 mb-8 border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900">Scientific Methodology</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#EDF5FD] rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-amber-700 mb-3">Heat Index (HI)</h3>
            <p className="text-slate-500 text-sm mb-2 font-medium">Rothfusz Regression (NOAA/NWS, 1990)</p>
            <p className="text-slate-700 text-sm leading-relaxed">
              9-term polynomial regression modeling perceived temperature from air temperature and
              relative humidity. Includes boundary adjustments for extreme humidity conditions.
            </p>
          </div>

          <div className="bg-[#EDF5FD] rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-orange-700 mb-3">WBGT</h3>
            <p className="text-slate-500 text-sm mb-2 font-medium">Australian BoM Simplified (ISO 7243)</p>
            <p className="text-slate-700 text-sm leading-relaxed">
              Wet Bulb Globe Temperature using the simplified outdoor approximation. The gold standard
              for occupational heat stress assessment worldwide.
            </p>
          </div>

          <div className="bg-[#EDF5FD] rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-purple-700 mb-3">UTCI</h3>
            <p className="text-slate-500 text-sm mb-2 font-medium">Bröde et al. (2012) Approximation</p>
            <p className="text-slate-700 text-sm leading-relaxed">
              Universal Thermal Climate Index based on the Fiala multi-node thermoregulation model.
              Uses regression approximation when full MRT data is unavailable.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-[#EDF5FD] rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Human Thermal Stress Score (HTSS)</h3>
          <p className="text-slate-700 text-sm mb-4 leading-relaxed font-medium">
            A unified 0-100 score combining all three indices using scientifically configurable weights:
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-xs">
              <div className="text-2xl font-black text-purple-600">45%</div>
              <div className="text-xs font-bold text-slate-500">UTCI Weight</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-xs">
              <div className="text-2xl font-black text-orange-600">35%</div>
              <div className="text-xs font-bold text-slate-500">WBGT Weight</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-blue-100 shadow-xs">
              <div className="text-2xl font-black text-amber-600">20%</div>
              <div className="text-xs font-bold text-slate-500">Heat Index Weight</div>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-4 font-semibold">
            Includes non-compensatory safety guardrail: extreme danger on any single index cannot be
            masked by lower values in others.
          </p>
        </div>
      </motion.section>

      {/* Data Sources */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.3 }}
        className="glass-card p-8 mb-8 border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900">Data Sources</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Open-Meteo API', desc: 'Real-time weather data and forecasts' },
            { name: 'IMD Criteria', desc: 'India Meteorological Department heatwave thresholds' },
            { name: 'Census of India', desc: 'Demographic and vulnerability data' },
            { name: 'OpenStreetMap', desc: 'Map tiles and geographic data' },
            { name: 'ISO 7243', desc: 'WBGT occupational heat stress standards' },
            { name: 'ISB COST 730', desc: 'UTCI thermal stress categories' },
          ].map((source, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 bg-[#EDF5FD] border border-blue-100 rounded-2xl">
              <Globe className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-bold text-slate-900">{source.name}</div>
                <div className="text-xs text-slate-500 font-medium">{source.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Disclaimer */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4 }}
        className="glass-card p-8 mb-8 border-amber-200 shadow-[0_12px_36px_rgba(30,100,200,0.07)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-black text-slate-900">Important Disclaimer</h2>
        </div>
        <p className="text-slate-700 leading-relaxed font-medium">
          THERMOSAFE is a <strong>disaster-preparedness and risk-awareness tool</strong>. It is NOT a
          medical diagnostic system. Risk assessments are based on environmental data and demographic
          indicators. Individual health responses to heat vary significantly. Always follow official
          IMD and NDMA advisories for emergency decisions. Consult healthcare professionals for
          medical advice related to heat exposure.
        </p>
      </motion.section>

      {/* Team */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.5 }}
        className="glass-card p-8 mb-8 border-white/90 shadow-[0_12px_36px_rgba(30,100,200,0.07)]"
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-black text-slate-900">Team THERMOSAFE</h2>
        </div>
        <p className="text-slate-700 font-medium leading-relaxed">
          Built for Smart India Hackathon 2026 — Problem Statement SIH26083: "Extreme Heatwave Early
          Warning and Human Thermal Stress Index."
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Scikit-learn', 'PostgreSQL'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF5FD] text-blue-700 border border-blue-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
