# ProgressBar

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A horizontal completion indicator built on the native `progress` element: fill is driven by `value` and `max`, with optional text label and `size` for track density.

- **Use** for determinate tasks—uploads, downloads, or any operation where progress maps to a numeric range.
- **Use** in multi-step flows when the user should see how far they are through a bounded sequence (steps, checklist, wizard).
- **Use** with a `label` when the bar needs a short visible name tied to the meter for assistive tech.
- **Do not use** for indeterminate or endless “busy” feedback; this API always requires a numeric `value` (use a spinner or another pattern instead).
- **Do not use** for vertical or circular meters; the track is horizontal only—for a circular indicator in the kit, see Related.
- **Do not use** expecting extra native attributes on the inner `progress`; they are not forwarded—wrap the component if you need custom markup.

## Composition

- **`ProgressBar`** is a single-part namespace: only **`ProgressBar.Root`** is public.
- **`ProgressBar.Root`** renders a wrapper `div` with `data-size`, an optional **`label`** as a `span` with a generated `id`, and a native **`<progress>`** for the track. The bar spans the full width of its container.

### Minimal example

```tsx
import { ProgressBar } from "prime-ui-kit";

export function Example() {
  return <ProgressBar.Root value={40} max={100} />;
}
```

## Rules

- **`value`** is required and clamped to **`[0, max]`**; negative values become `0`, values above `max` become `max`.
- **`max`** defaults to **`100`**; if **`max <= 0`**, the implementation uses **`100`** as the effective maximum.
- **`size`** defaults to **`m`**; allowed values are **`s`**, **`m`**, **`l`**, **`xl`** (`ProgressBarSize`).
- There is no **`disabled`**, **`loading`**, or **`error`** prop—mute or hide the block at the screen level if needed.
- Native **`progress`** exposes the **`progressbar`** role with **`value`** / **`max`** to the accessibility tree; with **`label`**, **`aria-labelledby`** points at the label element.
- The bar is not interactive and is not keyboard-focusable; keep focus on real controls nearby.
- “Controlled” usage is just React state passed into **`value`**; there is no separate uncontrolled mode with an internal store.

## API

### ProgressBar.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `number` | — | Yes | Current value; clamped to `[0, max]` after `max` is normalized. |
| `max` | `number` | `100` | No | Upper bound; if `max <= 0`, `100` is used. |
| `label` | `string` | — | No | Text above the track; when set, the progress element gets `aria-labelledby` referencing the label. |
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Track height and label typography scale. |
| `className` | `string` | — | No | Class on the outer wrapper around the label and `progress`. |
| `ref` | `React.Ref<HTMLProgressElement>` | — | No | Ref to the native `progress` element. |

## Related

- [ProgressCircle](../progress-circle/COMPONENT.md) — circular determinate indicator when layout calls for a ring or compact numeric emphasis.
- [Typography](../typography/COMPONENT.md) — headings and supporting copy around a status block.
- [Button](../button/COMPONENT.md) — cancel, pause, or actions next to the bar.
