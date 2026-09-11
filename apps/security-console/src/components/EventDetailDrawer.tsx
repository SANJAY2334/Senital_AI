import React from 'react';
import { UIProcessedEvent } from '../types/demo.types';
import { X, ShieldCheck, FileText, CheckCircle } from 'lucide-react';

interface EventDetailDrawerProps {
  event: UIProcessedEvent | null;
  onClose: () => void;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-slate-950 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto z-50 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold font-mono text-slate-100">
                EVENT INSPECTION DRAWER
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                OCSF v1.1.0 Normalized Event Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Summary Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">
              OCSF Event ID (128-bit UUID)
            </span>
            <span className="text-cyan-400 font-semibold truncate block">{event.eventId}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">Tenant Identity</span>
            <span className="text-slate-200 font-semibold">{event.tenantId}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">Telemetry Provider</span>
            <span className="text-amber-400 font-semibold">{event.provider}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">OCSF Class Name</span>
            <span className="text-purple-400 font-semibold">{event.ocsfClassName}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">
              ISO-8601 UTC Timestamp
            </span>
            <span className="text-slate-200">{event.timestampUtc}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
            <span className="text-slate-500 block text-[10px] uppercase">Correlation ID</span>
            <span className="text-slate-400 truncate block">{event.correlationId}</span>
          </div>
        </div>

        {/* Normalized Payload JSON View */}
        <div className="space-y-2 font-mono">
          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400">
            <CheckCircle className="w-4 h-4" />
            <span>OCSF NORMALIZED PAYLOAD (Class {event.ocsfClassUid})</span>
          </div>
          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-xs text-emerald-400 overflow-x-auto max-h-64">
            {JSON.stringify(event.ocsfNormalizedEvent, null, 2)}
          </pre>
        </div>

        {/* Preserved Raw Evidence Payload View */}
        <div className="space-y-2 font-mono">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
            <FileText className="w-4 h-4" />
            <span>PRESERVED RAW EVIDENCE PAYLOAD (SRS-FR-001)</span>
          </div>
          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-xs text-slate-300 overflow-x-auto max-h-48">
            {(() => {
              try {
                return JSON.stringify(JSON.parse(event.rawPayload), null, 2);
              } catch {
                return event.rawPayload;
              }
            })()}
          </pre>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={onClose}
          className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-xs font-mono font-medium hover:bg-slate-700 transition-colors"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
