---
name: anomalia-ui
description: Build or modify UI in a SvelteKit app that uses the @anomalia/ui design system — screens, pages, forms, dashboards, dialogs, navigation, empty states, marketing sections. Use this skill whenever the work touches how something looks or behaves on screen in such an app, including "add a settings page", "make this form", "build a dashboard", "style this list", "add a modal", "why does this look off", or any request to write Svelte markup and CSS in a repo that depends on @anomalia/ui — even when the user does not mention the design system by name.
---

# Building with @anomalia/ui

This design system is quiet at rest and expressive on contact: near-monochrome
surfaces, hairlines instead of shadows, tight radii — then Material interaction
the moment a finger or cursor lands. Your job is to compose it, not to restyle
it. Almost every "design decision" you are tempted to make has already been made
in a token or a component, and re-making it locally is how a system dies.

Work in this order: **find the component → pick the tokens → compose → check**.

## The five rules

**1. Never write a raw value.** No hex colours, px paddings, font sizes,
durations or easing curves in app code. Reach for `var(--an-*)`. If the value
you need does not exist, that is a signal to use a different component or a
different variant, not to invent a value — the scales are deliberately short so
screens stay consistent, and one hard-coded `#eee` is what starts the drift.

**2. Never restyle a component with a more specific selector.** If a Button
looks wrong, either you want a different `variant`, or the token behind it needs
overriding at `:root` for the whole app. `:global(.an-btn) { background: … }` is
always the wrong answer: it breaks the moment the component's internals change,
and it breaks only in your app.

**3. Ink is the interactive colour; the brand hue is for identity.**
`--an-accent` is near-black in light and near-white in dark. Every control fill,
focus ring and pressed state uses it, which is why they clear WCAG contrast by a
wide margin. `--an-brand` (the violet) is available for moments that should feel
like Anomalia — a mark, a marketing accent — and is deliberately wired to no
control. Do not swap them.

**4. Two kinds of line.** `--an-border` is the decorative hairline: cards,
dividers, table rules. `--an-border-control` bounds a real control — input,
select, switch track — and is dark enough to clear the 3:1 that WCAG requires
for control boundaries. Using the hairline on an input is the single most common
accessibility failure in systems that look like this one.

**5. Compose before you build.** Before writing a new component, check
`references/components.md`. A "stat card" is `Card` + `Text variant="caption"` +
`Text variant="title2" numeric` + `Badge`. A "settings row" is `ListItem` with a
`Switch` in its trailing slot. New components are for genuinely new behaviour,
not for layouts you can assemble.

## Picking the component

| You need | Use | Not |
| --- | --- | --- |
| An action | `Button` (`href` makes it a link, keeping every state) | An `<a>` styled as a button |
| An icon-only action | `IconButton` (requires `label`) | `Button` with only an icon |
| A container | `Card` — add `href`/`onclick` to make it interactive | A `<div>` with a border |
| Any text | `Text` with a variant | Raw `<p>`/`<h2>` with font-size |
| A choice of 2–4 | `SegmentedControl` | Buttons that toggle |
| A choice from a list | `Select` (a real `<select>`) | A custom listbox |
| On/off, applied immediately | `Switch` | `Checkbox` |
| On/off, applied on save | `Checkbox` | `Switch` |
| A modal decision, desktop | `Dialog` | A positioned `<div>` |
| A modal decision, phone | `BottomSheet` | `Dialog` |
| A transient message | `toast()` + one `<Toaster />` at the root | An inline banner |
| A persistent message | `Alert` | A toast |
| Settings/navigation rows | `List` + `ListItem` | A table |
| An id, path, timestamp, shortcut | `Code`, `Kbd`, `Text family="mono"` | Raw `<code>` |
| A turn in an agent transcript | `ChatMessage` (it styles rendered markdown too) | A `Card` per message |
| A tool the agent ran | `ChatToolCall`, stacked flush under `ChatThinking` | A chip, or a bordered panel each |
| A context window filling up | `ChatCompaction` | A percentage ring or meter |

Full API, including the props worth knowing: **`references/components.md`**.

## Type: pick a pairing, not a size

Never choose a font size. Choose a pairing — the combination is what carries the
hierarchy, and these are the ones the system already uses:

| Context | Recipe |
| --- | --- |
| Page header | `caption` eyebrow → `title1` → `callout` muted lead |
| Section header | `title3` → `footnote` muted |
| Card header | `headline` → `footnote` muted |
| Stat tile | `caption` → `title2 numeric` → `Badge` |
| List row | `body` → `footnote` muted → trailing value |
| Form field | label → input → hint (handled by `Field`/`TextField`) |
| Empty state | `headline` → `footnote` muted → one `Button` |
| Marketing hero | `caption` → `display` → `callout` muted |

Two supporting rules that prevent most type mistakes: keep a heading and its
supporting line **one or two steps apart** on the ramp, and reach for
`tone="muted"` before reaching for a smaller size — shrinking secondary text
twice is how a screen ends up with 11px paragraphs.

## Sans or mono

One question decides it: **who wrote this?**

- A person wrote it → Inter. Prose, titles, labels, names, button text.
- A machine emitted it → mono. Ids (`run_8f2c41d`), paths, machine timestamps,
  durations (`38.1s`), log lines, code, keyboard shortcuts, spec values.
- A person will compare it down a column → Inter with `numeric`. Tabular figures
  align just as well as mono and do not turn a metrics panel into a terminal.

Money and KPIs (`€49`, `184.2k`) are read, not parsed: they are **sans**. A
heading is never mono, even when it names an identifier — set the heading in
sans and put the mono form underneath.

## Interaction is not yours to write

Ripple, press feedback, state layers and gestures already live in the
components. When you build something genuinely custom, use the actions rather
than re-implementing them: `use:ripple`, `use:press`, `use:swipe`. They handle
the parts that are easy to get wrong — a ripple that survives a fast tap, a
press that cancels when the touch turns into a scroll, a swipe that commits on
distance *or* velocity.

Three constraints worth knowing while composing:

- **Touch targets are at least 44px.** Components handle their own; if you build
  a custom hit area, match it.
- **Hover is not available on phones.** Never put information only in a
  `Tooltip` — it renders nothing on touch, by design.
- **Motion is decoration.** Never encode meaning in animation alone; it is
  stripped under `prefers-reduced-motion`.

## Before you call it done

Run through this — most review comments on this system come from one of these:

- [ ] No hex colours, px sizes, or timing values in the diff. Only `var(--an-*)`.
- [ ] No `:global()` targeting a library class.
- [ ] Every input has a `label` (or an explicit `aria-label`), and hints go
      through the component's `hint` prop so they are wired with
      `aria-describedby` rather than left floating next to the control.
- [ ] Every `IconButton` has a `label`.
- [ ] Interactive rows are a `ListItem` with `href`/`onclick` — not a `<div>`
      with a click handler.
- [ ] A row with a `Switch` in its trailing slot has **no** `onclick` of its own,
      or the two controls fight over the same tap.
- [ ] Text uses `Text` variants; numbers a user compares use `numeric`.
- [ ] In a chat: no `Card` around a turn, reasoning and tool calls stacked flush
      in a zero-gap column so their margin rules join, and the context window
      shown as `ChatCompaction` rather than as a percentage.
- [ ] Any small text you add to a chat steps up under 640px, like the library's
      own does. Check the transcript at phone width before calling it done.
- [ ] If you touched `tokens.css` or `theme.css`, run `npm run audit:contrast`.
      It fails the build on a regression, so a red run means the change is not
      done, not that the audit is wrong.
- [ ] `npm run check` passes.

## Reference files

Read these when the task needs them — they are long and precise, and there is no
value in loading them for a one-line change:

- **`references/components.md`** — every export, its props and its behaviour
  notes. Generated from the system, so it cannot describe a prop that no longer
  exists. Read it before using a component you have not used in this session.
- **`references/tokens.md`** — every semantic token with its resolved light and
  dark value, plus the type, space, radius, motion and state-layer scales. Read
  it when choosing a token or theming an app.
- **`references/recipes.md`** — copy-paste scaffolds for the screens that come up
  constantly: app shell, form, list screen, dashboard, dialog-vs-sheet, empty
  state, marketing section. Start here when building a whole screen.

Both reference files are generated by `npm run skill:reference` from
`src/docs/catalog.ts` and the CSS. If they look out of date, regenerate rather
than editing them.
