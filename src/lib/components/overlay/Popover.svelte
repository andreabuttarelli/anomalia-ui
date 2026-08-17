<!--
  Popover — anchored floating surface, the base for Menu and any custom dropdown.

  Positioned `fixed` from a viewport-relative measurement, so it stays correct
  inside transformed or `overflow: hidden` ancestors. It repositions on scroll
  and resize while open, and scales in from the corner nearest the anchor
  (`transform-origin` follows the resolved placement after flipping).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { portal } from '../../actions/portal.js';
  import { clickOutside } from '../../actions/click-outside.js';
  import { rise } from '../../motion/transitions.js';
  import { computePosition, originFor, type Placement } from '../../utils/position.js';
  import { cn } from '../../utils/cn.js';

  interface Props {
    open?: boolean;
    /** The element to anchor to — usually `bind:this` on the trigger. */
    anchor?: HTMLElement | null;
    placement?: Placement;
    offset?: number;
    /** Match the anchor's width — the right default for select-like menus. */
    matchWidth?: boolean;
    class?: string;
    children?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    anchor = null,
    placement = 'bottom-start',
    offset = 8,
    matchWidth = false,
    class: className,
    children,
    onclose
  }: Props = $props();

  let floating = $state<HTMLElement | null>(null);
  let x = $state(0);
  let y = $state(0);
  // Where it actually landed after flipping; falls back to the requested
  // placement until the first measurement runs.
  let flipped = $state<Placement | null>(null);
  const resolved = $derived(flipped ?? placement);
  let width = $state<number | null>(null);

  function reposition() {
    if (!floating || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    if (matchWidth) width = rect.width;

    const result = computePosition(
      rect,
      { width: floating.offsetWidth, height: floating.offsetHeight },
      { placement, offset }
    );
    x = result.x;
    y = result.y;
    flipped = result.placement;
  }

  function close() {
    open = false;
    onclose?.();
  }

  $effect(() => {
    if (!open || !floating || !anchor) return;
    reposition();

    // `capture` so nested scroll containers are covered, not just the window.
    const onscroll = () => reposition();
    window.addEventListener('scroll', onscroll, true);
    window.addEventListener('resize', onscroll);

    const onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onkeydown);

    return () => {
      window.removeEventListener('scroll', onscroll, true);
      window.removeEventListener('resize', onscroll);
      document.removeEventListener('keydown', onkeydown);
    };
  });
</script>

{#if open}
  <div
    bind:this={floating}
    data-an="popover"
    data-placement={resolved}
    class={cn('an-popover', className)}
    style={`left:${x}px; top:${y}px; --an-transform-origin:${originFor(resolved)}${
      width ? `; width:${width}px` : ''
    }`}
    transition:rise={{ y: 6 }}
    use:portal
    use:clickOutside={{ handler: close, ignore: [anchor] }}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  .an-popover {
    position: fixed;
    z-index: var(--an-z-popover);
    min-width: 180px;
    max-width: min(92vw, 420px);
    padding: var(--an-space-1);
    background: var(--an-surface);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    box-shadow: var(--an-shadow-lg);
    font-family: var(--an-font-sans);
    color: var(--an-text);
    transform-origin: var(--an-transform-origin, top left);
  }
</style>
