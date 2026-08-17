<!-- The last crumb is text with `aria-current="page"`, not a link to where you already are. Past `collapseAfter` the middle folds into a button — origin and position are the two crumbs a reader uses. -->
<script lang="ts">
  import { Breadcrumb } from '$lib/index.js';

  const shallow = [
    { label: 'Brands', href: '#' },
    { label: 'Lindaria', href: '#' },
    { label: 'Content' }
  ];

  const deep = [
    { label: 'Brands', href: '#' },
    { label: 'Lindaria', href: '#' },
    { label: 'Content', href: '#' },
    { label: 'Week 35', href: '#' },
    { label: 'Carousel', href: '#' },
    { label: 'Slide 2' }
  ];
</script>

<div class="stack">
  <Breadcrumb items={shallow} />
  <Breadcrumb items={deep} />
</div>

<style>
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--an-space-4);
  }
</style>
