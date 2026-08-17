<!--
  Typography page — the ramp, the pairings, and the sans/mono rule.

  Every specimen is rendered by the same components an app would use, and each
  one prints its own recipe underneath. That is deliberate: a pairing you can
  copy in one line is a pairing that gets used, and a page that documents type
  with hand-written CSS is a page that drifts from the system it describes.
-->
<script lang="ts">
  import Seo from '../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import {
    Badge,
    Button,
    Card,
    Code,
    Divider,
    Kbd,
    List,
    ListItem,
    Switch,
    Text,
    TextField
  } from '$lib/index.js';

  const ramp = [
    { variant: 'display', px: 44, use: 'One per page, marketing only' },
    { variant: 'title1', px: 31, use: 'Page title' },
    { variant: 'title2', px: 24, use: 'Card and section titles, big numbers' },
    { variant: 'title3', px: 20, use: 'Sub-sections, dialog titles' },
    { variant: 'headline', px: 17, use: 'Card headers, emphasised rows' },
    { variant: 'callout', px: 16, use: 'Lead paragraphs' },
    { variant: 'body', px: 15, use: 'Everything read as language' },
    { variant: 'footnote', px: 13, use: 'Secondary text, hints, metadata' },
    { variant: 'caption', px: 11, use: 'Eyebrows and labels — uppercase, tracked' }
  ] as const;

  /** The canonical combinations. Each is a real recipe, not an illustration. */
  const pairings = [
    {
      name: 'Page header',
      recipe: 'caption → title1 → callout muted',
      why: 'The eyebrow classifies, the title names, the lead sells. Skipping the eyebrow is fine; skipping the lead leaves the title floating.'
    },
    {
      name: 'Section header',
      recipe: 'title3 → footnote muted',
      why: 'Inside a page. Never use title1 twice on one screen — a second one reads as a second page.'
    },
    {
      name: 'Card header',
      recipe: 'headline → footnote muted',
      why: 'Cards sit in grids, so their titles stay one step below the section that contains them.'
    },
    {
      name: 'Stat tile',
      recipe: 'caption → title2 numeric → badge',
      why: 'Label first because the number is meaningless without it. Tabular figures so a row of tiles aligns.'
    },
    {
      name: 'List row',
      recipe: 'body → footnote muted → footnote value',
      why: 'Title, context, trailing value. The value is right-aligned so the eye can scan a column of them.'
    },
    {
      name: 'Technical row',
      recipe: 'body → mono footnote',
      why: 'Same shape as a list row, but the second line is machine output, so it changes voice rather than just colour.'
    },
    {
      name: 'Form field',
      recipe: 'footnote medium → body input → footnote muted',
      why: 'Label above, hint below, both smaller than the value being typed. The value is the thing, so it is the largest.'
    },
    {
      name: 'Empty state',
      recipe: 'headline → footnote muted → button',
      why: 'Short. An empty state that explains itself in three lines is an empty state nobody reads.'
    },
    {
      name: 'Marketing hero',
      recipe: 'caption → display → callout muted',
      why: 'The only place display appears. Tracking is already tight at 44px, so it needs no manual adjustment.'
    },
    {
      name: 'Metric strip',
      recipe: 'title1 numeric → caption',
      why: 'Inverted order: on a marketing page the number is the headline and the label is the footnote.'
    }
  ];

  const sansFor = [
    'Prose, descriptions, error messages — anything read as language',
    'Titles, labels, button text, navigation',
    'Names of people, brands, channels, files as a user calls them',
    'Numbers a human compares column-wise — with `numeric`, not with mono'
  ];

  const monoFor = [
    'Identifiers and hashes: run_8f2c41d, ord_19f4',
    'Paths, filenames as the system stores them, env keys',
    'Machine timestamps and durations: 09:14:22Z, 38.1s',
    'Keyboard shortcuts, via Kbd',
    'Log lines, payloads, code',
    'Spec values in a technical strip: “Plan in < 90s”'
  ];

  const neverMono = [
    'Currency and KPI values — €49, 184.2k. They are read, not parsed',
    'Body copy or headings, however technical the product is',
    'Button labels and navigation',
    'A whole table because one of its columns is machine output'
  ];
</script>

<Seo
  title="Typography"
  description="The type ramp, the sans and mono pairing normalised with font-size-adjust, and the rule for when machine-authored fact takes the mono voice instead of the sans."
  pathname={$page.url.pathname}
/>

<div class="doc-page">
  <p class="doc-page__eyebrow">Foundations</p>
  <h1 class="doc-page__title">Typography</h1>
  <p class="doc-page__lead">
    Two families and nine steps. Each step binds size, line-height and tracking together, so the only
    decision left is which step — and the pairings below are the answers the system has already made,
    so that decision rarely has to be made twice.
  </p>

  <!-- ── Ramp ──────────────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">The ramp</h2>
    <Card padding="lg">
      <div class="ramp">
        {#each ramp as step (step.variant)}
          <div class="ramp__row">
            <Text variant={step.variant}>The quick brown fox</Text>
            <span class="ramp__meta">
              <Code bare tone="muted">{step.variant}</Code>
              <span class="ramp__use">{step.px}px · {step.use}</span>
            </span>
          </div>
        {/each}
      </div>
    </Card>
    <p class="hint">
      Headings tighten as they grow; labels go the other way — small, uppercase, widely tracked. Both
      moves are inside the variant, so a heading cannot accidentally be set with body tracking.
    </p>
  </section>

  <!-- ── Sans vs mono ──────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Sans or mono</h2>
    <p class="hint">
      One question decides it: <strong>who wrote this?</strong> If a person did, it is Inter. If a
      machine emitted it, it is mono. If a person will compare it down a column, it is Inter with
      tabular figures — which aligns just as well as mono and does not turn a metrics panel into a
      terminal.
    </p>

    <div class="rules">
      <Card>
        <div class="rule__head">
          <Text variant="headline" as="h3">Inter</Text>
          <Badge variant="soft" tone="success">default</Badge>
        </div>
        <ul class="rule__list">
          {#each sansFor as item (item)}<li>{item}</li>{/each}
        </ul>
      </Card>

      <Card>
        <div class="rule__head">
          <Text variant="headline" as="h3">Geist Mono</Text>
          <Badge variant="soft">machine</Badge>
        </div>
        <ul class="rule__list rule__list--mono">
          {#each monoFor as item (item)}<li>{item}</li>{/each}
        </ul>
      </Card>

      <Card>
        <div class="rule__head">
          <Text variant="headline" as="h3">Never mono</Text>
          <Badge variant="soft" tone="danger">stop</Badge>
        </div>
        <ul class="rule__list">
          {#each neverMono as item (item)}<li>{item}</li>{/each}
        </ul>
      </Card>
    </div>

    <div class="compare">
      <Card variant="filled">
        <Text variant="caption" as="p">Right</Text>
        <div class="compare__row">
          <Text variant="footnote" tone="muted">Revenue</Text>
          <Text numeric>€184,200</Text>
        </div>
        <div class="compare__row">
          <Text variant="footnote" tone="muted">Run</Text>
          <Code bare>run_8f2c41d</Code>
        </div>
        <Text variant="footnote" tone="muted" class="compare__note">
          Money in Inter with tabular figures; the id in mono. Two voices, each doing its job.
        </Text>
      </Card>

      <Card variant="filled">
        <Text variant="caption" as="p">Wrong</Text>
        <div class="compare__row">
          <Text variant="footnote" tone="muted">Revenue</Text>
          <Text family="mono">€184,200</Text>
        </div>
        <div class="compare__row">
          <Text variant="footnote" tone="muted">Run</Text>
          <Text>run 8f2c41d</Text>
        </div>
        <Text variant="footnote" tone="muted" class="compare__note">
          Money in mono reads as a log line; the id in sans invites you to read it as a word. Both
          are legible and both are wrong.
        </Text>
      </Card>
    </div>
  </section>

  <!-- ── Pairings ──────────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Pairings</h2>
    <p class="hint">
      Ten combinations that cover almost every screen. Each prints its own recipe: the variants, in
      order, as you would write them.
    </p>

    <div class="pairings">
      <!-- Page header -->
      <article class="pairing">
        <div class="pairing__demo">
          <Text variant="caption" as="p">Showcase</Text>
          <Text variant="title1" as="h3">Editorial plan</Text>
          <Text variant="callout" tone="muted" class="pairing__lead">
            Twelve posts for week 34, grounded in the brief you approved on Monday.
          </Text>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[0].name}</Text>
          <Code bare tone="muted">{pairings[0].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[0].why}</Text>
        </div>
      </article>

      <!-- Section header -->
      <article class="pairing">
        <div class="pairing__demo">
          <Text variant="title3" as="h3">Queue</Text>
          <Text variant="footnote" tone="muted">Four posts waiting to go out this week.</Text>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[1].name}</Text>
          <Code bare tone="muted">{pairings[1].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[1].why}</Text>
        </div>
      </article>

      <!-- Card header -->
      <article class="pairing">
        <div class="pairing__demo">
          <Card>
            <Text variant="headline" as="h3">Autopilot</Text>
            <Text variant="footnote" tone="muted" class="pairing__gap">
              Produce, schedule and publish without waiting for approval.
            </Text>
          </Card>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[2].name}</Text>
          <Code bare tone="muted">{pairings[2].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[2].why}</Text>
        </div>
      </article>

      <!-- Stat tile -->
      <article class="pairing">
        <div class="pairing__demo">
          <Card padding="sm">
            <Text variant="caption" as="p">Impressions</Text>
            <Text variant="title2" numeric class="pairing__stat">184.2k</Text>
            <Badge tone="success" variant="soft" size="sm">+12.4%</Badge>
          </Card>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[3].name}</Text>
          <Code bare tone="muted">{pairings[3].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[3].why}</Text>
        </div>
      </article>

      <!-- List row -->
      <article class="pairing">
        <div class="pairing__demo">
          <List variant="grouped">
            <ListItem
              title="Carousel · behind the collection"
              subtitle="Instagram · today"
              value="18:00"
            />
          </List>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[4].name}</Text>
          <Code bare tone="muted">{pairings[4].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[4].why}</Text>
        </div>
      </article>

      <!-- Technical row -->
      <article class="pairing">
        <div class="pairing__demo">
          <Text>media.render</Text>
          <Text variant="footnote" tone="muted" family="mono" class="pairing__gap">
            reel/studio-tour · 38.1s · exit 0
          </Text>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[5].name}</Text>
          <Code bare tone="muted">{pairings[5].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[5].why}</Text>
        </div>
      </article>

      <!-- Form field -->
      <article class="pairing">
        <div class="pairing__demo">
          <TextField label="Workspace" value="Lindaria" hint="Shown to your clients" />
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[6].name}</Text>
          <Code bare tone="muted">{pairings[6].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[6].why}</Text>
        </div>
      </article>

      <!-- Empty state -->
      <article class="pairing">
        <div class="pairing__demo pairing__demo--center">
          <Text variant="headline" as="h3" align="center">No posts yet</Text>
          <Text variant="footnote" tone="muted" align="center" class="pairing__gap">
            Connect a channel and Anomalia writes the first plan.
          </Text>
          <Button size="sm" class="pairing__cta">Connect a channel</Button>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[7].name}</Text>
          <Code bare tone="muted">{pairings[7].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[7].why}</Text>
        </div>
      </article>

      <!-- Marketing hero -->
      <article class="pairing">
        <div class="pairing__demo">
          <Text variant="caption" as="p">Social media autopilot</Text>
          <Text variant="display" as="h3" class="pairing__hero">Ship a month<br />in an afternoon.</Text>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[8].name}</Text>
          <Code bare tone="muted">{pairings[8].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[8].why}</Text>
        </div>
      </article>

      <!-- Metric strip -->
      <article class="pairing">
        <div class="pairing__demo">
          <div class="metrics">
            <div>
              <Text variant="title1" numeric>92%</Text>
              <Text variant="caption" as="p">Approved unchanged</Text>
            </div>
            <div>
              <Text variant="title1" numeric>6h</Text>
              <Text variant="caption" as="p">Saved per week</Text>
            </div>
          </div>
        </div>
        <div class="pairing__meta">
          <Text variant="headline" as="h4">{pairings[9].name}</Text>
          <Code bare tone="muted">{pairings[9].recipe}</Code>
          <Text variant="footnote" tone="muted">{pairings[9].why}</Text>
        </div>
      </article>
    </div>
  </section>

  <!-- ── Mixing rules ──────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Rules that keep it from unravelling</h2>
    <ul class="doc-notes">
      <li>
        <strong>Two steps apart, at most.</strong> A title next to its supporting line should be one
        or two steps up — <Code bare>title3</Code> over <Code bare>footnote</Code>. Four steps apart
        reads as two unrelated blocks.
      </li>
      <li>
        <strong>One display per page, one title1 per screen.</strong> A second one is not emphasis,
        it is a second page.
      </li>
      <li>
        <strong>Colour is the third axis, after size and weight.</strong> Reach for
        <Code bare>tone="muted"</Code> before reaching for a smaller step: shrinking secondary text
        twice is how a screen ends up with 11px paragraphs.
      </li>
      <li>
        <strong>Caption is a label, not small body.</strong> It is uppercase and tracked, so it works
        for one to three words and fails for a sentence.
      </li>
      <li>
        <strong>Mono never sets a heading.</strong> If a heading is an identifier — a run id, a file
        name — set it in sans and put the mono form underneath.
      </li>
      <li>
        <strong>Shortcuts always go through <Code bare>Kbd</Code></strong>, so
        <Kbd keys="⌘+K" size="sm" /> renders as caps rather than as literal text with a plus in it.
      </li>
    </ul>
  </section>

  <Divider />

  <section class="doc-section">
    <h2 class="doc-section__title">Providing the fonts</h2>
    <p class="hint">
      The package names both families and ships neither: bundling a font fights whatever the host app
      already loads. Self-host Inter and Geist Mono in your app, or point
      <Code bare>--an-font-sans</Code> and <Code bare>--an-font-mono</Code> at what you already have —
      the x-height normalisation follows whatever resolves.
    </p>
    <div class="switch-demo">
      <Switch label="Nothing to configure" hint="The system stack behind each name already works" disabled checked />
    </div>
  </section>
</div>

<style>
  .hint {
    margin: 0 0 var(--an-space-4);
    font-size: var(--an-text-footnote-size);
    line-height: 1.65;
    color: var(--an-text-muted);
    max-width: 72ch;
  }

  /* ── Ramp ──────────────────────────────────────────────────────────────── */
  .ramp {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-5);
  }

  .ramp__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--an-space-5);
    flex-wrap: wrap;
  }

  .ramp__meta {
    display: flex;
    align-items: baseline;
    gap: var(--an-space-3);
    flex-shrink: 0;
  }

  .ramp__use {
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  /* ── Sans/mono rules ───────────────────────────────────────────────────── */
  .rules {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-4);
    margin-bottom: var(--an-space-4);
  }

  .rule__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-3);
    margin-bottom: var(--an-space-3);
  }

  .rule__list {
    margin: 0;
    padding-inline-start: var(--an-space-4);
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    font-size: var(--an-text-footnote-size);
    line-height: 1.5;
    color: var(--an-text-muted);
  }

  .rule__list--mono li {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 12.5px;
    letter-spacing: 0;
  }

  .compare {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--an-space-4);
  }

  .compare__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-2) 0;
    border-bottom: 1px solid var(--an-border);
  }

  :global(.compare__note) {
    margin-top: var(--an-space-3) !important;
  }

  /* ── Pairings ──────────────────────────────────────────────────────────── */
  .pairings {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
    background: var(--an-surface);
  }

  .pairing {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: var(--an-space-6);
    padding: var(--an-space-6);
    align-items: center;
  }

  .pairing + .pairing {
    border-top: 1px solid var(--an-border);
  }

  .pairing__demo {
    min-width: 0;
  }

  .pairing__demo--center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pairing__meta {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    align-items: flex-start;
    /* The recipe column is reference material, so it sits back from the demo. */
    padding-inline-start: var(--an-space-6);
    border-inline-start: 1px solid var(--an-border);
  }

  :global(.pairing__lead),
  :global(.pairing__gap) {
    margin-top: var(--an-space-2) !important;
  }

  :global(.pairing__stat) {
    margin: var(--an-space-1) 0 var(--an-space-2) !important;
  }

  :global(.pairing__cta) {
    margin-top: var(--an-space-3);
  }

  :global(.pairing__hero) {
    margin-top: var(--an-space-2) !important;
    font-size: clamp(1.75rem, 4vw, var(--an-text-display-size)) !important;
  }

  .metrics {
    display: flex;
    gap: var(--an-space-8);
  }

  .switch-demo {
    max-width: 420px;
  }

  @media (max-width: 760px) {
    .pairing {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--an-space-4);
    }

    .pairing__meta {
      padding-inline-start: 0;
      border-inline-start: none;
      border-top: 1px solid var(--an-border);
      padding-top: var(--an-space-4);
    }
  }
</style>
