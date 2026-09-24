import os
from typing import Dict, Any
from app.ml.health_risk_engine import (
    health_risk_engine,
    MODEL_ENGINE_VERSION,
    THRESHOLD_TUNING_VERSION,
    HEALTH_OUTCOME_DATA_STATUS,
)

class RiskModel:
    def __init__(self):
        self.model_version = MODEL_ENGINE_VERSION
        self.threshold_version = THRESHOLD_TUNING_VERSION
        self.health_outcome_status = HEALTH_OUTCOME_DATA_STATUS
        self.feature_names = health_risk_engine.FEATURE_NAMES
        self.metrics: Dict[str, Any] = {}
        self.benchmarks: Dict[str, Any] = {}
        self.optimal_threshold: float = 0.35
        self.engine = health_risk_engine

    def train_if_needed(self):
        if not self.engine.is_initialized:
            print("[RiskModel] Initializing time-series cross-validation and multi-model benchmark...")
            self.engine.train_and_evaluate_all_models()
            
        if not self.metrics and self.engine.comparison_benchmarks:
            best_model_res = self.engine.comparison_benchmarks[self.engine.model_name]
            opt_metrics = best_model_res.metrics_at_optimized_threshold
            self.metrics = {
                "precision": opt_metrics.precision,
                "recall": opt_metrics.recall,
                "f1": opt_metrics.f1,
                "f2_score": opt_metrics.f2,
                "brier_score_calibration": opt_metrics.brier_score,
                "roc_auc": opt_metrics.roc_auc if opt_metrics.roc_auc is not None else 0.0,
                "false_alarm_rate": opt_metrics.false_alarm_rate,
                "missed_event_rate": opt_metrics.missed_event_rate,
                "true_positives": opt_metrics.true_positives,
                "false_positives": opt_metrics.false_positives,
                "true_negatives": opt_metrics.true_negatives,
                "false_negatives": opt_metrics.false_negatives,
                "validation_methodology": best_model_res.validation_type,
                "clinical_outcome_data_status": self.health_outcome_status,
                "decision_support_only": True,
            }
            self.optimal_threshold = self.engine.optimal_threshold
            print(f"[RiskModel] Completed TimeSeriesSplit validation. Optimal operational threshold: {self.optimal_threshold:.2f}")

    @property
    def model(self):
        if not self.engine.is_initialized:
            self.train_if_needed()
        return self.engine.trained_model

risk_model = RiskModel()
