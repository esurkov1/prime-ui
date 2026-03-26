# Textarea

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A composite multiline field: native `textarea` inside a bordered `label`, optional footer for a character counter, and optional hint or error lines below wired through `aria-describedby`.

**When to use**

- Long or growing text in forms, feedback, notes, descriptions, and comments where a single line is not enough.
- Flows that need a built-in counter, hint, or error message aligned with the same sizing scale as other controls.
- Layouts where auto-growing height (`autoResize`) should track content without manual `rows` tuning.

**When not to use**

- Single-line values — use [Input](../input/COMPONENT.md).
- Rich text or embedded formatting — use a dedicated editor component.
- When the visible label must sit only above the chrome — pair [Label](../label/COMPONENT.md) with a stable `id` on `Textarea.Root` and avoid nesting a second `label`.

## Composition

- **`Textarea.Root`** — outer `div` (`field`) with `data-size`, `TextareaProvider`, and `ControlSizeProvider`. The native `textarea` sits inside a `label` (`htmlFor` → input id) with the bordered `control` styling; when `autoResize` is true, the textarea is wrapped so `data-value` can drive height.
- **`Textarea.CharCounter`** — must be a **direct** child of `Root`; implementation partitions children by reference equality to `Textarea.CharCounter` and renders matching nodes in the control footer.
- **`Textarea.Hint`** / **`Textarea.Error`** — direct children of `Root`, **not** passed as `CharCounter`; they render after the `label` and register ids merged into the textarea’s `aria-describedby`.

### Minimal example

```tsx
import { Textarea } from "prime-ui-kit";

export function Example() {
  return <Textarea.Root placeholder="Notes" />;
}
```

## Rules

- **Controlled vs uncontrolled:** pass **`value`** with **`onChange`** / **`onInput`** as needed for controlled text; omit **`value`** and optionally set **`defaultValue`** for uncontrolled usage.
- **`autoResize`** defaults to **`true`**: input events update a wrapper `data-value` mirror; set **`autoResize={false}`** to rely on fixed height / native resize behavior.
- **`variant="error"`** or mounting **`Textarea.Error`** sets invalid styling; **`aria-invalid`** defaults from that unless overridden.
- **`aria-describedby`** you pass is **merged** with auto-added hint and error ids (your ids first, then hint and error when those parts mount).
- **`disabled`** / **`readOnly`** on `Root` flow to the native textarea; **`Textarea.Hint`** switches to a disabled visual variant when either is true.
- Do not pass **`size`** as a DOM attribute on the textarea — it is omitted from the element API and reserved for **`Textarea.Root`** (`"s"` \| `"m"` \| `"l"` \| `"xl"`).
- **`Textarea.CharCounter`** is only recognized as an immediate child of **`Root`**; arbitrary wrappers around it will not land in the footer.
- Counter overflow (**`current` > `max`**) sets **`data-overflow="true"`** on the counter for styling; it does not block typing by itself (pair with **`maxLength`** if you need a hard cap).
- The counter uses **`aria-live="polite"`** so count updates do not interrupt typing.
- There is no **`asChild`** or polymorphic root — structure is fixed.

## API

### Textarea.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| variant | `"default" \| "error"` | `"default"` | no | Visual invalid emphasis; combines with `aria-invalid` and `Textarea.Error` registration. |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Control scale (padding, type, min height). |
| autoResize | `boolean` | `true` | no | When true, height follows content via wrapper `data-value`; when false, no auto-grow wrapper. |
| id | `string` | from `useId()` | no | Stable id for the textarea; `label` uses `htmlFor` pointing here. |
| className | `string` | — | no | Class on the bordered `label` (`control`). |
| disabled | `boolean` | — | no | Native disabled state. |
| readOnly | `boolean` | — | no | Native read-only state. |
| value | `string` | — | no | Controlled value. |
| defaultValue | `string` | — | no | Uncontrolled initial value. |
| onInput | `React.FormEventHandler<HTMLTextAreaElement>` | — | no | Fires after internal `data-value` sync when `autoResize` is on. |
| aria-describedby | `string` | — | no | Merged with hint/error ids when those parts mount. |
| aria-invalid | `Booleanish` | from variant / error | no | Explicit invalidity over heuristics. |
| children | `React.ReactNode` | — | no | `CharCounter` in the footer; `Hint` / `Error` after the `label`. |
| …rest | `Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">` | — | no | Standard textarea attributes (`placeholder`, `rows`, `maxLength`, `required`, `onChange`, `name`, etc.). |

### Textarea.CharCounter

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| current | `number` | — | yes | Current character count. |
| max | `number` | — | yes | Displayed limit; overflow when `current > max` sets `data-overflow="true"`. |

### Textarea.Hint

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Hint copy. |
| className | `string` | — | no | Extra class on the underlying `Hint.Root`. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` comes from context. |

### Textarea.Error

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Error copy. |
| className | `string` | — | no | Extra class on the underlying `Hint.Root`. |
| …rest | `Omit<React.HTMLAttributes<HTMLParagraphElement>, "id">` | — | no | Paragraph attributes; `id` comes from context. |

## Related

- [Input](../input/COMPONENT.md)
- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
