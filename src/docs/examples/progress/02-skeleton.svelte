<!-- Prefer a skeleton whenever you know the shape of what is coming: it holds the layout, so nothing jumps when the data lands. -->
<script lang="ts">
  import { Skeleton, Card } from '$lib/index.js';
</script>

<Card>
  <div style="display:flex; gap:12px; align-items:center; margin-bottom:16px">
    <Skeleton shape="circle" />
    <div style="flex:1">
      <Skeleton width="40%" />
      <div style="height:6px"></div>
      <Skeleton width="24%" />
    </div>
  </div>
  <Skeleton shape="block" height="120px" />
  <div style="height:16px"></div>
  <Skeleton lines={3} />
</Card>
