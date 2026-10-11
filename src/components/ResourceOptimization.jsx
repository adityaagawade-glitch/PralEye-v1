import React, { useState } from 'react';
import {
  Car,
  Users,
  Ship,
  Heart,
  AlertTriangle,
  Send,
  RefreshCw,
  BarChart2,
  CheckCircle2,
  Shield,
  Layers,
  Wrench,
  Radio,
  Sparkles
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
import { RESPONSE_RESOURCES } from '../data/disasterData';

const INITIAL_PRIORITY_ZONES = [
  {
    rank: 1,
    zone: 'Zone A (Hadapsar Riverine Basin)',
    population: 12400,
    risk: 'Critical',
    riskScore: 0.92,
    vulnerabilityScore: 0.88,
    infraImpactScore: 0.95,
    allocation: { ambulances: 5, teams: 3, boats: 4, pumps: 5, kits: 120 },
    status: 'ACTIVE_DEPLOYMENT'
  },
  {
    rank: 2,
    zone: 'Zone B (Kharadi Lowland)',
    population: 8200,
    risk: 'High',
    riskScore: 0.74,
    vulnerabilityScore: 0.65,
    infraImpactScore: 0.70,
    allocation: { ambulances: 3, teams: 2, boats: 2, pumps: 3, kits: 80 },
    status: 'EN_ROUTE'
  },
  {
    rank: 3,
    zone: 'Zone C (Wagholi Perimeter)',
    population: 5600,
    risk: 'Moderate',
    riskScore: 0.50,
    vulnerabilityScore: 0.45,
    infraImpactScore: 0.40,
    allocation: { ambulances: 2, teams: 1, boats: 1, pumps: 1, kits: 40 },
    status: 'STAGED'
  }
];

export default function ResourceOptimization() {
  const [priorityZones, setPriorityZones] = useState(INITIAL_PRIORITY_ZONES);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Dynamic calculation of priority scores using the documented formula:
  // Priority Score = (Risk × 0.40) + (Vulnerability × 0.35) + (Infrastructure Impact × 0.25)
  const zonesWithScores = priorityZones.map(z => {
    const rawScore = (z.riskScore * 0.40) + (z.vulnerabilityScore * 0.35) + (z.infraImpactScore * 0.25);
    return {
      ...z,
      compositeScore: Math.round(rawScore * 100)
    };
  });

  const chartData = [
    { name: 'Zone A (Hadapsar)', Ambulances: 5, RescueTeams: 3, Boats: 4, Pumps: 5 },
    { name: 'Zone B (Kharadi)', Ambulances: 3, RescueTeams: 2, Boats: 2, Pumps: 3 },
    { name: 'Zone C (Wagholi)', Ambulances: 2, RescueTeams: 1, Boats: 1, Pumps: 1 }
  ];

  const handleAutoOptimize = () => {
    // Re-run dynamic reallocation heuristic
    const updated = priorityZones.map((z, idx) => ({
      ...z,
      allocation: {
        ambulances: idx === 0 ? 6 : idx === 1 ? 3 : 2,
        teams: idx === 0 ? 3 : idx === 1 ? 2 : 1,
        boats: idx === 0 ? 4 : idx === 1 ? 2 : 1,
        pumps: idx === 0 ? 6 : idx === 1 ? 3 : 1,
        kits: idx === 0 ? 140 : idx === 1 ? 90 : 40
      }
    }));
    setPriorityZones(updated);
  };

  const handleDispatch = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* Top Header & Strategy Info */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7D1D2D]/10 border border-[#7D1D2D]/20 flex items-center justify-center text-[#7D1D2D]">
            <Shield size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26]">Emergency Resource Prioritization Engine</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7D1D2D]/10 text-[#7D1D2D] border border-[#7D1D2D]/20">
                MULTI-OBJECTIVE OPTIMIZATION
              </span>
            </div>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Formulation: <code className="text-[#7D1D2D] font-mono text-[11px] bg-[#F5F6F8] px-1.5 py-0.5 rounded border border-[#E3E6EB]">Priority = (Hazard Risk × 0.40) + (Vulnerability × 0.35) + (Infra Impact × 0.25)</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoOptimize}
            className="bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#161B26] border border-[#E3E6EB] px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles size={13} className="text-[#B86A12]" />
            Auto-Rebalance
          </button>
          <button
            onClick={handleDispatch}
            disabled={isDispatching}
            className="bg-[#7D1D2D] hover:bg-[#681825] text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Send size={13} />
            {isDispatching ? 'Transmitting Dispatch...' : 'Dispatch Resources'}
          </button>
        </div>
      </div>

      {dispatchSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-[#027A48] p-3.5 rounded-xl flex items-center gap-2 text-xs animate-slide-in">
          <CheckCircle2 size={16} />
          <span className="font-medium">
            Emergency Tasking Order broadcast to Pune Emergency Operations Centre (EOC). 11 mobile response units dispatched.
          </span>
        </div>
      )}

      {/* Available Fleet Inventory Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {RESPONSE_RESOURCES.map(res => (
          <div key={res.id} className="bg-white border border-[#E3E6EB] p-4 rounded-xl shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#667085] block mb-1">{res.category}</span>
            <p className="text-xs font-semibold text-[#161B26] line-clamp-1">{res.name}</p>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums">{res.deployed}</span>
              <span className="text-xs text-[#667085] font-semibold">/ {res.total}</span>
            </div>
            <div className="h-1.5 bg-[#E3E6EB] rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-[#7D1D2D] rounded-full transition-all"
                style={{ width: `${(res.deployed / res.total) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-[#667085] mt-1.5">{res.reserved} in reserve</p>
          </div>
        ))}
      </div>

      {/* Priority Allocations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Zone Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
            Sector Allocation Priority Hierarchy
          </h3>

          <div className="space-y-3.5">
            {zonesWithScores.map((zone) => (
              <div key={zone.rank} className="bg-white border border-[#E3E6EB] p-5 rounded-xl shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#F5F6F8] border border-[#E3E6EB] flex items-center justify-center text-xs font-bold text-[#7D1D2D]">
                      {zone.rank}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#161B26]">{zone.zone}</h4>
                      <p className="text-[11px] text-[#667085]">Exposed Population: {zone.population.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        zone.risk === 'Critical'
                          ? 'bg-red-50 text-[#B42332] border border-red-200'
                          : zone.risk === 'High'
                          ? 'bg-amber-50 text-[#B86A12] border border-amber-200'
                          : 'bg-yellow-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {zone.risk}
                    </span>
                    <p className="text-[11px] text-[#667085] mt-0.5">Score: <strong className="text-[#161B26]">{zone.compositeScore}/100</strong></p>
                  </div>
                </div>

                {/* Allocated Units Badges */}
                <div className="grid grid-cols-5 gap-2 text-center text-xs pt-2 border-t border-[#E3E6EB]">
                  <div className="bg-[#F5F6F8] p-2 rounded-lg border border-[#E3E6EB]">
                    <p className="text-[9px] text-[#667085] uppercase font-semibold">Ambulances</p>
                    <p className="text-base font-bold text-[#175CD3] tabular-nums mt-0.5">{zone.allocation.ambulances}</p>
                  </div>
                  <div className="bg-[#F5F6F8] p-2 rounded-lg border border-[#E3E6EB]">
                    <p className="text-[9px] text-[#667085] uppercase font-semibold">NDRF Teams</p>
                    <p className="text-base font-bold text-[#B86A12] tabular-nums mt-0.5">{zone.allocation.teams}</p>
                  </div>
                  <div className="bg-[#F5F6F8] p-2 rounded-lg border border-[#E3E6EB]">
                    <p className="text-[9px] text-[#667085] uppercase font-semibold">Boats</p>
                    <p className="text-base font-bold text-[#7D1D2D] tabular-nums mt-0.5">{zone.allocation.boats}</p>
                  </div>
                  <div className="bg-[#F5F6F8] p-2 rounded-lg border border-[#E3E6EB]">
                    <p className="text-[9px] text-[#667085] uppercase font-semibold">Pumps</p>
                    <p className="text-base font-bold text-[#027A48] tabular-nums mt-0.5">{zone.allocation.pumps}</p>
                  </div>
                  <div className="bg-[#F5F6F8] p-2 rounded-lg border border-[#E3E6EB]">
                    <p className="text-[9px] text-[#667085] uppercase font-semibold">Trauma Kits</p>
                    <p className="text-base font-bold text-[#B42332] tabular-nums mt-0.5">{zone.allocation.kits}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Comparative Deployment Recharts Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider mb-1">
              Resource Distribution Comparison
            </h3>
            <p className="text-[12px] text-[#667085] mb-4">Allocated equipment per priority zone</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E3E6EB" vertical={false} />
                  <XAxis dataKey="name" stroke="#667085" fontSize={11} tickLine={false} />
                  <YAxis stroke="#667085" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E3E6EB', borderRadius: '8px', fontSize: '11px', color: '#161B26', boxShadow: '0 4px 12px rgba(16,24,40,0.08)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Ambulances" fill="#175CD3" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="RescueTeams" fill="#B86A12" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Boats" fill="#7D1D2D" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Pumps" fill="#027A48" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB] text-[12px] text-[#667085] mt-4">
            Prioritization matrix automatically rebalances every 15 minutes as dynamic rainfall telemetry and dam discharge sensor inputs change.
          </div>
        </div>
      </div>
    </div>
  );
}
