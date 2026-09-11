import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';

export interface LogContext {
  correlationId?: string;
  tenantId?: string;
  traceId?: string;
  spanId?: string;
  serviceName?: string;
  [key: string]: unknown;
}

export interface ILogger {
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  child(context: LogContext): ILogger;
}

export class SentinelLogger implements ILogger {
  private pinoInstance: PinoLogger;

  constructor(serviceName: string, options?: LoggerOptions) {
    this.pinoInstance = pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level: (label) => ({ level: label }),
      },
      base: {
        serviceName,
        env: process.env.NODE_ENV || 'development',
      },
      timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
      ...options,
    });
  }

  private format(message: string, context?: LogContext) {
    return {
      msg: message,
      ...context,
    };
  }

  info(message: string, context?: LogContext): void {
    this.pinoInstance.info(this.format(message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.pinoInstance.warn(this.format(message, context));
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.pinoInstance.error({
      ...this.format(message, context),
      err: error ? { message: error.message, stack: error.stack, name: error.name } : undefined,
    });
  }

  debug(message: string, context?: LogContext): void {
    this.pinoInstance.debug(this.format(message, context));
  }

  child(context: LogContext): ILogger {
    const childPino = this.pinoInstance.child(context);
    const childLogger = new SentinelLogger(context.serviceName || 'child');
    (childLogger as unknown as { pinoInstance: PinoLogger }).pinoInstance = childPino;
    return childLogger;
  }
}

export function createLogger(serviceName: string): ILogger {
  return new SentinelLogger(serviceName);
}
