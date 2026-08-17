<!-- One component for the whole set, because a radio only means something relative to its siblings. The card variant is the phone-friendly one. -->
<script lang="ts">
  import { RadioGroup } from '$lib/index.js';

  let cadence = $state('weekly');
  let mode = $state('review');
</script>

<div class="demo-col">
  <RadioGroup
    bind:value={cadence}
    label="Cadence"
    options={[
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'monthly', label: 'Monthly', disabled: true }
    ]}
  />

  <RadioGroup
    bind:value={mode}
    variant="card"
    label="Publishing mode"
    options={[
      { value: 'review', label: 'Review first', hint: 'Every post waits for your approval' },
      { value: 'auto', label: 'Full autopilot', hint: 'Posts go live on schedule' }
    ]}
  />
</div>
