<!--
  Badge — a static status label. Not interactive by design: if it needs a click,
  it is a Chip.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Emphasis, Tone } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: Tone;
    variant?: Extract<Emphasis, 'solid' | 'soft' | 'outline'>;
    size?: 'sm' | 'md';
    /** Leading status dot — reads faster than colour alone. */
    dot?: boolean;
    children?: Snippet;
  }

  let {
    tone = 'neutral',
    variant = 'soft',
    size = 'md',
    dot = false,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<span
  data-an="badge"
  data-tone={tone}
  data-variant={variant}
  data-size={size}
  class={cn('an-badge', className)}
  {...rest}
>
  {#if dot}<span class="an-badge__dot"></span>{/if}
  {@render children?.()}
</span>

<style>
  .an-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-1);
    padding-inline: var(--an-space-2);
    height: var(--an-badge-h, 22px);
    border: 1px solid transparent;
    border-radius: var(--an-radius-full);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-medium);
    letter-spacing: 0.01em;
    line-height: 1;
    white-space: nowrap;
    /* Tone colour drives fill, text and border; each variant picks which. */
    --an-badge-color: var(--an-text-muted);
    --an-badge-soft: var(--an-surface-sunken);
    --an-badge-on: var(--an-on-status);
  }

  .an-badge[data-size='sm'] {
    --an-badge-h: 18px;
    padding-inline: var(--an-space-1);
    font-size: 10px;
  }

  .an-badge[data-tone='accent'] {
    --an-badge-color: var(--an-accent-text);
    --an-badge-soft: var(--an-accent-soft);
    --an-badge-on: var(--an-on-accent);
  }
  .an-badge[data-tone='success'] {
    --an-badge-color: var(--an-success);
    --an-badge-soft: var(--an-success-soft);
  }
  .an-badge[data-tone='warning'] {
    --an-badge-color: var(--an-warning);
    --an-badge-soft: var(--an-warning-soft);
  }
  .an-badge[data-tone='danger'] {
    --an-badge-color: var(--an-danger);
    --an-badge-soft: var(--an-danger-soft);
  }
  .an-badge[data-tone='info'] {
    --an-badge-color: var(--an-info);
    --an-badge-soft: var(--an-info-soft);
  }

  .an-badge[data-variant='solid'] {
    background: var(--an-badge-color);
    color: var(--an-badge-on);
  }

  .an-badge[data-variant='soft'] {
    background: var(--an-badge-soft);
    color: var(--an-badge-color);
  }

  .an-badge[data-variant='soft'][data-tone='neutral'] {
    color: var(--an-text-muted);
  }

  .an-badge[data-variant='outline'] {
    border-color: color-mix(in srgb, var(--an-badge-color) 40%, transparent);
    color: var(--an-badge-color);
  }

  .an-badge__dot {
    width: 6px;
    height: 6px;
    border-radius: var(--an-radius-full);
    background: currentColor;
    flex-shrink: 0;
  }
</style>
