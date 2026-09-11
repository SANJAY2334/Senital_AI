import React, { useState } from 'react';
import { UIProcessedEvent } from '../types/demo.types';
import { EventDetailDrawer } from './EventDetailDrawer';
import { Filter, Eye, ChevronRight } from 'lucide-react';

interface LiveEventStreamProps {
  events: UIProcessedEvent[];
}

export const LiveEventStream: React.FC<LiveEventStreamProps> = ({ events }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<UIProcessedEvent | null>(null);

  const filteredEvents =
    selectedProvider === 'ALL' ? events : events.filter((e) => e.provider === selectedProvider);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-sm font-semibold font-mono text-slate-200">
            LIVE NORMALIZED SECURITY EVENT STREAM
          </h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
            {filteredEvents.length} events
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <button
            onClick={() => setSelectedProvider('ALL')}
            className={`px-2.5 py-1 rounded transition-colors ${selectedProvider === 'ALL' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedProvider('AWS_CLOUDTRAIL')}
            className={`px-2.5 py-1 rounded transition-colors ${selectedProvider === 'AWS_CLOUDTRAIL' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            AWS
          </button>
          <button
            onClick={() => setSelectedProvider('CROWDSTRIKE_EDR')}
            className={`px-2.5 py-1 rounded transition-colors ${selectedProvider === 'CROWDSTRIKE_EDR' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            CrowdStrike
          </button>
          <button
            onClick={() => setSelectedProvider('OKTA_IAM')}
            className={`px-2.5 py-1 rounded transition-colors ${selectedProvider === 'OKTA_IAM' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Okta
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3">OCSF Event ID</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Tenant ID</th>
              <th className="p-3">OCSF Class</th>
              <th className="p-3">Severity</th>
              <th className="p-3">UTC Timestamp</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEvents.slice(0, 50).map((evt) => (
              <tr
                key={evt.eventId}
                onClick={() => setSelectedEvent(evt)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="p-3 text-cyan-400 font-semibold truncate max-w-[140px]">
                  {evt.eventId}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.provider === 'AWS_CLOUDTRAIL'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : evt.provider === 'CROWDSTRIKE_EDR'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}
                  >
                    {evt.provider}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{evt.tenantId}</td>
                <td className="p-3 text-purple-300">{evt.ocsfClassName}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.severityLabel === 'CRITICAL'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : evt.severityLabel === 'HIGH'
                          ? 'bg-orange-950 text-orange-400 border border-orange-800'
                          : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {evt.severityLabel}
                  </span>
                </td>
                <td className="p-3 text-slate-400">{evt.timestampUtc.substring(11, 19)} UTC</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      evt.processingStatus === 'NORMALIZED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {evt.processingStatus}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button className="text-slate-400 hover:text-cyan-400 flex items-center justify-end space-x-1 ml-auto">
                    <Eye className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EventDetailDrawer event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};
