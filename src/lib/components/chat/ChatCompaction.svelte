<!--
  ChatCompaction — the mark left where a conversation was summarised to fit the
  context window.

  This is the honest way to show "context used". A percentage ring counting up
  to 100 asks the reader to worry about a number they cannot act on; what they
  actually need to know is the thing that already happened — the turns above
  this line are no longer being read verbatim, a summary stands in for them —
  and to be able to see that summary if the agent starts behaving as though it
  forgot something.

  So it is a rule with a label in it, the typographic convention for a break in
  a text, and it opens to reveal the summary. Everything above the line still
  scrolls and is still readable by the person: compaction shrinks the model's
  context, not the transcript.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { collapse } from '../../motion/transitions.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    /** How many turns were folded into the summary. */
    count?: number | null;
    label?: string;
    open?: boolean;
    /** The summary that replaced those turns. Omit for a plain marker. */
    children?: Snippet;
  }

  let {
    count = null,
    label,
    open = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props();

  const id = uid('compaction');

  const text = $derived(
    label ?? (count === null ? 'Earlier turns summarised' : `${count} earlier turns summarised`)
  );
</script>

<div data-an="chat-compaction" class={cn('an-compact', className)} {...rest}>
  {#snippet ruleContent(expandable: boolean)}
    <span class="an-compact__line"></span>
    <span class="an-compact__label">
      {text}
      {#if expandable}
        <svg class="an-compact__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
    </span>
    <span class="an-compact__line"></span>
  {/snippet}

  <!-- Without a summary this is a marker, not a control. -->
  {#if children}
    <button
      class="an-compact__rule"
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      onclick={() => (open = !open)}
    >
      {@render ruleContent(true)}
    </button>
  {:else}
    <div class="an-compact__rule">{@render ruleContent(false)}</div>
  {/if}

  {#if open && children}
    <div class="an-compact__summary" id={`${id}-panel`} transition:collapse>
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .an-compact {
    width: 100%;
    font-family: var(--an-font-sans);
  }

  .an-compact__rule {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 4px 0;
    border: none;
    background: none;
    font: inherit;
    text-align: start;
  }

  .an-compact__rule[aria-expanded] {
    min-height: 24px;
    cursor: pointer;
  }

  @media (pointer: coarse) {
    .an-compact__rule[aria-expanded] {
      min-height: 32px;
    }
  }

  .an-compact__line {
    flex: 1;
    height: 1px;
    background: var(--an-border);
  }

  .an-compact__label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    font-size: 11px;
    color: var(--an-text-faint);
    white-space: nowrap;
  }

  @media (hover: hover) {
    .an-compact__rule[aria-expanded]:hover .an-compact__label {
      color: var(--an-text-muted);
    }
  }

  .an-compact__chevron {
    width: 12px;
    height: 12px;
    transition: rotate var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-compact__rule[aria-expanded='true'] .an-compact__chevron {
    rotate: 180deg;
  }

  .an-compact__summary {
    margin-top: 6px;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--an-surface-sunken);
    font-size: 13px;
    line-height: 1.5;
    color: var(--an-text-muted);
  }

  @media (max-width: 640px) {
    .an-compact__label {
      font-size: 12.5px;
    }

    .an-compact__summary {
      font-size: 14px;
    }
  }
</style>
