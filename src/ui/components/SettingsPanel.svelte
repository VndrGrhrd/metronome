<script lang="ts">
  import type { Meter, MeterPreset, SoundType, Subdivision } from '../../audio/types';
  import { createCustomMeter, createMeter, METER_PRESETS } from '../../music/meter';

  export let meter: Meter;
  export let subdivision: Subdivision;
  export let soundType: SoundType;
  export let volume = 0.75;
  export let muted = false;
  export let accentFirstBeat = true;
  export let onMeterChange: (meter: Meter) => void;
  export let onSubdivisionChange: (subdivision: Subdivision) => void;
  export let onSoundTypeChange: (soundType: SoundType) => void;
  export let onVolumeChange: (volume: number) => void;
  export let onMutedChange: (muted: boolean) => void;
  export let onAccentFirstBeatChange: (accentFirstBeat: boolean) => void;

  const denominators = [2, 4, 8, 16];

  function handleMeterPreset(value: string): void {
    if (value === 'custom') {
      onMeterChange({ ...meter, preset: 'custom' });
      return;
    }

    onMeterChange(createMeter(value as MeterPreset));
  }
</script>

<section class="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-ink/35 p-5 shadow-2xl shadow-black/10 backdrop-blur">
  <div class="grid gap-5 md:grid-cols-2">
    <label class="space-y-2 text-sm font-semibold text-slate-300">
      <span>Meter</span>
      <select
        class="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent"
        value={meter.preset}
        on:change={(event) => handleMeterPreset(event.currentTarget.value)}
      >
        {#each METER_PRESETS as preset}
          <option value={preset.preset}>{preset.numerator}/{preset.denominator}</option>
        {/each}
        <option value="custom">Custom</option>
      </select>
    </label>

    <label class="space-y-2 text-sm font-semibold text-slate-300">
      <span>Subdivision</span>
      <select
        class="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent"
        value={subdivision}
        on:change={(event) => onSubdivisionChange(event.currentTarget.value as Subdivision)}
      >
        <option value="quarter">Seminima</option>
        <option value="eighth">Colcheia</option>
        <option value="sixteenth">Semi-colcheia</option>
        <option value="triplet">Tercina</option>
      </select>
    </label>

    {#if meter.preset === 'custom'}
      <label class="space-y-2 text-sm font-semibold text-slate-300">
        <span>Beats</span>
        <input
          class="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent"
          type="number"
          min="1"
          max="16"
          value={meter.numerator}
          on:input={(event) => onMeterChange(createCustomMeter(Number(event.currentTarget.value), meter.denominator))}
        />
      </label>

      <label class="space-y-2 text-sm font-semibold text-slate-300">
        <span>Denominator</span>
        <select
          class="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent"
          value={meter.denominator}
          on:change={(event) => onMeterChange(createCustomMeter(meter.numerator, Number(event.currentTarget.value)))}
        >
          {#each denominators as denominator}
            <option value={denominator}>{denominator}</option>
          {/each}
        </select>
      </label>
    {/if}

    <label class="space-y-2 text-sm font-semibold text-slate-300">
      <span>Sound</span>
      <select
        class="w-full rounded-xl border border-white/10 bg-panel px-4 py-3 text-white outline-none focus:ring-2 focus:ring-accent"
        value={soundType}
        on:change={(event) => onSoundTypeChange(event.currentTarget.value as SoundType)}
      >
        <option value="digitalClick">Digital click</option>
        <option value="woodblock">Woodblock</option>
        <option value="electronicBeep">Electronic beep</option>
      </select>
    </label>

    <label class="space-y-2 text-sm font-semibold text-slate-300">
      <span>Volume</span>
      <input
        class="h-11 w-full"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        on:input={(event) => onVolumeChange(Number(event.currentTarget.value))}
      />
    </label>
  </div>

  <div class="mt-5 flex flex-wrap gap-3">
    <label class="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-panel px-4 py-3 text-sm font-semibold text-slate-200">
      <input
        type="checkbox"
        checked={muted}
        on:change={(event) => onMutedChange(event.currentTarget.checked)}
      />
      <span>Mute sound</span>
    </label>

    <label class="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-panel px-4 py-3 text-sm font-semibold text-slate-200">
      <input
        type="checkbox"
        checked={accentFirstBeat}
        on:change={(event) => onAccentFirstBeatChange(event.currentTarget.checked)}
      />
      <span>Accent first beat</span>
    </label>
  </div>
</section>
