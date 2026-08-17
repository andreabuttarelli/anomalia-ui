<!-- Press and hold: the thumb stretches toward where it is about to travel, then springs into place. A haptic fires on commit, not on press. -->
<script lang="ts">
  import { Switch, Card } from '$lib/index.js';

  let autopilot = $state(true);
  let digest = $state(false);
</script>

<Card>
  <div class="demo-col">
    <Switch bind:checked={autopilot} label="Autopilot" hint="Generate and schedule without asking" />
    <Switch bind:checked={digest} label="Weekly digest" hint="A Monday summary by email" />
    <Switch label="Beta features" size="sm" reverse />
    <Switch label="Enterprise SSO" hint="Available on the Agency plan" disabled />
  </div>
</Card>
