<!-- A rounded slab, not a form field: the textarea is chromeless, focus is only a border-colour shift, and the round send button is the single filled thing in the whole control. Enter sends, Shift+Enter breaks the line, the box grows to 200px and then scrolls. While the agent answers, Send becomes a red Stop in the same place — a stop button somewhere else is one nobody finds in time. -->
<script lang="ts">
  import {
    PromptInput,
    ChatAttachment,
    Button,
    Menu,
    MenuItem,
    IconButton,
    Text,
    toast
  } from '$lib/index.js';

  let value = $state('Plan next week from the brief, keep Thursday free');
  let streaming = $state(false);
  let model = $state('Opus');
  let modelAnchor = $state<HTMLElement | null>(null);
  let modelOpen = $state(false);

  let files = $state([
    { id: 'a', name: 'brand-brief-q3.pdf', size: 284_000, kind: 'pdf' },
    { id: 'b', name: 'moodboard.png', size: 1_420_000, kind: 'image' }
  ]);

  function send(text: string) {
    streaming = true;
    toast({ title: 'Sent', description: text.slice(0, 40) + '…', timeout: 1600 });
    setTimeout(() => (streaming = false), 2600);
  }
</script>

<div class="demo-col">
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
              <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          {/snippet}
        </Button>
      </span>
    {/snippet}
  </PromptInput>

  <Text variant="footnote" tone="muted">
    Model: <strong>{model}</strong> · {streaming ? 'answering…' : 'idle'}
  </Text>
</div>

<Menu bind:open={modelOpen} anchor={modelAnchor} label="Model">
  {#each ['Opus', 'Sonnet', 'Haiku'] as option (option)}
    <MenuItem selected={model === option} onclick={() => (model = option)}>{option}</MenuItem>
  {/each}
</Menu>
