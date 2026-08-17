<!--
  Heatmap — magnitude across two dimensions: a publishing calendar, an hour ×
  weekday grid, a cohort table.

  Sequential, so one hue light→dark and never a rainbow: the whole point of the
  form is that "darker" reads as "more" without a lookup. The ramp here is
  achromatic, which in a monochrome system is the most literal reading of the
  encoding and keeps the grid inside the palette it lives in.

  Two things this owns that hand-rolled heatmaps miss:

    • **A scale legend.** Colour on a continuous scale with no key is a puzzle.
      Five swatches and the two ends of the range answer it in one glance.
    • **Empty is not zero.** A cell with no data gets the surface and a hairline;
      a cell with a real zero gets the first ramp step. Painting both the same
      turns "we did not measure this" into "this was nothing".

  Values are binned into the ramp's steps rather than mapped continuously —
  past about seven classes adjacent bins stop being distinguishable, so more
  resolution would be a lie the eye cannot read.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import { compact } from './chart.js';

  export interface HeatCell {
    /** Column key — a date, an hour, a week. */
    x: string;
    /** Row key — a weekday, a channel, a cohort. */
    y: string;
    /** `null` means "not measured", which is not the same as 0. */
    value: number | null;
  }

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    cells: HeatCell[];
    /** Column order. Omit to take first-seen order from `cells`. */
    columns?: string[];
    /** Row order. Omit to take first-seen order from `cells`. */
    rows?: string[];
    title?: string;
    /** Cell edge in px. Cells stay square — a stretched calendar reads as a bug. */
    size?: number;
    /** Fixed ceiling for the scale. Omit to fit the data. */
    max?: number;
    /** Show every nth column label. Omit to fit automatically. */
    labelEvery?: number;
    format?: (value: number) => string;
    /** What one unit is, for the legend and the cell titles: "posts", "clicks". */
    unit?: string;
  }

  let {
    cells,
    columns,
    rows,
    title,
    size = 14,
    max,
    labelEvery,
    format = compact,
    unit = '',
    class: className,
    ...rest
  }: Props = $props();

  const STEPS = 5;
  const id = uid('heat');

  const cols = $derived(columns ?? [...new Set(cells.map((c) => c.x))]);
  const lanes = $derived(rows ?? [...new Set(cells.map((c) => c.y))]);

  const index = $derived(new Map(cells.map((c) => [`${c.x}|${c.y}`, c.value])));

  const ceiling = $derived(
    max ?? Math.max(1, ...cells.map((c) => c.value ?? 0))
  );

  /** Bin edges, shown in the legend so the classes are readable, not guessed. */
  const edges = $derived(
    Array.from({ length: STEPS }, (_, i) => Math.round((ceiling / STEPS) * (i + 1)))
  );

  /** 0 is its own step — "measured, and it was nothing" — so a real zero is
      visible rather than blending into the empty cells around it. */
  function step(value: number | null): number | null {
    if (value === null || value === undefined) return null;
    if (value <= 0) return 1;
    return Math.min(STEPS + 1, Math.ceil((value / ceiling) * STEPS) + 1);
  }

  const every = $derived(labelEvery ?? Math.max(1, Math.ceil(cols.length / 12)));
</script>

<figure data-an="heatmap" class={cn('an-heat', className)} {...rest}>
  {#if title}<figcaption class="an-heat__title" id={`${id}-title`}>{title}</figcaption>{/if}

  <div class="an-heat__scroll">
    <table class="an-heat__grid" aria-labelledby={title ? `${id}-title` : undefined}>
      <thead>
        <tr>
          <td class="an-heat__corner"></td>
          {#each cols as col, i (col)}
            <th scope="col" class="an-heat__col" style={`width:${size}px`}>
              <span class={i % every === 0 ? '' : 'an-sr-only'}>{col}</span>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each lanes as lane (lane)}
          <tr>
            <th scope="row" class="an-heat__row">{lane}</th>
            {#each cols as col (col)}
              {@const value = index.get(`${col}|${lane}`) ?? null}
              {@const bin = step(value)}
              <td class="an-heat__cell-wrap">
                <span
                  class="an-heat__cell"
                  data-empty={bin === null ? '' : undefined}
                  style={`width:${size}px; height:${size}px; ${
                    bin === null ? '' : `background: var(--an-chart-seq-${bin})`
                  }`}
                  title={`${lane} · ${col} — ${
                    value === null ? 'no data' : `${format(value)}${unit ? ` ${unit}` : ''}`
                  }`}
                >
                  <span class="an-sr-only">
                    {value === null ? 'no data' : `${format(value)} ${unit}`}
                  </span>
                </span>
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <div class="an-heat__legend">
    <span class="an-heat__legend-end">0</span>
    <span class="an-heat__ramp">
      {#each Array(STEPS + 1) as _, i (i)}
        <span
          class="an-heat__swatch"
          style={`background: var(--an-chart-seq-${i + 1})`}
          title={i === 0 ? '0' : `up to ${format(edges[i - 1])}`}
        ></span>
      {/each}
    </span>
    <span class="an-heat__legend-end">{format(ceiling)}{unit ? ` ${unit}` : ''}</span>
  </div>
</figure>

<style>
  .an-heat {
    margin: 0;
    font-family: var(--an-font-sans);
  }

  .an-heat__title {
    margin-bottom: var(--an-space-3);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  /* A calendar is wider than a card on a phone. It scrolls sideways inside its
     own box rather than widening the page. */
  .an-heat__scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .an-heat__grid {
    border-collapse: separate;
    /* The 3px gap is the separation. No borders on the cells: a stroke around
       every square adds a grid of ink that is not data. */
    border-spacing: 3px;
  }

  .an-heat__col,
  .an-heat__row {
    font-size: 10px;
    font-weight: var(--an-weight-regular);
    color: var(--an-text-faint);
    white-space: nowrap;
  }

  .an-heat__col {
    padding-bottom: 2px;
    text-align: start;
  }

  .an-heat__row {
    padding-inline-end: var(--an-space-2);
    text-align: end;
  }

  .an-heat__corner {
    padding: 0;
  }

  .an-heat__cell-wrap {
    padding: 0;
    line-height: 0;
  }

  .an-heat__cell {
    display: block;
    border-radius: 3px;
    background: var(--an-chart-seq-1);
  }

  /* Not measured, not zero. The hairline says "a cell exists here" without
     claiming a value for it. */
  .an-heat__cell[data-empty] {
    background: transparent;
    box-shadow: inset 0 0 0 1px var(--an-border);
  }

  .an-heat__legend {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: var(--an-space-3);
    font-size: 10px;
    color: var(--an-text-faint);
    font-variant-numeric: tabular-nums;
  }

  .an-heat__legend-end {
    white-space: nowrap;
  }

  .an-heat__ramp {
    display: inline-flex;
    gap: 2px;
  }

  .an-heat__swatch {
    width: 11px;
    height: 11px;
    border-radius: 2px;
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
