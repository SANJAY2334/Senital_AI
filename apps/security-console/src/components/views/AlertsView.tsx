import React, { useState } from 'react';
import { SOCAlert, AlertStatus } from '../../types/demo.types';
import { Server, User, Cloud } from 'lucide-react';
import { Card } from '../ui/Card';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { SearchInput } from '../ui/SearchInput';
import { EmptyState } from '../ui/EmptyState';
import { AlertDetailDrawer } from '../drawers/AlertDetailDrawer';

interface AlertsViewProps {
  alerts: SOCAlert[];
  onUpdateAlertStatus: (alertId: string, status: AlertStatus) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({ alerts, onUpdateAlertStatus }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [activeAlert, setActiveAlert] = useState<SOCAlert | null>(null);

  // Filter alerts
  const filteredAlerts = alerts.filter((alt) => {
    if (selectedSeverity !== 'ALL' && alt.severityLabel !== selectedSeverity) return false;
    if (selectedProvider !== 'ALL' && alt.provider !== selectedProvider) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = alt.title.toLowerCase().includes(q);
      const matchEntity = alt.affectedEntity.identifier.toLowerCase().includes(q);
      const matchCorr = alt.correlationId.toLowerCase().includes(q);
      const matchMitre = alt.mitreAttack?.technique.toLowerCase().includes(q);
      if (!matchTitle && !matchEntity && !matchCorr && !matchMitre) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#1C1C21]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Alerts</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#18181C] text-[#9898A0] border border-[#26262E] tabular-nums">
              {filteredAlerts.length}
            </span>
          </div>
          <p className="text-xs text-[#9898A0] mt-0.5">
            Correlated detections across multi-cloud infrastructure
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search alerts, hosts, tactics..."
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#62626B] mr-1">Severity:</span>
        {[
          { id: 'ALL', label: 'All' },
          { id: 'CRITICAL', label: 'Critical' },
          { id: 'HIGH', label: 'High' },
          { id: 'MEDIUM', label: 'Medium' },
          { id: 'LOW', label: 'Low' },
        ].map((sev) => (
          <button
            key={sev.id}
            onClick={() => setSelectedSeverity(sev.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-normal transition-colors ${
              selectedSeverity === sev.id
                ? 'bg-[#222228] text-[#EDEDEF] border border-[#32323C]'
                : 'text-[#9898A0] hover:text-[#EDEDEF] hover:bg-[#18181C]'
            }`}
          >
            {sev.label}
          </button>
        ))}

        <div className="h-3.5 w-px bg-[#26262E] mx-1.5 hidden sm:block" />

        <span className="text-[#62626B] mr-1 hidden sm:inline">Provider:</span>
        {[
          { id: 'ALL', label: 'All' },
          { id: 'AWS_CLOUDTRAIL', label: 'AWS' },
          { id: 'CROWDSTRIKE_EDR', label: 'CrowdStrike' },
          { id: 'OKTA_IAM', label: 'Okta' },
        ].map((prov) => (
          <button
            key={prov.id}
            onClick={() => setSelectedProvider(prov.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-normal transition-colors ${
              selectedProvider === prov.id
                ? 'bg-[#222228] text-[#EDEDEF] border border-[#32323C]'
                : 'text-[#9898A0] hover:text-[#EDEDEF] hover:bg-[#18181C]'
            }`}
          >
            {prov.label}
          </button>
        ))}
      </div>

      {/* Alerts Table */}
      <Card>
        {filteredAlerts.length === 0 ? (
          <EmptyState
            title="No matching alerts"
            description="There are no security alerts matching your current filter criteria."
            actionLabel="Clear filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSeverity('ALL');
              setSelectedProvider('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E11] text-[#62626B] border-b border-[#1C1C21]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Severity</th>
                  <th className="px-4 py-2.5 font-medium">Alert</th>
                  <th className="px-4 py-2.5 font-medium">ATT&CK</th>
                  <th className="px-4 py-2.5 font-medium">Target entity</th>
                  <th className="px-4 py-2.5 font-medium">Provider</th>
                  <th className="px-4 py-2.5 font-medium">Detected</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C21]">
                {filteredAlerts.map((alt) => {
                  const TargetIcon =
                    alt.affectedEntity.type === 'HOST'
                      ? Server
                      : alt.affectedEntity.type === 'USER'
                        ? User
                        : Cloud;
                  return (
                    <tr
                      key={alt.alertId}
                      onClick={() => setActiveAlert(alt)}
                      className="hover:bg-[#18181C] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <SeverityBadge severity={alt.severityLabel} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#EDEDEF] truncate max-w-[280px]">
                          {alt.title}
                        </div>
                        <div className="text-[11px] text-[#62626B] font-mono mt-0.5">
                          {alt.alertId}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {alt.mitreAttack ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#18181C] border border-[#26262E] text-[#9898A0] font-mono text-[11px]">
                            {alt.mitreAttack.techniqueId}
                          </span>
                        ) : (
                          <span className="text-[#62626B]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#9898A0]">
                        <div className="flex items-center space-x-1.5 truncate max-w-[150px]">
                          <TargetIcon className="w-3.5 h-3.5 text-[#62626B] shrink-0" />
                          <span className="truncate font-mono text-[11px]">
                            {alt.affectedEntity.identifier}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#9898A0]">
                          {alt.provider === 'AWS_CLOUDTRAIL'
                            ? 'AWS CloudTrail'
                            : alt.provider === 'CROWDSTRIKE_EDR'
                              ? 'CrowdStrike'
                              : 'Okta'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#62626B] font-mono text-[11px]">
                        {alt.detectedAt.substring(11, 19)} UTC
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={alt.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Investigation Drawer */}
      <AlertDetailDrawer
        alert={activeAlert}
        onClose={() => setActiveAlert(null)}
        onUpdateStatus={onUpdateAlertStatus}
      />
    </div>
  );
};
