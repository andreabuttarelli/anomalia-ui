<!--
  SiteFooter — the marketing footer.

  A big footer is mostly a link directory, and the failure mode is treating it
  as decoration: a flat list of forty links with no headings, in 11px grey at
  2.8:1, is a sitemap nobody can use and a contrast failure on the most-linked
  region of the site. So:

    • **Columns are real sections with real headings**, which is what lets
      assistive tech skip a column instead of walking it.
    • **Footer text is `--an-text-muted`, not fainter.** Small type earns less
      contrast latitude, not more, and links here are still links.
    • **The wordmark is `aria-hidden`.** The oversized brand at the bottom is a
      graphic; the accessible name of the site was stated at the top.

  Columns come in as data because that is what they are. Everything with a
  behaviour — CTA, social, legal row — is a snippet.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { SiteLink } from '../../types.js';

  interface FooterColumn {
    title: string;
    links: SiteLink[];
  }

  interface Props extends HTMLAttributes<HTMLElement> {
    columns?: FooterColumn[];
    /** Oversized wordmark across the bottom. Decorative by definition. */
    wordmark?: string | null;
    label?: string;
    /** Closing CTA band above the columns. */
    cta?: Snippet;
    /** Logo, tagline, hosting note — the left block beside the columns. */
    brand?: Snippet;
    /** Social icons, badges. */
    social?: Snippet;
    /** Copyright, status, locale — the last row. */
    legal?: Snippet;
  }

  let {
    columns = [],
    wordmark = null,
    label = 'Footer',
    class: className,
    cta,
    brand,
    social,
    legal,
    ...rest
  }: Props = $props();
</script>

<footer data-an="site-footer" class={cn('an-footer', className)} aria-label={label} {...rest}>
  {#if cta}
    <div class="an-footer__cta">{@render cta()}</div>
  {/if}

  <div class="an-footer__grid">
    {#if brand || social}
      <div class="an-footer__brand">
        {#if brand}{@render brand()}{/if}
        {#if social}<div class="an-footer__social">{@render social()}</div>{/if}
      </div>
    {/if}

    {#if columns.length}
      <div class="an-footer__columns">
        {#each columns as column (column.title)}
          <section class="an-footer__col">
            <h2 class="an-footer__col-title">{column.title}</h2>
            <ul class="an-footer__col-list">
              {#each column.links as link (link.label)}
                <li>
                  {#if link.onclick}
                    <button class="an-footer__link" type="button" onclick={link.onclick}>
                      {link.label}
                    </button>
                  {:else}
                    <a
                      class="an-footer__link"
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  {/if}
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
    {/if}
  </div>

  {#if legal}
    <div class="an-footer__legal">{@render legal()}</div>
  {/if}

  {#if wordmark}
    <div class="an-footer__wordmark" aria-hidden="true">{wordmark}</div>
  {/if}
</footer>

<style>
  .an-footer {
    --an-footer-width: var(--an-site-width, 1200px);
    padding-top: var(--an-space-10);
    border-top: 1px solid var(--an-border);
    background: var(--an-surface);
    font-family: var(--an-font-sans);
    overflow: hidden;
  }

  .an-footer__cta,
  .an-footer__grid,
  .an-footer__legal {
    max-width: var(--an-footer-width);
    margin-inline: auto;
    padding-inline: var(--an-space-4);
  }

  .an-footer__cta {
    padding-bottom: var(--an-space-10);
  }

  .an-footer__grid {
    display: grid;
    grid-template-columns: minmax(200px, 1fr) 3fr;
    gap: var(--an-space-8);
    padding-bottom: var(--an-space-8);
  }

  .an-footer__brand {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-4);
    min-width: 0;
  }

  .an-footer__social {
    display: flex;
    align-items: center;
    gap: var(--an-space-1);
  }

  .an-footer__columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--an-space-6);
  }

  .an-footer__col-title {
    margin: 0 0 var(--an-space-3);
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .an-footer__col-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  /* Muted, not faint. A footer is the most-linked region on a marketing site,
     and small type is exactly where contrast has least room to spare. */
  .an-footer__link {
    padding: 0;
    border: none;
    background: none;
    color: var(--an-text-muted);
    font: inherit;
    font-size: var(--an-text-footnote-size);
    text-align: start;
    text-decoration: none;
    cursor: pointer;
    transition: color var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-footer__link:hover {
      color: var(--an-text);
    }
  }

  .an-footer__legal {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-3);
    padding-top: var(--an-space-4);
    padding-bottom: var(--an-space-6);
    border-top: 1px solid var(--an-border);
    font-size: var(--an-text-caption-size);
    color: var(--an-text-faint);
  }

  /* Cropped on purpose: a wordmark that runs off both edges reads as a
     watermark rather than as a heading nobody can click. */
  .an-footer__wordmark {
    padding-inline: var(--an-space-4);
    font-size: clamp(4rem, 16vw, 13rem);
    font-weight: var(--an-weight-bold);
    letter-spacing: -0.05em;
    line-height: 0.78;
    text-align: center;
    color: var(--an-border);
    user-select: none;
    /* Sits below the descender line so it hugs the bottom edge. */
    margin-bottom: -0.14em;
  }

  @media (max-width: 860px) {
    .an-footer__grid {
      grid-template-columns: 1fr;
      gap: var(--an-space-6);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-footer__link {
      transition: none;
    }
  }
</style>
