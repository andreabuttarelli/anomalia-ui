<!--
  AvatarGroup — several people in the space of one and a half.

  Overlapping faces are the standard way to say "these people", and there are
  two things that always go wrong. The first is the ring: without a cutout in
  the same colour as the surface behind, overlapping circles smear into one
  blob. The second is the count: a stack of nine faces is unreadable and
  unclickable, so past `max` this collapses to "+n" — and the names of everyone,
  shown or hidden, stay available to assistive tech.

  It takes people as data rather than as `Avatar` children on purpose: the
  overflow arithmetic has to happen somewhere, and doing it here means callers
  cannot get "+3" wrong while rendering four.
-->
<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import Avatar from './Avatar.svelte';
  import { cn } from '../../utils/cn.js';
  import type { Person } from '../../types.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    people: Person[];
    /** Faces shown before the rest collapse into a count. */
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /** Names beside the stack: the first name alone, or "n here". */
    label?: string | null;
    /** Ring colour — match the surface the stack sits on, or the cutout shows. */
    ring?: string;
  }

  let {
    people,
    max = 3,
    size = 'sm',
    label = null,
    ring = 'var(--an-surface)',
    class: className,
    ...rest
  }: Props = $props();

  const shown = $derived(people.slice(0, max));
  const overflow = $derived(Math.max(0, people.length - shown.length));
  const everyone = $derived(people.map((p) => p.name).join(', '));
</script>

<div
  data-an="avatar-group"
  data-size={size}
  class={cn('an-avatars', className)}
  style={`--an-avatars-ring:${ring}`}
  role="group"
  aria-label={everyone}
  {...rest}
>
  <div class="an-avatars__stack">
    {#each shown as person (person.id ?? person.name)}
      <span class="an-avatars__face">
        <Avatar {size} name={person.name} src={person.avatar} />
      </span>
    {/each}

    {#if overflow > 0}
      <span class="an-avatars__face an-avatars__more" aria-hidden="true">+{overflow}</span>
    {/if}
  </div>

  {#if label}<span class="an-avatars__label">{label}</span>{/if}
</div>

<style>
  .an-avatars {
    display: inline-flex;
    align-items: center;
    gap: var(--an-space-2);
    font-family: var(--an-font-sans);
  }

  .an-avatars__stack {
    display: flex;
    align-items: center;
  }

  /* The cutout. Each face carries a ring in the surface colour so the one
     behind it is visibly behind rather than merged into it. */
  .an-avatars__face {
    display: inline-flex;
    border-radius: var(--an-radius-full);
    box-shadow: 0 0 0 2px var(--an-avatars-ring);
  }

  .an-avatars__face + .an-avatars__face {
    margin-inline-start: -8px;
  }

  .an-avatars[data-size='xs'] .an-avatars__face + .an-avatars__face {
    margin-inline-start: -6px;
  }

  .an-avatars[data-size='lg'] .an-avatars__face + .an-avatars__face {
    margin-inline-start: -12px;
  }

  .an-avatars__more {
    display: inline-grid;
    place-items: center;
    width: var(--an-avatar-size, 32px);
    height: var(--an-avatar-size, 32px);
    background: var(--an-surface-sunken);
    color: var(--an-text-muted);
    font-size: 11px;
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
  }

  .an-avatars[data-size='xs'] .an-avatars__more {
    --an-avatar-size: 24px;
    font-size: 9.5px;
  }
  .an-avatars[data-size='sm'] .an-avatars__more {
    --an-avatar-size: 28px;
    font-size: 10.5px;
  }
  .an-avatars[data-size='lg'] .an-avatars__more {
    --an-avatar-size: 44px;
    font-size: 13px;
  }

  .an-avatars__label {
    font-size: var(--an-text-footnote-size);
    color: var(--an-text-muted);
    white-space: nowrap;
  }
</style>
