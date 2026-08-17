<!-- Label, hint, error and adornments all come from the shared Field wrapper, which owns the id and the aria-describedby wiring. -->
<script lang="ts">
  import { TextField } from '$lib/index.js';

  let email = $state('');
  let handle = $state('anomalia');

  const error = $derived(email && !email.includes('@') ? 'Enter a valid email address' : null);
</script>

<div class="demo-col">
  <TextField label="Workspace" placeholder="Studio name" hint="Shown to your clients" />

  <TextField label="Email" type="email" bind:value={email} placeholder="you@studio.com" {error} />

  <TextField label="Handle" bind:value={handle} size="lg">
    {#snippet leading()}<span>@</span>{/snippet}
    {#snippet trailing()}
      <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true">
        <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    {/snippet}
  </TextField>

  <TextField label="Disabled" value="Locked by your plan" disabled />
</div>
