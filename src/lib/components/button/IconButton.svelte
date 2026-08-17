<!--
  IconButton — square target for a lone glyph.

  The visible box can shrink to 32px while the hit area stays at least
  `--an-tap-target` (44px) via a transparent ::after, so a compact toolbar stays
  compact without becoming a phone-hostile row of tiny targets.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';
  import { cn } from '../../utils/cn.js';
  import type { Size } from '../../types.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    variant?: 'solid' | 'soft' | 'outline' | 'ghost';
    size?: Size;
    /** Required: an icon-only control has no accessible name otherwise. */
    label: string;
    href?: string;
    round?: boolean;
    children?: Snippet;
  }

  let {
    variant = 'ghost',
    size = 'md',
    label,
    href,
    round = true,
    disabled = false,
    type = 'button',
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  data-an="icon-button"
  data-an-interactive
  data-variant={variant}
  data-size={size}
  class={cn('an-icon-btn', round && 'an-icon-btn--round', className)}
  href={href && !disabled ? href : undefined}
  type={href ? undefined : type}
  disabled={href ? undefined : disabled}
  aria-disabled={disabled ? 'true' : undefined}
  aria-label={label}
  title={label}
  use:ripple={{ disabled, centered: true }}
  use:press={{ disabled }}
  {...rest}
>
  <span class="an-icon-btn__glyph">{@render children?.()}</span>
</svelte:element>

<style>
  .an-icon-btn {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: var(--an-icon-btn-size, var(--an-control-h-md));
    height: var(--an-icon-btn-size, var(--an-control-h-md));
    border: 1px solid transparent;
    /* Overridable so a container with its own shape language — a rounded chat
       composer, a pill toolbar — can restyle the buttons it holds. */
    border-radius: var(--an-icon-btn-radius, var(--an-radius-md));
    color: var(--an-text-muted);
    background: transparent;
    cursor: pointer;
    isolation: isolate;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      color var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  /* Invisible hit area — the visual size is free to be smaller than the target. */
  .an-icon-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: max(100%, var(--an-tap-target));
    height: max(100%, var(--an-tap-target));
    transform: translate(-50%, -50%);
  }

  .an-icon-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-icon-btn:hover::before {
      opacity: var(--an-state-hover);
    }
    .an-icon-btn:hover {
      color: var(--an-text);
    }
  }

  .an-icon-btn:active::before,
  .an-icon-btn[data-pressed]::before {
    opacity: var(--an-state-press);
  }

  .an-icon-btn[data-pressed] {
    transform: scale(var(--an-press-scale));
  }

  .an-icon-btn__glyph {
    position: relative;
    z-index: 1;
    display: inline-flex;
    line-height: 0;
  }

  .an-icon-btn--round {
    border-radius: var(--an-radius-full);
  }

  .an-icon-btn[data-size='sm'] {
    --an-icon-btn-size: var(--an-control-h-sm);
  }

  .an-icon-btn[data-size='lg'] {
    --an-icon-btn-size: var(--an-control-h-lg);
  }

  .an-icon-btn[data-variant='solid'] {
    background: var(--an-accent);
    color: var(--an-on-accent);
  }

  .an-icon-btn[data-variant='soft'] {
    background: var(--an-surface-sunken);
    color: var(--an-text);
  }

  .an-icon-btn[data-variant='outline'] {
    border-color: var(--an-border-control);
    color: var(--an-text);
  }

  .an-icon-btn:disabled,
  .an-icon-btn[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: var(--an-disabled-content);
  }
</style>
