<!-- Drag the sheet down: it follows the finger 1:1, the scrim fades with the distance, and release commits on distance OR velocity — a short fast flick dismisses. -->
<script lang="ts">
  import { BottomSheet, Button, List, ListItem, Switch } from '$lib/index.js';

  let open = $state(false);
  let tall = $state(false);
</script>

<div class="demo-col">
  <div class="demo-row">
    <Button onclick={() => (open = true)}>Open sheet</Button>
  </div>

  <Switch bind:checked={tall} label="Half-height sheet" size="sm" />
</div>

<BottomSheet
  bind:open
  height={tall ? 'half' : 'auto'}
  title="Post actions"
  description="Drag down or flick to dismiss"
>
  <List variant="grouped">
    <ListItem title="Edit caption" onclick={() => (open = false)} />
    <ListItem title="Regenerate image" onclick={() => (open = false)} />
    <ListItem title="Schedule for later" onclick={() => (open = false)} />
    <ListItem title="Delete post" tone="danger" onclick={() => (open = false)} />
  </List>
</BottomSheet>
