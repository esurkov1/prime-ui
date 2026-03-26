# ColorPicker

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

`ColorPicker` is a **react-aria-components** color surface: one shared `Color` flows through a 2D area, channel sliders, optional preset swatches, a kit **HexInput**, and a channel strip with an eyedropper slot. **`ColorPicker.Root`** owns state; **`FormatProvider`** is mandatory for **`FormatSelect`** and **`ChannelStrip`**. **`parseColor`** and **`onChange`** use RAC **`Color`**; persist with **`color.toString("hex")`**, **`"css"`**, or **`"hexa"`** as needed.

- **Use for:** theme/accent tuning, brand palettes, variant swatches, or any form field that stores a CSS-parseable color.
- **Do not use for:** hex-only entry with no visual benefit (prefer [Input](../input/COMPONENT.md)); full chrome always inline in dense UI (mount the panel in [Popover](../popover/COMPONENT.md), [Modal](../modal/COMPONENT.md), or [Drawer](../drawer/COMPONENT.md)); eyedropper as the only input path (it is absent without **`window.EyeDropper`**).

Runnable TSX scenarios live in **`examples/`** (same folder as this file): `theme-accent.tsx`, `brand-kit.tsx`, `product-variant-swatch.tsx`, `controlled-form-field.tsx`, `minimal-popover.tsx`.

## Extended

### About

The picker composes RAC primitives with kit styling (checkerboard for transparency on tracks/swatches). **`TriggerSwatch`** mirrors the live color for button triggers but is **`aria-hidden`**—name the control via visible label text or **`aria-label`**. Sliders are fixed at visual size **`m`**; only **`HexInput`** exposes the kit **`size`** axis (**`s`**–**`xl`**).

### Scenarios

| Scenario | Intent | Example file |
|----------|--------|----------------|
| **Theme accent** | Controlled value synced to design tokens or backend; show readout + popover editor. | `examples/theme-accent.tsx` |
| **Brand kit** | Curated swatches plus free adjustment and hex field for design-system colors. | `examples/brand-kit.tsx` |
| **Product variant swatch** | Fast selection from discrete SKUs; optional fine tuning in the same **`Root`**. | `examples/product-variant-swatch.tsx` |
| **Controlled form field** | Parent owns **`value`/`onChange`**; label association + popover + **`HexInput`**. | `examples/controlled-form-field.tsx` |

See also **`examples/minimal-popover.tsx`** for the smallest valid **`Popover`** composition.

### Composition

- **`ColorPicker.Root`** wraps every control that shares one color (trigger + panel). Keep **`TriggerSwatch`** under the same **`Root`** as the panel so the preview stays in sync.
- Put the interactive surface (area, sliders, swatches, **`HexInput`**, **`ChannelStrip`**) inside **`Popover.Content`** (or modal/drawer) in product layouts; pair with [Button](../button/COMPONENT.md) + **`TriggerSwatch`** or an accessible trigger.
- Wrap subtree that needs format switching or the strip in **`FormatProvider`** before **`FormatSelect`**, **`ChannelStrip`**, or strip-driven cells. **`FormatSelect`** returns **`null`** outside **`FormatProvider`**.
- Typical panel order: **`FormatProvider`** → optional **`FormatSelect`** → **`Area`** + **`AreaThumb`** → **`Slider`** trees (**`SliderMeta`** optional, then **`SliderTrack`** → **`Thumb`**) → **`ChannelStrip`** (**`pipetteIcon`** required) → optional **`SwatchPicker`** / **`SwatchPickerItem`** / **`Swatch`** → optional **`HexInput`** or RAC **`Field`**.
- **`EyeDropperButton`** is embedded in **`ChannelStrip`**; pass **`pipetteIcon`** (e.g. [Button.Icon](../button/COMPONENT.md) + icon). Standalone use is possible under the same **`Root`** with an explicit **`aria-label`** if needed.

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
        <Popover.Content align="start" insetGap="x3" insetPadding="x2" side="bottom">
          <ColorPicker.FormatProvider>
            <ColorPicker.FormatSelect />
            <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>
            <ColorPicker.ChannelStrip pipetteIcon={<span aria-hidden />} />
          </ColorPicker.FormatProvider>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}
```

### Rules

- **Controlled:** **`value`** + **`onChange`** when the parent owns color; **`defaultValue`** when uncontrolled. **`onChange`** receives **`Color`**.
- Type with **`ColorPickerColorValue`** (re-export of RAC **`Color`**) or import **`Color`** from **`react-aria-components`**. Initialize **`useState`** from strings via **`parseColor`** from **`prime-ui-kit`** (**throws** on invalid strings).
- **`children`** on **`Root`** may be a render function receiving **`ColorPickerRenderProps`** (`{ color }`).
- There is **no** single **`isDisabled`** on **`Root`**—disable **`Area`**, **`Slider`**, **`SwatchPickerItem`**, or use a disabled **`fieldset`** where appropriate.
- **`ChannelStrip`** must receive **`pipetteIcon`**. Without **`EyeDropper`**, the control is disabled and **`aria-hidden`**—do not rely on it alone.
- **`FormatProvider`** sets initial strip mode via **`defaultFormat`**: **`"hsl"`** | **`"rgb"`** | **`"hex"`**.
- **`HexInput`** and strip hex cells **revert** invalid input on blur/Enter; numeric strip cells **ignore** non-numeric commits.
- **`SwatchPicker`** needs an accessible name (**`aria-label`** or associated label). Follow RAC for **`SwatchPicker`** / **`SwatchPickerItem`** selection props.
- **`Area`**, **`Slider`**, **`Swatch`**, etc. use RAC prop surfaces (e.g. **`Area`**: **`colorSpace`**, **`xChannel`**, **`yChannel`**; **`Slider`**: **`channel`**, optional **`colorSpace`**, **`orientation`**, **`isDisabled`**).

### API

#### ColorPicker.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `string \| Color` | — | No | Controlled color value |
| defaultValue | `string \| Color` | — | No | Initial color when uncontrolled |
| onChange | `(color: Color) => void` | — | No | Fires when any nested control changes the color |
| children | `ReactNode \| (props: ColorPickerRenderProps) => ReactNode` | — | Yes | Pickers, triggers, and panels sharing state |
| slot | `string \| null` | — | No | Slotted context name (RAC `SlotProps`) |
| className | `string \| (values) => string` | — | No | Root element classes (RAC render props) |
| …rest | RAC + DOM | — | No | Other **`ColorPickerRootProps`** / `AriaColorPickerProps` from react-aria-components |

#### ColorPicker.FormatProvider

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `ReactNode` | — | Yes | Subtree that may use `FormatSelect` and `ChannelStrip` |
| defaultFormat | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | No | Initial format for the strip and format select |

#### ColorPicker.FormatSelect

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the wrapper around the kit [Select](../select/COMPONENT.md) |

Renders `null` when not under `FormatProvider`.

#### ColorPicker.ChannelStrip

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| pipetteIcon | `ReactNode` | — | Yes | Icon for the embedded eyedropper ([Button.Icon](../button/COMPONENT.md) + icon) |
| className | `string` | — | No | Class on the strip container |

#### ColorPicker.HexInput

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Passed to kit [Input](../input/COMPONENT.md) |
| label | `ReactNode` | `"Hex"` | No | Field label |
| className | `string` | — | No | Class on `Input.Root` |

#### ColorPicker.TriggerSwatch

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Class on the preview square |

#### ColorPicker.SliderMeta

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| label | `ReactNode` | — | Yes | Left label; current channel value on the right via `Output` |

#### ColorPicker.EyeDropperButton

Same props as **`Button.Root`** except **`variant`**, **`mode`**, and **`size`** are fixed (`neutral`, `stroke`, `m`). Forwarded ref: **`HTMLButtonElement`**. Children are usually **`Button.Icon`**.

#### ColorPicker.Area, AreaThumb, Slider, SliderTrack, Thumb, Output, Field, SwatchPicker, SwatchPickerItem, Swatch

Styled wrappers around matching **react-aria-components** primitives; use their RAC APIs. **`Swatch`** and **`SliderTrack`** add checkerboard layering for transparency in kit styles.

#### `parseColor(value: string): Color`

Parses a CSS color string into **`Color`**. **Throws** if parsing fails.

Exported types: **`ColorPickerRootProps`**, **`ColorPickerHexInputProps`**, **`ColorPickerFormatProviderProps`**, **`ColorPickerTriggerSwatchProps`**, **`ColorValueFormat`**, **`ColorPickerRenderProps`**, **`ColorPickerColorValue`**.

### Related

- [Popover](../popover/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [Input](../input/COMPONENT.md)
- [Select](../select/COMPONENT.md)
- [Modal](../modal/COMPONENT.md)
- [Drawer](../drawer/COMPONENT.md)
- [Label](../label/COMPONENT.md)
- [Typography](../typography/COMPONENT.md)

## LLM note

- Always place **`FormatProvider`** above **`FormatSelect`**, **`ChannelStrip`**, or any code path that calls into strip format context—missing provider throws at runtime.
- **`ChannelStrip`** requires **`pipetteIcon`**; use a real icon node or a minimal **`<span aria-hidden />`** only for docs/tests.
- **`TriggerSwatch`** is **`aria-hidden`**; the trigger **Button** (or other control) must expose the purpose via visible text or **`aria-label`**.
- Controlled integration: **`value`** can be **`string | Color`**; **`onChange`** always yields **`Color`**—serialize with **`toString(...)`** for APIs expecting strings.
- **`parseColor`** throws on bad input; guard user paste if you cannot tolerate exceptions.
- Dense UIs: mount the picker body in **[Popover](../popover/COMPONENT.md)** / **[Modal](../modal/COMPONENT.md)** / **[Drawer](../drawer/COMPONENT.md)**, not inline in toolbars.
- Do not assume **`EyeDropper`** exists; provide sliders, hex, or swatches as primary input paths.
- For copy-paste recipes, start from **`examples/minimal-popover.tsx`** or the **Minimal example** above, then add sliders, **`SwatchPicker`**, or **`HexInput`** per scenario.
