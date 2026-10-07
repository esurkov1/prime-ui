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
└─ control
   ├─ <input type="range">   transparent, on top: pointer, keyboard, a11y
   ├─ track                  inactive pill (`aria-hidden`)
   │  └─ range               active pill, rounded end at the thumb centre
   └─ thumb                  capsule (`aria-hidden`)
```
Single part: everything is configured by `Slider.Root` props. The native input's thumb has the
same size as the visual thumb, so the hit area always matches what is drawn.

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
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier: track, thumb and the label row scale together. |
| `tone` | `"accent" \| "neutral" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Color of the filled range. |
| `disabled` | `boolean` | — | Disables the input; mutes track, fill and value. |
| `aria-label` | `string` | — | Accessible name when there is no visible `label`. |
| `className` | `string` | — | Class on the root `div`. |

No other native props, no `name`, no ref forwarding.

## Variants
No `variant`/`color`. Axes: `size`, `tone`, `showValue` (visual flag).

### size
Everything derives from the tier track thickness T (`--prime-control-<tier>-track`, shared with
ProgressBar): the thumb is a 4.5T × 3T capsule, so the control scales as one shape.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 4px track, 18×12 thumb, 12/16 label | dense filter panels | |
| `s` | 5px track, 22.5×15 thumb, 12/16 label | compact side panels | |
| `m` | 6px track, 27×18 thumb, 13/20 label | regular forms and settings | yes |
| `l` | 7px track, 31.5×21 thumb, 14/20 label | spacious settings pages | |
| `xl` | 8px track, 36×24 thumb, 14/20 label | touch-first screens | |

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | `accent-default` fill | any regular setting | yes |
| `neutral` | `text-secondary` fill | monochrome screens, editors, media controls | |
| `success` | `success-default` fill | a value that means "safe / good" (minimum charge) | |
| `warning` | `warning-default` fill | a warning threshold | |
| `danger` | `danger-default` fill | a blocking or destructive threshold | |
| `info` | `info-default` fill | informational settings next to info UI | |

Tone never carries meaning alone: the label names what the value means.

### showValue
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | no readout; the header shows only the label | the position is self-explanatory (volume) or the value is shown elsewhere (a paired input) | yes |
| `true` | value at the right end of the label row, `text-secondary`, tabular nums | the number matters (price, temperature, percent) | |

**Combinations**
- `showValue` + `formatValue` for any value with a unit; `formatValue` alone only changes `aria-valuetext`.
- Neither `label` nor `aria-label` → forbidden (unnamed control).
- A paired number input with `showValue` → redundant; drop `showValue`.

**Sizes** — the root is always 100% wide; the tier changes the track, the thumb (proportionally) and the label/value text. Use the same tier as the other fields of the form.

**Hierarchy** — sliders in a settings card are spaced `--prime-space-6`; a related switch can disable a slider (see [display-settings.tsx](examples/display-settings.tsx)).

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| default | — | `data-size`, `data-tone` | track `fill-strong`, tone pill up to the thumb centre, opaque `control-thumb` capsule with `shadow-thumb` |
| hover | pointer | — | light liquid glass: thumb grows to 110%, turns translucent and slightly frosted, one bright outer edge |
| active | dragging | — | clear glass: thumb grows to 125%, mostly transparent, the rounded end of the range shows through |
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
| [tones.tsx](examples/tones.tsx) | Every `tone` | Picking the fill color |
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
- `tone="danger"` as decoration → keep `accent`; semantic tones only when the value means risk or a limit.
- `value={[20, 80]}` for a range → only a single number is supported.
- Expecting it to submit in a form → there is no `name`; keep the value in state and submit it yourself.

## Related
[Input](../input/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md) · [Switch](../switch/COMPONENT.md) · [Label](../label/COMPONENT.md)
