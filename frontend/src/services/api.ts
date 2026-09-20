import axios from 'axios';
import * as demoData from '../data/demoData';
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

const withFallback = async <T>(apiCall: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await apiCall();
  } catch (err) {
    console.warn('API call failed, using cached fallback:', err);
    return fallback;
  }
};

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
      console.warn('API call failed for weather:', err);
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
      console.warn('API call failed for thermal stress:', err);
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
      console.warn('API call failed for risk:', err);
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
      console.warn('API call failed for forecast:', err);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  getVulnerability: (_state: string): Promise<VulnerabilityData> =>
    // Vulnerability data is static — no backend server needed
    Promise.resolve(demoData.demoVulnerability),

  getAlerts: async (lat: number, lon: number): Promise<Alert[]> => {
    try {
      const res = (await api.get('/api/weather', { params: { lat, lon } })).data;
      if (res.error === 'DATA UNAVAILABLE' || res.isLive === false) {
        throw new Error('DATA UNAVAILABLE');
      }
      const list = Array.isArray(res.alerts) ? res.alerts : [];
      return list.map((a: any) => ({
        id: a.id || String(Math.random()),
        title: a.title || 'Heat Advisory',
        message: a.message || '',
        severity: a.severity || 'yellow',
        time: a.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: a.actions ?? [],
      }));
    } catch (err: any) {
      console.warn('API call failed for alerts:', err);
      throw new Error('DATA UNAVAILABLE');
    }
  },

  getDemoScenarios: (): Promise<DemoScenario[]> =>
    Promise.resolve(demoData.demoScenarios),

  activateScenario: (id: string) =>
    Promise.resolve({ status: 'success', active: id }),

  getGovernmentDashboard: (): Promise<GovernmentDashboard> =>
    withFallback(
      () =>
        api
          .get('/api/htss')
          .then((r) => r.data)
          .then((res: any): GovernmentDashboard => {
            const cities = (res.districts || []).slice(0, 50).map((d: any) => {
              const t = d.temperature ?? 30;
              const rh = d.humidity ?? 50;
              const w = d.windSpeed ?? 10;
              const s = d.solarRadiation ?? 300;
              const hi = d.heatIndex ?? d.apparent_temperature ?? calculateHeatIndex(t, rh);

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
                  heatIndex: Math.round(hi * 10) / 10,
                  wbgt: d.wbgt ?? 28,
                  utci: d.utci ?? 30,
                  htss: d.htss ?? 45,
                  htssCategory: d.riskCategory ?? 'Moderate',
                },
                risk: {
                  level: d.riskCategory ?? 'Moderate',
                  score: d.htss ?? 45,
                  probability: Math.min(100, Math.round((d.htss ?? 45) * 1.1)),
                  primaryFactors: computeFactorDecomposition(t, rh, w, s),
                  recommendations: [],
                },
                alerts: [],
              };
            });

            return {
              statesAffected: res.counters?.statesAffectedCount ?? 0,
              highRiskLocations: (res.counters?.extremeCount ?? 0) + (res.counters?.highCount ?? 0),
              activeAlerts: res.counters?.extremeCount ?? 0,
              affectedPopulation: res.counters?.affectedPopulation ?? 0,
              cities,
            };
          }),
      demoData.demoGovernmentDashboard
    ),

  getHistorical: (_location: string): Promise<HistoricalData> =>
    Promise.resolve(demoData.demoHistorical),

  getMLPrediction: (_lat: number, _lon: number): Promise<MLPrediction> =>
    Promise.resolve(demoData.demoMLPrediction),
};
