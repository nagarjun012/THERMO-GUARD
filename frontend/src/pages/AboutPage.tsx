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
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          About THERMOSAFE
        </h1>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          AI-Powered Extreme Heat Early Warning & Human Thermal Stress Intelligence Platform
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">
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
        className="glass-card p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">Scientific Methodology</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-dark-800 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Heat Index (HI)</h3>
            <p className="text-gray-400 text-sm mb-2">Rothfusz Regression (NOAA/NWS, 1990)</p>
            <p className="text-gray-300 text-sm">
              9-term polynomial regression modeling perceived temperature from air temperature and
              relative humidity. Includes boundary adjustments for extreme humidity conditions.
            </p>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-orange-400 mb-3">WBGT</h3>
            <p className="text-gray-400 text-sm mb-2">Australian BoM Simplified (ISO 7243)</p>
            <p className="text-gray-300 text-sm">
              Wet Bulb Globe Temperature using the simplified outdoor approximation. The gold standard
              for occupational heat stress assessment worldwide.
            </p>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">UTCI</h3>
            <p className="text-gray-400 text-sm mb-2">Bröde et al. (2012) Approximation</p>
            <p className="text-gray-300 text-sm">
              Universal Thermal Climate Index based on the Fiala multi-node thermoregulation model.
              Uses regression approximation when full MRT data is unavailable.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-dark-800 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Human Thermal Stress Score (HTSS)</h3>
          <p className="text-gray-300 text-sm mb-4">
            A unified 0-100 score combining all three indices using scientifically configurable weights:
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-400">45%</div>
              <div className="text-xs text-gray-500">UTCI Weight</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">35%</div>
              <div className="text-xs text-gray-500">WBGT Weight</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">20%</div>
              <div className="text-xs text-gray-500">Heat Index Weight</div>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-4">
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
        className="glass-card p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Data Sources</h2>
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
            <div key={i} className="flex items-start gap-3 p-3 bg-dark-800 rounded-lg">
              <Globe className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-white">{source.name}</div>
                <div className="text-xs text-gray-500">{source.desc}</div>
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
        className="glass-card p-8 mb-8 border-yellow-500/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Important Disclaimer</h2>
        </div>
        <p className="text-gray-300 leading-relaxed">
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
        className="glass-card p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Team THERMOSAFE</h2>
        </div>
        <p className="text-gray-300">
          Built for Smart India Hackathon 2026 — Problem Statement SIH26083: "Extreme Heatwave Early
          Warning and Human Thermal Stress Index."
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {['Python', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'Leaflet', 'Scikit-learn', 'PostgreSQL'].map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
