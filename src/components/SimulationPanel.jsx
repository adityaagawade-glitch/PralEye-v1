import React, { useState } from 'react';
import {
  Play,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  ArrowUp,
  ArrowDown,
  Activity,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function SimulationPanel() {
  const [rainfallIncrease, setRainfallIncrease] = useState(30);
  const [damDischargeCusecs, setDamDischargeCusecs] = useState(15000);
  const [drainageClogging, setDrainageClogging] = useState(40);
  const [infraFailure, setInfraFailure] = useState(false);

  const [loading, setLoading] = useState(false);
  const [simulated, setSimulated] = useState(true);

  // Baseline scenario (Current live observation)
  const baseline = {
    rainfall: 100,
    area: 12.0,
    population: 12400,
    facilities: 8,
    risk: 'HIGH'
  };

  // Calculate dynamic projected scenario
  const calculateProjection = () => {
    const incFactor = rainfallIncrease / 100;
    const damFactor = (damDischargeCusecs - 10000) / 20000;
    const clogFactor = drainageClogging / 100;

    const projRainfall = Math.round(baseline.rainfall * (1 + incFactor));
    const projArea = Number((baseline.area * (1 + incFactor * 1.6 + damFactor * 0.4 + clogFactor * 0.3)).toFixed(1));
    const projPop = Math.round(baseline.population * (1 + incFactor * 2.1 + damFactor * 0.5 + clogFactor * 0.4) + (infraFailure ? 4500 : 0));
    const projFac = Math.round(baseline.facilities * (1 + incFactor * 0.8 + (infraFailure ? 0.6 : 0)));

    let projRisk = 'CRITICAL';
    if (projRainfall < 80 && projPop < 9000) projRisk = 'LOW';
    else if (projRainfall < 110 && projPop < 15000) projRisk = 'MODERATE';
    else if (projRainfall < 130 && projPop < 22000 && !infraFailure) projRisk = 'HIGH';

    return {
      rainfall: Math.max(0, projRainfall),
      area: Math.max(1, projArea),
      population: Math.max(500, projPop),
      facilities: Math.max(1, projFac),
      risk: projRisk
    };
  };

  const [projection, setProjection] = useState(calculateProjection());

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      setProjection(calculateProjection());
      setSimulated(true);
      setLoading(false);
    }, 600);
  };

  const areaDelta = Math.round(((projection.area - baseline.area) / baseline.area) * 100);
  const popDelta = Math.round(((projection.population - baseline.population) / baseline.population) * 100);
  const facDelta = projection.facilities - baseline.facilities;

  const comparisonData = [
    { name: 'Rainfall (mm)', Baseline: baseline.rainfall, Projected: projection.rainfall },
    { name: 'Area (km²)', Baseline: baseline.area, Projected: projection.area },
    { name: 'Pop (x1000)', Baseline: Number((baseline.population / 1000).toFixed(1)), Projected: Number((projection.population / 1000).toFixed(1)) },
    { name: 'Critical Fac.', Baseline: baseline.facilities, Projected: projection.facilities }
  ];

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* Top Banner */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7D1D2D]/10 border border-[#7D1D2D]/20 flex items-center justify-center text-[#7D1D2D]">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26]">What-If Digital Twin Scenario Simulator</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7D1D2D]/10 text-[#7D1D2D] border border-[#7D1D2D]/20">
                WHAT IF → SIMULATE → PREPARE
              </span>
            </div>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Stress-test disaster resilience by projecting impacts of rainfall surges, dam discharges, and structural failures.
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="bg-[#7D1D2D] hover:bg-[#681825] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
        >
          {loading ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />}
          {loading ? 'Simulating Hydraulics...' : 'RUN SIMULATION'}
        </button>
      </div>

      {/* Main Grid: Controls + Baseline vs Projected Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-5">
          <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider flex items-center gap-2">
            <Sliders size={15} className="text-[#7D1D2D]" />
            Scenario Perturbation Controls
          </h3>

          {/* Slider 1: Rainfall Surge */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#667085] font-medium">Rainfall Increase / Delta</span>
              <span className={`font-bold ${rainfallIncrease >= 0 ? 'text-[#B42332]' : 'text-[#027A48]'}`}>
                {rainfallIncrease >= 0 ? `+${rainfallIncrease}%` : `${rainfallIncrease}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={rainfallIncrease}
              onChange={(e) => setRainfallIncrease(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#667085] mt-0.5">
              <span>-50% (Drying)</span>
              <span>0% (Baseline)</span>
              <span>+100% (Doubled)</span>
            </div>
          </div>

          {/* Slider 2: Khadakwasla Dam Sluice Discharge */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#667085] font-medium">Upstream Dam Discharge</span>
              <span className="font-bold text-[#175CD3]">{damDischargeCusecs.toLocaleString()} cusecs</span>
            </div>
            <input
              type="range"
              min="5000"
              max="35000"
              step="1000"
              value={damDischargeCusecs}
              onChange={(e) => setDamDischargeCusecs(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-[#667085] mt-0.5">
              <span>5,000 (Low)</span>
              <span>18,000 (Warning)</span>
              <span>35,000 (Severe)</span>
            </div>
          </div>

          {/* Slider 3: Drain Blockage */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#667085] font-medium">Culvert &amp; Drain Clogging</span>
              <span className="font-bold text-[#B86A12]">{drainageClogging}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              value={drainageClogging}
              onChange={(e) => setDrainageClogging(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Toggle: Infrastructure Failure (Holkar Bridge Breach) */}
          <div className="pt-3 border-t border-[#E3E6EB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#161B26]">Holkar Bridge Hydraulic Breach</p>
                <p className="text-[11px] text-[#667085]">Simulate backwater surge into Hadapsar</p>
              </div>

              <button
                onClick={() => setInfraFailure(!infraFailure)}
                className={`w-11 h-6 rounded-full transition-colors relative ${infraFailure ? 'bg-[#B42332]' : 'bg-[#E3E6EB]'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 shadow-xs ${infraFailure ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Cards & Charts (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Side-by-Side Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Baseline Card */}
            <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#E3E6EB] pb-2">
                <span className="text-[11px] font-bold text-[#667085] uppercase tracking-wider">Current Baseline</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-[#B86A12] border border-amber-200 uppercase">
                  {baseline.risk}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Rainfall</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{baseline.rainfall} mm</p>
                </div>
                <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Affected Area</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{baseline.area} km²</p>
                </div>
                <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Pop. at Risk</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{baseline.population.toLocaleString()}</p>
                </div>
                <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Critical Fac.</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{baseline.facilities}</p>
                </div>
              </div>
            </div>

            {/* Projected Scenario Card */}
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-red-200 pb-2">
                <span className="text-[11px] font-bold text-[#B42332] uppercase tracking-wider">Projected Scenario</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#B42332] border border-red-300 uppercase">
                  {projection.risk}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Rainfall</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{projection.rainfall} mm</p>
                  <span className="text-[11px] text-[#B42332] font-bold">
                    {rainfallIncrease >= 0 ? `↑ ${rainfallIncrease}%` : `↓ ${Math.abs(rainfallIncrease)}%`}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Affected Area</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{projection.area} km²</p>
                  <span className={`text-[11px] font-bold ${areaDelta >= 0 ? 'text-[#B42332]' : 'text-[#027A48]'}`}>
                    {areaDelta >= 0 ? `↑ ${areaDelta}%` : `↓ ${Math.abs(areaDelta)}%`}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Pop. at Risk</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{projection.population.toLocaleString()}</p>
                  <span className={`text-[11px] font-bold ${popDelta >= 0 ? 'text-[#B42332]' : 'text-[#027A48]'}`}>
                    {popDelta >= 0 ? `↑ ${popDelta}%` : `↓ ${Math.abs(popDelta)}%`}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-200">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Critical Fac.</p>
                  <p className="text-base font-bold text-[#161B26] tabular-nums mt-0.5">{projection.facilities}</p>
                  <span className="text-[11px] text-[#B42332] font-bold">
                    {facDelta >= 0 ? `↑ +${facDelta}` : `↓ ${facDelta}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative BarChart */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider mb-3">
              Baseline vs Projected Impact Delta
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E6EB" vertical={false} />
                  <XAxis dataKey="name" stroke="#667085" fontSize={11} tickLine={false} />
                  <YAxis stroke="#667085" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E6EB', borderRadius: '8px', fontSize: '11px', color: '#161B26', boxShadow: '0 4px 12px rgba(16,24,40,0.08)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Baseline" fill="#175CD3" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Projected" fill="#B42332" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
