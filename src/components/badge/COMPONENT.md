# Badge

**Category:** data-display
**Kind:** primitive

> The kit's one chip: a static label for a status, category or count, a removable value or applied filter, and a pressable toggle with a hover action — in a palette color.

## When to use
- Status or category of a row in a table or list («Оплачен», «Черновик», «Бета»).
- Counters inside buttons and fields («Входящие 12», «−25%»).
- A workflow state with a leading dot (`Badge.Dot`).
- A selected value, keyword or applied filter the user can remove (`onRemove`).
- Values in a filter panel that toggle on press and hide with a hover action (`onPress`, `Badge.Action`).

## When not to use
- A multi-select field with chips → use [TagSelect](../tag-select/COMPONENT.md) (it renders badges itself).
- A keyboard key or shortcut → use [Kbd](../kbd/COMPONENT.md).
- A person's presence → `Avatar.Status` from [Avatar](../avatar/COMPONENT.md).
- A command (save, open, go somewhere) → use [Button](../button/COMPONENT.md); a pressable badge toggles a value.
- A message about the page or a section → use [Banner](../banner/COMPONENT.md).

## Import
```tsx
import { Badge } from "prime-ui-kit";
```

## Anatomy
```
Badge.Root          <span>: fill, tier dimensions
├─ [start segment]  Badge.Icon or Badge.Dot at the start edge: full height, mark centred
├─ body             text, Badge.Dot, inline Badge.Icon
│                   (a <button> with onPress; a <span> with a trailing segment; none when read-only)
├─ Badge.Action     optional end segment revealed on hover / focus
└─ remove segment   with onRemove: full height, the whole end is the hit area (Icon action.close)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Badge.Root
`ref` → `HTMLSpanElement`. The chip: fill, tier dimensions; a read-only badge is one `<span>`, `onPress` makes the body a `<button>`, `onRemove` adds a remove segment.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Palette hue. Categorizes; the text carries the meaning. |
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` | Treatment. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Badge tier, 16 · 20 · 24 · 28 · 32 px high. Without it the badge follows the surrounding control one tier down; outside a control it is `m`. |
| `onRemove` | `() => void` | — | Adds the full-height remove segment at the end; called on its click. |
| `onPress` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Makes the body a `<button>` covering the whole badge (a toggle chip, a filter value); gets the event, so Alt / Shift clicks can mean more. |
| `pressed` | `boolean` | — | Toggle state of a pressable badge: `aria-pressed` on the body, `data-pressed` on the root. |
| `disabled` | `boolean` | — | Muted look for every variant, `aria-disabled`; the body button, remove and action get native `disabled`. |
| `labels` | `Partial<BadgeLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — | Text, `Badge.Dot`, `Badge.Icon`, one `Badge.Action`. Only `Badge.Icon` children (no remove or action) make a square icon-only badge. |
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className`, `aria-label` (icon-only) and the other span attributes. |

### Badge.Icon
`ref` → `HTMLSpanElement`. A `<span>` holding one icon at the tier icon size. At the first or last position it becomes a full-height edge segment.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon (`Icon`). |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Badge.Dot
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` dot in the text color; at an edge it becomes a segment like an edge icon. Also usable alone (a marker on an icon, before a label): it takes the tier of the surrounding control (6px, 8px from `l`) and the color set on it.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `className` and the other span attributes. |

### Badge.Action
`ref` → `HTMLButtonElement`. A `<button>` segment at the end, revealed on hover and focus; the badge reserves its room, so the width never changes. One per badge, not together with `onRemove`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip («Скрыть billing»). |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — (required) | Runs the action. |
| `persistent` | `boolean` | `false` | Keeps the action shown, not only on hover and focus (while the state it sets is on). |
| `pressed` | `boolean` | — | Toggle state of the action: `aria-pressed`. |
| `disabled` | `boolean` | `false` | The action is unavailable. |
| `children` | `ReactNode` | — | A custom glyph at the tier icon size; a minus by default. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "onClick" \| "children">` | — | `className` and the other button attributes. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | light palette fill, hue text | statuses and categories — the normal case | yes |
| `solid` | saturated hue fill, contrasting text | one label per area that must stand out | |
| `outline` | transparent, 1px inset line in the hue text at 32% | a quiet secondary label next to soft badges | |

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral wash | draft, archived, cancelled | yes |
| `blue` | blue | in progress, counters | |
| `green` | green | success, paid, published | |
| `orange` | orange | waiting, needs attention | |
| `red` | red | failed, rejected, urgent | |
| `yellow` | yellow | paused, under review | |
| `purple` | purple | roles, private categories | |
| `sky` · `pink` · `teal` | extra hues | more categories | |

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 16px high, text 12, icon 12 | inside `xs` / `s` controls | |
| `s` | 20px high, text 12, icon 12 | inside `m` controls (inherited automatically) | |
| `m` | 24px high, text 12, icon 14 | standalone labels in tables and lists | yes (outside controls) |
| `l` | 28px high, text 13, icon 16 | next to section titles | |
| `xl` | 32px high, text 14, icon 16 | large headers | |
| — (omitted) | one tier below the surrounding control | inside Button, Input, Tabs | yes (inside controls) |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `disabled` | muted fill, disabled text, no outline, for every variant | the labelled item is inactive | `false` |

## States
| State | Driven by | DOM |
|---|---|---|
| hue / treatment | `color`, `variant` | `data-color`, `data-variant` (always set) |
| size | `size`, else the control, else `m` | `data-size`, `data-tier` (visual tier) |
| icon segments | edge `Badge.Icon` / `Badge.Dot`, icon-only | `data-icon-start`, `data-icon-end`, `data-icon-only` |
| plain text | read-only, text children only | `data-text-only`: the root is one block box that ellipsizes; otherwise each text run sits in its own block span |
| removable | `onRemove` | `data-removable`; the remove segment takes a `fill-subtle-active` wash on hover |
| pressable / pressed | `onPress`, `pressed` | `data-pressable`, `data-pressed`, `aria-pressed` on the body; `fill-subtle` wash on hover |
| action | `Badge.Action` | `data-action="reveal" \| "persistent"`; the text slides and the segment fades in over `fast` |
| disabled | `disabled` | `data-disabled`, `aria-disabled`; inner buttons disabled |

## Layout & spacing
- Inline-flex, `width: fit-content`, `max-width: 100%`; text never wraps and ends in an ellipsis.
- Segments are `mark + padding + gap` wide and full height; the mark sits with equal space to the edge and to the text.
- Several badges in a row: `gap: var(--prime-space-2)`.
- In a list row the badge is the trailing column; the title column gets `min-width: 0` and an ellipsis.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses the body of a pressable badge, then its action or remove segment. |
| `Enter` · `Space` | Presses the focused body, remove or action button. |

### ARIA
- A read-only badge is plain text in a `<span>`, no role.
- `onPress` makes the body a `<button>` with `aria-pressed` when `pressed` is set; remove and `Badge.Action` are separate buttons with their own names.
- Give every remove button a unique name with `labels.remove`; after removing, move focus to a neighbouring badge or the source field.
- `Badge.Dot` is `aria-hidden`; icon-only badges need `aria-label`. Color never carries meaning alone.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `remove` | `"Удалить"` | Accessible name of the remove segment; include the badge text («Убрать фильтр «Москва»»). |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Publication statuses: soft badges where the text carries the meaning and the hue repeats it — `color`. |
| [variants.tsx](examples/variants.tsx) | Every palette hue in every treatment; the text must read without the color — `variant`, `color`. |
| [sizes.tsx](examples/sizes.tsx) | Every badge tier, 16 to 32 px high — `size`. |
| [states.tsx](examples/states.tsx) | An inactive badge, a pressable toggle off and on, and a removable one — `disabled`, `onPress`, `pressed`, `onRemove`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading dot, a leading or trailing icon and an icon-only square with a name — `Badge.Dot`, `Badge.Icon`, `aria-label`. |
| [in-controls.tsx](examples/in-controls.tsx) | Inside a button or a field the badge takes the tier one step down without `size`. |
| [applied-filters.tsx](examples/applied-filters.tsx) | Applied filters: each badge drops its filter and names it for screen readers — `onRemove`, `labels`. |
| [filter-values.tsx](examples/filter-values.tsx) | Filter values as toggles with a hide action that slides in without changing the width — `onPress`, `pressed`, `Badge.Action`, `persistent`. |

## Mistakes
- `<Badge.Root onClick={…}>` → use `onPress` for a toggle, or a `Button` for a command.
- A custom × or hover button next to a badge → use `onRemove` or `Badge.Action`.
- Several removable badges with the default «Удалить» → pass `labels.remove` with the badge text.
- A colored badge with no text → keep a word; color alone is not a signal.
- An explicit `size` inside a control → drop it; the badge takes the tier one step down.
- `onRemove` together with `Badge.Action` → one end segment per badge.

## Related
- **Built from:** Icon
- **See also:** [TagSelect](../tag-select/COMPONENT.md), [SmartFilter](../smart-filter/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
