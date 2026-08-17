<!--
  AppShell — sidebar, header, content, and the one scroll region between them.

  The layout every app rebuilds, and the one place a small mistake is felt on
  every screen: if the page scrolls instead of the content, the sidebar scrolls
  away with it and a sticky header inside the main column stops sticking. So the
  shell is `100dvh`, the rail and the header do not scroll, and `main` is the
  only scroll container — which also means `scrollElement` has something real to
  hand to a `TopBar`.

  `dvh`, not `vh`: on iOS `100vh` is taller than the visible viewport while the
  browser chrome is showing, so a `vh` shell puts its own bottom edge under the
  address bar.

  It takes the sidebar as a snippet rather than owning one, because the shell's
  job is the geometry. Which rail, and whether it collapses, is the app's call.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** The rail. Render a `Sidebar` here. */
    sidebar?: Snippet;
    /** Fixed above the scrolling content — usually a `TopBar`. */
    header?: Snippet;
    /** Fixed below it: a player, a tab bar, a persistent composer. */
    footer?: Snippet;
    /** Caps the content column so text does not run the width of a monitor. */
    contentWidth?: string | null;
    /** Bind to hand a real scroll container to `TopBar`'s `scrollElement`. */
    scrollElement?: HTMLElement | null;
    children?: Snippet;
  }

  let {
    sidebar,
    header,
    footer,
    contentWidth = null,
    scrollElement = $bindable(null),
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<div data-an="app-shell" class={cn('an-shell', className)} {...rest}>
  {#if sidebar}{@render sidebar()}{/if}

  <div class="an-shell__column">
    {#if header}{@render header()}{/if}

    <main class="an-shell__main" bind:this={scrollElement}>
      {#if contentWidth}
        <div class="an-shell__content" style={`max-width:${contentWidth}`}>
          {@render children?.()}
        </div>
      {:else}
        {@render children?.()}
      {/if}
    </main>

    {#if footer}<div class="an-shell__footer">{@render footer()}</div>{/if}
  </div>
</div>

<style>
  .an-shell {
    display: flex;
    /* dvh: `vh` on iOS measures the viewport with the browser chrome hidden, so
       a `100vh` shell hangs its own bottom edge behind the address bar. */
    height: 100dvh;
    overflow: hidden;
    background: var(--an-bg);
    font-family: var(--an-font-sans);
    color: var(--an-text);
  }

  .an-shell__column {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  /* The only scroll container in the shell. Everything else is fixed, which is
     what lets a sticky TopBar actually stick and gives it something to watch. */
  .an-shell__main {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
  }

  .an-shell__content {
    margin-inline: auto;
    padding: var(--an-space-6) var(--an-space-4);
  }

  .an-shell__footer {
    flex-shrink: 0;
    border-top: 1px solid var(--an-border);
    background: var(--an-surface);
    /* Home indicators and gesture bars eat the bottom of a fixed footer. */
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
</style>
