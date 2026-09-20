from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class WeatherData(BaseModel):
    temp: float
    humidity: float
    wind_speed: float
    solar_radiation: float
    pressure: float
    description: str
    timestamp: datetime = Field(default_factory=datetime.now)

class ThermalStressData(BaseModel):
    heat_index: float
    heat_index_category: str
    wbgt: float
    wbgt_category: str
    utci: float
    utci_category: str
    htss_score: float
    htss_category: str
    contributions: Dict[str, float]

class Alert(BaseModel):
    id: str
    severity: str
    title: str
    message: str
    location: str
    timestamp: datetime = Field(default_factory=datetime.now)
    expires: datetime
    recommended_actions: List[str]

class RiskAssessment(BaseModel):
    location: str
    risk_level: str
    risk_score: float
    environmental_risk: float
    vulnerability_factor: float
    overall_risk: float
    thermal_stress: ThermalStressData
    weather: WeatherData
    alerts: List[Alert]
    recommendations: List[Dict[str, str]]
    timestamp: datetime = Field(default_factory=datetime.now)

class ForecastPoint(BaseModel):
    time: datetime
    temp: float
    humidity: float
    wind: float
    solar: float
    htss_score: float
    risk_level: str

class ForecastData(BaseModel):
    location: str
    forecasts: List[ForecastPoint]

class VulnerabilityData(BaseModel):
    state: str
    population: int
    density: float
    elderly_pct: float
    outdoor_workers_pct: float
    poverty_pct: float
    healthcare_access: float
    vulnerability_score: float
    vulnerability_category: str

class GISStateData(BaseModel):
    state_name: str
    risk_level: str
    temperature: float
    humidity: float
    wbgt: float
    utci: float
    htss_score: float
    heatwave_probability: float
    vulnerability_score: float

class CityData(BaseModel):
    name: str
    state: str
    lat: float
    lon: float
    temperature: float
    humidity: float
    wind_speed: float
    solar_radiation: float
    heat_index: float
    wbgt: float
    utci: float
    htss_score: float
    risk_level: str
    heatwave_probability: float

class DemoScenario(BaseModel):
    id: str
    name: str
    description: str
    conditions: Dict[str, Any]

class MLPrediction(BaseModel):
    risk_level: str
    confidence: float
    feature_importance: Dict[str, float]
    model_metrics: Dict[str, float]

class GovernmentDashboard(BaseModel):
    total_states_affected: int
    high_risk_locations: int
    active_alerts: int
    affected_population: int
    states: List[GISStateData]
    cities: List[CityData]
    alerts: List[Alert]

class HistoricalData(BaseModel):
    location: str
    years: List[Dict[str, Any]]
