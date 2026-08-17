<!-- Sizes, icon slots, loading and link rendering. A loading button keeps its width and stays at full contrast. -->
<script lang="ts">
  import { Button, IconButton, ButtonGroup } from '$lib/index.js';

  let loading = $state(false);

  function save() {
    loading = true;
    setTimeout(() => (loading = false), 1600);
  }
</script>

<div class="demo-col">
  <div class="demo-row">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
    <Button pill variant="outline">Pill</Button>
  </div>

  <div class="demo-row">
    <Button {loading} onclick={save}>Save changes</Button>
    <Button href="/foundations/" variant="outline">
      Tokens
      {#snippet trailing()}
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M6 3.5L10.5 8L6 12.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      {/snippet}
    </Button>
  </div>

  <ButtonGroup>
    <Button variant="outline">Day</Button>
    <Button variant="outline">Week</Button>
    <Button variant="outline">Month</Button>
  </ButtonGroup>

  <div class="demo-row">
    <IconButton label="Search">
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.6" />
        <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
    </IconButton>
    <IconButton label="Add" variant="solid">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
      </svg>
    </IconButton>
    <IconButton label="More" variant="outline">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <circle cx="4" cy="10" r="1.4" fill="currentColor" />
        <circle cx="10" cy="10" r="1.4" fill="currentColor" />
        <circle cx="16" cy="10" r="1.4" fill="currentColor" />
      </svg>
    </IconButton>
  </div>
</div>
