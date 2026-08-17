<!--
  Tabs — Material's tab bar: the indicator is one element that slides and
  resizes between tabs on the emphasized curve.

  Tab widths are content-driven, so the indicator is measured from the active
  button (`offsetLeft` / `offsetWidth`) rather than assumed. The measurement is
  re-run when the value, the item list or the container size changes, which
  covers late-loading fonts and responsive reflow — the two things that
  otherwise leave the indicator sitting next to the tab it belongs to.

  The row scrolls horizontally when the tabs overflow, and the newly selected
  tab is scrolled into view, which is how a tab bar survives a phone.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { haptic } from '../../utils/haptics.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import type { SegmentOption } from '../../types.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    value?: string;
    items: SegmentOption[];
    variant?: 'underline' | 'pill';
    /** Stretch tabs to fill the row. */
    fullWidth?: boolean;
    label?: string;
    /**
     * Base for the generated tab and panel ids. Pass the SAME value to
     * `TabPanels` — `aria-controls` here and `aria-labelledby` there have to
     * resolve to each other, and two independently generated ids never will.
     */
    id?: string;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    items,
    variant = 'underline',
    fullWidth = false,
    label,
    id: idProp,
    class: className,
    onchange,
    ...rest
  }: Props = $props();

  const fallbackId = uid('tabs');
  const id = $derived(idProp ?? fallbackId);

  let list = $state<HTMLElement | null>(null);
  let indicator = $state({ left: 0, width: 0 });

  const activeIndex = $derived(Math.max(0, items.findIndex((item) => item.value === value)));

  function measure() {
    if (!list) return;
    const active = list.querySelectorAll<HTMLElement>('[role="tab"]')[activeIndex];
    if (!active) return;
    indicator = { left: active.offsetLeft, width: active.offsetWidth };
  }

  $effect(() => {
    // Re-measure whenever the selection or the item set changes.
    void activeIndex;
    void items.length;
    measure();
  });

  $effect(() => {
    if (!list) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(list);
    for (const tab of list.querySelectorAll('[role="tab"]')) observer.observe(tab);
    return () => observer.disconnect();
  });

  function select(item: SegmentOption, element?: HTMLElement) {
    if (item.disabled || item.value === value) return;
    value = item.value;
    haptic('selection');
    onchange?.(item.value);
    element?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
  }

  function onkeydown(event: KeyboardEvent) {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();

    const next = items[(activeIndex + step + items.length) % items.length];
    const buttons = list?.querySelectorAll<HTMLElement>('[role="tab"]');
    const target = buttons?.[items.indexOf(next)];
    select(next, target);
    target?.focus();
  }
</script>

<div
  bind:this={list}
  data-an="tabs"
  data-variant={variant}
  class={cn('an-tabs', fullWidth && 'an-tabs--full', className)}
  role="tablist"
  aria-label={label}
  style={`--an-tab-left:${indicator.left}px; --an-tab-width:${indicator.width}px`}
  {onkeydown}
  {...rest}
>
  {#each items as item (item.value)}
    <button
      class="an-tab"
      type="button"
      role="tab"
      id={`${id}-${item.value}`}
      aria-selected={item.value === value}
      aria-controls={`${id}-${item.value}-panel`}
      tabindex={item.value === value ? 0 : -1}
      disabled={item.disabled}
      onclick={(event) => select(item, event.currentTarget)}
      use:ripple={{ disabled: item.disabled }}
    >
      <span class="an-tab__label">{item.label}</span>
      {#if item.badge !== undefined}<span class="an-tab__badge">{item.badge}</span>{/if}
    </button>
  {/each}

  <span class="an-tabs__indicator" aria-hidden="true"></span>
</div>

<style>
  .an-tabs {
    position: relative;
    display: flex;
    align-items: stretch;
    gap: var(--an-space-1);
    font-family: var(--an-font-sans);
    overflow-x: auto;
    scrollbar-width: none;
    /* The indicator is positioned against this box. */
    isolation: isolate;
  }

  .an-tabs::-webkit-scrollbar {
    display: none;
  }

  .an-tabs[data-variant='underline'] {
    border-bottom: 1px solid var(--an-border);
  }

  .an-tabs[data-variant='pill'] {
    gap: var(--an-space-1);
    padding: 3px;
    background: var(--an-surface-sunken);
    border-radius: var(--an-radius-lg);
  }

  .an-tabs--full {
    width: 100%;
  }

  .an-tabs--full .an-tab {
    flex: 1;
  }

  .an-tab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-2);
    padding: var(--an-space-3) var(--an-space-4);
    border: none;
    border-radius: var(--an-radius-sm);
    background: transparent;
    color: var(--an-text-muted);
    font-family: inherit;
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-medium);
    white-space: nowrap;
    cursor: pointer;
    isolation: isolate;
    transition: color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-tab[aria-selected='true'] {
    color: var(--an-text);
  }

  @media (hover: hover) {
    .an-tab:hover {
      color: var(--an-text);
    }
  }

  .an-tab:disabled {
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }

  .an-tab__badge {
    padding-inline: 6px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-hover);
    font-size: var(--an-text-caption-size);
    font-variant-numeric: tabular-nums;
  }

  .an-tabs__indicator {
    position: absolute;
    left: 0;
    width: var(--an-tab-width, 0);
    translate: var(--an-tab-left, 0) 0;
    transition:
      translate var(--an-duration-medium-2) var(--an-ease-emphasized),
      width var(--an-duration-medium-2) var(--an-ease-emphasized);
    pointer-events: none;
  }

  .an-tabs[data-variant='underline'] .an-tabs__indicator {
    bottom: -1px;
    height: 2px;
    border-radius: var(--an-radius-full) var(--an-radius-full) 0 0;
    background: var(--an-accent-emphasis);
  }

  .an-tabs[data-variant='pill'] .an-tabs__indicator {
    top: 3px;
    bottom: 3px;
    z-index: -1;
    border-radius: calc(var(--an-radius-lg) - 3px);
    background: var(--an-surface);
    box-shadow: var(--an-shadow-sm);
  }
</style>
