<!--
  Table — styling and scroll behaviour for a table you write yourself.

  Deliberately not a `DataTable` with column definitions. Column configs are a
  second, worse templating language: the moment a cell needs two lines, a badge
  and a link, you are writing render functions inside an array. Native table
  markup already expresses all of that, and it is what screen readers navigate
  with. So this wraps your `<table>` and owns the three things people get wrong:

    • **Overflow is horizontal and belongs to the table**, not the page. The
      wrapper scrolls and is focusable with a label, so a keyboard user can
      reach a column that is off-screen (SC 2.1.1 — a scroll container that
      cannot be focused is a trap for anyone not using a mouse).
    • **`sticky` heads need a background**, or rows show through them.
    • **Numeric columns need tabular figures**, which is what `data-numeric`
      on a cell switches on.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** Names the scroll region for keyboard and screen-reader users. */
    label?: string;
    /** Keeps `<thead>` visible while the body scrolls vertically. */
    stickyHead?: boolean;
    /** Tighter rows for dense, scannable data. */
    density?: 'comfortable' | 'compact';
    /** Hairlines between rows. Off for short tables, where they are just noise. */
    rules?: boolean;
    children?: Snippet;
  }

  let {
    label,
    stickyHead = false,
    density = 'comfortable',
    rules = true,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- A scrollable region MUST be focusable, or a keyboard user cannot reach a
     column that is off-screen (SC 2.1.1). `role="region"` + `aria-label` +
     `tabindex=0` is the pattern the WAI scrollable-region technique prescribes,
     and the lint rule does not know about it. -->
<div
  data-an="table"
  data-density={density}
  data-sticky={stickyHead ? '' : undefined}
  data-rules={rules ? '' : undefined}
  class={cn('an-table', className)}
  role="region"
  aria-label={label}
  tabindex="0"
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .an-table {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    font-family: var(--an-font-sans);
  }

  /* The focus ring itself comes from base.css, which already styles every
     focusable `[data-an]`; all this needs is a radius for it to follow. */
  .an-table:focus-visible {
    border-radius: var(--an-radius-md);
  }

  .an-table :global(table) {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
  }

  .an-table :global(caption) {
    padding-bottom: var(--an-space-2);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
    text-align: start;
  }

  /* A column head is a label, so it takes the label voice — small, tracked,
     uppercase — rather than being body text in bold. */
  .an-table :global(th) {
    padding: var(--an-space-2) var(--an-space-3);
    font-size: var(--an-text-caption-size);
    font-weight: var(--an-weight-semibold);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
    text-align: start;
    white-space: nowrap;
    border-bottom: 1px solid var(--an-border);
  }

  .an-table :global(td) {
    padding: var(--an-space-3);
    vertical-align: middle;
  }

  .an-table[data-density='compact'] :global(th),
  .an-table[data-density='compact'] :global(td) {
    padding: var(--an-space-2) var(--an-space-3);
  }

  .an-table[data-rules] :global(tbody tr + tr td) {
    border-top: 1px solid var(--an-border);
  }

  /* Opaque, or the rows scroll through the header. */
  .an-table[data-sticky] :global(thead th) {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--an-surface);
  }

  /* Right-aligned and tabular: the two things a column of numbers needs to be
     comparable down the page. */
  .an-table :global([data-numeric]) {
    text-align: end;
    font-variant-numeric: tabular-nums;
  }

  .an-table :global(tbody tr[data-interactive]) {
    cursor: pointer;
    transition: background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-table :global(tbody tr[data-interactive]:hover) {
      background: var(--an-surface-hover);
    }
  }

  .an-table :global(tbody tr[data-selected]) {
    background: var(--an-surface-sunken);
  }
</style>
