<script lang="ts">
  export let isPlaying = false;
  export let onToggle: () => void;
  export let onTapTempo: () => void;
</script>

<div class="flex flex-wrap items-center justify-center gap-4">
  <button
    class="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-white shadow-lg shadow-accent/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/70"
    type="button"
    aria-pressed={isPlaying}
    on:click={onToggle}
  >
    <span>{isPlaying ? 'Stop' : 'Start'}</span>
  </button>

  <button
    class="inline-flex min-w-32 items-center justify-center gap-2 rounded-lg bg-mint px-5 py-3 font-semibold text-white shadow-lg shadow-mint/20 transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white/70"
    type="button"
    on:click={onTapTempo}
  >
    <span>Tap BPM</span>
  </button>
</div>
