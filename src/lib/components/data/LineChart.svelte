<!--
  LineChart — change over time, for one series or several.

  Everything that makes a line chart readable rather than merely present:

    • **One axis. Always.** There is no second-y-scale prop and there will not
      be one — the alignment between two scales is arbitrary, so a dual axis
      invents a correlation that is not in the data. Two measures of different
      magnitude are two charts, or both indexed to 100 at t0.
    • **A crosshair, not per-point hover.** The pointer maps to the nearest
      column and reads every series at once, which is the comparison the chart
      exists for and is impossible if you have to land on an 8px dot.
    • **Gaps stay gaps.** A `null` breaks the line instead of being interpolated
      across; drawing straight through missing data is a claim about data that
      does not exist.
    • **Selective end labels.** The last value of each series, and nothing else.
      A number on every point is chaos and goes unread.

  A single series is ink, not a hue: colour encodes identity, and with one
  series there is no identity to encode.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import ChartFrame from './ChartFrame.svelte';
  import {
    areaPath,
    compact,
    extent,
    linePath,
    niceDomain,
    seriesColor,
    type Series
  } from './chart.js';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    series: Series[];
    /** One per x position. Ticks are thinned to fit; the table keeps them all. */
    labels?: string[];
    title?: string;
    height?: number;
    /** A wash under the line. Only honest for a single series — stacked washes
        over each other read as a colour nobody chose. */
    area?: boolean;
    /** Print the final value beside each line. */
    endLabels?: boolean;
    /** Force the y-axis to include zero. On by default for counts; turn it off
        for a rate or an index, where zero is not a meaningful floor. */
    zero?: boolean;
    format?: (value: number) => string;
    tableView?: boolean;
    /** Controls beside the title — a range picker, a series toggle. */
    toolbar?: Snippet;
  }

  let {
    series,
    labels = [],
    title,
    height = 220,
    area = false,
    endLabels = true,
    zero = true,
    format = compact,
    tableView = true,
    class: className,
    toolbar,
    ...rest
  }: Props = $props();

  const PAD_L = 44;
  const PAD_B = 24;
  const PAD_T = 10;
  const PAD_R = 12;

  const columns = $derived(Math.max(...series.map((s) => s.values.length), 0));
  const [lo, hi] = $derived(extent(series));
  const domain = $derived(niceDomain(lo, hi, { zero }));

  let hover = $state<number | null>(null);
  /** Bound to the frame's measured inner box. The scales are derived from it,
      so they are correct on the first paint after measurement rather than one
      render behind. */
  let plot = $state({ width: 0, height: 0 });
  const plotW = $derived(plot.width);
  const plotH = $derived(plot.height);

  const stepX = $derived(columns > 1 ? plotW / (columns - 1) : 0);

  /** With one series there is no identity to encode, so it gets ink rather than
      spending a categorical slot. `seriesColor` still wins when the caller set
      an explicit colour on the series. */
  const colourOf = (s: Series, i: number) =>
    series.length === 1 && !s.color ? 'var(--an-accent-emphasis)' : seriesColor(s, i);

  const xAt = (i: number) => (columns > 1 ? i * stepX : plotW / 2);
  const yAt = (v: number) =>
    plotH - ((v - domain.min) / (domain.max - domain.min || 1)) * plotH;

  /** Thin the x labels to whatever fits at ~60px apart, always keeping the
      first and last — the two a reader actually uses to orient. */
  const tickEvery = $derived(
    columns > 1 ? Math.max(1, Math.ceil(columns / Math.max(2, Math.floor(plotW / 60)))) : 1
  );

  /** Direct end labels only work while the lines separate at the right edge.
      Where two would sit within a line's height of each other, the lower one is
      dropped — nudging a label off its own line detaches it from the thing it
      labels, and the value is still in the tooltip and the table. */
  const visibleEnds = $derived.by(() => {
    if (!endLabels) return [];

    const placed: { series: Series; value: number; y: number }[] = [];

    for (const s of series) {
      const value = [...s.values].reverse().find((v) => v !== null && v !== undefined);
      if (value === undefined || value === null) continue;

      const y = yAt(value as number);
      if (placed.some((p) => Math.abs(p.y - y) < 13)) continue;
      placed.push({ series: s, value: value as number, y });
    }

    return placed;
  });

  function onmove(event: PointerEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    hover = columns > 1 ? Math.max(0, Math.min(columns - 1, Math.round(x / stepX))) : 0;
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
  class={cn('an-line', className)}
  tooltipAt={hover === null ? null : { x: xAt(hover), y: plotH / 2 }}
  {...rest}
>
  {#snippet tooltip()}
    {#if hover !== null}
      <p class="an-line__tip-label">{labels[hover] ?? `#${hover + 1}`}</p>
      {#each series as s, i (s.id)}
        <p class="an-line__tip-row">
          <span class="an-line__tip-dot" style={`background:${colourOf(s, i)}`}></span>
          <span class="an-line__tip-name">{s.label}</span>
          <b>{s.values[hover] === null || s.values[hover] === undefined
            ? '—'
            : format(s.values[hover] as number)}</b>
        </p>
      {/each}
    {/if}
  {/snippet}

  {#snippet children(box)}
    <svg
      class="an-line__svg"
      width={box.width}
      height={box.height}
      aria-hidden="true"
      onpointermove={onmove}
      onpointerleave={() => (hover = null)}
    >
      <!-- Grid first, so every mark sits on top of it. Solid hairlines: a
           dashed grid reads as "threshold" when it is only a grid. -->
      {#each domain.ticks as tick (tick)}
        <line
          class="an-line__grid"
          x1="0"
          x2={box.width}
          y1={yAt(tick)}
          y2={yAt(tick)}
        />
        <text class="an-line__ytick" x={-8} y={yAt(tick)} dy="0.32em">{format(tick)}</text>
      {/each}

      {#if hover !== null}
        <line
          class="an-line__crosshair"
          x1={xAt(hover)}
          x2={xAt(hover)}
          y1="0"
          y2={box.height}
        />
      {/if}

      {#each series as s, i (s.id)}
        {@const colour = colourOf(s, i)}

        {#if area && series.length === 1}
          <path class="an-line__area" d={areaPath(s.values, xAt, yAt, box.height)} fill={colour} />
        {/if}

        <path class="an-line__path" d={linePath(s.values, xAt, yAt)} stroke={colour} />

        {#if hover !== null && s.values[hover] !== null && s.values[hover] !== undefined}
          <!-- The ring is the surface colour, so the dot stays legible where it
               crosses another series' line. -->
          <circle
            class="an-line__dot"
            cx={xAt(hover)}
            cy={yAt(s.values[hover] as number)}
            r="4"
            fill={colour}
          />
        {/if}
      {/each}

      {#each labels as label, i (label + i)}
        {#if i % tickEvery === 0 || i === columns - 1}
          <text
            class="an-line__xtick"
            x={xAt(i)}
            y={box.height + 15}
            text-anchor={i === 0 ? 'start' : i === columns - 1 ? 'end' : 'middle'}
          >
            {label}
          </text>
        {/if}
      {/each}
    </svg>

    {#if endLabels}
      <div class="an-line__ends">
        {#each visibleEnds as { series: s, value: last } (s.id)}
          {#if true}
            <span
              class="an-line__end"
              style={`top:${PAD_T + yAt(last)}px; left:${PAD_L + box.width + 4}px`}
            >
              {format(last)}
            </span>
          {/if}
        {/each}
      </div>
    {/if}
  {/snippet}
</ChartFrame>

<style>
  .an-line__svg {
    overflow: visible;
    touch-action: pan-y;
  }

  .an-line__grid {
    stroke: var(--an-chart-grid);
    stroke-width: 1;
    shape-rendering: crispEdges;
  }

  .an-line__crosshair {
    stroke: var(--an-chart-axis);
    stroke-width: 1;
    shape-rendering: crispEdges;
  }

  .an-line__ytick,
  .an-line__xtick {
    fill: var(--an-text-faint);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }

  .an-line__ytick {
    text-anchor: end;
  }

  .an-line__path {
    fill: none;
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  /* A wash, never a saturated block: the line is the mark, the fill only says
     which side of it is "under". */
  .an-line__area {
    opacity: 0.1;
    stroke: none;
  }

  .an-line__dot {
    stroke: var(--an-surface);
    stroke-width: 2;
  }

  .an-line__ends {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .an-line__end {
    position: absolute;
    translate: 0 -50%;
    font-size: 10px;
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--an-text-muted);
  }

  .an-line__tip-label {
    margin: 0 0 3px;
    color: var(--an-text-faint);
  }

  .an-line__tip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
  }

  .an-line__tip-name {
    color: var(--an-text-muted);
    margin-inline-end: var(--an-space-3);
  }

  .an-line__tip-row b {
    margin-inline-start: auto;
    font-variant-numeric: tabular-nums;
  }

  .an-line__tip-dot {
    width: 8px;
    height: 8px;
    border-radius: var(--an-radius-full);
    flex-shrink: 0;
  }
</style>
