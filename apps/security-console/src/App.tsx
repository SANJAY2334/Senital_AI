import React, { useState, useEffect, useCallback } from 'react';
import {
  ViewTab,
  UIProcessedEvent,
  ExecutiveMetrics,
  ProviderDistribution,
  SystemHealthState,
  SOCAlert,
  AlertStatus,
  TimelineDataPoint,
} from './types/demo.types';
import { globalDemoAdapter } from './adapters/demo-pipeline.adapter';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { AlertsView } from './components/views/AlertsView';
import { EventsView } from './components/views/EventsView';
import { PipelineView } from './components/views/PipelineView';
import { TelemetryView } from './components/views/TelemetryView';
import { HealthView } from './components/views/HealthView';
import { ArchitectureView } from './components/ArchitectureView';
import { PlannedAiPanel } from './components/PlannedAiPanel';
import { DemoControlsModal } from './components/modals/DemoControlsModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [events, setEvents] = useState<UIProcessedEvent[]>([]);
  const [alerts, setAlerts] = useState<SOCAlert[]>([]);
  const [metrics, setMetrics] = useState<ExecutiveMetrics>(globalDemoAdapter.getExecutiveMetrics());
  const [distribution, setDistribution] = useState<ProviderDistribution>(
    globalDemoAdapter.getProviderDistribution(),
  );
  const [health, setHealth] = useState<SystemHealthState>(globalDemoAdapter.getSystemHealth());
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const refreshState = useCallback(() => {
    setEvents([...globalDemoAdapter.getEventsStore()]);
    setAlerts([...globalDemoAdapter.getAlertsStore()]);
    setMetrics(globalDemoAdapter.getExecutiveMetrics());
    setDistribution(globalDemoAdapter.getProviderDistribution());
    setHealth(globalDemoAdapter.getSystemHealth());
    setTimelineData([...globalDemoAdapter.getTimelineData()]);
  }, []);

  // Initial seed generation (50 events)
  useEffect(() => {
    if (globalDemoAdapter.getEventsStore().length === 0) {
      globalDemoAdapter.generateAndProcessEvents(50);
    }
    refreshState();
  }, [refreshState]);

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

  const handleUpdateAlertStatus = (alertId: string, status: AlertStatus) => {
    globalDemoAdapter.updateAlertStatus(alertId, status);
    refreshState();
  };

  const criticalAlertCount = alerts.filter(
    (a) => a.severityLabel === 'CRITICAL' && a.status !== 'RESOLVED',
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* 1. Global Topbar */}
      <Topbar
        isOutageActive={health.isOutageSimulated}
        throughputEPS={metrics.currentThroughputEPS}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
        searchQuery={globalSearch}
        onSearchChange={(q) => {
          setGlobalSearch(q);
          if (q && activeTab !== 'events' && activeTab !== 'alerts') {
            setActiveTab('events');
          }
        }}
      />

      {/* 2. Main Shell: Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          alertCount={criticalAlertCount}
          eventCount={events.length}
        />

        <main className="flex-1 p-5 overflow-y-auto bg-[#080C14]">
          {activeTab === 'overview' && (
            <DashboardView
              metrics={metrics}
              health={health}
              alerts={alerts}
              distribution={distribution}
              timelineData={timelineData}
              onNavigateToAlerts={() => setActiveTab('alerts')}
              onNavigateToEvents={() => setActiveTab('events')}
              onUpdateAlertStatus={handleUpdateAlertStatus}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView alerts={alerts} onUpdateAlertStatus={handleUpdateAlertStatus} />
          )}

          {activeTab === 'events' && <EventsView events={events} />}

          {activeTab === 'pipeline' && (
            <PipelineView
              health={health}
              metrics={metrics}
              onOpenDemoControls={() => setIsDemoControlsOpen(true)}
            />
          )}

          {activeTab === 'telemetry' && (
            <TelemetryView
              metrics={metrics}
              distribution={distribution}
              timelineData={timelineData}
            />
          )}

          {activeTab === 'health' && (
            <HealthView
              health={health}
              onOpenDemoControls={() => setIsDemoControlsOpen(true)}
              onRecover={handleRecover}
              onToggleOutage={handleToggleOutage}
            />
          )}

          {activeTab === 'architecture' && <ArchitectureView />}

          {activeTab === 'ai-planned' && <PlannedAiPanel />}
        </main>
      </div>

      {/* 3. Global Simulation / Demo Controls Dialog */}
      <DemoControlsModal
        isOpen={isDemoControlsOpen}
        onClose={() => setIsDemoControlsOpen(false)}
        onGenerate={handleGenerate}
        onToggleOutage={handleToggleOutage}
        onRecover={handleRecover}
        isOutageActive={health.isOutageSimulated}
      />
    </div>
  );
};
