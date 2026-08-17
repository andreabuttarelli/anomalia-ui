<!--
  Card — the neutral container. Apple-flat by default: one hairline, a soft
  contact shadow, generous padding.

  Passing `href` or `onclick` promotes it to an interactive surface: it gains a
  ripple, a press squish and elevation on hover, and renders as a real link or
  button so keyboard and screen readers get the affordance too.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    variant?: 'outlined' | 'elevated' | 'filled' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    href?: string;
    /** Marks the card as the active choice in a selectable set. */
    selected?: boolean;
    children?: Snippet;
  }

  let {
    variant = 'outlined',
    padding = 'md',
    href,
    selected = false,
    class: className,
    onclick,
    children,
    ...rest
  }: Props = $props();

  const interactive = $derived(Boolean(href || onclick));
  const tag = $derived(href ? 'a' : onclick ? 'button' : 'div');
</script>

<svelte:element
  this={tag}
  data-an="card"
  data-an-interactive={interactive ? '' : undefined}
  data-variant={variant}
  data-padding={padding}
  data-selected={selected ? '' : undefined}
  class={cn('an-card', interactive && 'an-card--interactive', className)}
  {href}
  type={tag === 'button' ? 'button' : undefined}
  {onclick}
  use:ripple={{ disabled: !interactive }}
  use:press={{ disabled: !interactive, scale: 0.99 }}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .an-card {
    position: relative;
    display: block;
    width: 100%;
    text-align: inherit;
    color: var(--an-text);
    background: var(--an-surface);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    font-family: var(--an-font-sans);
    isolation: isolate;
    transition:
      box-shadow var(--an-duration-medium-1) var(--an-ease-standard),
      border-color var(--an-duration-short-4) var(--an-ease-standard),
      transform var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-card[data-padding='none'] {
    padding: 0;
  }
  .an-card[data-padding='sm'] {
    padding: var(--an-space-3);
  }
  .an-card[data-padding='md'] {
    padding: var(--an-space-5);
  }
  .an-card[data-padding='lg'] {
    padding: var(--an-space-8);
  }

  .an-card[data-variant='elevated'] {
    border-color: transparent;
    box-shadow: var(--an-shadow-md);
  }

  .an-card[data-variant='filled'] {
    background: var(--an-surface-raised);
    border-color: transparent;
  }

  /* Apple's frosted material — only meaningful over content, so pair it with a
     backdrop that actually has something behind it. */
  .an-card[data-variant='glass'] {
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
    border-color: color-mix(in srgb, var(--an-text) 8%, transparent);
  }

  .an-card--interactive {
    cursor: pointer;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  .an-card--interactive::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-card--interactive:hover {
      box-shadow: var(--an-shadow-md);
      border-color: var(--an-border-strong);
    }
    .an-card--interactive:hover::before {
      opacity: calc(var(--an-state-hover) / 2);
    }
  }

  .an-card--interactive[data-pressed] {
    transform: scale(0.99);
  }

  .an-card[data-selected] {
    border-color: var(--an-accent-emphasis);
    box-shadow: 0 0 0 1px var(--an-accent-emphasis);
  }
</style>
