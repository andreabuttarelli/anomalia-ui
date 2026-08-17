/**
 * Everything about this site as a *published document* rather than as an app.
 *
 * Kept out of `src/lib` on purpose: that directory is what `svelte-package`
 * ships to npm, and a consumer installing the component library has no use for
 * the docs site's canonical URL.
 */

/**
 * The canonical origin. Every absolute URL on the site is built from this, so
 * moving the docs is a one-line change rather than a search-and-replace.
 *
 * Overridable at build time because the same build runs on a preview
 * deployment, where hard-coding production would make every preview page
 * declare itself canonical at an address it is not served from — which is how
 * preview URLs end up outranking the real ones.
 */
export const SITE_URL = (
  import.meta.env?.PUBLIC_DOCS_URL ?? 'https://ui.anomalia.so'
).replace(/\/$/, '');

export const SITE_NAME = '@anomalia/ui';

export const SITE_TAGLINE = 'A SvelteKit design system';

/** Used when a page has nothing more specific to say. Every page should. */
export const SITE_DESCRIPTION =
  'A SvelteKit 5 design system with the restraint of Apple and shadcn, the touch and motion of Material, and contrast audited against WCAG 2.2 on every token. Zero runtime dependencies.';

export const SITE_LOCALE = 'en';

export const REPO_URL = 'https://github.com/andreabuttarelli/anomalia-ui';

/** 1200×630, the size every crawler crops to. */
export const OG_IMAGE = `${SITE_URL}/og.png`;

/**
 * Absolute, trailing-slash-normalised. Search engines treat `/motion` and
 * `/motion/` as two documents; this site prerenders with trailing slashes, so
 * the canonical has to agree with what is actually served or the canonical tag
 * points at a redirect.
 */
export function canonical(pathname: string): string {
  const path = pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`;
  return `${SITE_URL}${path}`;
}
