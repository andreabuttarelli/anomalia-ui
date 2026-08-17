<!-- Hover or focus a button. On a touch device this renders nothing at all — which is why the information here is never the only copy of it. -->
<script lang="ts">
  import { Tooltip, IconButton, Button } from '$lib/index.js';
</script>

<div class="demo-row">
  <Tooltip content="Regenerate this post with the current brief">
    <IconButton label="Regenerate" variant="outline">
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M16 10a6 6 0 11-1.8-4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <path d="M16 3v3.5h-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </IconButton>
  </Tooltip>

  <Tooltip content="Publishes immediately to every connected channel" placement="right">
    <Button variant="outline">Publish now</Button>
  </Tooltip>

  <Tooltip content="Appears below instead" placement="bottom" delay={200}>
    <Button variant="ghost">Faster tooltip</Button>
  </Tooltip>
</div>
