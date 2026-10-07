# ColorSwatches

**Category:** selection

> An inline color choice: a wrapping grid of preset swatches inside a form, without a popover.

## When to use
- Picking a color for an entity in a form or dialog (pipeline stage, tag, project, calendar).
- The palette is short (up to ~20 presets) and the choice should be visible at once.
- Settings pages where every option is shown inline.

## When not to use
- A compact color next to a field or in a dense list row (one trigger per row) → use [ColorPresets](../color-picker/COMPONENT.md) (trigger + popover palette).
- A free color (any hex, eyedropper, channels) → use [ColorPicker](../color-picker/COMPONENT.md).
- Choosing a mode or a value that is not a color → use [SegmentedControl](../segmented-control/COMPONENT.md) or [Radio](../radio/COMPONENT.md).

## Import
```tsx
import { COLOR_PRESETS, ColorSwatches } from "prime-ui-kit";
```

## Anatomy
```
ColorSwatches.Root            field frame (label · grid · hint/error) when label/hint/error are set
└─ radiogroup                 CSS grid, repeat(auto-fill, swatch) — wraps to the container width
   ├─ radio × presets         swatch button (color fill, faint inner ring, check when selected)
   ├─ radio «Без цвета»       checkerboard swatch (`allowEmpty`)
   └─ input[type=hidden]      submits the value (`name`)
```
Single leaf component: `ColorSwatches.Root`. Without `label`, `hint` and `error` it renders only the grid.

## API

### ColorSwatches.Root

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| null` | — | Controlled color (a `presets` value); `null` — no color. Compared case- and space-insensitively. |
| `defaultValue` | `string \| null` | `null` | Initial color (uncontrolled). |
| `onValueChange` | `(value: string \| null) => void` | — | Called on click and on arrow / Home / End selection. |
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` | Swatches in order, `{ value, label }`; `label` is the radio name and `title`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Swatch = control height − 8 (20 · 24 · 28 · 32 · 40); gap = tier gap; label and hint of the tier. |
| `allowEmpty` | `boolean` | `false` | Adds the «no color» swatch after the presets (value `null`). |
| `label` | `ReactNode` | — | Field label above the grid; names the group. |
| `required` | `boolean` | — | Red `*` after the label; `aria-required` on the group. |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `hint` | `ReactNode` | — | Help text under the grid. |
| `error` | `ReactNode` | — | Error under the grid; replaces the hint and implies `invalid`. |
| `invalid` | `boolean` | — | Invalid state without a message: `aria-invalid`, danger ring on the selected swatch. |
| `disabled` | `boolean` | `false` | Disables every swatch. |
| `name` | `string` | — | Renders a hidden input with the selected color (empty string for no color). |
| `id` | `string` | generated | Id of the group (label, hint and error ids derive from it). |
| `className` | `string` | — | Class on the outer element (field frame, or the grid without a frame). |
| `aria-label` | `string` | — | Group name when there is no `label`; falls back to `labels.group`. |
| `aria-labelledby` | `string` | — | Names the group by another element (e.g. a section title). |
| `aria-describedby` | `string` | — | Extra description ids, merged with hint / error. |
| `labels` | `Partial<ColorSwatchesLabels>` | see Accessibility | System strings. |

No ref forwarding, no other native props. Exported types: `ColorSwatchesRootProps`, `ColorSwatchesLabels`; `ColorPreset` and `COLOR_PRESETS` come from ColorPresets.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Swatch 20, gap 4, radius 4 | Dense side panels | |
| `s` | Swatch 24, gap 8, radius 6 | Compact dialogs and popovers | |
| `m` | Swatch 28, gap 8, radius 6 | Forms and modals | yes |
| `l` | Swatch 32, gap 8, radius 8 | Spacious settings pages | |
| `xl` | Swatch 40, gap 12, radius 8 | Touch-first layouts | |

### allowEmpty
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | Presets only | A color is required | yes |
| `true` | Extra checkerboard swatch «Без цвета» at the end | The color is optional | |

**Combinations**
- Recommended: `label` + `name` inside a form; `allowEmpty` + `optional` for optional colors; `COLOR_PRESETS.slice(0, 8)` for one row of eight.
- Allowed but rare: `aria-labelledby` pointing at a `Card.SectionTitle` when the card holds only the color.
- Avoid: more than ~24 presets (switch to ColorPicker); `required` together with `allowEmpty` (an empty choice cannot satisfy it).

**Sizes**
Match the size of the form around it: an `m` form uses `m` swatches (28), which sit on the same 4px rhythm as `m` fields.

**Hierarchy**
The swatch grid is a field: it follows the field → field spacing (20) and never gets its own card or border.

## States
| State | Driven by | DOM |
|---|---|---|
| selected | `value` / `defaultValue` | `aria-checked="true"`, `data-state="checked"` on the radio; 2px accent ring with a 2px gap and a check mark (light or dark by color contrast) |
| hover | pointer | Swatch scales to 1.08 |
| focus-visible | keyboard | Focus ring outside the swatch |
| invalid | `invalid` / `error` | `aria-invalid`, `data-invalid` on the grid; the selected ring turns `danger-border` |
| disabled | `disabled` | Native `disabled` on every radio, `aria-disabled` and `data-disabled` on the group; grayscale at half opacity |

Controlled with `value` + `onValueChange`; uncontrolled with `defaultValue`.

## Layout & spacing
- The grid is `repeat(auto-fill, <swatch>)`: it takes the container width and wraps to new rows by itself; no column count to set. Width comes from the layout (form column, dialog body).
- Swatches start flush with the label and the fields above. The selection / focus rings sit outside the swatches; kit hosts (Modal / Drawer body, panels, cards) already keep `--prime-focus-space` padding, so the rings are never clipped. In your own `overflow` container, keep that padding.
- In a form: label → grid and grid → hint use the tier `label-gap` / `hint-gap` (built in); field → field 20.
- Works from 320px: 16 presets wrap into rows.

## Accessibility
- `role="radiogroup"` with one `role="radio"` button per swatch; the color name is the radio's name and `title`.
- Roving tabindex: Tab enters on the selected swatch (or the first). ← / → move and select, ↑ / ↓ move by visual rows, Home / End jump to the ends.
- Named by `label`, `aria-labelledby`, `aria-label` or `labels.group`; hint / error are linked through `aria-describedby`.
- `labels` (`ColorSwatchesLabels`):
  - `group` — `"Цвет"` (group name without a label)
  - `empty` — `"Без цвета"` (the empty swatch)
  - `optional` — `"необязательно"` (marker after the label)

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [in-form.tsx](examples/in-form.tsx) | Name field + labelled color in a form, `name` submits it | Entity settings dialogs |
| [sizes.tsx](examples/sizes.tsx) | Five tiers, swatch 20–40 | Matching the form size |
| [allow-empty.tsx](examples/allow-empty.tsx) | Controlled value, «no color» swatch, `optional` | Optional colors |
| [wrapping.tsx](examples/wrapping.tsx) | 16 presets in a wide and a narrow column | Any width, no column tuning |

```tsx
import { ColorSwatches } from "prime-ui-kit";

export function StageColor() {
  return <ColorSwatches.Root label="Цвет" name="color" defaultValue="#ef4444" />;
}
```

## Mistakes
- A popover palette (`ColorPresets`) for the only color field of a dialog → use `ColorSwatches.Root` inline.
- Setting `grid-template-columns` or swatch sizes in CSS → the grid wraps by itself; change `size` instead.
- `required` with `allowEmpty` → drop one of them.
- A separate `Label.Root` above the grid → pass `label` to Root.

## Related
- [ColorPresets and ColorPicker](../color-picker/COMPONENT.md)
- [Radio](../radio/COMPONENT.md)
- [SegmentedControl](../segmented-control/COMPONENT.md)
