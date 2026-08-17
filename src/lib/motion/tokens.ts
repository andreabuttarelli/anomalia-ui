/**
 * The CSS motion tokens, mirrored for JS-driven animation (Svelte transitions,
 * the Web Animations API in actions). Same numbers as `tokens.css` — change
 * one, change both.
 */

/** Material 3 duration scale, in milliseconds. */
export const duration = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600
} as const;

/** Material 3 easing set, as CSS `cubic-bezier()` strings. */
export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  spring: 'cubic-bezier(0.3, 1.4, 0.5, 1)'
} as const;

/** The same curves as Svelte easing functions, for `transition:` directives. */
export const curve = {
  standard: bezier(0.2, 0, 0, 1),
  standardAccelerate: bezier(0.3, 0, 1, 1),
  standardDecelerate: bezier(0, 0, 0, 1),
  emphasized: bezier(0.2, 0, 0, 1),
  emphasizedAccelerate: bezier(0.3, 0, 0.8, 0.15),
  emphasizedDecelerate: bezier(0.05, 0.7, 0.1, 1),
  spring: bezier(0.3, 1.4, 0.5, 1)
} as const;

/**
 * Cubic-bezier solver (Newton-Raphson, then bisection as a fallback) so the
 * JS curves are the exact ones the CSS uses instead of an approximation.
 */
export function bezier(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  const a = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const b = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const c = (a1: number) => 3 * a1;

  const calc = (t: number, a1: number, a2: number) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
  const slope = (t: number, a1: number, a2: number) =>
    3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);

  return (t: number) => {
    if (x1 === y1 && x2 === y2) return t; // linear
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    let guess = t;
    for (let i = 0; i < 8; i += 1) {
      const currentSlope = slope(guess, x1, x2);
      if (currentSlope === 0) break;
      guess -= (calc(guess, x1, x2) - t) / currentSlope;
    }

    let low = 0;
    let high = 1;
    if (guess < low || guess > high) {
      guess = 0.5;
      for (let i = 0; i < 20; i += 1) {
        const value = calc(guess, x1, x2);
        if (value > t) high = guess;
        else low = guess;
        guess = (low + high) / 2;
      }
    }

    return calc(guess, y1, y2);
  };
}
