import { describe, expect, it, vi } from 'vitest';
import { createMeter } from '../music/meter';
import { LookaheadScheduler } from '../audio/LookaheadScheduler';
import type { ScheduledNote } from '../audio/types';

describe('lookahead scheduler', () => {
  it('pre-schedules notes using absolute audio time', () => {
    const originalWindow = globalThis.window;
    const setIntervalMock = vi.fn(() => 1);
    const clearIntervalMock = vi.fn();
    let currentTime = 0;
    const scheduledNotes: ScheduledNote[] = [];

    Object.defineProperty(globalThis, 'window', {
      value: {
        setInterval: setIntervalMock,
        clearInterval: clearIntervalMock
      },
      configurable: true
    });

    const scheduler = new LookaheadScheduler(
      () => currentTime,
      (note) => scheduledNotes.push(note),
      {
        bpm: 120,
        meter: createMeter('4/4'),
        subdivision: 'eighth',
        accentFirstBeat: true
      }
    );

    scheduler.start();
    expect(scheduledNotes).toHaveLength(1);
    expect(scheduledNotes[0]).toMatchObject({
      time: 0.05,
      beatIndex: 0,
      subdivisionIndex: 0,
      isDownbeat: true,
      isPrimaryBeat: true
    });

    currentTime = 0.3;
    scheduler['tick']();
    expect(scheduledNotes.map((note) => note.time)).toEqual([0.05, 0.3]);
    expect(scheduledNotes[1]).toMatchObject({
      beatIndex: 0,
      subdivisionIndex: 1,
      isDownbeat: false,
      isPrimaryBeat: false
    });

    scheduler.stop();
    expect(setIntervalMock).toHaveBeenCalledWith(expect.any(Function), 25);
    expect(clearIntervalMock).toHaveBeenCalledWith(1);

    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      configurable: true
    });
  });
});
