# Checkbox

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A compound checkbox: a visually hidden native `input type="checkbox"`, a decorative box with check or indeterminate mark, and optional label, hint, and error text wired to `aria-describedby` and invalid state.

- **When to use** — explicit consent, terms, or other “yes/no” fields that submit with the form (`name`, `value`, `required`).
- **When to use** — row or “select all” patterns where the parent shows **indeterminate** when only some children are checked.
- **When to use** — independent toggles (filters, optional features) rather than one-of-many choices.
- **When to use** — hint text or inline validation aligned under the label column.
- **When not to use** — exactly one option from a set of alternatives (prefer [Radio](../radio/COMPONENT.md)).
- **When not to use** — a single binary setting where a switch fits the product language (prefer [Switch](../switch/COMPONENT.md)).
- **When not to use** — you need `asChild` or fully custom markup; the control is a fixed [Label](../label/COMPONENT.md) row with a hidden input and SVG.

## Composition

- **`Checkbox.Root`** — wraps the field in a `div` with `data-size`, `data-variant`, `data-disabled`, `data-invalid`, `data-checked`, `data-indeterminate`; provides context and `ControlSizeProvider` for child parts.
- **`Checkbox.Label`** — required for the control: hosts the native checkbox and decorative SVG, then optional text in a trailing column; sets `htmlFor` to the input id.
- **`Checkbox.Hint`** — optional; registers hint text and contributes its id to the input’s `aria-describedby`.
- **`Checkbox.Error`** — optional; error-styled [Hint](../hint/COMPONENT.md) and registers invalid state when mounted (with `variant="error"` on the root when you want error chrome without the slot).
- **Order:** `Root` → `Label` (always) → `Hint` / `Error` below when needed. Public API: `Checkbox` with `Root`, `Label`, `Hint`, `Error`.

### Minimal example

```tsx
import { Checkbox } from "prime-ui-kit";

export function Example() {
  return (
    <Checkbox.Root name="terms" value="yes">
      <Checkbox.Label>Accept terms</Checkbox.Label>
    </Checkbox.Root>
  );
}
```

## Rules

- Support **controlled** (`checked` + `onChange`) and **uncontrolled** (`defaultChecked`); internal state updates from the change handler before your `onChange` runs.
- **`indeterminate`** only affects visuals and the DOM `indeterminate` property; it is not a separate submitted value—clear or sync it in your handler when the user clicks.
- Set **`aria-label`** or **`aria-labelledby`** on **`Checkbox.Root`** when **`Checkbox.Label`** has no visible text (icon-only or header “select all” cell).
- **`aria-describedby`** on the root is merged with hint and error ids when those slots are mounted; include your own ids in `aria-describedby` if you need extra descriptors.
- **`variant="error"`** or a mounted **`Checkbox.Error`** sets `aria-invalid` and error styling; **`disabled`** disables the input and dims hint styling.
- Focus and keyboard activation use the native checkbox; the visible focus ring targets the decorative control via `focus-visible`.
- There is no loading or `asChild` API; **`size`** on the root does not forward to the DOM input (layout token only).

## API

### Checkbox.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"default" \| "error"` | `"default"` | no | Error-colored outline for `error`; `invalid` is also true when `Checkbox.Error` is mounted. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Box and typography scale. |
| indeterminate | `boolean` | `false` | no | Indeterminate visuals; syncs `input.indeterminate`. |
| id | `string` | auto (`useId`) | no | Stable input id; paired with `Checkbox.Label` via `htmlFor`. |
| className | `string` | — | no | Class on the field wrapper `div`. |
| checked | `boolean` | — | no | Controlled checked state. |
| defaultChecked | `boolean` | `false` | no | Initial checked state when uncontrolled. |
| onChange | `React.ChangeEventHandler<HTMLInputElement>` | — | no | Fired on toggle; internal checked state updates before this runs. |
| disabled | `boolean` | — | no | Disables the input and label row. |
| aria-describedby | `string` | — | no | Combined with hint and error ids when those slots exist. |
| children | `React.ReactNode` | — | no | Typically `Label`, optional `Hint` / `Error`. |
| ref | `React.Ref<HTMLInputElement>` | — | no | Ref to the native checkbox input. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size">` | — | no | Other native attributes forwarded to the hidden `input` (e.g. `name`, `value`, `required`, `readOnly`, `form`). `type` is always `checkbox`. |

### Checkbox.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Label text beside the box; omit for a box-only control and set an accessible name on `Root`. |
| className | `string` | — | no | Class on the label row. |
| …rest | `Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | no | Other label attributes; `htmlFor` is managed internally. |

### Checkbox.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Supplementary text below the label. |
| className | `string` | — | no | Additional class on the hint. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` is managed internally. |

### Checkbox.Error

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error message text. |
| className | `string` | — | no | Additional class on the message. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` is managed internally. |

## Related

- [Radio](../radio/COMPONENT.md) — one-of-many choice with the same validation variants.
- [Switch](../switch/COMPONENT.md) — binary setting with a different control pattern.
- [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — primitives used inside the checkbox; pair with [Input](../input/COMPONENT.md) in larger forms.
