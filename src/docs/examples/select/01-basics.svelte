<!-- A styled native select. The closed state is ours; the open state is the platform's — a wheel on iOS, a dialog on Android. -->
<script lang="ts">
  import { Select } from '$lib/index.js';

  let channel = $state('instagram');
  let tone = $state('');
</script>

<div class="demo-col">
  <Select
    label="Channel"
    bind:value={channel}
    options={[
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'youtube', label: 'YouTube', disabled: true }
    ]}
  />

  <Select label="Tone of voice" bind:value={tone} placeholder="Pick a tone" hint="Applied to every generated caption">
    <optgroup label="Warm">
      <option value="friendly">Friendly</option>
      <option value="playful">Playful</option>
    </optgroup>
    <optgroup label="Formal">
      <option value="expert">Expert</option>
      <option value="institutional">Institutional</option>
    </optgroup>
  </Select>
</div>
