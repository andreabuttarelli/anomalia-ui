<!--
  Progress — linear bar, determinate or indeterminate.

  Determinate transitions on the emphasized curve so a jump from 20% to 80%
  reads as a move, not a teleport. Indeterminate uses Material's two-phase
  sweep rather than a single looping block.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Tone } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    /** 0–100. Omit for the indeterminate state. */
    value?: number | null;
    tone?: Tone;
    size?: 'sm' | 'md';
    label?: string;
  }

  let {
    value = null,
    tone = 'accent',
    size = 'md',
    label,
    class: className,
    ...rest
  }: Props = $props();

  const clamped = $derived(value === null ? null : Math.min(100, Math.max(0, value)));
</script>

<div
  data-an="progress"
  data-tone={tone}
  data-size={size}
  data-indeterminate={clamped === null ? '' : undefined}
  class={cn('an-progress', className)}
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={clamped ?? undefined}
  aria-label={label}
  {...rest}
>
  <div class="an-progress__bar" style={clamped === null ? undefined : `width:${clamped}%`}></div>
</div>

<style>
  .an-progress {
    position: relative;
    width: 100%;
    height: var(--an-progress-h, 6px);
    border-radius: var(--an-radius-full);
    background: var(--an-surface-sunken);
    overflow: hidden;
  }

  .an-progress[data-size='sm'] {
    --an-progress-h: 3px;
  }

  .an-progress__bar {
    height: 100%;
    width: 0;
    border-radius: inherit;
    background: var(--an-accent-emphasis);
    transition: width var(--an-duration-medium-4) var(--an-ease-emphasized);
  }

  .an-progress[data-tone='success'] .an-progress__bar {
    background: var(--an-success);
  }
  .an-progress[data-tone='warning'] .an-progress__bar {
    background: var(--an-warning);
  }
  .an-progress[data-tone='danger'] .an-progress__bar {
    background: var(--an-danger);
  }
  .an-progress[data-tone='info'] .an-progress__bar {
    background: var(--an-info);
  }
  .an-progress[data-tone='neutral'] .an-progress__bar {
    background: var(--an-text);
  }

  .an-progress[data-indeterminate] .an-progress__bar {
    position: absolute;
    inset-block: 0;
    width: 40%;
    transition: none;
    animation: an-progress-sweep 1.6s var(--an-ease-standard) infinite;
  }

  @keyframes an-progress-sweep {
    0% {
      left: -40%;
      width: 40%;
    }
    60% {
      left: 60%;
      width: 55%;
    }
    100% {
      left: 100%;
      width: 25%;
    }
  }
</style>
