/**
 * GET /api/weather?lat=&lon=
 *
 * Fetches real-time weather from Open-Meteo for a single location,
 * calculates HTSS and all thermal indices, and returns the result.
 *
 * Used by: CitizenDashboard, MapPage (single-location queries)
 * NOT used for bulk all-India pipeline (that's /api/refresh → Supabase → /api/htss).
 *
 * Query params:
 *   lat   - Latitude (required)
 *   lon   - Longitude (required)
 *   hours - Forecast hours (optional, default 24, for /api/weather?mode=forecast)
 *   mode  - 'current' (default) | 'forecast'
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// --- HTSS Engine (authoritative formulas) ---
function calculateWetBulb(tempC: number, rh: number): number {
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

// NOAA Rothfusz Heat Index equation (°C)
function calculateHeatIndex(tempC: number, rh: number): number {
  const T = (tempC * 9) / 5 + 32;
  const RH = Math.min(100, Math.max(0, rh));
  if (T < 68) return Math.round(tempC * 10) / 10;

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

function calculateOutdoorWBGT(tempC: number, rh: number, solarRad = 600): number {
  const twb = calculateWetBulb(tempC, rh);
  const wbgtShade = 0.7 * twb + 0.3 * tempC;
  const solarEffect = Math.min(2.5, (solarRad / 1000) * 2.0);
  const wbgt = wbgtShade + solarEffect;
  return Math.round(Math.min(tempC, Math.max(twb, wbgt)) * 10) / 10;
}

function calculateUTCI(tempC: number, rh: number, windKmh = 10, solarRad = 600): number {
  const vMs = Math.max(0.5, windKmh * 0.27778);
  const twb = calculateWetBulb(tempC, rh);
  const tmrt = solarRad > 0 ? tempC + 0.04 * solarRad - 0.6 * Math.sqrt(vMs) : tempC;
  const dt = tmrt - tempC;
  const utci = tempC + 0.12 * dt - 0.10 * vMs + 0.06 * (twb - 15);
  return Math.round(Math.max(tempC - 3, Math.min(tempC + 8, utci)) * 10) / 10;
}

function computeFactorDecomposition(
  tempC: number,
  rh: number,
  windKmh: number = 10,
  solarRad: number = 600
): { factor: string; contribution: number }[] {
  const tempLoad = Math.max(2, tempC - 20) * 3.5;
  const es = 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const vp = es * (Math.min(100, Math.max(1, rh)) / 100);
  const rhLoad = Math.max(2, vp - 1.2) * 18;
  const solarLoad = (Math.max(0, solarRad) / 1000) * 40;
  const windEffect = Math.max(5, 22 - Math.min(18, windKmh * 0.7));

  const total = Math.max(1, tempLoad + rhLoad + solarLoad + windEffect);

  const rawTemp = Math.round((tempLoad / total) * 100);
  const rawRh = Math.round((rhLoad / total) * 100);
  const rawSolar = Math.round((solarLoad / total) * 100);
  let rawWind = 100 - (rawTemp + rawRh + rawSolar);
  if (rawWind < 5) rawWind = 5;

  const currentSum = rawTemp + rawRh + rawSolar + rawWind;
  const delta = 100 - currentSum;

  return [
    { factor: 'Temperature', contribution: Math.max(5, rawTemp + delta) },
    { factor: 'Humidity', contribution: Math.max(5, rawRh) },
    { factor: 'Solar Load', contribution: Math.max(5, rawSolar) },
    { factor: 'Wind & Env', contribution: Math.max(5, rawWind) },
  ];
}

function computeThermalRisk(tempC: number, rh: number, windKmh = 10, solarRad = 600) {
  const twb = calculateWetBulb(tempC, rh);
  const wbgt = calculateOutdoorWBGT(tempC, rh, solarRad);
  const utci = calculateUTCI(tempC, rh, windKmh, solarRad);

  const n_wbgt = Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100));
  const n_utci = Math.min(100, Math.max(0, ((utci - 20) / 25) * 100));
  const n_temp = Math.min(100, Math.max(0, ((tempC - 20) / 25) * 100));

  const weighted = 0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp;
  const htss = Math.min(99, Math.max(10, Math.round(weighted)));

  let level = 'Low';
  if (htss >= 75) level = 'Extreme';
  else if (htss >= 60) level = 'High';
  else if (htss >= 40) level = 'Moderate';

  return { twb, wbgt, utci, htss, level };
}

// -------------------------------------------------------

async function fetchWithTimeout(url: string, ms = 12000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchCurrentWeather(lat: number, lon: number) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,` +
    `wind_speed_10m,wind_direction_10m,shortwave_radiation,` +
    `pressure_msl,dew_point_2m,uv_index,weather_code,cloud_cover` +
    `&models=gfs_seamless` +
    `&timezone=auto`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetchWithTimeout(url, 12000);
      if (res.ok) {
        const data = await res.json();
        const curr = data?.current ?? {};
        const temp = Number(curr.temperature_2m ?? 0);
        const rh = Number(curr.relative_humidity_2m ?? 0);
        const wind = Number(curr.wind_speed_10m ?? 0);
        const windDir = Number(curr.wind_direction_10m ?? 0);
        const solar = Number(curr.shortwave_radiation ?? 0);
        const pressure = Number(curr.pressure_msl ?? 1013.25);
        const dewPoint = Number(curr.dew_point_2m ?? 0);
        const apparentTemp = Number(curr.apparent_temperature ?? temp);
        const uvIndex = Number(curr.uv_index ?? 0);
        const cloudCover = Number(curr.cloud_cover ?? 0);
        const apiTime = curr.time || new Date().toISOString();

        // Authoritative biometeorological calculations locally
        const calculatedHi = calculateHeatIndex(temp, rh);
        const heatIndexVal = curr.apparent_temperature !== undefined && curr.apparent_temperature !== null
          ? Number(curr.apparent_temperature)
          : calculatedHi;

        const thermal = computeThermalRisk(temp, rh, wind, solar);
        const dynamicFactors = computeFactorDecomposition(temp, rh, wind, solar);

        return {
          // Real Open-Meteo API fields
          temperature: Math.round(temp * 10) / 10,
          humidity: Math.round(rh * 10) / 10,
          windSpeed: Math.round(wind * 10) / 10,
          windDirection: Math.round(windDir * 10) / 10,
          solarRadiation: Math.round(solar * 10) / 10,
          pressureMsl: Math.round(pressure * 10) / 10,
          dewPoint: Math.round(dewPoint * 10) / 10,
          apparentTemperature: Math.round(apparentTemp * 10) / 10,
          uvIndex: Math.round(uvIndex * 100) / 100,
          description: cloudCover < 30 ? 'Clear' : cloudCover < 70 ? 'Partly Cloudy' : 'Cloudy',
          timestamp: new Date().toISOString(),
          apiTimestamp: apiTime,
          isLive: true,
          source: 'LIVE WEATHER — Open-Meteo',

          // Locally calculated biometeorological indices
          heatIndex: Math.round(heatIndexVal * 10) / 10,
          wbgt: thermal.wbgt,
          utci: thermal.utci,
          htss: thermal.htss,
          htssCategory: thermal.level,

          // Risk
          level: thermal.level,
          score: thermal.htss,
          probability: Math.min(100, Math.round(thermal.htss * 1.1)),
          primaryFactors: dynamicFactors,
          recommendations: getRecommendations(thermal.level),
          dataSource: 'LIVE WEATHER — Open-Meteo',
        };
      }
      if (res.status === 429) await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    } catch (e: any) {
      if (attempt === 2) throw e;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw new Error('Open-Meteo unreachable after 3 attempts');
}

async function fetchForecast(lat: number, lon: number, hours = 24) {
  const days = Math.min(7, Math.ceil(hours / 24) + 1);
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,shortwave_radiation` +
    `&forecast_days=${days}` +
    `&models=gfs_seamless` +
    `&timezone=auto`;

  const res = await fetchWithTimeout(url, 12000);
  if (!res.ok) throw new Error(`Open-Meteo forecast HTTP ${res.status}`);
  const data = await res.json();
  const hourly = data?.hourly ?? {};
  const allTimes: string[] = hourly.time ?? [];

  // Match current local time to start index
  const now = new Date();
  const currentHourPad = String(now.getHours()).padStart(2, '0');
  let startIdx = 0;
  for (let i = 0; i < allTimes.length; i++) {
    const t = allTimes[i];
    const hourPart = t.includes('T') ? t.split('T')[1].substring(0, 2) : '';
    if (hourPart === currentHourPad) {
      startIdx = i;
      break;
    }
  }

  const times = allTimes.slice(startIdx, startIdx + hours);

  return {
    timeline: times.map((t: string, offsetIdx: number) => {
      const idx = startIdx + offsetIdx;
      const temp = Number(hourly.temperature_2m?.[idx] ?? 30);
      const rh   = Number(hourly.relative_humidity_2m?.[idx] ?? 50);
      const wind = Number(hourly.wind_speed_10m?.[idx] ?? 10);
      const solar = Number(hourly.shortwave_radiation?.[idx] ?? 600);
      const th = computeThermalRisk(temp, rh, wind, solar);
      const timeStr = t.includes('T') ? t.split('T')[1].substring(0, 5) : t;
      return {
        time: timeStr,
        temperature: Math.round(temp * 10) / 10,
        htss: th.htss,
        riskLevel: th.level,
      };
    }),
  };
}

function getRecommendations(level: string) {
  const base = [
    { audience: 'General', text: 'Stay hydrated. Drink water every 20 minutes.', icon: 'Droplets', urgency: 'medium' },
  ];
  if (level === 'High' || level === 'Extreme') {
    base.push({ audience: 'General', text: 'Avoid outdoor activities between 11 AM – 4 PM.', icon: 'Sun', urgency: 'high' });
    base.push({ audience: 'Workers', text: 'Mandatory shade breaks every 30 minutes.', icon: 'Briefcase', urgency: 'high' });
  }
  if (level === 'Extreme') {
    base.push({ audience: 'General', text: 'Life-threatening heat. Stay indoors in AC.', icon: 'AlertTriangle', urgency: 'extreme' });
    base.push({ audience: 'Elderly/Children', text: 'Check on elderly neighbours immediately.', icon: 'Heart', urgency: 'extreme' });
  }
  return base;
}

function generateAlerts(level: string, htss: number) {
  const now = new Date().toISOString();
  if (level === 'Extreme') {
    return [{
      id: `alert-${Date.now()}`,
      title: 'Extreme Heat Danger',
      message: `HTSS ${htss} — Life-threatening heat conditions. Avoid all outdoor exposure.`,
      severity: 'red',
      time: now,
      actions: ['Stay indoors with AC', 'Hydrate constantly', 'Call emergency if heat-sick'],
    }];
  }
  if (level === 'High') {
    return [{
      id: `alert-${Date.now()}`,
      title: 'Severe Heat Alert',
      message: `HTSS ${htss} — Very high thermal stress. High risk of heat illness.`,
      severity: 'orange',
      time: now,
      actions: ['Limit outdoor time', 'Drink water every 20 min', 'Wear loose light clothing'],
    }];
  }
  if (level === 'Moderate') {
    return [{
      id: `alert-${Date.now()}`,
      title: 'Heat Watch Advisory',
      message: `HTSS ${htss} — Elevated thermal stress. Take precautions outdoors.`,
      severity: 'yellow',
      time: now,
      actions: ['Stay hydrated', 'Wear sunscreen', 'Avoid strenuous midday activity'],
    }];
  }
  return [];
}

// -------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lat = parseFloat(req.query.lat as string);
  const lon = parseFloat(req.query.lon as string);
  const mode = (req.query.mode as string) ?? 'current';
  const hours = parseInt(req.query.hours as string) || 24;

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(400).json({ error: 'Invalid lat/lon. Provide valid coordinates.' });
  }

  // Short cache for weather (2 min)
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=30');

  try {
    if (mode === 'forecast') {
      const forecast = await fetchForecast(lat, lon, hours);
      return res.status(200).json({ forecasts: forecast.timeline, timeline: forecast.timeline });
    }

    const data = await fetchCurrentWeather(lat, lon);
    const alerts = generateAlerts(data.level, data.htss);

    return res.status(200).json({
      // WeatherData shape
      temp: data.temperature,
      temperature: data.temperature,
      humidity: data.humidity,
      wind_speed: data.windSpeed,
      windSpeed: data.windSpeed,
      wind_direction: data.windDirection,
      windDirection: data.windDirection,
      solar_radiation: data.solarRadiation,
      solarRadiation: data.solarRadiation,
      pressure_msl: data.pressureMsl,
      pressureMsl: data.pressureMsl,
      pressure: data.pressureMsl,
      dew_point: data.dewPoint,
      dewPoint: data.dewPoint,
      apparent_temperature: data.apparentTemperature,
      apparentTemperature: data.apparentTemperature,
      uv_index: data.uvIndex,
      uvIndex: data.uvIndex,
      description: data.description,
      timestamp: data.timestamp,
      apiTimestamp: data.apiTimestamp,
      isLive: true,
      source: data.source,

      // ThermalStressData shape
      heat_index: data.heatIndex,
      heatIndex: data.heatIndex,
      wbgt: data.wbgt,
      utci: data.utci,
      htss_score: data.htss,
      htss: data.htss,
      htss_category: data.htssCategory,
      htssCategory: data.htssCategory,

      // RiskAssessment shape
      risk_level: data.level,
      level: data.level,
      risk_score: data.score,
      score: data.score,
      probability: data.probability,
      primaryFactors: data.primaryFactors,
      recommendations: data.recommendations,

      // Alerts
      alerts,
      dataSource: data.dataSource,
    });
  } catch (err: any) {
    console.error('[/api/weather] Error:', err?.message ?? err);
    return res.status(503).json({
      error: 'DATA UNAVAILABLE',
      isLive: false,
      detail: err?.message ?? 'Open-Meteo request failed',
      dataSource: 'DATA UNAVAILABLE',
    });
  }
}
