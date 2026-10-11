import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Radio,
  Clock,
  Shield,
  Send,
  X,
  Volume2
} from 'lucide-react';
import { ACTIVE_ALERTS } from '../data/disasterData';

export default function AlertsManager() {
  const [alerts, setAlerts] = useState(ACTIVE_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCapModal, setShowCapModal] = useState(false);
  const [broadcastTargetArea, setBroadcastTargetArea] = useState('Hadapsar Basin (Zone A)');
  const [broadcastText, setBroadcastText] = useState('CIVIL EMERGENCY: Severe flash flooding imminent along Mula-Mutha river. Move to designated high-ground shelters immediately.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const toggleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: !a.acknowledged } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    const matchSev = filterSeverity === 'All' || a.severity === filterSeverity;
    const matchSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSev && matchSearch;
  });

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setShowCapModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 text-[#161B26]">
      {/* Top Controls Header */}
      <div className="bg-white border border-[#E3E6EB] rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#B42332]/10 border border-[#B42332]/20 flex items-center justify-center text-[#B42332]">
            <Bell size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] leading-[24px] font-semibold text-[#161B26]">Emergency Warning &amp; CAP Alerts Center</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#B42332] border border-red-200">
                {alerts.filter(a => !a.acknowledged).length} UNACKNOWLEDGED
              </span>
            </div>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Integrated with NDMA Common Alerting Protocol (CAP) and cell-broadcast sirens.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCapModal(true)}
          className="bg-[#7D1D2D] hover:bg-[#681825] text-white font-semibold py-2 px-4 rounded-lg text-xs flex items-center gap-2 transition-colors shadow-xs"
        >
          <Radio size={14} />
          Broadcast Public Emergency Alert
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E3E6EB] shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#667085]" size={13} />
            <input
              type="text"
              placeholder="Filter alerts by keyword or zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg py-1.5 pl-8 pr-3 text-xs text-[#161B26] focus:bg-white focus:outline-none focus:border-[#7D1D2D] transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#F5F6F8] p-0.5 rounded-lg border border-[#E3E6EB]">
            {['All', 'CRITICAL', 'WARNING', 'ADVISORY'].map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  filterSeverity === sev
                    ? 'bg-[#7D1D2D] text-white font-bold'
                    : 'text-[#667085] hover:text-[#161B26]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-[#667085]">Showing {filteredAlerts.length} of {alerts.length} notifications</span>
      </div>

      {/* Alerts Feed Cards */}
      <div className="space-y-3.5">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition-all ${
              alert.severity === 'CRITICAL'
                ? 'bg-red-50/60 border-red-200'
                : alert.severity === 'WARNING'
                ? 'bg-amber-50/60 border-amber-200'
                : 'bg-white border-[#E3E6EB]'
            }`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-[#B42332] text-white'
                      : alert.severity === 'WARNING'
                      ? 'bg-[#B86A12] text-white'
                      : 'bg-[#175CD3] text-white'
                  }`}
                >
                  {alert.severity}
                </span>
                <h3 className="text-xs font-bold text-[#161B26]">{alert.title}</h3>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-[#667085]">
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={12} />
                  {alert.timestamp}
                </span>
                <span>·</span>
                <span>Zone: <strong className="text-[#161B26]">{alert.area}</strong></span>
              </div>
            </div>

            <p className="text-xs text-[#667085] leading-relaxed mb-3">{alert.message}</p>

            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-[#E3E6EB]">
              <span className="text-[11px] text-[#667085]">Source: {alert.source}</span>

              <button
                onClick={() => toggleAcknowledge(alert.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  alert.acknowledged
                    ? 'bg-[#F5F6F8] text-[#667085] hover:bg-[#E3E6EB] border border-[#E3E6EB]'
                    : 'bg-[#7D1D2D] hover:bg-[#681825] text-white shadow-xs'
                }`}
              >
                <CheckCircle2 size={13} />
                {alert.acknowledged ? 'Acknowledged (Click to Undo)' : 'Acknowledge Alert'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast CAP Modal */}
      {showCapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#161B26]">
          <div className="bg-white border border-[#E3E6EB] rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E3E6EB] pb-3">
              <div className="flex items-center gap-2">
                <Volume2 size={18} className="text-[#B42332]" />
                <h3 className="text-sm font-bold text-[#161B26] uppercase tracking-wider">Broadcast Common Alerting Protocol</h3>
              </div>
              <button onClick={() => setShowCapModal(false)} className="text-[#667085] hover:text-[#161B26]">
                <X size={16} />
              </button>
            </div>

            {broadcastSent ? (
              <div className="py-8 text-center space-y-2 text-[#027A48]">
                <CheckCircle2 size={40} className="mx-auto" />
                <p className="font-bold text-sm">CAP Emergency Broadcast Transmitted!</p>
                <p className="text-xs text-[#667085]">Dispatched to telecom cell towers across {broadcastTargetArea}.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#667085] font-medium mb-1">Target Geofenced Zone</label>
                  <select
                    value={broadcastTargetArea}
                    onChange={(e) => setBroadcastTargetArea(e.target.value)}
                    className="w-full bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg p-2.5 text-[#161B26] focus:bg-white focus:outline-none focus:border-[#7D1D2D]"
                  >
                    <option>Hadapsar Basin (Zone A) — 30,800 mobiles</option>
                    <option>Kharadi IT Corridor (Zone B) — 14,200 mobiles</option>
                    <option>Wagholi &amp; East Catchment — 9,500 mobiles</option>
                    <option>Entire Pune Metropolitan Region (PMRDA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#667085] font-medium mb-1">Broadcast Message Payload</label>
                  <textarea
                    rows={4}
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    className="w-full bg-[#F5F6F8] border border-[#E3E6EB] rounded-lg p-2.5 text-[#161B26] text-xs focus:bg-white focus:outline-none focus:border-[#7D1D2D]"
                  />
                </div>

                <div className="bg-red-50 border border-red-200 p-2.5 rounded text-[11px] text-red-900">
                  ⚠️ This simulates triggering live siren activations and emergency carrier push alerts.
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCapModal(false)}
                    className="px-3 py-1.5 rounded bg-[#F5F6F8] hover:bg-[#E3E6EB] text-[#667085] border border-[#E3E6EB]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#7D1D2D] hover:bg-[#681825] text-white font-bold shadow-xs"
                  >
                    Transmit Broadcast
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
