<!--
  Slider — custom rather than a styled `<input type="range">`, because the two
  behaviours that make a slider feel good on a phone are impossible natively:

    • the thumb grows and lifts while dragging, with a value bubble above the
      finger (which would otherwise be covering the number it is setting);
    • a haptic tick fires on every step crossed, so coarse values are findable
      without looking.

  Accessibility is hand-built to match: `role="slider"`, full arrow/Home/End
  keyboard support, and `aria-valuetext` for formatted values.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { haptic } from '../../utils/haptics.js';
  import { isTouchLike } from '../../utils/events.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    disabled?: boolean;
    /** Show the value bubble while dragging. */
    bubble?: boolean;
    /** Tick marks at each step. Ignored above 24 steps — it turns into noise. */
    ticks?: boolean;
    /** Formats the bubble and `aria-valuetext`. */
    format?: (value: number) => string;
    onchange?: (value: number) => void;
  }

  let {
    value = $bindable(50),
    min = 0,
    max = 100,
    step = 1,
    label,
    disabled = false,
    bubble = true,
    ticks = false,
    format = (v) => String(v),
    class: className,
    onchange,
    ...rest
  }: Props = $props();

  let track = $state<HTMLDivElement | null>(null);
  let dragging = $state(false);

  const percent = $derived(((value - min) / (max - min)) * 100);
  const stepCount = $derived(Math.round((max - min) / step));
  const showTicks = $derived(ticks && stepCount <= 24);

  function quantize(raw: number): number {
    const snapped = Math.round((raw - min) / step) * step + min;
    const clamped = Math.min(max, Math.max(min, snapped));
    // Kill float drift from the division above (0.30000000000000004 and friends).
    return Number(clamped.toFixed(10));
  }

  function commit(next: number) {
    if (next === value) return;
    value = next;
    haptic('selection');
    onchange?.(next);
  }

  function valueFromPointer(clientX: number): number {
    if (!track) return value;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return quantize(min + ratio * (max - min));
  }

  function onpointerdown(event: PointerEvent) {
    if (disabled) return;
    dragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    if (isTouchLike(event)) haptic('light');
    commit(valueFromPointer(event.clientX));
  }

  function onpointermove(event: PointerEvent) {
    if (!dragging || disabled) return;
    // Stop the page from scrolling under a horizontal drag.
    event.preventDefault();
    commit(valueFromPointer(event.clientX));
  }

  function onpointerup(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
  }

  function onkeydown(event: KeyboardEvent) {
    if (disabled) return;
    const big = (max - min) / 10;
    const moves: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: big,
      PageDown: -big
    };

    if (event.key in moves) {
      event.preventDefault();
      commit(quantize(value + moves[event.key]));
    } else if (event.key === 'Home') {
      event.preventDefault();
      commit(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      commit(max);
    }
  }
</script>

<div
  data-an="slider"
  data-dragging={dragging ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  class={cn('an-slider', className)}
  style={`--an-slider-percent:${percent}%`}
  {...rest}
>
  <div
    bind:this={track}
    class="an-slider__hit"
    role="slider"
    tabindex={disabled ? -1 : 0}
    aria-label={label}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    aria-valuetext={format(value)}
    aria-disabled={disabled ? 'true' : undefined}
    aria-orientation="horizontal"
    {onpointerdown}
    {onpointermove}
    {onpointerup}
    onpointercancel={onpointerup}
    {onkeydown}
  >
    <div class="an-slider__track">
      <div class="an-slider__fill"></div>
    </div>

    {#if showTicks}
      <div class="an-slider__ticks" aria-hidden="true">
        {#each { length: stepCount + 1 } as _, index (index)}
          <span class="an-slider__tick" data-passed={percent >= (index / stepCount) * 100 ? '' : undefined}></span>
        {/each}
      </div>
    {/if}

    <div class="an-slider__thumb">
      {#if bubble}
        <span class="an-slider__bubble" aria-hidden="true">{format(value)}</span>
      {/if}
    </div>
  </div>
</div>

<style>
  .an-slider {
    display: block;
    width: 100%;
    font-family: var(--an-font-sans);
  }

  /* The hit area is deliberately taller than the 4px track. */
  .an-slider__hit {
    position: relative;
    height: var(--an-tap-target);
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;
    outline: none;
  }

  .an-slider__track {
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
    overflow: hidden;
  }

  .an-slider__fill {
    width: var(--an-slider-percent);
    height: 100%;
    background: var(--an-accent-emphasis);
    border-radius: inherit;
    transition: width var(--an-duration-short-2) var(--an-ease-standard);
  }

  /* While dragging the fill must track the finger exactly — no easing lag. */
  .an-slider[data-dragging] .an-slider__fill {
    transition: none;
  }

  .an-slider__thumb {
    position: absolute;
    left: var(--an-slider-percent);
    top: 50%;
    width: 20px;
    height: 20px;
    translate: -50% -50%;
    border-radius: var(--an-radius-full);
    background: var(--an-on-accent-emphasis);
    border: 1px solid var(--an-border-control);
    box-shadow: var(--an-shadow-sm);
    transition:
      left var(--an-duration-short-2) var(--an-ease-standard),
      scale var(--an-duration-short-4) var(--an-ease-spring),
      box-shadow var(--an-duration-short-4) var(--an-ease-standard);
  }

  .an-slider[data-dragging] .an-slider__thumb {
    transition:
      scale var(--an-duration-short-4) var(--an-ease-spring),
      box-shadow var(--an-duration-short-4) var(--an-ease-standard);
    scale: 1.15;
    box-shadow: var(--an-shadow-lg);
  }

  .an-slider__hit:focus-visible .an-slider__thumb {
    outline: var(--an-focus-ring-width) solid var(--an-ring);
    outline-offset: var(--an-focus-ring-offset);
  }

  .an-slider__bubble {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    translate: -50% 4px;
    padding: 2px var(--an-space-2);
    border-radius: var(--an-radius-sm);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    font-size: var(--an-text-caption-size);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity var(--an-duration-short-3) var(--an-ease-standard),
      translate var(--an-duration-short-4) var(--an-ease-emphasized-decelerate);
  }

  .an-slider[data-dragging] .an-slider__bubble,
  .an-slider__hit:focus-visible .an-slider__bubble {
    opacity: 1;
    translate: -50% 0;
  }

  .an-slider__ticks {
    position: absolute;
    inset-inline: 0;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
  }

  .an-slider__tick {
    width: 3px;
    height: 3px;
    border-radius: var(--an-radius-full);
    background: var(--an-text-faint);
    opacity: 0.5;
  }

  .an-slider__tick[data-passed] {
    background: var(--an-on-accent-emphasis);
  }

  .an-slider[data-disabled] {
    opacity: var(--an-disabled-content);
  }

  .an-slider[data-disabled] .an-slider__hit {
    cursor: not-allowed;
  }
</style>
