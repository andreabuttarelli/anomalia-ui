<!-- A collage that happens to have depth. Drag to look around, pinch or ⌘-scroll to zoom, double-click to reset; arrows and +/− with a keyboard. The plates have no border, no caption and no card chrome — the work is the content, the space is the layout. -->
<script lang="ts">
  import { Spatial, SpatialItem } from '$lib/index.js';

  // Plates are placed like a paste-up: overlapping, slightly rotated, at
  // different depths. Nothing is centred, because a centred grid would not need
  // a third dimension in the first place.
  const plates = [
    { x: -300, y: -10, z: 40, ry: 9, w: '185px', kind: 'grid' },
    { x: -105, y: 80, z: -120, ry: 4, w: '175px', kind: 'ink' },
    { x: 80, y: -75, z: 90, ry: -7, w: '170px', kind: 'type' },
    { x: 285, y: 20, z: -60, ry: -11, w: '185px', kind: 'lines' },
    { x: 110, y: 120, z: 10, ry: 3, w: '130px', kind: 'block' }
  ];
</script>

<div class="board">
  <header class="board__meta">
    <p class="mono">Services<br />Social media designs &amp; feed creation</p>
    <p class="mono board__year">//2026 · drag to look</p>
  </header>

  <Spatial height="520px" label="Feed collage" hint={null}>
    {#each plates as plate, index (plate.kind)}
      <SpatialItem
        x={plate.x}
        y={plate.y}
        z={plate.z}
        rotateY={plate.ry}
        width={plate.w}
        {index}
      >
        <div class="plate" data-kind={plate.kind}>
          {#if plate.kind === 'type'}
            <span class="plate__word">Build<br />Different</span>
          {:else if plate.kind === 'lines'}
            <span class="plate__lines" aria-hidden="true">
              {#each { length: 7 } as _, line (line)}<i style={`width:${45 + ((line * 17) % 50)}%`}
                ></i>{/each}
            </span>
          {:else if plate.kind === 'block'}
            <span class="plate__block" aria-hidden="true"></span>
          {/if}
        </div>
      </SpatialItem>
    {/each}

    <!-- Text is just another item in the scene. Drop a `SpatialItem` with a
         `z` in front of or behind the plates and moving the stage re-stacks it
         with everything else — no special text mode, no separate overlay. -->
    <SpatialItem x={-230} y={-190} z={200} float={false} width="220px">
      <p class="caption">Week 34 · 12 plates</p>
    </SpatialItem>
  </Spatial>

  <footer class="board__meta board__meta--foot">
    <p class="mono">Designed for<br />Lindaria</p>
    <p class="mono">Country — IT</p>
    <p class="mono">Industry — Fashion</p>
  </footer>
</div>

<style>
  .board {
    padding: var(--an-space-5) var(--an-space-5) var(--an-space-4);
    background: var(--an-surface-raised);
    border-radius: var(--an-radius-lg);
  }

  .board__meta {
    display: flex;
    justify-content: space-between;
    gap: var(--an-space-6);
  }

  .board__meta--foot {
    padding-top: var(--an-space-2);
  }

  .mono {
    margin: 0;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    line-height: 1.5;
    text-transform: uppercase;
    color: var(--an-text-muted);
  }

  .board__year {
    color: var(--an-text-faint);
  }

  /* ── Plates ─────────────────────────────────────────────────────────────
     No border, no caption, no footer. A drop shadow is the only chrome, and
     only so overlapping plates read as separate sheets. */
  .plate {
    aspect-ratio: 4 / 5;
    background: var(--an-surface);
    box-shadow: 0 18px 40px hsl(var(--an-shadow-color) / 0.16);
    display: grid;
    place-items: center;
    padding: var(--an-space-4);
    overflow: hidden;
  }

  .plate[data-kind='grid'] {
    background-color: var(--an-surface);
    background-image:
      linear-gradient(to right, color-mix(in srgb, var(--an-text) 8%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--an-text) 8%, transparent) 1px, transparent 1px);
    background-size: 22px 22px;
  }

  .plate[data-kind='ink'] {
    background: var(--an-surface-inverse);
    aspect-ratio: 1 / 1;
  }

  .plate[data-kind='type'] {
    aspect-ratio: 3 / 4;
  }

  .plate__word {
    font-size: 26px;
    line-height: 0.95;
    letter-spacing: -0.04em;
    font-weight: var(--an-weight-bold);
    text-transform: uppercase;
    color: var(--an-text);
  }

  .plate[data-kind='lines'] {
    aspect-ratio: 1 / 1;
    place-items: start;
  }

  .plate__lines {
    display: flex;
    flex-direction: column;
    gap: 7px;
    width: 100%;
  }

  .plate__lines i {
    height: 5px;
    background: color-mix(in srgb, var(--an-text) 14%, transparent);
  }

  .plate[data-kind='block'] {
    background: var(--an-surface-inverse);
    aspect-ratio: 4 / 5;
  }

  .plate__block {
    width: 44%;
    aspect-ratio: 1;
    background: var(--an-text-inverse);
  }

  /* Text in the scene is styled like any other content — this one borrows the
     mono caption register so it reads as a plate number, not a headline. */
  .caption {
    margin: 0;
    font-family: var(--an-font-mono);
    font-size-adjust: var(--an-font-mono-adjust);
    font-size: var(--an-text-caption-size);
    text-transform: uppercase;
    color: var(--an-text-faint);
  }
</style>
