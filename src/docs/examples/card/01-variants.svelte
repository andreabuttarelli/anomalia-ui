<!-- Four surface treatments. `glass` only reads correctly over content — on a flat background it looks like a mistake. -->
<script lang="ts">
  import { Card, CardHeader, CardFooter, Button, Badge, Text } from '$lib/index.js';
</script>

<div class="demo-grid">
  <Card>
    <CardHeader title="Outlined" description="The default: one hairline, no shadow." />
    <Text variant="footnote" tone="muted">Use for most content on a page.</Text>
  </Card>

  <Card variant="elevated">
    <CardHeader title="Elevated" description="Layered soft shadow, no border." />
    <Text variant="footnote" tone="muted">Use when a surface must float.</Text>
  </Card>

  <Card variant="filled">
    <CardHeader title="Filled" description="Raised background, no border." />
    <Text variant="footnote" tone="muted">Use for grouped, secondary blocks.</Text>
  </Card>

  <Card>
    <CardHeader title="With actions">
      {#snippet actions()}
        <Badge tone="success" dot>Live</Badge>
      {/snippet}
    </CardHeader>
    <Text variant="footnote" tone="muted">Header actions sit on the trailing edge.</Text>
    <CardFooter divided>
      <Button variant="ghost" size="sm">Cancel</Button>
      <Button size="sm">Publish</Button>
    </CardFooter>
  </Card>
</div>
