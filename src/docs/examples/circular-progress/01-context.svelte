<!-- The ring changes tone as it fills: accent below 75%, warning past it, danger past 90%. A context meter that stays one colour at 95% has told the user nothing they could not already read. -->
<script lang="ts">
  import { CircularProgress, Slider, Text, Card } from '$lib/index.js';

  let used = $state(38);
  const tokens = $derived(Math.round((used / 100) * 200_000));
</script>

<div class="demo-col">
  <div class="demo-row" style="gap: 32px; align-items: center">
    <CircularProgress value={used} size={84} label="Context used" />
    <CircularProgress value={82} size={64} label="Storage used" />
    <CircularProgress value={96} size={64} label="Quota used" />
    <CircularProgress value={null} size={64} label="Loading" />
    <CircularProgress value={64} size={56} tone="info" label="Fixed tone" />
  </div>

  <Card>
    <div class="row">
      <CircularProgress value={used} size={52} thickness={5} showValue={false} label="Context window">
        <span class="glyph" aria-hidden="true">◧</span>
      </CircularProgress>
      <div>
        <Text variant="footnote">Context window</Text>
        <Text variant="caption" as="p" family="mono" tone="faint">
          {tokens.toLocaleString('en-US')} / 200,000 tokens
        </Text>
      </div>
    </div>

    <Slider bind:value={used} label="Context used" format={(v) => `${v}%`} />
  </Card>
</div>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    margin-bottom: var(--an-space-4);
  }

  .glyph {
    font-size: 14px;
    color: var(--an-text-muted);
  }
</style>
