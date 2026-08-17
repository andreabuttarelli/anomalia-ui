<!--
  StatusDot — a coloured dot with a word next to it.

  Small enough to feel like it does not need a component, which is exactly why
  it needs one: written inline it ends up as a bare `<span>` with a background
  colour and no text, and a dot alone fails both "not colour alone" (SC 1.4.1)
  and every screen reader. Here the label is mandatory — `labelHidden` moves it
  out of sight but never out of the accessibility tree.

  `pulse` is for states that are genuinely in progress. A dot that pulses while
  nothing is happening is the UI equivalent of a spinner nobody turned off.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Tone } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone;
    label: string;
    /** Keep the word for assistive tech, drop it from the layout. */
    labelHidden?: boolean;
    /** Ongoing states only — running, connecting, syncing. */
    pulse?: boolean;
    size?: 'sm' | 'md';
  }

  let {
    tone = 'neutral',
    label,
    labelHidden = false,
    pulse = false,
    size = 'md',
    class: className,
    ...rest
  }: Props = $props();
</script>

<span
  data-an="status-dot"
  data-tone={tone}
  data-size={size}
  data-pulse={pulse ? '' : undefined}
  class={cn('an-status', className)}
  {...rest}
>
  <span class="an-status__dot" aria-hidden="true"></span>
  <span class={labelHidden ? 'an-sr-only' : 'an-status__label'}>{label}</span>
</span>

<style>
  .an-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--an-font-sans);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    white-space: nowrap;
  }

  .an-status[data-size='sm'] {
    font-size: var(--an-text-caption-size);
    gap: 5px;
  }

  .an-status__dot {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    border-radius: var(--an-radius-full);
    background: var(--an-status-color, var(--an-text-faint));
  }

  .an-status[data-size='sm'] .an-status__dot {
    width: 6px;
    height: 6px;
  }

  .an-status[data-tone='success'] {
    --an-status-color: var(--an-success);
  }
  .an-status[data-tone='warning'] {
    --an-status-color: var(--an-warning);
  }
  .an-status[data-tone='danger'] {
    --an-status-color: var(--an-danger);
  }
  .an-status[data-tone='info'] {
    --an-status-color: var(--an-info);
  }
  .an-status[data-tone='accent'] {
    --an-status-color: var(--an-accent-emphasis);
  }

  /* A halo rather than a blink: it reads as "live" at the edge of vision
     without pulling the eye off whatever the person is reading. */
  .an-status[data-pulse] .an-status__dot {
    animation: an-status-pulse 1.8s var(--an-ease-standard) infinite;
  }

  @keyframes an-status-pulse {
    0% {
      box-shadow: 0 0 0 0 color-mix(in srgb, var(--an-status-color) 55%, transparent);
    }
    70%,
    100% {
      box-shadow: 0 0 0 5px color-mix(in srgb, var(--an-status-color) 0%, transparent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-status[data-pulse] .an-status__dot {
      animation: none;
    }
  }

  .an-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
