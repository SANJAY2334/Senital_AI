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
    <div className="space-y-5">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Received"
          value={metrics.eventsReceived.toLocaleString()}
          unit="frames"
          icon={<Layers className="w-4 h-4" />}
          trendText="100% Ingress rate"
          statusText="ONLINE"
        />

        <KpiCard
          label="Normalized to OCSF"
          value={metrics.eventsNormalized.toLocaleString()}
          unit="events"
          icon={<ShieldCheck className="w-4 h-4 text-cyan-400" />}
          trendText="v1.1.0 Schematized"
          statusText="NORMALIZED"
        />

        <KpiCard
          label="Rejected / Error Frames"
          value={metrics.eventsRejected.toLocaleString()}
          unit="drops"
          icon={<AlertOctagon className="w-4 h-4 text-red-400" />}
          trendText="0.0% drop rate"
          statusText="0 ERR"
        />

        <KpiCard
          label="Throughput Capacity"
          value={metrics.currentThroughputEPS.toLocaleString()}
          unit="EPS"
          icon={<Zap className="w-4 h-4 text-amber-400" />}
          trendText="Target: > 50,000 EPS"
          statusText="ACTIVE"
        />
      </div>

      {/* 2. Charts & Comparative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Timeline Chart (7 cols) */}
        <Card className="lg:col-span-7">
          <CardHeader>
            <div>
              <CardTitle>Ingestion & Schematization Throughput</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Stream volume timeline across 5-minute rolling windows
              </span>
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
              <CardTitle>Vendor Telemetry Distribution</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                Relative volume by ingress cloud vendor
              </span>
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
          <CardTitle>OCSF v1.1.0 Mapped Class Breakdown</CardTitle>
          <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
            Standard Mappers
          </span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-3.5 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>Class 6001: Cloud Audit</span>
                <span>AWS CloudTrail</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Normalizes AWS management event records (IAM policies, STS tokens, S3 bucket
                modifications) into standardized cloud audit schema envelopes.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Mapped Volume: {distribution.awsCount.toLocaleString()} events
              </div>
            </div>

            <div className="p-3.5 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-red-400 font-bold">
                <span>Class 1007: Process Activity</span>
                <span>CrowdStrike EDR</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Normalizes endpoint process trees, parent-child process hashes, execution flags, and
                privilege escalations from Falcon sensor feeds.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Mapped Volume: {distribution.csCount.toLocaleString()} events
              </div>
            </div>

            <div className="p-3.5 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>Class 3001: Authentication</span>
                <span>Okta IAM</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Normalizes enterprise identity sign-in flows, MFA challenges, push tokens, and
                session state transitions into unified authentication objects.
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Mapped Volume: {distribution.oktaCount.toLocaleString()} events
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
