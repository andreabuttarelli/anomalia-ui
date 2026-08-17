<!--
  Motion page.

  The demos are the same example files the component pages render — imported
  directly rather than copied, so this page cannot drift from them. What is new
  here is the argument: when motion is worth it, and the four ways it goes wrong.
-->
<script lang="ts">
  import Seo from '../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Card, Text, Badge, Button, Divider, ripple, press, haptic } from '$lib/index.js';
  import CodeBlock from '../../docs/components/CodeBlock.svelte';
  import RevealDemo from '../../docs/examples/reveal/01-entrance.svelte';
  import CounterDemo from '../../docs/examples/reveal/02-counter.svelte';
  import SpatialDemo from '../../docs/examples/spatial/01-gallery.svelte';

  const jobs = [
    {
      title: 'Explain a change',
      body: 'A sheet rises from the edge it will return to. A tab indicator travels rather than teleports. The motion says where something came from — which is information the static frames cannot carry.'
    },
    {
      title: 'Confirm a touch',
      body: 'Ripple, press squish, haptic tick. The interface answers within one frame of contact, before the actual work has finished, so the tap never feels dropped.'
    },
    {
      title: 'Direct attention',
      body: 'An entrance reveal or a counting number pulls the eye to what just arrived. Used sparingly this is useful; used on everything it is noise with a preference for the last thing rendered.'
    }
  ];

  const failures = [
    ['Motion that carries meaning alone', 'It disappears under `prefers-reduced-motion`, and roughly one in three people ship that setting on. If the only way to know a save succeeded is that something moved, some users never know.'],
    ['Easing during direct manipulation', 'A sheet or a 3D stage that eases while a finger is down lags behind the finger. Transitions belong to the release, not the drag.'],
    ['Distance that lies', 'A 60px entrance says "this flew in from somewhere". It did not — the viewport moved. 8–16px is the whole budget.'],
    ['Animation on every render', 'A counter that restarts from zero whenever a metric refreshes, a list that re-reveals on every scroll. Motion should mark a change, not a repaint.']
  ];

  const durationRule = `/* Duration follows distance, not importance.
   A 6px state change and a full-screen sheet are not the
   same event, and giving them the same 300ms makes one
   feel sluggish and the other abrupt. */

--an-duration-short-2   /* 100ms — colour, opacity, state layers   */
--an-duration-short-4   /* 200ms — small moves, hover, press       */
--an-duration-medium-2  /* 300ms — menus, popovers, tab indicator  */
--an-duration-medium-4  /* 400ms — dialogs, sheets, panel travel   */
--an-duration-long-2    /* 500ms — full-screen or first-run motion */`;

  const curveRule = `/* Entering decelerates, leaving accelerates: things
   arrive gently and get out of the way quickly. */

--an-ease-emphasized-decelerate  /* enter: menus, dialogs, sheets */
--an-ease-emphasized-accelerate  /* exit: dismissals              */
--an-ease-emphasized             /* travel between two positions  */
--an-ease-standard               /* colour, opacity, small states */
--an-ease-spring                 /* toggles and thumbs only       */`;

  let pressed = $state(0);
</script>

<Seo
  title="Motion"
  description="Material 3's duration and easing scales mirrored in CSS and TypeScript, so a CSS transition and a Svelte transition run the identical curve — plus ripple, press and swipe as reusable actions."
  pathname={$page.url.pathname}
/>

<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Foundations</p>
  <h1 class="doc-page__title">Motion</h1>
  <p class="doc-page__lead">
    The surfaces of this system are deliberately quiet, which puts the whole
    expressive budget on what happens when you touch them. That budget is not
    unlimited: motion earns its place by explaining something, and everything else
    is decoration that has to survive being switched off.
  </p>

  <section class="doc-section">
    <h2 class="doc-section__title">What motion is for</h2>
    <div class="jobs">
      {#each jobs as job (job.title)}
        <Card variant="filled">
          <Text variant="headline" as="h3">{job.title}</Text>
          <Text variant="footnote" tone="muted" class="job__body">{job.body}</Text>
        </Card>
      {/each}
    </div>
  </section>

  <!-- ── Press ────────────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Press: the answer within one frame</h2>
    <p class="hint">
      Every interactive surface here responds before anything else happens: a ripple
      from the exact contact point, a squish under the finger, a haptic tick on
      commit. Press and hold one of these — the ink stays at full strength and only
      fades once the grow has landed, so even a 40ms tap plays the whole gesture.
      Drag off it and the press cancels, because a touch that turns into a scroll
      was never a press.
    </p>

    <div class="press-grid">
      {#each ['Ripple + press', 'Centered ink', 'With haptic'] as label, index (label)}
        <button
          class="tile"
          use:ripple={{ centered: index === 1 }}
          use:press
          onclick={() => {
            pressed += 1;
            if (index === 2) haptic('success');
          }}
        >
          <Text variant="footnote">{label}</Text>
          <Text variant="caption" as="span" tone="faint">press me</Text>
        </button>
      {/each}
    </div>

    <p class="hint">
      Presses so far: <strong>{pressed}</strong>. On a phone the third tile also
      fires a haptic — a no-op where the Vibration API is missing, so nothing needs
      feature-detecting at the call site.
    </p>
  </section>

  <!-- ── Entrance ─────────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Entrance</h2>
    <p class="hint">
      <code>Reveal</code> animates content in when it scrolls into view, once, with
      an optional stagger. The important property is the failure mode: if the
      observer never fires — no JS, no <code>IntersectionObserver</code>, reduced
      motion — the content is <em>visible</em>, not stuck at zero opacity. An
      entrance animation must never be able to hide the page.
    </p>
    <Card padding="lg"><RevealDemo /></Card>
  </section>

  <!-- ── Numbers ──────────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Numbers</h2>
    <p class="hint">
      <code>Counter</code> decelerates into the final digits, which is the part the
      reader cares about — a linear count-up reads like a loading spinner. Press
      "new numbers": each value animates from where it currently is, not from zero,
      and the figures are tabular so the number does not jitter sideways as digits
      change.
    </p>
    <Card padding="lg"><CounterDemo /></Card>
  </section>

  <!-- ── Spatial ──────────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">A navigable space</h2>
    <p class="hint">
      <code>Spatial</code> is the largest thing in the system: a 3D stage you can
      look around. Drag to rotate, pinch or ⌘-scroll to zoom, double-click to reset;
      with a keyboard, arrows rotate and <code>+</code>/<code>-</code> zoom. It is
      CSS 3D rather than WebGL, so the panels are real DOM — selectable text,
      focusable links, no canvas — which is the right trade until you need
      thousands of objects or real lighting.
    </p>

    <Card padding="none" class="stage-card">
      <SpatialDemo />
    </Card>

    <ul class="doc-notes">
      <li>
        Transitions switch off while a pointer is down, so the stage tracks the
        finger exactly and re-eases only for the release and for programmatic moves.
      </li>
      <li>
        Release carries velocity and decays it. Without inertia every gesture ends
        in a dead stop, which reads as the page catching you.
      </li>
      <li>
        Plain wheel scrolling is deliberately not captured — the page still scrolls
        over the scene, and a trackpad pinch already arrives as ctrl+wheel, so the
        natural zoom gesture works anyway.
      </li>
      <li>
        Vertical rotation is clamped. A stage that can go upside down is a stage a
        user can get lost in.
      </li>
    </ul>
  </section>

  <!-- ── The scales ───────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Choosing duration and curve</h2>
    <div class="scales">
      <CodeBlock code={durationRule} language="css" />
      <CodeBlock code={curveRule} language="css" />
    </div>
    <p class="hint">
      Both scales are mirrored in <code>motion/tokens.ts</code>, so a Svelte
      transition and a CSS transition run the identical curve — see them animated on
      the <a href="/foundations/">design tokens</a> page.
    </p>
  </section>

  <!-- ── Failure modes ────────────────────────────────────────────────── -->
  <section class="doc-section">
    <h2 class="doc-section__title">Four ways motion goes wrong</h2>
    <div class="failures">
      {#each failures as [title, body] (title)}
        <div class="failure">
          <div class="failure__head">
            <Badge tone="danger" variant="soft" size="sm">avoid</Badge>
            <Text variant="headline" as="h3">{title}</Text>
          </div>
          <Text variant="footnote" tone="muted">{body}</Text>
        </div>
      {/each}
    </div>
  </section>

  <Divider />

  <section class="doc-section">
    <h2 class="doc-section__title">Reduced motion is not a downgrade</h2>
    <p class="hint">
      Everything on this page has a defined behaviour when the OS asks for less
      motion: transitions collapse, ripples and idle drift stop, haptics are
      suppressed, reveals render visible, counters render their final value, and the
      3D stage stays fully navigable — because direct manipulation is the user's own
      motion, not ours. Turn the setting on and the product still works; that is the
      test.
    </p>
    <div class="demo-row">
      <Button href="/accessibility/" variant="outline">Accessibility</Button>
      <Button href="/components/spatial/" variant="ghost">Spatial API</Button>
    </div>
  </section>
</div>

<style>
  .doc-page--wide {
    max-width: 1000px;
  }

  .hint {
    margin: 0 0 var(--an-space-4);
    font-size: var(--an-text-footnote-size);
    line-height: 1.65;
    color: var(--an-text-muted);
    max-width: 74ch;
  }

  .hint code {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 12px;
    padding: 1px 5px;
    border-radius: var(--an-radius-xs);
    background: var(--an-surface-sunken);
  }

  .jobs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--an-space-4);
  }

  :global(.job__body) {
    margin-top: var(--an-space-2) !important;
  }

  .press-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: var(--an-space-3);
    margin-bottom: var(--an-space-4);
  }

  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-1);
    height: 110px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
    font: inherit;
    cursor: pointer;
    isolation: isolate;
    transition: transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  /* `:global` because `data-pressed` is applied at runtime by use:press —
     Svelte cannot see it statically and would prune the rule. */
  .tile:global([data-pressed]) {
    transform: scale(var(--an-press-scale));
  }

  :global(.stage-card) {
    overflow: hidden;
  }

  .scales {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--an-space-4);
    margin-bottom: var(--an-space-4);
  }

  .scales :global(.code) {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
    height: 100%;
  }

  .failures {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--an-space-5);
  }

  .failure {
    padding-top: var(--an-space-4);
    border-top: 1px solid var(--an-border-strong);
  }

  .failure__head {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    margin-bottom: var(--an-space-2);
  }
</style>
