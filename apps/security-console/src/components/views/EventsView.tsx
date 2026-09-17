import React, { useState } from 'react';
import { UIProcessedEvent } from '../../types/demo.types';
import { ListFilter, Filter, Eye, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
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
    <div className="space-y-4">
      {/* Search & Filtering Toolbar */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <ListFilter className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Normalized OCSF Telemetry Stream</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredEvents.length} events matching criteria ({events.length} stored)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search UUID, correlation ID, class..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>

        {/* Filter Badges Bar */}
        <div className="p-3 bg-[#090E1A] border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 mr-1 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Provider:</span>
            </span>
            {['ALL', 'AWS_CLOUDTRAIL', 'CROWDSTRIKE_EDR', 'OKTA_IAM'].map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedProvider === prov
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {prov === 'ALL'
                  ? 'All'
                  : prov === 'AWS_CLOUDTRAIL'
                    ? 'AWS'
                    : prov === 'CROWDSTRIKE_EDR'
                      ? 'CrowdStrike'
                      : 'Okta'}
              </button>
            ))}

            <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block" />

            <span className="text-slate-500 mr-1 hidden sm:inline">Severity:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <span>Page Size:</span>
            {[50, 100, 200].map((sz) => (
              <button
                key={sz}
                onClick={() => setPageSize(sz)}
                className={`px-2 py-0.5 rounded border text-[11px] ${
                  pageSize === sz
                    ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30'
                    : 'border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Events Table */}
      <Card>
        {filteredEvents.length === 0 ? (
          <EmptyState
            title="No Events Found"
            description="No telemetry events matched the current provider or severity criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedProvider('ALL');
              setSelectedSeverity('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090E1A] text-slate-400 border-b border-[#1E293B]">
                <tr>
                  <th className="p-3">OCSF Event ID</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Tenant ID</th>
                  <th className="p-3">OCSF Class</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70">
                {filteredEvents.slice(0, pageSize).map((evt) => (
                  <tr
                    key={evt.eventId}
                    onClick={() => setSelectedEvent(evt)}
                    className="hover:bg-[#1B2640]/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-1.5 max-w-[170px]">
                        <span className="text-cyan-400 font-semibold truncate block">
                          {evt.eventId}
                        </span>
                        <button
                          onClick={(e) => copyId(evt.eventId, e)}
                          className="text-slate-500 hover:text-slate-300 p-0.5 shrink-0"
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
                    <td className="p-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          evt.provider === 'AWS_CLOUDTRAIL'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : evt.provider === 'CROWDSTRIKE_EDR'
                              ? 'bg-red-950 text-red-400 border-red-800'
                              : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                        }`}
                      >
                        {evt.provider.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{evt.tenantId}</td>
                    <td className="p-3 text-purple-300">{evt.ocsfClassName}</td>
                    <td className="p-3">
                      <SeverityBadge severity={evt.severityLabel} />
                    </td>
                    <td className="p-3 text-slate-400">{evt.timestampUtc.substring(11, 19)} UTC</td>
                    <td className="p-3">
                      <StatusBadge status={evt.processingStatus} />
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-slate-400 hover:text-cyan-400 p-1">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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
