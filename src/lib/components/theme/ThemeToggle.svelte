<!--
  ThemeToggle — light / dark / system.

  The three-way segmented form is the honest one: a two-state toggle silently
  drops the "follow my OS" option that most people actually want. The compact
  icon form is there for a crowded app bar and cycles through all three.
-->
<script lang="ts">
  import { theme, type ThemeMode } from '../../state/theme.svelte.js';
  import SegmentedControl from '../form/SegmentedControl.svelte';
  import IconButton from '../button/IconButton.svelte';

  interface Props {
    variant?: 'segmented' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    class?: string;
  }

  let { variant = 'segmented', size = 'md', class: className }: Props = $props();

  const ORDER: ThemeMode[] = ['light', 'dark', 'system'];

  const options = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Auto' }
  ];

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme.mode) + 1) % ORDER.length];
    theme.set(next);
  }
</script>

{#if variant === 'segmented'}
  <SegmentedControl
    value={theme.mode}
    {options}
    {size}
    label="Theme"
    class={className}
    onchange={(value) => theme.set(value as ThemeMode)}
  />
{:else}
  <IconButton label={`Theme: ${theme.mode}`} {size} class={className} onclick={cycle}>
    {#if theme.mode === 'system'}
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
        <rect x="2.5" y="3.5" width="15" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4" />
        <path d="M7 16.5h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
      </svg>
    {:else if theme.resolved === 'dark'}
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
        <path
          d="M16 12.5A6.5 6.5 0 017.5 4a6.5 6.5 0 108.5 8.5z"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linejoin="round"
        />
      </svg>
    {:else}
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.4" />
        <path
          d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M15.5 4.5l-1.4 1.4M5.9 14.1l-1.4 1.4"
          stroke="currentColor"
          stroke-width="1.4"
          stroke-linecap="round"
        />
      </svg>
    {/if}
  </IconButton>
{/if}
