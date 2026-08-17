<!--
  SidebarSection — a labelled group of items in the rail.

  The heading is real: a `<h2>` inside a `<section>` that the group is labelled
  by, so a screen reader can jump between sections instead of walking twenty
  links. Collapsed, the words go but the grouping does not — the heading is
  clipped and a hairline stands in for it, which is the only thing that still
  reads as "these belong together" at 64px wide.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    label?: string;
    collapsed?: boolean;
    /** A "＋" or an overflow menu beside the heading. */
    action?: Snippet;
    children?: Snippet;
  }

  let { label, collapsed = false, class: className, action, children, ...rest }: Props = $props();

  const id = uid('side-section');
</script>

<section
  data-an="sidebar-section"
  data-collapsed={collapsed ? '' : undefined}
  class={cn('an-side-section', className)}
  aria-labelledby={label ? id : undefined}
  {...rest}
>
  {#if label}
    <div class="an-side-section__head">
      <h2 class="an-side-section__label" {id}>{label}</h2>
      {#if action}<span class="an-side-section__action">{@render action()}</span>{/if}
    </div>
  {/if}

  <div class="an-side-section__items">{@render children?.()}</div>
</section>

<style>
  .an-side-section {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .an-side-section + :global(.an-side-section) {
    margin-top: var(--an-space-4);
  }

  .an-side-section__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-2);
    padding: var(--an-space-2) var(--an-space-3) var(--an-space-1);
  }

  .an-side-section__label {
    margin: 0;
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .an-side-section__items {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* At rail width a word does not fit, but the grouping still has to read.
     A hairline is the smallest thing that says "new group". */
  .an-side-section[data-collapsed] .an-side-section__head {
    padding: var(--an-space-2) var(--an-space-2) var(--an-space-1);
  }

  .an-side-section[data-collapsed] .an-side-section__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .an-side-section[data-collapsed] .an-side-section__head::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--an-border);
  }

  .an-side-section[data-collapsed] .an-side-section__action {
    display: none;
  }
</style>
