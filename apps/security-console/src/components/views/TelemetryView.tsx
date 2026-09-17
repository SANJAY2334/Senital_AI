import React from 'react';
import { ExecutiveMetrics, ProviderDistribution, TimelineDataPoint } from '../../types/demo.types';
import { Layers, ShieldCheck, AlertOctagon, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { KpiCard } from '../ui/KpiCard';
import { ProviderBarChart } from '../charts/ProviderBarChart';
import { ActivityTimelineChart } from '../charts/ActivityTimelineChart';

interface TelemetryViewProps {
  metrics: ExecutiveMetrics;
  distribution: ProviderDistribution;
  timelineData: TimelineDataPoint[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({
  metrics,
  distribution,
  timelineData,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1 border-b border-[#1C1C21]">
        <div>
          <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Telemetry</h1>
          <p className="text-xs text-[#9898A0] mt-0.5">
            Ingress metrics, schematization performance, and mapped classes
          </p>
        </div>
      </div>

      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard
          label="Total received"
          value={metrics.eventsReceived.toLocaleString()}
          unit="frames"
          icon={<Layers className="w-4 h-4" />}
          trendText="100% ingress rate"
          statusText="ONLINE"
        />

        <KpiCard
          label="Normalized to OCSF"
          value={metrics.eventsNormalized.toLocaleString()}
          unit="events"
          icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />}
          trendText="v1.1.0 schematized"
          statusText="NORMALIZED"
        />

        <KpiCard
          label="Rejected frames"
          value={metrics.eventsRejected.toLocaleString()}
          unit="drops"
          icon={<AlertOctagon className="w-4 h-4 text-[#62626B]" />}
          trendText="0.0% drop rate"
          statusText="HEALTHY"
        />

        <KpiCard
          label="Throughput capacity"
          value={metrics.currentThroughputEPS.toLocaleString()}
          unit="EPS"
          icon={<Zap className="w-4 h-4 text-amber-400" />}
          trendText="Target: 50K EPS"
          statusText="ONLINE"
        />
      </div>

      {/* 2. Charts & Comparative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Timeline Chart (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Ingestion & schematization timeline</CardTitle>
              <p className="text-xs text-[#9898A0] mt-0.5">
                Stream volume timeline across 5-minute rolling windows
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityTimelineChart data={timelineData} height={200} />
          </CardContent>
        </Card>

        {/* Multi-Cloud Provider Distribution (5 cols) */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <div>
              <CardTitle>Vendor telemetry distribution</CardTitle>
              <p className="text-xs text-[#9898A0] mt-0.5">
                Relative volume by ingress cloud vendor
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <ProviderBarChart distribution={distribution} />
          </CardContent>
        </Card>
      </div>

      {/* 3. OCSF Schema Classification Metadata */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>OCSF v1.1.0 mapped classes</CardTitle>
            <p className="text-xs text-[#9898A0] mt-0.5">
              Standard event class mappers and conversion rules
            </p>
          </div>
          <span className="text-xs text-[#62626B]">3 registered mappers</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#EDEDEF]">Class 6001: Cloud Audit</span>
                <span className="text-xs text-[#FB923C]">AWS CloudTrail</span>
              </div>
              <p className="text-[#9898A0] leading-relaxed">
                Normalizes AWS management event records (IAM policies, STS tokens, S3 bucket
                modifications) into standardized cloud audit schema envelopes.
              </p>
              <div className="text-[11px] text-[#62626B] pt-1">
                Volume: {distribution.awsCount.toLocaleString()} events
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#EDEDEF]">Class 1007: Process Activity</span>
                <span className="text-xs text-[#F43F5E]">CrowdStrike EDR</span>
              </div>
              <p className="text-[#9898A0] leading-relaxed">
                Normalizes endpoint process trees, parent-child process hashes, execution flags, and
                privilege escalations from Falcon sensor feeds.
              </p>
              <div className="text-[11px] text-[#62626B] pt-1">
                Volume: {distribution.csCount.toLocaleString()} events
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#EDEDEF]">Class 3001: Authentication</span>
                <span className="text-xs text-[#38BDF8]">Okta IAM</span>
              </div>
              <p className="text-[#9898A0] leading-relaxed">
                Normalizes enterprise identity sign-in flows, MFA challenges, push tokens, and
                session state transitions into unified authentication objects.
              </p>
              <div className="text-[11px] text-[#62626B] pt-1">
                Volume: {distribution.oktaCount.toLocaleString()} events
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
