import { describe, expect, it } from 'vitest';
import { TapTempo } from '../music/tapTempo';

describe('tap tempo', () => {
  it('returns null for the first tap', () => {
    const tapTempo = new TapTempo();
    expect(tapTempo.registerTap(1000)).toBeNull();
  });

  it('calculates BPM from tap intervals', () => {
    const tapTempo = new TapTempo();
    tapTempo.registerTap(1000);
    expect(tapTempo.registerTap(1500)).toBe(120);
    expect(tapTempo.registerTap(2000)).toBe(120);
  });

  it('resets stale tap sequences', () => {
    const tapTempo = new TapTempo();
    tapTempo.registerTap(1000);
    expect(tapTempo.registerTap(1500)).toBe(120);
    expect(tapTempo.registerTap(5000)).toBeNull();
  });
});
