<!--
  TabPanels — swipeable panel container to pair with `Tabs`.

  Panels sit side by side on one track that translates by index; a horizontal
  drag moves the track with the finger and commits on release by distance or
  velocity. This is the interaction Material gets right and the web usually
  omits: on a phone, tabs you can only change by hitting a 40px target feel
  broken.

  Only the active panel is exposed to assistive tech (`inert` + `aria-hidden`),
  so swiping does not turn the neighbours into stray tab stops.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { swipe } from '../../actions/swipe.js';
  import { haptic } from '../../utils/haptics.js';
  import { cn } from '../../utils/cn.js';
  import { uid } from '../../utils/id.js';

  interface Props {
    value?: string;
    /** Panel order — must match the `Tabs` item order. */
    values: string[];
    /** Turn off to keep the sliding layout but disable the gesture. */
    swipeable?: boolean;
    /** Must match the `id` given to the paired `Tabs` — see the note there. */
    id?: string;
    class?: string;
    /** Rendered once per value; receives the value it should render. */
    panel: Snippet<[string]>;
    onchange?: (value: string) => void;
  }

  let {
    value = $bindable(''),
    values,
    swipeable = true,
    id: idProp,
    class: className,
    panel,
    onchange
  }: Props = $props();

  const fallbackId = uid('tabs');
  const id = $derived(idProp ?? fallbackId);

  let track = $state<HTMLElement | null>(null);
  let dragX = $state(0);
  let dragging = $state(false);

  const index = $derived(Math.max(0, values.indexOf(value)));

  function go(next: number) {
    const target = values[Math.min(values.length - 1, Math.max(0, next))];
    if (!target || target === value) return;
    value = target;
    haptic('selection');
    onchange?.(target);
  }
</script>

<div
  data-an="tab-panels"
  data-dragging={dragging ? '' : undefined}
  class={cn('an-panels', className)}
  use:swipe={{
    axis: 'x',
    disabled: !swipeable,
    guardScroll: false,
    onstart: () => (dragging = true),
    onmove: ({ delta }) => {
      // Resist at the ends so the first/last panel cannot be dragged into space.
      const atEdge = (delta > 0 && index === 0) || (delta < 0 && index === values.length - 1);
      dragX = atEdge ? delta / 4 : delta;
    },
    onend: ({ delta, velocity }) => {
      dragging = false;
      const width = track?.offsetWidth ?? 1;
      const commit = Math.abs(delta) > width * 0.25 || Math.abs(velocity) > 0.4;
      if (commit) go(index + (delta < 0 ? 1 : -1));
      dragX = 0;
    }
  }}
>
  <div
    bind:this={track}
    class="an-panels__track"
    style={`--an-panel-count:${values.length}; --an-panel-index:${index}; --an-panel-drag:${dragX}px`}
  >
    {#each values as panelValue (panelValue)}
      <div
        class="an-panels__panel"
        role="tabpanel"
        id={`${id}-${panelValue}-panel`}
        aria-labelledby={`${id}-${panelValue}`}
        aria-hidden={panelValue === value ? undefined : 'true'}
        inert={panelValue === value ? undefined : true}
        data-an-scroll
      >
        {@render panel(panelValue)}
      </div>
    {/each}
  </div>
</div>

<style>
  .an-panels {
    overflow: hidden;
    /* Vertical scrolling stays with the page; we only claim horizontal drags. */
    touch-action: pan-y;
  }

  .an-panels__track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 100%;
    width: 100%;
    translate: calc(var(--an-panel-index) * -100% + var(--an-panel-drag)) 0;
    transition: translate var(--an-duration-medium-3) var(--an-ease-emphasized);
  }

  .an-panels[data-dragging] .an-panels__track {
    transition: none;
  }

  .an-panels__panel {
    min-width: 0;
    /* Hidden panels must not stretch the container to their own height. */
    align-self: start;
  }

  .an-panels__panel[aria-hidden='true'] {
    /* Kept in the layout (the track needs its column) but visually inert. */
    visibility: hidden;
  }

  .an-panels[data-dragging] .an-panels__panel[aria-hidden='true'] {
    visibility: visible;
  }
</style>
