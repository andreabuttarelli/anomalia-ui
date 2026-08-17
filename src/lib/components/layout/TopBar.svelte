<!--
  TopBar — the page's own header inside the app shell.

  Distinct from `AppBar`, which is the phone-style bar that owns a whole screen.
  This one sits above page content next to a sidebar: it names where you are and
  carries the actions for this page, nothing more.

  The part worth having in a library is the narrow-screen behaviour. A row of
  four buttons is fine at 1440px and impossible at 390px, and the usual fix —
  hiding actions below a breakpoint — hides the thing the page is for. Instead
  the actions move into an overflow menu, so every one of them is still
  reachable, one tap further away.

  The bar is frosted and carries its hairline at all times, which is how the app
  has always drawn it. The scroll-reactive version — transparent until something
  passes under — is available as `divider="scroll"`, but it is not the default:
  in a shell whose content region is a different surface from the chrome, the
  line is separating two real things from the first pixel, and a border that
  materialises on scroll makes the header feel like it is arriving late.

  Fixed height, not `min-height`. Everything in a shell measures against the
  header — a drawer's top edge, a sticky table head, `100dvh - header` — and a
  bar that grows by a pixel when a subtitle appears moves all of them.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import IconButton from '../button/IconButton.svelte';
  import Menu from '../overlay/Menu.svelte';

  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
    title?: string;
    /** Small label above the title — the section this page belongs to. */
    eyebrow?: string;
    /** One line under the title: a count, a state, the record you are editing. */
    subtitle?: string;
    /** `always` is the app's look; `scroll` fades the hairline in on scroll. */
    divider?: 'always' | 'scroll' | 'none';
    /** Frosted translucent background, so content blurs under the bar. */
    glass?: boolean;
    /** Bar height. Fixed, because the whole shell measures against it. */
    height?: string;
    /** Pins the bar to the top of the scroll container. */
    sticky?: boolean;
    /** Scroll container to watch. Defaults to the window. */
    scrollElement?: HTMLElement | null;
    /** Below this width the actions collapse into an overflow menu. */
    compactAt?: number;
    /** Sidebar toggle, back button, breadcrumb. */
    leading?: Snippet;
    /** Buttons. Rendered inline, or inside the overflow menu when compact. */
    actions?: Snippet;
    /** Always inline, never collapsed — presence, status, an avatar. */
    trailing?: Snippet;
    /** Replaces the title block entirely: a search field, a tab bar. */
    children?: Snippet;
  }

  let {
    title,
    eyebrow,
    subtitle,
    divider = 'always',
    glass = true,
    height = '56px',
    sticky = true,
    scrollElement = null,
    compactAt = 720,
    class: className,
    leading,
    actions,
    trailing,
    children,
    ...rest
  }: Props = $props();

  let scrolled = $state(false);
  let compact = $state(false);
  let menuOpen = $state(false);
  let menuAnchor = $state<HTMLElement | null>(null);

  $effect(() => {
    if (typeof window === 'undefined' || divider !== 'scroll') return;
    const target: HTMLElement | Window = scrollElement ?? window;

    const read = () =>
      (scrolled = (scrollElement ? scrollElement.scrollTop : window.scrollY) > 2);

    read();
    target.addEventListener('scroll', read, { passive: true });
    return () => target.removeEventListener('scroll', read);
  });

  // Width, not a media query, because the bar's width is the sidebar's
  // complement — the viewport can be wide while this bar is not.
  $effect(() => {
    if (typeof ResizeObserver === 'undefined' || !bar) return;
    const ro = new ResizeObserver(([entry]) => {
      compact = entry.contentRect.width < compactAt;
    });
    ro.observe(bar);
    return () => ro.disconnect();
  });

  let bar = $state<HTMLElement | null>(null);
</script>

<header
  bind:this={bar}
  data-an="top-bar"
  data-sticky={sticky ? '' : undefined}
  data-divider={divider}
  data-glass={glass ? '' : undefined}
  data-scrolled={scrolled ? '' : undefined}
  data-compact={compact ? '' : undefined}
  class={cn('an-topbar', className)}
  style={`--an-topbar-h:${height}`}
  {...rest}
>
  {#if leading}<div class="an-topbar__leading">{@render leading()}</div>{/if}

  <div class="an-topbar__main">
    {#if children}
      {@render children()}
    {:else if title}
      {#if eyebrow}<p class="an-topbar__eyebrow">{eyebrow}</p>{/if}
      <h1 class="an-topbar__title">{title}</h1>
      {#if subtitle}<p class="an-topbar__sub">{subtitle}</p>{/if}
    {/if}
  </div>

  <div class="an-topbar__end">
    {#if trailing}{@render trailing()}{/if}

    {#if actions}
      {#if compact}
        <span bind:this={menuAnchor}>
          <IconButton label="More actions" size="sm" onclick={() => (menuOpen = !menuOpen)}>
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <circle cx="10" cy="4" r="1.5" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="10" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </IconButton>
        </span>
      {:else}
        <div class="an-topbar__actions">{@render actions()}</div>
      {/if}
    {/if}
  </div>
</header>

{#if actions && compact}
  <Menu bind:open={menuOpen} anchor={menuAnchor} label="Page actions">
    {@render actions()}
  </Menu>
{/if}

<style>
  .an-topbar {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    /* Fixed, not min-height: a subtitle appearing must not move the shell. */
    height: var(--an-topbar-h);
    flex: 0 0 auto;
    box-sizing: border-box;
    padding: 0 var(--an-space-5);
    background: var(--an-surface);
    font-family: var(--an-font-sans);
  }

  /* Frosted by default. The bar sits over a scrolling region, and letting the
     content blur through is what makes it read as chrome rather than as the
     first row of the page. `--an-surface-glass` goes opaque on its own under
     `prefers-reduced-transparency`, so this needs no fallback here. */
  .an-topbar[data-glass] {
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
  }

  .an-topbar[data-sticky] {
    position: sticky;
    top: 0;
    z-index: var(--an-z-sticky);
  }

  /* Always, which is how the app draws it: the rail, the bar and the content
     are three different surfaces, so the line is separating real things from
     the first pixel rather than waiting for a scroll to justify itself. */
  .an-topbar[data-divider='always'] {
    border-bottom: 1px solid var(--an-border);
  }

  /* The opt-in alternative, for a bar sitting directly on the content surface
     where there is genuinely nothing to divide until something scrolls under. */
  .an-topbar[data-divider='scroll'] {
    border-bottom: 1px solid transparent;
    transition: border-color var(--an-duration-short-4) var(--an-ease-standard);
  }

  .an-topbar[data-divider='scroll'][data-scrolled] {
    border-bottom-color: var(--an-border);
  }

  .an-topbar__leading,
  .an-topbar__end {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    flex-shrink: 0;
  }

  /* Capped so a long title cannot be squeezed to nothing by a row of buttons —
     past this the actions collapse into the overflow menu instead. */
  .an-topbar__end {
    max-width: 52%;
    justify-content: flex-end;
  }

  .an-topbar__main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  /* Smaller and more tracked than the caption default: at 10px the letters need
     the extra air, and this label is read as a category, not as a sentence. */
  .an-topbar__eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: var(--an-weight-bold);
    letter-spacing: 0.05em;
    line-height: 1.2;
    text-transform: uppercase;
    color: var(--an-text-faint);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* A page title, not a display headline: it labels where you are and has to
     survive being long. The tracking is tighter than the type ramp's default —
     the app has always set this line tight, and at 15px in a 56px bar the
     compression is what keeps it from reading as body copy. */
  .an-topbar__title {
    margin: 0;
    font-size: var(--an-text-headline-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: -0.03em;
    line-height: 1.2;
    color: var(--an-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .an-topbar__sub {
    margin: 0;
    font-size: var(--an-text-footnote-size);
    line-height: 1.35;
    color: var(--an-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .an-topbar__actions {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
  }

  @media (max-width: 640px) {
    .an-topbar {
      padding-inline: var(--an-space-3);
    }
  }
</style>
