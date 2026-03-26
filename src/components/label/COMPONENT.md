# Label

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

- **Surface:** `Label.Root` is always a native **`<label>`**; slots **`Label.Icon`**, **`Label.Asterisk`**, **`Label.Sub`** for icon, required marker, secondary text.
- **Associate** the caption with a control: **`htmlFor`** on **`Label.Root`** = control **`id`**, or nest the control inside **`Label.Root`**.
- **Required:** **`Label.Asterisk`** is visual only; set **`required`** / **`aria-required`** on the control. Optional fields often use **`Label.Sub`** (e.g. “optional”).
- **Defaults:** **`size="m"`** on **`Label.Root`**; **`disabled`** sets **`aria-disabled`** + muted styles (mirror real control state).
- **Examples (source):** [`examples/required-field.tsx`](examples/required-field.tsx), [`examples/optional-field.tsx`](examples/optional-field.tsx), [`examples/grouped-labels.tsx`](examples/grouped-labels.tsx), [`examples/accessibility-pattern.tsx`](examples/accessibility-pattern.tsx), [`examples/with-icon.tsx`](examples/with-icon.tsx).

## LLM note

When generating UI with **Label**:

1. Never drop **programmatic association**: every **`Label.Root`** must either use **`htmlFor` + matching `id`** on the control or wrap the control inside the root.
2. Do not treat **`Label.Asterisk`** as sufficient for “required”; always set **`required`** (and validation) on the actual input/select/textarea (and **`aria-required`** if you mirror state without the native attribute).
3. Decorative icons in **`Label.Icon`** should use **`aria-hidden="true"`** when the visible label text already names the field.
4. Prefer **[Hint](../hint/COMPONENT.md)** (or field error UI) for validation and long help; **`Label.Sub`** is for a short secondary line in the label row, not a substitute for error text.
5. The root is **not** polymorphic: no **`asChild`** — do not swap **`label`** for another element.
6. For a **group** of related fields, use **`<fieldset>`** + **`<legend>`** (or an equivalent ARIA grouping pattern) and keep **one `Label.Root` per control** where each control has its own **`id`**.

## Extended

### About

Composite caption for form fields: `Label.Root` is a native `label` with optional slots `Label.Icon`, `Label.Asterisk`, and `Label.Sub` for icon, required marker, and secondary text.

- **Use** to associate visible text with a control via `htmlFor` / `id` or by nesting the control inside the root.
- **Use** when you want a consistent type scale (`size`) and optional icon or second-line hint in one label row.
- **Use** `Label.Asterisk` for a visual required marker next to the caption.
- **Do not use** as a replacement for field validation messages or long help copy; pair with [Hint](../hint/COMPONENT.md) or similar when you need status or errors below the field.
- **Do not use** expecting the label to set `required` on inputs; that remains on the control.
- **Do not use** `Label` as a non-label wrapper; the root is always a `label` element (no polymorphic `asChild`).

### Composition

- **`Label.Root`** — `<label>`; sets `data-size` (from `size`, default `m`) and `data-disabled` when `disabled`. Wraps children in `LabelSizeContext` so slots inherit the same size.
- **`Label.Icon`** — `<span>` before or beside the main text; forwards label size to children via `ControlSizeProvider` (e.g. for kit `Icon` sizing).
- **`Label.Asterisk`** — `<span>` for the required marker; default child text is `*` if `children` is omitted.
- **`Label.Sub`** — `<span>` for secondary line or hint text on the same label.
- Slot order in markup is flexible; keep reading order sensible for screen readers (e.g. icon, title, asterisk, sub).

### Minimal example

```tsx
import { Label } from "prime-ui-kit";

export function Example() {
  return (
    <>
      <Label.Root htmlFor="field-id">Caption</Label.Root>
      <input id="field-id" />
    </>
  );
}
```

### Rules

- **Association:** set **`htmlFor` on `Label.Root`** to match the control’s **`id`**, or place the interactive control inside **`Label.Root`** so the caption is programmatically linked.
- **`disabled` on `Label.Root`:** sets **`aria-disabled`** and **`data-disabled`** for muted styling; keep the actual field non-interactive (`disabled`, `readOnly`, etc.) or behavior will not match the label-only state.
- **`Label.Icon`:** when the icon is decorative and the visible label text is sufficient, mark the icon **`aria-hidden`**.
- **`Label.Asterisk`** is visual-only; expose required state on the control with **`required`** / **`aria-required`** and errors via hint or validation UI as needed.
- There is no separate **`variant`** prop; appearance follows **`size`** and slot composition (asterisk uses danger-accent styling from the theme).
- The root does **not** implement **`asChild`**; it is always a **`label`**.
- Nesting an input inside **`Label.Root`** is valid HTML; the common kit pattern is sibling **`Label.Root`** + control with **`htmlFor`** / **`id`**.
- **Grouped fields:** use **`fieldset`** / **`legend`** (or `role="group"` with an accessible name) for the section; each control in the group still gets its own **`Label.Root`** and unique **`id`** unless the control is nested inside its label.

### Scenarios (see `examples/`)

| Scenario | Intent |
|----------|--------|
| Required field | `Label.Asterisk` + **`required`** on the control |
| Optional field | `Label.Sub` for “optional” (or similar); no asterisk |
| Grouped labels | `fieldset` + `legend` + per-field `Label.Root` + `htmlFor` / `id` |
| Accessibility | Association, decorative icon hidden, required on control, short sub-line vs Hint |

### API

#### Label.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Type scale, spacing, and size context for nested slots (e.g. `Label.Icon`) |
| disabled | `boolean` | — | No | Disabled look; sets `aria-disabled` and `data-disabled` |
| htmlFor | `string` | — | No | `id` of the associated control |
| className | `string` | — | No | Additional class on the root |
| children | `React.ReactNode` | — | No | Text and `Label.Icon`, `Label.Asterisk`, `Label.Sub` |
| …rest | `Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "size">` | — | No | Other native `label` attributes (`size` is reserved for the design-system prop) |

#### Label.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the wrapper |
| children | `React.ReactNode` | — | No | Typically an icon; receives control size from label context |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes |

#### Label.Asterisk

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the wrapper |
| children | `React.ReactNode` | `"*"` | No | Overrides the default asterisk character when provided |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes |

#### Label.Sub

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | No | Additional class on the wrapper |
| children | `React.ReactNode` | — | No | Secondary line under the main caption |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other `span` attributes |

### Related

- [Input](../input/COMPONENT.md)
- [Textarea](../textarea/COMPONENT.md)
- [Select](../select/COMPONENT.md)
- [Checkbox](../checkbox/COMPONENT.md)
- [Radio](../radio/COMPONENT.md)
- [Switch](../switch/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
