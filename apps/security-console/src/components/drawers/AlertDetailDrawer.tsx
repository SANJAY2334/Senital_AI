import React, { useState } from 'react';
import { SOCAlert, AlertStatus } from '../../types/demo.types';
import {
  X,
  Server,
  User,
  Cloud,
  Clock,
  Crosshair,
  FileCode,
  Terminal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AlertDetailDrawerProps {
  alert: SOCAlert | null;
  onClose: () => void;
  onUpdateStatus: (alertId: string, status: AlertStatus) => void;
}

export const AlertDetailDrawer: React.FC<AlertDetailDrawerProps> = ({
  alert,
  onClose,
  onUpdateStatus,
}) => {
  const [showRawEvent, setShowRawEvent] = useState(false);

  if (!alert) return null;

  const EntityIcon =
    alert.affectedEntity.type === 'HOST'
      ? Server
      : alert.affectedEntity.type === 'USER'
        ? User
        : Cloud;

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
          <div className="p-4 sm:p-5 border-b border-[#1C1C21] bg-[#0E0E11] flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-[#62626B] font-mono">{alert.alertId}</span>
                <SeverityBadge severity={alert.severityLabel} />
              </div>
              <h2 className="text-base font-semibold text-[#EDEDEF] leading-snug">{alert.title}</h2>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-[#9898A0] hover:text-[#EDEDEF] hover:bg-[#18181C] rounded-md transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5 text-xs">
            {/* Status & Quick Action Row */}
            <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[#9898A0]">Status:</span>
                <StatusBadge status={alert.status} />
              </div>

              <div className="flex items-center space-x-2">
                {alert.status !== 'INVESTIGATING' && (
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => onUpdateStatus(alert.alertId, 'INVESTIGATING')}
                  >
                    Investigate
                  </Button>
                )}
                {alert.status !== 'RESOLVED' && (
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => onUpdateStatus(alert.alertId, 'RESOLVED')}
                  >
                    Mark resolved
                  </Button>
                )}
              </div>
            </div>

            {/* Target Entity & Detection Metadata */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg space-y-1">
                <span className="text-[11px] text-[#62626B] block">
                  Target ({alert.affectedEntity.type.toLowerCase()})
                </span>
                <div className="flex items-center space-x-1.5 text-[#EDEDEF] font-medium font-mono text-[11px]">
                  <EntityIcon className="w-3.5 h-3.5 text-[#9898A0] shrink-0" />
                  <span className="truncate">{alert.affectedEntity.identifier}</span>
                </div>
              </div>

              <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg space-y-1">
                <span className="text-[11px] text-[#62626B] block">Provider</span>
                <span className="text-[#EDEDEF] font-medium block">
                  {alert.provider === 'AWS_CLOUDTRAIL'
                    ? 'AWS CloudTrail'
                    : alert.provider === 'CROWDSTRIKE_EDR'
                      ? 'CrowdStrike EDR'
                      : 'Okta IAM'}
                </span>
              </div>

              <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg space-y-1">
                <span className="text-[11px] text-[#62626B] block">Detected at</span>
                <div className="flex items-center space-x-1.5 text-[#EDEDEF] font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#62626B]" />
                  <span>{alert.detectedAt.substring(11, 19)} UTC</span>
                </div>
              </div>

              <div className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg space-y-1">
                <span className="text-[11px] text-[#62626B] block">Tenant</span>
                <span className="text-[#EDEDEF] font-mono text-[11px] block">{alert.tenantId}</span>
              </div>
            </div>

            {/* MITRE ATT&CK Context */}
            {alert.mitreAttack && (
              <div className="p-3.5 bg-[#18181C] border border-[#26262E] rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5 font-medium text-[#EDEDEF]">
                    <Crosshair className="w-3.5 h-3.5 text-[#9898A0]" />
                    <span>MITRE ATT&CK mapping</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#9898A0] bg-[#222228] px-1.5 py-0.5 rounded">
                    {alert.mitreAttack.techniqueId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-[11px] text-[#62626B] block">Tactic</span>
                    <span className="text-[#EDEDEF]">{alert.mitreAttack.tactic}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#62626B] block">Technique</span>
                    <span className="text-[#EDEDEF]">{alert.mitreAttack.technique}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Investigation Summary */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#62626B] block">Investigation assessment</span>
              <p className="p-3 bg-[#18181C] border border-[#26262E] rounded-lg text-[#9898A0] leading-relaxed text-xs">
                {alert.investigationSummary}
              </p>
            </div>

            {/* Trigger Event & OCSF Evidence */}
            <div className="border border-[#26262E] rounded-lg overflow-hidden bg-[#18181C]">
              <button
                onClick={() => setShowRawEvent(!showRawEvent)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-[#202026] transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-[#9898A0]" />
                  <span className="text-xs font-medium text-[#EDEDEF]">
                    Normalized trigger event (Class {alert.triggerEvent.ocsfClassUid})
                  </span>
                </div>
                {showRawEvent ? (
                  <ChevronUp className="w-4 h-4 text-[#62626B]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#62626B]" />
                )}
              </button>

              {showRawEvent && (
                <div className="p-3 border-t border-[#26262E] bg-[#121215]">
                  <pre className="text-[#EDEDEF] font-mono text-[11px] overflow-x-auto max-h-48 p-2 rounded leading-relaxed">
                    {JSON.stringify(alert.triggerEvent.ocsfNormalizedEvent, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Recommended Containment Actions (Simulated) */}
            <div className="p-3.5 bg-[#18181C] border border-[#26262E] rounded-lg space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-medium text-[#EDEDEF]">
                <Terminal className="w-3.5 h-3.5 text-[#9898A0]" />
                <span>Recommended containment playbook (simulated)</span>
              </div>
              <ul className="space-y-1.5 text-[#9898A0] text-xs list-disc list-inside">
                {alert.provider === 'CROWDSTRIKE_EDR' && (
                  <>
                    <li>Issue Real-Time Response (RTR) network containment on host</li>
                    <li>Kill process tree associated with correlation ID</li>
                  </>
                )}
                {alert.provider === 'OKTA_IAM' && (
                  <>
                    <li>Revoke active OAuth refresh tokens and force password rotation</li>
                    <li>Require WebAuthn/FIDO2 MFA authentication for user identity</li>
                  </>
                )}
                {alert.provider === 'AWS_CLOUDTRAIL' && (
                  <>
                    <li>Attach inline deny policy on IAM Principal</li>
                    <li>Revoke STS temporary session tokens issued in target region</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-[#1C1C21] bg-[#0E0E11] flex items-center justify-between">
            <span className="text-[11px] text-[#62626B] font-mono">
              Correlation: {alert.correlationId}
            </span>
            <Button variant="secondary" size="xs" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
