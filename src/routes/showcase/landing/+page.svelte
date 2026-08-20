<!--
  The landing mockup, framed as a showcase. The page itself lives in
  `$docs/LandingMockup.svelte` so the full-screen route can render exactly the
  same thing without the docs shell around it.
-->
<script lang="ts">
  import Seo from '../../../docs/Seo.svelte';
  import LandingMockup from '../../../docs/LandingMockup.svelte';
  import { base } from '$app/paths';
  import { page } from '$app/stores';
</script>

<Seo
  title="Landing mockup"
  description="A marketing landing page built from the library: claim and capture, the pain in numbers, outcomes, one week of the product running on a sticky clock, a comparison against what you pay today, pricing, objections and the ask again."
  pathname={$page.url.pathname}
/>

<div class="doc-page doc-page--wide">
  <p class="doc-page__eyebrow">Showcase</p>
  <h1 class="doc-page__title">Landing page</h1>
  <p class="doc-page__lead">
    A marketing page in the shape that earns a signup: claim and capture, the pain in numbers,
    outcomes in the reader's terms, one week of the product running as the demo, a comparison
    against what they pay today, pricing, objections, and the ask again. Painted in anomalia.so's
    palette — <code>--accent</code>, <code>--accent-2</code>, the aurora, light headings — over the
    library's components, with ink still doing every control.
    <a href="{base}/showcase/landing/full/">Open it full screen →</a>
  </p>

  <LandingMockup />
</div>

<style>
  .doc-page--wide {
    max-width: 1200px;
  }
</style>
