// Seeded pseudo-random number generator (Mulberry32) for deterministic payload generation
export class SeededRandom {
  private state: number;

  constructor(seed: number = 1337) {
    this.state = seed >>> 0;
  }

  public nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(this.nextFloat() * (max - min + 1)) + min;
  }

  public pickOne<T>(items: T[]): T {
    return items[this.nextInt(0, items.length - 1)];
  }
}
