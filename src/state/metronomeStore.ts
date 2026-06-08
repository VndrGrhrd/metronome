import { writable } from 'svelte/store';
import { createMeter } from '../music/meter';
import { normalizeBpm } from '../music/tempo';
import type { MetronomeSettings, ScheduledNote } from '../audio/types';

export type MetronomeViewState = MetronomeSettings & {
  isPlaying: boolean;
  activeBeatIndex: number;
  activeSubdivisionIndex: number;
  audioState: AudioContextState | 'closed';
  lastScheduledNote: ScheduledNote | null;
};

export const initialSettings: MetronomeSettings = {
  bpm: 120,
  meter: createMeter('4/4'),
  subdivision: 'quarter',
  accentFirstBeat: true,
  volume: 0.75,
  muted: false,
  soundType: 'digitalClick'
};

export const metronomeStore = writable<MetronomeViewState>({
  ...initialSettings,
  isPlaying: false,
  activeBeatIndex: 0,
  activeSubdivisionIndex: 0,
  audioState: 'closed',
  lastScheduledNote: null
});

export function setBpm(bpm: number): void {
  metronomeStore.update((state) => ({ ...state, bpm: normalizeBpm(bpm) }));
}
