from fastapi import APIRouter
from app.services.weather_service import weather_service
from app.services.thermal_stress_service import thermal_stress_service
from app.models.schemas import ForecastData

router = APIRouter()

@router.get("", response_model=ForecastData)
async def get_forecast_data(lat: float, lon: float, hours: int = 72):
    points = await weather_service.get_forecast(lat, lon, hours)
    
    # Enrich with thermal stress
    for p in points:
        ts = thermal_stress_service.calculate_all(p.temp, p.humidity, p.wind, p.solar)
        p.htss_score = ts.htss_score
        p.risk_level = ts.htss_category
        
    return ForecastData(location=f"{lat},{lon}", forecasts=points)
