<!-- Positioned from viewport coordinates, so transformed and overflow-hidden ancestors cannot clip it. It flips when the preferred side does not fit. -->
<script lang="ts">
  import { Popover, Button, Text, Switch } from '$lib/index.js';

  let anchor = $state<HTMLElement | null>(null);
  let open = $state(false);
  let compact = $state(false);
</script>

<div class="demo-row">
  <span bind:this={anchor}>
    <Button variant="outline" onclick={() => (open = !open)}>Display options</Button>
  </span>
</div>

<Popover bind:open {anchor} placement="bottom-start">
  <div style="padding: 12px; display:flex; flex-direction:column; gap:10px">
    <Text variant="caption">Display</Text>
    <Switch bind:checked={compact} label="Compact rows" size="sm" />
    <Switch label="Show thumbnails" size="sm" />
  </div>
</Popover>
