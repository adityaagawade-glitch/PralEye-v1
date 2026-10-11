import React, { useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  DISASTER_INCIDENTS,
  CRITICAL_FACILITIES
} from './data/disasterData';
import {
  Search,
  X,
  Compass,
  Clock,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';

const STADIA_API_KEY = import.meta.env.VITE_STADIA_API_KEY || '7df5c763-9e27-425c-99d6-4fb23d5c8cb7';

// Basemap tiles tailored for light enterprise GIS & Dark Ops
const BASEMAP_TILES = {
  stadiaLight: {
    label: 'Enterprise Light',
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap'
  },
  stadiaDark: {
    label: 'Dark Ops',
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: '&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap'
  },
  esriLight: {
    label: 'World Gray',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; DeLorme'
  },
  osm: {
    label: 'OSM Standard',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar'
  }
};

// Disaster Emoji and Color Mapping
const DISASTER_STYLE = {
  Flood: { emoji: '🌊', color: '#175CD3', bg: '#EFF8FF', border: '#175CD3' },
  Landslide: { emoji: '⛰️', color: '#B86A12', bg: '#FEF7EC', border: '#B86A12' },
  Cyclone: { emoji: '🌀', color: '#7D1D2D', bg: '#FDF2F4', border: '#7D1D2D' },
  Earthquake: { emoji: '⚡', color: '#C4320A', bg: '#FFF6ED', border: '#C4320A' },
  Wildfire: { emoji: '🔥', color: '#B42332', bg: '#FEF3F2', border: '#B42332' }
};

const FACILITY_STYLE = {
  Hospital: { emoji: '🏥', bg: '#FFFFFF', border: '#175CD3' },
  Shelter: { emoji: '⛺', bg: '#FFFFFF', border: '#027A48' },
  Bridge: { emoji: '🌉', bg: '#FFFFFF', border: '#B86A12' }
};

// Helper to create clean circular emoji pin markers with crisp light borders
const createEmojiIcon = (emoji, bg, border, isSelected = false) => {
  const size = isSelected ? 38 : 32;
  return L.divIcon({
    className: 'custom-emoji-marker',
    html: `
      <div style="
        background: ${bg};
        border: 2px solid ${border};
        box-shadow: 0 3px 10px rgba(16, 24, 40, 0.15)${isSelected ? ', 0 0 0 3px #7D1D2D' : ''};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${isSelected ? '17px' : '14px'};
        cursor: pointer;
        transform: translate(-${size/2}px, -${size/2}px);
        transition: all 0.2s ease;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [0, 0],
    popupAnchor: [0, -20]
  });
};

// Smooth Pan & Zoom Helper
function MapFlyTo({ targetCoords, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, zoom || 13, { duration: 1.0 });
    }
  }, [targetCoords, zoom, map]);
  return null;
}

export default function MapComponent({ onSelectIncidentForAnalysis }) {
  const { isDark } = useTheme();
  const [selectedBasemap, setSelectedBasemap] = useState(isDark ? 'stadiaDark' : 'stadiaLight');

  // React to global dark/light UI mode changes
  React.useEffect(() => {
    setSelectedBasemap(isDark ? 'stadiaDark' : 'stadiaLight');
  }, [isDark]);

  const [hazardFilter, setHazardFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [flyTarget, setFlyTarget] = useState([18.5204, 73.8867]);
  const [zoomLevel, setZoomLevel] = useState(12);

  // Minimal clean layers
  const [showPolygons, setShowPolygons] = useState(true);
  const [showFacilities, setShowFacilities] = useState(true);

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return DISASTER_INCIDENTS.filter(item => {
      const matchHazard = hazardFilter === 'All' || item.type === hazardFilter;
      const matchSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchHazard && matchSearch;
    });
  }, [hazardFilter, searchQuery]);

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    setFlyTarget(incident.coordinates);
    setZoomLevel(13);
    if (onSelectIncidentForAnalysis) {
      onSelectIncidentForAnalysis(incident);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white text-[#161B26] relative z-0 overflow-hidden rounded-xl border border-[#E3E6EB] shadow-xs">
      {/* Clean & Minimal Top Bar */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-[#E3E6EB] flex flex-wrap items-center justify-between gap-2 z-[450] text-xs">
        {/* Left: Search + Emoji Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#667085]" size={13} />
            <input
              type="text"
              placeholder="Search area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F6F8] border border-[#E3E6EB] rounded-md py-1.5 pl-7 pr-2.5 text-xs text-[#161B26] placeholder-[#667085] focus:bg-white focus:outline-none focus:border-[#7D1D2D] transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#161B26]">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Quick Disaster Filter Chips */}
          <div className="flex items-center gap-1 bg-[#F5F6F8] p-1 rounded-lg border border-[#E3E6EB]">
            <button
              onClick={() => setHazardFilter('All')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                hazardFilter === 'All' ? 'bg-[#7D1D2D] text-white' : 'text-[#667085] hover:text-[#161B26]'
              }`}
            >
              All
            </button>
            {[
              { type: 'Flood', emoji: '🌊 Flood' },
              { type: 'Landslide', emoji: '⛰️ Landslide' },
              { type: 'Cyclone', emoji: '🌀 Cyclone' },
              { type: 'Earthquake', emoji: '⚡ Quake' },
              { type: 'Wildfire', emoji: '🔥 Fire' }
            ].map(({ type, emoji }) => (
              <button
                key={type}
                onClick={() => setHazardFilter(type)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  hazardFilter === type
                    ? 'bg-[#7D1D2D]/10 text-[#7D1D2D] border border-[#7D1D2D]/30'
                    : 'text-[#667085] hover:text-[#161B26]'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Clean Layer Toggles & Map Basemap */}
        <div className="flex items-center gap-3">
          {/* Layer toggles */}
          <div className="flex items-center gap-2 text-[11px] text-[#667085]">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#161B26]">
              <input
                type="checkbox"
                checked={showPolygons}
                onChange={() => setShowPolygons(!showPolygons)}
                className="accent-[#7D1D2D] rounded"
              />
              <span className="font-medium">Hazard Zones</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#161B26]">
              <input
                type="checkbox"
                checked={showFacilities}
                onChange={() => setShowFacilities(!showFacilities)}
                className="accent-[#7D1D2D] rounded"
              />
              <span className="font-medium">Facilities (🏥 ⛺)</span>
            </label>
          </div>

          {/* Basemap Switcher */}
          <div className="flex items-center bg-[#F5F6F8] border border-[#E3E6EB] rounded p-0.5">
            {Object.keys(BASEMAP_TILES).map(key => (
              <button
                key={key}
                onClick={() => setSelectedBasemap(key)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  selectedBasemap === key ? 'bg-[#7D1D2D] text-white font-bold shadow-xs' : 'text-[#667085] hover:text-[#161B26]'
                }`}
              >
                {BASEMAP_TILES[key].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className="flex-1 relative">
        <MapContainer
          center={flyTarget}
          zoom={zoomLevel}
          style={{ height: '100%', width: '100%', background: '#F5F6F8' }}
          zoomControl={true}
        >
          <MapFlyTo targetCoords={flyTarget} zoom={zoomLevel} />

          {/* Clean Tile Layer */}
          <TileLayer
            key={selectedBasemap}
            url={BASEMAP_TILES[selectedBasemap].url}
            attribution={BASEMAP_TILES[selectedBasemap].attribution}
            maxZoom={19}
          />

          {/* Minimal Hazard Outlines */}
          {showPolygons && filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const style = DISASTER_STYLE[incident.type] || DISASTER_STYLE.Flood;

            return (
              <Polygon
                key={`poly-${incident.id}`}
                positions={incident.polygon}
                pathOptions={{
                  color: isSelected ? '#7D1D2D' : style.color,
                  fillColor: style.color,
                  fillOpacity: isSelected ? 0.35 : 0.20,
                  weight: isSelected ? 2.5 : 1.5,
                  dashArray: incident.severity === 'Critical' ? '' : '4, 4'
                }}
                eventHandlers={{
                  click: () => handleSelectIncident(incident)
                }}
              >
                <Tooltip direction="center" opacity={0.95}>
                  <div className="font-sans text-xs">
                    <span className="font-bold text-[#161B26]">{style.emoji} {incident.name}</span>
                    <div className="text-[11px] text-[#667085]">
                      Severity: <strong className="text-[#B42332]">{incident.severity}</strong> &middot; Pop: {incident.populationAtRisk.toLocaleString()}
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

          {/* Clean Disaster Emoji Markers */}
          {filteredIncidents.map((incident) => {
            const isSelected = selectedIncident?.id === incident.id;
            const style = DISASTER_STYLE[incident.type] || DISASTER_STYLE.Flood;
            const icon = createEmojiIcon(style.emoji, style.bg, style.border, isSelected);

            return (
              <Marker
                key={`marker-${incident.id}`}
                position={incident.coordinates}
                icon={icon}
                eventHandlers={{
                  click: () => handleSelectIncident(incident)
                }}
              >
                <Tooltip direction="top" offset={[0, -14]} opacity={0.95}>
                  <div className="font-sans text-xs font-bold text-[#161B26]">
                    {style.emoji} {incident.name}
                  </div>
                </Tooltip>
              </Marker>
            );
          })}

          {/* Clean Critical Facilities Emoji Markers */}
          {showFacilities && CRITICAL_FACILITIES.map((fac) => {
            const facStyle = FACILITY_STYLE[fac.type] || FACILITY_STYLE.Hospital;
            const icon = createEmojiIcon(facStyle.emoji, facStyle.bg, facStyle.border, false);

            return (
              <Marker
                key={`fac-${fac.id}`}
                position={fac.coordinates}
                icon={icon}
              >
                <Popup>
                  <div className="font-sans text-xs p-1">
                    <h4 className="font-bold text-[#161B26] mb-0.5">{facStyle.emoji} {fac.name}</h4>
                    <p className="text-[11px] text-[#667085]">
                      Type: <strong className="text-[#161B26]">{fac.type}</strong> &middot; Status: <strong className="text-[#027A48]">{fac.status}</strong>
                    </p>
                    {fac.beds && <p className="text-[11px] text-[#667085] mt-0.5">Capacity: {fac.beds} beds ({fac.patients} occupied)</p>}
                    {fac.capacity && <p className="text-[11px] text-[#667085] mt-0.5">Shelter Space: {fac.capacity} persons</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Minimal Bottom-Left Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#E3E6EB] text-[11px] flex items-center gap-3 shadow-sm text-[#161B26]">
          <span className="font-bold text-[#667085] text-[10px] uppercase">Symbols:</span>
          <span>🌊 Flood</span>
          <span>⛰️ Landslide</span>
          <span>🌀 Cyclone</span>
          <span>⚡ Quake</span>
          <span>🔥 Fire</span>
          <span className="text-[#E3E6EB]">|</span>
          <span>🏥 Hospital</span>
          <span>⛺ Shelter</span>
          <span>🌉 Bridge</span>
        </div>

        {/* Slide-In Details Panel (When an incident is clicked) */}
        {selectedIncident && (
          <div className="absolute top-3 right-3 bottom-3 w-84 bg-white/98 backdrop-blur-md rounded-xl border border-[#E3E6EB] shadow-xl z-[400] flex flex-col overflow-hidden animate-slide-in text-[#161B26]">
            {/* Header */}
            <div className="p-3.5 border-b border-[#E3E6EB] flex items-center justify-between bg-[#F5F6F8]">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {DISASTER_STYLE[selectedIncident.type]?.emoji || '⚠️'}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#161B26] line-clamp-1">{selectedIncident.name}</h3>
                  <p className="text-[11px] text-[#667085]">{selectedIncident.type} &middot; <span className="font-semibold text-[#B42332]">{selectedIncident.severity}</span></p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-[#667085] hover:text-[#161B26] p-1 rounded hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F5F6F8] p-2.5 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Risk Prob.</p>
                  <p className="text-lg font-bold text-[#B42332] tabular-nums">{selectedIncident.floodProb}%</p>
                </div>
                <div className="bg-[#F5F6F8] p-2.5 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Exposed Pop.</p>
                  <p className="text-lg font-bold text-[#161B26] tabular-nums">{selectedIncident.populationAtRisk.toLocaleString()}</p>
                </div>
                <div className="bg-[#F5F6F8] p-2.5 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Impact Area</p>
                  <p className="text-sm font-bold text-[#161B26]">{selectedIncident.affectedAreaKm2} km²</p>
                </div>
                <div className="bg-[#F5F6F8] p-2.5 rounded-lg border border-[#E3E6EB]">
                  <p className="text-[10px] text-[#667085] uppercase font-semibold">Hospitals</p>
                  <p className="text-sm font-bold text-[#B42332]">{selectedIncident.criticalFacilities.hospitals} Units</p>
                </div>
              </div>

              <div className="bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB] text-[12px] text-[#161B26] leading-relaxed">
                {selectedIncident.summary}
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#667085] uppercase tracking-wider mb-1.5">
                  Recommended Action Protocols:
                </h4>
                <div className="space-y-1.5">
                  {selectedIncident.recommendedActions.map((act, i) => (
                    <div key={i} className="text-[12px] text-[#161B26] bg-[#F5F6F8] p-2 rounded border border-[#E3E6EB] flex items-start gap-2">
                      <span className="text-[#7D1D2D] font-bold">•</span>
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-3.5 border-t border-[#E3E6EB] bg-[#F5F6F8]">
              <button
                onClick={() => onSelectIncidentForAnalysis && onSelectIncidentForAnalysis(selectedIncident)}
                className="w-full bg-[#7D1D2D] hover:bg-[#681825] text-white font-semibold py-2 rounded-lg text-xs transition-colors shadow-xs"
              >
                Deep Impact Analysis &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
