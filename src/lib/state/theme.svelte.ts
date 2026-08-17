export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'an-theme';

/**
 * Theme controller.
 *
 * `mode` is what the user chose (including "follow the OS"); `resolved` is what
 * is actually painted. Components should read `resolved` — only a theme switcher
 * cares about the difference.
 *
 * Nothing is read from `localStorage` at module scope: on the server that would
 * throw, and during hydration it would produce markup that disagrees with the
 * server's. `ThemeProvider` calls `init()` on mount instead.
 */
class ThemeController {
  mode = $state<ThemeMode>('system');
  systemPrefersDark = $state(false);

  readonly resolved: ResolvedTheme = $derived(
    this.mode === 'system' ? (this.systemPrefersDark ? 'dark' : 'light') : this.mode
  );

  #media: MediaQueryList | null = null;

  /** Adopt the stored preference and start following the OS. Returns a cleanup. */
  init(defaultMode: ThemeMode = 'system'): () => void {
    if (typeof window === 'undefined') return () => undefined;

    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    this.mode = stored ?? defaultMode;

    this.#media = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemPrefersDark = this.#media.matches;

    const onchange = (event: MediaQueryListEvent) => {
      this.systemPrefersDark = event.matches;
    };
    this.#media.addEventListener('change', onchange);

    return () => this.#media?.removeEventListener('change', onchange);
  }

  set(mode: ThemeMode): void {
    this.mode = mode;
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, mode);
  }

  toggle(): void {
    this.set(this.resolved === 'dark' ? 'light' : 'dark');
  }
}

export const theme = new ThemeController();

/**
 * Blocking snippet for `app.html`, to be dropped in `<head>` before any paint.
 * Without it the page renders in the default theme for one frame and then
 * flips — the flash of wrong theme.
 */
export const themeScript = `(function(){try{var m=localStorage.getItem('${STORAGE_KEY}')||'system';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`;
