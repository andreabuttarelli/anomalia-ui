<!-- Native table markup, wrapped. `data-numeric` right-aligns a cell and switches on tabular figures; `data-interactive` makes a row hoverable. The wrapper is a focusable labelled region so a keyboard user can reach a column that is off-screen. -->
<script lang="ts">
  import { Table, Badge, Text, Card } from '$lib/index.js';

  const rows = [
    { day: 'Mon', channel: 'Instagram', format: 'Carousel', reach: 42_180, rate: '5.1%', status: 'Scheduled' },
    { day: 'Wed', channel: 'LinkedIn', format: 'Article', reach: 8_940, rate: '3.8%', status: 'Needs copy' },
    { day: 'Fri', channel: 'Instagram', format: 'Reel', reach: 96_402, rate: '7.4%', status: 'Rendering' },
    { day: 'Sat', channel: 'TikTok', format: 'Reel', reach: 12_060, rate: '2.2%', status: 'Draft' }
  ];

  const tone = (s: string) =>
    s === 'Scheduled' ? 'success' : s === 'Needs copy' ? 'warning' : s === 'Rendering' ? 'info' : 'neutral';
</script>

<Card padding="none">
  <Table label="Week 35 schedule" density="compact">
    <table>
      <caption>Week 35</caption>
      <thead>
        <tr>
          <th scope="col">Day</th>
          <th scope="col">Channel</th>
          <th scope="col">Format</th>
          <th scope="col" data-numeric>Reach</th>
          <th scope="col" data-numeric>Rate</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {#each rows as row (row.day)}
          <tr data-interactive>
            <td><Text variant="footnote" weight="medium">{row.day}</Text></td>
            <td>{row.channel}</td>
            <td>{row.format}</td>
            <td data-numeric>{row.reach.toLocaleString('en-GB')}</td>
            <td data-numeric>{row.rate}</td>
            <td><Badge size="sm" variant="soft" tone={tone(row.status)}>{row.status}</Badge></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Table>
</Card>
