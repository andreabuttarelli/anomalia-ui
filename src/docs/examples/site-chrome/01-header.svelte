<!-- The bar frosts only once the page has scrolled, the links collapse into a real `<dialog>` on a phone, and the CTA never collapses — it is the reason the page exists. -->
<script lang="ts">
  import { SiteHeader, Button, IconButton, ThemeToggle, Text } from '$lib/index.js';

  const links = [
    { label: 'Product', href: '?product' },
    { label: 'Pricing', href: '?pricing' },
    { label: 'Docs', href: '?docs' },
    { label: 'Blog', href: '?blog', external: true }
  ];
</script>

<div class="frame">
  <SiteHeader {links} current="?pricing" sticky={false}>
    {#snippet brand()}
      <a class="wordmark" href="?top">
        <span class="mark" aria-hidden="true"></span>
        Anomalia
      </a>
    {/snippet}

    {#snippet utilities()}
      <ThemeToggle size="sm" />
      <IconButton label="GitHub" size="sm" href="?gh">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
        </svg>
      </IconButton>
    {/snippet}

    {#snippet cta()}
      <Button size="sm" href="?start">Start</Button>
    {/snippet}
  </SiteHeader>

  <div class="page">
    <Text variant="caption" as="p">Resize the preview</Text>
    <Text variant="footnote" tone="muted">
      Under 860px the links and utilities move into the menu. The CTA stays.
    </Text>
  </div>
</div>

<style>
  .frame {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--an-text);
    font-size: var(--an-text-callout-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: -0.02em;
    text-decoration: none;
  }

  .mark {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    background: var(--an-accent);
  }

  .page {
    padding: var(--an-space-6) var(--an-space-4);
    background: var(--an-bg);
  }
</style>
