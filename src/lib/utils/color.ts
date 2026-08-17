/**
 * Colour maths for contrast checking.
 *
 * Public API, not just docs tooling: a consumer overriding `--an-accent` needs a
 * way to answer "does my brand colour still pass on this surface?", and the
 * answer should come from the same implementation the library audits itself with.
 *
 * WCAG 2.x relative luminance and contrast ratio. Alpha is composited over a
 * supplied backdrop, because a translucent colour has no contrast ratio on its
 * own — only over something.
 */

export interface Rgba {
  r: number;
  g: number;
  b: number;
  /** 0–1. */
  a: number;
}

const NAMED: Record<string, Rgba> = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 }
};

/**
 * Parse a CSS colour string: hex (3/4/6/8 digits), `rgb()`/`rgba()`, the three
 * names the library actually uses, and `color-mix(in srgb, A p%, B)`.
 *
 * `color-mix` is included because the theme uses it for every translucent token
 * (`--an-accent-soft` in dark mode, the scrim, the glass surfaces), and those
 * are exactly the values a contrast audit must not skip.
 */
export function parseColor(input: string): Rgba | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;
  if (value in NAMED) return { ...NAMED[value] };

  if (value.startsWith('#')) return parseHex(value);
  if (value.startsWith('rgb')) return parseRgb(value);
  if (value.startsWith('color-mix')) return parseColorMix(value);

  return null;
}

function parseHex(value: string): Rgba | null {
  const hex = value.slice(1);
  const expand = (char: string) => parseInt(char + char, 16);

  if (hex.length === 3 || hex.length === 4) {
    return {
      r: expand(hex[0]),
      g: expand(hex[1]),
      b: expand(hex[2]),
      a: hex.length === 4 ? expand(hex[3]) / 255 : 1
    };
  }

  if (hex.length === 6 || hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1
    };
  }

  return null;
}

function parseRgb(value: string): Rgba | null {
  const parts = value
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);

  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

/** `color-mix(in srgb, <colour> <pct>%, <colour>)` — the one form the theme uses. */
function parseColorMix(value: string): Rgba | null {
  const inner = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')'));
  const parts = splitTopLevel(inner);
  if (parts.length < 3) return null;
  if (!parts[0].replace(/\s+/g, ' ').trim().startsWith('in srgb')) return null;

  const first = readStop(parts[1]);
  const second = readStop(parts[2]);
  if (!first || !second) return null;

  // Percentages are optional and complementary; normalise whatever is given.
  const p1 = first.percent ?? (second.percent !== undefined ? 100 - second.percent : 50);
  const weight = Math.min(100, Math.max(0, p1)) / 100;

  return mix(first.color, second.color, weight);
}

function readStop(part: string): { color: Rgba; percent?: number } | null {
  const trimmed = part.trim();
  const match = trimmed.match(/^(.*?)(?:\s+([\d.]+)%)?$/);
  if (!match) return null;

  const color = parseColor(match[1]);
  if (!color) return null;
  return { color, percent: match[2] === undefined ? undefined : Number(match[2]) };
}

/** Split on commas that are not inside parentheses. */
function splitTopLevel(input: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of input) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      out.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) out.push(current);
  return out;
}

/** Weighted sRGB mix, `weight` being the share of `a`. Premultiplies alpha. */
export function mix(a: Rgba, b: Rgba, weight: number): Rgba {
  const alpha = a.a * weight + b.a * (1 - weight);
  if (alpha === 0) return { r: 0, g: 0, b: 0, a: 0 };

  // Mixing must happen in premultiplied space, otherwise a fully transparent
  // stop drags the result toward its (meaningless) RGB values.
  const channel = (ca: number, cb: number) =>
    (ca * a.a * weight + cb * b.a * (1 - weight)) / alpha;

  return {
    r: channel(a.r, b.r),
    g: channel(a.g, b.g),
    b: channel(a.b, b.b),
    a: alpha
  };
}

/** Composite a possibly-translucent foreground over an opaque backdrop. */
export function flatten(color: Rgba, backdrop: Rgba): Rgba {
  if (color.a >= 1) return { ...color, a: 1 };
  return {
    r: color.r * color.a + backdrop.r * (1 - color.a),
    g: color.g * color.a + backdrop.g * (1 - color.a),
    b: color.b * color.a + backdrop.b * (1 - color.a),
    a: 1
  };
}

/** WCAG 2.x relative luminance. */
export function relativeLuminance({ r, g, b }: Rgba): number {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/**
 * Contrast ratio between two colours, 1–21.
 *
 * Both are flattened over `backdrop` first (default white), so translucent
 * tokens are measured as they actually appear rather than as their raw values.
 */
export function contrastRatio(
  foreground: string | Rgba,
  background: string | Rgba,
  backdrop: string | Rgba = '#ffffff'
): number {
  const bg = resolve(background, resolve(backdrop, { r: 255, g: 255, b: 255, a: 1 }));
  const fg = resolve(foreground, bg);
  if (!fg || !bg) return 0;

  const flatBg = flatten(bg, resolve(backdrop, { r: 255, g: 255, b: 255, a: 1 }));
  const flatFg = flatten(fg, flatBg);

  const l1 = relativeLuminance(flatFg);
  const l2 = relativeLuminance(flatBg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

function resolve(value: string | Rgba, fallback: Rgba): Rgba {
  if (typeof value !== 'string') return value;
  return parseColor(value) ?? fallback;
}

export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

/**
 * WCAG grade for a ratio.
 *
 * `nonText` applies SC 1.4.11 (UI components and graphics): 3:1, no AAA tier.
 * `large` is SC 1.4.3's 18.66px+ bold / 24px+ threshold.
 */
export function contrastLevel(
  ratio: number,
  { large = false, nonText = false }: { large?: boolean; nonText?: boolean } = {}
): ContrastLevel {
  if (nonText) return ratio >= 3 ? 'AA' : 'fail';
  if (large) {
    if (ratio >= 4.5) return 'AAA';
    return ratio >= 3 ? 'AA' : 'fail';
  }
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return ratio >= 3 ? 'AA-large' : 'fail';
}

/**
 * Read a CSS custom property and get back a real colour.
 *
 * `getComputedStyle().getPropertyValue()` hands back the *specified* value, so
 * `color-mix(…)` and `var(…)` chains come out unresolved. Painting the token
 * onto a probe element's `color` makes the browser do the resolution for us,
 * which is the only way to be sure the audit measures what ships.
 *
 * Browser only; returns `null` during SSR.
 */
export function readTokenColor(token: string, element?: HTMLElement): string | null {
  if (typeof document === 'undefined') return null;

  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;width:0;height:0;opacity:0;pointer-events:none';
  probe.style.color = `var(${token})`;
  (element ?? document.body).appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved || null;
}
