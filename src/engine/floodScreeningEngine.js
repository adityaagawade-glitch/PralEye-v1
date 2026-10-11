/**
 * PRALEYE Flood Screening Engine
 * Transparent, well-tested flood-risk screening logic module.
 * 
 * Implements documented IMD classifications, normalized factor scores,
 * dynamic data coverage rules, and evidence-based explanations.
 */

import {
  FACTOR_WEIGHTS,
  IMD_RAINFALL_24H_BANDS,
  PEAK_INTENSITY_1H_BANDS,
  SCREENING_CATEGORIES,
  COVERAGE_THRESHOLDS,
  RATIONAL_METHOD_DEFAULTS
} from './floodScreeningConfig.js';

/**
 * Validates screening inputs
 * @param {Object} inputs
 * @returns {Array<string>} Array of validation error messages (empty if valid)
 */
export function validateInputs(inputs) {
  const errors = [];
  if (inputs.rainfall24h !== undefined && inputs.rainfall24h !== null) {
    if (typeof inputs.rainfall24h !== 'number' || isNaN(inputs.rainfall24h)) {
      errors.push('24h rainfall must be a valid numeric value.');
    } else if (inputs.rainfall24h < 0) {
      errors.push('24h rainfall cannot be negative.');
    }
  }

  if (inputs.peakIntensity1h !== undefined && inputs.peakIntensity1h !== null) {
    if (typeof inputs.peakIntensity1h !== 'number' || isNaN(inputs.peakIntensity1h)) {
      errors.push('Peak 1-hour intensity must be a valid numeric value.');
    } else if (inputs.peakIntensity1h < 0) {
      errors.push('Peak 1-hour intensity cannot be negative.');
    }
  }

  if (inputs.soilSaturationPct !== undefined && inputs.soilSaturationPct !== null) {
    if (typeof inputs.soilSaturationPct !== 'number' || isNaN(inputs.soilSaturationPct)) {
      errors.push('Soil saturation percentage must be a number.');
    } else if (inputs.soilSaturationPct < 0 || inputs.soilSaturationPct > 100) {
      errors.push('Soil saturation percentage must be between 0 and 100.');
    }
  }

  if (inputs.drainageObstructionPct !== undefined && inputs.drainageObstructionPct !== null) {
    if (typeof inputs.drainageObstructionPct !== 'number' || isNaN(inputs.drainageObstructionPct)) {
      errors.push('Drainage obstruction percentage must be a number.');
    } else if (inputs.drainageObstructionPct < 0 || inputs.drainageObstructionPct > 100) {
      errors.push('Drainage obstruction percentage must be between 0 and 100.');
    }
  }

  if (inputs.elevationM !== undefined && inputs.elevationM !== null) {
    if (typeof inputs.elevationM !== 'number' || isNaN(inputs.elevationM)) {
      errors.push('Elevation must be a valid numeric value.');
    }
  }

  if (inputs.riverDistKm !== undefined && inputs.riverDistKm !== null) {
    if (typeof inputs.riverDistKm !== 'number' || isNaN(inputs.riverDistKm)) {
      errors.push('River distance must be a valid numeric value.');
    } else if (inputs.riverDistKm < 0) {
      errors.push('River distance cannot be negative.');
    }
  }

  return errors;
}

/**
 * Calculates 24h rainfall component score based on IMD classification mapping.
 * Uses monotonic piecewise interpolation between IMD category boundaries.
 * 
 * IMD Classifications:
 * - 0–2.4 mm: No significant rain (Score: 0)
 * - 2.5–15.5 mm: Light rain (Score: 10)
 * - 15.6–64.4 mm: Moderate rain (Score: 30)
 * - 64.5–115.5 mm: Heavy rain (Score: 65)
 * - 115.6–204.4 mm: Very heavy rain (Score: 85)
 * - > 204.4 mm: Extremely heavy rain (Score: 100)
 * 
 * @param {number|null} rainfallMm
 * @returns {number|null} Score 0–100 or null if unavailable
 */
export function calculate24hRainfallScore(rainfallMm) {
  if (rainfallMm === null || rainfallMm === undefined || isNaN(rainfallMm) || rainfallMm < 0) {
    return null;
  }

  if (rainfallMm <= 2.4) {
    return 0;
  } else if (rainfallMm <= 15.5) {
    // 2.5 to 15.5 mm -> score scales from 10 to 30
    const ratio = (rainfallMm - 2.5) / (15.5 - 2.5);
    return Math.round(10 + ratio * 20);
  } else if (rainfallMm <= 64.4) {
    // 15.6 to 64.4 mm -> score scales from 30 to 65
    const ratio = (rainfallMm - 15.6) / (64.4 - 15.6);
    return Math.round(30 + ratio * 35);
  } else if (rainfallMm <= 115.5) {
    // 64.5 to 115.5 mm -> score scales from 65 to 85
    const ratio = (rainfallMm - 64.5) / (115.5 - 64.5);
    return Math.round(65 + ratio * 20);
  } else if (rainfallMm <= 204.4) {
    // 115.6 to 204.4 mm -> score scales from 85 to 100
    const ratio = (rainfallMm - 115.6) / (204.4 - 115.6);
    return Math.round(85 + ratio * 15);
  } else {
    // > 204.4 mm -> Extremely heavy rain
    return 100;
  }
}

/**
 * Returns IMD classification name for 24h rainfall
 * @param {number} rainfallMm
 * @returns {string}
 */
export function getIMDClassificationName(rainfallMm) {
  if (rainfallMm === null || rainfallMm === undefined || rainfallMm < 0) return 'Unavailable';
  for (const band of IMD_RAINFALL_24H_BANDS) {
    if (rainfallMm >= band.min && rainfallMm <= band.max) {
      return band.name;
    }
  }
  return 'Extremely Heavy Rainfall';
}

/**
 * Calculates short-duration peak 1-hour rainfall intensity component score.
 * Monotonically non-decreasing: increasing intensity never decreases score.
 * 
 * @param {number|null} intensityMmh Peak 1-hour intensity in mm/h
 * @returns {number|null} Score 0–100 or null if unavailable
 */
export function calculatePeakIntensityScore(intensityMmh) {
  if (intensityMmh === null || intensityMmh === undefined || isNaN(intensityMmh) || intensityMmh < 0) {
    return null;
  }

  if (intensityMmh <= 5.0) {
    const ratio = intensityMmh / 5.0;
    return Math.round(ratio * 15);
  } else if (intensityMmh <= 15.0) {
    const ratio = (intensityMmh - 5.0) / 10.0;
    return Math.round(15 + ratio * 25);
  } else if (intensityMmh <= 30.0) {
    const ratio = (intensityMmh - 15.0) / 15.0;
    return Math.round(40 + ratio * 30);
  } else if (intensityMmh <= 50.0) {
    const ratio = (intensityMmh - 30.0) / 20.0;
    return Math.round(70 + ratio * 20);
  } else {
    const ratio = Math.min(1.0, (intensityMmh - 50.0) / 50.0);
    return Math.round(90 + ratio * 10);
  }
}

/**
 * Calculates hydraulic and floodplain exposure score.
 * Exposure hierarchy:
 * 1. Intersection with credible flood-hazard polygon
 * 2. Elevation gradient above stream bed
 * 3. Proximity to drainage channel (supporting indicator)
 * 
 * @param {Object} locationInfo
 * @param {number|null} elevationM
 * @param {number|null} riverDistKm
 * @returns {{ score: number, sourceDescription: string, isPolygonIntersection: boolean }}
 */
export function calculateHydraulicExposureScore(locationInfo, elevationM, riverDistKm) {
  if (!locationInfo) {
    return {
      score: 50,
      sourceDescription: 'Limited geographic exposure proxy (default midpoint)',
      isPolygonIntersection: false
    };
  }

  const isPolygonIntersected = Boolean(locationInfo.inFloodHazardPolygon);
  const elev = typeof elevationM === 'number' ? elevationM : locationInfo.elevation || 20;
  const dist = typeof riverDistKm === 'number' ? riverDistKm : locationInfo.riverDist || 2;

  let baseScore = 0;
  let sourceDescription = '';

  if (isPolygonIntersected) {
    // In known Mula-Mutha flood hazard polygon (e.g. Hadapsar riverine sector)
    // Low elevation (< 15m) and close proximity (< 1km) pushes score towards 90-100
    const elevFactor = Math.max(0, 1 - Math.min(1, elev / 30));
    const distFactor = Math.max(0, 1 - Math.min(1, dist / 3));
    baseScore = Math.round(75 + elevFactor * 15 + distFactor * 10);
    sourceDescription = 'Mapped flood-hazard polygon intersection & DEM terrain analysis';
  } else {
    // Outside authoritative flood polygon: limited geographic exposure proxy
    const elevFactor = Math.max(0, 1 - Math.min(1, elev / 50));
    const distFactor = Math.max(0, 1 - Math.min(1, dist / 5));
    baseScore = Math.round(elevFactor * 40 + distFactor * 35);
    sourceDescription = 'Limited geographic exposure proxy (river proximity & elevation; no authoritative polygon intersection)';
  }

  return {
    score: Math.min(100, Math.max(0, baseScore)),
    sourceDescription,
    isPolygonIntersection: isPolygonIntersected
  };
}

/**
 * Calculates soil moisture saturation component score.
 * Normalizes 0–100% to 0–100 score.
 * 
 * @param {number|null} soilSatPct
 * @returns {number|null}
 */
export function calculateSoilSaturationScore(soilSatPct) {
  if (soilSatPct === null || soilSatPct === undefined || isNaN(soilSatPct) || soilSatPct < 0) {
    return null;
  }
  return Math.min(100, Math.max(0, Math.round(soilSatPct)));
}

/**
 * Calculates drainage obstruction component score.
 * Treats unknown or missing as null (NOT zero).
 * 
 * @param {number|null} drainBlockPct
 * @returns {number|null}
 */
export function calculateDrainageObstructionScore(drainBlockPct) {
  if (drainBlockPct === null || drainBlockPct === undefined || isNaN(drainBlockPct) || drainBlockPct < 0) {
    return null;
  }
  return Math.min(100, Math.max(0, Math.round(drainBlockPct)));
}

/**
 * Calculates peak discharge estimate using the Simplified Rational Method:
 * Q (m³/s) = (C · i · A) / 3.6
 * 
 * @param {number} intensityMmh Peak 1-hour rainfall intensity (mm/h)
 * @param {number} catchmentAreaKm2 Catchment area in km² (default 18.4)
 * @param {number} runoffCoefficientC Runoff coefficient (default 0.75)
 * @returns {{
 *   peakDischargeM3s: number|null,
 *   peakDischargeLps: number|null,
 *   timeToPeakStatus: string,
 *   assumptionsText: string
 * }}
 */
export function calculateRunoffEstimate(
  intensityMmh,
  catchmentAreaKm2 = RATIONAL_METHOD_DEFAULTS.catchmentAreaKm2,
  runoffCoefficientC = RATIONAL_METHOD_DEFAULTS.runoffCoefficientC
) {
  if (!intensityMmh || intensityMmh <= 0) {
    return {
      peakDischargeM3s: null,
      peakDischargeLps: null,
      timeToPeakStatus: 'Not estimated — zero or missing rainfall intensity',
      assumptionsText: RATIONAL_METHOD_DEFAULTS.statedAssumptions
    };
  }

  // Q (m³/s) = (C * i * A) / 3.6
  const qM3s = (runoffCoefficientC * intensityMmh * catchmentAreaKm2) / 3.6;
  const qLps = qM3s * 1000;

  return {
    peakDischargeM3s: Number(qM3s.toFixed(2)),
    peakDischargeLps: Math.round(qLps),
    timeToPeakStatus: 'Not estimated — requires calibrated catchment lag parameters (SCS/Kirpich)',
    assumptionsText: RATIONAL_METHOD_DEFAULTS.statedAssumptions
  };
}

/**
 * Classifies screening index into documented categories.
 * @param {number} score 0–100
 * @returns {Object}
 */
export function classifyScreeningCategory(score) {
  for (const cat of SCREENING_CATEGORIES) {
    if (score >= cat.min && score <= cat.max) {
      return cat;
    }
  }
  return SCREENING_CATEGORIES[SCREENING_CATEGORIES.length - 1];
}

/**
 * Master Flood Screening Calculation Function
 * Computes individual component scores, available weight normalization,
 * data coverage evaluation, and dynamic reasoning text.
 * 
 * Formula:
 * screeningIndex = sum(weight * factorScore) / sum(available weights)
 * 
 * @param {Object} inputs
 * @param {Object} locationInfo
 * @param {Object} customWeights Optional override for factor weights
 * @returns {Object}
 */
export function calculateScreeningIndex(inputs, locationInfo, customWeights = FACTOR_WEIGHTS) {
  const errors = validateInputs(inputs);
  if (errors.length > 0) {
    return {
      isValid: false,
      validationErrors: errors,
      screeningIndex: null
    };
  }

  // 1. Calculate Individual Factor Scores
  const r24Score = calculate24hRainfallScore(inputs.rainfall24h);
  const peakIntScore = calculatePeakIntensityScore(inputs.peakIntensity1h);
  const hydraulicResult = calculateHydraulicExposureScore(locationInfo, inputs.elevationM, inputs.riverDistKm);
  const soilScore = calculateSoilSaturationScore(inputs.soilSaturationPct);
  const drainScore = calculateDrainageObstructionScore(inputs.drainageObstructionPct);

  // 2. Factor Components Breakdown
  const factors = [
    {
      key: 'accumulatedRainfall24h',
      name: '24h Accumulated Rainfall',
      rawValue: inputs.rainfall24h,
      formattedValue: inputs.rainfall24h !== null && inputs.rainfall24h !== undefined ? `${inputs.rainfall24h} mm` : 'Missing',
      unit: 'mm',
      weight: customWeights.accumulatedRainfall24h,
      componentScore: r24Score,
      isAvailable: r24Score !== null,
      classification: getIMDClassificationName(inputs.rainfall24h),
      source: inputs.rainfallSource || 'IMD Pune AWS Telemetry',
      provenanceType: inputs.isRainfallUserSupplied ? 'User-Supplied Scenario Assumption' : 'Simulated IMD Observation',
      timestamp: inputs.rainfallTimestamp || '12 Aug 2024, 14:00 IST'
    },
    {
      key: 'peakIntensity1h',
      name: 'Peak 1-Hour Rainfall Intensity',
      rawValue: inputs.peakIntensity1h,
      formattedValue: inputs.peakIntensity1h !== null && inputs.peakIntensity1h !== undefined ? `${inputs.peakIntensity1h} mm/h` : 'Missing',
      unit: 'mm/h',
      weight: customWeights.peakIntensity1h,
      componentScore: peakIntScore,
      isAvailable: peakIntScore !== null,
      classification: inputs.peakIntensity1h > 50 ? 'Cloudburst Rate' : inputs.peakIntensity1h > 30 ? 'Very High' : inputs.peakIntensity1h > 15 ? 'High' : 'Moderate',
      source: inputs.intensitySource || 'Doppler Radar Pashan & AWS Hyetograph',
      provenanceType: inputs.isIntensityUserSupplied ? 'User-Supplied Scenario Assumption' : 'Simulated Radar Hyetograph',
      timestamp: inputs.intensityTimestamp || '12 Aug 2024, 14:00 IST'
    },
    {
      key: 'hydraulicExposure',
      name: 'Hydraulic & Floodplain Exposure',
      rawValue: inputs.riverDistKm,
      formattedValue: `${inputs.riverDistKm} km from river (Elev: ${inputs.elevationM}m)`,
      unit: 'km / m MSL',
      weight: customWeights.hydraulicExposure,
      componentScore: hydraulicResult.score,
      isAvailable: true,
      classification: hydraulicResult.isPolygonIntersection ? 'Hazard Polygon Intersect' : 'Geographic Proxy',
      source: hydraulicResult.sourceDescription,
      provenanceType: hydraulicResult.isPolygonIntersection ? 'GIS Floodplain Polygon Intersect' : 'Limited Geographic Exposure Proxy',
      timestamp: 'PMRDA Master Plan & SRTM DEM'
    },
    {
      key: 'soilSaturation',
      name: 'Soil Saturation Index',
      rawValue: inputs.soilSaturationPct,
      formattedValue: inputs.soilSaturationPct !== null && inputs.soilSaturationPct !== undefined ? `${inputs.soilSaturationPct}%` : 'Missing',
      unit: '%',
      weight: customWeights.soilSaturation,
      componentScore: soilScore,
      isAvailable: soilScore !== null,
      classification: inputs.soilSaturationPct > 80 ? 'Near Saturation' : inputs.soilSaturationPct > 60 ? 'High' : 'Moderate',
      source: inputs.isSoilUserSupplied ? 'User-entered scenario assumption' : 'CWC Antecedent Moisture Index',
      provenanceType: inputs.isSoilUserSupplied ? 'User-Supplied Scenario Assumption' : 'Simulated Sensor Index',
      timestamp: inputs.isSoilUserSupplied ? 'Manual Entry' : '12 Aug 2024, 08:00 IST'
    },
    {
      key: 'drainageObstruction',
      name: 'Drainage Obstruction / Siltation',
      rawValue: inputs.drainageObstructionPct,
      formattedValue: inputs.drainageObstructionPct !== null && inputs.drainageObstructionPct !== undefined ? `${inputs.drainageObstructionPct}%` : 'Missing / Unknown',
      unit: '%',
      weight: customWeights.drainageObstruction,
      componentScore: drainScore,
      isAvailable: drainScore !== null,
      classification: inputs.drainageObstructionPct > 60 ? 'Severe Siltation' : inputs.drainageObstructionPct > 30 ? 'Moderate' : 'Clear',
      source: inputs.isDrainageUserSupplied ? 'User-entered scenario assumption' : 'PMC Ward Field Report',
      provenanceType: inputs.isDrainageUserSupplied ? 'User-Supplied Scenario Assumption' : 'Municipal Observation',
      timestamp: inputs.isDrainageUserSupplied ? 'Manual Entry' : '11 Aug 2024, 18:00 IST'
    }
  ];

  // 3. Compute Available Weights and Normalized Screening Index
  let availableWeightSum = 0;
  let weightedScoreSum = 0;

  factors.forEach(factor => {
    if (factor.isAvailable) {
      availableWeightSum += factor.weight;
      weightedScoreSum += factor.weight * factor.componentScore;
    }
  });

  const dataCoverageRatio = availableWeightSum; // e.g. 1.0 = 100%, 0.7 = 70%
  const dataCoveragePct = Math.round(dataCoverageRatio * 100);

  // If no factors available, uncomputable
  if (availableWeightSum <= 0) {
    return {
      isValid: false,
      validationErrors: ['No valid environmental factors available to compute screening index.'],
      screeningIndex: null
    };
  }

  // Normalized Screening Index: sum(w * score) / sum(w)
  const normalizedIndex = Math.round(weightedScoreSum / availableWeightSum);
  const boundedIndex = Math.min(100, Math.max(0, normalizedIndex));

  // Compute exact weighted contributions for each available factor relative to normalized index
  factors.forEach(factor => {
    if (factor.isAvailable) {
      // Contribution towards final score
      factor.weightedContribution = Number(((factor.weight / availableWeightSum) * factor.componentScore).toFixed(1));
    } else {
      factor.weightedContribution = 0;
    }
  });

  // 4. Determine Data Completeness Status
  let coverageStatus = 'COMPLETE';
  let coverageWarning = null;

  if (dataCoverageRatio < COVERAGE_THRESHOLDS.INSUFFICIENT) {
    coverageStatus = 'INSUFFICIENT';
    coverageWarning = `Data coverage is only ${dataCoveragePct}% (below the 50% threshold). Insufficient evidence for a reliable overall screening index.`;
  } else if (dataCoverageRatio < COVERAGE_THRESHOLDS.PROVISIONAL) {
    coverageStatus = 'PROVISIONAL';
    coverageWarning = `Provisional Screening Index: Data coverage is ${dataCoveragePct}%. Results should be interpreted with caution due to missing unverified factors.`;
  }

  // 5. Categorize Index
  const categoryInfo = classifyScreeningCategory(boundedIndex);

  // 6. Runoff Approximation
  const runoffData = calculateRunoffEstimate(
    inputs.peakIntensity1h,
    RATIONAL_METHOD_DEFAULTS.catchmentAreaKm2,
    RATIONAL_METHOD_DEFAULTS.runoffCoefficientC
  );

  // 7. Dynamic Evidence-Based Reasoning Synthesis
  const reasoning = generateEvidenceBasedReasoning(factors, boundedIndex, categoryInfo, dataCoveragePct, coverageStatus, locationInfo);

  return {
    isValid: true,
    validationErrors: [],
    screeningIndex: boundedIndex,
    categoryInfo,
    dataCoveragePct,
    coverageStatus,
    coverageWarning,
    factors,
    runoffData,
    reasoning
  };
}

/**
 * Generates dynamic, evidence-based reasoning from actual calculated inputs and weights
 */
function generateEvidenceBasedReasoning(factors, index, category, coveragePct, coverageStatus, locationInfo) {
  // Find top contributing factor
  const availableFactors = factors.filter(f => f.isAvailable);
  const sortedByContribution = [...availableFactors].sort((a, b) => b.weightedContribution - a.weightedContribution);
  const topFactor = sortedByContribution[0];

  const userSuppliedFactors = factors.filter(f => f.provenanceType.includes('User-Supplied'));
  const missingFactors = factors.filter(f => !f.isAvailable);

  const sentences = [];

  // Sentence 1: Primary driver
  if (topFactor) {
    sentences.push(
      `${topFactor.name} is the primary driver of the current screening score (${topFactor.weightedContribution} of ${index} points, derived from ${topFactor.formattedValue}).`
    );
  }

  // Sentence 2: Secondary factor or exposure context
  if (sortedByContribution.length > 1) {
    const secondFactor = sortedByContribution[1];
    sentences.push(
      `Compounding factor: ${secondFactor.name} contributes ${secondFactor.weightedContribution} points (${secondFactor.formattedValue}).`
    );
  }

  // Sentence 3: Provenance & assumptions note
  if (userSuppliedFactors.length > 0) {
    const names = userSuppliedFactors.map(f => f.name).join(' and ');
    sentences.push(
      `Note: ${names} ${userSuppliedFactors.length === 1 ? 'is' : 'are'} based on user-supplied scenario assumptions rather than live telemetry.`
    );
  }

  // Sentence 4: Missing factors warning
  if (missingFactors.length > 0) {
    const missingNames = missingFactors.map(f => f.name).join(', ');
    sentences.push(
      `Caution: ${missingNames} data is missing and was excluded from weight normalization.`
    );
  }

  // Precautionary recommendations
  const recommendations = [];
  if (index >= 75) {
    recommendations.push('Immediate municipal field inspection recommended for low-lying storm culverts.');
    recommendations.push('Verify structural clearances at known bottlenecks (e.g. Holkar Bridge / Sangamwadi causeway).');
    recommendations.push('Pre-position mobile dewatering pump units at identified depression zones.');
  } else if (index >= 50) {
    recommendations.push('Issue precautionary traffic advisory for riverine roads.');
    recommendations.push('Monitor upstream Khadakwasla reservoir release telemetry closely.');
    recommendations.push('Alert ward emergency maintenance crews to inspect secondary roadside drains.');
  } else if (index >= 25) {
    recommendations.push('Maintain standard monsoon watch on local drainage collectors.');
    recommendations.push('Verify automated rain gauge operational status.');
  } else {
    recommendations.push('Current parameters within nominal storm absorption limits. Standard operational status.');
  }

  return {
    primaryDriver: topFactor ? topFactor.name : 'None',
    synthesisText: sentences.join(' '),
    recommendations
  };
}
