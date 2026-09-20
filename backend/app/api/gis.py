from fastapi import APIRouter
from app.services.gis_service import gis_service
from app.models.schemas import CityData

router = APIRouter()

@router.get("/states")
async def get_states_geojson():
    return gis_service.get_india_states_geojson()

@router.get("/cities", response_model=list[CityData])
async def get_cities():
    return gis_service.get_cities_data()

@router.get("/state/{state_name}")
async def get_state_data(state_name: str):
    return {"state": state_name, "risk_level": "Moderate"}
