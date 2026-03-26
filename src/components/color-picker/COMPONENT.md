# ColorPicker

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A composite color picker built on **react-aria-components**: it keeps a shared `Color` value across a 2D area, channel sliders, optional preset swatches, a standalone hex field, and a channel strip with an eyedropper control.

- **When to use:** brand, theme, or accent color selection with a visual preview; editor-style fill, stroke, or text color; chart or legend colors persisted as strings or `Color`; forms where the stored value must stay a CSS-parseable color.
- **When to use:** one shared `onChange` from many nested controls while the parent holds `value` / `parseColor` state.
- **When to use:** combining fixed presets (`SwatchPicker`) with free adjustment (area and sliders).
- **When not to use:** only a hex string is needed and no picker UI adds value — prefer a plain [Input](../input/COMPONENT.md) or another simple field.
- **When not to use:** the full control surface must stay inline in a tight layout — mount the panel in an overlay ([Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md), or [Drawer](../drawer/COMPONENT.md)) instead.
- **When not to use:** every user must rely on the system eyedropper — without the EyeDropper API the control is non-functional decoration only.

## Composition

- **`ColorPicker.Root`** wraps everything that should share one color value (trigger + panel). Put **`ColorPicker.TriggerSwatch`** on the same root as the panel so the swatch reflects the live color.
- **Product layouts:** place the interactive surface (area, sliders, swatches, `HexInput`, `ChannelStrip`) inside **`Popover.Content`** (or modal/drawer), with a trigger such as [Button](../button/COMPONENT.md) + `TriggerSwatch`. `HexInput`-only flows still belong under a trigger if you want a compact field.
- **`ColorPicker.FormatProvider`** is required for **`FormatSelect`** and **`ChannelStrip`** (the strip calls into format context; without the provider it throws at runtime). `FormatSelect` renders nothing if mounted outside `FormatProvider`.
- **Typical panel order:** `FormatProvider` → optional `FormatSelect` → `Area` with `AreaThumb` → one or more `Slider` trees (`SliderMeta` optional, then `SliderTrack` → `Thumb`) → `ChannelStrip` (`pipetteIcon` required) → optional `SwatchPicker` with `SwatchPickerItem` children each wrapping `Swatch` → optional `HexInput` or RAC **`Field`** for custom channel inputs.
- **`EyeDropperButton`** is used inside `ChannelStrip` by default; it can also be composed separately under the same `Root` if needed.
- **`Output`** is the RAC slider value readout; the kit wires it inside **`SliderMeta`** (label + value row).

### Minimal example

```tsx
import { Button, ColorPicker, Popover } from "prime-ui-kit";

export function MinimalColorField() {
  return (
    <ColorPicker.Root defaultValue="#3b82f6">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Color
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Popover.Inset padding="x2" gap="x3">
            <ColorPicker.FormatProvider>
              <ColorPicker.FormatSelect />
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.ChannelStrip pipetteIcon={<span aria-hidden />} />
            </ColorPicker.FormatProvider>
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}
```

## Rules

- Use **controlled** mode with `value` and `onChange` when the parent owns color state; use **`defaultValue`** for uncontrolled usage. Value types follow RAC: `string | Color`; `onChange` receives a **`Color`** instance.
- Import **`Color`** for typing from **`react-aria-components`** (or use the kit re-export type **`ColorPickerColorValue`**). Use **`parseColor`** from **`prime-ui-kit`** to turn strings into `Color` for `useState` initial values.
- **`children`** on `Root` may be a render function; it receives **`ColorPickerRenderProps`** (`{ color }`) from RAC.
- There is **no** single `isDisabled` on `Root` — disable **`Area`**, **`Slider`**, **`SwatchPickerItem`**, or wrap groups in a disabled **`fieldset`** when appropriate.
- **`ChannelStrip`** must receive **`pipetteIcon`** (usually [Button.Icon](../button/COMPONENT.md) wrapping an icon). Pass **`aria-label`** on **`EyeDropperButton`** if you use it standalone (default label is Russian “Пипетка” in code).
- If **`window.EyeDropper`** is missing, the eyedropper renders as a disabled control with **`aria-hidden`** and **`tabIndex={-1}`** — do not rely on it as the only way to set a color.
- **`FormatProvider`** owns HSL / RGB / hex strip mode (`defaultFormat`: `"hsl"` \| `"rgb"` \| `"hex"`). **`FormatSelect`** only appears when inside that provider.
- **`HexInput`** and strip hex editing **revert** invalid input to the last committed color on **blur** or **Enter**. Channel cells in the strip **ignore** non-numeric input on commit (no color change).
- **`TriggerSwatch`** is **`aria-hidden`**; expose the purpose on the trigger (visible button text or `aria-label` on the control).
- **`SwatchPicker`** needs an accessible name (**`aria-label`** or an associated label).
- Sliders use a **fixed** visual size tier (`data-size="m"` on the kit `Slider`); only **`HexInput`** exposes the kit **`size`** axis (`s` \| `m` \| `l` \| `xl`).
- For **`SwatchPicker`** selection semantics and layout, follow RAC props (`value` / `defaultValue` / `onChange`, `layout`, etc.).

## API

### ColorPicker.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string \| Color` | — | No | Controlled color value |
| defaultValue | `string \| Color` | — | No | Initial color when uncontrolled |
| onChange | `(color: Color) => void` | — | No | Fires when any nested control changes the color |
| children | `ReactNode \| (props: ColorPickerRenderProps) => ReactNode` | — | Yes | Pickers, triggers, and panels sharing state |
| slot | `string \| null` | — | No | Slotted context name (RAC `SlotProps`) |
| className | `string \| (values) => string` | — | No | Root element classes (RAC render props) |
| …rest | RAC + DOM | — | No | Other **`ColorPickerRootProps`** / `AriaColorPickerProps` from react-aria-components |

### ColorPicker.FormatProvider

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `ReactNode` | — | Yes | subtree that may use `FormatSelect` and `ChannelStrip` |
| defaultFormat | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | No | Initial format for the strip and format select |

### ColorPicker.FormatSelect

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the wrapper around the kit [Select](../select/COMPONENT.md) |

Renders `null` when not under `FormatProvider`.

### ColorPicker.ChannelStrip

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| pipetteIcon | `ReactNode` | — | Yes | Icon for the embedded eyedropper ([Button.Icon](../button/COMPONENT.md) + icon) |
| className | `string` | — | No | Class on the strip container |

### ColorPicker.HexInput

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Passed to kit [Input](../input/COMPONENT.md) |
| label | `ReactNode` | `"Hex"` | No | Field label |
| className | `string` | — | No | Class on `Input.Root` |

### ColorPicker.TriggerSwatch

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the preview square |

### ColorPicker.SliderMeta

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| label | `ReactNode` | — | Yes | Left label; current channel value on the right via `Output` |

### ColorPicker.EyeDropperButton

Same props as **`Button.Root`** from the kit except **`variant`**, **`mode`**, and **`size`** are fixed (`neutral`, `stroke`, `m`). Forwarded ref: **`HTMLButtonElement`**. Children are usually **`Button.Icon`**.

### ColorPicker.Area, AreaThumb, Slider, SliderTrack, Thumb, Output, Field, SwatchPicker, SwatchPickerItem, Swatch

Styled wrappers around the matching **react-aria-components** primitives. Use their RAC prop surfaces (e.g. **`Area`**: `colorSpace`, `xChannel`, `yChannel`, `isDisabled`; **`Slider`**: `channel`, optional `colorSpace`, `orientation`, `isDisabled`; **`SwatchPicker`** / **`SwatchPickerItem`**: selection and `color` on items; **`Field`**: RAC `ColorField` props). **`Swatch`** and **`SliderTrack`** add checkerboard layering for transparency in the kit styles.

### `parseColor(value: string): Color`

Parses a CSS color string into a **`Color`**. **Throws** if the string cannot be parsed (RAC / `@react-stately/color` behavior).

Exported types from this module include **`ColorPickerRootProps`**, **`ColorPickerHexInputProps`**, **`ColorPickerFormatProviderProps`**, **`ColorPickerTriggerSwatchProps`**, **`ColorValueFormat`**, **`ColorPickerRenderProps`**, and **`ColorPickerColorValue`** (alias of **`Color`**).

## Related

- [Popover](../popover/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Select](../select/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Drawer](../drawer/COMPONENT.md)
- [Label](../label/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)
