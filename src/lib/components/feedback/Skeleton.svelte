<!--
  Skeleton — loading placeholder.

  The sheen sweeps left-to-right rather than pulsing opacity: a pulse on a page
  full of placeholders makes the whole layout throb, while a sweep stays calm
  and still reads as "not ready yet".
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    shape?: 'text' | 'block' | 'circle';
    width?: string;
    height?: string;
    /** Number of text lines; the last one is shortened, like real prose. */
    lines?: number;
    radius?: string;
  }

  let {
    shape = 'text',
    width,
    height,
    lines = 1,
    radius,
    class: className,
    style,
    ...rest
  }: Props = $props();

  const inline = $derived(
    [
      width ? `width:${width}` : null,
      height ? `height:${height}` : null,
      radius ? `border-radius:${radius}` : null,
      style
    ]
      .filter(Boolean)
      .join(';')
  );
</script>

{#if shape === 'text' && lines > 1}
  <div data-an="skeleton" class={cn('an-skeleton-stack', className)} aria-hidden="true" {...rest}>
    {#each { length: lines } as _, index (index)}
      <div
        class="an-skeleton an-skeleton--text"
        style={index === lines - 1 ? 'width:62%' : undefined}
      ></div>
    {/each}
  </div>
{:else}
  <div
    data-an="skeleton"
    data-shape={shape}
    class={cn('an-skeleton', `an-skeleton--${shape}`, className)}
    style={inline || undefined}
    aria-hidden="true"
    {...rest}
  ></div>
{/if}

<style>
  .an-skeleton {
    position: relative;
    overflow: hidden;
    background: var(--an-surface-sunken);
    border-radius: var(--an-radius-sm);
  }

  .an-skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--an-text) 6%, transparent),
      transparent
    );
    animation: an-skeleton-sweep 1.6s var(--an-ease-standard) infinite;
  }

  .an-skeleton--text {
    height: 0.75em;
    border-radius: var(--an-radius-xs);
  }

  .an-skeleton--block {
    height: 100px;
    border-radius: var(--an-radius-lg);
  }

  .an-skeleton--circle {
    width: 40px;
    height: 40px;
    border-radius: var(--an-radius-full);
  }

  .an-skeleton-stack {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
  }

  @keyframes an-skeleton-sweep {
    100% {
      transform: translateX(100%);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-skeleton::after {
      display: none;
    }
  }
</style>
