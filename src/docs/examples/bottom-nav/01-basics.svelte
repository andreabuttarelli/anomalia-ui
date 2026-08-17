<!-- Material 3's active indicator: a pill scales in behind the icon and the glyph lifts a pixel. Items with `href` render as real links. -->
<script lang="ts">
  import { BottomNav } from '$lib/index.js';

  let tab = $state('home');

  const items = [
    { value: 'home', label: 'Home' },
    { value: 'plan', label: 'Plan' },
    { value: 'inbox', label: 'Inbox', badge: 4 },
    { value: 'settings', label: 'Settings', badge: true }
  ];
</script>

<div class="frame">
  <BottomNav bind:value={tab} {items}>
    {#snippet icon(value)}
      {#if value === 'home'}
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M3 9l7-5.5L17 9v7.5H3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
      {:else if value === 'plan'}
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.5" />
          <path d="M3 8h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      {:else if value === 'inbox'}
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
          <path d="M3 5.5h14v9H3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          <path d="M3 6l7 5 7-5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
      {:else}
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5" />
          <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      {/if}
    {/snippet}
  </BottomNav>
</div>

<style>
  .frame {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }
</style>
