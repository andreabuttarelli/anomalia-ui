<div align="center">

# @anomalia-so/ui

**A SvelteKit design system.** Apple and shadcn restraint, Material touch and motion,
and contrast that is measured rather than claimed.

[Documentation](https://ui.anomalia.so) · [Components](https://ui.anomalia.so/components/) ·
[Design tokens](https://ui.anomalia.so/foundations/) · [Accessibility](https://ui.anomalia.so/accessibility/)

[![CI](https://github.com/andreabuttarelli/anomalia-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/andreabuttarelli/anomalia-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](./LICENSE)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-black.svg)](https://svelte.dev)

</div>

---

43 components for SvelteKit 5 — buttons, forms, overlays, navigation, an app shell, marketing
chrome, charts and agent-chat parts — over a two-layer token system, with dark mode, Material
ripple and press interactions, and a build-time WCAG audit that fails the build on a contrast
regression.

Quiet at rest — near-monochrome, close to flat, tight radii, hairlines and surface steps carrying
structure instead of shadow and fill, with uppercase micro-labels for the technical register.
Expressive on contact — ripples from the touch point, state layers, emphasized easing, and gestures
that commit on distance *or* velocity.

- **Zero runtime dependencies.** Svelte 5 is the only peer.
- **No Tailwind requirement.** Every component ships scoped CSS over one token layer. A Tailwind
  bridge is available for apps that want the tokens as utilities.
- **Two layers of tokens.** Primitives → semantic. Components read only the semantic layer, so a
  rebrand is a handful of custom properties, never a specificity fight.
- **Touch-first.** 44px targets, safe-area insets, `pointercancel` handling, haptics, and iOS's
  16px-or-it-zooms input rule are all handled.
- **Contrast is enforced, not claimed.** An audit measures every token pair in both themes and fails
  the build on a regression. 72/72 pairs currently pass.
- **Charts on a validated palette.** The categorical set is checked for colour-vision separation
  with a runnable validator, not by eye.
- **An agent skill ships with it**, generated from the same catalogue the docs render — so an AI
  assistant cannot document an API that no longer exists.

```
anomalia-ui/
├── src/lib/            ← the published package (svelte-package → dist/)
│   ├── styles/         tokens.css · theme.css · base.css · tailwind.css
│   ├── components/     button · display · form · feedback · overlay · navigation
│   │                   layout · marketing · data · chat · motion · theme · a11y
│   ├── actions/        ripple · press · swipe · portal · focus-trap · scroll-lock · click-outside
│   ├── motion/         Material 3 duration + easing scales, and Svelte transitions built on them
│   ├── state/          theme · toasts · media queries
│   └── utils/          cn · id · events · haptics · position · color
├── src/routes/         ← the documentation site (prerendered, never published to npm)
├── src/docs/           ← the catalogue, live examples and the site's SEO layer
├── scripts/            ← the contrast audit and the skill-reference generator
└── skills/             ← the agent skill, generated from the catalogue
```

## Develop

```bash
npm install
npm run dev        # docs site on http://localhost:5273
npm run check      # svelte-check over library + docs, then the contrast audit
npm run build      # svelte-package → dist/, then publint
npm run build:docs # static docs site → build/
npm run audit:contrast -- --verbose   # every measured pair, both themes
```

## Install in an app

```bash
npm install @anomalia-so/ui
```

Svelte 5 is a peer dependency. There is nothing else to pull in — the package has no runtime
dependencies of its own.

Two alternatives, if the registry is not what you want:

**Straight from GitHub** — pins to a commit, so it is reproducible without a release:

```bash
npm install git+https://github.com/andreabuttarelli/anomalia-ui.git
```

**Git submodule or workspace** — when you want to develop the library and the app together:

```jsonc
// root package.json
{
  "workspaces": ["anomalia-ui"],
  "dependencies": { "@anomalia-so/ui": "*" }
}
```

Then build the library before the app: `npm run build -w @anomalia-so/ui && vite build`.

**Tarball** — no wiring, fully reproducible:

```bash
npm run build && npm pack   # → anomalia-so-ui-0.1.0.tgz
```

## Set up

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '@anomalia-so/ui/styles.css';
  import { ThemeProvider, Toaster } from '@anomalia-so/ui';

  let { children } = $props();
</script>

<ThemeProvider>
  {@render children()}
  <Toaster />
</ThemeProvider>
```

Add the anti-flash snippet to `src/app.html`, inside `<head>`. `ThemeProvider` runs after hydration —
one frame too late to be the only defence against a flash of the wrong theme:

```html
<script>
  (function () {
    try {
      var m = localStorage.getItem('an-theme') || 'system';
      var d = m === 'dark' || (m === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.dataset.theme = d ? 'dark' : 'light';
    } catch (e) {}
  })();
</script>
```

The same string is exported as `themeScript` if you would rather inject it from code.

### Typefaces

Two families, both named and neither bundled — shipping a font binary would fight whatever the host
app already loads. `--an-font-sans` asks for **Inter** (the Anomalia app already self-hosts it under
`/fonts`); `--an-font-mono` asks for **Geist Mono**, the voice of machine-authored fact: ids, paths,
timestamps, shortcuts, log lines. Both fall back to a system stack, and
`--an-font-mono-adjust` keeps the mono x-height on Inter's regardless of which font actually
resolves, so the pairing survives a missing webfont:

```css
:root {
  --an-font-sans: 'Geist', system-ui, sans-serif;
  --an-font-mono: 'Berkeley Mono', ui-monospace, monospace;
}
```

When to use which — and every canonical type pairing — is documented at `/typography` in the docs
site, and summarised for agents in `skills/anomalia-ui/SKILL.md`.

## Use

```svelte
<script lang="ts">
  import { Button, Card, TextField, toast } from '@anomalia-so/ui';

  let email = $state('');
</script>

<Card>
  <TextField label="Email" bind:value={email} placeholder="you@studio.com" />
  <Button onclick={() => toast.success({ title: 'Saved' })}>Save</Button>
</Card>
```

## Theming

Override the semantic layer — never component selectors:

```css
:root {
  --an-accent: #0a84ff;
  --an-accent-soft: #dceafd;
  --an-radius-md: 6px; /* squarer controls */
  --an-press-scale: 1; /* opt out of the press squish */
}
```

Dark mode follows the OS and is overridden by `data-theme="light" | "dark"` on `<html>` in either
direction, so an app's own toggle always wins without `!important`.

### Tailwind v4 (optional)

```css
@import 'tailwindcss';
@import '@anomalia-so/ui/styles.css';
@import '@anomalia-so/ui/tailwind.css';
```

That exposes `bg-an-surface`, `text-an-muted`, `rounded-an-lg`, `ease-an-emphasized`… pointing at the
live custom properties, so the utilities flip with dark mode instead of baking a hex at build time.

## Agent skill

`skills/anomalia-ui/` is a Claude Code skill that teaches an agent to build with
this system correctly — which component to reach for, which token, the type pairings,
the sans/mono rule, and the checks to run before calling a change done.

```bash
mkdir -p .claude/skills
ln -s ../../node_modules/@anomalia-so/ui/skills/anomalia-ui .claude/skills/anomalia-ui
```

Its two reference files are **generated** from `src/docs/catalog.ts` and the CSS
(`npm run skill:reference`), so the skill can never document a prop or a token that
no longer exists — a stale skill is worse than no skill, because the agent trusts it.

## Showcase

`/showcase/dashboard` and `/showcase/landing` in the docs site are full screens built only from
library components — the fastest way to judge the system as a whole rather than as a grid of demos.
`/typography` documents the ramp, every canonical pairing and the sans/mono rule; `/accessibility`
measures the contrast table live.

## Design decisions worth knowing

- **Colour is information.** Greys carry structure, the brand hue carries identity, status hues
  appear only when something has a state. Nothing is coloured for decoration.
- **Native controls stay native.** `Select` restyles a real `<select>` because the OS picker beats
  any custom listbox on a phone. Checkbox, radio and switch keep a real `<input>` behind them.
- **The state layer is one mechanism.** Hover, focus, press and drag are opacities of a single
  `currentColor` sheet, so a new variant inherits correct interaction states for free.
- **Gestures commit on distance *or* velocity.** A short fast flick dismisses a sheet; a long slow
  drag that stops halfway springs back. Distance alone is what makes web sheets feel dead.
- **Transitions stop during a drag.** While a finger is down, easing is disabled so the surface
  tracks it exactly, then restored for the release animation.
- **Motion is decoration.** `prefers-reduced-motion` collapses every transition, ripple and
  animation, and suppresses haptics.
- **Tooltips render nothing on touch.** Information must never live only in a tooltip.

## Accessibility

Two token decisions do most of the work, and both are visible in the names:

- **Ink is the interactive colour.** The brand violet sits at 2.2:1 on white — fine as a wash,
  unusable as a control fill, a focus ring or accent text. So `--an-accent` is ink (near-black on
  light, near-white on dark) and `--an-brand` is reserved for identity. Every fill, ring and pressed
  state therefore starts around 18:1 instead of fighting for 3:1.
- **Two kinds of line.** `--an-border` is the decorative hairline (cards, dividers, table rules),
  which SC 1.4.11 exempts. `--an-border-control` bounds real controls and clears 3:1. Reaching for
  the hairline on an input is the most common contrast failure in minimal systems; separate names
  are what stop it happening by accident.

Everything else that ships:

- `npm run audit:contrast` resolves `var()` chains and `color-mix()` from the CSS, measures 33 pairs
  in each theme against WCAG 2.2 thresholds, and exits non-zero on a failure. It runs inside
  `npm run check`.
- The colour maths is exported — `contrastRatio`, `contrastLevel`, `readTokenColor` — so an app that
  overrides tokens can assert its own palette. `readTokenColor` resolves a custom property through
  the engine, so what you measure is what is painted.
- Focus rings on `:focus-visible` only, from `--an-ring`, with an inner hairline so the ring stays
  visible on a fill that matches it.
- Overlays trap focus, lock scroll (reference-counted, iOS-safe) and restore focus on close.
  `Dialog` becomes an `alertdialog` when it is not dismissible.
- `Menu`, `Tabs`, `SegmentedControl`, `RadioGroup` and `Slider` implement their full ARIA keyboard
  patterns. Hints are wired to their control with `aria-describedby`, not just placed next to it.
- OS preferences are answered at the token layer: `prefers-reduced-motion`, `prefers-contrast: more`,
  `prefers-reduced-transparency`, and `forced-colors` (where fills are flattened, so selected and
  current states gain a `Highlight` outline and decorative ripples are hidden).
- `SkipLink`, `VisuallyHidden` and `announce()` cover the pieces a component library cannot infer.

The docs site has a live version of the contrast table at `/accessibility` — measured in the browser
from the theme currently painted, so toggling light/dark re-measures.

## Contributing

Issues and pull requests are welcome. Two things the CI will check for you:

- `npm run check` must pass — that is `svelte-check` **and** the contrast audit. A colour pair that
  stops clearing WCAG fails the build; that is deliberate, not a nuisance.
- `npm run skill:reference` must produce no diff. The agent skill's reference is generated from
  `src/docs/catalog.ts`, so a component whose API changed needs the reference regenerated and
  committed in the same PR.

If you are adding a component, it needs a catalogue entry, at least one live example under
`src/docs/examples/<slug>/`, and a comment at the top of the file explaining *why* it is built the
way it is. The comments are the point of this codebase as much as the code is.

## License

UNLICENSED — internal to Anomalia.
