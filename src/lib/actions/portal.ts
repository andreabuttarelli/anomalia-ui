import type { Action } from 'svelte/action';

/**
 * Move an element to another container (default `document.body`) so overlays
 * escape `overflow: hidden`, `transform` and stacking contexts of their parent.
 *
 * The node is re-parented on mount, which means it is rendered where it was
 * declared during SSR — fine for dialogs, which never render open on the server.
 */
export const portal: Action<HTMLElement, HTMLElement | string | undefined> = (node, target) => {
  let host: Element | null = null;

  const resolve = (value: HTMLElement | string | undefined): Element | null => {
    if (typeof value === 'string') return document.querySelector(value);
    return value ?? document.body;
  };

  const mount = (value: HTMLElement | string | undefined) => {
    host = resolve(value);
    host?.appendChild(node);
  };

  mount(target);

  return {
    update(next) {
      const resolved = resolve(next);
      if (resolved && resolved !== host) {
        host = resolved;
        host.appendChild(node);
      }
    },
    destroy() {
      node.remove();
    }
  };
};
