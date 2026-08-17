<!-- Same layout for "nothing yet" and for "it failed", because to the reader both are "nothing here". The action is the point: an empty state without one is a dead end. -->
<script lang="ts">
  import { Button, Card, EmptyState, toast } from '$lib/index.js';
</script>

<div class="two">
  <Card padding="none">
    <EmptyState
      title="No posts scheduled"
      description="Produce a week from your editorial plan and everything lands here, ready to review."
    >
      {#snippet icon()}
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12" rx="2.5" stroke="currentColor" stroke-width="1.4" />
          <path d="M3 8.5h14M7 3v3M13 3v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
        </svg>
      {/snippet}

      {#snippet actions()}
        <Button size="sm" onclick={() => toast.success('Producing week 35')}>Produce a week</Button>
        <Button size="sm" variant="ghost" onclick={() => toast('Opening the plan')}>View the plan</Button>
      {/snippet}
    </EmptyState>
  </Card>

  <Card padding="none">
    <EmptyState
      tone="error"
      title="Could not load metrics"
      description="Instagram returned 503. The data is fine — the connection is not."
    >
      {#snippet icon()}
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M10 6.5v4M10 13.5h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4" />
        </svg>
      {/snippet}

      {#snippet actions()}
        <Button size="sm" variant="outline" onclick={() => toast('Retrying')}>Try again</Button>
      {/snippet}
    </EmptyState>
  </Card>
</div>

<style>
  .two {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--an-space-3);
  }
</style>
