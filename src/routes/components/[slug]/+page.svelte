<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { REPO_URL, SITE_NAME } from '../../../docs/site.js';
  import { page } from '$app/stores';
  import DemoBlock from '../../../docs/components/DemoBlock.svelte';
  import PropsTable from '../../../docs/components/PropsTable.svelte';
  import { Badge } from '$lib/index.js';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const doc = $derived(data.doc);
  const importLine = $derived(`import { ${doc.exports.join(', ')} } from '@anomalia/ui';`);

  /** Split a note on backticks so `code` spans render as code, not literal text. */
  function segments(note: string) {
    return note.split('`').map((text, index) => ({ text, code: index % 2 === 1 }));
  }
</script>

<!-- Each component page gets its own description straight from the catalogue,
     so 43 pages have 43 distinct snippets rather than one boilerplate repeated
     — duplicate descriptions are the single most common reason a docs site's
     inner pages never surface in search. -->
<Seo
  title={doc.name}
  description={`${doc.summary} Part of ${SITE_NAME}, a SvelteKit design system.`}
  pathname={$page.url.pathname}
  type="article"
  schema={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${doc.name} — ${SITE_NAME}`,
    description: doc.summary,
    articleSection: doc.category,
    keywords: doc.exports.join(', '),
    isPartOf: { '@type': 'WebSite', name: SITE_NAME },
    author: { '@type': 'Person', name: 'Andrea Buttarelli' },
    codeRepository: REPO_URL,
    programmingLanguage: 'Svelte'
  })}
/>

<div class="doc-page">
  <p class="doc-page__eyebrow">{doc.category}</p>
  <h1 class="doc-page__title">{doc.name}</h1>
  <p class="doc-page__lead">{doc.summary}</p>

  <div class="exports">
    {#each doc.exports as name (name)}
      <Badge variant="outline" tone="accent">{name}</Badge>
    {/each}
  </div>

  <pre class="doc-imports">{importLine}</pre>

  {#if doc.notes?.length}
    <section class="doc-section">
      <h2 class="doc-section__title">Notes</h2>
      <ul class="doc-notes">
        {#each doc.notes as note (note)}
          <li>
            {#each segments(note) as part, index (index)}
              {#if part.code}<code>{part.text}</code>{:else}{part.text}{/if}
            {/each}
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if doc.examples.length}
    <section class="doc-section">
      <h2 class="doc-section__title">Examples</h2>
      <div class="doc-stack">
        {#each doc.examples as example (example.id)}
          <DemoBlock
            title={example.title}
            description={example.description}
            component={example.component}
            code={example.code}
          />
        {/each}
      </div>
    </section>
  {/if}

  {#if doc.props?.length}
    <section class="doc-section">
      <h2 class="doc-section__title">API</h2>
      {#each doc.props as group (group.title ?? doc.slug)}
        <PropsTable title={group.title} rows={group.rows} />
      {/each}
      <p class="api-note">
        Every component also forwards the native attributes of its root element, plus
        <code>class</code>, so anything not listed here still works.
      </p>
    </section>
  {/if}
</div>

<style>
  .exports {
    display: flex;
    flex-wrap: wrap;
    gap: var(--an-space-2);
    margin-top: var(--an-space-4);
  }

  .api-note {
    margin: var(--an-space-4) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
  }

  .doc-notes code,
  .api-note code {
    font-family: var(--an-font-mono);
    font-size: 12px;
    padding: 1px 5px;
    border-radius: 5px;
    background: var(--an-surface-sunken);
  }
</style>
