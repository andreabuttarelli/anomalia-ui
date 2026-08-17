<!--
  VisuallyHidden — present for assistive tech, absent for everyone else.

  Use it for the text that a visual affordance already conveys: the word
  "Search" next to a magnifier, the units after a number, the "opens in a new
  tab" that an icon implies. Never use `display: none` for that — it removes the
  text from the accessibility tree as well.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    /** Render as a different element (e.g. `h2` for an unseen section heading). */
    as?: string;
    /** Become visible when focused — the skip-link behaviour. */
    focusable?: boolean;
    children?: Snippet;
  }

  let { as = 'span', focusable = false, class: className, children, ...rest }: Props = $props();
</script>

<svelte:element
  this={as}
  data-an="visually-hidden"
  class={cn('an-sr-only', focusable && 'an-sr-only--focusable', className)}
  {...rest}
>
  {@render children?.()}
</svelte:element>
