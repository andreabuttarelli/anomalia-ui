<!--
  ListItem — the settings/navigation row: leading slot, title + subtitle,
  trailing value or control.

  Rows are the surface people tap most on a phone, so this one is
  ripple-and-press enabled and at least `--an-tap-target` tall. It renders as a
  link, a button or a plain div depending on what it is given — a row with a
  Switch in its trailing slot must NOT be a button, or the two controls fight
  over the same tap.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { ripple } from '../../actions/ripple.js';
  import { press } from '../../actions/press.js';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    title?: string;
    subtitle?: string;
    /** Right-aligned secondary value (iOS "Detail" style). */
    value?: string;
    href?: string;
    /** Trailing chevron. Defaults to on for links. */
    chevron?: boolean;
    selected?: boolean;
    disabled?: boolean;
    tone?: 'default' | 'danger';
    leading?: Snippet;
    trailing?: Snippet;
    children?: Snippet;
  }

  let {
    title,
    subtitle,
    value,
    href,
    chevron,
    selected = false,
    disabled = false,
    tone = 'default',
    class: className,
    onclick,
    leading,
    trailing,
    children,
    ...rest
  }: Props = $props();

  const interactive = $derived(Boolean(href || onclick) && !disabled);
  const tag = $derived(href ? 'a' : onclick ? 'button' : 'div');
  const showChevron = $derived(chevron ?? Boolean(href));
</script>

<svelte:element
  this={tag}
  data-an="list-item"
  data-an-interactive={interactive ? '' : undefined}
  data-tone={tone}
  data-selected={selected ? '' : undefined}
  data-disabled={disabled ? '' : undefined}
  class={cn('an-list-item', interactive && 'an-list-item--interactive', className)}
  role="listitem"
  href={href && !disabled ? href : undefined}
  type={tag === 'button' ? 'button' : undefined}
  disabled={tag === 'button' ? disabled : undefined}
  onclick={disabled ? undefined : onclick}
  use:ripple={{ disabled: !interactive }}
  use:press={{ disabled: !interactive, scale: 0.995, haptics: 'selection' }}
  {...rest}
>
  {#if leading}
    <span class="an-list-item__leading">{@render leading()}</span>
  {/if}

  <span class="an-list-item__text">
    {#if children}
      {@render children()}
    {:else}
      {#if title}<span class="an-list-item__title">{title}</span>{/if}
      {#if subtitle}<span class="an-list-item__subtitle">{subtitle}</span>{/if}
    {/if}
  </span>

  {#if value}<span class="an-list-item__value">{value}</span>{/if}
  {#if trailing}<span class="an-list-item__trailing">{@render trailing()}</span>{/if}

  {#if showChevron}
    <svg class="an-list-item__chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 3.5L10.5 8L6 12.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  {/if}
</svelte:element>

<style>
  .an-list-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    width: 100%;
    min-height: var(--an-tap-target);
    padding: var(--an-space-3) var(--an-space-4);
    border: none;
    background: transparent;
    color: var(--an-text);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-body-size);
    text-align: start;
    text-decoration: none;
    isolation: isolate;
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  .an-list-item--interactive {
    cursor: pointer;
  }

  @media (hover: hover) {
    .an-list-item--interactive:hover {
      background: var(--an-surface-hover);
    }
  }

  .an-list-item--interactive[data-pressed] {
    transform: scale(0.995);
  }

  .an-list-item[data-selected] {
    background: var(--an-accent-soft);
    color: var(--an-accent-soft-text);
  }

  .an-list-item[data-tone='danger'] {
    color: var(--an-danger);
  }

  .an-list-item__leading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    color: var(--an-text-muted);
    flex-shrink: 0;
  }

  .an-list-item__text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-width: 0;
  }

  .an-list-item__title {
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .an-list-item__subtitle {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .an-list-item__value {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    flex-shrink: 0;
  }

  .an-list-item__trailing {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    /* Controls in this slot own their own taps — see the note in the header. */
    position: relative;
    z-index: 1;
  }

  .an-list-item__chevron {
    width: 16px;
    height: 16px;
    color: var(--an-text-faint);
    flex-shrink: 0;
  }

  .an-list-item[data-disabled] {
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }
</style>
