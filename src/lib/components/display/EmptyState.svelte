<!--
  EmptyState — the screen before there is anything to show.

  An empty list is the most common screen in a new account and the least
  designed one, usually because it is written last. Three things make the
  difference between a dead end and a starting point, and this component's shape
  enforces all three: a title that says what is missing, a line that says why
  that is normal, and an action that fixes it.

  `tone="error"` is the same layout for a failure — a failed load and an empty
  list are the same problem to the reader ("nothing here"), and they should not
  be two different components with two different paddings.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    title: string;
    /** Why it is empty and what would fill it. One sentence. */
    description?: string;
    /** `error` for a failure, `empty` for the ordinary nothing-yet case. */
    tone?: 'empty' | 'error';
    size?: 'sm' | 'md';
    /** Decorative glyph above the title. Kept optional — an illustration that
        says nothing is worse than the space it occupies. */
    icon?: Snippet;
    /** Buttons. The primary one should be the thing that ends the emptiness. */
    actions?: Snippet;
    children?: Snippet;
  }

  let {
    title,
    description,
    tone = 'empty',
    size = 'md',
    class: className,
    icon,
    actions,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  data-an="empty-state"
  data-tone={tone}
  data-size={size}
  class={cn('an-empty', className)}
  role={tone === 'error' ? 'alert' : undefined}
  {...rest}
>
  {#if icon}<span class="an-empty__icon" aria-hidden="true">{@render icon()}</span>{/if}

  <p class="an-empty__title">{title}</p>
  {#if description}<p class="an-empty__desc">{description}</p>{/if}

  {@render children?.()}

  {#if actions}<div class="an-empty__actions">{@render actions()}</div>{/if}
</div>

<style>
  .an-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--an-space-2);
    padding: var(--an-space-8) var(--an-space-6);
    text-align: center;
    font-family: var(--an-font-sans);
  }

  .an-empty[data-size='sm'] {
    padding: var(--an-space-6) var(--an-space-4);
  }

  .an-empty__icon {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    margin-bottom: var(--an-space-1);
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
    color: var(--an-text-faint);
  }

  .an-empty[data-tone='error'] .an-empty__icon {
    background: var(--an-danger-soft);
    color: var(--an-danger);
  }

  .an-empty__title {
    margin: 0;
    font-size: var(--an-text-headline-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  /* Capped, not because long copy is forbidden but because an empty state that
     needs a paragraph is documentation wearing a component. */
  .an-empty__desc {
    margin: 0;
    max-width: 42ch;
    font-size: var(--an-text-footnote-size);
    line-height: 1.55;
    color: var(--an-text-muted);
  }

  .an-empty__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--an-space-2);
    margin-top: var(--an-space-3);
  }
</style>
