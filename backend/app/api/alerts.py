from fastapi import APIRouter
from app.services.alert_service import alert_service
from app.models.schemas import Alert
from app.api.risk import get_risk

router = APIRouter()

@router.get("", response_model=list[Alert])
async def get_alerts(lat: float, lon: float, state: str = "Delhi"):
    risk = await get_risk(lat, lon, state)
    return risk.alerts

@router.get("/all", response_model=list[Alert])
async def get_all_alerts():
    # Return mock alerts for demo
    from datetime import datetime, timedelta
    import uuid
    return [
        Alert(
            id=str(uuid.uuid4()),
            severity="Red Warning",
            title="Extreme Heat Danger",
            message="Life-threatening heat conditions in Northern Plains.",
            location="Delhi NCR",
            expires=datetime.now() + timedelta(hours=24),
            recommended_actions=["Stay indoors", "Hydrate"]
        )
    ]
