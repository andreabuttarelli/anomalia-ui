<!--
  Switch — iOS's pill toggle, with two Material-flavoured touches:

    • the thumb *stretches* while pressed and snaps back on release (spring
      curve), which is the single detail that makes a toggle feel physical;
    • a haptic tick fires on commit, not on press.

  Built on a real `<input type="checkbox" role="switch">`.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import { haptic } from '../../utils/haptics.js';

  interface Props extends Omit<HTMLInputAttributes, 'size' | 'type'> {
    checked?: boolean;
    label?: string;
    hint?: string;
    size?: 'sm' | 'md';
    /** Put the control before the label (settings rows read better reversed). */
    reverse?: boolean;
    children?: Snippet;
  }

  let {
    checked = $bindable(false),
    label,
    hint,
    size = 'md',
    reverse = false,
    disabled = false,
    id,
    class: className,
    onchange,
    children,
    ...rest
  }: Props = $props();

  const fallbackId = uid('switch');
  const controlId = $derived(id ?? fallbackId);
  const hintId = $derived(`${controlId}-hint`);
</script>

<div
  data-an="switch"
  data-size={size}
  data-disabled={disabled ? '' : undefined}
  class={cn('an-switch', reverse && 'an-switch--reverse', className)}
>
  {#if label || children || hint}
    <span class="an-switch__text">
      <label class="an-switch__label" for={controlId}>
        {#if children}{@render children()}{:else}{label}{/if}
      </label>
      {#if hint}<span class="an-switch__hint" id={hintId}>{hint}</span>{/if}
    </span>
  {/if}

  <span class="an-switch__control">
    <input
      bind:checked
      id={controlId}
      type="checkbox"
      role="switch"
      {disabled}
      aria-describedby={hint ? hintId : undefined}
      onchange={(event) => {
        haptic('medium');
        onchange?.(event as Parameters<NonNullable<typeof onchange>>[0]);
      }}
      {...rest}
    />
    <span class="an-switch__track" aria-hidden="true">
      <span class="an-switch__thumb"></span>
    </span>
  </span>
</div>

<style>
  .an-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-4);
    font-family: var(--an-font-sans);
    --an-switch-w: 51px;
    --an-switch-h: 31px;
    --an-switch-pad: 2px;
  }

  .an-switch[data-size='sm'] {
    --an-switch-w: 40px;
    --an-switch-h: 24px;
  }

  .an-switch--reverse {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  .an-switch__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .an-switch__label {
    font-size: var(--an-text-body-size);
    color: var(--an-text);
    cursor: pointer;
  }

  .an-switch__hint {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    line-height: 1.4;
  }

  .an-switch__control {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    width: var(--an-switch-w);
    height: var(--an-switch-h);
  }

  .an-switch__control input {
    position: absolute;
    inset: 0;
    width: 100%;
    /* Stretch the invisible input to the minimum comfortable touch height. */
    height: max(100%, var(--an-tap-target));
    top: 50%;
    translate: 0 -50%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 1;
  }

  .an-switch__track {
    position: absolute;
    inset: 0;
    display: block;
    border-radius: var(--an-radius-full);
    /* The off state is a control boundary too — it must stay visible against
       the surface, so it uses the 3:1 line rather than a hairline. */
    background: var(--an-border-control);
    transition: background-color var(--an-duration-medium-1) var(--an-ease-emphasized);
  }

  .an-switch__control input:checked ~ .an-switch__track {
    background: var(--an-accent-emphasis);
  }

  .an-switch__control input:focus-visible ~ .an-switch__track {
    outline: var(--an-focus-ring-width) solid var(--an-ring);
    outline-offset: var(--an-focus-ring-offset);
  }

  .an-switch__thumb {
    position: absolute;
    top: var(--an-switch-pad);
    left: var(--an-switch-pad);
    width: calc(var(--an-switch-h) - var(--an-switch-pad) * 2);
    height: calc(var(--an-switch-h) - var(--an-switch-pad) * 2);
    border-radius: var(--an-radius-full);
    background: var(--an-on-accent-emphasis);
    box-shadow: var(--an-shadow-sm);
    transform-origin: left center;
    transition:
      translate var(--an-duration-medium-1) var(--an-ease-spring),
      width var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-switch__control input:checked ~ .an-switch__track .an-switch__thumb {
    translate: calc(var(--an-switch-w) - var(--an-switch-h)) 0;
  }

  /* Press: the thumb elongates toward the direction it would travel. */
  .an-switch__control input:active ~ .an-switch__track .an-switch__thumb {
    width: calc(var(--an-switch-h) - var(--an-switch-pad) * 2 + 6px);
  }

  .an-switch__control input:checked:active ~ .an-switch__track .an-switch__thumb {
    translate: calc(var(--an-switch-w) - var(--an-switch-h) - 6px) 0;
  }

  .an-switch[data-disabled] {
    opacity: var(--an-disabled-content);
  }

  .an-switch[data-disabled] input,
  .an-switch[data-disabled] .an-switch__label {
    cursor: not-allowed;
  }
</style>
