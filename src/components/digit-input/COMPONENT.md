# DigitInput

**Category:** inputs

> A row of square single-digit cells for a fixed-length code (OTP from SMS, PIN, pickup code).

## When to use
- One-time codes from SMS or e-mail, PIN codes, short numeric confirmation codes of a known length.
- When the user benefits from seeing how many digits are left and from pasting the whole code at once.

## When not to use
- Codes with letters or a variable length → use [Input](../input/COMPONENT.md) with `inputMode`/`autoComplete`.
- Numbers with meaning (amounts, quantities) → use [Input](../input/COMPONENT.md) with an inline affix, or [Slider](../slider/COMPONENT.md).
- Passwords → use [Input](../input/COMPONENT.md) with `type="password"`.

## Import
```tsx
import { DigitInput } from "prime-ui-kit";
```

## API

### DigitInput.Root
Leaf component. Renders a `<fieldset>` with one `<input>` per digit. No ref forwarding, no native props passthrough besides those listed. There is no `label`/`hint`/`error` prop: place [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) next to it and link the hint with `aria-describedby`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | `4` | Number of cells. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Cell side = control height of the tier; gap = tier gap. |
| `value` | `string` | — | Controlled value; non-digits are dropped, cut to `length`. |
| `defaultValue` | `string` | `""` | Uncontrolled initial value (normalized the same way). |
| `onValueChange` | `(value: string) => void` | — | Called with the joined digit string on every change. |
| `onComplete` | `(value: string) => void` | — | Called once when the last empty cell gets filled. |
| `disabled` | `boolean` | — | Disables the fieldset and every cell. |
| `invalid` | `boolean` | — | Danger ring and danger digits on every cell, `aria-invalid` on cells. |
| `focusRing` | `boolean` | `true` | `false` sets `data-focus-ring="false"` on the fieldset and hides only the visual ring of the focused cell; focus, keyboard, ARIA and the invalid ring stay. |
| `aria-describedby` | `string` | — | Id(s) of the hint / error text describing the group. |
| `labels` | `Partial<DigitInputLabels>` | see Accessibility | Accessible names of the group and the cells. |
| `className` | `string` | — | Class on the `<fieldset>`. |

## Variants
No `variant` or `tone`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 × 28 cells, radius 6, digits 12/16, gap 4 | Inline confirmation inside dense tables or popovers | |
| `s` | 32 × 32 cells, radius 8, digits 14/20, gap 8 | Compact dialogs | |
| `m` | 36 × 36 cells, radius 8, digits 16/24, gap 8 | Regular forms and modals | yes |
| `l` | 40 × 40 cells, radius 10, digits 18/24, gap 8 | Standalone verification screens | |
| `xl` | 48 × 48 cells, radius 12, digits 20/28, gap 12 | Full-page sign-in, mobile-first screens | |

Digits are semibold and tabular; on `s`–`xl` they are one type step larger than the tier text, on `xs` they use the `xs` tier text (12/16). **Sizes:** a cell of size T is as high as Input and Button of size T, so the code and its submit button line up in one row.

### invalid
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` / unset | Field fill, primary digits | Normal entry | yes |
| `true` | Danger inset ring on every cell, danger digits, danger focus ring | The code was rejected; pair with an error Hint | |

**Combinations**
- Recommended: `invalid` + `Hint.Root invalid` linked via `aria-describedby`; reset `invalid` in `onValueChange` when the user edits.
- Pointless: `invalid` together with `disabled` (disabled look wins); `length` larger than the real code.
- Forbidden: `focusRing={false}` without another focus indicator (WCAG 2.4.7).

## States
| State | Driven by | DOM |
|---|---|---|
| hover | — | cell fill darkens (not on focused or disabled cells) |
| focus | keyboard / click | focused cell: focus fill + inset focus ring; its content is selected so a new digit replaces it |
| filled cell | a digit in the cell | `data-filled="true"` on the cell |
| invalid | `invalid` | `data-invalid="true"` on the fieldset, `aria-invalid="true"` on cells |
| disabled | `disabled` | `data-disabled="true"` and native `disabled` on the fieldset, every cell disabled |
| no focus ring | `focusRing={false}` | `data-focus-ring="false"` on the fieldset |

`data-size` is set on the fieldset and every cell. Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue` (+ `onValueChange` to observe).

## Layout & spacing
- Cells are centered and wrap if the row does not fit.
- Label → code: `--prime-space-2`; code → hint: `--prime-space-1`–`--prime-space-2` (foundation proximity).
- Put the submit button below or next to the code; with the same `size` it lines up with the cells.

## Accessibility
- The fieldset is named by `labels.group`; set it to the visible label text (e.g. "Код из SMS").
- Each cell has its own name from `labels.cell` and `inputMode="numeric"`, `autoComplete="one-time-code"`, `maxLength={1}`.
- Keyboard: a digit moves focus to the next cell; Backspace in an empty cell moves back; ← / → move between cells without editing; paste fills consecutive cells from the current one and drops non-digits.

| `labels` key | Default | Used for |
|---|---|---|
| `group` | `"Код"` | Accessible name of the fieldset |
| `cell` | `"Цифра {index} из {length}"` | Accessible name of each cell; `{index}` (1-based) and `{length}` are replaced |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` side by side | Picking a size |
| [states.tsx](examples/states.tsx) | Empty, partial, filled, `invalid`, `disabled` | Checking all states |
| [surfaces.tsx](examples/surfaces.tsx) | Cells following the surface fill | Code fields in cards and popovers |
| [controlled.tsx](examples/controlled.tsx) | `value` + `onValueChange` with a reset button | Clearing or validating from outside |
| [length-and-complete.tsx](examples/length-and-complete.tsx) | `length={6}`, `onComplete`, keyboard and paste | Auto-submit when complete |
| [verification-step.tsx](examples/verification-step.tsx) | Sign-in confirmation card with Label, Hint/error, resend and submit | Full OTP screen |

```tsx
import { DigitInput } from "prime-ui-kit";

export function SmsCode() {
  return <DigitInput.Root length={6} labels={{ group: "Код из SMS" }} onComplete={console.log} />;
}
```

## Mistakes
- `<DigitInput.Root label="Код" />` → there is no `label` prop; render `Label.Root` next to it and set `labels.group`.
- Showing the error only by color → add a `Hint.Root invalid` with text and link it via `aria-describedby`.
- Keeping `invalid` after the user starts editing → clear it in `onValueChange`.
- Expecting letters to be accepted → only digits are kept; use Input for alphanumeric codes.

## Related
- [Input](../input/COMPONENT.md) — free-form single-line values.
- [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — label and message around the code.
