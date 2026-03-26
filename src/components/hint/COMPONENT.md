# Hint

**Default `size`:** use **`m`** for the size axis unless the screen or field explicitly needs another tier.

## Canonical

- **`Hint`** — compact helper or status line under a control: **`Hint.Root`** (`<p>`, `data-size`, `data-variant`) and optional **`Hint.Icon`** (leading, `aria-hidden`).
- **`variant`:** **`default`** (secondary text), **`error`** (danger), **`disabled`** (muted; mirrors inactive fields — not a boolean on the root).
- **`size`:** **`s` | `m` | `l` | `xl`** — match the paired field; typography is one step smaller than the control tier (see styles).
- **No `success` variant** — positive confirmation uses **`default`** copy and tone, or another pattern (for example [Banner](../banner/COMPONENT.md)) if you need semantic success chrome.
- **A11y:** stable **`id`** on **`Hint.Root`** + **`aria-describedby`** on the input; optional **`role="alert"`** on the root for errors via **`…rest`**.
- **Prefer [Input](../input/COMPONENT.md) `hint` / `error`** when the whole field is composed with **`Input.Root`** — avoid duplicating the same line with a second **`Hint`**.

## Extended

### About

`Hint` is a compact line of helper or status text under a field: neutral copy, validation errors, or muted text for inactive inputs, with an optional leading icon.

- **When to use** — explain format rules, limits, units, or where a read-only value comes from under a single control.
- **When to use** — show validation or integration errors tied to a field without a separate notification block.
- **When to use** — after a successful action, short confirmation under the field: use **`variant="default"`** with clear copy (no dedicated success color on **`Hint`**).
- **When not to use** — as the primary name of the field; use [Label](../label/COMPONENT.md) for that.
- **When not to use** — when [Input](../input/COMPONENT.md) already takes **`hint`** / **`error`** on the root, or [Textarea](../textarea/COMPONENT.md) already includes **`Textarea.Hint`** / **`Textarea.Error`** in the same field block.
- **When not to use** — for long prose or page-level messaging; prefer dedicated content or banner patterns.

### Composition

- **`Hint.Root`** — required wrapper: a **`p`** with **`data-size`** and **`data-variant`**, wrapped in **`ControlSizeProvider`** so size cascades to the icon slot.
- **`Hint.Icon`** — optional; render as the first child of **`Hint.Root`** when you need a decorative icon before the text.
- Order: **`Hint.Root`** contains optional **`Hint.Icon`** then text (or mixed **`ReactNode`**); no other named parts.

### Scenarios (see `examples/`)

| Scenario | Approach |
|----------|----------|
| Field help | **`variant="default"`**, same **`size`** as the control, **`id`** + **`aria-describedby`**. → [`examples/field-help.tsx`](examples/field-help.tsx) |
| Error hint | **`variant="error"`**, invalid input **`aria-invalid`**, consider **`role="alert"`** if the message must interrupt. → [`examples/error-hint.tsx`](examples/error-hint.tsx) |
| Success / confirmation | Only **`default`** / **`error`** / **`disabled`** exist; use **`default`** for neutral “saved / verified” copy under the field. → [`examples/success-confirmation.tsx`](examples/success-confirmation.tsx) |
| Inline tip in a form | Stack **Label** + **Input** + **Hint** per row; optional **Hint.Icon** for scanability. → [`examples/inline-tip-form.tsx`](examples/inline-tip-form.tsx) |
| Icon + text | **`Hint.Icon`** first, then string or nodes; meaning must not rely on the icon alone. → [`examples/with-icon.tsx`](examples/with-icon.tsx) |

### Minimal example

```tsx
import { Hint } from "prime-ui-kit";

export function FieldHint() {
  return <Hint.Root>The invitation will be valid for 7 days.</Hint.Root>;
}
```

### Rules

- **Variants:** **`default`** is secondary helper text; **`error`** is for validation or failure copy; **`disabled`** matches visually inactive fields.
- **Sizing:** pick the same tier as the paired field for consistent type and icon gap.
- **Semantics:** the root is always a **`<p>`** — there is no **`asChild`** or element polymorphism.
- **Association:** give **`Hint.Root`** a stable **`id`** and point the control at it with **`aria-describedby`** so assistive tech reads the hint after the label.
- **Errors:** you may pass **`role="alert"`** or live-region attributes through **`…rest`** on **`Hint.Root`** if your form flow requires it.
- **`Hint.Icon`** is **`aria-hidden`**; do not rely on it to convey meaning without redundant text.
- **State:** text and **`variant`** are fully controlled by the parent (no built-in validation or open state).

## API

### Hint.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `HintSize` (`"s" \| "m" \| "l" \| "xl"`) | `"m"` | No | Nominal size aligned with the field. |
| variant | `"default" \| "error" \| "disabled"` | `"default"` | No | Text tone: secondary, danger, or disabled content. |
| children | `React.ReactNode` | — | No | Text; optionally include **`Hint.Icon`**. |
| className | `string` | — | No | Additional class on the root **`p`**. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Native paragraph attributes (**`id`**, **`role`**, **`aria-*`**, etc.). |

### Hint.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon markup (for example SVG). |
| className | `string` | — | No | Additional class on the wrapper **`span`**. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other attributes on the wrapper. |

## Related

- [Label](../label/COMPONENT.md) — primary field caption and **`htmlFor`** / **`id`** wiring.
- [Input](../input/COMPONENT.md) — field composition with optional built-in hint and error.
- [Textarea](../textarea/COMPONENT.md) — multiline field with the same metadata pattern where applicable.
- [Button](../button/COMPONENT.md) — actions that trigger validation and updated hint copy or **`variant`**.

## LLM note

- Export: **`import { Hint } from "prime-ui-kit"`** — **`Hint.Root`**, **`Hint.Icon`** only.
- **`HintRootProps`**: **`size?`**, **`variant?`**, **`className?`**, **`children?`**, plus **`HTMLAttributes<HTMLParagraphElement>`** (forward **`id`**, **`role`**, **`aria-*`**).
- **`variant`** literals: **`default`**, **`error`**, **`disabled`** — **no `success`**; success-style messaging = **`default`** + wording, or another component.
- **`size`** literals: **`s`**, **`m`**, **`l`**, **`xl`** — default **`m`**.
- Root DOM: **`<p>`**; **`Hint.Icon`** → **`<span aria-hidden="true">`**.
- Do not tell users to add a **`success`** **`variant`**; it does not exist on **`Hint`**.
- When **`Input.Root`** already provides **`hint`** or **`error`**, do not add a duplicate **`Hint`** for the same string.
- Pair with **`Label`** + **`Input.Root`** / **`Input.Wrapper`** / **`Input.Field`**; wire **`aria-describedby`** on **`Input.Field`** to **`Hint.Root`**’s **`id`** when hints are siblings outside **`Input`**’s built-in meta slots.
