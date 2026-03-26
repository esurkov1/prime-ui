# ProgressCircle

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

Circular progress indicator: an SVG ring with `progressbar` semantics and optional centered content inside the ring.

- **Use** when you need a compact fraction of a known maximum (percent, steps, seats vs capacity) in a round layout.
- **Use** with **`max`** when the scale is not 0–100 (e.g. 12 months, 60 seats).
- **Use** **`children`** for a short label or number in the center when it should match the visual focus of the ring.
- **Do not use** for indeterminate or endless loading without a numeric fraction; there is no indeterminate mode in the API.
- **Do not use** as the primary focus target or form control; the SVG is informational and not keyboard-focusable.
- **Do not use** expecting a polymorphic root or `asChild`; the implementation is a fixed wrapper with SVG plus optional inner slot.

## Composition

- **`ProgressCircle`** exposes **`Root`** only (`ProgressCircle.Root`).
- **`ProgressCircle.Root`** — root `div` (`inline-flex`), sets **`data-size`** and a CSS variable for the inner slot size.
- **SVG** — **`role="progressbar"`** with track and fill circles; fill length follows **`value`** / **`max`**.
- **Optional `children`** — when present, rendered in an inner container centered over the ring; omit when the ring alone is enough.

### Minimal example

```tsx
import { ProgressCircle } from "prime-ui-kit";

export function Example() {
  return <ProgressCircle.Root value={40} />;
}
```

## Rules

- Progress is **always driven by props**: pass **`value`** on each render; there is no internal stored progress state.
- **`value`** is clamped to **`[0, max]`**; negative values become `0`, values above **`max`** become **`max`**.
- If **`max <= 0`**, the implementation uses **`100`** as the scale to avoid division by zero.
- Set **`label`** when the SVG needs an accessible name and the center has no suitable visible text (it maps to **`aria-label`** on the SVG).
- The SVG exposes **`aria-valuenow`**, **`aria-valuemin={0}`**, and **`aria-valuemax`** equal to the effective maximum.
- There are no **`disabled`**, **`loading`**, or **`error`** props; reflect those with surrounding UI or by freezing **`value`** updates.
- Root is **`inline-flex`** and does not stretch to full width; place it inside your own flex or grid layout when aligning with other content.
- One visual style only; scale appearance with **`size`** (`s`–`xl` from progress-circle primitives).

## API

### ProgressCircle.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| value | `number` | — | Yes | Current value; clamped to `[0, max]` |
| max | `number` | `100` | No | Upper bound; if `max <= 0`, `100` is used |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Diameter and stroke width from `progressCircle` primitives |
| label | `string` | — | No | Accessible name for the SVG (`aria-label`) |
| children | `React.ReactNode` | — | No | Centered content inside the ring |
| className | `string` | — | No | Extra class on the root `div` |
| ref | `React.Ref<HTMLDivElement>` | — | No | Ref on the root `div` |

## Related

- [ProgressBar](../progress-bar/COMPONENT.md) — linear fraction of a maximum when a horizontal bar fits better.
- [Typography](../typography/COMPONENT.md) — captions and units beside or around the ring.
- [Button](../button/COMPONENT.md) — cancel, retry, or other actions next to a long-running task.
