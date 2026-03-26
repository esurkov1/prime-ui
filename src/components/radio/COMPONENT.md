# Radio

**Default `size`:** use **`m`** for the size axis unless the screen or field explicitly needs another tier.

## Canonical

- **`Radio`** — compound choice control: **`Radio.Root`** (field wrapper, `data-size`, `data-variant`, `data-disabled`, `data-invalid`), **`Radio.Label`** (native `input type="radio"` + marker + optional text), optional **`Radio.Hint`** and **`Radio.Error`** (wired into `aria-describedby` and invalid styling).
- **`variant`:** **`default`** or **`error`** on **`Radio.Root`**; mounting **`Radio.Error`** also drives invalid / `aria-invalid` for that instance.
- **`size`:** **`s` | `m` | `l` | `xl`** on **`Radio.Root`** — marker, label, and hint/error scale via context (`ControlSizeProvider`).
- **Groups:** several **`Radio.Root`** nodes share the same **`name`** (and optionally **`value` / `checked` / `onChange`**) — there is **no** separate **`RadioGroup`**; behavior is native HTML or your controlled state.
- **`Radio.Root` `ref`** is forwarded to the **native `<input type="radio">`**.
- **DOM `type`** is always **`radio`**; the design-system **`size`** prop is **not** the HTML `size` attribute (that key is omitted from input props).

## Extended

### About

A compound radio field: wrapper, label row with a native radio and decorative rings, plus optional hint and error text aligned under the label column.

- **When to use** — exactly one choice from a set of mutually exclusive options that submit with the form (`name`, `value`, `required`).
- **When to use** — options that should behave as one native radio group (same **`name`** on each **`Radio.Root`**).
- **When to use** — short helper or validation copy tied to a single option via **`Radio.Hint`** / **`Radio.Error`**.
- **When not to use** — multiple independent toggles or “select many” (prefer [Checkbox](../checkbox/COMPONENT.md)).
- **When not to use** — a single binary on/off where a switch fits the product language (prefer [Switch](../switch/COMPONENT.md)).
- **When not to use** — a compact segmented bar of modes in one control (prefer [Segmented control](../segmented-control/COMPONENT.md)).
- **When not to use** — fully custom markup or `asChild`; the marker and label row are fixed by the implementation.

### Composition

- **`Radio.Root`** — provides context (`inputId`, hint/error ids, `describedBy`, hint/error registration) and wraps children in a **`div`**.
- **`Radio.Label`** — [Label](../label/COMPONENT.md) with **`htmlFor`** tied to the input; contains the **`input`**, SVG marker, and optional **`children`** text.
- **`Radio.Hint`** — optional; registers so its id is merged into **`aria-describedby`**; uses the disabled hint variant when the root is **`disabled`**.
- **`Radio.Error`** — optional; error-styled **`Hint.Root`** and registers invalid state (same effect as **`variant="error"`** on the root for styling).
- **Order:** **`Radio.Root`** → **`Radio.Label`** → **`Radio.Hint`** and/or **`Radio.Error`** when needed. Public API: **`Radio.Root`**, **`Radio.Label`**, **`Radio.Hint`**, **`Radio.Error`**.

### Scenarios (see `examples/`)

| Scenario | Approach |
|----------|----------|
| Shipping method | **`fieldset`** + **`legend`**; shared **`name`**; **`Radio.Hint`** for delivery copy per option. → [`examples/shipping-method.tsx`](examples/shipping-method.tsx) |
| Plan picker | Controlled group: **`checked`** + **`onChange`**, same **`name`**, optional summary line. → [`examples/plan-picker.tsx`](examples/plan-picker.tsx) |
| Settings group | Themed or preference block; **`disabled`** on tier-gated options. → [`examples/settings-group.tsx`](examples/settings-group.tsx) |
| Single primary channel | One-notice policy (email vs SMS vs app); still radios, not checkboxes. → [`examples/notification-channel.tsx`](examples/notification-channel.tsx) |

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

### Rules

- Support **controlled** (`checked` + `onChange`) and **uncontrolled** (`defaultChecked`); use standard input change semantics from the native radio.
- Build a **group** with multiple **`Radio.Root`** instances sharing the same **`name`**; wrap in **`fieldset`** / **`legend`** when the group needs a visible or programmatic heading.
- **`variant="error"`** or a mounted **`Radio.Error`** sets **`aria-invalid`** on the input and error styling on that root; **`disabled`** disables the input and dims the label/hint treatment.
- **`aria-describedby`** on **`Radio.Root`** is merged with hint and error ids when those slots mount.
- Set **`aria-label`** or ensure visible label text when **`Radio.Label`** has no readable children (icon-only or empty label).

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

## LLM note

- Export: **`import { Radio } from "prime-ui-kit"`** — use **`Radio.Root`**, **`Radio.Label`**, **`Radio.Hint`**, **`Radio.Error`** only; there is **no** `RadioGroup`.
- **`RadioRootProps`**: extends **`Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">`** plus **`variant?`**, **`size?`**, **`className?`**, **`children?`**; **`ref`** → **`<input type="radio">`**.
- **`variant`** literals: **`default`**, **`error`** — error semantics also activate when **`Radio.Error`** mounts inside that **`Radio.Root`**.
- **`size`** literals: **`s`**, **`m`**, **`l`**, **`xl`** — default **`m`**.
- Grouping: repeat **`Radio.Root`** with the same **`name`**; for controlled mode, set **`checked`/`onChange`** (or **`defaultChecked`**) consistently across the group.
- Do not invent a **`Radio.Group`** wrapper — it is not part of the API.
- Per-root context: **`Radio.Error`** / **`variant="error"`** affect **that** instance’s input **`aria-invalid`** and wrapper **`data-invalid`**; for a whole-group message, either mirror **`variant="error"`** on each root in the group or add separate page-level copy as required by your form pattern.
- Examples under **`src/components/radio/examples/`** import **`"prime-ui-kit"`** so they match consumer apps after **`npm install prime-ui-kit`**.
