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
SegmentedControl.Root                 role="radiogroup"; track + sliding thumb, scrolling row, keyboard
└─ SegmentedControl.Item              role="radio" button, one option
   ├─ SegmentedControl.Icon           icon slot (optional; icon-only → square segment)
   ├─ SegmentedControl.Label          title, truncates (optional; plain text is wrapped automatically)
   ├─ SegmentedControl.Count          counter Badge after the label (optional)
   └─ SegmentedControl.Description    second line; makes the segment two-line (optional)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### SegmentedControl.Root
No ref. `<div role="radiogroup">`: the track with the sliding thumb, keyboard handling and a horizontally scrolling `ScrollContainer` row.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Selected value (controlled). |
| `defaultValue` | `string` | `""` | Initial value (uncontrolled); `""` — nothing selected. |
| `onValueChange` | `(value: string) => void` | — | Called with the new value on click or arrow keys. |
| `disabled` | `boolean` | `false` | Disables the whole group. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Control tier; the outer height equals the control height 28 · 32 · 36 · 40 · 48. |
| `fullWidth` | `boolean` | `false` | Fills the container; single-line segments share the width equally and truncate. |
| `children` | `ReactNode` | — | `SegmentedControl.Item`s (may be wrapped, e.g. in `Tooltip.Trigger`). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" \| "onChange">` | — | `aria-label` / `aria-labelledby` (name the group), `className` and the other div attributes. |

### SegmentedControl.Item
`forwardRef` → `HTMLButtonElement`. One option, a `<button role="radio">` with roving `tabIndex`; plain text is wrapped to truncate.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Option value compared with the root value. |
| `disabled` | `boolean` | `false` | Disables this option; arrow keys skip it. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | Palette hue: a dot before the content; while selected the thumb takes a soft fill of the hue with a ring of it. |
| `children` | `ReactNode` | — (required) | Text, `Icon`, `Label`, `Count`, `Description`. Only an icon → square segment; give it `aria-label`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" \| "type" \| "role">` | — | `aria-label`, `onClick` (runs first and can `preventDefault()` the selection), `className` and the other button attributes. |

### SegmentedControl.Icon
No ref. Decorative icon (`aria-hidden`) sized to the tier.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon, e.g. `<Icon name="theme.light" />`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### SegmentedControl.Label
No ref. Segment title; truncates with an ellipsis. Plain text is wrapped automatically.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Title text. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### SegmentedControl.Count
No ref. Counter `Badge` after the label, one tier below the control, tabular numbers.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Badge hue. |
| `children` | `ReactNode` | — (required) | The number. |
| `className` | `string` | — | Extra class. |

### SegmentedControl.Description
No ref. Muted second line; makes the segment two-line and becomes its `aria-describedby`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Second-line text; wrap a key value in `<strong>`. |
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
| `gray` | neutral soft badge (text wash so it reads on track and thumb) | plain counters | yes |
| other palette hues | soft badge of the hue | the count has a status meaning | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | fills the container; single-line segments are equal and truncate, two-line segments grow from their content | modals, mobile panels, overview strips | off |
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
| group disabled | root `disabled` | root `data-disabled="true"`, `aria-disabled`; every segment disabled |
| focus-visible | keyboard | focus ring inside the segment |
| overflow | row wider than the container | root `data-overflow-start` / `data-overflow-end`: edge fades in the track color |

Item DOM: `data-state`, `data-disabled`, `data-icon-only`, `data-two-line`, `data-value`, `data-color`. The thumb glides (`emphasized` + `base`, `data-animate`) only into a user's choice (click, arrows); a value set from outside and layout changes snap it; it stays still under `prefers-reduced-motion`. It sits inside the segment track, which clips it, so moving the selection never changes the row's scroll area; when the row scrolls, the chosen segment is scrolled into view.

## Layout & spacing
- Width is content-based by default; segments never wrap. In a narrow container the row scrolls horizontally with fading edges.
- In a toolbar: gap `--prime-space-3` between controls; keep every control at one size.
- Caption under a group: gap `--prime-space-2`.
- `fullWidth` inside modals and mobile sheets.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowRight` · `ArrowDown` | Next option, wrapping and skipping disabled ones; focus and selection move together. |
| `ArrowLeft` · `ArrowUp` | Previous option. |
| `Home` · `End` | First and last enabled option. |
| `Tab` | Enters the group on the selected option (or the first enabled one) and leaves it. |

### ARIA
- Root `role="radiogroup"` — always name it with `aria-label` / `aria-labelledby`; `aria-disabled` when disabled.
- Items are `<button role="radio" aria-checked>` with roving `tabIndex`.
- Two-line items: `aria-labelledby` = label (+ count), `aria-describedby` = description.
- Icons are `aria-hidden`; icon-only items need `aria-label` (and a Tooltip for sighted users).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | One value out of a few, with a sliding thumb on the chosen segment — `defaultValue`, `aria-label`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the outer height equals the control height of the same tier — `size`. |
| [states.tsx](examples/states.tsx) | No selection yet, a disabled segment and a disabled group next to the default — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | An icon before the label and square icon-only segments named for screen readers — `SegmentedControl.Icon`, `aria-label`. |
| [colors.tsx](examples/colors.tsx) | A status per option: a dot of its hue before the label and a tinted thumb when chosen — `color`. |
| [full-width.tsx](examples/full-width.tsx) | The group fills its column; segments share the width equally and truncate long labels — `fullWidth`. |
| [scroll.tsx](examples/scroll.tsx) | Segments never wrap: in a column narrower than the row it scrolls with edge fades and brings the chosen segment into view. |
| [two-line.tsx](examples/two-line.tsx) | A label and a counter on the first line, a metric on the second — `SegmentedControl.Label`, `SegmentedControl.Count`, `SegmentedControl.Description`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the choice and updates other content from it — `value`, `onValueChange`. |

## Mistakes
- Using it as tabs that show different panels → use `Tabs`.
- No `aria-label` on the root → the radiogroup has no name.
- Icon-only item without `aria-label` → add `aria-label` and wrap in `Tooltip`.
- `variant="…"` or `tone="…"` on the root → there is none; use `color` on items for hue.
- Different `size` than neighbouring controls in a toolbar → use the same tier so heights match.
- Expecting segments to wrap on narrow screens → they scroll; use `fullWidth` or fewer options.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md), [Badge](../badge/COMPONENT.md)
- **See also:** [Tabs](../tabs/COMPONENT.md), [Radio](../radio/COMPONENT.md), [Switch](../switch/COMPONENT.md), [ButtonGroup](../button-group/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md)
