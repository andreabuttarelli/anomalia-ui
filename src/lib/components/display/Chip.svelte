<!--
  Chip — Material's filter/input chip: tappable, selectable, optionally
  removable. Full ripple and press feedback, since chips are a touch-first
  control (filter rows scroll horizontally under a thumb).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';
  import { haptic } from '../../utils/haptics.js';
  import { cn } from '../../utils/cn.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    selected?: boolean;
    /** Adds a trailing ✕ that fires `onremove` instead of toggling. */
    onremove?: () => void;
    size?: 'sm' | 'md';
    leading?: Snippet;
    children?: Snippet;
  }

  let {
    selected = false,
    onremove,
    size = 'md',
    disabled = false,
    class: className,
    onclick,
    leading,
    children,
    ...rest
  }: Props = $props();

  function handleClick(event: MouseEvent) {
    // A selection change is a committed action — worth a tick under the finger.
    haptic('selection');
    onclick?.(event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement });
  }
</script>

<span class={cn('an-chip-wrap', className)}>
  <button
    data-an="chip"
    data-an-interactive
    data-size={size}
    data-selected={selected ? '' : undefined}
    class="an-chip"
    type="button"
    {disabled}
    aria-pressed={selected}
    onclick={handleClick}
    use:ripple={{ disabled }}
    use:press={{ disabled, scale: 0.96, haptics: false }}
    {...rest}
  >
    {#if leading}<span class="an-chip__leading">{@render leading()}</span>{/if}
    <span class="an-chip__label">{@render children?.()}</span>
  </button>

  {#if onremove}
    <button
      class="an-chip__remove"
      type="button"
      {disabled}
      aria-label="Remove"
      onclick={() => {
        haptic('light');
        onremove?.();
      }}
    >
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
        />
      </svg>
    </button>
  {/if}
</span>

<style>
  .an-chip-wrap {
    display: inline-flex;
    align-items: center;
    position: relative;
  }

  .an-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    height: var(--an-chip-h, 34px);
    padding-inline: var(--an-space-3);
    border: 1px solid var(--an-border-control);
    border-radius: var(--an-radius-full);
    background: var(--an-surface);
    color: var(--an-text);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    line-height: 1;
    cursor: pointer;
    isolation: isolate;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      border-color var(--an-duration-short-3) var(--an-ease-standard),
      color var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  .an-chip::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-chip:hover::before {
      opacity: var(--an-state-hover);
    }
  }

  .an-chip[data-pressed] {
    transform: scale(0.96);
  }

  .an-chip[data-size='sm'] {
    --an-chip-h: 28px;
    font-size: var(--an-text-caption-size);
  }

  .an-chip[data-selected] {
    background: var(--an-accent-soft);
    border-color: var(--an-accent-emphasis);
    color: var(--an-accent-soft-text);
  }

  .an-chip__leading,
  .an-chip__label {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
  }

  .an-chip__leading {
    line-height: 0;
    margin-inline-start: calc(var(--an-space-1) * -1);
  }

  .an-chip:disabled {
    cursor: not-allowed;
    opacity: var(--an-disabled-content);
  }

  /* The remove affordance sits inside the chip's pill, sharing its right edge. */
  .an-chip__remove {
    display: inline-grid;
    place-items: center;
    width: 20px;
    height: 20px;
    margin-inline-start: calc(var(--an-space-6) * -1 + 2px);
    margin-inline-end: var(--an-space-1);
    border: none;
    border-radius: var(--an-radius-full);
    background: transparent;
    color: var(--an-text-muted);
    cursor: pointer;
    transition: background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-chip-wrap:has(.an-chip__remove) .an-chip {
    padding-inline-end: var(--an-space-6);
  }

  @media (hover: hover) {
    .an-chip__remove:hover {
      background: var(--an-surface-hover);
      color: var(--an-text);
    }
  }
</style>
