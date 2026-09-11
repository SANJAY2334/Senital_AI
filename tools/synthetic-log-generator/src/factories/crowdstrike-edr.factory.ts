import { SeededRandom } from '../utils/seed-random.util';
import { SyntheticRawTelemetryPackage } from './aws-cloudtrail.factory';

export class CrowdStrikeEdrFactory {
  private prng: SeededRandom;

  constructor(prng: SeededRandom) {
    this.prng = prng;
  }

  public createEvent(tenantId: string = 'tenant-acme-corp'): SyntheticRawTelemetryPackage {
    const eventId = crypto.randomUUID();
    const correlationId = `corr-cs-${this.prng.nextInt(100000, 999999)}`;
    const timestampUtc = new Date().toISOString();

    const processes = [
      {
        name: 'powershell.exe',
        cmd: 'powershell.exe -ExecutionPolicy Bypass -Command EncodedCommand...',
      },
      { name: 'cmd.exe', cmd: 'cmd.exe /c net user attacker P@ssword123 /add' },
      { name: 'wmic.exe', cmd: 'wmic shadowcopy delete' },
      { name: 'lsass.exe', cmd: 'C:\\Windows\\System32\\lsass.exe' },
    ];
    const selectedProc = this.prng.pickOne(processes);

    const rawObject = {
      event: {
        id: eventId,
        ProcessStartTime: timestampUtc,
        ProcessId: this.prng.nextInt(1024, 65535),
        ImageFileName: selectedProc.name,
        CommandLine: selectedProc.cmd,
        ParentBaseFileName: 'explorer.exe',
        ParentProcessId: 1048,
        UserName: 'SYSTEM',
        UserSid: 'S-1-5-18',
        ComputerName: 'WORKSTATION-084',
        LocalIP: '10.0.4.12',
        Severity: this.prng.nextInt(1, 4), // 1: Low, 4: Critical
      },
    };

    return {
      eventId,
      tenantId,
      provider: 'CROWDSTRIKE_EDR',
      timestampUtc,
      correlationId,
      rawPayload: JSON.stringify(rawObject),
      metadata: {
        'x-sentinelai-source': 'synthetic-generator',
        'x-crowdstrike-aid': 'aid-998877665544332211',
      },
    };
  }
}
