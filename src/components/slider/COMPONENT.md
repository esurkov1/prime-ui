# Slider

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## About

A horizontal range control built on the native `input type="range"`, with optional text label and kit sizing (`s`–`xl`).

**When to use**

- Picking a number along a continuous or stepped interval: volume, brightness, percentages, temperature bands, or filter caps (for example a maximum price).
- When native range keyboard and pointer behavior is enough and you want minimal custom logic.

**When not to use**

- Vertical sliders — the implementation is horizontal only.
- When you need thumb labels, icons, or other slots on the track — compose with surrounding layout and text.
- Built-in error, required, loading, or read-only modes — use form primitives and hints around the control.
- A small set of fixed choices — prefer radio or segmented controls instead of a continuous range.

## Composition

- **`Slider`** is a single-part API: **`Slider.Root`** wraps **`ControlSizeProvider`**, an optional **`label`** (linked to the input with `htmlFor` / `id`), and one styled **`input type="range"`**.
- The root `div` carries **`data-size`** from **`size`**; there are no other exported subcomponents.

### Canonical example

```tsx
import { Slider } from "prime-ui-kit";

export function Example() {
  return (
    <Slider.Root label="Output level" min={0} max={100} step={1} defaultValue={50} size="m" />
  );
}
```

### Extended examples

- [`./examples/01-volume.tsx`](./examples/01-volume.tsx) — Volume on a 0–100 scale with helper copy under the track.
- [`./examples/02-price-range.tsx`](./examples/02-price-range.tsx) — Stepped “maximum price” filter with a `Hint` for how results update.
- [`./examples/03-controlled.tsx`](./examples/03-controlled.tsx) — Controlled `value` / `onChange` with a live numeric readout.
- [`./examples/04-disabled.tsx`](./examples/04-disabled.tsx) — Disabled preset until a parent feature is available.

**LLM note:** Prefer reading the runnable files under `./examples/*.tsx` for full scenarios, prop combinations, and composition with `Typography` / `Hint`; this page keeps the contract (rules + API tables) authoritative.

## Rules

- **Controlled:** pass **`value`** and **`onChange`**. **Uncontrolled:** pass **`defaultValue`**, or omit both value props — the effective initial value is **`min`**, clamped to **`[min, max]`**.
- **`min`**, **`max`**, and **`step`** default to **`0`**, **`100`**, and **`1`**; fractional **`step`** values are allowed.
- Displayed value is **clamped** to **`[min, max]`**; non-numeric input updates are ignored.
- With **`label`**, the visible label is associated via **`id`** / **`htmlFor`**. Without **`label`**, set **`aria-label`** (or an external accessible name) so assistive technologies get a proper name.
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
