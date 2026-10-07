# Badge

**Category:** data-display

> The kit's one chip: a static label for a status, category or count, a removable value or applied filter, and a pressable toggle with a hover action — in a palette color.

## When to use
- Status or category of a row in a table or list ("Оплачен", "Черновик", "Бета").
- Environment, role or feature labels next to a heading.
- Counters inside buttons and fields ("Входящие 12", "−25%").
- A workflow state with a leading dot (`Badge.Dot`).
- A selected value, keyword or applied filter the user can remove (`onRemove`).
- Values in a filter panel that toggle on press and hide with a hover action (`onPress`, `Badge.Action`; see [SmartFilter](../smart-filter/COMPONENT.md)).

## When not to use
- A multi-select field with chips → use [TagSelect](../tag-select/COMPONENT.md) (it renders badges itself).
- A keyboard key or shortcut → use [Kbd](../kbd/COMPONENT.md).
- A person's presence (online / busy) → use `Avatar.Status` from [Avatar](../avatar/COMPONENT.md).
- A command (save, open, go somewhere) → use [Button](../button/COMPONENT.md) or [LinkButton](../link-button/COMPONENT.md); a pressable badge toggles a value, it does not run commands.
- A choice between options in a form or toolbar → use [ButtonGroup](../button-group/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md) or [Checkbox](../checkbox/COMPONENT.md).
- A message about the page or a section → use [Banner](../banner/COMPONENT.md) or [Hint](../hint/COMPONENT.md).

## Import
```tsx
import { Badge } from "prime-ui-kit";
```

## Anatomy
```
Badge.Root          span: fill, tier dimensions
├── [start segment] Badge.Icon or Badge.Dot at the start edge: full height, flush, mark centred
├── body            text / number, Badge.Dot, inline Badge.Icon
│                   (a <button> with onPress; a <span> with a trailing segment; none for a read-only badge)
├── Badge.Action    optional end segment revealed on hover / focus (−, or a custom glyph)
└── remove segment  rendered with onRemove: full height, the whole end is the hit area
```

## API

### Badge.Root
Forwards `ref` to the `<span>`. No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` (`PaletteColor`) | `"gray"` | Palette hue. Categorizes; the text carries the meaning. |
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` | Treatment. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` (`ControlSize`) | — (inherited, else `"m"`) | Badge tier. Without it the badge follows the surrounding control one tier down; outside a control it is `m`. An explicit value always wins. |
| `onRemove` | `() => void` | — | Adds the remove segment at the end; called on its click. |
| `onPress` | `(event: MouseEvent<HTMLButtonElement>) => void` | — | Makes the body a `<button>` covering the whole badge (a toggle chip, a filter value). Gets the event, so Alt / Shift clicks can mean something else. Hover adds a `fill-subtle` wash. |
| `pressed` | `boolean` | — | Toggle state of a pressable badge: `aria-pressed` on the body, `data-pressed` on the root. |
| `labels` | `Partial<BadgeLabels>` | `{ remove: "Удалить" }` | System strings, see Accessibility. |
| `disabled` | `boolean` | — | Muted look for every variant, `aria-disabled`; the remove segment, the body button and its actions get native `disabled`. |
| `children` | `ReactNode` | — | Text, `Badge.Dot`, `Badge.Icon`, one `Badge.Action`. Only `Badge.Icon` children (and no remove / action) make a square icon-only badge. |
| `className` | `string` | — | Extra class on the root. |

+ native `<span>` props (`HTMLAttributes<HTMLSpanElement>`).

### Badge.Icon
No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon; sized to the tier icon (12–16px). |
| `className` | `string` | — | Extra class on the wrapper. |

+ native `<span>` props except `children`. An icon that is the first (or last) child is a **segment**, the same as the remove segment and `Badge.Action`: full badge height, flush with that edge, `icon + padding + gap` wide, the icon centred in it with equal space to the edge and to the text; the badge drops its padding on that side (`data-edge`, `data-icon-start` / `data-icon-end`). The end edge belongs to the remove segment or `Badge.Action` when there is one. Icons in the middle stay inline.

### Badge.Action
`<button type="button">` segment at the end of the badge. No ref forwarding. One per badge; do not combine with `onRemove`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — (required) | Accessible name and tooltip («Скрыть billing»). |
| `onClick` | `(event: MouseEvent<HTMLButtonElement>) => void` | — (required) | Runs the action. |
| `persistent` | `boolean` | `false` | Keeps the action shown, not only on hover and focus (while the state it sets is on). |
| `pressed` | `boolean` | — | Toggle state of the action: `aria-pressed`. |
| `disabled` | `boolean` | `false` | The action is unavailable (disabled text color, `not-allowed`). |
| `children` | `ReactNode` | minus glyph | A custom glyph, sized to the tier icon. |
| `className` | `string` | — | Extra class. |

The badge always reserves room for the action: at rest the room is split evenly so the text sits centred; on hover / focus-within (or with `persistent`) the text slides to the start and the segment fades in at the end. The width never changes, neighbours never move.

### BadgeLabels
| Key | Default | Description |
|---|---|---|
| `remove` | `"Удалить"` | Accessible name of the remove segment; include the badge text («Убрать фильтр «Москва»»). |

### Badge.Dot
No ref forwarding. Always `aria-hidden="true"`. A dot at an edge is a segment like an edge icon: `dot + padding + gap` wide, the dot centred with equal space to the edge and to the text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class on the dot. |

+ native `<span>` props.

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | Light palette fill (`palette.<hue>.soft`), hue text, no outline | Status and category labels in tables, lists, headers — the normal case | yes |
| `solid` | Saturated hue fill (`palette.<hue>.solid`), contrasting text | One label per area that must stand out ("Срочно", a single environment flag) | |
| `outline` | Transparent fill, 1px inset line in the hue text at 32%, hue text | A quiet secondary label next to soft badges, or on a fill where a soft wash would blend in | |

`variant="ghost"` is not part of Badge (the type excludes it).

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | Neutral gray wash and text | Neutral or inactive states: draft, archived, cancelled | yes |
| `blue` | Blue | In progress, informational categories, counters | |
| `green` | Green | Success, paid, active, published | |
| `orange` | Orange | Waiting, needs attention, low stock | |
| `red` | Red | Failed, rejected, urgent | |
| `yellow` | Yellow | Paused, under review | |
| `purple` | Purple | Roles, private / premium categories | |
| `sky` | Sky blue | Channel or type categories distinct from blue | |
| `pink` | Pink | Extra category hue | |
| `teal` | Teal | Extra category hue | |

The same hue reads in both themes. Pick one hue per meaning and keep it across the product.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 16px high, padding 4, text 12, icon 12, radius 4 | Inside `xs`/`s` controls, very dense rows | |
| `s` | 20px high, padding 6, text 12, icon 12, radius 6 | Inside `m` controls (inherited automatically), compact lists | |
| `m` | 24px high, padding 8, text 12, icon 14, radius 6 | Standalone labels in tables and lists | yes (outside controls) |
| `l` | 28px high, padding 10, text 13, icon 16, radius 8 | Next to page / section titles | |
| `xl` | 32px high, padding 12, text 14, icon 16, radius 8 | Large headers, hero areas | |

### Icon-only (structural)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| text (+ Dot / Icon) | Pill with horizontal padding | Any label with words | yes |
| only `Badge.Icon` children | Square: width = height, no horizontal padding (`data-icon-only`) | A compact type marker; give it `aria-label` | |
| icon or dot at an edge | That side is a full-height segment (`data-icon-start` / `data-icon-end`) | Leading type icon or status dot, trailing link icon | |

### Interactive (structural)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| read-only | One `<span>`, no hover or focus | Statuses, counters, categories | yes |
| `onRemove` | Remove segment at the end, `fill-subtle-active` wash on hover (`data-removable`) | Selected values, applied filters, keywords | |
| `onPress` (+ `pressed`) | The whole badge is a button; `fill-subtle` wash on hover (`data-pressable`, `data-pressed`) | Toggle chips, filter values | |
| `Badge.Action` | End segment revealed on hover / focus; `persistent` keeps it (`data-action="reveal" \| "persistent"`) | A second action on a value («−» hide) | |

### disabled (visual flag)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` / unset | Variant colors | Normal | yes |
| `true` | Muted fill (`fill-muted`), disabled text, no outline, for every variant | The labelled item is inactive or unavailable | |

**Combinations**
- Recommended: `soft` with any hue for statuses; `soft` + `Badge.Dot` for workflow states; `solid` for a single emphasized label; `soft` `gray` + `onRemove` for applied filters; `onPress` with `blue` (shown) / `red` (hidden) for filter values.
- Allowed but rare: `outline` next to soft badges for a secondary label; `solid` icon-only for a type marker.
- Avoid: several `solid` badges in one row (they compete); color as the only signal (always keep text); explicit `size` inside a control (breaks the one-tier-down pairing); `onRemove` together with `Badge.Action` (one end segment).

**Sizes**
Without `size` a badge inside a control uses the tier one step down: control `xs`/`s` → `xs`, `m` → `s`, `l` → `m`, `xl` → `l`. Outside any control the default is `m` (24px), which sits well in a 36px row next to `m` buttons and inputs.

**Hierarchy**
Soft badges carry status in lists; at most one `solid` badge per area. Interactive badges are secondary content: put "Сбросить все" as a `ghost` Button next to them, not as another badge.

## States
A read-only badge has no hover, focus or pressed states. Interactive parts (body button, remove, action) take hover washes and the inset focus ring.

| State / attribute | Driven by | Notes |
|---|---|---|
| `data-color` | `color` | Always set (default `gray`). |
| `data-variant` | `variant` | Always set (default `soft`). |
| `data-size` | `size`, else surrounding control size, else `m` | Nominal size. |
| `data-tier` | resolved visual tier | Equals `data-size` unless the size was inherited from a control (then one step down). Drives all dimensions. |
| `data-icon-only="true"` | children are only `Badge.Icon` | Square badge. |
| `data-icon-start` / `data-icon-end` | edge `Badge.Icon` / `Badge.Dot` | That side is a segment. |
| `data-removable="true"` | `onRemove` | Remove segment rendered. |
| `data-pressable="true"`, `data-pressed` | `onPress`, `pressed` | Body is a button; `aria-pressed` on it. |
| `data-action="reveal" \| "persistent"` | `Badge.Action` | Room reserved; action revealed on hover / focus-within, or always. |
| `data-disabled="true"` + `aria-disabled` | `disabled` | Muted look; buttons inside disabled. |

`Badge.Root` also provides its tier to children through the control-size context, so an `Icon` inside picks the badge tier.

## Layout & spacing
- Inline-flex, `vertical-align: middle`, `width: fit-content` (never stretches in a column); `max-width: 100%`, text does not wrap and ends in an ellipsis when squeezed.
- Segments (edge icon or dot, remove, action) are `mark + horizontal padding + gap` wide and full height, the mark centred: the space from the edge to the mark equals the space from the mark to the text. For remove and action the whole segment is the hit area.
- Several badges in a row: `gap: var(--prime-space-2)`.
- In a list or table row the badge is the trailing column; give the title column `min-width: 0` and ellipsis so the badge never wraps.
- Numbers use `tabular-nums`.

## Accessibility
- A read-only badge is plain text in a `<span>`; screen readers read its content. No role.
- `onPress` makes the body a `<button>` (Enter / Space) with `aria-pressed` when `pressed` is set. The remove segment and `Badge.Action` are separate buttons with their own names; Tab reaches the body first, then the action / remove. The action is revealed when it or the body has focus.
- Give every remove button a unique name with `labels.remove` so screen readers do not hear several identical «Удалить». After removing, move focus to a neighbouring badge or the field the value came from.
- `Badge.Dot` is `aria-hidden`; the text next to it is what is announced.
- Icon-only badges need `aria-label` (e.g. `aria-label="Почта"`).
- Color never carries meaning alone — keep the word.
- `labels.remove` — default `"Удалить"`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Five tiers xs–xl | Picking a size for standalone badges |
| [variants.tsx](examples/variants.tsx) | `soft` / `solid` / `outline` on the same hues, plus `Badge.Dot` | Choosing emphasis |
| [palette.tsx](examples/palette.tsx) | All ten hues in `soft` and `solid` | Assigning category colors |
| [states.tsx](examples/states.tsx) | Normal vs `disabled` for every variant and with a dot | Labels of inactive items |
| [icons.tsx](examples/icons.tsx) | Dot, leading / trailing icon, icon-only with `aria-label` | Adding an icon to a label |
| [in-controls.tsx](examples/in-controls.tsx) | Counter in Button s/m/l, badge in an Input affix | Badges inside controls (inherited tier) |
| [surfaces.tsx](examples/surfaces.tsx) | Status set on canvas, card and floating layer | Checking contrast on any surface |
| [order-list.tsx](examples/order-list.tsx) | Order list with a status column | Status columns in lists and tables |
| [removable.tsx](examples/removable.tsx) | `onRemove` segments: read-only vs removable, a hue, a leading icon segment, `disabled` | Selected values and applied filters |
| [applied-filters.tsx](examples/applied-filters.tsx) | Filter panel with per-badge remove and "Сбросить все" | Filters above lists and tables |
| [filter-values.tsx](examples/filter-values.tsx) | `onPress` + `pressed` toggles with a «−» `Badge.Action` revealed on hover, `persistent` while hidden | Filter values with show / hide |

```tsx
import { Badge } from "prime-ui-kit";

export function OrderStatus() {
  return (
    <Badge.Root color="green">
      <Badge.Dot />
      Оплачен
    </Badge.Root>
  );
}
```

## Mistakes
- `<Badge.Root onClick={…}>` → use `onPress` (the body becomes a real button) for a toggle, or a `Button` for a command.
- A custom × or hover button next to a badge → use `onRemove` or `Badge.Action`.
- Several removable badges with the default «Удалить» → pass `labels.remove` with the badge text.
- `<Badge.Root color="red" />` with no text → keep a word ("Ошибка"); color alone is not a signal.
- `<Button.Root><Badge.Root size="m">12</Badge.Root></Button.Root>` → drop `size`; the badge takes the tier one step down by itself.
- `variant="light"` / `variant="filled"` → use `soft` / `solid`.
- Icon-only badge without `aria-label` → add `aria-label`.
- A custom `<span>` styled as a badge → use `Badge.Root`.

## Related
- [TagSelect](../tag-select/COMPONENT.md) — multi-select field that renders badges as chips.
- [SmartFilter](../smart-filter/COMPONENT.md) — filter bar built on pressable badges with `Badge.Action`.
- [Kbd](../kbd/COMPONENT.md) — keyboard keys, same tier rule.
- [Avatar](../avatar/COMPONENT.md) — `Avatar.Status` for presence.
- [DataTable](../data-table/COMPONENT.md) — status columns.
