#!/usr/bin/env node
import { SyntheticTelemetryGenerator } from './generator';

const args = process.argv.slice(2);
const targetEPS = parseInt(args[0] || '100000', 10);
const durationSec = parseInt(args[1] || '1', 10);

console.log(`================================================================`);
console.log(` SentinelAI Synthetic Telemetry Generator`);
console.log(` Target Load Profile: ${targetEPS.toLocaleString()} EPS for ${durationSec}s`);
console.log(`================================================================`);

const generator = new SyntheticTelemetryGenerator({
  targetEPS,
  durationSeconds: durationSec,
  seed: 1337,
});

const totalEventsToGenerate = targetEPS * durationSec;
const snapshot = generator.runBenchmark(totalEventsToGenerate);

console.log(`[GENERATOR BENCHMARK RESULT]`);
console.log(` • Total Generated: ${snapshot.totalGenerated.toLocaleString()} events`);
console.log(` • Achieved EPS:    ${snapshot.achievedEPS.toLocaleString()} EPS`);
console.log(` • Elapsed Time:    ${snapshot.elapsedSeconds}s`);
console.log(` • By Provider:     `, snapshot.byProvider);
console.log(` • Errors:          ${snapshot.errors}`);
console.log(`================================================================`);
