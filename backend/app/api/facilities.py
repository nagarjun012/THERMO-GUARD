"""
Emergency Facility API Endpoints for India Emergency Facility Federation.
Provides real-time hospital, ICU, cooling-centre query endpoints, data source trust metadata,
and admin update handlers.
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional, List, Dict, Any
import json
import os

from app.models.facility_models import LiveBedUpdateRequest, CoolingCentreUpdateRequest
from app.services.facility_aggregation.aggregation_engine import FacilityAggregationEngine
from app.services.facility_aggregation.database_manager import FacilityDatabaseManager

router = APIRouter(prefix="/api", tags=["Facilities & Emergency Support"])
engine = FacilityAggregationEngine()
db_manager = FacilityDatabaseManager()

STATE_SOURCES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "stateSources.json")

@router.on_event("startup")
async def startup_event():
    await engine.initialize_and_sync()

@router.get("/facilities/nearby")
async def get_nearby_facilities(
    lat: float = Query(..., description="Latitude of user location"),
    lon: float = Query(..., description="Longitude of user location"),
    radius_km: float = Query(25.0, description="Search radius in kilometers"),
    state: Optional[str] = None,
    district: Optional[str] = None
):
    hospitals = engine.get_nearby_hospitals(lat, lon, radius_km, state, district)
    cooling_centres = engine.get_nearby_cooling_centres(lat, lon, radius_km, state, district)
    
    return {
        "userLocation": {"latitude": lat, "longitude": lon},
        "radiusKm": radius_km,
        "totalHospitals": len(hospitals),
        "totalCoolingCentres": len(cooling_centres),
        "hospitals": hospitals,
        "coolingCentres": cooling_centres
    }

@router.get("/facilities/hospitals")
async def get_hospitals(state: Optional[str] = None, district: Optional[str] = None):
    facilities = db_manager.get_facilities(state=state, district=district)
    return [f.dict() for f in facilities]

@router.get("/facilities/icu")
async def get_icu_facilities(state: Optional[str] = None, district: Optional[str] = None):
    facilities = db_manager.get_facilities(state=state, district=district)
    icu_only = [f.dict() for f in facilities if f.totalICUBeds and f.totalICUBeds > 0]
    return icu_only

@router.get("/facilities/cooling-centres")
async def get_cooling_centres(state: Optional[str] = None, district: Optional[str] = None):
    centres = db_manager.get_cooling_centres(state=state, district=district)
    return [c.dict() for c in centres]

@router.get("/facilities/source-status")
async def get_source_status():
    if os.path.exists(STATE_SOURCES_PATH):
        with open(STATE_SOURCES_PATH, "r", encoding="utf-8") as f:
            sources = json.load(f)
            return {
                "totalStatesRegistered": len(sources),
                "stateSources": sources
            }
    return {"totalStatesRegistered": 0, "stateSources": {}}

@router.get("/health/data-freshness")
async def get_data_freshness():
    return engine.get_data_freshness_stats()

@router.get("/states/{state}/districts")
async def get_districts_by_state(state: str):
    if os.path.exists(STATE_SOURCES_PATH):
        with open(STATE_SOURCES_PATH, "r", encoding="utf-8") as f:
            sources = json.load(f)
            matched_key = None
            for s in sources:
                if s.lower() == state.lower():
                    matched_key = s
                    break
            if matched_key:
                return {
                    "state": matched_key,
                    "info": sources[matched_key]
                }
    raise HTTPException(status_code=404, detail="State sources not found")

@router.get("/heat-risk/{district}")
async def get_heat_risk_by_district(district: str):
    # Simulated IMD & THERMOS calculation for district heat risk
    return {
        "district": district,
        "thermosRiskLevel": "EXTREME",
        "htssIndex": 78.5,
        "wbgtCelsius": 31.2,
        "imdHeatwaveWarning": "RED ALERT — Severe Heatwave warning issued by IMD",
        "recommendedEmergencyActions": [
            "Keep hydration hubs open 24/7",
            "Prioritize ICU & Emergency bed readiness",
            "Distribute ORS packets at bus stations"
        ]
    }

@router.post("/admin/hospital/update")
async def admin_update_hospital(payload: LiveBedUpdateRequest):
    if payload.adminKey != "THERMOS_ADMIN_SECURE":
        raise HTTPException(status_code=401, detail="Invalid admin verification key")
        
    success = db_manager.update_hospital_live_status(
        facility_id=payload.facilityId,
        updated_by=payload.updatedBy,
        emergency_avail=payload.emergencyAvailable,
        total_beds=payload.totalBeds,
        available_beds=payload.availableBeds,
        total_icu=payload.totalICUBeds,
        available_icu=payload.availableICUBeds,
        oxygen=payload.oxygenAvailable,
        ambulance=payload.ambulanceAvailable
    )
    if not success:
        raise HTTPException(status_code=404, detail=f"Facility ID {payload.facilityId} not found")

    return {
        "status": "SUCCESS",
        "message": f"Successfully updated live bed status for facility {payload.facilityId}",
        "facilityId": payload.facilityId
    }
