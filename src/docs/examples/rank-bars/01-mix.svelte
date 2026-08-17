<!-- One colour for every bar: the categories have no natural order, so darkening the biggest would double-encode the length as hue and burn the only free channel on something the bar already shows. -->
<script lang="ts">
  import { Card, RankBars, Text } from '$lib/index.js';

  const channels = [
    { label: 'Instagram', value: 61200, meta: '+12%' },
    { label: 'TikTok', value: 16800, meta: '+41%' },
    { label: 'LinkedIn', value: 13400, meta: '+8%' },
    { label: 'YouTube', value: 4200, meta: '−3%' },
    { label: 'X', value: 1900, meta: '−11%' },
    { label: 'Threads', value: 900, meta: '+2%' },
    { label: 'Pinterest', value: 400, meta: '0%' }
  ];
</script>

<div class="two">
  <Card>
    <RankBars data={channels} title="Reach by channel" limit={4} />
    <Text variant="caption" as="p" tone="faint">Scaled to the largest row.</Text>
  </Card>

  <Card>
    <RankBars data={channels} title="Share of reach" share limit={4} />
    <Text variant="caption" as="p" tone="faint">Scaled to the total — a different question.</Text>
  </Card>
</div>

<style>
  .two {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--an-space-4);
  }

  .two :global([data-an='card']) {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-3);
  }
</style>
