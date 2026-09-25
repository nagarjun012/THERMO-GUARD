import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Clock,
  Users,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
  ArrowUp,
  MapPin,
  Flame,
  HelpCircle,
  Sliders,
  Info,
  Shield,
  TrendingUp,
  Bell,
  Heart,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

// Section interface for sub-nav
interface NavSection {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navSections: NavSection[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'data', label: 'Data Inputs', icon: Layers },
  { id: 'wbgt', label: 'WBGT', icon: Sun },
  { id: 'heat-index', label: 'Heat Index', icon: Thermometer },
  { id: 'humidex', label: 'Humidex', icon: Droplets },
  { id: 'comparison', label: 'Indices Compared', icon: Sliders },
  { id: 'risk-score', label: 'Risk Score', icon: Activity },
  { id: 'district-risk', label: 'District Risk System', icon: MapPin },
  { id: 'forecast', label: 'Forecasts', icon: Calendar },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'vulnerability', label: 'Vulnerability', icon: Users },
  { id: 'safety', label: 'Safety & Actions', icon: ShieldCheck },
  { id: 'simulator', label: 'Live Calculator', icon: Zap },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'glossary', label: 'Glossary', icon: Info },
];

export const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [glossaryQuery, setGlossaryQuery] = useState('');

  // Simulator state
  const [simTemp, setSimTemp] = useState(38);
  const [simHumidity, setSimHumidity] = useState(55);
  const [simWind, setSimWind] = useState(10);
  const [simSolar, setSimSolar] = useState(700);

  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Keep active tab centered in horizontal scroll view
    const activeEl = tabRefs.current[activeSection];
    if (activeEl && tabContainerRef.current) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeSection]);

  const scrollNav = (direction: 'left' | 'right') => {
    if (tabContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      tabContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      // Determine active section
      for (const sec of navSections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  // Live THERMOS risk calculation matching backend logic
  const calculateSimulatedResult = () => {
    const tf = simTemp * 1.8 + 32;
    let hi_f = 0.5 * (tf + 61.0 + (tf - 68.0) * 1.2 + simHumidity * 0.094);
    if (hi_f >= 80) {
      hi_f =
        -42.379 +
        2.04901523 * tf +
        10.14333127 * simHumidity -
        0.22475541 * tf * simHumidity -
        0.00683783 * tf * tf -
        0.05481717 * simHumidity * simHumidity +
        0.00122874 * tf * tf * simHumidity +
        0.00085282 * tf * simHumidity * simHumidity -
        0.00000199 * tf * tf * simHumidity * simHumidity;
    }
    const hi = Math.round(((hi_f - 32) / 1.8) * 10) / 10;

    const e = (simHumidity / 100.0) * 6.105 * Math.exp((17.27 * simTemp) / (237.7 + simTemp));
    let wbgt_val = 0.567 * simTemp + 0.393 * e + 3.94;
    if (simSolar > 100) wbgt_val += simSolar * 0.01;
    const wbgt = Math.round(wbgt_val * 10) / 10;

    const v_ms = simWind * 0.27778;
    const tmrt = simSolar > 0 ? simTemp + 0.08 * simSolar - 1.2 * Math.sqrt(v_ms) : simTemp;
    const utci = Math.round((simTemp + 0.2 * (tmrt - simTemp) - 0.1 * v_ms + 0.05 * simHumidity) * 10) / 10;

    const n_hi = Math.min(100, Math.max(0, (hi - 25) * 3));
    const n_wbgt = Math.min(100, Math.max(0, (wbgt - 20) * 4));
    const n_utci = Math.min(100, Math.max(0, (utci - 20) * 2.5));
    const weighted = n_utci * 0.45 + n_wbgt * 0.35 + n_hi * 0.2;
    const max_sub = Math.max(n_hi, n_wbgt, n_utci);
    const htssScore = Math.min(100, Math.round(Math.max(weighted, 0.85 * max_sub)));

    let riskCategory = 'Safe';
    let riskColor = '#10b981';
    let riskDesc = 'Conditions are comfortable and manageable.';
    let recommendation = 'Stay hydrated and carry on normal daily activities.';

    if (htssScore > 85) {
      riskCategory = 'Extreme';
      riskColor = '#a855f7';
      riskDesc = 'Life-threatening heat risk. High danger of heat stroke.';
      recommendation = 'Mandatory outdoor work stoppage. Stay indoors with cooling/fans.';
    } else if (htssScore > 75) {
      riskCategory = 'High';
      riskColor = '#ef4444';
      riskDesc = 'Severe heat stress. High risk for vulnerable groups & outdoor workers.';
      recommendation = 'Avoid sun between 11 AM - 4 PM. Mandatory 15-min rest every hour.';
    } else if (htssScore > 60) {
      riskCategory = 'Moderate';
      riskColor = '#f97316';
      riskDesc = 'Elevated thermal discomfort. Heat cramps & exhaustion possible.';
      recommendation = 'Drink water regularly even if not thirsty. Take frequent shade breaks.';
    } else if (htssScore > 30) {
      riskCategory = 'Low';
      riskColor = '#eab308';
      riskDesc = 'Mild heat stress for sensitive individuals.';
      recommendation = 'Wear lightweight clothing and keep water handy.';
    }

    return { hi, wbgt, utci, htssScore, riskCategory, riskColor, riskDesc, recommendation };
  };

  const simResult = calculateSimulatedResult();

  const glossaryList = [
    { term: 'Temperature', def: 'The direct measure of how hot or cold the surrounding air is, measured in degrees Celsius (°C).' },
    { term: 'Relative Humidity', def: 'The percentage of moisture in the air relative to the maximum amount the air can hold at that temperature.' },
    { term: 'Wind Speed', def: 'The rate of air movement (km/h), which helps cool the skin through convective heat loss.' },
    { term: 'Solar Radiation', def: 'Direct radiant energy from the sun (W/m²), which adds significant thermal load to body skin and clothing.' },
    { term: 'Heat Exposure', def: 'The continuous duration and intensity of human presence in hot environmental conditions.' },
    { term: 'WBGT (Wet Bulb Globe Temperature)', def: 'A scientific index combining air temp, humidity, solar radiation, and wind to measure heat stress during physical exertion.' },
    { term: 'Heat Index', def: 'NOAA index measuring how hot air feels when temperature and humidity are combined.' },
    { term: 'Humidex', def: 'A Canadian heat-stress indicator measuring perceived discomfort resulting from high temperature and humidity.' },
    { term: 'Heat Stress', def: 'The net heat load placed on the human body from environmental factors, physical activity, and clothing.' },
    { term: 'Heatwave', def: 'A period of abnormally hot weather lasting two or more consecutive days according to IMD criteria.' },
    { term: 'HTSS (Human Thermal Stress Score)', def: 'THERMOS’s unified 0–100 risk score combining HI, WBGT, UTCI, and demographic vulnerability.' },
    { term: 'GIS (Geographic Information System)', def: 'Mapping technology that visualizes spatial data, allowing risk analysis across states, cities, and districts.' },
    { term: 'District / Regional Level', def: 'Administrative regional division used to localize heat risk warnings.' },
    { term: 'Early Warning System', def: 'An integrated system of monitoring, forecasting, and communication that alerts people to upcoming environmental hazards.' },
    { term: 'Vulnerable Population', def: 'Demographic groups (elderly, infants, outdoor workers, impoverished) at higher risk of severe heat illness.' },
    { term: 'Cooling Centre', def: 'An air-conditioned or shaded public facility designated for citizens to take refuge during extreme heatwaves.' },
  ];

  const filteredGlossary = glossaryList.filter(
    (g) =>
      g.term.toLowerCase().includes(glossaryQuery.toLowerCase()) ||
      g.def.toLowerCase().includes(glossaryQuery.toLowerCase())
  );

  const faqs = [
    { q: 'What is THERMOS?', a: 'THERMOS (Thermal Health Risk & Early-warning Management & Operational System) is an AI-powered platform designed to calculate, predict, and alert citizens and government officials about extreme heat risks across India.' },
    { q: 'Is THERMOS only a temperature-monitoring system?', a: 'No! High temperature alone does not tell the full story. THERMOS integrates humidity, wind speed, solar radiation, exposure time, and population vulnerability to calculate actual human heat strain.' },
    { q: 'What is WBGT?', a: 'WBGT stands for Wet Bulb Globe Temperature. It measures the physical heat stress placed on the human body during physical activity by combining air temperature, humidity, solar radiation, and wind.' },
    { q: 'What is Heat Index?', a: 'Heat Index measures how hot the air feels to the human body when air temperature is combined with relative humidity ("feels-like" temperature).' },
    { q: 'What is Humidex?', a: 'Humidex is a Canadian heat discomfort index combining air temperature and relative humidity to reflect general environmental discomfort.' },
    { q: 'Why does humidity matter so much in heatwaves?', a: 'Sweat evaporation is the body’s main way of cooling down. High humidity prevents sweat from evaporating, trapping heat inside your body and making 35°C feel like 45°C!' },
    { q: 'Why are wind speed and solar radiation considered?', a: 'Wind provides cooling by evaporating sweat faster, while direct sunlight (solar radiation) bakes your skin and clothes, adding up to 10°C of extra heat load.' },
    { q: 'What does the 0–100 Risk Score mean?', a: 'The Human Thermal Stress Score (HTSS) ranks heat danger on a clear scale: 0-30 (Safe), 31-60 (Low), 61-75 (Moderate), 76-85 (High), and 86-100 (Extreme).' },
    { q: 'What does the live GIS map show?', a: 'The live map visualizes real-time thermal stress scores and alert levels across cities and districts in India, helping authorities target relief efforts.' },
    { q: 'How does the 72-hour forecast help?', a: 'The multi-horizon forecast predicts upcoming heat stress up to 3 days in advance so schools, construction sites, and hospitals can prepare before dangerous conditions hit.' },
    { q: 'Who should pay extra attention to heat warnings?', a: 'Elderly citizens, infants/children, outdoor workers (construction, farming, delivery), pregnant women, and individuals with pre-existing heart or kidney conditions.' },
    { q: 'Does THERMOS replace a doctor or medical professional?', a: 'No. THERMOS provides environmental disaster risk intelligence. If someone shows signs of heat stroke (confusion, fainting, high body temp), call emergency medical services (108 / 112) immediately.' },
    { q: 'Does THERMOS predict weather or heat-health risk?', a: 'THERMOS transforms meteorological weather forecasts into actual health risk predictions by evaluating how environmental conditions affect human biometeorology.' },
    { q: 'How can government authorities use THERMOS?', a: 'Officials use the Government Command Center to monitor high-risk districts, trigger emergency alerts, open public cooling centers, and adjust outdoor working hours.' },
    { q: 'How can ordinary citizens use THERMOS?', a: 'Citizens can check their local HTSS risk score, view safe outdoor exposure limits, receive localized warnings, and follow tailored hydration/safety advisories.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] text-slate-900 pb-20 relative -mt-2 learn-page-root overflow-x-hidden">
      {/* STICKY SUB-NAVIGATION BAR WITH EFFECTS, ANIMATIONS & HIGH VISIBILITY */}
      <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-2xl border-b border-blue-200/60 shadow-[0_4px_20px_rgba(20,80,180,0.06)] transition-all overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2.5 flex items-center relative gap-2">
          {/* Left Arrow Button (Desktop) */}
          <button
            onClick={() => scrollNav('left')}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-blue-200/80 shadow-xs transition-all shrink-0 cursor-pointer active:scale-95 z-20"
            title="Scroll tabs left"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Left Gradient Fade Mask */}
          <div className="pointer-events-none absolute left-0 lg:left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />

          {/* Tabs Scrollable Container */}
          <div
            ref={tabContainerRef}
            className="flex-1 overflow-x-auto py-1 px-1 flex items-center gap-2.5 no-scrollbar scroll-smooth"
          >
            {navSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;

              return (
                <motion.button
                  key={sec.id}
                  ref={(el) => { tabRefs.current[sec.id] = el; }}
                  onClick={() => scrollTo(sec.id)}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative group px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer flex items-center gap-1.5 z-10 shrink-0 ${
                    isActive
                      ? 'text-white font-black'
                      : 'text-slate-600 hover:text-blue-700'
                  }`}
                >
                  {/* Sliding Active Pill Background Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeLearnTab"
                      className="absolute inset-0 rounded-full bg-[#2563EB] shadow-[0_2px_12px_rgba(37,99,235,0.4)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      style={{ zIndex: -1 }}
                    />
                  )}

                  {/* Inactive Tab Pill Background with frosted glass and clear visibility */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-full bg-[#EDF5FD] border border-blue-200/70 shadow-xs transition-all duration-200 group-hover:bg-white group-hover:border-blue-300 -z-10" />
                  )}

                  {/* Tab Icon */}
                  <Icon
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isActive
                        ? 'text-white scale-110'
                        : 'text-slate-500 group-hover:text-blue-600 group-hover:scale-110'
                    }`}
                  />

                  {/* Tab Label */}
                  <span className="relative z-10 tracking-wide">{sec.label}</span>

                  {/* Active Pulse Glow Dot */}
                  {isActive && (
                    <span className="relative flex h-2 w-2 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_6px_#fff]" />
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Right Gradient Fade Mask */}
          <div className="pointer-events-none absolute right-0 lg:right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10" />

          {/* Right Arrow Button (Desktop) */}
          <button
            onClick={() => scrollNav('right')}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-blue-200/80 shadow-xs transition-all shrink-0 cursor-pointer active:scale-95 z-20"
            title="Scroll tabs right"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-16">
        {/* HERO SECTION */}
        <section id="overview" className="relative glass-card p-8 md:p-12 overflow-hidden border-blue-100 shadow-[0_12px_36px_rgba(30,100,200,0.07)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-cyan-200/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> Educational Guide & Knowledge Hub
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Understand Heat Risk.{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-500 to-red-500">
                Stay Ahead of the Heat.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              Learn how THERMOS turns complex environmental data into clear, life-saving heat-health warnings for citizens, outdoor workers, healthcare staff, and disaster officials.
            </p>

            {/* Visual Flow Diagram */}
            <div className="pt-6 pb-4">
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-4">THERMOS System Data Flow:</p>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs font-medium">
                <div className="p-3 rounded-2xl bg-[#EDF5FD] border border-blue-100/80 flex flex-col items-center justify-center text-slate-800">
                  <Thermometer className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="font-bold">Weather Data</span>
                </div>
                <div className="hidden md:flex items-center justify-center text-slate-400">➔</div>
                <div className="glass-card p-3 rounded-lg border-yellow-500/30 flex flex-col items-center justify-center">
                  <Droplets className="w-5 h-5 text-yellow-400 mb-1" />
                  <span>Heat Indices</span>
                </div>
                <div className="hidden md:flex items-center justify-center text-gray-500">➔</div>
                <div className="glass-card p-3 rounded-lg border-purple-500/30 flex flex-col items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400 mb-1" />
                  <span>Vulnerability</span>
                </div>
                <div className="hidden md:flex items-center justify-center text-gray-500">➔</div>
                <div className="glass-card p-3 rounded-lg border-red-500/40 bg-red-950/20 flex flex-col items-center justify-center col-span-2 md:col-span-1">
                  <Activity className="w-5 h-5 text-red-500 mb-1" />
                  <span className="font-bold text-white">THERMOS Engine</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => scrollTo('what-is-thermosafe')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-full shadow-lg shadow-orange-500/25 transition-all transform hover:scale-105"
              >
                Start Learning <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* WHAT IS THERMOS? */}
        <section id="what-is-thermosafe" className="space-y-6">
          <div className="border-l-4 border-accent pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">What is THERMOS?</h2>
            <p className="text-gray-400 text-sm mt-1">Thermal Health Risk & Early-warning Management System</p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6">
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              <strong className="text-white">THERMOS</strong> is a biometeorological thermal-health early-warning system designed to identify extreme heat threats <span className="text-accent font-semibold">before they turn into life-threatening emergencies</span>.
            </p>

            <div className="p-4 bg-orange-950/30 border border-orange-500/30 rounded-xl flex items-start gap-3">
              <Info className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Important Distinction</h4>
                <p className="text-sm text-gray-300 mt-1">
                  THERMOS is <strong>NOT</strong> simply a basic weather app or temperature gauge. High temperature alone does not tell the complete story of how heat strain impacts the human body.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="glass-card p-5 border-emerald-500/30 bg-emerald-950/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-emerald-400">Location A: Dry Heat</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded">Lower Strain</span>
                </div>
                <div className="text-3xl font-extrabold text-white mb-2">35°C <span className="text-sm font-normal text-gray-400">+ 20% Humidity</span></div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Low moisture in the air allows sweat to evaporate quickly. Your body can cool itself efficiently through natural evaporation.
                </p>
              </div>

              <div className="glass-card p-5 border-red-500/30 bg-red-950/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-red-400">Location B: Humid Heat</h4>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs font-bold rounded">High Strain</span>
                </div>
                <div className="text-3xl font-extrabold text-white mb-2">35°C <span className="text-sm font-normal text-gray-400">+ 80% Humidity</span></div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Air is saturated with moisture. Sweat cannot evaporate, trapping heat inside your organs and driving up core body temperature rapidly!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY TEMPERATURE ALONE IS NOT ENOUGH */}
        <section id="why-temp-not-enough" className="space-y-6">
          <div className="border-l-4 border-orange-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Why Temperature Alone Can Mislead You</h2>
            <p className="text-gray-400 text-sm mt-1">Two places with identical temperatures can have completely different health risks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">Scenario A (Desert Heat)</div>
                <h3 className="text-xl font-bold text-white mb-2">35°C Air Temp + Low Humidity</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  In dry conditions, sweat evaporates off your skin fast. Even though it feels hot, your body’s built-in cooling system works as designed.
                </p>
              </div>
              <div className="p-3 bg-dark-700/80 rounded-lg text-xs text-emerald-400 font-medium">
                ✅ Body Heat Loss: Efficient
              </div>
            </div>

            <div className="glass-card p-6 border-red-500/30 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">Scenario B (Coastal / Subtropical)</div>
                <h3 className="text-xl font-bold text-white mb-2">35°C Air Temp + High Humidity</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  Moist air acts like an invisible thermal blanket. Sweat rolls off without evaporating, causing rapid heat exhaustion, dizziness, and heat stroke risk.
                </p>
              </div>
              <div className="p-3 bg-red-950/40 rounded-lg text-xs text-red-400 font-medium">
                ⚠️ Body Heat Loss: Severely Restricted
              </div>
            </div>
          </div>
        </section>

        {/* WHAT DATA DOES THERMOS USE? */}
        <section id="data" className="space-y-6">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">What Data Does THERMOS Look At?</h2>
            <p className="text-gray-400 text-sm mt-1">The 6 key environmental and human factors evaluated by the risk engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Thermometer,
                color: 'text-orange-400',
                title: '🌡️ Air Temperature',
                meaning: 'How hot the surrounding air is.',
                why: 'Higher air temperatures increase heat absorption by human skin.',
                example: 'A sunny afternoon reading of 40°C in Delhi.',
              },
              {
                icon: Droplets,
                color: 'text-blue-400',
                title: '💧 Relative Humidity',
                meaning: 'The percentage of moisture held in the air.',
                why: 'High humidity stops sweat from evaporating and cooling the body.',
                example: '75% humidity in coastal Mumbai making 34°C feel like 44°C.',
              },
              {
                icon: Wind,
                color: 'text-emerald-400',
                title: '💨 Wind Speed',
                meaning: 'The speed of air moving around your body.',
                why: 'Breezes speed up sweat evaporation and pull heat away from skin.',
                example: 'A 15 km/h sea breeze reducing thermal discomfort.',
              },
              {
                icon: Sun,
                color: 'text-yellow-400',
                title: '☀️ Solar Radiation',
                meaning: 'Direct heat energy radiated down from the sun.',
                why: 'Direct sunlight bakes clothing and skin, adding up to 10°C of extra load.',
                example: 'Working in unshaded open construction sites at noon.',
              },
              {
                icon: Clock,
                color: 'text-purple-400',
                title: '⏱️ Exposure Duration',
                meaning: 'Continuous time spent in hot environmental conditions.',
                why: 'Prolonged exposure gradually drains body fluids and overworks the heart.',
                example: 'Laborers working 4 straight hours without shade breaks.',
              },
              {
                icon: Users,
                color: 'text-red-400',
                title: '👥 Vulnerability Factors',
                meaning: 'Age, poverty, medical conditions & outdoor job ratio.',
                why: 'Elderly citizens & impoverished communities suffer worse health impacts.',
                example: 'Densely populated urban slums with limited AC and fan access.',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="glass-card p-6 flex flex-col justify-between hover:-translate-y-1 transition-all">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-dark-700 rounded-xl">
                        <Icon className={`w-6 h-6 ${card.color}`} />
                      </div>
                      <h3 className="font-bold text-white text-lg">{card.title}</h3>
                    </div>

                    <div className="space-y-3 text-xs text-gray-300">
                      <div>
                        <span className="font-semibold text-gray-400 block">What it means:</span>
                        {card.meaning}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-400 block">Why THERMOS uses it:</span>
                        {card.why}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dark-600 text-xs text-gray-400 italic">
                    💡 Example: {card.example}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* WBGT EXPLAINED */}
        <section id="wbgt" className="space-y-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">What is WBGT?</h2>
            <p className="text-gray-400 text-sm mt-1">Wet Bulb Globe Temperature — The gold standard for occupational heat stress</p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-dark-600 pb-6">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">Full Name</span>
                <h3 className="text-2xl font-bold text-white">Wet Bulb Globe Temperature (WBGT)</h3>
              </div>
              <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold">
                Used Worldwide by Sports Federations & Military
              </div>
            </div>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              <strong>WBGT</strong> is a specialized heat-stress measurement designed to estimate how stressful an environment is for the human body, <span className="text-white font-semibold">especially during physical exertion or outdoor labor</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs">
              <div className="p-3 bg-dark-700/60 rounded-xl border border-dark-600">
                <span className="block font-bold text-white mb-1">Air Temperature</span>
                <span className="text-gray-400">Ambient heat level</span>
              </div>
              <div className="p-3 bg-dark-700/60 rounded-xl border border-dark-600">
                <span className="block font-bold text-white mb-1">Humidity</span>
                <span className="text-gray-400">Wet bulb moisture effect</span>
              </div>
              <div className="p-3 bg-dark-700/60 rounded-xl border border-dark-600">
                <span className="block font-bold text-white mb-1">Radiant Heat</span>
                <span className="text-gray-400">Direct solar radiation</span>
              </div>
              <div className="p-3 bg-dark-700/60 rounded-xl border border-dark-600">
                <span className="block font-bold text-white mb-1">Wind Speed</span>
                <span className="text-gray-400">Air movement cooling</span>
              </div>
            </div>

            <div className="p-4 bg-dark-800 rounded-xl border border-dark-600">
              <h4 className="font-bold text-white text-sm mb-2">⚡ Practical Real-World Example</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Air Temperature is <strong>35°C</strong>, but humidity is high, sunlight is direct, and a laborer is digging soil. Although the thermometer says 35°C, the body experiences a <strong>WBGT of 33°C</strong> — which triggers immediate physical danger thresholds requiring work stoppage!
              </p>
            </div>

            <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-3 text-xs text-red-200">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <strong>Remember:</strong> WBGT is about physical heat strain on the human body during exertion — NOT just how hot the air feels while sitting still.
              </div>
            </div>
          </div>
        </section>

        {/* HEAT INDEX EXPLAINED */}
        <section id="heat-index" className="space-y-6">
          <div className="border-l-4 border-orange-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">What is Heat Index?</h2>
            <p className="text-gray-400 text-sm mt-1">The classic NOAA "Feels-Like" temperature metric</p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6">
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              <strong>Heat Index</strong> estimates how hot the surrounding air feels to the human body when air temperature and relative humidity are combined.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-4 text-center text-sm font-bold">
              <div className="px-5 py-3 bg-dark-700 rounded-xl text-orange-400 border border-dark-600">
                Air Temperature (36°C)
              </div>
              <span className="text-xl text-gray-500">+</span>
              <div className="px-5 py-3 bg-dark-700 rounded-xl text-blue-400 border border-dark-600">
                Humidity (65%)
              </div>
              <span className="text-xl text-gray-500">➔</span>
              <div className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl shadow-lg">
                Heat Index: 48°C ("Feels Like")
              </div>
            </div>

            <div className="text-xs text-gray-300 space-y-2">
              <h4 className="font-bold text-white text-sm">Why THERMOS uses Heat Index:</h4>
              <p>
                Heat Index provides an intuitive, easy-to-understand metric for the general public to quickly gauge how dangerous outdoor conditions will feel during daily errands or travel.
              </p>
            </div>
          </div>
        </section>

        {/* HUMIDEX EXPLAINED */}
        <section id="humidex" className="space-y-6">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">What is Humidex?</h2>
            <p className="text-gray-400 text-sm mt-1">Canadian thermal discomfort indicator</p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6">
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              <strong>Humidex</strong> is a heat-stress index developed by Canadian meteorologists that combines air temperature and humidity into a single number representing perceived thermal discomfort.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-300 border border-dark-600 rounded-xl overflow-hidden">
                <thead className="bg-dark-800 text-gray-400 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3 border-b border-dark-600">Metric</th>
                    <th className="px-4 py-3 border-b border-dark-600">Main Focus</th>
                    <th className="px-4 py-3 border-b border-dark-600">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 font-bold text-white">Air Temperature</td>
                    <td className="px-4 py-3">Actual ambient air temperature</td>
                    <td className="px-4 py-3">General weather reporting</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 font-bold text-orange-400">Heat Index</td>
                    <td className="px-4 py-3">Perceived "feels-like" temperature</td>
                    <td className="px-4 py-3">General public awareness</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 font-bold text-yellow-400">Humidex</td>
                    <td className="px-4 py-3">Perceived thermal discomfort scale</td>
                    <td className="px-4 py-3">Indoor & outdoor comfort tracking</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 font-bold text-red-400">WBGT</td>
                    <td className="px-4 py-3">Physical heat strain considering solar & wind</td>
                    <td className="px-4 py-3">Outdoor work & athletic safety</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* WBGT vs HEAT INDEX vs HUMIDEX COMPARISON */}
        <section id="comparison" className="space-y-6">
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Which Heat Index Does What?</h2>
            <p className="text-gray-400 text-sm mt-1">Comparing the primary heat metrics used inside the THERMOS risk engine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 border-red-500/30 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">WBGT</span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Occupational Strain</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Best for workers, athletes, and military operating outdoors in direct sunlight.
                </p>
              </div>
              <div className="text-xs font-semibold text-red-400">
                Key Factors: Temp + Humidity + Sun + Wind
              </div>
            </div>

            <div className="glass-card p-6 border-orange-500/30 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full">Heat Index</span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Public Feels-Like</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Best for everyday citizens to understand how hot shade or indoor spaces feel.
                </p>
              </div>
              <div className="text-xs font-semibold text-orange-400">
                Key Factors: Temp + Humidity
              </div>
            </div>

            <div className="glass-card p-6 border-yellow-500/30 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">UTCI</span>
                <h3 className="text-xl font-bold text-white mt-3 mb-2">Universal Climate</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  Best for comprehensive physiological heat exchange calculations.
                </p>
              </div>
              <div className="text-xs font-semibold text-yellow-400">
                Key Factors: Full Biometeorology Profile
              </div>
            </div>
          </div>

          <div className="p-4 bg-dark-800 border border-dark-600 rounded-xl text-xs text-gray-300 text-center font-medium">
            💡 <strong>Why THERMOS uses multiple indicators:</strong> No single metric captures every health risk scenario. Combining WBGT, HI, and UTCI ensures 100% accurate risk coverage for both resting citizens and active outdoor workers.
          </div>
        </section>

        {/* 0-100 RISK SCORE */}
        <section id="risk-score" className="space-y-6">
          <div className="border-l-4 border-red-500 pl-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white">What Does the 0–100 Risk Score Mean?</h2>
            <p className="text-gray-400 text-sm mt-1">The actual Human Thermal Stress Score (HTSS) thresholds implemented in THERMOS</p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-8">
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                <span>0 (Safe)</span>
                <span>30</span>
                <span>60</span>
                <span>75</span>
                <span>85</span>
                <span>100 (Extreme Danger)</span>
              </div>
              <div className="h-6 w-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 via-red-500 to-purple-600 shadow-inner" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="px-2 py-0.5 bg-emerald-500 text-dark-900 font-extrabold text-xs rounded">0 - 30</span>
                <h4 className="font-bold text-emerald-400 text-base mt-2">Safe</h4>
                <p className="text-xs text-gray-300 mt-1">Normal summer weather. Little to no heat stress.</p>
                <div className="mt-3 text-[11px] text-gray-400 border-t border-emerald-500/20 pt-2">
                  Action: Maintain normal hydration.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-950/20">
                <span className="px-2 py-0.5 bg-yellow-500 text-dark-900 font-extrabold text-xs rounded">31 - 60</span>
                <h4 className="font-bold text-yellow-400 text-base mt-2">Low Risk</h4>
                <p className="text-xs text-gray-300 mt-1">Elevated thermal discomfort for sensitive individuals.</p>
                <div className="mt-3 text-[11px] text-gray-400 border-t border-yellow-500/20 pt-2">
                  Action: Keep water handy during walks.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-950/20">
                <span className="px-2 py-0.5 bg-orange-500 text-dark-900 font-extrabold text-xs rounded">61 - 75</span>
                <h4 className="font-bold text-orange-400 text-base mt-2">Moderate Risk</h4>
                <p className="text-xs text-gray-300 mt-1">Heat fatigue & cramps possible during long exposure.</p>
                <div className="mt-3 text-[11px] text-gray-400 border-t border-orange-500/20 pt-2">
                  Action: Take frequent breaks in shade.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20">
                <span className="px-2 py-0.5 bg-red-500 text-white font-extrabold text-xs rounded">76 - 85</span>
                <h4 className="font-bold text-red-400 text-base mt-2">High Risk</h4>
                <p className="text-xs text-gray-300 mt-1">Heat stroke probable with continued physical exertion.</p>
                <div className="mt-3 text-[11px] text-gray-400 border-t border-red-500/20 pt-2">
                  Action: Avoid sun between 11 AM - 4 PM.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-purple-500/50 bg-purple-950/30 flex items-center justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 bg-purple-600 text-white font-extrabold text-xs rounded">86 - 100</span>
                <h4 className="font-bold text-purple-300 text-lg mt-1">Extreme Risk (CRITICAL ALERT)</h4>
                <p className="text-xs text-gray-300">Life-threatening heatwave emergency. High incidence of heat stroke.</p>
              </div>
              <div className="text-right text-xs text-purple-300 font-semibold flex-shrink-0">
                🚨 Mandatory Outdoor Work Stoppage
              </div>
            </div>
          </div>
        </section>



        {/* DISTRICT-LEVEL HEAT RISK SYSTEM SECTION */}
        <section id="district-risk" className="space-y-8">
          <div className="border-l-4 border-accent pl-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Why District-Level Heat Risk?
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
              Heat risk is not uniform across a state or country. THERMOS identifies risk at the local district and city level so that disaster management and relief actions can be targeted where they are needed most.
            </p>
          </div>

          {/* VISUAL STORY FLOW BANNER */}
          <div className="glass-card p-6 border-accent/30 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800">
            <p className="text-xs font-extrabold uppercase text-accent tracking-wider mb-4 text-center">
              Visual System Story Flow: From State to Targeted Action
            </p>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs font-semibold">
              <div className="p-3 bg-dark-700/80 rounded-xl border border-dark-600 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">🏢</span>
                <span>STATE</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-gray-500">➔</div>
              <div className="p-3 bg-dark-700/80 rounded-xl border border-dark-600 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">🗺️</span>
                <span>DISTRICT TELEMETRY</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-gray-500">➔</div>
              <div className="p-3 bg-dark-700/80 rounded-xl border border-dark-600 flex flex-col items-center justify-center">
                <span className="text-lg mb-1">🌡️</span>
                <span>ENVIRONMENTAL DATA</span>
              </div>
              <div className="hidden md:flex items-center justify-center text-gray-500">➔</div>
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl col-span-2 md:col-span-1 shadow-lg flex flex-col items-center justify-center">
                <span className="text-lg mb-1">🚨</span>
                <span>TARGETED ACTION</span>
              </div>
            </div>
          </div>

          {/* INDIA GEOGRAPHIC LOCATION HIERARCHY */}
          <div className="glass-card p-6 md:p-8 space-y-6 border-blue-500/30">
            <div className="border-l-4 border-blue-400 pl-3">
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                🇮🇳 India-Wide Location Hierarchy
              </h3>
              <p className="text-xs text-gray-400">National to District-level multi-scale disaster risk mapping</p>
            </div>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              THERMOS organizes thermal-health information geographically, allowing users and decision-makers to move from a broad national or state overview toward localized district and city risk telemetry.
            </p>

            <div className="p-5 bg-dark-800 rounded-xl border border-dark-600 space-y-3 text-xs text-center font-bold">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl text-blue-300 w-full">
                  🇮🇳 INDIA
                  <span className="block text-[10px] font-normal text-gray-400">National Monitoring</span>
                </div>
                <span className="text-gray-500 font-mono">➔</span>
                <div className="p-3 bg-yellow-950/40 border border-yellow-500/40 rounded-xl text-yellow-300 w-full">
                  STATE / UT
                  <span className="block text-[10px] font-normal text-gray-400">28 States & 8 UTs</span>
                </div>
                <span className="text-gray-500 font-mono">➔</span>
                <div className="p-3 bg-orange-950/40 border border-orange-500/40 rounded-xl text-orange-300 w-full">
                  DISTRICT / CITY
                  <span className="block text-[10px] font-normal text-gray-400">788+ Districts</span>
                </div>
                <span className="text-gray-500 font-mono">➔</span>
                <div className="p-3 bg-accent text-white rounded-xl shadow-lg w-full">
                  HTSS RISK SCORE
                  <span className="block text-[10px] font-normal text-white/80">0–100 Biometeorology</span>
                </div>
              </div>
            </div>
          </div>

          {/* 1. WHAT IS DISTRICT-LEVEL RISK? */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-accent" /> 1. What is District-Level Heat Risk?
            </h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              A district is the primary operational administrative unit for public health infrastructure, district disaster management authorities (DDMA), and municipal emergency services across India.
            </p>

            <div className="p-6 bg-dark-800/90 rounded-xl border border-dark-600 text-center space-y-4">
              <div className="inline-block px-6 py-2 bg-accent/20 border border-accent/40 text-accent font-extrabold text-sm rounded-full">
                STATE
              </div>
              <div className="text-gray-500 text-lg">↓</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold">
                <div className="p-3 bg-dark-700 rounded-lg border border-dark-600 text-white">Karur</div>
                <div className="p-3 bg-dark-700 rounded-lg border border-dark-600 text-white">Chennai</div>
                <div className="p-3 bg-dark-700 rounded-lg border border-dark-600 text-white">Coimbatore</div>
                <div className="p-3 bg-dark-700 rounded-lg border border-dark-600 text-white">Madurai</div>
              </div>
              <div className="text-gray-500 text-lg">↓</div>
              <p className="text-xs text-gray-300 font-medium italic">
                Each district experiences distinct microclimates, topographical elevations, and solar exposure.
              </p>
            </div>
          </div>

          {/* 2. WHY DOES THERMOS USE DISTRICT-LEVEL GRANULARITY? */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-orange-400" /> 2. Why Does THERMOS Use District Granularity?
            </h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              A single temperature value for an entire state hides critical regional microclimate differences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-5 border-red-500/30 bg-red-950/20 space-y-3">
                <h4 className="font-bold text-red-400 text-base">District A (Inland Plain Heat Trap)</h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4">
                  <li>Higher dry-bulb temperatures</li>
                  <li>Intense direct solar radiation</li>
                  <li>Dry winds & low cloud cover</li>
                  <li>Elevated heat storage in soil and asphalt</li>
                </ul>
                <div className="p-2 bg-red-900/40 rounded text-xs font-bold text-red-300 text-center">
                  ⚠️ Severe Heat Stress Risk
                </div>
              </div>

              <div className="glass-card p-5 border-emerald-500/30 bg-emerald-950/20 space-y-3">
                <h4 className="font-bold text-emerald-400 text-base">District B (High Elevation or Coastal Breeze)</h4>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4">
                  <li>Lower baseline temperatures or moderating sea breeze</li>
                  <li>Higher vegetative tree cover</li>
                  <li>Active wind ventilation</li>
                  <li>Lower physiological thermal strain</li>
                </ul>
                <div className="p-2 bg-emerald-900/40 rounded text-xs font-bold text-emerald-300 text-center">
                  ✅ Lower Heat Stress Risk
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold pt-2">
              <div className="p-4 bg-dark-800 rounded-xl border border-red-500/40 text-red-400 flex items-center justify-between">
                <span>STATE-WIDE RISK</span>
                <span>❌ One generic value for everyone</span>
              </div>
              <div className="p-4 bg-dark-800 rounded-xl border border-emerald-500/40 text-emerald-400 flex items-center justify-between">
                <span>DISTRICT-LEVEL RISK</span>
                <span>✅ Localized risk for distinct geographical zones</span>
              </div>
            </div>
          </div>

          {/* 3. HOW THERMOS CALCULATES DISTRICT-LEVEL RISK */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-6 h-6 text-yellow-400" /> 3. How THERMOS Calculates District-Level Risk
            </h3>

            <div className="p-6 bg-dark-800/90 rounded-xl border border-dark-600 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs font-semibold">
                <div className="p-3 bg-dark-700 rounded-lg text-blue-400 border border-dark-600">
                  Environmental Telemetry
                </div>
                <div className="p-3 bg-dark-700 rounded-lg text-yellow-400 border border-dark-600">
                  District Coordinates
                </div>
                <div className="p-3 bg-dark-700 rounded-lg text-orange-400 border border-dark-600">
                  Heat Stress Indices (WBGT, HI, UTCI)
                </div>
                <div className="p-3 bg-dark-700 rounded-lg text-purple-400 border border-dark-600">
                  THERMOS Risk Engine
                </div>
                <div className="p-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-bold shadow-lg">
                  District Risk Score (0–100)
                </div>
              </div>
            </div>

            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              THERMOS processes real-time environmental telemetry for specific geographic coordinates and converts it into a localized biometeorological heat-health risk score.
            </p>
          </div>

          {/* 4. DISTRICT RISK SCORE DISPLAY */}
          <div className="glass-card p-6 md:p-8 space-y-6 border-red-500/30">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Flame className="w-6 h-6 text-red-500" /> 4. District Risk Score Example
            </h3>

            <div className="p-6 bg-dark-800 rounded-xl border border-red-500/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Sample District Output</span>
                <h4 className="text-2xl font-extrabold text-white">KARUR DISTRICT</h4>
                <p className="text-xs text-gray-300 mt-1">Inland central basin, Tamil Nadu</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold block">Risk Score</span>
                  <span className="text-3xl font-black text-red-500">78 / 100</span>
                </div>
                <span className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-black rounded-lg uppercase">
                  HIGH
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
              The score represents the estimated thermal-health risk for that district under current meteorological conditions, calculated using the standard THERMOS threshold ranges.
            </p>
          </div>

          {/* 5. WHY ONE DISTRICT CAN BE DIFFERENT FROM ANOTHER */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white">5. Why One District Can Be Different From Another</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-5 bg-red-950/20 border border-red-500/40 rounded-xl space-y-3">
                <h4 className="font-bold text-red-400 text-base">DISTRICT A (Inland Valley)</h4>
                <div className="space-y-1.5 text-gray-300">
                  <p>🌡️ Higher temperature (39°C)</p>
                  <p>💧 High humidity (65%)</p>
                  <p>☀️ Strong solar exposure (850 W/m²)</p>
                  <p>💨 Low wind speed (5 km/h)</p>
                  <p>⏱️ High exposure duration</p>
                </div>
                <div className="pt-2 font-extrabold text-red-400 text-sm border-t border-red-500/20">
                  ➔ Higher Thermal Risk (HTSS: 82)
                </div>
              </div>

              <div className="p-5 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                <h4 className="font-bold text-emerald-400 text-base">DISTRICT B (Coastal / Hill)</h4>
                <div className="space-y-1.5 text-gray-300">
                  <p>🌡️ Lower temperature (34°C)</p>
                  <p>💧 Moderate humidity (45%)</p>
                  <p>🌳 High vegetative tree cover</p>
                  <p>💨 Better airflow (18 km/h)</p>
                  <p>⏱️ Lower exposure duration</p>
                </div>
                <div className="pt-2 font-extrabold text-emerald-400 text-sm border-t border-emerald-500/20">
                  ➔ Lower Thermal Risk (HTSS: 38)
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 italic">
              Note: The above values serve as illustrative comparisons explaining environmental divergence across regional sectors.
            </p>
          </div>

          {/* 6. GIS MAP EXPLANATION */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-400" /> 6. See Heat Risk on the Map
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              THERMOS uses a geographic map to show the heat-health risk of different districts in real time.
            </p>

            <div className="p-6 bg-dark-800 rounded-xl border border-dark-600 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
                Regional District Telemetry Map
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex justify-between items-center text-emerald-300">
                  <div>
                    <span className="block text-white font-extrabold text-sm">District 01</span>
                    <span className="text-[10px] text-gray-400">Score: 28</span>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500 text-dark-900 rounded text-[10px] uppercase font-black">LOW</span>
                </div>

                <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl flex justify-between items-center text-red-300">
                  <div>
                    <span className="block text-white font-extrabold text-sm">District 02</span>
                    <span className="text-[10px] text-gray-400">Score: 78</span>
                  </div>
                  <span className="px-2 py-1 bg-red-500 text-white rounded text-[10px] uppercase font-black">HIGH</span>
                </div>

                <div className="p-4 bg-orange-950/40 border border-orange-500/40 rounded-xl flex justify-between items-center text-orange-300">
                  <div>
                    <span className="block text-white font-extrabold text-sm">District 03</span>
                    <span className="text-[10px] text-gray-400">Score: 65</span>
                  </div>
                  <span className="px-2 py-1 bg-orange-500 text-dark-900 rounded text-[10px] uppercase font-black">MODERATE</span>
                </div>

                <div className="p-4 bg-purple-950/40 border border-purple-500/40 rounded-xl flex justify-between items-center text-purple-300">
                  <div>
                    <span className="block text-white font-extrabold text-sm">District 04</span>
                    <span className="text-[10px] text-gray-400">Score: 92</span>
                  </div>
                  <span className="px-2 py-1 bg-purple-600 text-white rounded text-[10px] uppercase font-black">EXTREME</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7. WHAT CAN AUTHORITIES DO WITH DISTRICT-LEVEL DATA? */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-accent" /> 7. What Can Authorities Do With District-Level Data?
            </h3>

            <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 text-xs text-gray-300 space-y-2">
              <div className="text-red-400 font-bold">Instead of broad state-wide statements:</div>
              <p className="italic text-gray-400">"Entire state is under generic heat advisory."</p>
              <div className="text-emerald-400 font-bold pt-2">THERMOS provides pinpoint actionable intelligence:</div>
              <p className="font-semibold text-white">"District 04 has a significantly higher heat-health risk than neighboring areas."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {[
                { title: '💧 Water Distribution', desc: 'Deploy water tankers directly to high-risk district hubs.' },
                { title: '🏥 Medical Preparedness', desc: 'Stock IV fluids & cooling packs in local district hospitals.' },
                { title: '❄️ Cooling Centres', desc: 'Open public air-conditioned facilities in vulnerable sectors.' },
                { title: '👷 Worker Protection', desc: 'Adjust outdoor construction hours for high-risk zones.' },
                { title: '📢 Public Warnings', desc: 'Broadcast targeted alerts across district radio and SMS.' },
                { title: '🚑 Emergency Response', desc: 'Station ambulances near heat-stroke vulnerable intersections.' },
                { title: '📱 Location Alerts', desc: 'Send targeted push advisories to local district residents.' },
                { title: '🤝 Vulnerable Check-ins', desc: 'Mobilize ASHA workers to check on elders and outdoor workers.' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-dark-700/60 rounded-xl border border-dark-600">
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-gray-300 text-[11px] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 italic">
              Note: THERMOS supports government decision-making; it does not automatically replace human municipal authorities or medical professionals.
            </p>
          </div>

          {/* 8. EXAMPLE SCENARIO */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white">8. Example Scenario</h3>
            <p className="text-gray-200 text-sm">
              Imagine a state with multiple distinct districts operating simultaneously on a summer afternoon:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold text-center">
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300">
                Nilgiris ➔ LOW
              </div>
              <div className="p-3 bg-orange-950/30 border border-orange-500/30 rounded-xl text-orange-300">
                Coimbatore ➔ MODERATE
              </div>
              <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl text-red-300">
                Chennai ➔ HIGH
              </div>
              <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl text-purple-300">
                Karur ➔ EXTREME
              </div>
            </div>

            <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 text-xs text-gray-300 space-y-2">
              <p className="font-bold text-white">The entire state does NOT need to be treated identically.</p>
              <p className="text-gray-300">THERMOS answers four critical questions for disaster management:</p>
              <ul className="list-disc pl-4 space-y-1 text-accent font-semibold">
                <li>Where is the risk highest?</li>
                <li>Who may need immediate medical attention?</li>
                <li>Where should emergency cooling resources be prioritized?</li>
                <li>Which specific areas should receive early warnings?</li>
              </ul>
            </div>
          </div>

          {/* 9. DISTRICT -> PERSON CONNECTION */}
          <div className="glass-card p-6 md:p-8 space-y-6 border-purple-500/30">
            <h3 className="text-xl md:text-2xl font-bold text-white">9. District → Person Connection</h3>
            <p className="text-gray-200 text-sm">
              District-level risk acts as a bridge between environmental weather telemetry and individual citizens.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-center text-xs font-bold">
              <div className="p-2.5 bg-dark-700 rounded-lg text-blue-400 border border-dark-600 w-full">ENVIRONMENT</div>
              <span className="text-gray-500">➔</span>
              <div className="p-2.5 bg-dark-700 rounded-lg text-yellow-400 border border-dark-600 w-full">DISTRICT</div>
              <span className="text-gray-500">➔</span>
              <div className="p-2.5 bg-dark-700 rounded-lg text-orange-400 border border-dark-600 w-full">RISK SCORE</div>
              <span className="text-gray-500">➔</span>
              <div className="p-2.5 bg-dark-700 rounded-lg text-red-400 border border-dark-600 w-full">RECOMMENDATION</div>
              <span className="text-gray-500">➔</span>
              <div className="p-2.5 bg-accent text-white rounded-lg w-full shadow-lg">LOCAL ALERT</div>
            </div>

            <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 text-xs text-gray-300">
              <p className="font-bold text-white mb-1">Example Citizen Flow:</p>
              <p>
                A person located in <strong>Karur District</strong> (HIGH/EXTREME RISK) automatically receives targeted heat-safety advisories for their immediate locality.
              </p>
              <p className="mt-2 text-[11px] text-gray-400 italic">
                * Note: Location-based automated SMS broadcasting is currently a planned / future feature.
              </p>
            </div>
          </div>

          {/* 10. WHY DISTRICT LEVEL IS BETTER THAN ONLY STATE LEVEL */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-white">10. Why District Level is Better Than Only State Level</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-300 border border-dark-600 rounded-xl overflow-hidden">
                <thead className="bg-dark-800 text-gray-400 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3 border-b border-dark-600">State-Level Only</th>
                    <th className="px-4 py-3 border-b border-dark-600 text-accent">District-Level THERMOS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 text-red-400">One risk value for everyone</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">Localized risk per district microclimate</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 text-red-400">Broad, generic warnings</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">Targeted, actionable warnings</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 text-red-400">Same message everywhere</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">Area-specific safety protocols</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 text-red-400">Difficult to prioritize resources</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">Easier municipal and DDMA prioritization</td>
                  </tr>
                  <tr className="hover:bg-dark-700/50">
                    <td className="px-4 py-3 text-red-400">Low spatial detail</td>
                    <td className="px-4 py-3 text-emerald-400 font-bold">GIS-based spatial precision</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 11. IMPORTANT CLARIFICATION */}
          <div className="p-5 bg-orange-950/30 border border-orange-500/40 rounded-xl space-y-2">
            <h4 className="font-bold text-orange-400 text-sm flex items-center gap-2">
              <Info className="w-5 h-5" /> Important Clarification
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              District-level risk does <strong>NOT</strong> mean every person inside the district has exactly the same personal health risk.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Individual risk depends on personal factors like age, physical activity, exposure time, hydration, access to shade, and pre-existing medical conditions. The district score represents <strong>area-level environmental heat risk</strong>, not an individual medical diagnosis.
            </p>
          </div>
        </section>

        {/* 72-HOUR MULTI-HORIZON FORECASTS */}
        <section id="forecast" className="space-y-8">
          <div className="border-l-4 border-cyan-500 pl-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-cyan-400" /> 72-Hour Multi-Horizon Predictive Modeling
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
              Anticipating dangerous thermal stress hours and days in advance allows schools, hospitals, power utilities, and district disaster authorities to deploy life-saving countermeasures before the heat strikes.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6 border-cyan-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold rounded-lg">+24 Hours Horizon</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <h4 className="text-lg font-bold text-white">Immediate Tactical Prep</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  High-confidence hourly thermal prediction. Triggers mandatory shift adjustments for outdoor laborers and municipal water tanker dispatch.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 font-mono text-xs font-bold rounded-lg">+48 Hours Horizon</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <h4 className="text-lg font-bold text-white">Institutional Action</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Hospital emergency rooms pre-stock IV saline fluids, ice packs, and set up rapid-cooling beds for expected heatwave cases.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 font-mono text-xs font-bold rounded-lg">+72 Hours Horizon</span>
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <h4 className="text-lg font-bold text-white">Macro Strategic Warning</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  State and district disaster managers issue early public notices, coordinate power grids for peak AC usage, and mobilize NGO shade shelters.
                </p>
              </div>
            </div>

            <div className="p-5 bg-dark-800 rounded-xl border border-dark-600 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Ensemble Weather Science
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                THERMOS blends high-resolution global numerical weather prediction models (including ECMWF, NOAA GFS, and IMD NCMRWF) with local biometeorological physics engines to calculate true Human Thermal Stress (HTSS), not just dry ambient air temperature.
              </p>
            </div>
          </div>
        </section>

        {/* MULTI-TIER HEAT ALERT SYSTEM */}
        <section id="alerts" className="space-y-8">
          <div className="border-l-4 border-red-500 pl-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-red-400" /> Multi-Tier Early Warning & Alert System
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
              Standardized color-coded heat alert levels aligned with National Disaster Management Authority (NDMA) guidelines and IMD protocols for immediate public action.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6 border-red-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-emerald-500 text-dark-900 font-black text-xs rounded">GREEN</span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">0-30</span>
                </div>
                <h4 className="font-bold text-emerald-300 text-sm">Normal Conditions</h4>
                <p className="text-[11px] text-gray-300">No special alert. Regular hydration and daily outdoor activities are completely safe.</p>
              </div>

              <div className="p-4 rounded-xl border border-yellow-500/40 bg-yellow-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-yellow-500 text-dark-900 font-black text-xs rounded">YELLOW</span>
                  <span className="text-xs font-mono text-yellow-400 font-bold">31-60</span>
                </div>
                <h4 className="font-bold text-yellow-300 text-sm">Heat Watch</h4>
                <p className="text-[11px] text-gray-300">Moderate thermal discomfort. Sensitive individuals and elders should avoid extended sun exposure.</p>
              </div>

              <div className="p-4 rounded-xl border border-orange-500/40 bg-orange-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-orange-500 text-dark-900 font-black text-xs rounded">ORANGE</span>
                  <span className="text-xs font-mono text-orange-400 font-bold">61-75</span>
                </div>
                <h4 className="font-bold text-orange-300 text-sm">Heat Alert</h4>
                <p className="text-[11px] text-gray-300">Severe discomfort. High risk for outdoor laborers. Mandatory shaded rest breaks every hour.</p>
              </div>

              <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-red-500 text-white font-black text-xs rounded">RED</span>
                  <span className="text-xs font-mono text-red-400 font-bold">76-85</span>
                </div>
                <h4 className="font-bold text-red-300 text-sm">Severe Warning</h4>
                <p className="text-[11px] text-gray-300">High probability of heat stroke. No outdoor labor between 11:00 AM and 4:00 PM.</p>
              </div>

              <div className="p-4 rounded-xl border border-purple-500/50 bg-purple-950/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-purple-600 text-white font-black text-xs rounded">PURPLE</span>
                  <span className="text-xs font-mono text-purple-300 font-bold">86-100</span>
                </div>
                <h4 className="font-bold text-purple-300 text-sm">Emergency Alert</h4>
                <p className="text-[11px] text-gray-300">Critical disaster emergency. Complete shutdown of outdoor work, emergency cooling centers opened.</p>
              </div>
            </div>

            <div className="p-5 bg-dark-800 rounded-xl border border-dark-600 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm">🚨 Instant Communication Channels</span>
                <p className="text-gray-300">THERMOS alerts reach citizens via localized web telemetry, emergency banner notices, and SMS broadcasts.</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg font-bold">Real-time Push</span>
                <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg font-bold">GPS-Targeted</span>
              </div>
            </div>
          </div>
        </section>

        {/* DEMOGRAPHIC & OCCUPATIONAL VULNERABILITY */}
        <section id="vulnerability" className="space-y-8">
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" /> Demographic Vulnerability Profiles
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
              Heat affects people differently. THERMOS customizes risk calculations and safety advisories based on physiological vulnerability and occupational exposure.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6 border-purple-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-orange-950/20 border border-orange-500/30 space-y-3">
                <div className="text-2xl">👷</div>
                <h4 className="text-base font-bold text-white">Outdoor Laborers</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Construction, farm, and delivery workers generate internal metabolic heat while absorbing direct solar radiation. High risk of rapid heat exhaustion.
                </p>
                <div className="pt-2 border-t border-orange-500/20 text-[11px] font-bold text-orange-400">
                  Priority: 15-min hourly shaded rest & electrolyte replenishment
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-3">
                <div className="text-2xl">👵</div>
                <h4 className="text-base font-bold text-white">Elderly Citizens (65+)</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Age reduces natural sweat gland response and thirst sensitivity. Chronic hypertension, diabetes, and cardiovascular medications amplify risk.
                </p>
                <div className="pt-2 border-t border-blue-500/20 text-[11px] font-bold text-blue-400">
                  Priority: Keep indoor temperatures cool; drink water regularly
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-pink-950/20 border border-pink-500/30 space-y-3">
                <div className="text-2xl">🤰</div>
                <h4 className="text-base font-bold text-white">Mothers & Children</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Infants and pregnant women have higher metabolic rates and dehydrate much faster. Children produce more heat relative to body surface area.
                </p>
                <div className="pt-2 border-t border-pink-500/20 text-[11px] font-bold text-pink-400">
                  Priority: Strict indoor stay during peak daylight hours
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="text-2xl">🚶</div>
                <h4 className="text-base font-bold text-white">General Public</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Office workers, students, and commuters exposed to urban heat island effects during transit or outdoor errands.
                </p>
                <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-bold text-emerald-400">
                  Priority: Carry water bottles and wear breathable cottons
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SAFETY & ACTIONS */}
        <section id="safety" className="space-y-8">
          <div className="border-l-4 border-emerald-500 pl-4">
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" /> Heatwave Safety Guidelines & First Aid
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
              Proven clinical practices, hydration protocols, and emergency steps to safeguard yourself, your family, and your coworkers during high-heat periods.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 space-y-6 border-emerald-500/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <Droplets className="w-5 h-5" /> 1. Hydration Protocols
                </div>
                <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                  <li>Drink 250ml of water every 20 minutes even if not feeling thirsty.</li>
                  <li>Include ORS packets, coconut water, lemon juice, or buttermilk.</li>
                  <li>Avoid caffeinated beverages, alcohol, and high-sugar sodas that promote dehydration.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 space-y-3">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-base">
                  <Sun className="w-5 h-5" /> 2. Sun & Clothing Habits
                </div>
                <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                  <li>Avoid direct exposure during peak solar hours (11:00 AM – 4:00 PM).</li>
                  <li>Wear loose-fitting, light-colored, lightweight breathable cotton clothing.</li>
                  <li>Use wide-brim hats, sunglasses, and umbrellas when commuting outdoors.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-dark-800 border border-dark-600 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                  <Heart className="w-5 h-5" /> 3. Emergency First Aid (108/112)
                </div>
                <ul className="text-xs text-gray-300 space-y-2 list-disc pl-4">
                  <li><strong>Heat Exhaustion:</strong> Move to shade, apply wet cloths to neck & armpits, sip cool water.</li>
                  <li><strong>Heat Stroke (Emergency):</strong> Hot red skin, confusion, fainting. Call 108 immediately and cool body with ice packs/fans.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CALCULATOR SIMULATOR */}
        <section id="simulator" className="space-y-6">
          <div className="glass-card p-6 md:p-8 space-y-6 border-accent/40">
            <div className="flex items-center gap-3">
              <Sliders className="w-7 h-7 text-accent" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Live Thermal Stress Calculator</h3>
                <p className="text-xs text-gray-400">Adjust environmental sliders below to see how THERMOS calculates risk scores in real time</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                    <span>Air Temperature (°C)</span>
                    <span className="text-orange-400">{simTemp}°C</span>
                  </div>
                  <input
                    type="range" min="20" max="50" value={simTemp}
                    onChange={(e) => setSimTemp(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                    <span>Relative Humidity (%)</span>
                    <span className="text-blue-400">{simHumidity}%</span>
                  </div>
                  <input
                    type="range" min="10" max="95" value={simHumidity}
                    onChange={(e) => setSimHumidity(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                    <span>Wind Speed (km/h)</span>
                    <span className="text-emerald-400">{simWind} km/h</span>
                  </div>
                  <input
                    type="range" min="0" max="40" value={simWind}
                    onChange={(e) => setSimWind(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-300 mb-1">
                    <span>Solar Radiation (W/m²)</span>
                    <span className="text-yellow-400">{simSolar} W/m²</span>
                  </div>
                  <input
                    type="range" min="0" max="1100" step="50" value={simSolar}
                    onChange={(e) => setSimSolar(Number(e.target.value))}
                    className="w-full accent-yellow-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-6 bg-dark-800 rounded-2xl border border-dark-600 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-gray-400">Calculated Risk Score</span>
                    <span className="px-3 py-1 text-xs font-black rounded-lg uppercase" style={{ backgroundColor: `${simResult.riskColor}20`, color: simResult.riskColor, border: `1px solid ${simResult.riskColor}40` }}>
                      {simResult.riskCategory}
                    </span>
                  </div>

                  <div className="text-4xl font-black text-white flex items-baseline gap-2">
                    <span style={{ color: simResult.riskColor }}>{simResult.htssScore}</span>
                    <span className="text-base font-normal text-gray-400">/ 100</span>
                  </div>

                  <p className="text-xs text-gray-300">{simResult.riskDesc}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark-700 text-center text-xs">
                  <div className="p-2 bg-dark-700/50 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">Heat Index</span>
                    <span className="font-bold text-white">{simResult.hi}°C</span>
                  </div>
                  <div className="p-2 bg-dark-700/50 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">WBGT</span>
                    <span className="font-bold text-white">{simResult.wbgt}°C</span>
                  </div>
                  <div className="p-2 bg-dark-700/50 rounded-lg">
                    <span className="text-[10px] text-gray-400 block">UTCI</span>
                    <span className="font-bold text-white">{simResult.utci}°C</span>
                  </div>
                </div>

                <div className="p-3 bg-dark-700/70 rounded-xl text-xs border border-dark-600 text-gray-300">
                  <span className="font-bold text-white block mb-0.5">Recommendation:</span>
                  {simResult.recommendation}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section id="faq" className="space-y-6">
          <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-7 h-7 text-accent" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Frequently Asked Questions</h3>
                <p className="text-xs text-gray-400">Common questions about heat stress calculations and THERMOS</p>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-dark-600 rounded-xl overflow-hidden bg-dark-800/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-4 text-left font-bold text-white text-sm flex items-center justify-between hover:bg-dark-700/50 transition-all"
                  >
                    <span>{faq.q}</span>
                    {openFaq === index ? <ChevronUp className="w-4 h-4 text-accent" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  {openFaq === index && (
                    <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-dark-700/50 bg-dark-800/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GLOSSARY SECTION */}
        <section id="glossary" className="space-y-6">
          <div className="glass-card p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-7 h-7 text-accent" />
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">Thermal-Health Glossary</h3>
                  <p className="text-xs text-gray-400">Key terms and definitions used in THERMOS</p>
                </div>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search term..."
                  value={glossaryQuery}
                  onChange={(e) => setGlossaryQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map((item, idx) => (
                <div key={idx} className="p-4 bg-dark-800/60 border border-dark-600 rounded-xl space-y-1">
                  <h4 className="font-bold text-accent text-sm">{item.term}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.def}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL SIMPLE EXPLANATION & CTA */}
        <div className="glass-card p-6 md:p-8 border-accent/40 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-3xl">💡</span>
            <h4 className="text-xl font-bold text-white">Think of it this way:</h4>
            <p className="text-sm text-gray-200 leading-relaxed">
              India is vast with diverse microclimates. Heat conditions differ drastically across regions. THERMOS evaluates heat-related risk at the local district and city level, showing where the danger is highest. That makes heat warnings and resource planning targeted, actionable, and life-saving.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/map')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold rounded-full text-base shadow-xl shadow-orange-500/30 transition-all transform hover:scale-105"
            >
              Explore the Live Risk Map <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-accent text-white rounded-full shadow-2xl hover:bg-orange-600 transition-all z-50 transform hover:scale-110"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LearnPage;

