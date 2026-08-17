<!--
  Select — a styled native `<select>`, on purpose.

  A custom listbox cannot match the platform picker on a phone: iOS renders a
  wheel, Android a full-screen dialog, both with correct scroll, search and
  assistive-tech behaviour. We restyle the closed state to match the rest of the
  system and let the OS own the open state.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Size, SelectOption } from '../../types.js';
  import Field from './Field.svelte';

  interface Props extends Omit<HTMLSelectAttributes, 'size'> {
    value?: string;
    label?: string;
    hint?: string;
    error?: string | null;
    size?: Size;
    /** Declarative options. Omit and pass `children` for `<optgroup>` layouts. */
    options?: SelectOption[];
    placeholder?: string;
    fieldClass?: string;
    /** Escape hatch for `<optgroup>` layouts, instead of `options`. */
    children?: Snippet;
  }

  let {
    value = $bindable(''),
    label,
    hint,
    error = null,
    size = 'md',
    options,
    placeholder,
    required = false,
    disabled = false,
    id,
    class: className,
    fieldClass,
    children: optionMarkup,
    ...rest
  }: Props = $props();
</script>

<Field {label} {hint} {error} {required} {id} class={fieldClass}>
  {#snippet children(field)}
    <div
      data-an="select"
      data-size={size}
      data-invalid={field.invalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      class={cn('an-select-shell', className)}
    >
      <select
        class="an-select"
        id={field.id}
        bind:value
        {disabled}
        {required}
        aria-invalid={field.invalid ? 'true' : undefined}
        aria-describedby={field.describedBy}
        {...rest}
      >
        {#if placeholder}
          <option value="" disabled selected={!value}>{placeholder}</option>
        {/if}
        {#if options}
          {#each options as option (option.value)}
            <option value={option.value} disabled={option.disabled}>{option.label}</option>
          {/each}
        {:else}
          {@render optionMarkup?.()}
        {/if}
      </select>

      <svg class="an-select__caret" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M4.5 6.5L8 10l3.5-3.5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  {/snippet}
</Field>

<style>
  .an-select-shell {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--an-select-h, var(--an-control-h-md));
    background: var(--an-surface);
    border: 1px solid var(--an-border-control);
    border-radius: var(--an-radius-md);
    transition:
      border-color var(--an-duration-short-4) var(--an-ease-emphasized),
      box-shadow var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-select-shell[data-size='sm'] {
    --an-select-h: var(--an-control-h-sm);
    border-radius: var(--an-radius-sm);
  }

  .an-select-shell[data-size='lg'] {
    --an-select-h: var(--an-control-h-lg);
    border-radius: var(--an-radius-lg);
  }

  .an-select-shell:focus-within {
    border-color: var(--an-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--an-accent) 22%, transparent);
  }

  .an-select-shell[data-invalid] {
    border-color: var(--an-danger);
  }

  .an-select-shell[data-disabled] {
    background: var(--an-surface-sunken);
    opacity: var(--an-disabled-content);
  }

  .an-select {
    appearance: none;
    width: 100%;
    height: 100%;
    padding-inline: var(--an-space-3) var(--an-space-8);
    border: none;
    outline: none;
    background: transparent;
    color: var(--an-text);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    letter-spacing: var(--an-text-body-track);
    cursor: pointer;
  }

  .an-select__caret {
    position: absolute;
    right: var(--an-space-3);
    width: 16px;
    height: 16px;
    color: var(--an-text-faint);
    pointer-events: none;
  }

  @media (pointer: coarse) {
    .an-select {
      font-size: 16px;
    }
  }
</style>
