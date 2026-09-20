from fastapi import APIRouter
from app.services.weather_service import weather_service
from app.models.schemas import WeatherData, ForecastData

router = APIRouter()

@router.get("", response_model=WeatherData)
async def get_current_weather(lat: float, lon: float):
    return await weather_service.get_current_weather(lat, lon)

@router.get("/forecast", response_model=ForecastData)
async def get_forecast(lat: float, lon: float, hours: int = 24):
    points = await weather_service.get_forecast(lat, lon, hours)
    return ForecastData(location=f"{lat},{lon}", forecasts=points)
