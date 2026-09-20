from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DEBUG: bool = True
    SECRET_KEY: str = "thermosafe-dev-secret-key"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    OPENWEATHERMAP_API_KEY: str = ""
    DATABASE_URL: str = "sqlite:///./thermosafe.db"

    # Thermal Stress Weights
    WEIGHT_UTCI: float = 0.45
    WEIGHT_WBGT: float = 0.35
    WEIGHT_HI: float = 0.20

    # IMD Heatwave thresholds
    HW_THRESHOLD_PLAINS: float = 40.0
    HW_THRESHOLD_COASTAL: float = 37.0
    HW_THRESHOLD_HILLY: float = 30.0

    # Alert Thresholds (HTSS)
    ALERT_HIGH: float = 60.0
    ALERT_SEVERE: float = 75.0
    ALERT_EXTREME: float = 85.0

    class Config:
        env_file = ".env"

settings = Settings()
