import type { Action } from 'svelte/action';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(',');

export interface FocusTrapOptions {
  enabled?: boolean;
  /** Focus the first candidate on mount. Set false when the caller focuses itself. */
  autoFocus?: boolean;
  /** Return focus to whatever was focused before the trap opened. */
  restoreFocus?: boolean;
}

/**
 * Keep Tab inside an overlay while it is open, and hand focus back to the
 * trigger when it closes.
 *
 * The focusable list is recomputed on every Tab rather than cached, because
 * dialog content routinely changes while open (a form revealing a field, a
 * list loading). A stale cache is how traps end up leaking focus to the page.
 */
export const focusTrap: Action<HTMLElement, FocusTrapOptions | undefined> = (node, options = {}) => {
  let current: FocusTrapOptions = options ?? {};
  /* Captured when the trap arms, not at mount: for a component that only
     becomes an overlay later, whatever had focus at page load is not the thing
     to hand focus back to when it closes. */
  let previous: HTMLElement | null = null;

  /* `enabled: false` has to mean the action does nothing at all — not "traps Tab
     but still grabs focus on mount". Svelte actions cannot be applied
     conditionally, so a component that is sometimes an overlay (a sidebar that
     becomes a drawer on a phone) always mounts the trap and toggles this flag;
     without the guard, that component silently focuses its first link on every
     page load. `armed` also gates the restore, so an action that never engaged
     cannot move focus when it unmounts. */
  let armed = current.enabled !== false;

  const candidates = () =>
    Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );

  const onkeydown = (event: KeyboardEvent) => {
    if (current.enabled === false || event.key !== 'Tab') return;

    const items = candidates();
    if (items.length === 0) {
      event.preventDefault();
      node.focus();
      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === node)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function takeFocus() {
    // A frame's grace so transitions/portals have placed the node first.
    requestAnimationFrame(() => {
      const items = candidates();
      (items[0] ?? node).focus({ preventScroll: true });
    });
  }

  if (armed) {
    previous = document.activeElement as HTMLElement | null;
    if (current.autoFocus !== false) takeFocus();
  }

  node.addEventListener('keydown', onkeydown);

  return {
    update(next) {
      const wasArmed = armed;
      current = next ?? {};
      armed = current.enabled !== false;

      // Enabled after the fact — a drawer opening. This is the moment to take
      // focus, not mount time.
      if (!wasArmed && armed) {
        previous = document.activeElement as HTMLElement | null;
        if (current.autoFocus !== false) takeFocus();
      }
    },
    destroy() {
      node.removeEventListener('keydown', onkeydown);
      if (armed && current.restoreFocus !== false) previous?.focus({ preventScroll: true });
    }
  };
};
