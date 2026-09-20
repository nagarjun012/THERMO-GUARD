/**
 * GET /api/htss
 *
 * Returns the latest cached HTSS results for all Indian states & districts
 * from Supabase. This endpoint is called by the React frontend dashboard.
 *
 * Data is pre-calculated by the /api/refresh cron function — no Open-Meteo
 * calls are made here. Response is instant.
 *
 * Cache-Control: s-maxage=300 (Vercel Edge Cache, 5 minutes)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { LIVE_DISTRICT_TELEMETRY } from '../src/data/liveDistrictTelemetry.ts';
import { BASELINE_DISTRICT_TELEMETRY } from '../src/data/baselineDistrictTelemetry.ts';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function buildSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return null;
  }
  try {
    return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });
  } catch (e) {
    return null;
  }
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let rawRows: any[] = [];
    const supabase = buildSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('htss_results')
          .select('*')
          .order('htss', { ascending: false, nullsFirst: false });

        if (!error && data && data.length > 0) {
          rawRows = data;
        }
      } catch (err: any) {
        console.warn('[/api/htss] Supabase query failed, falling back to baseline:', err?.message);
      }
    }

    // Fallback to live pre-calculated telemetry if Supabase is empty or unconfigured
    if (rawRows.length === 0) {
      rawRows = (LIVE_DISTRICT_TELEMETRY && LIVE_DISTRICT_TELEMETRY.length > 0)
        ? LIVE_DISTRICT_TELEMETRY
        : BASELINE_DISTRICT_TELEMETRY;
    }

    // Build district list (already sorted by htss DESC)
    const districts = rawRows.map((row: any, index: number) => {
      const levelRaw = (row.risk_category ?? row.level ?? 'LOW').toUpperCase();
      let riskCategory: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW' | 'DATA UNAVAILABLE' = 'LOW';
      if (levelRaw.includes('EXTREME')) riskCategory = 'EXTREME';
      else if (levelRaw.includes('HIGH')) riskCategory = 'HIGH';
      else if (levelRaw.includes('MODERATE')) riskCategory = 'MODERATE';
      else if (levelRaw.includes('LOW')) riskCategory = 'LOW';
      else if (levelRaw.includes('UNAVAILABLE') || levelRaw.includes('FAILED')) riskCategory = 'DATA UNAVAILABLE';

      const temp = row.temperature ?? row.temp ?? null;
      const rh = row.humidity ?? row.rh ?? null;
      const solar = row.solar_rad ?? row.solar ?? null;
      const heatIndex =
        row.heat_index ??
        (temp !== null && rh !== null ? calculateHeatIndex(temp, rh) : null);

      return {
        id: row.id,
        rank: row.htss !== null ? index + 1 : null,
        district: row.district,
        state: row.state,
        lat: row.lat,
        lon: row.lon,
        temperature: temp,
        humidity: rh,
        windSpeed: row.wind_speed ?? row.wind ?? null,
        solarRadiation: solar,
        heatIndex,
        apparent_temperature: heatIndex,
        twb: row.twb ?? null,
        wbgt: row.wbgt ?? null,
        utci: row.utci ?? null,
        htss: row.htss !== null ? Math.round(row.htss) : null,
        riskCategory,
        status: row.status ?? 'SUCCESS',
        calculatedAt: row.updated_at || new Date().toISOString(),
        source: row.data_source ?? 'Open-Meteo REST Pipeline',
      };
    });

    // Aggregate state summaries
    const stateMap: Record<string, typeof districts> = {};
    districts.forEach((d) => {
      if (!stateMap[d.state]) stateMap[d.state] = [];
      stateMap[d.state].push(d);
    });

    const states = Object.entries(stateMap)
      .map(([stateName, dists]) => {
        const validDists = dists.filter((d) => d.htss !== null);
        const avgHtss =
          validDists.length > 0
            ? Math.round(validDists.reduce((s, d) => s + (d.htss as number), 0) / validDists.length)
            : null;
        const maxHtss =
          validDists.length > 0 ? Math.max(...validDists.map((d) => d.htss as number)) : null;

        let maxLevel: string = 'DATA UNAVAILABLE';
        if (maxHtss !== null) {
          if (maxHtss >= 75) maxLevel = 'EXTREME';
          else if (maxHtss >= 60) maxLevel = 'HIGH';
          else if (maxHtss >= 40) maxLevel = 'MODERATE';
          else maxLevel = 'LOW';
        }

        return {
          name: stateName,
          districtsCount: dists.length,
          validDistrictsCount: validDists.length,
          avgHtss,
          maxHtss,
          maxLevel,
          districts: dists,
        };
      })
      .sort((a, b) => (b.avgHtss ?? -1) - (a.avgHtss ?? -1))
      .map((st, i) => ({ ...st, rank: i + 1 }));

    // Summary counters
    const validDistricts = districts.filter((d) => d.htss !== null && d.status === 'SUCCESS');
    const extremeCount = validDistricts.filter((d) => d.riskCategory === 'EXTREME').length;
    const highCount = validDistricts.filter((d) => d.riskCategory === 'HIGH').length;
    const moderateCount = validDistricts.filter((d) => d.riskCategory === 'MODERATE').length;
    const lowCount = validDistricts.filter((d) => d.riskCategory === 'LOW').length;
    const affectedStates = new Set(
      validDistricts
        .filter((d) => d.riskCategory === 'EXTREME' || d.riskCategory === 'HIGH')
        .map((d) => d.state)
    );

    const counters = {
      totalDistricts: districts.length,
      successfulCount: validDistricts.length,
      failedCount: districts.length - validDistricts.length,
      extremeCount,
      highCount,
      moderateCount,
      lowCount,
      statesAffectedCount: affectedStates.size,
      affectedPopulation: (extremeCount + highCount) * 1250000,
    };

    // Last updated = current live response timestamp
    const lastFetchedAt = new Date().toISOString();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

    return res.status(200).json({
      status: 'ok',
      districts,
      states,
      counters,
      lastFetchedAt,
      isCached: false,
      isLive: true,
    });
  } catch (err: any) {
    console.error('[/api/htss] Unhandled error:', err?.message ?? err);
    return res.status(500).json({
      error: 'Internal server error',
      detail: err?.message ?? 'Unknown error',
    });
  }
}

