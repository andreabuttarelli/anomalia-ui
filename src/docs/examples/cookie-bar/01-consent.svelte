<!-- Reject is the same size, variant and weight as Accept, at every width. It is a polite region rather than a modal — consent has to be freely given, and a wall you cannot dismiss without choosing is not a choice. -->
<script lang="ts">
  import { CookieBar, Button, Text, toast } from '$lib/index.js';

  let open = $state(false);
</script>

<div class="demo">
  <Button size="sm" variant="outline" onclick={() => (open = true)}>Show the notice</Button>
  <Text variant="footnote" tone="muted">
    It renders fixed to the bottom of the viewport, which is where it lives in a real page.
  </Text>
</div>

<CookieBar
  bind:open
  title="Cookies"
  description="We use cookies to run the site and to understand how it is used."
  settingsLabel="Manage"
  onaccept={() => toast.success('Accepted')}
  onreject={() => toast('Rejected')}
  onsettings={() => toast('Preferences')}
/>

<style>
  .demo {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
    flex-wrap: wrap;
  }
</style>
