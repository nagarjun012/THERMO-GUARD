class RecommendationService:
    def get_recommendations(self, risk_level: str) -> list[dict]:
        recs = []
        if risk_level == "Extreme":
            recs.extend([
                {"target": "Citizens", "priority": "High", "action": "Do not step out between 11 AM and 4 PM."},
                {"target": "Government", "priority": "High", "action": "Activate cooling centers and mobilize medical units."},
                {"target": "Outdoor Workers", "priority": "Critical", "action": "Halt all outdoor labor immediately."}
            ])
        elif risk_level == "High":
            recs.extend([
                {"target": "Citizens", "priority": "Medium", "action": "Drink ORS and water frequently even if not thirsty."},
                {"target": "Elderly", "priority": "High", "action": "Stay in cool, shaded areas. Monitor pulse."}
            ])
        else:
            recs.extend([
                {"target": "Citizens", "priority": "Low", "action": "Stay hydrated and wear cotton clothes."}
            ])
        return recs

recommendation_service = RecommendationService()
