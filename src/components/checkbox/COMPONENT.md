# Checkbox

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

A compound “checkbox” control: a hidden native `input type="checkbox"`, a visible square with a checkmark or an indeterminate dash, a label, and optional hint and error.

## What it’s for

- **Checkout and legal consent** — explicit “I agree to the terms” before payment or submitting an application, with offer text next to the box.
- **Tables and lists with bulk selection** — row selection and a parent “select all” checkbox in an indeterminate state when only some rows are selected.
- **Product settings and subscriptions** — enabling notification channels, privacy options, and experimental features without a separate “Save” button per item.
- **Approvals and document workflows** — “acknowledged”, “approved”, or “needs revision” on a stage card where recording the fact in the form matters.
- **Internal dashboards and reports** — filters like “show archive”, “only my items”, column visibility toggles when saving a table layout.

## Use cases

Each example is a different screen type and prop set; import from the `prime-ui-kit` package.

### Basic

A short form before a doctor visit: one data-processing consent, no hint and no error.

```tsx
import { Checkbox } from "prime-ui-kit";

export function MedicalConsentLine() {
  return (
    <Checkbox.Root size="m" name="gdpr" value="yes" required>
      <Checkbox.Label>I agree to the processing of personal data for the purpose of booking an appointment</Checkbox.Label>
    </Checkbox.Root>
  );
}
```

### Sizes / variants

A settings showcase for UI density: the same consent text in four sizes to align with the catalog card grid.

```tsx
import { Checkbox } from "prime-ui-kit";

export function CatalogDensityConsent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(["s", "m", "l", "xl"] as const).map((size) => (
        <Checkbox.Root key={size} size={size} name={`compact-${size}`}>
          <Checkbox.Label>Compact product list mode (size {size})</Checkbox.Label>
        </Checkbox.Root>
      ))}
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

A block in a subscription sidebar: label, explanation of email frequency, and a validation message after trying to submit without consent.

```tsx
import { Checkbox } from "prime-ui-kit";

export function NewsletterSidebarBlock() {
  const showError = true;

  return (
    <aside style={{ maxWidth: 320, padding: 16, borderRadius: 8, background: "var(--prime-sys-color-surface-raised, #f4f4f5)" }}>
      <Checkbox.Root size="m" variant={showError ? "error" : "default"} name="digest">
        <Checkbox.Label>Weekly digest of new products and discounts</Checkbox.Label>
        <Checkbox.Hint>No more than one email per week; one-click unsubscribe at the bottom of each message.</Checkbox.Hint>
        {showError ? <Checkbox.Error>Check this option or click “Skip”.</Checkbox.Error> : null}
      </Checkbox.Root>
    </aside>
  );
}
```

### Controlled mode

An orders table header: the checkbox reflects whether all rows on the page are selected; partial selection shows `indeterminate`; click selects all or clears all.

```tsx
import * as React from "react";
import { Checkbox } from "prime-ui-kit";

type Row = { id: string };

export function OrdersHeaderSelectAll({ rows }: { rows: Row[] }) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());

  const total = rows.length;
  const selectedCount = rows.filter((r) => selectedIds.has(r.id)).length;
  const allSelected = total > 0 && selectedCount === total;
  const indeterminate = selectedCount > 0 && selectedCount < total;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r.id)));
    }
  };

  return (
    <Checkbox.Root
      size="m"
      checked={allSelected}
      indeterminate={indeterminate}
      onChange={() => toggleAll()}
      aria-label={allSelected ? "Clear selection for all orders on this page" : "Select all orders on this page"}
    >
      <Checkbox.Label />
    </Checkbox.Root>
  );
}
```

## Anatomy

- **`Checkbox.Root`** — context provider and `div.field` wrapper with `data-size`, `data-variant`, `data-disabled`, `data-invalid`, `data-checked`, `data-indeterminate`; inside: `ControlSizeProvider` and `children` (slots).
- **`Checkbox.Label`** — `Label.Root` with a grid: cell with native `input` (hidden) and decorative `span` with SVG (frame, checkmark, indeterminate line), then a column for label text.
- **`Checkbox.Hint`** — `Hint.Root` below the label, indented to align with the text column; registers the hint for `aria-describedby`.
- **`Checkbox.Error`** — `Hint.Root` in error variant; registers invalid for the field (together with `variant="error"` on the root).

Public API: **`Checkbox`** object with **`Root`**, **`Label`**, **`Hint`**, **`Error`**.

## API

### Checkbox.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| variant | `"default" \| "error"` | `"default"` | no | Red outline for `error`; `invalid` also when `Checkbox.Error` is mounted. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Box size and label typography. |
| indeterminate | `boolean` | `false` | no | Indeterminate state; sets `input.indeterminate` on the DOM. |
| id | `string` | auto | no | Stable input id; linked via `htmlFor` on `Checkbox.Label`. |
| className | `string` | — | no | Class on the field wrapper. |
| checked | `boolean` | — | no | Controlled checked state. |
| defaultChecked | `boolean` | `false` | no | Initial value in uncontrolled mode. |
| onChange | `React.ChangeEventHandler<HTMLInputElement>` | — | no | Change event; checked state is updated internally. |
| disabled | `boolean` | — | no | Disabled input and label. |
| aria-describedby | `string` | — | no | Extended with hint and error ids when slots are used. |
| children | `React.ReactNode` | — | no | Usually Label, Hint, Error slots. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size">` | — | no | `name`, `value`, `required`, `readOnly`, `form`, and other native checkbox attributes. |

### Checkbox.Label

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Text next to the box; empty node — box only (set `aria-label` on Root). |
| className | `string` | — | no | Class on `label`. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | no | Other label attributes. |

### Checkbox.Hint

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Hint text. |
| className | `string` | — | no | Additional class. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes without `id`. |

### Checkbox.Error

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error text. |
| className | `string` | — | no | Additional class. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes without `id`. |

## Variants

- **`default`** — neutral box outline; error styling only if **`Checkbox.Error`** is mounted.
- **`error`** — error-colored outline regardless of slot text (useful when the whole form is invalid before the message is mounted).

## States

- **Unchecked / checked** — normal toggle; checkmark is animated visually.
- **Indeterminate** — line through the center of the box; logically the input may be `checked` or not — visuals come from **`indeterminate`** and the DOM property.
- **Disabled** — no click, muted colors, “not-allowed” cursor on the label row.
- **Invalid** — `aria-invalid` on the input when `variant="error"` or when **`Checkbox.Error`** is present.

There is no separate visual “loading” mode for this component.

## Accessibility (a11y)

- Keyboard focus is handled by the native `input`; the visible focus ring is on the decorative box via `focus-visible`.
- **`Checkbox.Label`** sets **`htmlFor`** to the generated input **`id`**; clicking the label toggles the checkbox.
- Without visible text, set **`aria-label`** (or **`aria-labelledby`**) on **`Checkbox.Root`** so the hidden input has an accessible name.
- **`aria-describedby`** on the input is composed from the user value, hint id, and error id when slots are present.

## Limitations and notes

- The component does **not** support **`asChild`**: markup is fixed (label + hidden input + SVG).
- A “pick one of several mutually exclusive options” group belongs to **`Radio`**, not multiple independent **`Checkbox`** controls.
- **`indeterminate`** is not part of HTML form submission: clearing indeterminate on click is your **`onChange`** and external state’s responsibility.
- **`Checkbox.Root`** does not set `type` on the input — it is always checkbox; **`size`** is not forwarded to the input (reserved for the design system).

## Related components

- **Radio** — pick one option from a group with the same choice-control visual language.
- **Switch** — binary setting with a different metaphor (slider).
- **Label** and **Hint** — used inside the checkbox; can be combined with **Input** in shared forms.
- Native **form** — for `name`, `value`, `required`, and submitting data to the server.
