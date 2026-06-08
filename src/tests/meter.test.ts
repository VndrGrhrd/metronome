import { describe, expect, it } from 'vitest';
import { createCustomMeter, createMeter, getMeterLabel, isDownbeat } from '../music/meter';

describe('meter helpers', () => {
  it('creates supported meter presets', () => {
    expect(createMeter('4/4')).toEqual({ preset: '4/4', numerator: 4, denominator: 4 });
    expect(createMeter('6/8')).toEqual({ preset: '6/8', numerator: 6, denominator: 8 });
  });

  it('normalizes custom meters', () => {
    expect(createCustomMeter(20, 3)).toEqual({ preset: 'custom', numerator: 16, denominator: 4 });
    expect(createCustomMeter(5, 8)).toEqual({ preset: 'custom', numerator: 5, denominator: 8 });
  });

  it('detects the first beat of the measure', () => {
    expect(isDownbeat(0)).toBe(true);
    expect(isDownbeat(1)).toBe(false);
  });

  it('formats meter labels', () => {
    expect(getMeterLabel({ preset: '5/4', numerator: 5, denominator: 4 })).toBe('5/4');
  });
});
