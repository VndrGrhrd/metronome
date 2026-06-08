import { describe, expect, it } from 'vitest';
import { PrecisionMonitor } from '../audio/PrecisionMonitor';

describe('precision monitor', () => {
  it('records drift between scheduled and observed audio times', () => {
    const monitor = new PrecisionMonitor();

    monitor.record(1, 1.004);
    monitor.record(2, 1.997);

    const summary = monitor.getSummary();

    expect(summary.count).toBe(2);
    expect(summary.averageDriftMs).toBeCloseTo(0.5, 5);
    expect(summary.maxAbsDriftMs).toBeCloseTo(4, 5);
  });

  it('returns an empty summary before samples are recorded', () => {
    expect(new PrecisionMonitor().getSummary()).toEqual({
      count: 0,
      averageDriftMs: 0,
      maxAbsDriftMs: 0
    });
  });
});
