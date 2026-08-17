<!-- A crosshair rather than per-point hover: the pointer maps to the nearest column and reads every series at once, which is the comparison the chart exists for. Nulls break the line instead of being interpolated across. -->
<script lang="ts">
  import { Card, LineChart } from '$lib/index.js';

  const weeks = ['W28', 'W29', 'W30', 'W31', 'W32', 'W33', 'W34', 'W35', 'W36', 'W37', 'W38', 'W39'];

  const multi = [
    { id: 'ig', label: 'Instagram', values: [12400, 15100, 14200, 18900, 22400, 21100, 28800, 34200, 31900, 44100, 52300, 61200] },
    { id: 'li', label: 'LinkedIn', values: [4100, 4600, 5200, 5000, 6400, 7100, 6900, 8800, 9400, 10200, 11800, 13400] },
    // The gap is real: TikTok was not connected until W32, and the line says so.
    { id: 'tt', label: 'TikTok', values: [null, null, null, null, 2100, 3400, 4800, 6200, 5900, 8800, 12400, 16800] }
  ];

  const one = [
    { id: 'rate', label: 'Engagement rate', values: [3.1, 3.4, 3.2, 3.9, 4.1, 3.8, 4.4, 4.7, 4.5, 5.2, 5.6, 5.9] }
  ];
</script>

<div class="stack">
  <Card>
    <LineChart series={multi} labels={weeks} title="Reach by channel" height={240} />
  </Card>

  <Card>
    <!-- One series, so no legend and no hue: ink, with a wash under it. -->
    <LineChart
      series={one}
      labels={weeks}
      title="Engagement rate"
      area
      zero={false}
      height={180}
      format={(v) => `${v.toFixed(1)}%`}
    />
  </Card>
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-4);
  }
</style>
