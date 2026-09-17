import { SOCAlert, AlertStatus } from '../../types/demo.types';
import { ShieldAlert, Filter, Eye, Server, User, Cloud, Crosshair } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
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
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');
  const [activeAlert, setActiveAlert] = useState<SOCAlert | null>(null);

  // Filter alerts
  const filteredAlerts = alerts.filter((alt) => {
    if (selectedSeverity !== 'ALL' && alt.severityLabel !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && alt.status !== selectedStatus) return false;
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
    <div className="space-y-4">
      {/* 1. Header & Filter Toolbar */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>SOC Alert Triage & Incident Investigation</CardTitle>
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredAlerts.length} matching alerts ({alerts.length} total active)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filter by title, host, MITRE..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>

        {/* Filter Badges Bar */}
        <div className="p-3 bg-[#090E1A] border-t border-[#1E293B] flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Severity:</span>
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                selectedSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-800 mx-2 hidden sm:block" />

          <span className="text-slate-500 mr-1 hidden sm:inline">Provider:</span>
          {['ALL', 'AWS_CLOUDTRAIL', 'CROWDSTRIKE_EDR', 'OKTA_IAM'].map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvider(prov)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                selectedProvider === prov
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
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
        </div>
      </Card>

      {/* 2. Alerts Table */}
      <Card>
        {filteredAlerts.length === 0 ? (
          <EmptyState
            title="No Alerts Match Filters"
            description="There are currently no security alerts matching your selected severity or search criteria."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedSeverity('ALL');
              setSelectedStatus('ALL');
              setSelectedProvider('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090E1A] text-slate-400 border-b border-[#1E293B]">
                <tr>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Alert Title & Context</th>
                  <th className="p-3">MITRE ATT&CK</th>
                  <th className="p-3">Affected Target</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70">
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
                      className="hover:bg-[#1B2640]/40 cursor-pointer transition-colors"
                    >
                      <td className="p-3">
                        <SeverityBadge severity={alt.severityLabel} />
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-100 truncate max-w-[240px]">
                          {alt.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ID: {alt.alertId}
                        </div>
                      </td>
                      <td className="p-3">
                        {alt.mitreAttack ? (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800 text-cyan-300 text-[10px]">
                            <Crosshair className="w-3 h-3 text-cyan-400" />
                            <span>{alt.mitreAttack.techniqueId}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-300">
                        <div className="flex items-center space-x-1.5 truncate max-w-[140px]">
                          <TargetIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{alt.affectedEntity.identifier}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                            alt.provider === 'AWS_CLOUDTRAIL'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : alt.provider === 'CROWDSTRIKE_EDR'
                                ? 'bg-red-950 text-red-400 border-red-800'
                                : 'bg-cyan-950 text-cyan-400 border-cyan-800'
                          }`}
                        >
                          {alt.provider.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{alt.detectedAt.substring(11, 19)} UTC</td>
                      <td className="p-3">
                        <StatusBadge status={alt.status} />
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-slate-400 hover:text-cyan-400 p-1">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
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
