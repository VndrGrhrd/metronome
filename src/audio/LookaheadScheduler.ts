import { getSubdivisionDuration, getSubdivisionsPerBeat, normalizeBpm } from '../music/tempo';
import type { BeatListener, ScheduledNote, SchedulerSettings } from './types';

type ScheduleCallback = (note: ScheduledNote) => void;

export class LookaheadScheduler {
  private readonly lookaheadMs = 25;
  private readonly scheduleAheadTime = 0.1;
  private timerId: number | null = null;
  private nextNoteTime = 0;
  private beatIndex = 0;
  private subdivisionIndex = 0;
  private settings: SchedulerSettings;
  private readonly listeners = new Set<BeatListener>();

  constructor(
    private readonly getCurrentTime: () => number,
    private readonly scheduleNote: ScheduleCallback,
    settings: SchedulerSettings
  ) {
    this.settings = { ...settings, bpm: normalizeBpm(settings.bpm) };
  }

  start(): void {
    this.stop();
    this.nextNoteTime = this.getCurrentTime() + 0.05;
    this.beatIndex = 0;
    this.subdivisionIndex = 0;
    this.tick();
    this.timerId = window.setInterval(() => this.tick(), this.lookaheadMs);
  }

  stop(): void {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  updateSettings(settings: Partial<SchedulerSettings>): void {
    this.settings = {
      ...this.settings,
      ...settings,
      bpm: normalizeBpm(settings.bpm ?? this.settings.bpm)
    };
    this.beatIndex %= this.settings.meter.numerator;
    this.subdivisionIndex %= getSubdivisionsPerBeat(this.settings.subdivision);
  }

  addBeatListener(listener: BeatListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getDebugState(): { nextNoteTime: number; beatIndex: number; subdivisionIndex: number } {
    return {
      nextNoteTime: this.nextNoteTime,
      beatIndex: this.beatIndex,
      subdivisionIndex: this.subdivisionIndex
    };
  }

  private tick(): void {
    while (this.nextNoteTime < this.getCurrentTime() + this.scheduleAheadTime) {
      const note = this.createCurrentNote();
      this.scheduleNote(note);
      this.listeners.forEach((listener) => listener(note));
      this.advanceNote();
    }
  }

  private createCurrentNote(): ScheduledNote {
    return {
      time: this.nextNoteTime,
      beatIndex: this.beatIndex,
      subdivisionIndex: this.subdivisionIndex,
      isDownbeat: this.beatIndex === 0 && this.subdivisionIndex === 0,
      isPrimaryBeat: this.subdivisionIndex === 0
    };
  }

  private advanceNote(): void {
    this.nextNoteTime += getSubdivisionDuration(this.settings.bpm, this.settings.subdivision);
    this.subdivisionIndex += 1;

    if (this.subdivisionIndex >= getSubdivisionsPerBeat(this.settings.subdivision)) {
      this.subdivisionIndex = 0;
      this.beatIndex = (this.beatIndex + 1) % this.settings.meter.numerator;
    }
  }
}
