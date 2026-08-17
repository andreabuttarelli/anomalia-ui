<!-- The indicator is measured from the active tab and re-measured on resize, so it stays aligned through font loading and reflow. -->
<script lang="ts">
  import { Tabs, Text } from '$lib/index.js';

  let tab = $state('plan');
  let pill = $state('all');
</script>

<div class="demo-col">
  <Tabs
    bind:value={tab}
    label="Sections"
    items={[
      { value: 'plan', label: 'Editorial plan' },
      { value: 'posts', label: 'Posts', badge: 12 },
      { value: 'assets', label: 'Assets' },
      { value: 'settings', label: 'Settings', disabled: true }
    ]}
  />

  <Text variant="footnote" tone="muted">Active section: {tab}</Text>

  <Tabs
    bind:value={pill}
    variant="pill"
    label="Filter"
    items={[
      { value: 'all', label: 'All' },
      { value: 'pending', label: 'Pending' },
      { value: 'published', label: 'Published' }
    ]}
  />
</div>
