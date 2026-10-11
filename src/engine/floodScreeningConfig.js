/**
 * PRALEYE Flood Screening Engine Configuration
 * Documented Screening Weights, Thresholds, and Classifications
 * 
 * NOTE: These are initial prototype screening weights and heuristic thresholds
 * calibrated for demonstration purposes, NOT universally validated empirical coefficients.
 */

// Initial Configurable Screening Weights (Sum = 1.00 / 100%)
export const FACTOR_WEIGHTS = {
  accumulatedRainfall24h: 0.30, // 30% - Total volumetric rainfall load over 24h
  peakIntensity1h: 0.25,        // 25% - Short-duration peak intensity (mm/h)
  hydraulicExposure: 0.20,      // 20% - Floodplain polygon & drainage proximity
  soilSaturation: 0.15,         // 15% - Antecedent moisture saturation index
  drainageObstruction: 0.10      // 10% - Stormwater culvert blockage / siltation
};

// Official India Meteorological Department (IMD) 24-hour Rainfall Categories
// Source: IMD Standard Terminology for Precipitation Intensity
export const IMD_RAINFALL_24H_BANDS = [
  { min: 0.0, max: 2.4, name: 'No Significant Rainfall', score: 0 },
  { min: 2.5, max: 15.5, name: 'Light Rainfall', score: 10 },
  { min: 15.6, max: 64.4, name: 'Moderate Rainfall', score: 30 },
  { min: 64.5, max: 115.5, name: 'Heavy Rainfall', score: 65 },
  { min: 115.6, max: 204.4, name: 'Very Heavy Rainfall', score: 85 },
  { min: 204.5, max: Infinity, name: 'Extremely Heavy Rainfall', score: 100 }
];

// Prototype Heuristic Thresholds for Short-Duration Peak 1-Hour Rainfall Intensity (mm/h)
// In urban Indian drainage design, primary stormwater drains are typically designed for 25-35 mm/h.
export const PEAK_INTENSITY_1H_BANDS = [
  { min: 0, max: 5.0, scoreMin: 0, scoreMax: 15, label: 'Low Intensity (< 5 mm/h)' },
  { min: 5.0, max: 15.0, scoreMin: 15, scoreMax: 40, label: 'Moderate Intensity (5–15 mm/h)' },
  { min: 15.0, max: 30.0, scoreMin: 40, scoreMax: 70, label: 'High Intensity (15–30 mm/h - drain threshold)' },
  { min: 30.0, max: 50.0, scoreMin: 70, scoreMax: 90, label: 'Very High Intensity (30–50 mm/h)' },
  { min: 50.0, max: 100.0, scoreMin: 90, scoreMax: 100, label: 'Cloudburst Threshold (> 50 mm/h)' }
];

// Prototype Screening Severity Categories (Internal screening index 0–100)
// IMPORTANT: These are internal screening categories, NOT official meteorological warnings or automated evacuation triggers.
export const SCREENING_CATEGORIES = [
  {
    min: 0,
    max: 24,
    category: 'Low Screening Concern',
    color: '#10b981',
    bgColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Precipitation and terrain factors indicate minimal surface runoff hazard. Standard urban drainage capacity sufficient.'
  },
  {
    min: 25,
    max: 49,
    category: 'Moderate Screening Concern',
    color: '#eab308',
    bgColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Elevated surface waterlogging potential in localized depressions. Maintain routine hydrologic monitoring.'
  },
  {
    min: 50,
    max: 74,
    category: 'High Screening Concern',
    color: '#f97316',
    bgColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    description: 'Substantial inundation risk along riverine corridors and low-lying arterial transit links. Pre-position dewatering pumps.'
  },
  {
    min: 75,
    max: 100,
    category: 'Critical Screening Concern',
    color: '#ef4444',
    bgColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    description: 'Severe multi-factor flood hazard. Runoff exceeds drainage absorption threshold. Immediate field inspection recommended.'
  }
];

// Data Coverage Thresholds
export const COVERAGE_THRESHOLDS = {
  INSUFFICIENT: 0.50, // Below 50% coverage -> Insufficient evidence
  PROVISIONAL: 0.75   // 50% to 74% coverage -> Provisional screening index with warning
};

// Simplified Rational Method Parameters
export const RATIONAL_METHOD_DEFAULTS = {
  runoffCoefficientC: 0.75, // Dense urban paved / impervious commercial surface
  catchmentAreaKm2: 18.4,   // Default Mula-Mutha urban drainage sub-basin extent
  statedAssumptions: 'Simplified Rational Formula: Q = (C · i · A) / 3.6. Assumes uniform rainfall intensity across entire 18.4 km² basin and steady-state peak runoff. Catchment lag parameters (SCS/Kirpich) are uncalibrated.'
};

// Documented Demonstration Scenarios
export const DEMO_SCENARIOS = [
  {
    id: 'scen-moderate',
    name: 'Scenario A: Moderate Sustained Monsoon',
    description: 'Continuous moderate precipitation within nominal drain discharge limits.',
    rainfall24h: 35.0,
    peakIntensity1h: 12.0,
    soilSaturationPct: 45.0,
    drainageObstructionPct: 15.0,
    isSoilUserSupplied: true,
    isDrainageUserSupplied: true
  },
  {
    id: 'scen-heavy',
    name: 'Scenario B: Heavy Monsoon Downpour',
    description: 'Significant 24h precipitation pushing soil saturation and culvert capacities.',
    rainfall24h: 85.0,
    peakIntensity1h: 24.0,
    soilSaturationPct: 75.0,
    drainageObstructionPct: 35.0,
    isSoilUserSupplied: true,
    isDrainageUserSupplied: true
  },
  {
    id: 'scen-cloudburst',
    name: 'Scenario C: Intense Short-Duration Cloudburst',
    description: 'Extreme peak 1h intensity exceeding storm drain absorption capacity.',
    rainfall24h: 118.0,
    peakIntensity1h: 58.0,
    soilSaturationPct: 82.0,
    drainageObstructionPct: 45.0,
    isSoilUserSupplied: true,
    isDrainageUserSupplied: true
  },
  {
    id: 'scen-obstructed',
    name: 'Scenario D: Heavy Rain + 80% Drainage Obstruction',
    description: 'Compound disaster scenario with heavy rain and severely clogged culverts.',
    rainfall24h: 135.0,
    peakIntensity1h: 38.0,
    soilSaturationPct: 88.0,
    drainageObstructionPct: 80.0,
    isSoilUserSupplied: true,
    isDrainageUserSupplied: true
  }
];
