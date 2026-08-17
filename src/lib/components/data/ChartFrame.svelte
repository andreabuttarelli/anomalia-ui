<!--
  ChartFrame — the chrome around a plot: title, legend, table view, tooltip.

  These four are the difference between a picture and a chart, and they are the
  four every hand-rolled chart skips. Putting them in one wrapper means each
  plot component only has to draw marks.

    • **A legend whenever there are two or more series.** Colour-matching alone
      is not an identity channel — the legend is. One series gets none: there is
      nothing to tell apart, and a box with a single swatch just restates the
      title.
    • **A table view, always.** It is the WCAG-clean twin: every value reachable
      without seeing a single pixel of colour, and the reason a light-mode hue
      that sits under 3:1 as a *mark* is still legitimate. It is also what makes
      the tooltip an enhancement rather than the only way to read a number.
    • **A tooltip that is positioned, not guessed.** Anchored to a point in the
      plot, flipped when it would leave the box.

  The plot itself goes in `children`, which receives the measured plot box —
  charts here are drawn against a real pixel size rather than a viewBox, because
  a viewBox scales the type and the hairlines along with the marks.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import { seriesColor, type Series } from './chart.js';

  export interface PlotBox {
    width: number;
    height: number;
  }

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
    /** Names the chart for assistive tech and for the table view's caption. */
    title?: string;
    /** Drives the legend and the table's columns. */
    series?: Series[];
    /** The x-axis categories, used as the table's row headers. */
    labels?: string[];
    height?: number;
    /** Room for the y-axis labels. 0 when the chart has no y-axis. */
    padLeft?: number;
    /** Room for the x-axis band. Never 0 when there are x labels — an axis that
        does not fit is what makes a card grow its own tiny scrollbar. */
    padBottom?: number;
    padTop?: number;
    padRight?: number;
    /** Offers the table twin. Only turn it off when the caller renders its own. */
    tableView?: boolean;
    format?: (value: number) => string;
    /** Rendered above the plot, right of the title. */
    toolbar?: Snippet;
    /** The plot. Receives the measured inner box. */
    children: Snippet<[PlotBox]>;
    /** Tooltip contents. Absent, the frame renders no tooltip layer. */
    tooltip?: Snippet;
    /** Where the tooltip points, in plot coordinates. */
    tooltipAt?: { x: number; y: number } | null;
    /** The measured inner box. Bind it — a plot needs the pixel size to build
        its scales, and reading it back out of the snippet argument would mean
        assigning state during render, which never settles. */
    plot?: PlotBox;
  }

  let {
    title,
    series = [],
    labels = [],
    height = 220,
    padLeft = 44,
    padBottom = 24,
    padTop = 8,
    padRight = 8,
    tableView = true,
    format = (v) => v.toLocaleString('en-US'),
    class: className,
    toolbar,
    children,
    tooltip,
    tooltipAt = null,
    plot = $bindable({ width: 0, height: 0 }),
    ...rest
  }: Props = $props();

  const id = uid('chart');

  let box = $state<HTMLElement | null>(null);
  let outerWidth = $state(0);
  let showTable = $state(false);

  $effect(() => {
    if (!box || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([entry]) => (outerWidth = entry.contentRect.width));
    ro.observe(box);
    return () => ro.disconnect();
  });

  $effect(() => {
    plot = {
      width: Math.max(0, outerWidth - padLeft - padRight),
      height: Math.max(0, height - padTop - padBottom)
    };
  });

  const showLegend = $derived(series.length > 1);
</script>

<figure data-an="chart-frame" class={cn('an-chart', className)} {...rest}>
  {#if title || toolbar || showLegend}
    <figcaption class="an-chart__head">
      {#if title}<p class="an-chart__title" id={`${id}-title`}>{title}</p>{/if}

      <div class="an-chart__head-end">
        {#if showLegend}
          <ul class="an-chart__legend">
            {#each series as s, i (s.id)}
              <li class="an-chart__legend-item">
                <span class="an-chart__swatch" style={`background:${seriesColor(s, i)}`}></span>
                {s.label}
              </li>
            {/each}
          </ul>
        {/if}
        {@render toolbar?.()}
      </div>
    </figcaption>
  {/if}

  <div
    class="an-chart__plot"
    bind:this={box}
    style={`height:${height}px; padding:${padTop}px ${padRight}px ${padBottom}px ${padLeft}px`}
    role="img"
    aria-labelledby={title ? `${id}-title` : undefined}
  >
    {#if outerWidth > 0}
      {@render children(plot)}
    {/if}

    {#if tooltip && tooltipAt}
      <!-- Flipped rather than clipped: past the midpoint it hangs off the other
           side of the anchor, so it never leaves the card. -->
      <div
        class="an-chart__tip"
        data-flip={tooltipAt.x > plot.width / 2 ? '' : undefined}
        style={`left:${padLeft + tooltipAt.x}px; top:${padTop + tooltipAt.y}px`}
        role="status"
      >
        {@render tooltip()}
      </div>
    {/if}
  </div>

  {#if tableView && series.length > 0}
    <div class="an-chart__table-wrap">
      <button
        class="an-chart__table-toggle"
        type="button"
        aria-expanded={showTable}
        aria-controls={`${id}-table`}
        onclick={() => (showTable = !showTable)}
      >
        {showTable ? 'Hide' : 'Show'} the numbers
      </button>

      {#if showTable}
        <div class="an-chart__table" id={`${id}-table`}>
          <table>
            {#if title}<caption>{title}</caption>{/if}
            <thead>
              <tr>
                <th scope="col"></th>
                {#each series as s (s.id)}<th scope="col">{s.label}</th>{/each}
              </tr>
            </thead>
            <tbody>
              {#each labels.length ? labels : series[0].values.map((_, i) => String(i + 1)) as row, i (row + i)}
                <tr>
                  <th scope="row">{row}</th>
                  {#each series as s (s.id)}
                    <td>{s.values[i] === null || s.values[i] === undefined ? '—' : format(s.values[i] as number)}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  {/if}
</figure>

<style>
  .an-chart {
    margin: 0;
    font-family: var(--an-font-sans);
    color: var(--an-text);
  }

  .an-chart__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    flex-wrap: wrap;
    margin-bottom: var(--an-space-3);
  }

  .an-chart__title {
    margin: 0;
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
  }

  .an-chart__head-end {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    margin-inline-start: auto;
  }

  .an-chart__legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--an-space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* The swatch carries the identity; the text stays in an ink token. A
     categorical hue used as text is illegible at label sizes, and colouring the
     label would put the encoding somewhere a screen reader cannot follow. */
  .an-chart__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: var(--an-text-caption-size);
    color: var(--an-text-muted);
    white-space: nowrap;
  }

  .an-chart__swatch {
    width: 9px;
    height: 9px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .an-chart__plot {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .an-chart__tip {
    position: absolute;
    z-index: 2;
    translate: 10px -50%;
    padding: 6px 9px;
    border: 1px solid var(--an-border);
    border-radius: 8px;
    background: var(--an-surface);
    box-shadow: var(--an-shadow-md);
    font-size: var(--an-text-caption-size);
    line-height: 1.45;
    white-space: nowrap;
    pointer-events: none;
  }

  .an-chart__tip[data-flip] {
    translate: calc(-100% - 10px) -50%;
  }

  .an-chart__table-wrap {
    margin-top: var(--an-space-2);
  }

  .an-chart__table-toggle {
    padding: 0;
    border: none;
    background: none;
    color: var(--an-text-faint);
    font: inherit;
    font-size: var(--an-text-caption-size);
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }

  @media (hover: hover) {
    .an-chart__table-toggle:hover {
      color: var(--an-text);
    }
  }

  .an-chart__table {
    margin-top: var(--an-space-2);
    max-height: 260px;
    overflow: auto;
  }

  .an-chart__table table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--an-text-caption-size);
  }

  .an-chart__table caption {
    padding-bottom: 6px;
    color: var(--an-text-faint);
    text-align: start;
  }

  .an-chart__table th,
  .an-chart__table td {
    padding: 4px 8px;
    border-bottom: 1px solid var(--an-border);
    text-align: end;
    font-variant-numeric: tabular-nums;
  }

  .an-chart__table th[scope='row'],
  .an-chart__table thead th:first-child {
    text-align: start;
    font-weight: var(--an-weight-medium);
    font-variant-numeric: normal;
  }

  .an-chart__table thead th {
    color: var(--an-text-faint);
    font-weight: var(--an-weight-semibold);
  }
</style>
