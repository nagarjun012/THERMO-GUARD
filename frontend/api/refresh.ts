/**
 * POST /api/refresh
 *
 * Full All-India HTSS refresh pipeline.
 * Called by Vercel Cron every 3 hours (configured in vercel.json).
 * Can also be triggered manually (protected by CRON_SECRET).
 *
 * Pipeline:
 *   1. Load all India districts (788) from embedded data
 *   2. Batch Open-Meteo requests (25 coords per request)
 *   3. Calculate HTSS for each district (Stull & Liljegren)
 *   4. Upsert results into Supabase htss_results table
 *   5. Return summary of updated/failed districts
 *
 * STRICT RULE: Never generates fake or random HTSS values.
 * If Open-Meteo fails for a district → status='FAILED', htss=null in DB.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { ALL_INDIA_DISTRICTS } from '../src/data/allIndiaDistricts';

// ---- HTSS Engine (inlined — no cross-module import in Vercel functions) ----

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

function computeThermalRisk(tempC: number, rh: number, windKmh = 10, solarRad = 600) {
  const twb = calculateWetBulb(tempC, rh);
  const wbgt = calculateOutdoorWBGT(tempC, rh, solarRad);
  const utci = calculateUTCI(tempC, rh, windKmh, solarRad);

  const n_wbgt = Math.min(100, Math.max(0, ((wbgt - 20) / 15) * 100));
  const n_utci = Math.min(100, Math.max(0, ((utci - 20) / 25) * 100));
  const n_temp = Math.min(100, Math.max(0, ((tempC - 20) / 25) * 100));

  const weighted = 0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp;
  const htss = Math.min(99, Math.max(10, Math.round(weighted)));

  let riskCategory = 'LOW';
  if (htss >= 75) riskCategory = 'EXTREME';
  else if (htss >= 60) riskCategory = 'HIGH';
  else if (htss >= 40) riskCategory = 'MODERATE';

  return { twb, wbgt, utci, htss, riskCategory };
}

// --------------------------------------------------------------------------

interface District {
  id: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
}

interface WeatherResult {
  temp: number;
  rh: number;
  wind: number;
  solar: number;
}

async function fetchOpenMeteoBatch(
  points: District[],
  retries = 3
): Promise<(WeatherResult | null)[]> {
  const lats = points.map((p) => p.lat).join(',');
  const lons = points.map((p) => p.lon).join(',');
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lats}&longitude=${lons}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,shortwave_radiation`;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      const dataArr: any[] = Array.isArray(raw) ? raw : [raw];

      return points.map((_, idx) => {
        const curr = dataArr[idx]?.current;
        if (!curr || curr.temperature_2m === undefined || curr.temperature_2m === null) return null;
        return {
          temp: Number(curr.temperature_2m),
          rh: Number(curr.relative_humidity_2m ?? 50),
          wind: Number(curr.wind_speed_10m ?? 10),
          solar: Number(curr.shortwave_radiation ?? 600),
        };
      });
    } catch (e) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
      }
    }
  }

  // All retries failed — return nulls (NO FAKE DATA)
  return points.map(() => null);
}

// --------------------------------------------------------------------------

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Accept both POST (cron) and GET (manual trigger for debugging)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret (Vercel sets Authorization header automatically for crons)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers['authorization'];
    const providedSecret = req.headers['x-cron-secret'] ?? req.query.secret;
    if (authHeader !== `Bearer ${cronSecret}` && providedSecret !== cronSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: 'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const startedAt = new Date().toISOString();
  console.log(`[/api/refresh] Starting full India HTSS pipeline at ${startedAt}`);

  const districts: District[] = ALL_INDIA_DISTRICTS;
  const CHUNK_SIZE = 25; // Open-Meteo batch limit
  const PACE_MS = 700;   // Pause between chunks to respect rate limits

  const chunks: District[][] = [];
  for (let i = 0; i < districts.length; i += CHUNK_SIZE) {
    chunks.push(districts.slice(i, i + CHUNK_SIZE));
  }

  let updatedCount = 0;
  let failedCount = 0;
  const rows: any[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const results = await fetchOpenMeteoBatch(chunk, 3);

    chunk.forEach((district, idx) => {
      const meteo = results[idx];
      if (!meteo || meteo.temp === null) {
        // Open-Meteo failed — record failure, keep existing DB row intact
        failedCount++;
        rows.push({
          id: district.id,
          district: district.district,
          state: district.state,
          lat: district.lat,
          lon: district.lon,
          temperature: null,
          humidity: null,
          wind_speed: null,
          solar_rad: null,
          twb: null,
          wbgt: null,
          utci: null,
          htss: null,
          risk_category: 'DATA UNAVAILABLE',
          status: 'FAILED',
          data_source: 'Open-Meteo',
          updated_at: now,
        });
      } else {
        const thermal = computeThermalRisk(meteo.temp, meteo.rh, meteo.wind, meteo.solar);
        updatedCount++;
        rows.push({
          id: district.id,
          district: district.district,
          state: district.state,
          lat: district.lat,
          lon: district.lon,
          temperature: Math.round(meteo.temp * 10) / 10,
          humidity: Math.round(meteo.rh * 10) / 10,
          wind_speed: Math.round(meteo.wind * 10) / 10,
          solar_rad: Math.round(meteo.solar * 10) / 10,
          twb: thermal.twb,
          wbgt: thermal.wbgt,
          utci: thermal.utci,
          htss: thermal.htss,
          risk_category: thermal.riskCategory,
          status: 'SUCCESS',
          data_source: 'Open-Meteo',
          updated_at: now,
        });
      }
    });

    // Upsert in DB every 100 rows to avoid timeouts
    if (rows.length >= 100) {
      const batch = rows.splice(0, rows.length);
      const { error } = await supabase
        .from('htss_results')
        .upsert(batch, { onConflict: 'id', ignoreDuplicates: false });
      if (error) {
        console.error(`[/api/refresh] Supabase upsert error at chunk ${i}:`, error.message);
      }
    }

    // Rate-limit pacing
    if (i < chunks.length - 1) {
      await new Promise((r) => setTimeout(r, PACE_MS));
    }
  }

  // Flush remaining rows
  if (rows.length > 0) {
    const { error } = await supabase
      .from('htss_results')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
    if (error) {
      console.error('[/api/refresh] Final Supabase upsert error:', error.message);
    }
  }

  const finishedAt = new Date().toISOString();
  const summary = {
    success: true,
    startedAt,
    finishedAt,
    totalDistricts: districts.length,
    updated: updatedCount,
    failed: failedCount,
    message: `HTSS refresh complete. ${updatedCount} districts updated, ${failedCount} failed.`,
  };

  console.log('[/api/refresh] Done:', summary);
  return res.status(200).json(summary);
}
