<!--
  PromptInput — the composer for an agent chat.

  Shape carries most of the meaning here. A composer is the one control a person
  touches on every turn, so it is drawn as a soft rounded slab — a 22px radius,
  a hairline, a low wide shadow — rather than as a form field with a toolbar
  bolted on. Everything inside it is chromeless: the textarea has no border, the
  tool buttons are transparent until hovered, and the only filled thing in the
  whole component is the round send button. That contrast is the affordance.

  Focus is a border-colour change and nothing else. A 3px ring around a 22px
  slab reads as an error state; the border darkening to the accent is enough,
  and it is still a 3:1 non-text contrast change, so it satisfies SC 1.4.11.

  Behaviour that is easy to get wrong and is handled here:

    • **Enter sends, Shift+Enter is a newline** — with `submitOn="modifier"` for
      apps where the message is long-form and ⌘↵ should be the commit instead.
    • **The height grows with the content and stops.** It starts at one comfortable
      line and scrolls past `maxHeight`, so the composer can never eat the
      transcript above it.
    • **Send becomes Stop while streaming.** One control, in one place, because
      a separate stop button somewhere else is a button nobody finds in time.
    • **Empty submissions are impossible** — including whitespace-only, which is
      what a stray Enter produces.

  The `leading` and `trailing` snippets are where a model picker, a mode
  dropdown or an attach button go: this component owns the text and the send,
  and deliberately not your model list. Buttons rendered there inherit the
  composer's rounder shape through `--an-icon-btn-radius` / `--an-btn-radius`,
  so a plain `IconButton` lands in the right language without extra props.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { press } from '../../actions/press.js';
  import { ripple } from '../../actions/ripple.js';
  import { haptic } from '../../utils/haptics.js';

  interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'onsubmit' | 'children'> {
    value?: string;
    placeholder?: string;
    /** `enter` sends on Enter; `modifier` requires ⌘/Ctrl+Enter. */
    submitOn?: 'enter' | 'modifier';
    /** The agent is answering: send turns into stop. */
    streaming?: boolean;
    disabled?: boolean;
    /** Autosize floor and ceiling, in px. Past the ceiling the field scrolls. */
    minHeight?: number;
    maxHeight?: number;
    /** Staged attachments — render `ChatAttachment`s here. */
    attachments?: Snippet;
    /** Left of the send button: attach, model picker, mode. */
    leading?: Snippet;
    trailing?: Snippet;
    /** Hint under the field. Set to `null` to hide it. */
    hint?: string | null;
    onsubmit?: (value: string) => void;
    onstop?: () => void;
  }

  let {
    value = $bindable(''),
    placeholder = 'Ask anything…',
    submitOn = 'enter',
    streaming = false,
    disabled = false,
    minHeight = 44,
    maxHeight = 200,
    class: className,
    attachments,
    leading,
    trailing,
    hint = 'Enter to send · Shift+Enter for a new line',
    onsubmit,
    onstop,
    ...rest
  }: Props = $props();

  let textarea = $state<HTMLTextAreaElement | null>(null);

  const canSend = $derived(value.trim().length > 0 && !disabled);

  $effect(() => {
    if (!textarea) return;
    // Read `value` so this re-runs per keystroke; reset before measuring or the
    // box can only ever grow.
    value;
    textarea.style.height = 'auto';

    const next = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${next}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  });

  function submit() {
    if (!canSend) return;
    onsubmit?.(value.trim());
    value = '';
    haptic('light');
    textarea?.focus();
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.isComposing) return;

    const withModifier = event.metaKey || event.ctrlKey;
    const shouldSend = submitOn === 'enter' ? !event.shiftKey && !withModifier : withModifier;
    if (!shouldSend) return;

    event.preventDefault();
    submit();
  }
</script>

<div
  data-an="prompt-input"
  data-streaming={streaming ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  class={cn('an-prompt', className)}
>
  {#if attachments}
    <div class="an-prompt__attachments">{@render attachments()}</div>
  {/if}

  <div class="an-prompt__body">
    <textarea
      bind:this={textarea}
      bind:value
      class="an-prompt__field"
      rows="1"
      {placeholder}
      {disabled}
      {onkeydown}
      {...rest}
    ></textarea>

    <div class="an-prompt__left">
      {#if leading}{@render leading()}{/if}
      {#if trailing}<span class="an-prompt__trailing">{@render trailing()}</span>{/if}
    </div>

    {#if streaming}
      <button
        class="an-prompt__send an-prompt__send--stop"
        type="button"
        aria-label="Stop generating"
        onclick={() => onstop?.()}
        use:ripple={{ centered: true }}
        use:press
      >
        <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
          <rect x="6" y="6" width="8" height="8" rx="1.5" fill="currentColor" />
        </svg>
      </button>
    {:else}
      <button
        class="an-prompt__send"
        type="button"
        aria-label="Send message"
        disabled={!canSend}
        onclick={submit}
        use:ripple={{ centered: true, disabled: !canSend }}
        use:press={{ disabled: !canSend }}
      >
        <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
          <path
            d="M10 16V4M10 4L5 9M10 4l5 5"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>

{#if hint}
  <p class="an-prompt__hint">{hint}</p>
{/if}

<style>
  /* No shadow. A drop shadow makes the composer read as a card hovering over the
     conversation rather than as the end of it — and docked at the bottom of a
     thread, which is where it almost always lives, "floating panel" is exactly
     the wrong impression. The hairline stays: it has to be obvious where to
     click, and the border is doing that job on its own. */
  .an-prompt {
    /* Buttons placed in the toolbar inherit the composer's shape rather than
       the library's default 6px — see the note in Button/IconButton. */
    --an-icon-btn-size: 32px;
    --an-icon-btn-radius: 10px;
    --an-btn-radius: 10px;

    position: relative;
    padding: 12px 14px 10px;
    border: 1px solid var(--an-border-control);
    border-radius: 22px;
    background: var(--an-surface);
    font-family: var(--an-font-sans);
    transition: border-color var(--an-duration-short-4) var(--an-ease-emphasized);
  }

  /* Focus darkens the hairline and stops there. On a slab this round, a ring
     reads as an alarm; the border change is already a 3:1 state change. */
  .an-prompt:focus-within {
    border-color: var(--an-accent-emphasis);
  }

  .an-prompt[data-disabled] {
    background: var(--an-surface-sunken);
    box-shadow: none;
    opacity: var(--an-disabled-content);
  }

  .an-prompt__attachments {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }

  /* Two rows: the text spans the full width, the toolbar and send share the
     second. Send is bottom-aligned so it stays pinned to the last line as the
     field grows. */
  .an-prompt__body {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'input input'
      'left send';
    column-gap: 8px;
    row-gap: 8px;
    align-items: end;
  }

  .an-prompt__field {
    grid-area: input;
    width: 100%;
    border: none;
    outline: none;
    background: none;
    resize: none;
    padding: 0;
    color: var(--an-text);
    font-family: inherit;
    font-size: 14.5px;
    line-height: 1.5;
    letter-spacing: var(--an-text-body-track);
    /* Height is driven by the autosize effect; this is only the first paint. */
    min-height: 44px;
  }

  .an-prompt__field::placeholder {
    color: var(--an-text-faint);
  }

  @media (pointer: coarse) {
    .an-prompt__field {
      font-size: 16px;
    }
  }

  .an-prompt__left {
    grid-area: left;
    display: flex;
    align-items: center;
    gap: 2px;
    min-width: 0;
  }

  .an-prompt__trailing {
    display: flex;
    align-items: center;
    gap: 2px;
    margin-inline-start: auto;
  }

  .an-prompt__send {
    grid-area: send;
    position: relative;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--an-radius-full);
    background: var(--an-accent);
    color: var(--an-on-accent);
    cursor: pointer;
    isolation: isolate;
    transition:
      opacity var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  .an-prompt__send svg {
    /* The arrow's optical centre sits left of its box. */
    margin-inline-start: 1px;
  }

  .an-prompt__send:disabled {
    opacity: 0.4;
    cursor: default;
  }

  @media (hover: hover) {
    .an-prompt__send:not(:disabled):hover {
      transform: scale(1.05);
    }
  }

  .an-prompt__send[data-pressed] {
    transform: scale(var(--an-press-scale));
  }

  /* Stop is the one place a hue earns its keep: it has to be findable in a
     hurry, and "the round button turned red" is read faster than any label. */
  .an-prompt__send--stop {
    background: var(--an-danger);
    color: var(--an-on-status);
  }

  .an-prompt__hint {
    margin: var(--an-space-2) 0 0;
    padding-inline: 14px;
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
    font-family: var(--an-font-sans);
  }

  @media (prefers-reduced-motion: reduce) {
    .an-prompt__send {
      transition: none;
    }
    .an-prompt__send:not(:disabled):hover {
      transform: none;
    }
  }
</style>
