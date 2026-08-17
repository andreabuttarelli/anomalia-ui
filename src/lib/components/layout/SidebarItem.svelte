<!--
  SidebarItem — one destination in the rail.

  A nav item is a link. Rendering it as a `<div onclick>` costs middle-click,
  ⌘-click, "copy link address", and the browser's own idea of what a visited
  page is — so this is an `<a>` whenever it has an `href`, and a `<button>` only
  when it genuinely performs an action instead of going somewhere.

  Two details the collapsed rail depends on:

    • **The label never leaves the accessibility tree.** Collapsed, it is
      clipped rather than removed, so the item still has a name. A tooltip gives
      it back to sighted users on hover and focus.
    • **`current` sets `aria-current="page"`**, which is what tells a screen
      reader which item is the page you are on. The accent bar is the visual
      half of the same statement, never the whole of it.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils/cn.js';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';

  interface Props {
    label: string;
    href?: string;
    /** This is the page being viewed. */
    current?: boolean;
    /** A number renders a count, `true` a dot. */
    badge?: number | boolean;
    disabled?: boolean;
    /** Inherited from the Sidebar in practice; set it if you compose your own. */
    collapsed?: boolean;
    onclick?: (event: MouseEvent) => void;
    icon?: Snippet;
    /** Trailing control — a pin, a menu, a count you render yourself. */
    trailing?: Snippet;
    class?: string;
  }

  let {
    label,
    href,
    current = false,
    badge,
    disabled = false,
    collapsed = false,
    onclick,
    icon,
    trailing,
    class: className
  }: Props = $props();
</script>

<svelte:element
  this={href && !disabled ? 'a' : 'button'}
  data-an="sidebar-item"
  data-current={current ? '' : undefined}
  data-collapsed={collapsed ? '' : undefined}
  class={cn('an-side-item', className)}
  href={href && !disabled ? href : undefined}
  type={href && !disabled ? undefined : 'button'}
  aria-current={current ? 'page' : undefined}
  aria-disabled={disabled ? 'true' : undefined}
  title={collapsed ? label : undefined}
  {onclick}
  use:ripple={{ disabled }}
  use:press={{ disabled }}
  role={undefined}
>
  {#if icon}<span class="an-side-item__icon" aria-hidden="true">{@render icon()}</span>{/if}

  <span class="an-side-item__label">{label}</span>

  {#if badge !== undefined && badge !== false}
    <span class="an-side-item__badge" data-dot={badge === true ? '' : undefined}>
      {#if badge !== true}{badge}{/if}
    </span>
  {/if}

  {#if trailing}<span class="an-side-item__trailing">{@render trailing()}</span>{/if}
</svelte:element>

<style>
  .an-side-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    width: 100%;
    /* 32px and 8px of padding: the app's own rail metrics. A 36px row with a
       36px icon button beside it looked like two different systems. */
    min-height: 32px;
    padding: 0 var(--an-space-2);
    border: none;
    border-radius: var(--an-radius-md);
    background: none;
    color: var(--an-text-muted);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
    isolation: isolate;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      color var(--an-duration-short-3) var(--an-ease-standard);
  }

  /* A wash of ink rather than a named surface, so the hover reads the same
     whether the rail is tinted, plain, or a drawer over the page. */
  @media (hover: hover) {
    .an-side-item:not([aria-disabled='true']):hover {
      background: color-mix(in srgb, var(--an-text) 5%, transparent);
      color: var(--an-text);
    }
  }

  .an-side-item:not([aria-disabled='true']):active {
    background: color-mix(in srgb, var(--an-text) 8%, transparent);
  }

  /* The current item lifts *forward* onto the content surface — the rail is
     recessed, so the page you are on is the one part of it that is not.
     Quieter than a filled pill, and it explains the tint instead of fighting it. */
  .an-side-item[data-current] {
    background: var(--an-surface);
    color: var(--an-text);
    font-weight: var(--an-weight-semibold);
    box-shadow: var(--an-shadow-xs);
  }

  /* Weight and fill are both easy to miss; the bar is the unambiguous half.
     All three are the visual side of a statement `aria-current` already made. */
  .an-side-item[data-current]::before {
    content: '';
    position: absolute;
    inset-inline-start: 0;
    top: 50%;
    translate: 0 -50%;
    width: 2px;
    height: 14px;
    border-radius: var(--an-radius-full);
    background: var(--an-accent-emphasis);
  }

  .an-side-item[aria-disabled='true'] {
    opacity: var(--an-disabled-content);
    pointer-events: none;
  }

  .an-side-item__icon {
    display: grid;
    place-items: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    line-height: 0;
  }

  .an-side-item__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Clipped, not removed. `display: none` here would strip the item's
     accessible name and leave a rail of unnamed buttons. */
  .an-side-item[data-collapsed] {
    justify-content: center;
    padding-inline: 0;
  }

  .an-side-item[data-collapsed] .an-side-item__label,
  .an-side-item[data-collapsed] .an-side-item__trailing {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  .an-side-item__badge {
    display: inline-grid;
    place-items: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    flex-shrink: 0;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
    color: var(--an-text-muted);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
  }

  .an-side-item[data-current] .an-side-item__badge {
    background: var(--an-surface-sunken);
    color: var(--an-text);
  }

  .an-side-item__badge[data-dot] {
    min-width: 6px;
    width: 6px;
    height: 6px;
    padding: 0;
    background: var(--an-accent-emphasis);
  }

  /* Collapsed, a count has nowhere to go — it becomes a marker on the icon. */
  .an-side-item[data-collapsed] .an-side-item__badge {
    position: absolute;
    top: 4px;
    inset-inline-end: 8px;
    min-width: 6px;
    width: 6px;
    height: 6px;
    padding: 0;
    font-size: 0;
    background: var(--an-accent-emphasis);
  }

  .an-side-item__trailing {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
</style>
