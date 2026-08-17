<!--
  BottomNav — Material 3 navigation bar for phone-sized layouts.

  The active item gets a pill that grows behind its icon (M3's "active
  indicator") and the icon lifts slightly; both animate on the emphasized curve.
  Items render as links when given `href`, so the browser keeps handling
  navigation, history and middle-click.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { haptic } from '../../utils/haptics.js';
  import { cn } from '../../utils/cn.js';
  import type { NavItem } from '../../types.js';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
    value?: string;
    items: NavItem[];
    /** Hide labels for inactive items — M3's compact bar. */
    labelsOnlyWhenActive?: boolean;
    label?: string;
    /** Icon for an item, by value. */
    icon: Snippet<[string]>;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    items,
    labelsOnlyWhenActive = false,
    label = 'Main',
    class: className,
    icon,
    onchange,
    ...rest
  }: Props = $props();

  function select(item: NavItem) {
    if (item.value === value) return;
    value = item.value;
    haptic('light');
    onchange?.(item.value);
  }
</script>

<nav
  data-an="bottom-nav"
  data-compact={labelsOnlyWhenActive ? '' : undefined}
  class={cn('an-bottomnav', className)}
  aria-label={label}
  {...rest}
>
  {#each items as item (item.value)}
    {@const active = item.value === value}
    <svelte:element
      this={item.href ? 'a' : 'button'}
      class="an-bottomnav__item"
      data-active={active ? '' : undefined}
      href={item.href}
      type={item.href ? undefined : 'button'}
      role={item.href ? 'link' : 'button'}
      aria-current={active ? 'page' : undefined}
      onclick={() => select(item)}
      use:ripple={{ centered: true, unbounded: true }}
    >
      <span class="an-bottomnav__icon">
        <span class="an-bottomnav__pill" aria-hidden="true"></span>
        <span class="an-bottomnav__glyph">{@render icon(item.value)}</span>
        {#if item.badge}
          <span class="an-bottomnav__badge" data-dot={item.badge === true ? '' : undefined}>
            {item.badge === true ? '' : item.badge}
          </span>
        {/if}
      </span>
      <span class="an-bottomnav__label">{item.label}</span>
    </svelte:element>
  {/each}
</nav>

<style>
  .an-bottomnav {
    position: sticky;
    bottom: 0;
    z-index: var(--an-z-sticky);
    display: flex;
    align-items: stretch;
    justify-content: space-around;
    gap: var(--an-space-1);
    padding: var(--an-space-2) var(--an-space-2)
      calc(var(--an-space-2) + env(safe-area-inset-bottom, 0px));
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
    border-top: 1px solid var(--an-border);
    font-family: var(--an-font-sans);
  }

  .an-bottomnav__item {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-height: var(--an-tap-target);
    padding: var(--an-space-1) var(--an-space-2);
    border: none;
    background: transparent;
    color: var(--an-text-muted);
    font-family: inherit;
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-medium);
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color var(--an-duration-short-4) var(--an-ease-standard);
  }

  .an-bottomnav__item[data-active] {
    color: var(--an-accent);
  }

  .an-bottomnav__icon {
    position: relative;
    display: grid;
    place-items: center;
    width: 56px;
    height: 30px;
    line-height: 0;
  }

  /* M3 active indicator: a pill that scales in behind the icon. */
  .an-bottomnav__pill {
    position: absolute;
    inset: 0;
    border-radius: var(--an-radius-full);
    background: var(--an-accent-soft);
    scale: 0.4;
    opacity: 0;
    transition:
      scale var(--an-duration-medium-2) var(--an-ease-emphasized),
      opacity var(--an-duration-short-4) var(--an-ease-standard);
  }

  .an-bottomnav__item[data-active] .an-bottomnav__pill {
    scale: 1;
    opacity: 1;
  }

  .an-bottomnav__glyph {
    position: relative;
    z-index: 1;
    transition: translate var(--an-duration-medium-2) var(--an-ease-spring);
  }

  .an-bottomnav__item[data-active] .an-bottomnav__glyph {
    translate: 0 -1px;
  }

  .an-bottomnav__badge {
    position: absolute;
    top: -2px;
    right: 12px;
    z-index: 2;
    min-width: 16px;
    height: 16px;
    padding-inline: 4px;
    border-radius: var(--an-radius-full);
    background: var(--an-danger);
    color: var(--an-on-status);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    line-height: 16px;
    text-align: center;
  }

  .an-bottomnav__badge[data-dot] {
    min-width: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
    top: 2px;
  }

  .an-bottomnav__label {
    transition:
      opacity var(--an-duration-short-4) var(--an-ease-standard),
      max-height var(--an-duration-medium-1) var(--an-ease-emphasized);
  }

  .an-bottomnav[data-compact] .an-bottomnav__item:not([data-active]) .an-bottomnav__label {
    opacity: 0;
    max-height: 0;
    overflow: hidden;
  }
</style>
