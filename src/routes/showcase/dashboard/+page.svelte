<!--
  Dashboard mockup — a realistic product screen built only from library
  components, so the system can be judged as a whole rather than as a grid of
  isolated demos. Nothing here is bespoke CSS beyond layout.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import {
    AppBar,
    Avatar,
    Badge,
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuItem,
    Progress,
    SegmentedControl,
    Switch,
    Tabs,
    Text,
    Tooltip,
    Code,
    Kbd,
    toast
  } from '$lib/index.js';

  let range = $state('7d');
  let tab = $state('queue');
  let autopilot = $state(true);
  let menuAnchor = $state<HTMLElement | null>(null);
  let menuOpen = $state(false);
  let scroller = $state<HTMLElement | null>(null);

  const stats = [
    { label: 'Impressions', value: '184.2k', delta: '+12.4%', tone: 'success' as const },
    { label: 'Engagement', value: '4.71%', delta: '+0.8pt', tone: 'success' as const },
    { label: 'Posts live', value: '38', delta: '6 queued', tone: 'neutral' as const },
    { label: 'Credits', value: '1,240', delta: '−320 this week', tone: 'warning' as const }
  ];

  const queue = [
    { title: 'Carousel · behind the collection', channel: 'Instagram', when: 'Today, 18:00', state: 'Scheduled' },
    { title: 'Reel · studio tour, 15s cut', channel: 'TikTok', when: 'Tomorrow, 09:30', state: 'Rendering' },
    { title: 'Single · founder quote', channel: 'LinkedIn', when: 'Thu, 12:00', state: 'Needs review' },
    { title: 'Story · packaging poll', channel: 'Instagram', when: 'Fri, 17:15', state: 'Scheduled' }
  ];

  const runLog = `12:04:18  plan.produce      week=34 posts=12      ok    1.9s
12:04:20  media.render      reel/studio-tour     ok   38.1s
12:04:58  channel.schedule  ig,tt,li             ok    0.4s
12:04:59  credits.debit     -320                 ok`;

  const activity = [
    { who: 'Anomalia', what: 'produced 12 posts for week 34', when: '2m' },
    { who: 'Sofia Renzi', what: 'approved the LinkedIn set', when: '1h' },
    { who: 'Anomalia', what: 'refreshed keyword strategy', when: '3h' },
    { who: 'Marco Neri', what: 'connected a TikTok account', when: 'Yesterday' }
  ];

  // Sparkline path, drawn from plain numbers so the mockup has no chart dependency.
  const series = [12, 18, 14, 22, 26, 21, 34, 30, 41, 38, 52, 61];
  const spark = series
    .map((v, i) => `${(i / (series.length - 1)) * 100},${34 - (v / 61) * 30}`)
    .join(' ');
</script>

<Seo
  title="Dashboard mockup"
  description="A complete product dashboard assembled only from library parts: app bar, tabs, stat tiles, charts, lists and toasts, with Material press interactions throughout."
  pathname={$page.url.pathname}
/>


<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Dashboard</h1>
  <p class="doc-page__lead">
    A product surface assembled entirely from the library: app bar, tabs, cards, lists, chips,
    switches, menus and toasts. Interactions are the Material set — press it and it presses back.
  </p>

  <div class="frame">
    <div class="frame__scroll" bind:this={scroller}>
      <AppBar title="Lindaria" largeTitle scrollElement={scroller}>
        {#snippet leading()}
          <span class="brand">
            <span class="brand__mark" aria-hidden="true"></span>
          </span>
        {/snippet}
        {#snippet trailing()}
          <Tooltip content="Notifications">
            <IconButton label="Notifications" size="sm">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
                <path
                  d="M6 8a4 4 0 118 0c0 3 1.2 4.2 1.8 4.7.3.2.1.8-.3.8H4.5c-.4 0-.6-.6-.3-.8C4.8 12.2 6 11 6 8z"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linejoin="round"
                />
                <path d="M8.5 16a1.6 1.6 0 003 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
              </svg>
            </IconButton>
          </Tooltip>
          <span bind:this={menuAnchor}>
            <IconButton label="Workspace menu" size="sm" onclick={() => (menuOpen = !menuOpen)}>
              <Avatar size="sm" name="Andrea Buttarelli" />
            </IconButton>
          </span>
        {/snippet}
      </AppBar>

      <div class="screen">
        <div class="screen__toolbar">
          <SegmentedControl
            bind:value={range}
            size="sm"
            label="Range"
            options={[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' }
            ]}
          />
          <div class="screen__toolbar-end">
            <Button size="sm" variant="outline">Export</Button>
            <Button size="sm" onclick={() => toast.success({ title: 'Plan produced', description: '12 posts queued for review.' })}>
              Produce week
            </Button>
          </div>
        </div>

        <div class="stats">
          {#each stats as stat (stat.label)}
            <Card padding="sm">
              <Text variant="caption" as="p">{stat.label}</Text>
              <Text variant="title2" numeric class="stat__value">{stat.value}</Text>
              <Badge tone={stat.tone} variant="soft" size="sm">{stat.delta}</Badge>
            </Card>
          {/each}
        </div>

        <div class="split">
          <Card>
            <div class="card-head">
              <div>
                <Text variant="caption" as="p">Reach</Text>
                <Text variant="title3" as="h2">Last 12 weeks</Text>
              </div>
              <Badge tone="success" variant="soft" dot>Trending</Badge>
            </div>

            <svg class="spark" viewBox="0 0 100 36" preserveAspectRatio="none" role="img" aria-label="Reach trending upward over twelve weeks">
              <polyline points={spark} fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" />
            </svg>

            <div class="meters">
              <div>
                <div class="meter__row">
                  <Text variant="footnote" tone="muted">Instagram</Text>
                  <Text variant="footnote" numeric>68%</Text>
                </div>
                <Progress value={68} size="sm" label="Instagram share" />
              </div>
              <div>
                <div class="meter__row">
                  <Text variant="footnote" tone="muted">TikTok</Text>
                  <Text variant="footnote" numeric>24%</Text>
                </div>
                <Progress value={24} size="sm" label="TikTok share" />
              </div>
              <div>
                <div class="meter__row">
                  <Text variant="footnote" tone="muted">LinkedIn</Text>
                  <Text variant="footnote" numeric>8%</Text>
                </div>
                <Progress value={8} size="sm" label="LinkedIn share" />
              </div>
            </div>
          </Card>

          <Card padding="none">
            <div class="card-head card-head--inset">
              <Text variant="title3" as="h2">Activity</Text>
            </div>
            <Divider />
            <List>
              {#each activity as row (row.what)}
                <ListItem title={row.who} subtitle={row.what} value={row.when}>
                  {#snippet leading()}<Avatar size="sm" name={row.who} />{/snippet}
                </ListItem>
              {/each}
            </List>
          </Card>
        </div>

        <div class="section">
          <Tabs
            bind:value={tab}
            label="Content"
            items={[
              { value: 'queue', label: 'Queue', badge: queue.length },
              { value: 'drafts', label: 'Drafts', badge: 7 },
              { value: 'published', label: 'Published' }
            ]}
          />

          <div class="filters">
            <Chip selected>All channels</Chip>
            <Chip>Instagram</Chip>
            <Chip>TikTok</Chip>
            <Chip>LinkedIn</Chip>
          </div>

          <Card padding="none">
            <List variant="plain">
              {#each queue as item, index (item.title)}
                {#if index > 0}<Divider inset="56px" />{/if}
                <ListItem
                  title={item.title}
                  subtitle={`${item.channel} · ${item.when}`}
                  onclick={() => toast({ title: item.title, timeout: 1600 })}
                >
                  {#snippet leading()}
                    <span class="thumb" aria-hidden="true">{item.channel.slice(0, 2)}</span>
                  {/snippet}
                  {#snippet trailing()}
                    <Badge
                      variant="soft"
                      tone={item.state === 'Needs review' ? 'warning' : item.state === 'Rendering' ? 'info' : 'neutral'}
                    >
                      {item.state}
                    </Badge>
                  {/snippet}
                </ListItem>
              {/each}
            </List>
          </Card>
        </div>

        <Card padding="none">
          <div class="card-head card-head--inset">
            <div>
              <Text variant="caption" as="p">Last run</Text>
              <Text variant="title3" as="h2">run_8f2c41d</Text>
            </div>
            <Badge tone="success" variant="soft" dot>Completed</Badge>
          </div>
          <div class="log">
            <Code variant="block" class="log__block">{runLog}</Code>
          </div>
        </Card>

        <Card variant="filled">
          <div class="autopilot">
            <div>
              <Text variant="headline" as="h2">Autopilot</Text>
              <Text variant="footnote" tone="muted">
                Produce, schedule and publish without waiting for approval. Toggle it with
                <Kbd keys="⌘+⇧+A" size="sm" />.
              </Text>
            </div>
            <Switch bind:checked={autopilot} aria-label="Autopilot" class="autopilot__switch" />
          </div>
        </Card>
      </div>
    </div>
  </div>
</div>

<Menu bind:open={menuOpen} anchor={menuAnchor} label="Workspace">
  <MenuItem selected>Lindaria</MenuItem>
  <MenuItem>Teta Studio</MenuItem>
  <MenuItem shortcut="⌘,">Settings</MenuItem>
  <MenuItem tone="danger">Sign out</MenuItem>
</Menu>

<style>
  .doc-page--wide {
    max-width: 1100px;
  }

  .frame {
    margin-top: var(--an-space-6);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    overflow: hidden;
    background: var(--an-bg);
  }

  .frame__scroll {
    height: 720px;
    overflow-y: auto;
  }

  .brand__mark {
    display: block;
    width: 22px;
    height: 22px;
    border-radius: var(--an-radius-sm);
    background: var(--an-accent);
  }

  .screen {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-6);
    padding: var(--an-space-2) var(--an-space-4) var(--an-space-10);
  }

  .screen__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-3);
    flex-wrap: wrap;
  }

  .screen__toolbar-end {
    display: flex;
    gap: var(--an-space-2);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--an-space-3);
  }

  :global(.stat__value) {
    margin: var(--an-space-1) 0 var(--an-space-2) !important;
  }

  .split {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--an-space-4);
    align-items: start;
  }

  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    margin-bottom: var(--an-space-4);
  }

  .card-head--inset {
    margin: 0;
    padding: var(--an-space-4) var(--an-space-4) var(--an-space-3);
  }

  .spark {
    display: block;
    width: 100%;
    height: 90px;
    color: var(--an-accent-emphasis);
  }

  .meters {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-3);
    margin-top: var(--an-space-4);
  }

  .meter__row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-4);
  }

  .filters {
    display: flex;
    gap: var(--an-space-2);
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }

  .filters::-webkit-scrollbar {
    display: none;
  }

  .thumb {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: var(--an-radius-sm);
    background: var(--an-surface-sunken);
    border: 1px solid var(--an-border);
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-muted);
  }

  .log {
    padding: 0 var(--an-space-4) var(--an-space-4);
  }

  :global(.log__block) {
    /* The log is already inside a card; drop the second border. */
    border: none !important;
    background: var(--an-surface-sunken) !important;
  }

  .autopilot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-6);
  }

  :global(.autopilot__switch) {
    flex-shrink: 0;
  }

  @media (max-width: 860px) {
    .split {
      grid-template-columns: minmax(0, 1fr);
    }
    .frame__scroll {
      height: 600px;
    }
  }
</style>
