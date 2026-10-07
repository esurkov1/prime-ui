# Switch

**Category:** selection

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
Switch.Root          wrapper grid + context; ref and input props go to the hidden native input
├─ Switch.Label      clickable row: renders the native input (role="switch"), the track and the text
├─ Switch.Hint       description under the text column (optional)
└─ Switch.Error      error message under the text column (optional, makes the field invalid)
```
The native input is rendered inside `Switch.Label`, so `Switch.Label` is required even without visible text.

## API

### Switch.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled on/off state; use with `onCheckedChange`. |
| `defaultChecked` | `boolean` | `false` | Initial state in uncontrolled mode. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state on click or Space. |
| `invalid` | `boolean` | `false` | Invalid look and `aria-invalid`; also set while `Switch.Error` is mounted. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier of the track, thumb, gap and label text. |
| `fullWidth` | `boolean` | `false` | Stretch to the container width; by default the field is as wide as its content. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `readOnly` | `boolean` | `false` | State is visible but cannot change; no hover, `aria-readonly` on the input. |
| `id` | `string` | auto (`useId`) | Id of the native input; hint/error ids derive from it. |
| `aria-describedby` | `string` | — | Extra description ids; merged with the mounted hint and error ids. |
| `className` | `string` | — | Class on the wrapper `div`. |
| `children` | `ReactNode` | — | `Switch.Label`, `Switch.Hint`, `Switch.Error`. |

+ native `<input>` props except `type`, `size`, `checked`, `defaultChecked`, `onChange`, `children` (`name`, `value`, `required`, `aria-label`, `aria-labelledby`, …) — applied to the hidden native input.
Ref: `forwardRef` → `HTMLInputElement`. No `asChild`.

### Switch.Label
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Text to the right of the track. Empty → only the track; then name the switch via `aria-label` / `aria-labelledby` on `Switch.Root`. |
| `className` | `string` | — | Class on the `<label>` row. |

+ native `<label>` HTML attributes except `htmlFor` and `size`. Ref: `forwardRef` → `HTMLLabelElement`.

### Switch.Hint
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Description under the text column; added to `aria-describedby`. |
| `className` | `string` | — | Class on the `<p>`. |

+ native `<p>` props except `id`. No ref.

### Switch.Error
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Error text in `danger-text`; while mounted the field is invalid. |
| `className` | `string` | — | Class on the `<p>`. |

+ native `<p>` props except `id`. No ref.

## Variants
No `variant`/`tone`/`color`. Axes: `size`, `fullWidth`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | track 24×16, thumb 12, 4px gap, 12/16 text | dense tables and toolbars | |
| `s` | track 28×16, thumb 12, 8px gap, 13/20 text | compact settings lists | |
| `m` | track 32×20, thumb 16, 8px gap, 14/20 text | regular settings and forms | yes |
| `l` | track 36×20, thumb 16, 8px gap, 16/24 text | spacious settings pages | |
| `xl` | track 44×24, thumb 20, 12px gap, 16/24 text | touch-first screens | |

### fullWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | field shrinks to its content | most cases | yes |
| `true` | field stretches to 100% of the container | the row must fill a grid cell | |

**Combinations**
- `readOnly` vs `disabled`: `readOnly` keeps the normal colours (the value is meaningful, someone else controls it); `disabled` mutes the track (the setting is unavailable). Do not combine them.
- `invalid` together with `Switch.Error` is redundant; mount `Switch.Error` alone.

**Sizes** — the track is centred on the first text line; label text follows the tier (12 · 13 · 14 · 16 · 16). Use the same tier as the neighbouring Checkbox/Radio/inputs.

**Hierarchy** — a master switch sits above its dependants and drives their `disabled` (see [notification-settings.tsx](examples/notification-settings.tsx)).

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| off | `checked={false}` / default | `data-state="unchecked"` | track `fill-strong` (hover `fill-strong-hover`), thumb at the start |
| on | `checked` / `defaultChecked` | `data-state="checked"` | track `accent-default` (hover `accent-hover`), thumb slides to the end |
| invalid | `invalid` or mounted `Switch.Error` | `data-invalid="true"`, `aria-invalid` | off track gets a `danger-border` inset ring; focus ring `danger-border` |
| disabled | `disabled` | `data-disabled="true"` | off track `fill-muted`, on track `accent-soft`, thumb without shadow, `cursor: not-allowed` |
| read-only | `readOnly` | `aria-readonly="true"` on the input | normal colours, no hover, default cursor, clicks ignored |
| focus-visible | keyboard | — | outer focus ring around the track |

Root also carries `data-size` and `data-full-width="true"` when `fullWidth`.
Controlled: `checked` + `onCheckedChange`. Uncontrolled: `defaultChecked`. No native `onChange` prop.

## Layout & spacing
- Grid `[track][text]`; hint and error sit under the text column.
- Switches in a settings list: gap `--prime-space-5` (20px) between fields.
- Settings row (text left, switch right): flex row with `justify-content: space-between`, gap `--prime-space-4`; `Switch.Label` without children and `aria-labelledby` / `aria-describedby` pointing at the row text.
- In a form, a `name`d switch submits `"on"` when checked (native checkbox semantics).

## Accessibility
- Native `<input type="checkbox" role="switch">` with `aria-checked`, visually hidden, associated with the `<label>`.
- Keyboard: Tab focuses, Space toggles.
- `aria-invalid`, `aria-readonly`, `aria-describedby` (your ids + hint + error) are set on the input.
- Without visible text, name it with `aria-label` or `aria-labelledby` on `Switch.Root`.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All size tiers | Choosing the tier next to other controls |
| [validation.tsx](examples/validation.tsx) | Hint vs `Switch.Error` | A switch that must be on to continue |
| [states.tsx](examples/states.tsx) | Off, on, disabled, read-only, invalid | Reference for every state |
| [on-off.tsx](examples/on-off.tsx) | Off and on switch | Checking contrast on canvas, cards, overlays |
| [controlled.tsx](examples/controlled.tsx) | `checked` + `onCheckedChange` | Other UI depends on the switch |
| [in-form.tsx](examples/in-form.tsx) | `name`, `required`, `aria-label` in a form | Form semantics of Switch; prefer Checkbox when the value applies only after submit |
| [settings-row.tsx](examples/settings-row.tsx) | Text left, track right, `aria-labelledby` | Settings lists |
| [notification-settings.tsx](examples/notification-settings.tsx) | Master switch disabling dependants in a Card | Dependent settings |

```tsx
import { Switch } from "prime-ui-kit";

export function BackupSwitch() {
  return (
    <Switch.Root name="backup" defaultChecked>
      <Switch.Label>Резервное копирование</Switch.Label>
      <Switch.Hint>Каждую ночь в 03:00.</Switch.Hint>
    </Switch.Root>
  );
}
```

## Mistakes
- `<Switch.Root onChange={…}>` → use `onCheckedChange`.
- Switch for an option that is saved by a «Сохранить» button → use `Checkbox`.
- `disabled` for a value managed by an admin → use `readOnly` so the state stays readable.
- `<Switch.Root aria-label="…">` without `Switch.Label` → the input is rendered by `Switch.Label`; keep `<Switch.Label />` even when empty.

## Related
[Checkbox](../checkbox/COMPONENT.md) · [Radio](../radio/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md)
