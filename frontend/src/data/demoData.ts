import { DemoScenario, ForecastData, GovernmentDashboard, HistoricalData, RiskAssessment, ThermalStressData, WeatherData, VulnerabilityData, Alert, MLPrediction } from '../types';

export const demoScenarios: DemoScenario[] = [
  { id: 'baseline', name: 'Baseline', description: 'Normal summer conditions', icon: 'Sun' },
  { id: 'heatwave_early', name: 'Early Warning', description: 'Approaching heatwave', icon: 'Thermometer' },
  { id: 'heatwave_peak', name: 'Peak Heatwave', description: 'Extreme conditions', icon: 'Flame' },
];

export const demoWeather: WeatherData = {
  temperature: 42,
  humidity: 45,
  windSpeed: 12,
  solarRadiation: 850,
  timestamp: new Date().toISOString(),
};

export const demoThermal: ThermalStressData = {
  heatIndex: 48,
  wbgt: 33,
  utci: 39,
  htss: 87,
};

export const demoRisk: RiskAssessment = {
  level: 'Extreme',
  score: 87,
  probability: 92,
  primaryFactors: [
    { factor: 'Temperature', contribution: 40 },
    { factor: 'Humidity', contribution: 30 },
    { factor: 'WBGT', contribution: 20 },
    { factor: 'Other', contribution: 10 },
  ],
  recommendations: [
    { audience: 'General', text: 'Stay indoors during peak hours (11 AM - 4 PM).', icon: 'Home', urgency: 'high' },
    { audience: 'Workers', text: 'Mandatory breaks every 30 mins.', icon: 'Briefcase', urgency: 'extreme' },
  ],
};

export const demoForecast: ForecastData = {
  timeline: [
    { time: '12:00', temperature: 40, htss: 75, riskLevel: 'High' },
    { time: '15:00', temperature: 43, htss: 88, riskLevel: 'Extreme' },
    { time: '18:00', temperature: 39, htss: 70, riskLevel: 'High' },
    { time: '21:00', temperature: 35, htss: 50, riskLevel: 'Moderate' },
  ]
};

export const demoAlerts: Alert[] = [
  { id: '1', title: 'Extreme Heat Warning', message: 'Temperatures expected to reach 45°C today.', severity: 'red', time: '10:00 AM', actions: ['Stay Hydrated', 'Avoid Sun'] }
];

export const demoVulnerability: VulnerabilityData = {
  state: 'Delhi',
  elderlyPercentage: 12,
  populationDensity: 11320,
  outdoorWorkersPercentage: 25,
  povertyPercentage: 15,
  healthcareAccess: 70,
};

export const demoGovernmentDashboard: GovernmentDashboard = {
  statesAffected: 5,
  highRiskLocations: 12,
  activeAlerts: 8,
  affectedPopulation: 25000000,
  cities: [
    { id: '1', name: 'Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi', weather: demoWeather, thermal: demoThermal, risk: demoRisk, alerts: demoAlerts }
  ]
};

export const demoHistorical: HistoricalData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  htss: [60, 65, 80, 88, 70],
  temperature: [35, 38, 42, 45, 39]
};

export const demoMLPrediction: MLPrediction = {
  timestamp: new Date().toISOString(),
  predicted_htss: 85,
  confidence: 90,
};
