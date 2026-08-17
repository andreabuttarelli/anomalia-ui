<!--
  Docs shell. Built entirely from the library it documents — if a component
  regresses, this page is the first place it shows.
-->
<script lang="ts">
  import '$lib/styles/index.css';
  import './docs.css';

  import { page } from '$app/stores';
  import { ThemeProvider, ThemeToggle, Toaster, IconButton, Badge, SkipLink } from '$lib/index.js';
  import { groupedComponents } from '../docs/registry.js';

  let { children } = $props();

  const groups = groupedComponents();
  let navOpen = $state(false);

  const current = $derived($page.url.pathname);

  // Close the drawer on navigation — the nav is a drawer only on phones.
  $effect(() => {
    void current;
    navOpen = false;
  });
</script>

<ThemeProvider>
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
          <span class="shell__name">@anomalia/ui</span>
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

  .shell__nav {
    position: sticky;
    top: 56px;
    align-self: start;
    max-height: calc(100dvh - 56px);
    overflow-y: auto;
    padding: var(--an-space-6) 0 var(--an-space-10);
  }

  .shell__nav-inner {
    display: flex;
    flex-direction: column;
    gap: 1px;
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
      inset: 56px auto 0 0;
      z-index: 30;
      width: 268px;
      max-height: none;
      padding: var(--an-space-4) var(--an-space-3);
      background: var(--an-surface);
      border-right: 1px solid var(--an-border);
      translate: -100% 0;
      transition: translate var(--an-duration-medium-3) var(--an-ease-emphasized);
    }

    .shell[data-nav-open] .shell__nav {
      translate: 0 0;
      box-shadow: var(--an-shadow-xl);
    }

    .shell__backdrop {
      display: block;
      position: fixed;
      inset: 56px 0 0;
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
