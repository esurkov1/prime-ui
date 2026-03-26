# Switch

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A compound on/off toggle: a hidden native input with `role="switch"`, a visible track with a thumb, and slots for label, hint, and error text.

## When to use it

- **Account and notifications** — quickly enable or disable a channel (email, push, SMS) without a separate “Save” button on every row.
- **Marketplace and delivery** — toggle an order option (leave at door, contactless) where the meaning is binary, not a pick from a list.
- **Internal tools** — turn on a ticket-handling rule or auto-summary for the team; state is obvious at a glance.

## Use cases

Each example is a different screen type and prop set; you should not copy one pattern with only different labels.

### Basic

Course flow: the student turns on deadline reminders — one switch and a short label.

```tsx
import { Switch } from "prime-ui-kit";

export function CourseReminderRow() {
  return (
    <Switch.Root defaultChecked name="deadlineReminders">
      <Switch.Label>Deadline reminders</Switch.Label>
      <Switch.Hint>Email two days before and on the deadline</Switch.Hint>
    </Switch.Root>
  );
}
```

### Sizes / variants

Warehouse monitoring panel: the same switches in four sizes to match density with the table and filters.

```tsx
import { Switch } from "prime-ui-kit";

export function WarehouseDensityPreview() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
      <Switch.Root size="s" defaultChecked>
        <Switch.Label>Auto write-off</Switch.Label>
      </Switch.Root>
      <Switch.Root size="m" defaultChecked>
        <Switch.Label>Auto write-off</Switch.Label>
      </Switch.Root>
      <Switch.Root size="l" defaultChecked>
        <Switch.Label>Auto write-off</Switch.Label>
      </Switch.Root>
      <Switch.Root size="xl" defaultChecked>
        <Switch.Label>Auto write-off</Switch.Label>
      </Switch.Root>
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

Pre-payment confirmation: strict consent requirement — validation error text via `Switch.Error`.

```tsx
import { Switch } from "prime-ui-kit";

export function CheckoutConsentField() {
  return (
    <section style={{ padding: 20, maxWidth: 400, borderRadius: 12, border: "1px solid #e4e4e7" }}>
      <h2 style={{ margin: "0 0 12px", fontSize: 16 }}>Terms</h2>
      <Switch.Root variant="error">
        <Switch.Label>I accept the offer terms and data policy</Switch.Label>
        <Switch.Error>You must agree to continue to payment</Switch.Error>
      </Switch.Root>
    </section>
  );
}
```

### Controlled mode

Smart home panel: parent holds lamp state and syncs it with the API response after a delay.

```tsx
import * as React from "react";
import { Switch } from "prime-ui-kit";

export function LivingRoomLightSwitch() {
  const [on, setOn] = React.useState(false);

  return (
    <Switch.Root checked={on} onCheckedChange={setOn}>
      <Switch.Label>Living room light: {on ? "on" : "off"}</Switch.Label>
    </Switch.Root>
  );
}
```

## Anatomy

- **`Switch.Root`** — context provider and field wrapper (`div` with `data-size`, `data-variant`, `data-checked`, `data-disabled`, `data-invalid`, `data-readonly`); wraps **`ControlSizeProvider`**.
- **`Switch.Label`** — **`Label.Root`** with a “switch + text” column: native **`input type="checkbox"`** with **`role="switch"`**, visual **`span.track`**, and optional copy in **`span.text`**.
- **`Switch.Hint`** and **`Switch.Error`** — wrappers over **`Hint.Root`** with fixed `id`s linked via **`aria-describedby`**; **`Switch.Error`** registers an error in context (affects `aria-invalid` together with `variant="error"`).

Public API: **`Switch`** object with **`Root`**, **`Label`**, **`Hint`**, **`Error`**.

## API

### Switch.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Track and thumb sizes from switch system tokens. |
| variant | `"default" \| "error"` | `"default"` | no | Field-level error semantics; combines with presence of `Switch.Error`. |
| checked | `boolean` | — | no | Controlled on state. |
| defaultChecked | `boolean` | `false` | no | Uncontrolled initial value. |
| onCheckedChange | `(checked: boolean) => void` | — | no | Value change after user interaction. |
| disabled | `boolean` | — | no | Disabled; `data-disabled` on root. |
| readOnly | `boolean` | — | no | Visible state without change on click; `aria-readonly`. |
| label | `React.ReactNode` | — | no | Label without child elements; equivalent to a single `Switch.Label` when `children` are omitted. |
| children | `React.ReactNode` | — | no | Composition of `Label` / `Hint` / `Error`; takes precedence over `label`. |
| id | `string` | from `useId()` | no | Links label and input. |
| className | `string` | — | no | Class on the field root `div`. |
| aria-describedby | `string` | — | no | Extra descriptions; hint and error ids are appended. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange">` | — | no | Including `name`, `value`, `required`, `autoFocus`, `aria-*`; `onChange` is not used — only `onCheckedChange`. |

### Switch.Label

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Text to the right of the switch; without children only the track remains (rare — set a name via `aria-label` on Root). |
| className | `string` | — | no | Class on the label row. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | no | Passed to `Label.Root`; `htmlFor` and `size` come from context. |

### Switch.Hint

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Hint text. |
| className | `string` | — | no | Class on the slot with margin under the text column. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Attributes on `Hint` root; `id` is fixed. |

### Switch.Error

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error text. |
| className | `string` | — | no | Class on the error block. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Attributes on `Hint` root with error variant. |

## Variants

- **`default`** — neutral track border; when on, filled with accent color.
- **`error`** — error-colored border and `aria-invalid` on the input (same as when **`Switch.Error`** is present).

## States

- **On / off** — `checked` / `defaultChecked` and thumb position; `aria-checked` stays in sync with DOM `checked`.
- **Disabled** — `disabled`: click does not change value; hint uses `disabled` variant on `Hint`.
- **Read-only** — `readOnly`: `preventDefault` in handler; user cannot change value.
- **Error** — `variant="error"` and/or child **`Switch.Error`**: `aria-invalid`, red track border.

There is no **loading** or **indeterminate** state for the switch.

## Accessibility (a11y)

- **`switch`** role, **`aria-checked`**, keyboard same as checkbox (including **Space** when focused).
- Focus visible via **`focus-visible`** on the track (focus ring).
- **`aria-describedby`** merges external description, **`Switch.Hint`**, and **`Switch.Error`**.
- **`readOnly`** sets **`aria-readonly`**.

## Limitations and notes

- No **`asChild`**: markup is fixed by **`Switch.*`** components.
- This is **not** a **`Checkbox`** replacement for lists with partial selection and **`indeterminate`**.
- For one choice among mutually exclusive options use **`Radio`**, not independent switches.
- **`label`** on **`Root`** is handy for a single line of text; **`children`** are needed when you also need **`Hint`** or **`Error`**.

## Related components

- **Checkbox** — flags and partial selection in groups.
- **Radio** — one selected option from a set.
- **Label** and **Hint** — same primitives inside the switch for consistent typography.
- **Input** — when you need free-form value, not a binary flag.
