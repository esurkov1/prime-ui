# DigitInput

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A group of separate input fields, each holding exactly one digit, with shared logic to assemble the string, arrow-key focus navigation, and support for pasting a code from the clipboard.

## What it’s for

- **Identity verification:** one-time codes from SMS or an authenticator app on sign-in or device-change screens.
- **Order pickup:** short numeric codes the customer states or enters at a self-service kiosk.
- **Gated content:** parental PIN or session code in education or media products.
- **Industrial and field use:** large cells on a warehouse or shop-floor tablet where size and touch accuracy matter.
- **Device pairing:** entering a code shown on a TV or router screen in a mobile app.
- **Step-by-step forms:** email or phone confirmation codes inside a settings wizard, next to a label and hint text.

## Use cases

Each example targets a different screen type and prop set.

### Basic

A common case is a four-digit code after sending an SMS. Uncontrolled mode with an `onComplete` callback is enough to move to the next step.

```tsx
import * as React from "react";
import { DigitInput } from "prime-ui-kit";

export function SmsVerifyStep({ onSuccess }: { onSuccess: (code: string) => void }) {
  return (
    <DigitInput.Root
      length={4}
      onComplete={(full) => {
        onSuccess(full);
      }}
    />
  );
}
```

### Sizes

A different context is a pickup-terminal kiosk: larger touch targets and a six-digit order code. Only `size` and `length` change; there is no separate `variant` enum on the component.

```tsx
import { DigitInput } from "prime-ui-kit";

export function PickupKioskCode() {
  return (
    <DigitInput.Root
      length={6}
      size="xl"
      defaultValue=""
      onChange={(v) => {
        window.sessionStorage.setItem("pickup-draft", v);
      }}
    />
  );
}
```

### In context (form / modal / sidebar / …)

Account recovery in a settings sidebar: label, code field, and explanation are separate kit primitives; DigitInput only owns the cells.

```tsx
import { DigitInput } from "prime-ui-kit";
import { Hint } from "prime-ui-kit";
import { Label } from "prime-ui-kit";

export function RecoverySidebarPanel() {
  return (
    <section>
      <Label.Root size="m">Code from email</Label.Root>
      <DigitInput.Root length={8} size="m" />
      <Hint.Root size="m" variant="default">
        The message may be in your Spam folder. The code is valid for 15 minutes.
      </Hint.Root>
    </section>
  );
}
```

### Controlled mode

Admin panel: the entered code stays in sync with state and can be cleared with a button after a failed server check.

```tsx
import * as React from "react";
import { Button } from "prime-ui-kit";
import { DigitInput } from "prime-ui-kit";

export function AdminReauthChip() {
  const [pin, setPin] = React.useState("");

  return (
    <div>
      <DigitInput.Root length={4} value={pin} onChange={setPin} />
      <Button.Root type="button" variant="neutral" mode="stroke" onClick={() => setPin("")}>
        Clear
      </Button.Root>
    </div>
  );
}
```

## Anatomy

The public entry point is `DigitInput.Root`. Internally it renders a `fieldset` with `aria-label="Digit input"` and an array of `length` `input type="text"` elements (`inputMode="numeric"`, `maxLength={1}`, `autoComplete="one-time-code"`). There are no separate slots (`Icon`, `Label`, etc.) on this component.

## API

### DigitInput.Root

| Prop           | Type                      | Default | Required | Description                                                                 |
| -------------- | ------------------------- | ------- | -------- | --------------------------------------------------------------------------- |
| `length`       | `number`                  | `4`     | No       | Number of cells (one digit per cell).                                      |
| `size`         | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No       | Visual size of cells (control tokens).                                     |
| `value`        | `string`                  | —       | No       | Controlled value; non-digit characters are stripped, truncated to `length`. |
| `defaultValue` | `string`                  | `""`    | No       | Initial value in uncontrolled mode.                                        |
| `onChange`     | `(value: string) => void` | —       | No       | Fires on every change to the normalized digit string.                      |
| `disabled`     | `boolean`                 | —       | No       | Disables all cells.                                                        |
| `hasError`     | `boolean`                 | —       | No       | Error styling on cell borders.                                             |
| `onComplete`   | `(value: string) => void` | —       | No       | Called once when the value length becomes `length` after being shorter.    |
| `className`    | `string`                  | —       | No       | Class on the root `fieldset`.                                              |

Exported object: `DigitInput = { Root }`. Types: `DigitInputRootProps`, `DigitInputSize`.

## Variants

There is no separate `variant` prop. The component scales visually via `size` (`s` | `m` | `l` | `xl`). The “error” semantics come from `hasError`.

## States

- **Default:** typing and keyboard navigation are active.
- **`disabled`:** all inputs have `disabled`; the group shows a not-allowed cursor.
- **`hasError`:** cell borders use the error color (`data-has-error` on the root).
- **Fill level:** the value is always normalized to a digit string at most `length` long; empty positions show as empty cells.

## Accessibility (a11y)

The group is exposed as `role="group"` with the name “Digit input”. Each cell has its own `aria-label` like “Digit i of n”. After entering a digit, focus moves to the next cell; with the current cell empty, Backspace moves focus backward. For a label for the whole group, use `Label` or a section heading outside — there is no built-in `htmlFor` link to a single field because there are multiple controls.

## Limitations and notes

- Only digits are accepted; letters and symbols are dropped on type and paste.
- `onComplete` fires on the **transition** to full length (when the string was shorter before); changing digits without clearing will not fire the callback again.
- There is no built-in mask, timer, or “resend code” button — that belongs in the parent UI.
- There is no polymorphic root (`asChild`) or “full container width” mode; width comes from content (fixed cell size and gap).

## Related components

- **Label** — heading for the cell group.
- **Hint** — explanation or input rules below the block.
- **Input** — when you need a single line without per-digit cells.
- **Button** — “continue”, “clear”, “resend code” actions next to the code.
