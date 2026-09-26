import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
      color: '#059669', // Emerald
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      meaning: 'Optimal thermal comfort with negligible biometeorological stress.',
      action: 'Stay hydrated and carry on normal daily outdoor activities.',
    },
    {
      level: 'Low',
      range: '31 – 60',
      color: '#d97706', // Amber
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
      meaning: 'Mild thermal discomfort for sensitive individuals.',
      action: 'Wear lightweight clothing, stay hydrated, and keep water handy.',
    },
    {
      level: 'Moderate',
      range: '61 – 75',
      color: '#ea580c', // Orange
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-300',
      meaning: 'Elevated thermal heat stress. Heat cramps and exhaustion possible.',
      action: 'Drink water regularly even if not thirsty. Take frequent shade breaks.',
    },
    {
      level: 'High',
      range: '76 – 85',
      color: '#dc2626', // Red
      badgeBg: 'bg-red-50 text-red-800 border-red-300',
      meaning: 'Severe thermal heat strain. High danger for vulnerable groups & outdoor workers.',
      action: 'Avoid direct sun between 11 AM - 4 PM. Mandatory 15-min rest every hour.',
    },
    {
      level: 'Extreme',
      range: '86 – 100',
      color: '#9333ea', // Purple
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-300',
      meaning: 'Life-threatening biometeorological heat danger. High risk of heat stroke.',
      action: 'Mandatory outdoor work stoppage. Stay indoors with cooling/fans.',
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-guide-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white border border-blue-200/90 rounded-3xl shadow-[0_24px_70px_rgba(15,23,42,0.25)] overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-800">
        
        {/* HEADER BAR */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600 flex-shrink-0">
              <Info className="w-6 h-6" />
            </div>
            <div>
              <h2 id="map-guide-title" className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                Understanding the THERMOS Heat Map
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Interactive guide to reading real-time district risk scores, layer filters, and biometeorological indicators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-950 transition-colors border border-slate-200 cursor-pointer flex-shrink-0"
            title="Close Guide"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUB-NAV FILTER BUTTONS */}
        <div className="bg-slate-50/90 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: '📖 Full Walkthrough' },
            { id: 'basics', label: '📍 District & City Risk' },
            { id: 'htss', label: '📊 HTSS & Calculation' },
            { id: 'layers', label: '🗺️ Map Markers & Layers' },
            { id: 'guide', label: '🚀 How to Read & Actions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-950 border border-slate-200 shadow-2xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MODAL SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm bg-slate-50/40">
          
          {/* SECTION 2: INTRODUCTION */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="rounded-2xl p-6 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 border border-amber-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-800 tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" /> 2. Introduction
              </div>
              <h3 className="text-xl font-black text-slate-950">Why Localized Heat Mapping Matters</h3>
              <p className="text-slate-700 leading-relaxed font-normal">
                This map shows how thermal-health risk varies across different regional and local areas. Instead of treating an entire state as having the exact same heat risk, THERMOS provides district-level risk information to help identify hotspots that require immediate mitigation.
              </p>
              <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-slate-800 leading-relaxed">
                💡 <strong>In Simple Words:</strong> Neighboring districts and microclimates experience completely different levels of heat stress because terrain, humidity from water bodies, concrete urban build-up, and ventilation wind patterns vary significantly.
              </div>
            </section>
          )}

          {/* SECTION 3: WHAT IS DISTRICT & CITY-LEVEL RISK? */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-5">
              <div className="border-l-4 border-blue-600 pl-3.5">
                <h3 className="text-lg font-black text-slate-950">3. What is District & City-Level Risk?</h3>
                <p className="text-xs text-slate-500 font-medium">Localized spatial division across India</p>
              </div>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                India is administratively organized into States, Districts, and Cities. THERMOS maps live biometeorological conditions across India's 788+ districts so disaster authorities and citizens have actionable, localized heat data.
              </p>

              {/* Administrative Hierarchy Diagram */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 border border-blue-300 rounded-xl font-black text-xs">
                  STATE (e.g. Tamil Nadu)
                </div>
                <div className="text-slate-400 text-xs font-mono">│</div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-2xs">Karur</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-2xs">Chennai</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-2xs">Coimbatore</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-2xs">Madurai</div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-900 shadow-2xs">Salem</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Instead of giving one single generalized temperature number for an entire state, THERMOS evaluates environmental factors and physiological stress at this specific district level.
              </p>
            </section>
          )}

          {/* SECTION 4: WHAT DOES "DISTRICT-LEVEL THERMAL RISK" MEAN? */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="rounded-2xl p-6 bg-white border border-blue-100 shadow-sm space-y-5">
              <div className="border-l-4 border-blue-500 pl-3.5">
                <h3 className="text-lg font-black text-slate-950">4. What Does "District-Level Thermal Risk" Mean?</h3>
                <p className="text-xs text-slate-500 font-medium">Deconstructing the system framework</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                  <span className="font-black text-blue-800 block text-sm mb-1">LOCALIZED</span>
                  <p className="text-slate-700">Detailed geographic information focused on specific district regions.</p>
                </div>
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
                  <span className="font-black text-amber-800 block text-sm mb-1">DISTRICT</span>
                  <p className="text-slate-700">The primary administrative unit for civic disaster response and health facilities.</p>
                </div>
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <span className="font-black text-emerald-800 block text-sm mb-1">GIS</span>
                  <p className="text-slate-700">Geographic Information System — mapping tech analyzing live spatial telemetry.</p>
                </div>
                <div className="p-4 bg-red-50/70 rounded-xl border border-red-200">
                  <span className="font-black text-red-800 block text-sm mb-1">RISK</span>
                  <p className="text-slate-700">The estimated biometeorological health risk given live thermal conditions.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 leading-relaxed font-medium">
                <strong>Combined Definition:</strong> "District-Level Thermal Risk" means THERMOS displays heat-health risk at a granular district geographic level instead of showing only one overall value for an entire state or country.
              </div>

              {/* Data Flow Pipeline */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-xs font-bold pt-2">
                <div className="p-2.5 bg-slate-100 rounded-lg text-blue-800 w-full border border-slate-200">STATE</div>
                <span className="text-slate-400">➔</span>
                <div className="p-2.5 bg-slate-100 rounded-lg text-amber-800 w-full border border-slate-200">DISTRICTS</div>
                <span className="text-slate-400">➔</span>
                <div className="p-2.5 bg-slate-100 rounded-lg text-emerald-800 w-full border border-slate-200">ENVIRONMENTAL TELEMETRY</div>
                <span className="text-slate-400">➔</span>
                <div className="p-2.5 bg-slate-100 rounded-lg text-red-800 w-full border border-slate-200">HTSS RISK</div>
                <span className="text-slate-400">➔</span>
                <div className="p-2.5 bg-blue-600 text-white rounded-lg w-full shadow-md font-black">GIS MAP</div>
              </div>
            </section>
          )}

          {/* SECTION 5: WHY NOT JUST SHOW BROAD REGIONAL TEMPERATURE? */}
          {(activeTab === 'all' || activeTab === 'basics') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-slate-950">5. Why Not Just Show State-Wide Temperature?</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-2">
                  <div className="font-black text-red-800 uppercase tracking-wider text-[11px]">STATE-WIDE ONLY ❌</div>
                  <div className="p-3 bg-white rounded-xl border border-red-100 text-slate-700 space-y-1">
                    <p className="font-black text-slate-950">Tamil Nadu</p>
                    <p>➔ One overall temperature reading (e.g. 36°C)</p>
                    <p>➔ One generic state advisory</p>
                  </div>
                  <p className="text-red-700 italic text-[11px]">Hides stark differences between coastal breezes, hill stations, and central plain heat traps.</p>
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="font-black text-emerald-800 uppercase tracking-wider text-[11px]">THERMOS DISTRICT-LEVEL ✅</div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-100 text-slate-700 space-y-1">
                    <p className="font-black text-slate-950">Tamil Nadu Districts</p>
                    <p>➔ Nilgiris: Low Risk (Cool Hill Climate)</p>
                    <p>➔ Chennai: High Risk (High Humidity Heat Index)</p>
                    <p>➔ Karur: Extreme Risk (Inland Solar Baking)</p>
                  </div>
                  <p className="text-emerald-800 font-bold text-[11px]">THERMOS helps authorities & citizens identify exactly WHERE risk is concentrated.</p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6 & 11 & 12 & 13: MAP MARKERS & LAYERS */}
          {(activeTab === 'all' || activeTab === 'layers') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-l-4 border-amber-500 pl-3.5">
                <h3 className="text-lg font-black text-slate-950">6. Map Markers & Layer Filters Explained</h3>
                <p className="text-xs text-slate-500 font-medium">Understanding icons, circular risk markers, hospitals, and shelters</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <p className="font-black text-slate-950 text-sm">📍 Circular Risk Markers:</p>
                <p className="leading-relaxed">
                  The circular markers on the map represent localized thermal risk locations. Note: In THERMOS, marker <strong>COLOR</strong> represents the risk severity level (Green = Safe ➔ Purple = Extreme). Circle dimensions are clean 18px uniform indicators designed for crisp visibility on satellite maps.
                </p>
              </div>

              {/* Layer Filter Cards */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-950 text-xs uppercase tracking-wider">Layer Filter Options (11, 12, 13):</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-red-50/60 rounded-xl border border-red-200 space-y-2">
                    <div className="flex items-center gap-2 font-black text-red-800 text-sm">
                      <Flame className="w-5 h-5 text-red-600" /> 🔥 Risk Layer
                    </div>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      Displays thermal-health risk markers colored by HTSS score across monitored districts and cities.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                    <div className="flex items-center gap-2 font-black text-blue-800 text-sm">
                      <Activity className="w-5 h-5 text-blue-600" /> 🏥 Healthcare Locations
                    </div>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      Displays nearby hospitals, clinics, and emergency medical stations relative to high heat risk zones.
                    </p>
                    <div className="p-2 bg-white/90 rounded border border-blue-100 text-[11px] text-blue-900 font-semibold italic">
                      HIGH-RISK AREA + NEARBY HEALTHCARE ➔ Better situational awareness
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-black text-emerald-800 text-sm">
                      <Shield className="w-5 h-5 text-emerald-600" /> 🛟 Support & Cooling Locations
                    </div>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      Displays municipal cooling centers, shaded rest hubs, and public water stations during severe heatwaves.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7, 8, 18: HTSS SCALE & INTERACTIVE LEGEND */}
          {(activeTab === 'all' || activeTab === 'htss') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-l-4 border-red-500 pl-3.5">
                <h3 className="text-lg font-black text-slate-950">7 & 8. What is HTSS? Risk Level Scale</h3>
                <p className="text-xs text-slate-500 font-medium">Human Thermal Stress Score (0–100 Scale)</p>
              </div>

              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-normal">
                <strong>HTSS</strong> stands for <strong>Human Thermal Stress Score</strong>. It converts heat-related environmental information (air temp, humidity, wind, solar radiation) into an easy-to-understand numerical risk score from <strong>0 (Lowest Risk)</strong> to <strong>100 (Highest Risk)</strong>.
              </p>

              {/* Interactive Legend (Click to view meaning & recommendation) */}
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                  Interactive Risk Scale (Click any level to view recommended actions):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {legendItems.map((item, index) => (
                    <button
                      key={item.level}
                      onClick={() => setSelectedLegendIndex(selectedLegendIndex === index ? null : index)}
                      className={`p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                        selectedLegendIndex === index
                          ? 'ring-2 ring-blue-600 scale-105 shadow-md bg-white border-blue-400'
                          : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
                      }`}
                      style={{
                        borderLeftWidth: '4px',
                        borderLeftColor: item.color,
                      }}
                    >
                      <div>
                        <span className="font-black text-sm block" style={{ color: item.color }}>
                          {item.level}
                        </span>
                        <span className="text-xs text-slate-700 font-mono font-bold">HTSS {item.range}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-bold mt-2 flex items-center justify-between">
                        Details {selectedLegendIndex === index ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Expanded Legend Detail Card */}
                {selectedLegendIndex !== null && (
                  <div
                    className="p-4 rounded-xl border text-xs space-y-2 bg-slate-50 border-slate-200 animate-fadeIn"
                    style={{
                      borderLeftWidth: '5px',
                      borderLeftColor: legendItems[selectedLegendIndex].color,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm" style={{ color: legendItems[selectedLegendIndex].color }}>
                        {legendItems[selectedLegendIndex].level} Risk (HTSS Range: {legendItems[selectedLegendIndex].range})
                      </span>
                      <button
                        onClick={() => setSelectedLegendIndex(null)}
                        className="text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                      >
                        ✕ Close
                      </button>
                    </div>
                    <p className="text-slate-800">
                      <strong>Meaning:</strong> {legendItems[selectedLegendIndex].meaning}
                    </p>
                    <p className="text-slate-700">
                      <strong>Recommended General Action:</strong> {legendItems[selectedLegendIndex].action}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* SECTION 9 & 10: CALCULATION PIPELINE & WEATHER VS RISK */}
          {(activeTab === 'all' || activeTab === 'htss') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-l-4 border-orange-500 pl-3.5">
                <h3 className="text-lg font-black text-slate-950">9 & 10. How District Heat Risk is Calculated</h3>
                <p className="text-xs text-slate-500 font-medium">Difference between weather data and biometeorological risk</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-black text-blue-700 uppercase tracking-wider block">WEATHER DATA</span>
                  <p className="text-slate-600 font-medium">"What is happening in the environment?"</p>
                  <p className="text-slate-950 font-bold">Example: Temperature = 35°C</p>
                  <p className="text-slate-500 text-[11px]">This is raw meteorological weather observation.</p>
                </div>

                <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 space-y-2">
                  <span className="font-black text-orange-800 uppercase tracking-wider block">THERMAL-HEALTH RISK</span>
                  <p className="text-slate-700 font-medium">"What could these conditions mean for human heat strain?"</p>
                  <p className="text-slate-950 font-bold">Combines Temp + Humidity + Wind + Solar + Exposure</p>
                  <p className="text-orange-800 text-[11px] font-semibold">Translates weather data into actual physiological stress.</p>
                </div>
              </div>

              {/* Exact THERMOS Calculation Pipeline */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider block text-center">
                  Actual THERMOS Calculation Pipeline
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs font-medium">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs">
                    <Thermometer className="w-5 h-5 text-orange-600 mb-1" />
                    <span className="font-bold text-slate-900">Raw Environmental Input</span>
                    <span className="text-[10px] text-slate-500 font-normal">Temp, Humidity, Wind, Solar</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-slate-400 font-bold">➔</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs">
                    <Droplets className="w-5 h-5 text-blue-600 mb-1" />
                    <span className="font-bold text-slate-900">Heat-Stress Indices</span>
                    <span className="text-[10px] text-slate-500 font-normal">WBGT, Heat Index, UTCI</span>
                  </div>
                  <div className="hidden sm:flex items-center justify-center text-slate-400 font-bold">➔</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col items-center shadow-2xs">
                    <Activity className="w-5 h-5 text-purple-600 mb-1" />
                    <span className="font-bold text-slate-900">THERMOS Risk Engine</span>
                    <span className="text-[10px] text-slate-500 font-normal">Weighted + Physiological Safeguards</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 text-xs font-bold text-center">
                  <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded-lg font-black">HTSS Score (0-100)</span>
                  <span className="text-slate-400">➔</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 border border-orange-300 rounded-lg font-black">Risk Category</span>
                  <span className="text-slate-400">➔</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-black">Interactive GIS Map</span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 14 & 15: HOW TO READ THE MAP & ILLUSTRATIVE SCENARIO */}
          {(activeTab === 'all' || activeTab === 'guide') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-l-4 border-emerald-500 pl-3.5">
                <h3 className="text-lg font-black text-slate-950">14 & 15. How to Read the Map in 4 Simple Steps</h3>
                <p className="text-xs text-slate-500 font-medium">Step-by-step user guide & illustrative scenario</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <span className="text-xs font-black text-blue-700">STEP 1</span>
                  <h4 className="font-black text-slate-950 text-sm">📍 WHERE?</h4>
                  <p className="text-slate-700">Look at your specific local district or city location on the map.</p>
                </div>
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
                  <span className="text-xs font-black text-amber-700">STEP 2</span>
                  <h4 className="font-black text-slate-950 text-sm">⚠️ HOW MUCH RISK?</h4>
                  <p className="text-slate-700">Check the risk marker color and exact HTSS score popup.</p>
                </div>
                <div className="p-4 bg-orange-50/60 rounded-xl border border-orange-200 space-y-1">
                  <span className="text-xs font-black text-orange-700">STEP 3</span>
                  <h4 className="font-black text-slate-950 text-sm">🏷️ WHAT LEVEL?</h4>
                  <p className="text-slate-700">Identify whether risk level is Low, Moderate, High, or Extreme.</p>
                </div>
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <span className="text-xs font-black text-emerald-700">STEP 4</span>
                  <h4 className="font-black text-slate-950 text-sm">🏥 WHERE TO GET HELP?</h4>
                  <p className="text-slate-700">Check nearby healthcare and cooling shelter layer locations.</p>
                </div>
              </div>

              {/* Illustrative Scenario */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-950 text-sm">Illustrative User Scenario:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded font-black text-[10px] uppercase">
                    Illustrative Example
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">
                  A citizen opens the map and selects their local district. The marker displays <strong>HTSS: 68 (HIGH RISK)</strong>. The system provides immediate recommendations (stay in shade, rest 15 mins every hour) while highlighting nearby hospitals and municipal cooling centers on the map interface.
                </p>
              </div>
            </section>
          )}

          {/* SECTION 16: AUTHORITIES SUPPORT */}
          {(activeTab === 'all' || activeTab === 'guide') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-950">16. Why This Matters for Decision-Makers</h3>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                Rather than issuing generic city-wide alerts, THERMOS empowers municipal authorities to prioritize resources where heat stress is highest:
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-blue-800 border border-slate-200">💧 Targeted Water Tankers</span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-emerald-800 border border-slate-200">🏥 Emergency IV Supplies</span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-amber-800 border border-slate-200">❄️ Public Cooling Centres</span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-orange-800 border border-slate-200">👷 Outdoor Work Adjustments</span>
                <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-purple-800 border border-slate-200">🚨 Early Loudspeaker Alerts</span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Note: THERMOS is a decision-support system and does not replace government or medical decision-making.
              </p>
            </section>
          )}

          {/* SECTION 17: IMPORTANT CLARIFICATION */}
          <section className="rounded-2xl p-5 bg-amber-50 border border-amber-200/90 space-y-2 text-slate-800">
            <h4 className="font-black text-amber-900 text-sm flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600 flex-shrink-0" /> 17. Important Clarification: Area Risk ≠ Personal Risk
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              A district-level HTSS score represents <strong>area-level thermal-health risk</strong>. It does <strong>NOT</strong> mean every person in that area has the exact same level of personal risk.
            </p>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              Personal risk depends on individual factors like age, physical exertion, exposure duration, hydration, pre-existing health conditions, and access to air conditioning.
            </p>
          </section>

          {/* SECTION 19, 20, 21: MAP CONTROLS & LIVE DATA */}
          {(activeTab === 'all' || activeTab === 'layers') && (
            <section className="rounded-2xl p-6 bg-white border border-slate-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-950">19, 20, 21. Understanding Map Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">GIS Resolution Selector</span>
                  <p className="text-slate-600">Controls spatial detail: District/City Level, State Level, or All-India Overview.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-emerald-700 block">Live Data Indicator</span>
                  <p className="text-slate-600">Shows live data flow from GPS & biometeorological backend pipeline.</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-blue-700 block">Location Indicator</span>
                  <p className="text-slate-600">Displays currently monitored district/city location ({currentLocationName}).</p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 22: FINAL "IN ONE MINUTE" EXPLANATION */}
          <section className="rounded-2xl p-6 border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/50 to-white shadow-sm space-y-4 text-center">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="text-3xl">⏱️</span>
              <h3 className="text-xl font-black text-slate-950">Heat Map & Risk in 60 Seconds</h3>

              <ol className="text-xs text-slate-700 text-left space-y-2 list-decimal pl-6 inline-block font-normal">
                <li>Choose or identify your local district or city.</li>
                <li>THERMOS analyzes relevant heat-risk information (Temp, Humidity, Wind, Solar).</li>
                <li>The system produces an HTSS biometeorological score (0–100).</li>
                <li>The score is converted into a risk level (Safe to Extreme).</li>
                <li>The localized risk appears on the geographic satellite map.</li>
                <li>Users check nearby healthcare and cooling support locations.</li>
                <li>Authorities use localized data to prioritize early relief actions.</li>
              </ol>

              <div className="pt-3 p-4 bg-white/90 border border-blue-200 rounded-xl text-sm font-black text-blue-900 shadow-2xs">
                "THERMOS answers a simple question: WHERE is heat risk highest, HOW serious is it, and WHAT action should be considered?"
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER BAR */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">THERMOSAFE Extreme Heat Early Warning Platform</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Got It! Return to Map ➔
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
