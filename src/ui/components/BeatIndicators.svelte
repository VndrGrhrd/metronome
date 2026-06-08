<script lang="ts">
  export let beats = 4;
  export let activeBeatIndex = 0;
  export let activeSubdivisionIndex = 0;
  export let accentFirstBeat = true;
  export let elapsedTime = '00:00';

  $: indicators = Array.from({ length: beats }, (_, index) => index);
</script>

<div class="flex flex-col items-center justify-center gap-6 sm:flex-row sm:items-start sm:gap-12">
  <div class="flex flex-col items-center gap-3">
    <div class="rounded bg-ink/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Beats
    </div>

    <div class="mt-2 flex items-center justify-center gap-3" aria-label="Beat indicators">
      {#each indicators as index}
        <span
          class={[
            'h-6 w-6 rounded-full transition-all duration-100',
            index === activeBeatIndex ? 'scale-125 bg-accent shadow-glow' : 'bg-slate-100/90',
            index === 0 && accentFirstBeat ? 'ring-2 ring-white/45 ring-offset-2 ring-offset-midnight' : ''
          ].join(' ')}
          aria-label={`Beat ${index + 1}${index === activeBeatIndex ? ' active' : ''}`}
        ></span>
      {/each}
    </div>

    <div class="h-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      {#if activeSubdivisionIndex > 0}
        Sub {activeSubdivisionIndex + 1}
      {/if}
    </div>
  </div>

  <div class="flex flex-col items-center gap-3" aria-live="polite">
    <div class="rounded bg-ink/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      Timer
    </div>

    <div class="font-mono text-4xl font-black leading-none tracking-[-0.04em] text-white sm:text-5xl">
      {elapsedTime}
    </div>
  </div>
</div>
