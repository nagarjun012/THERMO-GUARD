/**
 * Government Configuration
 *
 * Centralized configuration for official deployment parameters.
 * All slots are designed to be filled with genuine authorized information
 * only when officially approved by the responsible government department.
 *
 * DO NOT add fake government credentials, logos, or claims of official approval.
 */

export const GOV_CONFIG = {
  // ── Official Agency Identity ──────────────────────────────────────────
  // Fill these ONLY when officially authorized by the responsible department.
  agency: {
    name: 'Heat Early Warning System — THERMOS',
    department: '[Department / Agency Name — To be assigned upon official deployment]',
    ministry: '[Ministry Name — To be assigned upon official deployment]',
    logoUrl: '', // Official agency logo URL — add only when authorized
    websiteUrl: '', // Official agency website — add only when authorized
    contactEmail: '', // Official contact — add only when authorized
    contactPhone: '', // Official phone — add only when authorized
    portalReadiness: 'PRE-DEPLOYMENT' as 'PRE-DEPLOYMENT' | 'PILOT' | 'OFFICIAL',
  },

  // ── Emergency Helplines (Verified National Numbers) ───────────────────
  emergencyHelplines: [
    { label: 'National Emergency', number: '112', description: 'Police, Fire, Ambulance' },
    { label: 'Ambulance', number: '108', description: 'Free ambulance service' },
    { label: 'State Disaster Helpline', number: '1070', description: 'SDMA emergency response' },
    { label: 'District Disaster Helpline', number: '1077', description: 'District emergency response' },
    { label: 'Senior Citizens Helpline', number: '14567', description: 'Eldercare assistance' },
    { label: 'Women Helpline', number: '181', description: 'Women assistance' },
    { label: 'Child Helpline', number: '1098', description: 'Child assistance' },
  ],

  // ── Data Sources & Attribution ────────────────────────────────────────
  dataSources: {
    weather: {
      name: 'Open-Meteo',
      models: ['GFS (Global Forecast System)', 'ECMWF (European Centre)'],
      url: 'https://open-meteo.com/',
      license: 'CC BY 4.0',
      refreshIntervalMinutes: 15,
      description: 'Real-time meteorological telemetry from GFS and ECMWF numerical weather prediction models.',
    },
    maps: {
      name: 'OpenStreetMap',
      url: 'https://www.openstreetmap.org/',
      license: 'ODbL',
      tileProvider: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    geocoding: {
      name: 'OpenStreetMap Nominatim',
      url: 'https://nominatim.openstreetmap.org/',
      license: 'ODbL',
    },
  },

  // ── HTSS Model Provenance ─────────────────────────────────────────────
  htssModel: {
    name: 'Heat Thermal Stress Score (HTSS)',
    version: '2.0',
    description: 'Multi-factor physiological heat stress index combining WBGT, UTCI, and air temperature.',
    formulas: [
      { name: 'Wet Bulb Globe Temperature (WBGT)', reference: 'Liljegren et al. (2008)', weight: 0.45 },
      { name: 'Universal Thermal Climate Index (UTCI)', reference: 'ISB Commission 6 (2009)', weight: 0.35 },
      { name: 'Air Temperature', reference: 'Direct measurement', weight: 0.20 },
    ],
    auxiliaryFormulas: [
      { name: 'Wet Bulb Temperature', reference: 'Stull (2011)' },
      { name: 'Heat Index', reference: 'Rothfusz (1990) — NWS' },
    ],
    limitations: [
      'Does not account for indoor microclimates or building insulation.',
      'Urban heat island effects are not individually modelled for each locality.',
      'Solar radiation is estimated from weather models, not ground sensors.',
      'Individual physiological variation (age, health, acclimatization) is not modelled.',
      'The model is an auxiliary early-warning tool and does not replace official IMD or NDMA advisories.',
    ],
    disclaimer:
      'THERMOS HTSS is an AI-assisted risk estimation tool. It does not replace official government advisories from the India Meteorological Department (IMD) or medical advice from healthcare professionals. Always follow official government warnings during heat events.',
  },

  // ── Official Heatwave Thresholds (IMD Criteria) ───────────────────────
  officialThresholds: {
    source: 'India Meteorological Department (IMD)',
    reference: 'IMD Heatwave Criteria — National Disaster Management Authority (NDMA) Guidelines 2019',
    criteria: {
      plains: {
        heatwave: 'Maximum temperature ≥ 40°C, or departure from normal ≥ +4.5°C',
        severeHeatwave: 'Maximum temperature ≥ 45°C, or departure from normal ≥ +6.4°C',
      },
      coastal: {
        heatwave: 'Maximum temperature ≥ 37°C, or departure from normal ≥ +4.5°C',
        severeHeatwave: 'Maximum temperature ≥ 41°C, or departure from normal ≥ +6.4°C',
      },
    },
    note: 'Official IMD warnings take priority over THERMOS HTSS scores. THERMOS is an auxiliary early-warning supplement.',
  },

  // ── Governance & Accountability ───────────────────────────────────────
  governance: {
    systemOwnership: '[To be assigned — Responsible government body / department]',
    contentUpdates: '[To be assigned — Content management team]',
    dataManagement: '[To be assigned — Data governance officer]',
    aiModelManagement: '[To be assigned — AI/ML technical team]',
    security: '[To be assigned — Cybersecurity team / CERT-In coordination]',
    infrastructure: '[To be assigned — Cloud / hosting infrastructure team]',
    emergencyAlerts: '[To be assigned — Emergency alert operations center]',
    citizenComplaints: '[To be assigned — Public grievance redressal mechanism]',
    incorrectDataCorrection: '[To be assigned — Data quality assurance team]',
    medicalReview: '[To be assigned — Medical / public health advisory board]',
  },

  // ── System Metadata ───────────────────────────────────────────────────
  system: {
    version: '2.0.0',
    lastUpdated: '2026-09-21',
    uptimeTarget: '99.5%',
    securityAuditStatus: 'Pending — Pre-deployment',
    wcagLevel: 'WCAG 2.1 AA (Target)',
  },
} as const;

export type GovConfig = typeof GOV_CONFIG;
