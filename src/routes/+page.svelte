<script lang="ts">
  import Seo from '../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Card, Text, Badge, Button } from '$lib/index.js';
  import CodeBlock from '../docs/components/CodeBlock.svelte';
  import { components } from '../docs/registry.js';

  const install = `npm install @anomalia/ui`;

  const setup = `<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '@anomalia/ui/styles.css';
  import { ThemeProvider, Toaster } from '@anomalia/ui';

  let { children } = $props();
<\/script>

<ThemeProvider>
  {@render children()}
  <Toaster />
</ThemeProvider>`;

  const usage = `<script lang="ts">
  import { Button, Card, TextField, toast } from '@anomalia/ui';

  let email = $state('');
<\/script>

<Card>
  <TextField label="Email" bind:value={email} placeholder="you@studio.com" />
  <Button onclick={() => toast.success({ title: 'Saved' })}>Save</Button>
</Card>`;

  const principles = [
    {
      title: 'Quiet surfaces',
      body: 'Near-monochrome, close to flat, tight radii. Structure comes from hairlines and surface steps rather than shadow and fill, so a dense screen stays legible instead of loud.'
    },
    {
      title: 'Expressive interaction',
      body: 'Material owns everything after contact: ripples from the touch point, state layers, emphasized easing, and gestures that commit on distance or velocity rather than distance alone.'
    },
    {
      title: 'Colour is information',
      body: 'Ink is the interactive colour; the brand hue is reserved for identity, not controls; status hues appear only when something has a state. That is also what makes every pair clear WCAG without a fight.'
    },
    {
      title: 'Tokens, not overrides',
      body: 'Components read semantic tokens only. Restyle the whole system by redefining one layer — never by fighting a component with a more specific selector.'
    }
  ];
</script>

<Seo
  description="A SvelteKit 5 design system: Apple and shadcn restraint, Material touch and motion, and contrast audited against WCAG 2.2 on every token. Zero runtime dependencies, 43 components, dark mode included."
  pathname={$page.url.pathname}
/>

<div class="doc-page">
  <p class="doc-page__eyebrow">Design system</p>
  <h1 class="doc-page__title">Monochrome, engineered, alive under the finger.</h1>
  <p class="doc-page__lead">
    A standalone SvelteKit component library for Anomalia — published as an npm package and consumed
    by the app like any other dependency. The surface is near-monochrome and close to flat: hairlines
    and surface steps carry structure, colour carries meaning, and nothing decorates. Everything that
    happens after you touch it is Material: ripples from the contact point, state layers, emphasized
    easing, gestures that track the finger 1:1.
  </p>

  <div class="hero-actions">
    <Button href="/components/button/">Browse components</Button>
    <Button href="/showcase/dashboard/" variant="outline">See it as a product</Button>
    <Button href="/accessibility/" variant="ghost">Accessibility</Button>
    <Badge tone="accent" variant="soft">{components.length} documented entries</Badge>
  </div>

  <section class="doc-section">
    <h2 class="doc-section__title">Principles</h2>
    <div class="doc-grid">
      {#each principles as principle (principle.title)}
        <Card variant="filled">
          <Text variant="headline" as="h3">{principle.title}</Text>
          <Text variant="footnote" tone="muted" class="principle__body">{principle.body}</Text>
        </Card>
      {/each}
    </div>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Install</h2>
    <div class="code-stack">
      <CodeBlock code={install} language="bash" />
      <CodeBlock code={setup} />
    </div>
    <p class="note">
      Add the exported <code>themeScript</code> to <code>app.html</code> as well — it resolves the
      theme before first paint, which <code>ThemeProvider</code> alone cannot do (it runs after
      hydration, one frame too late).
    </p>
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">Use</h2>
    <CodeBlock code={usage} />
  </section>

  <section class="doc-section">
    <h2 class="doc-section__title">What is in the box</h2>
    <ul class="doc-notes">
      <li>
        <strong>Tokens</strong> — primitives (palette, type ramp, space, radius, motion) and the
        semantic layer components actually read, with light and dark resolved from one attribute.
      </li>
      <li>
        <strong>Components</strong> — buttons, forms, overlays, navigation and feedback, each with
        its own scoped CSS and no styling dependency.
      </li>
      <li>
        <strong>Gestures</strong> — <code>use:ripple</code>, <code>use:press</code> and
        <code>use:swipe</code>, plus haptics, focus trapping, scroll locking and anchored positioning.
      </li>
      <li>
        <strong>Motion</strong> — the Material 3 duration and easing scales, mirrored in CSS and JS
        so a Svelte transition and a CSS transition use the identical curve.
      </li>
      <li>
        <strong>Accessibility</strong> — contrast enforced at the token layer by an audit that fails
        the build, full keyboard patterns, and answers for reduced motion, increased contrast,
        reduced transparency and forced colours.
      </li>
    </ul>
  </section>
</div>

<style>
  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--an-space-3);
    margin-top: var(--an-space-6);
  }

  .doc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--an-space-4);
  }

  :global(.principle__body) {
    margin-top: var(--an-space-2) !important;
  }

  .code-stack {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-4);
  }

  .code-stack :global(.code),
  .doc-section > :global(.code) {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  .note {
    margin: var(--an-space-4) 0 0;
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  .note code,
  .doc-notes code {
    font-family: var(--an-font-mono);
    font-size: 12px;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--an-surface-sunken);
  }
</style>
