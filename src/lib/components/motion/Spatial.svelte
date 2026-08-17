<!--
  Spatial — a navigable 3D stage for floating content.

  CSS 3D rather than WebGL: the system has zero runtime dependencies, and for a
  dozen floating cards a `perspective` + `preserve-3d` tree is both lighter and
  sharper than a canvas (real text, real DOM, real accessibility) — the moment
  you need thousands of objects, lighting or occlusion, this is the wrong tool
  and a renderer is the right one.

  What makes it feel physical rather than scripted:

    • **Direct manipulation.** While a pointer is down the stage tracks it 1:1,
      with transitions off. Easing during a drag is the single thing that makes
      3D on the web feel like a video of 3D.
    • **Inertia on release.** Velocity carries and decays; a flick keeps
      turning. Without it every gesture ends in a dead stop, which reads as the
      page catching you.
    • **Rubber-banded tilt.** Vertical rotation is clamped, so the stage can
      never end up upside down and the user can never get lost in it.

  Input coverage: drag (mouse, pen, one finger), pinch (two fingers), zoom on
  ctrl/⌘+wheel, arrow keys to rotate, `+`/`-` to zoom, `0` to reset. Plain wheel
  is deliberately left alone so the page still scrolls — hijacking the scroll
  wheel over a large element is hostile, and a trackpad pinch already arrives as
  ctrl+wheel, so the natural gesture works anyway.

  Under `prefers-reduced-motion` the idle float stops and inertia is skipped;
  the stage stays fully navigable, because direct manipulation is the user's own
  motion, not ours.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils/cn.js';
  import { prefersReducedMotion } from '../../utils/events.js';
  import { haptic } from '../../utils/haptics.js';

  interface Props {
    /**
     * Camera distance. High is a long lens — the scene reads as a flat collage
     * until it is moved, which is usually what you want; low is dramatic and
     * makes even a still scene look like a 3D demo.
     */
    perspective?: number;
    /** Clamp for vertical rotation, in degrees. */
    maxTilt?: number;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    /** Starting rotation, in degrees. */
    rotateX?: number;
    rotateY?: number;
    /** Slow idle drift, so the scene is alive before it is touched. */
    autoRotate?: boolean;
    /** Visible affordance for the gesture. */
    hint?: string | null;
    height?: string;
    class?: string;
    label?: string;
    children?: Snippet;
  }

  let {
    perspective = 1400,
    maxTilt = 22,
    zoom = $bindable(1),
    minZoom = 0.6,
    maxZoom = 2.2,
    rotateX = $bindable(-3),
    rotateY = $bindable(-6),
    autoRotate = true,
    hint = 'Drag · pinch to zoom',
    height = '460px',
    class: className,
    label = 'Interactive 3D scene',
    children
  }: Props = $props();

  let stage = $state<HTMLElement | null>(null);
  let dragging = $state(false);
  let touched = $state(false);

  /** Live pointers, so one finger rotates and two pinch. */
  const pointers = new Map<number, { x: number; y: number }>();
  let pinchStart = 0;
  let zoomStart = 1;
  let velocity = { x: 0, y: 0 };
  let inertia = 0;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  function apply(dx: number, dy: number) {
    rotateY += dx * 0.4;
    // Vertical is clamped: an upside-down stage is disorientation, not freedom.
    rotateX = clamp(rotateX - dy * 0.3, -maxTilt, maxTilt);
  }

  function stopInertia() {
    cancelAnimationFrame(inertia);
    inertia = 0;
  }

  function runInertia() {
    if (prefersReducedMotion()) return;

    const step = () => {
      velocity.x *= 0.94;
      velocity.y *= 0.94;
      apply(velocity.x, velocity.y);

      // Below half a pixel per frame the movement is invisible; stopping there
      // frees the main thread instead of animating nothing.
      if (Math.hypot(velocity.x, velocity.y) > 0.5) inertia = requestAnimationFrame(step);
      else inertia = 0;
    };

    inertia = requestAnimationFrame(step);
  }

  function onpointerdown(event: PointerEvent) {
    stopInertia();
    touched = true;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      zoomStart = zoom;
      haptic('selection');
    } else {
      dragging = true;
    }
  }

  function onpointermove(event: PointerEvent) {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;

    const next = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, next);

    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchStart > 0) zoom = clamp((distance / pinchStart) * zoomStart, minZoom, maxZoom);
      return;
    }

    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    velocity = { x: dx, y: dy };
    apply(dx, dy);
  }

  function onpointerup(event: PointerEvent) {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);

    pointers.delete(event.pointerId);
    if (pointers.size === 0) {
      dragging = false;
      pinchStart = 0;
      runInertia();
    }
  }

  function onwheel(event: WheelEvent) {
    // Only claim the wheel when it is a zoom gesture. A trackpad pinch arrives
    // as ctrl+wheel, so the natural gesture works and plain scrolling still
    // scrolls the page underneath.
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    zoom = clamp(zoom * (1 - event.deltaY * 0.002), minZoom, maxZoom);
    touched = true;
  }

  function onkeydown(event: KeyboardEvent) {
    const step = event.shiftKey ? 12 : 5;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => apply(-step * 4, 0),
      ArrowRight: () => apply(step * 4, 0),
      ArrowUp: () => apply(0, -step * 2),
      ArrowDown: () => apply(0, step * 2),
      '+': () => (zoom = clamp(zoom * 1.12, minZoom, maxZoom)),
      '=': () => (zoom = clamp(zoom * 1.12, minZoom, maxZoom)),
      '-': () => (zoom = clamp(zoom / 1.12, minZoom, maxZoom)),
      '0': reset
    };

    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    stopInertia();
    touched = true;
    move();
  }

  export function reset() {
    stopInertia();
    rotateX = -3;
    rotateY = -6;
    zoom = 1;
  }

  $effect(() => () => stopInertia());
</script>

<!--
  The stage is a composite widget that consumes the arrow keys, which is exactly
  what `role="application"` is for — and why it must be focusable. The checker's
  rules assume a div with a tabindex is a mislabelled button; here the role is
  deliberate, the keyboard map is implemented, and the instructions are exposed
  to assistive tech below.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  bind:this={stage}
  data-an="spatial"
  data-dragging={dragging ? '' : undefined}
  data-touched={touched ? '' : undefined}
  data-auto={autoRotate ? '' : undefined}
  class={cn('an-spatial', className)}
  style={`--an-spatial-perspective:${perspective}px; --an-spatial-x:${rotateX}deg; --an-spatial-y:${rotateY}deg; --an-spatial-zoom:${zoom}; --an-spatial-height:${height}`}
  role="application"
  aria-label={label}
  aria-roledescription="3D scene"
  tabindex="0"
  {onpointerdown}
  {onpointermove}
  {onpointerup}
  onpointercancel={onpointerup}
  {onwheel}
  {onkeydown}
  ondblclick={reset}
>
  <div class="an-spatial__world">
    {@render children?.()}
  </div>

  {#if hint}
    <p class="an-spatial__hint" aria-hidden="true">{hint}</p>
  {/if}

  <span class="an-sr-only">
    Use the arrow keys to rotate, plus and minus to zoom, and 0 to reset the view.
  </span>
</div>

<style>
  .an-spatial {
    position: relative;
    height: var(--an-spatial-height, 460px);
    perspective: var(--an-spatial-perspective, 1000px);
    perspective-origin: 50% 50%;
    /* The stage owns its gestures. It is a bounded box on purpose, so the page
       around it stays scrollable on a phone. */
    touch-action: none;
    cursor: grab;
    overflow: hidden;
    border-radius: var(--an-radius-lg);
    outline: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .an-spatial:focus-visible {
    outline: var(--an-focus-ring-width) solid var(--an-ring);
    outline-offset: var(--an-focus-ring-offset);
  }

  .an-spatial[data-dragging] {
    cursor: grabbing;
  }

  .an-spatial__world {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
    transform: scale(var(--an-spatial-zoom, 1)) rotateX(var(--an-spatial-x, 0))
      rotateY(var(--an-spatial-y, 0));
    /* Eased when the view is changed programmatically (reset, keyboard), off
       while a pointer is down so the stage tracks the finger exactly. */
    transition: transform var(--an-duration-medium-2) var(--an-ease-emphasized);
  }

  .an-spatial[data-dragging] .an-spatial__world {
    transition: none;
  }

  /* Idle drift, until the user takes over — then it never fights them again. */
  .an-spatial[data-auto]:not([data-touched]) .an-spatial__world {
    animation: an-spatial-drift 24s var(--an-ease-standard) infinite alternate;
  }

  @keyframes an-spatial-drift {
    from {
      transform: scale(var(--an-spatial-zoom, 1)) rotateX(var(--an-spatial-x, 0))
        rotateY(calc(var(--an-spatial-y, 0deg) - 4deg));
    }
    to {
      transform: scale(var(--an-spatial-zoom, 1)) rotateX(var(--an-spatial-x, 0))
        rotateY(calc(var(--an-spatial-y, 0deg) + 4deg));
    }
  }

  /* The affordance is a caption, not a control: no pill, no border, no glass —
     it sits in the corner like a plate number and disappears once used. */
  .an-spatial__hint {
    position: absolute;
    right: var(--an-space-4);
    bottom: var(--an-space-3);
    margin: 0;
    color: var(--an-text-faint);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    letter-spacing: 0;
    pointer-events: none;
    transition: opacity var(--an-duration-medium-2) var(--an-ease-standard);
  }

  /* The hint has done its job once the scene has been touched. */
  .an-spatial[data-touched] .an-spatial__hint {
    opacity: 0;
  }

  .an-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .an-spatial[data-auto]:not([data-touched]) .an-spatial__world {
      animation: none;
    }
  }
</style>
