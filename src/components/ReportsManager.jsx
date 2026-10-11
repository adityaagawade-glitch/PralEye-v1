import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  CheckCircle2,
  Calendar,
  Shield,
  Layers,
  Database,
  Share2,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import {
  DISASTER_INCIDENTS,
  CRITICAL_FACILITIES,
  RESPONSE_RESOURCES,
  ACTIVE_ALERTS,
  DEMO_METADATA
} from '../data/disasterData';

export default function ReportsManager() {
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // Generate and download CSV
  const handleExportCSV = () => {
    const headers = [
      'Incident_ID',
      'Incident_Name',
      'Hazard_Type',
      'Severity',
      'Location',
      'Coordinates_Lat',
      'Coordinates_Lng',
      'Affected_Area_sq_km',
      'Population_At_Risk',
      'High_Vulnerability_Pop',
      'Flood_Probability_Pct',
      'Status'
    ];

    const rows = DISASTER_INCIDENTS.map(inc => [
      `"${inc.id}"`,
      `"${inc.name}"`,
      `"${inc.type}"`,
      `"${inc.severity}"`,
      `"${inc.location}"`,
      inc.coordinates[0],
      inc.coordinates[1],
      inc.affectedAreaKm2,
      inc.populationAtRisk,
      inc.highVulnerabilityPop,
      inc.floodProb,
      `"${inc.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PRALEYE_SITREP_Pune_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV Situation Report downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  // Generate and download JSON
  const handleExportJSON = () => {
    const reportData = {
      platform: 'PRALEYE Disaster Intelligence Platform v2.4',
      generatedAt: new Date().toISOString(),
      metadata: DEMO_METADATA,
      incidents: DISASTER_INCIDENTS,
      criticalFacilities: CRITICAL_FACILITIES,
      resourceDeployment: RESPONSE_RESOURCES,
      activeAlerts: ACTIVE_ALERTS
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PRALEYE_Disaster_Data_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('Complete JSON telemetry payload exported successfully.');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* Top Banner */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#7D1D2D]/10 border border-[#7D1D2D]/20 flex items-center justify-center text-[#7D1D2D]">
            <FileText size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26]">Situation Report (SITREP) &amp; Data Export</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7D1D2D]/10 text-[#7D1D2D] border border-[#7D1D2D]/20">
                OFFICIAL REPORT GENERATOR
              </span>
            </div>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Generate NDMA-compliant tactical situation reports and raw GIS datasets for field personnel.
            </p>
          </div>
        </div>

        {/* Real Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-[#027A48] hover:bg-[#02663c] text-white font-semibold py-2 px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileSpreadsheet size={14} />
            Export CSV Dataset
          </button>
          <button
            onClick={handleExportJSON}
            className="bg-[#7D1D2D] hover:bg-[#681825] text-white font-semibold py-2 px-3.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <FileCode size={14} />
            Export JSON Telemetry
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-[#027A48] p-3.5 rounded-xl flex items-center gap-2 text-xs animate-slide-in">
          <CheckCircle2 size={16} />
          <span className="font-medium">{downloadSuccess}</span>
        </div>
      )}

      {/* Printable / Structured SITREP Preview Card */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-8 shadow-xs space-y-6">
        {/* Document Header */}
        <div className="border-b border-[#E3E6EB] pb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7D1D2D]">
              NATIONAL DISASTER INTELLIGENCE PLATFORM (DEMO OPS)
            </div>
            <h1 className="text-[20px] font-bold text-[#161B26] mt-0.5">
              SITREP #04: PUNE METROPOLITAN URBAN FLOOD INUNDATION
            </h1>
            <p className="text-xs text-[#667085] mt-1">
              Issued by: PRALEYE Command Center, Pune District Collectorate &middot; Valid: 12 Aug 2024, 14:30 IST
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-[#B42332] border border-red-200">
              STATUS: RED EMERGENCY
            </span>
            <p className="text-[11px] text-[#667085] mt-1">Classification: RESTRICTED CIVIL DEFENSE</p>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
          <div className="bg-[#F5F6F8] p-4 rounded-xl border border-[#E3E6EB]">
            <p className="text-[10px] text-[#667085] uppercase font-bold">Total Inundation Extent</p>
            <p className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">18.4 km²</p>
            <p className="text-[11px] text-[#B42332] font-semibold mt-1">↑ 58% over 12h</p>
          </div>
          <div className="bg-[#F5F6F8] p-4 rounded-xl border border-[#E3E6EB]">
            <p className="text-[10px] text-[#667085] uppercase font-bold">Population at Risk</p>
            <p className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">30,800</p>
            <p className="text-[11px] text-[#B86A12] font-semibold mt-1">8,200 high vulnerability</p>
          </div>
          <div className="bg-[#F5F6F8] p-4 rounded-xl border border-[#E3E6EB]">
            <p className="text-[10px] text-[#667085] uppercase font-bold">Hospitals in Hazard Area</p>
            <p className="text-[28px] leading-[32px] font-bold text-[#B42332] tabular-nums mt-1">3 Units</p>
            <p className="text-[11px] text-[#667085] mt-1">1 Critical (Noble Hospital)</p>
          </div>
          <div className="bg-[#F5F6F8] p-4 rounded-xl border border-[#E3E6EB]">
            <p className="text-[10px] text-[#667085] uppercase font-bold">Shelters Activated</p>
            <p className="text-[28px] leading-[32px] font-bold text-[#027A48] tabular-nums mt-1">12 Centers</p>
            <p className="text-[11px] text-[#667085] mt-1">Cap: 4,550 individuals</p>
          </div>
        </div>

        {/* Incident Summary Table */}
        <div className="space-y-3">
          <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
            Active Multi-Hazard Incident Records
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E3E6EB] bg-[#F5F6F8] text-[#667085] text-[11px] uppercase font-bold">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Hazard</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Pop. Exposed</th>
                  <th className="py-2.5 px-3">AI Score</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E6EB]">
                {DISASTER_INCIDENTS.map(inc => (
                  <tr key={inc.id} className="hover:bg-[#F5F6F8]/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#175CD3] font-bold">{inc.id}</td>
                    <td className="py-2.5 px-3 font-medium text-[#161B26]">{inc.name}</td>
                    <td className="py-2.5 px-3 text-[#667085]">{inc.location}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inc.severity === 'Critical'
                          ? 'bg-red-50 text-[#B42332] border border-red-200'
                          : inc.severity === 'High'
                          ? 'bg-amber-50 text-[#B86A12] border border-amber-200'
                          : 'bg-yellow-50 text-amber-800 border border-yellow-200'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#161B26]">{inc.populationAtRisk.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-bold text-[#7D1D2D]">{inc.floodProb}%</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-[#667085]">{inc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Infrastructure Table */}
        <div className="space-y-3 pt-3 border-t border-[#E3E6EB]">
          <h3 className="text-[14px] leading-[21px] font-semibold text-[#161B26] uppercase tracking-wider">
            Critical Infrastructure &amp; Shelters Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {CRITICAL_FACILITIES.slice(0, 6).map(fac => (
              <div key={fac.id} className="bg-[#F5F6F8] p-3.5 rounded-xl border border-[#E3E6EB] flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#667085]">{fac.type}</span>
                  <h4 className="font-semibold text-[#161B26] mt-0.5">{fac.name}</h4>
                  <p className="text-[11px] text-[#667085]">
                    {fac.beds ? `${fac.beds} beds` : fac.capacity ? `${fac.capacity} shelter cap` : fac.statusText}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  fac.status === 'Critical'
                    ? 'bg-red-50 text-[#B42332] border border-red-200'
                    : fac.status === 'High'
                    ? 'bg-amber-50 text-[#B86A12] border border-amber-200'
                    : 'bg-emerald-50 text-[#027A48] border border-emerald-200'
                }`}>
                  {fac.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
