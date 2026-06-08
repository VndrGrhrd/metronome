# Professional Metronome

A precise, responsive, low-latency web metronome for musicians and students.

The app is built with Svelte, TypeScript, Tailwind CSS, Vite, Web Audio API, and PWA support. Its core engineering principle is that musical timing is driven by the audio clock, not by UI rendering.

## Features

- BPM control from `30` to `400`.
- Meter presets for `2/4`, `3/4`, `4/4`, `5/4`, `6/8`, plus custom meters.
- Quarter, eighth, sixteenth, and triplet subdivisions.
- Optional first beat accent.
- Digital click, woodblock, and electronic beep sounds.
- Volume and mute controls.
- Tap tempo.
- Keyboard shortcuts for transport, BPM changes, and tap tempo.
- Visual beat and subdivision indicators synchronized with scheduled audio events.
- Installable PWA with production offline assets.

## Tech Stack

- Svelte `5`
- TypeScript
- Vite `6`
- Tailwind CSS `3`
- Vitest
- Web Audio API
- `vite-plugin-pwa`

## Requirements

- Node.js
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quality Checks

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run TypeScript type checking:

```bash
npm exec tsc -- --noEmit
```

When changing timing, meter, BPM, tap tempo, or audio scheduling logic, run:

```bash
npm test
npm exec tsc -- --noEmit
npm run build
```

## Project Structure

```text
src/
  audio/      Web Audio facade, sound generation, scheduler, and precision monitoring
  music/      BPM, meter, subdivision, and tap tempo helpers
  state/      Svelte store for metronome view state and settings
  ui/         Presentational Svelte components
  tests/      Vitest coverage for timing, meter, tap tempo, and scheduling behavior
  workers/    Optional scheduler worker scaffold
```

Key files:

- `src/App.svelte`: app orchestration, UI handlers, audio engine integration, keyboard shortcuts, and visual sync.
- `src/audio/AudioEngine.ts`: public audio facade and playback controls.
- `src/audio/LookaheadScheduler.ts`: timing-critical scheduler based on `AudioContext.currentTime`.
- `src/audio/SoundFactory.ts`: click sound creation with Web Audio nodes.
- `src/state/metronomeStore.ts`: app view state and user settings.
- `vite.config.ts`: Svelte, Vitest, and PWA configuration.
- `docs/rebuild-spec.md`: complete rebuild specification and acceptance criteria.

## Audio Timing Notes

Musical timing must remain independent from UI rendering. Timers may wake the scheduler, but note times are scheduled against absolute `AudioContext.currentTime` values.

The current scheduler strategy wakes periodically, schedules notes ahead of playback, and advances musical position by subdivision duration. UI animation follows scheduled audio events and should not trigger sound directly.

## PWA

Production builds generate PWA assets through `vite-plugin-pwa`, including the web manifest and service worker files under `dist/`.
