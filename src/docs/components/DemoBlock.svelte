<!--
  DemoBlock — live preview on top, its exact source underneath.

  The component and the code string come from the same file (imported twice by
  the registry), so the snippet on the page can never drift from the demo.
-->
<script lang="ts">
  import type { Component } from 'svelte';
  import CodeBlock from './CodeBlock.svelte';
  import { collapse } from '$lib/motion/transitions.js';

  interface Props {
    title: string;
    description?: string;
    component: Component;
    code: string;
    /** Preview padding — turn off for demos that render their own chrome. */
    padded?: boolean;
  }

  let { title, description, component: Demo, code, padded = true }: Props = $props();

  let showCode = $state(false);
</script>

<section class="demo">
  <header class="demo__head">
    <div>
      <h3 class="demo__title">{title}</h3>
      {#if description}<p class="demo__desc">{description}</p>{/if}
    </div>
    <button
      class="demo__toggle"
      type="button"
      aria-expanded={showCode}
      onclick={() => (showCode = !showCode)}
    >
      {showCode ? 'Hide code' : 'Show code'}
    </button>
  </header>

  <div class="demo__preview" data-padded={padded ? '' : undefined}>
    <Demo />
  </div>

  {#if showCode}
    <div transition:collapse>
      <CodeBlock {code} />
    </div>
  {/if}
</section>

<style>
  .demo {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
    overflow: hidden;
  }

  .demo__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-4) var(--an-space-4) var(--an-space-3);
  }

  .demo__title {
    margin: 0;
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .demo__desc {
    margin: 4px 0 0;
    font-size: var(--an-text-footnote-size);
    line-height: 1.5;
    color: var(--an-text-muted);
    max-width: 62ch;
  }

  .demo__toggle {
    flex-shrink: 0;
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

  .demo__toggle:hover {
    color: var(--an-text);
    border-color: var(--an-text-faint);
  }

  .demo__preview {
    /* A checkered-free, slightly sunken stage so surfaces read against it. */
    background: var(--an-bg);
    border-top: 1px solid var(--an-border);
  }

  .demo__preview[data-padded] {
    padding: var(--an-space-6) var(--an-space-5);
  }
</style>
