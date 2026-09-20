// =========================================================================
// AUTHORITATIVE STULL & LILJEGREN PSYCHROMETRIC THERMODYNAMIC ENGINE
// Shared by: React Frontend + Vercel Serverless Functions
// DO NOT modify formulas without updating both uses.
// =========================================================================

export type RiskCategory = 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW';
export type RiskLevel = 'Extreme' | 'High' | 'Moderate' | 'Low';

export interface ThermalRiskResult {
  wbgt: number;
  utci: number;
  twb: number;
  htss: number;
  level: RiskLevel;
  riskCategory: RiskCategory;
}

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
 * Bounded physically between Twb and T.
 */
export function calculateOutdoorWBGT(tempC: number, rh: number, solarRad = 600): number {
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
export function calculateUTCI(tempC: number, rh: number, windKmh = 10, solarRad = 600): number {
  const vMs = Math.max(0.5, windKmh * 0.27778);
  const twb = calculateWetBulb(tempC, rh);
  const tmrt = solarRad > 0 ? tempC + 0.04 * solarRad - 0.6 * Math.sqrt(vMs) : tempC;
  const dt = tmrt - tempC;
  const utci = tempC + 0.12 * dt - 0.10 * vMs + 0.06 * (twb - 15);
  return Math.round(Math.max(tempC - 3, Math.min(tempC + 8, utci)) * 10) / 10;
}

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

/**
 * Primary HTSS computation:
 * Open-Meteo weather → WBGT + UTCI → normalised → weighted → HTSS (0–99)
 *
 * Weights: WBGT 45%, UTCI 35%, Temperature 20%
 */
export function computeRealThermalRisk(
  tempC: number,
  rh: number,
  windKmh = 10,
  solarRad = 600
): ThermalRiskResult {
  const twb = calculateWetBulb(tempC, rh);
  const wbgt = calculateOutdoorWBGT(tempC, rh, solarRad);
  const utci = calculateUTCI(tempC, rh, windKmh, solarRad);

  const n_wbgt = Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100));
  const n_utci = Math.min(100, Math.max(0, ((utci - 20) / 25) * 100));
  const n_temp = Math.min(100, Math.max(0, ((tempC - 20) / 25) * 100));

  const weighted = 0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp;
  const htss = Math.min(99, Math.max(10, Math.round(weighted)));

  return {
    wbgt,
    utci,
    twb,
    htss,
    level: htssToLevel(htss),
    riskCategory: htssToRiskCategory(htss),
  };
}
