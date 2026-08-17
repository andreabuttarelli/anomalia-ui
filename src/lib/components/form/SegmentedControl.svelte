<!--
  SegmentedControl — Apple's segmented picker.

  The selected pill is a single element that slides between segments on the
  emphasized curve, rather than each segment fading its own background: the
  travelling pill is what ties the old and new selection together and makes the
  change legible at a glance.

  Segments are equal-width, so the pill's offset is `index * 100%` and no
  measuring is needed — which also means it lands correctly before fonts load.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { haptic } from '../../utils/haptics.js';
  import { press } from '../../actions/press.js';
  import type { SegmentOption, Size } from '../../types.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    value?: string;
    options: SegmentOption[];
    size?: Size;
    label?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    options,
    size = 'md',
    label,
    fullWidth = false,
    disabled = false,
    class: className,
    onchange,
    ...rest
  }: Props = $props();

  const index = $derived(Math.max(0, options.findIndex((option) => option.value === value)));

  function select(option: SegmentOption) {
    if (disabled || option.disabled || option.value === value) return;
    value = option.value;
    haptic('selection');
    onchange?.(option.value);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = options[Math.min(options.length - 1, Math.max(0, index + step))];
    if (next) select(next);
  }
</script>

<div
  data-an="segmented"
  data-size={size}
  data-disabled={disabled ? '' : undefined}
  class={cn('an-segmented', fullWidth && 'an-segmented--full', className)}
  role="tablist"
  aria-label={label}
  aria-orientation="horizontal"
  style={`--an-seg-count:${options.length};--an-seg-index:${index}`}
  {onkeydown}
  {...rest}
>
  <span class="an-segmented__pill" aria-hidden="true"></span>

  {#each options as option (option.value)}
    <button
      class="an-segmented__item"
      type="button"
      role="tab"
      aria-selected={option.value === value}
      tabindex={option.value === value ? 0 : -1}
      disabled={disabled || option.disabled}
      onclick={() => select(option)}
      use:press={{ disabled: disabled || option.disabled, scale: 0.96, haptics: false }}
    >
      <span class="an-segmented__label">{option.label}</span>
      {#if option.badge !== undefined}
        <span class="an-segmented__badge">{option.badge}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .an-segmented {
    position: relative;
    display: inline-grid;
    grid-template-columns: repeat(var(--an-seg-count), minmax(0, 1fr));
    gap: 0;
    padding: 2px;
    border-radius: var(--an-radius-md);
    background: var(--an-surface-sunken);
    font-family: var(--an-font-sans);
    isolation: isolate;
    -webkit-user-select: none;
    user-select: none;
  }

  .an-segmented--full {
    display: grid;
    width: 100%;
  }

  .an-segmented[data-size='sm'] {
    --an-seg-h: 28px;
    font-size: var(--an-text-caption-size);
  }
  .an-segmented[data-size='lg'] {
    --an-seg-h: 40px;
  }

  .an-segmented__pill {
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    width: calc((100% - 4px) / var(--an-seg-count));
    border-radius: calc(var(--an-radius-md) - 2px);
    background: var(--an-surface);
    box-shadow: var(--an-shadow-sm);
    translate: calc(var(--an-seg-index) * 100%) 0;
    transition: translate var(--an-duration-medium-2) var(--an-ease-emphasized);
    z-index: 0;
  }

  .an-segmented__item {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-1);
    height: var(--an-seg-h, 34px);
    padding-inline: var(--an-space-3);
    border: none;
    background: transparent;
    color: var(--an-text-muted);
    font-family: inherit;
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    transition:
      color var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  .an-segmented__item[aria-selected='true'] {
    color: var(--an-text);
  }

  .an-segmented__item[data-pressed] {
    transform: scale(0.96);
  }

  .an-segmented__item:disabled {
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }

  .an-segmented__badge {
    padding-inline: 5px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-hover);
    font-size: 10px;
    font-variant-numeric: tabular-nums;
  }

  .an-segmented[data-disabled] {
    opacity: var(--an-disabled-content);
  }
</style>
