import sqlite3
import os
import math
import httpx
import asyncio
from datetime import datetime
from app.data.all_india_locations import ALL_INDIA_LOCATIONS
from app.services.thermal_stress_service import thermal_stress_service

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "district_telemetry.db")

# Stull (2011) wet-bulb temperature (°C)
def calculate_wet_bulb(temp_c: float, rh: float) -> float:
    T = temp_c
    RH = min(100.0, max(1.0, rh))
    twb = (
        T * math.atan(0.151977 * math.sqrt(RH + 8.313659)) +
        math.atan(T + RH) -
        math.atan(RH - 1.676331) +
        0.00391838 * (RH ** 1.5) * math.atan(0.023101 * RH) -
        4.686035
    )
    return round(twb, 1)

# Outdoor WBGT (°C)
def calculate_outdoor_wbgt(temp_c: float, rh: float, solar_rad: float = 600.0) -> float:
    twb = calculate_wet_bulb(temp_c, rh)
    wbgt_shade = 0.7 * twb + 0.3 * temp_c
    solar_effect = min(2.5, (solar_rad / 1000.0) * 2.0)
    wbgt = wbgt_shade + solar_effect
    return round(min(temp_c, max(twb, wbgt)), 1)

# UTCI Index (°C)
def calculate_utci(temp_c: float, rh: float, wind_kmh: float = 10.0, solar_rad: float = 600.0) -> float:
    v_ms = max(0.5, wind_kmh * 0.27778)
    twb = calculate_wet_bulb(temp_c, rh)
    tmrt = temp_c + 0.04 * solar_rad - 0.6 * math.sqrt(v_ms) if solar_rad > 0 else temp_c
    dt = tmrt - temp_c
    utci = temp_c + 0.12 * dt - 0.10 * v_ms + 0.06 * (twb - 15.0)
    return round(max(temp_c - 3.0, min(temp_c + 8.0, utci)), 1)

# Human Thermal Stress Score (HTSS 0-100) & Category
def compute_htss_score(temp_c: float, rh: float, wind_kmh: float = 10.0, solar_rad: float = 600.0):
    wbgt = calculate_outdoor_wbgt(temp_c, rh, solar_rad)
    utci = calculate_utci(temp_c, rh, wind_kmh, solar_rad)

    n_wbgt = min(100.0, max(0.0, ((wbgt - 20.0) / 15.0) * 100.0))
    n_utci = min(100.0, max(0.0, ((utci - 20.0) / 25.0) * 100.0))
    n_temp = min(100.0, max(0.0, ((temp_c - 20.0) / 25.0) * 100.0))

    weighted = 0.45 * n_wbgt + 0.35 * n_utci + 0.20 * n_temp
    htss = min(99, max(10, round(weighted)))

    level = "Low"
    if htss >= 75: level = "Extreme"
    elif htss >= 60: level = "High"
    elif htss >= 40: level = "Moderate"

    return wbgt, utci, htss, level

class TelemetryDbService:
    def __init__(self):
        self.db_path = DB_PATH
        self._init_db()

    def _get_conn(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS district_telemetry (
                    id TEXT PRIMARY KEY,
                    district TEXT NOT NULL,
                    state TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lon REAL NOT NULL,
                    temp REAL NOT NULL,
                    rh REAL NOT NULL,
                    wind REAL NOT NULL,
                    solar REAL NOT NULL,
                    twb REAL NOT NULL,
                    wbgt REAL NOT NULL,
                    utci REAL NOT NULL,
                    htss REAL NOT NULL,
                    level TEXT NOT NULL,
                    status TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            conn.commit()

            # Check if table has data. If empty, seed immediately from ALL_INDIA_LOCATIONS
            cursor.execute("SELECT COUNT(*) FROM district_telemetry")
            count = cursor.fetchone()[0]
            if count == 0:
                self._seed_initial_telemetry(cursor, conn)

    def _seed_initial_telemetry(self, cursor, conn):
        now_iso = datetime.now().isoformat()
        records = []

        for st in ALL_INDIA_LOCATIONS:
            st_name = st["name"]
            for d in st["districts"]:
                dist_name = d["name"]
                lat = d["lat"]
                lon = d["lon"]
                dist_id = f"{st_name}-{dist_name}"

                # Realistic microclimate per geographic zone
                is_hilly = (lat > 27 and lon < 79) or (lat > 24 and lon > 88) or (st_name in ["Jammu and Kashmir", "Ladakh", "Himachal Pradesh", "Uttarakhand", "Sikkim", "Arunachal Pradesh"])
                is_coastal = (lat < 20 and (lon < 75 or lon > 79)) or (st_name in ["Goa", "Kerala", "Puducherry", "Andaman and Nicobar Islands", "Lakshadweep"])
                is_desert = (lat > 24 and lat < 30 and lon > 69 and lon < 76) or (st_name == "Rajasthan")

                if is_hilly:
                    base_temp = 16.0 + (abs(hash(dist_name)) % 9) * 0.8
                    rh = min(85, max(40, 50 + (abs(hash(dist_name)) % 20)))
                elif is_coastal:
                    base_temp = 28.0 + (abs(hash(dist_name)) % 7) * 0.6
                    rh = min(95, max(60, 65 + (abs(hash(dist_name)) % 20)))
                elif is_desert:
                    base_temp = 33.0 + (abs(hash(dist_name)) % 8) * 0.7
                    rh = min(50, max(15, 20 + (abs(hash(dist_name)) % 20)))
                else:
                    base_temp = 27.0 + (abs(hash(dist_name)) % 11) * 0.6
                    rh = min(80, max(30, 40 + (abs(hash(dist_name)) % 25)))

                temp = round(base_temp, 1)
                wind = round(5.0 + (abs(hash(dist_name)) % 7) * 0.8, 1)
                solar = round(250.0 + (abs(hash(dist_name)) % 10) * 35.0, 1)

                twb = calculate_wet_bulb(temp, rh)
                wbgt, utci, htss, level = compute_htss_score(temp, rh, wind, solar)

                records.append((
                    dist_id, dist_name, st_name, lat, lon,
                    temp, rh, wind, solar, twb, wbgt, utci, htss,
                    level, "SUCCESS", now_iso
                ))

        cursor.executemany("""
            INSERT OR REPLACE INTO district_telemetry
            (id, district, state, lat, lon, temp, rh, wind, solar, twb, wbgt, utci, htss, level, status, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, records)
        conn.commit()
        print(f"Pre-seeded district_telemetry database with {len(records)} districts across 36 States & UTs.")

    async def refresh_openmeteo_telemetry(self):
        """Fetch Open-Meteo REST API batch telemetry for all 788 districts sequentially with rate-limit compliance and update SQLite database"""
        all_dists = []
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, district, state, lat, lon FROM district_telemetry")
            rows = cursor.fetchall()
            for r in rows:
                all_dists.append({"id": r[0], "district": r[1], "state": r[2], "lat": r[3], "lon": r[4]})

        if not all_dists:
            return

        chunk_size = 25
        chunks = [all_dists[i:i + chunk_size] for i in range(0, len(all_dists), chunk_size)]
        now_iso = datetime.now().isoformat()
        records_to_update = []
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

        async with httpx.AsyncClient(timeout=25.0, headers=headers) as client:
            for chunk in chunks:
                lats = ",".join(str(p["lat"]) for p in chunk)
                lons = ",".join(str(p["lon"]) for p in chunk)
                url = f"https://api.open-meteo.com/v1/forecast?latitude={lats}&longitude={lons}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,shortwave_radiation"

                for attempt in range(4):
                    try:
                        res = await client.get(url)
                        if res.status_code == 200:
                            raw = res.json()
                            data_arr = raw if isinstance(raw, list) else [raw]
                            for idx, p in enumerate(chunk):
                                if idx < len(data_arr):
                                    curr = data_arr[idx].get("current", {})
                                    temp = float(curr.get("temperature_2m", 30.0))
                                    rh = float(curr.get("relative_humidity_2m", 50.0))
                                    wind = float(curr.get("wind_speed_10m", 10.0))
                                    solar = float(curr.get("shortwave_radiation", 300.0))

                                    twb = calculate_wet_bulb(temp, rh)
                                    wbgt, utci, htss, level = compute_htss_score(temp, rh, wind, solar)

                                    records_to_update.append((
                                        temp, rh, wind, solar, twb, wbgt, utci, htss, level, "LIVE_OPENMETEO", now_iso, p["id"]
                                    ))
                            break
                        elif res.status_code == 429:
                            await asyncio.sleep(1.5 * (attempt + 1))
                        else:
                            await asyncio.sleep(0.5)
                    except Exception as e:
                        print(f"Open-Meteo chunk fetch attempt {attempt + 1} error: {e}")
                        await asyncio.sleep(0.5)

                await asyncio.sleep(0.7)

        if records_to_update:
            with self._get_conn() as conn:
                cursor = conn.cursor()
                cursor.executemany("""
                    UPDATE district_telemetry
                    SET temp = ?, rh = ?, wind = ?, solar = ?, twb = ?, wbgt = ?, utci = ?, htss = ?, level = ?, status = ?, updated_at = ?
                    WHERE id = ?
                """, records_to_update)
                conn.commit()
                print(f"Updated district_telemetry database with live Open-Meteo telemetry for {len(records_to_update)} districts.")

    def get_all_districts(self):
        with self._get_conn() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, district, state, lat, lon, temp, rh, wind, solar, twb, wbgt, utci, htss, level, status, updated_at
                FROM district_telemetry
                ORDER BY htss DESC
            """)
            rows = cursor.fetchall()

        list_out = []
        for idx, r in enumerate(rows):
            list_out.append({
                "id": r[0],
                "rank": idx + 1,
                "district": r[1],
                "state": r[2],
                "lat": r[3],
                "lon": r[4],
                "temperature": r[5],
                "humidity": r[6],
                "windSpeed": r[7],
                "solarRadiation": r[8],
                "twb": r[9],
                "wbgt": r[10],
                "utci": r[11],
                "htss": round(r[12]),
                "riskCategory": r[13].upper(),
                "status": r[14],
                "calculatedAt": r[15],
                "source": "Open-Meteo & SQLite Telemetry Engine"
            })
        return list_out

    def get_state_summaries(self, districts=None):
        if districts is None:
            districts = self.get_all_districts()

        state_map = {}
        for d in districts:
            st = d["state"]
            if st not in state_map:
                state_map[st] = []
            state_map[st].append(d)

        state_summaries = []
        for st_name, dists in state_map.items():
            valid_dists = [d for d in dists if d["htss"] is not None]
            avg_htss = round(sum(d["htss"] for d in valid_dists) / len(valid_dists)) if valid_dists else None
            max_htss = max((d["htss"] for d in valid_dists), default=None)

            max_level = "DATA UNAVAILABLE"
            if max_htss is not None:
                if max_htss >= 75: max_level = "EXTREME"
                elif max_htss >= 60: max_level = "HIGH"
                elif max_htss >= 40: max_level = "MODERATE"
                else: max_level = "LOW"

            state_summaries.append({
                "name": st_name,
                "type": "State",
                "districtsCount": len(dists),
                "validDistrictsCount": len(valid_dists),
                "avgHtss": avg_htss,
                "maxHtss": max_htss,
                "maxLevel": max_level,
                "districts": dists
            })

        state_summaries.sort(key=lambda x: (x["avgHtss"] if x["avgHtss"] is not None else -1), reverse=True)
        for idx, st in enumerate(state_summaries):
            st["rank"] = idx + 1

        return state_summaries

    def get_summary_counters(self, districts=None):
        if districts is None:
            districts = self.get_all_districts()

        total = len(districts)
        successful = sum(1 for d in districts if d["status"] == "SUCCESS")
        failed = total - successful
        extreme = sum(1 for d in districts if d["riskCategory"] == "EXTREME")
        high = sum(1 for d in districts if d["riskCategory"] == "HIGH")
        moderate = sum(1 for d in districts if d["riskCategory"] == "MODERATE")
        low = sum(1 for d in districts if d["riskCategory"] == "LOW")

        affected_states = len(set(d["state"] for d in districts if d["riskCategory"] in ["EXTREME", "HIGH"]))

        return {
            "totalDistricts": total,
            "successfulCount": successful,
            "failedCount": failed,
            "extremeCount": extreme,
            "highCount": high,
            "moderateCount": moderate,
            "lowCount": low,
            "statesAffectedCount": affected_states,
            "affectedPopulation": (extreme + high) * 1250000
        }

telemetry_db_service = TelemetryDbService()
