import React, { useState } from 'react';
import {
  ExecutiveMetrics,
  SystemHealthState,
  SOCAlert,
  AlertStatus,
  TimelineDataPoint,
  ProviderDistribution,
} from '../../types/demo.types';
import { Layers, Zap, ShieldAlert, Clock, ChevronRight } from 'lucide-react';
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

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-[#1C1C21]">
        <div>
          <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">
            Security operations
          </h1>
          <p className="text-xs text-[#9898A0] mt-0.5">
            Real-time multi-cloud telemetry and threat detection
          </p>
        </div>
      </div>

      {/* 1. Primary Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard
          label="Events ingested"
          value={metrics.eventsReceived.toLocaleString()}
          unit="total"
          icon={<Layers className="w-4 h-4" />}
          trendText="+12.4% vs 5m avg"
          trendDirection="up"
          statusText="HEALTHY"
        />

        <KpiCard
          label="Normalizer throughput"
          value={metrics.currentThroughputEPS.toLocaleString()}
          unit="EPS"
          icon={<Zap className="w-4 h-4" />}
          trendText="Target: 50K EPS"
          trendDirection="neutral"
          statusText={health.isOutageSimulated ? 'OUTAGE' : 'ONLINE'}
        />

        <KpiCard
          label="Correlated alerts"
          value={alerts.length.toLocaleString()}
          unit="active"
          icon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
          trendText={`${criticalCount} critical, ${highCount} high`}
          trendDirection={criticalCount > 0 ? 'down' : 'neutral'}
          statusText={criticalCount > 0 ? 'CRITICAL' : 'TRIAGED'}
        />

        <KpiCard
          label="Pipeline latency"
          value={`${metrics.pipelineLatencyMs}`}
          unit="ms"
          icon={<Clock className="w-4 h-4" />}
          trendText="Target < 5.0 ms"
          trendDirection="up"
          statusText="HEALTHY"
        />
      </div>

      {/* 2. Charts Row: Activity Timeline + Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Activity Timeline (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Telemetry activity</CardTitle>
              <p className="text-xs text-[#9898A0] mt-0.5">
                Ingested events vs correlated alerts over rolling 60-minute window
              </p>
            </div>
            <span className="text-[11px] text-[#62626B]">5m intervals</span>
          </CardHeader>
          <CardContent>
            <ActivityTimelineChart data={timelineData} height={190} />
          </CardContent>
        </Card>

        {/* Severity Distribution Donut (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Alert classification</CardTitle>
              <p className="text-xs text-[#9898A0] mt-0.5">Active alerts categorized by severity</p>
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Critical Alerts (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Recent alerts</CardTitle>
              <p className="text-xs text-[#9898A0] mt-0.5">
                Highest severity detections awaiting investigation
              </p>
            </div>
            <Button variant="ghost" size="xs" onClick={onNavigateToAlerts}>
              <span>All alerts</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <div className="overflow-x-auto">
            {recentAlerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#62626B]">
                No active critical alerts detected in current telemetry window.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0E0E11] text-[#62626B] border-b border-[#1C1C21]">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Severity</th>
                    <th className="px-4 py-2.5 font-medium">Title</th>
                    <th className="px-4 py-2.5 font-medium">Target</th>
                    <th className="px-4 py-2.5 font-medium">Time</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1C21]">
                  {recentAlerts.map((alt) => (
                    <tr
                      key={alt.alertId}
                      onClick={() => setSelectedAlert(alt)}
                      className="hover:bg-[#18181C] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <SeverityBadge severity={alt.severityLabel} />
                      </td>
                      <td className="px-4 py-3 font-medium text-[#EDEDEF] truncate max-w-[200px]">
                        {alt.title}
                      </td>
                      <td className="px-4 py-3 text-[#9898A0] font-mono text-[11px] truncate max-w-[130px]">
                        {alt.affectedEntity.identifier}
                      </td>
                      <td className="px-4 py-3 text-[#62626B] font-mono text-[11px]">
                        {alt.detectedAt.substring(11, 19)} UTC
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={alt.status} />
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
              <CardTitle>Telemetry sources</CardTitle>
              <p className="text-xs text-[#9898A0] mt-0.5">Ingress distribution by cloud vendor</p>
            </div>
            <Button variant="ghost" size="xs" onClick={onNavigateToEvents}>
              <span>Logs</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <ProviderBarChart distribution={distribution} />

            <div className="mt-5 pt-3.5 border-t border-[#1C1C21] flex items-center justify-between text-xs">
              <span className="text-[#9898A0]">Total events processed</span>
              <span className="text-[#EDEDEF] font-semibold tabular-nums">
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
