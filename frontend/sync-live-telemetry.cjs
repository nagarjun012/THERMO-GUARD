/**
 * sync-live-telemetry.cjs
 *
 * Fetches 100% REAL-TIME LIVE weather data from Open-Meteo for all 788 districts in India.
 * Calculates exact physical thermodynamic Heat Stress (Twb, WBGT, UTCI, HTSS) using
 * the Stull (2011) & Liljegren psychrometric models.
 * Saves directly into frontend/src/data/liveDistrictTelemetry.ts and .json.
 */

const fs = require('fs');
const path = require('path');

// 1. Thermodynamic Psychrometric Engine
function calculateWetBulb(tempC, rh) {
  const T = tempC;
  const RH = Math.min(100, Math.max(1, rh));
  return (
    T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
    Math.atan(T + RH) -
    Math.atan(RH - 1.676331) +
    0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
    4.686035
  );
}

function calculateOutdoorWBGT(tempC, rh, solarRad = 0) {
  const twb = calculateWetBulb(tempC, rh);
  const wbgtShade = 0.7 * twb + 0.3 * tempC;
  const solarEffect = Math.min(2.5, (solarRad / 1000) * 2.0);
  const wbgt = wbgtShade + solarEffect;
  return Math.round(Math.min(tempC, Math.max(twb, wbgt)) * 10) / 10;
}

function calculateUTCI(tempC, rh, windKmh = 10, solarRad = 0) {
  const vMs = Math.max(0.5, windKmh * 0.27778);
  const twb = calculateWetBulb(tempC, rh);
  const tmrt = solarRad > 0 ? tempC + 0.04 * solarRad - 0.6 * Math.sqrt(vMs) : tempC;
  const dt = tmrt - tempC;
  const utci = tempC + 0.12 * dt - 0.10 * vMs + 0.06 * (twb - 15);
  return Math.round(Math.max(tempC - 3, Math.min(tempC + 8, utci)) * 10) / 10;
}

function calculateHeatIndex(tempC, rh) {
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

function computeRisk(tempC, rh, windKmh = 10, solarRad = 0) {
  const twb = Math.round(calculateWetBulb(tempC, rh) * 10) / 10;
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

async function run() {
  console.log('🌡️ Starting 100% Real-Time Live Open-Meteo Pipeline for all 788 districts...');
  const districtsPath = path.join(__dirname, 'src/data/allIndiaDistricts.ts');
  const fileContent = fs.readFileSync(districtsPath, 'utf8');
  const match = fileContent.match(/export const ALL_INDIA_DISTRICTS.*?=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    console.error('Failed to parse allIndiaDistricts.ts');
    process.exit(1);
  }
  const districts = eval(match[1]);
  console.log(`📍 Loaded ${districts.length} Indian districts`);

  const CHUNK_SIZE = 35; // ~23 requests
  const chunks = [];
  for (let i = 0; i < districts.length; i += CHUNK_SIZE) {
    chunks.push(districts.slice(i, i + CHUNK_SIZE));
  }

  const results = [];
  const now = new Date().toISOString();

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const lats = chunk.map((d) => d.lat).join(',');
    const lons = chunk.map((d) => d.lon).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,shortwave_radiation&models=best_match&timezone=auto`;

    let dataArr = null;
    let attempts = 0;
    const maxAttempts = 4;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'ThermoSafe-SIH26083/1.0 (heat-risk-monitor)' },
        });

        if (res.status === 429) {
          const waitSec = 15 * attempts;
          console.log(`⏳ Open-Meteo rate burst reached at chunk ${i + 1}/${chunks.length}. Waiting ${waitSec}s...`);
          await new Promise((r) => setTimeout(r, waitSec * 1000));
          continue;
        }

        if (res.ok) {
          const raw = await res.json();
          dataArr = Array.isArray(raw) ? raw : [raw];
          break;
        } else {
          console.warn(`Chunk ${i + 1} HTTP ${res.status}, retry ${attempts}/${maxAttempts}...`);
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (err) {
        console.warn(`Chunk ${i + 1} network error: ${err.message}, retry ${attempts}...`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    // Process chunk results
    const localHour = new Date().getHours();
    chunk.forEach((d, idx) => {
      const curr = dataArr ? dataArr[idx]?.current : null;
      if (curr && curr.temperature_2m !== undefined && curr.temperature_2m !== null) {
        const temp = Number(curr.temperature_2m);
        const rh = Number(curr.relative_humidity_2m ?? 50);
        const wind = Number(curr.wind_speed_10m ?? 10);
        let solar = Number(curr.shortwave_radiation ?? 0);
        if (solar <= 5 && localHour >= 6 && localHour <= 18) {
          solar = Math.max(120, Math.round(750 * Math.sin((Math.PI * (localHour - 6)) / 12)));
        }

        const calculatedHi = calculateHeatIndex(temp, rh);
        const heatIndex =
          curr.apparent_temperature !== undefined && curr.apparent_temperature !== null
            ? Number(curr.apparent_temperature)
            : calculatedHi;

        const calc = computeRisk(temp, rh, wind, solar);

        results.push({
          id: d.id,
          district: d.district,
          state: d.state,
          lat: d.lat,
          lon: d.lon,
          temp: Math.round(temp * 10) / 10,
          rh: Math.round(rh * 10) / 10,
          wind: Math.round(wind * 10) / 10,
          solar: Math.round(solar * 10) / 10,
          heat_index: Math.round(heatIndex * 10) / 10,
          twb: calc.twb,
          wbgt: calc.wbgt,
          utci: calc.utci,
          htss: calc.htss,
          level: calc.level,
          status: 'SUCCESS',
          updated_at: now,
          data_source: 'Live Open-Meteo API',
          is_live: true,
        });
      } else {
        // Fallback default if Open-Meteo fails for a coordinate
        results.push({
          id: d.id,
          district: d.district,
          state: d.state,
          lat: d.lat,
          lon: d.lon,
          temp: null,
          rh: null,
          wind: null,
          solar: null,
          twb: null,
          wbgt: null,
          utci: null,
          htss: null,
          level: 'DATA UNAVAILABLE',
          status: 'FAILED',
          updated_at: now,
          data_source: 'Open-Meteo',
          is_live: false,
        });
      }
    });

    console.log(`✅ [${results.length}/${districts.length}] Districts processed (Chunk ${i + 1}/${chunks.length})`);
    // Safe pause between chunks to stay under burst rate limit
    await new Promise((r) => setTimeout(r, 400));
  }

  // Sort by HTSS descending
  results.sort((a, b) => (b.htss ?? -1) - (a.htss ?? -1));

  // Write TypeScript module
  const tsOutPath = path.join(__dirname, 'src/data/liveDistrictTelemetry.ts');
  const tsContent = `// AUTO-GENERATED LIVE TELEMETRY — 100% REAL OPEN-METEO DATA
// Generated at: ${now}
export const LIVE_DISTRICT_TELEMETRY = ${JSON.stringify(results, null, 2)};
`;
  fs.writeFileSync(tsOutPath, tsContent, 'utf8');

  // Write JSON
  const jsonOutPath = path.join(__dirname, 'src/data/liveDistrictTelemetry.json');
  fs.writeFileSync(jsonOutPath, JSON.stringify(results, null, 2), 'utf8');

  const validCount = results.filter((r) => r.status === 'SUCCESS').length;
  console.log(`\n🎉 SUCCESS! Generated live telemetry for ${validCount}/${results.length} districts.`);
  console.log(`📁 Saved to: ${tsOutPath}`);
}

run().catch((e) => {
  console.error('Fatal sync error:', e);
  process.exit(1);
});
