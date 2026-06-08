export type SoundType = 'digitalClick' | 'woodblock' | 'electronicBeep';

export type Subdivision = 'quarter' | 'eighth' | 'sixteenth' | 'triplet';

export type MeterPreset = '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | 'custom';

export type Meter = {
  preset: MeterPreset;
  numerator: number;
  denominator: 2 | 4 | 8 | 16;
};

export type ScheduledNote = {
  time: number;
  beatIndex: number;
  subdivisionIndex: number;
  isDownbeat: boolean;
  isPrimaryBeat: boolean;
};

export type SchedulerSettings = {
  bpm: number;
  meter: Meter;
  subdivision: Subdivision;
  accentFirstBeat: boolean;
};

export type MetronomeSettings = SchedulerSettings & {
  volume: number;
  muted: boolean;
  soundType: SoundType;
};

export type BeatListener = (note: ScheduledNote) => void;
