<!--
  Social mockups — how a produced post looks before it is published.

  These are previews, not clones: they carry the structure a reviewer needs
  (avatar, handle, media ratio, caption, first comment, metrics) in this
  system's own language, rather than imitating each platform's chrome. A
  pixel-perfect fake Instagram would age badly, would confuse a reviewer about
  what is editable, and would put another brand's identity inside ours.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import { page } from '$app/stores';
  import {
    Avatar,
    Badge,
    Button,
    Card,
    Chip,
    Divider,
    IconButton,
    SegmentedControl,
    Sparkline,
    Text,
    toast
  } from '$lib/index.js';

  let channel = $state('instagram');

  const caption =
    'Behind the collection: three weeks in the studio, one afternoon of shooting, and the pieces that made the final cut.';

  const engagement = [8, 12, 10, 18, 22, 19, 28, 34, 31, 44, 52, 61];
</script>

<Seo
  title="Post previews"
  description="How a produced social post looks before it is published: feed post, vertical video and article previews in the system's own language rather than as clones of each platform's chrome."
  pathname={$page.url.pathname}
/>


<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Post previews</h1>
  <p class="doc-page__lead">
    What a produced post looks like before it goes out. These are previews in this system's language,
    not clones of each platform: a reviewer needs the ratio, the crop, the caption and the first
    comment — not a replica of someone else's chrome.
  </p>

  <div class="toolbar">
    <SegmentedControl
      bind:value={channel}
      size="sm"
      label="Channel"
      options={[
        { value: 'instagram', label: 'Instagram' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' }
      ]}
    />
    <Badge variant="soft" tone="warning">Needs review</Badge>
  </div>

  <div class="grid">
    <!-- ── Feed post ──────────────────────────────────────────────────── -->
    <Card padding="none" class="post">
      <div class="post__head">
        <Avatar size="sm" name="Lindaria" />
        <div class="post__id">
          <Text variant="footnote" weight="semibold">lindaria</Text>
          <Text variant="caption" as="p" tone="faint">Milan · paid partnership</Text>
        </div>
        <IconButton label="Post options" size="sm">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="4" cy="10" r="1.3" fill="currentColor" />
            <circle cx="10" cy="10" r="1.3" fill="currentColor" />
            <circle cx="16" cy="10" r="1.3" fill="currentColor" />
          </svg>
        </IconButton>
      </div>

      <div class="media" data-ratio="4-5" aria-hidden="true">
        <span class="media__slide">1/4</span>
        <span class="media__word">Build<br />Different</span>
      </div>

      <div class="post__body">
        <div class="post__actions">
          <span class="glyph" aria-hidden="true">♡</span>
          <span class="glyph" aria-hidden="true">◌</span>
          <span class="glyph" aria-hidden="true">↗</span>
          <Text variant="caption" as="span" tone="faint" family="mono">4:5 · carousel</Text>
        </div>

        <Text variant="footnote">
          <strong>lindaria</strong>
          {caption}
        </Text>

        <div class="tags">
          {#each ['#studio', '#madeinitaly', '#ss26'] as tag (tag)}
            <Chip size="sm">{tag}</Chip>
          {/each}
        </div>
      </div>

      <Divider />

      <div class="post__foot">
        <Text variant="caption" as="p" tone="faint">Scheduled · Mon 18:00</Text>
        <div class="post__foot-actions">
          <Button size="sm" variant="ghost" onclick={() => toast('Opening editor')}>Edit</Button>
          <Button size="sm" onclick={() => toast.success('Approved')}>Approve</Button>
        </div>
      </div>
    </Card>

    <!-- ── Vertical video ─────────────────────────────────────────────── -->
    <Card padding="none" class="post">
      <div class="post__head">
        <Avatar size="sm" name="Lindaria" />
        <div class="post__id">
          <Text variant="footnote" weight="semibold">Reel · studio tour</Text>
          <Text variant="caption" as="p" tone="faint">15s · original audio</Text>
        </div>
        <Badge size="sm" variant="soft" tone="info">Rendering</Badge>
      </div>

      <div class="media media--tall" data-ratio="9-16" aria-hidden="true">
        <span class="media__play">▶</span>
        <span class="media__timeline"><i style="width: 38%"></i></span>
      </div>

      <div class="post__body">
        <Text variant="footnote">Three weeks in the studio, cut to fifteen seconds.</Text>
        <Text variant="caption" as="p" tone="faint" family="mono">9:16 · 1080×1920 · 12.4 MB</Text>
      </div>
    </Card>

    <!-- ── Article post ───────────────────────────────────────────────── -->
    <Card padding="none" class="post">
      <div class="post__head">
        <Avatar size="sm" name="Andrea Buttarelli" shape="rounded" />
        <div class="post__id">
          <Text variant="footnote" weight="semibold">Andrea Buttarelli</Text>
          <Text variant="caption" as="p" tone="faint">Founder at Lindaria · 1st</Text>
        </div>
      </div>

      <div class="post__body">
        <Text variant="footnote">
          We stopped briefing an agency every Monday. Here is what replaced it, and the three things
          that did not survive the change.
        </Text>
        <Text variant="caption" as="p" tone="faint">…see more</Text>
      </div>

      <div class="media media--wide" data-ratio="1.91-1" aria-hidden="true">
        <span class="media__word media__word--small">Ship a month<br />in an afternoon</span>
      </div>

      <Divider />

      <div class="post__foot">
        <Text variant="caption" as="p" tone="faint">Draft · Thu 12:00</Text>
        <Text variant="caption" as="p" tone="faint" family="mono">1.91:1</Text>
      </div>
    </Card>

    <!-- ── Performance ────────────────────────────────────────────────── -->
    <Card class="post post--stats">
      <Text variant="caption" as="p">Last 12 posts</Text>
      <Text variant="title2" numeric>4.71%</Text>
      <Text variant="footnote" tone="muted">Average engagement, trending up</Text>
      <Sparkline values={engagement} area marker label="Engagement trending up over twelve posts" />

      <Divider class="stats__rule" />

      <dl class="stats">
        <div><dt>Reach</dt><dd>184.2k</dd></div>
        <div><dt>Saves</dt><dd>2,140</dd></div>
        <div><dt>Shares</dt><dd>612</dd></div>
      </dl>
    </Card>
  </div>
</div>

<style>
  .doc-page--wide {
    max-width: 1000px;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-3);
    margin: var(--an-space-6) 0 var(--an-space-4);
    flex-wrap: wrap;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--an-space-4);
    align-items: start;
  }

  :global(.post) {
    overflow: hidden;
  }

  .post__head {
    display: flex;
    align-items: center;
    gap: var(--an-space-2);
    padding: var(--an-space-3);
  }

  .post__id {
    min-width: 0;
    flex: 1;
  }

  /* ── Media stand-ins ────────────────────────────────────────────────────
     Ratio boxes rather than photos: the review question is "does this crop
     work", and a stand-in that announces its ratio answers it honestly. */
  .media {
    position: relative;
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 5;
    background:
      radial-gradient(120% 80% at 25% 15%, color-mix(in srgb, var(--an-text) 6%, transparent), transparent 60%),
      linear-gradient(
        160deg,
        color-mix(in srgb, var(--an-text) 14%, var(--an-surface)),
        color-mix(in srgb, var(--an-text) 4%, var(--an-surface))
      );
  }

  .media--tall {
    aspect-ratio: 9 / 16;
  }

  .media--wide {
    aspect-ratio: 1.91 / 1;
  }

  .media__word {
    font-size: 30px;
    line-height: 0.95;
    letter-spacing: -0.04em;
    font-weight: var(--an-weight-bold);
    text-transform: uppercase;
    text-align: center;
    color: var(--an-text);
  }

  .media__word--small {
    font-size: 22px;
  }

  .media__slide {
    position: absolute;
    top: var(--an-space-2);
    right: var(--an-space-2);
    padding: 2px 7px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-inverse);
    color: var(--an-text-inverse);
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: 10px;
    letter-spacing: 0;
  }

  .media__play {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--an-radius-full);
    background: var(--an-surface-glass);
    backdrop-filter: var(--an-glass-blur);
    -webkit-backdrop-filter: var(--an-glass-blur);
    color: var(--an-text);
    font-size: 13px;
  }

  .media__timeline {
    position: absolute;
    left: var(--an-space-3);
    right: var(--an-space-3);
    bottom: var(--an-space-3);
    height: 3px;
    border-radius: var(--an-radius-full);
    background: color-mix(in srgb, var(--an-text) 18%, transparent);
    overflow: hidden;
  }

  .media__timeline i {
    display: block;
    height: 100%;
    background: var(--an-text);
  }

  .post__body {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-2);
    padding: var(--an-space-3);
  }

  .post__actions {
    display: flex;
    align-items: center;
    gap: var(--an-space-3);
  }

  .glyph {
    font-size: 17px;
    line-height: 1;
    color: var(--an-text);
  }

  .post__actions :global([data-an='text']) {
    margin-inline-start: auto;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--an-space-1);
  }

  .post__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--an-space-2);
    padding: var(--an-space-3);
  }

  .post__foot-actions {
    display: flex;
    gap: var(--an-space-1);
  }

  :global(.post--stats) {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-1);
  }

  :global(.stats__rule) {
    margin: var(--an-space-4) 0 !important;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--an-space-3);
    margin: 0;
  }

  .stats dt {
    font-size: var(--an-text-caption-size);
    letter-spacing: var(--an-text-caption-track);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }

  .stats dd {
    margin: 2px 0 0;
    font-size: var(--an-text-headline-size);
    font-weight: var(--an-weight-semibold);
    font-variant-numeric: tabular-nums;
    color: var(--an-text);
  }
</style>
