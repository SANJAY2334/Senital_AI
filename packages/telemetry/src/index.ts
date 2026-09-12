export interface TraceSpanContext {
  traceId: string;
  spanId: string;
  sampled: boolean;
}

export interface ITelemetryService {
  startSpan(name: string, parentSpanId?: string): TraceSpanContext;
  endSpan(span: TraceSpanContext): void;
  recordMetric(name: string, value: number, tags?: Record<string, string>): void;
  incrementCounter(name: string, value?: number, tags?: Record<string, string>): void;
}

export class SentinelTelemetryService implements ITelemetryService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  getServiceName(): string {
    return this.serviceName;
  }

  startSpan(_name: string, parentSpanId?: string): TraceSpanContext {
    const traceId =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const spanId = Math.random().toString(36).substring(2, 10);
    return {
      traceId: parentSpanId ? parentSpanId.split(':')[0] : traceId,
      spanId,
      sampled: true,
    };
  }

  endSpan(_span: TraceSpanContext): void {
    // OpenTelemetry span completion hook
  }

  recordMetric(_name: string, _value: number, _tags?: Record<string, string>): void {
    // Metric recording hook (Prometheus exporter format)
  }

  incrementCounter(_name: string, _value: number = 1, _tags?: Record<string, string>): void {
    // Counter increment hook
  }
}

export function initTelemetry(serviceName: string): ITelemetryService {
  return new SentinelTelemetryService(serviceName);
}
