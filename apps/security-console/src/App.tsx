import React, { useState, useEffect } from 'react';
import {
  ViewTab,
  UIProcessedEvent,
  ExecutiveMetrics,
  ProviderDistribution,
  SystemHealthState,
} from './types/demo.types';
import { globalDemoAdapter } from './adapters/demo-pipeline.adapter';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ExecutiveMetricsComponent } from './components/ExecutiveMetrics';
import { ProviderDistributionComponent } from './components/ProviderDistribution';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { LiveEventStream } from './components/LiveEventStream';
import { SystemHealthComponent } from './components/SystemHealth';
import { DemoControlPanel } from './components/DemoControlPanel';
import { ArchitectureView } from './components/ArchitectureView';
import { PlannedAiPanel } from './components/PlannedAiPanel';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [events, setEvents] = useState<UIProcessedEvent[]>([]);
  const [metrics, setMetrics] = useState<ExecutiveMetrics>(globalDemoAdapter.getExecutiveMetrics());
  const [distribution, setDistribution] = useState<ProviderDistribution>(
    globalDemoAdapter.getProviderDistribution(),
  );
  const [health, setHealth] = useState<SystemHealthState>(globalDemoAdapter.getSystemHealth());

  // Initial seed generation (50 events)
  useEffect(() => {
    globalDemoAdapter.generateAndProcessEvents(50);
    refreshState();
  }, []);

  const refreshState = () => {
    setEvents([...globalDemoAdapter.getEventsStore()]);
    setMetrics(globalDemoAdapter.getExecutiveMetrics());
    setDistribution(globalDemoAdapter.getProviderDistribution());
    setHealth(globalDemoAdapter.getSystemHealth());
  };

  const handleGenerate = (count: number, tenant?: string, provider?: string) => {
    globalDemoAdapter.generateAndProcessEvents(count, tenant, provider);
    refreshState();
  };

  const handleToggleOutage = (outage: boolean) => {
    globalDemoAdapter.setOutageSimulation(outage);
    refreshState();
  };

  const handleRecover = () => {
    globalDemoAdapter.recoverPipelineAndFlush();
    refreshState();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 font-sans">
      <Header isOutageActive={health.isOutageSimulated} />

      <div className="flex-1 flex overflow-hidden">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Controls Bar always available at top of dashboard views */}
          {activeTab !== 'architecture' && activeTab !== 'ai-planned' && (
            <DemoControlPanel
              onGenerate={handleGenerate}
              onToggleOutage={handleToggleOutage}
              onRecover={handleRecover}
              isOutageActive={health.isOutageSimulated}
            />
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ExecutiveMetricsComponent metrics={metrics} />
              <PipelineVisualizer
                isOutageActive={health.isOutageSimulated}
                ringBufferDepth={health.ringBufferDepth}
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LiveEventStream events={events} />
                </div>
                <div className="space-y-6">
                  <ProviderDistributionComponent distribution={distribution} />
                  <SystemHealthComponent health={health} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="space-y-6">
              <ExecutiveMetricsComponent metrics={metrics} />
              <ProviderDistributionComponent distribution={distribution} />
              <LiveEventStream events={events} />
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <PipelineVisualizer
                isOutageActive={health.isOutageSimulated}
                ringBufferDepth={health.ringBufferDepth}
              />
              <SystemHealthComponent health={health} />
              <LiveEventStream events={events} />
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              <LiveEventStream events={events} />
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-6">
              <SystemHealthComponent health={health} />
              <ExecutiveMetricsComponent metrics={metrics} />
            </div>
          )}

          {activeTab === 'architecture' && <ArchitectureView />}

          {activeTab === 'ai-planned' && <PlannedAiPanel />}
        </main>
      </div>
    </div>
  );
};
