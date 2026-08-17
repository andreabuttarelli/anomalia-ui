<!--
  ChatAttachment — a file attached to a turn, or staged in the composer.

  Images get a thumbnail, everything else gets a glyph and its extension, because
  a row of identical paperclips tells the user nothing about what they attached.
  The size is formatted here rather than by every caller — "1.4 MB" is a
  presentation concern, and getting it wrong in three places is the default
  outcome otherwise.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';
  import type { ChatFile } from '../../types.js';

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onremove'> {
    file: ChatFile;
    /** Shows the ✕. Omit for a read-only attachment inside a sent message. */
    onremove?: (id: string) => void;
    /** Upload progress 0–100, or `null` when it is done. */
    progress?: number | null;
    size?: 'sm' | 'md';
  }

  let { file, onremove, progress = null, size = 'md', class: className, ...rest }: Props = $props();

  const isImage = $derived(
    Boolean(file.url) && (file.kind?.startsWith('image') || file.kind === 'image')
  );

  const extension = $derived(
    (file.name.includes('.') ? file.name.split('.').pop() : file.kind)?.slice(0, 4).toUpperCase() ??
      'FILE'
  );

  /** Binary units, one decimal, because "1400000 bytes" is not a size. */
  const readableSize = $derived.by(() => {
    if (file.size === undefined) return null;
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = file.size;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    return `${value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
  });
</script>

<div
  data-an="chat-attachment"
  data-size={size}
  data-uploading={progress !== null ? '' : undefined}
  class={cn('an-attach', className)}
  {...rest}
>
  <span class="an-attach__thumb" aria-hidden="true">
    {#if isImage}
      <img src={file.url} alt="" loading="lazy" />
    {:else}
      <span class="an-attach__ext">{extension}</span>
    {/if}
  </span>

  <span class="an-attach__text">
    <span class="an-attach__name" title={file.name}>{file.name}</span>
    {#if readableSize || progress !== null}
      <span class="an-attach__meta">
        {#if progress !== null}{Math.round(progress)}%{:else}{readableSize}{/if}
      </span>
    {/if}
  </span>

  {#if onremove}
    <button
      class="an-attach__remove"
      type="button"
      aria-label={`Remove ${file.name}`}
      onclick={() => onremove?.(file.id)}
    >
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
      </svg>
    </button>
  {/if}

  {#if progress !== null}
    <span class="an-attach__bar" style={`width:${progress}%`} aria-hidden="true"></span>
  {/if}
</div>

<style>
  .an-attach {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    max-width: 240px;
    padding: var(--an-space-1) var(--an-space-2);
    border: 1px solid var(--an-border);
    /* Rounder than a default control: these sit inside the composer slab and
       have to belong to it. */
    border-radius: 12px;
    background: var(--an-surface-sunken);
    font-family: var(--an-font-sans);
    overflow: hidden;
  }

  .an-attach__thumb {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border-radius: 8px;
    background: var(--an-surface);
    overflow: hidden;
  }

  .an-attach[data-size='sm'] .an-attach__thumb {
    width: 22px;
    height: 22px;
  }

  .an-attach__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .an-attach__ext {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 9px;
    letter-spacing: 0;
    color: var(--an-text-muted);
  }

  .an-attach__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.25;
  }

  .an-attach__name {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .an-attach__meta {
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 10px;
    letter-spacing: 0;
    color: var(--an-text-faint);
  }

  .an-attach__remove {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: none;
    border-radius: var(--an-radius-full);
    background: transparent;
    color: var(--an-text-faint);
    cursor: pointer;
    transition: background-color var(--an-duration-short-3) var(--an-ease-standard);
  }

  @media (hover: hover) {
    .an-attach__remove:hover {
      background: var(--an-surface-hover);
      color: var(--an-text);
    }
  }

  /* A filename is something people read to check they attached the right thing,
     so it comes up to a real size on a phone rather than staying at caption
     scale. The metadata beneath it stays subordinate, just legibly so. */
  @media (max-width: 640px) {
    .an-attach {
      max-width: 260px;
    }

    .an-attach__name {
      font-size: 14px;
    }

    .an-attach__meta {
      font-size: 11.5px;
    }
  }

  /* Upload progress as a hairline along the bottom edge — visible, but it does
     not resize the chip mid-upload. */
  .an-attach__bar {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    background: var(--an-accent-emphasis);
    transition: width var(--an-duration-medium-2) var(--an-ease-standard);
  }
</style>
