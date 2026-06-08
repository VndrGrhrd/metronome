import type { ScheduledNote, SoundType } from './types';

export class SoundFactory {
  constructor(
    private readonly audioContext: AudioContext,
    private readonly output: GainNode
  ) {}

  play(note: ScheduledNote, soundType: SoundType, accentEnabled: boolean): void {
    if (soundType === 'woodblock') {
      this.playWoodblock(note, accentEnabled);
      return;
    }

    if (soundType === 'electronicBeep') {
      this.playBeep(note, accentEnabled);
      return;
    }

    this.playDigitalClick(note, accentEnabled);
  }

  private playDigitalClick(note: ScheduledNote, accentEnabled: boolean): void {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const isAccent = accentEnabled && note.isDownbeat;
    const volume = note.isPrimaryBeat ? 0.95 : 0.34;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(isAccent ? 1500 : 980, note.time);
    gain.gain.setValueAtTime(0.0001, note.time);
    gain.gain.exponentialRampToValueAtTime(volume, note.time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, note.time + 0.045);

    oscillator.connect(gain).connect(this.output);
    oscillator.start(note.time);
    oscillator.stop(note.time + 0.05);
  }

  private playWoodblock(note: ScheduledNote, accentEnabled: boolean): void {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const isAccent = accentEnabled && note.isDownbeat;
    const volume = note.isPrimaryBeat ? 0.9 : 0.28;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(isAccent ? 740 : 520, note.time);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isAccent ? 1200 : 880, note.time);
    filter.Q.setValueAtTime(10, note.time);
    gain.gain.setValueAtTime(0.0001, note.time);
    gain.gain.exponentialRampToValueAtTime(volume, note.time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, note.time + 0.075);

    oscillator.connect(filter).connect(gain).connect(this.output);
    oscillator.start(note.time);
    oscillator.stop(note.time + 0.085);
  }

  private playBeep(note: ScheduledNote, accentEnabled: boolean): void {
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const isAccent = accentEnabled && note.isDownbeat;
    const volume = note.isPrimaryBeat ? 0.75 : 0.24;

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(isAccent ? 1320 : 880, note.time);
    gain.gain.setValueAtTime(0.0001, note.time);
    gain.gain.linearRampToValueAtTime(volume, note.time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, note.time + 0.065);

    oscillator.connect(gain).connect(this.output);
    oscillator.start(note.time);
    oscillator.stop(note.time + 0.075);
  }
}
