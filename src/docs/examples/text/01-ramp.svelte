<!-- Every variant carries its own tracking and line-height. Tone and weight are separate axes, so a muted heading stays on the ramp. -->
<script lang="ts">
  import { Text } from '$lib/index.js';
</script>

<div class="demo-col">
  <Text variant="display">Autopilot for social</Text>
  <Text variant="title2">Plan, produce, publish</Text>
  <Text variant="body" tone="muted">
    Body copy sits at 15px with a slightly negative tracking — the size the system uses for
    everything that is meant to be read rather than scanned.
  </Text>
  <Text variant="footnote" tone="faint">Footnote · secondary metadata</Text>
  <Text variant="caption">Section label</Text>
  <Text variant="body" numeric>1,284 impressions · 4.7% engagement</Text>
</div>
