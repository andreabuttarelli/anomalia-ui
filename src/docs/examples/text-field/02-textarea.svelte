<!-- `autosize` grows and shrinks with the content; `counter` needs a `maxlength` to count against. -->
<script lang="ts">
  import { Textarea } from '$lib/index.js';

  let caption = $state('Behind the scenes of this week’s shoot.');
</script>

<div class="demo-col">
  <Textarea
    label="Caption"
    bind:value={caption}
    autosize
    counter
    maxlength={280}
    hint="Auto-grows as you type"
  />
</div>
