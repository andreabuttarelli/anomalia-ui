<!--
  Text — the only way type enters the system.

  Each variant binds size, line-height AND tracking together, because the ramp
  tightens letter-spacing as size grows: a 44px heading set with body tracking
  looks loose and generic. Bundling the three keeps that impossible.

  `family="mono"` switches to the system's second voice — see `Code` for what
  that voice is for, and what it is not for.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { TextVariant } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLElement> {
    variant?: TextVariant;
    /** Element to render. Defaults to a sensible tag for the variant. */
    as?: string;
    tone?: 'default' | 'muted' | 'faint' | 'accent' | 'success' | 'warning' | 'danger' | 'inverse';
    weight?: 'regular' | 'medium' | 'semibold' | 'bold';
    align?: 'start' | 'center' | 'end';
    /** Clamp to N lines with an ellipsis. */
    clamp?: number;
    /** Tabular figures — required for anything a user compares column-wise. */
    numeric?: boolean;
    /**
     * The mono voice, for machine-authored fact: ids, paths, timestamps.
     * Not for numbers in a table — `numeric` aligns those in the sans, which
     * is what you want unless the value is genuinely machine output.
     */
    family?: 'sans' | 'mono';
    children?: Snippet;
  }

  const DEFAULT_TAG: Record<string, string> = {
    display: 'h1',
    title1: 'h1',
    title2: 'h2',
    title3: 'h3',
    headline: 'h4',
    callout: 'p',
    body: 'p',
    footnote: 'p',
    caption: 'span'
  };

  let {
    variant = 'body',
    as,
    tone = 'default',
    weight,
    align,
    clamp,
    numeric = false,
    family = 'sans',
    class: className,
    style,
    children,
    ...rest
  }: Props = $props();

  const inline = $derived(
    [clamp ? `-webkit-line-clamp:${clamp}` : null, style].filter(Boolean).join(';')
  );
</script>

<svelte:element
  this={as ?? DEFAULT_TAG[variant] ?? 'p'}
  data-an="text"
  data-variant={variant}
  data-tone={tone}
  data-weight={weight}
  data-align={align}
  data-family={family}
  class={cn('an-text', clamp && 'an-text--clamp', numeric && 'an-text--numeric', className)}
  style={inline || undefined}
  {...rest}
>
  {@render children?.()}
</svelte:element>

<style>
  .an-text {
    margin: 0;
    font-family: var(--an-font-sans);
    color: var(--an-text);
    font-size: var(--an-text-body-size);
    line-height: var(--an-text-body-line);
    letter-spacing: var(--an-text-body-track);
    font-weight: var(--an-weight-regular);
    text-wrap: pretty;
  }

  .an-text[data-variant='display'] {
    font-size: var(--an-text-display-size);
    line-height: var(--an-text-display-line);
    letter-spacing: var(--an-text-display-track);
    font-weight: var(--an-weight-semibold);
    text-wrap: balance;
  }
  .an-text[data-variant='title1'] {
    font-size: var(--an-text-title-1-size);
    line-height: var(--an-text-title-1-line);
    letter-spacing: var(--an-text-title-1-track);
    font-weight: var(--an-weight-semibold);
    text-wrap: balance;
  }
  .an-text[data-variant='title2'] {
    font-size: var(--an-text-title-2-size);
    line-height: var(--an-text-title-2-line);
    letter-spacing: var(--an-text-title-2-track);
    font-weight: var(--an-weight-semibold);
    text-wrap: balance;
  }
  .an-text[data-variant='title3'] {
    font-size: var(--an-text-title-3-size);
    line-height: var(--an-text-title-3-line);
    letter-spacing: var(--an-text-title-3-track);
    font-weight: var(--an-weight-semibold);
  }
  .an-text[data-variant='headline'] {
    font-size: var(--an-text-headline-size);
    line-height: var(--an-text-headline-line);
    letter-spacing: var(--an-text-headline-track);
    font-weight: var(--an-weight-semibold);
  }
  .an-text[data-variant='callout'] {
    font-size: var(--an-text-callout-size);
    line-height: var(--an-text-callout-line);
    letter-spacing: var(--an-text-callout-track);
  }
  .an-text[data-variant='footnote'] {
    font-size: var(--an-text-footnote-size);
    line-height: var(--an-text-footnote-line);
    letter-spacing: var(--an-text-footnote-track);
  }
  .an-text[data-variant='caption'] {
    font-size: var(--an-text-caption-size);
    line-height: var(--an-text-caption-line);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    font-weight: var(--an-weight-medium);
    color: var(--an-text-faint);
  }

  .an-text[data-tone='muted'] {
    color: var(--an-text-muted);
  }
  .an-text[data-tone='faint'] {
    color: var(--an-text-faint);
  }
  .an-text[data-tone='accent'] {
    color: var(--an-accent-text);
  }
  .an-text[data-tone='success'] {
    color: var(--an-success);
  }
  .an-text[data-tone='warning'] {
    color: var(--an-warning);
  }
  .an-text[data-tone='danger'] {
    color: var(--an-danger);
  }
  .an-text[data-tone='inverse'] {
    color: var(--an-text-inverse);
  }

  .an-text[data-weight='regular'] {
    font-weight: var(--an-weight-regular);
  }
  .an-text[data-weight='medium'] {
    font-weight: var(--an-weight-medium);
  }
  .an-text[data-weight='semibold'] {
    font-weight: var(--an-weight-semibold);
  }
  .an-text[data-weight='bold'] {
    font-weight: var(--an-weight-bold);
  }

  .an-text[data-align='start'] {
    text-align: start;
  }
  .an-text[data-align='center'] {
    text-align: center;
  }
  .an-text[data-align='end'] {
    text-align: end;
  }

  .an-text--clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .an-text--numeric {
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
  }

  .an-text[data-family='mono'] {
    font-family: var(--an-font-mono);
    /* Keeps the x-height on the sans baseline grid — see the token comment. */
    font-size-adjust: var(--an-font-mono-adjust);
    font-variant-ligatures: none;
    letter-spacing: 0;
  }
</style>
