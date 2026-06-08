import type { Subdivision } from '../audio/types';
import { clamp } from '../utils/clamp';

export const MIN_BPM = 30;
export const MAX_BPM = 400;

export function normalizeBpm(bpm: number): number {
  return Math.round(clamp(Number.isFinite(bpm) ? bpm : 120, MIN_BPM, MAX_BPM));
}

export function getBeatDuration(bpm: number): number {
  return 60 / normalizeBpm(bpm);
}

export function getSubdivisionsPerBeat(subdivision: Subdivision): number {
  if (subdivision === 'eighth') {
    return 2;
  }

  if (subdivision === 'sixteenth') {
    return 4;
  }

  if (subdivision === 'triplet') {
    return 3;
  }

  return 1;
}

export function getSubdivisionDuration(bpm: number, subdivision: Subdivision): number {
  return getBeatDuration(bpm) / getSubdivisionsPerBeat(subdivision);
}

export function getTempoLabel(bpm: number): string {
  const normalizedBpm = normalizeBpm(bpm);

  if (normalizedBpm < 40) {
    return 'Grave';
  }

  if (normalizedBpm < 60) {
    return 'Largo';
  }

  if (normalizedBpm < 76) {
    return 'Adagio';
  }

  if (normalizedBpm < 108) {
    return 'Andante';
  }

  if (normalizedBpm < 120) {
    return 'Moderato';
  }

  if (normalizedBpm < 168) {
    return 'Allegro';
  }

  if (normalizedBpm < 200) {
    return 'Presto';
  }

  return 'Prestissimo';
}
