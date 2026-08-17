<!-- Block form for anything multi-line. Ligatures are off on purpose: `=>` collapsing into an arrow is charming in an editor and confusing in a log. -->
<script lang="ts">
  import { Code } from '$lib/index.js';

  const log = `12:04:18  plan.produce      week=34 posts=12      ok    1.9s
12:04:20  media.render      reel/studio-tour     ok   38.1s
12:04:58  channel.schedule  ig,tt,li             ok    0.4s
12:04:59  credits.debit     -320                 ok`;
</script>

<Code variant="block">{log}</Code>
