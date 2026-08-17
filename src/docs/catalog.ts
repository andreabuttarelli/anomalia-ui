/**
 * Component catalogue — pure data, no Vite APIs.
 *
 * Split out from `registry.ts` so it can be imported by plain Node as well as
 * by the docs site: `scripts/generate-skill-reference.mjs` reads this file to
 * emit the agent skill's component reference. One source, two consumers, no
 * chance of the skill documenting an API that no longer exists.
 */

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  /** Sidebar grouping. */
  category:
    | 'Foundations'
    | 'Actions'
    | 'Display'
    | 'Forms'
    | 'Feedback'
    | 'Overlays'
    | 'Navigation'
    | 'Motion'
    | 'Data'
    | 'Chat'
    | 'Layout'
    | 'Marketing';
  summary: string;
  /** Everything exported for this entry, e.g. `['Card', 'CardHeader']`. */
  exports: string[];
  /** Design/behaviour notes worth knowing before using it. */
  notes?: string[];
  props?: { title?: string; rows: PropRow[] }[];
}

export const catalog: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    category: 'Actions',
    summary:
      'Five variants, three sizes, link or button element, with ripple, state layer and press feedback built in.',
    exports: ['Button', 'IconButton', 'ButtonGroup', 'Fab'],
    notes: [
      'Passing `href` renders an `<a>` that keeps every visual state — never wrap a Button in a link.',
      '`loading` keeps the button at full contrast and swaps the label for a spinner without changing its width.',
      'IconButton keeps a ≥44px hit area even at `size="sm"`, via a transparent overlay.'
    ],
    props: [
      {
        title: 'Button',
        rows: [
          { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual weight.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height: 32 / 40 / 48px.' },
          { name: 'href', type: 'string', description: 'Renders an anchor instead of a button.' },
          { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and blocks activation.' },
          { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container width.' },
          { name: 'pill', type: 'boolean', default: 'false', description: 'Fully rounded ends.' },
          { name: 'leading / trailing', type: 'Snippet', description: 'Icon slots either side of the label.' }
        ]
      },
      {
        title: 'IconButton',
        rows: [
          { name: 'label', type: 'string', description: 'Required — the accessible name.' },
          { name: 'variant', type: "'solid' | 'soft' | 'outline' | 'ghost'", default: "'ghost'", description: 'Visual weight.' },
          { name: 'round', type: 'boolean', default: 'true', description: 'Circular rather than rounded-square.' }
        ]
      },
      {
        title: 'Fab',
        rows: [
          { name: 'label', type: 'string', description: 'Presence of a label makes the FAB extended.' },
          { name: 'floating', type: 'boolean', default: 'false', description: 'Pin above the safe area, bottom-right.' },
          { name: 'hidden', type: 'boolean', default: 'false', description: 'Slide off-screen — drive from scroll direction.' }
        ]
      }
    ]
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'Display',
    summary: 'Neutral container in four surface treatments; becomes a real link or button when given `href` or `onclick`.',
    exports: ['Card', 'CardHeader', 'CardFooter'],
    notes: [
      'An interactive card renders as `<a>`/`<button>` and gains ripple, press and elevation — do not nest another button inside it.',
      '`variant="glass"` only reads correctly over content; on a flat background it looks like a mistake.'
    ],
    props: [
      {
        rows: [
          { name: 'variant', type: "'outlined' | 'elevated' | 'filled' | 'glass'", default: "'outlined'", description: 'Surface treatment.' },
          { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Inner spacing.' },
          { name: 'href / onclick', type: 'string / function', description: 'Promotes the card to an interactive surface.' },
          { name: 'selected', type: 'boolean', default: 'false', description: 'Accent ring for selectable sets.' }
        ]
      }
    ]
  },
  {
    slug: 'text',
    name: 'Text',
    category: 'Display',
    summary: 'The type ramp. Each variant binds size, line-height and tracking together — headings run tight, labels run small, uppercase and widely tracked.',
    exports: ['Text'],
    notes: [
      'Variants map to sensible default tags (`display` → `h1`, `body` → `p`); override with `as`.',
      'Use `numeric` for anything a reader compares vertically — it switches on tabular figures.'
    ],
    props: [
      {
        rows: [
          { name: 'variant', type: "'display' | 'title1' | 'title2' | 'title3' | 'headline' | 'callout' | 'body' | 'footnote' | 'caption'", default: "'body'", description: 'Position on the ramp.' },
          { name: 'tone', type: "'default' | 'muted' | 'faint' | 'accent' | 'success' | 'warning' | 'danger' | 'inverse'", default: "'default'", description: 'Semantic colour.' },
          { name: 'weight', type: "'regular' | 'medium' | 'semibold' | 'bold'", description: 'Overrides the variant weight.' },
          { name: 'clamp', type: 'number', description: 'Truncate after N lines.' },
          { name: 'numeric', type: 'boolean', default: 'false', description: 'Tabular figures.' }
        ]
      }
    ]
  },
  {
    slug: 'badge',
    name: 'Badge & Chip',
    category: 'Display',
    summary: 'Badge labels a status; Chip is its interactive sibling for filters and selections.',
    exports: ['Badge', 'Chip'],
    notes: [
      'If it can be tapped, it is a Chip. Badges are deliberately not interactive.',
      'Chip fires a haptic tick on selection and shrinks under the finger.'
    ],
    props: [
      {
        title: 'Badge',
        rows: [
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: 'Status colour.' },
          { name: 'variant', type: "'solid' | 'soft' | 'outline'", default: "'soft'", description: 'Fill treatment.' },
          { name: 'dot', type: 'boolean', default: 'false', description: 'Leading status dot.' }
        ]
      },
      {
        title: 'Chip',
        rows: [
          { name: 'selected', type: 'boolean', default: 'false', description: 'Selected (accent) state.' },
          { name: 'onremove', type: '() => void', description: 'Adds a trailing ✕.' },
          { name: 'leading', type: 'Snippet', description: 'Icon or avatar before the label.' }
        ]
      }
    ]
  },
  {
    slug: 'code',
    name: 'Code & Kbd',
    category: 'Display',
    summary:
      "The system's second voice: mono for machine-authored fact — ids, paths, timestamps, shortcuts, spec values.",
    exports: ['Code', 'Kbd', 'Text'],
    notes: [
      'Mono is a component, not a convention. A bare `font-family` in a stylesheet is how mono ends up on prices and body copy.',
      'Never use it to align numbers in a table — `Text` with `numeric` gives tabular figures in the sans, which aligns just as well without turning a metrics panel into a terminal.',
      'The x-height is normalised against the sans with `font-size-adjust`, so the pairing holds on every platform, loaded font or OS fallback.',
      'Ligatures are disabled: `=>` collapsing into an arrow is charming in an editor and misleading in a log line or an id.'
    ],
    props: [
      {
        title: 'Code',
        rows: [
          { name: 'variant', type: "'inline' | 'block'", default: "'inline'", description: 'Inline span, or a scrollable `<pre>`.' },
          { name: 'tone', type: "'default' | 'muted'", default: "'default'", description: 'Secondary metadata reads muted.' },
          { name: 'bare', type: 'boolean', default: 'false', description: 'Drop the tinted background.' }
        ]
      },
      {
        title: 'Kbd',
        rows: [
          { name: 'keys', type: 'string', description: 'A key or chord — `⌘K`, `Ctrl+Shift+P`. Split on `+`.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Cap size.' }
        ]
      },
      {
        title: 'Text',
        rows: [
          { name: 'family', type: "'sans' | 'mono'", default: "'sans'", description: 'Switches a whole line to the mono voice.' }
        ]
      }
    ]
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'Display',
    summary: 'Image with initials fallback; the fallback tint is derived from the name, so it is stable everywhere.',
    exports: ['Avatar'],
    notes: ['A broken image URL falls back to initials automatically — no error state to handle.'],
    props: [
      {
        rows: [
          { name: 'src', type: 'string | null', description: 'Image URL.' },
          { name: 'name', type: 'string', description: 'Drives alt text, initials and the fallback hue.' },
          { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: '24 / 32 / 40 / 56 / 80px.' },
          { name: 'shape', type: "'circle' | 'rounded'", default: "'circle'", description: 'Silhouette.' },
          { name: 'status', type: "'online' | 'busy' | 'offline'", description: 'Presence dot.' }
        ]
      }
    ]
  },
  {
    slug: 'text-field',
    name: 'TextField & Textarea',
    category: 'Forms',
    summary: 'Text inputs with label, hint, error and adornments — all ARIA wiring handled by the shared Field wrapper.',
    exports: ['TextField', 'Textarea', 'Field'],
    notes: [
      'Inputs render at 16px on coarse pointers: below that, iOS Safari zooms the page on focus and never zooms back.',
      'Pass `error` and the field flips to the danger ring and announces the message via `role="alert"`.',
      'Use `Field` directly when you need the same label/hint/error scaffolding around a custom control.'
    ],
    props: [
      {
        title: 'TextField',
        rows: [
          { name: 'value', type: 'string', description: 'Bindable value.' },
          { name: 'label / hint / error', type: 'string', description: 'Field scaffolding; `error` replaces `hint`.' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Control height.' },
          { name: 'leading / trailing', type: 'Snippet', description: 'Adornments inside the border.' },
          { name: 'fieldClass', type: 'string', description: 'Class for the wrapper (`class` goes to the input).' }
        ]
      },
      {
        title: 'Textarea',
        rows: [
          { name: 'autosize', type: 'boolean', default: 'false', description: 'Grow and shrink with the content.' },
          { name: 'counter', type: 'boolean', default: 'false', description: 'Show `n / maxlength`.' }
        ]
      }
    ]
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Forms',
    summary: 'A styled native `<select>` — the closed state is ours, the open state belongs to the platform.',
    exports: ['Select'],
    notes: [
      'Deliberately not a custom listbox: on a phone the OS picker wins on scroll, search and assistive tech.',
      'Pass `options` for the common case, or children for `<optgroup>` layouts.'
    ],
    props: [
      {
        rows: [
          { name: 'value', type: 'string', description: 'Bindable value.' },
          { name: 'options', type: 'SelectOption[]', description: '`{ value, label, disabled? }`.' },
          { name: 'placeholder', type: 'string', description: 'Disabled first option shown when empty.' }
        ]
      }
    ]
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'Forms',
    summary: 'Square box with a stroked-on tick, an indeterminate state, and a Material touch halo around a 44px target.',
    exports: ['Checkbox'],
    notes: [
      'The real `<input>` stays in the DOM, so forms, labels and screen readers behave natively.',
      '`indeterminate` is a DOM property, not an attribute — the component syncs it for you.'
    ],
    props: [
      {
        rows: [
          { name: 'checked', type: 'boolean', description: 'Bindable state.' },
          { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Dash state for partial selections.' },
          { name: 'label / hint', type: 'string', description: 'Row text.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '16 / 20px box.' }
        ]
      }
    ]
  },
  {
    slug: 'radio-group',
    name: 'RadioGroup',
    category: 'Forms',
    summary: 'The whole set as one component — one name, one value, one tab stop, plus a card variant for thumbs.',
    exports: ['RadioGroup'],
    notes: ['`variant="card"` turns each option into a full-width target; use it on phone-first screens.'],
    props: [
      {
        rows: [
          { name: 'value', type: 'string', description: 'Bindable selected value.' },
          { name: 'options', type: 'RadioOption[]', description: '`{ value, label, hint?, disabled? }`.' },
          { name: 'variant', type: "'plain' | 'card'", default: "'plain'", description: 'Row style.' },
          { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Layout direction.' }
        ]
      }
    ]
  },
  {
    slug: 'switch',
    name: 'Switch',
    category: 'Forms',
    summary: 'Pill toggle whose thumb stretches under the finger and springs back, with a haptic on commit.',
    exports: ['Switch'],
    notes: [
      'A switch applies its change immediately. If the change needs a Save button, use a Checkbox.',
      '`reverse` puts the control first — the right order for settings rows.'
    ],
    props: [
      {
        rows: [
          { name: 'checked', type: 'boolean', description: 'Bindable state.' },
          { name: 'label / hint', type: 'string', description: 'Row text.' },
          { name: 'reverse', type: 'boolean', default: 'false', description: 'Control before the label.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '40×24 / 51×31px.' }
        ]
      }
    ]
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'Forms',
    summary: 'Touch-first range control: the thumb grows while dragging, a bubble shows the value, each step ticks.',
    exports: ['Slider'],
    notes: [
      'Custom rather than a styled `<input type="range">`, because the thumb growth, the value bubble and per-step haptics are not reachable natively.',
      'Full keyboard support: arrows, PageUp/PageDown, Home/End.'
    ],
    props: [
      {
        rows: [
          { name: 'value', type: 'number', description: 'Bindable value.' },
          { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: 'Range and granularity.' },
          { name: 'format', type: '(value) => string', description: 'Formats the bubble and `aria-valuetext`.' },
          { name: 'ticks', type: 'boolean', default: 'false', description: 'Step marks (ignored above 24 steps).' }
        ]
      }
    ]
  },
  {
    slug: 'segmented-control',
    name: 'SegmentedControl',
    category: 'Forms',
    summary: 'A segmented picker whose selected pill slides between equal-width segments on the emphasized curve.',
    exports: ['SegmentedControl'],
    notes: [
      'Equal-width segments mean the pill offset needs no measuring — it lands correctly before fonts load.',
      'For more than four options, use Tabs or a Select instead.'
    ],
    props: [
      {
        rows: [
          { name: 'value', type: 'string', description: 'Bindable value.' },
          { name: 'options', type: 'SegmentOption[]', description: '`{ value, label, badge?, disabled? }`.' },
          { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container.' }
        ]
      }
    ]
  },
  {
    slug: 'alert',
    name: 'Alert',
    category: 'Feedback',
    summary: 'Inline, persistent message attached to the content it concerns.',
    exports: ['Alert'],
    notes: ['Transient messages belong in a Toast; an Alert stays until the situation changes.'],
    props: [
      {
        rows: [
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'info'", description: 'Colour and ARIA role (`danger` → `alert`).' },
          { name: 'title', type: 'string', description: 'Bold first line.' },
          { name: 'ondismiss', type: '() => void', description: 'Shows the ✕.' },
          { name: 'icon / actions', type: 'Snippet', description: 'Leading glyph and action row.' }
        ]
      }
    ]
  },
  {
    slug: 'progress',
    name: 'Progress, Spinner & Skeleton',
    category: 'Feedback',
    summary: 'The three loading states: known duration, unknown duration, and known shape.',
    exports: ['Progress', 'Spinner', 'Skeleton'],
    notes: [
      'Prefer Skeleton when you know the shape of what is coming — it avoids the layout jump a spinner hides.',
      'Progress transitions width on the emphasized curve, so a jump from 20% to 80% reads as a move.'
    ],
    props: [
      {
        title: 'Progress',
        rows: [
          { name: 'value', type: 'number | null', default: 'null', description: '0–100; `null` is indeterminate.' },
          { name: 'tone', type: 'Tone', default: "'accent'", description: 'Bar colour.' },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: '3 / 6px.' }
        ]
      },
      {
        title: 'Skeleton',
        rows: [
          { name: 'shape', type: "'text' | 'block' | 'circle'", default: "'text'", description: 'Placeholder form.' },
          { name: 'lines', type: 'number', default: '1', description: 'Text lines; the last is shortened.' },
          { name: 'width / height / radius', type: 'string', description: 'CSS overrides.' }
        ]
      }
    ]
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'Feedback',
    summary: 'Snackbar queue with swipe-to-dismiss, pause-on-hover and an optional action.',
    exports: ['Toaster', 'toast', 'toasts'],
    notes: [
      'Mount `<Toaster />` once near the root; call `toast(...)` from anywhere, including outside components.',
      'The queue caps at three on screen — a stack of snackbars is the pattern being misused.',
      'Set `timeout: 0` for a message that must be acknowledged, and pair it with an action.'
    ],
    props: [
      {
        title: 'toast(options)',
        rows: [
          { name: 'title / description', type: 'string', description: 'Message body.' },
          { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: 'Colour and live-region politeness.' },
          { name: 'timeout', type: 'number', default: '4000', description: 'ms on screen; `0` waits for a dismissal.' },
          { name: 'action', type: '{ label, onclick }', description: 'Single action button.' }
        ]
      }
    ]
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'Overlays',
    summary: 'Modal surface with portal, focus trap, scroll lock and Escape handling already wired together.',
    exports: ['Dialog'],
    notes: [
      'On phones prefer BottomSheet — a centred modal is a poor thumb target.',
      'Set `dismissible={false}` for destructive confirmations so Escape and scrim taps do not resolve them.'
    ],
    props: [
      {
        rows: [
          { name: 'open', type: 'boolean', description: 'Bindable visibility.' },
          { name: 'title / description', type: 'string', description: 'Header text, wired to `aria-labelledby`.' },
          { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Max width.' },
          { name: 'dismissible', type: 'boolean', default: 'true', description: 'Escape and scrim taps close it.' },
          { name: 'footer', type: 'Snippet', description: 'Action row pinned to the bottom.' }
        ]
      }
    ]
  },
  {
    slug: 'bottom-sheet',
    name: 'BottomSheet',
    category: 'Overlays',
    summary: 'Drag-to-dismiss sheet that follows the finger, rubber-bands at the top and commits on distance or velocity.',
    exports: ['BottomSheet'],
    notes: [
      'Release is decided by distance AND velocity: a short fast flick dismisses, a long slow drag springs back.',
      'Body content scrolls normally; the drag only starts from the sheet chrome or when the body is at its top.',
      'Above 768px it becomes a centred floating card, so one component covers both layouts.'
    ],
    props: [
      {
        rows: [
          { name: 'open', type: 'boolean', description: 'Bindable visibility.' },
          { name: 'height', type: "'auto' | 'half' | 'full'", default: "'auto'", description: 'Sheet height.' },
          { name: 'grabber', type: 'boolean', default: 'true', description: 'Drag handle — also gates the gesture.' },
          { name: 'dismissible', type: 'boolean', default: 'true', description: 'Escape, scrim and drag can close it.' }
        ]
      }
    ]
  },
  {
    slug: 'popover',
    name: 'Popover & Menu',
    category: 'Overlays',
    summary: 'Anchored surfaces with flipping, viewport clamping and origin-aware entrance; Menu adds roving focus.',
    exports: ['Popover', 'Menu', 'MenuItem'],
    notes: [
      'Positioned `fixed` from viewport coordinates, so transformed and `overflow: hidden` ancestors cannot clip it.',
      'Menu supports arrows, Home/End, type-ahead and Tab-to-close.',
      '`matchWidth` makes the surface as wide as its anchor — the right default for select-like menus.'
    ],
    props: [
      {
        title: 'Popover',
        rows: [
          { name: 'open', type: 'boolean', description: 'Bindable visibility.' },
          { name: 'anchor', type: 'HTMLElement | null', description: 'Element to position against.' },
          { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right' (+ '-start' / '-end')", default: "'bottom-start'", description: 'Preferred side; flips when it does not fit.' },
          { name: 'offset', type: 'number', default: '8', description: 'Gap from the anchor.' }
        ]
      },
      {
        title: 'MenuItem',
        rows: [
          { name: 'href', type: 'string', description: 'Renders a link, keeping middle-click behaviour.' },
          { name: 'tone', type: "'default' | 'danger'", default: "'default'", description: 'Destructive styling.' },
          { name: 'selected / shortcut', type: 'boolean / string', description: 'Check mark and keyboard hint.' }
        ]
      }
    ]
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'Overlays',
    summary: 'Hover/focus label for pointer devices — and nothing at all on touch, by design.',
    exports: ['Tooltip'],
    notes: [
      'Renders nothing on touch devices: a tooltip there either never appears or hijacks the tap.',
      'Never put information only in a tooltip. It is a hint, not a label.',
      'Opening is delayed, closing is not — a cursor sweeping a toolbar should not fire a row of tooltips.'
    ],
    props: [
      {
        rows: [
          { name: 'content', type: 'string', description: 'Tooltip text.' },
          { name: 'placement', type: 'Placement', default: "'top'", description: 'Preferred side.' },
          { name: 'delay', type: 'number', default: '600', description: 'ms before it appears.' }
        ]
      }
    ]
  },
  {
    slug: 'tabs',
    name: 'Tabs & TabPanels',
    category: 'Navigation',
    summary: 'Sliding indicator measured from the active tab, plus a swipeable panel track for phones.',
    exports: ['Tabs', 'TabPanels'],
    notes: [
      'The indicator is measured, not assumed, and re-measured on resize — so it survives late-loading fonts.',
      'TabPanels gives you the Material gesture: drag horizontally to change tab, committing on distance or velocity.',
      'Only the active panel is exposed to assistive tech; the neighbours are `inert`.'
    ],
    props: [
      {
        title: 'Tabs',
        rows: [
          { name: 'value', type: 'string', description: 'Bindable active value.' },
          { name: 'items', type: 'SegmentOption[]', description: '`{ value, label, badge?, disabled? }`.' },
          { name: 'variant', type: "'underline' | 'pill'", default: "'underline'", description: 'Indicator style.' }
        ]
      },
      {
        title: 'TabPanels',
        rows: [
          { name: 'values', type: 'string[]', description: 'Panel order — must match the Tabs items.' },
          { name: 'panel', type: 'Snippet<[string]>', description: 'Rendered once per value.' },
          { name: 'swipeable', type: 'boolean', default: 'true', description: 'Enable the drag gesture.' }
        ]
      }
    ]
  },
  {
    slug: 'list',
    name: 'List & ListItem',
    category: 'Navigation',
    summary: 'The settings/navigation row: leading slot, title and subtitle, trailing value or control.',
    exports: ['List', 'ListItem'],
    notes: [
      'A row with a Switch in `trailing` must not also be a button — leave `onclick` off and let the control own the tap.',
      'Rows are at least 44px tall and ripple from the touch point.'
    ],
    props: [
      {
        title: 'ListItem',
        rows: [
          { name: 'title / subtitle / value', type: 'string', description: 'Row text and trailing detail.' },
          { name: 'href / onclick', type: 'string / function', description: 'Makes the row interactive.' },
          { name: 'chevron', type: 'boolean', description: 'Trailing chevron; defaults to on for links.' },
          { name: 'leading / trailing', type: 'Snippet', description: 'Icon and control slots.' }
        ]
      }
    ]
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'Navigation',
    summary: 'Expandable sections with a height-and-padding collapse on the emphasized curve.',
    exports: ['Accordion'],
    notes: ['`mode="single"` closes the others; the open set is bindable, so it can be driven from a URL.'],
    props: [
      {
        rows: [
          { name: 'open', type: 'string[]', description: 'Bindable open values.' },
          { name: 'items', type: '{ value, title, subtitle?, disabled? }[]', description: 'Sections.' },
          { name: 'mode', type: "'single' | 'multiple'", default: "'single'", description: 'Exclusive or not.' },
          { name: 'children', type: 'Snippet<[string]>', description: 'Panel body for a given value.' }
        ]
      }
    ]
  },
  {
    slug: 'app-bar',
    name: 'AppBar',
    category: 'Navigation',
    summary: 'Sticky chrome that stays transparent until you scroll, with an optional collapsing large title.',
    exports: ['AppBar'],
    notes: [
      'The compact title only fades in once the large one is mostly gone — a crossfade at 50% shows both at once.',
      'Scroll is read with a passive listener and safe-area insets are respected for PWAs.'
    ],
    props: [
      {
        rows: [
          { name: 'title', type: 'string', description: 'Compact (and large) title text.' },
          { name: 'largeTitle', type: 'boolean', default: 'false', description: 'Collapsing iOS-style large title.' },
          { name: 'glass', type: 'boolean', default: 'true', description: 'Frosted background once scrolled.' },
          { name: 'scrollElement', type: 'HTMLElement | null', description: 'Scroll container to watch (defaults to window).' }
        ]
      }
    ]
  },
  {
    slug: 'bottom-nav',
    name: 'BottomNav',
    category: 'Navigation',
    summary: 'Material 3 navigation bar: a pill grows behind the active icon and the glyph lifts.',
    exports: ['BottomNav'],
    notes: [
      'Items with `href` render as links, so the browser keeps handling navigation and history.',
      '`labelsOnlyWhenActive` is the compact M3 bar for narrow screens.'
    ],
    props: [
      {
        rows: [
          { name: 'value', type: 'string', description: 'Bindable active value.' },
          { name: 'items', type: 'NavItem[]', description: '`{ value, label, href?, badge? }`.' },
          { name: 'icon', type: 'Snippet<[string]>', description: 'Icon for a given item value.' }
        ]
      }
    ]
  },
  {
    slug: 'circular-progress',
    name: 'CircularProgress',
    category: 'Data',
    summary:
      'A ring for a bounded quantity — context window, quota, upload — whose tone follows the number.',
    exports: ['CircularProgress'],
    notes: [
      'Past `warnAt` the ring turns warning, past `dangerAt` danger. A context meter that stays one colour at 95% has told the user nothing they could not already read.',
      'Without a `value` it spins a fixed arc instead of filling to an invented number — a ring that pretends to know its progress is worse than one that admits it does not.',
      'Two SVG circles and `stroke-dasharray`: scales to any size, no canvas, and the centre is a snippet so it can hold an icon, a fraction or nothing at all.'
    ],
    props: [
      {
        rows: [
          { name: 'value', type: 'number | null', default: 'null', description: '0–100; `null` is indeterminate.' },
          { name: 'size / thickness', type: 'number', default: '64 / 6', description: 'Diameter and ring width, in px.' },
          { name: 'warnAt / dangerAt', type: 'number', default: '75 / 90', description: 'Tone thresholds.' },
          { name: 'tone', type: 'Tone | null', default: 'null', description: 'Pin a tone and ignore the thresholds.' },
          { name: 'showValue / children', type: 'boolean / Snippet', default: 'true', description: 'Percentage in the middle, or your own content.' }
        ]
      }
    ]
  },
  {
    slug: 'charts',
    name: 'Sparkline, BarChart & LineChart',
    category: 'Data',
    summary:
      'Change over time and magnitude across categories, with the mark specs, the legend, the tooltip and the table view already decided.',
    exports: ['Sparkline', 'BarChart', 'LineChart', 'ChartFrame'],
    notes: [
      'One series is ink, not a hue. Colour encodes *identity*, so a chart with nothing to tell apart has no reason to spend it — which is also what keeps a monochrome system monochrome until a stacked bar genuinely needs six colours.',
      'The six categorical slots are a validated set, not a taste call: checked for the lightness band, the chroma floor, adjacent-pair separation under deuteranopia, protanopia and tritanopia, and normal-vision separation. Worst adjacent CVD ΔE 9.1 light / 8.4 dark against a target of 8. **The order is the safety mechanism** — reassigning a slot voids the guarantee.',
      'Colour follows the entity, never its rank. Filtering a series out must not repaint the survivors, or a reader who learned "Instagram is blue" has been misled.',
      'There is no dual-axis prop and there will not be one. Two y-scales make the alignment between them arbitrary, so the chart invents a correlation that is not in the data — the single most common way a dashboard chart lies. Two measures of different magnitude are two charts, or both indexed to 100 at t0.',
      'Bars cap at 24px and never fill their band; they are rounded at the data end and square at the baseline, so a stack reads as one bar growing out of the axis. A 2px surface gap does the separating — never a stroke, which is ink that is not data.',
      'A `null` breaks a line rather than being interpolated across. Drawing straight through missing data is a claim about data that does not exist.',
      'Every multi-series chart ships a legend and a table view. That is what makes colour a redundant channel rather than the only one — and it is the condition under which a light-mode hue below 3:1 is legitimate as a *mark*.',
      'Hover is a crosshair on lines and a whole-column highlight on bars, because the comparison is across series at one x, not one dot. Emphasis dims the others rather than tinting the one, so the legend keeps matching.',
      'Axis ticks land on round numbers via `niceDomain`, and `compact` only abbreviates past a thousand — "0.9K" is worse than 900 in every way.'
    ],
    props: [
      {
        title: 'LineChart',
        rows: [
          { name: 'series', type: 'Series[]', description: '`{ id, label, values, color? }`. `id` is the identity colour follows.' },
          { name: 'labels', type: 'string[]', description: 'One per x position. Ticks thin to fit; the table keeps them all.' },
          { name: 'area', type: 'boolean', default: 'false', description: 'A 10% wash under the line. Single series only — stacked washes read as a colour nobody chose.' },
          { name: 'zero', type: 'boolean', default: 'true', description: 'Include zero in the domain. Turn it off for a rate or an index.' },
          { name: 'endLabels', type: 'boolean', default: 'true', description: 'The final value beside each line — the selective label.' }
        ]
      },
      {
        title: 'BarChart',
        rows: [
          { name: 'labels / series', type: 'string[] / Series[]', description: 'One bar per label; several series stack.' },
          { name: 'showValues', type: 'boolean', default: 'false', description: 'The total on each cap, and only when the bar is wide enough for it.' },
          { name: 'max', type: 'number', description: 'Fixed ceiling. The floor is always zero.' }
        ]
      },
      {
        title: 'Shared',
        rows: [
          { name: 'title', type: 'string', description: 'Names the chart for assistive tech and captions the table.' },
          { name: 'tableView', type: 'boolean', default: 'true', description: 'The WCAG-clean twin. Turn it off only if you render your own.' },
          { name: 'format', type: '(n) => string', default: 'compact', description: 'Axis, labels and tooltip.' },
          { name: 'toolbar', type: 'Snippet', description: 'Controls beside the title — a range picker, a series toggle.' }
        ]
      }
    ]
  },
  {
    slug: 'heatmap',
    name: 'Heatmap',
    category: 'Data',
    summary: 'Magnitude across two dimensions — a publishing calendar, an hour × weekday grid, a cohort table.',
    exports: ['Heatmap'],
    notes: [
      'Sequential means one hue, light to dark, never a rainbow: the whole point of the form is that "darker" reads as "more" without a lookup. The ramp is achromatic here, which is the most literal reading of the encoding and keeps the grid inside a monochrome palette.',
      '**Empty is not zero.** A cell with no data gets the surface and a hairline; a real zero gets the first ramp step. Painting both the same turns "we did not measure this" into "this was nothing" — the single most common heatmap lie.',
      'Values are binned into six classes rather than mapped continuously. Past about seven classes adjacent bins stop being distinguishable, so more resolution would be precision the eye cannot read.',
      'A scale legend is not optional. Colour on a continuous scale with no key is a puzzle, and two labelled ends plus the swatches answer it in a glance.',
      'Cells stay square and the grid scrolls sideways inside its own box. A calendar stretched to fit a card reads as a bug; a calendar that widens the page is worse.'
    ],
    props: [
      {
        rows: [
          { name: 'cells', type: 'HeatCell[]', description: '`{ x, y, value }`, where `value: null` means not measured.' },
          { name: 'columns / rows', type: 'string[]', description: 'Explicit order. Omit to take first-seen order from the cells.' },
          { name: 'size', type: 'number', default: '14', description: 'Cell edge in px. Cells stay square.' },
          { name: 'max', type: 'number', description: 'Fixed ceiling for the scale.' },
          { name: 'unit', type: 'string', description: 'What one unit is — shown in the legend and in each cell’s title.' }
        ]
      }
    ]
  },
  {
    slug: 'rank-bars',
    name: 'RankBars',
    category: 'Data',
    summary: 'A ranked list where the bar is the second reading of the number: platform mix, top pages, spend by campaign.',
    exports: ['RankBars'],
    notes: [
      'Horizontal, so the label sits on the same line as its mark. Nothing is rotated, nothing is truncated to fit a band, and no legend is needed to match a colour back to a name.',
      'One colour for every bar. The categories have no natural order, so darkening the biggest would double-encode length as hue and burn the only free channel on information the bar already shows.',
      'Each row is a real `meter` with its value, bounds and text in the accessibility tree — the bar is never the only way to read the number.',
      '`share` rescales against the total instead of the largest row. Those are different questions and they look identical unless the component says which one it is answering.',
      '`limit` folds the tail into one "Other" row. Past a handful of rows a ranked list stops being scannable, and the answer is never a longer list.'
    ],
    props: [
      {
        rows: [
          { name: 'data', type: 'RankDatum[]', description: '`{ label, value, color?, meta? }`.' },
          { name: 'share', type: 'boolean', default: 'false', description: 'Scale to the sum and print percentages.' },
          { name: 'sort', type: 'boolean', default: 'true', description: 'Descending. Off preserves a meaningful sequence.' },
          { name: 'limit', type: 'number | null', description: 'Top n, with the rest folded into "Other".' },
          { name: 'labelWidth', type: 'string', default: "'7.5rem'", description: 'Fixed label column, so every bar starts on one line.' }
        ]
      }
    ]
  },
  {
    slug: 'chat',
    name: 'Agent chat',
    category: 'Chat',
    summary:
      'The pieces of an agent transcript: messages, reasoning, tool calls, attachments, and a composer that knows about streaming.',
    exports: [
      'ChatMessage',
      'ChatThinking',
      'ChatToolCall',
      'ChatAttachment',
      'ChatCompaction',
      'PromptInput'
    ],
    notes: [
      'A chat is the one screen where chrome has to get out of the way, so this set is deliberately roundest and lightest in the whole system: a 22px composer slab, a 16px bubble with one corner cut to 5px, and hairlines in the margin instead of panels for everything the agent did on the way to the answer.',
      'User turns are filled bubbles; assistant turns are full-width prose with no bubble at all. Wrapping a thousand words of output in a chat bubble is what makes an agent UI feel like a toy.',
      'Reasoning and tool calls share one voice: a rule down the left margin and a line of small type, the print convention for an aside. Stack them flush in a zero-gap column and the rules join, so the whole passage of working reads as one thing rather than as four widgets.',
      'Both expand. Give `ChatThinking` children and the label gains a chevron that opens the trace; give `ChatToolCall` children and the line opens on the arguments and result, verbatim, in mono. Without children neither is focusable — a button that expands nothing wastes a tab stop.',
      'A tool call is a line, never a chip or a card. A pill truncates the argument that made the call worth reading, and a bordered panel gives a footnote the same weight as the answer above it.',
      'Every piece of small type comes up a step under 640px. Secondary is a reason to be quiet, never a reason to be unreadable in one hand — the 11px margin notes go to 12.5px, the traces to 13.5px, and the body to 15px.',
      'The composer takes focus as a border-colour change and nothing else. A 3px ring around a slab that round reads as an error state, and the border shift already clears 3:1 for SC 1.4.11.',
      'It carries no shadow, because it is meant to be the bottom edge of the conversation rather than a panel floating over it. Put it inside the scrolling thread as the last child, `position: sticky; bottom: 0`, on the same background the turns scroll on with a short fade above it. In flow the layout reserves exactly its height; overlaying it instead needs a magic bottom padding that goes wrong the moment an attachment makes the composer taller.',
      'Buttons dropped into `leading` / `trailing` inherit the composer’s shape through `--an-icon-btn-radius` and `--an-btn-radius`, so a plain `IconButton` lands in the right language without extra props.',
      'In the composer, Enter sends and Shift+Enter breaks the line (`submitOn="modifier"` flips that). Whitespace-only submissions are impossible.',
      'While streaming, Send becomes a red Stop in the same position — a stop control anywhere else is one nobody finds in time.',
      'Show a filling context window as `ChatCompaction`, not as a percentage. A ring counting to 100 asks the reader to worry about a number they cannot act on; the line says what actually happened and opens to show the summary that replaced those turns.'
    ],
    props: [
      {
        title: 'ChatMessage',
        rows: [
          { name: 'role', type: "'user' | 'assistant' | 'system'", default: "'assistant'", description: 'Drives the whole layout.' },
          { name: 'streaming', type: 'boolean', default: 'false', description: 'Inline caret; holds the action row back until the turn ends.' },
          { name: 'error', type: 'string | null', description: 'Announced failure for the turn.' },
          { name: 'before / actions / avatar', type: 'Snippet', description: 'Tool calls and attachments, the hover action row, the identity glyph.' }
        ]
      },
      {
        title: 'ChatThinking',
        rows: [
          { name: 'active', type: 'boolean', default: 'false', description: 'Shimmers the label and shows the preview line.' },
          { name: 'label', type: 'string', default: "'thinking'", description: 'Lowercase by convention — it is an annotation, not a heading.' },
          { name: 'preview', type: 'string', description: 'One line of the trace, shown while collapsed and active.' },
          { name: 'duration', type: 'number | null', description: 'Seconds, rendered once it stops.' },
          { name: 'children', type: 'Snippet', description: 'The trace. Omit and the label is inert rather than a button that does nothing.' }
        ]
      },
      {
        title: 'ChatToolCall',
        rows: [
          { name: 'name', type: 'string', description: 'Tool identity — rendered in mono.' },
          { name: 'status', type: "'pending' | 'running' | 'success' | 'error'", default: "'success'", description: '`running` spins and gains contrast; `success` recedes; `error` tints and says so in words.' },
          { name: 'summary / duration', type: 'string / number', description: 'The identifying argument, and seconds taken.' },
          { name: 'children', type: 'Snippet', description: 'Arguments and result. Present, the pill becomes a toggle; absent, it is a plain status chip.' }
        ]
      },
      {
        title: 'ChatCompaction',
        rows: [
          { name: 'count', type: 'number | null', description: 'How many turns were folded into the summary.' },
          { name: 'label', type: 'string', description: 'Overrides the generated wording — the place to hang a translation.' },
          { name: 'children', type: 'Snippet', description: 'The summary that replaced those turns; makes the rule expandable.' }
        ]
      },
      {
        title: 'ChatAttachment',
        rows: [
          { name: 'file', type: 'ChatFile', description: '`{ id, name, size?, kind?, url? }`. Images get a thumbnail, everything else its extension.' },
          { name: 'onremove', type: '(id) => void', description: 'Shows the ✕. Omit inside a sent message.' },
          { name: 'progress', type: 'number | null', description: 'Upload progress as a hairline, without resizing the chip.' }
        ]
      },
      {
        title: 'PromptInput',
        rows: [
          { name: 'value', type: 'string', description: 'Bindable text.' },
          { name: 'submitOn', type: "'enter' | 'modifier'", default: "'enter'", description: 'Enter, or ⌘/Ctrl+Enter for long-form composers.' },
          { name: 'streaming', type: 'boolean', default: 'false', description: 'Turns Send into a red Stop, in the same place.' },
          { name: 'minHeight / maxHeight', type: 'number', default: '44 / 200', description: 'Autosize floor and ceiling in px; past the ceiling the field scrolls instead of eating the transcript.' },
          { name: 'attachments / leading / trailing', type: 'Snippet', description: 'Staged files, and the slots for model or mode pickers.' },
          { name: 'onsubmit / onstop', type: '(value) => void / () => void', description: 'Commit and cancel.' }
        ]
      }
    ]
  },
  {
    slug: 'stat',
    name: 'Stat & StatusDot',
    category: 'Display',
    summary:
      'A number with its label and its direction of travel, and the smallest honest way to show a state.',
    exports: ['Stat', 'StatusDot'],
    notes: [
      'Tabular figures are not optional here. A dashboard is a column of numbers, and proportional digits do not line up down a column.',
      'The delta names its own direction *and* whether that direction is welcome: `direction="down" good` is churn falling, `direction="down"` alone is revenue falling. One prop would have conflated them.',
      'The arrow carries the meaning and the colour only reinforces it, so a delta still reads in greyscale and under forced colours.',
      'StatusDot requires a label. A bare coloured dot fails SC 1.4.1 and says nothing at all to a screen reader; `labelHidden` moves the word out of the layout, never out of the accessibility tree.',
      '`pulse` is for states genuinely in progress. A dot pulsing next to a finished job is a spinner nobody turned off.'
    ],
    props: [
      {
        title: 'Stat',
        rows: [
          { name: 'label / value', type: 'string / string | number', description: 'The field name and the figure. Pre-formatted — the component does not know your locale.' },
          { name: 'unit', type: 'string', description: 'Qualifier beside the value, at a smaller size.' },
          { name: 'delta', type: 'string | null', description: 'Change since the comparison period.' },
          { name: 'direction', type: "'up' | 'down' | 'flat'", default: "'flat'", description: 'The arrow.' },
          { name: 'good', type: 'boolean', default: 'true', description: 'Is that direction welcome? Drives the colour, not the arrow.' },
          { name: 'chart', type: 'Snippet', description: 'A Sparkline under the figure, at the same width.' }
        ]
      },
      {
        title: 'StatusDot',
        rows: [
          { name: 'label', type: 'string', description: 'Required. The state in words.' },
          { name: 'labelHidden', type: 'boolean', default: 'false', description: 'Keeps the name, drops the layout.' },
          { name: 'tone', type: 'Tone', default: "'neutral'", description: 'Dot colour.' },
          { name: 'pulse', type: 'boolean', default: 'false', description: 'Halo for ongoing states.' }
        ]
      }
    ]
  },
  {
    slug: 'avatar-group',
    name: 'AvatarGroup',
    category: 'Display',
    summary: 'Overlapping faces for "these people", with the overflow arithmetic done for you.',
    exports: ['AvatarGroup'],
    notes: [
      'It takes people as data rather than as Avatar children so the overflow count cannot disagree with the faces shown — "+3" beside four hidden people is the classic version of this bug.',
      'Each face carries a ring in the surface colour. Without that cutout, overlapping circles smear into one shape; set `ring` to whatever the stack actually sits on.',
      'The group is labelled with every name, shown or collapsed, so the count never hides people from assistive tech.'
    ],
    props: [
      {
        rows: [
          { name: 'people', type: 'Person[]', description: '`{ id?, name, avatar? }`.' },
          { name: 'max', type: 'number', default: '3', description: 'Faces before the rest become "+n".' },
          { name: 'ring', type: 'string', default: 'var(--an-surface)', description: 'Cutout colour — match the surface behind.' },
          { name: 'label', type: 'string | null', description: 'Text beside the stack: a first name, or "4 here".' }
        ]
      }
    ]
  },
  {
    slug: 'empty-state',
    name: 'EmptyState',
    category: 'Display',
    summary: 'The screen before there is anything to show — and the one after a load fails.',
    exports: ['EmptyState'],
    notes: [
      'The shape enforces the three things that separate a dead end from a starting point: what is missing, why that is normal, and the action that fixes it.',
      'A failure and an empty list are the same problem to the reader — "nothing here" — so `tone="error"` is the same layout rather than a second component with a second padding.',
      'The description is capped at 42ch. An empty state that needs a paragraph is documentation wearing a component.'
    ],
    props: [
      {
        rows: [
          { name: 'title', type: 'string', description: 'What is missing.' },
          { name: 'description', type: 'string', description: 'Why, in one sentence.' },
          { name: 'tone', type: "'empty' | 'error'", default: "'empty'", description: '`error` also announces itself as an alert.' },
          { name: 'icon / actions', type: 'Snippet', description: 'Optional glyph, and the buttons that end the emptiness.' }
        ]
      }
    ]
  },
  {
    slug: 'table',
    name: 'Table',
    category: 'Display',
    summary: 'Styling and scroll behaviour for a table you write in native markup.',
    exports: ['Table'],
    notes: [
      'Deliberately not a DataTable with column definitions. Column configs are a second, worse templating language: the moment a cell needs two lines, a badge and a link, you are writing render functions inside an array.',
      'The wrapper is a focusable labelled region. A scroll container a keyboard user cannot focus is a column they can never reach (SC 2.1.1) — this is the WAI scrollable-region technique, not an accessibility violation.',
      'Put `data-numeric` on a cell to right-align it and switch on tabular figures; `data-interactive` and `data-selected` on a `<tr>` for row states.',
      'A sticky head needs an opaque background or the rows scroll through it. That is handled; `stickyHead` is all you pass.'
    ],
    props: [
      {
        rows: [
          { name: 'label', type: 'string', description: 'Names the scroll region for keyboard and screen-reader users.' },
          { name: 'stickyHead', type: 'boolean', default: 'false', description: 'Pins `<thead>` while the body scrolls.' },
          { name: 'density', type: "'comfortable' | 'compact'", default: "'comfortable'", description: 'Row padding.' },
          { name: 'rules', type: 'boolean', default: 'true', description: 'Hairlines between rows.' }
        ]
      }
    ]
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    category: 'Navigation',
    summary: 'Where this page sits, and the way back out — collapsing in the middle when the trail is deep.',
    exports: ['Breadcrumb'],
    notes: [
      'An ordered list inside a labelled `nav`, which is the structure assistive tech expects to find. The last crumb is text with `aria-current="page"`, not a link to where you already are.',
      'Separators are generated by CSS and hidden from assistive tech, so nobody hears "slash" four times.',
      'Past `collapseAfter` the middle folds into a "…" button: origin and position are the two crumbs a reader actually uses, and a deep trail otherwise wraps into a paragraph of grey text on a phone.'
    ],
    props: [
      {
        rows: [
          { name: 'items', type: 'Crumb[]', description: '`{ label, href? }`. The last entry is the current page.' },
          { name: 'collapseAfter', type: 'number', default: '4', description: 'Trail length that triggers the fold.' },
          { name: 'label', type: 'string', default: "'Breadcrumb'", description: 'Accessible name for the nav.' }
        ]
      }
    ]
  },
  {
    slug: 'app-shell',
    name: 'AppShell & TopBar',
    category: 'Layout',
    summary:
      'The frame every app rebuilds: a rail, a header, and exactly one scroll region between them.',
    exports: ['AppShell', 'TopBar'],
    notes: [
      'The shell is `100dvh` and `main` is the only scroll container. If the page scrolls instead, the rail scrolls away with it and a sticky header inside the content stops sticking — that single decision is most of what this component is.',
      '`dvh`, not `vh`: on iOS `100vh` is taller than the visible viewport while the browser chrome is up, so a `vh` shell hangs its own bottom edge behind the address bar.',
      'Bind `scrollElement` and hand it to `TopBar` — the bar then watches the real scroller instead of the window, which is what makes its hairline appear at the right moment.',
      'TopBar is frosted and keeps its hairline at all times, which is how the app has always drawn it: the rail, the bar and the content are three different surfaces, so the line separates real things from the first pixel. `divider="scroll"` is there for a bar sitting directly on the content surface, where there genuinely is nothing to divide yet.',
      'Its height is fixed rather than a minimum. Everything in a shell measures against the header — a drawer’s top edge, a sticky table head, `100dvh - header` — so a bar that grows a pixel when a subtitle appears moves all of them.',
      'The title is tracked tighter than the type ramp’s default and the eyebrow is smaller and airier than the caption default. At 56px those two lines have to read as chrome rather than as the first paragraph of the page.',
      'Below `compactAt` the page actions move into an overflow menu rather than being hidden. Hiding actions below a breakpoint hides the thing the page is for.',
      'It measures its own width, not the viewport: the bar is the sidebar\u2019s complement, so the window can be wide while the bar is not.'
    ],
    props: [
      {
        title: 'AppShell',
        rows: [
          { name: 'sidebar / header / footer', type: 'Snippet', description: 'The rail, the fixed header, and a persistent bottom region.' },
          { name: 'contentWidth', type: 'string | null', description: 'Caps the content column so prose does not run the width of a monitor.' },
          { name: 'scrollElement', type: 'HTMLElement | null', description: 'Bindable. Hand it to TopBar.' }
        ]
      },
      {
        title: 'TopBar',
        rows: [
          { name: 'title / eyebrow', type: 'string', description: 'Where you are, and the section it belongs to.' },
          { name: 'subtitle', type: 'string', description: 'One line under the title: a count, a state, the record being edited.' },
          { name: 'divider', type: "'always' | 'scroll' | 'none'", default: "'always'", description: 'The hairline. `always` is the app’s look.' },
          { name: 'glass / height', type: 'boolean / string', default: "true / '56px'", description: 'Frosted background, and the fixed bar height the shell measures against.' },
          { name: 'sticky', type: 'boolean', default: 'true', description: 'Pin to the top of the scroll container.' },
          { name: 'compactAt', type: 'number', default: '720', description: 'Width below which actions collapse into a menu.' },
          { name: 'leading / actions / trailing', type: 'Snippet', description: 'Sidebar toggle, page actions (collapsible), and things that never collapse.' }
        ]
      }
    ]
  },
  {
    slug: 'sidebar',
    name: 'Sidebar',
    category: 'Layout',
    summary: "The app's primary rail: expanded, collapsed to icons, or a drawer on a phone.",
    exports: ['Sidebar', 'SidebarSection', 'SidebarItem'],
    notes: [
      'Collapsing is a width change on one CSS variable, not a different tree. Nothing unmounts, focus survives it, and a single animated property is what keeps it smooth on machines that are not yours.',
      'Collapsed, labels are clipped rather than removed. `display: none` would strip each item\u2019s accessible name and leave a rail of anonymous glyphs; the label also comes back as a tooltip for sighted users.',
      'A SidebarItem with `href` is an `<a>`. Rendering nav as a `<div onclick>` costs middle-click, \u2318-click and "copy link address" — a real cost for zero gain.',
      '`current` sets `aria-current="page"`. The accent bar is the visual half of that statement, never the whole of it.',
      'The rail sits on `--an-surface-rail`, a step back from the content surface. That recession is what says “this is chrome”, and it means the hairline can stay a hairline instead of carrying the separation alone. As a drawer it flips to the raised surface — a recessed panel floating over content reads as a hole, not a layer.',
      'The current item lifts *forward* onto the content surface rather than being filled with a tint. On a recessed rail the page you are on is the one part that is not recessed, which explains the tint instead of fighting it — and it is joined by weight and an accent bar, because fill alone is easy to miss.',
      'Rows are 32px with 8px of padding and 16px icons: the app’s own rail metrics. A 36px row beside a 36px icon button read as two different systems.',
      'On a phone use `overlay` — the rail becomes a drawer with a scrim, Escape, a focus trap and a scroll lock. A collapsed rail on a 390px screen is neither readable nor worth the space it saves.'
    ],
    props: [
      {
        title: 'Sidebar',
        rows: [
          { name: 'collapsed', type: 'boolean', default: 'false', description: 'Icons only. Labels stay in the accessibility tree.' },
          { name: 'overlay / open', type: 'boolean', description: 'Phone drawer, and its visibility (bindable).' },
          { name: 'width / collapsedWidth', type: 'string', default: "'256px' / '64px'", description: 'The two rail widths.' },
          { name: 'header / footer', type: 'Snippet', description: 'Pinned above and below the scrolling nav.' }
        ]
      },
      {
        title: 'SidebarItem',
        rows: [
          { name: 'label', type: 'string', description: 'Required — it is the accessible name in both states.' },
          { name: 'href', type: 'string', description: 'Present renders an `<a>`; absent, a `<button>`.' },
          { name: 'current', type: 'boolean', default: 'false', description: 'Sets `aria-current="page"` and the accent bar.' },
          { name: 'badge', type: 'number | boolean', description: 'A count, or `true` for a dot. Collapses to a marker on the icon.' },
          { name: 'icon / trailing', type: 'Snippet', description: 'Glyph, and a trailing control.' }
        ]
      },
      {
        title: 'SidebarSection',
        rows: [
          { name: 'label', type: 'string', description: 'A real heading, so a screen reader can skip the group rather than walk it.' },
          { name: 'collapsed', type: 'boolean', default: 'false', description: 'Swaps the heading for a hairline.' },
          { name: 'action', type: 'Snippet', description: 'A "+" or overflow menu beside the heading.' }
        ]
      }
    ]
  },
  {
    slug: 'site-chrome',
    name: 'SiteHeader & SiteFooter',
    category: 'Marketing',
    summary:
      'The marketing navbar and footer: a different job from app chrome, and a different set of mistakes to avoid.',
    exports: ['SiteHeader', 'SiteFooter'],
    notes: [
      'A landing header is not an AppBar. It holds a wordmark, a few links, some utilities and a CTA at desktop width, and collapses the middle on a phone — but never the CTA, which is the reason the page exists.',
      'The mobile menu is a real `<dialog>` opened with `showModal`. Escape, focus containment and the top layer come from the platform instead of from a div with a high z-index and a keydown handler.',
      'The bar frosts once the page has scrolled, not before. Glass over the top of an unscrolled page is an effect applied to nothing.',
      'Footer columns are real sections with real headings, which is what lets assistive tech skip a column instead of walking forty links.',
      'Footer links are `--an-text-muted`, never fainter. A footer is the most-linked region on a marketing site, and small type is exactly where contrast has least room to spare.',
      'The oversized wordmark is `aria-hidden`: it is a graphic, and the site was already named at the top of the page.'
    ],
    props: [
      {
        title: 'SiteHeader',
        rows: [
          { name: 'links', type: 'SiteLink[]', description: '`{ label, href, external? }`.' },
          { name: 'current', type: 'string', description: 'Matched against each href to set `aria-current`.' },
          { name: 'glass / sticky', type: 'boolean', default: 'true', description: 'Frost on scroll, and pin to the top.' },
          { name: 'brand / utilities / cta', type: 'Snippet', description: 'Wordmark, theme and language controls, and the CTA that never collapses.' }
        ]
      },
      {
        title: 'SiteFooter',
        rows: [
          { name: 'columns', type: '{ title, links }[]', description: 'The link directory. Data, because that is what it is.' },
          { name: 'wordmark', type: 'string | null', description: 'Oversized brand across the bottom. Decorative by definition.' },
          { name: 'cta / brand / social / legal', type: 'Snippet', description: 'Closing CTA band, the brand block, icons, and the last row.' }
        ]
      }
    ]
  },
  {
    slug: 'cookie-bar',
    name: 'CookieBar',
    category: 'Marketing',
    summary: 'The consent notice, with the two properties that make consent valid built into its shape.',
    exports: ['CookieBar'],
    notes: [
      'Reject is the same size, variant and weight as Accept, at every width including the one where these banners usually start cheating. A prominent "Accept all" beside a grey text link is a pattern regulators have repeatedly ruled invalid.',
      'It does not trap the page: no scrim, no focus trap, no modal. Consent must be freely given, and a wall that cannot be dismissed without choosing is coercion.',
      'It is a polite `region`, not an alert — a cookie notice is not an emergency.',
      'The caller owns persistence. A library component should never decide what your cookie policy stores.'
    ],
    props: [
      {
        rows: [
          { name: 'open', type: 'boolean', default: 'true', description: 'Bindable. Both actions close it.' },
          { name: 'title / description', type: 'string', description: 'The notice.' },
          { name: 'acceptLabel / rejectLabel', type: 'string', description: 'Equal choices, equally labelled.' },
          { name: 'settingsLabel', type: 'string', description: 'Opens granular preferences. Omit if you have none.' },
          { name: 'onaccept / onreject / onsettings', type: '() => void', description: 'Persistence is yours.' }
        ]
      }
    ]
  },
  {
    slug: 'reveal',
    name: 'Reveal & Counter',
    category: 'Motion',
    summary:
      'Entrance animation on scroll, and numbers that animate to their value — both decorative, both able to be switched off without losing content.',
    exports: ['Reveal', 'Counter'],
    notes: [
      'Reveal fires once by default. Content that re-animates every time it scrolls back into view turns reading into a slideshow.',
      'If `IntersectionObserver` is missing or JS never runs, the content renders visible rather than invisible-forever — entrance motion must never be able to hide a page.',
      'Stagger a group by passing `index` inside an `{#each}`; each item waits `index × stagger`.',
      'Counter animates from its current value when the value changes, not from zero, and holds a real formatted number in the DOM on every frame.',
      'Both render their final state instantly under `prefers-reduced-motion`.'
    ],
    props: [
      {
        title: 'Reveal',
        rows: [
          { name: 'y / x', type: 'number', default: '12 / 0', description: 'Travel distance in px. Keep it small — long travel lies about where content came from.' },
          { name: 'index / stagger', type: 'number', default: '0 / 60', description: 'Position in a group and the per-item delay in ms.' },
          { name: 'delay / duration', type: 'number', default: '0 / 500', description: 'Extra delay and the transition length, in ms.' },
          { name: 'repeat', type: 'boolean', default: 'false', description: 'Re-animate on every entry. Off on purpose.' },
          { name: 'threshold', type: 'number', default: '0.15', description: 'Fraction visible before it fires.' }
        ]
      },
      {
        title: 'Counter',
        rows: [
          { name: 'value', type: 'number', description: 'Target. Changing it animates from the current display.' },
          { name: 'from', type: 'number', default: '0', description: 'Where the first run starts.' },
          { name: 'format', type: '(value) => string', description: 'Full control of the rendered string — currency, compact, units.' },
          { name: 'decimals / prefix / suffix', type: 'number / string', description: 'Shorthand when `format` is overkill.' },
          { name: 'startOnView', type: 'boolean', default: 'true', description: 'Wait until it scrolls into view.' }
        ]
      }
    ]
  },
  {
    slug: 'spatial',
    name: 'Spatial',
    category: 'Motion',
    summary:
      'A navigable 3D stage for floating content: drag to rotate, pinch or ⌘-scroll to zoom, with inertia, keyboard control and a clamped horizon.',
    exports: ['Spatial', 'SpatialItem'],
    notes: [
      'CSS 3D, not WebGL — real DOM, real text, real accessibility, and no dependency. For thousands of objects, lighting or occlusion, use a renderer instead.',
      'Transitions are disabled while a pointer is down so the stage tracks the finger exactly; easing during a drag is what makes web 3D feel like a video of 3D.',
      'Plain wheel scrolling is left alone deliberately. Zoom is ctrl/⌘+wheel — which is also what a trackpad pinch sends — so the page still scrolls over the scene.',
      'Vertical rotation is clamped by `maxTilt`: an upside-down stage is disorientation, not freedom.',
      'Keyboard: arrows rotate, `+`/`-` zoom, `0` resets. The stage is `role="application"` because it consumes the arrow keys.',
      'Under reduced motion the idle drift and the release inertia stop; direct manipulation stays, because that motion is the user\'s own.'
    ],
    props: [
      {
        title: 'Spatial',
        rows: [
          { name: 'perspective', type: 'number', default: '1000', description: 'Camera distance in px. Lower is a wider, more dramatic lens.' },
          { name: 'rotateX / rotateY / zoom', type: 'number', default: '-8 / -18 / 1', description: 'Bindable view state.' },
          { name: 'maxTilt', type: 'number', default: '26', description: 'Vertical rotation clamp, in degrees.' },
          { name: 'minZoom / maxZoom', type: 'number', default: '0.6 / 2.2', description: 'Zoom limits.' },
          { name: 'autoRotate', type: 'boolean', default: 'true', description: 'Idle drift until the user takes over.' },
          { name: 'hint', type: 'string | null', description: 'Gesture affordance; fades once the scene is touched.' }
        ]
      },
      {
        title: 'SpatialItem',
        rows: [
          { name: 'x / y / z', type: 'number', default: '0', description: 'Position in px. `z` is toward the viewer.' },
          { name: 'rotateX / rotateY', type: 'number', default: '0', description: 'Rotation about the object\'s own centre.' },
          { name: 'float / index', type: 'boolean / number', default: 'true / 0', description: 'Idle bob; `index` offsets the phase so a group never moves in lockstep.' },
          { name: 'billboard', type: 'boolean', default: 'false', description: 'Counter-rotate to keep facing the camera — for text that must stay readable.' }
        ]
      }
    ]
  },
  {
    slug: 'theme',
    name: 'Theme',
    category: 'Foundations',
    summary: 'Light / dark / system with no flash on first paint, driven by one `data-theme` attribute.',
    exports: ['ThemeProvider', 'ThemeToggle', 'theme', 'themeScript'],
    notes: [
      'Add `themeScript` to `app.html` — ThemeProvider runs after hydration, one frame too late to prevent the flash on its own.',
      '`theme.mode` is what the user chose (including "system"); `theme.resolved` is what is painted.'
    ],
    props: [
      {
        title: 'theme',
        rows: [
          { name: 'mode', type: "'light' | 'dark' | 'system'", description: 'The stored preference.' },
          { name: 'resolved', type: "'light' | 'dark'", description: 'What is actually painted.' },
          { name: 'set(mode) / toggle()', type: 'method', description: 'Change and persist the preference.' }
        ]
      }
    ]
  },
  {
    slug: 'gestures',
    name: 'Gestures',
    category: 'Foundations',
    summary: 'The three actions every touch surface here is built from: ripple, press and swipe.',
    exports: ['ripple', 'press', 'swipe', 'haptic'],
    notes: [
      'Ripple queues its fade until the grow animation lands, so a 40ms tap still plays the full gesture.',
      'Press and swipe both cancel on `pointercancel` — the event the browser fires when it claims the gesture for scrolling.',
      'Haptics are a no-op where the Vibration API is missing (notably iOS Safari) and under reduced motion.'
    ],
    props: [
      {
        title: 'use:ripple',
        rows: [
          { name: 'disabled', type: 'boolean', description: 'Skip the effect.' },
          { name: 'centered', type: 'boolean', default: 'false', description: 'Always start from the centre.' },
          { name: 'unbounded', type: 'boolean', default: 'false', description: 'Let the ink grow past the host.' },
          { name: 'color / opacity', type: 'string / number', description: 'Ink appearance.' }
        ]
      },
      {
        title: 'use:swipe',
        rows: [
          { name: 'axis', type: "'x' | 'y'", default: "'y'", description: 'Tracked axis.' },
          { name: 'threshold', type: 'number', default: '6', description: 'px before the gesture is claimed.' },
          { name: 'onstart / onmove / onend', type: '(state) => void', description: '`{ delta, velocity, event }`.' }
        ]
      }
    ]
  }
];


export const CATEGORY_ORDER = [
  'Foundations',
  'Actions',
  'Display',
  'Forms',
  'Feedback',
  'Overlays',
  'Navigation',
  'Layout',
  'Marketing',
  'Data',
  'Chat',
  'Motion'
] as const;
