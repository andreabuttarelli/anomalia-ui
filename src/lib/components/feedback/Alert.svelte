<!--
  Alert — inline, persistent message attached to the content it concerns.
  (A transient message that floats over the UI is a Toast, not an Alert.)
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Tone } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    tone?: Tone;
    title?: string;
    /** Show the ✕. The alert is removed by the consumer via `ondismiss`. */
    ondismiss?: () => void;
    icon?: Snippet;
    actions?: Snippet;
    children?: Snippet;
  }

  let {
    tone = 'info',
    title,
    class: className,
    ondismiss,
    icon,
    actions,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  data-an="alert"
  data-tone={tone}
  class={cn('an-alert', className)}
  role={tone === 'danger' ? 'alert' : 'status'}
  {...rest}
>
  {#if icon}<span class="an-alert__icon">{@render icon()}</span>{/if}

  <div class="an-alert__body">
    {#if title}<p class="an-alert__title">{title}</p>{/if}
    {#if children}<div class="an-alert__text">{@render children()}</div>{/if}
    {#if actions}<div class="an-alert__actions">{@render actions()}</div>{/if}
  </div>

  {#if ondismiss}
    <button class="an-alert__close" type="button" aria-label="Dismiss" onclick={ondismiss}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </button>
  {/if}
</div>

<style>
  .an-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--an-space-3);
    padding: var(--an-space-4);
    border: 1px solid transparent;
    border-radius: var(--an-radius-lg);
    font-family: var(--an-font-sans);
    /* Tone sets one colour; fill and border are derived from it via color-mix,
       so adding a tone never means picking three more hex values. */
    --an-alert-color: var(--an-info);
    background: color-mix(in srgb, var(--an-alert-color) 10%, var(--an-surface));
    border-color: color-mix(in srgb, var(--an-alert-color) 28%, transparent);
    color: var(--an-text);
  }

  .an-alert[data-tone='neutral'] {
    --an-alert-color: var(--an-text-muted);
  }
  .an-alert[data-tone='accent'] {
    --an-alert-color: var(--an-accent);
  }
  .an-alert[data-tone='success'] {
    --an-alert-color: var(--an-success);
  }
  .an-alert[data-tone='warning'] {
    --an-alert-color: var(--an-warning);
  }
  .an-alert[data-tone='danger'] {
    --an-alert-color: var(--an-danger);
  }

  .an-alert__icon {
    display: inline-flex;
    line-height: 0;
    color: var(--an-alert-color);
    flex-shrink: 0;
    margin-top: 1px;
  }

  .an-alert__body {
    flex: 1;
    min-width: 0;
  }

  .an-alert__title {
    margin: 0;
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-semibold);
    line-height: 1.4;
  }

  .an-alert__text {
    margin-top: 2px;
    font-size: var(--an-text-footnote-size);
    line-height: 1.55;
    color: var(--an-text-muted);
  }

  .an-alert__actions {
    display: flex;
    gap: var(--an-space-2);
    margin-top: var(--an-space-3);
  }

  .an-alert__close {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--an-radius-full);
    background: transparent;
    color: var(--an-text-muted);
    cursor: pointer;
    transition: background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-alert__close:hover {
    background: color-mix(in srgb, var(--an-alert-color) 16%, transparent);
    color: var(--an-text);
  }
</style>
