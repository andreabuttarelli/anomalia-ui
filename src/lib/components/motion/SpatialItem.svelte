<!--
  SpatialItem — one object floating in a `Spatial` stage.

  Position is plain 3D coordinates in px: `x` across, `y` down, `z` toward the
  viewer. Thinking in coordinates rather than in CSS transforms is what lets a
  scene be authored as data.

  `billboard` keeps the object facing the camera by counter-rotating the stage's
  own rotation — the classic trick for text that must stay readable while the
  world turns around it. Leave it off for panels that should read as physical
  surfaces, which is most of them.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '../../utils/cn.js';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    x?: number;
    y?: number;
    /** Depth. Positive is toward the viewer, negative is further away. */
    z?: number;
    rotateX?: number;
    rotateY?: number;
    /** Idle bob. `index` offsets the phase so a group never moves in lockstep. */
    float?: boolean;
    index?: number;
    width?: string;
    /** Counter-rotate to keep facing the camera. */
    billboard?: boolean;
    children?: Snippet;
  }

  let {
    x = 0,
    y = 0,
    z = 0,
    rotateX = 0,
    rotateY = 0,
    float = true,
    index = 0,
    width = '200px',
    billboard = false,
    class: className,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  data-an="spatial-item"
  data-float={float ? '' : undefined}
  data-billboard={billboard ? '' : undefined}
  class={cn('an-spatial-item', className)}
  style={`--an-item-x:${x}px; --an-item-y:${y}px; --an-item-z:${z}px; --an-item-rx:${rotateX}deg; --an-item-ry:${rotateY}deg; --an-item-w:${width}; --an-item-delay:${index * 0.7}s; --an-item-duration:${6 + (index % 4)}s`}
  {...rest}
>
  <div class="an-spatial-item__inner">
    {@render children?.()}
  </div>
</div>

<style>
  .an-spatial-item {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--an-item-w, 200px);
    transform-style: preserve-3d;
    /* Translate first, then rotate, so rotation happens about the object's own
       centre rather than about the stage origin. */
    transform: translate3d(
        calc(var(--an-item-x) - 50%),
        calc(var(--an-item-y) - 50%),
        var(--an-item-z)
      )
      rotateX(var(--an-item-rx)) rotateY(var(--an-item-ry));
  }

  .an-spatial-item[data-billboard] {
    transform: translate3d(
        calc(var(--an-item-x) - 50%),
        calc(var(--an-item-y) - 50%),
        var(--an-item-z)
      )
      rotateY(calc(var(--an-spatial-y, 0deg) * -1)) rotateX(calc(var(--an-spatial-x, 0deg) * -1));
  }

  .an-spatial-item__inner {
    transform-style: preserve-3d;
  }

  /* The bob lives on the inner element so it composes with the outer transform
     instead of overwriting it. */
  .an-spatial-item[data-float] .an-spatial-item__inner {
    animation: an-item-float var(--an-item-duration, 7s) var(--an-ease-standard) infinite alternate;
    animation-delay: calc(var(--an-item-delay, 0s) * -1);
  }

  @keyframes an-item-float {
    from {
      translate: 0 -8px 0;
    }
    to {
      translate: 0 8px 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .an-spatial-item[data-float] .an-spatial-item__inner {
      animation: none;
    }
  }
</style>
