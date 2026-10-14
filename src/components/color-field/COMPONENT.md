# ColorField

**Category:** selection
**Kind:** field

> A form field for any color: the swatch and its hex in a field box that opens the ColorPicker in a popover.

## When to use
- A free color is a field of a form or settings page: brand, theme or button color, a chart series, a stage or project color that is not limited to a palette.
- The value is stored as text (hex) and submitted with the form (`name`).
- A few ready colors should sit one click away, while any other color stays possible (`presets`).

## When not to use
- The color comes from a short fixed palette and the choice should be visible at once → use [ColorSwatches](../color-swatches/COMPONENT.md).
- A compact color next to a field or in a dense list row → use [ColorPresets](../color-picker/COMPONENT.md) (square trigger + palette).
- The picker panel itself is the screen (a design tool, an inline editor) → compose [ColorPicker](../color-picker/COMPONENT.md) parts.
- A plain text field for a hex code → use [Input](../input/COMPONENT.md).

## Import
```tsx
import { ColorField } from "prime-ui-kit/color-picker";
```

ColorField ships from the `prime-ui-kit/color-picker` entry with ColorPicker: it needs the optional peer `react-aria-components`. Its styles are in `prime-ui-kit/bundle.css`.

## Anatomy
```
ColorField                       field frame: label · field button · hint | error (single export)
├─ button                        field trigger: color chip · hex · chevron
├─ Popover.Content               role="dialog", the field tier
│  └─ ColorPicker.Panel
│     ├─ ColorPicker.Area        saturation × lightness
│     ├─ ColorPicker.Slider      hue (+ opacity with `alpha`)
│     ├─ ColorPicker.ChannelStrip eyedropper + hex cell
│     └─ ColorPicker.Swatches    ready colors (`presets`)
└─ input[type=hidden]            submits the hex (`name`)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ColorField
`ref` → `HTMLDivElement` (the field frame). A field (label, hint / error, the field button with the color swatch, its hex and a chevron) that opens the ColorPicker panel in a Popover: area, hue, optional opacity, channels with the eyedropper, optional presets.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled color: a CSS color string (hex, `rgb()`, `hsl()`). |
| `defaultValue` | `string` | `"#000000"` | Initial color when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called with the new color as hex: `#RRGGBB`, or `#RRGGBBAA` when `alpha` lowers the opacity. A controlled field that does not take the value keeps its color. |
| `presets` | `readonly ColorPreset[]` | — | Ready colors under the channels (`{ value, label }`), picked in one click; none by default. |
| `alpha` | `boolean` | `false` | Adds the opacity slider; the value then carries alpha. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Field tier (height 28 · 32 · 36 · 40 · 48); the panel uses the same tier. Without it the tier of its host, else `m`. |
| `label` | `ReactNode` | — | Field label above; with the hex it names the field button. |
| `required` | `boolean` | `false` | Red `*` after the label; the field button is described by `labels.required` (a button takes no `aria-required`). |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | — | Danger ring and `aria-invalid` without a message. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Disables the field: it shows the color and does not open. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring (`data-focus-ring="false"`); focus, keyboard and ARIA are unchanged. |
| `name` | `string` | — | Form field name: a hidden input submits the hex value. |
| `id` | `string` | — | Id of the field button; hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-label` | `string` | — | Accessible name without a visible `label`; the current hex is appended. |
| `aria-labelledby` | `string` | — | Names the field button by an outside element. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `labels` | `Partial<ColorFieldLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 field, compact panel | Dense tables and side panels | |
| `s` | 32 field | Compact forms and popovers | |
| `m` | 36 field | Regular forms | yes |
| `l` | 40 field | Spacious settings pages | |
| `xl` | 48 field | Touch-first screens | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `presets` | a row of named swatches under the channels | a few brand or palette colors should be one click away | — |
| `alpha` | an opacity slider under the hue; the hex gets two more digits | the color may be translucent (overlays, shadows) | `false` |
| `disabled` | disabled fill, the color shown at half opacity, does not open | not editable now | `false` |
| `invalid` / `error` | danger ring (+ the message) | validation failed | — |
| `required` / `optional` | red `*` / muted «необязательно» after the label; a required field reads `labels.required` after its name | mark the minority of the form | `false` / — |
| `focusRing` | `false`: no focus ring on the field button; the focus fill stays | a single color control where focus is obvious; never in a regular form (WCAG 2.4.7) | `true` |

**Combinations**
- Recommended: `label` + `name` inside a form; `presets` with the brand palette; `alpha` only where transparency means something.
- Avoid: a ColorField next to a ColorSwatches for the same value; `alpha` for colors that become text or button fills.

## States
| State | Driven by | DOM |
|---|---|---|
| closed / open | click, `Enter` · `Space`, `Escape`, an outside press | `aria-expanded` and `data-state` on the button; the chevron turns; the button holds the hover fill while open |
| value | `value` / `defaultValue`, the panel | the chip and the hex follow the color as it is dragged; `onValueChange` gets every change as hex |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` on the button; the field shakes once when an error arrives (`data-shake` on the frame) |
| disabled | `disabled` | native `disabled` on the button, `data-disabled` on the frame; the hidden `name` input is disabled too, so the form does not submit the value |

Controlled with `value` + `onValueChange`; uncontrolled with `defaultValue`. A controlled field whose parent does not take a change keeps showing the parent's color.

## Layout & spacing
- The field is 100% wide; set the width with the layout.
- The chip is the tier icon size and sits `field-px` from the edge and from the hex, like the icon of Select or Datepicker.
- The panel is one and a half panel widths (the area and four channel cells fit), within the viewport; it flips near the edge.
- Label → field and field → hint use the tier `label-gap` / `hint-gap`; field → field 20.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Enter` · `Space` | Open the panel from the field; in a channel cell, apply the value. |
| `ArrowLeft` · `ArrowRight` · `ArrowUp` · `ArrowDown` | Move the area or a channel slider; in the ready colors, move between swatches. |
| `PageUp` · `PageDown` | Large step of the area and the sliders. |
| `Tab` | Cycles through the parts of the panel. |
| `Escape` | Closes the panel and returns focus to the field. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The field is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded`; it is named by the label and the current hex (`aria-labelledby`), or by `aria-label` plus the hex.
- The panel is `role="dialog"` named by the field; the area and the sliders are React Aria `role="slider"`, the sliders named by `labels.hue` and `labels.alpha`.
- The ready colors are a `role="radiogroup"` named by `labels.presets`.
- The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `eyeDropper` | `"Пипетка"` | Eyedropper button of the channels. |
| `hex` | `"Hex"` | Hex cell of the channels. |
| `hue` | `"Оттенок, градусы"` | Hue slider and the hue cell of the channels. |
| `saturation` | `"Насыщенность, проценты"` | Saturation cell. |
| `lightness` | `"Яркость, проценты"` | Lightness cell. |
| `alpha` | `"Непрозрачность, проценты"` | Opacity slider (`alpha`) and the opacity cell. |
| `red` | `"Красный, 0–255"` | Red cell. |
| `green` | `"Зелёный, 0–255"` | Green cell. |
| `blue` | `"Синий, 0–255"` | Blue cell. |
| `optional` | `"необязательно"` | Marker after the label when `optional`. |
| `required` | `"обязательное поле"` | Read after the field name of a `required` field: its trigger is a button, which takes no `aria-required`. |
| `presets` | `"Готовые цвета"` | Accessible name of the preset swatches in the panel. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A brand color field: the swatch and hex open the picker in a popover, the new color applies as you drag — `label`, `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: the field is 28 to 48 px high, the swatch follows the tier icon — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to an invalid one and a disabled one that shows its color but does not open — `invalid`, `disabled`. |
| [validation.tsx](examples/validation.tsx) | A button color checked live: a too light color shakes in an error that leaves once the color is darker; a hint and an optional field — `required`, `optional`, `hint`, `error`. |
| [presets.tsx](examples/presets.tsx) | Brand colors under the channels in the panel and a translucent overlay color — `presets`, `alpha`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the color: the hint names it and a button resets it to the brand default — `value`, `onValueChange`. |
| [in-form.tsx](examples/in-form.tsx) | A pipeline stage form: the color goes with the form by `name`, a calm note confirms the save — `name`, `required`. |

## Mistakes
- `ColorField.Root` → ColorField is a single export: `<ColorField … />`.
- Importing it from `prime-ui-kit` → it lives in `prime-ui-kit/color-picker` with ColorPicker.
- A hand-built «swatch button + Popover + ColorPicker» next to a hex Input → use ColorField.
- Expecting a `Color` object in `onValueChange` → the field speaks hex strings; use ColorPicker parts for `Color`.

## Related
- **Built from:** [ColorPicker](../color-picker/COMPONENT.md) (area, sliders, channel strip with the eyedropper, the `presets` swatches), [Popover](../popover/COMPONENT.md), `Icon` (chevron), [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) (field frame), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [ColorSwatches](../color-swatches/COMPONENT.md), [ColorPicker](../color-picker/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md)
