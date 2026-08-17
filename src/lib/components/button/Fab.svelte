<!--
  Fab — Material's floating action button, the one component here that is
  unapologetically Material rather than Apple.

  Extended mode animates the label open/closed by width, and the whole thing can
  duck out of the way on scroll (`hidden`) the way M3 specifies — which is what
  keeps a FAB from covering the last row of a list on a phone.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';
  import { cn } from '../../utils/cn.js';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'accent' | 'surface';
    /** Text next to the icon. Presence of a label makes the FAB extended. */
    label?: string;
    /** Pin to the bottom-right of the viewport, above the safe area. */
    floating?: boolean;
    /** Slide off-screen — drive it from a scroll-direction store. */
    hidden?: boolean;
    href?: string;
    icon?: Snippet;
    children?: Snippet;
  }

  let {
    size = 'md',
    variant = 'accent',
    label,
    floating = false,
    hidden = false,
    href,
    disabled = false,
    type = 'button',
    class: className,
    icon,
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  data-an="fab"
  data-an-interactive
  data-size={size}
  data-variant={variant}
  data-extended={label ? '' : undefined}
  class={cn('an-fab', floating && 'an-fab--floating', hidden && 'an-fab--hidden', className)}
  href={href && !disabled ? href : undefined}
  type={href ? undefined : type}
  disabled={href ? undefined : disabled}
  aria-label={label ? undefined : rest['aria-label']}
  aria-hidden={hidden ? 'true' : undefined}
  tabindex={hidden ? -1 : undefined}
  use:ripple={{ disabled }}
  use:press={{ disabled, haptics: 'light' }}
  {...rest}
>
  <span class="an-fab__icon">{@render (icon ?? children)?.()}</span>
  {#if label}<span class="an-fab__label">{label}</span>{/if}
</svelte:element>

<style>
  .an-fab {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-2);
    height: var(--an-fab-size, 56px);
    min-width: var(--an-fab-size, 56px);
    padding-inline: var(--an-fab-pad, 0);
    border: none;
    border-radius: var(--an-radius-xl);
    background: var(--an-accent);
    color: var(--an-on-accent);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-medium);
    text-decoration: none;
    cursor: pointer;
    isolation: isolate;
    box-shadow: var(--an-shadow-lg);
    transition:
      transform var(--an-duration-medium-2) var(--an-ease-emphasized),
      box-shadow var(--an-duration-medium-2) var(--an-ease-standard),
      opacity var(--an-duration-short-4) var(--an-ease-standard);
  }

  .an-fab::before {
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
    .an-fab:hover::before {
      opacity: var(--an-state-hover);
    }
    .an-fab:hover {
      box-shadow: var(--an-shadow-xl);
    }
  }

  .an-fab[data-pressed] {
    transform: scale(0.94);
  }

  .an-fab[data-extended] {
    --an-fab-pad: var(--an-space-5);
  }

  .an-fab__icon,
  .an-fab__label {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    line-height: 0;
  }

  .an-fab__label {
    line-height: 1;
    white-space: nowrap;
  }

  .an-fab[data-size='sm'] {
    --an-fab-size: 40px;
    border-radius: var(--an-radius-lg);
  }

  .an-fab[data-size='lg'] {
    --an-fab-size: 72px;
    border-radius: var(--an-radius-2xl);
  }

  .an-fab[data-variant='surface'] {
    background: var(--an-surface);
    color: var(--an-accent);
    border: 1px solid var(--an-border);
  }

  .an-fab--floating {
    position: fixed;
    right: var(--an-space-5);
    /* Clear of the home indicator on iOS and the gesture bar on Android. */
    bottom: calc(var(--an-space-5) + env(safe-area-inset-bottom, 0px));
    z-index: var(--an-z-sticky);
  }

  .an-fab--hidden {
    transform: translateY(calc(100% + var(--an-space-8)));
    opacity: 0;
    pointer-events: none;
  }

  .an-fab:disabled {
    cursor: not-allowed;
    opacity: var(--an-disabled-content);
    box-shadow: none;
  }
</style>
