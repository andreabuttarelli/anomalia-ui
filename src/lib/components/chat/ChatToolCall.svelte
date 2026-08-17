<!--
  ChatToolCall — one tool invocation in an agent transcript.

  Same voice as `ChatThinking`, deliberately: a hairline in the left margin and
  one quiet line of small type. Reasoning and tool calls are the same kind of
  thing — the agent's working, not its answer — so they should look like the same
  kind of thing, and stack under one continuous rule when they follow each other.

  What this is *not* is a chip or a card. A pill truncates the argument that
  makes the call worth reading, and a bordered panel gives a footnote the same
  weight as the answer above it. A line can be as long as it needs to be and
  costs nothing to skip.

  Detail is opt-in: pass children and the line becomes a toggle that reveals the
  arguments and result verbatim, in mono, because that is machine output and the
  reader is now debugging. Without children it is inert and not focusable — a
  button that expands nothing wastes a tab stop.

  Status is never colour alone: `running` spins, `error` is stated in words, and
  every state carries a text label for assistive tech.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { collapse } from '../../motion/transitions.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import type { ToolStatus } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    name: string;
    status?: ToolStatus;
    /** The argument that identifies this call — a path, a query, an id. */
    summary?: string;
    /** Seconds. Rendered once the call is no longer running. */
    duration?: number | null;
    open?: boolean;
    /** Expanded body: arguments, result, error. */
    children?: Snippet;
  }

  let {
    name,
    status = 'success',
    summary,
    duration = null,
    open = $bindable(false),
    class: className,
    children,
    ...rest
  }: Props = $props();

  const id = uid('tool');

  const STATUS_LABEL: Record<ToolStatus, string> = {
    pending: 'Queued',
    running: 'Running',
    success: 'Completed',
    error: 'Failed'
  };
</script>

<div data-an="chat-tool-call" data-status={status} class={cn('an-tool', className)} {...rest}>
  {#snippet rowContent(expandable: boolean)}
    {#if status === 'running'}
      <svg class="an-tool__spin" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2" opacity="0.25" />
        <path
          d="M14 8a6 6 0 00-6-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    {:else}
      <span class="an-tool__dot" aria-hidden="true"></span>
    {/if}

    <span class="an-tool__name">{name}</span>
    {#if summary}<span class="an-tool__summary">{summary}</span>{/if}

    <span class="an-tool__end">
      {#if status === 'error'}<span class="an-tool__failed">failed</span>{/if}
      {#if status !== 'running' && duration !== null}
        <span class="an-tool__duration">{duration.toFixed(1)}s</span>
      {/if}
      {#if expandable}
        <svg class="an-tool__chevron" viewBox="0 0 16 16" aria-hidden="true">
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

    <span class="an-sr-only">{STATUS_LABEL[status]}</span>
  {/snippet}

  {#if children}
    <button
      class="an-tool__row"
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      onclick={() => (open = !open)}
    >
      {@render rowContent(true)}
    </button>
  {:else}
    <div class="an-tool__row" role="status">{@render rowContent(false)}</div>
  {/if}

  {#if open && children}
    <div class="an-tool__panel" id={`${id}-panel`} transition:collapse>
      {@render children()}
    </div>
  {/if}
</div>

<style>
  /* The rule is shared with ChatThinking on purpose. Consecutive blocks with no
     gap between them join into one continuous margin line, which is what makes
     a reasoning-then-tools sequence read as a single passage of working. */
  .an-tool {
    padding: 3px 0 3px 10px;
    border-inline-start: 2px solid var(--an-border);
    font-family: var(--an-font-sans);
  }

  .an-tool__row {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    color: var(--an-text-muted);
    font: inherit;
    font-size: 11px;
    line-height: 1.5;
    text-align: start;
  }

  /* A line of 11px type is about 17px tall, which is under the 24px SC 2.5.8
     asks of a target. The row is full-width, so height is the only axis at risk.
     The floor applies to every row, expandable or not: a trace where only some
     lines are tall reads as broken rather than as a mix of kinds. */
  .an-tool__row {
    min-height: 24px;
  }

  .an-tool__row[aria-expanded] {
    cursor: pointer;
  }

  @media (pointer: coarse) {
    .an-tool__row {
      min-height: 32px;
    }
  }

  @media (hover: hover) {
    .an-tool__row[aria-expanded]:hover {
      color: var(--an-text);
    }
  }

  .an-tool__dot {
    width: 5px;
    height: 5px;
    flex-shrink: 0;
    border-radius: var(--an-radius-full);
    background: currentColor;
    opacity: 0.5;
  }

  .an-tool__spin {
    width: 11px;
    height: 11px;
    margin: 0 -3px;
    flex-shrink: 0;
    animation: an-tool-spin 0.85s linear infinite;
  }

  @keyframes an-tool-spin {
    to {
      rotate: 360deg;
    }
  }

  /* The tool name is machine identity, so it takes the mono voice. */
  .an-tool__name {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-weight: var(--an-weight-medium);
    letter-spacing: 0;
    color: var(--an-text);
    flex-shrink: 0;
  }

  /* Running is the only state still changing, so it is the only one pulled
     forward. Finished calls stay at muted weight — they are history. */
  .an-tool[data-status='running'] .an-tool__row {
    color: var(--an-text);
  }

  .an-tool[data-status='error'] .an-tool__row,
  .an-tool[data-status='error'] .an-tool__name {
    color: var(--an-danger);
  }

  .an-tool[data-status='error'] {
    border-inline-start-color: color-mix(in srgb, var(--an-danger) 45%, var(--an-border));
  }

  /* The argument gets the room a chip would have denied it, and truncates only
     when the column genuinely runs out. */
  .an-tool__summary {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .an-tool__end {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-inline-start: auto;
    padding-inline-start: 6px;
    flex-shrink: 0;
  }

  .an-tool__failed {
    font-weight: var(--an-weight-semibold);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .an-tool__duration {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 10.5px;
    color: var(--an-text-faint);
    letter-spacing: 0;
  }

  .an-tool__chevron {
    width: 12px;
    height: 12px;
    color: var(--an-text-faint);
    transition: rotate var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-tool__row[aria-expanded='true'] .an-tool__chevron {
    rotate: 180deg;
  }

  .an-tool__panel {
    margin-top: 4px;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 11.5px;
    line-height: 1.65;
    color: var(--an-text-muted);
    letter-spacing: 0;
    white-space: pre-wrap;
    /* Machine output can be enormous; cap it so one result cannot bury the
       answer the person is reading. */
    max-height: 200px;
    overflow: auto;
  }

  .an-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* 11px is fine on a desk and unreadable in one hand. The margin notes come up
     to a real reading size on a phone even though they are still secondary —
     "secondary" is a reason to be quiet, never a reason to be illegible. */
  @media (max-width: 640px) {
    .an-tool__row {
      font-size: 12.5px;
    }

    .an-tool__duration {
      font-size: 12px;
    }

    .an-tool__panel {
      font-size: 12.5px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-tool__spin {
      animation-duration: 2.4s;
    }
  }
</style>
