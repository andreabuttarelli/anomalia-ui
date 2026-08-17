<!--
  RadioGroup — the whole set is one component because a radio only means
  anything relative to its siblings: one name, one selected value, one tab stop.

  Keyboard behaviour follows the ARIA pattern (arrows move *and* select, Tab
  leaves the group), which native radios give us for free.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import { haptic } from '../../utils/haptics.js';
  import type { RadioOption } from '../../types.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
    value?: string;
    options: RadioOption[];
    /** Shared form field name. Generated when omitted. */
    name?: string;
    label?: string;
    orientation?: 'vertical' | 'horizontal';
    /** Draw each option as a selectable card — better for thumbs than bare dots. */
    variant?: 'plain' | 'card';
    disabled?: boolean;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    options,
    name,
    label,
    orientation = 'vertical',
    variant = 'plain',
    disabled = false,
    class: className,
    onchange,
    ...rest
  }: Props = $props();

  const fallbackName = uid('radio');
  const groupName = $derived(name ?? fallbackName);

  function select(next: string) {
    value = next;
    haptic('selection');
    onchange?.(next);
  }
</script>

<div
  data-an="radio-group"
  data-orientation={orientation}
  data-variant={variant}
  class={cn('an-radio-group', className)}
  role="radiogroup"
  aria-label={label}
  {...rest}
>
  {#each options as option (option.value)}
    <label
      class="an-radio"
      data-selected={value === option.value ? '' : undefined}
      data-disabled={disabled || option.disabled ? '' : undefined}
    >
      <input
        type="radio"
        name={groupName}
        value={option.value}
        checked={value === option.value}
        disabled={disabled || option.disabled}
        aria-describedby={option.hint ? `${groupName}-${option.value}-hint` : undefined}
        onchange={() => select(option.value)}
      />
      <span class="an-radio__dot" aria-hidden="true"></span>
      <span class="an-radio__text">
        <span class="an-radio__label">{option.label}</span>
        {#if option.hint}
          <span class="an-radio__hint" id={`${groupName}-${option.value}-hint`}>{option.hint}</span>
        {/if}
      </span>
    </label>
  {/each}
</div>

<style>
  .an-radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    font-family: var(--an-font-sans);
  }

  .an-radio-group[data-orientation='horizontal'] {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .an-radio {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--an-space-3);
    cursor: pointer;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      border-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-radio input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .an-radio__dot {
    position: relative;
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 1px;
    border: 1.5px solid var(--an-border-control);
    border-radius: var(--an-radius-full);
    background: var(--an-surface);
    transition:
      border-color var(--an-duration-short-3) var(--an-ease-emphasized),
      border-width var(--an-duration-short-3) var(--an-ease-emphasized);
  }

  /* Inner dot scales in on the spring curve — Material's radio "pop". */
  .an-radio__dot::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: var(--an-radius-full);
    background: var(--an-accent-emphasis);
    transform: scale(0);
    transition: transform var(--an-duration-medium-1) var(--an-ease-spring);
  }

  .an-radio input:checked ~ .an-radio__dot {
    border-color: var(--an-accent-emphasis);
  }

  .an-radio input:checked ~ .an-radio__dot::after {
    transform: scale(1);
  }

  .an-radio input:focus-visible ~ .an-radio__dot {
    outline: var(--an-focus-ring-width) solid var(--an-ring);
    outline-offset: var(--an-focus-ring-offset);
  }

  .an-radio__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .an-radio__label {
    font-size: var(--an-text-body-size);
    color: var(--an-text);
    line-height: 1.35;
  }

  .an-radio__hint {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    line-height: 1.4;
  }

  /* Card variant: the whole row is the target — the pattern that works on a phone. */
  .an-radio-group[data-variant='card'] .an-radio {
    padding: var(--an-space-3) var(--an-space-4);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
  }

  .an-radio-group[data-variant='card'] .an-radio[data-selected] {
    border-color: var(--an-accent-emphasis);
    background: var(--an-accent-soft);
  }

  @media (hover: hover) {
    .an-radio-group[data-variant='card'] .an-radio:hover {
      border-color: var(--an-border-strong);
    }
  }

  .an-radio[data-disabled] {
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }
</style>
