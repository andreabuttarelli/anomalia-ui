<!--
  TextField — single-line text input.

  Apple/shadcn surface: hairline border, 10px radius, no floating label. The
  Material contribution is the focus treatment — the ring grows on the
  emphasized curve instead of snapping — and a 16px font on phones, which is the
  threshold below which iOS Safari zooms the viewport on focus.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Size } from '../../types.js';
  import Field from './Field.svelte';

  interface Props extends Omit<HTMLInputAttributes, 'size'> {
    value?: string;
    label?: string;
    hint?: string;
    error?: string | null;
    size?: Size;
    /** Leading adornment: an icon, a currency symbol, a prefix. */
    leading?: Snippet;
    trailing?: Snippet;
    /** Wrapper class; `class` goes to the input itself. */
    fieldClass?: string;
  }

  let {
    value = $bindable(''),
    label,
    hint,
    error = null,
    size = 'md',
    required = false,
    disabled = false,
    id,
    class: className,
    fieldClass,
    leading,
    trailing,
    ...rest
  }: Props = $props();
</script>

<Field {label} {hint} {error} {required} {id} class={fieldClass}>
  {#snippet children(field)}
    <div
      data-an="text-field"
      data-size={size}
      data-invalid={field.invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      class={cn('an-input-shell', className)}
    >
      {#if leading}<span class="an-input-shell__affix">{@render leading()}</span>{/if}
      <input
        class="an-input"
        id={field.id}
        bind:value
        {disabled}
        {required}
        aria-invalid={field.invalid ? 'true' : undefined}
        aria-describedby={field.describedBy}
        {...rest}
      />
      {#if trailing}<span class="an-input-shell__affix">{@render trailing()}</span>{/if}
    </div>
  {/snippet}
</Field>

<style>
  .an-input-shell {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    height: var(--an-input-h, var(--an-control-h-md));
    padding-inline: var(--an-space-3);
    background: var(--an-surface);
    border: 1px solid var(--an-border-control);
    border-radius: var(--an-radius-md);
    color: var(--an-text);
    transition:
      border-color var(--an-duration-short-4) var(--an-ease-emphasized),
      box-shadow var(--an-duration-short-4) var(--an-ease-emphasized),
      background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-input-shell[data-size='sm'] {
    --an-input-h: var(--an-control-h-sm);
    border-radius: var(--an-radius-sm);
  }

  .an-input-shell[data-size='lg'] {
    --an-input-h: var(--an-control-h-lg);
    border-radius: var(--an-radius-lg);
  }

  .an-input-shell:focus-within {
    border-color: var(--an-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--an-accent) 22%, transparent);
  }

  .an-input-shell[data-invalid] {
    border-color: var(--an-danger);
  }

  .an-input-shell[data-invalid]:focus-within {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--an-danger) 22%, transparent);
  }

  .an-input-shell[data-disabled] {
    background: var(--an-surface-sunken);
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }

  .an-input-shell__affix {
    display: inline-flex;
    align-items: center;
    color: var(--an-text-faint);
    line-height: 0;
    flex-shrink: 0;
  }

  .an-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    letter-spacing: var(--an-text-body-track);
  }

  .an-input::placeholder {
    color: var(--an-text-faint);
  }

  .an-input:disabled {
    cursor: not-allowed;
  }

  /* Below 16px iOS zooms the page on focus and never zooms back. */
  @media (pointer: coarse) {
    .an-input {
      font-size: 16px;
    }
  }
</style>
