<!--
  Spinner — Material's indeterminate circular progress: the arc both rotates and
  breathes (dash length oscillates), which is what reads as "working" rather
  than "spinning wheel". Pure CSS, no JS timer.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { Size } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    size?: Size;
    /** Accessible name. Pass `null` for a decorative spinner inside a labelled control. */
    label?: string | null;
  }

  let { size = 'md', label = 'Loading', class: className, ...rest }: Props = $props();
</script>

<span
  data-an="spinner"
  data-size={size}
  class={cn('an-spinner', className)}
  role={label ? 'status' : undefined}
  aria-label={label ?? undefined}
  aria-hidden={label ? undefined : 'true'}
  {...rest}
>
  <svg viewBox="0 0 24 24" fill="none">
    <circle class="an-spinner__track" cx="12" cy="12" r="9" />
    <circle class="an-spinner__arc" cx="12" cy="12" r="9" />
  </svg>
</span>

<style>
  .an-spinner {
    display: inline-flex;
    width: var(--an-spinner-size, 20px);
    height: var(--an-spinner-size, 20px);
    color: currentColor;
  }

  .an-spinner[data-size='sm'] {
    --an-spinner-size: 16px;
  }

  .an-spinner[data-size='lg'] {
    --an-spinner-size: 28px;
  }

  .an-spinner svg {
    width: 100%;
    height: 100%;
    animation: an-spin var(--an-duration-long-4) linear infinite;
  }

  .an-spinner__track {
    stroke: currentColor;
    stroke-width: 2.5;
    opacity: 0.16;
  }

  .an-spinner__arc {
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-dasharray: 56;
    stroke-dashoffset: 14;
    transform-origin: center;
    animation: an-spinner-dash 1.4s var(--an-ease-standard) infinite;
  }

  @keyframes an-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes an-spinner-dash {
    0% {
      stroke-dasharray: 4 52;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 40 16;
      stroke-dashoffset: -12;
    }
    100% {
      stroke-dasharray: 4 52;
      stroke-dashoffset: -55;
    }
  }

  /* Reduced motion still needs a "busy" signal — pulse instead of spin. */
  @media (prefers-reduced-motion: reduce) {
    .an-spinner svg {
      animation: an-spin 2.4s linear infinite;
    }
    .an-spinner__arc {
      animation: none;
      stroke-dasharray: 28 28;
    }
  }
</style>
