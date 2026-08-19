<!--
  Landing mockup — Anomalia's home page as a single run, not a feature list.

  The obvious version of this page is the one every AI product ships: hero,
  three pillars, capability grid, logo wall, pricing table, FAQ. It is templated
  by construction — the reader has seen the shape a hundred times and skims it in
  the shape they already know.

  So this page has one idea instead: **you are watching one week happen.** It
  opens at Monday 09:14 with a run already in progress, and scrolls through four
  moments of that run — the brain reading the company, the agents deciding the
  week, the publisher shipping it, Friday's numbers going back into the brain.
  The three tools are never announced as pillars; you meet them as the actor of
  each moment, which is also the only honest way to say they are one system: the
  page is a loop, and the loop closes on screen.

  Consequences for the build:

    • The spine is a sticky rail carrying the clock. It advances as you scroll,
      so the page has a *time* rather than a scroll position.
    • The hero's right column is not a screenshot. The run plays: reasoning
      first, then tool calls flipping pending → running → done, then the answer.
      Under `prefers-reduced-motion` it renders finished, because the final state
      is the complete state — the motion never carries the meaning.
    • Between the moments sit four narration lines. They are the argument the
      pillar grid used to make, in the voice of someone pointing at what just
      happened rather than selling it.
    • No metric strip, no capability grid, no FAQ accordion, no three-column
      pricing. They are the parts that made it read as a template.

  Everything is tokens and library components, as always. The violet appears
  exactly twice — the wordmark and the loop that closes the run — because it is
  identity, and identity is the one thing on this page that is not a control.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import {
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
    ThemeToggle
  } from '$lib/index.js';

  const navLinks = [
    { label: 'Brain', href: '#brain' },
    { label: 'Agents', href: '#agents' },
    { label: 'Publisher', href: '#publisher' },
    { label: 'Pricing', href: '#price' }
  ];

  /* ── The run that plays in the hero ──────────────────────────────────────
     Four calls, in the order they actually happen: read the company, plan the
     week, render the one piece that takes real time, check it can be found. */
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

  // The run starts when it is looked at, not on mount: a trace that finished
  // above the fold is a trace nobody saw.
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
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  });

  /* ── The spine ───────────────────────────────────────────────────────────
     Four moments. The rail reads its clock from whichever one is in the middle
     of the viewport, so scrolling the page moves time rather than pixels. */
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

  /* ── Artifacts ───────────────────────────────────────────────────────── */
  const week = [
    { day: 'Mon', items: ['Carousel', 'Post'] },
    { day: 'Tue', items: ['Post'] },
    { day: 'Wed', items: ['Article'] },
    { day: 'Thu', items: [], blocked: 'shoot' },
    { day: 'Fri', items: ['Reel'] },
    { day: 'Sat', items: [] },
    { day: 'Sun', items: ['Ad set'] }
  ];

  const queue = [
    { work: 'Studio tour', kind: 'Reel', where: 'IG · TikTok', state: 'Scheduled', tone: 'info' },
    { work: 'How we price', kind: 'Article', where: 'Blog · LinkedIn', state: 'Published', tone: 'success' },
    { work: 'Three fabrics', kind: 'Carousel', where: 'IG', state: 'Published', tone: 'success' },
    { work: 'Q3 launch', kind: 'Ad set', where: 'Meta Ads', state: 'In review', tone: 'warning' }
  ] as const;

  const reach = [8, 12, 10, 18, 22, 19, 28, 34, 31, 44, 52, 61];

  const footerColumns = [
    {
      title: 'The run',
      links: [
        { label: 'Brain', href: '#brain' },
        { label: 'Agents', href: '#agents' },
        { label: 'Publisher', href: '#publisher' },
        { label: 'Pricing', href: '#price' }
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
  description="Anomalia's home page built as one running week rather than a feature list: a sticky clock, a run that plays, and four moments that close the loop from brain to publisher and back."
  pathname={$page.url.pathname}
/>

<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Landing page</h1>
  <p class="doc-page__lead">
    A marketing page with one idea instead of six sections: you are watching a single week run.
    The clock in the rail advances as you scroll, the trace in the hero plays itself, and the three
    tools arrive as the actor of each moment rather than as a pillar grid. Same tokens as the
    product, no bespoke colour, and the whole thing renders finished under reduced motion.
  </p>

  <div class="frame">
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
        <Button size="sm">Start free</Button>
      {/snippet}
    </SiteHeader>

    <!-- ── Hero: the run, already in progress ───────────────────────────── -->
    <section class="hero" id="top">
      <div class="hero__copy">
        <p class="hero__stamp">Mon 09:14 · run_8f2c41d</p>
        <h2 class="hero__title">Nobody briefed it.<br />The week is already written.</h2>
        <p class="hero__lead">
          Anomalia read your company once. Since then it plans, writes, renders and publishes —
          social, blog, ads — and stops at the only step that needs a person.
        </p>

        <div class="hero__actions">
          <Button size="lg">Start free</Button>
          <Button size="lg" variant="outline" href="#brain">Watch the run</Button>
        </div>

        <p class="hero__live">
          <StatusDot label="Running" tone="success" pulse />
          <span class="hero__count"><Counter value={1284} /></span>
          pieces shipped by Anomalia today
        </p>
      </div>

      <div class="hero__run" bind:this={runEl}>
        <Card padding="none">
          <div class="panel__head">
            <Text variant="footnote" weight="semibold">Weekly run</Text>
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
        </Card>
      </div>
    </section>

    <!-- ── The spine ────────────────────────────────────────────────────── -->
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
        <!-- ── 01 · Brain ───────────────────────────────────────────────── -->
        <article
          class="moment"
          id="brain"
          data-index="0"
          bind:this={momentEls[0]}
        >
          <p class="moment__stamp">Mon 09:14 · Brain</p>
          <Text variant="title1" as="h3">It re-reads the company.</Text>
          <Text variant="callout" tone="muted" class="moment__lead">
            Not a prompt. A brain: the brand kit, the voice rules, the products, the people, every
            document you ever pointed it at. It is the thing everything else on this page reads
            from, and the only thing here you write by hand.
          </Text>

          <Reveal class="moment__artifact">
            <Card padding="none">
              <div class="panel__head">
                <div>
                  <Text variant="caption" as="p">Brand knowledge</Text>
                  <Text variant="headline" as="h4">Acme Studio</Text>
                </div>
                <Badge tone="success" variant="soft" dot>Indexed</Badge>
              </div>
              <Divider />
              <List>
                <ListItem title="Voice" value="Warm, concrete, no exclamation marks" />
                <ListItem title="Pillars" value="Craft · Proof · Behind the scenes" />
                <ListItem title="Products" value="12" />
                <ListItem title="People" value="4" />
                <ListItem title="Documents" value="48" />
              </List>
              <Divider />
              <div class="panel__foot">
                <span class="swatches" aria-hidden="true">
                  <span class="swatch swatch--brand"></span>
                  <span class="swatch swatch--ink"></span>
                  <span class="swatch swatch--paper"></span>
                </span>
                <Text variant="footnote" tone="faint" family="mono">synced 09:14</Text>
              </div>
            </Card>
          </Reveal>
        </article>

        <p class="aside">Nobody re-typed the brief. That is the entire job of the brain.</p>

        <!-- ── 02 · Agents ──────────────────────────────────────────────── -->
        <article
          class="moment"
          id="agents"
          data-index="1"
          bind:this={momentEls[1]}
        >
          <p class="moment__stamp">Mon 09:16 · Agents</p>
          <Text variant="title1" as="h3">Two minutes later, the week exists.</Text>
          <Text variant="callout" tone="muted" class="moment__lead">
            A team of agents reads the brain, looks at what worked, and lays out seven days —
            format by format, day by day. Thursday is blocked for a shoot, so nothing lands on
            Thursday. You did not have to tell it that twice.
          </Text>

          <Reveal class="moment__artifact">
            <Card padding="none">
              <div class="panel__head">
                <div>
                  <Text variant="caption" as="p">Proposed plan</Text>
                  <Text variant="headline" as="h4">Week 34</Text>
                </div>
                <Badge variant="soft">6 pieces</Badge>
              </div>
              <Divider />
              <div class="week">
                {#each week as day (day.day)}
                  <div class="day" data-blocked={day.blocked ? '' : undefined}>
                    <span class="day__name">{day.day}</span>
                    {#each day.items as item (item)}
                      <span class="day__item">{item}</span>
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
                <Button size="sm">Approve</Button>
              </div>
            </Card>
          </Reveal>
        </article>

        <p class="aside">No prompt was written. The plan came out of the company, not out of you.</p>

        <!-- ── 03 · Publisher ───────────────────────────────────────────── -->
        <article
          class="moment"
          id="publisher"
          data-index="2"
          bind:this={momentEls[2]}
        >
          <p class="moment__stamp">Mon 11:00 · Publisher</p>
          <Text variant="title1" as="h3">It goes out, everywhere you own.</Text>
          <Text variant="callout" tone="muted" class="moment__lead">
            The same week, cut per surface: a reel for IG and TikTok, an article for the blog and
            LinkedIn, an ad set for Meta. One queue for all of it — and editing a scheduled piece
            re-syncs it, so what goes out is what you last touched.
          </Text>

          <Reveal class="moment__artifact">
            <Card padding="none">
              <div class="panel__head">
                <div>
                  <Text variant="caption" as="p">Queue</Text>
                  <Text variant="headline" as="h4">Live this week</Text>
                </div>
                <Text variant="footnote" tone="faint" family="mono">next 14:00</Text>
              </div>
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
                        <td>{row.where}</td>
                        <td><Badge variant="soft" tone={row.tone} dot>{row.state}</Badge></td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </Table>
            </Card>
          </Reveal>
        </article>

        <p class="aside">Three surfaces, one queue, one approval — and it was on Monday.</p>

        <!-- ── 04 · Back to the brain ───────────────────────────────────── -->
        <article
          class="moment"
          id="friday"
          data-index="3"
          bind:this={momentEls[3]}
        >
          <p class="moment__stamp">Fri 18:00 · Back to the brain</p>
          <Text variant="title1" as="h3">Friday's numbers become Monday's plan.</Text>
          <Text variant="callout" tone="muted" class="moment__lead">
            What performed goes back where it came from. The brain learns that the behind-the-scenes
            cuts outrun the product shots, and next week's plan is written knowing it. This is the
            part a scheduler and a chatbot bolted together cannot do.
          </Text>

          <Reveal class="moment__artifact">
            <Card>
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
            </Card>
          </Reveal>
        </article>
      </div>
    </div>

    <!-- ── Closer: the one inverted band ────────────────────────────────── -->
    <section class="closer" id="price">
      <p class="closer__stamp">Mon 09:14 · next week</p>
      <h3 class="closer__title">Give it one week.</h3>
      <p class="closer__lead">
        One brand free, forever. €49 a month when you want the other four, and the whole thing
        from your terminal if you prefer it there.
      </p>
      <Button size="lg" variant="secondary">Start free</Button>
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
    max-width: 1100px;
  }

  .frame {
    margin-top: var(--an-space-6);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    /* `clip`, not `hidden`: `hidden` makes the frame a scroll container, and a
       scroll container that never scrolls silently kills the sticky rail
       inside it. `clip` still rounds the corners and leaves sticky alone. */
    overflow: clip;
    background: var(--an-surface);
  }

  /* ── Wordmark, shared by header and footer ─────────────────────────────── */
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
    background: var(--an-brand);
  }

  :global(.foot__tag) {
    margin-top: var(--an-space-3) !important;
    max-width: 34ch;
  }

  /* A timestamp is a machine fact, so every one of them on this page is mono,
     uppercase-free and quiet. They are what carries the narrative. */
  .hero__stamp,
  .moment__stamp,
  .closer__stamp {
    margin: 0 0 var(--an-space-4);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-faint);
  }

  /* ── Hero ──────────────────────────────────────────────────────────────── */
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: var(--an-space-12);
    align-items: center;
    padding: var(--an-space-16) var(--an-space-6);
    border-bottom: 1px solid var(--an-border);
  }

  .hero__title {
    margin: 0;
    font-size: clamp(2rem, 5vw, var(--an-text-display-size));
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
    max-width: 44ch;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--an-space-3);
    margin-top: var(--an-space-6);
  }

  .hero__live {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    margin: var(--an-space-6) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .hero__count {
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
  }

  /* ── Panels (the artifacts) ────────────────────────────────────────────── */
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

  /* Zero-gap column so the margin rules of the trace join into one aside. */
  .trace {
    display: flex;
    flex-direction: column;
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

  .swatch--brand {
    background: var(--an-brand);
  }

  .swatch--ink {
    background: var(--an-accent);
  }

  .swatch--paper {
    background: var(--an-surface-sunken);
  }

  /* ── The spine ─────────────────────────────────────────────────────────── */
  .run {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    border-bottom: 1px solid var(--an-border);
  }

  .rail {
    border-inline-end: 1px solid var(--an-border);
    background: var(--an-surface-rail);
  }

  .rail__sticky {
    position: sticky;
    /* Clears the docs chrome above the mockup; on the real site this is the
       height of the site header. */
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

  /* The tick that has been passed is ink; the ones ahead are hairline. Nothing
     animates except the fill, because the rail is a position indicator and a
     position indicator that moves on its own is a lie. */
  .rail__tick {
    height: 2px;
    width: var(--an-space-8);
    background: var(--an-border-strong);
    transition: background var(--an-duration-medium-1) var(--an-ease-standard);
  }

  .rail__tick[data-on] {
    background: var(--an-accent);
  }

  .moment {
    padding: var(--an-space-20) var(--an-space-8);
  }

  /* The rail carries the clock at desktop width, so the stamp inside the moment
     would say it twice. It comes back below 900px, where the rail is gone. */
  @media (min-width: 901px) {
    .moment__stamp {
      display: none;
    }
  }

  :global(.moment__lead) {
    margin-top: var(--an-space-4) !important;
    max-width: 54ch;
  }

  :global(.moment__artifact) {
    display: block;
    margin-top: var(--an-space-8);
    max-width: 620px;
  }

  /* The narration between moments: a hairline band, one sentence, set at the
     size of body copy rather than a heading — someone pointing, not selling. */
  .aside {
    margin: 0;
    padding: var(--an-space-6) var(--an-space-8);
    border-block: 1px solid var(--an-border);
    background: var(--an-surface-sunken);
    font-size: var(--an-text-callout-size);
    letter-spacing: var(--an-text-callout-track);
    color: var(--an-text);
    max-width: none;
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
    min-height: 108px;
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

  .day__item {
    padding: var(--an-space-1) var(--an-space-2);
    border-radius: var(--an-radius-sm);
    background: var(--an-accent-soft);
    color: var(--an-accent-soft-text);
    font-size: var(--an-text-caption-size);
    text-align: center;
  }

  .day__blocked {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
    text-align: center;
  }

  /* ── Table cells ───────────────────────────────────────────────────────── */
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

  /* The second and last moment of brand hue on the page: the loop closing. */
  .loop__glyph {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: var(--an-radius-full);
    background: var(--an-brand-soft);
    color: var(--an-brand-text);
    font-size: var(--an-text-footnote-size);
  }

  /* ── Closer ────────────────────────────────────────────────────────────── */
  .closer {
    padding: var(--an-space-20) var(--an-space-6);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    text-align: center;
  }

  .closer__stamp {
    color: inherit;
    opacity: 0.45;
  }

  .closer__title {
    margin: 0;
    font-size: clamp(1.75rem, 5vw, var(--an-text-title-1-size));
    letter-spacing: var(--an-text-title-1-track);
    font-weight: var(--an-weight-semibold);
  }

  .closer__lead {
    margin: var(--an-space-3) auto var(--an-space-6);
    max-width: 46ch;
    font-size: var(--an-text-footnote-size);
    line-height: var(--an-text-footnote-line);
    opacity: 0.7;
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--an-space-8);
      padding-block: var(--an-space-12);
    }

    /* The rail becomes a bar: the clock still leads each moment, it just stops
       being a column. Sticky is dropped rather than reduced — a sticky strip on
       a phone is a strip that eats the screen. */
    .run {
      grid-template-columns: minmax(0, 1fr);
    }

    .rail {
      display: none;
    }

    .moment {
      padding: var(--an-space-12) var(--an-space-6);
    }

    .aside {
      padding-inline: var(--an-space-6);
    }

    .week {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    .day {
      border-top: 1px solid var(--an-border);
      min-height: 88px;
    }
  }

  @media (max-width: 640px) {
    .hero,
    .moment,
    .aside,
    .closer {
      padding-inline: var(--an-space-4);
    }

    .hero {
      padding-top: var(--an-space-10);
    }

    .week {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
