<!--
  App audit — every component in the app, and what happens to it.

  Built from the library's own Table, Badge and Stat, which is the point: if the
  audit page needed CSS the audit would be wrong.
-->
<script lang="ts">
  import Seo from '../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Badge, Card, Stat, Table, Text } from '$lib/index.js';
  import { groups, VERDICT_LABEL, type Verdict } from './data.js';

  const all = groups.flatMap((g) => g.rows);

  const count = (v: Verdict) => all.filter((r) => r.verdict === v).length;

  const TONE: Record<Verdict, 'success' | 'accent' | 'info' | 'neutral'> = {
    covered: 'success',
    new: 'accent',
    compose: 'info',
    app: 'neutral'
  };
</script>

<Seo
  title="App audit"
  description="Every component in a real 470-file SvelteKit app mapped to a verdict: already covered, new in the library, compose in the app, or stays in the app. The list a design-system migration is actually driven from."
  pathname={$page.url.pathname}
/>


<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Foundations</p>
  <h1 class="doc-page__title">App audit</h1>
  <p class="doc-page__lead">
    Every component in the app on <code>main</code>, and what happens to it. This is the list the
    migration is driven from, and the reason the library grew a Layout and a Marketing category:
    the landing nav, the app nav and four sidebars had each independently decided what a header is.
  </p>

  <div class="tiles">
    <Card><Stat label="App components" value={all.length} hint="Audited" /></Card>
    <Card><Stat label="Already covered" value={count('covered')} hint="Delete the app copy" /></Card>
    <Card><Stat label="New library parts" value={count('new')} hint="Built for this" /></Card>
    <Card><Stat label="Compose in the app" value={count('compose')} hint="No new CSS" /></Card>
  </div>

  <div class="legend">
    {#each Object.entries(VERDICT_LABEL) as [verdict, label] (verdict)}
      <Badge size="sm" variant="soft" tone={TONE[verdict as Verdict]}>{label}</Badge>
    {/each}
  </div>

  <p class="note">
    <strong>“Stays in the app” is not a lesser verdict.</strong> A design system that ships your
    editorial planner has stopped being a design system. What changes for those rows is that none of
    them should write CSS any more — every one is expressible as library parts plus layout, and that
    is the actual test of whether this library is finished.
  </p>

  {#each groups as group (group.title)}
    <section class="group">
      <h2 class="group__title">{group.title}</h2>
      <p class="group__intro">{group.intro}</p>

      <Card padding="none">
        <Table label={group.title} density="compact">
          <table>
            <thead>
              <tr>
                <th scope="col">In the app</th>
                <th scope="col">Verdict</th>
                <th scope="col">Use</th>
              </tr>
            </thead>
            <tbody>
              {#each group.rows as row (row.app)}
                <tr>
                  <td>
                    <span class="mono">{row.app}</span>
                    {#if row.note}<span class="row-note">{row.note}</span>{/if}
                  </td>
                  <td>
                    <Badge size="sm" variant="soft" tone={TONE[row.verdict]}>
                      {VERDICT_LABEL[row.verdict]}
                    </Badge>
                  </td>
                  <td><span class="use">{row.use}</span></td>
                </tr>
              {/each}
            </tbody>
          </table>
        </Table>
      </Card>
    </section>
  {/each}

  <section class="group">
    <h2 class="group__title">What is still open</h2>
    <p class="group__intro">
      Named honestly rather than quietly skipped. None of these blocked a row above; all of them
      would earn their place.
    </p>
    <ul class="open">
      <li>
        <strong>Donut / part-to-whole</strong> — deliberately not built yet. Every caller so far is
        comparing close values, which is the one thing a donut is worst at; <code>RankBars</code>
        with <code>share</code> answers the same question and can be read. It goes in when a real
        at-a-glance split of ≤ 4 segments turns up.
      </li>
      <li>
        <strong>Drawer</strong> — a side sheet for desktop. <code>Sidebar overlay</code> covers the
        navigation case, and <code>BottomSheet</code> covers the phone case, but a right-hand
        inspector panel is neither.
      </li>
      <li>
        <strong>Steps</strong> — onboarding checklists and guided tours. Three app components want
        it; none of them agree on what a step is yet, which is a reason to wait.
      </li>
      <li>
        <strong>FileDropzone</strong> — the upload surfaces share no code today, and each one
        handles drag state slightly differently.
      </li>
      <li>
        <strong>PricingCard</strong> — <code>PlanCards</code> is the only caller, so it is a
        marketing section for now, not a component.
      </li>
    </ul>
  </section>
</div>

<style>
  .doc-page--wide {
    max-width: 1000px;
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--an-space-3);
    margin: var(--an-space-6) 0 var(--an-space-4);
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--an-space-2);
  }

  .note {
    margin: var(--an-space-5) 0 0;
    padding: var(--an-space-4);
    border-inline-start: 2px solid var(--an-border-strong);
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  .group {
    margin-top: var(--an-space-8);
  }

  .group__title {
    margin: 0 0 var(--an-space-2);
    font-size: var(--an-text-title3-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: -0.01em;
  }

  .group__intro {
    margin: 0 0 var(--an-space-4);
    max-width: 68ch;
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  .mono {
    display: block;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 12px;
    letter-spacing: 0;
    color: var(--an-text);
  }

  .row-note {
    display: block;
    margin-top: 3px;
    max-width: 52ch;
    font-size: var(--an-text-caption-size);
    line-height: 1.5;
    color: var(--an-text-faint);
  }

  .use {
    display: block;
    max-width: 26ch;
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
  }

  .open {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-3);
    margin: 0;
    padding-inline-start: 20px;
    max-width: 72ch;
    font-size: var(--an-text-footnote-size);
    line-height: 1.6;
    color: var(--an-text-muted);
  }

  .open strong {
    color: var(--an-text);
  }
</style>
