# Switch

**Default `size`:** `m` on the size axis unless the scenario explicitly needs another value.

## About

A compound on/off control: a native `input type="checkbox"` with `role="switch"`, a visual track and thumb, and optional slots for label text, hint, and error wired through `aria-describedby` and invalid state.

- **Use** for binary settings (notifications, feature flags, billing options, consent) where the UI should read as on/off rather than a small checkbox in a list.
- **Use** when forms need `name`, `value`, or `required` on the underlying input together with hint or error copy under the label column.
- **Use** for a single independent toggle per row; state is obvious from the thumb position and `aria-checked`.
- **Do not use** for picking exactly one option from mutually exclusive alternatives (prefer [Radio](../radio/COMPONENT.md)).
- **Do not use** for lists with partial selection or an **indeterminate** state (prefer [Checkbox](../checkbox/COMPONENT.md)).
- **Do not use** when you need `asChild` or fully custom markup; the structure is fixed to `Switch.*` parts and [Label](../label/COMPONENT.md) / [Hint](../hint/COMPONENT.md) primitives.

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

### Canonical example (full shell)

Use this when you want label text, a hint under the text column, and default **`size="m"`**. Always compose **`Switch.Label`** (and optional **`Switch.Hint`**) as **`children`** of **`Switch.Root`** — the **`label`** prop on **`Root`** is not rendered.

```tsx
import { Switch } from "prime-ui-kit";

export function ProductUpdatesSwitch() {
  return (
    <Switch.Root size="m" defaultChecked name="product_updates">
      <Switch.Label>Product updates</Switch.Label>
      <Switch.Hint>
        At most one email per week. You can change this anytime in notification settings.
      </Switch.Hint>
    </Switch.Root>
  );
}
```

Source of truth (stays in sync with the snippet above): `examples/canonical-maximal.tsx`.

### Examples (source)

Runnable demos live next to this file (workspace imports use `@/`; published consumers use `prime-ui-kit`):

| File | Intent |
|------|--------|
| `examples/canonical-maximal.tsx` | Full shell: **`Switch.Label`** + **`Switch.Hint`**, **`size="m"`** |
| `examples/scenario-settings-toggle.tsx` | Settings: several independent toggles in a **`fieldset`** |
| `examples/scenario-feature-flag.tsx` | Controlled flag: **`checked`** / **`onCheckedChange`** + rollout copy |
| `examples/scenario-billing-annual.tsx` | Billing: annual vs monthly as one switch with dynamic hint |
| `examples/scenario-form-consent.tsx` | Form: **`name`**, **`required`**, **`FormData`** on submit |

Playground composition demos (broader states and Russian copy): `playground/snippets/switch/`.

### Extended usage

- **Controlled:** pass **`checked`** with **`onCheckedChange`**. **Uncontrolled:** use **`defaultChecked`** (defaults to **`false`**). Do not rely on **`onChange`** on **`Root`** for the boolean API — use **`onCheckedChange`**.
- **`readOnly`** blocks toggling via **`preventDefault`** in the internal handler; **`aria-readonly`** is set on the input.
- **Invalid / error:** mount **`Switch.Error`** and/or set **`variant="error"`** on **`Root`**; **`aria-invalid`** and error styling follow context.
- **`aria-describedby`** on **`Root`** merges with hint and error ids when those slots are mounted; append your own ids on **`Root`** if you need extra descriptors.
- **`Switch.Label`** with no visible **`children`** leaves only the track — supply **`aria-label`** / **`aria-labelledby`** on **`Root`** (or nearby visible text) for an accessible name.
- **Grouping settings:** prefer a **`fieldset`** + **`legend`** over **`role="group"`** when several switches belong to one preference block.
- There is no **indeterminate** or **loading** state; keyboard and focus use the native switch pattern with **`focus-visible`** on the track.

### Note for LLMs

When generating **Switch** markup for this library: (1) Always include **`Switch.Label`** as a **child** of **`Switch.Root`** — **`Root`** does not render the **`label`** prop. (2) Use **`onCheckedChange`**, not **`onChange`**, for controlled on/off updates. (3) For controlled mode, pair **`checked`** with **`onCheckedChange`**; for forms, forward **`name`**, **`required`**, and other input attributes on **`Root`** (they go to the native **`input`**). (4) Order parts **`Root`** → **`Label`** → optional **`Hint`** / **`Error`**. (5) Do not wrap kit parts to restyle them; use **`size`**, **`variant`**, and documented props only. (6) Start from **`examples/canonical-maximal.tsx`**, then adapt **`scenario-*.tsx`** files for settings, feature flags, billing, and forms.

## Rules

- **Controlled:** **`checked`** + **`onCheckedChange`**. **Uncontrolled:** **`defaultChecked`**.
- **`readOnly`** prevents value changes on user interaction; **`aria-readonly`** is set.
- **`variant="error"`** or mounted **`Switch.Error`** sets **`invalid`**, **`aria-invalid`**, and error styling; **`disabled`** disables the input and adjusts hint styling.
- The public props type includes **`label?: React.ReactNode`**, but **`Root`** does not render it — compose **`Switch.Label`** as **`children`**.
- **`size`** on **`Root`** drives layout tokens only; it is not a DOM **`size`** attribute on the **`input`**.

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
