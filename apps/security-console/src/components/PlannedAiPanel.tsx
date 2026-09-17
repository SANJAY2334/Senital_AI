import React from 'react';
import { Sparkles, Network, BrainCircuit, ShieldAlert, FileCode2, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle } from './ui/Card';

export const PlannedAiPanel: React.FC = () => {
  const capabilities = [
    {
      title: 'Incident Story Aggregator',
      milestone: 'Sprint 2 (EPIC-2)',
      desc: 'Causal graph cluster aggregation linking multi-cloud security events.',
      icon: <Network className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Dynamic Temporal Causal Graph',
      milestone: 'Sprint 2 (EPIC-2)',
      desc: '30-minute rolling temporal window graph state maintained in Redis Graph.',
      icon: <BrainCircuit className="w-5 h-5 text-cyan-400" />,
    },
    {
      title: 'AI Triage & XGBoost Risk Classifier',
      milestone: 'Sprint 3 (EPIC-3)',
      desc: 'Autonomous threat scoring and Isolation Forest anomaly inference.',
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'SHAP Explainability Engine',
      milestone: 'Sprint 3 (EPIC-3)',
      desc: 'Raw log breadcrumb verification and feature contribution lineage.',
      icon: <FileCode2 className="w-5 h-5 text-purple-400" />,
    },
    {
      title: 'Asset Criticality Guardrails',
      milestone: 'Sprint 4 (EPIC-4)',
      desc: 'Policy guardrail validation preventing high-blast-radius remediation.',
      icon: <Lock className="w-5 h-5 text-red-400" />,
    },
  ];

  return (
    <div className="space-y-5 font-mono text-xs">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>AI & ADVANCED ANALYTICS ROADMAP</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Architecturally defined future capabilities (Sprints 2 through 6)
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded font-bold">
            PLANNED ROADMAP
          </span>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((c, i) => (
          <div
            key={i}
            className="bg-[#0D1424] border border-[#1E293B] hover:border-slate-700 p-4 rounded-xl space-y-3 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-lg bg-[#090E1A] border border-[#1E293B]">{c.icon}</div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                {c.milestone}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-200">{c.title}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">{c.desc}</p>
            <div className="pt-2 border-t border-[#1E293B] text-[10px] text-amber-400 font-semibold flex items-center justify-between">
              <span>Status:</span>
              <span className="text-slate-400 font-normal">Backend Contract Reserved</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
