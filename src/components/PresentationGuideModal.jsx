import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  Compass,
  Radio,
  Layers,
  Navigation,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function PresentationGuideModal({ isOpen, onClose, onNavigate }) {
  if (!isOpen) return null;

  const demoSteps = [
    {
      num: 1,
      title: 'Command Center & Multi-Hazard Map',
      page: 'riskmap',
      talkingPoint: 'Show the interactive Leaflet map centered on Pune. Point out the crisp enterprise light basemap, multi-hazard incident markers (Floods, Landslides, Cyclones), and click on an incident to reveal the synchronized Intelligence Dossier.',
      actionText: 'Go to Map'
    },
    {
      num: 2,
      title: 'AI Risk Prediction Engine',
      page: 'prediction',
      talkingPoint: 'Show the 87% circular gauge. Emphasize the transparent methodology banner: a deterministic environmental screening index. Move the rainfall slider from 142mm to 190mm to demonstrate real-time risk recalculation and explainability factor bars.',
      actionText: 'Go to AI Predictor'
    },
    {
      num: 3,
      title: 'Impact Intelligence (WHERE, WHO, WHAT, WHAT NEXT)',
      page: 'impact',
      talkingPoint: 'Explain how PRALEYE differentiates from simple weather apps by answering the 4 questions: WHERE (18.4 km²), WHO (30,800 exposed, 8,200 high vulnerability), WHAT (3 hospitals, 4 bridges), WHAT NEXT (phased tactical evacuation checklist).',
      actionText: 'Go to Impact'
    },
    {
      num: 4,
      title: 'Safe Evacuation Decision Intelligence',
      page: 'evacuation',
      talkingPoint: 'Key Demo Moment: Point out that regular GPS suggests Route A (3.4 km, 8 min), but PRALEYE AI REJECTS it because it cuts through the Hadapsar flood basin (water depth 1.4m). Instead, PRALEYE recommends Route B (6.1 km, 15 min) along elevated terrain.',
      actionText: 'Go to Evacuation'
    },
    {
      num: 5,
      title: 'What-If Digital Twin & Resource Dispatch',
      page: 'simulation',
      talkingPoint: 'Move the rainfall slider to +30%, click SIMULATE, and show how the affected area spikes from 12 km² to 19 km² (↑58%). Then show Resource Optimization where the priority scoring formula allocates ambulances and NDRF boats to Zone A.',
      actionText: 'Go to Simulation'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#161B26]">
      <div className="bg-white border border-[#E3E6EB] rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E3E6EB] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7D1D2D]/10 border border-[#7D1D2D]/20 flex items-center justify-center text-[#7D1D2D]">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#161B26] uppercase tracking-wider">
                College Presentation &amp; Viva Demo Script
              </h2>
              <p className="text-[11px] text-[#667085]">5-Minute Live Walkthrough Flow for Demonstrating PRALEYE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#667085] hover:text-[#161B26] p-1 rounded-lg hover:bg-[#F5F6F8]">
            <X size={18} />
          </button>
        </div>

        {/* Script Steps */}
        <div className="space-y-3">
          {demoSteps.map(step => (
            <div
              key={step.num}
              className="bg-[#F5F6F8] border border-[#E3E6EB] hover:border-slate-300 rounded-xl p-3.5 space-y-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7D1D2D]/10 text-[#7D1D2D] font-bold text-xs flex items-center justify-center border border-[#7D1D2D]/20">
                    {step.num}
                  </span>
                  <h3 className="text-xs font-bold text-[#161B26]">{step.title}</h3>
                </div>

                <button
                  onClick={() => {
                    onNavigate(step.page);
                    onClose();
                  }}
                  className="text-[11px] font-semibold text-[#7D1D2D] hover:text-[#681825] flex items-center gap-1 bg-white px-2.5 py-1 rounded border border-[#E3E6EB] shadow-xs"
                >
                  {step.actionText} <ArrowRight size={11} />
                </button>
              </div>

              <p className="text-xs text-[#667085] leading-relaxed pl-7">
                <strong className="text-[#B86A12] font-semibold">Pitch Tip: </strong>
                {step.talkingPoint}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-[#F5F6F8] p-3 rounded-xl border border-[#E3E6EB] text-[11px] text-[#667085] flex items-center justify-between">
          <span>Remember: Emphasize &ldquo;Detect → Predict → Assess Impact → Prioritize → Respond&rdquo;</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#7D1D2D] hover:bg-[#681825] text-white font-bold text-xs shadow-xs"
          >
            Got it, Let&apos;s Present!
          </button>
        </div>
      </div>
    </div>
  );
}
