import React, { useState } from 'react';
import { UIProcessedEvent } from '../../types/demo.types';
import { Copy, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { SearchInput } from '../ui/SearchInput';
import { EmptyState } from '../ui/EmptyState';
import { EventDetailDrawer } from '../drawers/EventDetailDrawer';

interface EventsViewProps {
  events: UIProcessedEvent[];
}

export const EventsView: React.FC<EventsViewProps> = ({ events }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<UIProcessedEvent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(50);

  const copyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const filteredEvents = events.filter((evt) => {
    if (selectedProvider !== 'ALL' && evt.provider !== selectedProvider) return false;
    if (selectedSeverity !== 'ALL' && evt.severityLabel !== selectedSeverity) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = evt.eventId.toLowerCase().includes(q);
      const matchTenant = evt.tenantId.toLowerCase().includes(q);
      const matchClass = evt.ocsfClassName.toLowerCase().includes(q);
      const matchCorr = evt.correlationId.toLowerCase().includes(q);
      if (!matchId && !matchTenant && !matchClass && !matchCorr) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-[#1C1C21]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-lg font-semibold text-[#EDEDEF] tracking-tight">Events</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#18181C] text-[#9898A0] border border-[#26262E] tabular-nums">
              {filteredEvents.length}
            </span>
          </div>
          <p className="text-xs text-[#9898A0] mt-0.5">
            Normalized OCSF v1.1.0 stream from cloud ingress
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ID, tenant, class..."
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#62626B] mr-1">Provider:</span>
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

          <div className="h-3.5 w-px bg-[#26262E] mx-1.5 hidden sm:block" />

          <span className="text-[#62626B] mr-1 hidden sm:inline">Severity:</span>
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
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-[#62626B]">
          <span>Rows:</span>
          {[50, 100, 200].map((sz) => (
            <button
              key={sz}
              onClick={() => setPageSize(sz)}
              className={`px-2 py-0.5 rounded text-xs ${
                pageSize === sz
                  ? 'bg-[#222228] text-[#EDEDEF] font-medium'
                  : 'text-[#9898A0] hover:text-[#EDEDEF]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <Card>
        {filteredEvents.length === 0 ? (
          <EmptyState
            title="No events found"
            description="No telemetry events matched the current provider or filter criteria."
            actionLabel="Reset filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedProvider('ALL');
              setSelectedSeverity('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E0E11] text-[#62626B] border-b border-[#1C1C21]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Event ID</th>
                  <th className="px-4 py-2.5 font-medium">Provider</th>
                  <th className="px-4 py-2.5 font-medium">Tenant</th>
                  <th className="px-4 py-2.5 font-medium">OCSF class</th>
                  <th className="px-4 py-2.5 font-medium">Severity</th>
                  <th className="px-4 py-2.5 font-medium">Timestamp</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1C21]">
                {filteredEvents.slice(0, pageSize).map((evt) => (
                  <tr
                    key={evt.eventId}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-[#18181C] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[11px]">
                      <div className="flex items-center space-x-1.5 max-w-[170px] group">
                        <span className="text-[#EDEDEF] truncate block">{evt.eventId}</span>
                        <button
                          onClick={(e) => copyId(evt.eventId, e)}
                          className="opacity-0 group-hover:opacity-100 text-[#62626B] hover:text-[#EDEDEF] p-0.5 shrink-0 transition-opacity"
                          title="Copy UUID"
                        >
                          {copiedId === evt.eventId ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#9898A0]">
                      {evt.provider === 'AWS_CLOUDTRAIL'
                        ? 'AWS'
                        : evt.provider === 'CROWDSTRIKE_EDR'
                          ? 'CrowdStrike'
                          : 'Okta'}
                    </td>
                    <td className="px-4 py-3 text-[#9898A0] font-mono text-[11px]">
                      {evt.tenantId}
                    </td>
                    <td className="px-4 py-3 text-[#EDEDEF] font-medium">{evt.ocsfClassName}</td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={evt.severityLabel} />
                    </td>
                    <td className="px-4 py-3 text-[#62626B] font-mono text-[11px]">
                      {evt.timestampUtc.substring(11, 19)} UTC
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={evt.processingStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Event Inspection Drawer */}
      <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};
