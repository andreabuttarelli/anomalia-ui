<script lang="ts">
  import { highlight } from '../highlight.js';
  import { toast } from '$lib/index.js';

  interface Props {
    code: string;
    language?: string;
  }

  let { code, language = 'svelte' }: Props = $props();

  // Source comes from our own repo via `?raw`, so `{@html}` is safe here.
  const html = $derived(highlight(code));

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success({ title: 'Copied', timeout: 1800 });
    } catch {
      toast.danger({ title: 'Copy failed', description: 'Clipboard access was denied.' });
    }
  }
</script>

<div class="code">
  <div class="code__bar">
    <span class="code__lang">{language}</span>
    <button class="code__copy" type="button" onclick={copy}>Copy</button>
  </div>
  <pre><code>{@html html}</code></pre>
</div>

<style>
  .code {
    position: relative;
    background: var(--an-surface-sunken);
    border-top: 1px solid var(--an-border);
    font-family: var(--an-font-mono);
  }

  .code__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--an-space-2) var(--an-space-3);
    border-bottom: 1px solid var(--an-border);
  }

  .code__lang {
    font-size: var(--an-text-caption-size);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .code__copy {
    padding: 4px var(--an-space-2);
    border: 1px solid var(--an-border-strong);
    border-radius: var(--an-radius-xs);
    background: var(--an-surface);
    color: var(--an-text-muted);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-caption-size);
    cursor: pointer;
    transition:
      color var(--an-duration-short-3) var(--an-ease-standard),
      border-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  .code__copy:hover {
    color: var(--an-text);
    border-color: var(--an-text-faint);
  }

  pre {
    margin: 0;
    padding: var(--an-space-4);
    overflow-x: auto;
    font-size: 12.5px;
    line-height: 1.7;
    color: var(--an-text);
    tab-size: 2;
  }

  code {
    font-family: inherit;
  }

  /* Token colours are tuned for both themes via the semantic tokens. */
  pre :global(.tok-comment) {
    color: var(--an-text-faint);
    font-style: italic;
  }
  pre :global(.tok-string) {
    color: var(--an-success);
  }
  pre :global(.tok-tag) {
    color: var(--an-accent);
  }
  pre :global(.tok-block) {
    color: var(--an-info);
  }
  pre :global(.tok-directive) {
    color: var(--an-warning);
  }
  pre :global(.tok-keyword) {
    color: var(--an-info);
  }
</style>
