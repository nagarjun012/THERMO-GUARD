"""
Database & State Storage Manager for Emergency Facilities.
Stores canonical facility records, live bed status overrides from verified hospital/municipal portals,
data freshness metrics, and sync logs.
"""

import os
import json
import sqlite3
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.facility_models import NormalizedFacility, NormalizedCoolingCentre, FreshnessLevel, VerificationStatus

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "facilities.db")

class FacilityDatabaseManager:
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_sqlite()

    def _init_sqlite(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Facilities Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS facilities (
                facilityId TEXT PRIMARY KEY,
                facilityName TEXT NOT NULL,
                facilityType TEXT NOT NULL,
                state TEXT NOT NULL,
                district TEXT NOT NULL,
                city TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                address TEXT NOT NULL,
                phone TEXT,
                emergencyAvailable INTEGER,
                totalBeds INTEGER,
                availableBeds INTEGER,
                totalICUBeds INTEGER,
                availableICUBeds INTEGER,
                oxygenAvailable INTEGER,
                ambulanceAvailable INTEGER,
                source TEXT NOT NULL,
                sourceUrl TEXT,
                sourceType TEXT NOT NULL,
                sourceTrustScore INTEGER NOT NULL,
                verificationStatus TEXT NOT NULL,
                lastUpdated TEXT NOT NULL,
                canonicalId TEXT,
                rawJson TEXT
            )
            """)

            # Live Bed Updates Table (Audit Log for Admin Submissions)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS hospital_live_status (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                facilityId TEXT NOT NULL,
                updatedBy TEXT NOT NULL,
                emergencyAvailable INTEGER,
                totalBeds INTEGER,
                availableBeds INTEGER,
                totalICUBeds INTEGER,
                availableICUBeds INTEGER,
                oxygenAvailable INTEGER,
                ambulanceAvailable INTEGER,
                timestamp TEXT NOT NULL
            )
            """)

            # Cooling Centres Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS cooling_centres (
                centreId TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                state TEXT NOT NULL,
                district TEXT NOT NULL,
                city TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                address TEXT NOT NULL,
                phone TEXT,
                openingTime TEXT,
                closingTime TEXT,
                currentlyOpen INTEGER,
                drinkingWater INTEGER,
                ORSAvailable INTEGER,
                seatingAvailable INTEGER,
                airConditioning INTEGER,
                shadedArea INTEGER,
                accessibility INTEGER,
                capacity INTEGER,
                currentOccupancy INTEGER,
                source TEXT NOT NULL,
                sourceUrl TEXT,
                sourceTrustScore INTEGER NOT NULL,
                verificationStatus TEXT NOT NULL,
                lastUpdated TEXT NOT NULL,
                rawJson TEXT
            )
            """)

            conn.commit()

    def calculate_freshness(self, last_updated_iso: str) -> (int, str):
        if not last_updated_iso:
            return None, FreshnessLevel.UNKNOWN
        try:
            # Strip trailing Z
            clean_ts = last_updated_iso.replace("Z", "")
            updated_dt = datetime.fromisoformat(clean_ts)
            now = datetime.utcnow()
            diff_minutes = max(0, int((now - updated_dt).total_seconds() / 60))
            
            if diff_minutes <= 15:
                return diff_minutes, FreshnessLevel.LIVE
            elif diff_minutes <= 120:
                return diff_minutes, FreshnessLevel.RECENT
            else:
                return diff_minutes, FreshnessLevel.STALE
        except Exception:
            return None, FreshnessLevel.UNKNOWN

    def upsert_facility(self, f: NormalizedFacility):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO facilities (
                facilityId, facilityName, facilityType, state, district, city,
                latitude, longitude, address, phone, emergencyAvailable,
                totalBeds, availableBeds, totalICUBeds, availableICUBeds,
                oxygenAvailable, ambulanceAvailable, source, sourceUrl, sourceType,
                sourceTrustScore, verificationStatus, lastUpdated, canonicalId, rawJson
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(facilityId) DO UPDATE SET
                facilityName=excluded.facilityName,
                facilityType=excluded.facilityType,
                latitude=excluded.latitude,
                longitude=excluded.longitude,
                address=excluded.address,
                phone=excluded.phone,
                emergencyAvailable=COALESCE(excluded.emergencyAvailable, facilities.emergencyAvailable),
                totalBeds=COALESCE(excluded.totalBeds, facilities.totalBeds),
                availableBeds=COALESCE(excluded.availableBeds, facilities.availableBeds),
                totalICUBeds=COALESCE(excluded.totalICUBeds, facilities.totalICUBeds),
                availableICUBeds=COALESCE(excluded.availableICUBeds, facilities.availableICUBeds),
                oxygenAvailable=COALESCE(excluded.oxygenAvailable, facilities.oxygenAvailable),
                ambulanceAvailable=COALESCE(excluded.ambulanceAvailable, facilities.ambulanceAvailable),
                source=excluded.source,
                sourceTrustScore=excluded.sourceTrustScore,
                verificationStatus=excluded.verificationStatus,
                lastUpdated=excluded.lastUpdated,
                rawJson=excluded.rawJson
            """, (
                f.facilityId, f.facilityName, f.facilityType, f.state, f.district, f.city,
                f.latitude, f.longitude, f.address, f.phone,
                1 if f.emergencyAvailable else (0 if f.emergencyAvailable is False else None),
                f.totalBeds, f.availableBeds, f.totalICUBeds, f.availableICUBeds,
                1 if f.oxygenAvailable else (0 if f.oxygenAvailable is False else None),
                1 if f.ambulanceAvailable else (0 if f.ambulanceAvailable is False else None),
                f.source, f.sourceUrl, f.sourceType, f.sourceTrustScore, f.verificationStatus,
                f.lastUpdated or datetime.utcnow().isoformat() + "Z", f.canonicalId, f.json()
            ))
            conn.commit()

    def update_hospital_live_status(self, facility_id: str, updated_by: str,
                                   emergency_avail: bool, total_beds: Optional[int],
                                   available_beds: Optional[int], total_icu: Optional[int],
                                   available_icu: Optional[int], oxygen: Optional[bool],
                                   ambulance: Optional[bool]) -> bool:
        now_str = datetime.utcnow().isoformat() + "Z"
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Check facility exists
            cursor.execute("SELECT facilityId FROM facilities WHERE facilityId=?", (facility_id,))
            if not cursor.fetchone():
                return False

            # Insert into audit log
            cursor.execute("""
            INSERT INTO hospital_live_status (
                facilityId, updatedBy, emergencyAvailable, totalBeds, availableBeds,
                totalICUBeds, availableICUBeds, oxygenAvailable, ambulanceAvailable, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                facility_id, updated_by,
                1 if emergency_avail else 0,
                total_beds, available_beds, total_icu, available_icu,
                1 if oxygen else 0, 1 if ambulance else 0, now_str
            ))

            # Update main record
            cursor.execute("""
            UPDATE facilities SET
                emergencyAvailable=?,
                totalBeds=COALESCE(?, totalBeds),
                availableBeds=?,
                totalICUBeds=COALESCE(?, totalICUBeds),
                availableICUBeds=?,
                oxygenAvailable=COALESCE(?, oxygenAvailable),
                ambulanceAvailable=COALESCE(?, ambulanceAvailable),
                source='Direct Hospital Live Portal',
                sourceTrustScore=95,
                verificationStatus=?,
                lastUpdated=?
            WHERE facilityId=?
            """, (
                1 if emergency_avail else 0,
                total_beds, available_beds, total_icu, available_icu,
                1 if oxygen else (0 if oxygen is False else None),
                1 if ambulance else (0 if ambulance is False else None),
                VerificationStatus.FACILITY_VERIFIED,
                now_str, facility_id
            ))
            conn.commit()
            return True

    def get_facilities(self, state: str = None, district: str = None) -> List[NormalizedFacility]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            query = "SELECT * FROM facilities WHERE 1=1"
            params = []
            if state:
                query += " AND LOWER(state)=LOWER(?)"
                params.append(state)
            if district:
                query += " AND LOWER(district)=LOWER(?)"
                params.append(district)
                
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            facilities = []
            for r in rows:
                data_age, freshness = self.calculate_freshness(r["lastUpdated"])
                f = NormalizedFacility(
                    facilityId=r["facilityId"],
                    facilityName=r["facilityName"],
                    facilityType=r["facilityType"],
                    state=r["state"],
                    district=r["district"],
                    city=r["city"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    address=r["address"],
                    phone=r["phone"],
                    emergencyAvailable=bool(r["emergencyAvailable"]) if r["emergencyAvailable"] is not None else None,
                    totalBeds=r["totalBeds"],
                    availableBeds=r["availableBeds"],
                    totalICUBeds=r["totalICUBeds"],
                    availableICUBeds=r["availableICUBeds"],
                    oxygenAvailable=bool(r["oxygenAvailable"]) if r["oxygenAvailable"] is not None else None,
                    ambulanceAvailable=bool(r["ambulanceAvailable"]) if r["ambulanceAvailable"] is not None else None,
                    source=r["source"],
                    sourceUrl=r["sourceUrl"],
                    sourceType=r["sourceType"],
                    sourceTrustScore=r["sourceTrustScore"],
                    verificationStatus=r["verificationStatus"],
                    lastUpdated=r["lastUpdated"],
                    dataAgeMinutes=data_age,
                    freshness=freshness,
                    canonicalId=r["canonicalId"]
                )
                facilities.append(f)
            return facilities

    def upsert_cooling_centre(self, c: NormalizedCoolingCentre):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO cooling_centres (
                centreId, name, type, state, district, city, latitude, longitude,
                address, phone, openingTime, closingTime, currentlyOpen, drinkingWater,
                ORSAvailable, seatingAvailable, airConditioning, shadedArea, accessibility,
                capacity, currentOccupancy, source, sourceUrl, sourceTrustScore,
                verificationStatus, lastUpdated, rawJson
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(centreId) DO UPDATE SET
                name=excluded.name,
                latitude=excluded.latitude,
                longitude=excluded.longitude,
                address=excluded.address,
                phone=excluded.phone,
                openingTime=excluded.openingTime,
                closingTime=excluded.closingTime,
                currentlyOpen=excluded.currentlyOpen,
                drinkingWater=excluded.drinkingWater,
                ORSAvailable=excluded.ORSAvailable,
                capacity=COALESCE(excluded.capacity, cooling_centres.capacity),
                currentOccupancy=COALESCE(excluded.currentOccupancy, cooling_centres.currentOccupancy),
                lastUpdated=excluded.lastUpdated
            """, (
                c.centreId, c.name, c.type, c.state, c.district, c.city, c.latitude, c.longitude,
                c.address, c.phone, c.openingTime, c.closingTime,
                1 if c.currentlyOpen else 0, 1 if c.drinkingWater else 0,
                1 if c.ORSAvailable else 0, 1 if c.seatingAvailable else 0,
                1 if c.airConditioning else 0, 1 if c.shadedArea else 0,
                1 if c.accessibility else 0, c.capacity, c.currentOccupancy,
                c.source, c.sourceUrl, c.sourceTrustScore, c.verificationStatus,
                c.lastUpdated or datetime.utcnow().isoformat() + "Z", c.json()
            ))
            conn.commit()

    def get_cooling_centres(self, state: str = None, district: str = None) -> List[NormalizedCoolingCentre]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            query = "SELECT * FROM cooling_centres WHERE 1=1"
            params = []
            if state:
                query += " AND LOWER(state)=LOWER(?)"
                params.append(state)
            if district:
                query += " AND LOWER(district)=LOWER(?)"
                params.append(district)

            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            centres = []
            for r in rows:
                data_age, freshness = self.calculate_freshness(r["lastUpdated"])
                c = NormalizedCoolingCentre(
                    centreId=r["centreId"],
                    name=r["name"],
                    type=r["type"],
                    state=r["state"],
                    district=r["district"],
                    city=r["city"],
                    latitude=r["latitude"],
                    longitude=r["longitude"],
                    address=r["address"],
                    phone=r["phone"],
                    openingTime=r["openingTime"],
                    closingTime=r["closingTime"],
                    currentlyOpen=bool(r["currentlyOpen"]),
                    drinkingWater=bool(r["drinkingWater"]),
                    ORSAvailable=bool(r["ORSAvailable"]),
                    seatingAvailable=bool(r["seatingAvailable"]),
                    airConditioning=bool(r["airConditioning"]),
                    shadedArea=bool(r["shadedArea"]),
                    accessibility=bool(r["accessibility"]),
                    capacity=r["capacity"],
                    currentOccupancy=r["currentOccupancy"],
                    source=r["source"],
                    sourceUrl=r["sourceUrl"],
                    sourceTrustScore=r["sourceTrustScore"],
                    verificationStatus=r["verificationStatus"],
                    lastUpdated=r["lastUpdated"],
                    dataAgeMinutes=data_age,
                    freshness=freshness
                )
                centres.append(c)
            return centres
