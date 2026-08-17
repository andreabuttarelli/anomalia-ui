<!-- Five variants covering the whole hierarchy of a screen: one primary action, everything else quieter. -->
<script lang="ts">
  import { Button } from '$lib/index.js';
</script>

<div class="demo-row">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Delete</Button>
  <Button disabled>Disabled</Button>
</div>
