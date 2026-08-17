<!-- With no image, initials are drawn on a tint derived from the name — so the same person keeps the same colour across the app, with nothing stored. -->
<script lang="ts">
  import { Avatar } from '$lib/index.js';
</script>

<div class="demo-col">
  <div class="demo-row">
    <Avatar size="xs" name="Andrea Buttarelli" />
    <Avatar size="sm" name="Sofia Renzi" />
    <Avatar name="Marco Neri" status="online" />
    <Avatar size="lg" name="Giulia Fabbri" status="busy" />
    <Avatar size="xl" name="Teta Studio" shape="rounded" />
  </div>

  <div class="demo-row">
    <!-- An unreachable host: the image fails, the initials take over. -->
    <Avatar name="Broken image" src="https://example.invalid/missing.png" />
    <Avatar name="Anomalia" shape="rounded" size="lg" />
  </div>
</div>
