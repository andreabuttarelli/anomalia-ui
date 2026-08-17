/**
 * Reactive `matchMedia`. Must be created during component init (it registers an
 * effect), then read as `query.current` anywhere.
 *
 *     const isPhone = mediaQuery('(max-width: 640px)');
 *     …
 *     {#if isPhone.current}<BottomSheet …/>{:else}<Dialog …/>{/if}
 *
 * SSR reports `false`, so branch on it for enhancement, never for content that
 * must exist in the server-rendered HTML.
 */
export function mediaQuery(query: string): { readonly current: boolean } {
  let current = $state(false);

  $effect(() => {
    const list = window.matchMedia(query);
    current = list.matches;

    const onchange = (event: MediaQueryListEvent) => {
      current = event.matches;
    };
    list.addEventListener('change', onchange);
    return () => list.removeEventListener('change', onchange);
  });

  return {
    get current() {
      return current;
    }
  };
}

/** The breakpoints the system's own components branch on. */
export const breakpoint = {
  phone: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  touch: '(hover: none) and (pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)'
} as const;
