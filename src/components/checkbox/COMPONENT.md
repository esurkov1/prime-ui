# Checkbox

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## Canonical

- **Export:** `Checkbox` namespace — **`Checkbox.Root`**, **`Checkbox.Label`**, **`Checkbox.Hint`**, **`Checkbox.Error`**.
- **Pattern:** compound field — native **`input type="checkbox"`** (visually hidden) + decorative box; **`Checkbox.Label`** is required for the interactive row and wires **`htmlFor`** to the input id.
- **State:** **controlled** (`checked` + `onChange`) or **uncontrolled** (`defaultChecked`); internal checked state updates before consumer **`onChange`** runs.
- **`indeterminate`:** boolean on **`Root`** — sets DOM **`input.indeterminate`** and mixed visual; not a third form value — clear or resync in your **`onChange`** when the user toggles.
- **Sizing:** **`size`** `s` | `m` | `l` | `xl` on **`Root`** (default **`m`**); propagates via **`ControlSizeProvider`** to label/hint typography.
- **Validation chrome:** **`variant="error"`** on **`Root`** and/or mounted **`Checkbox.Error`** → **`aria-invalid`**, error styling; **`Checkbox.Hint`** contributes to **`aria-describedby`** when mounted.
- **Forwarding:** **`Root`** accepts **`Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size">`** spread onto the real input — use **`name`**, **`value`**, **`required`**, **`form`**, etc. Ref on **`Root`** targets the **input** element.
- **Not supported:** **`asChild`**, loading state, or custom checkbox markup.

## Extended

### About

A compound checkbox: a visually hidden native `input type="checkbox"`, a decorative box with check or indeterminate mark, and optional label, hint, and error text wired to `aria-describedby` and invalid state.

- **When to use** — explicit consent, terms, or other “yes/no” fields that submit with the form (`name`, `value`, `required`); row or “select all” patterns where the parent shows **indeterminate** when only some children are checked; independent toggles (feature flags, optional features, settings) rather than one-of-many choices; hint text or inline validation aligned under the label column.
- **When not to use** — exactly one option from a set of alternatives (prefer [Radio](../radio/COMPONENT.md)); a single binary setting where a switch fits the product language (prefer [Switch](../switch/COMPONENT.md)); you need `asChild` or fully custom markup; the control is a fixed [Label](../label/COMPONENT.md) row with a hidden input and SVG.

### Playground snippets

Demos match **`playground/sections/CheckboxSection.tsx`** (order and intent). Sources use `@/` imports under **`playground/snippets/checkbox/`**:

| Block | File | What it shows |
|-------|------|----------------|
| **Sizes** | [`sizes.tsx`](../../../playground/snippets/checkbox/sizes.tsx) | **`size`** **`s`**, **`m`**, **`l`**, **`xl`** — box, gap, and label scale from control tokens. |
| **Variants** | [`variants.tsx`](../../../playground/snippets/checkbox/variants.tsx) | **`variant="default"`** vs **`variant="error"`**; mounting **`Checkbox.Error`** also drives invalid (see **Composition** + recipes). |
| **States** | [`states.tsx`](../../../playground/snippets/checkbox/states.tsx) | Unchecked, **`defaultChecked`**, **`indeterminate`**, native **`required`**, **`disabled`** (off and on). |
| **Controlled** | [`controlled.tsx`](../../../playground/snippets/checkbox/controlled.tsx) | **`checked`** + **`onChange`**; **`indeterminate`** from parent state cleared on user change (table “select all” pattern). |
| **Composition** | [`composition.tsx`](../../../playground/snippets/checkbox/composition.tsx) | **`Hint`** only; **`Error`** without **`variant="error"`** on root; full **`Hint`** + **`Error`** with **`variant="error"`**. |
| **Full width** | [`full-width.tsx`](../../../playground/snippets/checkbox/full-width.tsx) (+ [`full-width.module.css`](../../../playground/snippets/checkbox/full-width.module.css)) | Narrow container: field root is **`width: 100%`**; long label wraps in the text column; hint aligned under label. |
| **Specific** | [`specific.tsx`](../../../playground/snippets/checkbox/specific.tsx) | Empty **`Checkbox.Label`** with **`aria-label`** on **`Root`**; **`name`** / **`value`** / **`defaultChecked`** for form submit. |

### Scenarios (recipes)

| Scenario | Approach |
|----------|----------|
| **Terms acceptance** | **`required`** on **`Root`**; optional **`Checkbox.Hint`** for legal context; show **`Checkbox.Error`** or **`variant="error"`** after validation when unchecked. → [`examples/terms-acceptance.tsx`](examples/terms-acceptance.tsx) |
| **Feature flags list** | One **`Checkbox.Root` per flag**; independent **controlled** booleans or a small state map; no indeterminate unless a parent “enable all” exists. → [`examples/feature-flags-list.tsx`](examples/feature-flags-list.tsx) |
| **Bulk select (row / table)** | **Header** checkbox: **`checked`** when all rows selected, **`indeterminate`** when some; **`onChange`** selects or clears all row ids. **Row** checkboxes toggle one id each. → [`examples/bulk-select-rows.tsx`](examples/bulk-select-rows.tsx) |
| **Settings panel** | Stack of **`Root` → `Label` → optional `Hint`** rows; same **`size`** across the panel for rhythm; **`disabled`** for plan-gated options. → [`examples/settings-panel.tsx`](examples/settings-panel.tsx) |
| **Empty label + form attrs** | Icon-only / compact cell: **`aria-label`** (or **`aria-labelledby`**) on **`Root`**; optional **`name`** / **`value`** for submission. → [`examples/empty-label-form.tsx`](examples/empty-label-form.tsx) |

Runnable recipe examples use **`prime-ui-kit`** imports under **`examples/`**. Snippet-level demos (internal imports) are listed in **Playground snippets** above.

### Composition

- **`Checkbox.Root`** — wraps the field in a `div` with `data-size`, `data-variant`, `data-disabled`, `data-invalid`, `data-checked`, `data-indeterminate`; provides context and `ControlSizeProvider` for child parts.
- **`Checkbox.Label`** — required for the control: hosts the native checkbox and decorative SVG, then optional text in a trailing column; sets `htmlFor` to the input id.
- **`Checkbox.Hint`** — optional; registers hint text and contributes its id to the input’s `aria-describedby`.
- **`Checkbox.Error`** — optional; error-styled [Hint](../hint/COMPONENT.md) and registers invalid state when mounted (with `variant="error"` on the root when you want error chrome without the slot).
- **Order:** `Root` → `Label` (always) → `Hint` / `Error` below when needed.

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

### Rules

- Vertical rhythm between **label and hint** is owned by the component; avoid inserting extra [Typography](../typography/Typography.tsx) between them unless the design explicitly requires a different reading role.
- **`indeterminate`** only affects visuals and the DOM `indeterminate` property; it is not a separate submitted value—clear or sync it in your handler when the user clicks.
- Set **`aria-label`** or **`aria-labelledby`** on **`Checkbox.Root`** (forwarded to the input via rest props) when **`Checkbox.Label`** has no visible text (icon-only or compact “select all” cell).
- **`aria-describedby`** on **`Root`** is merged with hint and error ids when those slots are mounted; include your own ids in `aria-describedby` if you need extra descriptors.
- **`variant="error"`** or a mounted **`Checkbox.Error`** sets `aria-invalid` and error styling; **`disabled`** disables the input and dims hint styling.
- Focus and keyboard activation use the native checkbox; the visible focus ring targets the decorative control via `focus-visible`.
- There is no loading or `asChild` API; **`size`** on the root does not forward as a DOM attribute on the wrapper (layout/visual token axis only).

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

## LLM note

- Prefer **`Checkbox.Label`** with visible text; if the label slot is empty or icon-only, set **`aria-label`** (or **`aria-labelledby`**) via **`Checkbox.Root`** rest props so the native input has a name.
- **`indeterminate`** is purely visual + DOM hinting — parent “select all” logic must derive **`checked`** / **`indeterminate`** from child selection state and normalize **`onChange`** (e.g. indeterminate click → select all).
- Use **`Checkbox.Error`** or **`variant="error"`** for validation feedback; mounting **`Checkbox.Error`** registers invalid state even without **`variant`** on **`Root`**.
- Do not substitute **Radio** or **Switch** based on “sounds nicer” — **Radio** is for mutually exclusive options; **Switch** for settings that read as on/off system toggles.
- Keep composition order **`Root` → `Label` → `Hint`/`Error`**; refs on **`Root`** attach to the **`<input>`**, not the wrapper `div`.
