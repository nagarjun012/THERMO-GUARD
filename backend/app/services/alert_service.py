from datetime import datetime, timedelta
import uuid
from app.models.schemas import Alert, ThermalStressData
from app.config import settings

class AlertService:
    def generate_alerts(self, location: str, thermal_stress: ThermalStressData, risk_level: str) -> list[Alert]:
        alerts = []
        score = thermal_stress.htss_score
        
        if score > settings.ALERT_EXTREME:
            alerts.append(Alert(
                id=str(uuid.uuid4()),
                severity="Red Warning",
                title="Extreme Heat Danger",
                message="Life-threatening heat conditions. Avoid all outdoor activities.",
                location=location,
                expires=datetime.now() + timedelta(hours=24),
                recommended_actions=["Stay indoors in AC", "Hydrate constantly", "Check on elderly"]
            ))
        elif score > settings.ALERT_SEVERE:
            alerts.append(Alert(
                id=str(uuid.uuid4()),
                severity="Orange Alert",
                title="Severe Heat Alert",
                message="Very high thermal stress. High risk of heat illness.",
                location=location,
                expires=datetime.now() + timedelta(hours=12),
                recommended_actions=["Limit outdoor time", "Drink water frequently", "Wear loose clothing"]
            ))
        elif score > settings.ALERT_HIGH:
            alerts.append(Alert(
                id=str(uuid.uuid4()),
                severity="Yellow Watch",
                title="Heat Watch",
                message="Elevated thermal stress. Take precautions if outdoors.",
                location=location,
                expires=datetime.now() + timedelta(hours=6),
                recommended_actions=["Stay hydrated", "Avoid strenuous activities mid-day"]
            ))
            
        return alerts

alert_service = AlertService()
