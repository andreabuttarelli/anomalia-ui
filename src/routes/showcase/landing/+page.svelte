<!--
  Landing mockup — the marketing register of the same system.

  Where the dashboard is dense and quiet, this leans on the parts of the token
  layer that scale up: the display size with its tight tracking, uppercase
  micro-labels with wide tracking, hairline rules as structure, and a single
  inverted band. Still no bespoke colour — everything is tokens.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Badge, Button, Card, Divider, Text, Accordion } from '$lib/index.js';

  const specs = [
    ['Channels', 'IG · TikTok · LinkedIn · YT'],
    ['Cadence', 'Daily to monthly'],
    ['Latency', 'Plan in < 90s'],
    ['Review', 'Optional, per post']
  ];

  const features = [
    {
      index: '01',
      title: 'Editorial plan',
      body: 'A grounded weekly plan from your brand knowledge, not a prompt. Every post traces back to a brief you can edit.'
    },
    {
      index: '02',
      title: 'Production',
      body: 'Captions, carousels and cuts produced against the plan, in your voice, ready to schedule or to change.'
    },
    {
      index: '03',
      title: 'Autopilot',
      body: 'Approve once and let it run, or keep every post behind review. The switch is yours and it is one tap.'
    }
  ];

  const plans = [
    { name: 'Starter', price: '€0', note: 'One brand · weekly plan', cta: 'Start free', featured: false },
    { name: 'Studio', price: '€49', note: 'Five brands · daily plan · autopilot', cta: 'Choose Studio', featured: true },
    { name: 'Agency', price: '€149', note: 'Unlimited brands · API · SSO', cta: 'Talk to us', featured: false }
  ];

  let faq = $state(['what']);
</script>

<Seo
  title="Landing mockup"
  description="A marketing page built from the same design system as the product: site header, hero, feature sections, pricing and footer, sharing one set of tokens with the app."
  pathname={$page.url.pathname}
/>


<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Landing page</h1>
  <p class="doc-page__lead">
    The same tokens in a marketing register: display type at its tightest, uppercase micro-labels,
    hairlines as structure, one inverted band. No colour beyond ink and paper.
  </p>

  <div class="frame">
    <!-- ── Hero ─────────────────────────────────────────────────────────── -->
    <section class="hero">
      <nav class="hero__nav" aria-label="Mockup navigation">
        <span class="hero__brand">ANOMALIA</span>
        <span class="hero__links">
          <span>Product</span>
          <span>Pricing</span>
          <span>Docs</span>
        </span>
        <Button size="sm" variant="outline" class="hero__cta">Sign in</Button>
      </nav>

      <div class="hero__body">
        <p class="eyebrow">Social media autopilot</p>
        <h2 class="hero__title">Ship a month of content<br />in an afternoon.</h2>
        <p class="hero__lead">
          Anomalia reads your brand, writes the plan, produces the posts and publishes them —
          while you keep the veto.
        </p>

        <div class="hero__actions">
          <Button size="lg">Start free</Button>
          <Button size="lg" variant="outline">Watch a run</Button>
        </div>
      </div>

      <dl class="specs">
        {#each specs as [label, value] (label)}
          <div class="spec">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        {/each}
      </dl>
    </section>

    <!-- ── Features ─────────────────────────────────────────────────────── -->
    <section class="band">
      <p class="eyebrow">How it runs</p>
      <div class="features">
        {#each features as feature (feature.index)}
          <article class="feature">
            <span class="feature__index">{feature.index}</span>
            <Text variant="title3" as="h3">{feature.title}</Text>
            <Text variant="footnote" tone="muted" class="feature__body">{feature.body}</Text>
          </article>
        {/each}
      </div>
    </section>

    <!-- ── Metric strip ─────────────────────────────────────────────────── -->
    <section class="metrics">
      <div class="metric">
        <span class="metric__value">184k</span>
        <span class="metric__label">Posts published</span>
      </div>
      <div class="metric">
        <span class="metric__value">92%</span>
        <span class="metric__label">Approved unchanged</span>
      </div>
      <div class="metric">
        <span class="metric__value">6h</span>
        <span class="metric__label">Saved per week</span>
      </div>
      <div class="metric">
        <span class="metric__value">4.9</span>
        <span class="metric__label">Operator rating</span>
      </div>
    </section>

    <!-- ── Pricing ──────────────────────────────────────────────────────── -->
    <section class="band">
      <p class="eyebrow">Pricing</p>
      <Text variant="title2" as="h3" class="band__title">Priced per brand, not per seat.</Text>

      <div class="plans">
        {#each plans as plan (plan.name)}
          <Card variant={plan.featured ? 'elevated' : 'outlined'} selected={plan.featured}>
            <div class="plan__head">
              <Text variant="caption" as="p">{plan.name}</Text>
              {#if plan.featured}<Badge variant="solid" size="sm">Most used</Badge>{/if}
            </div>
            <Text variant="display" as="p" class="plan__price">{plan.price}</Text>
            <Text variant="footnote" tone="muted">{plan.note}</Text>
            <Divider class="plan__rule" />
            <Button fullWidth variant={plan.featured ? 'primary' : 'outline'}>{plan.cta}</Button>
          </Card>
        {/each}
      </div>
    </section>

    <!-- ── FAQ ──────────────────────────────────────────────────────────── -->
    <section class="band band--tight">
      <p class="eyebrow">Questions</p>
      <Accordion
        bind:open={faq}
        items={[
          { value: 'what', title: 'Does it post without asking?' },
          { value: 'brand', title: 'How does it learn the brand voice?' },
          { value: 'stop', title: 'Can I stop it mid-week?' }
        ]}
      >
        {#snippet children(value)}
          {#if value === 'what'}
            Only if you turn Autopilot on. By default every post waits in review, and the switch is
            per brand, not per account.
          {:else if value === 'brand'}
            From what you connect: site, past posts, documents, and anything you add as a note. The
            brief it derives is editable — it is the thing every post traces back to.
          {:else}
            Yes. Pause the plan, and anything not yet published stops. Nothing is queued outside the
            window you can see.
          {/if}
        {/snippet}
      </Accordion>
    </section>

    <!-- ── Closing band ─────────────────────────────────────────────────── -->
    <section class="closer">
      <h3 class="closer__title">Give it a week.</h3>
      <p class="closer__lead">No card. One brand. Cancel by closing the tab.</p>
      <Button size="lg" variant="secondary">Start free</Button>
      <p class="closer__foot">ANOMALIA · MADE IN ITALY</p>
    </section>
  </div>
</div>

<style>
  .doc-page--wide {
    max-width: 1100px;
  }

  .frame {
    margin-top: var(--an-space-6);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    overflow: hidden;
    background: var(--an-surface);
  }

  .eyebrow {
    margin: 0 0 var(--an-space-3);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
    font-weight: var(--an-weight-medium);
  }

  /* ── Hero ──────────────────────────────────────────────────────────────── */
  .hero {
    padding: var(--an-space-5) var(--an-space-6) 0;
    border-bottom: 1px solid var(--an-border);
  }

  .hero__nav {
    display: flex;
    align-items: center;
    gap: var(--an-space-6);
    padding-bottom: var(--an-space-10);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .hero__brand {
    font-size: var(--an-text-caption-size);
    letter-spacing: 0.18em;
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .hero__links {
    display: flex;
    gap: var(--an-space-5);
  }

  :global(.hero__cta) {
    margin-inline-start: auto;
  }

  .hero__body {
    max-width: 62ch;
    padding-bottom: var(--an-space-10);
  }

  .hero__title {
    margin: 0;
    font-size: clamp(2.25rem, 6vw, var(--an-text-display-size));
    line-height: var(--an-text-display-line);
    letter-spacing: var(--an-text-display-track);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .hero__lead {
    margin: var(--an-space-4) 0 0;
    font-size: var(--an-text-callout-size);
    line-height: 1.6;
    color: var(--an-text-muted);
    max-width: 48ch;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--an-space-3);
    margin-top: var(--an-space-6);
  }

  /* Spec strip: the technical register — hairline columns, monospace values. */
  .specs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    margin: 0;
    border-top: 1px solid var(--an-border);
  }

  .spec {
    padding: var(--an-space-4) var(--an-space-4) var(--an-space-5);
    border-inline-start: 1px solid var(--an-border);
  }

  .spec:first-child {
    border-inline-start: none;
    padding-inline-start: 0;
  }

  .spec dt {
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .spec dd {
    margin: var(--an-space-1) 0 0;
    font-family: var(--an-font-mono);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
  }

  /* ── Bands ─────────────────────────────────────────────────────────────── */
  .band {
    padding: var(--an-space-10) var(--an-space-6);
    border-bottom: 1px solid var(--an-border);
  }

  .band--tight {
    padding-block: var(--an-space-8);
  }

  :global(.band__title) {
    margin-bottom: var(--an-space-6) !important;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-6);
  }

  .feature {
    padding-top: var(--an-space-4);
    border-top: 1px solid var(--an-border-strong);
  }

  .feature__index {
    display: block;
    margin-bottom: var(--an-space-3);
    font-family: var(--an-font-mono);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  :global(.feature__body) {
    margin-top: var(--an-space-2) !important;
  }

  /* ── Metrics ───────────────────────────────────────────────────────────── */
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    border-bottom: 1px solid var(--an-border);
  }

  .metric {
    padding: var(--an-space-8) var(--an-space-6);
    border-inline-start: 1px solid var(--an-border);
  }

  .metric:first-child {
    border-inline-start: none;
  }

  .metric__value {
    display: block;
    font-size: var(--an-text-title-1-size);
    letter-spacing: var(--an-text-title-1-track);
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
  }

  .metric__label {
    display: block;
    margin-top: var(--an-space-1);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  /* ── Pricing ───────────────────────────────────────────────────────────── */
  .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--an-space-4);
  }

  .plan__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-3);
  }

  :global(.plan__price) {
    margin: var(--an-space-2) 0 var(--an-space-1) !important;
    font-size: var(--an-text-title-1-size) !important;
  }

  :global(.plan__rule) {
    margin: var(--an-space-4) 0 !important;
  }

  /* ── Closer: the one inverted band ─────────────────────────────────────── */
  .closer {
    padding: var(--an-space-12) var(--an-space-6);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    text-align: center;
  }

  .closer__title {
    margin: 0;
    font-size: clamp(1.75rem, 5vw, var(--an-text-title-1-size));
    letter-spacing: var(--an-text-title-1-track);
    font-weight: var(--an-weight-semibold);
  }

  .closer__lead {
    margin: var(--an-space-3) 0 var(--an-space-6);
    font-size: var(--an-text-footnote-size);
    opacity: 0.7;
  }

  .closer__foot {
    margin: var(--an-space-10) 0 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: 0.18em;
    opacity: 0.45;
  }

  @media (max-width: 640px) {
    .hero,
    .band,
    .metrics .metric,
    .closer {
      padding-inline: var(--an-space-4);
    }

    .hero__links {
      display: none;
    }

    .spec,
    .metric {
      border-inline-start: none;
      border-top: 1px solid var(--an-border);
    }
  }
</style>
