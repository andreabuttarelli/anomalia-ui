/**
 * Run a component's own handler first, then the consumer's, unless the
 * component's handler already called `preventDefault()`.
 *
 * Lets a component keep behaviour it owns (closing a menu, toggling state)
 * while still forwarding `onclick` from props, without the two fighting.
 */
export function chain<E extends Event>(
  ...handlers: (((event: E) => void) | undefined | null)[]
): (event: E) => void {
  return (event: E) => {
    for (const handler of handlers) {
      if (!handler) continue;
      handler(event);
      if (event.defaultPrevented) return;
    }
  };
}

/** True when the event came from a finger/pen rather than a mouse. */
export function isTouchLike(event: PointerEvent): boolean {
  return event.pointerType === 'touch' || event.pointerType === 'pen';
}

/** `matchMedia` that is safe to call during SSR. */
export function matches(query: string): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(query).matches;
}

/** Honour the OS "reduce motion" setting everywhere motion is authored in JS. */
export function prefersReducedMotion(): boolean {
  return matches('(prefers-reduced-motion: reduce)');
}

/** True on devices whose primary input cannot hover (phones, tablets). */
export function isTouchPrimary(): boolean {
  return matches('(hover: none) and (pointer: coarse)');
}
