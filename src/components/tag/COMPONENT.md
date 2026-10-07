# Tag

**Category:** data-display (Данные)

> A chip for a selected value, applied filter or keyword, with an optional remove button and a palette color.

## When to use
- Applied filters above a list or table, each one removable.
- Selected values (cities, people, keywords) shown as chips.
- Keywords or categories of an item, optionally colored by category.

## When not to use
- A read-only status or counter → use [Badge](../badge/COMPONENT.md).
- Choosing several values from a list in a field → use [TagSelect](../tag-select/COMPONENT.md) (it renders tags itself).
- A toggle or a choice between options → use [ButtonGroup](../button-group/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md) or [Checkbox](../checkbox/COMPONENT.md).
- A keyboard shortcut → use [Kbd](../kbd/COMPONENT.md).

## Import
```tsx
import { Tag } from "prime-ui-kit";
```

## Anatomy
```
Tag.Root              span: fill, tier dimensions
├── body              text and Tag.Icon (ellipsis area)
│   ├── Tag.Icon      optional leading icon
│   └── text
└── remove button     rendered only with onRemove
```

## API

### Tag.Root
Forwards `ref` to the root `<span>`. No `asChild`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` (`PaletteColor`) | `"gray"` | Palette hue of the fill and text. |
| `variant` | `"soft" \| "outline"` | `"soft"` | Treatment. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` (`ControlSize`) | — (inherited, else `"m"`) | Badge tier. Without it the tag follows the surrounding control one tier down; outside a control it is `m`. |
| `onRemove` | `() => void` | — | Shows the remove button; called on its click. |
| `labels` | `Partial<TagLabels>` | `{ remove: "Удалить" }` | System strings, see Accessibility. |
| `disabled` | `boolean` | — | Muted look, `aria-disabled` on the root, remove button natively disabled. |
| `children` | `ReactNode` | — | Text and an optional leading `Tag.Icon`. |
| `className` | `string` | — | Extra class on the root. |

+ native `<span>` props (`HTMLAttributes<HTMLSpanElement>`).

### Tag.Icon
No ref forwarding; does not accept other native props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | The icon; inherits the tag text color, sized to the tag tier. |
| `className` | `string` | — | Extra class on the wrapper. |

### TagLabels
| Key | Default | Description |
|---|---|---|
| `remove` | `"Удалить"` | Accessible name of the remove button. |

## Variants

### variant
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `soft` | Light palette fill (`palette.<hue>.soft`), hue text, no outline | Selected values and applied filters — the normal case | yes |
| `outline` | Transparent fill, 1px inset line in the hue text at 32%, hue text | Keywords on a filled area, or secondary tags next to soft ones | |

`solid` and `ghost` are not part of Tag (the type allows only `soft | outline`).

### color
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | Neutral gray wash and text | Plain values and filters | yes |
| `blue` | Blue | Category hue | |
| `green` | Green | Category hue | |
| `orange` | Orange | Category hue | |
| `red` | Red | Category hue | |
| `yellow` | Yellow | Category hue | |
| `purple` | Purple | Category hue | |
| `sky` | Sky blue | Category hue | |
| `pink` | Pink | Category hue | |
| `teal` | Teal | Category hue | |

Use hues only to group tags by category (one hue per category, consistent across screens). Applied filters stay `gray`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 16px high, padding 4, text 12, icon 12 | Inside `xs`/`s` controls | |
| `s` | 20px high, padding 6, text 12, icon 12 | Inside `m` controls (inherited automatically), dense rows | |
| `m` | 24px high, padding 8, text 12, icon 14 | Standalone filter rows and lists | yes (outside controls) |
| `l` | 28px high, padding 10, text 13, icon 16 | Larger filter panels | |
| `xl` | 32px high, padding 12, text 14, icon 16 | Large headers | |

### removable (visual flag, from `onRemove`)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| no `onRemove` | Text only | Read-only values | yes |
| `onRemove` set | Trailing × button the size of the tier icon, end padding reduced to 4px (`data-removable`) | The user can drop the value | |

### disabled (visual flag)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` / unset | Variant colors | Normal | yes |
| `true` | Muted fill (`fill-muted`), disabled text, no outline; remove button disabled | The value cannot be changed right now | |

**Combinations**
- Recommended: `soft` `gray` + `onRemove` for applied filters; `soft` hue for categorized keywords.
- Allowed but rare: `outline` hue for keywords on a tinted area.
- Avoid: many different hues in one filter row (noise); `disabled` + `onRemove` when the value will never be removable (drop the button instead).

**Sizes**
Same tiers as Badge and Kbd. Without `size` inside a control: `xs`/`s` → `xs`, `m` → `s`, `l` → `m`, `xl` → `l`. Outside a control: `m` (24px).

**Hierarchy**
Tags are secondary content: put the "Сбросить все" action as a `ghost` `s` Button next to them, not as another tag.

## States
| State / attribute | Driven by | Notes |
|---|---|---|
| `data-color` | `color` | Always set (default `gray`). |
| `data-variant` | `variant` | Always set (default `soft`). |
| `data-size` | `size`, else surrounding control size, else `m` | Nominal size. |
| `data-tier` | resolved tier | One step down from the control when inherited. Drives dimensions. |
| `data-removable="true"` | `onRemove` | Remove button rendered. |
| `data-disabled="true"` + `aria-disabled` | `disabled` | Muted look; remove button `disabled`. |
| remove hover | pointer over × | `fill-subtle-active` wash under the icon. |
| remove focus-visible | keyboard focus on × | Focus ring around the button. |

Tag has no internal state: the list of tags is controlled by the parent (remove the item in `onRemove`).

## Layout & spacing
- `width: fit-content`, never stretches in a column; `max-width: 100%`, text does not wrap.
- A row of tags: flex-wrap with `gap: var(--prime-space-2)`.
- Filter panel: title row and tag row separated by `--prime-space-3`.
- The × hit area extends 4px (`--prime-space-1`) beyond the visual icon.

## Accessibility
- The tag itself is static text and not focusable; only the remove `<button type="button">` takes focus.
- The remove button needs a unique name: pass ``labels={{ remove: `Убрать фильтр «${label}»` }}`` so screen readers do not hear several identical «Удалить».
- After removing, move focus to a neighbouring tag or to the field the filter came from.
- `labels.remove` — default `"Удалить"`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | Removable tags in tiers xs–xl | Matching the density of a row |
| [colors.tsx](examples/colors.tsx) | Ten hues in `soft` (removable) and `outline` | Categorized tags |
| [states.tsx](examples/states.tsx) | Read-only, removable, disabled, disabled + removable | Choosing the state of a tag |
| [with-icon.tsx](examples/with-icon.tsx) | Leading `Tag.Icon`, with and without remove | Value types (email, privacy) |
| [surfaces.tsx](examples/surfaces.tsx) | Tags on canvas, card and floating layer | Checking contrast on any surface |
| [applied-filters.tsx](examples/applied-filters.tsx) | Filter panel with per-tag remove and "Сбросить все" | Filters above lists and tables |

```tsx
import { Tag } from "prime-ui-kit";

export function CityFilter({ onRemove }: { onRemove: () => void }) {
  return (
    <Tag.Root labels={{ remove: "Убрать фильтр «Москва»" }} onRemove={onRemove}>
      Москва
    </Tag.Root>
  );
}
```

## Mistakes
- Tag as a read-only status "Оплачен" → use `Badge`.
- Several tags with the default «Удалить» → pass `labels.remove` with the tag text.
- A custom × button next to a tag → use `onRemove`.
- `variant="solid"` on Tag → not supported; use `soft` or `outline`, or `Badge` for emphasis.
- `<Tag.Root size="m">` inside a control → drop `size`, the tier is inherited one step down.

## Related
- [Badge](../badge/COMPONENT.md) — read-only labels with the same tiers.
- [TagSelect](../tag-select/COMPONENT.md) — multi-select field built on tags.
- [Kbd](../kbd/COMPONENT.md) — keys and shortcuts.
