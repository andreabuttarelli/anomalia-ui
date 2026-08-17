<!--
  RankBars — a ranked list where the bar is the second reading of the number.

  The right form when the categories are named and few, and the question is
  "which is biggest": a horizontal bar puts the label on the same line as its
  mark, so nothing has to be rotated, truncated or matched up through a legend.
  This is what a "platform mix" or a "top pages" panel actually wants, and it is
  usually built as a `<div>` with an inline width — which loses the label
  alignment, the value column, and the accessible meter semantics all at once.

  One colour for every bar, because the categories have no natural order. A
  ramp that darkens with length would double-encode the length as hue and burn
  the only free channel on information the bar already shows.

  `share` switches the scale from "relative to the biggest" to "relative to the
  whole", which are different questions and look identical if you do not say
  which one you are answering.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { compact } from './chart.js';

  export interface RankDatum {
    label: string;
    value: number;
    /** Overrides the bar colour for an entity with a fixed identity. */
    color?: string;
    /** Anything you want on the right of the row: a delta, a badge. */
    meta?: string;
  }

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    data: RankDatum[];
    title?: string;
    /** Scale bars against the sum rather than the largest, and print percentages. */
    share?: boolean;
    /** Sort descending. Off preserves the caller's order — use that when the
        rows have a meaningful sequence (a funnel, a week). */
    sort?: boolean;
    /** Show only the top n, folding the rest into one "Other" row. Past a
        handful of rows a ranked list stops being scannable. */
    limit?: number | null;
    otherLabel?: string;
    format?: (value: number) => string;
    /** Width reserved for labels. A fixed column keeps the bars starting on one
        line, which is what makes them comparable at a glance. */
    labelWidth?: string;
  }

  let {
    data,
    title,
    share = false,
    sort = true,
    limit = null,
    otherLabel = 'Other',
    format = compact,
    labelWidth = '7.5rem',
    class: className,
    ...rest
  }: Props = $props();

  const ordered = $derived(sort ? [...data].sort((a, b) => b.value - a.value) : data);

  const rows = $derived.by(() => {
    if (!limit || ordered.length <= limit) return ordered;
    const head = ordered.slice(0, limit);
    const tail = ordered.slice(limit);
    return [
      ...head,
      { label: otherLabel, value: tail.reduce((sum, d) => sum + d.value, 0) } as RankDatum
    ];
  });

  const total = $derived(rows.reduce((sum, d) => sum + Math.max(0, d.value), 0));
  const peak = $derived(Math.max(1, ...rows.map((d) => d.value)));
  const scale = $derived(share ? Math.max(1, total) : peak);
</script>

<figure data-an="rank-bars" class={cn('an-rank', className)} {...rest}>
  {#if title}<figcaption class="an-rank__title">{title}</figcaption>{/if}

  <ul class="an-rank__list" style={`--an-rank-label:${labelWidth}`}>
    {#each rows as row (row.label)}
      {@const pct = (Math.max(0, row.value) / scale) * 100}
      <li class="an-rank__row">
        <span class="an-rank__label" title={row.label}>{row.label}</span>

        <!-- A real meter: the value, its bounds and its text are all in the
             accessibility tree, so the bar is never the only way to read it. -->
        <span
          class="an-rank__track"
          role="meter"
          aria-valuenow={row.value}
          aria-valuemin={0}
          aria-valuemax={scale}
          aria-valuetext={share ? `${pct.toFixed(1)}%` : format(row.value)}
          aria-label={row.label}
        >
          <span
            class="an-rank__bar"
            style={`width:${pct}%; ${row.color ? `background:${row.color}` : ''}`}
          ></span>
        </span>

        <span class="an-rank__value">
          {share ? `${pct.toFixed(pct < 10 ? 1 : 0)}%` : format(row.value)}
        </span>

        {#if row.meta}<span class="an-rank__meta">{row.meta}</span>{/if}
      </li>
    {/each}
  </ul>
</figure>

<style>
  .an-rank {
    margin: 0;
    font-family: var(--an-font-sans);
  }

  .an-rank__title {
    margin-bottom: var(--an-space-3);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .an-rank__list {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .an-rank__row {
    display: grid;
    grid-template-columns: var(--an-rank-label) 1fr auto;
    align-items: center;
    gap: var(--an-space-3);
  }

  .an-rank__label {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The track is a well, not a border: it shows how much of the scale is left
     without drawing a second edge around the bar. */
  .an-rank__track {
    position: relative;
    display: block;
    height: 6px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
    overflow: hidden;
  }

  .an-rank__bar {
    display: block;
    height: 100%;
    min-width: 2px;
    border-radius: var(--an-radius-full);
    background: var(--an-accent-emphasis);
    transition: width var(--an-duration-medium-4) var(--an-ease-emphasized);
  }

  /* Tabular here, unlike a hero figure: this is a column of numbers that has to
     line up down the list. */
  .an-rank__value {
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
    text-align: end;
    min-width: 3.5ch;
  }

  .an-rank__meta {
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
    font-variant-numeric: tabular-nums;
  }

  @media (prefers-reduced-motion: reduce) {
    .an-rank__bar {
      transition: none;
    }
  }

  @media (max-width: 480px) {
    .an-rank__row {
      grid-template-columns: 1fr auto;
      grid-template-areas: 'label value' 'track track';
      gap: 4px var(--an-space-2);
    }

    .an-rank__label {
      grid-area: label;
    }
    .an-rank__track {
      grid-area: track;
    }
    .an-rank__value {
      grid-area: value;
    }
    .an-rank__meta {
      display: none;
    }
  }
</style>
