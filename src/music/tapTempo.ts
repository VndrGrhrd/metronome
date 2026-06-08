import { normalizeBpm } from './tempo';

export class TapTempo {
  private intervals: number[] = [];
  private lastTap = 0;

  registerTap(now = performance.now()): number | null {
    if (this.lastTap > 0 && now - this.lastTap < 2500) {
      const interval = now - this.lastTap;

      if (interval >= 150) {
        this.intervals = [...this.intervals, interval].slice(-6);
      }
    } else {
      this.intervals = [];
    }

    this.lastTap = now;

    if (this.intervals.length === 0) {
      return null;
    }

    return normalizeBpm(60000 / this.getAverageInterval());
  }

  reset(): void {
    this.intervals = [];
    this.lastTap = 0;
  }

  private getAverageInterval(): number {
    return this.intervals.reduce((total, interval) => total + interval, 0) / this.intervals.length;
  }
}
