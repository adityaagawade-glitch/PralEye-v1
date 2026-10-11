import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Compass,
  ArrowRight,
  Info,
  Car,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { EVACUATION_SCENARIOS } from '../data/disasterData';

export default function EvacuationRoutes() {
  const { isDark } = useTheme();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [activeRouteView, setActiveRouteView] = useState('both'); // 'both', 'safe', 'rejected'

  const scenario = EVACUATION_SCENARIOS[selectedScenarioIndex];
  const center = [18.5204, 73.8567]; // Pune centroid

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* Top Header & Scenario Selection */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#027A48]/10 border border-[#027A48]/20 flex items-center justify-center text-[#027A48]">
            <Navigation size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26]">Safe Evacuation Route Intelligence</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#027A48] border border-emerald-200">
                ACTIVE DECISION ENGINE
              </span>
            </div>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Rejects hazardous shortest-distance paths and selects topography-safe corridors outside flood plains.
            </p>
          </div>
        </div>

        {/* Route Scenario Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-[#667085] font-medium whitespace-nowrap">Route Corridor:</span>
          <select
            value={selectedScenarioIndex}
            onChange={(e) => setSelectedScenarioIndex(Number(e.target.value))}
            className="bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg px-3 py-2 text-xs text-[#161B26] focus:bg-white focus:outline-none focus:border-[#7D1D2D] font-medium w-full md:w-80 transition-colors"
          >
            {EVACUATION_SCENARIOS.map((sc, idx) => (
              <option key={sc.id} value={idx}>
                {sc.from} → {sc.to}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Comparison Dossier + Map Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Comparison & Intelligence Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Key Demo Moment Card */}
          <div className="bg-white border border-[#E3E6EB] rounded-xl p-4.5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#B42332] uppercase tracking-wider mb-1.5">
              <AlertTriangle size={15} />
              Core AI Decision Intelligence
            </div>
            <p className="text-xs text-[#161B26] leading-relaxed">
              Standard GPS navigation recommends <strong className="text-[#B42332]">Route A (3.4 km, 8 min)</strong> as the fastest transit path. However, PRALEYE rejects it because it intersects the predicted 50-year flood zone at Hadapsar causeway. PRALEYE redirects civilian and rescue convoys to <strong className="text-[#027A48]">Route B (6.1 km, 15 min)</strong>.
            </p>
          </div>

          {/* Route A (Rejected) Card */}
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-4.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B42332] flex items-center gap-1.5">
                <XCircle size={15} />
                Route A — Direct Central Corridor
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#B42332] border border-red-300 uppercase">
                REJECTED BY AI
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-red-200">
              <div>
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Distance</p>
                <p className="font-bold text-[#161B26] text-sm tabular-nums">{scenario.directRoute.distanceKm} km</p>
              </div>
              <div>
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Est. Time</p>
                <p className="font-bold text-[#161B26] text-sm tabular-nums">{scenario.directRoute.estTimeMin} min</p>
              </div>
              <div>
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Hazard Level</p>
                <p className="font-bold text-[#B42332] text-sm">CRITICAL</p>
              </div>
            </div>

            <div className="text-xs bg-white p-2.5 rounded border border-red-200 text-[#B42332]">
              <strong>Failure Cause:</strong> {scenario.directRoute.rejectionReason}
            </div>
          </div>

          {/* Route B (Recommended Safe Route) Card */}
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-4.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#027A48] flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                Route B — South Elevated Bypass
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#027A48] border border-emerald-300 uppercase">
                RECOMMENDED
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-lg border border-emerald-200">
              <div>
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Distance</p>
                <p className="font-bold text-[#161B26] text-sm tabular-nums">{scenario.safeRoute.distanceKm} km</p>
              </div>
              <div>
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Est. Time</p>
                <p className="font-bold text-[#161B26] text-sm tabular-nums">{scenario.safeRoute.estTimeMin} min</p>
              </div>
              <div>
                <p className="text-[10px] text-[#667085] uppercase font-semibold">Safety Index</p>
                <p className="font-bold text-[#027A48] text-sm">100% CLEAR</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-[#667085] uppercase font-bold mb-1">Avoidance Protocol Verified:</p>
              <div className="space-y-1">
                {scenario.safeRoute.avoidances.map((av, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-[#161B26]">
                    <CheckCircle2 size={13} className="text-[#027A48] flex-shrink-0" />
                    <span>Avoids: {av}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[#027A48] bg-white p-2 rounded border border-emerald-200">
              {scenario.safeRoute.clearanceMargin}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Leaflet Route Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E3E6EB] rounded-xl overflow-hidden shadow-xs flex flex-col h-[520px]">
          {/* Map Header with Route Layer Filters */}
          <div className="bg-[#F5F6F8] px-4 py-2.5 border-b border-[#E3E6EB] flex items-center justify-between text-xs">
            <span className="font-bold text-[#161B26] flex items-center gap-1.5">
              <Compass size={14} className="text-[#7D1D2D]" />
              GIS Topographic Corridor Overlay
            </span>

            <div className="flex items-center gap-1 bg-white p-0.5 rounded border border-[#E3E6EB]">
              <button
                onClick={() => setActiveRouteView('both')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  activeRouteView === 'both' ? 'bg-[#7D1D2D] text-white font-bold' : 'text-[#667085] hover:text-[#161B26]'
                }`}
              >
                Both Routes
              </button>
              <button
                onClick={() => setActiveRouteView('safe')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  activeRouteView === 'safe' ? 'bg-[#027A48] text-white font-bold' : 'text-[#667085] hover:text-[#161B26]'
                }`}
              >
                Safe Only
              </button>
              <button
                onClick={() => setActiveRouteView('rejected')}
                className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                  activeRouteView === 'rejected' ? 'bg-[#B42332] text-white font-bold' : 'text-[#667085] hover:text-[#161B26]'
                }`}
              >
                Rejected Only
              </button>
            </div>
          </div>

          {/* Leaflet Route Map Canvas (Light Alidade Smooth Tiles) */}
          <div className="flex-1 relative">
            <MapContainer
              center={center}
              zoom={12}
              style={{ height: '100%', width: '100%', background: '#F5F6F8' }}
              zoomControl={true}
            >
              <TileLayer
                key={isDark ? 'evac-dark' : 'evac-light'}
                url={isDark
                  ? `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_API_KEY || '7df5c763-9e27-425c-99d6-4fb23d5c8cb7'}`
                  : `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${import.meta.env.VITE_STADIA_API_KEY || '7df5c763-9e27-425c-99d6-4fb23d5c8cb7'}`}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
              />

              {/* Start Point Marker (Danger Zone Origin) */}
              <CircleMarker
                center={scenario.safeRoute.waypoints[0]}
                radius={8}
                pathOptions={{ color: '#B42332', fillColor: '#B42332', fillOpacity: 0.9, weight: 2 }}
              >
                <Tooltip direction="top" permanent={true} offset={[0, -10]}>
                  <span className="font-bold text-[10px] text-[#B42332]">Origin: {scenario.from}</span>
                </Tooltip>
              </CircleMarker>

              {/* Destination Point Marker (Safe Shelter) */}
              <CircleMarker
                center={scenario.safeRoute.waypoints[scenario.safeRoute.waypoints.length - 1]}
                radius={8}
                pathOptions={{ color: '#027A48', fillColor: '#027A48', fillOpacity: 0.9, weight: 2 }}
              >
                <Tooltip direction="top" permanent={true} offset={[0, -10]}>
                  <span className="font-bold text-[10px] text-[#027A48]">Shelter: {scenario.to}</span>
                </Tooltip>
              </CircleMarker>

              {/* Rejected Route A (Dashed Red Line) */}
              {(activeRouteView === 'both' || activeRouteView === 'rejected') && (
                <Polyline
                  positions={scenario.directRoute.waypoints}
                  pathOptions={{
                    color: '#B42332',
                    weight: 3.5,
                    dashArray: '8, 8',
                    opacity: 0.9
                  }}
                >
                  <Popup>
                    <div className="font-sans text-xs p-1">
                      <p className="font-bold text-[#B42332]">Route A: REJECTED</p>
                      <p className="text-[#667085] text-[11px] mt-1">{scenario.directRoute.rejectionReason}</p>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Safe Route B (Solid Emerald Line) */}
              {(activeRouteView === 'both' || activeRouteView === 'safe') && (
                <Polyline
                  positions={scenario.safeRoute.waypoints}
                  pathOptions={{
                    color: '#027A48',
                    weight: 4.5,
                    opacity: 0.95
                  }}
                >
                  <Popup>
                    <div className="font-sans text-xs p-1">
                      <p className="font-bold text-[#027A48]">Route B: RECOMMENDED</p>
                      <p className="text-[#667085] text-[11px] mt-1">100% Elevation Verified Safe Path</p>
                    </div>
                  </Popup>
                </Polyline>
              )}
            </MapContainer>

            {/* Map Overlay Legend */}
            <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-lg border border-[#E3E6EB] text-[11px] space-y-1 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-[#027A48] rounded inline-block" />
                <span className="text-[#027A48] font-semibold">Safe Route (Recommended)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 border-b-2 border-dashed border-[#B42332] inline-block" />
                <span className="text-[#B42332] font-semibold">Shortest Route (Rejected by AI)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
