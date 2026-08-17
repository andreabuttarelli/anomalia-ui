<!--
  Agent chat mockup — a complete assistant screen built only from library parts:
  transcript, reasoning, tool calls, attachments and composer.

  The context window is shown where it happened, as a compaction rule in the
  transcript, rather than as a percentage in the header. A meter counting to 100
  asks the reader to worry about a number they cannot act on; the line tells them
  the turns above it are now a summary, and opens to show it.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import {
    Avatar,
    Badge,
    Button,
    ChatAttachment,
    ChatCompaction,
    ChatMessage,
    ChatThinking,
    ChatToolCall,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    PromptInput,
    Text,
    toast
  } from '$lib/index.js';

  let value = $state('');
  let streaming = $state(false);
  let model = $state('Opus 5');
  let modelAnchor = $state<HTMLElement | null>(null);
  let modelOpen = $state(false);

  let files = $state([{ id: 'a', name: 'brand-brief-q3.pdf', size: 284_000, kind: 'pdf' }]);

  function send(text: string) {
    streaming = true;
    toast({ title: 'Sent to the agent', description: text.slice(0, 48), timeout: 1800 });
    setTimeout(() => (streaming = false), 2800);
  }
</script>

<Seo
  title="Agent chat mockup"
  description="A full AI agent chat built from library components: transcript, reasoning trace, tool calls, attachments and a composer that knows about streaming — the roundest, lightest corner of the system."
  pathname={$page.url.pathname}
/>


<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Agent chat</h1>
  <p class="doc-page__lead">
    Transcript, reasoning, tool calls, attachments and composer — all library components. This is the
    roundest, lightest corner of the system on purpose: a chat is the one screen where chrome has to
    disappear. Everything the agent did on the way to the answer sits under one hairline in the
    margin, expandable line by line, and the only filled control in the composer is the send button.
  </p>

  <div class="frame">
    <header class="chrome">
      <div class="chrome__id">
        <Avatar size="sm" name="Anomalia" />
        <div>
          <Text variant="footnote" weight="semibold">Anomalia</Text>
          <Text variant="caption" as="p" tone="faint" family="mono">run_8f2c41d</Text>
        </div>
      </div>

      <div class="chrome__end">
        <Badge variant="soft" tone={streaming ? 'info' : 'success'} dot>
          {streaming ? 'Working' : 'Idle'}
        </Badge>

        <IconButton label="Session menu" size="sm">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            <circle cx="4" cy="10" r="1.4" fill="currentColor" />
            <circle cx="10" cy="10" r="1.4" fill="currentColor" />
            <circle cx="16" cy="10" r="1.4" fill="currentColor" />
          </svg>
        </IconButton>
      </div>
    </header>

    <Divider />

    <!-- The composer lives *inside* the scrolling thread as its last child, so
         it is part of the conversation rather than a band bolted under it. A
         chat that ends in a bordered panel reads as two screens glued together. -->
    <div class="thread" data-an-scroll>
      <ChatMessage role="system">Session started · brief attached</ChatMessage>

      <ChatCompaction count={18}>
        Voice agreed as warm and concrete, no exclamation marks. Three content pillars fixed. Two
        shoots booked in August; the second is week 35, Thursday.
      </ChatCompaction>

      <ChatMessage role="user" timestamp="09:14">
        {#snippet before()}
          <div class="files"><ChatAttachment file={files[0]} size="sm" /></div>
        {/snippet}
        Plan next week from this brief. Keep Thursday free — we are shooting.
      </ChatMessage>

      <ChatMessage role="assistant" name="Anomalia" timestamp="09:14">
        {#snippet avatar()}<Avatar size="xs" name="Anomalia" />{/snippet}

        {#snippet before()}
          <div class="trace">
            <ChatThinking duration={4.2} preview="Reading the brief, checking the calendar…">
              The brief asks for a warm, concrete voice and no exclamation marks. Thursday is
              blocked for a shoot, so the reel belongs on Friday, when the footage exists. Six posts
              fits the weekly cadence without crowding the feed.
            </ChatThinking>

            <ChatToolCall name="brief.read" summary="brand-brief-q3.pdf · 4 pages" duration={0.4}>
              {'{ "voice": "warm, concrete", "avoid": ["exclamation marks"], "pillars": 3 }'}
            </ChatToolCall>
            <ChatToolCall name="calendar.check" summary="week=35" duration={1.1}>
              {'{ "blocked": ["2026-08-27"], "reason": "shoot" }'}
            </ChatToolCall>
            <ChatToolCall name="plan.produce" summary="posts=6 channels=ig,li" duration={12.4} />
          </div>
        {/snippet}

        <p>
          Six posts for week 35, nothing on Thursday. The reel moves to Friday so it can use the
          shoot footage, and Monday opens with the carousel the brief asks for.
        </p>
        <p>Two need your copy before they can be scheduled — both LinkedIn.</p>

        {#snippet actions()}
          <IconButton label="Copy" size="sm" onclick={() => toast('Copied')}>
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
              <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.4" />
              <path
                d="M13 7V5.5A1.5 1.5 0 0011.5 4h-6A1.5 1.5 0 004 5.5v6A1.5 1.5 0 005.5 13H7"
                stroke="currentColor"
                stroke-width="1.4"
              />
            </svg>
          </IconButton>
          <IconButton label="Retry" size="sm" onclick={() => toast('Retrying')}>
            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
              <path d="M16 10a6 6 0 11-1.8-4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path
                d="M16 3v3.5h-3.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </IconButton>
        {/snippet}
      </ChatMessage>

      {#if streaming}
        <ChatMessage role="assistant" name="Anomalia" streaming>
          {#snippet avatar()}<Avatar size="xs" name="Anomalia" />{/snippet}
          {#snippet before()}
            <div class="trace">
              <ChatThinking active preview="Reserving render capacity for Friday…" />
              <ChatToolCall name="channel.schedule" summary="ig,li · week=35" status="running" />
            </div>
          {/snippet}
          Scheduling the six posts
        </ChatMessage>
      {/if}

      <div class="composer">
      <PromptInput
        bind:value
        {streaming}
        onsubmit={send}
        onstop={() => (streaming = false)}
        placeholder="Ask Anomalia to plan, write or publish…"
      >
        {#snippet attachments()}
          {#each files as file (file.id)}
            <ChatAttachment {file} onremove={(id) => (files = files.filter((f) => f.id !== id))} />
          {/each}
        {/snippet}

        {#snippet leading()}
          <IconButton label="Attach a file" size="sm" onclick={() => toast('File picker')}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <path
                d="M13 7l-4.5 4.5a2 2 0 002.8 2.8L16 9.6a3.5 3.5 0 10-5-4.9L6.2 9.5a5 5 0 007 7l4-4"
                stroke="currentColor"
                stroke-width="1.4"
                stroke-linecap="round"
              />
            </svg>
          </IconButton>

          <span bind:this={modelAnchor}>
            <Button size="sm" variant="ghost" onclick={() => (modelOpen = !modelOpen)}>
              {model}
              {#snippet trailing()}
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              {/snippet}
            </Button>
          </span>
        {/snippet}
      </PromptInput>
      </div>
    </div>
  </div>
</div>


<Menu bind:open={modelOpen} anchor={modelAnchor} label="Model">
  {#each ['Opus 5', 'Sonnet 5', 'Haiku 4.5'] as option (option)}
    <MenuItem selected={model === option} onclick={() => (model = option)}>{option}</MenuItem>
  {/each}
</Menu>

<style>
  .doc-page--wide {
    max-width: 1000px;
  }

  .frame {
    display: flex;
    flex-direction: column;
    margin-top: var(--an-space-6);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-xl);
    background: var(--an-surface);
    overflow: hidden;
  }

  .chrome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-4);
    padding: var(--an-space-3) var(--an-space-4);
  }

  .chrome__id {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
  }

  .chrome__end {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
  }

  /* One rhythm for the whole transcript: 20px between turns, and nothing else
     dividing them. Rules, alternating backgrounds and per-turn cards all try to
     do the job that the gap already does. */
  .thread {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-5);
    height: 620px;
    overflow-y: auto;
    padding: var(--an-space-6) var(--an-space-5) 0;
    background: var(--an-bg);
  }

  /* Sticky inside the scroller, not docked over it. Being the thread's last
     child means the layout reserves exactly the room it needs — no magic
     bottom padding to keep in sync with the composer's height, which is the
     usual way an overlaid composer ends up clipping the final turn. Earlier
     turns still scroll behind it, fading into the same background, so it reads
     as the bottom edge of the conversation rather than a panel under it. */
  .composer {
    position: sticky;
    bottom: 0;
    margin-top: auto;
    padding: var(--an-space-5) 0 var(--an-space-4);
    background: linear-gradient(to bottom, transparent, var(--an-bg) 20px, var(--an-bg));
  }

  /* A chat is read in a column, not across a monitor. Capping the turns keeps
     the 80% user bubble at a sane width and puts the composer under the text it
     answers, instead of stretching both to the window. */
  .thread > :global(*),
  .composer > :global(*) {
    width: 100%;
    max-width: 720px;
    margin-inline: auto;
  }

  .files {
    display: flex;
    justify-content: flex-end;
  }

  /* No gap: reasoning and tool calls each draw their own left hairline, so
     stacking them flush joins the rules into one continuous margin line. */
  .trace {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 640px) {
    .thread {
      height: 520px;
      padding: var(--an-space-4) var(--an-space-3) 0;
    }

    .composer {
      padding-bottom: var(--an-space-3);
    }
  }
</style>
