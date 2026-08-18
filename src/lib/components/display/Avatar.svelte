<!--
  Avatar — image with an initials fallback.

  The fallback colour is derived from the name, so the same person keeps the
  same tint everywhere in the app without anyone storing one.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    src?: string | null;
    /** Used for the alt text, the initials and the fallback hue. */
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'circle' | 'rounded';
    /** Presence dot: `online` | `busy` | `offline`. */
    status?: 'online' | 'busy' | 'offline' | null;
    children?: Snippet;
  }

  let {
    src = null,
    name = '',
    size = 'md',
    shape = 'circle',
    status = null,
    class: className,
    children,
    ...rest
  }: Props = $props();

  let failed = $state(false);

  const initials = $derived(
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  );

  // Cheap deterministic hash → hue. Stable across sessions and machines.
  const hue = $derived(
    Array.from(name).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 360, 7)
  );

  const showImage = $derived(Boolean(src) && !failed);
</script>

<span
  data-an="avatar"
  data-size={size}
  data-shape={shape}
  class={cn('an-avatar', className)}
  style={`--an-avatar-hue:${hue}`}
  {...rest}
>
  {#if showImage}
    <img src={src} alt={name || ''} loading="lazy" onerror={() => (failed = true)} />
  {:else if children}
    {@render children()}
  {:else if initials}
    <span class="an-avatar__initials" aria-hidden="true">{initials}</span>
    <span class="an-sr-only">{name}</span>
  {/if}

  {#if status}
    <span class="an-avatar__status" data-status={status} aria-label={status}></span>
  {/if}
</span>

<style>
  .an-avatar {
    position: relative;
    display: inline-grid;
    place-items: center;
    width: var(--an-avatar-size, 40px);
    height: var(--an-avatar-size, 40px);
    flex-shrink: 0;
    border-radius: var(--an-radius-full);
    /* Deterministic per name, but barely tinted: identity without colour
       noise, and the label keeps a >7:1 ratio at any hue. */
    background: hsl(var(--an-avatar-hue, 260) 14% 92%);
    color: hsl(var(--an-avatar-hue, 260) 22% 24%);
    font-family: var(--an-font-sans);
    font-weight: var(--an-weight-semibold);
    font-size: calc(var(--an-avatar-size, 40px) * 0.36);
    letter-spacing: 0.01em;
    user-select: none;
  }

  /* Clipping lives on the children, not on the avatar. `overflow: hidden` here
     would round the image *and* amputate the status dot, which is positioned at
     the corner precisely so it overhangs the circle — the ring around it needs
     to sit outside the silhouette to read as a separate mark rather than as a
     bite taken out of the photo. The background is already clipped by
     `border-radius` with no overflow rule at all. */
  .an-avatar > :not(.an-avatar__status) {
    border-radius: inherit;
  }

  :global([data-theme='dark']) .an-avatar {
    background: hsl(var(--an-avatar-hue, 260) 12% 18%);
    color: hsl(var(--an-avatar-hue, 260) 20% 86%);
  }

  .an-avatar[data-shape='rounded'] {
    border-radius: calc(var(--an-avatar-size, 40px) * 0.28);
  }

  .an-avatar[data-size='xs'] {
    --an-avatar-size: 24px;
  }
  .an-avatar[data-size='sm'] {
    --an-avatar-size: 32px;
  }
  .an-avatar[data-size='lg'] {
    --an-avatar-size: 56px;
  }
  .an-avatar[data-size='xl'] {
    --an-avatar-size: 80px;
  }

  .an-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .an-avatar__initials {
    line-height: 1;
  }

  .an-avatar__status {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 28%;
    height: 28%;
    min-width: 8px;
    min-height: 8px;
    border-radius: var(--an-radius-full);
    /* Ring in the page background so the dot reads on any avatar image. */
    box-shadow: 0 0 0 2px var(--an-surface);
  }

  .an-avatar__status[data-status='online'] {
    background: var(--an-success);
  }
  .an-avatar__status[data-status='busy'] {
    background: var(--an-danger);
  }
  .an-avatar__status[data-status='offline'] {
    background: var(--an-text-faint);
  }

  .an-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
