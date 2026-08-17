<!--
  Dialog — modal surface for desktop-sized decisions.

  Composes the four things a modal always needs and is always missing one of:
  a portal (escapes overflow/transform ancestors), a focus trap, a scroll lock,
  and Escape-to-close. It enters with Material's emphasized-decelerate rise
  rather than a plain fade, so it reads as arriving from the trigger.

  On phones prefer `BottomSheet` — a centred modal is a poor thumb target.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { portal } from '../../actions/portal.js';
  import { focusTrap } from '../../actions/focus-trap.js';
  import { lockScroll } from '../../actions/scroll-lock.js';
  import { rise } from '../../motion/transitions.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';
  import Scrim from './Scrim.svelte';
  import IconButton from '../button/IconButton.svelte';

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    /** Escape and scrim taps close the dialog. Turn off for destructive flows. */
    dismissible?: boolean;
    /** Show the ✕ in the header. */
    closable?: boolean;
    /**
     * `alertdialog` tells assistive tech this interrupts for a decision, and
     * makes the description part of the announcement. Use it for destructive
     * confirmations — which are exactly the dialogs that are not dismissible.
     */
    role?: 'dialog' | 'alertdialog';
    class?: string;
    header?: Snippet;
    footer?: Snippet;
    children?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    description,
    size = 'md',
    dismissible = true,
    closable = true,
    role = dismissible ? 'dialog' : 'alertdialog',
    class: className,
    header,
    footer,
    children,
    onclose
  }: Props = $props();

  const id = uid('dialog');

  function close() {
    open = false;
    onclose?.();
  }

  function requestClose() {
    if (dismissible) close();
  }

  $effect(() => {
    if (!open) return;
    const release = lockScroll();

    const onkeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible) {
        event.stopPropagation();
        close();
      }
    };
    document.addEventListener('keydown', onkeydown);

    return () => {
      document.removeEventListener('keydown', onkeydown);
      release();
    };
  });
</script>

{#if open}
  <div class="an-dialog-root" use:portal>
    <Scrim onclose={requestClose} />

    <div class="an-dialog-viewport">
      <div
        data-an="dialog"
        data-size={size}
        class={cn('an-dialog', className)}
        {role}
        aria-modal="true"
        aria-labelledby={title ? `${id}-title` : undefined}
        aria-describedby={description ? `${id}-desc` : undefined}
        tabindex="-1"
        transition:rise={{ y: 12 }}
        use:focusTrap={{ enabled: true }}
      >
        {#if header || title || closable}
          <div class="an-dialog__header">
            <div class="an-dialog__heading">
              {#if header}
                {@render header()}
              {:else}
                {#if title}<h2 class="an-dialog__title" id={`${id}-title`}>{title}</h2>{/if}
                {#if description}
                  <p class="an-dialog__desc" id={`${id}-desc`}>{description}</p>
                {/if}
              {/if}
            </div>

            {#if closable}
              <IconButton label="Close" size="sm" onclick={close}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </IconButton>
            {/if}
          </div>
        {/if}

        <div class="an-dialog__body" data-an-scroll>
          {@render children?.()}
        </div>

        {#if footer}
          <div class="an-dialog__footer">{@render footer()}</div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .an-dialog-viewport {
    position: fixed;
    inset: 0;
    z-index: var(--an-z-modal);
    display: grid;
    place-items: center;
    padding: var(--an-space-4);
    pointer-events: none;
  }

  .an-dialog {
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: var(--an-dialog-max, 480px);
    max-height: min(85vh, 720px);
    background: var(--an-surface);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    box-shadow: var(--an-shadow-xl);
    font-family: var(--an-font-sans);
    color: var(--an-text);
    outline: none;
    overflow: hidden;
  }

  .an-dialog[data-size='sm'] {
    --an-dialog-max: 380px;
  }
  .an-dialog[data-size='lg'] {
    --an-dialog-max: 720px;
  }
  .an-dialog[data-size='full'] {
    --an-dialog-max: 100%;
    max-height: 100%;
    height: 100%;
  }

  .an-dialog__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-5) var(--an-space-5) var(--an-space-3);
  }

  .an-dialog__heading {
    min-width: 0;
  }

  .an-dialog__title {
    margin: 0;
    font-size: var(--an-text-title-3-size);
    line-height: var(--an-text-title-3-line);
    letter-spacing: var(--an-text-title-3-track);
    font-weight: var(--an-weight-semibold);
  }

  .an-dialog__desc {
    margin: var(--an-space-1) 0 0;
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    line-height: 1.5;
  }

  .an-dialog__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: var(--an-space-2) var(--an-space-5) var(--an-space-5);
    /* Contain the scroll chain so flinging the body never scrolls the page. */
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }

  .an-dialog__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--an-space-2);
    padding: var(--an-space-4) var(--an-space-5);
    border-top: 1px solid var(--an-border);
    background: var(--an-surface-raised);
  }

  @media (max-width: 640px) {
    .an-dialog {
      max-width: 100%;
    }
  }
</style>
