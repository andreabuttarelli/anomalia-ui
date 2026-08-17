import type { Action } from 'svelte/action';
import { haptic, type HapticPattern } from '../utils/haptics.js';
import { isTouchLike } from '../utils/events.js';

export interface PressOptions {
  disabled?: boolean | null;
  /** How far the control squishes. Defaults to `--an-press-scale` (0.97). */
  scale?: number;
  /** Vibration on touch press. `false` disables it. */
  haptics?: HapticPattern | false;
  /** Pixels of movement tolerated before the press is treated as a scroll. */
  slop?: number;
}

/**
 * Apple-style press feedback: the control gives slightly under the finger and
 * springs back, with an optional haptic tick on touch.
 *
 * The interesting part is the cancel logic. On a phone, a press that turns into
 * a scroll must not read as a press — so we release as soon as the pointer
 * moves past `slop`, and again on `pointercancel`. Without that, every flick
 * through a list leaves squished rows in its wake.
 *
 * State is exposed as `data-pressed` so components can style additional press
 * affordances (state layer, elevation) in CSS instead of duplicating the logic.
 */
export const press: Action<HTMLElement, PressOptions | undefined> = (node, options = {}) => {
  let current: PressOptions = options ?? {};
  let origin: { x: number; y: number } | null = null;

  const apply = () => {
    node.dataset.pressed = '';
    node.style.setProperty('--an-press-scale-active', String(current.scale ?? ''));
  };

  const release = () => {
    origin = null;
    delete node.dataset.pressed;
  };

  const onpointerdown = (event: PointerEvent) => {
    if (current.disabled) return;
    if (event.button !== 0 && event.pointerType === 'mouse') return;

    origin = { x: event.clientX, y: event.clientY };
    apply();

    if (isTouchLike(event) && current.haptics !== false) haptic(current.haptics ?? 'selection');
  };

  const onpointermove = (event: PointerEvent) => {
    if (!origin) return;
    const slop = current.slop ?? 10;
    if (Math.abs(event.clientX - origin.x) > slop || Math.abs(event.clientY - origin.y) > slop) {
      release();
    }
  };

  const onkeydown = (event: KeyboardEvent) => {
    if (current.disabled || event.repeat) return;
    if (event.key === 'Enter' || event.key === ' ') apply();
  };

  node.addEventListener('pointerdown', onpointerdown);
  node.addEventListener('pointermove', onpointermove);
  node.addEventListener('pointerup', release);
  node.addEventListener('pointerleave', release);
  node.addEventListener('pointercancel', release);
  node.addEventListener('keydown', onkeydown);
  node.addEventListener('keyup', release);
  node.addEventListener('blur', release);

  return {
    update(next) {
      current = next ?? {};
      if (current.disabled) release();
    },
    destroy() {
      node.removeEventListener('pointerdown', onpointerdown);
      node.removeEventListener('pointermove', onpointermove);
      node.removeEventListener('pointerup', release);
      node.removeEventListener('pointerleave', release);
      node.removeEventListener('pointercancel', release);
      node.removeEventListener('keydown', onkeydown);
      node.removeEventListener('keyup', release);
      node.removeEventListener('blur', release);
    }
  };
};
