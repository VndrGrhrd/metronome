<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { AudioEngine } from './audio/AudioEngine';
  import type { Meter, ScheduledNote, SoundType, Subdivision } from './audio/types';
  import { TapTempo } from './music/tapTempo';
  import { normalizeBpm } from './music/tempo';
  import { initialSettings, metronomeStore } from './state/metronomeStore';
  import BeatIndicators from './ui/components/BeatIndicators.svelte';
  import BpmDisplay from './ui/components/BpmDisplay.svelte';
  import BpmSlider from './ui/components/BpmSlider.svelte';
  import SettingsPanel from './ui/components/SettingsPanel.svelte';
  import TransportControls from './ui/components/TransportControls.svelte';

  const audioEngine = new AudioEngine(initialSettings);
  const tapTempo = new TapTempo();
  const visualQueue: ScheduledNote[] = [];
  let animationFrame = 0;
  let elapsedSeconds = 0;
  let elapsedTimer: number | null = null;
  let playbackStartedAt = 0;
  let removeBeatListener: (() => void) | null = null;
  let removeVisibilityListener: (() => void) | null = null;
  $: elapsedTime = formatElapsedTime(elapsedSeconds);

  function updateBpm(bpm: number): void {
    const normalizedBpm = normalizeBpm(bpm);
    audioEngine.setBpm(normalizedBpm);
    metronomeStore.update((state) => ({ ...state, bpm: normalizedBpm }));
  }

  async function togglePlayback(): Promise<void> {
    if ($metronomeStore.isPlaying) {
      audioEngine.stop();
      resetElapsedTimer();
      metronomeStore.update((state) => ({
        ...state,
        isPlaying: false,
        audioState: audioEngine.getState(),
        activeBeatIndex: 0,
        activeSubdivisionIndex: 0
      }));
      visualQueue.length = 0;
      return;
    }

    await audioEngine.start();
    startElapsedTimer();
    metronomeStore.update((state) => ({
      ...state,
      isPlaying: true,
      audioState: audioEngine.getState()
    }));
  }

  function startElapsedTimer(): void {
    clearElapsedTimer();
    playbackStartedAt = Date.now();
    elapsedSeconds = 0;
    elapsedTimer = window.setInterval(updateElapsedTime, 1000);
  }

  function resetElapsedTimer(): void {
    clearElapsedTimer();
    playbackStartedAt = 0;
    elapsedSeconds = 0;
  }

  function clearElapsedTimer(): void {
    if (elapsedTimer === null) {
      return;
    }

    window.clearInterval(elapsedTimer);
    elapsedTimer = null;
  }

  function updateElapsedTime(): void {
    elapsedSeconds = Math.floor((Date.now() - playbackStartedAt) / 1000);
  }

  function formatElapsedTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  function handleTapTempo(): void {
    const bpm = tapTempo.registerTap();

    if (bpm) {
      updateBpm(bpm);
    }
  }

  function updateMeter(meter: Meter): void {
    audioEngine.setMeter(meter);
    metronomeStore.update((state) => ({
      ...state,
      meter,
      activeBeatIndex: Math.min(state.activeBeatIndex, meter.numerator - 1)
    }));
  }

  function updateSubdivision(subdivision: Subdivision): void {
    audioEngine.setSubdivision(subdivision);
    metronomeStore.update((state) => ({ ...state, subdivision }));
  }

  function updateSoundType(soundType: SoundType): void {
    audioEngine.setSoundType(soundType);
    metronomeStore.update((state) => ({ ...state, soundType }));
  }

  function updateVolume(volume: number): void {
    audioEngine.setVolume(volume);
    if (volume > 0) {
      audioEngine.setMuted(false);
    }
    metronomeStore.update((state) => ({ ...state, volume, muted: volume === 0 ? state.muted : false }));
  }

  function updateMuted(muted: boolean): void {
    audioEngine.setMuted(muted);
    metronomeStore.update((state) => ({ ...state, muted }));
  }

  function updateAccentFirstBeat(accentFirstBeat: boolean): void {
    audioEngine.setAccentFirstBeat(accentFirstBeat);
    metronomeStore.update((state) => ({ ...state, accentFirstBeat }));
  }

  function syncVisualBeat(): void {
    const currentTime = audioEngine.getCurrentTime();
    const noteIndex = visualQueue.findIndex((note) => note.time <= currentTime);

    if (noteIndex >= 0) {
      const note = visualQueue[noteIndex];
      visualQueue.splice(0, noteIndex + 1);
      metronomeStore.update((state) => ({
        ...state,
        activeBeatIndex: note.beatIndex,
        activeSubdivisionIndex: note.subdivisionIndex,
        lastScheduledNote: note
      }));
    }

    animationFrame = requestAnimationFrame(syncVisualBeat);
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
      return;
    }

    if (event.code === 'Space') {
      event.preventDefault();
      void togglePlayback();
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      updateBpm($metronomeStore.bpm + (event.shiftKey ? 5 : 1));
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      updateBpm($metronomeStore.bpm - (event.shiftKey ? 5 : 1));
    }

    if (event.key.toLowerCase() === 't') {
      handleTapTempo();
    }
  }

  onMount(() => {
    removeBeatListener = audioEngine.addBeatListener((note) => {
      visualQueue.push(note);
    });
    animationFrame = requestAnimationFrame(syncVisualBeat);
    window.addEventListener('keydown', handleKeydown);
    const handleVisibilityChange = () => {
      metronomeStore.update((state) => ({ ...state, audioState: audioEngine.getState() }));
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    removeVisibilityListener = () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  onDestroy(() => {
    audioEngine.stop();
    resetElapsedTimer();
    removeBeatListener?.();
    removeVisibilityListener?.();
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<main class="min-h-screen px-4 py-6 text-white sm:px-6 lg:px-8">
  <div class="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-center gap-8">
    <BpmDisplay bpm={$metronomeStore.bpm} onChange={updateBpm} />

    <BpmSlider bpm={$metronomeStore.bpm} onChange={updateBpm} />

    <BeatIndicators
      beats={$metronomeStore.meter.numerator}
      activeBeatIndex={$metronomeStore.activeBeatIndex}
      activeSubdivisionIndex={$metronomeStore.activeSubdivisionIndex}
      accentFirstBeat={$metronomeStore.accentFirstBeat}
      elapsedTime={elapsedTime}
    />

    <TransportControls
      isPlaying={$metronomeStore.isPlaying}
      onToggle={togglePlayback}
      onTapTempo={handleTapTempo}
    />

    <SettingsPanel
      meter={$metronomeStore.meter}
      subdivision={$metronomeStore.subdivision}
      soundType={$metronomeStore.soundType}
      volume={$metronomeStore.volume}
      muted={$metronomeStore.muted}
      accentFirstBeat={$metronomeStore.accentFirstBeat}
      onMeterChange={updateMeter}
      onSubdivisionChange={updateSubdivision}
      onSoundTypeChange={updateSoundType}
      onVolumeChange={updateVolume}
      onMutedChange={updateMuted}
      onAccentFirstBeatChange={updateAccentFirstBeat}
    />

    <p class="mx-auto max-w-2xl text-center text-sm leading-6 text-slate-300/65">
      Built by
      <a
        class="font-semibold text-slate-200 transition hover:text-white"
        href="https://github.com/VndrGrhrd/"
        target="_blank"
        rel="noreferrer"
      >
        VndrGrhrd
      </a>
      &bull; Powered by AI
    </p>
  </div>
</main>
