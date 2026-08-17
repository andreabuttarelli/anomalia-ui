<!--
  ChatMessage — one turn in an agent transcript.

  The two roles are deliberately asymmetric. A user turn is a bubble, aligned
  right, short: it is a thing the person said, and it should look like a quote.
  An assistant turn is full-width prose with no bubble, because it is the
  document being written — wrapping a thousand words of output in a chat bubble
  is what makes agent UIs feel like a toy.

  Streaming is a state, not a separate component: `streaming` keeps a caret at
  the end of the text and holds the actions back until the turn has finished, so
  the row does not shift under a cursor that is about to click Copy.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { ChatRole } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    role?: ChatRole;
    /** Shown above an assistant turn; user turns are identified by position. */
    name?: string;
    timestamp?: string;
    /** Keeps the caret blinking and hides the action row until it is done. */
    streaming?: boolean;
    /** Failed turn: tinted, with the error announced. */
    error?: string | null;
    avatar?: Snippet;
    /** Copy, retry, feedback — revealed on hover, always present for keyboard. */
    actions?: Snippet;
    /** Tool calls, thinking blocks, attachments rendered above the text. */
    before?: Snippet;
    children?: Snippet;
  }

  let {
    role = 'assistant',
    name,
    timestamp,
    streaming = false,
    error = null,
    class: className,
    avatar,
    actions,
    before,
    children,
    ...rest
  }: Props = $props();
</script>

<article
  data-an="chat-message"
  data-role={role}
  data-streaming={streaming ? '' : undefined}
  data-error={error ? '' : undefined}
  class={cn('an-msg', className)}
  {...rest}
>
  {#if role === 'assistant' && (avatar || name)}
    <header class="an-msg__head">
      {#if avatar}<span class="an-msg__avatar">{@render avatar()}</span>{/if}
      {#if name}<span class="an-msg__name">{name}</span>{/if}
    </header>
  {/if}

  {#if before}
    <div class="an-msg__before">{@render before()}</div>
  {/if}

  <div class="an-msg__body">
    {@render children?.()}
    {#if streaming}<span class="an-msg__caret" aria-hidden="true"></span>{/if}
  </div>

  {#if error}
    <p class="an-msg__error" role="alert">{error}</p>
  {/if}

  {#if (actions || timestamp) && !streaming}
    <footer class="an-msg__actions">
      {@render actions?.()}
      {#if timestamp}<span class="an-msg__time">{timestamp}</span>{/if}
    </footer>
  {/if}
</article>

<style>
  /* A shade smaller and a shade looser than page body text. A transcript is read
     in a narrow column and scrolls continuously, so 14/1.55 keeps a long answer
     scannable where the 15px page size starts to feel like a wall; on touch it
     goes back up, because a phone is held further from nothing. */
  .an-msg {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-family: var(--an-font-sans);
    color: var(--an-text);
    font-size: 14px;
    line-height: 1.55;
  }

  @media (max-width: 640px) {
    .an-msg {
      font-size: 15px;
    }

    .an-msg__time {
      font-size: 12px;
    }

    /* A bubble capped at 80% of a phone leaves a useless sliver of margin; on a
       narrow screen the useful cap is "nearly full width, but clearly not". */
    .an-msg[data-role='user'] .an-msg__body {
      max-width: 92%;
    }
  }

  /* ── User: a quote, right-aligned, capped so it never becomes a wall ─────── */
  .an-msg[data-role='user'] {
    align-items: flex-end;
  }

  /* Filled and generously rounded, with one corner cut back to 5px. That single
     tightened corner is what makes a rounded rectangle read as speech: it points
     at the person who said it, without drawing an actual tail. */
  .an-msg[data-role='user'] .an-msg__body {
    width: fit-content;
    max-width: min(80%, 60ch);
    padding: 12px 14px;
    border-radius: 16px 16px 5px 16px;
    background: var(--an-accent);
    color: var(--an-on-accent);
    line-height: 1.5;
  }

  /* ── Assistant: the document, full width, no bubble ─────────────────────── */
  .an-msg[data-role='assistant'] .an-msg__body {
    max-width: 72ch;
  }

  .an-msg[data-role='system'] {
    align-items: center;
  }

  .an-msg[data-role='system'] .an-msg__body {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-faint);
    text-align: center;
  }

  .an-msg__head {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
  }

  .an-msg__avatar {
    display: inline-flex;
    line-height: 0;
  }

  .an-msg__name {
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
  }

  /* The time rides inside the action row rather than floating in a corner: it
     is metadata about the turn, the same class of thing as Copy and Retry, and
     giving it its own line would make an empty row of small grey text under
     every message. Tabular figures so a column of them does not jitter. */
  .an-msg__time {
    padding-inline: 6px;
    font-size: 11px;
    line-height: 1;
    color: var(--an-text-faint);
    font-variant-numeric: tabular-nums;
    user-select: none;
  }

  .an-msg__before {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    width: 100%;
    max-width: 72ch;
  }

  /* ── Prose inside a turn ────────────────────────────────────────────────
     A model's answer arrives as rendered markdown, so the body has to be a
     small, complete typographic system — not just a paragraph. The rules are
     tighter than page prose on purpose: a chat turn is read in a narrow column,
     often on a phone, and the generous rhythm that suits an article makes an
     answer feel padded and slow to scan.

     Everything is `:global` because the markup is injected by the caller's
     renderer and never touched by this component's compiler. */
  .an-msg__body :global(> :first-child) {
    margin-top: 0;
  }

  .an-msg__body :global(> :last-child) {
    margin-bottom: 0;
  }

  .an-msg__body :global(p) {
    margin: 0 0 10px;
  }

  /* Headings inside an answer are section markers in a paragraph, not titles of
     a page — so they barely grow, and lean on weight and space instead. */
  .an-msg__body :global(h1),
  .an-msg__body :global(h2),
  .an-msg__body :global(h3),
  .an-msg__body :global(h4) {
    margin: 18px 0 8px;
    font-size: 1em;
    font-weight: var(--an-weight-semibold);
    line-height: 1.35;
    letter-spacing: var(--an-text-headline-track, -0.01em);
  }

  .an-msg__body :global(h1) {
    font-size: 1.15em;
  }

  .an-msg__body :global(h2) {
    font-size: 1.07em;
  }

  .an-msg__body :global(ul),
  .an-msg__body :global(ol) {
    margin: 0 0 10px;
    padding-inline-start: 20px;
  }

  .an-msg__body :global(li) {
    margin: 3px 0;
  }

  .an-msg__body :global(li > ul),
  .an-msg__body :global(li > ol) {
    margin: 3px 0;
  }

  .an-msg__body :global(a) {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);
  }

  @media (hover: hover) {
    .an-msg__body :global(a:hover) {
      text-decoration-color: currentColor;
    }
  }

  .an-msg__body :global(strong) {
    font-weight: var(--an-weight-semibold);
  }

  .an-msg__body :global(code) {
    padding: 1px 5px;
    border-radius: 5px;
    background: color-mix(in srgb, currentColor 8%, transparent);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 0.9em;
    letter-spacing: 0;
  }

  /* Code blocks and tables can be arbitrarily wide. They scroll inside their own
     box so one long line can never widen the whole thread. */
  .an-msg__body :global(pre) {
    margin: 8px 0;
    padding: 12px 14px;
    border: 1px solid var(--an-border);
    border-radius: 10px;
    background: var(--an-surface-sunken);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .an-msg__body :global(pre code) {
    padding: 0;
    background: none;
    font-size: 12.5px;
    line-height: 1.6;
  }

  .an-msg__body :global(table) {
    width: 100%;
    margin: 10px 0;
    border-collapse: collapse;
    font-size: 0.95em;
  }

  .an-msg__body :global(th),
  .an-msg__body :global(td) {
    padding: 6px 10px;
    border-bottom: 1px solid var(--an-border);
    text-align: start;
    vertical-align: top;
  }

  .an-msg__body :global(th) {
    font-weight: var(--an-weight-semibold);
    color: var(--an-text-muted);
  }

  .an-msg__body :global(tr:last-child td) {
    border-bottom: none;
  }

  .an-msg__body :global(blockquote) {
    margin: 10px 0;
    padding-inline-start: 12px;
    border-inline-start: 2px solid var(--an-border-strong);
    color: var(--an-text-muted);
  }

  .an-msg__body :global(hr) {
    margin: 16px 0;
    border: none;
    border-top: 1px solid var(--an-border);
  }

  /* Generated images stay thumbnail-sized in the transcript. Full-bleed media
     inside a turn turns a conversation into a gallery and pushes the text the
     person is reading off the screen — open it in a lightbox instead. */
  .an-msg__body :global(img) {
    display: block;
    max-width: min(220px, 100%);
    max-height: min(180px, 32dvh);
    width: auto;
    height: auto;
    margin: 10px 0;
    border: 1px solid var(--an-border);
    border-radius: 10px;
    object-fit: contain;
  }

  /* Long URLs and unbroken tokens wrap instead of stretching the column. */
  .an-msg__body {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  @media (max-width: 640px) {
    .an-msg__body :global(img) {
      max-width: min(180px, 100%);
      max-height: min(140px, 28dvh);
    }
  }

  /* The caret sits inline with the last line, so it tracks the text as it
     streams instead of parking in a corner. */
  .an-msg__caret {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    margin-inline-start: 2px;
    translate: 0 0.15em;
    background: var(--an-accent-emphasis);
    animation: an-caret 1s steps(2, start) infinite;
  }

  @keyframes an-caret {
    to {
      opacity: 0;
    }
  }

  .an-msg__error {
    margin: 0;
    padding: var(--an-space-2) var(--an-space-3);
    border-radius: var(--an-radius-md);
    background: var(--an-danger-soft);
    color: var(--an-danger);
    font-size: var(--an-text-footnote-size);
  }

  /* Faint at rest, not invisible. Hiding the row entirely until hover means a
     first-time reader never learns the controls exist, and it makes the layout
     jump; sitting at 0.45 keeps them discoverable and the height stable. They
     stay in the tab order either way — this is `opacity`, never `display`. */
  .an-msg__actions {
    display: flex;
    align-items: center;
    gap: 2px;
    opacity: 0.45;
    transition: opacity var(--an-duration-short-3) var(--an-ease-standard);
    /* Buttons here are smaller and rounder than a default IconButton, to sit
       under the text as an annotation rather than as a toolbar. */
    --an-icon-btn-size: 28px;
    --an-icon-btn-radius: 8px;
  }

  .an-msg:hover .an-msg__actions,
  .an-msg:focus-within .an-msg__actions {
    opacity: 1;
  }

  /* No hover to reveal them with, so they simply stay legible. */
  @media (hover: none) {
    .an-msg__actions {
      opacity: 0.7;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-msg__caret {
      animation: none;
    }
  }
</style>
