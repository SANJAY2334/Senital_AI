import React from 'react';
import { Sparkles, Network, BrainCircuit, ShieldAlert, FileCode2, Lock } from 'lucide-react';

export const PlannedAiPanel: React.FC = () => {
  const capabilities = [
    { title: 'Incident Story Aggregator', milestone: 'Sprint 2 (EPIC-2)', desc: 'Causal graph cluster aggregation linking multi-cloud security events.', icon: <Network className="w-5 h-5 text-indigo-400" /> },
    { title: 'Dynamic Temporal Causal Graph', milestone: 'Sprint 2 (EPIC-2)', desc: '30-minute rolling temporal window graph state maintained in Redis Graph.', icon: <BrainCircuit className="w-5 h-5 text-cyan-400" /> },
    { title: 'AI Triage & XGBoost Risk Classifier', milestone: 'Sprint 3 (EPIC-3)', desc: 'Autonomous threat scoring and Isolation Forest anomaly inference.', icon: <ShieldAlert className="w-5 h-5 text-amber-400" /> },
    { title: 'SHAP Explainability Engine', milestone: 'Sprint 3 (EPIC-3)', desc: 'Raw log breadcrumb verification and feature contribution lineage.', icon: <FileCode2 className="w-5 h-5 text-purple-400" /> },
    { title: 'Asset Criticality Guardrails', milestone: 'Sprint 4 (EPIC-4)', desc: 'Policy guardrail validation preventing high-blast-radius remediation.', icon: <Lock className="w-5 h-5 text-red-400" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-indigo-950/40 border border-indigo-800/80 p-5 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-base font-bold font-mono text-indigo-200">FUTURE AI & ADVANCED ANALYTICS ROADMAP</h2>
            <p className="text-xs text-indigo-400 font-mono">Visually Reserved Capabilities — Implementation Scheduled for Sprints 2–6</p>
          </div>
        </div>
        <span className="text-xs bg-indigo-900 text-indigo-300 border border-indigo-700 px-3 py-1 rounded font-mono font-bold">
          PLANNED — SPRINT 2+
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {capabilities.map((c, i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl space-y-3 opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              {c.icon}
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {c.milestone}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-200">{c.title}</h3>
            <p className="text-xs text-slate-400">{c.desc}</p>
            <div className="pt-2 text-[10px] text-amber-500 font-semibold flex items-center space-x-1">
              <span>Status:</span>
              <span>Architecture Defined / Backend Reserved</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
