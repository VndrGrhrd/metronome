<script lang="ts">
  import { MAX_BPM, MIN_BPM } from '../../music/tempo';

  export let bpm = 120;
  export let onChange: (bpm: number) => void;

  const setBpm = (value: number) => onChange(value);
</script>

<div class="mx-auto w-full max-w-4xl">
  <div class="flex items-center gap-3 sm:gap-4">
    <button
      class="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-slate-300/80 text-2xl leading-none text-slate-200 transition hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
      type="button"
      aria-label="Decrease BPM"
      on:click={() => setBpm(bpm - 1)}
    >
      -
    </button>

    <input
      class="h-3 w-full cursor-pointer"
      type="range"
      min={MIN_BPM}
      max={MAX_BPM}
      step="1"
      value={bpm}
      aria-label="BPM slider"
      on:input={(event) => setBpm(Number(event.currentTarget.value))}
    />

    <button
      class="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-slate-300/80 text-2xl leading-none text-slate-200 transition hover:border-white hover:text-white focus:outline-none focus:ring-2 focus:ring-accent"
      type="button"
      aria-label="Increase BPM"
      on:click={() => setBpm(bpm + 1)}
    >
      +
    </button>
  </div>

  <label class="mx-auto mt-5 flex max-w-[10rem] items-center gap-3 rounded-2xl bg-ink/45 px-4 py-2 text-sm text-slate-300">
    <span class="font-semibold">BPM</span>
    <input
      class="w-full bg-transparent text-right text-white outline-none"
      type="number"
      min={MIN_BPM}
      max={MAX_BPM}
      value={bpm}
      aria-label="BPM numeric input"
      on:input={(event) => setBpm(Number(event.currentTarget.value))}
    />
  </label>
</div>
