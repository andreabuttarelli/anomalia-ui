<!--
  Toaster — mount once near the root of the app; every `toast(...)` call from
  anywhere renders here.

  Bottom-anchored and full-width on phones (thumb reach), corner-anchored on
  desktop. The queue itself — including the one-at-a-time cap — lives in
  `state/toasts.svelte.ts`; this component is only its window onto the screen.
-->
<script lang="ts">
  import { portal } from '../../actions/portal.js';
  import { toasts } from '../../state/toasts.svelte.js';
  import { cn } from '../../utils/cn.js';
  import ToastItem from './ToastItem.svelte';

  interface Props {
    placement?: 'bottom' | 'top';
    class?: string;
  }

  let { placement = 'bottom', class: className }: Props = $props();
</script>

<div
  data-an="toaster"
  data-placement={placement}
  class={cn('an-toaster', className)}
  role="region"
  aria-label="Notifications"
  use:portal
>
  {#each toasts.items as item (item.id)}
    <ToastItem toast={item} {placement} ondismiss={(id) => toasts.dismiss(id)} />
  {/each}
</div>

<style>
  .an-toaster {
    position: fixed;
    z-index: var(--an-z-toast);
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    padding: var(--an-space-4);
    inset-inline: 0;
    /* The container spans the screen; only the toasts themselves take pointers. */
    pointer-events: none;
  }

  .an-toaster[data-placement='bottom'] {
    bottom: env(safe-area-inset-bottom, 0px);
    /* Newest toast nearest the edge the stack grows from. */
    flex-direction: column-reverse;
  }

  .an-toaster[data-placement='top'] {
    top: env(safe-area-inset-top, 0px);
  }

  @media (min-width: 641px) {
    .an-toaster {
      inset-inline: auto 0;
      max-width: 420px;
    }
  }
</style>
