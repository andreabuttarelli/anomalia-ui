import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/lib/styles');

/**
 * Read the declarations out of the first block matching `selector`.
 *
 * A regex-light CSS reader rather than a parser dependency: the two files it
 * reads are ours, their shape is stable, and both the contrast audit and the
 * skill reference generator need exactly this much.
 */
export function readBlock(css, selector) {
  const start = css.indexOf(selector);
  if (start === -1) return {};

  const open = css.indexOf('{', start);
  let depth = 0;
  let end = open;

  for (let i = open; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1;
    if (css[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  const body = css.slice(open + 1, end);
  const declarations = {};

  // Strip comments first, so a commented-out token never enters the palette.
  for (const line of body.replace(/\/\*[\s\S]*?\*\//g, '').split(';')) {
    const [name, ...rest] = line.split(':');
    if (!name || rest.length === 0) continue;
    const key = name.trim();
    if (!key.startsWith('--')) continue;
    declarations[key] = rest.join(':').trim();
  }

  return declarations;
}

/** The light and dark palettes, layered exactly as the cascade would. */
export function palettes() {
  const tokensCss = readFileSync(resolve(stylesDir, 'tokens.css'), 'utf8');
  const themeCss = readFileSync(resolve(stylesDir, 'theme.css'), 'utf8');

  const primitives = readBlock(tokensCss, ':root {');
  const light = { ...primitives, ...readBlock(themeCss, ':root {') };
  const darkBlock = readBlock(themeCss, ":root[data-theme='dark']");
  const dark = { ...light, ...darkBlock };

  /* The system-preference block is a third copy of the dark palette, and it is
     the copy nobody looks at: a token added to `[data-theme='dark']` and
     forgotten here means everyone on "system dark" — the default — silently
     gets the light value. That has already happened once. */
  const systemDark = readBlock(themeCss, ":root:not([data-theme='light'])");

  return { primitives, light, dark, darkBlock, systemDark, tokensCss, themeCss };
}

/**
 * Every token the two dark blocks disagree on. Empty is the only healthy
 * answer: they describe the same theme reached two different ways.
 */
export function darkParityDrift({ darkBlock, systemDark }) {
  const names = new Set([...Object.keys(darkBlock), ...Object.keys(systemDark)]);
  const drift = [];

  for (const name of [...names].sort()) {
    const explicit = darkBlock[name];
    const system = systemDark[name];
    if (explicit !== system) drift.push({ name, explicit, system });
  }

  return drift;
}

/** Resolve `var(--x)` / `var(--x, fallback)` chains down to a literal value. */
export function resolveToken(value, palette, seen = new Set()) {
  if (!value) return value;

  return value.replace(
    /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)/g,
    (_, name, fallback) => {
      if (seen.has(name)) return fallback ?? 'transparent';
      seen.add(name);
      const next = palette[name] ?? fallback;
      return next ? resolveToken(next.trim(), palette, seen) : 'transparent';
    }
  );
}
