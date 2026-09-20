from fastapi import APIRouter, BackgroundTasks
from app.models.schemas import GovernmentDashboard, HistoricalData
from app.api.gis import get_cities
from app.api.alerts import get_all_alerts
from app.services.telemetry_db_service import telemetry_db_service
from datetime import datetime

router = APIRouter()

@router.get("/government/pipeline")
async def get_gov_telemetry_pipeline():
    """Return 100% real database-backed district and state HTSS rankings for all 788 districts across India"""
    districts = telemetry_db_service.get_all_districts()
    states = telemetry_db_service.get_state_summaries(districts)
    counters = telemetry_db_service.get_summary_counters(districts)
    
    latest_ts = districts[0]["calculatedAt"] if districts else datetime.now().isoformat()
    
    return {
        "districts": districts,
        "states": states,
        "counters": counters,
        "lastFetchedAt": latest_ts,
        "isCached": True
    }

@router.post("/government/refresh")
async def refresh_gov_telemetry_pipeline(background_tasks: BackgroundTasks):
    """Trigger background refresh of Open-Meteo REST telemetry for all 788 districts"""
    background_tasks.add_task(telemetry_db_service.refresh_openmeteo_telemetry)
    return {"status": "refresh_initiated", "message": "Fetching Open-Meteo live weather for all 788 districts in background"}

@router.get("/government", response_model=GovernmentDashboard)
async def get_gov_dashboard():
    cities = await get_cities()
    alerts = await get_all_alerts()
    high_risk_cities = sum(1 for c in cities if c.risk_level in ["High", "Extreme"])
    
    return GovernmentDashboard(
        total_states_affected=5,
        high_risk_locations=high_risk_cities,
        active_alerts=len(alerts),
        affected_population=15000000,
        states=[],
        cities=cities,
        alerts=alerts
    )

@router.get("/overview")
async def get_overview():
    return {"status": "operational", "active_incidents": 2}

@router.get("/historical", response_model=list[HistoricalData])
async def get_historical(location: str = "Delhi", years: int = 5):
    return [HistoricalData(
        location=location,
        years=[
            {"year": 2020, "avg_temp": 39.2, "heatwave_days": 5},
            {"year": 2021, "avg_temp": 39.9, "heatwave_days": 6},
            {"year": 2022, "avg_temp": 40.8, "heatwave_days": 8},
            {"year": 2023, "avg_temp": 41.5, "heatwave_days": 9},
            {"year": 2024, "avg_temp": 42.1, "heatwave_days": 12}
        ]
    )]
