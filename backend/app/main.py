from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

# Import routers
from app.api.weather import router as weather_router
from app.api.thermal_stress import router as thermal_stress_router
from app.api.risk import router as risk_router
from app.api.forecast import router as forecast_router
from app.api.vulnerability import router as vulnerability_router
from app.api.alerts import router as alerts_router
from app.api.gis import router as gis_router
from app.api.demo import router as demo_router
from app.api.dashboard import router as dashboard_router

from app.api.facilities import router as facilities_router

# Import ML model
from app.ml.model import risk_model

app = FastAPI(
    title="THERMOSAFE API",
    description="AI-Powered Extreme Heat Early Warning & Human Thermal Stress Intelligence Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting THERMOSAFE API...")
    # Initialize ML Model
    risk_model.train_if_needed()

# Register routers
app.include_router(weather_router, prefix="/api/weather", tags=["Weather"])
app.include_router(thermal_stress_router, prefix="/api/thermal-stress", tags=["Thermal Stress"])
app.include_router(risk_router, prefix="/api/risk", tags=["Risk Assessment"])
app.include_router(forecast_router, prefix="/api/forecast", tags=["Forecast"])
app.include_router(vulnerability_router, prefix="/api/vulnerability", tags=["Vulnerability"])
app.include_router(alerts_router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(gis_router, prefix="/api/gis", tags=["GIS"])
app.include_router(demo_router, prefix="/api/demo", tags=["Demo Management"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Government Dashboard"])
app.include_router(facilities_router, tags=["Facilities & Emergency Support"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
