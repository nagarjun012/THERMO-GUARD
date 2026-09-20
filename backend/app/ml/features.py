import pandas as pd
from app.models.schemas import WeatherData

def extract_features(weather: WeatherData) -> pd.DataFrame:
    # Feature engineering for ML model
    features = {
        'temp': [weather.temp],
        'humidity': [weather.humidity],
        'wind_speed': [weather.wind_speed],
        'solar_radiation': [weather.solar_radiation],
        'pressure': [weather.pressure],
        'temp_humidity_interaction': [weather.temp * weather.humidity / 100.0],
        'is_peak_summer': [1 if 4 <= weather.timestamp.month <= 6 else 0]
    }
    return pd.DataFrame(features)
