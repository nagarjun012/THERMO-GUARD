DEMO_SCENARIOS = {
    "normal": {
        "id": "normal",
        "name": "Normal Summer Day",
        "description": "Typical summer conditions across India with manageable heat.",
        "conditions": {
            "temp_offset": 0.0,
            "rh_offset": 0.0,
            "wind_base": 12.0,
            "solar_base": 600.0,
            "description": "Sunny"
        }
    },
    "severe_heatwave": {
        "id": "severe_heatwave",
        "name": "Severe Heatwave (North/Central)",
        "description": "Severe heatwave conditions affecting plains of North and Central India.",
        "conditions": {
            "temp_offset": 5.0,
            "rh_offset": -10.0,
            "wind_base": 5.0,
            "solar_base": 850.0,
            "description": "Severe Heatwave"
        }
    },
    "extreme_heatwave": {
        "id": "extreme_heatwave",
        "name": "Extreme Heatwave",
        "description": "Extreme widespread heatwave pushing temperatures close to 50°C in some regions.",
        "conditions": {
            "temp_offset": 8.0,
            "rh_offset": -15.0,
            "wind_base": 3.0,
            "solar_base": 950.0,
            "description": "Extreme Heat"
        }
    },
    "coastal_heat": {
        "id": "coastal_heat",
        "name": "Coastal Humid Heat",
        "description": "High humidity combined with elevated temperatures along the coast lines, causing high WBGT.",
        "conditions": {
            "temp_offset": 3.0,
            "rh_offset": 15.0,
            "wind_base": 8.0,
            "solar_base": 700.0,
            "description": "Humid Heat"
        }
    },
    "dry_heat": {
        "id": "dry_heat",
        "name": "Dry Extreme Heat",
        "description": "Extremely dry and hot winds (Loo) in the northwestern regions.",
        "conditions": {
            "temp_offset": 7.0,
            "rh_offset": -25.0,
            "wind_base": 18.0,
            "solar_base": 920.0,
            "description": "Dry Heat (Loo)"
        }
    }
}
