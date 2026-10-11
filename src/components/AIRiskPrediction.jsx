import React, { useState, useMemo } from 'react';
import {
  Activity,
  Droplets,
  Mountain,
  MapPin,
  BarChart2,
  AlertTriangle,
  Info,
  Shield,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Compass,
  ArrowUpRight,
  HelpCircle,
  Cpu,
  Layers,
  Sparkles,
  FileText,
  AlertCircle,
  Gauge,
  Scale,
  XCircle,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

import {
  calculateScreeningIndex,
  calculateRunoffEstimate,
  validateInputs
} from '../engine/floodScreeningEngine';

import {
  FACTOR_WEIGHTS,
  DEMO_SCENARIOS,
  RATIONAL_METHOD_DEFAULTS
} from '../engine/floodScreeningConfig';

const LOCATIONS = [
  {
    id: 'hadapsar',
    name: 'Hadapsar (Mula-Mutha Basin)',
    elevation: 11.2,
    riverDist: 0.7,
    inFloodHazardPolygon: true,
    slopeDeg: 1.2,
    isCoastal: false,
    defaultRainfall24h: 85.0,
    defaultIntensity1h: 24.0,
    defaultSoilSat: 75.0,
    defaultDrainage: 35.0
  },
  {
    id: 'shivaji',
    name: 'Shivajinagar (Sangam Junction)',
    elevation: 14.5,
    riverDist: 0.5,
    inFloodHazardPolygon: true,
    slopeDeg: 1.5,
    isCoastal: false,
    defaultRainfall24h: 78.0,
    defaultIntensity1h: 22.0,
    defaultSoilSat: 70.0,
    defaultDrainage: 30.0
  },
  {
    id: 'kharadi',
    name: 'Kharadi (EON Free Zone)',
    elevation: 18.0,
    riverDist: 1.2,
    inFloodHazardPolygon: true,
    slopeDeg: 2.1,
    isCoastal: false,
    defaultRainfall24h: 68.0,
    defaultIntensity1h: 18.0,
    defaultSoilSat: 65.0,
    defaultDrainage: 25.0
  },
  {
    id: 'kothrud',
    name: 'Kothrud (Elevated Sector)',
    elevation: 28.5,
    riverDist: 2.8,
    inFloodHazardPolygon: false,
    slopeDeg: 2.8,
    isCoastal: false,
    defaultRainfall24h: 42.0,
    defaultIntensity1h: 12.0,
    defaultSoilSat: 48.0,
    defaultDrainage: 15.0
  },
  {
    id: 'tamhini',
    name: 'Tamhini Ghat (Mountain Pass)',
    elevation: 580.0,
    riverDist: 4.5,
    inFloodHazardPolygon: false,
    slopeDeg: 34.5, // Steep mountain terrain
    isCoastal: false,
    defaultRainfall24h: 195.0,
    defaultIntensity1h: 48.0,
    defaultSoilSat: 92.0,
    defaultDrainage: 50.0
  }
];

export default function AIRiskPrediction({ onNavigateToEvacuation }) {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedHazard, setSelectedHazard] = useState('flood'); // 'flood', 'landslide', 'surge'

  // Physical model inputs
  const [inputs, setInputs] = useState({
    rainfall24h: LOCATIONS[0].defaultRainfall24h,
    peakIntensity1h: LOCATIONS[0].defaultIntensity1h,
    elevationM: LOCATIONS[0].elevation,
    riverDistKm: LOCATIONS[0].riverDist,
    soilSaturationPct: LOCATIONS[0].defaultSoilSat,
    drainageObstructionPct: LOCATIONS[0].defaultDrainage,
    isRainfallUserSupplied: false,
    isIntensityUserSupplied: false,
    isSoilUserSupplied: true,
    isDrainageUserSupplied: true
  });

  // Track if drainage is marked as missing/unknown
  const [drainageIsMissing, setDrainageIsMissing] = useState(false);

  // Active scenario comparison
  const [comparisonScenario, setComparisonScenario] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

  // Active calculation input object
  const activeCalculationInputs = useMemo(() => {
    return {
      ...inputs,
      drainageObstructionPct: drainageIsMissing ? null : inputs.drainageObstructionPct
    };
  }, [inputs, drainageIsMissing]);

  // Master calculation from reusable screening engine
  const screeningResult = useMemo(() => {
    return calculateScreeningIndex(activeCalculationInputs, selectedLocation);
  }, [activeCalculationInputs, selectedLocation]);

  // Comparison scenario calculation
  const comparisonResult = useMemo(() => {
    if (!comparisonScenario) return null;
    return calculateScreeningIndex(
      {
        rainfall24h: comparisonScenario.rainfall24h,
        peakIntensity1h: comparisonScenario.peakIntensity1h,
        elevationM: selectedLocation.elevation,
        riverDistKm: selectedLocation.riverDist,
        soilSaturationPct: comparisonScenario.soilSaturationPct,
        drainageObstructionPct: comparisonScenario.drainageObstructionPct,
        isSoilUserSupplied: true,
        isDrainageUserSupplied: true
      },
      selectedLocation
    );
  }, [comparisonScenario, selectedLocation]);

  // Handle Location Switch
  const handleLocationChange = (locId) => {
    const loc = LOCATIONS.find(l => l.id === locId) || LOCATIONS[0];
    setSelectedLocation(loc);
    setInputs(prev => ({
      ...prev,
      elevationM: loc.elevation,
      riverDistKm: loc.riverDist,
      rainfall24h: loc.defaultRainfall24h,
      peakIntensity1h: loc.defaultIntensity1h,
      soilSaturationPct: loc.defaultSoilSat,
      drainageObstructionPct: loc.defaultDrainage,
      isRainfallUserSupplied: false,
      isIntensityUserSupplied: false
    }));
    setDrainageIsMissing(false);
  };

  // Reset to Documented Baseline
  const handleResetToBaseline = () => {
    setInputs({
      rainfall24h: selectedLocation.defaultRainfall24h,
      peakIntensity1h: selectedLocation.defaultIntensity1h,
      elevationM: selectedLocation.elevation,
      riverDistKm: selectedLocation.riverDist,
      soilSaturationPct: selectedLocation.defaultSoilSat,
      drainageObstructionPct: selectedLocation.defaultDrainage,
      isRainfallUserSupplied: false,
      isIntensityUserSupplied: false,
      isSoilUserSupplied: true,
      isDrainageUserSupplied: true
    });
    setDrainageIsMissing(false);
    setComparisonScenario(null);
    setShowComparison(false);
  };

  // Apply Documented Scenario Preset
  const handleApplyScenario = (scenario) => {
    setInputs(prev => ({
      ...prev,
      rainfall24h: scenario.rainfall24h,
      peakIntensity1h: scenario.peakIntensity1h,
      soilSaturationPct: scenario.soilSaturationPct,
      drainageObstructionPct: scenario.drainageObstructionPct,
      isRainfallUserSupplied: true,
      isIntensityUserSupplied: true,
      isSoilUserSupplied: true,
      isDrainageUserSupplied: true
    }));
    setDrainageIsMissing(false);
    setComparisonScenario(scenario);
  };

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* 1. Transparent Model Contract & Header */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#7D1D2D]/10 border border-[#7D1D2D]/20 flex items-center justify-center text-[#7D1D2D] flex-shrink-0">
              <Scale size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26]">
                  PRALEYE Flood Risk Screening Engine
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#7D1D2D]/10 text-[#7D1D2D] border border-[#7D1D2D]/20">
                  EMPIRICAL SCREENING MODEL (PROTOTYPE)
                </span>
              </div>
              <p className="text-[12px] text-[#667085] mt-0.5">
                Deterministic multi-factor environmental index evaluating 24h rainfall load, 1h short-duration intensity, hydraulic floodplain exposure, and drainage status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToBaseline}
              className="bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#161B26] border border-[#E3E6EB] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={12} />
              Reset Baseline
            </button>
          </div>
        </div>

        {/* Explicit Contract Notice */}
        <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB] text-[12px] text-[#667085] flex items-start gap-2">
          <Info size={15} className="text-[#175CD3] flex-shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#161B26]">Methodology Contract: </strong>
            This score represents an internal <strong>Flood Screening Index (0–100)</strong>, not an AI-calibrated probability of flooding. ML inference is currently uncoupled; calculations use documented IMD rainfall thresholds and multi-factor weight normalization. Internal screening only &mdash; not for automated evacuation orders.
          </span>
        </div>
      </div>

      {/* 2. Main Work Area: Input Parameters (5 Cols) vs Results & Analysis (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Physical Controls & Scenarios (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Location & Hazard Selection */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider flex items-center gap-2">
              <MapPin size={15} className="text-[#7D1D2D]" />
              1. Geographic Target &amp; Hazard Mechanism
            </h3>

            <div>
              <label className="block text-[12px] text-[#667085] mb-1 font-medium">Location Context (Pune Region)</label>
              <select
                value={selectedLocation.id}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg p-2.5 text-xs text-[#161B26] focus:bg-white focus:outline-none focus:border-[#7D1D2D] font-medium transition-colors"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} &mdash; {loc.elevation}m MSL {loc.inFloodHazardPolygon ? '(In Mapped Floodplain)' : '(Outside Floodplain)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Hazard Mechanism Chips */}
            <div>
              <label className="block text-[12px] text-[#667085] mb-1.5 font-medium">Hazard Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'flood', label: 'Urban Flood', icon: '🌊', supported: true },
                  { id: 'landslide', label: 'Landslide', icon: '⛰️', supported: selectedLocation.slopeDeg > 15 },
                  { id: 'surge', label: 'Coastal Surge', icon: '🌀', supported: false }
                ].map(hz => (
                  <button
                    key={hz.id}
                    onClick={() => setSelectedHazard(hz.id)}
                    className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                      selectedHazard === hz.id
                        ? 'bg-[#7D1D2D]/10 text-[#7D1D2D] border-[#7D1D2D]/50 shadow-xs'
                        : hz.supported
                        ? 'bg-[#F5F6F8] border-[#E3E6EB] text-[#667085] hover:text-[#161B26]'
                        : 'bg-[#F5F6F8]/50 border-[#E3E6EB] text-slate-400 opacity-60'
                    }`}
                  >
                    <span className="text-base">{hz.icon}</span>
                    <span className="text-[11px]">{hz.label}</span>
                  </button>
                ))}
              </div>

              {/* Hazard Incompatibility Warning Messages */}
              {selectedHazard === 'surge' && (
                <div className="mt-3 bg-red-50 border border-red-200 p-2.5 rounded-lg text-[12px] text-red-900 flex items-start gap-2">
                  <XCircle size={15} className="text-[#B42332] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Inland Geographic Constraint: </strong>
                    Pune is situated ~120 km inland at an elevation of &gt; 500m MSL with zero maritime tidal influence. Coastal storm surge screening is geographically disabled for this location.
                  </span>
                </div>
              )}

              {selectedHazard === 'landslide' && selectedLocation.slopeDeg < 15 && (
                <div className="mt-3 bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[12px] text-amber-900 flex items-start gap-2">
                  <AlertCircle size={15} className="text-[#B86A12] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Topographic Constraint: </strong>
                    Terrain slope in {selectedLocation.name} is only {selectedLocation.slopeDeg}&deg;. Mountain slope failure screening requires terrain gradient &gt; 15&deg;. Switch to <strong>Tamhini Ghat</strong> to inspect slope failure screening.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Documented Demonstration Scenarios */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={15} className="text-[#B86A12]" />
                2. Documented Demonstration Scenarios
              </h3>
              {comparisonScenario && (
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-[11px] text-[#175CD3] hover:underline font-semibold"
                >
                  {showComparison ? 'Hide Comparison' : 'Compare Scenarios'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {DEMO_SCENARIOS.map(scen => (
                <button
                  key={scen.id}
                  onClick={() => handleApplyScenario(scen)}
                  className="bg-[#F5F6F8] hover:bg-slate-100 border border-[#E3E6EB] p-3 rounded-lg text-left text-xs transition-colors flex items-center justify-between group"
                >
                  <div>
                    <p className="font-bold text-[#161B26] group-hover:text-[#7D1D2D]">{scen.name}</p>
                    <p className="text-[11px] text-[#667085] mt-0.5">{scen.description}</p>
                    <p className="text-[11px] text-[#667085] mt-1 font-mono">
                      Rain: <strong className="text-[#161B26]">{scen.rainfall24h} mm</strong> &middot; 
                      Peak: <strong className="text-[#161B26]">{scen.peakIntensity1h} mm/h</strong> &middot; 
                      Soil: <strong className="text-[#161B26]">{scen.soilSaturationPct}%</strong> &middot; 
                      Drain: <strong className="text-[#161B26]">{scen.drainageObstructionPct}%</strong>
                    </p>
                  </div>
                  <ChevronRight size={15} className="text-[#667085] group-hover:text-[#7D1D2D] group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Physical-Model Parameter Sliders */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider flex items-center gap-2">
              <Sliders size={15} className="text-[#7D1D2D]" />
              3. Environmental &amp; Physical Inputs
            </h3>

            {/* Slider 1: 24h Accumulated Rainfall */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#667085] font-medium">Accumulated 24h Rainfall</span>
                <span className="font-mono font-bold text-[#7D1D2D]">{inputs.rainfall24h} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                step="1"
                value={inputs.rainfall24h}
                onChange={(e) => setInputs(prev => ({ ...prev, rainfall24h: Number(e.target.value), isRainfallUserSupplied: true }))}
                className="w-full accent-[#7D1D2D]"
              />
              <div className="flex justify-between text-[10px] text-[#667085] mt-0.5 font-mono">
                <span>0 mm (Nil)</span>
                <span>64.5 mm (Heavy)</span>
                <span>204.5 mm (Extreme)</span>
              </div>
            </div>

            {/* Slider 2: Peak 1-Hour Rainfall Intensity (mm/h) */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#667085] font-medium">Peak 1-Hour Rainfall Intensity</span>
                <span className="font-mono font-bold text-[#7D1D2D]">{inputs.peakIntensity1h} mm/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={inputs.peakIntensity1h}
                onChange={(e) => setInputs(prev => ({ ...prev, peakIntensity1h: Number(e.target.value), isIntensityUserSupplied: true }))}
                className="w-full accent-[#7D1D2D]"
              />
              <div className="flex justify-between text-[10px] text-[#667085] mt-0.5 font-mono">
                <span>0 mm/h</span>
                <span>25 mm/h (Capacity)</span>
                <span>50+ mm/h (Cloudburst)</span>
              </div>
            </div>

            {/* Slider 3: Soil Moisture Saturation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#667085] font-medium">Soil Moisture Saturation Index</span>
                <span className="font-mono font-bold text-[#161B26]">{inputs.soilSaturationPct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={inputs.soilSaturationPct}
                onChange={(e) => setInputs(prev => ({ ...prev, soilSaturationPct: Number(e.target.value), isSoilUserSupplied: true }))}
                className="w-full accent-[#7D1D2D]"
              />
              <p className="text-[10px] text-[#667085] mt-0.5">User-entered scenario assumption</p>
            </div>

            {/* Slider 4: Drainage Obstruction with Missing Toggle */}
            <div className="pt-2 border-t border-[#E3E6EB]">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[#667085] font-medium">Drainage Culvert Obstruction</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDrainageIsMissing(!drainageIsMissing)}
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                      drainageIsMissing
                        ? 'bg-amber-100 text-[#B86A12] border border-amber-300'
                        : 'bg-[#F5F6F8] text-[#667085] hover:text-[#161B26] border border-[#E3E6EB]'
                    }`}
                  >
                    {drainageIsMissing ? 'Status: Missing / Unknown' : 'Mark as Missing'}
                  </button>
                  {!drainageIsMissing && (
                    <span className="font-mono font-bold text-[#B42332]">{inputs.drainageObstructionPct}%</span>
                  )}
                </div>
              </div>

              {!drainageIsMissing ? (
                <>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={inputs.drainageObstructionPct}
                    onChange={(e) => setInputs(prev => ({ ...prev, drainageObstructionPct: Number(e.target.value), isDrainageUserSupplied: true }))}
                    className="w-full accent-[#B42332]"
                  />
                  <p className="text-[10px] text-[#667085] mt-0.5">User-entered scenario assumption</p>
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-2 rounded text-[11px] text-amber-900">
                  ⚠️ Drainage factor excluded from weight sum. Weight redistributed to available factors.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Transparent Outputs, Gauge, Table & Evidence Reasoning (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Screening Gauge Card */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-6 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Circular Gauge */}
              <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    stroke="#E3E6EB"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="64"
                    stroke={screeningResult.categoryInfo?.color || '#7D1D2D'}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 64}
                    strokeDashoffset={2 * Math.PI * 64 * (1 - (screeningResult.screeningIndex || 0) / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold text-[#161B26] font-mono tabular-nums tracking-tight">
                    {screeningResult.screeningIndex !== null ? `${screeningResult.screeningIndex}/100` : 'N/A'}
                  </span>
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded"
                    style={{ color: screeningResult.categoryInfo?.color }}
                  >
                    {screeningResult.categoryInfo?.category}
                  </span>
                  <span className="text-[10px] text-[#667085] mt-0.5">Screening Index</span>
                </div>
              </div>

              {/* Status & Coverage Summary */}
              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: screeningResult.categoryInfo?.color,
                        borderColor: screeningResult.categoryInfo?.color,
                        backgroundColor: `${screeningResult.categoryInfo?.color}15`
                      }}
                    >
                      {screeningResult.categoryInfo?.category}
                    </span>
                    <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      screeningResult.coverageStatus === 'COMPLETE'
                        ? 'bg-emerald-50 text-[#027A48] border-emerald-200'
                        : 'bg-amber-50 text-[#B86A12] border-amber-200'
                    }`}>
                      Data Coverage: {screeningResult.dataCoveragePct}%
                    </span>
                  </div>

                  <h3 className="text-[17px] leading-[24px] font-semibold text-[#161B26] mt-1">
                    {selectedLocation.name} Flood Vulnerability
                  </h3>
                  <p className="text-[13px] text-[#667085] mt-1 leading-relaxed">
                    {screeningResult.categoryInfo?.description}
                  </p>
                </div>

                {screeningResult.coverageWarning && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[12px] text-amber-900 flex items-start gap-1.5">
                    <AlertTriangle size={15} className="text-[#B86A12] flex-shrink-0 mt-0.5" />
                    <span>{screeningResult.coverageWarning}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scenario Comparison View (If Active) */}
          {showComparison && comparisonResult && (
            <div className="bg-white border border-[#175CD3]/40 rounded-xl p-4 shadow-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E3E6EB] pb-2">
                <span className="text-xs font-bold text-[#175CD3] uppercase tracking-wider flex items-center gap-1.5">
                  <Scale size={13} />
                  Scenario Comparison: Active Inputs vs {comparisonScenario.name}
                </span>
                <button onClick={() => setShowComparison(false)} className="text-[#667085] hover:text-[#161B26]">
                  <XCircle size={15} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#F5F6F8] p-2.5 rounded border border-[#E3E6EB]">
                  <span className="text-[10px] text-[#667085] uppercase">Active Index</span>
                  <p className="text-base font-bold text-[#161B26] font-mono">{screeningResult.screeningIndex}/100</p>
                </div>
                <div className="bg-[#F5F6F8] p-2.5 rounded border border-[#E3E6EB]">
                  <span className="text-[10px] text-[#667085] uppercase">{comparisonScenario.name}</span>
                  <p className="text-base font-bold text-[#175CD3] font-mono">{comparisonResult.screeningIndex}/100</p>
                </div>
                <div className="bg-[#F5F6F8] p-2.5 rounded border border-[#E3E6EB]">
                  <span className="text-[10px] text-[#667085] uppercase">Score Delta</span>
                  <p className={`text-base font-bold font-mono ${
                    screeningResult.screeningIndex >= comparisonResult.screeningIndex ? 'text-[#B42332]' : 'text-[#027A48]'
                  }`}>
                    {screeningResult.screeningIndex >= comparisonResult.screeningIndex ? '+' : ''}
                    {screeningResult.screeningIndex - comparisonResult.screeningIndex} pts
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Factor Breakdown Component Table */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={15} className="text-[#7D1D2D]" />
                Component-by-Component Screening Breakdown
              </h3>
              <span className="text-[11px] text-[#667085] font-mono">Weight Sum: 100%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3E6EB] bg-[#F5F6F8] text-[#667085] text-[11px] uppercase font-bold">
                    <th className="py-2.5 px-3">Factor</th>
                    <th className="py-2.5 px-3">Input Value</th>
                    <th className="py-2.5 px-3">Score (/100)</th>
                    <th className="py-2.5 px-3">Weight</th>
                    <th className="py-2.5 px-3">Contribution</th>
                    <th className="py-2.5 px-3 text-right">Data Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E6EB] font-mono text-[12px]">
                  {screeningResult.factors?.map((f) => (
                    <tr key={f.key} className="hover:bg-[#F5F6F8]/60 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-medium text-[#161B26]">{f.name}</td>
                      <td className="py-2.5 px-3 text-[#175CD3] font-bold">{f.formattedValue}</td>
                      <td className="py-2.5 px-3">
                        {f.isAvailable ? (
                          <span className="font-bold text-[#161B26]">{f.componentScore}</span>
                        ) : (
                          <span className="text-[#B86A12] text-[11px] font-semibold">Missing</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[#667085]">{Math.round(f.weight * 100)}%</td>
                      <td className="py-2.5 px-3 text-[#7D1D2D] font-bold">
                        {f.isAvailable ? `${f.weightedContribution} pts` : '0 pts'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-sans text-[11px]">
                        <span className={`px-2 py-0.5 rounded font-medium ${
                          f.provenanceType.includes('User-Supplied')
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : f.provenanceType.includes('Missing')
                            ? 'bg-amber-50 text-[#B86A12] border border-amber-200'
                            : 'bg-[#F5F6F8] text-[#667085] border border-[#E3E6EB]'
                        }`}>
                          {f.provenanceType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simplified Rational Method Runoff Calculation Card */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-4 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#161B26] uppercase tracking-wider flex items-center gap-1.5">
                <Gauge size={14} className="text-[#175CD3]" />
                Hydrological Runoff Approximation (Rational Method)
              </span>
              <span className="text-[11px] text-[#667085] font-mono">Q = (C &middot; i &middot; A) / 3.6</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Estimated Peak Discharge Q</p>
                <p className="text-lg font-bold text-[#161B26] font-mono mt-0.5">
                  {screeningResult.runoffData?.peakDischargeM3s !== null ? `${screeningResult.runoffData.peakDischargeM3s} m³/s` : 'N/A'}
                </p>
                <p className="text-[11px] text-[#175CD3] font-mono">
                  {screeningResult.runoffData?.peakDischargeLps !== null ? `(${screeningResult.runoffData.peakDischargeLps.toLocaleString()} L/s)` : ''}
                </p>
              </div>

              <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Catchment Time-to-Peak</p>
                <p className="text-xs font-semibold text-[#161B26] mt-1 leading-snug">
                  {screeningResult.runoffData?.timeToPeakStatus}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#667085] leading-relaxed border-t border-[#E3E6EB] pt-2">
              {RATIONAL_METHOD_DEFAULTS.statedAssumptions}
            </p>
          </div>

          {/* Dynamic Evidence-Based Reasoning Synthesis */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider flex items-center gap-2">
              <Info size={15} className="text-[#B86A12]" />
              Evidence-Based Screening Reasoning &amp; Precautionary Actions
            </h3>

            <div className="bg-[#F5F6F8] p-3.5 rounded-lg border border-[#E3E6EB] text-[13px] text-[#161B26] leading-relaxed space-y-2">
              <p>{screeningResult.reasoning?.synthesisText}</p>
            </div>

            {/* Recommendations Checklist */}
            <div className="space-y-2 pt-1">
              <h4 className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">
                Conditional Precautionary Guidance:
              </h4>
              {screeningResult.reasoning?.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#161B26] bg-[#F5F6F8] p-2.5 rounded-lg border border-[#E3E6EB]">
                  <CheckCircle2 size={14} className="text-[#027A48] flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {onNavigateToEvacuation && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onNavigateToEvacuation}
                  className="bg-[#7D1D2D] hover:bg-[#681825] text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  Inspect Evacuation Corridor
                  <ArrowUpRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
