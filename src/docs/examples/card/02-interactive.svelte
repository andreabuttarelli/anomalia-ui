<!-- Give a card `href` or `onclick` and it becomes a real link or button: ripple, press squish, elevation on hover, keyboard support. -->
<script lang="ts">
  import { Card, Text, toast } from '$lib/index.js';

  const plans = [
    { id: 'starter', name: 'Starter', price: '€0', note: 'One brand, weekly plan' },
    { id: 'studio', name: 'Studio', price: '€49', note: 'Five brands, daily plan' },
    { id: 'agency', name: 'Agency', price: '€149', note: 'Unlimited brands' }
  ];

  let selected = $state('studio');
</script>

<div class="demo-grid">
  {#each plans as plan (plan.id)}
    <Card
      selected={selected === plan.id}
      onclick={() => {
        selected = plan.id;
        toast({ title: `${plan.name} selected`, timeout: 1600 });
      }}
    >
      <Text variant="caption">{plan.name}</Text>
      <Text variant="title2">{plan.price}</Text>
      <Text variant="footnote" tone="muted">{plan.note}</Text>
    </Card>
  {/each}
</div>
