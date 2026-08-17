<!--
  Kbd — a single key or chord.

  Split on `+` so `⌘+K` renders as two caps with a separator between them,
  which is what makes a chord readable at 11px. Screen readers get the original
  string, because "Command K" read as two adjacent letters is not a shortcut.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** e.g. `⌘K`, `Ctrl+Shift+P`, `Esc`. */
    keys: string;
    size?: 'sm' | 'md';
  }

  let { keys, size = 'md', class: className, ...rest }: Props = $props();

  const parts = $derived(keys.split('+').map((part) => part.trim()).filter(Boolean));
</script>

<span
  data-an="kbd"
  data-size={size}
  class={cn('an-kbd', className)}
  aria-label={keys}
  {...rest}
>
  {#each parts as part, index (index)}
    {#if index > 0}<span class="an-kbd__plus" aria-hidden="true">+</span>{/if}
    <kbd class="an-kbd__key" aria-hidden="true">{part}</kbd>
  {/each}
</span>

<style>
  .an-kbd {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    white-space: nowrap;
  }

  .an-kbd__key {
    display: inline-grid;
    place-items: center;
    min-width: 1.6em;
    padding: 0.15em 0.4em;
    border: 1px solid var(--an-border-strong);
    /* Bottom hairline reads as a key edge without a full 3D bevel. */
    border-bottom-width: 2px;
    border-radius: var(--an-radius-xs);
    background: var(--an-surface);
    color: var(--an-text-muted);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    line-height: 1.4;
    letter-spacing: 0;
  }

  .an-kbd[data-size='sm'] .an-kbd__key {
    font-size: 10px;
    padding: 0.1em 0.3em;
  }

  .an-kbd__plus {
    color: var(--an-text-faint);
    font-size: var(--an-text-caption-size);
  }
</style>
