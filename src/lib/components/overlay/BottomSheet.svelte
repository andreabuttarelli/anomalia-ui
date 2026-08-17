<!--
  BottomSheet — the touch-first modal, and the most Material component here.

  The sheet follows the finger 1:1 while dragging, resists past its top edge
  (rubber-banding), and decides on release using *both* distance and velocity:
  a short fast flick dismisses, a long slow drag that stops halfway springs
  back. Distance alone is what makes web sheets feel unresponsive compared to
  native ones.

  While the finger is down every transition is off, so the sheet cannot lag
  behind the touch; they are restored on release for the snap animation.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { portal } from '../../actions/portal.js';
  import { focusTrap } from '../../actions/focus-trap.js';
  import { lockScroll } from '../../actions/scroll-lock.js';
  import { swipe } from '../../actions/swipe.js';
  import { slideEdge } from '../../motion/transitions.js';
  import { haptic } from '../../utils/haptics.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import Scrim from './Scrim.svelte';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    /** Sheet height as a fraction of the viewport, or `auto` to fit content. */
    height?: 'auto' | 'half' | 'full';
    dismissible?: boolean;
    /** The drag handle. Hiding it also disables drag-to-dismiss. */
    grabber?: boolean;
    class?: string;
    header?: Snippet;
    footer?: Snippet;
    children?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    description,
    height = 'auto',
    dismissible = true,
    grabber = true,
    class: className,
    header,
    footer,
    children,
    onclose
  }: Props = $props();

  const id = uid('sheet');

  let sheet = $state<HTMLElement | null>(null);
  let dragOffset = $state(0);
  let dragging = $state(false);

  /** Fade the scrim out in step with the drag, capped so it never fully clears. */
  const scrimOpacity = $derived(
    dragging && sheet ? Math.max(0.15, 1 - dragOffset / sheet.offsetHeight) : null
  );

  function close() {
    open = false;
    dragOffset = 0;
    onclose?.();
  }

  $effect(() => {
    if (!open) return;
    const release = lockScroll();

    const onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onkeydown);

    return () => {
      document.removeEventListener('keydown', onkeydown);
      release();
    };
  });
</script>

{#if open}
  <div class="an-sheet-root" use:portal>
    <Scrim opacity={scrimOpacity} onclose={() => dismissible && close()} />

    <div
      bind:this={sheet}
      data-an="bottom-sheet"
      data-height={height}
      data-dragging={dragging ? '' : undefined}
      class={cn('an-sheet', className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? `${id}-title` : undefined}
      aria-describedby={description ? `${id}-desc` : undefined}
      tabindex="-1"
      style={dragOffset ? `transform: translate3d(0, ${dragOffset}px, 0)` : undefined}
      transition:slideEdge={{ edge: 'bottom' }}
      use:focusTrap={{ enabled: true }}
      use:swipe={{
        axis: 'y',
        disabled: !dismissible || !grabber,
        onstart: () => {
          dragging = true;
        },
        onmove: ({ delta }) => {
          // Rubber-band upward drags: movement past the top costs 4× the distance.
          dragOffset = delta >= 0 ? delta : delta / 4;
        },
        onend: ({ delta, velocity }) => {
          dragging = false;
          const travelled = delta > (sheet?.offsetHeight ?? 0) * 0.35;
          const flicked = velocity > 0.5;

          if (travelled || flicked) {
            haptic('light');
            close();
          } else {
            dragOffset = 0;
          }
        }
      }}
    >
      {#if grabber}
        <div class="an-sheet__grabber" aria-hidden="true"><span></span></div>
      {/if}

      {#if header || title}
        <div class="an-sheet__header">
          {#if header}
            {@render header()}
          {:else}
            <h2 class="an-sheet__title" id={`${id}-title`}>{title}</h2>
            {#if description}
              <p class="an-sheet__desc" id={`${id}-desc`}>{description}</p>
            {/if}
          {/if}
        </div>
      {/if}

      <div class="an-sheet__body" data-an-scroll>
        {@render children?.()}
      </div>

      {#if footer}
        <div class="an-sheet__footer">{@render footer()}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .an-sheet {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    z-index: var(--an-z-modal);
    display: flex;
    flex-direction: column;
    max-height: 92vh;
    background: var(--an-surface);
    border-top-left-radius: var(--an-radius-2xl);
    border-top-right-radius: var(--an-radius-2xl);
    box-shadow: var(--an-shadow-xl);
    font-family: var(--an-font-sans);
    color: var(--an-text);
    outline: none;
    /* The drag is ours; the browser must not also scroll the page with it. */
    touch-action: none;
    transition: transform var(--an-duration-medium-4) var(--an-ease-emphasized);
    /* Home-indicator clearance on iOS. */
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  /* Following a finger must be instant — no easing while the pointer is down. */
  .an-sheet[data-dragging] {
    transition: none;
  }

  .an-sheet[data-height='half'] {
    height: 50vh;
  }

  .an-sheet[data-height='full'] {
    height: 92vh;
  }

  .an-sheet__grabber {
    display: grid;
    place-items: center;
    padding: var(--an-space-3) 0 var(--an-space-2);
    cursor: grab;
  }

  .an-sheet__grabber span {
    width: 36px;
    height: 5px;
    border-radius: var(--an-radius-full);
    background: var(--an-border-strong);
    transition: background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-sheet[data-dragging] .an-sheet__grabber span {
    background: var(--an-text-faint);
  }

  .an-sheet__header {
    padding: var(--an-space-2) var(--an-space-5) var(--an-space-3);
  }

  .an-sheet__title {
    margin: 0;
    font-size: var(--an-text-title-3-size);
    line-height: var(--an-text-title-3-line);
    letter-spacing: var(--an-text-title-3-track);
    font-weight: var(--an-weight-semibold);
  }

  .an-sheet__desc {
    margin: var(--an-space-1) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .an-sheet__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 0 var(--an-space-5) var(--an-space-5);
    /* Content scrolls normally; only the sheet chrome owns the drag gesture. */
    touch-action: pan-y;
  }

  .an-sheet__footer {
    padding: var(--an-space-4) var(--an-space-5);
    border-top: 1px solid var(--an-border);
    background: var(--an-surface-raised);
  }

  /* On a wide screen a bottom sheet becomes a centred, floating card. */
  @media (min-width: 768px) {
    .an-sheet {
      inset-inline: 50%;
      translate: -50% 0;
      width: min(560px, calc(100% - var(--an-space-8)));
      bottom: var(--an-space-6);
      border-radius: var(--an-radius-2xl);
    }
  }
</style>
