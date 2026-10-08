# Switch

**Category:** selection
**Kind:** control

> An on/off switch for a setting that takes effect immediately.

## When to use
- A single setting that applies at once, without a submit button: notifications, feature flags, preferences.
- A master switch that enables or disables a group of dependent settings.
- A settings row with the text on the left and the track on the right.

## When not to use
- The value only takes effect after the form is submitted (consent, options in a form) → use [Checkbox](../checkbox/COMPONENT.md) instead.
- One choice out of several options → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) instead.
- A button that toggles a view mode inside a toolbar → use [SegmentedControl](../segmented-control/COMPONENT.md) instead.

## Import
```tsx
import { Switch } from "prime-ui-kit";
```

## Anatomy
```
Switch.Root          field grid; ref and input props go to the native input (role="switch")
├─ <label> row       the native input, the track and the text (rendered by Root)
│  └─ Switch.Label   the visible text (optional)
└─ hint | error      support text under the text column (`hint`, `error`)
```
`<Switch.Root aria-label="…" />` without `Switch.Label` is a valid bare control (settings rows, tables).

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Switch.Root
`ref` → `HTMLInputElement` (the native `input type="checkbox" role="switch"`). Renders the field `<div>`, the `<label>` row with the input and the track, and the support row. Field-root rule for a leaf: `className` goes to the field `<div>`; `id`, `ref` and native input props to the input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled state. |
| `defaultChecked` | `boolean` | `false` | Initial state when uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state on every toggle (not while `readOnly`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Tier of the track (24×16 … 44×24), the text and the gap. Without it the tier of its host (a form, a panel), else `m`. |
| `hint` | `ReactNode` | — | Help text under the label text. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger ring on the off track and `aria-invalid`. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | No toggling; muted track (on = `accent-soft`), dimmed text and hint. |
| `readOnly` | `boolean` | `false` | The state is shown and focusable but does not change (`aria-readonly`); no hover or press. |
| `id` | `string` | — | Id of the input (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `children` | `ReactNode` | — | `Switch.Label`. Without it only the track renders — name it with `aria-label` or `aria-labelledby`. |
| `className` | `string` | — | Class on the field `<div>`. |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange">` | — | `name`, `value`, `required`, `aria-label`, `aria-labelledby`… on the native input. |

### Switch.Label
`ref` → `HTMLSpanElement`. The visible text in the text column of the label row. Native `<span>` props.

## Variants
No `variant` / `tone` / `color`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | track 24×16, thumb 12, 4px gap, 12/16 text | dense tables and toolbars | |
| `s` | track 28×16, thumb 12, 8px gap, 13/20 text | compact settings lists | |
| `m` | track 32×20, thumb 16, 8px gap, 14/20 text | regular settings and forms | yes |
| `l` | track 36×20, thumb 16, 8px gap, 16/24 text | spacious settings pages | |
| `xl` | track 44×24, thumb 20, 12px gap, 16/24 text | touch-first screens | |

**Sizes:** the track is centred on the first text line; the text follows the tier (12 · 13 · 14 · 16 · 16). Use the same tier as the neighbouring Checkbox / Radio / inputs.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `readOnly` | normal colours, no hover or press, clicks ignored | the value is meaningful but someone else controls it | `false` |
| `disabled` | muted track (on = `accent-soft`), dimmed text | the setting is unavailable | `false` |
| `invalid` | danger ring on the off track | the message is shown elsewhere; otherwise pass `error` | `false` |

**Combinations**
- `readOnly` and `disabled` together are pointless — pick one.
- `invalid` together with `error` is redundant; pass `error` alone.
- A master switch sits above its dependants and drives their `disabled`.

## States
| State | Driven by | DOM |
|---|---|---|
| off | `checked={false}` / default | `data-state="unchecked"`; track `fill-strong` (hover `fill-strong-hover`), thumb at the start |
| on | `checked` / `defaultChecked` | `data-state="checked"`; accent track, the thumb glides to the end |
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"`, `aria-invalid`; danger ring on the off track and on focus |
| disabled | `disabled` | `data-disabled="true"`; off track `fill-muted`, on track `accent-soft`, `cursor: not-allowed` |
| read-only | `readOnly` | `aria-readonly="true"` on the input, `data-readonly="true"` on the field; no hover or press, default cursor |
| pressed | pointer press | the track scales to the compact press scale (not when disabled or read-only) |
| focus-visible | keyboard | outer focus ring around the track |

Root also carries `data-size`. Controlled: `checked` + `onCheckedChange`. Uncontrolled: `defaultChecked`. No native `onChange` prop.

## Layout & spacing
- Grid `[track][text]`; hint and error sit under the text column.
- Switches in a settings list: gap `--prime-space-4`–`--prime-space-5` between fields.
- Settings row (text left, switch right): flex row with `justify-content: space-between`, gap `--prime-space-4`; a bare `Switch.Root` with `aria-labelledby` / `aria-describedby` pointing at the row text.
- In a form, a `name`d switch submits `"on"` when checked (native checkbox semantics).

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus to the switch. |
| `Space` | Toggles it (not while `readOnly`). |

### ARIA
- A native `<input type="checkbox" role="switch">` (its native checked state is the switch state), visually hidden over the track and wrapped by the `<label>` row.
- `aria-invalid`, `aria-readonly` and `aria-describedby` (your ids + the hint or the error) are set on the input.
- Without visible text, name it with `aria-label` or `aria-labelledby` on `Switch.Root`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A setting that applies at once, with a hint under its text — `hint`. |
| [sizes.tsx](examples/sizes.tsx) | Every size, track 24×16 to 44×24; the text follows the control tier — `size`. |
| [states.tsx](examples/states.tsx) | Every state side by side, each labelled by its prop — `checked`, `readOnly`, `invalid`, `disabled`. |
| [settings-row.tsx](examples/settings-row.tsx) | A settings row with text on the left and a bare track on the right — `aria-labelledby`, `aria-describedby`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the state and rewrites the hint to match it — `checked`, `onCheckedChange`. |
| [in-form.tsx](examples/in-form.tsx) | Switches submitted with a form: the value goes to FormData by `name`, a required one shows an error — `name`, `required`, `error`. |

## Mistakes
- `<Switch.Root onChange={…}>` → use `onCheckedChange`.
- A switch whose value only applies after «Сохранить» → use `Checkbox`.
- `invalid` plus `error` → pass `error` alone.
- A bare switch without `aria-label` / `aria-labelledby` → it has no accessible name.
- `readOnly` used to block a setting that is unavailable → use `disabled`.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (the row), [Hint](../hint/COMPONENT.md) (`hint`, `error`)
- **See also:** [Checkbox](../checkbox/COMPONENT.md), [Radio](../radio/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
