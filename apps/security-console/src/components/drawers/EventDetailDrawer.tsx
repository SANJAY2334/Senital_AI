import React, { useState } from 'react';
import { UIProcessedEvent } from '../../types/demo.types';
import { X, Copy, Check, ShieldCheck, FileText, Info } from 'lucide-react';
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
    { id: 'ocsf', label: 'Normalized OCSF', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'raw', label: 'Raw evidence', icon: <FileText className="w-3.5 h-3.5" /> },
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
        <div className="w-screen max-w-xl bg-[#121215] border-l border-[#222227] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#1C1C21] flex items-start justify-between bg-[#0E0E11] gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#62626B]">Event record</span>
                <SeverityBadge severity={event.severityLabel} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-[#EDEDEF] truncate max-w-[280px]">
                  {event.eventId}
                </span>
                <button
                  onClick={() => copyToClipboard(event.eventId, 'id')}
                  className="text-[#62626B] hover:text-[#EDEDEF]"
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

            <button
              onClick={onClose}
              className="p-1 text-[#9898A0] hover:text-[#EDEDEF] hover:bg-[#18181C] rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 bg-[#0E0E11] border-b border-[#1C1C21]">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as 'overview' | 'ocsf' | 'raw')}
            />
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Status bar */}
                <div className="flex items-center justify-between p-3 bg-[#18181C] border border-[#26262E] rounded-lg">
                  <span className="text-[#9898A0]">Processing status</span>
                  <StatusBadge status={event.processingStatus} />
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#18181C] border border-[#26262E] p-3 rounded-lg space-y-1">
                    <span className="text-[11px] text-[#62626B] block">Provider</span>
                    <span className="text-[#EDEDEF] font-medium block">
                      {event.provider === 'AWS_CLOUDTRAIL'
                        ? 'AWS CloudTrail'
                        : event.provider === 'CROWDSTRIKE_EDR'
                          ? 'CrowdStrike'
                          : 'Okta IAM'}
                    </span>
                  </div>

                  <div className="bg-[#18181C] border border-[#26262E] p-3 rounded-lg space-y-1">
                    <span className="text-[11px] text-[#62626B] block">OCSF class</span>
                    <span className="text-[#EDEDEF] font-medium block">{event.ocsfClassName}</span>
                  </div>

                  <div className="bg-[#18181C] border border-[#26262E] p-3 rounded-lg space-y-1">
                    <span className="text-[11px] text-[#62626B] block">Tenant</span>
                    <span className="text-[#EDEDEF] font-mono text-[11px] block">
                      {event.tenantId}
                    </span>
                  </div>

                  <div className="bg-[#18181C] border border-[#26262E] p-3 rounded-lg space-y-1">
                    <span className="text-[11px] text-[#62626B] block">Class UID</span>
                    <span className="text-[#EDEDEF] font-mono text-[11px] block">
                      {event.ocsfClassUid}
                    </span>
                  </div>

                  <div className="bg-[#18181C] border border-[#26262E] p-3 rounded-lg space-y-1 col-span-2">
                    <span className="text-[11px] text-[#62626B] block">Timestamp (UTC)</span>
                    <span className="text-[#EDEDEF] font-mono text-[11px] block">
                      {event.timestampUtc}
                    </span>
                  </div>

                  <div className="bg-[#18181C] border border-[#26262E] p-3 rounded-lg space-y-1 col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#62626B] block">Correlation ID</span>
                      <button
                        onClick={() => copyToClipboard(event.correlationId, 'corr')}
                        className="text-[#62626B] hover:text-[#EDEDEF] text-[11px] flex items-center space-x-1"
                      >
                        {copiedField === 'corr' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy</span>
                      </button>
                    </div>
                    <span className="text-[#EDEDEF] font-mono text-[11px] truncate block">
                      {event.correlationId}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg text-xs text-[#9898A0] leading-relaxed">
                  Normalized to OCSF v1.1.0 schema with raw evidence preserved in compliance with
                  SRS-FR-001 and ADR-0003.
                </div>
              </div>
            )}

            {activeTab === 'ocsf' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9898A0]">
                  <span>Class UID {event.ocsfClassUid} envelope</span>
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
                <pre className="bg-[#0A0A0C] border border-[#222227] p-4 rounded-lg text-[#EDEDEF] font-mono text-[11px] overflow-x-auto max-h-[480px] leading-relaxed">
                  {ocsfFormatted}
                </pre>
              </div>
            )}

            {activeTab === 'raw' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9898A0]">
                  <span>Original vendor ingress record</span>
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
                    {copiedField === 'raw' ? 'Copied' : 'Copy payload'}
                  </Button>
                </div>
                <pre className="bg-[#0A0A0C] border border-[#222227] p-4 rounded-lg text-[#9898A0] font-mono text-[11px] overflow-x-auto max-h-[480px] leading-relaxed">
                  {rawFormatted}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-[#1C1C21] bg-[#0E0E11] flex justify-end">
            <Button variant="secondary" size="xs" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
