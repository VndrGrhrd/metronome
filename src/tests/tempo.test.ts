import { describe, expect, it } from 'vitest';
import { getBeatDuration, getSubdivisionDuration, getSubdivisionsPerBeat, normalizeBpm } from '../music/tempo';

describe('tempo calculations', () => {
  it('clamps BPM to the supported professional range', () => {
    expect(normalizeBpm(12)).toBe(30);
    expect(normalizeBpm(120)).toBe(120);
    expect(normalizeBpm(999)).toBe(400);
  });

  it('calculates beat duration from BPM', () => {
    expect(getBeatDuration(120)).toBe(0.5);
    expect(getBeatDuration(60)).toBe(1);
  });

  it('calculates rhythmic subdivisions', () => {
    expect(getSubdivisionsPerBeat('quarter')).toBe(1);
    expect(getSubdivisionsPerBeat('eighth')).toBe(2);
    expect(getSubdivisionsPerBeat('sixteenth')).toBe(4);
    expect(getSubdivisionsPerBeat('triplet')).toBe(3);
  });

  it('keeps high BPM sixteenth-note intervals measurable', () => {
    expect(getSubdivisionDuration(400, 'sixteenth')).toBeCloseTo(0.0375, 5);
  });
});
