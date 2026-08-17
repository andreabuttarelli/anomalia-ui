<!--
  Field — the label/description/error scaffolding every input shares.

  It owns the ids and hands them to the control through the snippet, so the
  `aria-describedby` wiring is done once here instead of being re-derived (and
  occasionally forgotten) in each input component.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import type { FieldContext } from '../../types.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    label?: string;
    /** Helper text under the control. Replaced by `error` when invalid. */
    hint?: string;
    error?: string | null;
    required?: boolean | null;
    /** Supply when the control already has an id (e.g. a form library owns it). */
    id?: string | null;
    children: Snippet<[FieldContext]>;
  }

  let {
    label,
    hint,
    error = null,
    required = false,
    id,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const fallbackId = uid('field');
  const controlId = $derived(id ?? fallbackId);
  const hintId = $derived(`${controlId}-hint`);
  const errorId = $derived(`${controlId}-error`);

  const context = $derived<FieldContext>({
    id: controlId,
    describedBy: error ? errorId : hint ? hintId : undefined,
    invalid: Boolean(error)
  });
</script>

<div
  data-an="field"
  data-invalid={error ? '' : undefined}
  class={cn('an-field', className)}
  {...rest}
>
  {#if label}
    <label class="an-field__label" for={controlId}>
      {label}
      {#if required}<span class="an-field__required" aria-hidden="true">*</span>{/if}
    </label>
  {/if}

  {@render children(context)}

  {#if error}
    <!-- `alert` so a validation failure is announced when it appears. -->
    <p class="an-field__message an-field__message--error" id={errorId} role="alert">{error}</p>
  {:else if hint}
    <p class="an-field__message" id={hintId}>{hint}</p>
  {/if}
</div>

<style>
  .an-field {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    font-family: var(--an-font-sans);
    min-width: 0;
  }

  .an-field__label {
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    color: var(--an-text);
    letter-spacing: var(--an-text-footnote-track);
  }

  .an-field__required {
    color: var(--an-danger);
    margin-inline-start: 2px;
  }

  .an-field__message {
    margin: 0;
    font-size: var(--an-text-footnote-size);
    line-height: 1.45;
    color: var(--an-text-muted);
  }

  .an-field__message--error {
    color: var(--an-danger);
  }
</style>
