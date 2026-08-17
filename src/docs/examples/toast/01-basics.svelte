<!-- Mount <Toaster /> once at the root, then call toast() from anywhere — including outside components. On a phone, swipe a toast sideways to dismiss it. -->
<script lang="ts">
  import { Button, toast } from '$lib/index.js';
</script>

<div class="demo-row">
  <Button variant="outline" onclick={() => toast('Draft saved')}>Neutral</Button>

  <Button
    variant="outline"
    onclick={() => toast.success({ title: 'Published', description: 'Three posts went live.' })}
  >
    Success
  </Button>

  <Button
    variant="outline"
    onclick={() =>
      toast.danger({
        title: 'Upload failed',
        description: 'The channel rejected the file.',
        timeout: 0,
        action: { label: 'Retry', onclick: () => toast.success('Retrying…') }
      })}
  >
    Persistent + action
  </Button>
</div>
