// =========================================================================
// BACKWARD COMPATIBILITY RE-EXPORTS
// All thermal calculation functions are now centralized in
// src/lib/htssEngine.ts. This file re-exports them to avoid
// breaking existing imports.
// =========================================================================

export {
  calculateWetBulb,
  calculateOutdoorWBGT,
  calculateUTCI,
  calculateHeatIndex,
  calculateHumidex,
  computeRealThermalRisk,
  computeFactorDecomposition,
  computeFullAudit,
  htssToRiskCategory,
  htssToLevel,
  VULNERABILITY_PROFILES,
} from '../lib/htssEngine';

export type {
  ThermalRiskResult,
  RiskCategory,
  RiskLevel,
  HTSSCalculationAudit,
  VulnerabilityProfile,
  ProfileAdjustment,
} from '../lib/htssEngine';
