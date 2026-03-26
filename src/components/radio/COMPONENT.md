# Radio

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A compound radio control: a field wrapper, a [Label](../label/COMPONENT.md) row with a native `input type="radio"` and decorative marker, plus optional [Hint](../hint/COMPONENT.md) and error text wired to `aria-describedby` and invalid state.

- **When to use** — exactly one choice from a set of mutually exclusive options that submit with the form (`name`, `value`, `required`).
- **When to use** — grouped options that should behave as a single native radio group (same `name` on each `Radio.Root`).
- **When to use** — hint or inline validation aligned under the label column.
- **When not to use** — multiple independent toggles or “select many” lists (prefer [Checkbox](../checkbox/COMPONENT.md)).
- **When not to use** — a single binary on/off setting where a switch matches the product language (prefer [Switch](../switch/COMPONENT.md)).
- **When not to use** — a compact segmented bar of modes in one control (prefer [Segmented control](../segmented-control/COMPONENT.md)).
- **When not to use** — you need `asChild` or fully custom markup; the marker and label row are fixed by the implementation.

## Composition

- **`Radio.Root`** — `div` with `data-size`, `data-variant`, `data-disabled`, `data-invalid`; provides context and `ControlSizeProvider` for child parts (`inputId`, hint/error ids, `describedBy`, registration for hint/error slots).
- **`Radio.Label`** — [Label](../label/COMPONENT.md) with `htmlFor` tied to the input id; contains the native `input[type=radio]`, decorative SVG rings, and optional text in a trailing column.
- **`Radio.Hint`** — optional; registers presence so its id is merged into the input’s `aria-describedby`; uses disabled hint variant when the root is `disabled`.
- **`Radio.Error`** — optional; error-styled message and registers invalid state (same as `variant="error"` on the root for styling).
- **Order:** `Root` → `Label` → `Hint` and/or `Error` when needed. Public API: `Radio` with `Root`, `Label`, `Hint`, `Error`.

### Minimal example

```tsx
import { Radio } from "prime-ui-kit";

export function Example() {
  return (
    <Radio.Root name="option" value="a">
      <Radio.Label>Option</Radio.Label>
    </Radio.Root>
  );
}
```

## Rules

- Support **controlled** (`checked` + `onChange`) and **uncontrolled** (`defaultChecked`); forward standard input change semantics from the native radio.
- Build a **group** with multiple **`Radio.Root`** instances sharing the same **`name`**; wrap in **`fieldset`** / **`legend`** when the group needs a visible or programmatic heading.
- There is **no** separate `RadioGroup` component—selection is native HTML behavior or your own controlled state.
- **`variant="error"`** or a mounted **`Radio.Error`** sets **`aria-invalid`** on the input and error styling on the root; **`disabled`** disables the input and dims the label/hint treatment.
- **`aria-describedby`** on the root is merged with hint and error ids when those slots mount.
- Set **`aria-label`** or ensure visible label text when **`Radio.Label`** has no readable children (icon-only or empty label).
- **`Radio.Root`** **`ref`** is forwarded to the **native `input`** element.
- DOM **`type`** is always **`radio`**; the design-system **`size`** prop lives on **`Radio.Root`** and does not map to the HTML `size` attribute (that key is omitted from input props).

## API

### Radio.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"default" \| "error"` | `"default"` | no | Error styling and `data-invalid` when `error` or when `Radio.Error` is mounted. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Marker, typography, and hint/error scale. |
| id | `string` | auto (`useId`) | no | Input id; paired with `Radio.Label` via `htmlFor`. |
| className | `string` | — | no | Class on the field wrapper `div`. |
| disabled | `boolean` | — | no | Disables the input and label row. |
| aria-describedby | `string` | — | no | Combined with hint and error ids when those slots exist. |
| children | `React.ReactNode` | — | no | Typically `Label`, optional `Hint` / `Error`. |
| ref | `React.Ref<HTMLInputElement>` | — | no | Ref to the native radio input. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size">` | — | no | Other native attributes on the `input` (e.g. `name`, `value`, `checked`, `defaultChecked`, `onChange`, `required`, `readOnly`, `form`). `type` is always `radio`. |

### Radio.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Label text beside the marker; omit only if an accessible name is set on the root input via remaining root props (e.g. `aria-label`). |
| className | `string` | — | no | Class on the label row. |
| …rest | `Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | no | Other label attributes; `htmlFor` and `size` come from context. |

### Radio.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Supplementary text below the label. |
| className | `string` | — | no | Additional class on the hint slot. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` is managed internally. |

### Radio.Error

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error message text. |
| className | `string` | — | no | Additional class on the error slot. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` is managed internally for `aria-describedby`. |

## Related

- [Checkbox](../checkbox/COMPONENT.md) — independent or multi-select toggles.
- [Switch](../switch/COMPONENT.md) — binary setting with a different control pattern.
- [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — primitives used inside Radio; pair with [Input](../input/COMPONENT.md) in larger forms.
- [Segmented control](../segmented-control/COMPONENT.md) — compact mode switching in one bar.
