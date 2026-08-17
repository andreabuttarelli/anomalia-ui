<script lang="ts">
  import Seo from '../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import { Card, Text } from '$lib/index.js';
  import { groupedComponents } from '../../docs/registry.js';

  const groups = groupedComponents();
</script>

<Seo
  title="Components"
  description="43 SvelteKit components: buttons, forms, overlays, navigation, app shell, marketing chrome, charts and agent-chat parts — each with live examples, the source that rendered them, and its full API."
  pathname={$page.url.pathname}
/>


<div class="doc-page">
  <p class="doc-page__eyebrow">Reference</p>
  <h1 class="doc-page__title">Components</h1>
  <p class="doc-page__lead">
    Every entry documents its exports, the behaviour worth knowing before you reach for it, live
    examples with their exact source, and the props table.
  </p>

  {#each groups as group (group.category)}
    <section class="doc-section">
      <h2 class="doc-section__title">{group.category}</h2>
      <div class="grid">
        {#each group.items as item (item.slug)}
          <Card href={`/components/${item.slug}/`} padding="sm">
            <Text variant="headline" as="h3">{item.name}</Text>
            <Text variant="footnote" tone="muted" class="card-summary">{item.summary}</Text>
          </Card>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--an-space-3);
  }

  :global(.card-summary) {
    margin-top: var(--an-space-1) !important;
  }
</style>
