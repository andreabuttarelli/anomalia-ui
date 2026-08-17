<!-- A sparkline answers one question — which way is this going — at the size of a word. No axes, no legend, no tooltip: the moment an exact value matters, it is the wrong chart. -->
<script lang="ts">
  import { Sparkline, Card, Text, Badge } from '$lib/index.js';

  const reach = [12, 18, 14, 22, 26, 21, 34, 30, 41, 38, 52, 61];
  const errors = [4, 3, 6, 2, 8, 14, 9, 18, 22, 16, 25, 31];
</script>

<div class="demo-grid">
  <Card padding="sm">
    <div class="head">
      <Text variant="caption" as="p">Reach</Text>
      <Badge tone="success" variant="soft" size="sm">+18%</Badge>
    </div>
    <Text variant="title3" numeric>184.2k</Text>
    <Sparkline values={reach} area marker label="Reach trending upward over twelve weeks" />
  </Card>

  <Card padding="sm">
    <div class="head">
      <Text variant="caption" as="p">Failed jobs</Text>
      <Badge tone="danger" variant="soft" size="sm">+31</Badge>
    </div>
    <Text variant="title3" numeric>31</Text>
    <Sparkline values={errors} tone="danger" area marker label="Failures rising over twelve weeks" />
  </Card>

  <Card padding="sm">
    <div class="head">
      <Text variant="caption" as="p">Inline</Text>
    </div>
    <Text variant="footnote" tone="muted">
      A sparkline also works at line height, next to the number it belongs to.
    </Text>
    <div class="inline">
      <Text variant="footnote" numeric>4.71%</Text>
      <Sparkline values={reach} height={16} label="Engagement trend" />
    </div>
  </Card>
</div>

<style>
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-2);
    margin-bottom: var(--an-space-1);
  }

  .inline {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: var(--an-space-3);
    margin-top: var(--an-space-3);
  }
</style>
