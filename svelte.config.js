import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/**
 * This project is two things at once:
 *
 *   • `src/lib` — the published package. `svelte-package` copies it to `dist`,
 *     and nothing else in this repo ships with it.
 *   • `src/routes` — the documentation site, fully prerendered (see
 *     `+layout.ts`) so it deploys as static files to any host.
 */

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    alias: {
      $docs: 'src/docs'
    }
  }
};

export default config;
