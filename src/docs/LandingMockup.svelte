<!--
  The Anomalia landing mockup — the page itself, independent of where it is
  shown. It renders twice: inside the docs, framed as a card among the other
  showcases, and at /showcase/landing/full, edge to edge with the docs shell
  out of the way. `full` is the only difference between the two, and it only
  touches the frame: a landing page that needed a different build to be seen
  full-bleed would be a landing page nobody could trust the preview of.

  Landing mockup — Anomalia's home page, in the register that actually sells.

  Two references are fused here on purpose. The **structure** is a conversion
  page: claim and capture, the pain in numbers, the outcome in the reader's
  terms, the product running for a week, a comparison against what they pay
  today, price, objections, the ask again. The **surface** is the one modern
  AI landing pages have converged on and lightreel.ai executes cleanly — a
  full-bleed brand panel instead of a white page, the interaction itself in the
  hero rather than a screenshot of it, big heavy headings, sections built as
  tinted rounded cards with the product bleeding out of their edges, pill
  buttons with an arrow, and proof floating around the price.

  The paint is anomalia.so's, declared once as a page theme: `--accent`,
  `--accent-2`, and the brand panel they glow inside. The type is where the two
  references disagree — anomalia.so sets headings light, the reference sets them
  heavy — and a page that has to convert takes the heavy one, tightly tracked.

  Under all of it the library is unchanged: Card, Table, Badge, the chat trace,
  the tokens. `--an-accent` is untouched, so every control still clears the
  contrast the audit enforces, and the accent stays what it should be — identity
  and light, wired to nothing you can click.
-->
<script lang="ts">
  import { base } from '$app/paths';
  import {
    Accordion,
    Avatar,
    Badge,
    Button,
    Card,
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

  /** Edge to edge, with the docs chrome out of the way. */
  let { full = false }: { full?: boolean } = $props();

  const navLinks = [
    { label: 'Brain', href: '#brain' },
    { label: 'Distribution', href: '#publisher' },
    { label: 'Agents', href: '#agents' },
    { label: 'Pricing', href: '#price' }
  ];

  let site = $state('');
  let siteFooter = $state('');

  /* ── The hero showcase ─────────────────────────────────────────────────
     The mockup has about two seconds to say what the product is, so it shows
     the thing it makes — a finished post, in a phone — with the three layers
     annotated around it. A vertical log of steps is neither short nor
     expressive: it asks to be read, and nobody reads a hero. */
  const tags = [
    { n: '01', layer: 'Brain', line: 'Anomalia · dry, concrete, no hype' },
    { n: '02', layer: 'Agents', line: 'Wrote and shot this reel' },
    { n: '03', layer: 'Distribution', line: 'Instagram · Tue 18:00' }
  ];

  /* The reel in the phone is real: Anomalia's own top-rated UGC video, straight
     out of the product's media bucket. A mockup with invented content is a
     mockup; a mockup with the highest-scoring thing the product actually made
     is the argument. */
  const reel = {
    src: `${base}/showcase/anomalia-reel.mp4`,
    caption: '59 drafts. One tap — fixed, scheduled, approved. Drink still cold.'
  };

  let runEl = $state<HTMLElement | null>(null);
  let step = $state(0);
  const DONE = tags.length;

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
        for (let i = 1; i <= DONE; i++) {
          timers.push(setTimeout(() => (step = i), 500 + (i - 1) * 520));
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

  /* ── Content ───────────────────────────────────────────────────────────── */
  const surfaces = ['instagram', 'tiktok', 'linkedin', 'x', 'youtube', 'facebook', 'reddit', 'blog', 'ads'];

  /* Market numbers, with the sources they came with. A landing page that makes
     up its statistics converts exactly once.

     Each one carries a picture of itself. A column of big percentages is a
     column nobody reads: the calendar with five posts in it, the week with six
     of its 168 hours spent, and the search everyone else turns up in say the
     same thing in the time it takes to glance. */
  const pains = [
    {
      viz: 'gaps',
      figure: 64,
      suffix: '%',
      claim: 'of small business owners cannot keep a consistent social presence.',
      source: 'Buffer, 2025'
    },
    {
      viz: 'hours',
      figure: 73,
      suffix: '%',
      claim: 'of them name lack of time as the reason. Not ideas. Time.',
      source: 'Buffer, 2025'
    },
    {
      viz: 'search',
      figure: 97,
      suffix: '%',
      claim: 'of people search online before choosing a business. If you are not there, someone else is.',
      source: 'BrightLocal'
    }
  ];

  /* A month of posting, as it actually goes: two good weeks, then life. */
  const posted = [
    true, false, true, false, false, false, false,
    true, false, false, true, false, false, false,
    false, false, true, false, false, false, false,
    false, false, false, false, false, false, false
  ];

  /* 168 hours in a week. Six of them are the ones this page is about. */
  const spentHours = new Set([54, 55, 79, 80, 128, 129]);

  const searchRows = [
    { label: 'Google', who: 'A competitor', w: 92 },
    { label: 'ChatGPT', who: 'A competitor', w: 78 },
    { label: 'Instagram', who: 'A competitor', w: 64 },
    { label: 'You', who: 'Not found', w: 0 }
  ];

  const outcomes = [
    {
      viz: 'week',
      title: 'A week of content, every week',
      body: 'Posts, carousels, reels and articles planned, written, designed and queued. You open the app on Monday and it is done.'
    },
    {
      viz: 'cited',
      title: 'Found on Google, quoted by ChatGPT',
      body: 'Long-form articles, technical SEO and GEO audits — so you turn up in the search box and in the answer box.'
    },
    {
      viz: 'approve',
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

{#snippet painViz(kind: string)}
  {#if kind === 'gaps'}
    <div class="viz">
      <div class="viz__head">
        <span>Your last month</span>
        <span class="viz__mono">5 posts</span>
      </div>
      <div class="gaps">
        {#each posted as on, i (i)}
          <i class="gap" data-on={on ? '' : undefined}></i>
        {/each}
      </div>
    </div>
  {:else if kind === 'hours'}
    <div class="viz">
      <div class="viz__head">
        <span>Your week</span>
        <span class="viz__mono">6 / 168 h</span>
      </div>
      <div class="hours">
        {#each Array(168) as _, i (i)}
          <i class="hour" data-on={spentHours.has(i) ? '' : undefined}></i>
        {/each}
      </div>
    </div>
  {:else}
    <div class="viz">
      <div class="viz__head">
        <span>“best studio near me”</span>
      </div>
      <ul class="serp">
        {#each searchRows as row (row.label)}
          <li class="serp__row" data-empty={row.w === 0 ? '' : undefined}>
            <span class="serp__label">{row.label}</span>
            <span class="serp__bar" style="--w: {row.w}%"></span>
            <span class="serp__who">{row.who}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
{/snippet}

{#snippet outcomeViz(kind: string)}
  {#if kind === 'week'}
    <div class="viz viz--light">
      <div class="viz__head">
        <span>Week 34</span>
        <span class="viz__mono">6 pieces</span>
      </div>
      <div class="mini-week">
        {#each week as day (day.day)}
          <div class="mini-day">
            <span class="mini-day__name">{day.day.charAt(0)}</span>
            {#each day.items as item (item.label)}
              <span class="mini-day__art art--{item.art}"></span>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  {:else if kind === 'cited'}
    <div class="viz viz--light">
      <div class="viz__head">
        <span>“who makes ultralight jackets?”</span>
      </div>
      <div class="answer">
        <span class="answer__line"></span>
        <span class="answer__line answer__line--short"></span>
        <span class="answer__cite">
          <span class="answer__mark" aria-hidden="true"></span>
          Acme Studio
          <Badge variant="soft" tone="success" size="sm">cited</Badge>
        </span>
      </div>
      <div class="rank">
        <span class="rank__pos">#1</span>
        <span class="rank__url">acmestudio.com/ultralight</span>
      </div>
    </div>
  {:else}
    <div class="viz viz--light">
      <div class="viz__head">
        <span>This week's queue</span>
        <span class="viz__mono">11:04</span>
      </div>
      <ul class="approve">
        {#each ['Studio tour · Reel', 'How we price · Article', 'Three fabrics · Carousel'] as row (row)}
          <li class="approve__row">
            <span class="approve__tick" aria-hidden="true">✓</span>
            {row}
          </li>
        {/each}
      </ul>
      <span class="approve__all">Approve all</span>
    </div>
  {/if}
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


<div class="frame" class:frame--full={full}>
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

    <!-- ── 1 · The brand panel: claim, capture, and the thing itself ─────── -->
    <section class="hero" id="top">
      <div class="panel">
        <div class="aurora" aria-hidden="true"></div>

        <div class="panel__grid">
          <div class="hero__copy">
            <p class="kicker">Three layers, one system</p>
            <h2 class="hero__title">Your marketing, done before Monday morning.</h2>
            <p class="hero__lead">
              A brain that knows your company, a distribution layer that publishes everywhere you
              own, and a team of agents doing the work in between. You approve in one tap.
            </p>

            <form class="capture" onsubmit={(e) => e.preventDefault()}>
              <div class="capture__input">
                <TextField
                bind:value={site}
                label="Start with your website"
                placeholder="acmestudio.com"
                size="lg"
                  fieldClass="capture__field"
                />
              </div>
              <Button size="lg" variant="secondary" pill type="submit">
                Start free
                {#snippet trailing()}<span aria-hidden="true">→</span>{/snippet}
              </Button>
            </form>

            <p class="hero__note">
              No card · One brand free, forever · You approve every piece
            </p>

            <p class="hero__live">
              <span class="hero__live-glyphs">
                {@render glyph('instagram')}
                {@render glyph('tiktok')}
                {@render glyph('linkedin')}
              </span>
              <b><Counter value={1284} /></b> pieces published by Anomalia today
              <a class="hero__api" href="#run">&lt;/&gt; or run it from your terminal</a>
            </p>
          </div>

          <!-- The showcase: what it makes, with the three layers labelled on
               top of it. Each tag lands in sequence, which is the shortest
               possible way to say brain → agents → out the door. -->
          <div class="showcase" bind:this={runEl}>
            <div class="phone phone--hero">
              <div class="phone__screen">
                <header class="post__head">
                  <Avatar size="xs" name="Anomalia" />
                  <span class="post__name">anomalia.so</span>
                  {@render glyph('instagram')}
                </header>

                <div class="post__art post__art--reel">
                  <!-- Muted, looping and inline: an autoplaying reel is only
                       allowed to start without a gesture when it is silent, and
                       the gradient underneath is what shows if it never loads. -->
                  <video src={reel.src} autoplay muted loop playsinline aria-label="A reel Anomalia wrote, shot and scheduled for itself"
                  ></video>
                </div>

                <div class="post__meta">
                  <span class="post__caption">
                    <b>anomalia.so</b> {reel.caption}
                  </span>
                  <span class="post__stats">Made by Anomalia · scheduled Tue 18:00</span>
                </div>
              </div>
            </div>

            {#each tags as tag, i (tag.n)}
              <div class="tag tag--{tag.n}" data-in={step > i ? '' : undefined}>
                <span class="tag__n" aria-hidden="true">{tag.n}</span>
                <span class="tag__text">
                  <b>{tag.layer}</b>
                  <span>{tag.line}</span>
                </span>
              </div>
            {/each}
          </div>
        </div>

        <div class="panel__surfaces">
          <p class="panel__surfaces-label">Publishes to</p>
          <ul class="surfaces__list">
            {#each surfaces as surface (surface)}
              <li class="surfaces__item">
                {@render glyph(surface)}
                <span>{@render surfaceName(surface)}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </section>

    <!-- ── 2 · The pain ─────────────────────────────────────────────────── -->
    <section class="band">
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
              {@render painViz(pain.viz)}
              <p class="pain__figure"><Counter value={pain.figure} suffix={pain.suffix} /></p>
              <p class="pain__claim">{pain.claim}</p>
              <p class="pain__source">{pain.source}</p>
            </div>
          </Reveal>
        {/each}
      </div>
    </section>

    <!-- ── 3 · The outcome ──────────────────────────────────────────────── -->
    <section class="band band--tint">
      <header class="band__head">
        <p class="eyebrow">What you get</p>
        <h3 class="band__title">Hand it over on Monday.<br />Read the results on Friday.</h3>
      </header>

      <div class="outcomes">
        {#each outcomes as outcome, i (outcome.title)}
          <Reveal index={i}>
            <article class="outcome">
              {@render outcomeViz(outcome.viz)}
              <span class="outcome__index" aria-hidden="true">0{i + 1}</span>
              <h4 class="outcome__title">{outcome.title}</h4>
              <p class="outcome__body">{outcome.body}</p>
            </article>
          </Reveal>
        {/each}
      </div>

      <div class="band__cta">
        <Button size="lg" pill>
          Start free
          {#snippet trailing()}<span aria-hidden="true">→</span>{/snippet}
        </Button>
        <Text variant="footnote" tone="muted">Set up in the time it takes to read the next section.</Text>
      </div>
    </section>

    <!-- ── 4 · One week, as four cards ──────────────────────────────────── -->
    <section class="band" id="run">
      <header class="band__head">
        <p class="eyebrow">How it works</p>
        <h3 class="band__title">One week, start to finish.</h3>
        <p class="band__lead">
          Not a diagram of the product — the product, on the clock, from the Monday it reads your
          company to the Friday it learns from the results.
        </p>
      </header>

      <div class="features">
        <!-- 01 · Brain -->
        <article class="feature feature--a" id="brain">
          <div class="feature__copy">
            <p class="chip">Mon 09:14 · Brain</p>
            <h4 class="feature__title">It already knows your company.</h4>
            <p class="feature__body">
              Your site, your past posts, your documents, your products — read once and kept. You
              never brief it twice, and every piece it writes traces back to something you can open.
            </p>
            <a class="link-cta" href="#price">See what it learns <span aria-hidden="true">→</span></a>
          </div>

          <div class="feature__shot">
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
              </div>
            </div>
          </div>
        </article>

        <!-- 02 · Agents -->
        <article class="feature feature--b feature--flip" id="agents">
          <div class="feature__copy">
            <p class="chip">Mon 09:16 · Agents</p>
            <h4 class="feature__title">Two minutes later, the week exists.</h4>
            <p class="feature__body">
              Six pieces, laid out across seven days, in the formats each surface rewards. Thursday
              is blocked for a shoot, so nothing lands on Thursday.
            </p>
            <a class="link-cta" href="#price">See a full week <span aria-hidden="true">→</span></a>
          </div>

          <div class="feature__shot">
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
          </div>
        </article>

        <!-- 03 · Publisher -->
        <article class="feature feature--c" id="publisher">
          <div class="feature__copy">
            <p class="chip">Mon 11:00 · Distribution</p>
            <h4 class="feature__title">It goes out, everywhere you own.</h4>
            <p class="feature__body">
              One queue for social, blog and ads — cut per surface, scheduled at the hour that
              surface rewards, re-synced the moment you edit anything.
            </p>
            <a class="link-cta" href="#compare">Compare with your stack <span aria-hidden="true">→</span></a>
          </div>

          <div class="feature__shot feature__shot--pair">
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
                    <b>acmestudio</b> Every panel starts as a swatch on the bench.
                  </span>
                  <span class="post__stats">1,284 likes · 09:16</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <!-- 04 · Back to the brain -->
        <article class="feature feature--d feature--flip" id="friday">
          <div class="feature__copy">
            <p class="chip">Fri 18:00 · Back to the brain</p>
            <h4 class="feature__title">Friday's numbers become Monday's plan.</h4>
            <p class="feature__body">
              What performed goes back where it came from, so next week is written knowing it. A
              scheduler cannot do this. Neither can a chatbot. Together they still cannot.
            </p>
            <a class="link-cta" href="#price">Start the loop <span aria-hidden="true">→</span></a>
          </div>

          <div class="feature__shot">
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
          </div>
        </article>
      </div>
    </section>

    <!-- ── 5 · The comparison ───────────────────────────────────────────── -->
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

    <!-- ── 6 · Price, with the proof floating around it ─────────────────── -->
    <section class="band" id="price">
      <header class="band__head">
        <p class="eyebrow">Pricing</p>
        <h3 class="band__title">Less than one freelance post.</h3>
        <p class="band__lead">Per brand, not per seat. Cancel by closing the tab.</p>
      </header>

      <div class="price-stage">
        <!-- Numbers rather than testimonials: the product's own counters, in the
             position a landing page usually fills with invented quotes. -->
        <div class="float float--1" aria-hidden="false">
          <p class="float__figure">92%</p>
          <p class="float__label">of pieces go out with no edit at all</p>
        </div>
        <div class="float float--2">
          <p class="float__figure">11 min</p>
          <p class="float__label">median time an owner spends per week</p>
        </div>
        <div class="float float--3">
          <p class="float__figure">184k</p>
          <p class="float__label">pieces published by Anomalia so far</p>
        </div>

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

          <Card variant="elevated" selected>
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
            <Button fullWidth pill>
              Start free, upgrade later
              {#snippet trailing()}<span aria-hidden="true">→</span>{/snippet}
            </Button>
            <p class="plan__risk">14 days, no card. Keep everything it made either way.</p>
          </Card>
        </div>
      </div>
    </section>

    <!-- ── 7 · Objections ───────────────────────────────────────────────── -->
    <section class="band band--tight">
      <header class="band__head">
        <h3 class="band__title">Frequently asked.</h3>
      </header>

      <div class="faq">
        <Accordion bind:open={faqOpen} items={faq}>
          {#snippet children(value)}
            {#if value === 'post'}
              Not unless you turn Autopilot on. By default every piece waits in review and nothing
              leaves without a tap. The switch is per brand, and you can flip it back mid-week.
            {:else if value === 'voice'}
              It writes from your voice rules and your own past posts, not from a generic model
              persona — and 92% of pieces go out with no edit at all. The ones that do not, you fix
              in the queue, and it learns from the fix.
            {:else if value === 'marketing'}
              No. That is the point of the brain: you describe the company once, in your words, and
              the strategy, the cadence and the formats come from the product. Most owners never
              open anything but the approval queue.
            {:else if value === 'stop'}
              Yes. Pause the plan and everything not yet published stops immediately. Nothing is
              ever queued outside the window you can see.
            {:else}
              Everything it wrote, designed and scheduled is yours — export the brain, the plan and
              the content, in the open formats they were stored in. No lock-in and no ransom.
            {/if}
          {/snippet}
        </Accordion>
      </div>
    </section>

    <!-- ── 8 · The ask, again, on the brand panel ───────────────────────── -->
    <section class="closer">
      <div class="panel panel--closer">
        <div class="aurora aurora--closer" aria-hidden="true"></div>
        <div class="closer__inner">
          <h3 class="closer__title">Give it one week.</h3>
          <p class="closer__lead">
            Put in your website. It reads your company, writes next week and shows it to you —
            before you decide anything.
          </p>

          <form class="capture capture--closer" onsubmit={(e) => e.preventDefault()}>
            <TextField
              bind:value={siteFooter}
              aria-label="Your website"
              placeholder="acmestudio.com"
              size="lg"
              fieldClass="capture__field"
            />
            <Button size="lg" variant="secondary" pill type="submit">
              Start free
              {#snippet trailing()}<span aria-hidden="true">→</span>{/snippet}
            </Button>
          </form>

          <p class="closer__risk">No card · One brand free forever · Cancel by closing the tab</p>
        </div>
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

<style>

  /* Full-bleed: the card becomes the page. No border, no radius, no margin —
     the frame only ever existed to say "this is a mockup inside a doc". */
  .frame--full {
    margin-top: 0;
    border: none;
    border-radius: 0;
    min-height: 100vh;
  }


  /*
    The page theme — the token layer for this mockup, and the one place a raw
    value belongs. `--accent` and `--accent-2` are anomalia.so's; `--panel` is
    the brand surface the hero and the closer are painted on, fixed in both
    themes because a brand panel that inverts with the OS is not a brand.
    `--an-accent` is deliberately untouched: ink stays the interactive colour,
    which is what keeps every control at the contrast the audit guarantees.
  */
  .frame {
    --accent: #c485fe;
    --accent-2: #ecb2ed;
    --an-brand: var(--accent);
    --panel: #0e0917;
    --on-panel: #ffffff;
    --display-weight: var(--an-weight-bold);
    --display-track: -0.035em;

    position: relative;
    margin-top: var(--an-space-6);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    /* `clip`, not `hidden`: `hidden` makes the frame a scroll container, which
       silently breaks any sticky descendant. */
    overflow: clip;
    background: var(--an-surface);
  }

  .defs {
    position: absolute;
  }

  /* ── The brand panel ───────────────────────────────────────────────────── */
  /* A landing page that opens on a white page opens on nothing. This is the
     one large colour field on the site: near-black with the accent burning
     through it, inset so its corners read as a card rather than a band. */
  .panel {
    position: relative;
    border-radius: var(--an-radius-2xl);
    background: var(--panel);
    color: var(--on-panel);
    overflow: clip;
    padding: var(--an-space-16) var(--an-space-10) var(--an-space-8);
  }

  .aurora {
    position: absolute;
    inset: -30% -10% auto;
    height: 720px;
    pointer-events: none;
    background:
      radial-gradient(50% 60% at 22% 40%, color-mix(in srgb, var(--accent) 58%, transparent), transparent 70%),
      radial-gradient(46% 60% at 78% 30%, color-mix(in srgb, var(--accent-2) 46%, transparent), transparent 72%);
    filter: blur(10px);
    opacity: 0.85;
  }

  .panel__grid {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    gap: var(--an-space-10);
    align-items: center;
  }

  .kicker {
    margin: 0 0 var(--an-space-5);
    font-size: var(--an-text-footnote-size);
    color: color-mix(in srgb, var(--on-panel) 66%, transparent);
  }

  .hero__title {
    margin: 0;
    font-size: clamp(2.1rem, 4.2vw, 3.1rem);
    line-height: 1.02;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--on-panel);
  }

  .hero__lead {
    margin: var(--an-space-5) 0 0;
    max-width: 40ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.55;
    color: color-mix(in srgb, var(--on-panel) 72%, transparent);
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--an-space-5);
    margin-top: var(--an-space-8);
  }

  .hero__api {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-footnote-size);
    color: color-mix(in srgb, var(--on-panel) 72%, transparent);
    text-underline-offset: 3px;
  }

  .hero__note {
    margin: var(--an-space-6) 0 0;
    font-size: var(--an-text-footnote-size);
    color: color-mix(in srgb, var(--on-panel) 55%, transparent);
  }

  /* The capture is the CTA, so it lives with the words that argue for it —
     not docked to the mockup, where it reads as a control of the demo rather
     than the thing the page is asking you to do. */
  .capture {
    display: flex;
    align-items: flex-end;
    gap: var(--an-space-3);
    margin-top: var(--an-space-8);
    max-width: 470px;
  }

  /* The field sits on the dark panel, so the palette it reads from is
     re-pointed — for the field only. Tokens, not selectors: the component is
     untouched, and its control border keeps the 3:1 that SC 1.4.11 needs.
     The button is deliberately outside this scope; it is a white pill and
     wants the page's ordinary tokens. */
  .capture__input {
    flex: 1;
    min-width: 0;

    --an-text: var(--on-panel);
    --an-text-muted: color-mix(in srgb, var(--on-panel) 72%, transparent);
    --an-surface: color-mix(in srgb, var(--on-panel) 8%, transparent);
    --an-surface-raised: color-mix(in srgb, var(--on-panel) 8%, transparent);
    --an-border-control: color-mix(in srgb, var(--on-panel) 45%, transparent);
    --an-ring: var(--on-panel);
  }

  :global(.capture__field) {
    width: 100%;
  }

  .hero__live {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--an-space-2);
    margin: var(--an-space-8) 0 0;
    font-size: var(--an-text-footnote-size);
    color: color-mix(in srgb, var(--on-panel) 60%, transparent);
  }

  .hero__live b {
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--on-panel);
  }

  /* On the panel this chip has to carry its own colour: `--an-surface` is the
     page's white, and a mono-colour glyph like TikTok would land white on it. */
  .hero__live-glyphs {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-1);
    padding: var(--an-space-1) var(--an-space-2);
    border-radius: var(--an-radius-full);
    background: color-mix(in srgb, var(--on-panel) 12%, transparent);
    color: var(--on-panel);
  }

  /* ── The showcase ──────────────────────────────────────────────────────── */
  /* One phone with a finished post in it, and the three layers as tags landing
     on it in sequence. Short on purpose: a hero is looked at, not read, and the
     post is the only asset here that explains the product without a sentence. */
  .showcase {
    position: relative;
    display: flex;
    justify-content: center;
    padding-block: var(--an-space-10);
  }

  .phone--hero {
    width: 262px;
    rotate: 1.4deg;
  }

  .tag {
    position: absolute;
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    padding: var(--an-space-3) var(--an-space-4);
    border-radius: var(--an-radius-xl);
    background: var(--an-surface-raised);
    box-shadow: var(--an-shadow-xl);
    opacity: 0;
    translate: 0 8px;
    transition:
      opacity var(--an-duration-medium-3) var(--an-ease-standard),
      translate var(--an-duration-medium-3) var(--an-ease-emphasized-decelerate);
  }

  .tag[data-in] {
    opacity: 1;
    translate: 0 0;
  }

  .tag__n {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex: none;
    border-radius: var(--an-radius-full);
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #09090b;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 10px;
  }

  .tag__text {
    display: grid;
    gap: 1px;
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
    white-space: nowrap;
  }

  .tag__text b {
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  /* The tags sit around the post, never over the part of it that carries the
     message: the artwork's own headline is the thing the reader is meant to
     see first. */
  .tag--01 {
    top: 0;
    inset-inline-start: 0;
    rotate: -2.5deg;
  }

  .tag--02 {
    top: 36%;
    inset-inline-end: 0;
    rotate: 2deg;
  }

  .tag--03 {
    bottom: 0;
    inset-inline-start: 0;
    rotate: -1.5deg;
  }

  .panel__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-4);
  }

  .panel__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-4);
  }

  .panel__surfaces {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-3) var(--an-space-6);
    margin-top: var(--an-space-16);
    padding-top: var(--an-space-6);
    border-top: 1px solid color-mix(in srgb, var(--on-panel) 12%, transparent);
    color: color-mix(in srgb, var(--on-panel) 70%, transparent);
  }

  .panel__surfaces-label {
    margin: 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    opacity: 0.6;
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
  }

  .hero {
    padding: var(--an-space-6) var(--an-space-6) var(--an-space-10);
  }

  /* ── Wordmark ──────────────────────────────────────────────────────────── */
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

  /* ── Bands ─────────────────────────────────────────────────────────────── */
  .band {
    padding: var(--an-space-20) var(--an-space-8);
  }

  .band--tint {
    background: color-mix(in srgb, var(--accent) 5%, var(--an-surface-sunken));
  }

  .band--tight {
    padding-block: var(--an-space-16);
  }

  .eyebrow {
    margin: 0 0 var(--an-space-4);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
    font-weight: var(--an-weight-medium);
  }

  .band__head {
    max-width: 760px;
    margin: 0 auto var(--an-space-12);
    text-align: center;
  }

  .band__title {
    margin: 0;
    font-size: clamp(1.9rem, 3.6vw, 3rem);
    line-height: 1.06;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--an-text);
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

  /* ── Section visuals ───────────────────────────────────────────────────── */
  /* Every card in the first two sections opens with a picture of its own claim,
     drawn from tokens rather than illustrated: a month with five posts in it,
     a week with six hours spent, a search someone else wins. They are small,
     literal and readable in a glance — which is all a landing page gets. */
  /* A fixed height, not a minimum: three cards side by side whose headings
     start at three different heights is the thing that makes a grid of cards
     look assembled rather than designed. */
  .viz {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-3);
    height: 196px;
    overflow: hidden;
    margin-bottom: var(--an-space-6);
    padding: var(--an-space-4);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    background: var(--an-surface);
  }

  .viz--light {
    background: var(--an-surface-raised);
  }

  .viz__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--an-space-3);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  .viz__mono {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    color: var(--an-text-muted);
  }

  /* 64% — four weeks of intentions. The gaps are the content. */
  .gaps {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    align-content: center;
    flex: 1;
  }

  /* A fixed row height rather than square cells: square ones scale with the
     card width and the fourth week falls off the bottom of the panel. */
  .gap {
    height: 22px;
    border-radius: var(--an-radius-sm);
    background: var(--an-surface-sunken);
    border: 1px solid var(--an-border);
  }

  .gap[data-on] {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border-color: transparent;
  }

  /* 73% — 168 blocks, six of them lit. The scale is the argument. */
  .hours {
    display: grid;
    grid-template-columns: repeat(24, 1fr);
    gap: 2px;
    align-content: center;
    flex: 1;
  }

  .hour {
    aspect-ratio: 1;
    border-radius: 1px;
    background: var(--an-surface-sunken);
  }

  .hour[data-on] {
    background: var(--accent);
  }

  /* 97% — the same query, four places, and the row that is not there. */
  .serp {
    display: grid;
    gap: var(--an-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
    align-content: center;
  }

  .serp__row {
    display: grid;
    grid-template-columns: 68px 1fr auto;
    align-items: center;
    gap: var(--an-space-2);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
  }

  .serp__label {
    color: var(--an-text);
  }

  .serp__bar {
    height: 8px;
    width: var(--w);
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
    border: 1px solid var(--an-border);
  }

  .serp__row[data-empty] .serp__bar {
    width: 100%;
    background: none;
    border: 1px dashed var(--an-border-strong);
  }

  .serp__row[data-empty] {
    color: var(--an-danger);
  }

  .serp__who {
    font-size: var(--an-text-caption-size);
    white-space: nowrap;
  }

  /* Outcome 01 — the week, at a glance. */
  .mini-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    flex: 1;
    /* Top-aligned: a day with two pieces grows downward, so every day's letter
       still sits on one line. */
    align-items: start;
    align-content: center;
  }

  .mini-day {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }

  .mini-day__name {
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  .mini-day__art {
    width: 100%;
    height: 26px;
    border-radius: var(--an-radius-sm);
  }

  /* Outcome 02 — the answer box, with the brand inside it. */
  .answer {
    display: grid;
    gap: var(--an-space-2);
    padding: var(--an-space-3);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface-sunken);
  }

  .answer__line {
    height: 7px;
    border-radius: var(--an-radius-full);
    background: var(--an-border);
  }

  .answer__line--short {
    width: 62%;
  }

  .answer__cite {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    margin-top: var(--an-space-1);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .answer__mark {
    width: 14px;
    height: 14px;
    border-radius: var(--an-radius-sm);
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
  }

  .rank {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
  }

  .rank__pos {
    padding: 2px var(--an-space-2);
    border-radius: var(--an-radius-full);
    background: var(--an-accent);
    color: var(--an-on-accent);
    font-weight: var(--an-weight-semibold);
  }

  .rank__url {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
  }

  /* Outcome 03 — the only screen you actually touch. */
  .approve {
    display: grid;
    gap: var(--an-space-2);
    margin: 0;
    padding: 0;
    list-style: none;
    flex: 1;
  }

  .approve__row {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    padding: var(--an-space-2);
    border-radius: var(--an-radius-md);
    background: var(--an-surface-sunken);
    font-size: var(--an-text-caption-size);
    color: var(--an-text);
  }

  .approve__tick {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex: none;
    border-radius: var(--an-radius-full);
    background: var(--an-success);
    color: var(--an-on-status);
    font-size: 9px;
  }

  /* A drawn control, not a real one: it is a picture of the button, inside a
     picture of the screen. Making it a Button would put a second, dead tab stop
     next to the CTA that this card is trying to send you to. */
  .approve__all {
    align-self: stretch;
    padding: var(--an-space-2);
    border-radius: var(--an-radius-full);
    background: var(--an-accent);
    color: var(--an-on-accent);
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-semibold);
    text-align: center;
  }

  /* ── Pain ──────────────────────────────────────────────────────────────── */
  .pains {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-5);
  }

  .pain {
    height: 100%;
    padding: var(--an-space-6);
    border-radius: var(--an-radius-2xl);
    background: var(--an-surface-sunken);
  }

  .pain__figure {
    margin: 0;
    font-size: clamp(2.4rem, 4.2vw, 3rem);
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
    line-height: 1.5;
    color: var(--an-text);
  }

  .pain__source {
    margin: var(--an-space-4) 0 0;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  /* ── Outcomes ──────────────────────────────────────────────────────────── */
  .outcomes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--an-space-5);
  }

  .outcome {
    height: 100%;
    padding: var(--an-space-6);
    border-radius: var(--an-radius-2xl);
    background: var(--an-surface);
  }

  .outcome__index {
    display: block;
    margin-bottom: var(--an-space-2);
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

  /* ── Feature cards ─────────────────────────────────────────────────────── */
  /* Each is a tinted card with the product bleeding off its edge: the crop is
     what makes a screenshot read as a live surface instead of an illustration. */
  .features {
    display: grid;
    gap: var(--an-space-5);
  }

  .feature {
    display: grid;
    grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
    gap: var(--an-space-10);
    align-items: center;
    padding: var(--an-space-12) 0 var(--an-space-12) var(--an-space-12);
    border-radius: var(--an-radius-2xl);
    overflow: clip;
  }

  .feature--flip {
    padding: var(--an-space-12) var(--an-space-12) var(--an-space-12) 0;
  }

  .feature--flip .feature__copy {
    order: 2;
  }

  .feature--a {
    background: color-mix(in srgb, var(--accent) 13%, var(--an-surface));
  }

  .feature--b {
    background: color-mix(in srgb, var(--accent-2) 16%, var(--an-surface));
  }

  .feature--c {
    background: var(--an-surface-sunken);
  }

  .feature--d {
    background: color-mix(in srgb, var(--accent) 9%, var(--an-surface-sunken));
  }

  .chip {
    display: inline-block;
    margin: 0 0 var(--an-space-4);
    padding: var(--an-space-1) var(--an-space-3);
    border-radius: var(--an-radius-full);
    background: color-mix(in srgb, var(--an-text) 8%, transparent);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
  }

  .feature__title {
    margin: 0;
    font-size: clamp(1.45rem, 2.4vw, 2.1rem);
    line-height: 1.1;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--an-text);
  }

  .feature__body {
    margin: var(--an-space-4) 0 0;
    max-width: 42ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.55;
    color: var(--an-text-muted);
  }

  /* The inline CTA takes the accessible brand text token, not the accent
     itself — the accent is a light violet and would fail on this tint. */
  .link-cta {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    margin-top: var(--an-space-6);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-brand-text);
    text-underline-offset: 4px;
  }

  .feature__shot {
    min-width: 0;
  }

  .feature__shot--pair {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 190px;
    gap: var(--an-space-5);
    align-items: end;
  }

  /* ── Window mockup ─────────────────────────────────────────────────────── */
  .window {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-2xl);
    overflow: hidden;
    background: var(--an-surface-raised);
    box-shadow: var(--an-shadow-xl);
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

  /* ── Generated artwork ─────────────────────────────────────────────────── */
  .art,
  .piece__art,
  .post__art,
  .outbox__art {
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

  /* ── Week strip ────────────────────────────────────────────────────────── */
  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  .day {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    min-height: 128px;
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
    height: 32px;
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
    padding: var(--an-space-5);
    border-radius: var(--an-radius-2xl);
    background: var(--an-surface);
  }

  /* Our column is tinted, not bolded: the eye finds it without the table
     shouting, and the tint survives greyscale as a lighter band. */
  .compare :global(th.col--us),
  .compare :global(td.col--us) {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
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

  /* ── Phone mockup ──────────────────────────────────────────────────────── */
  .phone {
    border: 1px solid var(--an-border-strong);
    border-radius: 28px;
    padding: 7px;
    background: var(--an-surface-raised);
    box-shadow: var(--an-shadow-xl);
  }

  .phone__screen {
    border-radius: 22px;
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

  .post__art--reel {
    display: block;
    aspect-ratio: 9 / 16;
    padding: 0;
  }

  .post__art--reel video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .post__art {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: var(--an-space-1);
    aspect-ratio: 4 / 5;
    padding: var(--an-space-3);
  }

  .post__kicker {
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: color-mix(in srgb, #09090b 65%, transparent);
  }

  .post__headline {
    font-size: 1.15rem;
    line-height: 1.1;
    letter-spacing: var(--display-track);
    font-weight: var(--an-weight-semibold);
    color: #09090b;
  }

  .post__mark {
    position: absolute;
    right: var(--an-space-3);
    top: var(--an-space-3);
    width: 14px;
    height: 14px;
    border-radius: var(--an-radius-sm);
    background: color-mix(in srgb, #09090b 82%, transparent);
  }

  .post__meta {
    display: grid;
    gap: var(--an-space-1);
    padding: var(--an-space-3);
  }

  .post__caption {
    font-size: var(--an-text-caption-size);
    line-height: 1.45;
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
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

  /* ── Pricing ───────────────────────────────────────────────────────────── */
  /* The stage is narrower than the band so the floating proof has somewhere to
     sit: cards that hang outside a full-width block just get clipped. */
  .price-stage {
    position: relative;
    max-width: 600px;
    margin: 0 auto;
  }

  .plans {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-5);
    align-items: start;
  }

  /* Proof floats around the price the way testimonials do on pages like this —
     except these are the product's own counters, so nobody had to be invented. */
  .float {
    position: absolute;
    width: 186px;
    padding: var(--an-space-4);
    border-radius: var(--an-radius-xl);
    background: var(--an-surface-raised);
    border: 1px solid var(--an-border);
    box-shadow: var(--an-shadow-lg);
  }

  .float--1 {
    inset-inline-start: -150px;
    top: var(--an-space-10);
    rotate: -3deg;
  }

  .float--2 {
    inset-inline-end: -148px;
    top: -20px;
    rotate: 2.5deg;
  }

  .float--3 {
    inset-inline-end: -138px;
    bottom: var(--an-space-8);
    rotate: -2deg;
  }

  .float__figure {
    margin: 0;
    font-size: var(--an-text-title-2-size);
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
  }

  .float__label {
    margin: var(--an-space-2) 0 0;
    font-size: var(--an-text-caption-size);
    line-height: 1.4;
    color: var(--an-text-muted);
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

  /* ── FAQ ───────────────────────────────────────────────────────────────── */
  .faq {
    max-width: 780px;
    margin: 0 auto;
  }

  /* ── Closer ────────────────────────────────────────────────────────────── */
  .closer {
    padding: var(--an-space-10) var(--an-space-6) var(--an-space-12);
  }

  .panel--closer {
    padding-block: var(--an-space-20);
    text-align: center;
  }

  .aurora--closer {
    inset: auto -10% -40%;
    height: 640px;
  }

  .closer__inner {
    position: relative;
    max-width: 620px;
    margin: 0 auto;
  }

  .closer__title {
    margin: 0;
    font-size: clamp(2rem, 4.4vw, 3.1rem);
    line-height: 1.05;
    letter-spacing: var(--display-track);
    font-weight: var(--display-weight);
    color: var(--on-panel);
  }

  .closer__lead {
    margin: var(--an-space-4) auto 0;
    max-width: 44ch;
    font-size: var(--an-text-callout-size);
    line-height: 1.6;
    color: color-mix(in srgb, var(--on-panel) 72%, transparent);
  }

  .capture--closer {
    justify-content: center;
    margin-top: var(--an-space-8);
  }

  .capture--closer :global(.capture__field) {
    flex: 0 1 320px;
  }

  .closer__risk {
    margin: var(--an-space-5) 0 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: color-mix(in srgb, var(--on-panel) 50%, transparent);
  }

  @media (max-width: 1180px) {
    /* The floating proof is the first thing to go: overlapped cards at a narrow
       width are a decoration that eats the price. */
    .float {
      display: none;
    }
  }

  @media (max-width: 1000px) {
    .panel__grid,
    .feature,
    .feature--flip {
      grid-template-columns: minmax(0, 1fr);
    }

    .feature,
    .feature--flip {
      padding: var(--an-space-10);
      gap: var(--an-space-8);
    }

    .feature--flip .feature__copy {
      order: 0;
    }

    .feature__shot--pair {
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
    }

    .phone {
      max-width: 260px;
    }
  }

  @media (max-width: 900px) {
    .panel {
      padding: var(--an-space-12) var(--an-space-6) var(--an-space-8);
    }

    .band {
      padding: var(--an-space-16) var(--an-space-6);
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
    .closer {
      padding-inline: var(--an-space-3);
    }

    .band {
      padding-inline: var(--an-space-4);
    }

    .feature,
    .feature--flip {
      padding: var(--an-space-6);
    }

    /* Stacked, and the button goes full width: a 44px target beside a field is
       the first thing that breaks on a phone. */
    .capture {
      flex-direction: column;
      align-items: stretch;
    }

    .week {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .moodboard {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
