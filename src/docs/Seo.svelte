<!--
  Seo — the head of one page.

  One component rather than a `<svelte:head>` per route, because the tags that
  matter are the ones people forget: a canonical that disagrees with the served
  URL, an `og:image` that is relative (crawlers do not resolve it), a title that
  is unique on screen but identical in the tab. Centralising them means a new
  page cannot ship without them.

  What each tag is actually for, since half of them are cargo-culted:

    • `title` — the clickable line in a result. Page name first, site name last,
      because the front of a title is what survives truncation.
    • `description` — not a ranking signal, but it *is* the snippet, and a page
      without one gets whatever prose the crawler finds first.
    • `canonical` — the fix for the same page being reachable at two addresses.
    • `og:*` / `twitter:*` — the link preview. Absolute URLs only.
    • JSON-LD — the only one a machine reads as structured fact rather than as
      text to guess at.
-->
<script lang="ts">
  import {
    canonical,
    OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_LOCALE,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL
  } from './site.js';

  interface Props {
    /** The page's own name. The site name is appended here, not by the caller. */
    title?: string;
    /** One sentence, ~150 chars. It becomes the search snippet verbatim. */
    description?: string;
    /** `$page.url.pathname`. */
    pathname: string;
    /** `article` for a component page, `website` for the rest. */
    type?: 'website' | 'article';
    /** Keeps a page out of the index without removing it from the site. */
    noindex?: boolean;
    /** Extra JSON-LD, already stringified. */
    schema?: string;
  }

  let {
    title,
    description = SITE_DESCRIPTION,
    pathname,
    type = 'website',
    noindex = false,
    schema
  }: Props = $props();

  /* Name first: a result list truncates from the right, so "Sidebar" has to
     survive where "@anomalia/ui — Sidebar" would not. The home page is the one
     exception — there the site name *is* the page name. */
  const fullTitle = $derived(
    title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`
  );

  const url = $derived(canonical(pathname));

  /* Declared once, on every page, so a crawler landing anywhere knows what the
     site is and who publishes it without having to reach the home page. */
  const siteSchema = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      alternateName: 'Anomalia UI',
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: SITE_LOCALE
    })
  );
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />

  {#if noindex}
    <meta name="robots" content="noindex, follow" />
  {/if}

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={OG_IMAGE} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={`${SITE_NAME} — ${SITE_TAGLINE}`} />
  <meta property="og:locale" content="en_US" />

  <!-- `summary_large_image` is what turns the card from a thumbnail into a
       banner. Without it the 1200×630 image is cropped to a square. -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={OG_IMAGE} />
  <meta name="twitter:creator" content="@buttarellidev" />

  {@html `<script type="application/ld+json">${siteSchema}</script>`}
  {#if schema}
    {@html `<script type="application/ld+json">${schema}</script>`}
  {/if}
</svelte:head>
