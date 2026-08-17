<!--
  ChatThinking — the model's reasoning, marked by a rule rather than a box.

  Reasoning is context, not output: it should be available and never in the way.
  A bordered, chevroned panel gives it the same visual weight as the answer,
  which is exactly backwards. So this is a hairline down the left margin and one
  small lowercase label — the annotation convention from print, where a margin
  rule means "aside" without stealing the eye.

  While the model is still thinking the label shimmers. That is the one place a
  moving gradient is honest: the process it describes is genuinely ongoing and
  has no known end, so a determinate bar would be a lie. It is also the only
  sign anything is happening, which is the part people actually watch.

  When it finishes it collapses and keeps the elapsed time, so a transcript read
  later shows how long the model spent without replaying the whole trace.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { collapse } from '../../motion/transitions.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Still reasoning: shimmers the label and shows the preview line. */
    active?: boolean;
    open?: boolean;
    label?: string;
    /** Seconds spent. Rendered once it is no longer active. */
    duration?: number | null;
    /** One-line preview while active — usually the last line of the trace. */
    preview?: string;
    children?: Snippet;
  }

  let {
    active = false,
    open = $bindable(false),
    label = 'thinking',
    duration = null,
    preview,
    class: className,
    children,
    ...rest
  }: Props = $props();

  const id = uid('thinking');
</script>

<div
  data-an="chat-thinking"
  data-active={active ? '' : undefined}
  class={cn('an-think', className)}
  {...rest}
>
  {#snippet triggerContent(expandable: boolean)}
    <span class="an-think__label">{label}</span>
    {#if !active && duration !== null}
      <span class="an-think__meta">{duration.toFixed(1)}s</span>
    {/if}
    {#if expandable}
      <svg class="an-think__chevron" viewBox="0 0 16 16" aria-hidden="true">
        <path
          d="M4 6l4 4 4-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="an-sr-only">{open ? 'Hide reasoning' : 'Show reasoning'}</span>
    {/if}
  {/snippet}

  <!-- Only a control when there is a trace to open. A button that expands
       nothing is a promise the component cannot keep. -->
  {#if children}
    <button
      class="an-think__trigger"
      type="button"
      aria-expanded={open}
      aria-controls={`${id}-panel`}
      onclick={() => (open = !open)}
    >
      {@render triggerContent(true)}
    </button>
  {:else}
    <span class="an-think__trigger">{@render triggerContent(false)}</span>
  {/if}

  {#if active && preview && !open}
    <p class="an-think__preview">{preview}</p>
  {/if}

  {#if open && children}
    <div class="an-think__panel" id={`${id}-panel`} transition:collapse>
      {@render children()}
    </div>
  {/if}
</div>

<style>
  /* The rule is the component. Everything else is a caption hanging off it.
     Shared with ChatToolCall, so a reasoning block followed by its tool calls
     joins into one continuous margin line. */
  .an-think {
    padding: 3px 0 3px 10px;
    border-inline-start: 2px solid var(--an-border);
    font-family: var(--an-font-sans);
    color: var(--an-text-muted);
  }

  .an-think__trigger {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0;
    border: none;
    background: none;
    color: var(--an-text-muted);
    font: inherit;
    font-size: 11px;
    font-weight: var(--an-weight-semibold);
    letter-spacing: 0.02em;
    text-transform: lowercase;
    text-align: start;
  }

  /* Same target-size floor as ChatToolCall — a line of small type is not a 24px
     target on its own, and SC 2.5.8 applies to a trigger this quiet too. */
  .an-think__trigger {
    min-height: 24px;
  }

  .an-think__trigger[aria-expanded] {
    cursor: pointer;
  }

  @media (pointer: coarse) {
    .an-think__trigger {
      min-height: 32px;
    }
  }

  @media (hover: hover) {
    .an-think__trigger[aria-expanded]:hover .an-think__label,
    .an-think__trigger[aria-expanded]:hover .an-think__chevron {
      color: var(--an-text);
    }
  }

  .an-think__chevron {
    width: 12px;
    height: 12px;
    color: var(--an-text-faint);
    transition: rotate var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  .an-think__trigger[aria-expanded='true'] .an-think__chevron {
    rotate: 180deg;
  }

  .an-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  /* A sweep across the text itself, not a spinner next to it: the label is
     already the smallest thing that can carry the signal. */
  .an-think[data-active] .an-think__label {
    background: linear-gradient(
      105deg,
      var(--an-text-faint) 0%,
      var(--an-text-faint) 35%,
      var(--an-text) 50%,
      var(--an-text-faint) 65%,
      var(--an-text-faint) 100%
    );
    background-size: 220% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: an-think-shimmer 1.7s ease-in-out infinite;
  }

  @keyframes an-think-shimmer {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -100% 0;
    }
  }

  .an-think__meta {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-weight: var(--an-weight-regular);
    font-size: 10.5px;
    color: var(--an-text-faint);
    letter-spacing: 0;
    text-transform: none;
  }

  .an-think__preview {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 1.45;
    color: var(--an-text-faint);
    /* One line only: a preview that wraps becomes the content it was previewing. */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 60ch;
  }

  /* The trace itself. It is prose the model wrote, so it gets prose treatment —
     readable size, real line height — just quieter than the answer. */
  .an-think__panel {
    margin-top: 4px;
    font-size: 12.5px;
    line-height: 1.55;
    color: var(--an-text-muted);
    white-space: pre-wrap;
    /* Long enough to read a thought, short enough that it cannot push the
       answer off the screen. */
    max-height: 200px;
    overflow-y: auto;
  }

  .an-think__panel :global(p) {
    margin: 0 0 8px;
  }

  .an-think__panel :global(p:last-child) {
    margin-bottom: 0;
  }

  /* Small type is the first thing to fail in one hand. Secondary is a reason to
     be quiet, never a reason to be illegible. */
  @media (max-width: 640px) {
    .an-think__trigger {
      font-size: 12.5px;
    }

    .an-think__meta {
      font-size: 12px;
    }

    .an-think__preview,
    .an-think__panel {
      font-size: 13.5px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-think[data-active] .an-think__label {
      animation: none;
      background: none;
      color: var(--an-text-muted);
    }
  }
</style>
