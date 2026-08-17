<!--
  SiteHeader — the marketing navbar.

  Not `AppBar` and not `TopBar`: a landing header has a different job from
  either. It has to hold a wordmark, a handful of links, a couple of utilities
  and a CTA at desktop width, and collapse the middle into a menu on a phone
  without losing the CTA — the CTA is the reason the page exists, so it is the
  one thing that never goes into the burger.

  Three details it owns:

    • **The menu is a real `<dialog>`.** Modal semantics, Escape, focus
      containment and the top layer come from the platform instead of from a
      div with a high `z-index` and a keydown handler.
    • **The bar frosts once the page has scrolled**, not before. Glass over the
      very top of a page is glass over nothing.
    • **Links are a `<nav>` with `aria-current`**, so the current page is stated
      rather than merely tinted.

  Everything else is snippets. A design system should not have opinions about
  whether you ship a language picker.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { SiteLink } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    links?: SiteLink[];
    /** Matched against each link's `href` to set `aria-current`. */
    current?: string;
    /** Frost and a hairline once the page scrolls. */
    glass?: boolean;
    /** Pin to the top of the viewport. */
    sticky?: boolean;
    label?: string;
    /** Wordmark. Wrap it in the link to `/` yourself. */
    brand?: Snippet;
    /** Theme toggle, language picker, social icons — desktop and menu footer. */
    utilities?: Snippet;
    /** The CTA. Stays visible at every width. */
    cta?: Snippet;
    /** Extra rows inside the mobile menu, under the links. */
    menuExtra?: Snippet;
  }

  let {
    links = [],
    current = '',
    glass = true,
    sticky = true,
    label = 'Main',
    class: className,
    brand,
    utilities,
    cta,
    menuExtra,
    ...rest
  }: Props = $props();

  let open = $state(false);
  let scrolled = $state(false);
  let dialog = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (typeof window === 'undefined' || !glass) return;
    const read = () => (scrolled = window.scrollY > 8);
    read();
    window.addEventListener('scroll', read, { passive: true });
    return () => window.removeEventListener('scroll', read);
  });

  // `showModal` rather than `show`: it is the modal form that gives Escape,
  // focus containment and the top layer for free.
  function toggle() {
    if (open) {
      dialog?.close();
    } else {
      dialog?.showModal();
      open = true;
    }
  }

  function close() {
    dialog?.close();
  }
</script>

<header
  data-an="site-header"
  data-sticky={sticky ? '' : undefined}
  data-glass={glass ? '' : undefined}
  data-scrolled={scrolled ? '' : undefined}
  data-open={open ? '' : undefined}
  class={cn('an-site-header', className)}
  {...rest}
>
  <div class="an-site-header__bar">
    <div class="an-site-header__start">
      <button
        class="an-site-header__burger"
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onclick={toggle}
      >
        <span class="an-burger" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>
      </button>

      {#if brand}<div class="an-site-header__brand">{@render brand()}</div>{/if}
    </div>

    {#if links.length}
      <nav class="an-site-header__nav" aria-label={label}>
        {#each links as link (link.href + link.label)}
          <a
            class="an-site-header__link"
            href={link.href}
            aria-current={current && link.href === current ? 'page' : undefined}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    {/if}

    <div class="an-site-header__end">
      {#if utilities}<div class="an-site-header__utils">{@render utilities()}</div>{/if}
      {#if cta}{@render cta()}{/if}
    </div>
  </div>

  <dialog
    class="an-site-header__menu"
    bind:this={dialog}
    onclose={() => (open = false)}
    onclick={(event) => {
      // Clicking the backdrop lands on the dialog itself, never on its content.
      if (event.target === dialog) close();
    }}
  >
    <nav class="an-site-header__menu-links" aria-label={label}>
      {#each links as link (link.href + link.label)}
        <a
          class="an-site-header__menu-link"
          href={link.href}
          aria-current={current && link.href === current ? 'page' : undefined}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
          onclick={close}
        >
          {link.label}
        </a>
      {/each}
    </nav>

    {#if menuExtra}<div class="an-site-header__menu-extra">{@render menuExtra()}</div>{/if}

    {#if utilities}
      <div class="an-site-header__menu-utils">{@render utilities()}</div>
    {/if}
  </dialog>
</header>

<style>
  .an-site-header {
    font-family: var(--an-font-sans);
    background: var(--an-bg);
    border-bottom: 1px solid transparent;
    transition:
      background-color var(--an-duration-medium-1) var(--an-ease-standard),
      border-color var(--an-duration-medium-1) var(--an-ease-standard);
  }

  .an-site-header[data-sticky] {
    position: sticky;
    top: 0;
    z-index: var(--an-z-sticky);
  }

  /* Frost only once there is content behind it. Glass over the top of an
     unscrolled page is an effect applied to nothing. */
  .an-site-header[data-glass][data-scrolled] {
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
    border-bottom-color: var(--an-border);
  }

  .an-site-header__bar {
    display: flex;
    align-items: center;
    gap: var(--an-space-4);
    max-width: var(--an-site-width, 1200px);
    margin-inline: auto;
    padding: var(--an-space-3) var(--an-space-4);
  }

  .an-site-header__start,
  .an-site-header__end {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    flex: 1;
  }

  .an-site-header__end {
    justify-content: flex-end;
  }

  /* Centred independently of how wide the two ends are: equal flex on the
     sides is what keeps the links centred as a CTA label changes length. */
  .an-site-header__nav {
    display: flex;
    align-items: center;
    gap: var(--an-space-1);
  }

  .an-site-header__link {
    padding: 6px 10px;
    border-radius: var(--an-radius-md);
    color: var(--an-text-muted);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-medium);
    text-decoration: none;
    white-space: nowrap;
    transition: color var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-site-header__link:hover {
      color: var(--an-text);
    }
  }

  .an-site-header__link[aria-current='page'] {
    color: var(--an-text);
  }

  .an-site-header__utils {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  /* ── Burger ──────────────────────────────────────────────────────────────
     Three bars that become an ✕ by rotating the outer two and fading the
     middle — the transform is on the bars, so it survives a size change. */
  .an-site-header__burger {
    display: none;
    place-items: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: var(--an-radius-md);
    background: none;
    color: var(--an-text);
    cursor: pointer;
  }

  .an-burger {
    display: grid;
    gap: 4px;
    width: 18px;
  }

  .an-burger i {
    display: block;
    height: 1.6px;
    border-radius: 2px;
    background: currentColor;
    transition: transform var(--an-duration-short-4) var(--an-ease-emphasized),
      opacity var(--an-duration-short-2) var(--an-ease-standard);
  }

  .an-site-header[data-open] .an-burger i:nth-child(1) {
    transform: translateY(5.6px) rotate(45deg);
  }
  .an-site-header[data-open] .an-burger i:nth-child(2) {
    opacity: 0;
  }
  .an-site-header[data-open] .an-burger i:nth-child(3) {
    transform: translateY(-5.6px) rotate(-45deg);
  }

  /* ── Mobile menu ───────────────────────────────────────────────────────── */
  .an-site-header__menu {
    width: min(420px, 100%);
    max-width: 100%;
    margin: 0 0 0 auto;
    height: 100dvh;
    max-height: 100dvh;
    padding: var(--an-space-6) var(--an-space-4);
    border: none;
    background: var(--an-surface);
    color: var(--an-text);
    overflow-y: auto;
  }

  .an-site-header__menu::backdrop {
    background: var(--an-scrim);
    backdrop-filter: blur(2px);
  }

  .an-site-header__menu-links {
    display: flex;
    flex-direction: column;
  }

  .an-site-header__menu-link {
    padding: var(--an-space-3) 0;
    border-bottom: 1px solid var(--an-border);
    color: var(--an-text);
    font-size: var(--an-text-callout-size);
    font-weight: var(--an-weight-medium);
    text-decoration: none;
  }

  .an-site-header__menu-link[aria-current='page'] {
    color: var(--an-text-faint);
  }

  .an-site-header__menu-extra {
    margin-top: var(--an-space-4);
  }

  .an-site-header__menu-utils {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    margin-top: var(--an-space-6);
  }

  /* ── Narrow ──────────────────────────────────────────────────────────────
     Links and utilities move into the menu; the CTA never does. */
  @media (max-width: 860px) {
    .an-site-header__burger {
      display: grid;
    }

    .an-site-header__nav,
    .an-site-header__bar > .an-site-header__end .an-site-header__utils {
      display: none;
    }

    .an-site-header__menu-utils {
      display: flex;
    }
  }

  @media (min-width: 861px) {
    .an-site-header__menu {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-site-header,
    .an-burger i {
      transition: none;
    }
  }
</style>
