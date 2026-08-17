<!-- Columns are real sections with real headings, so a screen reader can skip one instead of walking forty links. Links stay at `--an-text-muted`: a footer is the most-linked region on a marketing site and small type has the least contrast to spare. -->
<script lang="ts">
  import { SiteFooter, Button, IconButton, StatusDot, Text } from '$lib/index.js';

  const columns = [
    {
      title: 'Product',
      links: [
        { label: 'Autoposts', href: '?' },
        { label: 'Autoblog', href: '?' },
        { label: 'Leads Finder', href: '?' },
        { label: 'Pricing', href: '?' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'Privacy', href: '?' },
        { label: 'Terms', href: '?' },
        { label: 'Changelog', href: '?' },
        { label: 'Cookies', href: '?', onclick: () => {} }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Docs', href: '?' },
        { label: 'Insights', href: '?' },
        { label: 'llms.txt', href: '?', external: true }
      ]
    }
  ];
</script>

<div class="frame">
  <SiteFooter {columns} wordmark="anomalia">
    {#snippet cta()}
      <div class="cta">
        <Text variant="title2" as="h2">Ship a month of content in an afternoon.</Text>
        <Button href="?start">Start free</Button>
      </div>
    {/snippet}

    {#snippet brand()}
      <div class="brand">
        <span class="mark" aria-hidden="true"></span>
        <Text variant="footnote" tone="muted">
          Social media on autopilot. Hosted in the EU.
        </Text>
      </div>
    {/snippet}

    {#snippet social()}
      <IconButton label="Discord" size="sm" href="?">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="9" /></svg>
      </IconButton>
      <IconButton label="GitHub" size="sm" href="?">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" /></svg>
      </IconButton>
    {/snippet}

    {#snippet legal()}
      <span>© 2026 Anomalia</span>
      <StatusDot tone="success" label="All systems normal" size="sm" />
    {/snippet}
  </SiteFooter>
</div>

<style>
  .frame {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  .cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--an-space-4);
  }

  .brand {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
  }

  .mark {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: var(--an-accent);
  }
</style>
