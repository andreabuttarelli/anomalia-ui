<script lang="ts">
  import type { PropRow } from '../registry.js';

  interface Props {
    title?: string;
    rows: PropRow[];
  }

  let { title, rows }: Props = $props();
</script>

<div class="props">
  {#if title}<h4 class="props__title">{title}</h4>{/if}

  <!-- Wide tables scroll inside their own box rather than the page. -->
  <div class="props__scroll">
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row (row.name)}
          <tr>
            <td><code class="props__name">{row.name}</code></td>
            <td><code class="props__type">{row.type}</code></td>
            <td>{#if row.default}<code>{row.default}</code>{:else}<span class="props__dash">—</span>{/if}</td>
            <td>{row.description}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .props {
    margin-top: var(--an-space-6);
  }

  .props__title {
    margin: 0 0 var(--an-space-2);
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text-muted);
    font-family: var(--an-font-mono);
  }

  .props__scroll {
    overflow-x: auto;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--an-text-footnote-size);
  }

  th {
    text-align: start;
    font-weight: var(--an-weight-medium);
    color: var(--an-text-faint);
    font-size: var(--an-text-caption-size);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: var(--an-space-3) var(--an-space-4);
    border-bottom: 1px solid var(--an-border);
    white-space: nowrap;
  }

  td {
    padding: var(--an-space-3) var(--an-space-4);
    border-bottom: 1px solid var(--an-border);
    color: var(--an-text-muted);
    vertical-align: top;
    line-height: 1.5;
  }

  tr:last-child td {
    border-bottom: none;
  }

  code {
    font-family: var(--an-font-mono);
    font-size: 12px;
    white-space: nowrap;
  }

  .props__name {
    color: var(--an-text);
    font-weight: var(--an-weight-medium);
  }

  .props__type {
    color: var(--an-accent);
    white-space: normal;
  }

  .props__dash {
    color: var(--an-text-faint);
  }
</style>
