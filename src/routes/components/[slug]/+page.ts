import { error } from '@sveltejs/kit';
import { components, componentsBySlug } from '../../../docs/registry.js';
import type { EntryGenerator, PageLoad } from './$types';

/** Tells the prerenderer which slugs exist — the registry is the single source. */
export const entries: EntryGenerator = () => components.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
  const doc = componentsBySlug.get(params.slug);
  if (!doc) error(404, `Unknown component: ${params.slug}`);
  return { doc };
};
