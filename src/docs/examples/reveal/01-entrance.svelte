<!-- Scroll it out of view and back to see it fire. `index` staggers a group, so a list is dealt rather than dropped — and it runs once, because content that re-animates on every scroll turns reading into a slideshow. -->
<script lang="ts">
  import { Reveal, Card, Text, Button } from '$lib/index.js';

  const rows = [
    { title: 'Editorial plan', body: 'Twelve posts for week 34.' },
    { title: 'Production', body: 'Captions, carousels and cuts.' },
    { title: 'Autopilot', body: 'Approve once, or keep every post in review.' }
  ];

  let run = $state(0);
</script>

<div class="demo-col">
  <div class="demo-row">
    <Button size="sm" variant="outline" onclick={() => (run += 1)}>Replay</Button>
  </div>

  {#key run}
    <Reveal>
      <Text variant="caption" as="p">How it runs</Text>
      <Text variant="title2" as="h3">Three steps, one afternoon</Text>
    </Reveal>

    <div class="demo-grid">
      {#each rows as row, index (row.title)}
        <Reveal {index} y={16}>
          <Card variant="filled">
            <Text variant="headline" as="h4">{row.title}</Text>
            <Text variant="footnote" tone="muted">{row.body}</Text>
          </Card>
        </Reveal>
      {/each}
    </div>
  {/key}
</div>
