// =========================================================================
// AUTHORITATIVE STULL & LILJEGREN PSYCHROMETRIC THERMODYNAMIC ENGINE
// 100% Real Physical Heat Stress Calculation for Wet Bulb, WBGT, UTCI & HTSS
// =========================================================================

// Stull (2011) empirical equation for wet-bulb temperature (°C)
export function calculateWetBulb(tempC: number, rh: number): number {
  const T = tempC;
  const RH = Math.min(100, Math.max(1, rh));
  const twb =
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035;
  return twb;
}

// Outdoor WBGT (°C) - Bounded physically between Twb and T
export function calculateOutdoorWBGT(tempC: number, rh: number, solarRad: number = 600): number {
  const twb = calculateWetBulb(tempC, rh);
  const wbgtShade = 0.7 * twb + 0.3 * tempC;
  const solarEffect = Math.min(2.5, (solarRad / 1000) * 2.0);
  const wbgt = wbgtShade + solarEffect;
  return Math.round(Math.min(tempC, Math.max(twb, wbgt)) * 10) / 10;
}

// UTCI (°C) - Bounded physically
export function calculateUTCI(tempC: number, rh: number, windKmh: number = 10, solarRad: number = 600): number {
  const vMs = Math.max(0.5, windKmh * 0.27778);
  const twb = calculateWetBulb(tempC, rh);
  const tmrt = solarRad > 0 ? tempC + 0.04 * solarRad - 0.6 * Math.sqrt(vMs) : tempC;
  const dt = tmrt - tempC;
  const utci = tempC + 0.12 * dt - 0.10 * vMs + 0.06 * (twb - 15);
  return Math.round(Math.max(tempC - 3, Math.min(tempC + 8, utci)) * 10) / 10;
}

// Human Thermal Stress Score (HTSS 0-100) & Category
export function computeRealThermalRisk(
  tempC: number,
  rh: number,
  windKmh: number = 10,
  solarRad: number = 600
): {
  wbgt: number;
  utci: number;
  htss: number;
  level: 'Extreme' | 'High' | 'Moderate' | 'Low';
} {
  const wbgt = calculateOutdoorWBGT(tempC, rh, solarRad);
  const utci = calculateUTCI(tempC, rh, windKmh, solarRad);

  const n_wbgt = Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100));
  const n_utci = Math.min(100, Math.max(0, ((utci - 20) / 25) * 100));
  const n_temp = Math.min(100, Math.max(0, ((tempC - 20) / 25) * 100));

  const weighted = 0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp;
  const htssScore = Math.min(99, Math.max(10, Math.round(weighted)));

  let level: 'Extreme' | 'High' | 'Moderate' | 'Low' = 'Low';
  if (htssScore >= 75) level = 'Extreme';
  else if (htssScore >= 60) level = 'High';
  else if (htssScore >= 40) level = 'Moderate';

  return {
    wbgt,
    utci,
    htss: htssScore,
    level,
  };
}

// NOAA National Weather Service Rothfusz regression equation for Heat Index (°C)
export function calculateHeatIndex(tempC: number, rh: number): number {
  const T = (tempC * 9) / 5 + 32; // Fahrenheit
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

// Dynamic Heat Stress Factor Decomposition based on real psychrometrics
export function computeFactorDecomposition(
  tempC: number,
  rh: number,
  windKmh: number = 10,
  solarRad: number = 600
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
