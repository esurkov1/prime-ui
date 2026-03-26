# DigitInput

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

`DigitInput` is a single OTP-style control: a horizontal row of one-character fields that merge into one digit string, with paste support and automatic focus moves between cells.

- **Use** for short numeric codes (SMS/OTP, PIN, pickup codes) where one digit per box matches user expectations.
- **Use** when you want `inputMode="numeric"`, `maxLength={1}` per cell, and `autoComplete="one-time-code"` without wiring it yourself.
- **Use** with `onComplete` to react once the user fills all cells (for example, submit or advance a step).
- **Do not use** for alphanumeric codes; non-digit characters are stripped on type and paste.
- **Do not use** when a single full-width numeric field is enough — prefer [Input](../input/COMPONENT.md) or app-level masking.
- **Do not use** for free-form numbers (amounts, phone as one field); this component is fixed-length, one digit per slot.
- **Do not expect** arrow keys to move between cells; only typing, Backspace on an empty cell, and pointer focus apply.

## Composition

- Public API is **`DigitInput.Root` only** (`DigitInput = { Root }`). There are no inner slots (`Label`, `Icon`, etc.) on this component.
- The root renders a native **`fieldset`** with `aria-label="Digit input"` and **`length`** separate `<input type="text">` cells (`inputMode="numeric"`, `maxLength={1}`, `autoComplete="one-time-code"`).
- Pair captions and helper text with [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) **outside** the root; there is no built-in link from one label to a single control id.

### Minimal example

```tsx
import { DigitInput } from "prime-ui-kit";

export function OneTimeCode() {
  return <DigitInput.Root />;
}
```

## Rules

- **Controlled:** pass `value` and `onChange`; the live string is always normalized to digits only and truncated to `length`.
- **Uncontrolled:** use `defaultValue` (defaults to `""`); still pass `onChange` if you need to observe updates.
- **`onChange`** receives the full normalized digit string after each edit (not only the last key).
- **`onComplete`** fires **once** when the string length becomes `length` **after** having been shorter; editing digits while already full does not fire it again until the value is shortened below `length` and filled again.
- **Paste** at any cell fills forward from that index; non-digits are dropped; focus moves to the last filled or last cell.
- **Backspace** on an **empty** cell moves focus to the previous cell (it does not delete the previous digit by itself).
- **After typing a digit** in a cell, focus moves to the next cell when one exists.
- **`disabled`** disables every cell; **`hasError`** drives error styling on the root via `data-has-error`.
- **No portal, no polymorphic root, no `variant`:** visual scale is only `size` (`s` | `m` | `l` | `xl`); width follows cell layout, not a `fullWidth` prop.

## API

### DigitInput.Root

| Prop           | Type                        | Default | Required | Description                                                                 |
| -------------- | --------------------------- | ------- | -------- | --------------------------------------------------------------------------- |
| `length`       | `number`                    | `4`     | No       | Number of cells (one digit per cell).                                       |
| `size`         | `"s" \| "m" \| "l" \| "xl"` | `"m"`   | No       | Visual size of cells (control tokens).                                      |
| `value`        | `string`                    | —       | No       | Controlled value; non-digits stripped, truncated to `length`.               |
| `defaultValue` | `string`                    | `""`    | No       | Initial value in uncontrolled mode (normalized the same way).               |
| `onChange`     | `(value: string) => void`   | —       | No       | Called with the normalized digit string on every change.                    |
| `disabled`     | `boolean`                   | —       | No       | Disables all cells.                                                         |
| `hasError`     | `boolean`                   | —       | No       | Error styling for the group (`data-has-error` on the root).                |
| `onComplete`   | `(value: string) => void`   | —       | No       | Called when the value first reaches full `length` from a shorter string.   |
| `className`    | `string`                    | —       | No       | Class name on the root `fieldset`.                                          |

Exported composite: `DigitInput = { Root }`. Types: `DigitInputRootProps`, `DigitInputSize`.

## Related

- [Label](../label/COMPONENT.md) — caption for the code group (place beside or above the fieldset).
- [Hint](../hint/COMPONENT.md) — validation or timing hints under the cells.
- [Input](../input/COMPONENT.md) — single-line text or number entry without fixed cells.
- [Button](../button/COMPONENT.md) — actions such as clear, resend, or continue next to the code.
