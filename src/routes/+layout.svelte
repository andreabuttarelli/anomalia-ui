<!--
  Docs shell. Built entirely from the library it documents — if a component
  regresses, this page is the first place it shows.
-->
<script lang="ts">
  import '$lib/styles/index.css';
  import './docs.css';

  import { page } from '$app/stores';
  import { ThemeProvider, ThemeToggle, Toaster, IconButton, Badge, SkipLink } from '$lib/index.js';
  import { lockScroll } from '$lib/actions/scroll-lock.js';
  import { groupedComponents } from '../docs/registry.js';

  let { children } = $props();

  const groups = groupedComponents();
  let navOpen = $state(false);

  const current = $derived($page.url.pathname);

  /* One route renders without the shell: the full-screen landing mockup. A
     landing page is judged edge to edge, and a sidebar beside it is a lie about
     how it will be seen. Done here rather than by moving every docs route into
     a layout group — the shell is the root layout, so a page cannot opt out of
     it with the `@` suffix, and reshuffling the tree to allow it would touch
     every route to serve one. */
  const bare = $derived(current.startsWith('/showcase/landing/full'));

  // Close the drawer on navigation — the nav is a drawer only on phones.
  $effect(() => {
    void current;
    navOpen = false;
  });

  /* Freeze the page while the drawer is open. Without this the touch drags the
     document underneath instead of the drawer — the drawer is `position: fixed`,
     so it does not participate in the page's scroll, and every gesture that
     does not land exactly on its scrollable inner list leaks through to the
     body. Released on close and on unmount both. */
  $effect(() => {
    if (!navOpen) return;
    return lockScroll();
  });
</script>

<ThemeProvider>
  {#if bare}
    <!-- `.an-app` still wraps it: that class is where the library sets the
         canvas, the type and the text colour, so a page rendered without it
         falls back to the browser's own serif. -->
    <div class="an-app">
      {@render children()}
    </div>
  {:else}
  <div class="an-app shell" data-nav-open={navOpen ? '' : undefined}>
    <SkipLink href="#main" />
    <header class="shell__bar">
      <div class="shell__bar-inner">
        <IconButton
          label={navOpen ? 'Close navigation' : 'Open navigation'}
          class="shell__menu"
          onclick={() => (navOpen = !navOpen)}
        >
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <path
              d="M3 5.5h14M3 10h14M3 14.5h14"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </IconButton>

        <a class="shell__brand" href="/">
          <span class="shell__mark" aria-hidden="true"></span>
          <span class="shell__name">@anomalia-so/ui</span>
          <Badge size="sm" tone="accent">v0.1.0</Badge>
        </a>

        <div class="shell__bar-end">
          <ThemeToggle variant="icon" />
        </div>
      </div>
    </header>

    <div class="shell__body">
      <nav class="shell__nav" aria-label="Documentation">
        <div class="shell__nav-inner">
          <a class="shell__link" href="/" aria-current={current === '/' ? 'page' : undefined}>
            Overview
          </a>
          <a
            class="shell__link"
            href="/foundations/"
            aria-current={current.startsWith('/foundations') ? 'page' : undefined}
          >
            Design tokens
          </a>
          <a
            class="shell__link"
            href="/typography/"
            aria-current={current.startsWith('/typography') ? 'page' : undefined}
          >
            Typography
          </a>
          <a
            class="shell__link"
            href="/motion/"
            aria-current={current.startsWith('/motion') ? 'page' : undefined}
          >
            Motion
          </a>
          <a
            class="shell__link"
            href="/accessibility/"
            aria-current={current.startsWith('/accessibility') ? 'page' : undefined}
          >
            Accessibility
          </a>
          <a
            class="shell__link"
            href="/audit/"
            aria-current={current.startsWith('/audit') ? 'page' : undefined}
          >
            App audit
          </a>

          <p class="shell__group">Showcase</p>
          <a
            class="shell__link"
            href="/showcase/dashboard/"
            aria-current={current === '/showcase/dashboard/' ? 'page' : undefined}
          >
            Dashboard
          </a>
          <a
            class="shell__link"
            href="/showcase/agent/"
            aria-current={current === '/showcase/agent/' ? 'page' : undefined}
          >
            Agent chat
          </a>
          <a
            class="shell__link"
            href="/showcase/social/"
            aria-current={current === '/showcase/social/' ? 'page' : undefined}
          >
            Post previews
          </a>
          <a
            class="shell__link"
            href="/showcase/landing/"
            aria-current={current === '/showcase/landing/' ? 'page' : undefined}
          >
            Landing page
          </a>

          {#each groups as group (group.category)}
            <p class="shell__group">{group.category}</p>
            {#each group.items as item (item.slug)}
              <a
                class="shell__link"
                href={`/components/${item.slug}/`}
                aria-current={current === `/components/${item.slug}/` ? 'page' : undefined}
              >
                {item.name}
              </a>
            {/each}
          {/each}
        </div>
      </nav>

      <!-- Tap-to-close backdrop, phone layout only. -->
      <button
        class="shell__backdrop"
        type="button"
        tabindex={navOpen ? 0 : -1}
        aria-label="Close navigation"
        onclick={() => (navOpen = false)}
      ></button>

      <main class="shell__main" id="main" tabindex="-1">
        {@render children?.()}
      </main>
    </div>
  </div>

  {/if}
  <Toaster />
</ThemeProvider>

<style>
  .shell {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
  }

  .shell__bar {
    position: sticky;
    top: 0;
    z-index: 20;
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
    border-bottom: 1px solid var(--an-border);
  }

  .shell__bar-inner {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    height: 56px;
    max-width: 1280px;
    margin: 0 auto;
    padding-inline: var(--an-space-4);
  }

  .shell__brand {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    text-decoration: none;
    color: var(--an-text);
    font-weight: var(--an-weight-semibold);
    letter-spacing: -0.01em;
  }

  .shell__mark {
    width: 20px;
    height: 20px;
    border-radius: var(--an-radius-sm);
    background: var(--an-accent);
  }

  .shell__bar-end {
    margin-inline-start: auto;
  }

  .shell__body {
    position: relative;
    flex: 1;
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr);
    gap: var(--an-space-8);
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding-inline: var(--an-space-4);
  }

  /* The sticky element and the scroll container are deliberately two different
     elements. An element that is both — `position: sticky` *and* `overflow-y:
     auto` — scrolls in Chromium and silently refuses to in Safari, which is how
     a nav that tests fine ends up unreachable below the fold for half the
     people using it. The wrapper sticks; the inner list scrolls. */
  .shell__nav {
    position: sticky;
    top: 57px;
    align-self: start;
    display: flex;
    max-height: calc(100dvh - 57px);
  }

  .shell__nav-inner {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    /* Reaching the end of the nav must not start scrolling the page under it. */
    overscroll-behavior: contain;
    padding: var(--an-space-6) 0 var(--an-space-10);
    /* Visible rather than overlay: with ~1800px of links in a 240px column, an
       invisible scrollbar is indistinguishable from a nav that cannot scroll. */
    scrollbar-width: thin;
    scrollbar-color: var(--an-border-strong) transparent;
  }

  .shell__group {
    margin: var(--an-space-5) 0 var(--an-space-1);
    padding-inline: var(--an-space-3);
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .shell__link {
    padding: 7px var(--an-space-3);
    border-radius: var(--an-radius-sm);
    color: var(--an-text-muted);
    text-decoration: none;
    font-size: var(--an-text-footnote-size);
    transition:
      background-color var(--an-duration-short-3) var(--an-ease-standard),
      color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .shell__link:hover {
    background: var(--an-surface-hover);
    color: var(--an-text);
  }

  .shell__link[aria-current='page'] {
    background: var(--an-accent-soft);
    color: var(--an-accent-soft-text);
    font-weight: var(--an-weight-medium);
  }

  .shell__main {
    padding: var(--an-space-8) 0 var(--an-space-20);
    min-width: 0;
    /* Focus target for the skip link — outline suppressed because landing here
       is not a control interaction, the heading below it is the destination. */
    outline: none;
  }

  .shell__backdrop {
    display: none;
  }

  :global(.shell__menu) {
    display: none !important;
  }

  @media (max-width: 900px) {
    .shell__body {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;
    }

    :global(.shell__menu) {
      display: inline-grid !important;
    }

    /* The sidebar becomes a drawer that slides in on the emphasized curve. */
    .shell__nav {
      position: fixed;
      top: 56px;
      left: 0;
      z-index: 30;
      width: 268px;
      /* An explicit height, not `bottom: 0`. The nav is still a grid item of
         `.shell__body`, and `align-self: start` from the desktop rule wins over
         the bottom edge — so the drawer sized itself to the whole *page*
         (2498px) instead of the viewport, which left its inner list with
         nothing to scroll and every gesture falling through to the document. */
      align-self: stretch;
      height: calc(100dvh - 56px);
      max-height: none;
      background: var(--an-surface);
      border-right: 1px solid var(--an-border);
      translate: -100% 0;
      transition: translate var(--an-duration-medium-3) var(--an-ease-emphasized);
    }

    .shell[data-nav-open] .shell__nav {
      translate: 0 0;
      box-shadow: var(--an-shadow-xl);
    }

    .shell__nav-inner {
      padding: var(--an-space-4) var(--an-space-3)
        calc(var(--an-space-8) + env(safe-area-inset-bottom, 0px));
      /* Momentum scrolling on iOS, and a scrollbar that is not needed on a
         touch device where the gesture is the affordance. */
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .shell__backdrop {
      display: block;
      position: fixed;
      top: 56px;
      left: 0;
      right: 0;
      height: calc(100dvh - 56px);
      z-index: 25;
      border: none;
      background: var(--an-scrim);
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--an-duration-medium-2) var(--an-ease-standard);
    }

    .shell[data-nav-open] .shell__backdrop {
      opacity: 1;
      pointer-events: auto;
    }
  }
</style>
