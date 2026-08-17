<!--
  Counter — a number that animates to its value.

  The animation is decelerating, not linear: a linear count-up reads like a
  loading spinner, while an emphasized-decelerate one reads like a value
  settling. It slows into the final digits, which is also the part the reader
  actually cares about.

  Two correctness details that are easy to miss:

    • **The DOM always holds a real number.** The element's text is the value,
      formatted, at every frame — so a screen reader that reads it mid-flight
      gets a number rather than an empty node, and the final state is exactly
      what the value would have rendered without any animation.
    • **A changed value animates from where it is, not from zero.** Re-running
      from 0 every time a metric updates is how a dashboard turns into a slot
      machine.

  Under reduced motion it renders the final value immediately, with no frames
  in between.
-->
<script lang="ts">
  import { untrack } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { curve, duration as durations } from '../../motion/tokens.js';
  import { prefersReducedMotion } from '../../utils/events.js';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    value: number;
    /** Where the first run starts. Later changes animate from the current value. */
    from?: number;
    duration?: number;
    decimals?: number;
    /** Full control over the rendered string — currency, units, compact notation. */
    format?: (value: number) => string;
    prefix?: string;
    suffix?: string;
    /** Wait until it scrolls into view. Off means it runs on mount. */
    startOnView?: boolean;
    as?: string;
  }

  let {
    value,
    from = 0,
    duration: ms = durations.long2,
    decimals = 0,
    format,
    prefix = '',
    suffix = '',
    startOnView = true,
    as = 'span',
    class: className,
    ...rest
  }: Props = $props();

  let element = $state<HTMLElement | null>(null);
  // Both of these are seeded from props on purpose — `from` is where the first
  // run starts, not a value that keeps tracking, so the initial read is untracked.
  let displayed = $state(untrack(() => from));
  // `startOnView` is a prop, so its initial read has to be untracked to be an
  // initial value rather than a live one — the observer below owns it after that.
  let started = $state(!untrack(() => startOnView));

  const render = (input: number) =>
    format ? format(input) : `${prefix}${input.toFixed(decimals)}${suffix}`;

  const text = $derived(render(displayed));

  $effect(() => {
    if (!element || started) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      started = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          started = true;
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  });

  $effect(() => {
    // Depend on the target and the go-signal; read the current display without
    // subscribing to it, or every frame would restart the animation.
    const target = value;
    if (!started) return;

    if (prefersReducedMotion()) {
      displayed = target;
      return;
    }

    let frame = 0;
    let start = 0;
    // `untrack`, or writing `displayed` below would re-trigger this effect on
    // every animation frame and the count would never settle.
    const origin = untrack(() => displayed);
    const distance = target - origin;
    if (distance === 0) return;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / ms);
      displayed = origin + distance * curve.emphasizedDecelerate(t);
      if (t < 1) frame = requestAnimationFrame(step);
      else displayed = target;
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  });
</script>

<svelte:element
  this={as}
  bind:this={element}
  data-an="counter"
  class={cn('an-counter', className)}
  {...rest}
>
  {text}
</svelte:element>

<style>
  .an-counter {
    /* Tabular figures, or the number jitters horizontally as the digits change —
       the single most common flaw in an animated counter. */
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
  }
</style>
