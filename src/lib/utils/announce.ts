/**
 * Screen-reader announcements for changes that have no visible focus move —
 * "12 results", "draft saved", "upload failed".
 *
 * Two long-lived live regions are created once and reused. That matters: a live
 * region added to the DOM *and* filled in the same frame is frequently missed,
 * because assistive tech only watches regions it already knows about. Creating
 * them up front and only mutating their text is what makes announcements
 * reliable.
 *
 * `polite` waits for a pause in speech; `assertive` interrupts, and should be
 * reserved for errors the user must hear immediately.
 */

type Politeness = 'polite' | 'assertive';

const regions = new Map<Politeness, HTMLElement>();

function region(politeness: Politeness): HTMLElement {
  const existing = regions.get(politeness);
  if (existing?.isConnected) return existing;

  const node = document.createElement('div');
  node.setAttribute('aria-live', politeness);
  node.setAttribute('aria-atomic', 'true');
  node.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  node.className = 'an-sr-only';
  node.style.cssText =
    'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';

  document.body.appendChild(node);
  regions.set(politeness, node);
  return node;
}

export function announce(message: string, politeness: Politeness = 'polite'): void {
  if (typeof document === 'undefined' || !message) return;

  const node = region(politeness);
  // Clearing first guarantees a mutation even when the same string repeats,
  // which is otherwise silently ignored.
  node.textContent = '';
  requestAnimationFrame(() => {
    node.textContent = message;
  });
}

/** Drop both regions. Only useful in tests and teardown. */
export function clearAnnouncers(): void {
  for (const node of regions.values()) node.remove();
  regions.clear();
}
