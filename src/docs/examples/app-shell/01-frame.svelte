<!-- The shell is the only scroll region: the rail and the bar are fixed, `main` scrolls. Bind `scrollElement` and hand it to TopBar so the hairline appears when the content actually moves under it. -->
<script lang="ts">
  import {
    AppShell, TopBar, Sidebar, SidebarSection, SidebarItem,
    Button, IconButton, Breadcrumb, Text, Card, Stat, AvatarGroup, toast
  } from '$lib/index.js';

  let collapsed = $state(false);
  let scroller = $state<HTMLElement | null>(null);

  const nav = [
    { value: 'overview', label: 'Overview' },
    { value: 'content', label: 'Content', badge: 6 },
    { value: 'plan', label: 'Plan' }
  ];
  let current = $state('content');

  const team = [
    { id: '1', name: 'Andrea Buttarelli' },
    { id: '2', name: 'Marta Rossi' }
  ];
</script>

<div class="frame">
  <AppShell bind:scrollElement={scroller} contentWidth="720px">
    {#snippet sidebar()}
      <Sidebar {collapsed} width="200px">
        <SidebarSection label="Workspace" {collapsed}>
          {#each nav as item (item.value)}
            <SidebarItem
              {collapsed}
              label={item.label}
              badge={item.badge}
              current={current === item.value}
              onclick={() => (current = item.value)}
            >
              {#snippet icon()}
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.4" />
                </svg>
              {/snippet}
            </SidebarItem>
          {/each}
        </SidebarSection>
      </Sidebar>
    {/snippet}

    {#snippet header()}
      <TopBar title="Content" eyebrow="Lindaria" scrollElement={scroller}>
        {#snippet leading()}
          <IconButton label="Collapse sidebar" size="sm" onclick={() => (collapsed = !collapsed)}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="14" height="12" rx="2.5" stroke="currentColor" stroke-width="1.4" />
              <path d="M8 4v12" stroke="currentColor" stroke-width="1.4" />
            </svg>
          </IconButton>
        {/snippet}

        {#snippet trailing()}
          <AvatarGroup people={team} size="xs" />
        {/snippet}

        {#snippet actions()}
          <Button size="sm" variant="ghost" onclick={() => toast('Filters')}>Filter</Button>
          <Button size="sm" onclick={() => toast.success('Producing')}>Produce</Button>
        {/snippet}
      </TopBar>
    {/snippet}

    <Breadcrumb items={[{ label: 'Brands', href: '#' }, { label: 'Lindaria', href: '#' }, { label: 'Content' }]} />

    <div class="tiles">
      <Card><Stat label="Scheduled" value="6" hint="This week" /></Card>
      <Card><Stat label="Reach" value="184.2k" delta="+12%" direction="up" /></Card>
      <Card><Stat label="Pending" value="2" hint="Need your copy" /></Card>
    </div>

    {#each ['Monday', 'Wednesday', 'Friday', 'Saturday'] as day (day)}
      <Card class="row">
        <Text variant="footnote" weight="semibold">{day}</Text>
        <Text variant="footnote" tone="muted">
          Behind the collection: three weeks in the studio, one afternoon of shooting.
        </Text>
      </Card>
    {/each}
  </AppShell>
</div>

<style>
  /* The shell is 100dvh by design, so the demo caps it to stay inside the page. */
  .frame {
    height: 460px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    overflow: hidden;
  }

  .frame :global([data-an='app-shell']) {
    height: 100%;
  }

  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--an-space-3);
    margin: var(--an-space-4) 0;
  }

  .frame :global(.row) {
    margin-bottom: var(--an-space-3);
  }
</style>
