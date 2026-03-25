# Label

## What it is

A composite label for form fields and other controls: root `Label.Root` (native `label`) with optional slots `Label.Icon`, `Label.Asterisk`, and `Label.Sub`.

## What it’s for

- **Account and profile:** captions for “Name”, “Phone”, “Address” with a clear link to the field via `htmlFor` / `id`, and visual emphasis of required fields with an asterisk.
- **Corporate requests and contracts:** long forms where inline hints are needed on the same line (currency, units, “optional”) without a separate error or hint block.
- **Internal panels (analytics, billing):** compact filters and report settings where an icon in the label helps distinguish field types and consistent `s`–`xl` sizes matter in the grid.

## Use cases

Each example is self-contained; domains and tasks differ between subsections.

### Basic

A label for a single field on a marketing-site contact form: linked to the field by `id`, no slots.

```tsx
import { Label } from "prime-ui-kit";

export function ContactEmailField() {
  return (
    <>
      <Label.Root htmlFor="contact-email">Reply email</Label.Root>
      <input id="contact-email" type="email" name="email" autoComplete="email" />
    </>
  );
}
```

### With sizes / scale

A metrics panel: several labels in one tight grid with different text scale (`size`) to align the row with neighboring controls.

```tsx
import { Label } from "prime-ui-kit";

export function ReportFiltersLegend() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Label.Root size="s" htmlFor="metric-period">
        Sample period
      </Label.Root>
      <Label.Root size="l" htmlFor="metric-granularity">
        Granularity
      </Label.Root>
    </div>
  );
}
```

### In context (form / modal / sidebar / …)

A modal for booking a medical appointment: icon in the label, primary text, and a second-line hint — the user sees both the field name and the input format.

```tsx
import { Icon, Label } from "prime-ui-kit";

export function AppointmentModalFields() {
  return (
    <>
      <Label.Root size="m" htmlFor="visit-datetime">
        <Label.Icon>
          <Icon aria-hidden name="system.settings" />
        </Label.Icon>
        Visit date and time
        <Label.Sub>clinic local time</Label.Sub>
      </Label.Root>
      <input id="visit-datetime" type="datetime-local" />
    </>
  );
}
```

## Anatomy

- **`Label.Root`** — a `label` element; inside, `LabelSizeContext` propagates size to children.
- Child slots (in any order, as in markup): **`Label.Icon`** → `span` wrapping an icon; **`Label.Asterisk`** → `span` with default character `*`; **`Label.Sub`** → `span` for secondary text; plus text nodes for the main caption.

## API

### Label.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `size` | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Type scale, spacing, and size context for `Label.Icon`. |
| `disabled` | `boolean` | — | No | Disabled appearance; `aria-disabled`, `data-disabled`. |
| `htmlFor` | `string` | — | No | `id` of the associated control. |
| `className` | `string` | — | No | Extra class on the root. |
| `children` | `React.ReactNode` | — | No | Text and `Icon`, `Asterisk`, `Sub` slots. |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size">` | — | No | Standard `label` attributes (except `size`). |

### Label.Icon

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Extra class on the wrapper. |
| `children` | `React.ReactNode` | — | No | Usually an icon component from the kit. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### Label.Asterisk

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Extra class. |
| `children` | `React.ReactNode` | `"*"` | No | Override the default character. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

### Label.Sub

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| `className` | `string` | — | No | Extra class. |
| `children` | `React.ReactNode` | — | No | Secondary line under the title. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | `span` attributes. |

## Variants

There is no separate `variant` prop. Visual tuning is via **`size`** (`s` | `m` | `l` | `xl`) and slot composition (`Icon`, `Asterisk`, `Sub`). Asterisk color comes from `Asterisk` slot styles (danger accent in the theme).

## States

- **Default:** text and slots use the primary content color.
- **`disabled`:** on `Label.Root` — `data-disabled="true"`, `aria-disabled`, color from the disabled-content token.
- **Required marker:** visually via `Label.Asterisk`; this is not a DOM field state and does not set `required` on the input automatically.

## Accessibility (a11y)

- Link the label to the control: **`htmlFor` on `Label.Root` + `id` on the field**, or nest the interactive control inside `label`.
- With **`disabled`** on the label, **`aria-disabled`** is set; ensure the field itself is not interactable (`disabled` / `readOnly` on the control), or the label and field behavior will mismatch and confuse users.
- Mark the icon in `Label.Icon` with **`aria-hidden`** when meaningful label text is next to it.
- The asterisk is a visual-only marker; for screen readers, duplicate semantics on the field when needed (`required`, `aria-required`) and surface errors via the kit’s hint / validation components.

## Limitations and notes

- The component does **not** set `required` on `input` / `select` and does **not** replace error or description text — use `Hint` and form validation for that.
- There is no **`asChild`** or polymorphic root: the root is always `label`.
- Nesting an input inside `Label.Root` is valid HTML, but the typical kit pattern is siblings with `htmlFor` / `id`.

## Related components

- **Input**, **Textarea**, **Select**, **Checkbox**, **Radio**, **Switch** — often sit next to a label or embed their own; `Label` is handy for a consistent caption with an icon and second line.
- **Hint** — help and errors under the field when `Label.Sub` is not enough or you need a separate status block.
- **Icon** — glyphs inside `Label.Icon`.
