<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    /** Trailing slot for a menu button, badge or switch. */
    actions?: Snippet;
    children?: Snippet;
  }

  let { title, description, class: className, actions, children, ...rest }: Props = $props();
</script>

<div data-an="card-header" class={cn('an-card-header', className)} {...rest}>
  <div class="an-card-header__text">
    {#if title}<h3 class="an-card-header__title">{title}</h3>{/if}
    {#if description}<p class="an-card-header__desc">{description}</p>{/if}
    {@render children?.()}
  </div>
  {#if actions}<div class="an-card-header__actions">{@render actions()}</div>{/if}
</div>

<style>
  .an-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    margin-bottom: var(--an-space-4);
  }

  .an-card-header__text {
    min-width: 0;
  }

  .an-card-header__title {
    margin: 0;
    font-size: var(--an-text-headline-size);
    line-height: var(--an-text-headline-line);
    letter-spacing: var(--an-text-headline-track);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .an-card-header__desc {
    margin: var(--an-space-1) 0 0;
    font-size: var(--an-text-footnote-size);
    line-height: var(--an-text-footnote-line);
    color: var(--an-text-muted);
  }

  .an-card-header__actions {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    flex-shrink: 0;
  }
</style>
