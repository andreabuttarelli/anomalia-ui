<!-- Three states, not two: a plain light/dark switch silently drops "follow my OS", which is what most people actually want. -->
<script lang="ts">
  import { ThemeToggle, theme, Text, Card } from '$lib/index.js';
</script>

<Card>
  <div class="demo-col">
    <ThemeToggle />
    <ThemeToggle variant="icon" />
    <Text variant="footnote" tone="muted">
      Chosen mode: <strong>{theme.mode}</strong> · painted: <strong>{theme.resolved}</strong>
    </Text>
  </div>
</Card>
