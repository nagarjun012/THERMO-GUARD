import React, { useState } from 'react';
import {
  X,
  Info,
  Shield,
  Flame,
  Activity,
  Droplets,
  Thermometer,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLocationName?: string;
}

export const MapEducationalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentLocationName = 'Delhi, India',
}) => {
  const [selectedLegendIndex, setSelectedLegendIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'basics' | 'htss' | 'layers' | 'guide'>('all');

  if (!isOpen) return null;

  // Exact HTSS scale & threshold definitions matching THERMOS codebase
  const legendItems = [
    {
      level: 'Safe',
      range: '0 – 30',
      color: '#10b981',
      meaning: 'Optimal thermal comfort with negligible biometeorological stress.',
      action: 'Stay hydrated and carry on normal daily outdoor activities.',
    },
    {
      level: 'Low',
      range: '31 – 60',
      color: '#eab308',
      meaning: 'Mild thermal discomfort for sensitive individuals.',
      action: 'Wear lightweight clothing, stay hydrated, and keep water handy.',
    },
    {
      level: 'Moderate',
      range: '61 – 75',
      color: '#f97316',
      meaning: 'Elevated thermal heat stress. Heat cramps and exhaustion possible.',
      action: 'Drink water regularly even if not thirsty. Take frequent shade breaks.',
    },
    {
      level: 'High',
      range: '76 – 85',
      color: '#ef4444',
      meaning: 'Severe thermal heat strain. High danger for vulnerable groups & outdoor workers.',
      action: 'Avoid direct sun between 11 AM - 4 PM. Mandatory 15-min rest every hour.',
    },
    {
      level: 'Extreme',
      range: '86 – 100',
      color: '#a855f7',
      meaning: 'Life-threatening biometeorological heat danger. High risk of heat stroke.',
      action: 'Mandatory outdoor work stoppage. Stay indoors with cooling/fans.',
    },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-dark-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-dark-900/95 border border-orange-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-gray-200">
        
        {/* HEADER BAR */}
        <div className="sticky top-0 z-20 bg-dark-800/95 backdrop-blur-md px-6 py-4 border-b border-dark-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/40 rounded-xl text-orange-400">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Understanding the THERMOS Heat Map
              </h2>
              <p className="text-xs text-gray-400">
                Interactive guide to reading hyper-local ward risk scores, layer filters, and biometeorological indicators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white transition-all border border-dark-600"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-NAV FILTER BUTTONS */}
        <div className="bg-dark-800/60 px-6 py-2 border-b border-dark-700/50 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: '📖 Full Walkthrough' },
            { id: 'basics', label: '🏘️ Ward & Hyper-Local' },
            { id: 'htss', label: '📊 HTSS & Calculation' },
            { id: 'layers', label: '🗺️ Map Markers & Layers' },
            { id: 'guide', label: '🚀 How to Read & Actions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                  : 'bg-dark-700/80 text-gray-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar text-sm">
          
          {/* SECTION 2: INTRODUCTION */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="glass-card p-6 border-orange-500/30 bg-gradient-to-r from-orange-950/20 via-dark-800 to-dark-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-orange-400 tracking-wider">
                <Sparkles className="w-4 h-4" /> 2. Introduction
              </div>
              <h3 className="text-xl font-bold text-white">Why Hyper-Local Heat Mapping Matters</h3>
              <p className="text-gray-200 leading-relaxed">
                This map shows how thermal-health risk varies across different local areas. Instead of treating an entire city as having the exact same heat risk, THERMOS provides hyper-local risk information to help identify areas that may need greater attention.
              </p>
              <div className="p-4 bg-dark-800/80 border border-dark-600 rounded-xl text-xs text-gray-300 leading-relaxed">
                💡 <strong>In Simple Words:</strong> Different parts of the same city can experience completely different levels of heat stress because environmental conditions, built-up concrete, shade trees, ventilation airflow, and population density vary from street to street.
              </div>
            </section>
          )}

          {/* SECTION 3: WHAT IS A WARD? */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="glass-card p-6 space-y-5">
              <div className="border-l-4 border-accent pl-3">
                <h3 className="text-lg font-bold text-white">3. What is a Ward?</h3>
                <p className="text-xs text-gray-400">Administrative sub-divisions inside a municipality</p>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                A <strong>ward</strong> is a smaller administrative area within a city or municipality. Cities break administration down into wards to deliver local public services effectively.
              </p>

              {/* Administrative Hierarchy Diagram */}
              <div className="p-5 bg-dark-800 rounded-xl border border-dark-600 text-center space-y-3">
                <div className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-extrabold text-xs">
                  CITY (e.g. {currentLocationName})
                </div>
                <div className="text-gray-500 text-xs font-mono">│</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                  <div className="p-2.5 bg-dark-700 rounded-lg border border-dark-600 text-gray-200">Ward 1</div>
                  <div className="p-2.5 bg-dark-700 rounded-lg border border-dark-600 text-gray-200">Ward 2</div>
                  <div className="p-2.5 bg-dark-700 rounded-lg border border-dark-600 text-gray-200">Ward 3</div>
                  <div className="p-2.5 bg-dark-700 rounded-lg border border-dark-600 text-gray-200">Ward 4</div>
                  <div className="p-2.5 bg-dark-700 rounded-lg border border-dark-600 text-gray-200">Ward 5</div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Instead of giving one single heat-risk number for the whole metropolis, THERMOS evaluates environmental factors at this smaller ward level.
              </p>
            </section>
          )}

          {/* SECTION 4: WHAT DOES "HYPER-LOCAL WARD GIS RISK" MEAN? */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="glass-card p-6 space-y-5 border-blue-500/30">
              <div className="border-l-4 border-blue-400 pl-3">
                <h3 className="text-lg font-bold text-white">4. What Does "Hyper-Local Ward GIS Risk" Mean?</h3>
                <p className="text-xs text-gray-400">Deconstructing the system name</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600">
                  <span className="font-extrabold text-blue-400 block text-sm mb-1">HYPER-LOCAL</span>
                  <p className="text-gray-300">Very detailed geographic information focused on smaller neighborhood areas.</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600">
                  <span className="font-extrabold text-yellow-400 block text-sm mb-1">WARD</span>
                  <p className="text-gray-300">A smaller administrative area within a city or municipal corporation.</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600">
                  <span className="font-extrabold text-emerald-400 block text-sm mb-1">GIS</span>
                  <p className="text-gray-300">Geographic Information System — mapping tech analyzing location data.</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600">
                  <span className="font-extrabold text-red-400 block text-sm mb-1">RISK</span>
                  <p className="text-gray-300">The estimated biometeorological health risk given live thermal conditions.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-950/30 border border-blue-500/30 rounded-xl text-xs text-gray-200 leading-relaxed font-medium">
                <strong>Combined Definition:</strong> "Hyper-Local Ward GIS Risk" means THERMOS displays heat-health risk at a detailed local geographic level instead of showing only one overall value for an entire city.
              </div>

              {/* Data Flow Pipeline */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs font-bold pt-2">
                <div className="p-2.5 bg-dark-700 rounded-lg text-blue-400 w-full border border-dark-600">CITY</div>
                <span className="text-gray-500">➔</span>
                <div className="p-2.5 bg-dark-700 rounded-lg text-yellow-400 w-full border border-dark-600">LOCAL WARDS</div>
                <span className="text-gray-500">➔</span>
                <div className="p-2.5 bg-dark-700 rounded-lg text-emerald-400 w-full border border-dark-600">ENVIRONMENTAL DATA</div>
                <span className="text-gray-500">➔</span>
                <div className="p-2.5 bg-dark-700 rounded-lg text-red-400 w-full border border-dark-600">THERMAL RISK</div>
                <span className="text-gray-500">➔</span>
                <div className="p-2.5 bg-orange-500 text-white rounded-lg w-full shadow-lg">GIS MAP</div>
              </div>
            </section>
          )}

          {/* SECTION 5: WHY NOT JUST SHOW CITY-WIDE TEMPERATURE? */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="glass-card p-6 space-y-5">
              <h3 className="text-lg font-bold text-white">5. Why Not Just Show City-Wide Temperature?</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl space-y-2">
                  <div className="font-extrabold text-red-400 uppercase tracking-wider text-[11px]">CITY-WIDE ONLY ❌</div>
                  <div className="p-3 bg-dark-800 rounded-lg text-gray-300 space-y-1">
                    <p className="font-bold text-white">Delhi</p>
                    <p>➔ One overall temperature reading (e.g. 40°C)</p>
                    <p>➔ One generic city warning</p>
                  </div>
                  <p className="text-gray-400 italic text-[11px]">Hides local differences like shade, greenery, and heavy traffic bakes.</p>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="font-extrabold text-emerald-400 uppercase tracking-wider text-[11px]">THERMOS HYPER-LOCAL ✅</div>
                  <div className="p-3 bg-dark-800 rounded-lg text-gray-300 space-y-1">
                    <p className="font-bold text-white">Delhi Wards</p>
                    <p>➔ Area A (Park Ward): Moderate Risk</p>
                    <p>➔ Area B (Market Ward): High Risk</p>
                    <p>➔ Area C (Industrial Ward): Extreme Risk</p>
                  </div>
                  <p className="text-emerald-400 font-semibold text-[11px]">THERMOS helps authorities & citizens identify exactly WHERE risk is higher.</p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6 & 11 & 12 & 13: MAP MARKERS & LAYERS */}
          {(activeTab === 'all' || activeTab === 'layers') && (
            <section className="glass-card p-6 space-y-6">
              <div className="border-l-4 border-yellow-500 pl-3">
                <h3 className="text-lg font-bold text-white">6. Map Markers & Layer Filters Explained</h3>
                <p className="text-xs text-gray-400">Understanding icons, circular risk markers, hospitals, and shelters</p>
              </div>

              <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 space-y-2 text-xs text-gray-300">
                <p className="font-bold text-white text-sm">📍 Circular Risk Markers:</p>
                <p>
                  The circular markers on the map represent localized thermal risk locations. Note: In THERMOS, marker <strong>COLOR</strong> represents the risk severity level (Green = Safe ➔ Purple = Extreme). Circle dimensions are clean 18px uniform indicators designed for crisp visibility on satellite maps.
                </p>
              </div>

              {/* Layer Filter Cards */}
              <div className="space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Layer Filter Options (11, 12, 13):</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-dark-800 rounded-xl border border-red-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                      <Flame className="w-5 h-5 text-red-500" /> 🔥 Risk Layer
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Displays thermal-health risk markers colored by HTSS score across monitored wards and cities.
                    </p>
                  </div>

                  <div className="p-4 bg-dark-800 rounded-xl border border-blue-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-400 text-sm">
                      <Activity className="w-5 h-5 text-blue-400" /> 🏥 Healthcare Locations
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Displays nearby hospitals, clinics, and emergency medical stations relative to high heat risk zones.
                    </p>
                    <div className="p-2 bg-dark-700/60 rounded text-[11px] text-gray-400 italic">
                      HIGH-RISK AREA + NEARBY HEALTHCARE ➔ Better situational awareness
                    </div>
                  </div>

                  <div className="p-4 bg-dark-800 rounded-xl border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                      <Shield className="w-5 h-5 text-emerald-400" /> 🛟 Support & Cooling Locations
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Displays municipal cooling centers, shaded rest hubs, and public water stations during severe heatwaves.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7, 8, 18: HTSS SCALE & INTERACTIVE LEGEND */}
          {(activeTab === 'all' || activeTab === 'htss') && (
            <section className="glass-card p-6 space-y-6 border-red-500/30">
              <div className="border-l-4 border-red-500 pl-3">
                <h3 className="text-lg font-bold text-white">7 & 8. What is HTSS? Risk Level Scale</h3>
                <p className="text-xs text-gray-400">Human Thermal Stress Score (0–100 Scale)</p>
              </div>

              <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
                <strong>HTSS</strong> stands for <strong>Human Thermal Stress Score</strong>. It converts heat-related environmental information (air temp, humidity, wind, solar radiation) into an easy-to-understand numerical risk score from <strong>0 (Lowest Risk)</strong> to <strong>100 (Highest Risk)</strong>.
              </p>

              {/* Interactive Legend (Click to view meaning & recommendation) */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Interactive Risk Scale (Click any level to view recommended actions):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {legendItems.map((item, index) => (
                    <button
                      key={item.level}
                      onClick={() => setSelectedLegendIndex(selectedLegendIndex === index ? null : index)}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        selectedLegendIndex === index
                          ? 'ring-2 ring-white scale-105 shadow-lg'
                          : 'opacity-90 hover:opacity-100'
                      }`}
                      style={{
                        backgroundColor: `${item.color}15`,
                        borderColor: `${item.color}50`,
                      }}
                    >
                      <div>
                        <span className="font-extrabold text-sm block" style={{ color: item.color }}>
                          {item.level}
                        </span>
                        <span className="text-[11px] text-gray-300 font-mono">HTSS {item.range}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-2 flex items-center justify-between">
                        Details {selectedLegendIndex === index ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Expanded Legend Detail Card */}
                {selectedLegendIndex !== null && (
                  <div
                    className="p-4 rounded-xl border text-xs space-y-2 animate-fadeIn"
                    style={{
                      backgroundColor: `${legendItems[selectedLegendIndex].color}10`,
                      borderColor: `${legendItems[selectedLegendIndex].color}40`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm" style={{ color: legendItems[selectedLegendIndex].color }}>
                        {legendItems[selectedLegendIndex].level} Risk (HTSS Range: {legendItems[selectedLegendIndex].range})
                      </span>
                      <button
                        onClick={() => setSelectedLegendIndex(null)}
                        className="text-gray-400 hover:text-white text-[11px]"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <p className="text-gray-200">
                      <strong>Meaning:</strong> {legendItems[selectedLegendIndex].meaning}
                    </p>
                    <p className="text-gray-300">
                      <strong>Recommended General Action:</strong> {legendItems[selectedLegendIndex].action}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 9 & 10: CALCULATION PIPELINE & WEATHER VS RISK */}
          {(activeTab === 'all' || activeTab === 'htss') && (
            <section className="glass-card p-6 space-y-6">
              <div className="border-l-4 border-orange-500 pl-3">
                <h3 className="text-lg font-bold text-white">9 & 10. How Ward Risk is Calculated</h3>
                <p className="text-xs text-gray-400">Difference between weather data and biometeorological risk</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 space-y-2">
                  <span className="font-bold text-blue-400 uppercase tracking-wider block">WEATHER DATA</span>
                  <p className="text-gray-300">"What is happening in the environment?"</p>
                  <p className="text-white font-semibold">Example: Temperature = 35°C</p>
                  <p className="text-gray-400 text-[11px]">This is raw meteorological weather observation.</p>
                </div>

                <div className="p-4 bg-dark-800 rounded-xl border border-orange-500/40 space-y-2">
                  <span className="font-bold text-orange-400 uppercase tracking-wider block">THERMAL-HEALTH RISK</span>
                  <p className="text-gray-300">"What could these conditions mean for human heat strain?"</p>
                  <p className="text-white font-semibold">Combines Temp + Humidity + Wind + Solar + Exposure</p>
                  <p className="text-orange-300 text-[11px]">Translates weather data into actual physiological stress.</p>
                </div>
              </div>

              {/* Exact THERMOS Calculation Pipeline */}
              <div className="p-5 bg-dark-800 rounded-xl border border-dark-600 space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">
                  Actual THERMOS Calculation Pipeline
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-medium">
                  <div className="p-3 bg-dark-700/80 rounded-lg border border-dark-600 flex flex-col items-center">
                    <Thermometer className="w-4 h-4 text-orange-400 mb-1" />
                    <span>Raw Environmental Input</span>
                    <span className="text-[10px] text-gray-400">Temp, Humidity, Wind, Solar</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-gray-500">➔</div>
                  <div className="p-3 bg-dark-700/80 rounded-lg border border-dark-600 flex flex-col items-center">
                    <Droplets className="w-4 h-4 text-blue-400 mb-1" />
                    <span>Heat-Stress Indices</span>
                    <span className="text-[10px] text-gray-400">WBGT, Heat Index, UTCI</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-gray-500">➔</div>
                  <div className="p-3 bg-dark-700/80 rounded-lg border border-dark-600 flex flex-col items-center">
                    <Activity className="w-4 h-4 text-purple-400 mb-1" />
                    <span>THERMOS Risk Engine</span>
                    <span className="text-[10px] text-gray-400">Weighted + Safeguard Safeguards</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-xs font-bold text-center">
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">HTSS Score (0-100)</span>
                  <span>➔</span>
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg">Risk Category</span>
                  <span>➔</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg">Interactive GIS Map</span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 14 & 15: HOW TO READ THE MAP & ILLUSTRATIVE SCENARIO */}
          {(activeTab === 'all' || activeTab === 'guide') && (
            <section className="glass-card p-6 space-y-6">
              <div className="border-l-4 border-emerald-500 pl-3">
                <h3 className="text-lg font-bold text-white">14 & 15. How to Read the Map in 4 Simple Steps</h3>
                <p className="text-xs text-gray-400">Step-by-step user guide & illustrative scenario</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="text-xs font-bold text-blue-400">STEP 1</span>
                  <h4 className="font-bold text-white text-sm">📍 WHERE?</h4>
                  <p className="text-gray-300">Look at your specific local ward or city location on the map.</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="text-xs font-bold text-yellow-400">STEP 2</span>
                  <h4 className="font-bold text-white text-sm">⚠️ HOW MUCH RISK?</h4>
                  <p className="text-gray-300">Check the risk marker color and exact HTSS score popup.</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="text-xs font-bold text-orange-400">STEP 3</span>
                  <h4 className="font-bold text-white text-sm">🏷️ WHAT LEVEL?</h4>
                  <p className="text-gray-300">Identify whether risk level is Low, Moderate, High, or Extreme.</p>
                </div>
                <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="text-xs font-bold text-emerald-400">STEP 4</span>
                  <h4 className="font-bold text-white text-sm">🏥 WHERE TO GET HELP?</h4>
                  <p className="text-gray-300">Check nearby healthcare and cooling shelter layer locations.</p>
                </div>
              </div>

              {/* Illustrative Scenario */}
              <div className="p-4 bg-dark-800 rounded-xl border border-dark-600 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Illustrative User Scenario:</span>
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded text-[10px] uppercase font-bold">
                    Illustrative Example
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  A citizen opens the map and selects their local ward. The marker displays <strong>HTSS: 68 (HIGH RISK)</strong>. The system provides immediate recommendations (stay in shade, rest 15 mins every hour) while highlighting nearby hospitals and municipal cooling centers on the map interface.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 16: AUTHORITIES SUPPORT */}
          {(activeTab === 'all' || activeTab === 'guide') && (
            <section className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">16. Why This Matters for Decision-Makers</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Rather than issuing generic city-wide alerts, THERMOS empowers municipal authorities to prioritize resources where heat stress is highest:
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="px-3 py-1.5 bg-dark-700 rounded-lg text-blue-300 border border-dark-600">💧 Targeted Water Tankers</span>
                <span className="px-3 py-1.5 bg-dark-700 rounded-lg text-emerald-300 border border-dark-600">🏥 Emergency IV Supplies</span>
                <span className="px-3 py-1.5 bg-dark-700 rounded-lg text-yellow-300 border border-dark-600">❄️ Public Cooling Centres</span>
                <span className="px-3 py-1.5 bg-dark-700 rounded-lg text-orange-300 border border-dark-600">👷 Outdoor Work Adjustments</span>
                <span className="px-3 py-1.5 bg-dark-700 rounded-lg text-purple-300 border border-dark-600">🚨 Early Loudspeaker Alerts</span>
              </div>
              <p className="text-[11px] text-gray-400 italic">
                * Note: THERMOS is a decision-support system and does not replace government or medical decision-making.
              </p>
            </section>
          )}

          {/* SECTION 17: IMPORTANT CLARIFICATION */}
          <section className="p-5 bg-orange-950/30 border border-orange-500/40 rounded-xl space-y-2">
            <h4 className="font-bold text-orange-400 text-sm flex items-center gap-2">
              <Info className="w-5 h-5" /> 17. Important Clarification: Area Risk ≠ Personal Risk
            </h4>
            <p className="text-xs text-gray-200 leading-relaxed">
              A ward-level HTSS score represents <strong>area-level thermal-health risk</strong>. It does <strong>NOT</strong> mean every person in that area has the exact same level of personal risk.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Personal risk depends on individual factors like age, physical exertion, exposure duration, hydration, pre-existing health conditions, and access to air conditioning.
            </p>
          </section>

          {/* SECTION 19, 20, 21: MAP CONTROLS & LIVE DATA */}
          {(activeTab === 'all' || activeTab === 'layers') && (
            <section className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">19, 20, 21. Understanding Map Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="font-bold text-white block">GIS Resolution Selector</span>
                  <p className="text-gray-300">Controls spatial detail: Hyper-Local Ward, District/City, or Regional.</p>
                </div>
                <div className="p-3 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="font-bold text-emerald-400 block">Live Data Indicator</span>
                  <p className="text-gray-300">Shows live data flow from GPS & biometeorological backend pipeline.</p>
                </div>
                <div className="p-3 bg-dark-800 rounded-xl border border-dark-600 space-y-1">
                  <span className="font-bold text-blue-400 block">Location Indicator</span>
                  <p className="text-gray-300">Displays currently monitored city/ward location ({currentLocationName}).</p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 22: FINAL "IN ONE MINUTE" EXPLANATION */}
          <section className="glass-card p-6 border-accent/40 bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 space-y-4 text-center">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-3xl">⏱️</span>
              <h3 className="text-xl font-bold text-white">Heat Map & Risk in 60 Seconds</h3>

              <ol className="text-xs text-gray-200 text-left space-y-2 list-decimal pl-6 inline-block">
                <li>Choose or identify your local ward area.</li>
                <li>THERMOS analyzes relevant heat-risk information (Temp, Humidity, Wind, Solar).</li>
                <li>The system produces an HTSS biometeorological score (0–100).</li>
                <li>The score is converted into a risk level (Safe to Extreme).</li>
                <li>The localized risk appears on the geographic satellite map.</li>
                <li>Users check nearby healthcare and cooling support locations.</li>
                <li>Authorities use localized data to prioritize early relief actions.</li>
              </ol>

              <div className="pt-3 p-4 bg-orange-950/40 border border-orange-500/30 rounded-xl text-sm font-extrabold text-orange-300">
                "THERMOS answers a simple question: WHERE is heat risk highest, HOW serious is it, and WHAT action should be considered?"
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER BAR */}
        <div className="p-4 bg-dark-800 border-t border-dark-700 flex items-center justify-between text-xs">
          <span className="text-gray-400">THERMOSAFE Extreme Heat Early Warning Platform</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-extrabold rounded-xl shadow-lg transition-all"
          >
            Got It! Return to Map ➔
          </button>
        </div>
      </div>
    </div>
  );
};
