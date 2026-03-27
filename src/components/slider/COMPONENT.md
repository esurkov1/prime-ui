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
    <Slider.Root label="Output level" min={0} max={100} step={1} defaultValue={50} />
  );
}
```

### Playground-aligned examples

**`playground/sections/SliderSection.tsx`** and **`playground/snippets/slider/`** define the demo order and code shown in the playground (Russian UI copy in snippets). Matching runnable package examples (imports from **`"prime-ui-kit"`**) live next to this file:

| Playground block | Snippet | Example file |
|------------------|---------|--------------|
| Sizes | `sizes.tsx` | `sizes.tsx` |
| States | `states.tsx` | `states.tsx` |
| Controlled | `controlled.tsx` | `controlled.tsx` |
| Composition | `composition.tsx` | `composition.tsx` |
| Full width | `full-width.tsx` | `full-width.tsx` |
| Features (range / step) | `features.tsx` | `features.tsx` |

Shared layout for controlled and full-width demos: **`examples/examples.module.css`**.

**LLM note:** Prefer reading the runnable files under `./examples/*.tsx` for full scenarios and prop combinations; this page keeps the contract (rules + API tables) authoritative.

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
| value | `number` | — | No | Controlled value; use with **`onChange`** for external state |
| defaultValue | `number` | — | No | Initial value when uncontrolled; clamped to **`[min, max]`**; if omitted, the internal initial value is **`min`** |
| min | `number` | `0` | No | Minimum for the native `type="range"` |
| max | `number` | `100` | No | Maximum for the native `type="range"` |
| step | `number` | `1` | No | Step increment (may be fractional) |
| disabled | `boolean` | — | No | Blocks input and lowers track opacity |
| onChange | `(value: number) => void` | — | No | Fires when the value changes after user input (pointer, touch, or native range keys) |
| label | `string` | — | No | Text above the track; creates an associated **`label`** with **`htmlFor`** on the input |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height, thumb, and label type scale from one control token tier |
| className | `string` | — | No | Extra class on the root container |
| aria-label | `string` | — | No | Accessible name when there is no visible **`label`** |

## Related

- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
- [DigitInput](../digit-input/COMPONENT.md)
