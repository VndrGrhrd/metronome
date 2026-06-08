<script lang="ts">
  import { getTempoLabel, MAX_BPM, MIN_BPM } from '../../music/tempo';

  export let bpm = 120;
  export let onChange: (bpm: number) => void;
</script>

<section class="text-center" aria-live="polite">
  <div class="mx-auto mb-4 inline-flex rounded bg-ink/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
    BPM
  </div>
  <input
    class="bpm-input mx-auto block w-full max-w-[16rem] bg-transparent px-2 text-center text-[7rem] font-black leading-none tracking-[-0.06em] text-white outline-none transition focus:text-accent sm:max-w-[22rem] sm:text-[9rem] md:max-w-[26rem] md:text-[10rem]"
    type="number"
    min={MIN_BPM}
    max={MAX_BPM}
    value={bpm}
    aria-label="BPM"
    on:input={(event) => onChange(Number(event.currentTarget.value))}
  />
  <div class="mt-3 text-lg font-medium text-slate-300/70">
    {getTempoLabel(bpm)}
  </div>
</section>

<style>
  .bpm-input {
    -moz-appearance: textfield;
  }

  .bpm-input::-webkit-inner-spin-button,
  .bpm-input::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
</style>
