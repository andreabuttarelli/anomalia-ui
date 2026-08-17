<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** `grouped` is the iOS settings look: rounded card, hairlines between rows. */
    variant?: 'plain' | 'grouped';
    /** Section heading above the list. */
    label?: string;
    children?: Snippet;
  }

  let { variant = 'plain', label, class: className, children, ...rest }: Props = $props();
</script>

{#if label}
  <p class="an-list__label">{label}</p>
{/if}

<div
  data-an="list"
  data-variant={variant}
  class={cn('an-list', className)}
  role="list"
  aria-label={label}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .an-list__label {
    margin: 0 0 var(--an-space-2);
    padding-inline: var(--an-space-4);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-medium);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .an-list {
    display: flex;
    flex-direction: column;
    font-family: var(--an-font-sans);
  }

  .an-list[data-variant='grouped'] {
    background: var(--an-surface);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  /* Hairlines between rows only, inset past the leading slot like iOS. */
  .an-list[data-variant='grouped'] > :global([data-an='list-item'] + [data-an='list-item']) {
    border-top: 1px solid var(--an-border);
  }
</style>
