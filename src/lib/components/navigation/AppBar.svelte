<!--
  AppBar — sticky top chrome, Apple-style.

  Two details do the work:

    • it is transparent until the page scrolls, then fades in a frosted
      background and a hairline. A bar that is always opaque makes short pages
      look boxed in;
    • the optional large title collapses into the bar as you scroll, handing
      its job over to the compact title. iOS's signature move, and the reason
      the compact title starts hidden rather than crossfading at 50%.

  Scroll state is read from the window (or a given scroll container) with a
  passive listener, so it never blocks scrolling.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    title?: string;
    /** Renders the collapsing large title under the bar. */
    largeTitle?: boolean;
    /** Distance (px) over which the large title collapses. */
    collapseDistance?: number;
    /** Frosted translucent background once scrolled. */
    glass?: boolean;
    /** Scroll container to watch. Defaults to the window. */
    scrollElement?: HTMLElement | null;
    leading?: Snippet;
    trailing?: Snippet;
    children?: Snippet;
  }

  let {
    title,
    largeTitle = false,
    collapseDistance = 52,
    glass = true,
    scrollElement = null,
    class: className,
    leading,
    trailing,
    children,
    ...rest
  }: Props = $props();

  let scrollY = $state(0);

  const progress = $derived(Math.min(1, scrollY / collapseDistance));
  const scrolled = $derived(scrollY > 2);
  // The compact title only appears once the large one is mostly gone.
  const compactVisible = $derived(!largeTitle || progress > 0.6);

  $effect(() => {
    const target: HTMLElement | Window = scrollElement ?? window;
    const read = () => {
      scrollY = scrollElement ? scrollElement.scrollTop : window.scrollY;
    };

    read();
    target.addEventListener('scroll', read, { passive: true });
    return () => target.removeEventListener('scroll', read);
  });
</script>

<header
  data-an="app-bar"
  data-scrolled={scrolled ? '' : undefined}
  data-glass={glass ? '' : undefined}
  class={cn('an-appbar', className)}
  style={`--an-appbar-progress:${progress}`}
  {...rest}
>
  <div class="an-appbar__row">
    {#if leading}<div class="an-appbar__side">{@render leading()}</div>{/if}

    <div class="an-appbar__title" data-visible={compactVisible ? '' : undefined}>
      {#if children}{@render children()}{:else}{title}{/if}
    </div>

    {#if trailing}<div class="an-appbar__side an-appbar__side--end">{@render trailing()}</div>{/if}
  </div>

  {#if largeTitle && title}
    <!-- Visually collapses on scroll, but stays in the accessibility tree:
         the compact title is decorative chrome, this is the page heading. -->
    <h1 class="an-appbar__large">{title}</h1>
  {/if}
</header>

<style>
  .an-appbar {
    position: sticky;
    top: 0;
    z-index: var(--an-z-sticky);
    font-family: var(--an-font-sans);
    background: transparent;
    /* Notch/status-bar clearance when installed as a PWA. */
    padding-top: env(safe-area-inset-top, 0px);
    transition:
      background-color var(--an-duration-medium-1) var(--an-ease-standard),
      box-shadow var(--an-duration-medium-1) var(--an-ease-standard);
  }

  .an-appbar[data-scrolled] {
    background: var(--an-surface);
    box-shadow: inset 0 -1px 0 var(--an-border);
  }

  .an-appbar[data-scrolled][data-glass] {
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
  }

  .an-appbar__row {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    height: 52px;
    padding-inline: var(--an-space-3);
  }

  .an-appbar__side {
    display: flex;
    align-items: center;
    gap: var(--an-space-1);
    flex-shrink: 0;
  }

  .an-appbar__side--end {
    margin-inline-start: auto;
  }

  .an-appbar__title {
    flex: 1;
    min-width: 0;
    font-size: var(--an-text-headline-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: var(--an-text-headline-track);
    color: var(--an-text);
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    opacity: 0;
    translate: 0 6px;
    transition:
      opacity var(--an-duration-short-4) var(--an-ease-standard),
      translate var(--an-duration-short-4) var(--an-ease-emphasized-decelerate);
  }

  .an-appbar__title[data-visible] {
    opacity: 1;
    translate: 0 0;
  }

  /* Large title: scales down and fades as `--an-appbar-progress` goes 0 → 1. */
  .an-appbar__large {
    margin: 0;
    padding: 0 var(--an-space-4) var(--an-space-3);
    font-size: var(--an-text-title-1-size);
    line-height: var(--an-text-title-1-line);
    letter-spacing: var(--an-text-title-1-track);
    font-weight: var(--an-weight-bold);
    color: var(--an-text);
    transform-origin: left center;
    scale: calc(1 - var(--an-appbar-progress) * 0.25);
    opacity: calc(1 - var(--an-appbar-progress) * 1.6);
    height: calc((1 - var(--an-appbar-progress)) * 44px);
    overflow: hidden;
    pointer-events: none;
  }
</style>
