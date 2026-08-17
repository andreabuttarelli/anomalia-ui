let locks = 0;
let restore: (() => void) | null = null;

/**
 * Freeze the page behind an overlay.
 *
 * Reference-counted, because overlays stack: a sheet opening a dialog must not
 * unlock the page when the dialog on top of it closes.
 *
 * iOS Safari ignores `overflow: hidden` on the body, so the page is pinned with
 * `position: fixed` at its current offset and restored on the last release —
 * which also stops the background from jumping to the top on close.
 */
export function lockScroll(): () => void {
  if (typeof document === 'undefined') return () => undefined;

  locks += 1;
  if (locks === 1) {
    const { body, documentElement } = document;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight
    };

    // Swapping the scrollbar for nothing would shift the layout; pad it back.
    const gap = window.innerWidth - documentElement.clientWidth;
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    body.style.position = 'fixed';
    body.style.top = `${-scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    restore = () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
      restore?.();
      restore = null;
    }
  };
}
