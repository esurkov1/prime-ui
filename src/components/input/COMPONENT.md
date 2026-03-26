# Input

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

A composite single-line text field: optional label row outside the control, a bordered wrapper around the native `input`, and optional icons or text affixes inside the row. Hint and error text render below via the shared Hint primitive.

**When to use**

- Single-line text, email, password, search, tel, number, and other native `input` types in forms, filters, and settings.
- Fields that need a built-in label, optional secondary header text, hint, or error line tied to the input id.
- Dense layouts where `Input.Icon`, `Input.Affix`, or `Input.InlineAffix` clarify format (URL prefix, currency, search glyph) without extra wrappers.

**When not to use**

- Multiline or auto-growing text — use [Textarea](../textarea/COMPONENT.md).
- Fixed-length codes split into cells or heavy masking — use [DigitInput](../digit-input/COMPONENT.md) or app-level logic.
- When the label must be fully decoupled from the field chrome — consider [Label](../label/COMPONENT.md) plus a minimal field pattern instead of `label` on Root.

## Composition

- **`Input.Root`** — outer `div` with `data-size`, context provider, and `ControlSizeProvider`. Optional header: `label` (`htmlFor` → input id) and `optionalLabel`. Children (usually **`Input.Wrapper`**) sit between header and meta. If `hint` or `error` is set, a meta block renders **`Hint.Root`** rows for each.
- **`Input.Wrapper`** — flex row with field border and background; `data-size` and `data-has-error` come from context. Place **`Input.Field`**, **`Input.Icon`**, **`Input.Affix`**, and **`Input.InlineAffix`** inside in the order your layout needs.
- **`Input.Field`** — the actual `<input>`; receives `id`, merged `aria-describedby`, and `aria-invalid` from context.
- **`Input` namespace** — `Root`, `Wrapper`, `Field`, `Icon`, `Affix`, `InlineAffix`. **`useInputContext`** is exported for custom inner pieces that must align with the same size and ids.

### Minimal example

```tsx
import { Input } from "prime-ui-kit";

export function Example() {
  return (
    <Input.Root>
      <Input.Wrapper>
        <Input.Field />
      </Input.Wrapper>
    </Input.Root>
  );
}
```

## Rules

- Use **`Input.Root`** `size` for control sizing; **`Input.Field`** omits the HTML `size` attribute (it is stripped from props) — do not rely on passing `size` to the native input.
- Passing **`error`** on Root sets **`hasError`** internally for visuals and `aria-invalid`; you may set **`hasError`** alone for validation without message text.
- Controlled usage: pass **`value`** / **`onChange`** (and related) on **`Input.Field`**. Uncontrolled: omit **`value`** and optionally use **`defaultValue`**.
- Prefer Root **`label`** for the common case; if there is no visible label, set **`aria-label`** or **`aria-labelledby`** on **`Input.Field`**.
- **`Input.Icon`**, **`Input.Affix`**, and **`Input.InlineAffix`** are **`aria-hidden`**; do not rely on them for the accessible name. You may append ids to **`aria-describedby`** on **`Input.Field`**; values merge with hint/error ids from context.
- Set **`id`** on Root when you need a stable input id (e.g. tests or external `htmlFor`). Otherwise an id is generated in **`useFieldIds`**.
- There is no separate **`variant`** prop: visual error state comes from **`error`** / **`hasError`**. Behavioral differences use native attributes on **`Input.Field`** (`type`, `autoComplete`, `inputMode`, `pattern`, `maxLength`, `disabled`, `readOnly`, **`required`**, etc.).

## API

### Input.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | no | Control size from `--prime-sys-size-control-*` tokens. |
| hasError | `boolean` | `false` | no | Invalid state: propagates to wrapper and `aria-invalid` on the field; if `error` is set, treated as true. |
| label | `React.ReactNode` | — | no | Label; rendered as `<label htmlFor={inputId}>`. |
| optionalLabel | `React.ReactNode` | — | no | Secondary text in the header row. |
| hint | `React.ReactNode` | — | no | Hint below the field. |
| error | `React.ReactNode` | — | no | Error message; implies error styling and `hasError` behavior. |
| id | `string` | — | no | Explicit input id; otherwise generated via `useFieldIds`. |
| children | `React.ReactNode` | — | yes | Field body (typically `Input.Wrapper` with content). |
| className | `string` | — | no | Class on the root element. |

### Input.Wrapper

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | yes | Content inside the field border. |
| className | `string` | — | no | Extra class; `data-size` and `data-has-error` come from context. |

### Input.Field

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| className | `string` | — | no | Class on the `input`. |
| aria-describedby | `string` | — | no | Appended to the id list from context (hint/error). |
| …rest | `Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">` | — | no | Standard `input` attributes except `size` (reserved for the design system). |

### Input.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| side | `"start" \| "end"` | — | yes | Icon position inside the wrapper. |
| children | `React.ReactNode` | — | yes | Usually an icon component from the kit. |
| className | `string` | — | no | Class on the wrapping `span`. |

### Input.Affix

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| side | `"start" \| "end"` | — | yes | Side of the block affix. |
| children | `React.ReactNode` | — | yes | Static text segment (e.g. URL prefix). |
| className | `string` | — | no | Class on the container. |

### Input.InlineAffix

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| side | `"start" \| "end"` | — | yes | Side of the inline affix. |
| children | `React.ReactNode` | — | yes | Short text (e.g. currency symbol). |
| className | `string` | — | no | Class on the `span`. |

### useInputContext()

Returns `{ size, hasError, inputId, describedBy }` for building custom subcomponents that stay consistent with **`Input.Field`**.

## Related

- [Label](../label/COMPONENT.md)
- [Hint](../hint/COMPONENT.md)
- [Textarea](../textarea/COMPONENT.md)
- [Button](../button/COMPONENT.md)
- [DigitInput](../digit-input/COMPONENT.md)
