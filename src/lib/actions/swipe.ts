import type { Action } from 'svelte/action';

export interface SwipeState {
  /** Signed distance from the press origin, in px, along the tracked axis. */
  delta: number;
  /** px/ms at release — the input for a "did they flick it?" decision. */
  velocity: number;
  event: PointerEvent;
}

export interface SwipeOptions {
  disabled?: boolean | null;
  axis?: 'x' | 'y';
  /** Movement (px) before the gesture is claimed as a swipe rather than a tap. */
  threshold?: number;
  /** Ignore drags that start on scrollable content already scrolled away from its start edge. */
  guardScroll?: boolean;
  onstart?: (state: SwipeState) => void;
  onmove?: (state: SwipeState) => void;
  onend?: (state: SwipeState) => void;
}

/**
 * One-axis drag tracking for touch-first components: bottom sheets that follow
 * the finger, snackbars that swipe away, carousels that page.
 *
 * Direction is decided once, on the first few pixels: if the finger moves more
 * across the tracked axis than along it, the gesture is handed back to the
 * browser so the page keeps scrolling normally. That single rule is what keeps
 * a draggable sheet from fighting the scroll container inside it.
 */
export const swipe: Action<HTMLElement, SwipeOptions | undefined> = (node, options = {}) => {
  let current: SwipeOptions = options ?? {};
  let pointerId: number | null = null;
  let start: { x: number; y: number; time: number } | null = null;
  let claimed = false;
  let last: { value: number; time: number } | null = null;

  const axis = () => current.axis ?? 'y';
  const along = (event: PointerEvent) => (axis() === 'y' ? event.clientY : event.clientX);
  const across = (event: PointerEvent) => (axis() === 'y' ? event.clientX : event.clientY);

  const onpointerdown = (event: PointerEvent) => {
    if (current.disabled || pointerId !== null) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    // A drag that begins on already-scrolled content belongs to that scroller.
    if (current.guardScroll !== false) {
      const scroller = (event.target as HTMLElement | null)?.closest('[data-an-scroll]');
      if (scroller && scroller.scrollTop > 0) return;
    }

    pointerId = event.pointerId;
    start = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    last = null;
    claimed = false;
  };

  const onpointermove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId || !start) return;

    const delta = along(event) - (axis() === 'y' ? start.y : start.x);
    const drift = across(event) - (axis() === 'y' ? start.x : start.y);

    if (!claimed) {
      if (Math.abs(delta) < (current.threshold ?? 6)) return;
      // Mostly-sideways movement is not our gesture: let the browser have it.
      if (Math.abs(drift) > Math.abs(delta)) {
        pointerId = null;
        start = null;
        return;
      }
      claimed = true;
      node.setPointerCapture(event.pointerId);
      current.onstart?.({ delta, velocity: 0, event });
    }

    const velocity = last
      ? (delta - last.value) / Math.max(1, event.timeStamp - last.time)
      : delta / Math.max(1, event.timeStamp - start.time);
    last = { value: delta, time: event.timeStamp };

    current.onmove?.({ delta, velocity, event });
  };

  const finish = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) return;
    const wasClaimed = claimed;
    const delta = start ? along(event) - (axis() === 'y' ? start.y : start.x) : 0;
    const velocity = last && start
      ? last.value / Math.max(1, event.timeStamp - start.time)
      : 0;

    if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
    pointerId = null;
    start = null;
    last = null;
    claimed = false;

    if (wasClaimed) current.onend?.({ delta, velocity, event });
  };

  node.addEventListener('pointerdown', onpointerdown);
  node.addEventListener('pointermove', onpointermove);
  node.addEventListener('pointerup', finish);
  node.addEventListener('pointercancel', finish);

  return {
    update(next) {
      current = next ?? {};
    },
    destroy() {
      node.removeEventListener('pointerdown', onpointerdown);
      node.removeEventListener('pointermove', onpointermove);
      node.removeEventListener('pointerup', finish);
      node.removeEventListener('pointercancel', finish);
    }
  };
};
