<!-- Scroll the box below: the bar frosts over as soon as content passes under it, and the large title collapses into the compact one. -->
<script lang="ts">
  import { AppBar, IconButton, List, ListItem } from '$lib/index.js';

  let scroller = $state<HTMLElement | null>(null);
</script>

<div class="frame">
  <div class="frame__scroll" bind:this={scroller}>
    <AppBar title="Content" largeTitle scrollElement={scroller}>
      {#snippet leading()}
        <IconButton label="Back" size="sm">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
            <path d="M12 4L6.5 10L12 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </IconButton>
      {/snippet}
      {#snippet trailing()}
        <IconButton label="Filter" size="sm">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
            <path d="M3 5.5h14M6 10h8M8.5 14.5h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </IconButton>
      {/snippet}
    </AppBar>

    <List>
      {#each ['Carousel · collection', 'Reel · studio tour', 'Single · founder quote', 'Story · poll', 'Carousel · FAQ', 'Reel · packaging', 'Single · testimonial'] as item, index (item)}
        <ListItem title={item} subtitle={`Scheduled for day ${index + 1}`} href="/components/app-bar/" />
      {/each}
    </List>
  </div>
</div>

<style>
  .frame {
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
    background: var(--an-surface);
  }

  .frame__scroll {
    height: 320px;
    overflow-y: auto;
  }
</style>
