<!--
  SkipLink — the first thing in the tab order, so a keyboard user can jump past
  the nav instead of tabbing through it on every page.

  Invisible until focused. It needs a real target: give your `<main>` an id and
  `tabindex="-1"`, otherwise the browser moves the scroll position but not the
  focus, and the next Tab lands back at the top of the page.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../../utils/cn.js';

  interface Props {
    /** Fragment id of the main content, including the `#`. */
    href?: string;
    class?: string;
    children?: Snippet;
  }

  let { href = '#main', class: className, children }: Props = $props();
</script>

<a data-an="skip-link" class={cn('an-sr-only', 'an-sr-only--focusable', className)} {href}>
  {#if children}{@render children()}{:else}Skip to content{/if}
</a>
