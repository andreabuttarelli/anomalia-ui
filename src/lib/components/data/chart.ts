/**
 * The arithmetic every chart in this set shares.
 *
 * Kept out of the components because scales, tick selection and number
 * compaction are the parts that are easy to get subtly wrong and impossible to
 * see wrong: an axis that ends at 47 instead of 50, a "1.2K" that should read
 * "1,200", a domain that clips the tallest bar by one pixel. One
 * implementation, tested by every chart that imports it.
 */

export interface Series {
  /** Stable identity. Colour follows this, never the row's position after a
      filter — a reader who learned "Instagram is blue" must not be retrained
      when LinkedIn is switched off. */
  id: string;
  label: string;
  values: (number | null)[];
  /** Overrides the slot. Use for a series that has a fixed brand colour. */
  color?: string;
}

/** How many categorical slots the palette actually guarantees. */
export const CHART_SLOTS = 6;

/**
 * The colour for a series. Past the palette's length this deliberately returns
 * the last slot rather than cycling: a generated seventh hue is indistinguishable
 * from an existing one under CVD, and the honest fix is to fold the tail into
 * "Other" or facet the chart — which the caller has to decide, not this function.
 */
export function seriesColor(series: Series, index: number): string {
  if (series.color) return series.color;
  return `var(--an-chart-${Math.min(index + 1, CHART_SLOTS)})`;
}

/** `[min, max]` across every series, ignoring gaps. */
export function extent(series: Series[]): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;

  for (const s of series) {
    for (const v of s.values) {
      if (v === null || Number.isNaN(v)) continue;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }

  if (lo === Infinity) return [0, 1];
  return [lo, hi];
}

/**
 * A domain that ends on a round number, so the axis reads 0 / 25 / 50 rather
 * than 0 / 23.5 / 47. Always includes zero for magnitude charts: a bar chart
 * whose baseline is not zero exaggerates every difference on it.
 */
export function niceDomain(
  min: number,
  max: number,
  { zero = true, steps = 4 }: { zero?: boolean; steps?: number } = {}
): { min: number; max: number; ticks: number[] } {
  let lo = zero ? Math.min(0, min) : min;
  let hi = Math.max(max, lo + 1e-9);

  if (lo === hi) hi = lo + 1;

  const raw = (hi - lo) / steps;
  const mag = 10 ** Math.floor(Math.log10(raw));
  // 1, 2, 5, 10 — the step sizes people can do arithmetic on in their head.
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;

  lo = Math.floor(lo / step) * step;
  hi = Math.ceil(hi / step) * step;

  const ticks: number[] = [];
  // Accumulate with a guard rather than `for (t = lo; t <= hi; t += step)`,
  // which drifts on fractional steps and can emit 0.30000000000000004.
  const count = Math.round((hi - lo) / step);
  for (let i = 0; i <= count; i += 1) ticks.push(Number((lo + i * step).toPrecision(12)));

  return { min: lo, max: hi, ticks };
}

/**
 * Axis and tooltip numbers. Compact past a thousand because an axis of
 * "1,000,000" is mostly commas, but never below it — "0.9K" is worse than 900
 * in every way.
 */
export function compact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trim(value / 1_000_000)}M`;
  if (abs >= 10_000) return `${trim(value / 1_000)}K`;
  if (abs >= 1_000) return value.toLocaleString('en-US');
  return trim(value);
}

function trim(n: number): string {
  // One decimal, and only when it says something: 1.2K but 3K, not 3.0K.
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

/** Build an SVG path. `null` breaks the line instead of interpolating over a
    gap — a line drawn straight through missing data is a claim about data that
    does not exist. */
export function linePath(
  values: (number | null)[],
  x: (i: number) => number,
  y: (v: number) => number
): string {
  let d = '';
  let pen = false;

  values.forEach((v, i) => {
    if (v === null || Number.isNaN(v)) {
      pen = false;
      return;
    }
    d += `${pen ? 'L' : 'M'}${x(i).toFixed(2)} ${y(v).toFixed(2)}`;
    pen = true;
  });

  return d;
}

/** The same shape closed down to the baseline, for an area wash. */
export function areaPath(
  values: (number | null)[],
  x: (i: number) => number,
  y: (v: number) => number,
  baseline: number
): string {
  const points = values
    .map((v, i) => ({ v, i }))
    .filter((p): p is { v: number; i: number } => p.v !== null && !Number.isNaN(p.v));

  if (points.length < 2) return '';

  const first = points[0];
  const last = points[points.length - 1];

  return (
    `M${x(first.i).toFixed(2)} ${baseline.toFixed(2)}` +
    points.map((p) => `L${x(p.i).toFixed(2)} ${y(p.v).toFixed(2)}`).join('') +
    `L${x(last.i).toFixed(2)} ${baseline.toFixed(2)}Z`
  );
}
