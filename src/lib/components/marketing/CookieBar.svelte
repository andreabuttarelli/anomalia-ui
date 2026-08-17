<!--
  CookieBar — the consent notice.

  A component with a legal shape, not just a visual one. Two things are not
  styling choices and are therefore not props:

    • **Reject is as easy as Accept.** Both are buttons, side by side, at the
      same size. A prominent "Accept all" beside a grey text link is the pattern
      regulators have repeatedly ruled invalid, and it is also just dishonest.
    • **It does not trap the page.** No scrim, no focus trap, no modal: consent
      has to be freely given, and a wall that cannot be dismissed without
      choosing is coercion. It is a `region`, announced politely, and the rest
      of the page stays usable.

  It renders nothing until `open`, and the caller owns persistence — a library
  component should never decide what your cookie policy stores.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import Button from '../button/Button.svelte';
  import { rise } from '../../motion/transitions.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    open?: boolean;
    title?: string;
    description?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    /** Opens granular preferences. Omit if you have none. */
    settingsLabel?: string;
    onaccept?: () => void;
    onreject?: () => void;
    onsettings?: () => void;
    /** Link to the policy, extra copy. */
    children?: Snippet;
  }

  let {
    open = $bindable(true),
    title,
    description = 'We use cookies to run the site and to understand how it is used.',
    acceptLabel = 'Accept',
    rejectLabel = 'Reject',
    settingsLabel,
    class: className,
    onaccept,
    onreject,
    onsettings,
    children,
    ...rest
  }: Props = $props();
</script>

{#if open}
  <div
    data-an="cookie-bar"
    class={cn('an-cookie', className)}
    role="region"
    aria-label={title ?? 'Cookie notice'}
    transition:rise={{ y: 12 }}
    {...rest}
  >
    <div class="an-cookie__text">
      {#if title}<p class="an-cookie__title">{title}</p>{/if}
      <p class="an-cookie__desc">{description}</p>
      {@render children?.()}
    </div>

    <div class="an-cookie__actions">
      {#if settingsLabel}
        <Button size="sm" variant="ghost" onclick={() => onsettings?.()}>{settingsLabel}</Button>
      {/if}
      <!-- Same variant, same size, same weight as Accept. This is the whole
           point of the component: an equal choice has to look equal. -->
      <Button size="sm" variant="outline" onclick={() => { onreject?.(); open = false; }}>
        {rejectLabel}
      </Button>
      <Button size="sm" onclick={() => { onaccept?.(); open = false; }}>{acceptLabel}</Button>
    </div>
  </div>
{/if}

<style>
  .an-cookie {
    position: fixed;
    inset-inline: var(--an-space-4);
    bottom: calc(var(--an-space-4) + env(safe-area-inset-bottom, 0px));
    z-index: var(--an-z-overlay);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--an-space-4);
    max-width: 720px;
    margin-inline: auto;
    padding: var(--an-space-4);
    border: 1px solid var(--an-border-control);
    border-radius: var(--an-radius-xl);
    background: var(--an-surface);
    box-shadow: var(--an-shadow-lg);
    font-family: var(--an-font-sans);
  }

  .an-cookie__text {
    flex: 1;
    min-width: 240px;
  }

  .an-cookie__title {
    margin: 0 0 2px;
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-semibold);
    color: var(--an-text);
  }

  .an-cookie__desc {
    margin: 0;
    font-size: var(--an-text-footnote-size);
    line-height: 1.5;
    color: var(--an-text-muted);
  }

  .an-cookie__actions {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    flex-shrink: 0;
  }

  @media (max-width: 520px) {
    .an-cookie__actions {
      width: 100%;
    }

    /* Full width and equal width — the equality has to survive the breakpoint,
       which is exactly where these banners usually start cheating. */
    .an-cookie__actions :global([data-an='button']) {
      flex: 1;
    }
  }
</style>
