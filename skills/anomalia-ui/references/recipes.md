# Recipes

Scaffolds for the screens that come up constantly. Copy one, replace the
content, delete what you do not need. Each is composed only from library
exports and tokens — no bespoke CSS beyond layout, which is the standard the
system holds itself to.

## Contents

- [App shell](#app-shell)
- [Page header](#page-header)
- [Form](#form)
- [List / settings screen](#list--settings-screen)
- [Dashboard section](#dashboard-section)
- [Dialog vs bottom sheet](#dialog-vs-bottom-sheet)
- [Empty state](#empty-state)
- [Marketing section](#marketing-section)
- [Technical / log surface](#technical--log-surface)
- [Agent chat](#agent-chat)
- [Theming an app](#theming-an-app)

## App shell

Mount the provider and the toaster once, at the root. The theme script belongs
in `app.html`: `ThemeProvider` runs after hydration, which is one frame too late
to prevent a flash of the wrong theme on first paint.

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '@anomalia/ui/styles.css';
  import { ThemeProvider, Toaster, SkipLink } from '@anomalia/ui';

  let { children } = $props();
</script>

<ThemeProvider>
  <div class="an-app">
    <SkipLink href="#main" />
    <main id="main" tabindex="-1">
      {@render children()}
    </main>
  </div>
  <Toaster />
</ThemeProvider>
```

`.an-app` is the opt-in page shell: canvas colour, type defaults, font
smoothing. The library styles nothing outside its own components without it,
which is why dropping the package into an existing app never changes that app's
own markup.

### Shell surfaces

Three surfaces, deliberately: the rail is `--an-surface-rail` (a step back), the
bar is `--an-surface-glass` over it, and the content is `--an-bg`. That is why
`TopBar` keeps its hairline at all times rather than fading it in on scroll —
the line is separating real things from the first pixel. Only reach for
`divider="scroll"` when a bar sits directly on the content surface with nothing
under it yet.

The current `SidebarItem` lifts *forward* onto `--an-surface`: on a recessed
rail, the page you are on is the one part that is not recessed. Do not replace
that with a tinted pill — it fights the rail's own tint, and the item already
carries weight and an accent bar besides.

Never hard-code the bar height. `TopBar` sets `--an-topbar-h`, and the rail's
header block reads it so the two line up; a shell that measures `56px` in four
places drifts the first time one of them changes.

## Page header

```svelte
<script lang="ts">
  import { Text, Button } from '@anomalia/ui';
</script>

<header class="page-head">
  <div>
    <Text variant="caption" as="p">Content</Text>
    <Text variant="title1" as="h1">Editorial plan</Text>
    <Text variant="callout" tone="muted">Twelve posts for week 34.</Text>
  </div>
  <Button>Produce week</Button>
</header>

<style>
  .page-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    margin-bottom: var(--an-space-8);
  }
</style>
```

## Form

`Field` owns the ids, so labels, hints and errors are wired to the control
rather than merely sitting next to it. Pass `error` and the field flips to the
danger treatment and announces itself — do not render your own error paragraph.

```svelte
<script lang="ts">
  import { TextField, Textarea, Select, Switch, Button, Card, toast } from '@anomalia/ui';

  let name = $state('');
  let email = $state('');
  let tone = $state('friendly');
  let autopilot = $state(false);

  const emailError = $derived(email && !email.includes('@') ? 'Enter a valid email' : null);

  function save(event: SubmitEvent) {
    event.preventDefault();
    toast.success({ title: 'Saved' });
  }
</script>

<Card>
  <form class="form" onsubmit={save}>
    <TextField label="Brand name" bind:value={name} required />
    <TextField label="Email" type="email" bind:value={email} error={emailError} />
    <Select
      label="Tone of voice"
      bind:value={tone}
      options={[
        { value: 'friendly', label: 'Friendly' },
        { value: 'expert', label: 'Expert' }
      ]}
    />
    <Textarea label="Brief" autosize counter maxlength={280} hint="What the brand sounds like" />
    <Switch bind:checked={autopilot} label="Autopilot" hint="Publish without review" />

    <div class="form__actions">
      <Button variant="ghost" type="button">Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Card>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-5);
  }

  .form__actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--an-space-2);
  }
</style>
```

## List / settings screen

Note the last row: it has a `Switch` in `trailing` and deliberately **no**
`onclick`. A row that is itself a button, containing a control that is also a
button, produces two overlapping targets and an ambiguous tap.

```svelte
<script lang="ts">
  import { List, ListItem, Switch, Avatar, Badge } from '@anomalia/ui';

  let notifications = $state(true);
</script>

<List variant="grouped" label="Workspace">
  <ListItem title="Lindaria" subtitle="12 posts scheduled" href="/brands/lindaria">
    {#snippet leading()}<Avatar size="sm" name="Lindaria" />{/snippet}
  </ListItem>

  <ListItem title="Plan" value="Weekly" href="/plan" />

  <ListItem title="Inbox">
    {#snippet trailing()}<Badge tone="accent">3</Badge>{/snippet}
  </ListItem>

  <ListItem title="Notifications">
    {#snippet trailing()}<Switch bind:checked={notifications} aria-label="Notifications" />{/snippet}
  </ListItem>
</List>
```

## Dashboard section

Stat tiles: label first, because the number means nothing without it, and
`numeric` so a row of tiles aligns.

```svelte
<script lang="ts">
  import { Card, Text, Badge, Tabs, Chip, Progress } from '@anomalia/ui';

  const stats = [
    { label: 'Impressions', value: '184.2k', delta: '+12.4%', tone: 'success' as const },
    { label: 'Credits', value: '1,240', delta: '−320', tone: 'warning' as const }
  ];

  let tab = $state('queue');
</script>

<div class="stats">
  {#each stats as stat (stat.label)}
    <Card padding="sm">
      <Text variant="caption" as="p">{stat.label}</Text>
      <Text variant="title2" numeric>{stat.value}</Text>
      <Badge tone={stat.tone} variant="soft" size="sm">{stat.delta}</Badge>
    </Card>
  {/each}
</div>

<Tabs bind:value={tab} label="Content" items={[
  { value: 'queue', label: 'Queue', badge: 4 },
  { value: 'published', label: 'Published' }
]} />

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--an-space-3);
  }
</style>
```

## Dialog vs bottom sheet

Same decision, two surfaces. A centred modal is a poor thumb target, so branch
on the viewport rather than picking one for both.

```svelte
<script lang="ts">
  import { Dialog, BottomSheet, Button, mediaQuery, breakpoint } from '@anomalia/ui';

  const isPhone = mediaQuery(breakpoint.phone);
  let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Post actions</Button>

{#if isPhone.current}
  <BottomSheet bind:open title="Post actions">
    <!-- rows -->
  </BottomSheet>
{:else}
  <Dialog bind:open title="Post actions">
    <!-- rows -->
    {#snippet footer()}
      <Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
      <Button onclick={() => (open = false)}>Confirm</Button>
    {/snippet}
  </Dialog>
{/if}
```

For a destructive confirmation, set `dismissible={false}` — the dialog then
becomes an `alertdialog`, and Escape and scrim taps no longer resolve a decision
the user has not made.

## Empty state

Short. An empty state that needs three paragraphs is a design problem, not a
copy problem.

```svelte
<script lang="ts">
  import { Text, Button } from '@anomalia/ui';
</script>

<div class="empty">
  <Text variant="headline" as="h2" align="center">No posts yet</Text>
  <Text variant="footnote" tone="muted" align="center">
    Connect a channel and Anomalia writes the first plan.
  </Text>
  <Button size="sm">Connect a channel</Button>
</div>

<style>
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--an-space-3);
    padding: var(--an-space-12) var(--an-space-4);
  }
</style>
```

## Marketing section

The register that scales up: `display` type, uppercase micro-labels, hairline
columns, one inverted band per page at most.

```svelte
<script lang="ts">
  import { Text, Button } from '@anomalia/ui';
</script>

<section class="hero">
  <Text variant="caption" as="p">Social media autopilot</Text>
  <Text variant="display" as="h1">Ship a month of content in an afternoon.</Text>
  <Text variant="callout" tone="muted">You keep the veto.</Text>
  <div class="hero__actions">
    <Button size="lg">Start free</Button>
    <Button size="lg" variant="outline">Watch a run</Button>
  </div>
</section>

<dl class="specs">
  <div><dt>Channels</dt><dd>IG · TikTok · LinkedIn</dd></div>
  <div><dt>Latency</dt><dd>Plan in &lt; 90s</dd></div>
</dl>

<style>
  .hero__actions {
    display: flex;
    gap: var(--an-space-3);
    margin-top: var(--an-space-6);
  }

  .specs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    margin: var(--an-space-10) 0 0;
    border-top: 1px solid var(--an-border);
  }

  .specs > div {
    padding: var(--an-space-4);
    border-inline-start: 1px solid var(--an-border);
  }

  .specs > div:first-child {
    border-inline-start: none;
    padding-inline-start: 0;
  }

  dt {
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  /* Spec values are machine facts, so they take the mono voice. */
  dd {
    margin: var(--an-space-1) 0 0;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-footnote-size);
    color: var(--an-text);
  }
</style>
```

## Technical / log surface

Where mono earns its place. `Code variant="block"` scrolls horizontally rather
than wrapping, because a wrapped log line is a misread log line.

```svelte
<script lang="ts">
  import { Card, Text, Badge, Code, Kbd } from '@anomalia/ui';

  const log = `12:04:18  plan.produce   week=34 posts=12   ok   1.9s
12:04:20  media.render   reel/studio-tour   ok  38.1s`;
</script>

<Card padding="none">
  <div class="head">
    <div>
      <Text variant="caption" as="p">Last run</Text>
      <Text variant="title3" as="h2">run_8f2c41d</Text>
    </div>
    <Badge tone="success" variant="soft" dot>Completed</Badge>
  </div>
  <div class="body">
    <Code variant="block">{log}</Code>
    <Text variant="footnote" tone="muted">Re-run with <Kbd keys="⌘+R" size="sm" />.</Text>
  </div>
</Card>

<style>
  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-4);
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-3);
    padding: 0 var(--an-space-4) var(--an-space-4);
  }
</style>
```

Note the heading: the run id is set in **sans**, with the machine form used
inside the log below it. Mono never sets a heading.

## Agent chat

The chat is the roundest, lightest corner of the system, and that is deliberate:
it is the one screen where a person is reading continuously, so every border you
add is something they have to look past. Three rules carry most of it.

**Nothing gets a card.** The composer is a 22px slab, the user turn is a filled
bubble, and everything else — reasoning, tool calls, the compaction rule — is
marked by a hairline or a pill. If you find yourself wrapping a turn in `Card`,
you are building a feed, not a conversation.

**The agent's working goes in the margin.** `ChatThinking` and `ChatToolCall`
share one form — a left hairline and a line of small type. Stack them in a
zero-gap column and their rules join into a single continuous line, so a
reasoning-then-tools sequence reads as one passage instead of four widgets.
Never reach for a chip or a card here: a pill truncates the argument that made
the call worth reading. Give either component children only when there is
genuinely something to inspect; without children they are inert and not
focusable, which is correct — a button that expands nothing wastes a tab stop.

**Show a filling context window as `ChatCompaction`, never as a percentage.** A
ring counting toward 100 asks the reader to worry about a number they cannot act
on. The rule states what actually happened — these turns are a summary now — and
opens to show it.

```svelte
<script lang="ts">
  import {
    ChatMessage, ChatThinking, ChatToolCall, ChatAttachment,
    ChatCompaction, PromptInput, IconButton, Avatar
  } from '@anomalia/ui';

  let value = $state('');
  let streaming = $state(false);
</script>

<div class="thread">
  <ChatCompaction count={18}>Voice agreed as warm and concrete. Three pillars fixed.</ChatCompaction>

  <ChatMessage role="user" timestamp="09:14">Plan next week from this brief.</ChatMessage>

  <ChatMessage role="assistant" name="Anomalia" timestamp="4.2s">
    {#snippet avatar()}<Avatar size="xs" name="Anomalia" />{/snippet}

    {#snippet before()}
      <div class="trace">
        <ChatThinking duration={4.2} preview="Reading the brief, checking the calendar…">
          Thursday is blocked for a shoot, so the reel belongs on Friday.
        </ChatThinking>
        <ChatToolCall name="brief.read" summary="brand-brief-q3.pdf · 4 pages" duration={0.4}>
          {'{ "voice": "warm, concrete", "pillars": 3 }'}
        </ChatToolCall>
        <ChatToolCall name="plan.produce" summary="posts=6 channels=ig,li" status="running" />
      </div>
    {/snippet}

    <p>Six posts for week 35, nothing on Thursday.</p>

    {#snippet actions()}
      <IconButton label="Copy" size="sm">…</IconButton>
    {/snippet}
  </ChatMessage>
</div>

<PromptInput bind:value {streaming} onsubmit={(t) => send(t)} onstop={() => (streaming = false)}>
  {#snippet leading()}
    <IconButton label="Attach a file" size="sm">…</IconButton>
  {/snippet}
</PromptInput>

<style>
  .thread {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-5);
  }

  /* No gap: each block draws its own left hairline, so stacking them flush
     joins the rules into one continuous margin line. */
  .trace {
    display: flex;
    flex-direction: column;
  }
</style>
```

Details worth not re-deriving:

- **`timestamp` sits inside the action row**, not in a corner, and is styled like
  the icons beside it. It takes any short string — a clock time on a user turn,
  an elapsed duration on an assistant turn, which is the more useful of the two.
- **Action icons rest at 0.45 opacity, not 0.** Hiding them until hover means a
  first-time reader never learns they exist. `ChatMessage` handles this, and sets
  `--an-icon-btn-size: 28px` / `--an-icon-btn-radius: 8px` on the row, so a plain
  `IconButton` lands at the right size without props.
- **Buttons in `leading` / `trailing` inherit the composer's shape** the same way,
  through `--an-icon-btn-radius` and `--an-btn-radius`. Do not restyle them.
- **The message body already styles rendered markdown** — headings, lists, tables,
  `pre`, blockquotes, inline code, and images capped at 220px. Drop the HTML from
  your renderer straight in; do not add prose CSS on top of it.
- **Focus on the composer is a border-colour change, and that is finished work.**
  Adding a ring on top of a slab that round reads as an error state.
- **Put the composer inside the scrolling thread, as its last child.** It ships
  without a shadow for this reason: it is meant to be the bottom edge of the
  conversation, not a panel under it. Make it `position: sticky; bottom: 0` on
  the same background the turns scroll on, with a short `transparent → bg`
  gradient so earlier turns fade out behind it. Being in flow means the layout
  reserves exactly the height it needs — the overlay version needs a magic
  bottom padding on the thread, and the moment an attachment chip makes the
  composer taller, that number is wrong and the last turn is clipped.

  ```css
  .thread {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 0;
    background: var(--an-bg);
  }
  .composer {
    position: sticky;
    bottom: 0;
    margin-top: auto;
    padding: var(--an-space-5) 0 var(--an-space-4);
    background: linear-gradient(to bottom, transparent, var(--an-bg) 20px, var(--an-bg));
  }
  ```
- **Check it in one hand before you call it done.** Every piece of small type in
  this set steps up under 640px — margin notes to 12.5px, traces to 13.5px, body
  to 15px, and the user bubble widens to 92% because 80% of a phone leaves a
  useless sliver. If you add your own small text to a chat, give it the same
  treatment: secondary is a reason to be quiet, not to be illegible.

## Theming an app

Override the semantic layer once, at `:root`. Everything downstream follows,
including components you have not written yet.

```css
:root {
  /* Point the interactive colour at a hue instead of ink. */
  --an-accent: #1d4ed8;
  --an-accent-emphasis: #1d4ed8;
  --an-on-accent: #ffffff;

  /* Softer geometry. */
  --an-radius-md: 10px;
  --an-radius-lg: 14px;

  /* Opt out of the press squish entirely. */
  --an-press-scale: 1;
}
```

After any such change, run `npm run audit:contrast`. Pointing the interactive
colour at a hue is exactly the change that can drop a control fill or a focus
ring below 3:1, and the audit is the only thing that will tell you before a user
does.
