export type HapticPattern = 'selection' | 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  selection: 8,
  light: 10,
  medium: 18,
  heavy: 28,
  success: [12, 60, 20],
  warning: [18, 80, 18],
  error: [24, 60, 24, 60, 24]
};

let enabled = true;

/**
 * Turn haptics off app-wide (a settings toggle, a kiosk build, tests).
 * Components call `haptic()` unconditionally and let this gate decide.
 */
export function setHapticsEnabled(value: boolean): void {
  enabled = value;
}

/**
 * Fire a short vibration to accompany a committed touch interaction —
 * a switch flipping, a sheet snapping, a swipe dismissing.
 *
 * No-ops where the Vibration API is missing (notably iOS Safari) and when the
 * user asked for reduced motion, so callers never need to feature-detect.
 * Never use it for passive feedback: haptics are for state the user changed.
 */
export function haptic(pattern: HapticPattern = 'selection'): void {
  if (!enabled) return;
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // Some browsers throw when the document has never been interacted with.
  }
}
