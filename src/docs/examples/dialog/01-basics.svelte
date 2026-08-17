<!-- Portal, focus trap, scroll lock and Escape handling are already wired. Set `dismissible={false}` for destructive confirmations. -->
<script lang="ts">
  import { Dialog, Button, TextField, toast } from '$lib/index.js';

  let open = $state(false);
  let confirm = $state(false);
  let name = $state('');
</script>

<div class="demo-row">
  <Button onclick={() => (open = true)}>Open dialog</Button>
  <Button variant="danger" onclick={() => (confirm = true)}>Delete brand</Button>
</div>

<Dialog bind:open title="New brand" description="Anomalia will build the first plan automatically.">
  <TextField label="Brand name" bind:value={name} placeholder="Lindaria" />

  {#snippet footer()}
    <Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
    <Button
      onclick={() => {
        open = false;
        toast.success({ title: `${name || 'Brand'} created` });
      }}
    >
      Create
    </Button>
  {/snippet}
</Dialog>

<Dialog
  bind:open={confirm}
  size="sm"
  dismissible={false}
  closable={false}
  title="Delete this brand?"
  description="Every plan, post and asset is removed. This cannot be undone."
>
  {#snippet footer()}
    <Button variant="ghost" onclick={() => (confirm = false)}>Keep it</Button>
    <Button variant="danger" onclick={() => (confirm = false)}>Delete</Button>
  {/snippet}
</Dialog>
