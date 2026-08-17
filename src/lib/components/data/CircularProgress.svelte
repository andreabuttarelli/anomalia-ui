<!--
  CircularProgress — a ring for a bounded quantity: an agent's context window,
  a quota, an upload, a score.

  Two behaviours make it useful rather than decorative:

    • **Tone follows the number.** Past `warnAt` it turns warning, past
      `dangerAt` it turns danger. A context meter that stays the same colour at
      95% has told the user nothing they could not already read.
    • **It is honest about indeterminate.** Without a `value` it spins a fixed
      arc rather than filling to an invented number — a progress ring that
      pretends to know its progress is worse than one that admits it does not.

  Built from two SVG circles and `stroke-dasharray`, so it scales to any size,
  inherits `currentColor`, and needs no canvas. The transition runs on the
  emphasized curve, so a jump from 20% to 80% reads as a sweep, not a cut.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Tone } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** 0–100. `null` renders the indeterminate spin. */
    value?: number | null;
    size?: number;
    /** Ring thickness in px. */
    thickness?: number;
    /** Fixed tone. Omit to let the thresholds decide. */
    tone?: Tone | null;
    warnAt?: number;
    dangerAt?: number;
    /** `true` shows the percentage; a snippet renders anything you like. */
    showValue?: boolean;
    label?: string;
    children?: Snippet;
  }

  let {
    value = null,
    size = 64,
    thickness = 6,
    tone = null,
    warnAt = 75,
    dangerAt = 90,
    showValue = true,
    label,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const clamped = $derived(value === null ? null : Math.min(100, Math.max(0, value)));

  // Geometry: the radius has to sit inside the stroke, or the ring clips.
  const radius = $derived((size - thickness) / 2);
  const circumference = $derived(2 * Math.PI * radius);
  const offset = $derived(
    clamped === null ? circumference * 0.75 : circumference * (1 - clamped / 100)
  );

  const resolvedTone = $derived(
    tone ??
      (clamped === null
        ? 'accent'
        : clamped >= dangerAt
          ? 'danger'
          : clamped >= warnAt
            ? 'warning'
            : 'accent')
  );
</script>

<div
  data-an="circular-progress"
  data-tone={resolvedTone}
  data-indeterminate={clamped === null ? '' : undefined}
  class={cn('an-ring', className)}
  style={`--an-ring-size:${size}px; --an-ring-thickness:${thickness}px`}
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={clamped ?? undefined}
  aria-label={label}
  {...rest}
>
  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
    <circle class="an-ring__track" cx={size / 2} cy={size / 2} r={radius} />
    <circle
      class="an-ring__fill"
      cx={size / 2}
      cy={size / 2}
      r={radius}
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
    />
  </svg>

  {#if children}
    <span class="an-ring__center">{@render children()}</span>
  {:else if showValue && clamped !== null}
    <span class="an-ring__center an-ring__value">{Math.round(clamped)}<i>%</i></span>
  {/if}
</div>

<style>
  .an-ring {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: var(--an-ring-size);
    height: var(--an-ring-size);
    flex-shrink: 0;
    /* Tone resolves to one colour used by the arc and, by inheritance, by
       whatever is rendered in the middle. */
    --an-ring-color: var(--an-accent-emphasis);
    color: var(--an-ring-color);
  }

  .an-ring[data-tone='warning'] {
    --an-ring-color: var(--an-warning);
  }
  .an-ring[data-tone='danger'] {
    --an-ring-color: var(--an-danger);
  }
  .an-ring[data-tone='success'] {
    --an-ring-color: var(--an-success);
  }
  .an-ring[data-tone='info'] {
    --an-ring-color: var(--an-info);
  }
  .an-ring[data-tone='neutral'] {
    --an-ring-color: var(--an-text-muted);
  }

  .an-ring svg {
    position: absolute;
    inset: 0;
    /* Start at twelve o'clock; SVG circles start at three. */
    rotate: -90deg;
  }

  .an-ring__track,
  .an-ring__fill {
    fill: none;
    stroke-width: var(--an-ring-thickness);
  }

  /* The hairline, not the sunken surface: on a dark canvas `--an-surface-sunken`
     is darker than the card behind it, so the track vanished and the ring read
     as a spinner rather than as a proportion. */
  .an-ring__track {
    stroke: var(--an-border);
  }

  .an-ring__fill {
    stroke: var(--an-ring-color);
    stroke-linecap: round;
    transition:
      stroke-dashoffset var(--an-duration-medium-4) var(--an-ease-emphasized),
      stroke var(--an-duration-medium-2) var(--an-ease-standard);
  }

  .an-ring[data-indeterminate] svg {
    animation: an-ring-spin 1.4s linear infinite;
  }

  .an-ring[data-indeterminate] .an-ring__fill {
    transition: none;
  }

  @keyframes an-ring-spin {
    to {
      rotate: 270deg;
    }
  }

  .an-ring__center {
    position: relative;
    display: grid;
    place-items: center;
    line-height: 1;
    font-family: var(--an-font-sans);
    color: var(--an-text);
  }

  .an-ring__value {
    font-size: calc(var(--an-ring-size) * 0.26);
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
  }

  /* The unit is along for the ride, not part of the number. */
  .an-ring__value i {
    font-style: normal;
    font-size: 0.62em;
    color: var(--an-text-faint);
  }

  @media (prefers-reduced-motion: reduce) {
    .an-ring[data-indeterminate] svg {
      animation-duration: 3s;
    }
  }
</style>
