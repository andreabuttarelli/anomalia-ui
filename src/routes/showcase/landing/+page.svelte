<!--
  Landing mockup — Anomalia's home page: a marketing page that has to convert,
  not an app screen with copy around it.

  The order is the argument, and it is the order a landing page earns a signup
  in: claim and capture first, then the pain in numbers, then the outcome in the
  reader's terms, then proof that it is real, then the price against what they
  pay today, then the objections, then the ask again. The signature section —
  one week of the product running, on a sticky clock — sits in the middle, where
  a demo belongs: after someone knows why they should care, before they are
  asked to decide.

  Three rules held the design together:

    • **Every section ends in a next step.** Five CTAs, one capture field
      repeated at top and bottom, and the microcopy that removes the risk sits
      under the button rather than in a footnote.
    • **Outcomes above mechanism.** "A week of content, every week" is the
      promise; `plan.week` and the trace are the evidence, and evidence goes
      under the promise, never over it.
    • **Nothing invented.** The market numbers carry their sources, the proof is
      the product's own counters, and there is not a single fabricated customer
      logo or testimonial on the page — a landing page that lies converts once.

  The paint is anomalia.so's, as a page-level theme: `--accent`, `--accent-2`,
  the two-blob aurora, light headings on tight tracking, pill controls. Below
  that line everything is the library — Card, Table, Badge, the chat trace — and
  ink stays the interactive colour, so every control still clears the contrast
  the audit enforces. The accent is identity: glow, artwork, the loop. It is
  wired to nothing you can click.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import {
    Accordion,
    Avatar,
    Badge,
    Button,
    Card,
    ChatMessage,
    ChatThinking,
    ChatToolCall,
    Counter,
    Divider,
    List,
    ListItem,
    Reveal,
    SiteFooter,
    SiteHeader,
    Sparkline,
    Stat,
    StatusDot,
    Table,
    Text,
    TextField,
    ThemeToggle
  } from '$lib/index.js';

  const navLinks = [
    { label: 'How it works', href: '#run' },
    { label: 'Compare', href: '#compare' },
    { label: 'Pricing', href: '#price' },
    { label: 'Docs', href: '#' }
  ];

  let site = $state('');
  let siteFooter = $state('');

  /* ── The run that plays in the hero ────────────────────────────────────── */
  const calls = [
    { name: 'brain.read', summary: 'acme.so · 48 documents', duration: 2.4 },
    { name: 'plan.week', summary: 'week=34 · 6 pieces', duration: 1.9 },
    { name: 'media.render', summary: 'reel/studio-tour', duration: 38.1 },
    { name: 'seo.audit', summary: 'acme.so · 12 pages', duration: 6.4 }
  ];

  let runEl = $state<HTMLElement | null>(null);
  let step = $state(0);
  const DONE = calls.length + 1;

  function statusOf(i: number) {
    if (step > i + 1) return 'success' as const;
    if (step === i + 1) return 'running' as const;
    return 'pending' as const;
  }

  $effect(() => {
    const node = runEl;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      step = DONE;
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        for (let i = 0; i <= calls.length; i++) {
          timers.push(setTimeout(() => (step = i + 1), 900 + i * 1100));
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  });

  /* ── The demo spine ────────────────────────────────────────────────────── */
  const moments = [
    { id: 'brain', time: 'Mon 09:14', actor: 'Brain' },
    { id: 'agents', time: 'Mon 09:16', actor: 'Agents' },
    { id: 'publisher', time: 'Mon 11:00', actor: 'Publisher' },
    { id: 'friday', time: 'Fri 18:00', actor: 'Back to the brain' }
  ];

  let current = $state(0);
  const momentEls: HTMLElement[] = [];

  $effect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            current = Number((entry.target as HTMLElement).dataset.index ?? 0);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    momentEls.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  });

  /* ── Content ───────────────────────────────────────────────────────────── */
  const surfaces = ['instagram', 'tiktok', 'linkedin', 'x', 'youtube', 'facebook', 'reddit', 'blog', 'ads'];

  /* Market numbers, with the sources they came with. A landing page that makes
     up its statistics converts exactly once. */
  const pains = [
    {
      figure: 64,
      suffix: '%',
      claim: 'of small business owners cannot keep a consistent social presence.',
      source: 'Buffer, 2025'
    },
    {
      figure: 73,
      suffix: '%',
      claim: 'of them name lack of time as the reason. Not ideas. Time.',
      source: 'Buffer, 2025'
    },
    {
      figure: 97,
      suffix: '%',
      claim: 'of people search online before choosing a business. If you are not there, someone else is.',
      source: 'BrightLocal'
    }
  ];

  const outcomes = [
    {
      title: 'A week of content, every week',
      body: 'Posts, carousels, reels and articles planned, written, designed and queued. You open the app on Monday and it is done.'
    },
    {
      title: 'Found on Google, quoted by ChatGPT',
      body: 'Long-form articles, technical SEO and GEO audits — so you turn up in the search box and in the answer box.'
    },
    {
      title: 'Eleven minutes of your time',
      body: 'That is the median week: read the plan, tap approve. Everything else — writing, design, scheduling, publishing — is not your job any more.'
    }
  ];

  const week = [
    { day: 'Mon', items: [{ label: 'Carousel', art: 1 }, { label: 'Post', art: 2 }] },
    { day: 'Tue', items: [{ label: 'Post', art: 3 }] },
    { day: 'Wed', items: [{ label: 'Article', art: 4 }] },
    { day: 'Thu', items: [], blocked: 'shoot' },
    { day: 'Fri', items: [{ label: 'Reel', art: 5 }] },
    { day: 'Sat', items: [] },
    { day: 'Sun', items: [{ label: 'Ad set', art: 6 }] }
  ];

  const queue = [
    { work: 'Studio tour', kind: 'Reel', on: ['instagram', 'tiktok'], state: 'Scheduled', tone: 'info' },
    { work: 'How we price', kind: 'Article', on: ['blog', 'linkedin'], state: 'Published', tone: 'success' },
    { work: 'Three fabrics', kind: 'Carousel', on: ['instagram'], state: 'Published', tone: 'success' },
    { work: 'Q3 launch', kind: 'Ad set', on: ['ads', 'facebook'], state: 'In review', tone: 'warning' }
  ] as const;

  const reach = [8, 12, 10, 18, 22, 19, 28, 34, 31, 44, 52, 61];

  /* The comparison is the three-tools argument where it actually converts:
     against what the reader is paying for the same job today. */
  const compareRows = [
    ['Knows your brand, without a briefing', false, false, true, true],
    ['Social posts, designed and scheduled', true, true, true, true],
    ['Blog, SEO and AI visibility', false, true, true, true],
    ['Ads written from the same brief', false, true, true, true],
    ['Learns from what performed', false, false, true, true],
    ['Works while you sleep', false, false, false, true]
  ] as const;

  const faq = [
    { value: 'post', title: 'Does it publish without asking me?' },
    { value: 'voice', title: 'Will it sound like a robot wrote it?' },
    { value: 'marketing', title: 'I do not know marketing. Is that a problem?' },
    { value: 'stop', title: 'Can I stop it in the middle of a week?' },
    { value: 'leave', title: 'What happens to my content if I leave?' }
  ];

  let faqOpen = $state(['post']);

  const footerColumns = [
    {
      title: 'Product',
      links: [
        { label: 'How it works', href: '#run' },
        { label: 'Compare', href: '#compare' },
        { label: 'Pricing', href: '#price' },
        { label: 'Changelog', href: '#' }
      ]
    },
    {
      title: 'Developers',
      links: [
        { label: 'CLI', href: '#' },
        { label: 'MCP server', href: '#' },
        { label: 'API', href: '#' },
        { label: 'Agent skill', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    }
  ];
</script>

<Seo
  title="Landing mockup"
  description="A marketing landing page built from the library: claim and capture, the pain in numbers, outcomes, one week of the product running on a sticky clock, a comparison against what you pay today, pricing, objections and the ask again."
  pathname={$page.url.pathname}
/>

<!-- Platform marks, drawn once and referenced by id so the Instagram gradient
     exists exactly once in the document. -->
{#snippet glyph(name: string)}
  {#if name === 'instagram'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#an-ig)" stroke-width="2" />
      <circle cx="12" cy="12" r="4.6" fill="none" stroke="url(#an-ig)" stroke-width="2" />
      <circle cx="17.6" cy="6.4" r="1.4" fill="url(#an-ig)" />
    </svg>
  {:else if name === 'tiktok'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M16.2 3h-2.9v12.1a2.6 2.6 0 1 1-2.1-2.6v-2.9a5.5 5.5 0 1 0 5 5.5V9.4a6.8 6.8 0 0 0 4 1.3V7.8c-2.1-.1-3.8-1.8-4-4z"
        fill="currentColor"
      />
    </svg>
  {:else if name === 'linkedin'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0a66c2" />
      <path
        d="M6.4 9.4h2.4V18H6.4zm1.2-4a1.4 1.4 0 1 1 0 2.9 1.4 1.4 0 0 1 0-2.9zM10.6 9.4H13v1.2c.4-.7 1.3-1.4 2.7-1.4 2.2 0 3.1 1.4 3.1 3.7V18h-2.4v-4.5c0-1.2-.4-1.9-1.5-1.9s-1.8.7-1.8 1.9V18h-2.5z"
        fill="#fff"
      />
    </svg>
  {:else if name === 'x'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M3 3h4.6l4.4 5.9L17.2 3H21l-6.8 8.1L21.5 21h-4.6l-4.7-6.3L6.7 21H3l7.2-8.6z" fill="currentColor" />
    </svg>
  {:else if name === 'youtube'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="1.8" y="5" width="20.4" height="14" rx="4.4" fill="#ff0000" />
      <path d="M10.2 8.9 15.6 12l-5.4 3.1z" fill="#fff" />
    </svg>
  {:else if name === 'facebook'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877f2" />
      <path
        d="M13.4 21.9V14h2.4l.4-2.9h-2.8V9.3c0-.8.3-1.4 1.5-1.4h1.4V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8.1V14h2.3v7.9z"
        fill="#fff"
      />
    </svg>
  {:else if name === 'reddit'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#ff4500" />
      <circle cx="9" cy="12.2" r="1.3" fill="#fff" />
      <circle cx="15" cy="12.2" r="1.3" fill="#fff" />
      <path d="M8.6 15.4c1.9 1.4 4.9 1.4 6.8 0" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" />
      <circle cx="17.4" cy="7.6" r="1.5" fill="#fff" />
    </svg>
  {:else if name === 'blog'}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3" y="3.5" width="18" height="17" rx="3" fill="none" stroke="currentColor" stroke-width="1.8" />
      <path d="M7 9h10M7 13h10M7 17h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 9.5h3.4L18 5v14L7.4 14.5H4a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 4 9.5z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linejoin="round"
      />
      <path
        d="M8 15v3.5a1.5 1.5 0 0 0 3 0V16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linejoin="round"
      />
    </svg>
  {/if}
{/snippet}

{#snippet surfaceName(name: string)}
  {#if name === 'x'}X{:else if name === 'tiktok'}TikTok{:else if name === 'youtube'}YouTube{:else if name === 'linkedin'}LinkedIn{:else if name === 'ads'}Meta &amp; Google Ads{:else}{name.charAt(0).toUpperCase() + name.slice(1)}{/if}
{/snippet}

{#snippet tick(on: boolean)}
  {#if on}
    <svg viewBox="0 0 20 20" width="17" height="17" aria-hidden="true" class="tick">
      <path d="m4 10.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  {:else}
    <span class="tick tick--off" aria-hidden="true">—</span>
  {/if}
{/snippet}

<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Landing page</h1>
  <p class="doc-page__lead">
    A marketing page in the shape that earns a signup: claim and capture, the pain in numbers,
    outcomes in the reader's terms, one week of the product running as the demo, a comparison
    against what they pay today, pricing, objections, and the ask again. Painted in anomalia.so's
    palette — <code>--accent</code>, <code>--accent-2</code>, the aurora, light headings — over the
    library's components, with ink still doing every control.
  </p>

  <div class="frame">
    <svg width="0" height="0" aria-hidden="true" focusable="false" class="defs">
      <defs>
        <linearGradient id="an-ig" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stop-color="#f58529" />
          <stop offset="45%" stop-color="#dd2a7b" />
          <stop offset="100%" stop-color="#8134af" />
        </linearGradient>
      </defs>
    </svg>

    <SiteHeader links={navLinks} sticky={false}>
      {#snippet brand()}
        <a class="wordmark" href="#top">
          <span class="wordmark__mark" aria-hidden="true"></span>
          Anomalia
        </a>
      {/snippet}

      {#snippet utilities()}
        <ThemeToggle size="sm" />
      {/snippet}

      {#snippet cta()}
        <Button size="sm" pill>Start free</Button>
      {/snippet}
    </SiteHeader>

    <!-- ── 1 · Claim and capture ────────────────────────────────────────── -->
    <section class="hero" id="top">
      <div class="aurora" aria-hidden="true"></div>

      <div class="hero__inner">
        <p class="pill-label">
          <span class="pill-label__dot" aria-hidden="true"></span>
          One brain · one publisher · a team of agents
        </p>

        <h2 class="hero__title">Your marketing, done<br />before Monday morning.</h2>

        <p class="hero__lead">
          Anomalia learns your company once, then plans, writes, designs and publishes everything
          you put out — Instagram, TikTok, LinkedIn, your blog, your ads. You approve in one tap.
        </p>

        <form class="capture" onsubmit={(e) => e.preventDefault()}>
          <TextField
            bind:value={site}
            label="Start with your website"
            placeholder="acmestudio.com"
            size="lg"
            fieldClass="capture__field"
          />
          <Button size="lg" pill type="submit">Start free</Button>
        </form>

        <p class="capture__note">
          No card. One brand free, forever. Or <a href="#run">connect it to Claude</a> and run it from
          your terminal.
        </p>

        <p class="hero__live">
          <StatusDot label="Live" tone="success" pulse />
          <span class="hero__count"><Counter value={1284} /></span>
          pieces published by Anomalia today
        </p>
      </div>

      <!-- The product, cropped at the fold: enough to be real, not enough to
           finish reading — the reason to keep scrolling. -->
      <div class="hero__shot" bind:this={runEl}>
        <div class="window">
          <div class="window__bar">
            <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="window__url">app.anomalia.so/runs</span>
          </div>
          <div class="window__body">
            <div class="panel__head">
              <div>
                <Text variant="caption" as="p">Weekly run</Text>
                <Text variant="headline" as="h3">Week 34 · Acme Studio</Text>
              </div>
              <Badge variant="soft" tone={step === DONE ? 'success' : 'info'} dot>
                {step === DONE ? 'Ready for review' : 'Working'}
              </Badge>
            </div>
            <Divider />
            <div class="panel__body">
              <div class="trace">
                <ChatThinking
                  active={step === 0}
                  duration={step === 0 ? null : 3.1}
                  preview="Reading the company, checking the calendar…"
                >
                  Thursday is blocked for a shoot, so the reel belongs on Friday, when the footage
                  exists. Six pieces fits the cadence without crowding the feed.
                </ChatThinking>

                {#each calls as call, i (call.name)}
                  <ChatToolCall
                    name={call.name}
                    summary={call.summary}
                    status={statusOf(i)}
                    duration={statusOf(i) === 'success' ? call.duration : undefined}
                  />
                {/each}
              </div>

              {#if step === DONE}
                <ChatMessage role="assistant" name="Anomalia" timestamp="09:16">
                  {#snippet avatar()}<Avatar size="xs" name="Anomalia" />{/snippet}
                  Week 34 is ready: four posts, the reel on Friday and the pricing article. Thursday
                  stays clear for the shoot. Nothing goes out until you approve.
                </ChatMessage>
              {/if}
            </div>
          </div>
        </div>
        <div class="hero__fade" aria-hidden="true"></div>
      </div>
    </section>

    <!-- ── 2 · Surfaces ─────────────────────────────────────────────────── -->
    <section class="surfaces" aria-label="Surfaces Anomalia publishes to">
      <p class="surfaces__label">Publishes to</p>
      <ul class="surfaces__list">
        {#each surfaces as surface (surface)}
          <li class="surfaces__item">
            {@render glyph(surface)}
            <span>{@render surfaceName(surface)}</span>
          </li>
        {/each}
      </ul>
    </section>

    <!-- ── 3 · The pain ─────────────────────────────────────────────────── -->
    <section class="band band--tint">
      <header class="band__head">
        <p class="eyebrow">The hard truth</p>
        <h3 class="band__title">You know you should be everywhere.<br />You cannot keep it up.</h3>
        <p class="band__lead">
          It is not a discipline problem. Showing up daily on five surfaces is a full-time job, and
          you already have one.
        </p>
      </header>

      <div class="pains">
        {#each pains as pain, i (pain.source + pain.figure)}
          <Reveal index={i}>
            <div class="pain">
              <p class="pain__figure">
                <Counter value={pain.figure} suffix={pain.suffix} />
              </p>
              <p class="pain__claim">{pain.claim}</p>
              <p class="pain__source">{pain.source}</p>
            </div>
          </Reveal>
        {/each}
      </div>
    </section>

    <!-- ── 4 · The outcome ──────────────────────────────────────────────── -->
    <section class="band">
      <header class="band__head">
        <p class="eyebrow">What you get</p>
        <h3 class="band__title">Hand it over on Monday.<br />Read the results on Friday.</h3>
      </header>

      <div class="outcomes">
        {#each outcomes as outcome, i (outcome.title)}
          <Reveal index={i}>
            <article class="outcome">
              <span class="outcome__index" aria-hidden="true">0{i + 1}</span>
              <h4 class="outcome__title">{outcome.title}</h4>
              <p class="outcome__body">{outcome.body}</p>
            </article>
          </Reveal>
        {/each}
      </div>

      <div class="band__cta">
        <Button size="lg" pill>Start free</Button>
        <Text variant="footnote" tone="muted">Set up in the time it takes to read the next section.</Text>
      </div>
    </section>

    <!-- ── 5 · The demo: one week, start to finish ──────────────────────── -->
    <section class="band band--head-only" id="run">
      <header class="band__head">
        <p class="eyebrow">How it works</p>
        <h3 class="band__title">One week, start to finish.</h3>
        <p class="band__lead">
          Not a diagram of the product — the product, on the clock, from the Monday it reads your
          company to the Friday it learns from the results.
        </p>
      </header>
    </section>

    <div class="run">
      <aside class="rail" aria-hidden="true">
        <div class="rail__sticky">
          <p class="rail__clock">{moments[current].time}</p>
          <p class="rail__actor">{moments[current].actor}</p>
          <ol class="rail__ticks">
            {#each moments as moment, i (moment.id)}
              <li class="rail__tick" data-on={i <= current ? '' : undefined}></li>
            {/each}
          </ol>
        </div>
      </aside>

      <div class="moments">
        <!-- 01 · Brain -->
        <article class="moment" id="brain" data-index="0" bind:this={momentEls[0]}>
          <p class="stamp moment__stamp">Mon 09:14 · Brain</p>
          <h4 class="moment__title">It already knows your company.</h4>
          <p class="moment__lead">
            Your site, your past posts, your documents, your products — read once and kept. You never
            brief it twice, and every piece it writes traces back to something you can open and edit.
          </p>

          <Reveal class="moment__artifact">
            <div class="window">
              <div class="window__bar">
                <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span class="window__url">app.anomalia.so/studio</span>
              </div>
              <div class="window__body">
                <div class="panel__head">
                  <div>
                    <Text variant="caption" as="p">Brand knowledge</Text>
                    <Text variant="headline" as="h5">Acme Studio</Text>
                  </div>
                  <Badge tone="success" variant="soft" dot>Indexed</Badge>
                </div>
                <Divider />
                <div class="moodboard">
                  <span class="art art--1" aria-hidden="true"></span>
                  <span class="art art--2" aria-hidden="true"></span>
                  <span class="art art--3" aria-hidden="true"></span>
                  <span class="art art--4" aria-hidden="true"></span>
                </div>
                <Divider />
                <List>
                  <ListItem title="Voice" value="Warm, concrete, no exclamation marks" />
                  <ListItem title="Pillars" value="Craft · Proof · Behind the scenes" />
                  <ListItem title="Products" value="12" />
                  <ListItem title="Documents" value="48" />
                </List>
                <Divider />
                <div class="panel__foot">
                  <span class="swatches" aria-hidden="true">
                    <span class="swatch swatch--accent"></span>
                    <span class="swatch swatch--accent-2"></span>
                    <span class="swatch swatch--ink"></span>
                    <span class="swatch swatch--paper"></span>
                  </span>
                  <Text variant="footnote" tone="faint" family="mono">synced 09:14</Text>
                </div>
              </div>
            </div>
          </Reveal>
        </article>

        <p class="aside">Nobody re-typed the brief. That is the entire job of the brain.</p>

        <!-- 02 · Agents -->
        <article class="moment" id="agents" data-index="1" bind:this={momentEls[1]}>
          <p class="stamp moment__stamp">Mon 09:16 · Agents</p>
          <h4 class="moment__title">Two minutes later, the week exists.</h4>
          <p class="moment__lead">
            Six pieces, laid out across seven days, in the formats each surface rewards. Thursday is
            blocked for a shoot, so nothing lands on Thursday.
          </p>

          <Reveal class="moment__artifact">
            <div class="window">
              <div class="window__bar">
                <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span class="window__url">app.anomalia.so/plan</span>
              </div>
              <div class="window__body">
                <div class="panel__head">
                  <div>
                    <Text variant="caption" as="p">Proposed plan</Text>
                    <Text variant="headline" as="h5">Week 34</Text>
                  </div>
                  <Badge variant="soft">6 pieces</Badge>
                </div>
                <Divider />
                <div class="week">
                  {#each week as day (day.day)}
                    <div class="day" data-blocked={day.blocked ? '' : undefined}>
                      <span class="day__name">{day.day}</span>
                      {#each day.items as item (item.label)}
                        <span class="piece">
                          <span class="piece__art art--{item.art}" aria-hidden="true"></span>
                          <span class="piece__label">{item.label}</span>
                        </span>
                      {/each}
                      {#if day.blocked}
                        <span class="day__blocked">{day.blocked}</span>
                      {/if}
                    </div>
                  {/each}
                </div>
                <Divider />
                <div class="panel__foot">
                  <Text variant="footnote" tone="muted">Approve the week, or open any piece.</Text>
                  <Button size="sm" pill>Approve</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </article>

        <p class="aside">No prompt was written. The plan came out of the company, not out of you.</p>

        <!-- 03 · Publisher -->
        <article class="moment" id="publisher" data-index="2" bind:this={momentEls[2]}>
          <p class="stamp moment__stamp">Mon 11:00 · Publisher</p>
          <h4 class="moment__title">It goes out, everywhere you own.</h4>
          <p class="moment__lead">
            One queue for social, blog and ads — cut per surface, scheduled at the hour that surface
            rewards, and re-synced the moment you edit anything.
          </p>

          <Reveal class="moment__artifact moment__artifact--split">
            <div class="split">
              <div class="window">
                <div class="window__bar">
                  <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                  <span class="window__url">app.anomalia.so/content</span>
                </div>
                <div class="window__body">
                  <Table label="This week's queue" density="compact">
                    <table>
                      <thead>
                        <tr>
                          <th scope="col">Work</th>
                          <th scope="col">Surfaces</th>
                          <th scope="col">State</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each queue as row (row.work)}
                          <tr>
                            <td>
                              <span class="cell__title">{row.work}</span>
                              <span class="cell__sub">{row.kind}</span>
                            </td>
                            <td>
                              <span class="cell__glyphs">
                                {#each row.on as name (name)}
                                  {@render glyph(name)}
                                {/each}
                              </span>
                            </td>
                            <td><Badge variant="soft" tone={row.tone} dot>{row.state}</Badge></td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </Table>
                </div>
              </div>

              <div class="phone">
                <div class="phone__screen">
                  <header class="post__head">
                    <Avatar size="xs" name="Acme Studio" />
                    <span class="post__name">acmestudio</span>
                    {@render glyph('instagram')}
                  </header>

                  <div class="post__art" aria-hidden="true">
                    <span class="post__kicker">Behind the scenes</span>
                    <span class="post__headline">Three fabrics,<br />one jacket.</span>
                    <span class="post__mark"></span>
                  </div>

                  <div class="post__meta">
                    <span class="post__caption">
                      <b>acmestudio</b> Every panel starts as a swatch on the bench. Here is how the
                      three end up in one piece.
                    </span>
                    <span class="post__stats">1,284 likes · 09:16</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </article>

        <p class="aside">Three surfaces, one queue, one approval — and it was on Monday.</p>

        <!-- 04 · Back to the brain -->
        <article class="moment" id="friday" data-index="3" bind:this={momentEls[3]}>
          <p class="stamp moment__stamp">Fri 18:00 · Back to the brain</p>
          <h4 class="moment__title">Friday's numbers become Monday's plan.</h4>
          <p class="moment__lead">
            What performed goes back where it came from, so next week is written knowing it. A
            scheduler cannot do this. Neither can a chatbot. Together they still cannot.
          </p>

          <Reveal class="moment__artifact">
            <div class="window">
              <div class="window__bar">
                <span class="window__dots" aria-hidden="true"><i></i><i></i><i></i></span>
                <span class="window__url">app.anomalia.so/analytics</span>
              </div>
              <div class="window__body window__body--pad">
                <div class="results">
                  <Stat label="Reach" value="184.2k" delta="+12%" direction="up" hint="vs last week">
                    {#snippet chart()}
                      <Sparkline values={reach} area label="Reach trending up" />
                    {/snippet}
                  </Stat>
                  <Stat label="Approved unchanged" value="92" unit="%" delta="+6pt" direction="up" hint="of the week" />
                  <Stat label="Your time on it" value="11" unit="min" delta="−4h" direction="down" hint="vs last week" />
                </div>
                <Divider class="results__rule" />
                <p class="loop">
                  <span class="loop__glyph" aria-hidden="true">↺</span>
                  <Text variant="footnote" tone="muted">
                    Fed back into the brain · next plan Monday 09:14
                  </Text>
                </p>
              </div>
            </div>
          </Reveal>
        </article>
      </div>
    </div>

    <!-- ── 6 · The comparison ───────────────────────────────────────────── -->
    <section class="band band--tint" id="compare">
      <header class="band__head">
        <p class="eyebrow">Compare</p>
        <h3 class="band__title">One Anomalia, or three of everything else.</h3>
        <p class="band__lead">
          The scheduler does not know your brand. The chatbot does not publish. The agency does both
          and bills you for it.
        </p>
      </header>

      <div class="compare">
        <Table label="Anomalia compared with the alternatives">
          <table>
            <thead>
              <tr>
                <th scope="col">What you need</th>
                <th scope="col">Scheduler</th>
                <th scope="col">Scheduler + AI chat</th>
                <th scope="col">Agency</th>
                <th scope="col" class="col--us">Anomalia</th>
              </tr>
            </thead>
            <tbody>
              {#each compareRows as [label, a, b, c, d] (label)}
                <tr>
                  <td>{label}</td>
                  <td>{@render tick(a)}</td>
                  <td>{@render tick(b)}</td>
                  <td>{@render tick(c)}</td>
                  <td class="col--us">{@render tick(d)}</td>
                </tr>
              {/each}
              <tr class="compare__cost">
                <td>Per month</td>
                <td>€25 <span class="cell__sub">+ your evenings</span></td>
                <td>€45 <span class="cell__sub">+ your evenings</span></td>
                <td>€2,000<span class="cell__sub">and up</span></td>
                <td class="col--us">€49<span class="cell__sub">everything above</span></td>
              </tr>
            </tbody>
          </table>
        </Table>
      </div>
    </section>

    <!-- ── 7 · Pricing ──────────────────────────────────────────────────── -->
    <section class="band" id="price">
      <header class="band__head">
        <p class="eyebrow">Pricing</p>
        <h3 class="band__title">Less than one freelance post.</h3>
        <p class="band__lead">Per brand, not per seat. Cancel by closing the tab.</p>
      </header>

      <div class="plans">
        <Card>
          <p class="plan__name">Free</p>
          <p class="plan__price">€0<span class="plan__period">forever</span></p>
          <p class="plan__note">One brand, weekly plan, everything reviewed by you.</p>
          <Divider class="plan__rule" />
          <ul class="plan__list">
            <li>One brand</li>
            <li>Brain, plan and queue</li>
            <li>Two surfaces</li>
          </ul>
          <Button fullWidth pill variant="outline">Start free</Button>
        </Card>

        <Card variant="elevated" selected class="plan--featured">
          <div class="plan__head">
            <p class="plan__name">Studio</p>
            <Badge variant="solid" size="sm">Most used</Badge>
          </div>
          <p class="plan__price">€49<span class="plan__period">per brand, per month</span></p>
          <p class="plan__note">The whole run: brain, agents, publisher, autopilot.</p>
          <Divider class="plan__rule" />
          <ul class="plan__list">
            <li>Every surface, including blog and ads</li>
            <li>SEO and GEO audits</li>
            <li>Autopilot, or review everything</li>
            <li>CLI, MCP and API</li>
          </ul>
          <Button fullWidth pill>Start free, upgrade later</Button>
          <p class="plan__risk">14 days, no card. Keep everything it made either way.</p>
        </Card>
      </div>
    </section>

    <!-- ── 8 · Objections ───────────────────────────────────────────────── -->
    <section class="band band--tight">
      <header class="band__head band__head--left">
        <p class="eyebrow">Before you ask</p>
        <h3 class="band__title band__title--sm">The five questions everyone asks.</h3>
      </header>

      <Accordion bind:open={faqOpen} items={faq}>
        {#snippet children(value)}
          {#if value === 'post'}
            Not unless you turn Autopilot on. By default every piece waits in review and nothing
            leaves without a tap. The switch is per brand, and you can flip it back mid-week.
          {:else if value === 'voice'}
            It writes from your voice rules and your own past posts, not from a generic model
            persona — and 92% of pieces go out with no edit at all. The ones that do not, you fix in
            the queue, and it learns from the fix.
          {:else if value === 'marketing'}
            No. That is the point of the brain: you describe the company once, in your words, and
            the strategy, the cadence and the formats come from the product. Most owners never open
            anything but the approval queue.
          {:else if value === 'stop'}
            Yes. Pause the plan and everything not yet published stops immediately. Nothing is ever
            queued outside the window you can see.
          {:else}
            Everything it wrote, designed and scheduled is yours — export the brain, the plan and the
            content, in the open formats they were stored in. No lock-in and no ransom.
          {/if}
        {/snippet}
      </Accordion>
    </section>

    <!-- ── 9 · The ask, again ───────────────────────────────────────────── -->
    <section class="closer">
      <div class="aurora aurora--closer" aria-hidden="true"></div>
      <div class="closer__inner">
        <h3 class="closer__title">Give it one week.</h3>
        <p class="closer__lead">
          Put in your website. It reads your company, writes next week and shows it to you — before
          you decide anything.
        </p>

        <form class="capture capture--closer" onsubmit={(e) => e.preventDefault()}>
          <!-- No visible label on the inverted band: the label renders in ink
               and would sit unreadable on the dark surface, and the sentence
               above already names the field. The accessible name stays. -->
          <TextField
            bind:value={siteFooter}
            aria-label="Your website"
            placeholder="acmestudio.com"
            size="lg"
            fieldClass="capture__field"
          />
          <Button size="lg" variant="secondary" pill type="submit">Start free</Button>
        </form>

        <p class="closer__risk">No card · One brand free forever · Cancel by closing the tab</p>
      </div>
    </section>

    <SiteFooter columns={footerColumns} wordmark="ANOMALIA">
      {#snippet brand()}
        <span class="wordmark">
          <span class="wordmark__mark" aria-hidden="true"></span>
          Anomalia
        </span>
        <Text variant="footnote" tone="muted" class="foot__tag">
          One brain, a team of agents and everywhere you publish — running as one week.
        </Text>
      {/snippet}

      {#snippet legal()}
        <Text variant="caption" tone="muted">© 2026 Anomalia · Made in Italy</Text>
      {/snippet}
    </SiteFooter>
  </div>
</div>

<style>
  .doc-page--wide {
    max-width: 1200px;
  }

  /*
    The page theme — the token layer for this mockup, which is the one place a
    raw value belongs. `--accent` and `--accent-2` are anomalia.so's, and
    `--an-brand` is re-pointed at them so the library's brand moments agree with
    the marketing paint. Nothing here touches `--an-accent`: ink stays the
    interactive colour, which is what keeps every control at the contrast the
    audit guarantees.
  */
  .frame {
    --accent: #c485fe;
    --accent-2: #ecb2ed;
    --an-brand: var(--accent);
    --display-weight: 300;
    --display-track: -0.04em;

    position: relative;
    margin-top: var(--an-space-6);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    /* `clip`, not `hidden`: `hidden` would make the frame a scroll container,
       and a scroll container that never scrolls kills the sticky rail. */
    overflow: clip;
    background: var(--an-surface);
  }

  .defs {
    position: absolute;
  }

  /* ── Aurora ────────────────────────────────────────────────────────────── */
  .aurora {
    position: absolute;
    inset: -35% -10% auto;
    height: 660px;
    pointer-events: none;
    background:
      radial-gradient(55% 70% at 28% 55%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 70%),
      radial-gradient(50% 70% at 76% 45%, color-mix(in srgb, var(--accent-2) 30%, transparent), transparent 72%);
    filter: blur(6px);
  }

  :global([data-theme='dark']) .aurora {
    opacity: 0.5;
  }

  /* ── Shared marketing type ─────────────────────────────────────────────── */
  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    color: var(--an-text);
    font-size: var(--an-text-callout-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: -0.02em;
    text-decoration: none;
  }

  .wordmark__mark {
    width: 20px;
    height: 20px;
    border-radius: var(--an-radius-md);
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
  }

  :global(.foot__tag) {
    margin-top: var(--an-space-3) !important;
    max-width: 34ch;
  }

  .eyebrow {
    margin: 0 0 var(--an-space-4);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
    font-weight: var(--an-weight-medium);
  }

  .stamp {
    margin: 0 0 var(--an-space-4);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-faint);
  }

  /* ── 1 · Hero ──────────────────────────────────────────────────────────── */
  .hero {
    position: relative;
    padding: var(--an-space-20) var(--an-space-8) 0;
    text-align: center;
    border-bottom: 1px solid var(--an-border);
  }

  .hero__inner {
    position: relative;
    max-width: 760px;
    margin: 0 auto;
  }

  /* The category line, as a pill rather than an eyebrow: it is the first thing
     read and it has to say what this is, not whisper it. */
  .pill-label {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    margin: 0 0 var(--an-space-6);
    padding: var(--an-space-2) var(--an-space-4);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-full);
    background: var(--an-surface);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .pill-label__dot {
    width: 8px;
    height: 8px;
    border-radius: var(--an-radius-full);
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
  }

  .hero__title {
    margin: 0;
    font-size: clamp(2.3rem, 5vw, 3.9rem);
    line-height: 1.04;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--an-text);
  }

  .hero__lead {
    margin: var(--an-space-5) auto 0;
    max-width: 54ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  /* ── Capture ───────────────────────────────────────────────────────────── */
  /* The field and the button are one object: same height, no gap wide enough to
     read as two decisions. The label sits above and is real, not a placeholder
     pretending to be one. */
  .capture {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: var(--an-space-3);
    margin-top: var(--an-space-8);
    text-align: start;
  }

  :global(.capture__field) {
    width: min(340px, 100%);
  }

  .capture__note {
    margin: var(--an-space-4) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .capture__note a {
    color: var(--an-text);
  }

  .hero__live {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    margin: var(--an-space-8) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .hero__count {
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
  }

  /* The screenshot runs off the bottom of the section behind a fade: enough of
     the product to be believed, not enough to be finished with. */
  .hero__shot {
    position: relative;
    max-width: 880px;
    margin: var(--an-space-16) auto 0;
    padding-bottom: var(--an-space-16);
  }

  .hero__fade {
    position: absolute;
    inset: auto 0 0;
    height: 180px;
    background: linear-gradient(180deg, transparent, var(--an-surface) 82%);
  }

  /* ── Window mockup ─────────────────────────────────────────────────────── */
  .window {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-2xl);
    overflow: hidden;
    background: var(--an-surface-raised);
    box-shadow: var(--an-shadow-lg);
    text-align: start;
  }

  .window__bar {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    padding: var(--an-space-3) var(--an-space-4);
    border-bottom: 1px solid var(--an-border);
    background: var(--an-surface-sunken);
  }

  .window__dots {
    display: inline-flex;
    gap: 6px;
  }

  .window__dots i {
    width: 9px;
    height: 9px;
    border-radius: var(--an-radius-full);
    background: var(--an-border-strong);
  }

  .window__url {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  .window__body--pad {
    padding: var(--an-space-5);
  }

  .panel__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-4);
  }

  .panel__body {
    padding: var(--an-space-4);
  }

  .panel__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-4);
  }

  .trace {
    display: flex;
    flex-direction: column;
  }

  /* ── 2 · Surfaces ──────────────────────────────────────────────────────── */
  .surfaces {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-4) var(--an-space-8);
    padding: var(--an-space-6) var(--an-space-8);
    border-bottom: 1px solid var(--an-border);
    background: var(--an-surface-sunken);
  }

  .surfaces__label {
    margin: 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .surfaces__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--an-space-3) var(--an-space-6);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .surfaces__item {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  /* ── Bands ─────────────────────────────────────────────────────────────── */
  .band {
    padding: var(--an-space-20) var(--an-space-8);
    border-bottom: 1px solid var(--an-border);
  }

  .band--tint {
    background: color-mix(in srgb, var(--accent) 4%, var(--an-surface-sunken));
  }

  .band--tight {
    padding-block: var(--an-space-16);
  }

  .band--head-only {
    padding-bottom: var(--an-space-12);
    border-bottom: none;
  }

  .band__head {
    max-width: 720px;
    margin: 0 auto var(--an-space-12);
    text-align: center;
  }

  .band__head--left {
    margin-inline: 0;
    text-align: start;
  }

  .band__title {
    margin: 0;
    font-size: clamp(1.8rem, 3.4vw, 2.7rem);
    line-height: 1.1;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--an-text);
  }

  .band__title--sm {
    font-size: clamp(1.5rem, 2.6vw, 2rem);
  }

  .band__lead {
    margin: var(--an-space-4) auto 0;
    max-width: 56ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  .band__cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--an-space-3);
    margin-top: var(--an-space-12);
  }

  /* ── 3 · Pain ──────────────────────────────────────────────────────────── */
  .pains {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-8);
  }

  .pain {
    padding-top: var(--an-space-5);
    border-top: 1px solid var(--an-border-strong);
  }

  /* The figure is the argument, so it gets the display size and the brand hue —
     the one number on the page allowed to shout. */
  .pain__figure {
    margin: 0;
    font-size: clamp(2.6rem, 5vw, 3.4rem);
    line-height: 1;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    font-variant-numeric: tabular-nums;
    background: linear-gradient(120deg, var(--an-text), color-mix(in srgb, var(--accent) 85%, var(--an-text)));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .pain__claim {
    margin: var(--an-space-4) 0 0;
    font-size: var(--an-text-callout-size);
    line-height: 1.55;
    color: var(--an-text);
  }

  .pain__source {
    margin: var(--an-space-3) 0 0;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  /* ── 4 · Outcomes ──────────────────────────────────────────────────────── */
  .outcomes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--an-space-10);
  }

  .outcome__index {
    display: block;
    margin-bottom: var(--an-space-4);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  .outcome__title {
    margin: 0;
    font-size: var(--an-text-title-3-size);
    line-height: var(--an-text-title-3-line);
    letter-spacing: var(--an-text-title-3-track);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .outcome__body {
    margin: var(--an-space-3) 0 0;
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  /* ── 5 · The demo spine ────────────────────────────────────────────────── */
  .run {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    border-bottom: 1px solid var(--an-border);
  }

  .rail {
    border-inline-end: 1px solid var(--an-border);
    background: color-mix(in srgb, var(--accent) 4%, var(--an-surface-rail));
  }

  .rail__sticky {
    position: sticky;
    top: var(--an-space-20);
    padding: var(--an-space-10) var(--an-space-5);
  }

  .rail__clock {
    margin: 0;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-title-3-size);
    letter-spacing: var(--an-text-title-3-track);
    color: var(--an-text);
  }

  .rail__actor {
    margin: var(--an-space-2) 0 var(--an-space-6);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .rail__ticks {
    display: grid;
    gap: var(--an-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .rail__tick {
    height: 2px;
    width: var(--an-space-8);
    background: var(--an-border-strong);
    transition: background var(--an-duration-medium-1) var(--an-ease-standard);
  }

  .rail__tick[data-on] {
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
  }

  .moment {
    padding: var(--an-space-16) var(--an-space-10);
  }

  .moment__title {
    margin: 0;
    font-size: clamp(1.5rem, 2.6vw, 2.1rem);
    line-height: 1.12;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--an-text);
  }

  .moment__lead {
    margin: var(--an-space-4) 0 0;
    max-width: 54ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  /* The rail carries the clock at desktop width, so the stamp inside the moment
     would say it twice. It comes back below 900px, where the rail is gone. */
  @media (min-width: 901px) {
    .moment__stamp {
      display: none;
    }
  }

  :global(.moment__artifact) {
    display: block;
    margin-top: var(--an-space-8);
    max-width: 640px;
  }

  :global(.moment__artifact--split) {
    max-width: none;
  }

  .aside {
    margin: 0;
    padding: var(--an-space-6) var(--an-space-10);
    border-block: 1px solid var(--an-border);
    background: color-mix(in srgb, var(--accent) 5%, var(--an-surface-sunken));
    font-size: var(--an-text-callout-size);
    letter-spacing: var(--an-text-callout-track);
    color: var(--an-text);
  }

  /* ── Generated artwork ─────────────────────────────────────────────────── */
  /* Anomalia renders the image as well as the words, so the mockups cannot use
     stock photography — this is the same two hues, rotated, which is what the
     product's own output looks like. */
  .art,
  .piece__art,
  .post__art {
    background:
      radial-gradient(70% 90% at 20% 15%, color-mix(in srgb, var(--accent-2) 70%, transparent), transparent 70%),
      linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 80%, var(--an-surface)));
  }

  .art {
    display: block;
    aspect-ratio: 1;
    border-radius: var(--an-radius-lg);
  }

  .art--2 {
    background:
      radial-gradient(60% 80% at 80% 20%, color-mix(in srgb, var(--accent) 65%, transparent), transparent 70%),
      linear-gradient(200deg, var(--accent-2), color-mix(in srgb, var(--accent) 45%, var(--an-surface)));
  }

  .art--3 {
    background:
      radial-gradient(70% 70% at 30% 80%, color-mix(in srgb, var(--accent-2) 75%, transparent), transparent 72%),
      linear-gradient(20deg, color-mix(in srgb, var(--accent) 70%, var(--an-text)), var(--accent-2));
  }

  .art--4 {
    background:
      radial-gradient(80% 60% at 60% 30%, color-mix(in srgb, var(--accent) 55%, transparent), transparent 70%),
      linear-gradient(160deg, color-mix(in srgb, var(--accent-2) 60%, var(--an-surface)), var(--accent));
  }

  .art--5 {
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
  }

  .art--6 {
    background: linear-gradient(300deg, var(--accent-2), color-mix(in srgb, var(--accent) 70%, var(--an-text)));
  }

  .moodboard {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--an-space-2);
    padding: var(--an-space-4);
  }

  .swatches {
    display: inline-flex;
    gap: var(--an-space-2);
  }

  .swatch {
    width: 18px;
    height: 18px;
    border-radius: var(--an-radius-full);
    border: 1px solid var(--an-border);
  }

  .swatch--accent {
    background: var(--accent);
  }

  .swatch--accent-2 {
    background: var(--accent-2);
  }

  .swatch--ink {
    background: var(--an-text);
  }

  .swatch--paper {
    background: var(--an-surface-sunken);
  }

  /* ── Week strip ────────────────────────────────────────────────────────── */
  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .day {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    min-height: 132px;
    padding: var(--an-space-3) var(--an-space-2);
    border-inline-start: 1px solid var(--an-border);
  }

  .day:first-child {
    border-inline-start: none;
  }

  .day[data-blocked] {
    background: var(--an-surface-sunken);
  }

  .day__name {
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .piece {
    display: block;
    border-radius: var(--an-radius-md);
    overflow: hidden;
    border: 1px solid var(--an-border);
    background: var(--an-surface);
  }

  .piece__art {
    display: block;
    height: 34px;
  }

  .piece__label {
    display: block;
    padding: var(--an-space-1) var(--an-space-2);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
    text-align: center;
  }

  .day__blocked {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
    text-align: center;
  }

  /* ── Tables ────────────────────────────────────────────────────────────── */
  .cell__title {
    display: block;
    color: var(--an-text);
  }

  .cell__sub {
    display: block;
    margin-top: var(--an-space-1);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  .cell__glyphs {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    color: var(--an-text-muted);
  }

  .compare {
    max-width: 940px;
    margin: 0 auto;
  }

  /* Our column is tinted, not bolded: the eye finds it without the table
     shouting, and the tint survives greyscale as a lighter band. */
  .compare :global(th.col--us),
  .compare :global(td.col--us) {
    background: color-mix(in srgb, var(--accent) 9%, transparent);
  }

  .tick {
    color: var(--an-text);
  }

  .tick--off {
    color: var(--an-text-faint);
  }

  .compare__cost :global(td) {
    font-weight: var(--an-weight-semibold);
  }

  /* ── Split: the app beside the post ────────────────────────────────────── */
  .split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 268px;
    gap: var(--an-space-8);
    align-items: center;
  }

  .phone {
    border: 1px solid var(--an-border-strong);
    border-radius: 30px;
    padding: 8px;
    background: var(--an-surface-raised);
    box-shadow: var(--an-shadow-xl);
  }

  .phone__screen {
    border-radius: 23px;
    overflow: hidden;
    background: var(--an-surface);
  }

  .post__head {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    padding: var(--an-space-3);
  }

  .post__name {
    flex: 1;
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .post__art {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--an-space-2);
    aspect-ratio: 4 / 5;
    padding: var(--an-space-4);
  }

  .post__kicker {
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: color-mix(in srgb, #09090b 65%, transparent);
  }

  .post__headline {
    font-size: 1.45rem;
    line-height: 1.1;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: #09090b;
  }

  .post__mark {
    position: absolute;
    right: var(--an-space-4);
    top: var(--an-space-4);
    width: 16px;
    height: 16px;
    border-radius: var(--an-radius-sm);
    background: color-mix(in srgb, #09090b 82%, transparent);
  }

  .post__meta {
    display: grid;
    gap: var(--an-space-2);
    padding: var(--an-space-3);
  }

  .post__caption {
    font-size: var(--an-text-footnote-size);
    line-height: var(--an-text-footnote-line);
    color: var(--an-text-muted);
  }

  .post__caption b {
    color: var(--an-text);
    font-weight: var(--an-weight-semibold);
  }

  .post__stats {
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  /* ── Results ───────────────────────────────────────────────────────────── */
  .results {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--an-space-6);
  }

  :global(.results__rule) {
    margin: var(--an-space-5) 0 var(--an-space-4) !important;
  }

  .loop {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    margin: 0;
  }

  .loop__glyph {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: var(--an-radius-full);
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #09090b;
    font-size: var(--an-text-footnote-size);
  }

  /* ── 7 · Pricing ───────────────────────────────────────────────────────── */
  .plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--an-space-5);
    max-width: 760px;
    margin: 0 auto;
    align-items: start;
  }

  .plan__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-3);
  }

  .plan__name {
    margin: 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .plan__price {
    display: flex;
    align-items: baseline;
    gap: var(--an-space-2);
    margin: var(--an-space-3) 0 0;
    font-size: var(--an-text-title-1-size);
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--an-text);
  }

  .plan__period {
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-regular);
    letter-spacing: normal;
    color: var(--an-text-faint);
  }

  .plan__note {
    margin: var(--an-space-2) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  :global(.plan__rule) {
    margin: var(--an-space-4) 0 !important;
  }

  .plan__list {
    display: grid;
    gap: var(--an-space-2);
    margin: 0 0 var(--an-space-5);
    padding: 0;
    list-style: none;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .plan__list li {
    position: relative;
    padding-inline-start: var(--an-space-5);
  }

  .plan__list li::before {
    content: '';
    position: absolute;
    inset-inline-start: 0;
    top: 0.55em;
    width: var(--an-space-3);
    height: 1px;
    background: var(--an-border-strong);
  }

  .plan__risk {
    margin: var(--an-space-3) 0 0;
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
    text-align: center;
  }

  /* ── 9 · Closer ────────────────────────────────────────────────────────── */
  .closer {
    position: relative;
    padding: var(--an-space-20) var(--an-space-8);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    text-align: center;
    overflow: clip;
  }

  .aurora--closer {
    inset: auto -10% -30%;
    height: 620px;
    opacity: 0.7;
  }

  .closer__inner {
    position: relative;
    max-width: 640px;
    margin: 0 auto;
  }

  .closer__title {
    margin: 0;
    font-size: clamp(2rem, 4.4vw, 3rem);
    line-height: 1.08;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
  }

  .closer__lead {
    margin: var(--an-space-4) auto 0;
    max-width: 46ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.6;
    opacity: 0.72;
  }

  .capture--closer {
    margin-top: var(--an-space-8);
  }

  .closer__risk {
    margin: var(--an-space-4) 0 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    opacity: 0.5;
  }

  @media (max-width: 1000px) {
    .split {
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
    }

    .phone {
      max-width: 300px;
    }
  }

  @media (max-width: 900px) {
    .run {
      grid-template-columns: minmax(0, 1fr);
    }

    /* The rail becomes nothing on a phone: the stamp inside each moment carries
       the clock instead, and a sticky strip would just eat the screen. */
    .rail {
      display: none;
    }

    .hero,
    .band,
    .moment,
    .aside,
    .surfaces,
    .closer {
      padding-inline: var(--an-space-6);
    }

    .hero {
      padding-top: var(--an-space-12);
    }

    .moment {
      padding-block: var(--an-space-12);
    }

    .week {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .day {
      border-top: 1px solid var(--an-border);
    }
  }

  @media (max-width: 640px) {
    .hero,
    .band,
    .moment,
    .aside,
    .surfaces,
    .closer {
      padding-inline: var(--an-space-4);
    }

    /* Stacked, and the button goes full width: a 44px target beside a field is
       the first thing to break on a phone. */
    .capture {
      flex-direction: column;
      align-items: stretch;
    }

    :global(.capture__field) {
      width: 100%;
    }

    .week {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .moodboard {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
