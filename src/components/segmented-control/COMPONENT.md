# SegmentedControl

**Category:** selection
**Kind:** control

> A switch between 2–5 mutually exclusive options or modes that takes effect immediately.

## When to use
- Choosing one value or view mode with an instant effect: report period, list / board / calendar view, theme.
- A compact one-of-many choice inside a toolbar, next to inputs and buttons of the same size.
- A status picker where each option has its own palette hue (`color` on the item).
- A status overview where each option carries a metric (two-line segments with `Count` and `Description`).

## When not to use
- Switching between panels of content (navigation) → use [Tabs](../tabs/COMPONENT.md).
- One choice with descriptions in a form, or more than 5 options → use [Radio](../radio/COMPONENT.md) or [Select](../select/COMPONENT.md).
- A single on/off setting → use [Switch](../switch/COMPONENT.md).
- Several actions in a row (not a selection) → use [ButtonGroup](../button-group/COMPONENT.md).

## Import
```tsx
import { SegmentedControl } from "prime-ui-kit";
```

## Anatomy
```
SegmentedControl.Root                 field frame: label row · track · support row (hint | error)
└─ (track)                            role="radiogroup"; sliding thumb, switcher row, keyboard
   └─ SegmentedControl.Item           role="radio" button, one option
      ├─ SegmentedControl.Icon        icon slot (optional; icon-only → square segment)
      ├─ SegmentedControl.Label       title, one line (optional; plain text becomes the label)
      ├─ SegmentedControl.Count       counter Badge after the label (optional)
      └─ SegmentedControl.Description second line; makes the segment two-line (optional)
```
The root is a field root: `className`, `ref` and the native attributes land on the frame, which hugs the track unless `fullWidth`; `id`, `onKeyDown` and the `aria-label*` / `aria-describedby` names land on the radiogroup. Without `label`, `hint` and `error` the frame shows only the track.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### SegmentedControl.Root
`ref` → `HTMLDivElement` (the field frame). The field: label · `<div role="radiogroup">` track with the sliding thumb and the switcher row (titles go before it scrolls, when every segment has an icon) · support row. The frame hugs the track unless `fullWidth`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Selected value (controlled). |
| `defaultValue` | `string` | `""` | Initial value (uncontrolled); `""` — nothing selected. |
| `onValueChange` | `(value: string) => void` | — | Called with the new value on click or arrow keys. |
| `disabled` | `boolean` | `false` | Disables the whole group. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Control tier; the outer height equals the control height 28 · 32 · 36 · 40 · 48. Without it the tier of its host (a toolbar, a panel with a size), else `m`. |
| `fullWidth` | `boolean` | `false` | Fills the container; single-line segments tend to equal widths but never get narrower than their label — when they do not fit, the row scrolls. |
| `label` | `ReactNode` | — | Heading above the control; names the `radiogroup` (`aria-labelledby`). Without it give the root an `aria-label`. |
| `required` | `boolean` | `false` | Red `*` after the label and `aria-required` on the `radiogroup`. |
| `optional` | `boolean` | `false` | Muted marker after the label (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the control (`aria-describedby`). Hidden while `error` is shown. |
| `hintTone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger inset ring, `aria-invalid` and `data-invalid` on the `radiogroup`; the control shakes once when an error arrives. |
| `reserveSupportRow` | `boolean` | `false` | Always render the support row, so an appearing error does not shift the layout. |
| `id` | `string` | — | Id of the `radiogroup` element (generated when omitted); hint id is `<id>-hint`, error id `<id>-error`. |
| `labels` | `Partial<SegmentedControlLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | `SegmentedControl.Item`s (may be wrapped, e.g. in `Tooltip.Trigger`). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange" \| "dir">` | — | `aria-label` / `aria-labelledby` / `aria-describedby` and `onKeyDown` go to the radiogroup (a prevented key skips the kit's handling); `className`, `data-*` and the other attributes to the field frame `<div>`. |

### SegmentedControl.Item
`ref` → `HTMLButtonElement`. One option, a `<button role="radio">` with roving `tabIndex`; plain text is wrapped in a `SegmentedControl.Label`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Option value compared with the root value. |
| `disabled` | `boolean` | `false` | Disables this option; arrow keys skip it. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | Palette hue: a dot before the content; while selected the thumb takes a soft fill of the hue with a ring of it. |
| `children` | `ReactNode` | — (required) | Text, `Icon`, `Label`, `Count`, `Description`. Only an icon → square segment; give it `aria-label`. |
| `className` | `string` | — | Class on the segment button. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" \| "type" \| "role">` | — | `aria-label`, `onClick` (runs first and can `preventDefault()` the selection), `className` and the other button attributes. |

### SegmentedControl.Icon
`ref` → `HTMLSpanElement`. Decorative icon (`aria-hidden`) sized to the tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="theme.light" />`. |
| `className` | `string` | — | Class on the icon box. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### SegmentedControl.Label
`ref` → `HTMLSpanElement`. Segment title on one line; never truncated. Plain text is wrapped automatically.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Title text. |
| `className` | `string` | — | Class on the label. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### SegmentedControl.Count
`ref` → `HTMLSpanElement`. Counter `Badge` after the label, one tier below the control, tabular numbers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Badge hue. |
| `children` | `ReactNode` | — (required) | The number. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### SegmentedControl.Description
`ref` → `HTMLSpanElement`. Muted second line; makes the segment two-line and becomes its `aria-describedby`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Second-line text; wrap a key value in `<strong>`. |
| `className` | `string` | — | Class on the description. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

## Variants
No `variant` / `tone`. Axes: `size` and `fullWidth` (Root), `color` (Item, Count), structural content (icon-only, two-line).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px track, radius 8, 12/16 text | dense table toolbars next to `xs` controls | |
| `s` | 32px track, radius 10, 13/20 text | compact toolbars and filters | |
| `m` | 36px track, radius 12, 14/20 text | default toolbars and page headers | yes |
| `l` | 40px track, radius 12, 16/24 text | spacious headers next to `l` controls | |
| `xl` | 48px track, radius 16, 16/24 text | touch-first screens, hero filters | |

Track is `fill-muted` with a faint 1px ring; the selected segment is a floating thumb (`control-selected`, faint ring, `shadow-raised`); segment radius = track radius − padding. A single-line group is as tall as Button, Input, Select and Datepicker trigger of the same size.

### color (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| none | no dot; selected thumb is neutral | ordinary modes and periods | yes |
| `gray` · `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | dot of the hue before the content; selected thumb gets the hue's soft fill and a ring of the hue text | statuses where each value has a meaning | |

### color (Count)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral soft badge (a wash of the text ink, so it reads on track and thumb) | plain counters | yes |
| other palette hues | soft badge of the hue | the count has a status meaning | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | fills the container; single-line segments tend to equal widths, a long label keeps its own width and the row scrolls when they do not fit; two-line segments grow from their content | modals, mobile panels, overview strips | off |
| `disabled` | every segment disabled, thumb `fill-muted-hover` without shadow | the choice is temporarily unavailable | off |
| icon-only (only `SegmentedControl.Icon`) | square segment (`data-icon-only`) | toolbar view toggles; needs `aria-label` | — |

Colour all items or none; do not give an item and its Count the same hue; prefer content width or two-line segments over `fullWidth` with many long labels.

## States
| State | Driven by | DOM |
|---|---|---|
| selected | root `value` = item `value` | `aria-checked="true"`, `data-state="checked"`; thumb under the segment, `text-primary` |
| unselected | — | `aria-checked="false"`, `data-state="unchecked"`; `text-secondary`, hover → `text-primary` (no fill) |
| no selection | `value` / `defaultValue` = `""` | thumb hidden; the first enabled segment takes Tab focus |
| item disabled | item `disabled` | `data-disabled="true"`, native `disabled`, `text-disabled`, skipped by arrows |
| group disabled | root `disabled` | track `data-disabled="true"`, `aria-disabled`; every segment disabled; label and hint dimmed |
| invalid | `invalid` or non-empty `error` | track `data-invalid="true"` + `aria-invalid="true"`, inset danger ring on the track; the error replaces the hint; the track shakes once when an error arrives |
| required | `required` | red `*` after the label, `aria-required="true"` on the radiogroup |
| optional | `optional` | a muted `labels.optional` marker after the label |
| support row reserved | `reserveSupportRow` | the support row stays rendered while empty, so an error arriving shifts nothing |
| focus-visible | keyboard | focus ring inside the segment |
| collapsed | row wider than the container and every segment has an icon | row `data-collapse="icon"`: titles, counts and descriptions leave the row, segments turn square; a `VisuallyHidden` copy of the title names each segment and a `Tooltip` shows it |
| overflow | row still wider than the container | root `data-overflow-start` / `data-overflow-end`: edge fades in the track color |

Item DOM: `data-state`, `data-disabled`, `data-icon-only`, `data-two-line`, `data-value`, `data-color`. The thumb (the shared selection indicator) glides (`emphasized` + `base`, `data-animate`) only into a user's choice (click, arrows); a value set from outside and layout changes snap it; it stays still under `prefers-reduced-motion`. It sits inside the segment track, which clips it, so moving the selection never changes the row's scroll area. When the row scrolls, the selected segment is kept in view on mount and on every value change: only the row scrolls, never the page, and the scroll glides only after a user's choice.

## Layout & spacing
- In a form it is a field: label → track `label-gap`, track → support row `hint-gap`, field → field `--prime-space-5` like every field.
- Width is content-based by default; the row is a switcher (foundation §9): segments never wrap or truncate. In a narrow container segments with icons drop their titles first, then the row scrolls horizontally with fading edges.
- Without `size` the control takes the tier of its host (a toolbar, a form), else `m`.
- On a coarse pointer each segment's hit area grows to the 44 px touch target in height; the track keeps its tier height.
- In a toolbar: gap `--prime-space-3` between controls; keep every control at one size.
- Caption under a group: gap `--prime-space-2`.
- `fullWidth` inside modals and mobile sheets. Single-line segments are `flex: 1 1 0` with `min-width: max-content`: short labels share the spare width equally, a long label keeps its own width, nothing truncates; when the labels do not fit, the row scrolls.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `ArrowRight` · `ArrowDown` | Next option, wrapping and skipping disabled ones; focus and selection move together. |
| `ArrowLeft` · `ArrowUp` | Previous option. |
| `Home` · `End` | First and last enabled option. |
| `Tab` | Enters the group on the selected option (or the first enabled one) and leaves it. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The track is `role="radiogroup"`, named by `label` (`aria-labelledby`); without a label give the root `aria-label`. `aria-disabled` when disabled.
- Hint and error are linked through `aria-describedby`; an error sets `aria-invalid="true"`, `required` sets `aria-required="true"`.
- Items are `<button role="radio" aria-checked>` with roving `tabIndex`.
- Two-line items: `aria-labelledby` = label (+ count), `aria-describedby` = description; plain text is the label, so every reference resolves.
- Icons are `aria-hidden`; icon-only items need `aria-label` (and a Tooltip for sighted users). In a row collapsed to icons a `VisuallyHidden` copy of the title names the segment and a `Tooltip` shows it.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | One value out of a few, with a sliding thumb on the chosen segment — `defaultValue`, `aria-label`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the outer height equals the control height of the same tier — `size`. |
| [states.tsx](examples/states.tsx) | No selection yet, an invalid group, a disabled segment and a disabled group next to the default — `invalid`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before the label and square icon-only segments named for screen readers — `SegmentedControl.Icon`, `aria-label`. |
| [colors.tsx](examples/colors.tsx) | A status per option: a dot of its hue before the label and a tinted thumb when chosen — `color`. |
| [full-width.tsx](examples/full-width.tsx) | The group fills its column; segments tend to equal widths and a long label keeps its own — `fullWidth`. |
| [scroll.tsx](examples/scroll.tsx) | Segments never wrap: in a column narrower than the row it scrolls with edge fades and brings the chosen segment into view — `defaultValue`. |
| [two-line.tsx](examples/two-line.tsx) | A label and a counter on the first line, a metric on the second — `SegmentedControl.Label`, `SegmentedControl.Count`, `SegmentedControl.Description`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the choice and updates other content from it — `value`, `onValueChange`. |
| [in-form.tsx](examples/in-form.tsx) | An expense form: the choice is a labelled field with a hint, checked on submit, its error leaves as soon as a segment is chosen; an optional choice beside it — `label`, `hint`, `required`, `error`, `optional`. |

## Mistakes
- Using it as tabs that show different panels → use `Tabs`.
- No `label` and no `aria-label` → the radiogroup has no name.
- A `Label` + `Hint` pair wired by hand with `aria-labelledby` in a form → `label`, `hint`, `error` on the root.
- Icon-only item without `aria-label` → add `aria-label` and wrap in `Tooltip`.
- `variant="…"` or `tone="…"` on the root → there is none; use `color` on items for hue.
- Different `size` than neighbouring controls in a toolbar → use the same tier so heights match.
- Expecting segments to wrap on narrow screens → they scroll; use `fullWidth` or fewer options.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (`internal/SwitcherScroller`, the row), [Badge](../badge/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md) (the title of a collapsed segment), [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`), [VisuallyHidden](../visually-hidden/COMPONENT.md); `internal/selectionIndicator` (the thumb)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Radio](../radio/COMPONENT.md), [Switch](../switch/COMPONENT.md), [ButtonGroup](../button-group/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md)
