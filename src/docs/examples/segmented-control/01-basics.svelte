<!-- One pill slides between segments instead of each segment fading its own background — the travelling pill is what ties old and new selection together. -->
<script lang="ts">
  import { SegmentedControl, Text } from '$lib/index.js';

  let range = $state('week');
  let view = $state('grid');
</script>

<div class="demo-col">
  <SegmentedControl
    bind:value={range}
    label="Range"
    options={[
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' }
    ]}
  />

  <SegmentedControl
    bind:value={view}
    fullWidth
    label="View"
    options={[
      { value: 'grid', label: 'Grid' },
      { value: 'list', label: 'List', badge: 12 },
      { value: 'calendar', label: 'Calendar' }
    ]}
  />

  <Text variant="footnote" tone="muted">Selected: {range} · {view}</Text>
</div>
