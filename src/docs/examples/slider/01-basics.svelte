<!-- Drag it: the thumb grows, a bubble appears above the finger, and every step crossed fires a haptic tick. Arrows, PageUp/Down and Home/End all work. -->
<script lang="ts">
  import { Slider, Text } from '$lib/index.js';

  let budget = $state(240);
  let ratio = $state(3);
</script>

<div class="demo-col">
  <div>
    <Text variant="footnote" tone="muted">Daily budget</Text>
    <Slider bind:value={budget} min={0} max={1000} step={10} label="Daily budget" format={(v) => `€${v}`} />
  </div>

  <div>
    <Text variant="footnote" tone="muted">Posts per week</Text>
    <Slider bind:value={ratio} min={1} max={7} step={1} ticks label="Posts per week" />
  </div>

  <Slider value={40} disabled label="Locked" />
</div>
