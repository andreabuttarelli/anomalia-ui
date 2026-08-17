#!/usr/bin/env node
/**
 * Contrast audit — CI gate for the token layer.
 *
 * Reads `tokens.css` and `theme.css`, builds the light and dark palettes exactly
 * as the cascade would (theme values layered over primitives, dark layered over
 * light), resolves every `var()` chain and `color-mix()`, and measures the pairs
 * that actually appear on screen.
 *
 * Exits non-zero on any failure, so a token change that quietly breaks contrast
 * cannot land. Run with `--verbose` to print passing rows too.
 *
 * Thresholds are WCAG 2.2:
 *   • 4.5:1 body text (SC 1.4.3)
 *   • 3:1   large text ≥24px / ≥18.66px bold
 *   • 3:1   UI component boundaries, states and focus indicators (SC 1.4.11)
 * Decorative separators are exempt and are listed as `info` rather than checked.
 */

import { contrastRatio } from '../src/lib/utils/color.ts';
import { palettes, resolveToken, darkParityDrift } from './lib/css-tokens.mjs';

const verbose = process.argv.includes('--verbose');

const all = palettes();
const { light, dark } = all;

function color(token, palette) {
  const raw = palette[token];
  if (raw === undefined) throw new Error(`Unknown token: ${token}`);
  return resolveToken(raw, palette);
}

/**
 * The pairs that matter. `on` is the backdrop the pair is measured against —
 * translucent tokens (dark-mode soft fills, scrims) are flattened over it.
 */
const CHECKS = [
  // ── Body text ────────────────────────────────────────────────────────────
  { fg: '--an-text', bg: '--an-bg', min: 4.5, label: 'Text on canvas' },
  { fg: '--an-text', bg: '--an-surface', min: 4.5, label: 'Text on surface' },
  { fg: '--an-text', bg: '--an-surface-raised', min: 4.5, label: 'Text on raised' },
  { fg: '--an-text', bg: '--an-surface-sunken', min: 4.5, label: 'Text on sunken' },
  { fg: '--an-text', bg: '--an-surface-hover', min: 4.5, label: 'Text on hover' },
  { fg: '--an-text-muted', bg: '--an-surface', min: 4.5, label: 'Muted on surface' },
  { fg: '--an-text-muted', bg: '--an-surface-sunken', min: 4.5, label: 'Muted on sunken' },

  /* The navigation rail is its own surface, so every label that lives on it
     needs checking against it and not against the content surface. */
  { fg: '--an-text', bg: '--an-surface-rail', min: 4.5, label: 'Text on the nav rail' },
  { fg: '--an-text-muted', bg: '--an-surface-rail', min: 4.5, label: 'Muted on the nav rail' },
  { fg: '--an-text-faint', bg: '--an-surface-rail', min: 4.5, label: 'Section labels on the nav rail' },
  { fg: '--an-text-faint', bg: '--an-surface', min: 4.5, label: 'Faint (captions, placeholders) on surface' },
  { fg: '--an-text-inverse', bg: '--an-surface-inverse', min: 4.5, label: 'Inverse text on inverse surface' },

  // ── Accent ───────────────────────────────────────────────────────────────
  { fg: '--an-on-accent', bg: '--an-accent', min: 4.5, label: 'Label on accent fill (primary button)' },
  { fg: '--an-on-accent-emphasis', bg: '--an-accent-emphasis', min: 4.5, label: 'Label on emphasis fill' },
  { fg: '--an-accent-text', bg: '--an-surface', min: 4.5, label: 'Accent text on surface' },
  { fg: '--an-accent-soft-text', bg: '--an-accent-soft', min: 4.5, label: 'Text on soft accent (chips, nav)', backdrop: '--an-surface' },

  // ── Status ───────────────────────────────────────────────────────────────
  { fg: '--an-on-status', bg: '--an-success', min: 4.5, label: 'Label on success fill' },
  { fg: '--an-on-status', bg: '--an-warning', min: 4.5, label: 'Label on warning fill' },
  { fg: '--an-on-status', bg: '--an-danger', min: 4.5, label: 'Label on danger fill' },
  { fg: '--an-on-status', bg: '--an-info', min: 4.5, label: 'Label on info fill' },
  { fg: '--an-success', bg: '--an-surface', min: 4.5, label: 'Success text on surface' },
  { fg: '--an-warning', bg: '--an-surface', min: 4.5, label: 'Warning text on surface' },
  { fg: '--an-danger', bg: '--an-surface', min: 4.5, label: 'Danger text on surface' },
  { fg: '--an-info', bg: '--an-surface', min: 4.5, label: 'Info text on surface' },
  { fg: '--an-success', bg: '--an-success-soft', min: 4.5, label: 'Success on soft success', backdrop: '--an-surface' },
  { fg: '--an-warning', bg: '--an-warning-soft', min: 4.5, label: 'Warning on soft warning', backdrop: '--an-surface' },
  { fg: '--an-danger', bg: '--an-danger-soft', min: 4.5, label: 'Danger on soft danger', backdrop: '--an-surface' },
  { fg: '--an-info', bg: '--an-info-soft', min: 4.5, label: 'Info on soft info', backdrop: '--an-surface' },

  // ── UI components & states — SC 1.4.11, 3:1 ──────────────────────────────
  { fg: '--an-ring', bg: '--an-bg', min: 3, label: 'Focus ring on canvas', nonText: true },
  { fg: '--an-ring', bg: '--an-surface', min: 3, label: 'Focus ring on surface', nonText: true },
  { fg: '--an-border-control', bg: '--an-surface', min: 3, label: 'Control border on surface', nonText: true },
  { fg: '--an-border-control', bg: '--an-bg', min: 3, label: 'Control border on canvas', nonText: true },
  { fg: '--an-accent-emphasis', bg: '--an-surface', min: 3, label: 'Checked control fill on surface', nonText: true },
  { fg: '--an-accent-emphasis', bg: '--an-bg', min: 3, label: 'Checked control fill on canvas', nonText: true },
  { fg: '--an-accent-emphasis', bg: '--an-surface-sunken', min: 3, label: 'Slider/progress fill on its track', nonText: true },
  { fg: '--an-danger', bg: '--an-surface', min: 3, label: 'Invalid field border on surface', nonText: true }
];

/** Documented as exempt rather than silently skipped. */
const EXEMPT = [
  ['--an-border', 'Decorative hairline (cards, dividers, table rules) — SC 1.4.11 exempts purely decorative separators.'],
  ['--an-surface-glass', 'Translucent chrome; the content on it is measured against the opaque fallback surface.']
];

function run(name, palette) {
  const rows = [];
  let failures = 0;

  for (const check of CHECKS) {
    const fg = color(check.fg, palette);
    const bg = color(check.bg, palette);
    const backdrop = check.backdrop ? color(check.backdrop, palette) : color('--an-bg', palette);

    const ratio = contrastRatio(fg, bg, backdrop);
    const pass = ratio >= check.min;
    if (!pass) failures += 1;

    rows.push({
      pass,
      ratio,
      min: check.min,
      label: check.label,
      pair: `${check.fg} on ${check.bg}`
    });
  }

  console.log(`\n${name.toUpperCase()}`);
  console.log('─'.repeat(78));

  for (const row of rows) {
    if (row.pass && !verbose) continue;
    const mark = row.pass ? '✓' : '✗';
    console.log(
      `${mark} ${row.ratio.toFixed(2).padStart(5)}:1  (min ${row.min})  ${row.label}\n` +
        `            ${row.pair}`
    );
  }

  if (failures === 0) console.log(`✓ all ${rows.length} pairs pass`);
  return failures;
}

let total = run('light', light) + run('dark', dark);

/* Dark is declared twice — once for the explicit toggle, once for the system
   preference — and only the first is what the pairs above were measured
   against. If the two drift, everyone on the default "system" setting is
   looking at a palette nothing has ever checked. */
const drift = darkParityDrift(all);

console.log('\nDARK PALETTE PARITY');
console.log('─'.repeat(78));
if (drift.length === 0) {
  console.log("✓ [data-theme='dark'] and the prefers-color-scheme block agree");
} else {
  for (const { name, explicit, system } of drift) {
    console.log(`✗ ${name}\n            toggle: ${explicit ?? '(missing)'}\n            system: ${system ?? '(missing)'}`);
  }
  total += drift.length;
}

console.log('\nEXEMPT BY DESIGN');
console.log('─'.repeat(78));
for (const [token, why] of EXEMPT) console.log(`· ${token} — ${why}`);

if (total > 0) {
  console.error(`\n${total} failure(s). Fix the tokens or justify the exemption.`);
  process.exit(1);
}

console.log('\nContrast audit passed.');
