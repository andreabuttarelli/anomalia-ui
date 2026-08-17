<!-- `use:swipe` decides direction in the first few pixels: move mostly across the tracked axis and it hands the gesture back to the browser, so page scrolling never fights it. -->
<script lang="ts">
  import { swipe, haptic, Text } from '$lib/index.js';

  let offset = $state(0);
  let dragging = $state(false);
  let dismissed = $state(false);
  let velocity = $state(0);
</script>

<div class="demo-col">
  {#if dismissed}
    <button class="restore" type="button" onclick={() => { dismissed = false; offset = 0; }}>
      Bring the card back
    </button>
  {:else}
    <div
      class="card"
      data-dragging={dragging ? '' : undefined}
      style={`translate: ${offset}px 0; opacity: ${1 - Math.min(1, Math.abs(offset) / 220)}`}
      use:swipe={{
        axis: 'x',
        guardScroll: false,
        onstart: () => (dragging = true),
        onmove: (state) => {
          offset = state.delta;
          velocity = state.velocity;
        },
        onend: (state) => {
          dragging = false;
          if (Math.abs(state.delta) > 120 || Math.abs(state.velocity) > 0.5) {
            haptic('light');
            dismissed = true;
          } else {
            offset = 0;
          }
        }
      }}
    >
      <Text variant="headline">Swipe me sideways</Text>
      <Text variant="footnote" tone="muted">
        delta {Math.round(offset)}px · velocity {velocity.toFixed(2)} px/ms
      </Text>
    </div>
  {/if}
</div>

<style>
  .card {
    padding: var(--an-space-5);
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
    box-shadow: var(--an-shadow-sm);
    cursor: grab;
    touch-action: pan-y;
    transition:
      translate var(--an-duration-medium-2) var(--an-ease-emphasized),
      opacity var(--an-duration-short-4) var(--an-ease-standard);
  }

  .card[data-dragging] {
    transition: none;
    cursor: grabbing;
  }

  .restore {
    align-self: flex-start;
    padding: var(--an-space-2) var(--an-space-4);
    border: 1px solid var(--an-border-strong);
    border-radius: var(--an-radius-md);
    background: var(--an-surface);
    color: var(--an-text);
    font-family: var(--an-font-sans);
    font-size: var(--an-text-footnote-size);
    cursor: pointer;
  }
</style>
