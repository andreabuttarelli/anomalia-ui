<!-- One turn of an agent transcript: a compaction rule, attachments, a reasoning aside, three tool calls, then the answer. The user turn is a bubble; the assistant turn is a document, because wrapping long output in a bubble is what makes an agent UI feel like a toy. -->
<script lang="ts">
  import {
    ChatMessage,
    ChatThinking,
    ChatToolCall,
    ChatAttachment,
    ChatCompaction,
    Avatar,
    IconButton,
    toast
  } from '$lib/index.js';

  const brief = { id: 'f1', name: 'brand-brief-q3.pdf', size: 284_000, kind: 'pdf' };
</script>

<div class="thread">
  <ChatCompaction count={18}>
    Earlier the brand voice was agreed as warm and concrete, exclamation marks were ruled out, and
    the three content pillars were fixed. Two shoots are booked for August.
  </ChatCompaction>

  <ChatMessage role="user" timestamp="09:14">
    {#snippet before()}
      <div class="files"><ChatAttachment file={brief} size="sm" /></div>
    {/snippet}
    Plan next week from this brief. Keep Thursday free — we are shooting.
  </ChatMessage>

  <ChatMessage role="assistant" name="Anomalia" timestamp="09:14">
    {#snippet avatar()}<Avatar size="xs" name="Anomalia" />{/snippet}

    {#snippet before()}
      <div class="trace">
        <ChatThinking duration={4.2} preview="Reading the brief, checking the calendar…">
          The brief asks for a warm, concrete voice and no exclamation marks. Thursday is blocked
          for a shoot, so the reel should be scheduled for Friday, when the footage exists.
        </ChatThinking>

        <ChatToolCall name="brief.read" summary="brand-brief-q3.pdf · 4 pages" duration={0.4}>
          {'{ "voice": "warm, concrete", "avoid": ["exclamation marks"], "pillars": 3 }'}
        </ChatToolCall>
        <ChatToolCall name="calendar.check" summary="week=35" duration={1.1}>
          {'{ "blocked": ["2026-08-27"], "reason": "shoot" }'}
        </ChatToolCall>
        <ChatToolCall name="plan.produce" summary="posts=6 channels=ig,li" status="running" />
      </div>
    {/snippet}

    <!-- Rendered markdown: the body styles a full small typographic system —
         headings, lists, tables, code — so a real answer needs no extra CSS. -->
    <p>
      Six posts for week 35, nothing on Thursday. The reel moves to Friday so it can use the shoot
      footage, and Monday opens with the carousel the brief calls for.
    </p>

    <h3>What changed</h3>
    <ul>
      <li>Thursday is now <strong>blocked</strong> — the shoot runs all day.</li>
      <li>The reel is queued behind the footage, not ahead of it.</li>
      <li>Two LinkedIn posts still need your copy before they can be scheduled.</li>
    </ul>

    <table>
      <thead>
        <tr><th>Day</th><th>Channel</th><th>Format</th></tr>
      </thead>
      <tbody>
        <tr><td>Mon</td><td>Instagram</td><td>Carousel</td></tr>
        <tr><td>Wed</td><td>LinkedIn</td><td>Article</td></tr>
        <tr><td>Fri</td><td>Instagram</td><td>Reel</td></tr>
      </tbody>
    </table>

    <p>Re-run it yourself with <code>anomalia weekly-plan lindaria produce --week 0</code>, or:</p>

    <pre><code>{`POST /api/v1/brands/lindaria/weekly-plan
{ "week": 35, "skip": ["2026-08-27"] }`}</code></pre>

    {#snippet actions()}
      <IconButton label="Copy" size="sm" onclick={() => toast('Copied')}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
          <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.4" />
          <path d="M13 7V5.5A1.5 1.5 0 0011.5 4h-6A1.5 1.5 0 004 5.5v6A1.5 1.5 0 005.5 13H7" stroke="currentColor" stroke-width="1.4" />
        </svg>
      </IconButton>
      <IconButton label="Retry" size="sm" onclick={() => toast('Retrying')}>
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" aria-hidden="true">
          <path d="M16 10a6 6 0 11-1.8-4.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path d="M16 3v3.5h-3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </IconButton>
    {/snippet}
  </ChatMessage>

  <ChatMessage role="assistant" name="Anomalia" streaming>
    {#snippet avatar()}<Avatar size="xs" name="Anomalia" />{/snippet}
    Scheduling the six posts and reserving render capacity for Friday
  </ChatMessage>
</div>

<style>
  .thread {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-5);
  }

  .files {
    display: flex;
    justify-content: flex-end;
  }

  /* No gap: the reasoning block and the tool calls each draw their own left
     hairline, so stacking them flush joins the rules into one continuous margin
     line — the agent's working reads as a single passage, not as four widgets. */
  .trace {
    display: flex;
    flex-direction: column;
  }
</style>
