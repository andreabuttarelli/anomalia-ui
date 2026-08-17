<!--
  ButtonGroup — welds adjacent buttons into one segmented block: the inner radii
  collapse and the shared borders overlap so the seam stays a single hairline.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    /** `true` keeps the buttons separate but evenly spaced. */
    detached?: boolean;
    children?: Snippet;
  }

  let {
    orientation = 'horizontal',
    detached = false,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  data-an="button-group"
  data-orientation={orientation}
  class={cn('an-btn-group', detached && 'an-btn-group--detached', className)}
  role="group"
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .an-btn-group {
    display: inline-flex;
    align-items: stretch;
  }

  .an-btn-group[data-orientation='vertical'] {
    flex-direction: column;
  }

  .an-btn-group--detached {
    gap: var(--an-space-2);
  }

  /* `:global` because the children are the consumer's buttons, not ours. */
  .an-btn-group:not(.an-btn-group--detached)[data-orientation='horizontal']
    > :global(:not(:first-child)) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    margin-inline-start: -1px;
  }

  .an-btn-group:not(.an-btn-group--detached)[data-orientation='horizontal']
    > :global(:not(:last-child)) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  .an-btn-group:not(.an-btn-group--detached)[data-orientation='vertical']
    > :global(:not(:first-child)) {
    border-start-start-radius: 0;
    border-start-end-radius: 0;
    margin-block-start: -1px;
  }

  .an-btn-group:not(.an-btn-group--detached)[data-orientation='vertical']
    > :global(:not(:last-child)) {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  /* The focused/hovered button must paint its border over its neighbour's. */
  .an-btn-group > :global(:hover),
  .an-btn-group > :global(:focus-visible) {
    z-index: 1;
  }
</style>
