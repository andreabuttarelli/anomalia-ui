<!--
  Sparkline — a trend, not a chart.

  A sparkline answers one question ("which way is this going?") at the size of a
  word. It deliberately has no axes, no grid, no legend and no tooltip: the
  moment a reader needs to know an exact value, they need a real chart, and
  bolting labels onto a sparkline gets you neither.

  Drawn as an SVG path in a 100×N viewBox with `preserveAspectRatio="none"`, so
  it stretches to any container. Stroke width is corrected with
  `vector-effect="non-scaling-stroke"`, without which the line would smear into
  a wedge as the box stretches — the classic sparkline bug.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Tone } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    values: number[];
    height?: number;
    /** Fill the area under the line with a fade. */
    area?: boolean;
    /** Mark the final point — where "now" is. */
    marker?: boolean;
    tone?: Tone;
    /** Fixed scale. Omit to fit the data. */
    min?: number;
    max?: number;
    /** Describe the trend for assistive tech; the shape alone says nothing. */
    label?: string;
  }

  let {
    values,
    height = 40,
    area = false,
    marker = false,
    tone = 'accent',
    min,
    max,
    label,
    class: className,
    ...rest
  }: Props = $props();

  const lo = $derived(min ?? Math.min(...values));
  const hi = $derived(max ?? Math.max(...values));

  const points = $derived(
    values.map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      // A flat series would divide by zero; park it on the centre line instead.
      const span = hi - lo;
      const y = span === 0 ? height / 2 : height - ((value - lo) / span) * height;
      return { x, y };
    })
  );

  const path = $derived(points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' '));
  const areaPath = $derived(`${path} L100 ${height} L0 ${height} Z`);
  const last = $derived(points[points.length - 1]);
</script>

<div
  data-an="sparkline"
  data-tone={tone}
  class={cn('an-spark', className)}
  style={`--an-spark-height:${height}px`}
  role="img"
  aria-label={label}
  {...rest}
>
  <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden={label ? undefined : 'true'}>
    {#if area}
      <path class="an-spark__area" d={areaPath} />
    {/if}
    <path class="an-spark__line" d={path} vector-effect="non-scaling-stroke" />
  </svg>

  {#if marker && last}
    <!-- Outside the stretched SVG, so the dot stays round whatever the box does. -->
    <span
      class="an-spark__marker"
      style={`left:${last.x}%; top:${(last.y / height) * 100}%`}
      aria-hidden="true"
    ></span>
  {/if}
</div>

<style>
  .an-spark {
    position: relative;
    display: block;
    width: 100%;
    height: var(--an-spark-height, 40px);
    --an-spark-color: var(--an-accent-emphasis);
    color: var(--an-spark-color);
  }

  .an-spark[data-tone='success'] {
    --an-spark-color: var(--an-success);
  }
  .an-spark[data-tone='warning'] {
    --an-spark-color: var(--an-warning);
  }
  .an-spark[data-tone='danger'] {
    --an-spark-color: var(--an-danger);
  }
  .an-spark[data-tone='info'] {
    --an-spark-color: var(--an-info);
  }
  .an-spark[data-tone='neutral'] {
    --an-spark-color: var(--an-text-muted);
  }

  .an-spark svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .an-spark__line {
    fill: none;
    stroke: var(--an-spark-color);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .an-spark__area {
    fill: color-mix(in srgb, var(--an-spark-color) 12%, transparent);
    stroke: none;
  }

  .an-spark__marker {
    position: absolute;
    width: 6px;
    height: 6px;
    translate: -50% -50%;
    border-radius: var(--an-radius-full);
    background: var(--an-spark-color);
    box-shadow: 0 0 0 2px var(--an-surface);
  }
</style>
