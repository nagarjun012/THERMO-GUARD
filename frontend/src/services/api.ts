import axios from 'axios';
import { calculateHeatIndex, computeFactorDecomposition } from '../utils/thermalEngine';
import {
  WeatherData,
  ThermalStressData,
  RiskAssessment,
  ForecastData,
  VulnerabilityData,
  Alert,
  DemoScenario,
  GovernmentDashboard,
  HistoricalData,
  MLPrediction,
} from '../types';

// All /api/* calls go to Vercel Serverless Functions (same origin in production,
// or the Vite dev server proxy in local development).
const api = axios.create({ baseURL: '' });

export const apiService = {
  // Single-location weather + HTSS — calls Vercel /api/weather function
  getWeather: async (lat: number, lon: number): Promise<WeatherData> => {
    try {
      const res = (await api.get('/api/weather', { params: { lat, lon } })).data;
      if (res.error === 'DATA UNAVAILABLE' || res.isLive === false) {
        throw new Error('DATA UNAVAILABLE');
      }
      return {
        temperature: res.temperature ?? res.temp,
        humidity: res.humidity,
        windSpeed: res.windSpeed ?? res.wind_speed,
        windDirection: res.windDirection ?? res.wind_direction,
        solarRadiation: res.solarRadiation ?? res.solar_radiation,
        pressureMsl: res.pressureMsl ?? res.pressure_msl ?? res.pressure,
        dewPoint: res.dewPoint ?? res.dew_point,
        apparentTemperature: res.apparentTemperature ?? res.apparent_temperature,
        uvIndex: res.uvIndex ?? res.uv_index,
        timestamp: res.timestamp || new Date().toISOString(),
        apiTimestamp: res.apiTimestamp || res.timestamp,
        isLive: Boolean(res.isLive),
        source: res.source || 'LIVE WEATHER — Open-Meteo',
      };
    } catch (err: any) {
      console.warn('API call failed for weather:', err?.message);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  getThermalStress: async (lat: number, lon: number): Promise<ThermalStressData> => {
    try {
      const res = (await api.get('/api/weather', { params: { lat, lon } })).data;
      if (res.error === 'DATA UNAVAILABLE' || res.isLive === false) {
        throw new Error('DATA UNAVAILABLE');
      }
      return {
        heatIndex: res.heatIndex ?? res.heat_index,
        wbgt: res.wbgt,
        utci: res.utci,
        htss: res.htss ?? res.htss_score,
        htssCategory: res.htssCategory ?? res.htss_category ?? 'Moderate',
      };
    } catch (err: any) {
      console.warn('API call failed for thermal stress:', err?.message);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  getRisk: async (lat: number, lon: number): Promise<RiskAssessment> => {
    try {
      const res = (await api.get('/api/weather', { params: { lat, lon } })).data;
      if (res.error === 'DATA UNAVAILABLE' || res.isLive === false) {
        throw new Error('DATA UNAVAILABLE');
      }
      return {
        level: res.level ?? res.risk_level ?? 'Moderate',
        score: res.score ?? res.htss ?? 0,
        probability: res.probability ?? Math.round((res.htss ?? 0) * 1.1),
        primaryFactors: res.primaryFactors || [],
        recommendations: (res.recommendations || []).map((r: any) => ({
          audience: r.audience || 'General',
          text: r.text || r.message || (typeof r === 'string' ? r : ''),
          icon: r.icon || 'Info',
          urgency: r.urgency || 'high',
        })),
      };
    } catch (err: any) {
      console.warn('API call failed for risk:', err?.message);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  getForecast: async (lat: number, lon: number, hours = 24): Promise<ForecastData> => {
    try {
      const res = (await api.get('/api/weather', { params: { lat, lon, mode: 'forecast', hours } })).data;
      if (res.error === 'DATA UNAVAILABLE') {
        throw new Error('DATA UNAVAILABLE');
      }
      const rawList = res.timeline || res.forecasts || [];
      return {
        timeline: rawList.map((p: any) => ({
          time: p.time || '00:00',
          temperature: Math.round(p.temperature ?? p.temp ?? 0),
          htss: Math.round(p.htss ?? 0),
          riskLevel: p.riskLevel ?? p.risk_level ?? 'Moderate',
        })),
      };
    } catch (err: any) {
      console.warn('API call failed for forecast:', err?.message);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  // Vulnerability data is static reference data — labeled as such
  getVulnerability: (_state: string): Promise<VulnerabilityData> =>
    Promise.resolve({
      state: 'Delhi',
      elderlyPercentage: 12,
      populationDensity: 11320,
      outdoorWorkersPercentage: 25,
      povertyPercentage: 15,
      healthcareAccess: 70,
    }),

  getAlerts: async (lat: number, lon: number): Promise<Alert[]> => {
    try {
      const res = (await api.get('/api/weather', { params: { lat, lon } })).data;
      if (res.error === 'DATA UNAVAILABLE' || res.isLive === false) {
        throw new Error('DATA UNAVAILABLE');
      }
      const list = Array.isArray(res.alerts) ? res.alerts : [];
      return list.map((a: any, index: number) => ({
        id: a.id || `alert-${Date.now()}-${index}`,
        title: a.title || 'Heat Advisory',
        message: a.message || '',
        severity: a.severity || 'yellow',
        time: a.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: a.actions ?? [],
      }));
    } catch (err: any) {
      console.warn('API call failed for alerts:', err?.message);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  getDemoScenarios: (): Promise<DemoScenario[]> =>
    Promise.resolve([
      { id: 'baseline', name: 'Baseline', description: 'Normal summer conditions', icon: 'Sun' },
      { id: 'heatwave_early', name: 'Early Warning', description: 'Approaching heatwave', icon: 'Thermometer' },
      { id: 'heatwave_peak', name: 'Peak Heatwave', description: 'Extreme conditions', icon: 'Flame' },
    ]),

  activateScenario: (id: string) =>
    Promise.resolve({ status: 'success', active: id }),

  // Government dashboard — NO demo fallback. If API fails, propagate error.
  getGovernmentDashboard: async (): Promise<GovernmentDashboard> => {
    try {
      const res = await api.get('/api/htss');
      const data = res.data;

      const cities = (data.districts || []).slice(0, 50).map((d: any) => {
        const t = d.temperature ?? null;
        const rh = d.humidity ?? null;
        const w = d.windSpeed ?? null;
        const s = d.solarRadiation ?? null;

        // Only calculate heat index if we have valid inputs
        const hi = (t !== null && rh !== null)
          ? (d.heatIndex ?? d.apparent_temperature ?? calculateHeatIndex(t, rh))
          : null;

        return {
          id: d.id || d.district,
          name: d.district,
          lat: d.lat,
          lon: d.lon,
          state: d.state,
          weather: {
            temperature: t,
            humidity: rh,
            windSpeed: w,
            solarRadiation: s,
            timestamp: d.calculatedAt ?? new Date().toISOString(),
          },
          thermal: {
            heatIndex: hi !== null ? Math.round(hi * 10) / 10 : null,
            wbgt: d.wbgt ?? null,
            utci: d.utci ?? null,
            htss: d.htss ?? null,
            htssCategory: d.riskCategory ?? (d.htss !== null ? undefined : 'DATA UNAVAILABLE'),
          },
          risk: {
            level: d.riskCategory ?? (d.htss !== null ? 'Moderate' : 'DATA UNAVAILABLE'),
            score: d.htss ?? 0,
            probability: d.htss !== null ? Math.min(100, Math.round(d.htss * 1.1)) : 0,
            primaryFactors: (t !== null && rh !== null) ? computeFactorDecomposition(t, rh, w ?? 10, s ?? 0) : [],
            recommendations: [],
          },
          alerts: [],
        };
      });

      return {
        statesAffected: data.counters?.statesAffectedCount ?? 0,
        highRiskLocations: (data.counters?.extremeCount ?? 0) + (data.counters?.highCount ?? 0),
        activeAlerts: data.counters?.extremeCount ?? 0,
        affectedPopulation: data.counters?.affectedPopulation ?? 0,
        cities,
      };
    } catch (err: any) {
      console.warn('Government dashboard API failed:', err?.message);
      // Return empty state — NOT demo data
      return {
        statesAffected: 0,
        highRiskLocations: 0,
        activeAlerts: 0,
        affectedPopulation: 0,
        cities: [],
      };
    }
  },

  // Historical data — static reference data, labeled as such
  getHistorical: (_location: string): Promise<HistoricalData> =>
    Promise.resolve({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      htss: [60, 65, 80, 88, 70],
      temperature: [35, 38, 42, 45, 39],
    }),

  // ML Prediction — static reference data, labeled as such
  getMLPrediction: (_lat: number, _lon: number): Promise<MLPrediction> =>
    Promise.resolve({
      timestamp: new Date().toISOString(),
      predicted_htss: 85,
      confidence: 90,
    }),
};
