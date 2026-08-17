<!-- Mono is the font of machine-authored fact: ids, paths, timestamps, shortcuts. It sits on the same x-height as Inter because `font-size-adjust` normalises whatever mono actually resolves. -->
<script lang="ts">
  import { Code, Kbd, Text, List, ListItem, Badge } from '$lib/index.js';
</script>

<div class="demo-col">
  <Text>
    The plan is written to <Code>brands/lindaria/plan.json</Code> and the run is tagged
    <Code tone="muted">run_8f2c41d</Code>. Press <Kbd keys="⌘+K" /> to jump to it.
  </Text>

  <List variant="grouped">
    <ListItem title="Produce week 34" value="12.4s">
      {#snippet leading()}<Badge tone="success" variant="soft" size="sm">ok</Badge>{/snippet}
    </ListItem>
    <ListItem title="Render reel · studio tour" value="38.1s">
      {#snippet leading()}<Badge tone="info" variant="soft" size="sm">run</Badge>{/snippet}
    </ListItem>
  </List>

  <Text variant="footnote" tone="muted" family="mono">
    2026-08-17T09:14:22Z · queue=6 · credits=1240
  </Text>
</div>
