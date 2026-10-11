import React, { useState } from 'react';
import {
  Users,
  Building,
  Hospital,
  GraduationCap,
  Bridge,
  Activity,
  AlertTriangle,
  ChevronRight,
  Map,
  ShieldAlert,
  Zap,
  Truck,
  CheckCircle2,
  Download,
  Filter,
  ArrowRight
} from 'lucide-react';
import { DISASTER_INCIDENTS, CRITICAL_FACILITIES } from '../data/disasterData';

export default function ImpactIntelligence({ selectedIncident: initialIncident, onNavigateToResources }) {
  const [selectedIncidentId, setSelectedIncidentId] = useState(initialIncident?.id || DISASTER_INCIDENTS[0].id);
  const [activeTab, setActiveTab] = useState('Overview');

  const incident = DISASTER_INCIDENTS.find(i => i.id === selectedIncidentId) || DISASTER_INCIDENTS[0];

  const tabs = ['Overview', 'Population & Demographics', 'Critical Infrastructure', 'Tactical Protocols'];

  const populationBreakdown = [
    { name: 'High Vulnerability (Elderly/Children)', count: incident.highVulnerabilityPop, color: '#B42332' },
    { name: 'Moderate Exposure', count: Math.round(incident.populationAtRisk * 0.45), color: '#B86A12' },
    { name: 'General Population In Zone', count: Math.round(incident.populationAtRisk * 0.28), color: '#175CD3' }
  ];

  const demographicGroups = [
    { name: 'Children (< 12 yrs)', count: Math.round(incident.populationAtRisk * 0.16) },
    { name: 'Elderly (> 65 yrs)', count: Math.round(incident.populationAtRisk * 0.14) },
    { name: 'Persons with Disabilities', count: Math.round(incident.populationAtRisk * 0.04) },
    { name: 'Patients in Facilities', count: incident.criticalFacilities.hospitals * 190 }
  ];

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* Event Selector & Header Bar */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7D1D2D]/10 border border-[#7D1D2D]/20 flex items-center justify-center text-[#7D1D2D]">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26] flex items-center gap-2">
              Impact Intelligence Assessment
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#B42332] border border-red-200">
                {incident.severity}
              </span>
            </h2>
            <p className="text-[12px] text-[#667085]">WHERE, WHO, WHAT &amp; WHAT NEXT Operational Dossier</p>
          </div>
        </div>

        {/* Incident Switcher Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#667085] font-medium whitespace-nowrap">Active Disaster:</span>
          <select
            value={selectedIncidentId}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg px-3 py-2 text-xs text-[#161B26] focus:bg-white focus:outline-none focus:border-[#7D1D2D] font-medium w-full md:w-80 transition-colors"
          >
            {DISASTER_INCIDENTS.map(inc => (
              <option key={inc.id} value={inc.id}>
                {inc.name} ({inc.type} · {inc.severity})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E3E6EB] space-x-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2.5 px-4 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#7D1D2D] text-[#7D1D2D] bg-[#7D1D2D]/10'
                : 'border-transparent text-[#667085] hover:text-[#161B26] hover:bg-[#F5F6F8]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* 4 Core Pillars: WHERE? WHO? WHAT? WHAT NEXT? */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E3E6EB] p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#175CD3]">WHERE?</span>
              <p className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">{incident.affectedAreaKm2} km²</p>
              <p className="text-xs text-[#667085] mt-1 line-clamp-1">{incident.location}</p>
              <div className="mt-3 text-[11px] text-[#175CD3] font-medium bg-blue-50 p-2 rounded-lg border border-blue-200">
                Radius: {incident.radiusKm} km from epicenter
              </div>
            </div>

            <div className="bg-white border border-[#E3E6EB] p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B86A12]">WHO?</span>
              <p className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">{incident.populationAtRisk.toLocaleString()}</p>
              <p className="text-xs text-[#B86A12] font-semibold mt-1">{incident.highVulnerabilityPop.toLocaleString()} high vulnerability</p>
              <div className="mt-3 text-[11px] text-[#B86A12] font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                Children &amp; elderly prioritized
              </div>
            </div>

            <div className="bg-white border border-[#E3E6EB] p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B42332]">WHAT?</span>
              <p className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">
                {incident.criticalFacilities.hospitals + incident.criticalFacilities.schools + incident.criticalFacilities.bridges} Assets
              </p>
              <p className="text-xs text-[#667085] mt-1">
                {incident.criticalFacilities.hospitals} Hospitals · {incident.criticalFacilities.bridges} Bridges
              </p>
              <div className="mt-3 text-[11px] text-[#B42332] font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                {incident.criticalFacilities.roadSegments} road segments inundated
              </div>
            </div>

            <div className="bg-white border border-[#E3E6EB] p-5 rounded-xl shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#027A48]">WHAT NEXT?</span>
              <p className="text-[20px] leading-[28px] font-bold text-[#027A48] mt-1">Phase-2 Evacuation</p>
              <p className="text-xs text-[#667085] mt-1">Pre-position 3 NDRF teams</p>
              <div className="mt-3 text-[11px] text-[#027A48] font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                Activate {incident.criticalFacilities.shelters} designated relief shelters
              </div>
            </div>
          </div>

          {/* Affected Areas / Zones Table */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
                Exposed Sub-Sectors Breakdown for {incident.name}
              </h3>
              <span className="text-[12px] text-[#667085]">Live Telemetry Synchronized</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E3E6EB] bg-[#F5F6F8] text-[#667085] text-[11px] uppercase font-bold">
                    <th className="py-2.5 px-3">Sector / Zone</th>
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Exposed Pop.</th>
                    <th className="py-2.5 px-3">Flood Probability</th>
                    <th className="py-2.5 px-3">Critical Infrastructure</th>
                    <th className="py-2.5 px-3 text-right">Action Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E3E6EB]">
                  <tr className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#161B26]">Zone A (Hadapsar Basin)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#B42332] border border-red-200">
                        CRITICAL
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#161B26]">12,400</td>
                    <td className="py-3 px-3 text-[#B42332] font-bold">87%</td>
                    <td className="py-3 px-3 text-[#667085]">2 Hospitals, 4 Schools, 3 Bridges</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-[#B42332] font-semibold">Immediate Evacuation</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#161B26]">Zone B (Kharadi Bypass)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-[#B86A12] border border-amber-200">
                        HIGH
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#161B26]">8,200</td>
                    <td className="py-3 px-3 text-[#B86A12] font-bold">72%</td>
                    <td className="py-3 px-3 text-[#667085]">1 Hospital, 3 Schools, 2 Bridges</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-[#B86A12] font-semibold">Deploy Dewatering</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#161B26]">Zone C (Wagholi Perimeter)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-[#B86A12] border border-amber-200">
                        MODERATE
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#161B26]">5,600</td>
                    <td className="py-3 px-3 text-[#B86A12] font-bold">48%</td>
                    <td className="py-3 px-3 text-[#667085]">1 School, 1 Bridge</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-[#B86A12] font-semibold">Monitor Sluices</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#161B26]">Zone D (Aundh Elevated Sector)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#027A48] border border-emerald-200">
                        LOW / SAFE
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-[#161B26]">4,600</td>
                    <td className="py-3 px-3 text-[#027A48] font-bold">15%</td>
                    <td className="py-3 px-3 text-[#667085]">1 Civil Shelter (1,200 Cap)</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-[#027A48] font-semibold">Designated Relief Hub</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Population & Demographics */}
      {activeTab === 'Population & Demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
              Vulnerability Stratification
            </h3>
            <div className="space-y-3.5">
              {populationBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#667085] font-medium">{item.name}</span>
                    <span className="font-bold text-[#161B26]">{item.count.toLocaleString()}</span>
                  </div>
                  <div className="h-2.5 bg-[#E3E6EB] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(item.count / incident.populationAtRisk) * 100}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB] text-xs text-[#667085]">
              High-vulnerability demographic comprises children aged &lt; 12 and senior citizens requiring wheelchair or stretcher evacuation support.
            </div>
          </div>

          <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
              Specialized Demographics Requiring Assisted Transport
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              {demographicGroups.map((grp, idx) => (
                <div key={idx} className="bg-[#F5F6F8] p-3.5 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[11px] text-[#667085] uppercase font-semibold">{grp.name}</p>
                  <p className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">{grp.count.toLocaleString()}</p>
                  <p className="text-[11px] text-[#175CD3] font-medium mt-1">Priority dispatch queued</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Critical Infrastructure */}
      {activeTab === 'Critical Infrastructure' && (
        <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
              Monitored Facilities in Danger Zone
            </h3>
            <span className="text-[12px] text-[#667085]">{CRITICAL_FACILITIES.length} tracked entities</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CRITICAL_FACILITIES.map(fac => (
              <div key={fac.id} className="bg-[#F5F6F8] p-4 rounded-xl border border-[#E3E6EB] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase font-bold text-[#667085] px-2 py-0.5 rounded bg-white border border-[#E3E6EB]">
                      {fac.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        fac.status === 'Critical'
                          ? 'bg-red-50 text-[#B42332] border border-red-200'
                          : fac.status === 'High'
                          ? 'bg-amber-50 text-[#B86A12] border border-amber-200'
                          : 'bg-emerald-50 text-[#027A48] border border-emerald-200'
                      }`}
                    >
                      {fac.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#161B26]">{fac.name}</h4>
                  <p className="text-[12px] text-[#667085] mt-1">
                    {fac.beds && `${fac.beds} Beds (${fac.patients} Occupied)`}
                    {fac.capacity && `Shelter Capacity: ${fac.capacity} persons`}
                    {fac.statusText && fac.statusText}
                  </p>
                </div>
                {fac.contact && (
                  <div className="text-[11px] text-[#667085] border-t border-[#E3E6EB] pt-2 mt-2">
                    Control: {fac.contact}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Tactical Protocols */}
      {activeTab === 'Tactical Protocols' && (
        <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs space-y-4">
          <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
            Standard Operating Procedure (SOP) Execution Timeline
          </h3>

          <div className="space-y-3">
            {[
              { time: 'T - 00:00 (Immediate)', title: 'Flash Flood Alert Broadcast', desc: 'Cellular broadcast via Common Alerting Protocol (CAP) to 30,800 mobile subscribers in Zone A & B.' },
              { time: 'T + 00:45 min', title: 'Corridor Barricading', desc: 'Pune Traffic Police seal off Holkar Bridge and Sangamwadi causeway. Divert vehicles to South Elevated Bypass.' },
              { time: 'T + 01:30 min', title: 'Targeted Rescue Dispatch', desc: 'Mobilize 6 NDRF teams and 7 Zodiac outboard motorboats to Hadapsar riverside slums.' },
              { time: 'T + 03:00 min', title: 'Shelter Relief Activation', desc: 'Aundh and Baner emergency shelters initiate intake registration; distribute clean water and high-calorie rations.' }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#F5F6F8] p-3.5 rounded-xl border border-[#E3E6EB]">
                <span className="text-xs font-bold text-[#7D1D2D] bg-[#7D1D2D]/10 px-2.5 py-1 rounded border border-[#7D1D2D]/20 whitespace-nowrap">
                  {step.time}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#161B26]">{step.title}</h4>
                  <p className="text-xs text-[#667085] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
