<!--
  The landing mockup with nothing around it.

  The docs shell is suppressed for this one route in the root layout rather than
  by restructuring the route tree into groups: a landing page is the one screen
  whose whole argument is how it reads edge to edge, and it should not cost a
  refactor to look at it that way.
-->
<script lang="ts">
  import Seo from '../../../../docs/Seo.svelte';
  import LandingMockup from '../../../../docs/LandingMockup.svelte';
  import { page } from '$app/stores';
</script>

<Seo
  title="Landing mockup — full screen"
  description="The Anomalia landing page built from the library, rendered edge to edge with the documentation chrome out of the way."
  pathname={$page.url.pathname}
/>

<LandingMockup full />
