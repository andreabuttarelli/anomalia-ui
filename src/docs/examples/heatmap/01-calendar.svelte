<!-- Sequential, so one hue light→dark and never a rainbow. Empty is not zero: a cell with no data gets the surface and a hairline, a real zero gets the first ramp step — painting both alike turns "not measured" into "nothing happened". -->
<script lang="ts">
  import { Card, Heatmap } from '$lib/index.js';

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeks = Array.from({ length: 20 }, (_, i) => `W${20 + i}`);

  // A plausible publishing rhythm: busy midweek, quiet at weekends, and the
  // last fortnight not yet planned.
  const cells = weeks.flatMap((week, w) =>
    days.map((day, d) => ({
      x: week,
      y: day,
      value:
        w > 17
          ? null
          : d >= 5
            ? Math.round(Math.random() * 1.4)
            : Math.round(Math.random() * 3 + (d === 2 ? 2 : 0))
    }))
  );
</script>

<Card>
  <Heatmap {cells} columns={weeks} rows={days} title="Publishing rhythm" unit="posts" />
</Card>
