<!--
  Design tokens page. Every swatch, ramp and curve here is rendered *by* the
  token it documents, so the page cannot go out of date: change `tokens.css`
  and this page changes with it.
-->
<script lang="ts">
  import Seo from '../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Card, Text, Divider } from '$lib/index.js';
  import CodeBlock from '../../docs/components/CodeBlock.svelte';

  const surfaces = [
    { token: '--an-bg', label: 'Canvas' },
    { token: '--an-surface', label: 'Surface' },
    { token: '--an-surface-raised', label: 'Raised' },
    { token: '--an-surface-sunken', label: 'Sunken' },
    { token: '--an-surface-hover', label: 'Hover' },
    { token: '--an-surface-inverse', label: 'Inverse' }
  ];

  const content = [
    { token: '--an-text', label: 'Text' },
    { token: '--an-text-muted', label: 'Muted' },
    { token: '--an-text-faint', label: 'Faint' },
    { token: '--an-border', label: 'Hairline' },
    { token: '--an-border-strong', label: 'Hairline strong' },
    { token: '--an-border-control', label: 'Control border' }
  ];

  const accents = [
    { token: '--an-accent', label: 'Accent (ink)' },
    { token: '--an-accent-emphasis', label: 'Emphasis' },
    { token: '--an-accent-soft', label: 'Accent soft' },
    { token: '--an-brand', label: 'Brand' },
    { token: '--an-brand-strong', label: 'Brand strong' },
    { token: '--an-success', label: 'Success' },
    { token: '--an-warning', label: 'Warning' },
    { token: '--an-danger', label: 'Danger' },
    { token: '--an-info', label: 'Info' }
  ];

  const spacing = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];
  const radii = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const shadows = ['xs', 'sm', 'md', 'lg', 'xl'];

  const durations = [
    { token: 'short-2', ms: 100 },
    { token: 'short-4', ms: 200 },
    { token: 'medium-2', ms: 300 },
    { token: 'medium-4', ms: 400 },
    { token: 'long-2', ms: 500 }
  ];

  const easings = [
    { token: 'standard', use: 'Colour, opacity, small state changes' },
    { token: 'emphasized', use: 'The default for anything that moves' },
    { token: 'emphasized-decelerate', use: 'Entering: menus, dialogs, sheets' },
    { token: 'emphasized-accelerate', use: 'Leaving: dismissals' },
    { token: 'spring', use: 'Toggles and thumbs — the only overshoot' }
  ];

  // Restarts the demo animations, so the curves can be compared side by side.
  let run = $state(0);

  const override = `/* Rebrand by redefining the semantic layer — never by
   overriding component selectors. */
:root {
  --an-accent: #0a84ff;
  --an-accent-soft: #dceafd;
  --an-radius-md: 6px;      /* squarer controls  */
  --an-press-scale: 1;      /* opt out of the press squish */
}`;
</script>

<Seo
  title="Design tokens"
  description="The two-layer token system behind the design system: a cold grey ramp and semantic aliases for surface, text, border and motion — every colour pair checked against WCAG 2.2 by a build-time audit."
  pathname={$page.url.pathname}
/>


<div class="doc-page">
  <p class="doc-page__eyebrow">Foundations</p>
  <h1 class="doc-page__title">Design tokens</h1>
  <p class="doc-page__lead">
    Two layers. <code>tokens.css</code> holds raw values — palette, type ramp, space, radius, motion.
    <code>theme.css</code> maps them to semantic names, and components only ever read those. Light and
    dark are the same semantic names with different values, resolved from a single
    <code>data-theme</code> attribute on <code>&lt;html&gt;</code>.
  </p>
  <p class="doc-page__lead">
    Two names in that map do the accessibility heavy lifting: the interactive colour is
    <code>--an-accent</code> (ink, not a hue), and control boundaries use
    <code>--an-border-control</code> rather than the decorative hairline. Both are measured on the
    <a href="/accessibility/">accessibility page</a>.
  </p>

  <section class="doc-section">
    <h2 class="doc-section__title">Colour</h2>

    <Text variant="caption" as="p">Surfaces</Text>
    <div class="swatches">
      {#each surfaces as item (item.token)}
        <div class="swatch">
          <span class="swatch__chip" style={`background: var(${item.token})`}></span>
          <span class="swatch__label">{item.label}</span>
          <code class="swatch__token">{item.token}</code>
        </div>
      {/each}
    </div>

    <Text variant="caption" as="p" class="ramp-label">Content & lines</Text>
    <div class="swatches">
      {#each content as item (item.token)}
        <div class="swatch">
          <span class="swatch__chip" style={`background: var(${item.token})`}></span>
          <span class="swatch__label">{item.label}</span>
          <code class="swatch__token">{item.token}</code>
        </div>
      {/each}
    </div>

    <Text variant="caption" as="p" class="ramp-label">Interactive, brand & status</Text>
    <div class="swatches">
      {#each accents as item (item.token)}
        <div class="swatch">
          <span class="swatch__chip" style={`background: var(${item.token})`}></span>
          <span class="swatch__label">{item.label}</span>
          <code class="swatch__token">{item.token}</code>
        </div>
      {/each}
    </div>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Typography</h2>
    <p class="hint">
      The ramp, the two families and every canonical pairing live on their own page —
      <a href="/typography/">Typography</a> — because type is where most of the day-to-day decisions
      get made, and a swatch grid is the wrong place to answer them.
    </p>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Space, radius, elevation</h2>

    <div class="triple">
      <Card>
        <Text variant="headline" as="h3">Space</Text>
        <div class="bars">
          {#each spacing as step (step)}
            <div class="bar">
              <span class="bar__fill" style={`width: var(--an-space-${step})`}></span>
              <code>{step}</code>
            </div>
          {/each}
        </div>
      </Card>

      <Card>
        <Text variant="headline" as="h3">Radius</Text>
        <div class="radii">
          {#each radii as radius (radius)}
            <div class="radius">
              <span class="radius__box" style={`border-radius: var(--an-radius-${radius})`}></span>
              <code>{radius}</code>
            </div>
          {/each}
        </div>
      </Card>

      <Card>
        <Text variant="headline" as="h3">Elevation</Text>
        <p class="hint hint--tight">
          Surfaces are flat by default: a card shares the page's colour and is found by its
          hairline, in both themes. Only two things break the plane — something recessed goes down a
          step (<code>sunken</code>, the nav rail), and something genuinely floating over the page
          casts a shadow. Nothing rises by getting lighter, except in dark, where a shadow over
          near-black is invisible and <code>raised</code> has to lift with tone instead.
        </p>
        <div class="shadows">
          {#each shadows as shadow (shadow)}
            <div class="shadow">
              <span class="shadow__box" style={`box-shadow: var(--an-shadow-${shadow})`}></span>
              <code>{shadow}</code>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Motion</h2>
    <p class="hint">
      Material 3's duration and easing scales, mirrored in <code>tokens.css</code> and
      <code>motion/tokens.ts</code> — so a CSS transition and a Svelte transition run the identical
      curve. Press replay and watch the difference between the standard and emphasized families.
    </p>

    <Card padding="lg">
      <div class="motion-head">
        <Text variant="headline" as="h3">Easing</Text>
        <button class="replay" type="button" onclick={() => (run += 1)}>Replay</button>
      </div>

      {#key run}
        <div class="curves">
          {#each easings as item (item.token)}
            <div class="curve">
              <div class="curve__track">
                <span class="curve__dot" style={`animation-timing-function: var(--an-ease-${item.token})`}
                ></span>
              </div>
              <div class="curve__meta">
                <code>--an-ease-{item.token}</code>
                <span>{item.use}</span>
              </div>
            </div>
          {/each}
        </div>
      {/key}

      <Divider class="motion-divider" />

      <Text variant="headline" as="h3">Duration</Text>
      <div class="durations">
        {#each durations as item (item.token)}
          <div class="duration">
            <code>--an-duration-{item.token}</code>
            <span class="duration__bar" style={`width: ${item.ms / 6}%`}></span>
            <span class="duration__ms">{item.ms}ms</span>
          </div>
        {/each}
      </div>
    </Card>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Theming an app</h2>
    <CodeBlock code={override} language="css" />
  </section>
</div>

<style>
  .doc-page code {
    font-family: var(--an-font-mono);
    font-size: 12px;
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: var(--an-space-3);
    margin: var(--an-space-3) 0 var(--an-space-6);
  }

  .swatch {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-1);
  }

  .swatch__chip {
    height: 52px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-md);
  }

  .swatch__label {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
  }

  .swatch__token {
    color: var(--an-text-faint);
  }

  :global(.ramp-label) {
    margin-top: var(--an-space-2) !important;
  }

  
  
  
  
  
  /* Same declared size as the sans specimen above it — the alignment is the
     point of the demo, so nothing is nudged by hand. */
  
  
  
  .triple {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-4);
  }

  .bars,
  .radii,
  .shadows {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    margin-top: var(--an-space-3);
  }

  .bar {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
  }

  .bar__fill {
    height: 10px;
    border-radius: 3px;
    background: var(--an-accent-soft);
    border: 1px solid var(--an-accent);
  }

  .radii,
  .shadows {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--an-space-4);
  }

  .radius,
  .shadow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--an-space-1);
  }

  .radius__box {
    width: 44px;
    height: 44px;
    background: var(--an-surface-sunken);
    border: 1px solid var(--an-border-strong);
  }

  .shadow__box {
    width: 44px;
    height: 44px;
    border-radius: var(--an-radius-md);
    background: var(--an-surface);
  }

  .motion-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--an-space-4);
  }

  .replay {
    padding: 4px var(--an-space-3);
    border: 1px solid var(--an-border-strong);
    border-radius: var(--an-radius-xs);
    background: var(--an-surface);
    color: var(--an-text-muted);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-caption-size);
    cursor: pointer;
  }

  .curves {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-4);
  }

  .curve__track {
    position: relative;
    height: 12px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
  }

  .curve__dot {
    position: absolute;
    top: 1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--an-accent);
    animation: travel 1.4s infinite alternate;
  }

  @keyframes travel {
    from {
      left: 1px;
    }
    to {
      left: calc(100% - 11px);
    }
  }

  .curve__meta {
    display: flex;
    justify-content: space-between;
    gap: var(--an-space-3);
    margin-top: 6px;
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  :global(.motion-divider) {
    margin: var(--an-space-6) 0 !important;
  }

  .durations {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    margin-top: var(--an-space-3);
  }

  .duration {
    display: grid;
    grid-template-columns: 190px 1fr auto;
    align-items: center;
    gap: var(--an-space-3);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  .duration__bar {
    height: 6px;
    border-radius: var(--an-radius-full);
    background: var(--an-accent);
  }

  .hint--tight {
    margin: var(--an-space-2) 0 var(--an-space-4);
    max-width: 60ch;
  }

  .hint {
    margin: var(--an-space-3) 0 var(--an-space-4);
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
    max-width: 70ch;
  }

  @media (max-width: 640px) {
    .duration {
      grid-template-columns: 1fr;
      gap: var(--an-space-1);
    }
  }
</style>
