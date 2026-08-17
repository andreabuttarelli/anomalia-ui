<!--
  Stat — one number with its label, and optionally what it did since last time.

  Every dashboard in every app rebuilds this out of a `<dl>`, three font sizes
  and a green arrow, and every rebuild gets one detail wrong: the figures are
  proportional so the column jitters, the delta is green-on-white at 3:1, or
  "+12%" is left ambiguous about whether up is good. This owns those three.

    • **Tabular figures always.** A column of numbers a reader compares has to
      line up, and that is not optional styling.
    • **The delta names its own direction.** `up`/`down` is the arrow; `good`
      tells the component whether that direction is welcome — because a fall in
      churn and a fall in revenue want opposite colours.
    • **The trend is a shape, not a decoration.** Pass a `Sparkline` (or
      anything) as `chart` and it sits under the number at the same width.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    label: string;
    /** The figure. Pre-formatted: this component does not know your locale. */
    value: string | number;
    /** Unit or qualifier shown next to the value at a smaller size. */
    unit?: string;
    /** Change since the comparison period, e.g. `'+12%'`. */
    delta?: string | null;
    direction?: 'up' | 'down' | 'flat';
    /** Is that direction welcome? Churn falling is good; revenue falling is not. */
    good?: boolean;
    /** Context under the number: "vs last week", "of 20 000 credits". */
    hint?: string;
    size?: 'sm' | 'md' | 'lg';
    /** A Sparkline or similar, rendered under the figure. */
    chart?: Snippet;
    children?: Snippet;
  }

  let {
    label,
    value,
    unit,
    delta = null,
    direction = 'flat',
    good = true,
    hint,
    size = 'md',
    class: className,
    chart,
    children,
    ...rest
  }: Props = $props();

  const tone = $derived(direction === 'flat' ? 'flat' : good ? 'good' : 'bad');

  const ARROW = { up: '↑', down: '↓', flat: '→' } as const;
  const SPOKEN = { up: 'up', down: 'down', flat: 'unchanged' } as const;
</script>

<div data-an="stat" data-size={size} class={cn('an-stat', className)} {...rest}>
  <p class="an-stat__label">{label}</p>

  <p class="an-stat__value">
    {value}{#if unit}<span class="an-stat__unit">{unit}</span>{/if}

    {#if delta}
      <span class="an-stat__delta" data-tone={tone}>
        <span aria-hidden="true">{ARROW[direction]}</span>{delta}
        <span class="an-sr-only">{SPOKEN[direction]}</span>
      </span>
    {/if}
  </p>

  {#if hint}<p class="an-stat__hint">{hint}</p>{/if}
  {#if chart}<div class="an-stat__chart">{@render chart()}</div>{/if}
  {@render children?.()}
</div>

<style>
  .an-stat {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    font-family: var(--an-font-sans);
  }

  /* Uppercase and tracked, like every other label in the system: it is a field
     name, not a sentence, and reads faster when it does not pretend to be one. */
  .an-stat__label {
    margin: 0;
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .an-stat__value {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 2px 0 0;
    font-size: var(--an-text-title2-size);
    line-height: 1.1;
    font-weight: var(--an-weight-semibold);
    letter-spacing: -0.02em;
    color: var(--an-text);
    /* Not negotiable: a column of proportional figures does not line up, and a
       dashboard is a column of figures. */
    font-variant-numeric: tabular-nums;
  }

  .an-stat[data-size='sm'] .an-stat__value {
    font-size: var(--an-text-headline-size);
  }

  .an-stat[data-size='lg'] .an-stat__value {
    font-size: var(--an-text-title1-size);
  }

  .an-stat__unit {
    font-size: 0.6em;
    font-weight: var(--an-weight-medium);
    color: var(--an-text-faint);
  }

  .an-stat__delta {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-inline-start: auto;
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    letter-spacing: 0;
  }

  /* The arrow carries the direction and the colour only reinforces it, so this
     still reads correctly in greyscale and under forced colours. */
  .an-stat__delta[data-tone='good'] {
    color: var(--an-success);
  }

  .an-stat__delta[data-tone='bad'] {
    color: var(--an-danger);
  }

  .an-stat__delta[data-tone='flat'] {
    color: var(--an-text-faint);
  }

  .an-stat__hint {
    margin: 2px 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .an-stat__chart {
    margin-top: var(--an-space-2);
  }

  .an-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
