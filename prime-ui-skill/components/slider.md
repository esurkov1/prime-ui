# Slider

## What it is

A horizontal slider built on the native `input type="range"` with kit tokens: optional text label, `s`–`xl` sizes, and a configurable range.

## What it’s for

- **Media players and podcasts** — adjust volume or balance without typing numbers on the keyboard.
- **Climate and smart home** — pick target temperature or light brightness within clear bounds.
- **Warehouse and logistics** — in procurement UIs, set a target stock level as a percentage with immediate feedback in the label.
- **Layout editors** — coarse adjustment of layer opacity or preview scale with fractional steps.
- **Surveys and forms** — a discrete scale (e.g. step 25 on 0–100) as an alternative to a row of radio buttons.
- **Accessibility settings** — speech rate or gesture sensitivity in one control inside a settings card.

## Use cases

The examples below differ in domain and which props they use.

### Basic

Player page: the user moves a single volume slider; default value is mid-range.

```tsx
import { Slider } from "prime-ui-kit";

export function PlayerVolumeRow() {
  return <Slider.Root label="Volume" defaultValue={45} min={0} max={100} step={1} />;
}
```

### Sizes

Internal monitoring panel: identical alert-threshold sliders in four sizes to align density with the table and filters.

```tsx
import { Slider } from "prime-ui-kit";

export function AlertThresholdDensityPreview() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 360 }}>
      <Slider.Root size="s" label="Threshold (s)" defaultValue={70} />
      <Slider.Root size="m" label="Threshold (m)" defaultValue={70} />
      <Slider.Root size="l" label="Threshold (l)" defaultValue={70} />
      <Slider.Root size="xl" label="Threshold (xl)" defaultValue={70} />
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

Venue booking card: temperature within an allowed band and a locked preset when the user lacks edit rights.

```tsx
import { Slider } from "prime-ui-kit";

export function VenueClimateCard({ canEdit }: { canEdit: boolean }) {
  return (
    <section style={{ padding: 20, maxWidth: 400, borderRadius: 12, border: "1px solid #e4e4e7" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Room climate</h2>
      <Slider.Root label="Target temperature, °C" min={18} max={26} step={1} defaultValue={22} disabled={!canEdit} />
    </section>
  );
}
```

### Controlled mode

Procurement dashboard: target stock percentage lives in screen state and stays in sync with the caption under the slider.

```tsx
import * as React from "react";
import { Slider } from "prime-ui-kit";

export function ReorderLevelControl() {
  const [pct, setPct] = React.useState(55);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 320 }}>
      <Slider.Root label="Target stock level" value={pct} onChange={setPct} min={0} max={100} step={1} />
      <span style={{ fontSize: 13, opacity: 0.75 }}>Current: {pct}% of shelf maximum</span>
    </div>
  );
}
```

## Anatomy

- **`Slider.Root`** — a `div` container with `data-size`, wrapping **`ControlSizeProvider`** inside; optional **`label`** (`label` + `htmlFor` on the `input`); child **`input type="range"`** with track class.

Public API: the **`Slider`** object with a single **`Root`** field.

## API

### Slider.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| value | `number` | — | no | Controlled value. |
| defaultValue | `number` | `min` | no | Initial value in uncontrolled mode; clamped to `[min, max]`. |
| min | `number` | `0` | no | Slider minimum. |
| max | `number` | `100` | no | Slider maximum. |
| step | `number` | `1` | no | Step size (fractional values allowed, e.g. `0.1`). |
| disabled | `boolean` | — | no | Disables input and dims visuals. |
| onChange | `(value: number) => void` | — | no | Callback when the value changes after user interaction. |
| label | `string` | — | no | Visible label above the track; linked to the `input` via `id`. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Track, thumb, and label font scale. |
| className | `string` | — | no | Class on the root `div`. |
| aria-label | `string` | — | no | Name for assistive tech when there is no `label`. |

## Variants

There is no separate `variant` prop: appearance comes from the theme (accent color, focus) and the **`size`** prop. The component does not encode “error” or “required field” semantics — wrap it in form markup with an error message next to it when needed.

## States

- **Active** — value changes by dragging, clicking the track, or native `range` keyboard keys.
- **`disabled`** — input unavailable, `not-allowed` cursor, reduced opacity.
- **Controlled / uncontrolled** — via `value` + `onChange` or `defaultValue` (`useControllableState` logic).

## Accessibility (a11y)

- Native **`input type="range"`** provides expected keyboard behavior in the browser.
- With **`label`**, the label is associated via **`htmlFor`** / **`id`**.
- Without **`label`**, set **`aria-label`** (or an external label in another accessible way), or the control name may be empty.
- Visible **`outline`** on **`focus-visible`** for keyboard navigation.

## Limitations and notes

- **Horizontal** axis only; a vertical slider is not part of the API.
- No **`asChild`**, icon slots, or built-in current value on the track — render the number next to it in your screen markup.
- No **`loading`** / **`readOnly`** / **`error`** modes on the component itself — combine with form fields and hint text when needed.
- Values are **clamped** to `[min, max]`; invalid DOM input is dropped during parsing.

## Related components

- **`Label`** — when the label should be shared by a group or match other form fields.
- **`Hint`** — explanation of the range or units under the slider.
- **`DigitInput`** — when you need precise numeric input instead of or alongside the slider (the playground has combined layout examples).
