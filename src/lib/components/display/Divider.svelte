<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    /** Optional centred label ("or", "Today"). */
    children?: Snippet;
    /** Indent the rule — matches list rows whose text starts past an avatar. */
    inset?: string;
  }

  let { orientation = 'horizontal', inset, class: className, children, ...rest }: Props = $props();
</script>

<div
  data-an="divider"
  data-orientation={orientation}
  class={cn('an-divider', children && 'an-divider--labelled', className)}
  role="separator"
  aria-orientation={orientation}
  style={inset ? `--an-divider-inset:${inset}` : undefined}
  {...rest}
>
  {#if children}<span class="an-divider__label">{@render children()}</span>{/if}
</div>

<style>
  .an-divider {
    background: var(--an-border);
  }

  .an-divider[data-orientation='horizontal'] {
    height: 1px;
    width: auto;
    margin-inline-start: var(--an-divider-inset, 0);
  }

  .an-divider[data-orientation='vertical'] {
    width: 1px;
    align-self: stretch;
    min-height: 1em;
  }

  .an-divider--labelled {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    background: none;
    height: auto;
    color: var(--an-text-faint);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-caption-size);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .an-divider--labelled::before,
  .an-divider--labelled::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--an-border);
  }
</style>
