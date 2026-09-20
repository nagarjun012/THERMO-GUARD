"""
Base Abstract Adapter for Facility Data Sources.
"""

from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.models.facility_models import NormalizedFacility, NormalizedCoolingCentre

class BaseFacilityAdapter(ABC):
    def __init__(self, source_name: str, trust_score: int):
        self.source_name = source_name
        self.trust_score = trust_score

    @abstractmethod
    async def fetch_hospitals(self, state: str = None, district: str = None) -> List[NormalizedFacility]:
        pass

    @abstractmethod
    async def fetch_cooling_centres(self, state: str = None, district: str = None) -> List[NormalizedCoolingCentre]:
        pass
