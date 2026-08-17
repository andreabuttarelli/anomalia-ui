import { catalog } from '../../docs/catalog.js';
import { SITE_URL } from '../../docs/site.js';

/** Prerendered, because adapter-static has no server to build it on request. */
export const prerender = true;

/**
 * Generated from the same catalogue the site renders, so a new component is in
 * the sitemap the moment it has a page. A hand-maintained sitemap is a
 * hand-maintained lie — it goes stale on the first addition and nobody notices,
 * because nothing breaks.
 */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: '/', priority: 1.0 },
  { path: '/components/', priority: 0.9 },
  { path: '/foundations/', priority: 0.8 },
  { path: '/typography/', priority: 0.8 },
  { path: '/motion/', priority: 0.8 },
  { path: '/accessibility/', priority: 0.8 },
  { path: '/audit/', priority: 0.6 },
  { path: '/showcase/dashboard/', priority: 0.7 },
  { path: '/showcase/agent/', priority: 0.7 },
  { path: '/showcase/social/', priority: 0.6 },
  { path: '/showcase/landing/', priority: 0.6 }
];

export function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    ...STATIC_ROUTES,
    ...catalog.map((doc) => ({ path: `/components/${doc.slug}/`, priority: 0.7 }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }
  });
}
