import React, { useState } from 'react';
import { UIProcessedEvent } from '../../types/demo.types';
import { X, Copy, Check, ShieldCheck, FileText, Code2, Info } from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';

interface EventDetailDrawerProps {
  event: UIProcessedEvent | null;
  onClose: () => void;
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({ event, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ocsf' | 'raw'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!event) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Info className="w-3.5 h-3.5" /> },
    { id: 'ocsf', label: 'OCSF Normalized', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'raw', label: 'Raw Evidence', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  const rawFormatted = (() => {
    try {
      return JSON.stringify(JSON.parse(event.rawPayload), null, 2);
    } catch {
      return event.rawPayload;
    }
  })();

  const ocsfFormatted = JSON.stringify(event.ocsfNormalizedEvent, null, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#0D1424] border-l border-[#1E293B] shadow-2xl flex flex-col justify-between">
          {/* Topbar */}
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between bg-[#090E1A]">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
                  EVENT RECORD INSPECTOR
                </h3>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-[11px] font-mono text-cyan-400 truncate max-w-[220px]">
                    {event.eventId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(event.eventId, 'id')}
                    className="text-slate-400 hover:text-slate-200"
                    title="Copy Event ID"
                  >
                    {copiedField === 'id' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SeverityBadge severity={event.severityLabel} />
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 bg-[#090E1A] border-b border-[#1E293B]">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as 'overview' | 'ocsf' | 'raw')}
            />
          </div>

          {/* Body Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 font-mono text-xs">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Status bar */}
                <div className="flex items-center justify-between p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg">
                  <span className="text-slate-400">Processing Status:</span>
                  <StatusBadge status={event.processingStatus} />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Telemetry Provider
                    </span>
                    <span className="text-amber-400 font-bold">{event.provider}</span>
                  </div>

                  <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      OCSF Class Name
                    </span>
                    <span className="text-purple-300 font-bold">{event.ocsfClassName}</span>
                  </div>

                  <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Tenant Identity
                    </span>
                    <span className="text-slate-200 font-medium">{event.tenantId}</span>
                  </div>

                  <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      OCSF Class UID
                    </span>
                    <span className="text-slate-200 font-medium">{event.ocsfClassUid}</span>
                  </div>

                  <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Timestamp (UTC ISO-8601)
                    </span>
                    <span className="text-slate-200 font-medium">{event.timestampUtc}</span>
                  </div>

                  <div className="bg-[#090E1A] border border-[#1E293B] p-3 rounded-lg space-y-1 sm:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Correlation ID
                      </span>
                      <button
                        onClick={() => copyToClipboard(event.correlationId, 'corr')}
                        className="text-slate-400 hover:text-slate-200 text-[10px] flex items-center space-x-1"
                      >
                        {copiedField === 'corr' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy</span>
                      </button>
                    </div>
                    <span className="text-cyan-300 truncate block font-medium">
                      {event.correlationId}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#090E1A] border border-cyan-900/30 rounded-lg text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-cyan-400 font-semibold">Compliance Note: </span>
                  Event is normalized to OCSF v1.1.0 schema with raw vendor evidence preserved in
                  compliance with <code className="text-amber-300">SRS-FR-001</code> and{' '}
                  <code className="text-amber-300">ADR-0003</code>.
                </div>
              </div>
            )}

            {activeTab === 'ocsf' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Class UID: {event.ocsfClassUid} Schema Envelope</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={
                      copiedField === 'ocsf' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )
                    }
                    onClick={() => copyToClipboard(ocsfFormatted, 'ocsf')}
                  >
                    {copiedField === 'ocsf' ? 'Copied' : 'Copy JSON'}
                  </Button>
                </div>
                <pre className="bg-[#090E1A] border border-[#1E293B] p-4 rounded-lg text-emerald-400 text-[11px] overflow-x-auto max-h-[500px] leading-relaxed">
                  {ocsfFormatted}
                </pre>
              </div>
            )}

            {activeTab === 'raw' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Original Vendor Ingress Record</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={
                      copiedField === 'raw' ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )
                    }
                    onClick={() => copyToClipboard(rawFormatted, 'raw')}
                  >
                    {copiedField === 'raw' ? 'Copied' : 'Copy Payload'}
                  </Button>
                </div>
                <pre className="bg-[#090E1A] border border-[#1E293B] p-4 rounded-lg text-slate-300 text-[11px] overflow-x-auto max-h-[500px] leading-relaxed">
                  {rawFormatted}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[#1E293B] bg-[#090E1A] flex justify-end">
            <Button variant="secondary" size="xs" onClick={onClose}>
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
