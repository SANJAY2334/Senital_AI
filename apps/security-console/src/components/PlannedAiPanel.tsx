import React from 'react';
import { Network, BrainCircuit, ShieldAlert, FileCode2, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';

export const PlannedAiPanel: React.FC = () => {
  const capabilities = [
    {
      title: 'Incident Story Aggregator',
      timeline: 'Phase 2',
      desc: 'Causal graph cluster aggregation linking multi-cloud security events across identity and endpoint signals.',
      icon: <Network className="w-4 h-4 text-[#9898A0]" />,
    },
    {
      title: 'Dynamic Temporal Causal Graph',
      timeline: 'Phase 2',
      desc: 'Rolling 30-minute temporal window graph state maintained in Redis Graph for fast hop traversal.',
      icon: <BrainCircuit className="w-4 h-4 text-[#9898A0]" />,
    },
    {
      title: 'AI Triage & Risk Classifier',
      timeline: 'Phase 3',
      desc: 'Autonomous threat scoring and Isolation Forest anomaly inference on normalized OCSF events.',
      icon: <ShieldAlert className="w-4 h-4 text-[#9898A0]" />,
    },
    {
      title: 'SHAP Explainability Engine',
      timeline: 'Phase 3',
      desc: 'Raw log breadcrumb verification and feature contribution lineage for analyst trust.',
      icon: <FileCode2 className="w-4 h-4 text-[#9898A0]" />,
    },
    {
      title: 'Asset Criticality Guardrails',
      timeline: 'Phase 4',
      desc: 'Policy guardrail validation preventing high-blast-radius automated remediation on critical infrastructure.',
      icon: <Lock className="w-4 h-4 text-[#9898A0]" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-1 border-b border-[#1C1C21]">
        <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Platform roadmap</h1>
        <p className="text-xs text-[#9898A0] mt-0.5">
          Planned capabilities for AI-driven triage, correlation graphs, and automated response
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capabilities.map((c, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <CardHeader className="items-start">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-md bg-[#18181C] border border-[#26262E]">
                  {c.icon}
                </div>
                <CardTitle>{c.title}</CardTitle>
              </div>
              <span className="text-[11px] text-[#62626B]">{c.timeline}</span>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <p className="text-xs text-[#9898A0] leading-relaxed">{c.desc}</p>
              <div className="pt-2 border-t border-[#1C1C21] text-[11px] text-[#62626B] flex items-center justify-between">
                <span>Contract status</span>
                <span>Interface defined</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
