export interface GeneratorMetricsSnapshot {
  totalGenerated: number;
  byProvider: Record<string, number>;
  errors: number;
  elapsedSeconds: number;
  achievedEPS: number;
}

export class MetricsCounter {
  private totalGenerated = 0;
  private errors = 0;
  private byProvider: Record<string, number> = {
    AWS_CLOUDTRAIL: 0,
    CROWDSTRIKE_EDR: 0,
    OKTA_IAM: 0,
  };
  private startTime: number = Date.now();

  public increment(provider: string): void {
    this.totalGenerated++;
    this.byProvider[provider] = (this.byProvider[provider] || 0) + 1;
  }

  public incrementError(): void {
    this.errors++;
  }

  public getSnapshot(): GeneratorMetricsSnapshot {
    const elapsedSeconds = Math.max((Date.now() - this.startTime) / 1000, 0.001);
    const achievedEPS = Math.round(this.totalGenerated / elapsedSeconds);
    return {
      totalGenerated: this.totalGenerated,
      byProvider: { ...this.byProvider },
      errors: this.errors,
      elapsedSeconds: parseFloat(elapsedSeconds.toFixed(2)),
      achievedEPS,
    };
  }

  public reset(): void {
    this.totalGenerated = 0;
    this.errors = 0;
    this.byProvider = {
      AWS_CLOUDTRAIL: 0,
      CROWDSTRIKE_EDR: 0,
      OKTA_IAM: 0,
    };
    this.startTime = Date.now();
  }
}
