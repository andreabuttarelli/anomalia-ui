import type { Action } from 'svelte/action';

export interface ClickOutsideOptions {
  enabled?: boolean;
  /** Elements that should not count as "outside" — typically the trigger. */
  ignore?: (HTMLElement | null | undefined)[];
  handler: (event: PointerEvent) => void;
}

/**
 * Dismiss-on-outside-press.
 *
 * Listens on `pointerdown` in the capture phase: the menu closes the moment the
 * finger lands, before the click resolves, which is what makes "tap elsewhere
 * to dismiss" feel instant rather than lagging a frame behind the tap.
 */
export const clickOutside: Action<HTMLElement, ClickOutsideOptions> = (node, options) => {
  let current = options;

  const onpointerdown = (event: PointerEvent) => {
    if (current.enabled === false) return;

    const target = event.target as Node | null;
    if (!target || !target.isConnected) return;
    if (node.contains(target)) return;
    if (current.ignore?.some((el) => el?.contains(target))) return;

    current.handler(event);
  };

  document.addEventListener('pointerdown', onpointerdown, true);

  return {
    update(next) {
      current = next;
    },
    destroy() {
      document.removeEventListener('pointerdown', onpointerdown, true);
    }
  };
};
