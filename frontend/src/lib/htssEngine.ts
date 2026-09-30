// =========================================================================
// AUTHORITATIVE STULL & LILJEGREN PSYCHROMETRIC THERMODYNAMIC ENGINE
// Shared by: React Frontend + Vercel Serverless Functions
// DO NOT modify formulas without updating both uses.
//
// HTSS Calculation Pipeline:
//   Real Weather Data → Input Validation → Thermal Indicators → HTSS → Risk
//
// Formulas:
//   - Wet Bulb Temperature: Stull (2011) empirical equation
//     Source: https://doi.org/10.1175/JAMC-D-11-0143.1
//   - Outdoor WBGT: Liljegren simplification (0.7*Twb + 0.3*T + solar effect)
//   - UTCI: Universal Thermal Climate Index approximation
//   - Heat Index: NOAA National Weather Service Rothfusz regression
//   - Humidex: Canadian Meteorological formula
//   - HTSS: Weighted composite (WBGT 45%, UTCI 35%, Temperature 20%)
//
// Risk Categories:
//   EXTREME: HTSS >= 75
//   HIGH:    HTSS >= 60
//   MODERATE: HTSS >= 40
//   LOW:     HTSS < 40
//
// Score Range: 10–99 (clamped)
// =========================================================================

export type RiskCategory = 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
export type RiskLevel = 'Extreme' | 'High' | 'Moderate' | 'Low';

export type VulnerabilityProfile =
  | 'GENERAL_CITIZEN'
  | 'OUTDOOR_LABORER'
  | 'ELDERLY_VULNERABLE'
  | 'PREGNANT_OR_CHILD';

export interface ProfileAdjustment {
  label: string;
  metabolicOffset: number; // additional HTSS points for internal heat production
  wbgtThresholdShift: number; // shift in danger threshold (°C)
  description: string;
}

export const VULNERABILITY_PROFILES: Record<VulnerabilityProfile, ProfileAdjustment> = {
  GENERAL_CITIZEN: {
    label: 'General Citizen',
    metabolicOffset: 0,
    wbgtThresholdShift: 0,
    description: 'Standard adult metabolic baseline (150 W/m²)',
  },
  OUTDOOR_LABORER: {
    label: 'Outdoor Laborer',
    metabolicOffset: 8,
    wbgtThresholdShift: -2.5,
    description: 'Heavy construction, agriculture, or delivery manual labor (350–450 W/m²)',
  },
  ELDERLY_VULNERABLE: {
    label: 'Senior Citizen (65+)',
    metabolicOffset: 6,
    wbgtThresholdShift: -2.0,
    description: 'Reduced cardiovascular thermoregulation and delayed sweat onset',
  },
  PREGNANT_OR_CHILD: {
    label: 'Pregnant / Child',
    metabolicOffset: 5,
    wbgtThresholdShift: -1.5,
    description: 'Elevated baseline metabolic rate and higher dehydration risk',
  },
};

export interface ThermalRiskResult {
  wbgt: number;
  utci: number;
  twb: number;
  htss: number;
  level: RiskLevel;
  riskCategory: RiskCategory;
  profile?: VulnerabilityProfile;
}

/**
 * Full audit trail for HTSS calculation — used by the debug/audit view.
 * Shows every step from raw input to final score.
 */
export interface HTSSCalculationAudit {
  // Step 1: Raw inputs
  inputs: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    solarRadiation: number;
  };

  // Step 2: Intermediate thermal indicators
  thermalIndicators: {
    wetBulbTemp: number;
    outdoorWBGT: number;
    utci: number;
    heatIndex: number;
    humidex: number;
  };

  // Step 3: Normalization (0–100 scale)
  normalization: {
    n_wbgt: number;        // (WBGT - 20) / 15 * 100, clamped [0,100]
    n_utci: number;        // (UTCI - 20) / 25 * 100, clamped [0,100]
    n_temp: number;        // (Temp - 20) / 25 * 100, clamped [0,100]
  };

  // Step 4: Weighted contributions
  contributions: {
    wbgtContribution: number;     // 0.45 * n_wbgt
    utciContribution: number;     // 0.35 * n_utci
    tempContribution: number;     // 0.20 * n_temp
    rawWeightedSum: number;       // sum of contributions
  };

  // Step 5: Final result
  result: {
    htss: number;                 // clamped [10, 99]
    riskCategory: RiskCategory;
    riskLevel: RiskLevel;
  };

  // Step 6: Factor decomposition (percentage breakdown)
  factorDecomposition: { factor: string; contribution: number }[];

  // Metadata
  calculatedAt: string;           // ISO 8601 UTC
  dataSource: string;
}

// ========================== THERMAL FORMULAS =============================

/**
 * Stull (2011) empirical equation for wet-bulb temperature (°C)
 * Source: https://doi.org/10.1175/JAMC-D-11-0143.1
 */
export function calculateWetBulb(tempC: number, rh: number): number {
  const T = tempC;
  const RH = Math.min(100, Math.max(1, rh));
  const twb =
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035;
  return Math.round(twb * 10) / 10;
}

/**
 * Outdoor WBGT (°C) — Liljegren simplification.
 * WBGT = 0.7 * Twb + 0.3 * T + solar_effect
 * solar_effect = min(2.5, (solarRad / 1000) * 2.0)
 * Bounded physically between Twb and T.
 */
export function calculateOutdoorWBGT(tempC: number, rh: number, solarRad = 0): number {
  const twb = calculateWetBulb(tempC, rh);
  const wbgtShade = 0.7 * twb + 0.3 * tempC;
  const solarEffect = Math.min(2.5, (solarRad / 1000) * 2.0);
  const wbgt = wbgtShade + solarEffect;
  return Math.round(Math.min(tempC, Math.max(twb, wbgt)) * 10) / 10;
}

/**
 * UTCI (°C) — Universal Thermal Climate Index approximation.
 * Bounded physically ± from air temperature.
 */
export function calculateUTCI(tempC: number, rh: number, windKmh = 10, solarRad = 0): number {
  const vMs = Math.max(0.5, windKmh * 0.27778);
  const twb = calculateWetBulb(tempC, rh);
  const tmrt = solarRad > 0 ? tempC + 0.04 * solarRad - 0.6 * Math.sqrt(vMs) : tempC;
  const dt = tmrt - tempC;
  const utci = tempC + 0.12 * dt - 0.10 * vMs + 0.06 * (twb - 15);
  return Math.round(Math.max(tempC - 3, Math.min(tempC + 8, utci)) * 10) / 10;
}

/**
 * NOAA National Weather Service Rothfusz regression equation for Heat Index (°C).
 * Uses the standard multi-term polynomial with low RH and high RH adjustments.
 */
export function calculateHeatIndex(tempC: number, rh: number): number {
  const T = (tempC * 9) / 5 + 32; // Convert to Fahrenheit
  const RH = Math.min(100, Math.max(0, rh));

  if (T < 68) {
    return Math.round(tempC * 10) / 10;
  }

  let hiF = 0.5 * (T + 61.0 + (T - 68.0) * 1.2 + RH * 0.094);

  if (hiF >= 80) {
    hiF =
      -42.379 +
      2.04901523 * T +
      10.14333127 * RH -
      0.22475541 * T * RH -
      0.00683783 * T * T -
      0.05481717 * RH * RH +
      0.00122874 * T * T * RH +
      0.00085282 * T * RH * RH -
      0.00000199 * T * T * RH * RH;

    if (RH < 13 && T >= 80 && T <= 112) {
      hiF -= ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
    } else if (RH > 85 && T >= 80 && T <= 87) {
      hiF += ((RH - 85) / 10) * ((87 - T) / 5);
    }
  }

  const hiC = ((hiF - 32) * 5) / 9;
  return Math.round(Math.max(tempC, hiC) * 10) / 10;
}

/**
 * Humidex — Canadian Meteorological formula.
 * Humidex = T + 0.5555 * (6.11 * exp(5417.7530 * (1/273.16 - 1/Td)) - 10)
 * where Td is dew point temperature estimated from T and RH.
 */
export function calculateHumidex(tempC: number, rh: number): number {
  // Estimate dew point using Magnus formula
  const a = 17.27;
  const b = 237.7;
  const gamma = (a * tempC) / (b + tempC) + Math.log(Math.max(1, rh) / 100);
  const dewPoint = (b * gamma) / (a - gamma);

  // Calculate vapor pressure contribution
  const e = 6.11 * Math.exp(5417.7530 * (1 / 273.16 - 1 / (273.15 + dewPoint)));
  const humidex = tempC + 0.5555 * (e - 10);

  return Math.round(Math.max(tempC, humidex) * 10) / 10;
}

// ========================== RISK CATEGORIZATION ==========================

/**
 * Convert raw HTSS score to risk category string.
 */
export function htssToRiskCategory(htss: number): RiskCategory {
  if (htss >= 75) return 'EXTREME';
  if (htss >= 60) return 'HIGH';
  if (htss >= 40) return 'MODERATE';
  return 'LOW';
}

export function htssToLevel(htss: number): RiskLevel {
  if (htss >= 75) return 'Extreme';
  if (htss >= 60) return 'High';
  if (htss >= 40) return 'Moderate';
  return 'Low';
}

// ========================== FACTOR DECOMPOSITION =========================

/**
 * Dynamic Heat Stress Factor Decomposition based on real psychrometrics.
 * Returns percentage contribution of each factor (sums to ~100%).
 */
export function computeFactorDecomposition(
  tempC: number,
  rh: number,
  windKmh: number = 10,
  solarRad: number = 0
): { factor: string; contribution: number }[] {
  // 1. Temperature excess above comfort (20°C baseline)
  const tempLoad = Math.max(2, tempC - 20) * 3.5;

  // 2. Humidity vapor pressure load (Tetens equation for saturation vapor pressure in kPa)
  const es = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const vp = es * (Math.min(100, Math.max(1, rh)) / 100);
  const rhLoad = Math.max(2, vp - 1.2) * 18;

  // 3. Solar Radiation load
  const solarLoad = (Math.max(0, solarRad) / 1000) * 40;

  // 4. Wind / Environmental circulation retention
  const windEffect = Math.max(5, 22 - Math.min(18, windKmh * 0.7));

  const total = Math.max(1, tempLoad + rhLoad + solarLoad + windEffect);

  const rawTemp = Math.round((tempLoad / total) * 100);
  const rawRh = Math.round((rhLoad / total) * 100);
  const rawSolar = Math.round((solarLoad / total) * 100);
  let rawWind = 100 - (rawTemp + rawRh + rawSolar);

  if (rawWind < 5) {
    rawWind = 5;
  }

  // Final normalization to ensure total = 100%
  const currentSum = rawTemp + rawRh + rawSolar + rawWind;
  const delta = 100 - currentSum;

  return [
    { factor: 'Temperature', contribution: Math.max(5, rawTemp + delta) },
    { factor: 'Humidity', contribution: Math.max(5, rawRh) },
    { factor: 'Solar Load', contribution: Math.max(5, rawSolar) },
    { factor: 'Wind & Env', contribution: Math.max(5, rawWind) },
  ];
}

// ========================== PRIMARY HTSS COMPUTATION =====================

/**
 * Primary HTSS computation:
 * Open-Meteo weather → WBGT + UTCI → normalised → weighted → HTSS (10–99)
 *
 * Weights: WBGT 45%, UTCI 35%, Temperature 20%
 *
 * Normalization:
 *   n_wbgt = clamp((WBGT - 20) / 15 * 100, 0, 100)
 *   n_utci = clamp((UTCI - 20) / 25 * 100, 0, 100)
 *   n_temp = clamp((Temp - 20) / 25 * 100, 0, 100)
 *
 * HTSS = clamp(0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp, 10, 99)
 */
export function computeRealThermalRisk(
  tempC: number,
  rh: number,
  windKmh = 10,
  solarRad = 0,
  profile: VulnerabilityProfile = 'GENERAL_CITIZEN'
): ThermalRiskResult {
  const twb = calculateWetBulb(tempC, rh);
  const wbgt = calculateOutdoorWBGT(tempC, rh, solarRad);
  const utci = calculateUTCI(tempC, rh, windKmh, solarRad);

  const n_wbgt = Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100));
  const n_utci = Math.min(100, Math.max(0, ((utci - 20) / 25) * 100));
  const n_temp = Math.min(100, Math.max(0, ((tempC - 20) / 25) * 100));

  const weighted = 0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp;
  const profileOffset = VULNERABILITY_PROFILES[profile]?.metabolicOffset || 0;
  const htss = Math.min(99, Math.max(10, Math.round(weighted + profileOffset)));

  return {
    wbgt,
    utci,
    twb,
    htss,
    level: htssToLevel(htss),
    riskCategory: htssToRiskCategory(htss),
    profile,
  };
}

// ========================== FULL AUDIT PIPELINE ==========================

/**
 * Computes the complete HTSS calculation with full audit trail.
 * Used by the HTSS Audit/Debug View for authorized users.
 * Every intermediate value is exposed for transparency.
 */
export function computeFullAudit(
  tempC: number,
  rh: number,
  windKmh: number = 10,
  solarRad: number = 0,
  dataSource: string = 'Open-Meteo'
): HTSSCalculationAudit {
  // Step 1: Record inputs
  const inputs = { temperature: tempC, humidity: rh, windSpeed: windKmh, solarRadiation: solarRad };

  // Step 2: Compute thermal indicators
  const twb = calculateWetBulb(tempC, rh);
  const wbgt = calculateOutdoorWBGT(tempC, rh, solarRad);
  const utci = calculateUTCI(tempC, rh, windKmh, solarRad);
  const heatIndex = calculateHeatIndex(tempC, rh);
  const humidex = calculateHumidex(tempC, rh);

  const thermalIndicators = { wetBulbTemp: twb, outdoorWBGT: wbgt, utci, heatIndex, humidex };

  // Step 3: Normalization
  const n_wbgt = Math.round(Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100)) * 10) / 10;
  const n_utci = Math.round(Math.min(100, Math.max(0, ((utci - 20) / 25) * 100)) * 10) / 10;
  const n_temp = Math.round(Math.min(100, Math.max(0, ((tempC - 20) / 25) * 100)) * 10) / 10;

  const normalization = { n_wbgt, n_utci, n_temp };

  // Step 4: Weighted contributions
  const wbgtContribution = Math.round(0.45 * n_wbgt * 10) / 10;
  const utciContribution = Math.round(0.35 * n_utci * 10) / 10;
  const tempContribution = Math.round(0.20 * n_temp * 10) / 10;
  const rawWeightedSum = Math.round((wbgtContribution + utciContribution + tempContribution) * 10) / 10;

  const contributions = { wbgtContribution, utciContribution, tempContribution, rawWeightedSum };

  // Step 5: Final result
  const htss = Math.min(99, Math.max(10, Math.round(rawWeightedSum)));
  const riskCategory = htssToRiskCategory(htss);
  const riskLevel = htssToLevel(htss);

  const result = { htss, riskCategory, riskLevel };

  // Step 6: Factor decomposition
  const factorDecomposition = computeFactorDecomposition(tempC, rh, windKmh, solarRad);

  return {
    inputs,
    thermalIndicators,
    normalization,
    contributions,
    result,
    factorDecomposition,
    calculatedAt: new Date().toISOString(),
    dataSource,
  };
}
