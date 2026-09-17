import React, { useState } from 'react';
import { SOCAlert, AlertStatus } from '../../types/demo.types';
import {
  X,
  ShieldAlert,
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
        <div className="w-screen max-w-2xl bg-[#0D1424] border-l border-[#1E293B] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 border-b border-[#1E293B] bg-[#090E1A] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-red-950 border border-red-800 text-red-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    ALERT RECORD
                  </span>
                  <span className="text-cyan-400 font-mono text-xs">{alert.alertId}</span>
                </div>
                <h3 className="text-sm font-bold font-mono text-slate-100 mt-0.5">{alert.title}</h3>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <SeverityBadge severity={alert.severityLabel} />
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5 font-mono text-xs">
            {/* Status & Quick Action Banner */}
            <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Triage Status:</span>
                <StatusBadge status={alert.status} />
              </div>

              <div className="flex items-center space-x-1.5">
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
                    className="border-emerald-800 text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900"
                    onClick={() => onUpdateStatus(alert.alertId, 'RESOLVED')}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>

            {/* Target Entity & Detection Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Affected Entity ({alert.affectedEntity.type})
                </span>
                <div className="flex items-center space-x-2 text-slate-200 font-bold">
                  <EntityIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{alert.affectedEntity.identifier}</span>
                </div>
              </div>

              <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Telemetry Provider
                </span>
                <span className="text-amber-400 font-bold">{alert.provider}</span>
              </div>

              <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Detected At
                </span>
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{alert.detectedAt.substring(11, 19)} UTC</span>
                </div>
              </div>

              <div className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                  Tenant Scope
                </span>
                <span className="text-slate-300">{alert.tenantId}</span>
              </div>
            </div>

            {/* MITRE ATT&CK Context */}
            {alert.mitreAttack && (
              <div className="p-3.5 bg-[#090E1A] border border-cyan-900/40 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400">
                  <div className="flex items-center space-x-1.5">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>MITRE ATT&CK FRAMEWORK MAPPING</span>
                  </div>
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded text-[10px]">
                    {alert.mitreAttack.techniqueId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tactic:</span>
                    <span className="text-slate-200 font-semibold">{alert.mitreAttack.tactic}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Technique:</span>
                    <span className="text-slate-200 font-semibold">
                      {alert.mitreAttack.technique}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Investigation Summary */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                Investigation Assessment
              </span>
              <p className="p-3 bg-[#090E1A] border border-[#1E293B] rounded-lg text-slate-300 leading-relaxed text-xs">
                {alert.investigationSummary}
              </p>
            </div>

            {/* Trigger Event & OCSF Evidence */}
            <div className="border border-[#1E293B] rounded-lg overflow-hidden bg-[#090E1A]">
              <button
                onClick={() => setShowRawEvent(!showRawEvent)}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Trigger Event Evidence (OCSF Class {alert.triggerEvent.ocsfClassUid})
                  </span>
                </div>
                {showRawEvent ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showRawEvent && (
                <div className="p-3 border-t border-[#1E293B] space-y-2">
                  <pre className="text-emerald-400 text-[10px] overflow-x-auto max-h-48 p-2 rounded bg-slate-950">
                    {JSON.stringify(alert.triggerEvent.ocsfNormalizedEvent, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Recommended Containment Actions (Simulated) */}
            <div className="p-3.5 bg-[#090E1A] border border-amber-900/40 rounded-lg space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>RECOMMENDED CONTAINMENT PLAYBOOK (SIMULATED)</span>
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                {alert.provider === 'CROWDSTRIKE_EDR' && (
                  <>
                    <li>Issue Real-Time Response (RTR) network containment on host</li>
                    <li>Kill process tree associated with correlation ID {alert.correlationId}</li>
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
          <div className="p-3 border-t border-[#1E293B] bg-[#090E1A] flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">
              Correlation: {alert.correlationId}
            </span>
            <Button variant="secondary" size="xs" onClick={onClose}>
              Close Investigation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
