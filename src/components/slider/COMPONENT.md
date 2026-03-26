# Slider

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Horizontal range control built on the native `input type="range"`, with optional text label and kit sizing (`s`–`xl`).

- **Use** when the user should pick a number along a continuous or stepped interval (volume, brightness, percentages, temperature bands) and dragging the track is appropriate.
- **Use** when native range keyboard and pointer behavior is sufficient and you want minimal custom logic.
- **Do not use** for vertical sliders; the implementation is horizontal only.
- **Do not use** when you need a value thumb label, icons, or other slots on the track—compose with surrounding layout and text.
- **Do not use** expecting built-in error, required, loading, or read-only modes; handle those with form primitives and hints around the control.
- **Do not use** when a small set of fixed choices fits radio or segmented controls better than a continuous range.

## Composition

- **`Slider`** is a single-part API: **`Slider.Root`** wraps **`ControlSizeProvider`**, an optional **`label`** (`label` + `htmlFor` linked to the input), and one **`input type="range"`** styled as the track.
- The root `div` carries **`data-size`** from **`size`**; there are no other exported subcomponents.

### Minimal example

```tsx
import { Slider } from "prime-ui-kit";

export function Example() {
  return <Slider.Root />;
}
```

## Rules

- **Controlled:** pass **`value`** and **`onChange`**; **uncontrolled:** pass **`defaultValue`** (or omit both value props—effective initial value is **`min`**, clamped to **`[min, max]`**).
- **`min`**, **`max`**, and **`step`** default to **`0`**, **`100`**, and **`1`**; fractional **`step`** values are allowed.
- Displayed value is **clamped** to **`[min, max]`**; if the browser emits a non-numeric value, the update is ignored.
- With **`label`**, the visible label is associated with the input via **`id`** / **`htmlFor`**. Without **`label`**, set **`aria-label`** (or an external accessible name), or assistive technologies may not get a proper name.
- **`disabled`** sets the native **`disabled`** state on the range input.
- There is no **`asChild`** or portal behavior; focus and **`focus-visible`** styling follow the native control and theme.

## API

### Slider.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `number` | — | No | Controlled value |
| defaultValue | `number` | — | No | Initial value when uncontrolled; if omitted, the internal initial value is `min` (clamped to `[min, max]`) |
| min | `number` | `0` | No | Minimum value |
| max | `number` | `100` | No | Maximum value |
| step | `number` | `1` | No | Step increment (may be fractional) |
| disabled | `boolean` | — | No | Disables the range input |
| onChange | `(value: number) => void` | — | No | Called when the value updates |
| label | `string` | — | No | Visible label above the track; wires `htmlFor` / `id` on the input |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track, thumb, and label scale |
| className | `string` | — | No | Class on the root `div` |
| aria-label | `string` | — | No | Accessible name when there is no `label` |

## Related

- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
- [DigitInput](../digit-input/COMPONENT.md)
