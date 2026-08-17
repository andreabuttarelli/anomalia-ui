<!--
  Code — the mono voice of the system, as a component rather than a convention.

  Mono here is not "the code font": it is the font of machine-authored fact —
  ids, paths, hashes, timestamps, spec values, and yes, code. Making it a
  component is what keeps that rule enforceable; a bare `font-family` in a
  stylesheet is how mono ends up on prices and paragraph text.

  Do NOT reach for it to align numbers in a table. `Text` with `numeric` gives
  you tabular figures in Inter, which aligns just as well and does not turn a
  metrics panel into a terminal.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    /** `block` renders a scrollable `<pre>`; `inline` sits inside a sentence. */
    variant?: 'inline' | 'block';
    /** Muted, borderless treatment for secondary metadata. */
    tone?: 'default' | 'muted';
    /** Drop the tinted background — for whole rows that are already mono. */
    bare?: boolean;
    children?: Snippet;
  }

  let {
    variant = 'inline',
    tone = 'default',
    bare = false,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

{#if variant === 'block'}
  <pre
    data-an="code"
    data-variant="block"
    data-tone={tone}
    class={cn('an-code', 'an-code--block', bare && 'an-code--bare', className)}
    {...rest}><code>{@render children?.()}</code></pre>
{:else}
  <code
    data-an="code"
    data-variant="inline"
    data-tone={tone}
    class={cn('an-code', bare && 'an-code--bare', className)}
    {...rest}>{@render children?.()}</code
  >
{/if}

<style>
  .an-code {
    font-family: var(--an-font-mono);
    /* Normalises x-height against the sans beside it — see the token comment. */
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 0.9em;
    font-variant-ligatures: none;
    color: var(--an-text);
  }

  .an-code:not(.an-code--block) {
    padding: 0.1em 0.35em;
    border-radius: var(--an-radius-xs);
    background: var(--an-surface-sunken);
    /* Long ids and paths break rather than pushing the layout wide. */
    overflow-wrap: anywhere;
  }

  .an-code[data-tone='muted'] {
    color: var(--an-text-muted);
  }

  .an-code--bare {
    background: none;
    padding: 0;
  }

  .an-code--block {
    margin: 0;
    padding: var(--an-space-4);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface-sunken);
    font-size: 0.85em;
    line-height: 1.7;
    overflow-x: auto;
    tab-size: 2;
  }

  .an-code--block code {
    font: inherit;
  }
</style>
