import type { Action } from 'svelte/action';
import { duration, easing } from '../motion/tokens.js';
import { prefersReducedMotion } from '../utils/events.js';

export interface RippleOptions {
  /** Skip the effect entirely (disabled controls, non-interactive rows).
   *  Accepts `null` because Svelte types DOM boolean attributes as `boolean | null`. */
  disabled?: boolean | null;
  /** Ink colour. Defaults to the host's `currentColor`. */
  color?: string;
  /** Peak opacity of the ink. Defaults to `--an-ripple-opacity`. */
  opacity?: number;
  /** Always start from the centre — for small square targets like icon buttons. */
  centered?: boolean;
  /** Let the ink grow past the host's bounds (Material's unbounded ripple). */
  unbounded?: boolean;
}

const LAYER = 'an-ripple-layer';

/**
 * Material's touch ripple.
 *
 * Two behaviours matter and are easy to get wrong:
 *
 *  1. **The ink never disappears mid-grow.** Press-and-hold keeps it at full
 *     opacity; the fade-out is queued until the grow animation has finished, so
 *     a fast tap still plays the whole gesture instead of blinking.
 *  2. **Scrolling is not a tap.** A touch that turns into a scroll cancels the
 *     ripple via `pointercancel`, which the browser fires as soon as it claims
 *     the gesture — so a list row does not flash while the list is flicked.
 *
 * Keyboard activation gets a centred ripple, matching Material's spec for
 * focus-driven interaction.
 */
export const ripple: Action<HTMLElement, RippleOptions | undefined> = (node, options = {}) => {
  let current: RippleOptions = options ?? {};
  let layer: HTMLElement | null = null;

  const ensureLayer = () => {
    if (layer) return layer;

    // The host has to establish a containing block for the absolutely
    // positioned ink; only override a `static` position so callers keep control.
    if (getComputedStyle(node).position === 'static') node.style.position = 'relative';

    layer = document.createElement('span');
    layer.className = LAYER;
    layer.setAttribute('aria-hidden', 'true');
    layer.style.cssText = [
      'position:absolute',
      'inset:0',
      'pointer-events:none',
      'border-radius:inherit',
      current.unbounded ? 'overflow:visible' : 'overflow:hidden',
      'z-index:0'
    ].join(';');
    node.appendChild(layer);
    return layer;
  };

  const spawn = (x: number, y: number) => {
    if (current.disabled) return;

    const host = ensureLayer();
    const rect = node.getBoundingClientRect();
    const originX = current.centered ? rect.width / 2 : x - rect.left;
    const originY = current.centered ? rect.height / 2 : y - rect.top;

    // Radius that reaches the farthest corner, so the ink always fills.
    const radius = Math.hypot(
      Math.max(originX, rect.width - originX),
      Math.max(originY, rect.height - originY)
    );

    const ink = document.createElement('span');
    ink.style.cssText = [
      'position:absolute',
      `left:${originX - radius}px`,
      `top:${originY - radius}px`,
      `width:${radius * 2}px`,
      `height:${radius * 2}px`,
      'border-radius:50%',
      `background:${current.color ?? 'currentColor'}`,
      `opacity:${current.opacity ?? 'var(--an-ripple-opacity, 0.16)'}`,
      'transform:scale(0)',
      'will-change:transform,opacity'
    ].join(';');
    host.appendChild(ink);

    const reduced = prefersReducedMotion();
    const grow = ink.animate(
      [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
      { duration: reduced ? 1 : duration.long1, easing: easing.standardDecelerate, fill: 'forwards' }
    );

    let released = false;
    const fade = () => {
      // Wait for the grow to land — a 40ms tap should still show the full ink.
      grow.finished
        .catch(() => undefined)
        .then(() => {
          const out = ink.animate([{ opacity: getComputedStyle(ink).opacity }, { opacity: 0 }], {
            duration: reduced ? 1 : duration.medium2,
            easing: easing.standard,
            fill: 'forwards'
          });
          out.finished.catch(() => undefined).then(() => ink.remove());
        });
    };

    return () => {
      if (released) return;
      released = true;
      fade();
    };
  };

  let release: (() => void) | undefined;

  const onpointerdown = (event: PointerEvent) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    release?.();
    release = spawn(event.clientX, event.clientY);
  };

  const onrelease = () => {
    release?.();
    release = undefined;
  };

  const onkeydown = (event: KeyboardEvent) => {
    if (event.repeat) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    release?.();
    const rect = node.getBoundingClientRect();
    release = spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  node.addEventListener('pointerdown', onpointerdown);
  node.addEventListener('pointerup', onrelease);
  node.addEventListener('pointerleave', onrelease);
  // Fired when the browser takes the gesture over for scrolling — see note above.
  node.addEventListener('pointercancel', onrelease);
  node.addEventListener('keydown', onkeydown);
  node.addEventListener('keyup', onrelease);
  node.addEventListener('blur', onrelease);

  return {
    update(next) {
      current = next ?? {};
      if (layer) layer.style.overflow = current.unbounded ? 'visible' : 'hidden';
    },
    destroy() {
      node.removeEventListener('pointerdown', onpointerdown);
      node.removeEventListener('pointerup', onrelease);
      node.removeEventListener('pointerleave', onrelease);
      node.removeEventListener('pointercancel', onrelease);
      node.removeEventListener('keydown', onkeydown);
      node.removeEventListener('keyup', onrelease);
      node.removeEventListener('blur', onrelease);
      layer?.remove();
      layer = null;
    }
  };
};
