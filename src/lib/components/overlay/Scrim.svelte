<!--
  Scrim — the dimmed backdrop shared by Dialog and BottomSheet.

  `opacity` is a prop so a dragged sheet can fade it proportionally to the drag
  distance: the backdrop lightening as the sheet is pulled down is what tells
  the user the gesture will dismiss before they let go.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { fade } from 'svelte/transition';
  import { cn } from '../../utils/cn.js';
  import { curve, duration } from '../../motion/tokens.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** 0–1. Defaults to the token opacity. */
    opacity?: number | null;
    onclose?: () => void;
  }

  let { opacity = null, class: className, onclose, ...rest }: Props = $props();
</script>

<div
  data-an="scrim"
  class={cn('an-scrim', className)}
  style={opacity === null ? undefined : `opacity:${opacity}`}
  transition:fade={{ duration: duration.medium2, easing: curve.standard }}
  onclick={onclose}
  aria-hidden="true"
  {...rest}
></div>

<style>
  .an-scrim {
    position: fixed;
    inset: 0;
    background: var(--an-scrim);
    z-index: var(--an-z-overlay);
    /* Tapping the scrim dismisses; it must not scroll the page behind it. */
    touch-action: none;
  }
</style>
