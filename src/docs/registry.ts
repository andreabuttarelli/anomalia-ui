import type { Component } from 'svelte';
import { catalog, CATEGORY_ORDER, type ComponentDoc as CatalogEntry, type PropRow } from './catalog.js';

/**
 * Docs registry — the catalogue plus the live examples.
 *
 * Examples are ordinary `.svelte` files under `src/docs/examples/<slug>/`. Vite
 * imports each one twice — once as a component to render, once as raw text to
 * display — so the code on the page is, by construction, the code that ran in
 * the preview above it. There is no second copy of a snippet to drift.
 *
 * Conventions:
 *   • folder name  → component slug (`button/` → `/components/button`)
 *   • `01-name.svelte` → ordering + title ("Name")
 *   • a leading HTML comment in the file becomes the example's description and
 *     is stripped from the displayed source.
 */

const modules = import.meta.glob<{ default: Component }>('./examples/**/*.svelte', {
  eager: true
});

const sources = import.meta.glob<string>('./examples/**/*.svelte', {
  eager: true,
  query: '?raw',
  import: 'default'
});

export interface DocExample {
  id: string;
  title: string;
  description?: string;
  component: Component;
  code: string;
}

export type { PropRow };
export type ComponentDoc = CatalogEntry & { examples: DocExample[] };

function titleFromFile(file: string): string {
  const base = file.split('/').pop()!.replace('.svelte', '');
  const withoutOrder = base.replace(/^\d+-/, '');
  return withoutOrder.replace(/-/g, ' ').replace(/^./, (char) => char.toUpperCase());
}

/** Pull the leading `<!-- … -->` out of an example and use it as its blurb. */
function splitDescription(raw: string): { description?: string; code: string } {
  const match = raw.match(/^\s*<!--([\s\S]*?)-->\s*/);
  if (!match) return { code: raw.trim() };

  return {
    description: match[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join(' '),
    code: raw.slice(match[0].length).trim()
  };
}

function examplesFor(slug: string): DocExample[] {
  return Object.keys(modules)
    .filter((path) => path.startsWith(`./examples/${slug}/`))
    .sort()
    .map((path) => {
      const { description, code } = splitDescription(sources[path] ?? '');
      return {
        id: path.split('/').pop()!.replace('.svelte', ''),
        title: titleFromFile(path),
        description,
        component: modules[path].default,
        code
      };
    });
}

export const components: ComponentDoc[] = catalog.map((entry) => ({
  ...entry,
  examples: examplesFor(entry.slug)
}));

export const componentsBySlug = new Map(components.map((entry) => [entry.slug, entry]));

export { CATEGORY_ORDER };

export function groupedComponents(): { category: string; items: ComponentDoc[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: components.filter((entry) => entry.category === category)
  })).filter((group) => group.items.length > 0);
}
