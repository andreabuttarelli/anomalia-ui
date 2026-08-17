let counter = 0;

/**
 * Stable-per-instance id for `aria-*` wiring (label ↔ input, trigger ↔ panel).
 *
 * Call it once during component init and keep the result — calling it inside a
 * reactive expression would hand out a new id on every re-run and break the
 * association it exists to create.
 *
 * Svelte 5.20 ships a built-in `$props.id()`; this keeps the peer range wide
 * and behaves identically for our purposes (SSR emits the same sequence the
 * client hydrates with, because both start from a fresh module instance).
 */
export function uid(prefix = 'an'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
