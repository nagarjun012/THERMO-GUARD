import numpy as np
from app.ml.features import extract_features
from app.ml.model import risk_model
from app.models.schemas import MLPrediction, WeatherData

def predict_risk(weather: WeatherData) -> MLPrediction:
    if risk_model.model is None:
        risk_model.train_if_needed()
        
    X = extract_features(weather)
    
    # Predict
    pred_class = risk_model.model.predict(X)[0]
    probs = risk_model.model.predict_proba(X)[0]
    confidence = float(np.max(probs))
    
    # Feature importance
    importances = risk_model.model.feature_importances_
    feat_imp = {name: float(imp) for name, imp in zip(risk_model.feature_names, importances)}
    
    return MLPrediction(
        risk_level=str(pred_class),
        confidence=confidence,
        feature_importance=feat_imp,
        model_metrics=risk_model.metrics
    )
