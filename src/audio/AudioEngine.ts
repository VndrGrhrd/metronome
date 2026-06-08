import { normalizeBpm } from '../music/tempo';
import { LookaheadScheduler } from './LookaheadScheduler';
import { SoundFactory } from './SoundFactory';
import type { BeatListener, Meter, MetronomeSettings, SoundType, Subdivision } from './types';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private soundFactory: SoundFactory | null = null;
  private scheduler: LookaheadScheduler | null = null;
  private settings: MetronomeSettings;
  private previousVolume: number;
  private readonly listeners = new Set<BeatListener>();

  constructor(settings: MetronomeSettings) {
    this.settings = { ...settings, bpm: normalizeBpm(settings.bpm) };
    this.previousVolume = settings.volume;
  }

  async start(): Promise<void> {
    await this.ensureAudioGraph();

    if (!this.audioContext || !this.scheduler) {
      return;
    }

    if (this.audioContext.state !== 'running') {
      await this.audioContext.resume();
    }

    this.scheduler.start();
  }

  stop(): void {
    this.scheduler?.stop();
  }

  setBpm(bpm: number): void {
    this.settings.bpm = normalizeBpm(bpm);
    this.scheduler?.updateSettings({ bpm: this.settings.bpm });
  }

  setMeter(meter: Meter): void {
    this.settings.meter = meter;
    this.scheduler?.updateSettings({ meter });
  }

  setSubdivision(subdivision: Subdivision): void {
    this.settings.subdivision = subdivision;
    this.scheduler?.updateSettings({ subdivision });
  }

  setAccentFirstBeat(accentFirstBeat: boolean): void {
    this.settings.accentFirstBeat = accentFirstBeat;
    this.scheduler?.updateSettings({ accentFirstBeat });
  }

  setSoundType(soundType: SoundType): void {
    this.settings.soundType = soundType;
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.min(Math.max(volume, 0), 1);

    if (!this.settings.muted) {
      this.previousVolume = this.settings.volume;
    }

    this.applyGain();
  }

  setMuted(muted: boolean): void {
    if (muted && !this.settings.muted) {
      this.previousVolume = this.settings.volume;
    }

    this.settings.muted = muted;

    if (!muted && this.settings.volume === 0) {
      this.settings.volume = this.previousVolume || 0.75;
    }

    this.applyGain();
  }

  addBeatListener(listener: BeatListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getCurrentTime(): number {
    return this.audioContext?.currentTime ?? 0;
  }

  getState(): AudioContextState | 'closed' {
    return this.audioContext?.state ?? 'closed';
  }

  private async ensureAudioGraph(): Promise<void> {
    if (this.audioContext && this.masterGain && this.soundFactory && this.scheduler) {
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass({ latencyHint: 'interactive' });
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.soundFactory = new SoundFactory(this.audioContext, this.masterGain);
    this.scheduler = new LookaheadScheduler(
      () => this.audioContext?.currentTime ?? 0,
      (note) => this.soundFactory?.play(note, this.settings.soundType, this.settings.accentFirstBeat),
      this.settings
    );
    this.scheduler.addBeatListener((note) => {
      this.listeners.forEach((listener) => listener(note));
    });
    this.applyGain();
  }

  private applyGain(): void {
    if (!this.masterGain || !this.audioContext) {
      return;
    }

    const gain = this.settings.muted ? 0 : this.settings.volume;
    this.masterGain.gain.setTargetAtTime(gain, this.audioContext.currentTime, 0.01);
  }
}
