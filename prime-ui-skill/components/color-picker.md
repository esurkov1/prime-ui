# ColorPicker

## What it is

A composite color-picker widget in the prime-ui-kit UI: a two-channel area, channel sliders, a preset palette, hex input, and a channel strip with an eyedropper; color state stays in sync via **react-aria-components** primitives (`Color` model, markup and a11y from React Aria).

## What it’s for

- **Brand and themes:** set primary, accent, and background product colors with preview and palette presets.
- **Content and editors:** pick text, block fill, or stroke color in a visual editor without tying it to “theme settings.”
- **Data and visualization:** series color on a chart, legends, and conditional highlights in reports when the value is stored in dashboard config.
- **E-commerce and storefronts:** product personalization (variant color), aligning the shade with the product card photo.
- **Forms and surveys:** “favorite color,” visual status or category markers with a clear color code.
- **Overlay embedding:** a compact panel in a popover from a button with `TriggerSwatch` so the main screen stays uncluttered.

## Use cases

Each example targets a different product context and API combination.

### Basic

An inline panel on a settings page: the user sees the HSL area, hue, alpha, format switching, and presets at once.

```tsx
import { Pipette } from "lucide-react";
import { ColorPicker } from "prime-ui-kit";

const PRESETS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444"];

export function BrandAccentField() {
  return (
    <ColorPicker.Root defaultValue="hsl(220, 90%, 56%)">
      <ColorPicker.FormatProvider defaultFormat="hsl">
        <ColorPicker.FormatSelect />
        <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
          <ColorPicker.AreaThumb />
        </ColorPicker.Area>
        <ColorPicker.Slider channel="hue" colorSpace="hsl">
          <ColorPicker.SliderMeta label="Hue" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.Slider channel="alpha">
          <ColorPicker.SliderMeta label="Opacity" />
          <ColorPicker.SliderTrack>
            <ColorPicker.Thumb />
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>
        <ColorPicker.ChannelStrip
          pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
        />
        <ColorPicker.SwatchPicker aria-label="Brand presets">
          {PRESETS.map((c) => (
            <ColorPicker.SwatchPickerItem key={c} color={c}>
              <ColorPicker.Swatch />
            </ColorPicker.SwatchPickerItem>
          ))}
        </ColorPicker.SwatchPicker>
      </ColorPicker.FormatProvider>
    </ColorPicker.Root>
  );
}
```

### Variants / sizes

Marketing landing: CTA block editor with different hex field sizes for mobile and desktop (multiple roots, each with only `HexInput`).

```tsx
import { ColorPicker } from "prime-ui-kit";

export function CtaHexRow() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end" }}>
      <ColorPicker.Root defaultValue="#2563eb">
        <ColorPicker.HexInput label="Button (s)" size="s" />
      </ColorPicker.Root>
      <ColorPicker.Root defaultValue="#2563eb">
        <ColorPicker.HexInput label="Button (xl)" size="xl" />
      </ColorPicker.Root>
    </div>
  );
}
```

### In context (popover)

Workflow or tasks: label color on a card — the panel opens from a button with the current color square (`TriggerSwatch`) next to the kit `Popover`.

```tsx
import { Pipette } from "lucide-react";
import { Button, ColorPicker, Popover } from "prime-ui-kit";

function PickerBody() {
  return (
    <ColorPicker.FormatProvider>
      <ColorPicker.FormatSelect />
      <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
        <ColorPicker.AreaThumb />
      </ColorPicker.Area>
      <ColorPicker.Slider channel="hue" colorSpace="hsl">
        <ColorPicker.SliderTrack>
          <ColorPicker.Thumb />
        </ColorPicker.SliderTrack>
      </ColorPicker.Slider>
      <ColorPicker.ChannelStrip
        pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
      />
    </ColorPicker.FormatProvider>
  );
}

export function TaskLabelColorTrigger() {
  return (
    <ColorPicker.Root defaultValue="hsl(280, 70%, 55%)">
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button.Root mode="stroke" size="m" variant="neutral">
            <ColorPicker.TriggerSwatch />
            Label color
          </Button.Root>
        </Popover.Trigger>
        <Popover.Content align="start" side="bottom">
          <Popover.Inset>
            <PickerBody />
          </Popover.Inset>
        </Popover.Content>
      </Popover.Root>
    </ColorPicker.Root>
  );
}
```

### Composition with Popover

Color selection in a floating panel; the button indicator updates when the color changes via the area, sliders, or presets.

```tsx
import { Pipette } from "lucide-react";
import * as React from "react";

import { Button, ColorPicker, parseColor, Popover } from "prime-ui-kit";
import type { Color } from "react-aria-components";

const PRESETS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#8b5cf6"];

export function ColorPickerPopoverField() {
  const [color, setColor] = React.useState<Color | undefined>(parseColor("#3b82f6"));
  const [open, setOpen] = React.useState(false);

  const handleColorChange = (newColor: Color) => {
    setColor(newColor);
  };

  const colorString = color?.toString("css") ?? "#000000";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root mode="stroke" size="m" variant="neutral">
          <span
            style={{
              display: "inline-block",
              width: "1rem",
              height: "1rem",
              borderRadius: "var(--prime-sys-radius-s)",
              backgroundColor: colorString,
              border: "1px solid var(--prime-sys-color-border-primary)",
            }}
          />
          {colorString}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content align="start" side="bottom">
        <Popover.Inset padding="x2" gap="x3">
          <ColorPicker.Root value={color} onChange={handleColorChange}>
            <ColorPicker.FormatProvider>
              <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <ColorPicker.Slider channel="hue" colorSpace="hsl">
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.Slider channel="alpha">
                <ColorPicker.SliderTrack>
                  <ColorPicker.Thumb />
                </ColorPicker.SliderTrack>
              </ColorPicker.Slider>
              <ColorPicker.ChannelStrip
                pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
              />
              <ColorPicker.SwatchPicker aria-label="Quick colors">
                {PRESETS.map((c) => (
                  <ColorPicker.SwatchPickerItem key={c} color={c}>
                    <ColorPicker.Swatch />
                  </ColorPicker.SwatchPickerItem>
                ))}
              </ColorPicker.SwatchPicker>
            </ColorPicker.FormatProvider>
          </ColorPicker.Root>
        </Popover.Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
```

### Controlled mode

Dashboard: color is held in page state and serialized to the API; uses `value`, `onChange`, and `parseColor`.

```tsx
import * as React from "react";
import { Pipette } from "lucide-react";
import { ColorPicker, parseColor } from "prime-ui-kit";
import type { Color } from "react-aria-components";

export function ChartSeriesColorControl() {
  const [color, setColor] = React.useState<Color>(() => parseColor("hsl(200, 80%, 50%)"));

  return (
    <div>
      <p>Series A: {color.toString("css")}</p>
      <ColorPicker.Root value={color} onChange={setColor}>
        <ColorPicker.FormatProvider>
          <ColorPicker.FormatSelect />
          <ColorPicker.Area colorSpace="hsl" xChannel="saturation" yChannel="lightness">
            <ColorPicker.AreaThumb />
          </ColorPicker.Area>
          <ColorPicker.Slider channel="hue" colorSpace="hsl">
            <ColorPicker.SliderMeta label="Hue" />
            <ColorPicker.SliderTrack>
              <ColorPicker.Thumb />
            </ColorPicker.SliderTrack>
          </ColorPicker.Slider>
          <ColorPicker.ChannelStrip
            pipetteIcon={<Pipette aria-hidden size={18} strokeWidth={1.75} />}
          />
        </ColorPicker.FormatProvider>
      </ColorPicker.Root>
    </div>
  );
}
```

## Anatomy

```
ColorPicker.Root
├── ColorPicker.FormatProvider (required for FormatSelect and ChannelStrip)
│   ├── ColorPicker.FormatSelect
│   ├── ColorPicker.Area → ColorPicker.AreaThumb
│   ├── ColorPicker.Slider → ColorPicker.SliderMeta?, ColorPicker.SliderTrack → ColorPicker.Thumb
│   ├── ColorPicker.ChannelStrip (pipetteIcon required)
│   ├── ColorPicker.HexInput | ColorPicker.Field + Input (react-aria-components)
│   └── ColorPicker.SwatchPicker → ColorPicker.SwatchPickerItem → ColorPicker.Swatch
├── ColorPicker.TriggerSwatch (next to popover trigger, inside the same Root)
└── ColorPicker.EyeDropperButton (standalone or inside ChannelStrip)
```

`parseColor` is exported from the module alongside `ColorPicker` (re-export from react-aria-components).

## API

### ColorPicker.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | `string \| Color` | — | No | Controlled color value |
| defaultValue | `string \| Color` | — | No | Initial value without external state |
| onChange | `(color: Color) => void` | — | No | Color change from any nested control |
| children | `ReactNode \| (props) => ReactNode` | — | Yes | Panel markup; render function receives `color` |
| className | `string \| fn` | — | No | Styles for the RAC ColorPicker root |
| slot | `string \| null` | — | No | Slot for slotted context |
| …rest | RAC + DOM | — | No | Remaining attributes per react-aria-components docs |

The root types do not expose a single `isDisabled`: disable specific parts (`Slider`, `SwatchPickerItem`, a `fieldset disabled` wrapper, etc.).

### ColorPicker.FormatProvider

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `ReactNode` | — | Yes | Child format and channel-strip controls |
| defaultFormat | `"hsl" \| "rgb" \| "hex"` | `"hsl"` | No | Initial format for ChannelStrip / Select |

### ColorPicker.FormatSelect

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class on the wrapper around the kit Select |

Only works inside `FormatProvider`.

### ColorPicker.ChannelStrip

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| pipetteIcon | `ReactNode` | — | Yes | Icon in the eyedropper button (often `Button.Icon`) |
| className | `string` | — | No | Class on the strip |

### ColorPicker.HexInput

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Kit Input size |
| label | `ReactNode` | `"Hex"` | No | Field label |
| className | `string` | — | No | `Input.Root` class |

### ColorPicker.TriggerSwatch

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| className | `string` | — | No | Class on the preview square (fill via SVG) |

### ColorPicker.SliderMeta

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| label | `ReactNode` | — | Yes | Text on the left; value on the right via internal Output |

### ColorPicker.EyeDropperButton

Nearly all props from kit `Button.Root`, except fixed `variant`, `mode`, `size`. Children are usually `Button.Icon`. If the browser has no `EyeDropper` Web API, an inactive button with `aria-hidden` is rendered.

### ColorPicker.Area, AreaThumb, Slider, SliderTrack, Thumb, Output, Field, SwatchPicker, SwatchPickerItem, Swatch

Wrappers around the matching react-aria-components with kit styling. Key props:

- **Area:** `colorSpace`, `xChannel`, `yChannel`, `isDisabled`, `className`, …
- **Slider:** `channel`, optional `colorSpace`, `orientation`, `isDisabled`; root sets `data-size="m"`.
- **SwatchPicker:** `value` / `defaultValue` / `onChange` for the selected preset, `layout`, `aria-label`, …
- **SwatchPickerItem:** `color` (required), `isDisabled`, …
- **Field:** optional `channel` and `colorSpace`; must contain at least `Input` from react-aria-components.

Full lists are in react-aria-components types for the same primitives.

### parseColor(value: string): Color

Parses a CSS / hex string into a `Color` object for `useState` or value comparison.

## Variants

- **Channel format (`FormatProvider` + `FormatSelect`):** `hsl` (hue, saturation, lightness, alpha), `rgb`, single `hex` field.
- **Preset layout:** `SwatchPicker` prop `layout`: `grid` or `stack`.
- **Hex field size:** only on `HexInput` (`size` like kit Input); color sliders in the current implementation use a fixed visual tier `m`.

## States

- A single **preset** unavailable: `isDisabled` on `SwatchPickerItem`.
- A single **slider** or **area:** `isDisabled` on `ColorPicker.Slider` / `ColorPicker.Area`.
- **Eyedropper:** without the browser API — visually disabled button, not in tab order for meaningful color picking.
- Invalid hex input: on blur or Enter, value reverts to the last valid color from context.

## Accessibility (a11y)

- Area and sliders get roles and keyboard navigation from React Aria (arrows, Home/End, Page Up/Down per slider semantics).
- `SwatchPicker` needs an accessible name (`aria-label` or associated label).
- `TriggerSwatch` is marked `aria-hidden`: color-picking meaning must live on the trigger (button text or `aria-label`).
- Channel labels in the strip and in `HexInput` / `Field` use `label`, `aria-label`, or visible adjacent text.

## Limitations and notes

- The root types do **not** declare a global `isDisabled` — disable parts explicitly or use native `fieldset disabled` deliberately (affects all fields inside).
- `FormatSelect` and `ChannelStrip` **must** live under `FormatProvider`.
- `EyeDropper` is not supported in all browsers; the button behavior already handles a missing API.
- `Color` and `parseColor` come from react-aria-components; for strict typing import `Color` from there too.

## Related components

- **Popover** — compact panel open from a trigger with `TriggerSwatch`.
- **Button** and **Button.Icon** — trigger and eyedropper icon on `EyeDropperButton` / in `ChannelStrip`.
- **Input** (kit) — inside `HexInput`; **Input** from react-aria-components — inside `Field`.
- **Select** (kit) — inside the `FormatSelect` implementation.
- **Typography** — section labels and helper text next to the panel.
