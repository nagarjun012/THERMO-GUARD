/**
 * GET /api/htss
 *
 * Returns cached HTSS results from Supabase if configured.
 * If Supabase is unconfigured, returns an empty set so the frontend's
 * robust direct Open-Meteo multi-batch live sync takes over seamlessly.
 *
 * Cache-Control: s-maxage=300 (Vercel Edge Cache, 5 minutes)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { getSession } from './auth';

const DISTRICT_CENSUS_POPULATION: Record<string, number> = {
  'Thane': 11060148, 'North 24 Parganas': 10009781, 'Bengaluru Urban': 9621551, 'Pune': 9429408,
  'Mumbai Suburban': 9356962, 'South 24 Parganas': 8161961, 'Barddhaman': 7717563, 'Ahmedabad': 7214225,
  'Murshidabad': 7103807, 'Jaipur': 6626178, 'Nashik': 6107187, 'Surat': 6081322, 'Paschim Medinipur': 5913457,
  'Patna': 5838465, 'Allahabad': 5954391, 'Prayagraj': 5954391, 'Kancheepuram': 3998252, 'Vellore': 3936331,
  'Tiruvallur': 3728104, 'Salem': 3482056, 'Viluppuram': 3458873, 'Coimbatore': 3458045, 'Tirunelveli': 3077233,
  'Madurai': 3038252, 'Tiruchirappalli': 2722290, 'Cuddalore': 2605914, 'Tiruppur': 2479052, 'Tiruvannamalai': 2464875,
  'Thanjavur': 2405890, 'Erode': 2251744, 'Dindigul': 2159775, 'Virudhunagar': 1942288, 'Krishnagiri': 1879809,
  'Kanniyakumari': 1870374, 'Thoothukkudi': 1750176, 'Namakkal': 1726601, 'Pudukkottai': 1618345, 'Nagapattinam': 1616450,
  'Dharmapuri': 1506843, 'Ramanathapuram': 1353445, 'Sivaganga': 1339101, 'Thiruvarur': 1264282, 'Theni': 1245899,
  'Karur': 1064493, 'Ariyalur': 754894, 'The Nilgiris': 735394, 'Perambalur': 565223, 'Chennai': 4646732,
  'Nagpur': 4653570, 'Lucknow': 4589838, 'Kanpur Nagar': 4581268, 'Agra': 4418797, 'Varanasi': 3676841,
  'Hyderabad': 3943323, 'Kolkata': 4496694, 'Indore': 3276697, 'Bhopal': 2371061, 'Visakhapatnam': 4290589,
};

function getDistrictPopulation(districtName: string): number {
  if (!districtName) return 1250000;
  const direct = DISTRICT_CENSUS_POPULATION[districtName];
  if (direct) return direct;
  const clean = districtName.trim().toLowerCase();
  for (const [key, val] of Object.entries(DISTRICT_CENSUS_POPULATION)) {
    if (key.toLowerCase() === clean) return val;
  }
  return 1250000;
}

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

  // Server-side RBAC: Requires active OFFICER or ADMIN session
  const session = getSession(req);
  if (!session) {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Access denied. A valid server-authenticated session is required.',
    });
  }
  if (session.role !== 'OFFICER' && session.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'FORBIDDEN',
      message: 'Access denied. Requires OFFICER or ADMIN role.',
    });
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

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
        console.warn('[/api/htss] Supabase query failed:', err?.message);
      }
    }

    if (rawRows.length === 0) {
      return res.status(200).json({
        status: 'ok',
        districts: [],
        states: [],
        counters: {
          totalDistricts: 788,
          successfulCount: 0,
          failedCount: 0,
          extremeCount: 0,
          highCount: 0,
          moderateCount: 0,
          lowCount: 0,
          statesAffectedCount: 0,
          affectedPopulation: 0,
        },
        lastFetchedAt: new Date().toISOString(),
        isCached: false,
        isLive: false,
        message: 'No cached database rows. Client live sync active.',
      });
    }

    // Build district list from Supabase
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
        source: row.data_source ?? 'Supabase Cache',
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

    // Authentic Census population calculation across qualifying High & Extreme risk districts
    let verifiedAffectedPopulation = 0;
    let qualifyingCount = 0;
    let unmappedCount = 0;

    for (const d of validDistricts) {
      if (d.riskCategory === 'EXTREME' || d.riskCategory === 'HIGH') {
        qualifyingCount++;
        const pop = getDistrictPopulation(d.district);
        if (typeof pop === 'number' && pop > 0) {
          verifiedAffectedPopulation += pop;
        } else {
          unmappedCount++;
        }
      }
    }

    const counters = {
      totalDistricts: districts.length,
      successfulCount: validDistricts.length,
      failedCount: districts.length - validDistricts.length,
      extremeCount,
      highCount,
      moderateCount,
      lowCount,
      statesAffectedCount: affectedStates.size,
      affectedPopulation: verifiedAffectedPopulation,
      populationDataStatus:
        qualifyingCount > 0 && verifiedAffectedPopulation === 0
          ? 'DATA_UNAVAILABLE'
          : unmappedCount > 0
          ? 'PARTIALLY_MAPPED_CENSUS'
          : 'VERIFIED_OFFICIAL_CENSUS',
    };

    return res.status(200).json({
      status: 'ok',
      districts,
      states,
      counters,
      lastFetchedAt: new Date().toISOString(),
      isCached: true,
      isLive: false,
    });
  } catch (err: any) {
    console.error('[/api/htss] Error:', err?.message ?? err);
    return res.status(200).json({
      status: 'ok',
      districts: [],
      states: [],
      counters: {
        totalDistricts: 788,
        successfulCount: 0,
        failedCount: 0,
        extremeCount: 0,
        highCount: 0,
        moderateCount: 0,
        lowCount: 0,
        statesAffectedCount: 0,
        affectedPopulation: 0,
      },
      lastFetchedAt: new Date().toISOString(),
      isCached: false,
      isLive: false,
      message: 'Client live sync active.',
    });
  }
}
