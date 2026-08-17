<!--
  ToastItem — one snackbar. Split out from Toaster so each toast owns its own
  auto-hide timer in a real `$effect`: the effect re-runs when `paused` flips
  (hover, focus) and its cleanup clears the pending timeout, which is exactly
  the "pause on hover, resume on leave" behaviour Material asks for.
-->
<script lang="ts">
  import { swipe } from '../../actions/swipe.js';
  import { rise } from '../../motion/transitions.js';
  import { haptic } from '../../utils/haptics.js';
  import type { Toast } from '../../state/toasts.svelte.js';

  interface Props {
    toast: Toast;
    placement?: 'bottom' | 'top';
    ondismiss: (id: string) => void;
  }

  let { toast, placement = 'bottom', ondismiss }: Props = $props();

  let paused = $state(false);
  let offset = $state(0);

  const opacity = $derived(1 - Math.min(1, Math.abs(offset) / 160));

  $effect(() => {
    if (toast.timeout <= 0 || paused) return;
    const handle = setTimeout(() => ondismiss(toast.id), toast.timeout);
    return () => clearTimeout(handle);
  });
</script>

<div
  data-an="toast"
  data-tone={toast.tone}
  class="an-toast"
  role={toast.tone === 'danger' ? 'alert' : 'status'}
  aria-live={toast.tone === 'danger' ? 'assertive' : 'polite'}
  style={offset ? `transform: translateX(${offset}px); opacity:${opacity}` : undefined}
  transition:rise={{ y: placement === 'bottom' ? 16 : -16 }}
  onpointerenter={() => (paused = true)}
  onpointerleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
  onfocusout={() => (paused = false)}
  use:swipe={{
    axis: 'x',
    guardScroll: false,
    onmove: ({ delta }) => (offset = delta),
    onend: ({ delta, velocity }) => {
      if (Math.abs(delta) > 100 || Math.abs(velocity) > 0.5) {
        haptic('light');
        ondismiss(toast.id);
      } else {
        offset = 0;
      }
    }
  }}
>
  <div class="an-toast__text">
    {#if toast.title}<p class="an-toast__title">{toast.title}</p>{/if}
    {#if toast.description}<p class="an-toast__desc">{toast.description}</p>{/if}
  </div>

  {#if toast.action}
    <button
      class="an-toast__action"
      type="button"
      onclick={() => {
        toast.action?.onclick();
        ondismiss(toast.id);
      }}
    >
      {toast.action.label}
    </button>
  {/if}

  <button
    class="an-toast__close"
    type="button"
    aria-label="Dismiss"
    onclick={() => ondismiss(toast.id)}
  >
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  </button>
</div>

<style>
  .an-toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    padding: var(--an-space-3) var(--an-space-3) var(--an-space-3) var(--an-space-4);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    box-shadow: var(--an-shadow-lg);
    font-family: var(--an-font-sans);
    /* Vertical panning still belongs to the page; we only claim the X axis. */
    touch-action: pan-y;
    transition:
      transform var(--an-duration-medium-1) var(--an-ease-emphasized),
      opacity var(--an-duration-short-4) var(--an-ease-standard);
  }

  .an-toast[data-tone='success'] {
    background: var(--an-success);
    color: var(--an-on-status);
  }
  .an-toast[data-tone='warning'] {
    background: var(--an-warning);
    color: var(--an-on-status);
  }
  .an-toast[data-tone='danger'] {
    background: var(--an-danger);
    color: var(--an-on-status);
  }
  .an-toast[data-tone='info'] {
    background: var(--an-info);
    color: var(--an-on-status);
  }

  .an-toast__text {
    flex: 1;
    min-width: 0;
  }

  .an-toast__title {
    margin: 0;
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-medium);
    line-height: 1.35;
  }

  .an-toast__desc {
    margin: 2px 0 0;
    font-size: var(--an-text-footnote-size);
    opacity: 0.8;
    line-height: 1.4;
  }

  .an-toast__action {
    flex-shrink: 0;
    padding: var(--an-space-1) var(--an-space-2);
    border: none;
    border-radius: var(--an-radius-xs);
    background: transparent;
    color: inherit;
    font-family: inherit;
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    text-decoration: underline;
    text-underline-offset: 3px;
    cursor: pointer;
  }

  .an-toast__close {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--an-radius-full);
    background: transparent;
    color: inherit;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity var(--an-duration-short-3) var(--an-ease-standard);
  }

  .an-toast__close:hover {
    opacity: 1;
  }
</style>
