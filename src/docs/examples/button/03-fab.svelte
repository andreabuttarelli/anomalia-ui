<!-- The FAB is the one unapologetically Material component. Extended mode animates its label open; `hidden` ducks it out of the way on scroll. -->
<script lang="ts">
  import { Fab, Switch } from '$lib/index.js';

  let hidden = $state(false);
</script>

<div class="demo-col">
  <div class="demo-row">
    <Fab aria-label="Compose">
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    </Fab>

    <Fab label="New post" {hidden}>
      {#snippet icon()}
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      {/snippet}
    </Fab>

    <Fab size="sm" variant="surface" aria-label="Edit">
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
        <path d="M13 3.5l3.5 3.5L7 16.5H3.5V13z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    </Fab>
  </div>

  <Switch bind:checked={hidden} label="Hide the extended FAB" hint="Simulates a scroll-away" />
</div>
