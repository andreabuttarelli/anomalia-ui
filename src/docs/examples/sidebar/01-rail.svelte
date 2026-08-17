<!-- Collapse is a width change on one variable, so nothing unmounts and focus survives it. Collapsed, the labels are clipped rather than removed — a rail of unnamed buttons is what `display: none` would leave behind. -->
<script lang="ts">
  import { Sidebar, SidebarSection, SidebarItem, IconButton, Avatar, Text } from '$lib/index.js';

  let collapsed = $state(false);
  let current = $state('content');

  const main = [
    { value: 'home', label: 'Overview' },
    { value: 'content', label: 'Content', badge: 6 },
    { value: 'plan', label: 'Editorial plan' },
    { value: 'web', label: 'Web', badge: true }
  ];

  const growth = [
    { value: 'seo', label: 'SEO' },
    { value: 'geo', label: 'AI visibility' },
    { value: 'leads', label: 'Leads' }
  ];
</script>

<div class="frame">
  <Sidebar {collapsed} width="220px">
    {#snippet header()}
      <div class="brand" class:tight={collapsed}>
        <Avatar size="sm" name="Lindaria" shape="rounded" />
        {#if !collapsed}<Text variant="footnote" weight="semibold">Lindaria</Text>{/if}
      </div>
    {/snippet}

    <SidebarSection label="Workspace" {collapsed}>
      {#each main as item (item.value)}
        <SidebarItem
          {collapsed}
          label={item.label}
          badge={item.badge}
          current={current === item.value}
          onclick={() => (current = item.value)}
        >
          {#snippet icon()}
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="6" height="6" rx="1.6" stroke="currentColor" stroke-width="1.4" />
              <rect x="11" y="3" width="6" height="6" rx="1.6" stroke="currentColor" stroke-width="1.4" />
              <rect x="3" y="11" width="6" height="6" rx="1.6" stroke="currentColor" stroke-width="1.4" />
              <rect x="11" y="11" width="6" height="6" rx="1.6" stroke="currentColor" stroke-width="1.4" />
            </svg>
          {/snippet}
        </SidebarItem>
      {/each}
    </SidebarSection>

    <SidebarSection label="Growth" {collapsed}>
      {#each growth as item (item.value)}
        <SidebarItem
          {collapsed}
          label={item.label}
          current={current === item.value}
          onclick={() => (current = item.value)}
        >
          {#snippet icon()}
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M3 14l4-4 3 3 6-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          {/snippet}
        </SidebarItem>
      {/each}
    </SidebarSection>

    {#snippet footer()}
      <IconButton
        label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        size="sm"
        onclick={() => (collapsed = !collapsed)}
      >
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
          <rect x="3" y="4" width="14" height="12" rx="2.5" stroke="currentColor" stroke-width="1.4" />
          <path d="M8 4v12" stroke="currentColor" stroke-width="1.4" />
        </svg>
      </IconButton>
    {/snippet}
  </Sidebar>

  <div class="body">
    <Text variant="caption" as="p">Current</Text>
    <Text variant="title3">{[...main, ...growth].find((i) => i.value === current)?.label}</Text>
  </div>
</div>

<style>
  .frame {
    display: flex;
    height: 380px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    min-width: 0;
  }

  .brand.tight {
    justify-content: center;
  }

  .body {
    flex: 1;
    padding: var(--an-space-5);
    background: var(--an-bg);
  }
</style>
