import type { ScheduledNote, SoundType } from './types';

export const RELEASE_INTERVAL_FRACTION = 0.6;

const SOUND_RELEASE = {
  digitalClick: { decay: 0.02, stop: 0.022 },
  woodblock: { decay: 0.033, stop: 0.037 },
  electronicBeep: { decay: 0.029, stop: 0.033 }
} as const;

export function getEnvelopeRelease(
  baseDecaySec: number,
  baseStopSec: number,
  subdivisionDurationSec: number
): { decaySec: number; stopSec: number } {
  const maxStopSec = subdivisionDurationSec * RELEASE_INTERVAL_FRACTION;
  const stopSec = Math.min(baseStopSec, maxStopSec);
  const decaySec = stopSec * (baseDecaySec / baseStopSec);

  return { decaySec, stopSec };
}

export class SoundFactory {
  constructor(
    private readonly audioContext: AudioContext,
    private readonly output: GainNode
  ) {}

  play(
    note: ScheduledNote,
    soundType: SoundType,
    accentEnabled: boolean,
    subdivisionDuration: number
  ): void {
    if (soundType === 'woodblock') {
      this.playWoodblock(note, accentEnabled, subdivisionDuration);
      return;
    }

    if (soundType === 'electronicBeep') {
      this.playBeep(note, accentEnabled, subdivisionDuration);
      return;
    }

    this.playDigitalClick(note, accentEnabled, subdivisionDuration);
  }

  private playDigitalClick(
    note: ScheduledNote,
    accentEnabled: boolean,
    subdivisionDuration: number
  ): void {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const isAccent = accentEnabled && note.isDownbeat;
    const volume = note.isPrimaryBeat ? 0.95 : 0.34;
    const release = getEnvelopeRelease(
      SOUND_RELEASE.digitalClick.decay,
      SOUND_RELEASE.digitalClick.stop,
      subdivisionDuration
    );

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(isAccent ? 1500 : 980, note.time);
    gain.gain.setValueAtTime(0.0001, note.time);
    gain.gain.exponentialRampToValueAtTime(volume, note.time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, note.time + release.decaySec);

    oscillator.connect(gain).connect(this.output);
    oscillator.start(note.time);
    oscillator.stop(note.time + release.stopSec);
  }

  private playWoodblock(
    note: ScheduledNote,
    accentEnabled: boolean,
    subdivisionDuration: number
  ): void {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const isAccent = accentEnabled && note.isDownbeat;
    const volume = note.isPrimaryBeat ? 0.9 : 0.28;
    const release = getEnvelopeRelease(
      SOUND_RELEASE.woodblock.decay,
      SOUND_RELEASE.woodblock.stop,
      subdivisionDuration
    );

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(isAccent ? 740 : 520, note.time);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isAccent ? 1200 : 880, note.time);
    filter.Q.setValueAtTime(10, note.time);
    gain.gain.setValueAtTime(0.0001, note.time);
    gain.gain.exponentialRampToValueAtTime(volume, note.time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, note.time + release.decaySec);

    oscillator.connect(filter).connect(gain).connect(this.output);
    oscillator.start(note.time);
    oscillator.stop(note.time + release.stopSec);
  }

  private playBeep(note: ScheduledNote, accentEnabled: boolean, subdivisionDuration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const isAccent = accentEnabled && note.isDownbeat;
    const volume = note.isPrimaryBeat ? 0.75 : 0.24;
    const release = getEnvelopeRelease(
      SOUND_RELEASE.electronicBeep.decay,
      SOUND_RELEASE.electronicBeep.stop,
      subdivisionDuration
    );

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(isAccent ? 1320 : 880, note.time);
    gain.gain.setValueAtTime(0.0001, note.time);
    gain.gain.linearRampToValueAtTime(volume, note.time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, note.time + release.decaySec);

    oscillator.connect(gain).connect(this.output);
    oscillator.start(note.time);
    oscillator.stop(note.time + release.stopSec);
  }
}
