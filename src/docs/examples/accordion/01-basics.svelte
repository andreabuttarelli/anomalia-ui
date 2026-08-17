<!-- Height, padding and opacity animate together on the emphasized curve, so the section grows instead of popping. -->
<script lang="ts">
  import { Accordion, Text } from '$lib/index.js';

  let open = $state(['brief']);

  const items = [
    { value: 'brief', title: 'Brief', subtitle: 'What the brand sounds like' },
    { value: 'audience', title: 'Audience' },
    { value: 'channels', title: 'Channels' }
  ];

  const bodies: Record<string, string> = {
    brief: 'Warm, concrete, never corporate. Short sentences. No exclamation marks.',
    audience: 'Independent studios in Italy and Spain, 5–20 people, design-led.',
    channels: 'Instagram and LinkedIn weekly, TikTok when there is footage worth cutting.'
  };
</script>

<Accordion bind:open {items} mode="single">
  {#snippet children(value)}
    <Text variant="footnote" tone="muted">{bodies[value]}</Text>
  {/snippet}
</Accordion>
