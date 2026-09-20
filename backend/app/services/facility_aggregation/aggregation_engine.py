"""
Real-Time Facility Aggregation Engine.
Orchestrates multi-source collection, normalization, validation, deduplication,
source trust scoring, and database syncing across all Indian States and UTs.
"""

import math
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.models.facility_models import NormalizedFacility, NormalizedCoolingCentre, VerificationStatus, FreshnessLevel, FacilityType
from app.services.facility_aggregation.abdm_adapter import ABDMSourceAdapter
from app.services.facility_aggregation.cooling_centre_adapter import CoolingCentreAdapter
from app.services.facility_aggregation.database_manager import FacilityDatabaseManager

logger = logging.getLogger("facility_aggregation_engine")

class FacilityAggregationEngine:
    def __init__(self):
        self.db = FacilityDatabaseManager()
        self.abdm_adapter = ABDMSourceAdapter()
        self.cooling_adapter = CoolingCentreAdapter()

    def calculate_distance_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    async def initialize_and_sync(self):
        """Initializes and seeds database with verified ABDM & Municipal HAP feeds."""
        try:
            abdm_hospitals = await self.abdm_adapter.fetch_hospitals()
            for h in abdm_hospitals:
                self.db.upsert_facility(h)
                
            cooling_centres = await self.cooling_adapter.fetch_cooling_centres()
            for c in cooling_centres:
                self.db.upsert_cooling_centre(c)
                
            logger.info(f"Successfully synced {len(abdm_hospitals)} hospital records & {len(cooling_centres)} cooling centres.")
        except Exception as e:
            logger.error(f"Error during facility sync: {e}")

    def get_nearby_hospitals(self, lat: float, lon: float, radius_km: float = 25.0,
                             state: str = None, district: str = None) -> List[Dict[str, Any]]:
        facilities = self.db.get_facilities(state=state, district=district)
        results = []
        for f in facilities:
            dist = self.calculate_distance_km(lat, lon, f.latitude, f.longitude)
            if dist <= radius_km:
                facility_dict = f.dict()
                facility_dict["distanceKm"] = dist
                results.append(facility_dict)
                
        # Sort by distance
        results.sort(key=lambda x: x["distanceKm"])
        return results

    def get_nearby_cooling_centres(self, lat: float, lon: float, radius_km: float = 25.0,
                                    state: str = None, district: str = None) -> List[Dict[str, Any]]:
        centres = self.db.get_cooling_centres(state=state, district=district)
        results = []
        for c in centres:
            dist = self.calculate_distance_km(lat, lon, c.latitude, c.longitude)
            if dist <= radius_km:
                centre_dict = c.dict()
                centre_dict["distanceKm"] = dist
                results.append(centre_dict)

        results.sort(key=lambda x: x["distanceKm"])
        return results

    def get_data_freshness_stats(self) -> Dict[str, Any]:
        facilities = self.db.get_facilities()
        centres = self.db.get_cooling_centres()
        
        live_count = sum(1 for f in facilities if f.freshness == FreshnessLevel.LIVE)
        recent_count = sum(1 for f in facilities if f.freshness == FreshnessLevel.RECENT)
        static_count = sum(1 for f in facilities if f.freshness in [FreshnessLevel.STALE, FreshnessLevel.UNKNOWN])
        
        return {
            "totalFacilities": len(facilities),
            "totalCoolingCentres": len(centres),
            "liveCount": live_count,
            "recentCount": recent_count,
            "staticCount": static_count,
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
