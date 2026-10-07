# DigitInput

**Category:** inputs
**Kind:** field

> A row of square single-digit cells for a fixed-length code (OTP from SMS, PIN, pickup code), with the field label, hint and error.

## When to use
- One-time codes from SMS or e-mail, PIN codes, short numeric confirmation codes of a known length.
- When the user benefits from seeing how many digits are left and from pasting the whole code at once.

## When not to use
- Codes with letters or a variable length → use [Input](../input/COMPONENT.md) with `inputMode` / `autoComplete`.
- Numbers with meaning (amounts, quantities) → use [Input](../input/COMPONENT.md) with an inline affix, or [Slider](../slider/COMPONENT.md).
- Passwords → use [Input](../input/COMPONENT.md) with `type="password"`.

## Import
```tsx
import { DigitInput } from "prime-ui-kit";
```

## Anatomy
```
DigitInput            field frame: label row → cells → support row (hint | error)
└─ <fieldset>         role="group", named by the label (or labels.group)
   ├─ <input>…        one cell per digit (the first one carries `id`)
   └─ <input hidden>  the joined code when `name` is set
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### DigitInput
`ref` → `HTMLDivElement` (the field frame). The field frame (label → cells → hint | error) around a `<fieldset>` of one-character inputs; the value has no gaps, typing always goes to the first empty cell.

| Prop | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | `4` | Number of cells. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Tier: the cell is a square with the side of the control height (28 · 32 · 36 · 40 · 48); label and hint follow it. Without it the tier of its host (LoginForm, a panel), else `m`. |
| `label` | `ReactNode` | — | Label above the cells; names the group (`aria-labelledby`) and focuses the first cell on click. Without it the group is named by `labels.group`. |
| `required` | `boolean` | — | Red `*` after the label and native `required` on every cell. |
| `optional` | `boolean` | — | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the cells. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | — | Danger ring and danger digits on every cell, `aria-invalid`. A non-empty `error` implies it. |
| `disabled` | `boolean` | — | Disables the fieldset and every cell. |
| `value` | `string` | — | Controlled code; non-digits are dropped, extra digits cut to `length`. |
| `defaultValue` | `string` | `""` | Initial code when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called with the joined digits on every change. |
| `onComplete` | `(value: string) => void` | — | Called once when the last empty cell is filled (typing, paste or autofill). |
| `fullWidth` | `boolean` | `false` | Cells share the container width and keep the tier height; otherwise square cells and the field hugs them. |
| `groupSize` | `number` | — | Splits the cells into groups of this size with a wider gap (`3` → 123 456). |
| `mask` | `boolean` | `false` | Hides the digits (PIN): cells are `type="password"`. |
| `name` | `string` | — | Name of a hidden input that carries the joined code in a native form submit. |
| `autoFocus` | `boolean` | `false` | Focuses the first empty cell on mount. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring on the cells (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay. |
| `id` | `string` | — | Id of the first cell (the label points at it); hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids on the group. |
| `labels` | `Partial<DigitInputLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

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

**Sizes:** digits are semibold and tabular, one type step larger than the tier text (`xs` uses the tier text). A cell of size T is as high as Input and Button of size T; the label and the hint take the same tier.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `fullWidth` | one row, cells share the width, tier height | cards, forms and narrow phone columns where a full-width button follows | `false` |
| `groupSize` | an extra gap before every group (`3` → 123 456) | codes of six digits and longer | — |
| `mask` | dots instead of digits | PIN codes | `false` |
| `required` / `optional` | red `*` / muted «необязательно» after the label | mark the minority of the form | — |
| `focusRing={false}` | no focus ring; the focus fill and the caret remain | a single code on a screen where focus is obvious | `true` |

**Combinations**
- Recommended: `error` set after a rejected code and cleared in `onValueChange`; `onComplete` to check the code as soon as it is filled.
- Pointless: `invalid` together with `error`; `length` larger than the real code.
- Forbidden: `focusRing={false}` without another focus indicator (WCAG 2.4.7).

## States
| State | Driven by | DOM |
|---|---|---|
| hover | — | cell fill darkens (not on focused or disabled cells) |
| focus | keyboard / click | focused cell: focus fill + inset focus ring; its content is selected so a new digit replaces it |
| filled cell | a digit in the cell | `data-filled="true"` on the cell |
| full width | `fullWidth` | `data-full-width="true"` on the fieldset |
| group start | `groupSize` | `data-group-start="true"` on the first cell of every group |
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"` on the fieldset and the frame, `aria-invalid="true"` on cells |
| disabled | `disabled` | `data-disabled="true"` and native `disabled` on the fieldset, every cell disabled, label and hint dimmed |
| no focus ring | `focusRing={false}` | `data-focus-ring="false"` on the fieldset |

`data-size` is set on the frame, the fieldset and every cell. Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue` (+ `onValueChange` to observe).

## Layout & spacing
- The field hugs its cells (label left-aligned above them); with `fullWidth` it fills the container.
- Label → cells: tier `label-gap`; cells → hint: tier `hint-gap` — the same rhythm as every field.
- Put the submit button below or next to the code; with the same `size` it lines up with the cells.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `0`–`9` | Types into the first empty cell and moves to the next one. |
| `Backspace` | Clears the cell; on an empty cell moves to the previous one. |
| `ArrowLeft` · `ArrowRight` | Moves between filled cells and the entry cell. |
| `Home` · `End` | Jumps to the first cell / the entry cell. |
| `Tab` | Leaves the code. |

### ARIA
- The cells sit in a `<fieldset>` (`role="group"`) named by the `label` (`aria-labelledby`) or `labels.group`; clicking the label focuses the first cell.
- Each cell is named by `labels.cell` («Цифра 1 из 6») and has `autocomplete="one-time-code"` and `inputmode="numeric"`, so SMS codes are suggested on phones.
- The hint or the error is linked to the group through `aria-describedby`; invalid cells carry `aria-invalid`.
- Paste and autofill of the whole code into any cell fill all cells.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `group` | `"Код"` | Accessible name of the group when there is no visible `label`. |
| `cell` | `"Цифра {index} из {length}"` | Accessible name of each cell; `{index}` (1-based) and `{length}` are replaced. |
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A six-digit code from SMS with its label and a hint — `label`, `hint`, `length`. |
| [sizes.tsx](examples/sizes.tsx) | Every size; the cell is a square with the side of the control height — `size`. |
| [states.tsx](examples/states.tsx) | A default code next to a disabled one — `disabled`. |
| [validation.tsx](examples/validation.tsx) | Required and optional markers, a hint and an error that replaces it — `required`, `optional`, `hint`, `error`. |
| [grouped.tsx](examples/grouped.tsx) | A long code read in chunks with a wider gap between groups — `groupSize`. |
| [full-width.tsx](examples/full-width.tsx) | Cells that share the container width and keep the tier height, above a full-width button — `fullWidth`. |
| [on-complete.tsx](examples/on-complete.tsx) | The code is checked as soon as the last cell is filled; a wrong code turns the hint into an error — `onComplete`, `error`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the code and clears it with a button — `value`, `onValueChange`. |
| [in-form.tsx](examples/in-form.tsx) | A masked card PIN submitted with a form; a short PIN shows an error — `name`, `mask`, `required`, `error`. |

## Mistakes
- `<DigitInput.Root>` → the component is a single export: `<DigitInput />`.
- A `Label` and a `Hint` placed next to the code by hand → pass `label`, `hint`, `error`.
- Letters in the code → use `Input`; DigitInput accepts digits only.
- Keeping `error` after the user edits the code → clear it in `onValueChange`.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`)
- **See also:** [Input](../input/COMPONENT.md), [LoginForm](../login-form/COMPONENT.md)
