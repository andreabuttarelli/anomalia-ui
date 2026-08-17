<!--
  Textarea — multiline input with optional auto-grow and a character counter.

  Auto-grow resets the height before measuring `scrollHeight`; without that
  reset the box can only ever get taller, never shrink back after a delete.
-->
<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import Field from './Field.svelte';

  interface Props extends HTMLTextareaAttributes {
    value?: string;
    label?: string;
    hint?: string;
    error?: string | null;
    /** Grow with the content instead of scrolling. */
    autosize?: boolean;
    /** Show "n / maxlength". Requires `maxlength`. */
    counter?: boolean;
    fieldClass?: string;
  }

  let {
    value = $bindable(''),
    label,
    hint,
    error = null,
    autosize = false,
    counter = false,
    rows = 4,
    maxlength,
    required = false,
    disabled = false,
    id,
    class: className,
    fieldClass,
    ...rest
  }: Props = $props();

  let element = $state<HTMLTextAreaElement | null>(null);

  $effect(() => {
    if (!autosize || !element) return;
    // Read `value` so the effect re-runs on every keystroke.
    value;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  });

  const remaining = $derived(maxlength ? `${value.length} / ${maxlength}` : null);
</script>

<Field {label} {hint} {error} {required} {id} class={fieldClass}>
  {#snippet children(field)}
    <div
      data-an="textarea"
      data-invalid={field.invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      class={cn('an-textarea-shell', className)}
    >
      <textarea
        class="an-textarea"
        id={field.id}
        bind:this={element}
        bind:value
        rows={autosize ? 1 : rows}
        {maxlength}
        {disabled}
        {required}
        aria-invalid={field.invalid ? 'true' : undefined}
        aria-describedby={field.describedBy}
        {...rest}
      ></textarea>

      {#if counter && remaining}
        <span class="an-textarea__counter" aria-hidden="true">{remaining}</span>
      {/if}
    </div>
  {/snippet}
</Field>

<style>
  .an-textarea-shell {
    position: relative;
    display: block;
    background: var(--an-surface);
    border: 1px solid var(--an-border-control);
    border-radius: var(--an-radius-md);
    transition:
      border-color var(--an-duration-short-4) var(--an-ease-emphasized),
      box-shadow var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-textarea-shell:focus-within {
    border-color: var(--an-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--an-accent) 22%, transparent);
  }

  .an-textarea-shell[data-invalid] {
    border-color: var(--an-danger);
  }

  .an-textarea-shell[data-disabled] {
    background: var(--an-surface-sunken);
    opacity: var(--an-disabled-content);
  }

  .an-textarea {
    display: block;
    width: 100%;
    padding: var(--an-space-3);
    border: none;
    outline: none;
    background: transparent;
    color: var(--an-text);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    line-height: var(--an-text-body-line);
    letter-spacing: var(--an-text-body-track);
    resize: vertical;
  }

  .an-textarea::placeholder {
    color: var(--an-text-faint);
  }

  .an-textarea__counter {
    position: absolute;
    right: var(--an-space-2);
    bottom: var(--an-space-2);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
    pointer-events: none;
  }

  @media (pointer: coarse) {
    .an-textarea {
      font-size: 16px;
    }
  }
</style>
