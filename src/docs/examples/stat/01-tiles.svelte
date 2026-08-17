<!-- A row of figures. The delta names its direction and whether that direction is welcome — churn falling is good news, revenue falling is not, and one prop could not have said both. -->
<script lang="ts">
  import { Card, Stat, StatusDot, Sparkline, Divider } from '$lib/index.js';

  const reach = [8, 12, 10, 18, 22, 19, 28, 34, 31, 44, 52, 61];
</script>

<div class="grid">
  <Card>
    <Stat label="Reach" value="184.2k" delta="+12%" direction="up" hint="vs last week">
      {#snippet chart()}
        <Sparkline values={reach} area label="Reach trending up" />
      {/snippet}
    </Stat>
  </Card>

  <Card>
    <Stat label="Churn" value="1.8" unit="%" delta="−0.4pt" direction="down" hint="vs last month" />
  </Card>

  <Card>
    <Stat label="Revenue" value="€8,240" delta="−6%" direction="down" good={false} hint="vs last month" />
  </Card>

  <Card>
    <Stat label="Queue" value="0" hint="Nothing waiting" />
    <Divider style="margin: 12px 0" />
    <div class="states">
      <StatusDot tone="success" label="All systems normal" />
      <StatusDot tone="info" label="Rendering 3 videos" pulse />
      <StatusDot tone="warning" label="2 posts need copy" />
      <StatusDot tone="danger" label="Instagram token expired" />
    </div>
  </Card>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: var(--an-space-3);
  }

  .states {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
</style>
