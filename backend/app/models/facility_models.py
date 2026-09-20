"""
Facility Data Models for India Emergency Facility Federation in THERMOSAFE.
Strict rules:
- Zero fake live data: availableBeds / availableICUBeds must be None if not provided by source.
- Freshness: LIVE (<= 15 min), RECENT (<= 120 min), STALE (> 120 min), UNKNOWN.
- Trust Score: 100 (Level 1) to 50 (Level 7).
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from datetime import datetime

class VerificationStatus:
    GOVT_VERIFIED = "Government Verified"
    ABDM_VERIFIED = "ABDM Registered"
    FACILITY_VERIFIED = "Facility Direct Verified"
    PUBLIC_DIRECTORY = "Directory Reference"
    UNVERIFIED = "Unverified"

class FreshnessLevel:
    LIVE = "LIVE"
    RECENT = "RECENT"
    STALE = "STALE"
    UNKNOWN = "UNKNOWN"

class FacilityType:
    HOSPITAL = "Emergency Hospital"
    ICU_CENTER = "ICU Facility"
    COOLING_CENTRE = "Municipal Cooling Centre"
    AMBULANCE_HUB = "Ambulance Hub"
    WATER_ORS_POINT = "Water & ORS Point"

class NormalizedFacility(BaseModel):
    facilityId: str
    facilityName: str
    facilityType: str = FacilityType.HOSPITAL
    state: str
    district: str
    city: str
    latitude: float
    longitude: float
    address: str
    phone: Optional[str] = None
    emergencyAvailable: Optional[bool] = None
    
    # Bed metrics (None means live availability is NOT provided by source)
    totalBeds: Optional[int] = None
    availableBeds: Optional[int] = None
    totalICUBeds: Optional[int] = None
    availableICUBeds: Optional[int] = None
    oxygenAvailable: Optional[bool] = None
    ambulanceAvailable: Optional[bool] = None

    # Source & Trust Metadata
    source: str
    sourceUrl: Optional[str] = None
    sourceType: str = "Government API"
    sourceTrustScore: int = Field(default=80, ge=0, le=100)
    verificationStatus: str = VerificationStatus.GOVT_VERIFIED
    
    # Audit & Freshness
    lastUpdated: Optional[str] = None
    dataAgeMinutes: Optional[int] = None
    freshness: str = FreshnessLevel.UNKNOWN
    
    # Matching lineage
    canonicalId: Optional[str] = None
    sourceReferences: List[Dict[str, Any]] = []

    @validator('availableBeds')
    def validate_beds(cls, v, values):
        if v is not None:
            if v < 0:
                raise ValueError("availableBeds cannot be negative")
            total = values.get('totalBeds')
            if total is not None and v > total:
                raise ValueError("availableBeds cannot exceed totalBeds")
        return v

    @validator('availableICUBeds')
    def validate_icu_beds(cls, v, values):
        if v is not None:
            if v < 0:
                raise ValueError("availableICUBeds cannot be negative")
            total_icu = values.get('totalICUBeds')
            if total_icu is not None and v > total_icu:
                raise ValueError("availableICUBeds cannot exceed totalICUBeds")
        return v


class NormalizedCoolingCentre(BaseModel):
    centreId: str
    name: str
    type: str = FacilityType.COOLING_CENTRE
    state: str
    district: str
    city: str
    latitude: float
    longitude: float
    address: str
    phone: Optional[str] = None
    openingTime: str = "08:00 AM"
    closingTime: str = "08:00 PM"
    currentlyOpen: bool = True
    
    # Facilities
    drinkingWater: bool = True
    ORSAvailable: bool = True
    seatingAvailable: bool = True
    airConditioning: bool = False
    shadedArea: bool = True
    accessibility: bool = True
    
    # Occupancy (None means live occupancy unavailable)
    capacity: Optional[int] = None
    currentOccupancy: Optional[int] = None

    # Trust & Freshness
    source: str
    sourceUrl: Optional[str] = None
    sourceTrustScore: int = Field(default=85, ge=0, le=100)
    verificationStatus: str = VerificationStatus.GOVT_VERIFIED
    lastUpdated: Optional[str] = None
    dataAgeMinutes: Optional[int] = None
    freshness: str = FreshnessLevel.UNKNOWN


class LiveBedUpdateRequest(BaseModel):
    facilityId: str
    updatedBy: str
    emergencyAvailable: bool = True
    totalBeds: Optional[int] = None
    availableBeds: Optional[int] = None
    totalICUBeds: Optional[int] = None
    availableICUBeds: Optional[int] = None
    oxygenAvailable: Optional[bool] = None
    ambulanceAvailable: Optional[bool] = None
    adminKey: str = "THERMOS_ADMIN_SECURE"


class CoolingCentreUpdateRequest(BaseModel):
    centreId: str
    updatedBy: str
    currentlyOpen: bool = True
    drinkingWater: bool = True
    ORSAvailable: bool = True
    seatingAvailable: bool = True
    airConditioning: bool = False
    capacity: Optional[int] = None
    currentOccupancy: Optional[int] = None
    adminKey: str = "THERMOS_ADMIN_SECURE"
