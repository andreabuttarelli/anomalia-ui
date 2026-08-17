<!-- The tick is stroked on rather than faded in, and the 20px box carries a 44px hit area with a Material state halo. -->
<script lang="ts">
  import { Checkbox } from '$lib/index.js';

  const channels = ['Instagram', 'TikTok', 'LinkedIn'];
  let picked = $state<string[]>(['Instagram']);

  const all = $derived(picked.length === channels.length);
  const some = $derived(picked.length > 0 && !all);

  function toggle(name: string) {
    picked = picked.includes(name) ? picked.filter((c) => c !== name) : [...picked, name];
  }
</script>

<div class="demo-col">
  <Checkbox
    checked={all}
    indeterminate={some}
    label="All channels"
    onchange={() => (picked = all ? [] : [...channels])}
  />

  <div class="demo-col" style="padding-inline-start: 28px; gap: 12px">
    {#each channels as channel (channel)}
      <Checkbox checked={picked.includes(channel)} label={channel} onchange={() => toggle(channel)} />
    {/each}
  </div>

  <Checkbox label="Auto-publish" hint="Posts go live without review" size="sm" />
  <Checkbox label="Locked" disabled />
</div>
