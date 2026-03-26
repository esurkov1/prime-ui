# Radio

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A composite “radio button” control: a field wrapper, label with native `input type="radio"`, and optional hint and error message.

## What it’s for

- **Subscriptions and plans** — pick one plan from several showcase cards with different pricing and feature sets.
- **Logistics and slots** — assign one delivery or pickup window from a list of mutually exclusive intervals.
- **Access settings** — set a single role or document visibility level without multi-select.

## Use cases

Examples are split across product areas and illustrate different parts of the API.

### Basic

Onboarding: the user picks one primary goal for using the service; items with the same `name` behave as one group.

```tsx
import { Radio } from "prime-ui-kit";

export function OnboardingGoalStep() {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 600, marginBottom: 12 }}>What do you want to do first?</legend>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Radio.Root name="goal" value="tasks" defaultChecked size="m">
          <Radio.Label>Manage team tasks</Radio.Label>
        </Radio.Root>
        <Radio.Root name="goal" value="reports" size="m">
          <Radio.Label>Build reports</Radio.Label>
        </Radio.Root>
        <Radio.Root name="goal" value="integrations" size="m">
          <Radio.Label>Connect integrations</Radio.Label>
        </Radio.Root>
      </div>
    </fieldset>
  );
}
```

### Variants and sizes

Medical portal: consent for data processing with emphasis on validation error and compact size in the appointment sidebar.

```tsx
import { Radio } from "prime-ui-kit";

export function ConsentSidebar() {
  return (
    <aside style={{ maxWidth: 320 }}>
      <Radio.Root name="consent" value="yes" defaultChecked size="s">
        <Radio.Label>I agree to the policy</Radio.Label>
        <Radio.Hint>You can change this in your profile before signing the agreement.</Radio.Hint>
      </Radio.Root>
      <Radio.Root name="consent" value="no" variant="error" size="s">
        <Radio.Label>I do not agree</Radio.Label>
        <Radio.Error>Without consent, booking a specialist is not available.</Radio.Error>
      </Radio.Root>
    </aside>
  );
}
```

### In context (form / modal / sidebar / …)

E-commerce checkout: payment method block in the order card — each method has a label and short explanation.

```tsx
import { Radio } from "prime-ui-kit";

export function CheckoutPaymentCard() {
  return (
    <section style={{ padding: 16, borderRadius: 12, border: "1px solid #e4e4e7" }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Payment</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Radio.Root name="pay" value="card" defaultChecked size="m">
          <Radio.Label>Card online</Radio.Label>
          <Radio.Hint>3-D Secure when required.</Radio.Hint>
        </Radio.Root>
        <Radio.Root name="pay" value="cod" size="m">
          <Radio.Label>Cash to courier</Radio.Label>
          <Radio.Hint>Please have the exact amount ready.</Radio.Hint>
        </Radio.Root>
      </div>
    </section>
  );
}
```

### Controlled mode

Admin panel: page publish mode is held in screen state and synced with the API draft.

```tsx
import * as React from "react";
import { Radio } from "prime-ui-kit";

export function PageVisibilityControl() {
  const [visibility, setVisibility] = React.useState<"public" | "staff" | "private">("staff");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <Radio.Root
        name="visibility"
        value="public"
        checked={visibility === "public"}
        onChange={(e) => {
          if (e.currentTarget.checked) setVisibility("public");
        }}
        size="m"
      >
        <Radio.Label>Public</Radio.Label>
      </Radio.Root>
      <Radio.Root
        name="visibility"
        value="staff"
        checked={visibility === "staff"}
        onChange={(e) => {
          if (e.currentTarget.checked) setVisibility("staff");
        }}
        size="m"
      >
        <Radio.Label>Staff only</Radio.Label>
      </Radio.Root>
      <Radio.Root
        name="visibility"
        value="private"
        checked={visibility === "private"}
        onChange={(e) => {
          if (e.currentTarget.checked) setVisibility("private");
        }}
        size="m"
      >
        <Radio.Label>Draft (hidden)</Radio.Label>
      </Radio.Root>
    </div>
  );
}
```

## Anatomy

`Radio.Root` — a `.field` wrapper with `data-size`, `data-variant`, `data-disabled`, `data-invalid`, and a context provider.

Inside, by role:

- `Radio.Label` — `Label.Root` + native `input[type=radio]` + decorative SVG; optional text in `.text`.
- `Radio.Hint` — `Hint.Root` below the marker, left-indented to align with the control width.
- `Radio.Error` — the same slot in error variant; when mounted, marks the group as invalid.

Practical slot order: `Label` first, then `Hint` and/or `Error`.

## API

### Radio.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| variant | `"default"` \| `"error"` | `"default"` | No | Error styling and `data-invalid` when `error` or when `Radio.Error` is present. |
| size | `"s"` \| `"m"` \| `"l"` \| `"xl"` | `"m"` | No | Unified size for marker, typography, and hint/error spacing. |
| disabled | `boolean` | — | No | Disabled item; disabled `cursor` and styles on marker and label. |
| id | `string` | auto-generated | No | Input id; association with `label[for]`. |
| className | `string` | — | No | Class on the root field wrapper. |
| aria-describedby | `string` | — | No | Merged with hint and error ids when those slots exist. |
| children | `React.ReactNode` | — | No | Nested `Radio.Label`, `Radio.Hint`, `Radio.Error`. |
| …rest | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "size">` | — | No | Including `name`, `value`, `checked`, `defaultChecked`, `onChange`, `required`, `readOnly`, and other radio input attributes. |

### Radio.Label

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | No | Label text; if empty, provide a name via `aria-label` on the root. |
| className | `string` | — | No | Additional class on the label row. |
| …rest | `Omit<HTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | No | `htmlFor` and `size` come from context. |

### Radio.Hint

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Hint text. |
| className | `string` | — | No | Class on the hint slot. |
| …rest | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | No | `id` is fixed for accessibility. |

### Radio.Error

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Error text. |
| className | `string` | — | No | Class on the error slot. |
| …rest | `Omit<HTMLAttributes<HTMLParagraphElement>, "id">` | — | No | `id` is fixed for `aria-describedby`. |

## Variants

- **default** — standard marker outline, hover on label, selected state with filled center.
- **error** — outline and fill in error colors; use with `Radio.Error` or for external invalidity indication.

## States

- **Unchecked / checked** — native `checked` or uncontrolled `defaultChecked`.
- **disabled** — prop on `Radio.Root`: input and label are inactive, styles muted.
- **Invalid** — `variant="error"` or mounted `Radio.Error`: `aria-invalid` on input, `data-invalid` on root.
- **With hint** — when `Radio.Hint` mounts, its id is added to `aria-describedby`.

## Accessibility (a11y)

- Native `input type="radio"` keeps form behavior and keyboard navigation.
- Label is tied to the field via `htmlFor` / `id`.
- Hint and error participate in `aria-describedby`; on error, `aria-invalid` is set.
- For an option without visible text, set an accessible name (`aria-label` on the root; forwarded to the input via remaining props).

## Limitations and notes

- One `Radio.Root` is one group item; build the group with multiple roots sharing the **same** `name` (and wrap in `fieldset` / `legend` when appropriate).
- There is no built-in “RadioGroup” component: selection is native or manually controlled.
- Radio has no polymorphic `asChild`: marker and label are fixed by the implementation.
- HTML input `type` and `size` are fixed (`radio` and excluded from props in favor of design-system `size`).

## Related components

- **Checkbox** — when multiple independent flags are allowed.
- **Switch** — binary on/off without a list of options.
- **Label** and **Hint** — used inside Radio; review them for consistent forms.
- **Segmented control** — when you need a segmented toggle in one bar instead of a radio list.
