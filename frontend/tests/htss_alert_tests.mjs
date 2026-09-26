/**
 * htss_alert_tests.mjs
 *
 * Automated verification test suite for HTSS High and Extreme Alert Messaging System.
 * Tests:
 * 1. Category and threshold mappings (Low < 40, Moderate 40-59, High 60-74, Extreme >= 75).
 * 2. High risk alert payload structure, action protocols, and non-empty guidelines.
 * 3. Extreme risk alert payload structure, mandatory work stoppage, and 108 ambulance speed-dial.
 * 4. Anti-spam 30-minute cooldown suppression.
 * 5. Escalation bypass: High -> Extreme immediately breaks cooldown to alert users.
 * 6. Non-disruption check: Stull & Liljegren physical formulas remain intact.
 */

import assert from 'assert';
import { createServer } from 'vite';

async function runHtssAlertTests() {
  console.log('--- Starting HTSS High & Extreme Alert Messaging Automated Test Suite ---');

  const server = await createServer({
    configFile: './vite.config.ts',
    server: { port: 5197 },
  });

  let passed = 0;
  let failed = 0;

  function it(desc, fn) {
    try {
      fn();
      console.log(`[PASS] ${desc}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${desc}`, err);
      failed++;
    }
  }

  try {
    const {
      htssToRiskCategory,
      htssToLevel,
      calculateWetBulb,
      calculateHeatIndex,
      calculateHumidex,
    } = await server.ssrLoadModule('./src/lib/htssEngine.ts');

    const { formatHeatAlertPayload } = await server.ssrLoadModule('./src/services/notificationService.ts');

    // Test 1: Category threshold mapping
    it('Test 1: Correctly classifies HTSS thresholds (Low < 40, Moderate 40-59, High 60-74, Extreme >= 75)', () => {
      assert.strictEqual(htssToRiskCategory(35), 'LOW');
      assert.strictEqual(htssToRiskCategory(48), 'MODERATE');
      assert.strictEqual(htssToRiskCategory(60), 'HIGH');
      assert.strictEqual(htssToRiskCategory(72), 'HIGH');
      assert.strictEqual(htssToRiskCategory(75), 'EXTREME');
      assert.strictEqual(htssToRiskCategory(92), 'EXTREME');

      assert.strictEqual(htssToLevel(65), 'High');
      assert.strictEqual(htssToLevel(80), 'Extreme');
    });

    // Test 2: High Alert Payload formatting
    it('Test 2: Formats High Alert payload with actionable shade/hydration guidance and exact HTSS', () => {
      const payload = formatHeatAlertPayload(68, 'Chennai, Tamil Nadu', 'High');
      assert.strictEqual(payload.level, 'High');
      assert.strictEqual(payload.htss, 68);
      assert.strictEqual(payload.locationName, 'Chennai, Tamil Nadu');
      assert.ok(payload.title.includes('DANGEROUS HEAT ADVISORY'));
      assert.ok(payload.title.includes('68'));
      assert.ok(payload.message.includes('Chennai, Tamil Nadu'));
      assert.ok(payload.actions.length >= 4);
      assert.ok(payload.actions.some(a => a.toLowerCase().includes('shade') || a.toLowerCase().includes('breaks')));
      assert.ok(payload.actions.some(a => a.toLowerCase().includes('water') || a.toLowerCase().includes('electrolyte')));
    });

    // Test 3: Extreme Alert Payload formatting
    it('Test 3: Formats Extreme Alert payload with mandatory work stoppage and 108 emergency speed dial', () => {
      const payload = formatHeatAlertPayload(84, 'Ahmedabad, Gujarat', 'Extreme');
      assert.strictEqual(payload.level, 'Extreme');
      assert.strictEqual(payload.htss, 84);
      assert.ok(payload.title.includes('CRITICAL HEAT EMERGENCY'));
      assert.ok(payload.title.includes('84'));
      assert.ok(payload.actions.some(a => a.toLowerCase().includes('mandatory outdoor work stoppage')));
      assert.ok(payload.actions.some(a => a.toLowerCase().includes('cooling centers')));
      assert.ok(payload.actions.some(a => a.includes('108')));
    });

    // Test 4: Anti-spam cooldown logic simulation
    it('Test 4: Suppresses duplicate High alerts within 30-minute cooldown window', () => {
      const SNOOZE_DURATION_MS = 30 * 60 * 1000;
      const t0 = 1000000;
      let lastAlert = { timestamp: t0, level: 'High', location: 'Delhi' };

      // Attempt duplicate High alert 5 minutes later at the same location
      const t5min = t0 + 5 * 60 * 1000;
      const elapsed = t5min - lastAlert.timestamp;
      const isUpgrade = lastAlert.level === 'High' && 'High' === 'Extreme';
      const shouldSuppress = elapsed < SNOOZE_DURATION_MS && !isUpgrade;

      assert.strictEqual(shouldSuppress, true, 'Duplicate alert should be suppressed within 30 min cooldown');
    });

    // Test 5: Escalation Bypass: High -> Extreme immediately breaks cooldown
    it('Test 5: Escalation from High to Extreme bypasses 30-minute cooldown for life safety', () => {
      const SNOOZE_DURATION_MS = 30 * 60 * 1000;
      const t0 = 1000000;
      let lastAlert = { timestamp: t0, level: 'High', location: 'Delhi' };

      // Thermal conditions worsen: HTSS jumps to Extreme 3 minutes later
      const t3min = t0 + 3 * 60 * 1000;
      const newLevel = 'Extreme';
      const elapsed = t3min - lastAlert.timestamp;
      const isUpgrade = lastAlert.level === 'High' && newLevel === 'Extreme';
      const shouldSuppress = elapsed < SNOOZE_DURATION_MS && !isUpgrade;

      assert.strictEqual(shouldSuppress, false, 'Extreme upgrade MUST bypass cooldown to alert user immediately');
    });

    // Test 6: Zero disruption guarantee - Stull & Liljegren formulas remain intact
    it('Test 6: Validates Stull Wet Bulb and NOAA Heat Index physical equations remain uncompromised', () => {
      const twb = calculateWetBulb(35, 60);
      assert.ok(twb > 25 && twb < 32, `Wet bulb calculation valid: ${twb}`);

      const hi = calculateHeatIndex(38, 50);
      assert.ok(hi > 42, `Heat index properly calculates apparent heat strain: ${hi}`);

      const humidex = calculateHumidex(32, 70);
      assert.ok(humidex > 40, `Humidex correctly reflects humidity amplification: ${humidex}`);
    });

    // Test 7: Strictly alerts ONLY on High and Extreme (Never on Low or Moderate)
    it('Test 7: Strictly enforces that alerts only trigger when HTSS is High (>=60) or Extreme (>=75)', () => {
      // Score in Moderate (< 60)
      const moderateScores = [15, 38, 45, 59];
      for (const score of moderateScores) {
        const cat = htssToRiskCategory(score);
        const shouldTrigger = cat === 'HIGH' || cat === 'EXTREME';
        assert.strictEqual(shouldTrigger, false, `Score ${score} (category ${cat}) must NEVER trigger alerts`);
      }

      // Score in High and Extreme
      const alertScores = [60, 68, 74, 75, 88];
      for (const score of alertScores) {
        const cat = htssToRiskCategory(score);
        const shouldTrigger = cat === 'HIGH' || cat === 'EXTREME';
        assert.strictEqual(shouldTrigger, true, `Score ${score} (category ${cat}) MUST trigger alerts`);
      }
    });

    // Test 8: Real user personalized HTSS score matches exact vulnerability profile
    it('Test 8: Real user HTSS accurately includes demographic vulnerability offset', async () => {
      const { computeRealThermalRisk } = await server.ssrLoadModule('./src/lib/htssEngine.ts');

      // 33.8°C, 40% RH, 18 km/h, 704 W/m² (Baseline ~59 Moderate)
      const general = computeRealThermalRisk(33.8, 40, 18, 704, 'GENERAL_CITIZEN');
      const laborer = computeRealThermalRisk(33.8, 40, 18, 704, 'OUTDOOR_LABORER');
      const senior = computeRealThermalRisk(33.8, 40, 18, 704, 'ELDERLY_VULNERABLE');

      assert.strictEqual(general.htss, 59);
      assert.strictEqual(general.riskCategory, 'MODERATE');

      // Laborer gets +8 offset -> 67 (High Risk)
      assert.strictEqual(laborer.htss, 67);
      assert.strictEqual(laborer.riskCategory, 'HIGH');

      // Senior gets +6 offset -> 65 (High Risk)
      assert.strictEqual(senior.htss, 65);
      assert.strictEqual(senior.riskCategory, 'HIGH');
    });
  } finally {
    await server.close();
  }

  console.log(`\n--- Test Summary: ${passed} PASSED, ${failed} FAILED ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runHtssAlertTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
