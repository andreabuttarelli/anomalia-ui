<!--
  Button — the reference implementation for every interactive surface here.

  Looks Apple/shadcn: flat fill, 10px radius, medium weight, one hairline border.
  Behaves Material: a state layer for hover/focus, a ripple from the touch point,
  and a press squish. That split — calm surface, expressive interaction — is the
  whole thesis of this design system, and every other control follows it.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';
  import { cn } from '../../utils/cn.js';
  import type { ButtonVariant, Size } from '../../types.js';
  import Spinner from '../feedback/Spinner.svelte';

  interface Props extends Omit<HTMLButtonAttributes, 'children'> {
    variant?: ButtonVariant;
    size?: Size;
    /** Renders an `<a>` instead of a `<button>`, keeping every visual state. */
    href?: string;
    /** Swaps the label for a spinner and blocks activation, without resizing. */
    loading?: boolean;
    fullWidth?: boolean;
    /** Fully rounded, iOS-style. */
    pill?: boolean;
    leading?: Snippet;
    trailing?: Snippet;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    href,
    loading = false,
    fullWidth = false,
    pill = false,
    disabled = false,
    type = 'button',
    class: className,
    leading,
    trailing,
    children,
    ...rest
  }: Props = $props();

  const inert = $derived(disabled || loading);
</script>

<svelte:element
  this={href ? 'a' : 'button'}
  data-an="button"
  data-an-interactive
  data-variant={variant}
  data-size={size}
  data-loading={loading ? '' : undefined}
  class={cn('an-btn', fullWidth && 'an-btn--full', pill && 'an-btn--pill', className)}
  href={href && !inert ? href : undefined}
  type={href ? undefined : type}
  disabled={href ? undefined : disabled}
  aria-disabled={inert ? 'true' : undefined}
  aria-busy={loading ? 'true' : undefined}
  role={href ? 'button' : undefined}
  tabindex={inert && href ? -1 : undefined}
  use:ripple={{ disabled: inert }}
  use:press={{ disabled: inert }}
  {...rest}
>
  {#if loading}
    <span class="an-btn__loader"><Spinner size="sm" /></span>
  {/if}
  <span class="an-btn__content" aria-hidden={loading ? 'true' : undefined}>
    {#if leading}<span class="an-btn__affix">{@render leading()}</span>{/if}
    {@render children?.()}
    {#if trailing}<span class="an-btn__affix">{@render trailing()}</span>{/if}
  </span>
</svelte:element>

<style>
  .an-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--an-space-2);
    padding-inline: var(--an-btn-pad, var(--an-space-4));
    height: var(--an-btn-h, var(--an-control-h-md));
    min-width: var(--an-btn-h, var(--an-control-h-md));
    border: 1px solid transparent;
    /* Overridable so a container with its own shape language — a rounded chat
       composer, a pill toolbar — can restyle the buttons it holds without
       reaching into them with `:global`. */
    border-radius: var(--an-btn-radius, var(--an-radius-md));
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-medium);
    letter-spacing: var(--an-text-body-track);
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    /* Own stacking context so the ripple layer can never escape upward. */
    isolation: isolate;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      border-color var(--an-duration-short-3) var(--an-ease-standard),
      color var(--an-duration-short-3) var(--an-ease-standard),
      box-shadow var(--an-duration-short-4) var(--an-ease-standard),
      transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  /* Material state layer: one translucent sheet of `currentColor` whose opacity
     encodes the interaction state. Keeps hover/press consistent across all five
     variants without hand-picking a hover colour for each. */
  .an-btn::before {
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
    .an-btn:hover::before {
      opacity: var(--an-state-hover);
    }
  }

  .an-btn:active::before,
  .an-btn[data-pressed]::before {
    opacity: var(--an-state-press);
  }

  .an-btn[data-pressed] {
    transform: scale(var(--an-press-scale));
  }

  .an-btn__content {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    transition: opacity var(--an-duration-short-2) var(--an-ease-standard);
  }

  .an-btn[data-loading] .an-btn__content {
    opacity: 0;
  }

  .an-btn__affix {
    display: inline-flex;
    align-items: center;
    /* Icons ride slightly smaller than the label — Apple's optical balance. */
    font-size: 0.95em;
  }

  .an-btn__loader {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    place-items: center;
  }

  /* ── Sizes ─────────────────────────────────────────────────────────────── */
  .an-btn[data-size='sm'] {
    --an-btn-h: var(--an-control-h-sm);
    --an-btn-pad: var(--an-space-3);
    font-size: var(--an-text-footnote-size);
    border-radius: var(--an-btn-radius, var(--an-radius-sm));
  }

  .an-btn[data-size='lg'] {
    --an-btn-h: var(--an-control-h-lg);
    --an-btn-pad: var(--an-space-6);
    font-size: var(--an-text-callout-size);
    border-radius: var(--an-btn-radius, var(--an-radius-lg));
  }

  /* Two classes on purpose: the size rules below are `.an-btn[data-size=…]`,
     which outranks a lone `.an-btn--pill` — so the plain form lost to every
     size and `pill` silently did nothing on anything but a default button. */
  .an-btn.an-btn--pill {
    border-radius: var(--an-radius-full);
  }

  .an-btn--full {
    width: 100%;
  }

  /* ── Variants ──────────────────────────────────────────────────────────── */
  .an-btn[data-variant='primary'] {
    background: var(--an-accent);
    color: var(--an-on-accent);
    box-shadow: var(--an-shadow-xs);
  }

  .an-btn[data-variant='secondary'] {
    background: var(--an-surface-sunken);
    color: var(--an-text);
  }

  .an-btn[data-variant='outline'] {
    background: var(--an-surface);
    /* The outline variant has no fill, so its border is the only thing marking
       it as a control — it uses the 3:1 line, not the decorative hairline. */
    border-color: var(--an-border-control);
    color: var(--an-text);
  }

  .an-btn[data-variant='ghost'] {
    background: transparent;
    color: var(--an-text);
  }

  .an-btn[data-variant='danger'] {
    background: var(--an-danger);
    color: var(--an-on-status);
    box-shadow: var(--an-shadow-xs);
  }

  /* ── Disabled ──────────────────────────────────────────────────────────── */
  .an-btn:disabled,
  .an-btn[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: var(--an-disabled-content);
    box-shadow: none;
    transform: none;
  }

  .an-btn:disabled::before,
  .an-btn[aria-disabled='true']::before {
    opacity: 0;
  }

  /* A loading button is busy, not broken — keep it at full contrast. */
  .an-btn[data-loading][aria-disabled='true'] {
    opacity: 1;
    cursor: progress;
  }
</style>
