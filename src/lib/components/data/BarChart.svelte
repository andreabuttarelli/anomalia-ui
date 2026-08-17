<!--
  BarChart — magnitude across categories, plain or stacked.

  The specs that separate a considered bar chart from a coloured block diagram,
  all of them fixed rather than props:

    • **Bars are capped at 24px and never fill their slot.** The leftover in the
      band is air, and it is what stops a chart of six categories reading as a
      wall.
    • **Rounded at the data end, square at the baseline.** A bar rounded at both
      ends floats; rounded only at the tip, it grows out of the axis.
    • **A 2px surface gap separates touching fills** — between stacked segments
      and between adjacent bars alike. Never a stroke: a border around a mark is
      ink that is not data.
    • **The baseline is zero.** Not optional and not a prop: a bar chart whose
      axis starts elsewhere exaggerates every difference on it.
    • **Values are labelled selectively**, on the cap, and only when they fit.

  One series is ink. Stacked series take the categorical slots in order, and get
  a legend and a table view because colour alone is not an identity channel.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import ChartFrame from './ChartFrame.svelte';
  import { compact, niceDomain, seriesColor, type Series } from './chart.js';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    /** One entry per bar. */
    labels: string[];
    /** One entry stacks; several stack on top of each other. */
    series: Series[];
    title?: string;
    height?: number;
    /** Print the total on each bar's cap. */
    showValues?: boolean;
    /** Fixed ceiling. Omit to fit the tallest bar. */
    max?: number;
    format?: (value: number) => string;
    tableView?: boolean;
    /** Controls beside the title — a range picker, a series toggle. */
    toolbar?: Snippet;
  }

  let {
    labels,
    series,
    title,
    height = 200,
    showValues = false,
    max,
    format = compact,
    tableView = true,
    class: className,
    toolbar,
    ...rest
  }: Props = $props();

  const PAD_L = 40;
  const PAD_B = 26;
  const PAD_T = 14;
  const PAD_R = 4;

  /** Cap, gap and corner are the mark spec, not knobs. */
  const MAX_BAR = 24;
  const GAP = 2;
  const RADIUS = 4;

  const totals = $derived(
    labels.map((_, i) =>
      series.reduce((sum, s) => sum + Math.max(0, (s.values[i] as number) ?? 0), 0)
    )
  );

  const domain = $derived(niceDomain(0, max ?? Math.max(1, ...totals), { zero: true }));

  let hover = $state<number | null>(null);
  /** Bound to the frame's measured inner box. The scales are derived from it,
      so they are correct on the first paint after measurement rather than one
      render behind. */
  let plot = $state({ width: 0, height: 0 });
  const plotW = $derived(plot.width);
  const plotH = $derived(plot.height);

  const band = $derived(labels.length > 0 ? plotW / labels.length : 0);
  const barW = $derived(Math.min(MAX_BAR, band * 0.62));

  const yAt = (v: number) => plotH - (v / (domain.max || 1)) * plotH;
  const xAt = (i: number) => i * band + (band - barW) / 2;

  function onmove(event: PointerEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const i = Math.floor((event.clientX - rect.left) / band);
    hover = i >= 0 && i < labels.length ? i : null;
  }
</script>

<ChartFrame
  {title}
  {series}
  {labels}
  {height}
  {tableView}
  {format}
  {toolbar}
  bind:plot
  padLeft={PAD_L}
  padBottom={PAD_B}
  padTop={PAD_T}
  padRight={PAD_R}
  class={cn('an-bars', className)}
  tooltipAt={hover === null ? null : { x: xAt(hover) + barW / 2, y: yAt(totals[hover]) }}
  {...rest}
>
  {#snippet tooltip()}
    {#if hover !== null}
      <p class="an-bars__tip-label">{labels[hover]}</p>
      {#each series as s, i (s.id)}
        <p class="an-bars__tip-row">
          <span class="an-bars__tip-dot" style={`background:${seriesColor(s, i)}`}></span>
          <span class="an-bars__tip-name">{s.label}</span>
          <b>{format((s.values[hover] as number) ?? 0)}</b>
        </p>
      {/each}
      {#if series.length > 1}
        <p class="an-bars__tip-row an-bars__tip-total">
          <span class="an-bars__tip-name">Total</span>
          <b>{format(totals[hover])}</b>
        </p>
      {/if}
    {/if}
  {/snippet}

  {#snippet children(box)}
    <svg
      class="an-bars__svg"
      width={box.width}
      height={box.height}
      aria-hidden="true"
      onpointermove={onmove}
      onpointerleave={() => (hover = null)}
    >
      {#each domain.ticks as tick (tick)}
        <line class="an-bars__grid" x1="0" x2={box.width} y1={yAt(tick)} y2={yAt(tick)} />
        <text class="an-bars__ytick" x={-8} y={yAt(tick)} dy="0.32em">{format(tick)}</text>
      {/each}

      {#each labels as label, i (label + i)}
        {@const highlighted = hover === i}
        <g data-hover={highlighted ? '' : undefined}>
          {#each series as s, si (s.id)}
            {@const value = Math.max(0, (s.values[i] as number) ?? 0)}
            {@const below = series
              .slice(0, si)
              .reduce((sum, o) => sum + Math.max(0, (o.values[i] as number) ?? 0), 0)}
            {@const top = yAt(below + value)}
            {@const bottom = yAt(below)}
            {@const isTop = si === series.length - 1}
            {@const h = Math.max(0, bottom - top - (si > 0 ? GAP : 0))}

            {#if value > 0}
              <!-- Only the topmost segment is rounded, and only at its tip: the
                   stack has to read as one bar growing from the axis. -->
              <path
                class="an-bars__bar"
                fill={series.length === 1 ? 'var(--an-chart-ink)' : seriesColor(s, si)}
                d={isTop
                  ? `M${xAt(i)} ${top + RADIUS}a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} ${-RADIUS}h${barW - RADIUS * 2}a${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} ${RADIUS}v${Math.max(0, h - RADIUS)}h${-barW}Z`
                  : `M${xAt(i)} ${top}h${barW}v${h}h${-barW}Z`}
              />
            {/if}
          {/each}

          {#if showValues && totals[i] > 0 && barW >= 22}
            <text class="an-bars__value" x={xAt(i) + barW / 2} y={yAt(totals[i]) - 6}>
              {format(totals[i])}
            </text>
          {/if}

          <text class="an-bars__xtick" x={xAt(i) + barW / 2} y={box.height + 16}>{label}</text>
        </g>
      {/each}
    </svg>
  {/snippet}
</ChartFrame>

<style>
  .an-bars__svg {
    overflow: visible;
    touch-action: pan-y;
  }

  .an-bars__grid {
    stroke: var(--an-chart-grid);
    stroke-width: 1;
    shape-rendering: crispEdges;
  }

  .an-bars__ytick,
  .an-bars__xtick,
  .an-bars__value {
    fill: var(--an-text-faint);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }

  .an-bars__ytick {
    text-anchor: end;
  }

  .an-bars__xtick,
  .an-bars__value {
    text-anchor: middle;
  }

  .an-bars__value {
    fill: var(--an-text-muted);
    font-weight: var(--an-weight-semibold);
  }

  /* Single-series bars are ink. Declared here rather than in the theme because
     it is the *chart's* reading of the accent, and it has to track the theme. */
  .an-bars__svg {
    --an-chart-ink: var(--an-accent-emphasis);
  }

  .an-bars__bar {
    transition: opacity var(--an-duration-short-3) var(--an-ease-standard);
  }

  /* Dim the rest rather than tint the one — emphasis by recession keeps the
     hovered bar its own colour, so the legend still matches. */
  .an-bars__svg:has(g[data-hover]) .an-bars__bar {
    opacity: 0.35;
  }

  .an-bars__svg g[data-hover] .an-bars__bar {
    opacity: 1;
  }

  .an-bars__tip-label {
    margin: 0 0 3px;
    color: var(--an-text-faint);
  }

  .an-bars__tip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
  }

  .an-bars__tip-total {
    margin-top: 3px;
    padding-top: 3px;
    border-top: 1px solid var(--an-border);
  }

  .an-bars__tip-name {
    color: var(--an-text-muted);
    margin-inline-end: var(--an-space-3);
  }

  .an-bars__tip-row b {
    margin-inline-start: auto;
    font-variant-numeric: tabular-nums;
  }

  .an-bars__tip-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--an-radius-full);
    flex-shrink: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .an-bars__bar {
      transition: none;
    }
  }
</style>
