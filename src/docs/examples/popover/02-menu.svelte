<!-- Menu adds the ARIA menu pattern on top of Popover: arrows, Home/End, type-ahead and Tab-to-close, with focus landing on the first item. -->
<script lang="ts">
  import { Menu, MenuItem, IconButton, toast } from '$lib/index.js';

  let anchor = $state<HTMLElement | null>(null);
  let open = $state(false);
</script>

<div class="demo-row">
  <span bind:this={anchor}>
    <IconButton label="Post actions" variant="outline" onclick={() => (open = !open)}>
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <circle cx="4" cy="10" r="1.4" fill="currentColor" />
        <circle cx="10" cy="10" r="1.4" fill="currentColor" />
        <circle cx="16" cy="10" r="1.4" fill="currentColor" />
      </svg>
    </IconButton>
  </span>
</div>

<Menu bind:open {anchor} label="Post actions">
  <MenuItem shortcut="E" onclick={() => toast('Editing')}>Edit caption</MenuItem>
  <MenuItem shortcut="D" onclick={() => toast('Duplicated')}>Duplicate</MenuItem>
  <MenuItem selected onclick={() => toast('Already scheduled')}>Scheduled</MenuItem>
  <MenuItem tone="danger" onclick={() => toast.danger('Deleted')}>Delete</MenuItem>
</Menu>
