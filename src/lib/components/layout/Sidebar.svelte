<!--
  Sidebar — the app's primary navigation rail.

  Two states, one component. Expanded it is labelled navigation; collapsed it is
  a rail of icons. The collapse is a width change on a CSS variable rather than
  a different tree, so nothing unmounts, focus survives it, and the transition is
  a single animated property instead of a re-render.

  Collapsed, the labels are still in the DOM — hidden with `opacity` and
  `clip`, never `display: none` — because a rail whose items have no accessible
  name is a column of anonymous glyphs to a screen reader. `SidebarItem` turns
  its label into a tooltip in that state so sighted users get it back too.

  On a phone this is a drawer instead: `overlay` slides it in over the content
  with a scrim, which is the only honest way to fit a rail on a 390px screen.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import { focusTrap } from '../../actions/focus-trap.js';
  import { lockScroll } from '../../actions/scroll-lock.js';
  import Scrim from '../overlay/Scrim.svelte';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** Icons only. Labels stay in the accessibility tree. */
    collapsed?: boolean;
    /** Phone layout: slides in over the content with a scrim. */
    overlay?: boolean;
    /** Drawer visibility. Only meaningful with `overlay`. */
    open?: boolean;
    width?: string;
    collapsedWidth?: string;
    label?: string;
    /** Brand, workspace switcher — pinned above the scrolling nav. */
    header?: Snippet;
    /** Account, plan, storage — pinned below it. */
    footer?: Snippet;
    children?: Snippet;
  }

  let {
    collapsed = false,
    overlay = false,
    open = $bindable(false),
    width = '256px',
    collapsedWidth = '64px',
    label = 'Main',
    class: className,
    header,
    footer,
    children,
    ...rest
  }: Props = $props();

  /** In overlay mode the rail is always full width — a collapsed drawer is a
      drawer nobody can read, and there is no space to save on a phone anyway. */
  const isCollapsed = $derived(collapsed && !overlay);

  // The page behind a drawer must not scroll under the finger. Released on
  // close and on unmount, both, or a navigation mid-drawer leaves the body
  // frozen for the rest of the session.
  $effect(() => {
    if (!overlay || !open) return;
    return lockScroll();
  });

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && overlay && open) {
      event.stopPropagation();
      open = false;
    }
  }
</script>

<svelte:window {onkeydown} />

{#if overlay && open}
  <Scrim onclose={() => (open = false)} />
{/if}

<aside
  data-an="sidebar"
  data-collapsed={isCollapsed ? '' : undefined}
  data-overlay={overlay ? '' : undefined}
  data-open={overlay && open ? '' : undefined}
  class={cn('an-side', className)}
  style={`--an-side-w:${width}; --an-side-w-collapsed:${collapsedWidth}`}
  aria-label={label}
  aria-hidden={overlay && !open ? 'true' : undefined}
  inert={overlay && !open ? true : undefined}
  use:focusTrap={{ enabled: overlay && open }}
  {...rest}
>
  {#if header}<div class="an-side__header">{@render header()}</div>{/if}

  <nav class="an-side__nav">{@render children?.()}</nav>

  {#if footer}<div class="an-side__footer">{@render footer()}</div>{/if}
</aside>

<style>
  .an-side {
    display: flex;
    flex-direction: column;
    width: var(--an-side-w);
    flex-shrink: 0;
    border-inline-end: 1px solid var(--an-border);
    /* Its own surface, a step back from the content. The app's rail has always
       been tinted, and that recession is what says "this is chrome" — it also
       means the hairline is doing less work, so it can stay a hairline. */
    background: var(--an-surface-rail);
    font-family: var(--an-font-sans);
    /* One animated property. Animating a layout that reflows its children is
       how a collapse ends up janky on every machine but the developer's. */
    transition: width var(--an-duration-medium-2) var(--an-ease-emphasized);
    overflow: hidden;
  }

  .an-side[data-collapsed] {
    width: var(--an-side-w-collapsed);
  }

  /* As a drawer it floats over the page, so it takes the raised surface: a
     recessed panel sitting on top of content reads as a hole, not a layer. */
  .an-side[data-overlay] {
    background: var(--an-surface);
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    z-index: var(--an-z-modal);
    max-width: 86vw;
    box-shadow: var(--an-shadow-xl);
    transform: translateX(-100%);
    transition:
      transform var(--an-duration-medium-4) var(--an-ease-emphasized),
      visibility var(--an-duration-medium-4);
    visibility: hidden;
  }

  .an-side[data-overlay][data-open] {
    transform: translateX(0);
    visibility: visible;
  }

  .an-side__header,
  .an-side__footer {
    flex-shrink: 0;
    padding: var(--an-space-3);
  }

  .an-side__footer {
    border-top: 1px solid var(--an-border);
  }

  .an-side__header {
    display: flex;
    align-items: center;
    min-height: var(--an-topbar-h, 56px);
    padding-block: 0;
  }

  /* Collapsed, the header has one glyph in it and centring is the only sane
     place to put it. */
  .an-side[data-collapsed] .an-side__header {
    padding-inline: 0;
    justify-content: center;
  }

  .an-side__nav {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--an-space-2);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .an-side,
    .an-side[data-overlay] {
      transition: none;
    }
  }
</style>
