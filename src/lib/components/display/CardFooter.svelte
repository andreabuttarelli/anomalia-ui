<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Align } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    align?: Align | 'between';
    /** Hairline above the footer, for cards whose body is dense. */
    divided?: boolean;
    children?: Snippet;
  }

  let { align = 'end', divided = false, class: className, children, ...rest }: Props = $props();
</script>

<div
  data-an="card-footer"
  data-align={align}
  class={cn('an-card-footer', divided && 'an-card-footer--divided', className)}
  {...rest}
>
  {@render children?.()}
</div>

<style>
  .an-card-footer {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    margin-top: var(--an-space-5);
  }

  .an-card-footer[data-align='start'] {
    justify-content: flex-start;
  }
  .an-card-footer[data-align='center'] {
    justify-content: center;
  }
  .an-card-footer[data-align='end'] {
    justify-content: flex-end;
  }
  .an-card-footer[data-align='between'] {
    justify-content: space-between;
  }

  .an-card-footer--divided {
    border-top: 1px solid var(--an-border);
    padding-top: var(--an-space-4);
  }
</style>
