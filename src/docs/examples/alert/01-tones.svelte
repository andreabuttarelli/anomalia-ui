<!-- Alerts stay until the situation changes. Anything transient belongs in a Toast. -->
<script lang="ts">
  import { Alert, Button } from '$lib/index.js';

  let visible = $state(true);
</script>

<div class="demo-col">
  <Alert tone="info" title="Connect a channel">
    Anomalia needs at least one connected account before it can schedule anything.
    {#snippet actions()}
      <Button size="sm" variant="outline">Connect</Button>
    {/snippet}
  </Alert>

  <Alert tone="success" title="Plan produced">Twelve posts are waiting for your review.</Alert>

  <Alert tone="warning" title="Token expiring">
    Your Instagram token expires in three days.
  </Alert>

  {#if visible}
    <Alert tone="danger" title="Publish failed" ondismiss={() => (visible = false)}>
      The channel rejected the last upload. Nothing was posted.
    </Alert>
  {/if}
</div>
