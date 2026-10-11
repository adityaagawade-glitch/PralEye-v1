/**
 * Automated Test Suite for PRALEYE Flood Screening Engine
 * Verifies mathematical contracts, boundary classifications, monotonicity,
 * missing-data normalization, and runoff calculations.
 */

import {
  calculate24hRainfallScore,
  calculatePeakIntensityScore,
  calculateHydraulicExposureScore,
  calculateSoilSaturationScore,
  calculateDrainageObstructionScore,
  calculateRunoffEstimate,
  classifyScreeningCategory,
  calculateScreeningIndex,
  validateInputs,
  getIMDClassificationName
} from './floodScreeningEngine.js';

import {
  FACTOR_WEIGHTS,
  DEMO_SCENARIOS,
  IMD_RAINFALL_24H_BANDS
} from './floodScreeningConfig.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

function assertEqual(actual, expected, testName) {
  totalTests++;
  if (actual === expected) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName} (Expected & Got: ${expected})`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} (Expected: ${expected}, Got: ${actual})`);
  }
}

console.log('\n========================================');
console.log('RUNNING PRALEYE FLOOD SCREENING ENGINE TESTS');
console.log('========================================\n');

// 1. Test IMD 24h Rainfall Category Boundaries
console.log('--- Suite 1: IMD 24h Rainfall Category Boundaries ---');
assertEqual(calculate24hRainfallScore(0.0), 0, 'Rainfall 0.0mm -> 0 score (No Significant Rain)');
assertEqual(calculate24hRainfallScore(2.4), 0, 'Rainfall 2.4mm boundary -> 0 score');
assert(calculate24hRainfallScore(2.5) >= 10, 'Rainfall 2.5mm boundary -> >= 10 score (Light Rain)');
assert(calculate24hRainfallScore(15.5) <= 30, 'Rainfall 15.5mm boundary -> <= 30 score');
assert(calculate24hRainfallScore(15.6) >= 30, 'Rainfall 15.6mm boundary -> >= 30 score (Moderate Rain)');
assert(calculate24hRainfallScore(64.4) <= 65, 'Rainfall 64.4mm boundary -> <= 65 score');
assert(calculate24hRainfallScore(64.5) >= 65, 'Rainfall 64.5mm boundary -> >= 65 score (Heavy Rain)');
assert(calculate24hRainfallScore(115.5) <= 85, 'Rainfall 115.5mm boundary -> <= 85 score');
assert(calculate24hRainfallScore(115.6) >= 85, 'Rainfall 115.6mm boundary -> >= 85 score (Very Heavy Rain)');
assert(calculate24hRainfallScore(204.4) <= 100, 'Rainfall 204.4mm boundary -> <= 100 score');
assertEqual(calculate24hRainfallScore(204.5), 100, 'Rainfall 204.5mm boundary -> 100 score (Extremely Heavy Rain)');
assertEqual(calculate24hRainfallScore(350.0), 100, 'Rainfall 350.0mm -> capped at 100 score');

// 2. Monotonicity Checks: Increasing factor must NEVER decrease component score
console.log('\n--- Suite 2: Monotonicity Checks ---');
let lastScore = -1;
let rainMonotonic = true;
for (let r = 0; r <= 250; r += 5) {
  const s = calculate24hRainfallScore(r);
  if (s < lastScore) rainMonotonic = false;
  lastScore = s;
}
assert(rainMonotonic, '24h Rainfall score is strictly non-decreasing (monotonic) from 0 to 250mm');

let lastIntScore = -1;
let intMonotonic = true;
for (let i = 0; i <= 80; i += 2) {
  const s = calculatePeakIntensityScore(i);
  if (s < lastIntScore) intMonotonic = false;
  lastIntScore = s;
}
assert(intMonotonic, 'Peak 1h intensity score is strictly non-decreasing from 0 to 80 mm/h');

// 3. Short-Duration Intensity in mm/h (NOT mm)
console.log('\n--- Suite 3: Short-Duration Intensity Scoring ---');
assertEqual(calculatePeakIntensityScore(0), 0, 'Intensity 0 mm/h -> 0');
assert(calculatePeakIntensityScore(5.0) === 15, 'Intensity 5.0 mm/h -> 15');
assert(calculatePeakIntensityScore(15.0) === 40, 'Intensity 15.0 mm/h -> 40');
assert(calculatePeakIntensityScore(30.0) === 70, 'Intensity 30.0 mm/h -> 70');
assert(calculatePeakIntensityScore(50.0) === 90, 'Intensity 50.0 mm/h -> 90');
assert(calculatePeakIntensityScore(100.0) === 100, 'Intensity 100.0 mm/h (cloudburst) -> 100');

// 4. Screening Category Boundaries
console.log('\n--- Suite 4: Screening Category Boundaries ---');
assertEqual(classifyScreeningCategory(0).category, 'Low Screening Concern', 'Score 0 -> Low Screening Concern');
assertEqual(classifyScreeningCategory(24).category, 'Low Screening Concern', 'Score 24 -> Low Screening Concern boundary');
assertEqual(classifyScreeningCategory(25).category, 'Moderate Screening Concern', 'Score 25 -> Moderate boundary');
assertEqual(classifyScreeningCategory(49).category, 'Moderate Screening Concern', 'Score 49 -> Moderate boundary');
assertEqual(classifyScreeningCategory(50).category, 'High Screening Concern', 'Score 50 -> High boundary');
assertEqual(classifyScreeningCategory(74).category, 'High Screening Concern', 'Score 74 -> High boundary');
assertEqual(classifyScreeningCategory(75).category, 'Critical Screening Concern', 'Score 75 -> Critical boundary');
assertEqual(classifyScreeningCategory(100).category, 'Critical Screening Concern', 'Score 100 -> Critical boundary');

// 5. Weights and Calculation Contract
console.log('\n--- Suite 5: Factor Weights and Available Weight Normalization ---');
const weightSum = Object.values(FACTOR_WEIGHTS).reduce((acc, w) => acc + w, 0);
assert(Math.abs(weightSum - 1.0) < 0.0001, `Factor weights sum exactly to 1.0 (Sum: ${weightSum})`);

// Test complete data
const completeInputs = {
  rainfall24h: 142,
  peakIntensity1h: 38,
  soilSaturationPct: 82,
  drainageObstructionPct: 55,
  elevationM: 11.2,
  riverDistKm: 0.7
};
const hadapsarLocation = {
  id: 'hadapsar',
  name: 'Hadapsar',
  inFloodHazardPolygon: true,
  elevation: 11.2,
  riverDist: 0.7
};

const fullResult = calculateScreeningIndex(completeInputs, hadapsarLocation);
assert(fullResult.isValid, 'Full calculation result is valid');
assertEqual(fullResult.dataCoveragePct, 100, 'Full calculation has 100% data coverage');
assertEqual(fullResult.coverageStatus, 'COMPLETE', 'Full calculation status is COMPLETE');
assert(fullResult.screeningIndex >= 70 && fullResult.screeningIndex <= 90, `Hadapsar screening index in expected range (Got: ${fullResult.screeningIndex}/100)`);

// 6. Missing Input Handling (Never silently treat missing as zero)
console.log('\n--- Suite 6: Missing Input and Coverage Degradation ---');
const missingDrainageInputs = {
  rainfall24h: 142,
  peakIntensity1h: 38,
  soilSaturationPct: 82,
  drainageObstructionPct: null, // MISSING
  elevationM: 11.2,
  riverDistKm: 0.7
};
const missingDrainageResult = calculateScreeningIndex(missingDrainageInputs, hadapsarLocation);
assertEqual(missingDrainageResult.dataCoveragePct, 90, 'Data coverage is 90% when drainage (weight 10%) is missing');
assert(missingDrainageResult.factors.find(f => f.key === 'drainageObstruction').componentScore === null, 'Missing drainage score is null, not zero');

// Test Provisional Coverage (e.g. 55% coverage when only rainfall factors exist)
const rainfallOnlyInputs = {
  rainfall24h: 142,
  peakIntensity1h: 38,
  soilSaturationPct: null,
  drainageObstructionPct: null,
  elevationM: null,
  riverDistKm: null
};
// When location has no polygon and no elevation/dist
const rainOnlyLocation = { inFloodHazardPolygon: false };
const provisionalResult = calculateScreeningIndex(rainfallOnlyInputs, rainOnlyLocation, {
  ...FACTOR_WEIGHTS,
  hydraulicExposure: 0 // simulate missing hydraulic
});
assertEqual(provisionalResult.dataCoveragePct, 55, 'Coverage is 55% when only 24h rain (30%) + 1h intensity (25%) available');
assertEqual(provisionalResult.coverageStatus, 'PROVISIONAL', 'Coverage status is PROVISIONAL between 50% and 75%');
assert(provisionalResult.coverageWarning !== null, 'Provisional warning is present');

// Test Insufficient Coverage (< 50%)
const insufficientResult = calculateScreeningIndex({ rainfall24h: 80 }, rainOnlyLocation, {
  accumulatedRainfall24h: 0.30,
  peakIntensity1h: 0,
  hydraulicExposure: 0,
  soilSaturation: 0,
  drainageObstruction: 0
});
assertEqual(insufficientResult.coverageStatus, 'INSUFFICIENT', 'Coverage status is INSUFFICIENT below 50%');

// 7. Input Validation Checks
console.log('\n--- Suite 7: Input Validation Rejections ---');
const negativeRain = validateInputs({ rainfall24h: -15 });
assert(negativeRain.length > 0 && negativeRain[0].includes('negative'), 'Negative rainfall rejected by validator');

const negativeIntensity = validateInputs({ peakIntensity1h: -5 });
assert(negativeIntensity.length > 0 && negativeIntensity[0].includes('negative'), 'Negative intensity rejected by validator');

const invalidSoil = validateInputs({ soilSaturationPct: 125 });
assert(invalidSoil.length > 0 && invalidSoil[0].includes('between 0 and 100'), 'Soil saturation > 100% rejected by validator');

// 8. Scenario Reproducibility (Identical inputs -> Identical outputs)
console.log('\n--- Suite 8: Scenario Reproducibility ---');
const scenA1 = calculateScreeningIndex(
  { rainfall24h: 85, peakIntensity1h: 24, soilSaturationPct: 75, drainageObstructionPct: 35, elevationM: 14, riverDistKm: 1.0 },
  hadapsarLocation
);
const scenA2 = calculateScreeningIndex(
  { rainfall24h: 85, peakIntensity1h: 24, soilSaturationPct: 75, drainageObstructionPct: 35, elevationM: 14, riverDistKm: 1.0 },
  hadapsarLocation
);
assertEqual(scenA1.screeningIndex, scenA2.screeningIndex, 'Identical scenario inputs produce exactly identical screening index');

// 9. Rational Method Runoff Formula Verification: Q = (C * i * A) / 3.6
console.log('\n--- Suite 9: Simplified Rational Method Runoff Verification ---');
// For i = 36 mm/h, A = 18.4 km², C = 0.75:
// Q = (0.75 * 36 * 18.4) / 3.6 = 138.0 m³/s
const runoffCheck = calculateRunoffEstimate(36, 18.4, 0.75);
assertEqual(runoffCheck.peakDischargeM3s, 138.0, 'Rational formula Q(m³/s) = (0.75 * 36 * 18.4) / 3.6 = 138.0 m³/s exactly');
assertEqual(runoffCheck.peakDischargeLps, 138000, 'Q in Litres/second = 138,000 L/s');
assert(runoffCheck.timeToPeakStatus.includes('Not estimated'), 'Time-to-peak explicitly reports "Not estimated — requires calibrated lag parameters"');

// Summary Report
console.log('\n========================================');
console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
console.log('========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
