# Switch

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A compound on/off control: a native `input type="checkbox"` with `role="switch"`, a visual track and thumb, and optional slots for label text, hint, and error wired through `aria-describedby` and invalid state.

- **When to use** — binary settings (notifications, feature flags, consent) where the UI should read as on/off rather than a small checkbox in a list.
- **When to use** — forms that need `name`, `value`, or `required` on the underlying input together with hint or error copy under the label column.
- **When to use** — a single independent toggle per row; state is obvious from the thumb position and `aria-checked`.
- **When not to use** — picking exactly one option from mutually exclusive alternatives (prefer [Radio](../radio/COMPONENT.md)).
- **When not to use** — lists with partial selection or an **indeterminate** state (prefer [Checkbox](../checkbox/COMPONENT.md)).
- **When not to use** — you need `asChild` or fully custom markup; the structure is fixed to `Switch.*` parts and [Label](../label/COMPONENT.md) / [Hint](../hint/COMPONENT.md) primitives.

## Composition

- **`Switch.Root`** — field wrapper `div` with `data-size`, `data-variant`, `data-disabled`, `data-invalid`, `data-checked`, `data-readonly`; provides context and **`ControlSizeProvider`** for child parts. Renders **`children` only** (no shortcut that replaces **`Switch.Label`**).
- **`Switch.Label`** — **`Label.Root`** row: the native switch **`input`**, the decorative **`track`**, and optional label copy; **`htmlFor`** / **`size`** come from context; **`ref`** on **`Root`** is forwarded to this **`input`**.
- **`Switch.Hint`** — optional; registers hint text and contributes its id to **`aria-describedby`**; uses a dimmed hint variant when the field is **`disabled`**.
- **`Switch.Error`** — optional; error-styled **[Hint](../hint/COMPONENT.md)** and registers invalid state when mounted (with **`variant="error"`** on **`Root`** when you want error chrome without the slot).
- **Order:** **`Root`** → **`Label`** (required for the control to exist) → **`Hint`** / **`Error`** below when needed. Public API: **`Switch`** with **`Root`**, **`Label`**, **`Hint`**, **`Error`**.

### Minimal example

```tsx
import { Switch } from "prime-ui-kit";

export function Example() {
  return (
    <Switch.Root defaultChecked name="reminders">
      <Switch.Label>Deadline reminders</Switch.Label>
    </Switch.Root>
  );
}
```

## Rules

- **Controlled:** pass **`checked`** with **`onCheckedChange`**. **Uncontrolled:** use **`defaultChecked`** (defaults to **`false`**). User toggles run through the internal change handler; **`onChange`** on **`Root`** is not the switch API—use **`onCheckedChange`** only.
- **`readOnly`** calls **`preventDefault`** in the change handler so the value does not change on click; **`aria-readonly`** is set on the input.
- **`variant="error"`** or a mounted **`Switch.Error`** sets **`invalid`** in context, **`aria-invalid`** on the input, and error styling; **`disabled`** disables the input and adjusts hint styling.
- **`aria-describedby`** on **`Root`** is merged with hint and error ids when those slots are mounted; add your own ids in **`aria-describedby`** if you need extra descriptors.
- **`Switch.Label`** with no visible **`children`** leaves only the track; set an accessible name with **`aria-label`** or **`aria-labelledby`** on **`Root`** (or ensure context from nearby text).
- The public props type includes **`label?: React.ReactNode`**, but **`Root`** does not render it as **`Switch.Label`**—always compose **`Switch.Label`** (and optional **`Hint`** / **`Error`**) as **`children`**.
- Keyboard and role follow the native checkbox pattern with **`role="switch"`** and **`aria-checked`**; focus visibility uses **`focus-visible`** on the track.
- There is no **indeterminate** or **loading** state; **`size`** on **`Root`** drives layout tokens, not a DOM **`size`** attribute on the input.

## API

### Switch.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Track and thumb scale from switch tokens. |
| variant | `"default" \| "error"` | `"default"` | no | Error styling; **`invalid`** is also true when **`Switch.Error`** is mounted. |
| checked | `boolean` | — | no | Controlled on state. |
| defaultChecked | `boolean` | `false` | no | Initial on state when uncontrolled. |
| onCheckedChange | `(checked: boolean) => void` | — | no | Called after the checked value changes from user input. |
| disabled | `boolean` | — | no | Disables the input; **`data-disabled`** on the field root. |
| readOnly | `boolean` | — | no | Prevents toggling; **`data-readonly`** and **`aria-readonly`**. |
| label | `React.ReactNode` | — | no | Present on the type only; not used to render **`Switch.Label`**—compose **`Switch.Label`** as a child instead. |
| id | `string` | auto (`useId`) | no | Stable input id; paired with **`Switch.Label`** via **`htmlFor`**. |
| className | `string` | — | no | Class on the field wrapper **`div`**. |
| aria-describedby | `string` | — | no | Combined with hint and error ids when those slots exist. |
| children | `React.ReactNode` | — | no | Typically **`Switch.Label`** and optional **`Switch.Hint`** / **`Switch.Error`**. |
| ref | `React.Ref<HTMLInputElement>` | — | no | Ref to the native **`input`**. |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange">` | — | no | Other native attributes forwarded to the **`input`** (e.g. **`name`**, **`value`**, **`required`**, **`autoFocus`**, **`aria-*`**). **`type`** is always **`checkbox`**. |

### Switch.Label

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | no | Text beside the switch; omit only when an accessible name is provided elsewhere. |
| className | `string` | — | no | Class on the label row. |
| …rest | `Omit<React.HTMLAttributes<HTMLLabelElement>, "htmlFor" \| "size">` | — | no | Other label attributes; **`htmlFor`** and **`size`** are managed internally. |

### Switch.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Supplementary text below the label. |
| className | `string` | — | no | Class on the hint slot. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; **`id`** is managed internally. |

### Switch.Error

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error message text. |
| className | `string` | — | no | Class on the error block. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; **`id`** is managed internally. |

## Related

- [Checkbox](../checkbox/COMPONENT.md) — groups, **indeterminate**, and checkbox semantics.
- [Radio](../radio/COMPONENT.md) — one selected option from a set.
- [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — primitives inside the switch; pair with [Input](../input/COMPONENT.md) in larger forms.
