"""
Comprehensive Unit & Integration Test Suite for Heat-Health Prediction Engine
Covers:
1. Chronological dataset generation & time-series split validation (Zero future leakage).
2. Asymmetric threshold optimization & False Negative (missed event) reduction.
3. Multi-model comparison execution & benchmark validity.
4. 3 to 5 Day warning window pipeline & epidemiological index limits (0-100).
5. Transparency metadata: Decision-support framing, unlinked health outcome flag.
6. Human-in-the-loop requirement for elevated/extreme risks.
7. Localized alerts for vulnerable populations.
8. API compatibility & error handling.
"""

import unittest
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit

from app.ml.health_risk_engine import (
    SyntheticChronologicalDataset,
    HealthRiskPredictorEngine,
    health_risk_engine,
    PENALTY_FALSE_NEGATIVE,
    PENALTY_FALSE_POSITIVE,
)
from app.ml.model import risk_model
from app.ml.predict import (
    predict_risk,
    predict_multi_day_health_risk,
    get_model_comparison_benchmarks,
    get_localized_vulnerable_alerts,
)
from app.models.schemas import WeatherData


class TestHeatHealthPredictionEngine(unittest.TestCase):

    def test_chronological_ordering_and_no_future_leakage(self):
        """Verify that training datasets are strictly sequential in time."""
        df, y = SyntheticChronologicalDataset.generate(n_days=300)
        self.assertEqual(len(df), len(y))
        
        # Verify dates are monotonically increasing
        dates = df["date"].tolist()
        for i in range(len(dates) - 1):
            self.assertLess(dates[i], dates[i + 1], "Dates must be strictly chronologically ordered")

        # Verify TimeSeriesSplit splits only forward in time
        tscv = TimeSeriesSplit(n_splits=3)
        for train_idx, val_idx in tscv.split(df):
            max_train_time = df["date"].iloc[train_idx].max()
            min_val_time = df["date"].iloc[val_idx].min()
            self.assertLessEqual(
                max_train_time,
                min_val_time,
                "Future data leaked into training fold! max_train_time must precede min_val_time"
            )

    def test_model_comparison_suite(self):
        """Verify all 3 candidate models are evaluated and return valid metrics."""
        engine = HealthRiskPredictorEngine()
        results = engine.train_and_evaluate_all_models()

        self.assertIn("HistGradientBoostingClassifier", results)
        self.assertIn("RandomForestClassifier", results)
        self.assertIn("LogisticRegression", results)

        for name, res in results.items():
            metrics_opt = res.metrics_at_optimized_threshold
            # Verify metrics are within plausible statistical bounds
            self.assertGreaterEqual(metrics_opt.recall, 0.0)
            self.assertLessEqual(metrics_opt.recall, 1.0)
            self.assertGreaterEqual(metrics_opt.precision, 0.0)
            self.assertLessEqual(metrics_opt.precision, 1.0)
            self.assertGreaterEqual(metrics_opt.f1, 0.0)
            self.assertLessEqual(metrics_opt.f1, 1.0)
            self.assertGreaterEqual(metrics_opt.brier_score, 0.0)
            # Verify confusion matrix sums
            total_cases = (
                metrics_opt.true_positives
                + metrics_opt.false_positives
                + metrics_opt.true_negatives
                + metrics_opt.false_negatives
            )
            self.assertGreater(total_cases, 0)

    def test_asymmetric_threshold_tuning_reduces_missed_events(self):
        """
        Verify that threshold optimization reduces operational cost and penalizes missed events.
        """
        engine = HealthRiskPredictorEngine()
        benchmarks = engine.train_and_evaluate_all_models()
        best_res = benchmarks[engine.model_name]

        def_metrics = best_res.metrics_at_default_threshold
        opt_metrics = best_res.metrics_at_optimized_threshold

        cost_def = PENALTY_FALSE_NEGATIVE * def_metrics.false_negatives + PENALTY_FALSE_POSITIVE * def_metrics.false_positives
        cost_opt = PENALTY_FALSE_NEGATIVE * opt_metrics.false_negatives + PENALTY_FALSE_POSITIVE * opt_metrics.false_positives

        # Cost at tuned threshold must be <= cost at default 0.50
        self.assertLessEqual(cost_opt, cost_def)
        # Tuned threshold must achieve high sensitivity (recall)
        self.assertGreaterEqual(opt_metrics.recall, def_metrics.recall)

    def test_3_to_5_day_warning_horizon_coverage(self):
        """Verify 5 daily predictions are generated with stages and epidemiological indices."""
        forecast = health_risk_engine.generate_3_to_5_day_warning(
            location="28.61,77.20",
            current_temp=42.0,
            current_humidity=50.0,
        )

        self.assertEqual(len(forecast.daily_predictions), 5)
        expected_stages = [
            "IMMEDIATE_INTERVENTION",
            "IMMEDIATE_INTERVENTION",
            "TARGETED_WARNING",
            "OPERATIONAL_READINESS",
            "PRELIMINARY_STAGING",
        ]

        for i, pred in enumerate(forecast.daily_predictions):
            self.assertEqual(pred.day_offset, i + 1)
            self.assertEqual(pred.warning_stage, expected_stages[i])
            self.assertGreaterEqual(pred.heat_health_risk_score, 0.0)
            self.assertLessEqual(pred.heat_health_risk_score, 100.0)
            self.assertGreaterEqual(pred.hospitalization_risk_index, 0.0)
            self.assertLessEqual(pred.hospitalization_risk_index, 100.0)
            self.assertGreaterEqual(pred.mortality_risk_index, 0.0)
            self.assertLessEqual(pred.mortality_risk_index, 100.0)
            self.assertIn(pred.risk_level, ["Safe", "Low", "Moderate", "High", "Extreme"])
            self.assertFalse(pred.autonomous_action_allowed, "Autonomous action must never be allowed")
            self.assertGreater(len(pred.action_checklist), 0)

    def test_human_in_the_loop_governance(self):
        """Ensure human review is flagged for severe conditions and disclaimers are set."""
        forecast_extreme = health_risk_engine.generate_3_to_5_day_warning(
            location="Hot District",
            current_temp=45.0,
            current_humidity=60.0,
        )
        self.assertTrue(
            forecast_extreme.human_in_the_loop_protocol["authorized_review_required"],
            "Extreme conditions must mandate authorized human review"
        )
        self.assertIn("AI outputs are purely for decision-support", forecast_extreme.human_in_the_loop_protocol["governing_principle"])
        self.assertIn("CLINICAL_REGISTRY_UNLINKED", forecast_extreme.health_outcome_status)

    def test_localized_vulnerable_alerts(self):
        """Verify targeted advisories exist for all critical groups without fake census numbers."""
        alerts = get_localized_vulnerable_alerts("Extreme", "Delhi")
        groups = [a.group_name for a in alerts]
        self.assertTrue(any("Elderly" in g for g in groups))
        self.assertTrue(any("Laborer" in g or "Worker" in g for g in groups))
        self.assertTrue(any("Pediatric" in g or "Children" in g for g in groups))
        self.assertTrue(any("Cardio-Respiratory" in g for g in groups))

        for a in alerts:
            self.assertEqual(a.urgency, "extreme")
            self.assertGreater(len(a.recommended_interventions), 0)

    def test_backward_compatibility_predict_risk(self):
        """Verify that existing call to predict_risk returns valid MLPrediction without error."""
        w = WeatherData(
            temp=38.5,
            humidity=55.0,
            wind_speed=8.0,
            solar_radiation=700.0,
            pressure=1010.0,
            description="Clear",
        )
        pred = predict_risk(w)
        self.assertIn(pred.risk_level, ["Safe", "Low", "Moderate", "High", "Extreme"])
        self.assertGreater(pred.confidence, 0.0)
        self.assertIn("brier_score_calibration", pred.model_metrics)
        self.assertIn("false_alarm_rate", pred.model_metrics)
        self.assertIn("missed_event_rate", pred.model_metrics)


if __name__ == "__main__":
    unittest.main()
