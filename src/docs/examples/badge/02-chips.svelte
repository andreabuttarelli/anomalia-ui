<!-- Chips are the interactive sibling: tap to toggle, with a ripple, a squish and a haptic tick. Removable chips get a trailing ✕. -->
<script lang="ts">
  import { Chip } from '$lib/index.js';

  const filters = ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'];
  let active = $state<string[]>(['Instagram']);
  let tags = $state(['reel', 'carousel']);

  function toggle(name: string) {
    active = active.includes(name) ? active.filter((f) => f !== name) : [...active, name];
  }
</script>

<div class="demo-col">
  <div class="demo-row">
    {#each filters as filter (filter)}
      <Chip selected={active.includes(filter)} onclick={() => toggle(filter)}>{filter}</Chip>
    {/each}
  </div>

  <div class="demo-row">
    {#each tags as tag (tag)}
      <Chip onremove={() => (tags = tags.filter((t) => t !== tag))}>{tag}</Chip>
    {/each}
  </div>
</div>
