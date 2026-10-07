# ColorPicker

**Category:** selection (Выбор)

> Color selection: a full picker (area, channel sliders, hex and channel fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette.

## When to use
- `ColorPicker` — any color is allowed: brand/theme color, chart series color, design tools. Usually opened from a Popover next to a hex field.
- `ColorPresets` — a color from a fixed palette with an optional «no color»: tag, project or calendar colors.
- `parseColor` — turning a CSS string into a `Color` for a controlled `ColorPicker`.

## When not to use
- Picking one of the kit palette hues for a Tag/Badge in TagSelect — the row menu of [TagSelect](../tag-select/COMPONENT.md) already does it.
- Choosing between a few named themes or modes → use [SegmentedControl](../segmented-control/COMPONENT.md) or [Select](../select/COMPONENT.md) instead.
- A plain text field for a hex code without a picker → use [Input](../input/COMPONENT.md) instead.

## Import
```tsx
import { COLOR_PRESETS, ColorPicker, ColorPresets, parseColor } from "prime-ui-kit";
```

## Anatomy
```
ColorPicker.Root                 shared Color + value format (no DOM)
├─ ColorPicker.HexInput          kit Input bound to the hex of the current color
├─ ColorPicker.TriggerSwatch     square of the current color for a trigger button
└─ ColorPicker.Panel             vertical stack (12px gap), optional raised surface
   ├─ ColorPicker.FormatSelect   kit Select: HSL / RGB / Hex
   ├─ ColorPicker.Area           2D area (4:3)
   │  └─ ColorPicker.AreaThumb
   ├─ ColorPicker.Slider         one channel
   │  ├─ ColorPicker.SliderMeta  label + value row (uses ColorPicker.Output)
   │  └─ ColorPicker.SliderTrack
   │     └─ ColorPicker.Thumb
   ├─ ColorPicker.ChannelStrip   eyedropper + channel fields of the current format
   ├─ ColorPicker.Field          RAC ColorField styled as a kit field (needs a RAC Input child)
   ├─ ColorPicker.EyeDropperButton
   └─ ColorPicker.SwatchPicker   preset group
      └─ ColorPicker.SwatchPickerItem
         └─ ColorPicker.Swatch

ColorPresets.Root                value, open state, presets, size (Popover root)
├─ ColorPresets.Trigger          square swatch button (or `asChild`)
│  └─ ColorPresets.Swatch        current color for a custom trigger
└─ ColorPresets.Content          popover with a role="listbox" swatch grid
```
Trigger and panel of a `ColorPicker` must be under one `ColorPicker.Root`.

## API

### ColorPicker.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| Color` | — | Controlled color: a CSS color string or a `Color` from `parseColor`. |
| `defaultValue` | `string \| Color` | — | Initial color in uncontrolled mode. |
| `onValueChange` | `(color: Color) => void` | — | Called on any change from a nested part. |
| `defaultFormat` | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | Initial format of `FormatSelect` / `ChannelStrip`. |
| `labels` | `Partial<ColorPickerLabels>` | Russian defaults | System strings, see Accessibility. |
| `children` | `ReactNode` | — (required) | Picker parts. |

No DOM, no ref.

### ColorPicker.Panel
| Prop | Type | Default | Description |
|---|---|---|---|
| `surface` | `"none" \| "raised"` | `"none"` | `none` — layout only (inside Popover / Card); `raised` — standalone floating panel. |

+ native `<div>` props (`className`, …). Ref: `forwardRef` → `HTMLDivElement`.

### ColorPicker.HexInput
| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the kit Input. |
| `label` | `ReactNode` | `labels.hex` | Field label. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring. |
| `className` | `string` | — | Class on `Input.Root`. |

Invalid hex reverts on blur / Enter.

### ColorPicker.TriggerSwatch
| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the square; sized from the host `--prime-icon-size` (fallback `--prime-control-m-icon`, 16px); `aria-hidden` — name the trigger button. |

### ColorPicker.FormatSelect
| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the wrapper of the kit Select (size `m`, named by `labels.format`). |

### ColorPicker.ChannelStrip
| Prop | Type | Default | Description |
|---|---|---|---|
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring of its fields. |
| `className` | `string` | — | Class on the strip. |

HSL: hue °, saturation %, lightness %, alpha %. RGB: red, green, blue, alpha %. Hex: one field. Leading `EyeDropperButton`.

### ColorPicker.SliderMeta
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | Text on the left; the channel value (`Output`) on the right. |

### ColorPicker.EyeDropperButton
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | pipette icon | Custom icon. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type. |
| `onClick` | `MouseEventHandler` | — | Runs first; `preventDefault()` cancels the eyedropper. |
| `className` | `string` | — | Extra class. |

+ kit `Button.Root` props except `variant`, `tone`, `size`, `aria-label` (fixed: `soft` · `neutral`, name `labels.eyeDropper`). Ref: `forwardRef` → `HTMLButtonElement`. Without `window.EyeDropper` it renders disabled and `aria-hidden`.

### React Aria wrappers
These parts take the props of the matching `react-aria-components` primitive (`className` / `style` accept render functions):

| Part | Props | Notes |
|---|---|---|
| `ColorPicker.Area` | RAC `ColorAreaProps` without `isDisabled`, + `disabled?: boolean` | Key props: `colorSpace`, `xChannel`, `yChannel`. Child: `AreaThumb`. |
| `ColorPicker.AreaThumb` | RAC `ColorThumbProps` | 20px marker. |
| `ColorPicker.Slider` | RAC `ColorSliderProps` without `isDisabled`, + `disabled?: boolean` | Key props: `channel` (`hue`, `alpha`, `red`, …), `colorSpace`, `orientation`. Always tier `m`. |
| `ColorPicker.SliderTrack` | RAC `SliderTrackProps` | Gradient track with a checkerboard under translucent colors. Child: `Thumb`. |
| `ColorPicker.Thumb` | RAC `ColorThumbProps` | 18px thumb, `control-thumb` ring and shadow. |
| `ColorPicker.Output` | RAC `SliderOutputProps` | Channel value. |
| `ColorPicker.Field` | RAC `ColorFieldProps` + `focusRing?: boolean` (default `true`) | Hex without `channel`, one channel with `channel` + `colorSpace`; child: RAC `Input`; needs `aria-label`. |
| `ColorPicker.SwatchPicker` | RAC `ColorSwatchPickerProps` without `onChange`, + `onValueChange?: (color: Color) => void` | Inside Root it follows the picker color; standalone it takes `value` / `defaultValue`. `layout`: `grid` \| `stack`. Needs `aria-label`. |
| `ColorPicker.SwatchPickerItem` | RAC `ColorSwatchPickerItemProps` without `isDisabled`, + `disabled?: boolean` | `color` is required. Child: `Swatch`. |
| `ColorPicker.Swatch` | RAC `ColorSwatchProps` | 24px circle with a checkerboard. |

### ColorPresets.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| null` | — | Controlled color (CSS string of a preset); `null` = no color. |
| `defaultValue` | `string \| null` | `null` | Initial color. |
| `onValueChange` | `(value: string \| null) => void` | — | Called on a pick; returns the preset `value` as is. |
| `open` | `boolean` | — | Controlled panel state. |
| `defaultOpen` | `boolean` | `false` | Initial panel state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the panel opens or closes. |
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` (16) | Swatches in order: `{ value: string; label: string }`. |
| `columns` | `number` | one row for ≤ 8 presets (+ «no color»), else 8 | Grid columns; at `l` / `xl` below 480px the grid wraps to half. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of trigger, swatches and panel. |
| `disabled` | `boolean` | `false` | Trigger disabled, the panel cannot open. |
| `allowEmpty` | `boolean` | `false` | Adds a «no color» swatch (value `null`) after the presets. |
| `closeOnSelect` | `boolean` | `true` | Close after a pick and return focus to the trigger. |
| `labels` | `Partial<ColorPresetsLabels>` | Russian defaults | See Accessibility. |
| `children` | `ReactNode` | — (required) | `Trigger` and `Content`. |

### ColorPresets.Trigger
| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | `false` — kit square swatch button of the Root tier; `true` — the single child element (e.g. `Button.Root` with `ColorPresets.Swatch`) becomes the trigger. |
| `children` | `ReactElement` | — | The custom trigger with `asChild`. |
| `aria-label` | `string` | `"<labels.trigger>: <color name>"` | Accessible name. |

+ native `<button>` props except `children`, `disabled`, `value`. Ref: `forwardRef` → `HTMLButtonElement`. The default square trigger opens on ↑ / ↓ and calls your `onKeyDown` first; with `asChild` your `onKeyDown` passed to `Trigger` is dropped and there is no ↑ / ↓ handler (put key handlers on the child element itself). `id` is kept (the child's own `id` with `asChild`).

### ColorPresets.Content
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading above the grid and the list name (else `labels.list`). |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Panel alignment. |
| `side` | `"bottom" \| "top"` | `"bottom"` | Preferred side. |
| `className` | `string` | — | Class on the popover content. |

### ColorPresets.Swatch
| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the square; sized from the host `--prime-icon-size`, `aria-hidden`. |

### Helpers
| Export | Type | Description |
|---|---|---|
| `parseColor(value)` | `(value: string) => Color` | Parses a CSS color (hex, «rgb(0 255 0)», «hsl(220, 90%, 56%)»); throws on invalid input. Back to text: `color.toString("hex" \| "hexa" \| "css")`. |
| `COLOR_PRESETS` | `readonly ColorPreset[]` | 16 colors: step 500 (row 1) and step 700 (row 2) of eight hues; `COLOR_PRESETS.slice(0, 8)` = one row. |
| `ColorPickerColorValue` | type | The `Color` object type. |
| `ColorValueFormat` | `"hsl" \| "rgb" \| "hex"` | Format type. |

## Variants
No `variant`/`tone`/`color`.

### ColorPicker.Panel surface
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | parts stacked with a 12px gap, no own background | inside a Popover or a Card | yes |
| `raised` | `bg-raised`, panel radius and padding, `shadow-overlay`; fields switch to `field-bg-surface` | a standalone panel on the page | |

### ColorPicker.Root defaultFormat
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `hsl` | hue °, saturation %, lightness %, alpha % fields | designers tuning a hue | yes |
| `rgb` | red, green, blue (0–255), alpha % | developer-facing tools | |
| `hex` | one hex field | brand colors copied from guidelines | |

### size (HexInput, ColorPresets)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px field / trigger, 16px preset swatches | dense tables | |
| `s` | 32px, 20px swatches | rows inside popovers and lists | |
| `m` | 36px, 24px swatches | regular forms | yes |
| `l` | 40px, 28px swatches | spacious forms | |
| `xl` | 48px, 32px swatches | touch-first screens | |

Area, sliders and channel strip have no size axis (always tier `m`).

### ColorPresets flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `allowEmpty` | checkerboard «Без цвета» swatch at the end | the color is optional | `false` |
| `closeOnSelect={false}` | panel stays open after a pick | trying several colors in a row | `true` |
| `Trigger asChild` | your element (e.g. soft Button with the swatch as its icon) | the trigger needs text | `false` |

**Combinations**
- HexInput + a square soft `Button.Root` of the same `size` with `TriggerSwatch` inside `Button.Icon` → field and trigger heights match (see [hex-input-sizes.tsx](examples/hex-input-sizes.tsx)).
- `surface="raised"` inside a Popover → double surface; keep `none` there.
- Several Roots with one controlled `value` → all parts edit the same color ([formats.tsx](examples/formats.tsx)).

**Sizes** — ColorPresets trigger is a square of the control height (28 · 32 · 36 · 40 · 48), so it lines up with an Input of the same size.

**Hierarchy** — prefer `ColorPresets` when a palette is enough; open the full `ColorPicker` only where any color is valid.

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| disabled part | `disabled` on Area / Slider / SwatchPickerItem | RAC `data-disabled` | muted, not interactive |
| focus-visible | keyboard | RAC `data-focus-visible`; `data-focus-ring="false"` on fields with `focusRing={false}` | focus ring on thumb / swatch / inset ring on fields |
| invalid hex | typing | — | reverts to the current color on blur / Enter |
| eyedropper unsupported | no `window.EyeDropper` | button `disabled`, `aria-hidden` | muted square button |
| selected swatch | value | RAC `data-selected` | accent outline with a 2px offset |
| ColorPresets open | `open` / click / ↑ ↓ on trigger | popover `data-state` | swatch grid, focus on the selected swatch |
| ColorPresets empty | value `null` | trigger `data-empty` | checkerboard fill |
| ColorPresets disabled | `disabled` | trigger `data-disabled`, native `disabled` | muted trigger |
| ColorPresets selected | value | option `data-selected`, `aria-selected` | check mark in a contrasting color (`data-contrast="light" \| "dark"`) |

There is no `disabled` on `ColorPicker.Root` — disable parts individually. ColorPresets panel follows the overlay contract; a nested ColorPresets inside a Popover closes first.
Controlled: `value` + `onValueChange` (both components), `open` + `onOpenChange` (ColorPresets). Uncontrolled: `defaultValue`, `defaultOpen`.

## Layout & spacing
- Panel width comes from the layout (e.g. `calc(var(--prime-panel-min-width) * 1.5)` fits the area and four channel fields).
- Field + trigger row: gap `--prime-space-2`, `align-items: flex-end` so the trigger aligns with the input box under a label.
- Panel parts gap: 12px (`--prime-space-3`) from `ColorPicker.Panel`.

## Accessibility
- Area, sliders and swatches are React Aria primitives (keyboard: arrows, Page Up / Down, Home / End on sliders and area).
- `SwatchPicker` needs `aria-label`; `ColorPicker.Field` needs `aria-label`.
- `TriggerSwatch` is `aria-hidden` — give the trigger button an `aria-label`.
- ColorPresets: trigger name «Цвет: <имя>», ↑ / ↓ on the default trigger opens (not with `asChild`: Enter / Space on the child); the grid is `role="listbox"` with `role="option"` swatches (roving tabindex): arrows move, Home / End, Enter / Space pick (and close), Tab returns to the trigger and closes, Escape closes.
- `ColorPicker` `labels` keys (defaults):
  - `format` — «Формат значений цвета»
  - `eyeDropper` — «Пипетка»
  - `hex` — «Hex»
  - `hue` — «Оттенок, градусы»
  - `saturation` — «Насыщенность, проценты»
  - `lightness` — «Яркость, проценты»
  - `alpha` — «Непрозрачность, проценты»
  - `red` — «Красный, 0–255»
  - `green` — «Зелёный, 0–255»
  - `blue` — «Синий, 0–255»
- `ColorPresets` `labels` keys (defaults):
  - `trigger` — «Цвет» (name prefix: «Цвет: Синий»)
  - `list` — «Цвета» (list name without `Content label`)
  - `empty` — «Без цвета»

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [panel.tsx](examples/panel.tsx) | Raised panel: FormatSelect, Area, hue + alpha sliders, ChannelStrip, swatches | Full picker layout |
| [hex-input-sizes.tsx](examples/hex-input-sizes.tsx) | HexInput in all sizes + square trigger opening the panel in a Popover | Color field in forms |
| [formats.tsx](examples/formats.tsx) | `defaultFormat` hsl / rgb / hex sharing one controlled value | Choosing the edit format |
| [states.tsx](examples/states.tsx) | Disabled area, slider and swatch; HexInput | Part-level states |
| [brand-color.tsx](examples/brand-color.tsx) | Controlled `Color` with `parseColor`, popover panel, brand swatches, preview, reset in a Card | Brand / theme settings |
| [presets-quick.tsx](examples/presets-quick.tsx) | ColorPresets: one row + `allowEmpty`, default 8×2 with `label`, `Trigger asChild` | Quick color from a palette |
| [presets-sizes.tsx](examples/presets-sizes.tsx) | ColorPresets in all sizes next to Input | Aligning with fields |
| [presets-tags.tsx](examples/presets-tags.tsx) | Size `s` ColorPresets per row inside a Popover | Per-item colors in lists |

```tsx
import { COLOR_PRESETS, ColorPresets } from "prime-ui-kit";

export function TagColor() {
  return (
    <ColorPresets.Root defaultValue={COLOR_PRESETS[5]?.value} allowEmpty>
      <ColorPresets.Trigger />
      <ColorPresets.Content />
    </ColorPresets.Root>
  );
}
```

## Mistakes
- Trigger in one `ColorPicker.Root` and panel in another → they will not share the color; wrap both in one Root.
- `isDisabled` on Area / Slider / SwatchPickerItem → use `disabled`.
- `onChange` on `ColorPicker.Root` or `SwatchPicker` → use `onValueChange`.
- `parseColor` on raw user input without try/catch → it throws on invalid strings.
- `surface="raised"` inside a Popover → use the default `none`.
- `SwatchPicker` without `aria-label` → the group has no name.
- Expecting `ColorPresets` to return a `Color` → it returns the preset string (or `null`).
- `<ColorPresets.Trigger asChild onKeyDown={…}>` → the handler is dropped; put it on the child element.

## Related
[Popover](../popover/COMPONENT.md) · [Input](../input/COMPONENT.md) · [Select](../select/COMPONENT.md) · [TagSelect](../tag-select/COMPONENT.md) · [Button](../button/COMPONENT.md)
