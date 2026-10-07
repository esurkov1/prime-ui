# ColorPicker

**Category:** selection
**Kind:** field

> Color selection: a full picker (hex field, area, channel sliders and fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette.

## When to use
- `ColorPicker` — any color is allowed: brand / theme color, chart series color, design tools. Usually a hex field with a swatch button that opens the panel in a Popover.
- `ColorPresets` — a color from a fixed palette with an optional «no color»: label, project or calendar colors, one trigger per row.
- `parseColor` — turning a CSS string into a `Color` for a controlled `ColorPicker`.

## When not to use
- The color is a field of its own in a form or dialog (stage, label, project color) → use [ColorSwatches](../color-swatches/COMPONENT.md): the palette inline, no popover.
- Picking one of the kit palette hues for a Badge in TagSelect — the row menu of [TagSelect](../tag-select/COMPONENT.md) already does it.
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
└─ ColorPicker.Panel             vertical stack, optional raised surface
   ├─ ColorPicker.FormatSelect   kit Select: HSL / RGB / Hex
   ├─ ColorPicker.Area           2D area (4:3)
   │  └─ ColorPicker.AreaThumb
   ├─ ColorPicker.Slider         one channel
   │  ├─ ColorPicker.SliderMeta  label + value row
   │  └─ ColorPicker.SliderTrack
   │     └─ ColorPicker.Thumb
   ├─ ColorPicker.ChannelStrip   eyedropper + channel fields of the current format
   ├─ ColorPicker.EyeDropperButton
   └─ ColorPicker.Swatches       kit ColorSwatches bound to the color

ColorPresets.Root                value, open, presets (no DOM)
├─ ColorPresets.Trigger          square swatch button (or `asChild` with ColorPresets.Swatch)
└─ ColorPresets.Content          popover with the swatch grid (listbox)
```
Helpers: `parseColor(value)` (throws on invalid input; back to text with `color.toString("hex" | "hexa" | "css")`), `COLOR_PRESETS` (16 colors: step 500 and step 700 of eight hues), types `ColorPickerColorValue`, `ColorValueFormat`, `ColorPreset`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### ColorPicker.Root
No DOM. Holds the color (React Aria `ColorPicker`) and the value format for every part inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| Color` | — | Controlled color: a CSS color string or a `Color` from `parseColor`. |
| `defaultValue` | `string \| Color` | — | Initial color when uncontrolled. |
| `onValueChange` | `(color: Color) => void` | — | Called with the new `Color` (`color.toString("hex")` for a string). |
| `defaultFormat` | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | Initial value format of `FormatSelect` and `ChannelStrip`. |
| `labels` | `Partial<ColorPickerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | The parts. |

### ColorPicker.Panel
`forwardRef` → `HTMLDivElement`. Vertical stack of the parts with the standard gap; native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `surface` | `"none" \| "raised"` | `"none"` | `none` — layout only (inside a Popover or Card). `raised` — a standalone floating panel: raised background, panel radius and padding, overlay shadow. |

### ColorPicker.HexInput
No ref. The hex value as a kit Input field (label, hint, error); commits on blur / Enter and reverts invalid text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Field label; defaults to `labels.hex`. |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; marks the field invalid. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring of the fields (`data-focus-ring="false"`); focus, keyboard and ARIA stay. |
| `className` | `string` | — | Class on the field `<div>`. |

### ColorPicker.TriggerSwatch
No ref. A square of the current color for a trigger button (`aria-hidden`); follows the host icon size, e.g. inside `Button.Icon`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the `<span>`. |

### ColorPicker.FormatSelect
No ref. A kit Select of the value format (HSL · RGB · Hex), named by `labels.format`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the wrapper `<div>`. |

### ColorPicker.ChannelStrip
No ref. One row: the eyedropper, then a field per channel of the current format (or one hex field); each field commits on blur / Enter.

| Prop | Type | Default | Description |
|---|---|---|---|
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring of the fields (`data-focus-ring="false"`); focus, keyboard and ARIA stay. |
| `className` | `string` | — | Class on the row `<div>`. |

### ColorPicker.Area
React Aria `ColorArea`: a two-channel square (e.g. saturation × lightness). Holds `ColorPicker.AreaThumb`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | — | Shows the color but takes no input (grayscale). |
| `…rest` | `ColorAreaProps (react-aria-components)` | — | The other props of the React Aria `ColorArea` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.AreaThumb · ColorPicker.Thumb
React Aria `ColorThumb` of the area / of a slider track: a thumb-colored ring with the overlay shadow and a focus ring.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `ColorThumbProps (react-aria-components)` | — | The other props of the React Aria `ColorThumb` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.Slider
React Aria `ColorSlider` of one channel (hue, alpha…). Holds `SliderMeta` and `SliderTrack`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | — | Shows the color but takes no input (grayscale). |
| `…rest` | `ColorSliderProps (react-aria-components)` | — | The other props of the React Aria `ColorSlider` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.SliderMeta
No ref. The slider heading: a label and the current channel value.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | Visible label of the slider. |

### ColorPicker.SliderTrack
React Aria `SliderTrack` with the channel gradient over a transparency checkerboard. Holds `ColorPicker.Thumb`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `SliderTrackProps (react-aria-components)` | — | The other props of the React Aria `SliderTrack` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.Swatches
No ref. The kit `ColorSwatches` bound to the picker color: a pick sets the color, editing the color moves the selection. Takes every ColorSwatches prop except the value ones, `allowEmpty` and `name`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` | Swatches `{ value, label }`; the label names the swatch. |
| `…rest` | `Omit<ColorSwatchesProps, "value" \| "defaultValue" \| "onValueChange" \| "allowEmpty" \| "name">` | — | `label`, `size`, `aria-label`, `disabled`… |

### ColorPicker.EyeDropperButton
`forwardRef` → `HTMLButtonElement`. A square soft kit Button that opens the native EyeDropper, named by `labels.eyeDropper`; without browser support it is disabled and hidden from assistive tech.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Custom content; default is the pipette icon. |
| `…rest` | `Omit<ButtonRootProps, "variant" \| "tone" \| "size" \| "aria-label">` | — | The other Button props. |

### ColorPresets.Root
No DOM. A quick color from a fixed palette: a square trigger and a popover grid of presets (Popover overlay contract).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| null` | — | Controlled color; `null` — no color. |
| `defaultValue` | `string \| null` | `null` | Initial color when uncontrolled. |
| `onValueChange` | `(value: string \| null) => void` | — | Called with the preset `value` or `null`. |
| `open` | `boolean` | — | Controlled open state of the panel. |
| `defaultOpen` | `boolean` | `false` | Initial open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the panel opens or closes. |
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` | Swatches in panel order. |
| `columns` | `number` | — | Grid columns; default one row for up to 8 presets (+ «no color»), else 8. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the trigger, the swatches and the panel. |
| `disabled` | `boolean` | `false` | The trigger does not open the panel. |
| `allowEmpty` | `boolean` | `false` | Adds the «no color» swatch after the presets (value `null`). |
| `closeOnSelect` | `boolean` | `true` | Close the panel after a pick (focus returns to the trigger). |
| `labels` | `Partial<ColorPresetsLabels>` | — | Built-in strings, see Labels. |

### ColorPresets.Trigger
`forwardRef` → `HTMLButtonElement`. The kit square swatch button of the root tier, named «`labels.trigger`: <color name>»; ArrowDown / ArrowUp open the panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `asChild` | `boolean` | `false` | Use the one child element (e.g. `Button.Root` with `ColorPresets.Swatch`) as the trigger. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "disabled" \| "value">` | — | `aria-label`, `className` and the other button attributes. |

### ColorPresets.Swatch
No ref. The current color as a small square for a custom trigger; follows the host icon size, `aria-hidden`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the `<span>`. |

### ColorPresets.Content
No ref. The floating panel with the swatch grid (`role="listbox"`); focus moves to the selected swatch.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading above the grid; also the list's accessible name (else `labels.list`). |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Side of the trigger. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Alignment along the trigger. |
| `className` | `string` | — | Class on the panel. |

## Variants
No `variant` / `tone` / `color`.

### surface (ColorPicker.Panel)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | parts stacked with a 12px gap, no own background | inside a Popover or a Card | yes |
| `raised` | `bg-raised`, panel radius and padding, `shadow-overlay`; fields switch to `field-bg-surface` | a standalone panel on the page | |

### defaultFormat (ColorPicker.Root)
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

**Sizes:** the ColorPresets trigger is a square of the control height, so it lines up with an Input of the same size; HexInput + a square soft `Button.Root` of the same `size` with `TriggerSwatch` inside `Button.Icon` match too. Area, sliders and the channel strip have no size axis (always tier `m`).

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `allowEmpty` (ColorPresets) | checkerboard «Без цвета» swatch at the end | the color is optional | `false` |
| `closeOnSelect={false}` (ColorPresets) | panel stays open after a pick | trying several colors in a row | `true` |
| `asChild` (ColorPresets.Trigger) | your element (e.g. a soft Button with the swatch as its icon) | the trigger needs text | `false` |
| `disabled` (Area, Slider) | grayscale, no input | the part is locked | — |

**Combinations**
- `surface="raised"` inside a Popover → double surface; keep `none` there.
- Several Roots with one controlled `value` → all parts edit the same color.
- Prefer `ColorPresets` when a palette is enough; open the full `ColorPicker` only where any color is valid.

## States
| State | Driven by | DOM |
|---|---|---|
| disabled part | `disabled` on Area / Slider | React Aria `data-disabled`; muted, not interactive |
| focus-visible | keyboard | React Aria `data-focus-visible`; `data-focus-ring="false"` on fields with `focusRing={false}` |
| invalid hex | typing | reverts to the current color on blur / Enter |
| hex error | `error` on HexInput | `aria-invalid`, danger ring, the error replaces the hint |
| eyedropper unsupported | no `window.EyeDropper` | button `disabled`, `aria-hidden` |
| selected swatch | the color | `data-state="checked"`; accent ring with a 2px offset and a contrasting check |
| ColorPresets open | `open` / click / ArrowDown · ArrowUp on the trigger | popover `data-state`; focus on the selected swatch |
| ColorPresets empty | value `null` | trigger `data-empty`; checkerboard fill |

There is no `disabled` on `ColorPicker.Root` — disable parts individually. Controlled: `value` + `onValueChange` (both components), `open` + `onOpenChange` (ColorPresets). Uncontrolled: `defaultValue`, `defaultOpen`.

## Layout & spacing
- Panel width comes from the layout (e.g. `calc(var(--prime-panel-min-width) * 1.5)` fits the area and four channel fields).
- Field + trigger row: gap `--prime-space-2`, `align-items: flex-end` so the trigger aligns with the field box under a label.
- Panel parts gap: 12px (`--prime-space-3`) from `ColorPicker.Panel`.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowLeft` · `ArrowRight` · `ArrowUp` · `ArrowDown` | Move the area thumb or a slider; in the ColorPresets grid, move between swatches. |
| `PageUp` · `PageDown` | Larger steps on the area and the sliders. |
| `Home` · `End` | Slider ends; the first / last swatch in the ColorPresets grid. |
| `Enter` · `Space` | Commit a field; pick the focused preset swatch and close. |
| `Tab` | Moves through the parts; inside the ColorPresets grid returns to the trigger and closes. |
| `Escape` | Closes the ColorPresets panel. |

### ARIA
- Area and sliders are React Aria primitives with their own `role="slider"` names.
- `TriggerSwatch` and `ColorPresets.Swatch` are `aria-hidden` — give the trigger button an `aria-label` (ColorPresets.Trigger names itself «`labels.trigger`: <color name>»).
- `ColorPicker.Swatches` is a `role="radiogroup"` (ColorSwatches): name it with `label` or `aria-label`.
- The ColorPresets grid is `role="listbox"` with `role="option"` swatches (roving tabindex), named by the Content `label` or `labels.list`.
- Channel fields are named by `labels` (`hue`, `red`…); HexInput by its label (`labels.hex` by default).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `format` | `"Формат значений цвета"` | Name of `ColorPicker.FormatSelect`. |
| `eyeDropper` | `"Пипетка"` | Name of `ColorPicker.EyeDropperButton`. |
| `hex` | `"Hex"` | Hex field of `ChannelStrip` and the default `HexInput` label. |
| `hue` | `"Оттенок, градусы"` | Hue channel field. |
| `saturation` | `"Насыщенность, проценты"` | Saturation channel field. |
| `lightness` | `"Яркость, проценты"` | Lightness channel field. |
| `alpha` | `"Непрозрачность, проценты"` | Alpha channel field. |
| `red` | `"Красный, 0–255"` | Red channel field. |
| `green` | `"Зелёный, 0–255"` | Green channel field. |
| `blue` | `"Синий, 0–255"` | Blue channel field. |
| `trigger` | `"Цвет"` | ColorPresets trigger name prefix: «<trigger>: <color name>». |
| `list` | `"Цвета"` | ColorPresets swatch list name when `Content` has no `label`. |
| `empty` | `"Без цвета"` | ColorPresets «no color» swatch and the trigger name for an empty value. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A color field: a hex value and a swatch button that opens the picker panel — `ColorPicker.HexInput`, `ColorPicker.TriggerSwatch`. |
| [sizes.tsx](examples/sizes.tsx) | Every size of the hex field with a swatch button of the same tier — `size`. |
| [states.tsx](examples/states.tsx) | A disabled area and hue slider keep showing the color but take no input — `disabled`. |
| [validation.tsx](examples/validation.tsx) | A hint under the hex field and an error that replaces it; invalid text reverts on blur — `hint`, `error`. |
| [panel.tsx](examples/panel.tsx) | The full raised panel and its part order: format, area, hue and alpha sliders, channels, brand swatches — `ColorPicker.Panel`, `surface`, `ColorPicker.Swatches`. |
| [formats.tsx](examples/formats.tsx) | The channel strip in each value format; three pickers edit one color — `defaultFormat`, `ColorPicker.ChannelStrip`. |
| [presets.tsx](examples/presets.tsx) | A quick color from the palette: a square trigger next to a field and a Button trigger; «no color» allowed — `ColorPresets`, `allowEmpty`, `asChild`. |
| [presets-sizes.tsx](examples/presets-sizes.tsx) | The preset trigger in every size, a square of the control height next to an input of the same tier — `ColorPresets`, `size`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the color: brand swatches and the hex field edit it, a button resets it — `value`, `onValueChange`. |
| [in-form.tsx](examples/in-form.tsx) | Theme settings: the color goes with the form and a too light color fails on save — `value`, `error`. |

## Mistakes
- Trigger in one `ColorPicker.Root` and panel in another → they will not share the color; wrap both in one Root.
- `isDisabled` on Area / Slider → use `disabled`.
- `onChange` on `ColorPicker.Root` → use `onValueChange`.
- `parseColor` on raw user input without try/catch → it throws on invalid strings.
- `surface="raised"` inside a Popover → use the default `none`.
- Expecting `ColorPresets` to return a `Color` → it returns the preset string (or `null`).
- `<ColorPresets.Trigger asChild onKeyDown={…}>` → the handler is dropped; put it on the child element.

## Related
- **Built from:** [Input](../input/COMPONENT.md) (`HexInput`), [Select](../select/COMPONENT.md) (`FormatSelect`), [Button](../button/COMPONENT.md) (`EyeDropperButton`), [ColorSwatches](../color-swatches/COMPONENT.md) (`Swatches`), [Popover](../popover/COMPONENT.md) (`ColorPresets.Content`), `Icon` (check, pipette)
- **See also:** [ColorSwatches](../color-swatches/COMPONENT.md), [TagSelect](../tag-select/COMPONENT.md)
