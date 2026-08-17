<!-- Badges label a status and are deliberately not interactive. Tone drives colour; variant drives how loud it is. -->
<script lang="ts">
  import { Badge } from '$lib/index.js';
</script>

<div class="demo-col">
  <div class="demo-row">
    <Badge>Neutral</Badge>
    <Badge tone="accent">Accent</Badge>
    <Badge tone="success" dot>Published</Badge>
    <Badge tone="warning">Pending</Badge>
    <Badge tone="danger">Failed</Badge>
    <Badge tone="info">Draft</Badge>
  </div>

  <div class="demo-row">
    <Badge variant="solid" tone="accent">Solid</Badge>
    <Badge variant="outline" tone="success">Outline</Badge>
    <Badge size="sm" tone="danger" variant="solid">3</Badge>
  </div>
</div>
