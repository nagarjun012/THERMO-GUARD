from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from app.services.weather_service import weather_service
from app.services.thermal_stress_service import thermal_stress_service
from app.services.vulnerability_service import vulnerability_service
from app.services.risk_prediction_service import risk_prediction_service
from app.services.alert_service import alert_service
from app.services.recommendation_service import recommendation_service
from app.ml.predict import (
    predict_risk,
    predict_multi_day_health_risk,
    get_model_comparison_benchmarks,
    get_localized_vulnerable_alerts,
)
from app.models.schemas import (
    RiskAssessment,
    MLPrediction,
    MultiDayHealthRiskForecastSchema,
    ModelBenchmarkSchema,
    VulnerableGroupAlertSchema,
)

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

@router.get("/health-prediction", response_model=MultiDayHealthRiskForecastSchema)
async def get_health_prediction(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0),
    temp: Optional[float] = Query(None, description="Optional override temperature in Celsius"),
    humidity: Optional[float] = Query(None, description="Optional override relative humidity"),
):
    """
    3 to 5 Day Heat-Health Warning Horizon.
    Provides predicted risk, potential hospitalization surge index, and potential mortality index.
    Flagged with human-in-the-loop review requirement and unlinked health outcome disclaimer.
    """
    try:
        if temp is None or humidity is None:
            weather = await weather_service.get_current_weather(lat, lon)
            current_temp = weather.temp
            current_rh = weather.humidity
            wind = weather.wind_speed
            solar = weather.solar_radiation
        else:
            current_temp = temp
            current_rh = humidity
            wind = 10.0
            solar = 650.0

        return predict_multi_day_health_risk(
            lat=lat,
            lon=lon,
            current_temp=current_temp,
            current_rh=current_rh,
            wind_speed=wind,
            solar_radiation=solar,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Health risk prediction pipeline unavailable: {str(exc)}"
        )

@router.get("/benchmarks", response_model=List[ModelBenchmarkSchema])
async def get_benchmarks():
    """
    Returns transparent TimeSeriesSplit cross-validation benchmarks comparing candidate models
    (HistGradientBoosting, RandomForest, LogisticRegression) and asymmetric threshold tuning gains.
    """
    try:
        return get_model_comparison_benchmarks()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Benchmark evaluation error: {str(exc)}")

@router.get("/vulnerable-alerts", response_model=List[VulnerableGroupAlertSchema])
async def get_vulnerable_alerts(
    risk_level: str = Query("High", regex="^(Safe|Low|Moderate|High|Extreme)$"),
    location: str = Query("Local District")
):
    """
    Returns localized advisories for recognized vulnerable groups (elderly, laborers, children, chronic cardiac).
    """
    return get_localized_vulnerable_alerts(risk_level, location)
