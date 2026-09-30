import { createServer } from 'vite';

async function runHealthRiskTests() {
  console.log('--- Starting Heat-Health Risk Prediction & Decision Support Automated Test Suite ---');

  const server = await createServer({
    configFile: './vite.config.ts',
    server: { port: 5198 },
  });
  await server.listen();
  const baseUrl = 'http://localhost:5198';
  console.log(`Vite test server listening at ${baseUrl}`);

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}: ${details}`);
      failed++;
    }
  }

  try {
    // Test 1: 3 to 5 Day Warning Prediction Endpoint
    {
      const res = await fetch(`${baseUrl}/api/health-risk?lat=28.6139&lon=77.2090&days=5`);
      const data = await res.json();

      assert(
        res.status === 200 && Array.isArray(data.daily_predictions) && data.daily_predictions.length === 5,
        'Test 1: /api/health-risk returns 5-day warning predictions',
        `Status ${res.status}, length ${data.daily_predictions?.length}`
      );

      // Verify each day's epidemiological indices and limits
      const allValid = data.daily_predictions.every(
        (p) =>
          p.heat_health_risk_score >= 0 &&
          p.heat_health_risk_score <= 100 &&
          p.hospitalization_risk_index >= 0 &&
          p.hospitalization_risk_index <= 100 &&
          p.mortality_risk_index >= 0 &&
          p.mortality_risk_index <= 100 &&
          p.autonomous_action_allowed === false &&
          typeof p.requires_human_review === 'boolean'
      );
      assert(
        allValid,
        'Test 2: All 5 daily predictions have bounded hospitalization (0-100), mortality (0-100), and autonomous_action_allowed=false'
      );

      assert(
        data.health_outcome_status === 'CLINICAL_REGISTRY_UNLINKED_DECISION_SUPPORT_ONLY',
        'Test 3: Output clearly identifies unlinked clinical health outcome status (No fake health outcome claims)'
      );

      assert(
        data.operating_threshold === 0.16 && data.model_version.includes('timeseries'),
        'Test 4: Traceable model version and asymmetric operational threshold are preserved'
      );
    }

    // Test 5: Localized Vulnerable Group Alerts
    {
      const res = await fetch(`${baseUrl}/api/health-risk?mode=vulnerable-alerts&risk_level=Extreme`);
      const data = await res.json();

      const groups = (data || []).map((g) => g.group_name);
      const hasElderly = groups.some((g) => g.includes('Elderly'));
      const hasLaborers = groups.some((g) => g.includes('Laborers'));
      const hasPediatric = groups.some((g) => g.includes('Pediatric'));
      const hasChronic = groups.some((g) => g.includes('Cardio-Respiratory'));

      assert(
        res.status === 200 && hasElderly && hasLaborers && hasPediatric && hasChronic,
        'Test 5: Localized advisories exist for elderly, outdoor laborers, pediatric, and chronic patient groups'
      );
    }

    // Test 6: Model Comparison & Threshold Tuning Benchmarks
    {
      const res = await fetch(`${baseUrl}/api/health-risk?mode=benchmarks`);
      const data = await res.json();

      assert(
        res.status === 200 && Array.isArray(data) && data.length >= 3,
        'Test 6: Model comparison benchmark returns cross-validated candidate models (HistGradientBoosting, RandomForest, LogisticRegression)'
      );

      const hgb = data.find((m) => m.model_name.includes('HistGradientBoosting'));
      const gain = hgb?.decision_threshold_gain;
      assert(
        gain && gain.missed_events_prevented > 0 && gain.cost_reduction_percent > 0,
        'Test 7: Asymmetric threshold optimization confirms reduction in missed events (False Negatives) and operational cost gain'
      );
    }

    // Test 8: Invalid coordinates return 400 Bad Request
    {
      const res = await fetch(`${baseUrl}/api/health-risk?lat=999&lon=999`);
      assert(
        res.status === 400,
        'Test 8: Physically invalid coordinates reject gracefully with 400 Bad Request'
      );
    }
  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    await server.close();
  }

  console.log(`\n--- Test Summary: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) process.exit(1);
}

runHealthRiskTests();
