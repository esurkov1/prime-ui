# SegmentedControl

**Category:** selection (Выбор)

> A switch between 2–5 mutually exclusive options or modes that takes effect immediately.

## When to use
- Choosing one value or view mode with an instant effect: report period, list/board/calendar view, theme.
- A compact one-of-many choice inside a toolbar, next to inputs and buttons of the same size.
- A status picker where each option has its own palette hue (`color` on the item).
- A status overview where each option carries a metric (two-line segments with `Count` and `Description`).

## When not to use
- Switching between panels of content (navigation) → use [Tabs](../tabs/COMPONENT.md) instead.
- One choice with descriptions in a form, or more than 5 options → use [Radio](../radio/COMPONENT.md) or [Select](../select/COMPONENT.md) instead.
- A single on/off setting → use [Switch](../switch/COMPONENT.md) instead.
- Several actions in a row (not a selection) → use [ButtonGroup](../button-group/COMPONENT.md) instead.

## Import
```tsx
import { SegmentedControl } from "prime-ui-kit";
```

## Anatomy
```
SegmentedControl.Root                 role="radiogroup"; track + sliding thumb, keyboard handling
└─ SegmentedControl.Item              role="radio" button, one option
   ├─ SegmentedControl.Icon           icon slot (optional; icon-only → square segment)
   ├─ SegmentedControl.Label          title, truncates (optional; plain text is wrapped automatically)
   ├─ SegmentedControl.Count          counter badge after the label (optional)
   └─ SegmentedControl.Description    second line; makes the segment two-line (optional)
```

## API

### SegmentedControl.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected value; use with `onValueChange`. |
| `defaultValue` | `string` | `""` | Initial value in uncontrolled mode; `""` = nothing selected. |
| `onValueChange` | `(value: string) => void` | — | Called when the selection changes (click or keyboard). |
| `disabled` | `boolean` | `false` | Disables the whole group. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier; outer height equals the control height of the tier. |
| `fullWidth` | `boolean` | `false` | Stretch to the container; single-line segments share the width equally and truncate. |
| `aria-label` | `string` | — | Accessible name of the radiogroup. |
| `aria-labelledby` | `string` | — | Id of the element that names the group. |
| `children` | `ReactNode` | — (required) | `SegmentedControl.Item` elements (may be wrapped, e.g. in `Tooltip.Trigger`). |
| `className` | `string` | — | Class on the root `div`. |

No other native props, no ref forwarding.

### SegmentedControl.Item
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Option value compared with the root value. |
| `disabled` | `boolean` | `false` | Disables this option; skipped by arrow keys. |
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | Palette hue: a dot before the content; when selected the thumb takes a soft fill of the hue with a ring of it. |
| `children` | `ReactNode` | — (required) | Text, `Icon`, `Label`, `Count`, `Description`. |
| `className` | `string` | — | Class on the `<button>`. |

+ native `<button>` props except `value`, `children`, `type`, `role` (`aria-label`, `onClick`, …; `onClick` runs first and can `preventDefault()` the selection).
Ref: `forwardRef` → `HTMLButtonElement`.

### SegmentedControl.Icon
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon; sized to the tier icon size, `aria-hidden`. |
| `className` | `string` | — | Class on the `<span>`. |

+ native `<span>` props except `children`.

### SegmentedControl.Label
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Segment title; truncates with an ellipsis. |
| `className` | `string` | — | Class on the `<span>`. |

+ native `<span>` props except `children`.

### SegmentedControl.Count
| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Badge hue. |
| `children` | `ReactNode` | — (required) | The number (tabular nums). |
| `className` | `string` | — | Class on the badge. |

Renders a soft `Badge` one tier below the control (`m` → `s`). No other props.

### SegmentedControl.Description
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Muted second line; wrap the key value in `<strong>` to emphasize it. |
| `className` | `string` | — | Class on the `<span>`. |

+ native `<span>` props except `children`.

## Variants
No `variant`/`tone`. Axes: `size` (Root), `fullWidth` (Root), `color` (Item, Count), structural content (icon-only, two-line).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px track, 4px padding, track radius 8, 12/16 text | dense table toolbars next to `xs` controls | |
| `s` | 32px track, radius 10, 13/20 text | compact toolbars and filters | |
| `m` | 36px track, radius 12, 14/20 text | default toolbars and page headers | yes |
| `l` | 40px track, radius 12, 16/24 text | spacious headers next to `l` controls | |
| `xl` | 48px track, radius 16, 16/24 text | touch-first screens, hero filters | |

Track is `fill-muted` with a faint 1px ring; the selected segment is a floating thumb (`control-selected`, faint ring, `shadow-raised`); segment radius = track radius − 4px.

### fullWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | group as wide as its segments; in a narrow container it scrolls horizontally with edge fades | toolbars, inline filters | yes |
| `true` | group fills the container; single-line segments are equal and truncate, two-line segments grow from their content | modals, mobile panels, overview strips | |

### color (Item)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| none | no dot; selected thumb is neutral | ordinary modes and periods | yes |
| `gray` · `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | dot of the hue before the content; selected thumb gets the hue's soft fill and a ring of the hue text | statuses where each value has a meaning (ok/attention/broken) | |

### color (Count)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral soft badge (text wash so it reads on track and thumb) | plain counters | yes |
| other palette hues | soft badge of the hue | the count has a status meaning | |

### Structural content
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text / icon + text | single-line segment, tier height minus padding | most cases | yes |
| icon only | square segment (`data-icon-only`) | toolbar view toggles; add `aria-label` and a Tooltip | |
| two-line (`Description`) | label (+count) on line 1, muted description on line 2; track grows to content (`data-two-line`) | overview strips with metrics | |

**Combinations**
- Item `color` + Count `color` of the same hue → redundant; use one.
- Item `color` mixing coloured and plain items in one group → avoid; colour all or none.
- Icon-only without `aria-label` → forbidden (no accessible name).
- `fullWidth` with many long single-line labels → labels truncate; prefer content width or two-line segments.

**Sizes** — single-line group height = `--prime-control-<tier>-height` (28 · 32 · 36 · 40 · 48), so it lines up with Button, Input, Select and Datepicker trigger of the same size in one row.

**Hierarchy** — one segmented control per decision; in a toolbar keep all controls at one size (see [toolbar.tsx](examples/toolbar.tsx)).

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| selected | root `value` = item `value` | `aria-checked="true"`, `data-state="checked"` | thumb under the segment, text `text-primary` |
| unselected | — | `aria-checked="false"`, `data-state="unchecked"` | text `text-secondary`; hover → `text-primary` (no fill) |
| no selection | `value` / `defaultValue` = `""` | thumb hidden | first enabled segment takes Tab focus |
| item disabled | item `disabled` | `data-disabled="true"`, native `disabled` | text `text-disabled`, skipped by arrows |
| group disabled | root `disabled` | root `data-disabled="true"`, `aria-disabled` | all segments disabled, thumb `fill-muted-hover` without shadow |
| focus-visible | keyboard | — | focus ring on the segment |

Root DOM: `data-size`, `data-disabled`, `data-full-width`; scroller `data-overflow-start` / `data-overflow-end` (edge fades). Item DOM: `data-state`, `data-disabled`, `data-icon-only`, `data-two-line`, `data-value`, `data-color`. The thumb slides only after a user change (`data-animate`), and not under `prefers-reduced-motion`.
Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue`.

## Layout & spacing
- Width is content-based by default; segments never wrap. In a narrow container the row scrolls horizontally with fading edges.
- In a toolbar: gap `--prime-space-3` between controls; wrap the toolbar (`flex-wrap`) on narrow screens.
- Caption under a group: gap `--prime-space-2`.
- `fullWidth` inside modals and mobile sheets.

## Accessibility
- Root `role="radiogroup"` (always name it with `aria-label` / `aria-labelledby`), `aria-disabled` when disabled.
- Items are `<button role="radio" aria-checked>` with roving `tabIndex`: Tab focuses the selected item (or the first enabled one).
- Keyboard: ←/↑ previous, →/↓ next (wraps, skips disabled), Home / End first / last; moving focus also selects and scrolls the item into view.
- Two-line items: `aria-labelledby` = label (+ count), `aria-describedby` = description.
- Icons are `aria-hidden`; icon-only items need `aria-label`.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All tiers in a row with Input and Button | Aligning with other controls |
| [item-content.tsx](examples/item-content.tsx) | Icon + text, icon-only with Tooltip, Count | Choosing segment content |
| [two-line.tsx](examples/two-line.tsx) | `fullWidth` two-line segments with Label, Count (colours), Description | Status overview with metrics |
| [full-width.tsx](examples/full-width.tsx) | Content width vs `fullWidth` vs scrolling in a narrow container | Deciding how the group fills its container |
| [surfaces.tsx](examples/surfaces.tsx) | Canvas, card, nested card, modal | Checking contrast on any host |
| [colors.tsx](examples/colors.tsx) | Item `color` with tinted thumb | Status picker |
| [states.tsx](examples/states.tsx) | Selected, no selection, disabled item, disabled group | Reference for every state |
| [controlled.tsx](examples/controlled.tsx) | `value` + `onValueChange` | Selection drives other content |
| [toolbar.tsx](examples/toolbar.tsx) | Search, view and period switches, export button at size `m` | Toolbars |

```tsx
import { SegmentedControl } from "prime-ui-kit";

export function PeriodSwitch() {
  return (
    <SegmentedControl.Root defaultValue="week" aria-label="Период">
      <SegmentedControl.Item value="day">День</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Неделя</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Месяц</SegmentedControl.Item>
    </SegmentedControl.Root>
  );
}
```

## Mistakes
- Using it as tabs that show different panels → use `Tabs`.
- No `aria-label` on the root → the radiogroup has no name.
- Icon-only item without `aria-label` → add `aria-label` and wrap in `Tooltip`.
- `variant="…"` or `tone="…"` on the root → there is none; use `color` on items for hue.
- Different `size` than neighbouring controls in a toolbar → use the same tier so heights match.
- Expecting segments to wrap on narrow screens → they scroll; use `fullWidth` or fewer options.

## Related
[Tabs](../tabs/COMPONENT.md) · [Radio](../radio/COMPONENT.md) · [Switch](../switch/COMPONENT.md) · [Badge](../badge/COMPONENT.md) · [Tooltip](../tooltip/COMPONENT.md)
