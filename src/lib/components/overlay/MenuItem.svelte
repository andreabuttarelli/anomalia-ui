<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { cn } from '../../utils/cn.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    /** Renders as a link — keeps middle-click and "open in new tab" working. */
    href?: string;
    tone?: 'default' | 'danger';
    /** Check mark on the trailing edge, for menus that express a choice. */
    selected?: boolean;
    shortcut?: string;
    leading?: Snippet;
    children?: Snippet;
  }

  let {
    href,
    tone = 'default',
    selected = false,
    shortcut,
    disabled = false,
    class: className,
    leading,
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  data-an="menu-item"
  data-an-interactive
  data-tone={tone}
  data-selected={selected ? '' : undefined}
  class={cn('an-menu-item', className)}
  role="menuitem"
  href={href && !disabled ? href : undefined}
  type={href ? undefined : 'button'}
  disabled={href ? undefined : disabled}
  aria-disabled={disabled ? 'true' : undefined}
  tabindex="-1"
  use:ripple={{ disabled }}
  {...rest}
>
  {#if leading}<span class="an-menu-item__leading">{@render leading()}</span>{/if}
  <span class="an-menu-item__label">{@render children?.()}</span>
  {#if shortcut}<kbd class="an-menu-item__shortcut">{shortcut}</kbd>{/if}
  {#if selected}
    <svg class="an-menu-item__check" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-6.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  {/if}
</svelte:element>

<style>
  .an-menu-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    width: 100%;
    /* Comfortable under a thumb, not just a mouse. */
    min-height: 38px;
    padding: var(--an-space-2) var(--an-space-3);
    border: none;
    border-radius: var(--an-radius-sm);
    background: transparent;
    color: var(--an-text);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
    isolation: isolate;
    transition: background-color var(--an-duration-short-2) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-menu-item:hover {
      background: var(--an-surface-hover);
    }
  }

  .an-menu-item:focus-visible {
    background: var(--an-surface-hover);
    outline: none;
  }

  .an-menu-item[data-tone='danger'] {
    color: var(--an-danger);
  }

  .an-menu-item__leading {
    display: inline-flex;
    line-height: 0;
    color: var(--an-text-faint);
    flex-shrink: 0;
  }

  .an-menu-item[data-tone='danger'] .an-menu-item__leading {
    color: currentColor;
  }

  .an-menu-item__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .an-menu-item__shortcut {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    letter-spacing: 0;
    color: var(--an-text-faint);
  }

  .an-menu-item__check {
    width: 16px;
    height: 16px;
    color: var(--an-accent-emphasis);
    flex-shrink: 0;
  }

  .an-menu-item:disabled,
  .an-menu-item[aria-disabled='true'] {
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }
</style>
