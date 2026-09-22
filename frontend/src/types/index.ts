export interface AirQualityTelemetry {
  pm25: number;
  pm10: number;
  ozone: number;
  aqi: number;
  aqiCategory: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection?: number;
  solarRadiation: number;
  pressureMsl?: number;
  dewPoint?: number;
  apparentTemperature?: number;
  uvIndex?: number;
  timestamp: string;
  apiTimestamp?: string;
  isLive?: boolean;
  source?: string;
  airQuality?: AirQualityTelemetry;
  aqi?: number;
  chpi?: number;
}

export interface ThermalStressData {
  heatIndex: number;
  wbgt: number;
  utci: number;
  htss: number;
  htssCategory?: string;
}

export interface RiskAssessment {
  level: string; // 'Safe', 'Low', 'Moderate', 'High', 'Extreme'
  score: number;
  probability: number;
  primaryFactors: { factor: string; contribution: number }[];
  recommendations: { audience: string; text: string; icon: string; urgency: string }[];
}

export interface ForecastPoint {
  time: string;
  temperature: number;
  htss: number;
  riskLevel: string;
}

export interface ForecastData {
  timeline: ForecastPoint[];
}

export interface VulnerabilityData {
  state: string;
  elderlyPercentage: number;
  populationDensity: number;
  outdoorWorkersPercentage: number;
  povertyPercentage: number;
  healthcareAccess: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: string;
  time: string;
  actions: string[];
}

export interface CityData {
  id: string;
  name: string;
  lat: number;
  lon: number;
  state: string;
  weather: WeatherData;
  thermal: ThermalStressData;
  risk: RiskAssessment;
  alerts: Alert[];
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MLPrediction {
  timestamp: string;
  predicted_htss: number;
  confidence: number;
}

export interface GovernmentDashboard {
  statesAffected: number;
  highRiskLocations: number;
  activeAlerts: number;
  affectedPopulation: number;
  cities: CityData[];
}

export interface HistoricalData {
  labels: string[];
  htss: number[];
  temperature: number[];
}
