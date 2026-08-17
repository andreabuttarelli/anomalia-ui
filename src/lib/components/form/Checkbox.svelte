<!--
  Checkbox — shadcn's square box, Material's touch halo.

  The real `<input>` stays in the DOM (opacity 0, full-size) so forms submit,
  labels click, and assistive tech gets a genuine checkbox. Everything visible
  is drawn next to it and driven by `:checked` / `:focus-visible`.

  The tick is stroked on with `stroke-dashoffset` rather than faded in — the
  line drawing itself is what makes the state change feel confirmed.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import { haptic } from '../../utils/haptics.js';

  interface Props extends Omit<HTMLInputAttributes, 'size' | 'type'> {
    checked?: boolean;
    /** Renders the dash state. Cleared by the browser once the user clicks. */
    indeterminate?: boolean;
    label?: string;
    hint?: string;
    size?: 'sm' | 'md';
    children?: Snippet;
  }

  let {
    checked = $bindable(false),
    indeterminate = false,
    label,
    hint,
    size = 'md',
    disabled = false,
    id,
    class: className,
    onchange,
    children,
    ...rest
  }: Props = $props();

  const fallbackId = uid('checkbox');
  const controlId = $derived(id ?? fallbackId);
  // A hint that is not referenced is invisible to a screen reader: it sits
  // next to the control visually and nowhere at all in the accessibility tree.
  const hintId = $derived(`${controlId}-hint`);
  let input = $state<HTMLInputElement | null>(null);

  // `indeterminate` is a DOM property with no HTML attribute equivalent.
  $effect(() => {
    if (input) input.indeterminate = indeterminate && !checked;
  });
</script>

<div
  data-an="checkbox"
  data-size={size}
  data-disabled={disabled ? '' : undefined}
  class={cn('an-check', className)}
>
  <span class="an-check__control">
    <input
      bind:this={input}
      bind:checked
      id={controlId}
      type="checkbox"
      {disabled}
      aria-describedby={hint ? hintId : undefined}
      onchange={(event) => {
        haptic('selection');
        onchange?.(event as Parameters<NonNullable<typeof onchange>>[0]);
      }}
      {...rest}
    />
    <span class="an-check__box" aria-hidden="true">
      <svg viewBox="0 0 16 16" class="an-check__mark">
        <path
          d="M3.5 8.5l3 3 6-6.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="an-check__dash"></span>
    </span>
  </span>

  {#if label || children || hint}
    <span class="an-check__text">
      <label class="an-check__label" for={controlId}>
        {#if children}{@render children()}{:else}{label}{/if}
      </label>
      {#if hint}<span class="an-check__hint" id={hintId}>{hint}</span>{/if}
    </span>
  {/if}
</div>

<style>
  .an-check {
    display: inline-flex;
    align-items: flex-start;
    gap: var(--an-space-3);
    font-family: var(--an-font-sans);
    --an-check-size: 20px;
  }

  .an-check[data-size='sm'] {
    --an-check-size: 16px;
  }

  .an-check__control {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: var(--an-check-size);
    height: var(--an-check-size);
    flex-shrink: 0;
    /* Nudge the box onto the cap-height of the first line of label text. */
    margin-top: 1px;
  }

  /* Material's touch halo: an invisible circle that lights up on interaction and
     doubles as the ≥44px hit area the visible 20px box cannot provide. */
  .an-check__control::before {
    content: '';
    position: absolute;
    width: var(--an-tap-target);
    height: var(--an-tap-target);
    border-radius: var(--an-radius-full);
    background: currentColor;
    color: var(--an-text);
    opacity: 0;
    transition:
      opacity var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-4) var(--an-ease-emphasized);
    transform: scale(0.8);
    pointer-events: none;
  }

  .an-check__control input {
    position: absolute;
    inset: 50% auto auto 50%;
    translate: -50% -50%;
    width: var(--an-tap-target);
    height: var(--an-tap-target);
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  @media (hover: hover) {
    .an-check__control:hover::before {
      opacity: var(--an-state-hover);
      transform: scale(1);
    }
  }

  .an-check__control:active::before {
    opacity: var(--an-state-press);
    transform: scale(1);
  }

  .an-check__control input:focus-visible ~ .an-check__box {
    outline: var(--an-focus-ring-width) solid var(--an-ring);
    outline-offset: var(--an-focus-ring-offset);
  }

  .an-check__box {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    border: 1.5px solid var(--an-border-control);
    border-radius: calc(var(--an-radius-xs) - 1px);
    background: var(--an-surface);
    color: var(--an-on-accent-emphasis);
    pointer-events: none;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-emphasized),
      border-color var(--an-duration-short-3) var(--an-ease-emphasized),
      transform var(--an-duration-short-2) var(--an-ease-spring);
  }

  /* Emphasis, not the brand tint: a checked box is a UI state and owes 3:1
     against the surface behind it (WCAG SC 1.4.11). */
  .an-check__control input:checked ~ .an-check__box,
  .an-check__control input:indeterminate ~ .an-check__box {
    background: var(--an-accent-emphasis);
    border-color: var(--an-accent-emphasis);
  }

  .an-check__control input:active ~ .an-check__box {
    transform: scale(0.9);
  }

  .an-check__mark {
    width: 100%;
    height: 100%;
  }

  .an-check__mark path {
    stroke-dasharray: 18;
    stroke-dashoffset: 18;
    transition: stroke-dashoffset var(--an-duration-medium-1) var(--an-ease-emphasized-decelerate);
  }

  .an-check__control input:checked ~ .an-check__box .an-check__mark path {
    stroke-dashoffset: 0;
  }

  .an-check__dash {
    position: absolute;
    width: 55%;
    height: 2px;
    border-radius: 1px;
    background: currentColor;
    opacity: 0;
    transform: scaleX(0.4);
    transition:
      opacity var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-check__control input:indeterminate ~ .an-check__box .an-check__dash {
    opacity: 1;
    transform: scaleX(1);
  }

  .an-check__control input:indeterminate ~ .an-check__box .an-check__mark {
    opacity: 0;
  }

  .an-check__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .an-check__label {
    font-size: var(--an-text-body-size);
    line-height: 1.35;
    color: var(--an-text);
    cursor: pointer;
  }

  .an-check__hint {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .an-check[data-disabled] {
    opacity: var(--an-disabled-content);
  }

  .an-check[data-disabled] .an-check__label,
  .an-check[data-disabled] input {
    cursor: not-allowed;
  }
</style>
