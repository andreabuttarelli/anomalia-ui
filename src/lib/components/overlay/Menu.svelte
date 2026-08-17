<!--
  Menu — a Popover with menu semantics and roving focus.

  Arrow keys move between items, Home/End jump to the ends, typing a letter
  jumps to the next item starting with it, and the first item is focused on
  open. Items are queried from the DOM on each keystroke so dynamic and
  conditionally rendered entries work without registration bookkeeping.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Popover from './Popover.svelte';
  import type { Placement } from '../../utils/position.js';
  import { cn } from '../../utils/cn.js';

  interface Props {
    open?: boolean;
    anchor?: HTMLElement | null;
    placement?: Placement;
    label?: string;
    matchWidth?: boolean;
    class?: string;
    children?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    anchor = null,
    placement = 'bottom-start',
    label,
    matchWidth = false,
    class: className,
    children,
    onclose
  }: Props = $props();

  let list = $state<HTMLElement | null>(null);

  const items = () =>
    list ? Array.from(list.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')) : [];

  function focusAt(index: number) {
    const all = items();
    if (all.length === 0) return;
    // Wrap around — a menu is a loop, not a list with dead ends.
    const target = all[(index + all.length) % all.length];
    target?.focus();
  }

  function onkeydown(event: KeyboardEvent) {
    const all = items();
    const current = all.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusAt(current + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusAt(current - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAt(0);
        break;
      case 'End':
        event.preventDefault();
        focusAt(all.length - 1);
        break;
      case 'Tab':
        // Tab out closes, matching native menu behaviour.
        open = false;
        onclose?.();
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const start = current + 1;
          const match = all
            .slice(start)
            .concat(all.slice(0, start))
            .find((item) => item.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()));
          match?.focus();
        }
    }
  }

  $effect(() => {
    if (!open || !list) return;
    requestAnimationFrame(() => focusAt(0));
  });
</script>

<Popover bind:open {anchor} {placement} {matchWidth} {onclose} class={cn('an-menu', className)}>
  <div
    bind:this={list}
    data-an="menu"
    class="an-menu__list"
    role="menu"
    aria-label={label}
    tabindex="-1"
    {onkeydown}
  >
    {@render children?.()}
  </div>
</Popover>

<style>
  .an-menu__list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    outline: none;
    /* Long menus scroll instead of overflowing the viewport. */
    max-height: min(60vh, 420px);
    overflow-y: auto;
    overscroll-behavior: contain;
  }
</style>
