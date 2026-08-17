<!-- Bars cap at 24px and never fill their band — the leftover is air. Rounded at the data end only, square at the baseline, so a stack reads as one bar growing out of the axis. Hover dims the others rather than tinting the one, so the legend keeps matching. -->
<script lang="ts">
  import { BarChart, Card, SegmentedControl } from '$lib/index.js';

  let mode = $state('stacked');

  const labels = ['W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38'];

  const stacked = [
    { id: 'ig', label: 'Instagram', values: [22, 26, 24, 31, 34, 30, 38, 41] },
    { id: 'li', label: 'LinkedIn', values: [8, 9, 12, 11, 14, 16, 15, 19] },
    { id: 'tt', label: 'TikTok', values: [4, 6, 5, 9, 8, 12, 14, 16] }
  ];

  const single = [{ id: 'posts', label: 'Posts published', values: [34, 41, 41, 51, 56, 58, 67, 76] }];
</script>

<Card>
  <BarChart
    {labels}
    series={mode === 'stacked' ? stacked : single}
    title="Posts published by channel"
    showValues={mode === 'single'}
    height={220}
  >
    {#snippet toolbar()}
      <SegmentedControl
        bind:value={mode}
        size="sm"
        label="Series"
        options={[
          { value: 'stacked', label: 'By channel' },
          { value: 'single', label: 'Total' }
        ]}
      />
    {/snippet}
  </BarChart>
</Card>
