# Professional Metronome

This is a professional web metronome built with Svelte, TypeScript, Tailwind CSS, Vite, Web Audio API, and PWA support.

The product goal is a precise, responsive, low-latency metronome for musicians and students. The most important engineering rule is to keep audio timing independent from UI rendering.

## Commands

- `npm run dev`: start the Vite development server.
- `npm run build`: create the production build and generate the PWA service worker.
- `npm run preview`: serve the production build locally.
- `npm test`: run the Vitest suite.
- `npm exec tsc -- --noEmit`: run TypeScript type checking.

## Documentation

- `docs/rebuild-spec.md`: complete rebuild specification for recreating the app from zero, including product scope, architecture, domain contracts, audio timing rules, UI behavior, PWA setup, tests, acceptance criteria, and recommended agent/skill prompts.

Use `docs/rebuild-spec.md` as the primary context when planning a full rewrite, onboarding a new agent, splitting rebuild work by specialty, or validating that a new implementation matches the current app behavior.

## Architecture

- `src/App.svelte`: application orchestration, UI event handlers, audio engine integration, keyboard shortcuts, and visual beat synchronization.
- `src/audio/AudioEngine.ts`: public audio facade. Owns `AudioContext`, master gain, sound selection, start/stop, mute, volume, and scheduler integration.
- `src/audio/LookaheadScheduler.ts`: timing-critical scheduler. Uses `AudioContext.currentTime` and pre-schedules notes ahead of playback.
- `src/audio/SoundFactory.ts`: creates click sounds with Web Audio nodes.
- `src/audio/PrecisionMonitor.ts`: records observed drift samples for diagnostics.
- `src/audio/types.ts`: shared audio and metronome types.
- `src/music/tempo.ts`: BPM normalization, beat duration, subdivision duration, and tempo labels.
- `src/music/meter.ts`: meter presets and custom meter helpers.
- `src/music/tapTempo.ts`: tap tempo interval averaging.
- `src/state/metronomeStore.ts`: Svelte store for view state and user settings.
- `src/ui/components/`: presentational Svelte components.
- `src/tests/`: unit tests for timing, meter, tap tempo, precision monitor, and scheduler behavior.
- `src/workers/scheduler.worker.ts`: optional worker timer scaffold; not currently wired into the engine.

## Audio Timing Rules

Do not use `setInterval`, `setTimeout`, or `requestAnimationFrame` as the source of musical timing.

The scheduler may use a timer only to wake up periodically. Actual note timing must be based on absolute `AudioContext.currentTime` values.

Current scheduler strategy:

- Wake every `25ms`.
- Schedule notes `100ms` into the future.
- Store note time as seconds in the audio context clock.
- Advance musical position using subdivision duration, not wall-clock callback timing.

UI animation must follow audio, not drive it. `App.svelte` keeps a `visualQueue` of scheduled notes and uses `requestAnimationFrame` only to update beat indicators when `audioEngine.getCurrentTime()` reaches each scheduled note.

## Coding Guidelines

- Keep all source code identifiers, filenames, classes, variables, and functions in English.
- Keep audio engine code framework-agnostic. Do not import Svelte stores or components into `src/audio`.
- Keep UI components presentational where possible. Route audio mutations through `AudioEngine` and update view state through `metronomeStore`.
- Prefer small pure helpers in `src/music` and `src/utils` for calculations.
- Do not add comments unless they clarify non-obvious timing or browser behavior.
- Avoid storing intermediate state unless it is read in more than one place or must persist between method calls.
- Preserve strict TypeScript types for musical concepts such as `Meter`, `Subdivision`, `SoundType`, and `ScheduledNote`.

## Feature Boundaries

BPM must remain clamped to `30..400`.

Supported subdivisions:

- `quarter`: 1 subdivision per beat.
- `eighth`: 2 subdivisions per beat.
- `sixteenth`: 4 subdivisions per beat.
- `triplet`: 3 subdivisions per beat.

Supported meters:

- `2/4`
- `3/4`
- `4/4`
- `5/4`
- `6/8`
- `custom`

The first beat accent is controlled by `accentFirstBeat` and should affect both sound and visual emphasis.

## Browser Audio Constraints

`AudioContext` must be created or resumed only after a user gesture. Do not start audio automatically on page load.

Expect browser-specific limitations:

- Background tabs may throttle JavaScript timers.
- Mobile browsers may suspend audio when the screen locks or the app is backgrounded.
- Safari and iOS have stricter audio policies.

Use `AudioContext.currentTime` and pre-scheduling to reduce timing issues, but do not claim guaranteed lock-screen playback across browsers.

## Testing Expectations

When changing timing, meter, BPM, tap tempo, or audio scheduling logic, run:

```bash
npm test
npm exec tsc -- --noEmit
npm run build
```

Add or update tests in `src/tests` for:

- BPM clamping.
- Beat and subdivision duration.
- Meter normalization.
- Downbeat detection.
- Tap tempo averaging and reset behavior.
- Scheduler note ordering and absolute scheduling.
- Drift measurement helpers.

Vitest is configured to run single-threaded because this environment can deny worker termination.

## PWA Notes

PWA support is configured in `vite.config.ts` with `vite-plugin-pwa`.

The production build generates:

- `dist/manifest.webmanifest`
- `dist/sw.js`
- `dist/registerSW.js`

Keep app icons in `public/icons` and static PWA assets in `public`.

## Development Priorities

1. Preserve accurate audio scheduling.
2. Keep UI responsive without coupling render timing to sound timing.
3. Keep mobile touch controls accessible and large enough.
4. Validate high-stress cases such as `400 BPM` with sixteenth subdivisions.
5. Keep the build small and dependency set conservative.

## Common Pitfalls

- Do not trigger click sounds from Svelte reactive statements.
- Do not rebuild `AudioContext` when only BPM, meter, subdivision, volume, or sound type changes.
- Do not make every scheduled note a global store update; this can create unnecessary re-render pressure.
- Do not rely on `Date.now()` for musical timing.
- Do not assume a sample can be replayed by reusing the same `AudioBufferSourceNode`; create a new source per playback.
