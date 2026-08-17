<!--
  ThemeProvider — wrap the app once. It adopts the stored preference, follows
  the OS while the mode is "system", and writes the result to
  `<html data-theme>`, which is what every token in `theme.css` keys off.

  It does not paint anything itself, so it can sit anywhere in the tree.

  Pair it with `themeScript` in `app.html` to avoid the flash of wrong theme on
  first paint — this component runs after hydration, which is one frame too late
  to be the only defence.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { theme, type ThemeMode } from '../../state/theme.svelte.js';

  interface Props {
    /** Mode to use when the user has never chosen one. */
    default?: ThemeMode;
    children?: Snippet;
  }

  let { default: defaultMode = 'system', children }: Props = $props();

  $effect(() => theme.init(defaultMode));

  $effect(() => {
    document.documentElement.dataset.theme = theme.resolved;
  });
</script>

{@render children?.()}
