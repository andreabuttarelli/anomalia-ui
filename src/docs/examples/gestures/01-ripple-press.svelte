<!-- The two actions every interactive surface here is built from. Press and hold: the ink stays at full opacity and only fades once the grow animation has landed. -->
<script lang="ts">
  import { ripple, press, haptic, Text } from '$lib/index.js';
</script>

<div class="demo-col">
  <div class="demo-row">
    <div class="tile" use:ripple use:press>
      <Text variant="footnote">ripple + press</Text>
    </div>

    <div class="tile" use:ripple={{ centered: true, color: 'var(--an-accent)', opacity: 0.3 }}>
      <Text variant="footnote">centered, tinted</Text>
    </div>

    <button class="tile tile--btn" use:ripple={{ unbounded: true }} onclick={() => haptic('success')}>
      <Text variant="footnote">unbounded + haptic</Text>
    </button>
  </div>

  <Text variant="footnote" tone="muted">
    Haptics are a no-op where the Vibration API is missing (notably iOS Safari) and under reduced
    motion, so callers never need to feature-detect.
  </Text>
</div>

<style>
  .tile {
    display: grid;
    place-items: center;
    width: 150px;
    height: 92px;
    border: 1px solid var(--an-border);
    border-radius: var(--an-radius-lg);
    background: var(--an-surface);
    color: var(--an-text-muted);
    cursor: pointer;
    user-select: none;
    transition: transform var(--an-duration-short-2) var(--an-ease-standard);
  }

  /* `:global` because `data-pressed` is set at runtime by use:press —
     Svelte cannot see it statically and would prune the rule. */
  .tile:global([data-pressed]) {
    transform: scale(var(--an-press-scale));
  }

  .tile--btn {
    font: inherit;
  }
</style>
