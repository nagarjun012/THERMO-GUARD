/**
 * useAllIndiaLiveTelemetry
 *
 * Reads pre-calculated HTSS data from the Vercel /api/htss endpoint (Supabase cache).
 * No Open-Meteo calls happen in the browser — data is always server-side calculated.
 *
 * Previously: browser fetched Open-Meteo in batches directly.
 * Now: /api/htss → Supabase → this hook → React components.
 */
import { useState, useEffect, useMemo } from 'react';
import { getDistrictPopulation } from '../data/districtPopulations';

export interface LiveDistrictData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  temperature: number;
  rh: number;
  wind: number;
  wbgt: number;
  utci: number;
  htss: number;
  level: 'Extreme' | 'High' | 'Moderate' | 'Low';
  alertsCount: number;
  isLiveApi: boolean;
}

export interface LiveStateSummary {
  name: string;
  districtsCount: number;
  maxHtss: number;
  avgHtss: number;
  maxLevel: 'Extreme' | 'High' | 'Moderate' | 'Low';
  districts: LiveDistrictData[];
}

export interface LiveOverviewStats {
  statesAffected: number;
  highRiskLocations: number;
  activeAlerts: number;
  affectedPopulation: number;
}

function riskCategoryToLevel(cat: string): 'Extreme' | 'High' | 'Moderate' | 'Low' {
  if (cat === 'EXTREME') return 'Extreme';
  if (cat === 'HIGH') return 'High';
  if (cat === 'MODERATE') return 'Moderate';
  return 'Low';
}

export function useAllIndiaLiveTelemetry() {
  const [rawDistricts, setRawDistricts] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [dataStatus, setDataStatus] = useState<'ok' | 'no_data' | 'error'>('ok');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLiveLoading(true);
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);
        const res = await fetch('/api/htss', { signal: controller.signal });
        clearTimeout(timer);

        if (!res.ok) throw new Error(`/api/htss HTTP ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        if (data.status === 'no_data' || !data.districts?.length) {
          setDataStatus('no_data');
          setRawDistricts([]);
          setLoadedCount(0);
          return;
        }

        setDataStatus('ok');
        setRawDistricts(data.districts);
        setLoadedCount(data.districts.filter((d: any) => d.htss !== null).length);
      } catch (err) {
        if (!cancelled) {
          console.warn('[useAllIndiaLiveTelemetry] Fetch error:', err);
          setDataStatus('error');
          setRawDistricts([]);
          setLoadedCount(0);
        }
      } finally {
        if (!cancelled) setIsLiveLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const districts: LiveDistrictData[] = useMemo(() => {
    if (!rawDistricts.length) return [];

    return rawDistricts
      .filter((d) => d.htss !== null)
      .map((d) => ({
        id: d.id,
        name: d.district,
        state: d.state,
        lat: d.lat,
        lon: d.lon,
        temperature: d.temperature ?? 0,
        rh: d.humidity ?? 0,
        wind: d.windSpeed ?? 0,
        wbgt: d.wbgt ?? 0,
        utci: d.utci ?? 0,
        htss: d.htss,
        level: riskCategoryToLevel(d.riskCategory),
        alertsCount: d.htss >= 75 ? 3 : d.htss >= 60 ? 2 : d.htss >= 40 ? 1 : 0,
        isLiveApi: true,
      }))
      .sort((a, b) => b.htss - a.htss);
  }, [rawDistricts]);

  const states: LiveStateSummary[] = useMemo(() => {
    const map: Record<string, LiveDistrictData[]> = {};
    districts.forEach((d) => {
      if (!map[d.state]) map[d.state] = [];
      map[d.state].push(d);
    });

    return Object.entries(map)
      .map(([name, dists]) => {
        const maxHtss = Math.max(...dists.map((d) => d.htss));
        const avgHtss = Math.round(dists.reduce((s, d) => s + d.htss, 0) / dists.length);
        let maxLevel: 'Extreme' | 'High' | 'Moderate' | 'Low' = 'Low';
        if (maxHtss >= 75) maxLevel = 'Extreme';
        else if (maxHtss >= 60) maxLevel = 'High';
        else if (maxHtss >= 40) maxLevel = 'Moderate';
        return { name, districtsCount: dists.length, maxHtss, avgHtss, maxLevel, districts: dists };
      })
      .sort((a, b) => b.maxHtss - a.maxHtss);
  }, [districts]);

  const overviewStats: LiveOverviewStats = useMemo(() => {
    const highRisk = districts.filter((d) => d.level === 'High' || d.level === 'Extreme');
    const verifiedPop = highRisk.reduce((sum, d) => {
      const pop = getDistrictPopulation(d.name);
      return sum + (typeof pop === 'number' ? pop : 0);
    }, 0);
    return {
      statesAffected: new Set(highRisk.map((d) => d.state)).size,
      highRiskLocations: highRisk.length,
      activeAlerts: districts.reduce((s, d) => s + d.alertsCount, 0),
      affectedPopulation: verifiedPop,
    };
  }, [districts]);

  return {
    districts,
    states,
    overviewStats,
    isLiveLoading,
    loadedCount,
    totalDistricts: 788,
    dataStatus,
  };
}
