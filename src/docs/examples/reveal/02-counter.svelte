<!-- The count decelerates into its final digits, which is the part worth reading. Change the value and it animates from where it is, not from zero — a metric that restarts from 0 on every update is a slot machine. -->
<script lang="ts">
  import { Counter, Card, Text, Button, Badge } from '$lib/index.js';

  let impressions = $state(184200);
  let rate = $state(4.71);
</script>

<div class="demo-col">
  <div class="demo-grid">
    <Card padding="sm">
      <Text variant="caption" as="p">Impressions</Text>
      <Text variant="title2" as="p">
        <Counter value={impressions} format={(v) => `${(v / 1000).toFixed(1)}k`} />
      </Text>
      <Badge tone="success" variant="soft" size="sm">+12.4%</Badge>
    </Card>

    <Card padding="sm">
      <Text variant="caption" as="p">Engagement</Text>
      <Text variant="title2" as="p">
        <Counter value={rate} decimals={2} suffix="%" />
      </Text>
      <Badge tone="success" variant="soft" size="sm">+0.8pt</Badge>
    </Card>

    <Card padding="sm">
      <Text variant="caption" as="p">Credits</Text>
      <Text variant="title2" as="p">
        <Counter value={1240} format={(v) => Math.round(v).toLocaleString('en-US')} />
      </Text>
      <Badge tone="warning" variant="soft" size="sm">−320</Badge>
    </Card>
  </div>

  <div class="demo-row">
    <Button
      size="sm"
      variant="outline"
      onclick={() => {
        impressions = Math.round(120000 + Math.random() * 120000);
        rate = Number((3 + Math.random() * 3).toFixed(2));
      }}
    >
      New numbers
    </Button>
  </div>
</div>
