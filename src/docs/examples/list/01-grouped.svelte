<!-- The iOS settings pattern. Note the last row: it has a Switch in `trailing` and deliberately no `onclick`, so the two controls never fight over the same tap. -->
<script lang="ts">
  import { List, ListItem, Switch, Avatar, Badge, toast } from '$lib/index.js';

  let autopilot = $state(true);
</script>

<div class="demo-col">
  <List variant="grouped" label="Brands">
    <ListItem title="Lindaria" subtitle="12 posts scheduled" href="/components/list/">
      {#snippet leading()}<Avatar size="sm" name="Lindaria" />{/snippet}
    </ListItem>
    <ListItem title="Teta Studio" subtitle="Plan ready for review" href="/components/list/">
      {#snippet leading()}<Avatar size="sm" name="Teta Studio" />{/snippet}
    </ListItem>
  </List>

  <List variant="grouped" label="Workspace">
    <ListItem title="Plan" value="Weekly" onclick={() => toast('Plan')} chevron />
    <ListItem title="Notifications">
      {#snippet trailing()}<Badge tone="accent">3</Badge>{/snippet}
    </ListItem>
    <ListItem title="Autopilot">
      {#snippet trailing()}<Switch bind:checked={autopilot} />{/snippet}
    </ListItem>
    <ListItem title="Delete workspace" tone="danger" onclick={() => toast.danger('Nothing deleted')} />
  </List>
</div>
