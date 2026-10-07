# Slider

**Category:** selection

> A slider for picking an approximate numeric value within a range, with an optional label and value readout.

## When to use
- An approximate value where the position matters more than the exact number: volume, brightness, opacity, a price ceiling.
- A bounded numeric setting with a coarse `step` (25%, 0.5 stars).
- Next to a number input when users need both dragging and exact entry (controlled, shared state).

## When not to use
- An exact number that users type (quantity, amount) → use [Input](../input/COMPONENT.md) with `type="number"` instead.
- One of a few named levels (low / medium / high) → use [SegmentedControl](../segmented-control/COMPONENT.md) or [Radio](../radio/COMPONENT.md) instead.
- A two-handle range (from–to) → not supported; use two inputs.
- On/off → use [Switch](../switch/COMPONENT.md) instead.

## Import
```tsx
import { Slider } from "prime-ui-kit";
```

## Anatomy
```
Slider.Root
├─ header row (only with `label` or `showValue`)
│  ├─ Label            from `label`, linked to the input
│  └─ <output>         from `showValue`, formatted value
└─ <input type="range">
```
Single part: everything is configured by `Slider.Root` props.

## API

### Slider.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled value (clamped to `[min, max]`); use with `onValueChange`. |
| `defaultValue` | `number` | `min` | Initial value in uncontrolled mode (clamped). |
| `onValueChange` | `(value: number) => void` | — | Called on every thumb move. |
| `min` | `number` | `0` | Lower bound. |
| `max` | `number` | `100` | Upper bound. |
| `step` | `number` | `1` | Step of the native range; fractional steps work. |
| `label` | `ReactNode` | — | Visible label (`Label`), linked to the input via `htmlFor`. Without it, pass `aria-label`. |
| `showValue` | `boolean` | `false` | Shows the current value at the end of the label row (tabular numbers). |
| `formatValue` | `(value: number) => string` | — | Formats the shown value and sets `aria-valuetext` (e.g. `` (v) => `${v} °C` ``). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier of the thumb and the label row. |
| `disabled` | `boolean` | — | Disables the input; mutes track, fill and value. |
| `aria-label` | `string` | — | Accessible name when there is no visible `label`. |
| `className` | `string` | — | Class on the root `div`. |

No other native props, no `name`, no ref forwarding.

## Variants
No `variant`/`tone`/`color`. Axes: `size`, `showValue` (visual flag).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 14px thumb, 4px track, 12/16 label | dense filter panels | |
| `s` | 16px thumb, 4px track, 12/16 label | compact side panels | |
| `m` | 18px thumb, 4px track, 13/20 label | regular forms and settings | yes |
| `l` | 20px thumb, 4px track, 14/20 label | spacious settings pages | |
| `xl` | 24px thumb, 8px track, 14/20 label | touch-first screens | |

### showValue
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | no readout; the header shows only the label | the position is self-explanatory (volume) or the value is shown elsewhere (a paired input) | yes |
| `true` | value at the right end of the label row, `text-secondary`, tabular nums | the number matters (price, temperature, percent) | |

**Combinations**
- `showValue` + `formatValue` for any value with a unit; `formatValue` alone only changes `aria-valuetext`.
- Neither `label` nor `aria-label` → forbidden (unnamed control).
- A paired number input with `showValue` → redundant; drop `showValue`.

**Sizes** — the root is always 100% wide; the tier changes only the thumb, label/value text and (at `xl`) the track thickness. Use the same tier as the other fields of the form.

**Hierarchy** — sliders in a settings card are spaced `--prime-space-6`; a related switch can disable a slider (see [display-settings.tsx](examples/display-settings.tsx)).

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| default | — | `data-size` | track `fill-strong`, fill `accent-default` up to the value, thumb `control-thumb` with a hairline edge and `shadow-overlay` |
| hover | pointer | — | soft `accent-soft` halo (4px) around the thumb |
| active | dragging | — | thumb scales to 110% |
| focus-visible | keyboard | — | outer focus ring around the thumb |
| disabled | `disabled` | `data-disabled="true"` on root, native `disabled` | track `fill-muted`, fill `text-disabled`, flat thumb `fill-strong`, value `text-disabled`, `cursor: not-allowed` |

Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue` (falls back to `min`).

## Layout & spacing
- Always full width of its container; place it in a grid column to limit width.
- Label row → track: tier `label-gap`; label and value are on one baseline, value pinned right.
- Between sliders in a form: `--prime-space-5`; in a settings card: `--prime-space-6`.
- With a paired input: grid `minmax(0, 1fr) auto-width column`, `align-items: end`, gap `--prime-space-4`.

## Accessibility
- Native `<input type="range">`: Arrow keys change by `step`, Page Up / Page Down by a larger step, Home / End jump to the ends.
- `label` is a `<label htmlFor>`; otherwise `aria-label` is required.
- `formatValue` sets `aria-valuetext`, so screen readers announce the unit.
- The visual `<output>` is `aria-hidden` (the value is announced by the input).
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All size tiers with label and value | Matching the form tier |
| [states.tsx](examples/states.tsx) | Minimum, middle, maximum, disabled | Reference for fill and disabled |
| [value-format.tsx](examples/value-format.tsx) | `showValue` + `formatValue` (°C, ₽, %) | Values with units |
| [basic.tsx](examples/basic.tsx) | One labelled slider with value | Checking contrast on any surface |
| [controlled.tsx](examples/controlled.tsx) | `value` + `onValueChange` shared with a number Input | Drag plus exact entry |
| [range-step.tsx](examples/range-step.tsx) | Custom `min`/`max`/`step`, fractional step, `aria-label` only | Bounded settings |
| [display-settings.tsx](examples/display-settings.tsx) | Card with sliders and a Switch that disables one | Settings panels |

```tsx
import { Slider } from "prime-ui-kit";

export function VolumeSlider() {
  return <Slider.Root label="Громкость" showValue defaultValue={60} />;
}
```

## Mistakes
- `<Slider.Root onChange={…}>` → use `onValueChange`.
- `formatValue` without `showValue` expecting a visible unit → add `showValue`.
- No `label` and no `aria-label` → add one.
- `value={[20, 80]}` for a range → only a single number is supported.
- Expecting it to submit in a form → there is no `name`; keep the value in state and submit it yourself.

## Related
[Input](../input/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md) · [Switch](../switch/COMPONENT.md) · [Label](../label/COMPONENT.md)
