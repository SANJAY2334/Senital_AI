import React, { useState } from 'react';
import {
  ExecutiveMetrics,
  SystemHealthState,
  SOCAlert,
  AlertStatus,
  TimelineDataPoint,
  ProviderDistribution,
} from '../../types/demo.types';
import { Layers, Zap, ShieldAlert, Clock, ChevronRight, Eye } from 'lucide-react';
import { KpiCard } from '../ui/KpiCard';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { ActivityTimelineChart } from '../charts/ActivityTimelineChart';
import { SeverityDonutChart } from '../charts/SeverityDonutChart';
import { ProviderBarChart } from '../charts/ProviderBarChart';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertDetailDrawer } from '../drawers/AlertDetailDrawer';

interface DashboardViewProps {
  metrics: ExecutiveMetrics;
  health: SystemHealthState;
  alerts: SOCAlert[];
  distribution: ProviderDistribution;
  timelineData: TimelineDataPoint[];
  onNavigateToAlerts: () => void;
  onNavigateToEvents: () => void;
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  health,
  alerts,
  distribution,
  timelineData,
  onNavigateToAlerts,
  onNavigateToEvents,
  onUpdateAlertStatus,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<SOCAlert | null>(null);

  const criticalCount = alerts.filter((a) => a.severityLabel === 'CRITICAL').length;
  const highCount = alerts.filter((a) => a.severityLabel === 'HIGH').length;
  const mediumCount = alerts.filter((a) => a.severityLabel === 'MEDIUM').length;
  const lowCount = alerts.filter((a) => a.severityLabel === 'LOW').length;

  const recentAlerts = alerts.slice(0, 6);

  return (
    <div className="space-y-5">
      {/* 1. Primary Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Events Ingested"
          value={metrics.eventsReceived.toLocaleString()}
          unit="events"
          icon={<Layers className="w-4 h-4" />}
          trendText="+12.4% vs 5m avg"
          trendDirection="up"
          statusText="HEALTHY"
        />

        <KpiCard
          label="Normalizer Throughput"
          value={metrics.currentThroughputEPS.toLocaleString()}
          unit="EPS"
          icon={<Zap className="w-4 h-4" />}
          trendText="Peak capacity: 100K"
          trendDirection="neutral"
          statusText={health.isOutageSimulated ? 'OUTAGE' : 'ONLINE'}
        />

        <KpiCard
          label="Correlated Alerts"
          value={alerts.length.toLocaleString()}
          unit="active"
          icon={<ShieldAlert className="w-4 h-4 text-red-400" />}
          trendText={`${criticalCount} Critical, ${highCount} High`}
          trendDirection={criticalCount > 0 ? 'down' : 'neutral'}
          statusText={criticalCount > 0 ? 'CRITICAL' : 'TRIAGED'}
        />

        <KpiCard
          label="Pipeline Latency"
          value={`${metrics.pipelineLatencyMs}`}
          unit="ms"
          icon={<Clock className="w-4 h-4" />}
          trendText="Target: < 5.0 ms"
          trendDirection="up"
          statusText="OPTIMAL"
        />
      </div>

      {/* 2. Charts Row: Activity Timeline + Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Activity Timeline (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Telemetry Activity & Alert Volume</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Real-time 60-minute window throughput (Events vs Correlated Alerts)
              </span>
            </div>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              5m Intervals
            </span>
          </CardHeader>
          <CardContent>
            <ActivityTimelineChart data={timelineData} height={190} />
          </CardContent>
        </Card>

        {/* Severity Distribution Donut (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Alert Severity Distribution</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Active security triage classification
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <SeverityDonutChart
              counts={{
                critical: criticalCount,
                high: highCount,
                medium: mediumCount,
                low: lowCount,
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* 3. Operational Surface: Recent Critical Alerts & Provider Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Critical Alerts (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <CardTitle>Recent Critical & High Severity Alerts</CardTitle>
            </div>
            <Button variant="ghost" size="xs" onClick={onNavigateToAlerts}>
              <span>View All Alerts</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            {recentAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No active critical alerts detected in current telemetry window.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#090E1A] text-slate-400 border-b border-[#1E293B]">
                  <tr>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Alert Title</th>
                    <th className="p-3">Affected Target</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B]/70">
                  {recentAlerts.map((alt) => (
                    <tr
                      key={alt.alertId}
                      onClick={() => setSelectedAlert(alt)}
                      className="hover:bg-[#1B2640]/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3">
                        <SeverityBadge severity={alt.severityLabel} />
                      </td>
                      <td className="p-3 font-semibold text-slate-200 truncate max-w-[200px]">
                        {alt.title}
                      </td>
                      <td className="p-3 text-slate-400 truncate max-w-[130px]">
                        {alt.affectedEntity.identifier}
                      </td>
                      <td className="p-3 text-slate-500">{alt.detectedAt.substring(11, 19)} UTC</td>
                      <td className="p-3">
                        <StatusBadge status={alt.status} />
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-slate-400 hover:text-cyan-400 inline-flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* Multi-Cloud Ingestion Breakdown (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Multi-Cloud Telemetry Distribution</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Ingress volume partitioned by vendor stream
              </span>
            </div>
            <Button variant="ghost" size="xs" onClick={onNavigateToEvents}>
              <span>Inspect Logs</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <ProviderBarChart distribution={distribution} />

            <div className="mt-5 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Total Pipeline Events:</span>
              <span className="text-cyan-400 font-bold font-mono">
                {metrics.eventsReceived.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investigation Drawer */}
      <AlertDetailDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onUpdateStatus={onUpdateAlertStatus}
      />
    </div>
  );
};
