<!--
  Accessibility page.

  The contrast table is measured live, in the browser, from the tokens that are
  actually painted: each value is resolved by handing it to the engine as a
  `color` and reading it back, so `var()` chains and `color-mix()` are resolved
  exactly as they will be at runtime. Toggle the theme and the numbers change,
  because they are not a screenshot of a spreadsheet — they are the real thing.

  `scripts/contrast-audit.mjs` runs the same checks headlessly against both
  themes and fails `npm run check` on a regression.
-->
<script lang="ts">
  import Seo from '../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Card, Text, Badge, Divider, contrastRatio, contrastLevel, readTokenColor, theme } from '$lib/index.js';
  import CodeBlock from '../../docs/components/CodeBlock.svelte';

  interface Pair {
    fg: string;
    bg: string;
    label: string;
    min: number;
    nonText?: boolean;
  }

  const GROUPS: { title: string; note: string; pairs: Pair[] }[] = [
    {
      title: 'Text',
      note: 'SC 1.4.3 — 4.5:1 for body copy. Captions and placeholders count as text and are held to the same bar.',
      pairs: [
        { fg: '--an-text', bg: '--an-bg', label: 'Body on canvas', min: 4.5 },
        { fg: '--an-text', bg: '--an-surface-sunken', label: 'Body on sunken surface', min: 4.5 },
        { fg: '--an-text-muted', bg: '--an-surface', label: 'Muted on surface', min: 4.5 },
        { fg: '--an-text-faint', bg: '--an-surface', label: 'Faint — captions, placeholders', min: 4.5 },
        { fg: '--an-text-inverse', bg: '--an-surface-inverse', label: 'Inverse on inverse surface', min: 4.5 }
      ]
    },
    {
      title: 'Interactive',
      note: 'The interactive colour is ink, not a hue, which is why these clear AA with room to spare.',
      pairs: [
        { fg: '--an-on-accent', bg: '--an-accent', label: 'Primary button label', min: 4.5 },
        { fg: '--an-accent-text', bg: '--an-surface', label: 'Accent text on surface', min: 4.5 },
        { fg: '--an-accent-soft-text', bg: '--an-accent-soft', label: 'Selected chip / nav label', min: 4.5 }
      ]
    },
    {
      title: 'Status',
      note: 'Each hue is dark enough to work both as text on paper and as a fill under white text.',
      pairs: [
        { fg: '--an-on-status', bg: '--an-success', label: 'Label on success fill', min: 4.5 },
        { fg: '--an-on-status', bg: '--an-warning', label: 'Label on warning fill', min: 4.5 },
        { fg: '--an-on-status', bg: '--an-danger', label: 'Label on danger fill', min: 4.5 },
        { fg: '--an-success', bg: '--an-success-soft', label: 'Success on its soft fill', min: 4.5 },
        { fg: '--an-warning', bg: '--an-warning-soft', label: 'Warning on its soft fill', min: 4.5 },
        { fg: '--an-danger', bg: '--an-danger-soft', label: 'Danger on its soft fill', min: 4.5 }
      ]
    },
    {
      title: 'Components & states',
      note: 'SC 1.4.11 — 3:1 for anything that identifies a control, its boundary, its state, or focus.',
      pairs: [
        { fg: '--an-ring', bg: '--an-surface', label: 'Focus ring on surface', min: 3, nonText: true },
        { fg: '--an-border-control', bg: '--an-surface', label: 'Input border on surface', min: 3, nonText: true },
        { fg: '--an-accent-emphasis', bg: '--an-surface', label: 'Checked box / switch fill', min: 3, nonText: true },
        { fg: '--an-accent-emphasis', bg: '--an-surface-sunken', label: 'Slider fill on its track', min: 3, nonText: true },
        { fg: '--an-danger', bg: '--an-surface', label: 'Invalid field border', min: 3, nonText: true }
      ]
    }
  ];

  interface Measured extends Pair {
    ratio: number;
    level: string;
    fgColor: string;
    bgColor: string;
  }

  let measured = $state<{ title: string; note: string; rows: Measured[] }[]>([]);

  // Re-measure whenever the painted theme changes.
  $effect(() => {
    void theme.resolved;

    measured = GROUPS.map((group) => ({
      title: group.title,
      note: group.note,
      rows: group.pairs.map((pair) => {
        const fgColor = readTokenColor(pair.fg) ?? '#000';
        const bgColor = readTokenColor(pair.bg) ?? '#fff';
        const canvas = readTokenColor('--an-bg') ?? '#fff';
        const ratio = contrastRatio(fgColor, bgColor, canvas);

        return {
          ...pair,
          ratio,
          level: contrastLevel(ratio, { nonText: pair.nonText }),
          fgColor,
          bgColor
        };
      })
    }));
  });

  const failing = $derived(
    measured.flatMap((group) => group.rows).filter((row) => row.ratio < row.min).length
  );

  const usage = `import { contrastRatio, contrastLevel, readTokenColor } from '@anomalia-so/ui';

// Check a brand override before shipping it
const ratio = contrastRatio('#c485fe', '#ffffff');
contrastLevel(ratio);            // 'fail' — 2.2:1

// Or measure what is actually painted right now
contrastRatio(readTokenColor('--an-text')!, readTokenColor('--an-surface')!);`;

  const keyboard = [
    ['Tab / Shift+Tab', 'Moves between controls. Overlays trap it while open and hand it back on close.'],
    ['Enter / Space', 'Activates buttons, rows and chips. Space is also the ripple trigger for keyboard users.'],
    ['Escape', 'Closes dialogs, sheets, popovers and menus — unless the dialog is a non-dismissible confirmation.'],
    ['Arrows', 'Move within a composite: Menu items, Tabs, SegmentedControl, RadioGroup, Slider.'],
    ['Home / End', 'First and last item in Menu and Tabs; min and max on Slider.'],
    ['PageUp / PageDown', 'Slider, in 10% steps.'],
    ['Type-ahead', 'Menu jumps to the next item starting with the typed character.']
  ];
</script>

<Seo
  title="Accessibility"
  description="How this design system meets WCAG 2.2: a build-time contrast audit that fails the build, focus rings that clear 3:1 on every surface, target sizes, reduced motion, forced colours and reduced transparency."
  pathname={$page.url.pathname}
/>

<div class="doc-page">
  <p class="doc-page__eyebrow">Foundations</p>
  <h1 class="doc-page__title">Accessibility</h1>
  <p class="doc-page__lead">
    Contrast is a property of the token layer, not of individual components, so it is enforced there:
    every pair below is measured live from the values currently painted, and the same checks run
    headlessly against both themes in <code>npm run check</code>. A token change that breaks a ratio
    fails the build.
  </p>

  <section class="doc-section">
    <div class="status" data-ok={failing === 0 ? '' : undefined}>
      <Badge tone={failing === 0 ? 'success' : 'danger'} variant="solid" dot>
        {failing === 0 ? 'All pairs pass' : `${failing} failing`}
      </Badge>
      <Text variant="footnote" tone="muted">
        Measured in the <strong>{theme.resolved}</strong> theme, in this browser. Switch the theme in
        the top bar and the numbers re-measure.
      </Text>
    </div>
  </section>

  {#each measured as group (group.title)}
    <section class="doc-section">
      <h2 class="doc-section__title">{group.title}</h2>
      <p class="hint">{group.note}</p>

      <div class="matrix">
        {#each group.rows as row (row.label)}
          <div class="row" data-fail={row.ratio < row.min ? '' : undefined}>
            <span
              class="chip"
              style={`background:${row.bgColor}; color:${row.fgColor}`}
              aria-hidden="true">Aa</span
            >

            <span class="row__text">
              <span class="row__label">{row.label}</span>
              <code class="row__tokens">{row.fg} on {row.bg}</code>
            </span>

            <span class="row__ratio">{row.ratio.toFixed(2)}:1</span>
            <Badge tone={row.ratio < row.min ? 'danger' : 'success'} variant="soft">
              {row.ratio < row.min ? 'fail' : row.level}
            </Badge>
          </div>
        {/each}
      </div>
    </section>
  {/each}

  <section class="doc-section">
    <h2 class="doc-section__title">Two decisions that do most of the work</h2>
    <div class="pair-grid">
      <Card variant="filled">
        <Text variant="headline" as="h3">Ink is the interactive colour</Text>
        <Text variant="footnote" tone="muted" class="pair-body">
          The brand violet sits at 2.2:1 on white — fine as a wash, unusable as a control fill, a
          focus ring or accent text. So the system's interactive colour is ink (near-black on light,
          near-white on dark) and the brand hue is reserved for moments that are about identity
          rather than state. Every fill, ring and pressed state therefore starts around 18:1 instead
          of fighting for 3:1.
        </Text>
      </Card>

      <Card variant="filled">
        <Text variant="headline" as="h3">Two kinds of line</Text>
        <Text variant="footnote" tone="muted" class="pair-body">
          <code>--an-border</code> is the decorative hairline on cards, dividers and table rules,
          which SC 1.4.11 exempts. <code>--an-border-control</code> bounds real controls — inputs,
          selects, switch tracks — and is dark enough to clear 3:1. Reaching for the hairline on an
          input is the most common contrast failure in minimal systems; keeping the two names apart
          is what stops it happening by accident.
        </Text>
      </Card>
    </div>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Check your own overrides</h2>
    <p class="hint">
      The colour maths is exported, so a consumer changing tokens can verify the result instead of
      guessing — and can wire the same assertion into their own tests.
    </p>
    <CodeBlock code={usage} language="ts" />
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Keyboard</h2>
    <div class="props__scroll">
      <table>
        <thead>
          <tr><th>Key</th><th>Behaviour</th></tr>
        </thead>
        <tbody>
          {#each keyboard as [key, behaviour] (key)}
            <tr>
              <td><kbd>{key}</kbd></td>
              <td>{behaviour}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="hint">
      Focus rings are drawn on <code>:focus-visible</code> only, so a mouse click never leaves one
      behind while every keyboard user always gets one. Overlays restore focus to the trigger on
      close, and <code>SkipLink</code> is available for jumping past navigation.
    </p>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">OS preferences</h2>
    <ul class="doc-notes">
      <li>
        <strong>prefers-reduced-motion</strong> — every transition, ripple and animation collapses,
        and haptics are suppressed. Motion is never the only carrier of meaning.
      </li>
      <li>
        <strong>prefers-contrast: more</strong> — hairlines become ink, muted text stops being muted,
        and the state layers get stronger. Handled in the token layer, so components inherit it.
      </li>
      <li>
        <strong>prefers-reduced-transparency</strong> — frosted chrome (app bar, sheets, glass cards)
        turns opaque instead of blurred.
      </li>
      <li>
        <strong>forced-colors</strong> (Windows High Contrast) — the OS flattens backgrounds, which
        would erase pill indicators and state layers. Selected and current states gain a
        <code>Highlight</code> outline, surfaces gain a real border, and decorative ripples are hidden.
      </li>
    </ul>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Touch and pointer</h2>
    <ul class="doc-notes">
      <li>Every interactive element carries a hit area of at least 44px, even where the painted control is smaller (see <code>IconButton</code>, <code>Checkbox</code>, <code>Slider</code>).</li>
      <li>Inputs render at 16px on coarse pointers, below which iOS Safari zooms the viewport on focus and never zooms back.</li>
      <li>Hover-only affordances are never load-bearing: <code>Tooltip</code> renders nothing on touch, so anything it says must exist elsewhere too.</li>
      <li>Gestures are additive. A bottom sheet can always be closed with Escape or the scrim, not only by dragging.</li>
    </ul>
  </section>

  <Divider />

  <section class="doc-section">
    <h2 class="doc-section__title">Known limits</h2>
    <ul class="doc-notes">
      <li>The audit covers token pairs, not composed screens: a component placed on a surface it was never designed for can still land below 3:1.</li>
      <li>Disabled controls sit at 40% opacity and are exempt from contrast requirements by WCAG, but they are genuinely hard to read — do not use disabled state to convey information.</li>
      <li><code>variant="glass"</code> surfaces depend on what is behind them; the audit measures the opaque fallback, which is the worst case, not every case.</li>
    </ul>
  </section>
</div>

<style>
  .doc-page code {
    font-family: var(--an-font-mono);
    font-size: 12px;
    padding: 1px 5px;
    border-radius: 4px;
    background: var(--an-surface-sunken);
  }

  .status {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    flex-wrap: wrap;
    padding: var(--an-space-4);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
  }

  .hint {
    margin: 0 0 var(--an-space-4);
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
    max-width: 72ch;
  }

  .matrix {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
    background: var(--an-surface);
  }

  .row {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto auto;
    align-items: center;
    gap: var(--an-space-3);
    padding: var(--an-space-3) var(--an-space-4);
  }

  .row + .row {
    border-top: 1px solid var(--an-border);
  }

  .row[data-fail] {
    background: var(--an-danger-soft);
  }

  .chip {
    display: grid;
    place-items: center;
    width: 44px;
    height: 32px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-sm);
    font-size: 13px;
    font-weight: var(--an-weight-semibold);
  }

  .row__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .row__label {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
  }

  .row__tokens {
    background: none;
    padding: 0;
    color: var(--an-text-faint);
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row__ratio {
    font-family: var(--an-font-mono);
    font-size: 12.5px;
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
  }

  .pair-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--an-space-4);
  }

  :global(.pair-body) {
    margin-top: var(--an-space-2) !important;
  }

  .props__scroll {
    overflow-x: auto;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
    margin-bottom: var(--an-space-4);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--an-text-footnote-size);
  }

  th {
    text-align: start;
    padding: var(--an-space-3) var(--an-space-4);
    border-bottom: 1px solid var(--an-border);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
    font-weight: var(--an-weight-medium);
  }

  td {
    padding: var(--an-space-3) var(--an-space-4);
    border-bottom: 1px solid var(--an-border);
    color: var(--an-text-muted);
    vertical-align: top;
  }

  tr:last-child td {
    border-bottom: none;
  }

  kbd {
    font-family: var(--an-font-mono);
    font-size: 12px;
    padding: 2px 6px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xs);
    background: var(--an-surface-sunken);
    color: var(--an-text);
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .row {
      grid-template-columns: 36px minmax(0, 1fr) auto;
      row-gap: var(--an-space-1);
    }
    .chip {
      width: 36px;
      height: 28px;
    }
  }
</style>
