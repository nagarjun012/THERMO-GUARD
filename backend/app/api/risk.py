from fastapi import APIRouter
from app.services.weather_service import weather_service
from app.services.thermal_stress_service import thermal_stress_service
from app.services.vulnerability_service import vulnerability_service
from app.services.risk_prediction_service import risk_prediction_service
from app.services.alert_service import alert_service
from app.services.recommendation_service import recommendation_service
from app.ml.predict import predict_risk
from app.models.schemas import RiskAssessment, MLPrediction

router = APIRouter()

@router.get("", response_model=RiskAssessment)
async def get_risk(lat: float, lon: float, state: str = "Delhi"):
    weather = await weather_service.get_current_weather(lat, lon)
    thermal = thermal_stress_service.calculate_all(
        weather.temp, weather.humidity, weather.wind_speed, weather.solar_radiation
    )
    vul = vulnerability_service.get_vulnerability_data(state)
    
    risk = risk_prediction_service.assess_risk(
        location=f"{lat},{lon}", weather=weather, thermal=thermal, vul=vul
    )
    
    risk.alerts = alert_service.generate_alerts(risk.location, thermal, risk.risk_level)
    risk.recommendations = recommendation_service.get_recommendations(risk.risk_level)
    
    return risk

@router.get("/predict", response_model=MLPrediction)
async def ml_predict(lat: float, lon: float):
    weather = await weather_service.get_current_weather(lat, lon)
    return predict_risk(weather)
