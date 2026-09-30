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

export interface VulnerableGroupAlert {
  group_name: string;
  target_risk_level: string;
  vulnerability_description: string;
  recommended_interventions: string[];
  urgency: 'low' | 'medium' | 'high' | 'extreme';
}

export interface DayPrediction {
  day_offset: number;
  target_date: string;
  warning_stage: string;
  predicted_temperature_max: number;
  predicted_temperature_min: number;
  predicted_humidity: number;
  predicted_heat_index: number;
  predicted_htss: number;
  risk_level: 'Safe' | 'Low' | 'Moderate' | 'High' | 'Extreme';
  heat_health_risk_score: number;
  hospitalization_risk_index: number;
  mortality_risk_index: number;
  confidence_score: number;
  requires_human_review: boolean;
  autonomous_action_allowed: boolean;
  primary_contributing_factors: {
    factor: string;
    impact: string;
    contribution_pct: number;
  }[];
  action_checklist: string[];
}

export interface MultiDayHealthRiskForecast {
  location: string;
  generated_at: string;
  model_version: string;
  threshold_version: string;
  health_outcome_status: string;
  decision_support_notice: string;
  operating_threshold: number;
  is_live_telemetry?: boolean;
  telemetry_source?: string;
  daily_predictions: DayPrediction[];
  localized_vulnerable_alerts: VulnerableGroupAlert[];
  human_in_the_loop_protocol: {
    authorized_review_required: boolean;
    governing_principle: string;
    authorized_roles: string[];
    audit_trail_recorded: boolean;
    decision_support_disclaimer: string;
  };
}

export interface ModelBenchmark {
  model_name: string;
  validation_type: string;
  n_splits: number;
  optimal_threshold: number;
  metrics_at_default_threshold: Record<string, any>;
  metrics_at_optimized_threshold: Record<string, any>;
  decision_threshold_gain: Record<string, any>;
}

