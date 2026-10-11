import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CloudRain,
  Map as MapIcon,
  Users,
  Building,
  Bell,
  Search,
  Activity,
  Layers,
  Navigation,
  Briefcase,
  ChevronRight,
  LogOut,
  Settings,
  FileText,
  Radio,
  Shield,
  TrendingUp,
  Zap,
  Truck,
  LifeBuoy,
  Heart,
  X,
  Compass,
  Sparkles,
  Download,
  Info,
  Calendar,
  Clock,
  Eye,
  Sliders,
  CheckCircle2,
  Share2,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import MapComponent from './MapComponent';
import AIRiskPrediction from './components/AIRiskPrediction';
import ImpactIntelligence from './components/ImpactIntelligence';
import EvacuationRoutes from './components/EvacuationRoutes';
import ResourceOptimization from './components/ResourceOptimization';
import SimulationPanel from './components/SimulationPanel';
import AlertsManager from './components/AlertsManager';
import ReportsManager from './components/ReportsManager';
import PresentationGuideModal from './components/PresentationGuideModal';
import {
  DISASTER_INCIDENTS,
  CRITICAL_FACILITIES,
  RESPONSE_RESOURCES,
  ACTIVE_ALERTS,
  DEMO_METADATA
} from './data/disasterData';

// Sidebar Navigation Configuration
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Command Center', icon: Activity },
  { id: 'riskmap', label: 'Disaster Map', icon: MapIcon, badge: 'Live GIS' },
  { id: 'prediction', label: 'AI Risk Engine', icon: Radio, badge: '87%' },
  { id: 'impact', label: 'Impact Intelligence', icon: Layers },
  { id: 'evacuation', label: 'Safe Evacuation', icon: Navigation, badge: 'Decision AI' },
  { id: 'resources', label: 'Resource Optimization', icon: Briefcase },
  { id: 'simulation', label: 'Digital Twin Simulation', icon: Sliders },
  { id: 'alerts', label: 'Alerts & CAP Warnings', icon: Bell, badgeCount: 3 },
  { id: 'reports', label: 'Reports & SITREP', icon: FileText }
];

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activePage, setActivePage] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertsDrawerOpen, setAlertsDrawerOpen] = useState(false);
  const [showPresentationGuide, setShowPresentationGuide] = useState(false);
  const [selectedIncidentForDeepDive, setSelectedIncidentForDeepDive] = useState(DISASTER_INCIDENTS[0]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Live seconds clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTimeIST = currentTime.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const formattedDateIST = currentTime.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleIncidentSelectFromMap = (incident) => {
    setSelectedIncidentForDeepDive(incident);
    setActivePage('impact');
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'riskmap':
        return (
          <div className="h-[calc(100vh-125px)]">
            <MapComponent onSelectIncidentForAnalysis={handleIncidentSelectFromMap} />
          </div>
        );
      case 'prediction':
        return (
          <AIRiskPrediction onNavigateToEvacuation={() => setActivePage('evacuation')} />
        );
      case 'impact':
        return (
          <ImpactIntelligence
            selectedIncident={selectedIncidentForDeepDive}
            onNavigateToResources={() => setActivePage('resources')}
          />
        );
      case 'evacuation':
        return <EvacuationRoutes />;
      case 'resources':
        return <ResourceOptimization />;
      case 'simulation':
        return <SimulationPanel />;
      case 'alerts':
        return <AlertsManager />;
      case 'reports':
        return <ReportsManager />;
      default:
        return (
          <DashboardHome
            onNavigate={setActivePage}
            onSelectIncident={(inc) => {
              setSelectedIncidentForDeepDive(inc);
              setActivePage('impact');
            }}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6F8] text-[#161B26] overflow-hidden font-sans selection:bg-[#7D1D2D]/20 selection:text-[#7D1D2D]">
      {/* Presentation Walkthrough Modal */}
      <PresentationGuideModal
        isOpen={showPresentationGuide}
        onClose={() => setShowPresentationGuide(false)}
        onNavigate={(pageId) => setActivePage(pageId)}
      />

      {/* Left Ops Sidebar (~248px width) */}
      <aside className="w-[248px] bg-white border-r border-[#E3E6EB] flex flex-col justify-between flex-shrink-0 z-30 shadow-sm">
        <div>
          {/* Brand Logo */}
          <div className="p-4 border-b border-[#E3E6EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#7D1D2D] flex items-center justify-center shadow-md relative">
                <AlertTriangle size={20} className="text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B42332] rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold tracking-tight text-[#161B26] leading-none">PRALEYE</h1>
                <p className="text-[11px] text-[#667085] font-medium mt-0.5">Disaster Intelligence OS</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F5F6F8] text-[#667085] border border-[#E3E6EB]">
              v2.4
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-3 px-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#7D1D2D]/10 text-[#7D1D2D] font-semibold border-l-[3px] border-[#7D1D2D] shadow-xs'
                      : 'text-[#667085] hover:text-[#161B26] hover:bg-[#F5F6F8] border-l-[3px] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? 'text-[#7D1D2D]' : 'text-[#667085]'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-[#7D1D2D] text-white' : 'bg-[#F5F6F8] text-[#667085] border border-[#E3E6EB]'
                    }`}>
                      {item.badge}
                    </span>
                  )}

                  {item.badgeCount && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#B42332] text-white">
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#E3E6EB] space-y-2.5 bg-[#F5F6F8]/60">

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="w-full bg-white hover:bg-[#F5F6F8] text-[#161B26] border border-[#E3E6EB] p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors shadow-xs cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark UI Mode"}
          >
            <div className="flex items-center gap-2">
              {isDark ? <Moon size={14} className="text-purple-400" /> : <Sun size={14} className="text-amber-500" />}
              <span>Theme Mode</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F5F6F8] text-[#667085] border border-[#E3E6EB]">
              {isDark ? '🌙 Dark UI' : '☀️ Light UI'}
            </span>
          </button>

          {/* Region Lock */}
          <div className="bg-white p-2.5 rounded-lg border border-[#E3E6EB] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Compass size={14} className="text-[#7D1D2D]" />
              <div>
                <p className="text-[10px] uppercase font-bold text-[#667085]">Operation Focus</p>
                <p className="text-xs font-semibold text-[#161B26]">Pune, Maharashtra</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#027A48] animate-pulse" />
          </div>

          {/* User profile */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#7D1D2D] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-[#161B26]">Disaster EOC Admin</p>
                <p className="text-[10px] text-[#667085]">College Demo Operator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Operations Header (Height 64px) */}
        <header className="h-16 bg-white border-b border-[#E3E6EB] px-6 flex items-center justify-between flex-shrink-0 z-20">
          {/* Search bar & Scenario Pill */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" size={14} />
              <input
                type="text"
                placeholder="Search zones, hospitals, shelters..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg py-1.5 pl-9 pr-3 text-xs text-[#161B26] placeholder-[#667085] focus:bg-white focus:outline-none focus:border-[#7D1D2D] transition-colors"
              />
            </div>


          </div>

          {/* Right Header Status Widgets */}
          <div className="flex items-center gap-3 text-xs">


            {/* Quick Pitch Walkthrough Button */}
            <button
              onClick={() => setShowPresentationGuide(true)}
              className="bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#161B26] border border-[#E3E6EB] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-[#B86A12]" />
              <span>Demo Script</span>
            </button>

            {/* Dark UI Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#161B26] border border-[#E3E6EB] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark UI Mode"}
            >
              {isDark ? (
                <>
                  <Sun size={13} className="text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={13} className="text-purple-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {/* Alerts Drawer Button */}
            <button
              onClick={() => setAlertsDrawerOpen(true)}
              className="relative p-2 rounded-lg hover:bg-[#F5F6F8] text-[#667085] hover:text-[#161B26] transition-colors"
              title="Open Emergency Alerts"
            >
              <Bell size={18} />
              <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-[#B42332] text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>

            {/* SITREP Download */}
            <button
              onClick={() => setActivePage('reports')}
              className="bg-[#7D1D2D] hover:bg-[#681825] text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download size={13} />
              <span>Export SITREP</span>
            </button>
          </div>
        </header>

        {/* Page Content Body (Desktop padding 24px) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {renderActivePage()}
        </main>
      </div>

      {/* Alerts Slide-Over Drawer */}
      {alertsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setAlertsDrawerOpen(false)} />
          <div className="relative w-96 bg-white border-l border-[#E3E6EB] h-full overflow-y-auto shadow-2xl animate-slide-in flex flex-col text-[#161B26]">
            <div className="p-4 border-b border-[#E3E6EB] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xs font-bold text-[#161B26] uppercase tracking-wider flex items-center gap-1.5">
                  <Bell size={13} className="text-[#B42332]" />
                  Active Emergency Alerts
                </h3>
                <p className="text-[11px] text-[#667085]">3 unacknowledged civil defense warnings</p>
              </div>
              <button onClick={() => setAlertsDrawerOpen(false)} className="text-[#667085] hover:text-[#161B26] p-1 rounded hover:bg-[#F5F6F8]">
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-3 flex-1 overflow-y-auto">
              {ACTIVE_ALERTS.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-50/60 border-red-200 text-[#161B26]'
                      : 'bg-amber-50/60 border-amber-200 text-[#161B26]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-[#B42332] text-white'
                          : 'bg-[#B86A12] text-white'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[11px] text-[#667085]">{alert.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-[#161B26] mb-1">{alert.title}</h4>
                  <p className="text-[12px] text-[#667085] leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-[#E3E6EB] bg-[#F5F6F8]">
              <button
                onClick={() => {
                  setAlertsDrawerOpen(false);
                  setActivePage('alerts');
                }}
                className="w-full bg-[#7D1D2D] hover:bg-[#681825] text-white font-semibold py-2.5 rounded-lg text-xs transition-colors shadow-xs"
              >
                Open Full Alerts &amp; CAP Center &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Command Center Dashboard Home Page
function DashboardHome({ onNavigate, onSelectIncident }) {
  return (
    <div className="space-y-6">
      {/* Top Situation Summary Row (5 KPI cards, Spacing 16px, Padding 16-20px) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Risk Level Card */}
        <button
          onClick={() => onNavigate('prediction')}
          className="text-left bg-white border border-[#E3E6EB] hover:border-[#B42332]/50 p-4 md:p-5 rounded-xl shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] leading-[16px] font-semibold text-[#667085] uppercase tracking-wider">Overall Risk Level</span>
              <ChevronRight size={14} className="text-[#B42332] group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="text-[28px] leading-[32px] font-bold text-[#B42332] tabular-nums tracking-tight">CRITICAL</h3>
            <p className="text-[12px] leading-[16px] text-[#B42332] font-medium mt-1">High risk of urban inundation</p>
          </div>
          <div className="mt-3">
            <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-red-50 text-[#B42332] border border-red-200">
              AI Probability: 87%
            </span>
          </div>
        </button>

        {/* Rainfall Card */}
        <div className="bg-white border border-[#E3E6EB] p-4 md:p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] leading-[16px] font-semibold text-[#667085] uppercase tracking-wider">Rainfall (24h)</span>
              <CloudRain size={16} className="text-[#175CD3]" />
            </div>
            <h3 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums tracking-tight">142 mm</h3>
          </div>
          <p className="text-[12px] leading-[16px] text-[#B42332] font-semibold mt-3">↑ +32% above monsoon normal</p>
        </div>

        {/* Affected Area Card */}
        <div className="bg-white border border-[#E3E6EB] p-4 md:p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] leading-[16px] font-semibold text-[#667085] uppercase tracking-wider">Affected Area</span>
              <MapIcon size={16} className="text-[#7D1D2D]" />
            </div>
            <h3 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums tracking-tight">18.4 km²</h3>
          </div>
          <p className="text-[12px] leading-[16px] text-[#B42332] font-semibold mt-3">↑ +58% from last cycle</p>
        </div>

        {/* Population at Risk Card */}
        <div className="bg-white border border-[#E3E6EB] p-4 md:p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] leading-[16px] font-semibold text-[#667085] uppercase tracking-wider">Population at Risk</span>
              <Users size={16} className="text-[#B86A12]" />
            </div>
            <h3 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums tracking-tight">30,800</h3>
          </div>
          <p className="text-[12px] leading-[16px] text-[#B86A12] font-semibold mt-3">8,200 high vulnerability</p>
        </div>

        {/* Critical Facilities Card */}
        <div className="bg-white border border-[#E3E6EB] p-4 md:p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] leading-[16px] font-semibold text-[#667085] uppercase tracking-wider">Critical Facilities</span>
              <Building size={16} className="text-[#B42332]" />
            </div>
            <h3 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums tracking-tight">17 Assets</h3>
          </div>
          <p className="text-[12px] leading-[16px] text-[#B42332] font-semibold mt-3">3 hospitals · 4 bridges</p>
        </div>
      </div>

      {/* Main Map + Incident Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Centerpiece (9 cols) */}
        <div className="lg:col-span-9 h-[460px] bg-white rounded-xl overflow-hidden shadow-xs border border-[#E3E6EB]">
          <MapComponent onSelectIncidentForAnalysis={onSelectIncident} />
        </div>

        {/* Side Tactical Overview (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Active Alerts */}
          <button
            onClick={() => onNavigate('alerts')}
            className="bg-white border border-[#E3E6EB] hover:border-[#B42332]/50 p-4 rounded-xl text-left transition-all group flex-1 flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] leading-[16px] font-semibold uppercase text-[#B42332] flex items-center gap-1.5">
                  <AlertTriangle size={13} /> Active Alerts
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-[#B42332] font-bold border border-red-200">2 Critical</span>
              </div>
              <h4 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">3 Alerts</h4>
            </div>
            <p className="text-[12px] text-[#667085] mt-2 flex items-center justify-between font-medium">
              <span>View Alert Center</span>
              <ChevronRight size={14} className="text-[#667085] group-hover:text-[#161B26] group-hover:translate-x-0.5 transition-transform" />
            </p>
          </button>

          {/* Road Corridors Blocked */}
          <div className="bg-white border border-[#E3E6EB] p-4 rounded-xl flex-1 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] leading-[16px] font-semibold uppercase text-[#667085] flex items-center gap-1.5">
                  <Truck size={13} className="text-[#175CD3]" /> Road Corridors
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 text-[#B42332] font-bold border border-red-200">8 Closed</span>
              </div>
              <h4 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">26 Monitored</h4>
            </div>
            <p className="text-[12px] text-[#B42332] font-medium mt-2">Holkar Bridge approach closed</p>
          </div>

          {/* Shelters Ready */}
          <div className="bg-white border border-[#E3E6EB] p-4 rounded-xl flex-1 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] leading-[16px] font-semibold uppercase text-[#667085] flex items-center gap-1.5">
                  <Shield size={13} className="text-[#027A48]" /> Open Shelters
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-[#027A48] font-bold border border-emerald-200">12 Active</span>
              </div>
              <h4 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">4,550 Cap</h4>
            </div>
            <p className="text-[12px] text-[#B86A12] font-medium mt-2">Aundh Shelter at 68% occupancy</p>
          </div>

          {/* Response Units */}
          <button
            onClick={() => onNavigate('resources')}
            className="bg-white border border-[#E3E6EB] hover:border-[#175CD3]/50 p-4 rounded-xl text-left transition-all group flex-1 flex flex-col justify-between shadow-xs hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] leading-[16px] font-semibold uppercase text-[#667085] flex items-center gap-1.5">
                  <LifeBuoy size={13} className="text-[#175CD3]" /> Response Units
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#175CD3] font-bold border border-blue-200">6 Deployed</span>
              </div>
              <h4 className="text-[28px] leading-[32px] font-bold text-[#161B26] tabular-nums mt-1">8 NDRF Teams</h4>
            </div>
            <p className="text-[12px] text-[#175CD3] mt-2 flex items-center justify-between font-medium">
              <span>Allocate Resources</span>
              <ChevronRight size={14} className="text-[#175CD3] group-hover:translate-x-0.5 transition-transform" />
            </p>
          </button>
        </div>
      </div>

      {/* Bottom 3 Functional Quick Action Cards (Section gap 24px) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: AI Risk Prediction Quick Widget */}
        <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] leading-[21px] font-semibold text-[#7D1D2D] flex items-center gap-1.5">
                <Radio size={15} /> AI Flood Screening Engine
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#B42332] border border-red-200">CRITICAL</span>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="#E3E6EB" strokeWidth="7" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#B42332"
                    strokeWidth="7"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - 0.87)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute font-bold text-base text-[#161B26] tabular-nums">87%</span>
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#161B26] text-sm">Hadapsar River Basin</p>
                <p className="text-[12px] text-[#667085]">142mm rainfall &middot; elevation 11.2m</p>
                <p className="text-[12px] text-[#B42332] font-semibold">90 min to street inundation</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('prediction')}
            className="w-full mt-4 bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#7D1D2D] font-semibold py-2 rounded-lg text-xs transition-colors border border-[#E3E6EB] flex items-center justify-center gap-1"
          >
            Open Risk Engine &rarr;
          </button>
        </div>

        {/* Card 2: Safe Evacuation Routing Quick Widget */}
        <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] leading-[21px] font-semibold text-[#027A48] flex items-center gap-1.5">
                <Navigation size={15} /> Safe Evacuation Decision
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#027A48] border border-emerald-200">OPTIMAL</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-red-50/70 border border-red-200 p-2.5 rounded-lg text-[12px] flex items-center justify-between">
                <span className="text-red-900 line-through">Route A (3.4 km, 8 min)</span>
                <span className="text-[10px] font-bold text-[#B42332] uppercase">REJECTED BY AI</span>
              </div>
              <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-lg text-[12px] flex items-center justify-between">
                <span className="text-emerald-950 font-bold">Route B (6.1 km, 15 min)</span>
                <span className="text-[10px] font-bold text-[#027A48] uppercase">RECOMMENDED</span>
              </div>
              <p className="text-[12px] text-[#667085] mt-1">Bypasses submerged Hadapsar causeway safely</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('evacuation')}
            className="w-full mt-4 bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#027A48] font-semibold py-2 rounded-lg text-xs transition-colors border border-[#E3E6EB] flex items-center justify-center gap-1"
          >
            Review Safe Corridors &rarr;
          </button>
        </div>

        {/* Card 3: Digital Twin What-If Simulator Quick Widget */}
        <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[14px] leading-[21px] font-semibold text-[#175CD3] flex items-center gap-1.5">
                <Sliders size={15} /> What-If Digital Twin
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#175CD3] border border-blue-200">SURGE TEST</span>
            </div>

            <div className="space-y-2 text-xs bg-[#F5F6F8] p-3 rounded-lg border border-[#E3E6EB]">
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-[12px]">Rainfall Surge Test:</span>
                <span className="font-bold text-[#B42332] text-[12px]">+30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-[12px]">Projected Area:</span>
                <span className="font-bold text-[#161B26] text-[12px]">19.0 km² (↑58%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#667085] text-[12px]">Exposed Population:</span>
                <span className="font-bold text-[#161B26] text-[12px]">30,800 (↑148%)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('simulation')}
            className="w-full mt-4 bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#175CD3] font-semibold py-2 rounded-lg text-xs transition-colors border border-[#E3E6EB] flex items-center justify-center gap-1"
          >
            Launch Digital Twin &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
