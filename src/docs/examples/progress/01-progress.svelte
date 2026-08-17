<!-- Determinate progress eases on the emphasized curve, so a jump from 20% to 80% reads as a move rather than a teleport. -->
<script lang="ts">
  import { Progress, Spinner, Button, Text } from '$lib/index.js';

  let value = $state(28);
</script>

<div class="demo-col">
  <div>
    <Text variant="footnote" tone="muted">Rendering video · {value}%</Text>
    <Progress {value} label="Rendering" />
  </div>

  <Progress value={null} label="Loading" />
  <Progress value={92} tone="success" size="sm" label="Storage" />

  <div class="demo-row">
    <Button size="sm" variant="outline" onclick={() => (value = Math.min(100, value + 24))}>
      Advance
    </Button>
    <Button size="sm" variant="ghost" onclick={() => (value = 8)}>Reset</Button>
    <Spinner />
    <Spinner size="lg" />
  </div>
</div>
