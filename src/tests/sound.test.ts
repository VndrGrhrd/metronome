import { describe, expect, it } from 'vitest';
import { getEnvelopeRelease, RELEASE_INTERVAL_FRACTION } from '../audio/SoundFactory';
import { getSubdivisionDuration } from '../music/tempo';

describe('sound envelope release', () => {
  it('uses base release at slow BPM', () => {
    const subdivisionDuration = getSubdivisionDuration(120, 'sixteenth');

    expect(getEnvelopeRelease(0.02, 0.022, subdivisionDuration)).toEqual({
      decaySec: 0.02,
      stopSec: 0.022
    });
  });

  it('clamps release at high BPM so notes do not overlap', () => {
    const subdivisionDuration = getSubdivisionDuration(400, 'sixteenth');
    const maxStopSec = subdivisionDuration * RELEASE_INTERVAL_FRACTION;

    expect(getEnvelopeRelease(0.033, 0.037, subdivisionDuration).stopSec).toBeCloseTo(maxStopSec, 5);
    expect(getEnvelopeRelease(0.033, 0.037, subdivisionDuration).decaySec).toBeLessThan(maxStopSec);
  });
});
