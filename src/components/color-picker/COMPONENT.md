# ColorPicker

**Category:** selection
**Kind:** field

> Color selection: a full picker (hex field, area, channel sliders and fields, eyedropper, swatches) and `ColorPresets` for a quick color from a fixed palette.

## When to use
- `ColorPicker` — any color is allowed and the picker parts are laid out by hand: an inline panel, a design tool, a hex field with a custom trigger.
- `ColorPresets` — a color from a fixed palette with an optional «no color»: label, project or calendar colors, one trigger per row. With `allowCustom` the palette is a shortcut, not a limit: any hex is typed under it (a spec color on a site, a brand color in a dense list row).
- `parseColor` — turning a CSS string into a `Color` for a controlled `ColorPicker`.

## When not to use
- Any color as one field of a form (swatch + hex, the panel in a popover) → use [ColorField](../color-field/COMPONENT.md).
- The color is a field of its own in a form or dialog (stage, label, project color) → use [ColorSwatches](../color-swatches/COMPONENT.md): the palette inline, no popover.
- Picking one of the kit palette hues for a Badge in TagSelect — the row menu of [TagSelect](../tag-select/COMPONENT.md) already does it.
- Choosing between a few named themes or modes → use [SegmentedControl](../segmented-control/COMPONENT.md) or [Select](../select/COMPONENT.md) instead.
- A plain text field for a hex code without a picker → use [Input](../input/COMPONENT.md) instead.

## Import
```tsx
import { COLOR_PRESETS, ColorPresets } from "prime-ui-kit";
import { ColorPicker, parseColor } from "prime-ui-kit/color-picker";
```

`ColorPicker` has its own entry: it is the only part of the kit built on `react-aria-components`,
an optional peer dependency — install it only when you use `ColorPicker`. Its styles come with
it. `ColorPresets` stays in the main entry and needs no extra package.

## Anatomy
```
ColorPicker.Root                 shared Color + value format (no DOM)
├─ ColorPicker.HexInput          kit Input bound to the hex of the current color
│  └─ ColorPicker.SwatchButton   end segment of the field box: the current color, opens a panel
├─ ColorPicker.TriggerSwatch     square of the current color for your own trigger button
└─ ColorPicker.Panel             vertical stack, optional raised surface
   ├─ ColorPicker.FormatSelect   kit Select: HSL / RGB / Hex
   ├─ ColorPicker.Area           2D area (4:3)
   │  └─ ColorPicker.Thumb
   ├─ ColorPicker.Slider         one channel
   │  ├─ ColorPicker.SliderMeta  label + value row
   │  └─ ColorPicker.SliderTrack
   │     └─ ColorPicker.Thumb
   ├─ ColorPicker.ChannelStrip   eyedropper + channel fields of the current format
   ├─ ColorPicker.EyeDropperButton
   └─ ColorPicker.Swatches       kit ColorSwatches bound to the color

ColorPresets.Root                value, open, presets (no DOM)
├─ ColorPresets.Trigger          slot around one element
│  └─ ColorPresets.SwatchButton  square swatch button (or your Button with ColorPresets.Swatch)
└─ ColorPresets.Content          popover with the swatch grid (listbox)
   └─ Input                      hex field with the typed color's chip (`allowCustom`)
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
| `format` | `"hsl" \| "rgb" \| "hex"` | — | Controlled value format of `FormatSelect` and `ChannelStrip`. |
| `defaultFormat` | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | Initial value format, uncontrolled. |
| `onFormatChange` | `(format: "hsl" \| "rgb" \| "hex") => void` | — | Called with the format picked in `FormatSelect`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the fields inside (`HexInput`, `FormatSelect`); without it the tier of its host (a panel, a popover), else `m`. |
| `labels` | `Partial<ColorPickerLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | The parts. |

### ColorPicker.Panel
`ref` → `HTMLDivElement`. Vertical stack of the parts with the standard gap; native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `surface` | `"none" \| "raised"` | `"none"` | `none` — layout only (inside a Popover or Card). `raised` — a standalone floating panel: raised background, panel radius and padding, overlay shadow. |
| `…rest` | `HTMLAttributes<HTMLDivElement>` | — | `children` (the parts), `className` and the other div attributes. |

### ColorPicker.HexInput
`ref` → `HTMLDivElement` (the field frame). The hex value as a kit Input field (label, hint, error); commits on blur / Enter and reverts invalid text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Field label; defaults to `labels.hex`. |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `hintTone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of `hint` («Осталось 12 дней» in `warning`). The words carry the status, the color repeats it; an `error` replaces the hint and its tone. A validation error is `error`, never a `danger` hint. |
| `error` | `ReactNode` | — | Error message in the hint slot; marks the field invalid. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring of the fields (`data-focus-ring="false"`); focus, keyboard and ARIA stay. |
| `children` | `ReactNode` | — | End segments of the field box after the value: `ColorPicker.SwatchButton` (in a `Popover.Trigger`), so the hex and its swatch read as one field. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

### ColorPicker.SwatchButton
`ref` → `HTMLButtonElement`. The current color as a button segment at the end of `HexInput`: full field height, named `labels.palette`, with a tooltip. Wrap it in `Popover.Trigger` to open the panel.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" \| "children">` | — | `className`, `disabled`, `onClick` and the other attributes of the `<button>`. |

### ColorPicker.TriggerSwatch
`ref` → `HTMLSpanElement`. A square of the current color for a trigger button (`aria-hidden`); follows the host icon size, e.g. inside `Button.Icon`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

### ColorPicker.FormatSelect
`ref` → `HTMLDivElement` (the wrapper). A kit Select of the value format (HSL · RGB · Hex), named by `labels.format`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the wrapper `<div>`. |

### ColorPicker.ChannelStrip
`ref` → `HTMLDivElement`. One row: the eyedropper, then a field per channel of the current format (or one hex field); each field commits on blur / Enter.

| Prop | Type | Default | Description |
|---|---|---|---|
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring of the fields (`data-focus-ring="false"`); focus, keyboard and ARIA stay. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the row `<div>`. |

### ColorPicker.Area
`ref` → `HTMLDivElement`. React Aria `ColorArea`: a two-channel square (e.g. saturation × lightness). Holds a `ColorPicker.Thumb`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | — | Shows the color but takes no input (grayscale). |
| `…rest` | `ColorAreaProps (react-aria-components)` | — | The other props of the React Aria `ColorArea` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.Thumb
`ref` → `HTMLDivElement`. React Aria `ColorThumb` of the area or of a slider track: a thumb-colored ring with the overlay shadow and a focus ring, sized by its host.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `ColorThumbProps (react-aria-components)` | — | The other props of the React Aria `ColorThumb` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.Slider
`ref` → `HTMLDivElement`. React Aria `ColorSlider` of one channel (hue, alpha…). Holds `SliderMeta` and `SliderTrack`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `disabled` | `boolean` | — | Shows the color but takes no input (grayscale). |
| `…rest` | `ColorSliderProps (react-aria-components)` | — | The other props of the React Aria `ColorSlider` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.SliderMeta
`ref` → `HTMLDivElement`. The slider heading: a label and the current channel value.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — (required) | Visible label of the slider. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the heading `<div>`. |

### ColorPicker.SliderTrack
`ref` → `HTMLDivElement`. React Aria `SliderTrack` with the channel gradient over a transparency checkerboard. Holds `ColorPicker.Thumb`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `SliderTrackProps (react-aria-components)` | — | The other props of the React Aria `SliderTrack` (`channel`, `colorSpace`, `aria-label`…). |

### ColorPicker.Swatches
`ref` → `HTMLDivElement` (the ColorSwatches field frame). The kit `ColorSwatches` bound to the picker color: a pick sets the color, editing the color moves the selection. Takes every ColorSwatches prop except the value ones, `allowEmpty` and `name`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` | Swatches `{ value, label }`; the label names the swatch. |
| `label · hint · hintTone · error · invalid · required · optional · disabled · size · id · labels · aria-label · aria-labelledby · aria-describedby` | `ColorSwatchesProps` | — | As on `ColorSwatches`. |
| `…rest` | `Omit<ColorSwatchesProps, "value" \| "defaultValue" \| "onValueChange" \| "allowEmpty" \| "name">` | — | `className` and the other attributes of the field frame. |

### ColorPicker.EyeDropperButton
`ref` → `HTMLButtonElement`. A square soft kit Button that opens the native EyeDropper, named by `labels.eyeDropper`; without browser support it is disabled and hidden from assistive tech.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Custom content; default is the pipette icon. |
| `fullWidth · loading · pressed · defaultPressed · onPressedChange · current · density · align · progress · holdToConfirm · onConfirm · countdown · countdownMode · countdownPlacement · labels` | `ButtonRootProps` | — | As on `Button.Root`. |
| `…rest` | `Omit<ButtonRootProps, "variant" \| "tone" \| "size" \| "aria-label" \| "shape" \| "asChild">` | — | `onClick`, `className` and the other button attributes. |

### ColorPresets.Root
No DOM and no ref, except a field frame in a FieldList cell (the column heading as its label). A quick color from a fixed palette: a square trigger and a popover grid of presets.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| null` | — | Controlled color; `null` — no color. |
| `defaultValue` | `string \| null` | `null` | Initial color when uncontrolled. |
| `onValueChange` | `(value: string \| null) => void` | — | Called with the preset `value` or `null`. |
| `open` | `boolean` | — | Controlled open state of the panel. |
| `defaultOpen` | `boolean` | `false` | Initial open state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the panel opens or closes. |
| `closeOnEscape` | `boolean` | `true` | Escape closes the panel and returns focus to the trigger. |
| `closeOnOutsideClick` | `boolean` | `true` | A press outside the panel and its trigger closes it; focus follows the pointer. |
| `presets` | `readonly ColorPreset[]` | `COLOR_PRESETS` | Swatches in panel order. |
| `columns` | `number` | — | Grid columns; default one row for up to 8 presets (+ «no color»), else 8. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the trigger, the swatches and the panel. Without it the tier of its host, else `m`. |
| `disabled` | `boolean` | `false` | The trigger is disabled and does not open the panel. A disabled `Fieldset` around it sets it too. |
| `allowEmpty` | `boolean` | `false` | Adds the «no color» swatch after the presets (value `null`). |
| `allowCustom` | `boolean` | `false` | Any color beyond the palette: a hex field under the swatches (`labels.custom`) shows the typed color, Enter picks it as `#rrggbb`; invalid text gets `labels.customInvalid`. |
| `closeOnSelect` | `boolean` | `true` | Close the panel after a pick (focus returns to the trigger). |
| `labels` | `Partial<ColorPresetsLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | `ColorPresets.Trigger` and `ColorPresets.Content`. |

### ColorPresets.Trigger
No DOM: clones the single child into the panel's trigger, merges `ref` and `onClick` (toggles), names it «`labels.trigger`: <color name>», sets `disabled` from the root and opens the panel on ArrowDown / ArrowUp. The child's own `aria-label`, `disabled` and handlers win.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactElement` | — (required) | One element: `ColorPresets.SwatchButton`, or e.g. `Button.Root` with `ColorPresets.Swatch`. |

### ColorPresets.SwatchButton
`ref` → `HTMLButtonElement`. The kit square swatch button of the root tier: a square of the control height filled with the current color. Put it in `ColorPresets.Trigger`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "value">` | — | `aria-label`, `className` and the other button attributes. |

### ColorPresets.Swatch
`ref` → `HTMLSpanElement`. The current color as a small square for a custom trigger; follows the host icon size, `aria-hidden`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

### ColorPresets.Content
`ref` → `HTMLDivElement` (the panel). The floating panel with the swatch grid (`role="listbox"`); focus moves to the selected swatch.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading above the grid; also the list's accessible name (else `labels.list`). |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Side of the trigger. |
| `align` | `"auto" \| "start" \| "center" \| "end"` | `"auto"` | Alignment along the trigger. `auto` lines the panel up with the trigger edge that has more room beyond it; `start`, `center` or `end` fix it. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "role">` | — | `className` and the other attributes of the panel. |

## Variants
No `variant` / `tone` / `color`.

### surface (ColorPicker.Panel)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `none` | parts stacked with a 12px gap, no own background | inside a Popover or a Card | yes |
| `raised` | the floating layer of the ladder (`data-depth="floating"`), panel radius and padding, `shadow-overlay`; fields take that layer's fill | a standalone panel on the page | |

### format (ColorPicker.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `hsl` | hue °, saturation %, lightness %, alpha % fields | designers tuning a hue | yes |
| `rgb` | red, green, blue (0–255), alpha % | developer-facing tools | |
| `hex` | one hex field | brand colors copied from guidelines | |

### size (ColorPicker.Root, ColorPresets)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px field / trigger, 16px preset swatches | dense tables | |
| `s` | 32px, 20px swatches | rows inside popovers and lists | |
| `m` | 36px, 24px swatches | regular forms | yes |
| `l` | 40px, 28px swatches | spacious forms | |
| `xl` | 48px, 32px swatches | touch-first screens | |

**Sizes:** `ColorPresets.SwatchButton` is a square of the control height, so it lines up with an Input of the same size; `ColorPicker.SwatchButton` is a segment inside HexInput, so it takes the field's tier with it. Area, sliders and the channel strip have no size axis (always tier `m`).

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `allowEmpty` (ColorPresets) | checkerboard «Без цвета» swatch at the end | the color is optional | `false` |
| `allowCustom` (ColorPresets) | a «Свой цвет» hex field under the swatches, its chip showing the typed color | any color is valid, the palette only speeds the common ones | `false` |
| `closeOnSelect={false}` (ColorPresets) | panel stays open after a pick | trying several colors in a row | `true` |
| `closeOnOutsideClick={false}` (ColorPresets) | a press beside the panel keeps it open | comparing presets with the page | `true` |
| `closeOnEscape={false}` (ColorPresets) | Escape leaves the panel open | the panel closes only by a pick or the trigger | `true` |
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
| selected swatch | the color | `data-state="checked"`; a check mark that contrasts with the color draws in — no ring, the check is the selection |
| ColorPresets open | `open` / click / ArrowDown · ArrowUp on the trigger | popover `data-state`; focus on the selected swatch |
| ColorPresets custom color | `allowCustom` + a value that is no preset, or Enter in the hex field | no swatch is checked; the hex field holds the value; the trigger is named «`labels.trigger`: #rrggbb»; invalid text on Enter shows `labels.customInvalid` as the field's error (the error drops in, the field shakes once) |
| ColorPresets empty | value `null` | the trigger shows the checkerboard fill and is named «`labels.trigger`: `labels.empty`» |

There is no `disabled` on `ColorPicker.Root` — disable parts individually. Controlled: `value` + `onValueChange` (both components), `open` + `onOpenChange` (ColorPresets). Uncontrolled: `defaultValue`, `defaultOpen`.

## Layout & spacing
- Panel width comes from the layout: a popover or a column wide enough for the area and four channel fields.
- Hex field + palette trigger: `ColorPicker.SwatchButton` as a child of `HexInput` — one field box, the swatch a full-height segment at its end; no row of your own.
- Panel parts gap: 12px (`--prime-space-3`) from `ColorPicker.Panel`.
- ColorPresets.Content `align="auto"`: a trigger near the end of the screen lines up the panel's end edge and the panel grows toward the start, and the other way near the start; a fixed `align` still flips at the screen edge.
- ColorPresets grid: one row for up to 8 presets (+ «no color»), else rows of 8 (`columns` overrides); a panel narrower than the row wraps the swatches into balanced rows (16 → 8 + 8, never 14 + 2). On a coarse pointer every swatch grows to the 44 px touch target and the grid wraps into more rows, so it still fits a 320px panel; the arrow keys walk the rows on screen.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `ArrowLeft` · `ArrowRight` · `ArrowUp` · `ArrowDown` | Move the area thumb or a slider; in the ColorPresets grid, move between swatches. |
| `PageUp` · `PageDown` | Larger steps on the area and the sliders. |
| `Home` · `End` | Slider ends; the first / last swatch in the ColorPresets grid. |
| `Enter` · `Space` | Commit a field; pick the focused preset swatch and close. In the ColorPresets hex field (`allowCustom`) Enter picks the typed color. |
| `Tab` | Moves through the parts; inside the ColorPresets grid returns to the trigger and closes. With `allowCustom` Tab goes from the grid to the hex field; past it the panel closes and focus goes on from the trigger. |
| `Escape` | Closes the ColorPresets panel. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Area and sliders are React Aria primitives with their own `role="slider"` names.
- `SwatchButton` is a button named `labels.palette` with a tooltip. `TriggerSwatch` and `ColorPresets.Swatch` are `aria-hidden` — give the trigger button an `aria-label` (`ColorPresets.Trigger` names its element «`labels.trigger`: <color name>» unless the element has its own `aria-label`).
- `ColorPicker.Swatches` is a `role="radiogroup"` (ColorSwatches): name it with `label` or `aria-label`.
- The ColorPresets grid is `role="listbox"` with `role="option"` swatches (roving tabindex), named by the Content `label` or `labels.list`.
- Channel fields are named by `labels` (`hue`, `red`…); HexInput by its label (`labels.hex` by default).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### ColorPicker.Root

| Key | Default | Used for |
|---|---|---|
| `format` | `"Формат значений цвета"` | Name of `ColorPicker.FormatSelect`. |
| `eyeDropper` | `"Пипетка"` | Name of `ColorPicker.EyeDropperButton`. |
| `hex` | `"Hex"` | Hex field of `ChannelStrip` and the default `HexInput` label. |
| `palette` | `"Открыть палитру"` | Name and tooltip of `ColorPicker.SwatchButton`. |
| `hue` | `"Оттенок, градусы"` | Hue channel field. |
| `saturation` | `"Насыщенность, проценты"` | Saturation channel field. |
| `lightness` | `"Яркость, проценты"` | Lightness channel field. |
| `alpha` | `"Непрозрачность, проценты"` | Alpha channel field. |
| `red` | `"Красный, 0–255"` | Red channel field. |
| `green` | `"Зелёный, 0–255"` | Green channel field. |
| `blue` | `"Синий, 0–255"` | Blue channel field. |

#### ColorPicker.Swatches

| Key | Default | Used for |
|---|---|---|
| `group` | `"Цвет"` | Name of the swatch group without a visible `label` and `aria-label`. |
| `empty` | `"Без цвета"` | Name of the «no color» swatch (never shown here: the picker has no `allowEmpty`). |
| `optional` | `"необязательно"` | Marker after the label when `optional`. |
| `colorNames` | `"Серый · Красный · Оранжевый · Жёлтый · Зелёный · Бирюзовый · Голубой · Синий · Фиолетовый · Розовый"` | Names of the palette hues (unused here: the picker swatches are colors). |

#### ColorPicker.EyeDropperButton

| Key | Default | Used for |
|---|---|---|
| `holdHint` | `"Удерживайте, чтобы подтвердить"` | Description of the button with `holdToConfirm`. |
| `countdownHint` | `"Действие выполнится через {seconds} с, нажмите, чтобы отменить"` | Description of the button with `countdown`; `{seconds}` is the count. |
| `undoHint` | `"Действие выполнено, отменить можно ещё {seconds} с"` | Description of the button with an `undo` `countdown`; `{seconds}` is the count. |

#### ColorPresets.Root

| Key | Default | Used for |
|---|---|---|
| `trigger` | `"Цвет"` | ColorPresets trigger name prefix: «<trigger>: <color name>»; in a FieldList cell the column heading. |
| `list` | `"Цвета"` | ColorPresets swatch list name when `Content` has no `label`. |
| `empty` | `"Без цвета"` | ColorPresets «no color» swatch and the trigger name for an empty value. |
| `custom` | `"Свой цвет"` | Label of the ColorPresets hex field (`allowCustom`). |
| `customInvalid` | `"Введите цвет в формате #RRGGBB"` | Error of the ColorPresets hex field when Enter finds no hex color. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A color field: a hex value and a swatch segment at its end that opens the picker panel — `ColorPicker.HexInput`, `ColorPicker.SwatchButton`. |
| [sizes.tsx](examples/sizes.tsx) | Every tier of the picker: the hex field and its swatch segment take it from the root — `size`. |
| [states.tsx](examples/states.tsx) | A disabled area, hue slider and preset trigger keep showing the color but take no input — `disabled`. |
| [validation.tsx](examples/validation.tsx) | A button color checked live: a too light color shakes in an error that leaves once the color is darker; a hint under the other field, invalid text reverts on blur — `hint`, `error`. |
| [panel.tsx](examples/panel.tsx) | The full raised panel and its part order: format, area, hue and alpha sliders, channels, brand swatches — `ColorPicker.Panel`, `surface`, `ColorPicker.Swatches`. |
| [formats.tsx](examples/formats.tsx) | The channel strip in each value format; three pickers edit one color — `defaultFormat`, `ColorPicker.ChannelStrip`. |
| [presets.tsx](examples/presets.tsx) | A quick color from the palette: a square trigger with «no color» and a Button trigger whose grid of four columns stays open after a pick — `ColorPresets`, `allowEmpty`, `ColorPresets.Trigger`, `columns`, `closeOnSelect`. |
| [presets-custom.tsx](examples/presets-custom.tsx) | A spec's color on the site: the brand palette one click away and any hex typed under it — `ColorPresets`, `allowCustom`. |
| [presets-sizes.tsx](examples/presets-sizes.tsx) | The preset trigger in every size, a square of the control height next to an input of the same tier — `ColorPresets`, `size`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the color and its format: brand swatches and the channels edit it, the format stays as picked, a button resets both — `value`, `onValueChange`, `format`, `onFormatChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent opens the preset palette from its own button and keeps the chosen color — `open`, `onOpenChange`, `value`, `onValueChange`. |
| [in-form.tsx](examples/in-form.tsx) | Theme settings: the color goes with the form, a too light color shakes in an error on save that leaves once the color changes — `value`, `error`. |

## Mistakes
- A ColorPresets palette padded with dozens of colors so that «any» color fits, or a ColorField beside it for the rest → `allowCustom`: the palette stays short, any hex is typed under it.
- Trigger in one `ColorPicker.Root` and panel in another → they will not share the color; wrap both in one Root.
- `isDisabled` on Area / Slider → use `disabled`.
- `onChange` on `ColorPicker.Root` → use `onValueChange`.
- `parseColor` on raw user input without try/catch → it throws on invalid strings.
- `surface="raised"` inside a Popover → use the default `none`.
- Expecting `ColorPresets` to return a `Color` → it returns the preset string (or `null`).
- `<ColorPresets.Trigger onKeyDown={…}>` or `className` on the Trigger → it is a slot with no props of its own; put them on the child element.
- A hex field and a separate swatch `Button` side by side in your own row → put `ColorPicker.SwatchButton` inside `HexInput`.
- `<ColorPresets.Trigger />` with no child → put `ColorPresets.SwatchButton` (or your Button) inside it.

## Related
- **Built from:** [Input](../input/COMPONENT.md) (`HexInput`; its field action segment for `SwatchButton`; the hex field of `ColorPresets allowCustom`), [Tooltip](../tooltip/COMPONENT.md) (`SwatchButton`), [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) (the `HexInput` label, hint and error), [Select](../select/COMPONENT.md) (`FormatSelect`), [Button](../button/COMPONENT.md) (`EyeDropperButton`), [ColorSwatches](../color-swatches/COMPONENT.md) (`Swatches`), [Popover](../popover/COMPONENT.md) (`ColorPresets.Root`, `ColorPresets.Content`), `Icon` (pipette), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [ColorField](../color-field/COMPONENT.md), [ColorSwatches](../color-swatches/COMPONENT.md), [TagSelect](../tag-select/COMPONENT.md)
