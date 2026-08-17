<!-- Drag the panel sideways — the Material gesture the web usually omits. The track follows the finger, resists at the ends, and commits on distance or velocity. -->
<script lang="ts">
  import { Tabs, TabPanels, Card, Text } from '$lib/index.js';

  const items = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' }
  ];

  const copy: Record<string, string> = {
    monday: 'Carousel · behind the scenes of the new collection.',
    tuesday: 'Reel · 15s hook, product close-up, call to action.',
    wednesday: 'Single image · founder quote over the studio shot.'
  };

  let day = $state('monday');
</script>

<div class="demo-col">
  <Tabs bind:value={day} {items} label="Days" fullWidth />

  <TabPanels bind:value={day} values={items.map((item) => item.value)}>
    {#snippet panel(value)}
      <Card variant="filled">
        <Text variant="headline" as="h3">{items.find((i) => i.value === value)?.label}</Text>
        <Text variant="footnote" tone="muted">{copy[value]}</Text>
      </Card>
    {/snippet}
  </TabPanels>
</div>
