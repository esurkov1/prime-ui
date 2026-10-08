# Slider

**Category:** selection
**Kind:** control

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
Slider                 field frame (FieldFrame): className, ref, rest
├─ label row (only with `label` or `showValue`)
│  ├─ Label            from `label`, linked to the input; `required` / `optional` markers
│  └─ <output>         from `showValue`, formatted value
├─ control
│  ├─ <input type="range">   transparent, on top: pointer, keyboard, a11y; `id`, `aria-label`
│  ├─ track · fill            visual, aria-hidden
│  └─ thumb                   visual, aria-hidden
└─ support row         `hint` | `error` (same slot)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Slider
`ref` → `HTMLDivElement` (the field frame). A framed field like every other: the label row with the value, a native `<input type="range">` (transparent, on top) over the visual track, fill and thumb, then the hint or the error. Field-root rule: `className`, `ref` and the rest go to the frame; `id` and `aria-label` to the range input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — | Controlled value; clamped to `min`…`max`. |
| `defaultValue` | `number` | `min` | Initial value when uncontrolled. |
| `onValueChange` | `(value: number) => void` | — | Called with the new number while dragging and on every key step. |
| `min` | `number` | `0` | Lower bound. |
| `max` | `number` | `100` | Upper bound. |
| `step` | `number` | `1` | Step of the keyboard and of the snapping; fractions allowed. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Tier of the track thickness T (thumb 4.5T × 3T), the label, the value and the hint. Without it the tier of its host (a form, a panel), else `m`. |
| `tone` | `"neutral" \| "accent" \| "success" \| "warning" \| "danger" \| "info"` | `"accent"` | Color of the filled part of the track. |
| `disabled` | `boolean` | — | Muted track and thumb, dimmed label and value, no interaction. |
| `label` | `ReactNode` | — | Visible label linked to the range input (`<label htmlFor>`). Without it, set `aria-label`. |
| `required` | `boolean` | — | Red `*` after the label (`aria-hidden`); a range always has a value, so there is no native `required`. |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the track (`aria-describedby`). Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | — | `aria-invalid` on the range input and a danger focus ring on the thumb. A non-empty `error` implies it. |
| `showValue` | `boolean` | `false` | Shows the current value at the end of the label row (tabular numbers, `aria-hidden` — the input announces it). |
| `formatValue` | `(value: number) => string` | — | Formats the shown value and `aria-valuetext` (units, currency). |
| `id` | `string` | — | Id of the range input (generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-label` | `string` | — | Accessible name when there is no visible `label`. |
| `aria-describedby` | `string` | — | Merged before the hint / error ids on the range input. |
| `labels` | `Partial<SliderLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `style` and the other attributes of the field frame `<div>`. |

## Variants
No `variant` / `color`.

### size
Everything derives from the tier track thickness T (`--prime-control-<tier>-track`, shared with ProgressBar): the thumb is a 4.5T × 3T capsule, so the control scales as one shape.

| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 4px track, 18×12 thumb, 12/16 label | dense filter panels | |
| `s` | 5px track, 22.5×15 thumb, 12/16 label | compact side panels | |
| `m` | 6px track, 27×18 thumb, 13/20 label | regular forms and settings | yes |
| `l` | 7px track, 31.5×21 thumb, 14/20 label | spacious settings pages | |
| `xl` | 8px track, 36×24 thumb, 14/20 label | touch-first screens | |

**Sizes:** the slider fills its container and never gets narrower than 192px (like a native range); the tier changes the track, the thumb and the label / value text. Use the same tier as the other fields of the form.

### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `accent` | `accent-default` fill | any regular setting | yes |
| `neutral` | `text-secondary` fill | monochrome screens, editors, media controls | |
| `success` | `success-default` fill | a value that means «safe / good» (minimum charge) | |
| `warning` | `warning-default` fill | a warning threshold | |
| `danger` | `danger-default` fill | a blocking or destructive threshold | |
| `info` | `info-default` fill | informational settings next to info UI | |

Tone never carries meaning alone: the label names what the value means.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `showValue` | the value at the right end of the label row, `text-secondary`, tabular nums | the number matters (price, temperature, percent) | `false` |
| `disabled` | muted track, flat thumb, dimmed label and value | the setting is unavailable | — |

**Combinations**
- `showValue` + `formatValue` for any value with a unit; `formatValue` alone only changes `aria-valuetext`.
- Neither `label` nor `aria-label` → forbidden (unnamed control).
- A paired number input with `showValue` → redundant; drop `showValue`.

## States
| State | Driven by | DOM |
|---|---|---|
| default | — | `data-size`, `data-tone`; track `fill-strong`, tone pill up to the thumb centre, opaque thumb |
| hover | pointer (fine pointers only) | light liquid glass: the thumb grows to 110%, turns translucent and slightly frosted |
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"` on the root, `aria-invalid` on the input; the error replaces the hint, danger focus ring; the control shakes once when an error arrives (`data-shake` on the frame) |
| pressed | dragging | clear glass: the thumb grows to 125%, the rounded end of the fill shows through |
| focus-visible | keyboard | outer focus ring around the thumb |
| disabled | `disabled` | `data-disabled="true"` on the root, native `disabled`; muted track and fill, flat thumb, `cursor: not-allowed` |

Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue` (falls back to `min`).

## Layout & spacing
- Fills its container; place it in a grid column to limit the width.
- Label row → track: tier `label-gap`; label and value share a baseline, the value is pinned right. Track → hint / error: tier `hint-gap` (FieldFrame, like every field).
- Between sliders in a form: `--prime-space-5`.
- With a paired input: grid `minmax(0, 1fr)` + a fixed column, `align-items: end`, gap `--prime-space-4`.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowRight` · `ArrowUp` | Increases the value by `step`. |
| `ArrowLeft` · `ArrowDown` | Decreases the value by `step`. |
| `PageUp` · `PageDown` | Changes the value by a larger step. |
| `Home` · `End` | Jumps to `min` / `max`. |

### ARIA
- A native `<input type="range">` (`role="slider"`) on top of the visual layer.
- `label` is a `<label htmlFor>`; otherwise `aria-label` is required.
- `formatValue` sets `aria-valuetext`, so screen readers announce the unit; the visual `<output>` is `aria-hidden`.
- `aria-describedby` on the input: your ids + the hint or the error; `aria-invalid` when invalid.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled slider with its current value — `label`, `showValue`. |
| [variants.tsx](examples/variants.tsx) | Every fill color; accent by default, semantic tones when the value carries meaning — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size; the thumb, the label and the value grow with the tier — `size`. |
| [states.tsx](examples/states.tsx) | The fill at both ends and a disabled slider — `disabled`. |
| [value-format.tsx](examples/value-format.tsx) | Units in the shown value that are also read by screen readers — `formatValue`, `showValue`. |
| [range-step.tsx](examples/range-step.tsx) | Own bounds and a coarse or fractional step; a slider without a visible label — `min`, `max`, `step`, `aria-label`. |
| [hint-and-error.tsx](examples/hint-and-error.tsx) | A slider framed like every field: required marker, a hint, and an error in its place — `required`, `hint`, `error`, `optional`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value and shares it with a number field for exact entry — `value`, `onValueChange`. |

## Mistakes
- `<Slider.Root>` → the slider is a single export: `<Slider />`.
- A slider for an exact amount → use `Input type="number"`.
- `tone="danger"` as the only signal of a dangerous value → say it in the label.
- No `label` and no `aria-label` → the control has no name.

## Related
- **Built from:** the field frame — [Label](../label/COMPONENT.md) (`label`) and [Hint](../hint/COMPONENT.md) (`hint`, `error`)
- **See also:** [ProgressBar](../progress-bar/COMPONENT.md) (the same track scale), [Input](../input/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
