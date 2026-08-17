<!-- Faces overlap by a fixed amount and each one carries a ring in the surface colour — without that cutout the circles smear into a single shape. Past `max` the rest become a count, and every name stays in the group's accessible label. -->
<script lang="ts">
  import { AvatarGroup, Card, Text } from '$lib/index.js';

  const team = [
    { id: '1', name: 'Andrea Buttarelli' },
    { id: '2', name: 'Marta Rossi' },
    { id: '3', name: 'Kenji Watanabe' },
    { id: '4', name: 'Lea Fontaine' },
    { id: '5', name: 'Sam Okoro' }
  ];
</script>

<div class="rows">
  <Card>
    <Text variant="caption" as="p">Editing now</Text>
    <AvatarGroup people={team.slice(0, 2)} label="Marta" size="sm" />
  </Card>

  <Card>
    <Text variant="caption" as="p">Whole team</Text>
    <AvatarGroup people={team} max={3} label={`${team.length} here`} />
  </Card>

  <Card variant="filled">
    <Text variant="caption" as="p">On a sunken surface</Text>
    <!-- The ring has to match whatever is actually behind the stack. -->
    <AvatarGroup people={team} max={4} size="lg" ring="var(--an-surface-sunken)" />
  </Card>
</div>

<style>
  .rows {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--an-space-3);
  }

  .rows :global([data-an='card']) {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-3);
  }
</style>
