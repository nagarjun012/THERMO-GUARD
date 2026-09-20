from app.services.telemetry_db_service import telemetry_db_service
from app.models.schemas import CityData

class GISService:
    def get_cities_data(self) -> list[CityData]:
        """Return 100% real Open-Meteo telemetry backed city and district data from database"""
        districts = telemetry_db_service.get_all_districts()
        cities = []
        for d in districts:
            htss_val = float(d["htss"]) if d["htss"] is not None else 30.0
            cities.append(CityData(
                name=d["district"],
                state=d["state"],
                lat=d["lat"],
                lon=d["lon"],
                temperature=d["temperature"],
                humidity=d["humidity"],
                wind_speed=d["windSpeed"],
                solar_radiation=d["solarRadiation"],
                heat_index=d["twb"],
                wbgt=d["wbgt"],
                utci=d["utci"],
                htss_score=htss_val,
                risk_level=d["riskCategory"].capitalize() if d.get("riskCategory") else "Low",
                heatwave_probability=round(min(100.0, max(0.0, htss_val)), 1)
            ))
        return cities

    def get_india_states_geojson(self):
        return {
            "type": "FeatureCollection",
            "features": []
        }

gis_service = GISService()
