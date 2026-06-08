import type { Meter, MeterPreset } from '../audio/types';
import { clamp } from '../utils/clamp';

export const METER_PRESETS: Meter[] = [
  { preset: '2/4', numerator: 2, denominator: 4 },
  { preset: '3/4', numerator: 3, denominator: 4 },
  { preset: '4/4', numerator: 4, denominator: 4 },
  { preset: '5/4', numerator: 5, denominator: 4 },
  { preset: '6/8', numerator: 6, denominator: 8 }
];

export function createMeter(preset: MeterPreset): Meter {
  return METER_PRESETS.find((meter) => meter.preset === preset) ?? {
    preset: 'custom',
    numerator: 4,
    denominator: 4
  };
}

export function createCustomMeter(numerator: number, denominator: number): Meter {
  return {
    preset: 'custom',
    numerator: Math.round(clamp(numerator, 1, 16)),
    denominator: normalizeDenominator(denominator)
  };
}

export function normalizeDenominator(denominator: number): 2 | 4 | 8 | 16 {
  if (denominator === 2 || denominator === 4 || denominator === 8 || denominator === 16) {
    return denominator;
  }

  return 4;
}

export function isDownbeat(beatIndex: number): boolean {
  return beatIndex === 0;
}

export function getMeterLabel(meter: Meter): string {
  return `${meter.numerator}/${meter.denominator}`;
}
