# Textarea

**Default sizing:** when designing screens and examples, start with **`m`** for `size` wherever a size axis exists unless the scenario explicitly needs another value.

## Canonical

- **Purpose:** multiline text with optional in-control **character counter**, and optional **hint** or **error** below, wired through **`aria-describedby`** on the native **`textarea`**.
- **Skeleton vs Input:** unlike [Input](../input/COMPONENT.md) (`Root` → `Wrapper` → **`Field`**), **Textarea** uses a single **`Textarea.Root`**: an outer **`.field`** stack wraps a bordered **`label`** (the field chrome) that owns the native **`<textarea>`**—there is **no** separate `Textarea.Field` export; pass standard textarea attributes on **`Root`**.
- **Children:** **`Textarea.CharCounter`** only as a **direct** child of **`Root`** (footer inside the chrome). **`Textarea.Hint`** / **`Textarea.Error`** as direct children **after** that chrome (siblings of the inner `label`, not wrapped around `CharCounter`).
- **Size:** `size` ∈ `s | m | l | xl` only on **`Textarea.Root`**; the HTML **`size`** attribute is omitted from the public typing (reserved).
- **Scenario grid:** see [**Scenarios (playground + `examples/`)**](#scenarios-playground--examples) below — order matches **`playground/sections/TextareaSection.tsx`** and **`playground/snippets/textarea/*.tsx`**.

```tsx
import { Textarea } from "prime-ui-kit";

export function Example() {
  return (
    <Textarea.Root placeholder="Notes" name="notes">
      <Textarea.Hint>Optional hint below the field.</Textarea.Hint>
    </Textarea.Root>
  );
}
```

## Extended

### About

A composite multiline field: native `textarea` inside bordered field chrome, optional footer for a character counter, and optional hint or error lines below wired through `aria-describedby`.

**When to use**

- Long or growing text in forms, feedback, notes, descriptions, and comments where a single line is not enough.
- Flows that need a built-in counter, hint, or error message aligned with the same sizing scale as other controls.
- Layouts where auto-growing height (`autoResize`) should track content without manual `rows` tuning.

**When not to use**

- Single-line values — use [Input](../input/COMPONENT.md).
- Rich text or embedded formatting — use a dedicated editor component.
- When the visible label must sit only above the chrome — pair [Label](../label/COMPONENT.md) with a stable **`id`** on **`Textarea.Root`** (see [`./examples/02-comment.tsx`](./examples/02-comment.tsx)); do not nest a second `label` around the control.

### Composition

- **`Textarea.Root`** — outer `div` (`.field`) with `data-size`, `TextareaProvider`, and `ControlSizeProvider`. The native `textarea` sits inside a `label` (`htmlFor` → input id) with bordered `.control` styling; when `autoResize` is true, the textarea is wrapped so `data-value` can drive height.
- **`Textarea.CharCounter`** — must be a **direct** child of `Root`; implementation partitions children by reference equality to `Textarea.CharCounter` and renders matching nodes in the control footer.
- **`Textarea.Hint`** / **`Textarea.Error`** — direct children of `Root`, **not** passed as `CharCounter`; they render after the `label` and register ids merged into the textarea’s `aria-describedby`.

### Scenarios (playground + `examples/`)

Live demos use **`playground/snippets/textarea/*.tsx`** (see **`playground/sections/TextareaSection.tsx`**). The table lists the same scenarios with package-oriented copies under **`examples/`** (aligned with those snippets; order matches the playground section).

| Scenario | What it shows | `examples/` |
|----------|---------------|-------------|
| Sizes | Four **`size`** values (`s`–`xl`), each field with a **`Textarea.Hint`** naming the tier. | [`examples/sizes.tsx`](examples/sizes.tsx) |
| Variants | **`variant="default"`** vs **`variant="error"`** with **`Textarea.Error`** (`aria-describedby`, invalid styling). | [`examples/variants.tsx`](examples/variants.tsx) |
| States | Hint, **`disabled`**, **`readOnly`**, and native **`required`** on the textarea. | [`examples/states.tsx`](examples/states.tsx) |
| Controlled | Parent **`value`** / **`onChange`**; live length in **`Textarea.Hint`**. | [`examples/controlled.tsx`](examples/controlled.tsx) |
| Composition | **`Typography`** section title, counter + hint, second root with **`Textarea.Error`**. | [`examples/composition.tsx`](examples/composition.tsx) |
| Full width | Narrow card-style parent; root spans the track (**`width: 100%`**, **`min-width: 0`** on `.field`). | [`examples/full-width.tsx`](examples/full-width.tsx) |
| Features | Default **`autoResize`**, **`autoResize={false}`**, **`CharCounter`**, **`data-overflow`**, **`maxLength`** + counter. | [`examples/features.tsx`](examples/features.tsx) |

### Additional narrative examples

- [`./examples/01-support-ticket.tsx`](./examples/01-support-ticket.tsx) — Support form: long description with counter, hint, and **`maxLength`** cap.
- [`./examples/02-comment.tsx`](./examples/02-comment.tsx) — Order comment: **Label** + **`Textarea.Root`** with shared **`id`**, counter, and logistics hint.

**LLM note:** Prefer reading the runnable files under `./examples/*.tsx` for full scenarios, prop combinations, and composition patterns; this page keeps the contract (rules + API tables) authoritative.

### Rules

- **Controlled vs uncontrolled:** pass **`value`** with **`onChange`** / **`onInput`** as needed for controlled text; omit **`value`** and optionally set **`defaultValue`** for uncontrolled usage.
- **`autoResize`** defaults to **`true`**: input events update a wrapper `data-value` mirror; set **`autoResize={false}`** to rely on fixed height / native resize behavior.
- **`variant="error"`** or mounting **`Textarea.Error`** sets invalid styling; **`aria-invalid`** defaults from that unless overridden.
- **`aria-describedby`** you pass is **merged** with auto-added hint and error ids (your ids first, then hint and error when those parts mount).
- **`disabled`** / **`readOnly`** on `Root` flow to the native textarea; **`Textarea.Hint`** switches to a disabled visual variant when either is true.
- Do not pass **`size`** as a DOM attribute on the textarea — it is omitted from the element API and reserved for **`Textarea.Root`** (`"s"` \| `"m"` \| `"l"` \| `"xl"`).
- **`Textarea.CharCounter`** is only recognized as an immediate child of **`Root`**; arbitrary wrappers around it will not land in the footer.
- Counter overflow (**`current` > `max`**) sets **`data-overflow="true"`** on the counter for styling; it does not block typing by itself (pair with **`maxLength`** if you need a hard cap).
- The counter uses **`aria-live="polite"`** so count updates do not interrupt typing.
- **Full width:** the `.field` root uses **`width: 100%`** and **`min-width: 0`** (same idea as Input). Place **`Textarea.Root`** inside a parent that spans the desired column or card width.
- There is no **`asChild`** or polymorphic root — structure is fixed.

### API

#### Textarea.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"default" \| "error"` | `"default"` | no | Visual invalid emphasis; combines with `aria-invalid` and `Textarea.Error` registration. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Control scale (padding, type, min height). |
| autoResize | `boolean` | `true` | no | When true, height follows content via wrapper `data-value`; when false, no auto-grow wrapper. |
| id | `string` | `useId()` | no | Stable id for the textarea; outer `label` uses `htmlFor` pointing here. |
| className | `string` | — | no | Extra class on the visible field shell: bordered **`label`** (`.control`) with state **`data-*`** attributes. |
| disabled | `boolean` | — | no | Native disabled state. |
| readOnly | `boolean` | — | no | Native read-only state. |
| value | `string` | — | no | Controlled value. |
| defaultValue | `string` | — | no | Uncontrolled initial value. |
| onInput | `React.FormEventHandler<HTMLTextAreaElement>` | — | no | Fires after internal `data-value` sync when `autoResize` is on. |
| aria-describedby | `string` | — | no | Merged with hint/error ids when those parts mount. |
| aria-invalid | `Booleanish` | from variant / error | no | Explicit invalidity over heuristics. |
| children | `React.ReactNode` | — | no | `CharCounter` in the footer; `Hint` / `Error` after the `label`. |
| …rest | `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">` | — | no | Standard textarea attributes (`placeholder`, `rows`, `maxLength`, `required`, `onChange`, `onInput`, `name`, `autoComplete`, etc.). |

#### Textarea.CharCounter

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| current | `number` | — | yes | Current character count. |
| max | `number` | — | yes | Displayed limit; overflow when `current > max` sets `data-overflow="true"`. |

#### Textarea.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Hint copy. |
| className | `string` | — | no | Extra class on the underlying `Hint.Root`. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` comes from context. |

#### Textarea.Error

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error copy. |
| className | `string` | — | no | Extra class on the underlying `Hint.Root`. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` comes from context. |

## Related

- [Input](../input/COMPONENT.md)
- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
