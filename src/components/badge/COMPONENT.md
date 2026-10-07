# Badge

**Category:** data-display (Данные)

> A compact static label for a status, category or count, in a palette color.

## When to use
- Status or category of a row in a table or list ("Оплачен", "Черновик", "Бета").
- Environment, role or feature labels next to a heading.
- Counters inside buttons and fields ("Входящие 12", "−25%").
- A workflow state with a leading dot (`Badge.Dot`).

## When not to use
- The chip can be removed, toggled or used as a filter → use [Tag](../tag/COMPONENT.md).
- A keyboard key or shortcut → use [Kbd](../kbd/COMPONENT.md).
- A person's presence (online / busy) → use `Avatar.Status` from [Avatar](../avatar/COMPONENT.md).
- The label must be clickable → use [Button](../button/COMPONENT.md) or [LinkButton](../link-button/COMPONENT.md).
- A message about the page or a section → use [Banner](../banner/COMPONENT.md) or [Hint](../hint/COMPONENT.md).

## Import
```tsx
import { Badge } from "prime-ui-kit";
```

## Anatomy
```
Badge.Root          span: fill, text, tier dimensions
├── Badge.Dot       optional leading dot in currentColor (aria-hidden)
├── Badge.Icon      optional icon wrapper, leading or trailing
└── text / number
```

## API

### Badge.Root
Forwards `ref` to the `<span>`. No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` (`PaletteColor`) | `"gray"` | Palette hue. Categorizes; the text carries the meaning. |
| `variant` | `"solid" \| "soft" \| "outline"` | `"soft"` | Treatment. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` (`ControlSize`) | — (inherited, else `"m"`) | Badge tier. Without it the badge follows the surrounding control one tier down; outside a control it is `m`. An explicit value always wins. |
| `disabled` | `boolean` | — | Muted look for every variant (visual only, no ARIA). |
| `children` | `ReactNode` | — | Text, `Badge.Dot`, `Badge.Icon`. Only `Badge.Icon` children make a square icon-only badge. |
| `className` | `string` | — | Extra class on the root. |

+ native `<span>` props (`HTMLAttributes<HTMLSpanElement>`).

### Badge.Icon
No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon; sized to the tier icon (12–16px). |
| `className` | `string` | — | Extra class on the wrapper. |

+ native `<span>` props except `children`.

### Badge.Dot
No ref forwarding. Always `aria-hidden="true"`.

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

### disabled (visual flag)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` / unset | Variant colors | Normal | yes |
| `true` | Muted fill (`fill-muted`), disabled text, no outline, for every variant | The labelled item is inactive or unavailable | |

**Combinations**
- Recommended: `soft` with any hue for statuses; `soft` + `Badge.Dot` for workflow states; `solid` for a single emphasized label.
- Allowed but rare: `outline` next to soft badges for a secondary label; `solid` icon-only for a type marker.
- Avoid: several `solid` badges in one row (they compete); color as the only signal (always keep text); explicit `size` inside a control (breaks the one-tier-down pairing).

**Sizes**
Without `size` a badge inside a control uses the tier one step down: control `xs`/`s` → `xs`, `m` → `s`, `l` → `m`, `xl` → `l`. Outside any control the default is `m` (24px), which sits well in a 36px row next to `m` buttons and inputs.

**Hierarchy**
Soft badges carry status in lists; at most one `solid` badge per area; Tag is for anything the user can act on.

## States
Badge is not interactive: no hover, focus or pressed states.

| State / attribute | Driven by | Notes |
|---|---|---|
| `data-color` | `color` | Always set (default `gray`). |
| `data-variant` | `variant` | Always set (default `soft`). |
| `data-size` | `size`, else surrounding control size, else `m` | Nominal size. |
| `data-tier` | resolved visual tier | Equals `data-size` unless the size was inherited from a control (then one step down). Drives all dimensions. |
| `data-icon-only="true"` | children are only `Badge.Icon` | Square badge. |
| `data-disabled="true"` | `disabled` | Muted look. |

`Badge.Root` also provides its tier to children through the control-size context, so an `Icon` inside picks the badge tier.

## Layout & spacing
- Inline-flex, `vertical-align: middle`, never shrinks; `max-width: 100%`, text does not wrap.
- Several badges in a row: `gap: var(--prime-space-2)`.
- In a list or table row the badge is the trailing column; give the title column `min-width: 0` and ellipsis so the badge never wraps.
- Numbers use `tabular-nums`.

## Accessibility
- Plain text in a `<span>`; screen readers read its content. No role.
- `Badge.Dot` is `aria-hidden`; the text next to it is what is announced.
- Icon-only badges need `aria-label` (e.g. `aria-label="Почта"`).
- Color never carries meaning alone — keep the word.
- No `labels` keys.

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
- `<Badge.Root onClick={…}>` as a filter → use `Tag` or `Button`.
- `<Badge.Root color="red" />` with no text → keep a word ("Ошибка"); color alone is not a signal.
- `<Button.Root><Badge.Root size="m">12</Badge.Root></Button.Root>` → drop `size`; the badge takes the tier one step down by itself.
- `variant="light"` / `variant="filled"` → use `soft` / `solid`.
- Icon-only badge without `aria-label` → add `aria-label`.
- A custom `<span>` styled as a badge → use `Badge.Root`.

## Related
- [Tag](../tag/COMPONENT.md) — removable and interactive chips with the same tiers.
- [Kbd](../kbd/COMPONENT.md) — keyboard keys, same tier rule.
- [Avatar](../avatar/COMPONENT.md) — `Avatar.Status` for presence.
- [DataTable](../data-table/COMPONENT.md) — status columns.
