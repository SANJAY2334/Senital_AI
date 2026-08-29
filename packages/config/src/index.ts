export interface AppConfig {
  env: 'development' | 'staging' | 'production' | 'test';
  logLevel: string;
  servicePort: number;
  kafkaBrokers: string[];
  redisEndpoint: string;
  lakehouseEndpoint: string;
  otelEndpoint: string;
}

export type ConfigChangeListener<T> = (newConfig: T) => void;

export interface IConfigManager<T = AppConfig> {
  get<K extends keyof T>(key: K): T[K];
  getAll(): T;
  subscribe(listener: ConfigChangeListener<T>): () => void;
}

export class SentinelConfigManager implements IConfigManager<AppConfig> {
  private config: AppConfig;
  private listeners: Set<ConfigChangeListener<AppConfig>> = new Set();

  constructor(overrideConfig?: Partial<AppConfig>) {
    this.config = {
      env: (process.env.NODE_ENV as AppConfig['env']) || 'development',
      logLevel: process.env.LOG_LEVEL || 'info',
      servicePort: parseInt(process.env.PORT || '8080', 10),
      kafkaBrokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      redisEndpoint: process.env.REDIS_GRAPH_ENDPOINT || 'localhost:6379',
      lakehouseEndpoint: process.env.LAKEHOUSE_ENDPOINT || 'http://localhost:9000',
      otelEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4317',
      ...overrideConfig,
    };
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  subscribe(listener: ConfigChangeListener<AppConfig>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public updateConfig(newPartial: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newPartial };
    for (const listener of this.listeners) {
      listener(this.getAll());
    }
  }
}

export function loadConfig(overrideConfig?: Partial<AppConfig>): IConfigManager<AppConfig> {
  return new SentinelConfigManager(overrideConfig);
}
