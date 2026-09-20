from app.models.schemas import RiskAssessment, WeatherData, ThermalStressData, VulnerabilityData
from datetime import datetime

class RiskPredictionService:
    def assess_risk(self, location: str, weather: WeatherData, thermal: ThermalStressData, vul: VulnerabilityData) -> RiskAssessment:
        env_risk = thermal.htss_score
        vul_factor = vul.vulnerability_score
        
        overall = (env_risk * 0.7) + (vul_factor * 0.3)
        
        level = "Low"
        if overall >= 75: level = "Extreme"
        elif overall >= 60: level = "High"
        elif overall >= 40: level = "Moderate"

        return RiskAssessment(
            location=location,
            risk_level=level,
            risk_score=round(overall, 1),
            environmental_risk=round(env_risk, 1),
            vulnerability_factor=round(vul_factor, 1),
            overall_risk=round(overall, 1),
            thermal_stress=thermal,
            weather=weather,
            alerts=[], # Will be populated by AlertService
            recommendations=[],
            timestamp=datetime.now()
        )

    def calculate_heatwave_probability(self, temp: float, humidity: float, consecutive_days: int, region_type: str) -> float:
        # IMD Thresholds
        thresh = 40.0
        if region_type == "coastal": thresh = 37.0
        elif region_type == "hilly": thresh = 30.0

        if temp < thresh: return 0.0
        
        diff = temp - thresh
        prob = min(100, (diff * 10) + (consecutive_days * 15))
        return prob

risk_prediction_service = RiskPredictionService()
