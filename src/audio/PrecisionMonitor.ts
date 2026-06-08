export type PrecisionSample = {
  scheduledTime: number;
  observedTime: number;
  driftMs: number;
};

export class PrecisionMonitor {
  private readonly samples: PrecisionSample[] = [];

  record(scheduledTime: number, observedTime: number): PrecisionSample {
    const sample = {
      scheduledTime,
      observedTime,
      driftMs: (observedTime - scheduledTime) * 1000
    };
    this.samples.push(sample);
    return sample;
  }

  reset(): void {
    this.samples.length = 0;
  }

  getSummary(): { count: number; averageDriftMs: number; maxAbsDriftMs: number } {
    if (this.samples.length === 0) {
      return {
        count: 0,
        averageDriftMs: 0,
        maxAbsDriftMs: 0
      };
    }

    const totalDrift = this.samples.reduce((total, sample) => total + sample.driftMs, 0);
    const maxAbsDriftMs = Math.max(...this.samples.map((sample) => Math.abs(sample.driftMs)));

    return {
      count: this.samples.length,
      averageDriftMs: totalDrift / this.samples.length,
      maxAbsDriftMs
    };
  }
}
