<!--
  Accordion — expandable sections.

  Data-driven rather than composed from child components, so the "only one open
  at a time" rule lives in one place instead of being coordinated through
  context. The body animates open with the `collapse` transition (height +
  padding + fade on the emphasized curve).
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { collapse } from '../../motion/transitions.js';
  import { ripple } from '../../actions/ripple.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange' | 'children'> {
    /** Open section values. Bind to control it from outside. */
    open?: string[];
    items: { value: string; title: string; subtitle?: string; disabled?: boolean }[];
    /** `single` closes the others when one opens. */
    mode?: 'single' | 'multiple';
    variant?: 'plain' | 'grouped';
    children: Snippet<[string]>;
    onchange?: (open: string[]) => void;
  }

  let {
    open = $bindable<string[]>([]),
    items,
    mode = 'single',
    variant = 'grouped',
    class: className,
    children,
    onchange,
    ...rest
  }: Props = $props();

  const id = uid('accordion');

  function toggle(value: string) {
    const isOpen = open.includes(value);
    open = isOpen
      ? open.filter((entry) => entry !== value)
      : mode === 'single'
        ? [value]
        : [...open, value];
    onchange?.(open);
  }
</script>

<div
  data-an="accordion"
  data-variant={variant}
  class={cn('an-accordion', className)}
  {...rest}
>
  {#each items as item (item.value)}
    {@const expanded = open.includes(item.value)}
    <div class="an-accordion__item" data-expanded={expanded ? '' : undefined}>
      <button
        class="an-accordion__trigger"
        type="button"
        id={`${id}-${item.value}`}
        aria-expanded={expanded}
        aria-controls={`${id}-${item.value}-panel`}
        disabled={item.disabled}
        onclick={() => toggle(item.value)}
        use:ripple={{ disabled: item.disabled }}
      >
        <span class="an-accordion__text">
          <span class="an-accordion__title">{item.title}</span>
          {#if item.subtitle}<span class="an-accordion__subtitle">{item.subtitle}</span>{/if}
        </span>

        <svg class="an-accordion__chevron" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M4 6l4 4 4-4"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {#if expanded}
        <div
          class="an-accordion__panel"
          id={`${id}-${item.value}-panel`}
          role="region"
          aria-labelledby={`${id}-${item.value}`}
          transition:collapse
        >
          {@render children(item.value)}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .an-accordion {
    display: flex;
    flex-direction: column;
    font-family: var(--an-font-sans);
  }

  .an-accordion[data-variant='grouped'] {
    background: var(--an-surface);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  .an-accordion__item + .an-accordion__item {
    border-top: 1px solid var(--an-border);
  }

  .an-accordion__trigger {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    width: 100%;
    min-height: var(--an-tap-target);
    padding: var(--an-space-4);
    border: none;
    background: transparent;
    color: var(--an-text);
    font-family: inherit;
    font-size: var(--an-text-body-size);
    font-weight: var(--an-weight-medium);
    text-align: start;
    cursor: pointer;
    isolation: isolate;
    transition: background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-accordion__trigger:hover {
      background: var(--an-surface-hover);
    }
  }

  .an-accordion__trigger:disabled {
    opacity: var(--an-disabled-content);
    cursor: not-allowed;
  }

  .an-accordion__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  .an-accordion__subtitle {
    font-size: var(--an-text-footnote-size);
    font-weight: var(--an-weight-regular);
    color: var(--an-text-muted);
  }

  .an-accordion__chevron {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: var(--an-text-faint);
    transition: rotate var(--an-duration-medium-1) var(--an-ease-emphasized);
  }

  .an-accordion__item[data-expanded] .an-accordion__chevron {
    rotate: 180deg;
    color: var(--an-accent-emphasis);
  }

  .an-accordion__panel {
    padding: 0 var(--an-space-4) var(--an-space-4);
    font-size: var(--an-text-body-size);
    line-height: var(--an-text-body-line);
    color: var(--an-text-muted);
  }
</style>
