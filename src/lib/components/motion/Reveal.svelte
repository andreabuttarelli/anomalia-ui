<!--
  Reveal — entrance animation when an element scrolls into view.

  Three things separate a reveal that feels intentional from one that feels like
  a page fighting you:

    • **It only ever runs once by default.** Content that re-animates every time
      it scrolls back into view turns reading into a slideshow.
    • **The distance is small.** 12px, not 60px. A long travel reads as "this
      just arrived from somewhere", which is a lie — it was always there, the
      viewport moved.
    • **It never hides content that failed to animate.** The observer sets the
      visible state; if IntersectionObserver is missing, or JS never runs, the
      element renders visible rather than invisible-forever. Entrance motion is
      decoration, and decoration must not be able to hide the page.

  Stagger a group by passing `index` inside an `{#each}` — each item waits
  `index × stagger`, which is what makes a list feel like it is being dealt
  rather than dropped.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { prefersReducedMotion } from '../../utils/events.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    as?: string;
    /** Travel distance in px. Negative comes from below. */
    y?: number;
    x?: number;
    /** Starting scale — 0.98 reads as "settling", 0.8 reads as "zooming". */
    scale?: number;
    /** Position in a staggered group; multiplied by `stagger`. */
    index?: number;
    stagger?: number;
    /** Extra delay in ms, added on top of the stagger. */
    delay?: number;
    duration?: number;
    /** Re-animate every time it enters the viewport. Off by default, on purpose. */
    repeat?: boolean;
    /** How much must be visible before it fires, 0–1. */
    threshold?: number;
    children?: Snippet;
  }

  let {
    as = 'div',
    y = 12,
    x = 0,
    scale = 1,
    index = 0,
    stagger = 60,
    delay = 0,
    duration = 500,
    repeat = false,
    threshold = 0.15,
    class: className,
    children,
    ...rest
  }: Props = $props();

  let element = $state<HTMLElement | null>(null);
  let visible = $state(false);

  const totalDelay = $derived(index * stagger + delay);

  $effect(() => {
    if (!element) return;

    // Reduced motion: the content appears, the movement does not.
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      visible = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible = true;
            if (!repeat) observer.disconnect();
          } else if (repeat) {
            visible = false;
          }
        }
      },
      { threshold, rootMargin: '0px 0px -5% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  });
</script>

<svelte:element
  this={as}
  bind:this={element}
  data-an="reveal"
  data-visible={visible ? '' : undefined}
  class={cn('an-reveal', className)}
  style={`--an-reveal-x:${x}px; --an-reveal-y:${y}px; --an-reveal-scale:${scale}; --an-reveal-delay:${totalDelay}ms; --an-reveal-duration:${duration}ms`}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .an-reveal {
    opacity: 0;
    translate: var(--an-reveal-x) var(--an-reveal-y);
    scale: var(--an-reveal-scale);
    transition:
      opacity var(--an-reveal-duration) var(--an-ease-standard) var(--an-reveal-delay),
      translate var(--an-reveal-duration) var(--an-ease-emphasized-decelerate)
        var(--an-reveal-delay),
      scale var(--an-reveal-duration) var(--an-ease-emphasized-decelerate) var(--an-reveal-delay);
    /* Promote only while it is doing something; a page full of permanently
       promoted layers is how a scroll starts dropping frames. */
    will-change: opacity, translate;
  }

  .an-reveal[data-visible] {
    opacity: 1;
    translate: 0 0;
    scale: 1;
    will-change: auto;
  }

  /* Belt and braces: if motion is off, never leave content mid-transition. */
  @media (prefers-reduced-motion: reduce) {
    .an-reveal {
      opacity: 1;
      translate: 0 0;
      scale: 1;
    }
  }
</style>
