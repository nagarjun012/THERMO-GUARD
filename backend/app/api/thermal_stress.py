from fastapi import APIRouter
from app.services.weather_service import weather_service
from app.services.thermal_stress_service import thermal_stress_service
from app.models.schemas import ThermalStressData

router = APIRouter()

@router.get("", response_model=ThermalStressData)
async def get_thermal_stress(lat: float, lon: float):
    weather = await weather_service.get_current_weather(lat, lon)
    return thermal_stress_service.calculate_all(
        temp_c=weather.temp,
        humidity=weather.humidity,
        wind_kmh=weather.wind_speed,
        solar_rad=weather.solar_radiation
    )

@router.get("/score")
async def get_thermal_stress_score(lat: float, lon: float):
    data = await get_thermal_stress(lat, lon)
    return {"htss_score": data.htss_score, "category": data.htss_category}
