<!--
  Tooltip — hover/focus label for pointer devices.

  It renders nothing on touch: there is no hover on a phone, so a tooltip there
  either never appears or hijacks the tap. Put the same information in a label
  or a hint for those users — never only in a tooltip.

  Opening is delayed (600ms) and closing is not, which stops a row of icon
  buttons from firing tooltips as the cursor sweeps across them.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { portal } from '../../actions/portal.js';
  import { fadeThrough } from '../../motion/transitions.js';
  import { computePosition, type Placement } from '../../utils/position.js';
  import { isTouchPrimary } from '../../utils/events.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';

  interface Props {
    content: string;
    placement?: Placement;
    delay?: number;
    disabled?: boolean;
    class?: string;
    children: Snippet;
  }

  let {
    content,
    placement = 'top',
    delay = 600,
    disabled = false,
    class: className,
    children
  }: Props = $props();

  const id = uid('tooltip');

  let wrapper = $state<HTMLElement | null>(null);
  let bubble = $state<HTMLElement | null>(null);
  let open = $state(false);
  let x = $state(0);
  let y = $state(0);
  let timer: ReturnType<typeof setTimeout> | undefined;

  function show() {
    if (disabled || isTouchPrimary()) return;
    clearTimeout(timer);
    timer = setTimeout(() => (open = true), delay);
  }

  function hide() {
    clearTimeout(timer);
    open = false;
  }

  $effect(() => {
    if (!open || !bubble || !wrapper) return;
    const result = computePosition(
      wrapper.getBoundingClientRect(),
      { width: bubble.offsetWidth, height: bubble.offsetHeight },
      { placement, offset: 6 }
    );
    x = result.x;
    y = result.y;
  });

  $effect(() => () => clearTimeout(timer));
</script>

<span
  bind:this={wrapper}
  class={cn('an-tooltip-anchor', className)}
  role="presentation"
  aria-describedby={open ? id : undefined}
  onpointerenter={show}
  onpointerleave={hide}
  onfocusin={show}
  onfocusout={hide}
>
  {@render children()}
</span>

{#if open}
  <div
    data-an="tooltip"
    {id}
    class="an-tooltip"
    role="tooltip"
    style={`left:${x}px; top:${y}px`}
    transition:fadeThrough={{ duration: 120 }}
    use:portal
  >
    {content}
  </div>
{/if}

<style>
  .an-tooltip-anchor {
    display: inline-flex;
  }

  .an-tooltip {
    position: fixed;
    z-index: var(--an-z-tooltip);
    max-width: 260px;
    padding: var(--an-space-1) var(--an-space-2);
    border-radius: var(--an-radius-xs);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-caption-size);
    line-height: 1.4;
    pointer-events: none;
    box-shadow: var(--an-shadow-md);
  }
</style>
