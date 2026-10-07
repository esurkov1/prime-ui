# ColorSwatches

**Category:** selection
**Kind:** control

> An inline color choice: preset swatches that wrap inside a form, without a popover.

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
ColorSwatches                 field frame: label → swatches → hint | error
└─ radiogroup                 wrapping row of swatches
   ├─ radio × presets         swatch button (color fill, faint inner ring, check when selected)
   ├─ radio «Без цвета»       checkerboard swatch (`allowEmpty`)
   └─ input[type=hidden]      submits the value (`name`)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ColorSwatches
No ref. The field frame (label → swatches → hint | error) around a `role="radiogroup"` of swatch buttons with a roving tab stop.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| null` | — | Controlled color; `null` — no color. |
| `defaultValue` | `string \| null` | `null` | Initial color when uncontrolled. |
| `onValueChange` | `(value: string \| null) => void` | — | Called with the preset `value` (as written in `presets`) or `null`. |
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` | Swatches in order: `{ value, label }`; the label is the swatch's accessible name and tooltip. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier: swatch = control height − 8 (20 · 24 · 28 · 32 · 40), gap = the tier gap; label and hint follow it. |
| `label` | `ReactNode` | — | Label above the swatches; names the radiogroup (`aria-labelledby`). |
| `required` | `boolean` | — | Red `*` after the label and `aria-required` on the group. |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the swatches. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | — | Danger selection ring and `aria-invalid`. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Disables every swatch (grey, half transparent). |
| `allowEmpty` | `boolean` | `false` | Adds the «no color» checkerboard swatch after the presets (value `null`). |
| `name` | `string` | — | Form field name: a hidden input submits the selected color (empty string for no color). |
| `id` | `string` | — | Id of the radiogroup; hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-label` | `string` | — | Accessible name when there is no visible `label` (else `labels.group`). |
| `aria-labelledby` | `string` | — | Names the group by an outside element. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `labels` | `Partial<ColorSwatchesLabels>` | — | Built-in strings, see Labels. |
| `className` | `string` | — | Class on the outer field `<div>`. |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Swatch 20, gap 4, radius 4 | Dense side panels | |
| `s` | Swatch 24, gap 8, radius 6 | Compact dialogs and popovers | |
| `m` | Swatch 28, gap 8, radius 6 | Forms and modals | yes |
| `l` | Swatch 32, gap 8, radius 8 | Spacious settings pages | |
| `xl` | Swatch 40, gap 12, radius 8 | Touch-first layouts | |

**Sizes:** match the size of the form around it: an `m` form uses `m` swatches (28), which sit on the same 4px rhythm as `m` fields.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `allowEmpty` | an extra checkerboard swatch «Без цвета» at the end | the color is optional | `false` |
| `invalid` | the selection ring turns danger | the message is shown elsewhere; otherwise pass `error` | — |
| `disabled` | every swatch grey at half opacity | the choice is unavailable | `false` |

**Combinations**
- Recommended: `label` + `name` inside a form; `allowEmpty` + `optional` for optional colors; `COLOR_PRESETS.slice(0, 8)` for one row of eight.
- Avoid: more than ~24 presets (switch to ColorPicker); `required` together with `allowEmpty` (an empty choice cannot satisfy it).
- The swatches are a field: they follow the field → field spacing (20) and never get their own card or border.

## States
| State | Driven by | DOM |
|---|---|---|
| selected | `value` / `defaultValue` | `aria-checked="true"`, `data-state="checked"` on the radio; 2px accent ring with a 2px gap and a check mark (light or dark by color contrast) |
| hover | pointer | the swatch scales to 1.08 (fine pointers only) |
| focus-visible | keyboard | focus ring outside the swatch |
| invalid | `invalid` / `error` | `aria-invalid`, `data-invalid` on the group; the selected ring turns `danger-border` |
| disabled | `disabled` | native `disabled` on every radio, `aria-disabled` and `data-disabled` on the group |

Controlled with `value` + `onValueChange`; uncontrolled with `defaultValue`.

## Layout & spacing
- The swatches take the container width and wrap to new rows by themselves; no column count to set. In a content-sized container they stay in one row.
- The selection / focus rings sit outside the swatches; kit hosts (Modal / Drawer body, panels, cards) already keep `--prime-focus-space` padding, so the rings are never clipped. In your own `overflow` container, keep that padding.
- Label → swatches and swatches → hint use the tier `label-gap` / `hint-gap`; field → field 20.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Enters on the selected swatch (or the first one). |
| `ArrowRight` · `ArrowLeft` | Moves to the next / previous swatch and selects it. |
| `ArrowDown` · `ArrowUp` | Moves one visual row down / up and selects. |
| `Home` · `End` | Jumps to the first / last swatch and selects it. |

### ARIA
- `role="radiogroup"` with one `role="radio"` button per swatch; the color name is the radio's name and `title`.
- Named by `label`, `aria-labelledby`, `aria-label` or `labels.group`; the hint or the error is linked through `aria-describedby`.
- The check mark is decorative; the selection is announced by `aria-checked`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `group` | `"Цвет"` | Accessible name of the group without a visible `label` and `aria-label`. |
| `empty` | `"Без цвета"` | Name of the «no color» swatch (`allowEmpty`). |
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | The kit palette inline under a field label, one color chosen — `label`, `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size, swatch 20 to 40 px with the tier gap — `size`. |
| [states.tsx](examples/states.tsx) | A default palette next to an invalid and a disabled one — `invalid`, `disabled`. |
| [wrapping.tsx](examples/wrapping.tsx) | In a narrow column the swatches wrap by themselves and the arrows move by the visual rows. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the color, «no color» included, and names it in the hint — `value`, `onValueChange`, `allowEmpty`. |
| [in-form.tsx](examples/in-form.tsx) | A calendar event form: the color is submitted by `name` and required on save — `name`, `required`, `error`. |

## Mistakes
- `<ColorSwatches.Root>` → the component is a single export: `<ColorSwatches />`.
- A visible heading next to the swatches made by hand → pass `label`.
- Presets without names → every preset needs a `label`; it is the swatch's accessible name.
- Dozens of presets → use ColorPicker.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`), `Icon` (check mark)
- **See also:** [ColorPicker](../color-picker/COMPONENT.md) (`ColorPresets`, `ColorPicker.Swatches`), [Radio](../radio/COMPONENT.md)
