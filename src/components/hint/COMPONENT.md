# Hint

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

`Hint` is a compact line of helper or status text under a field: neutral copy, validation errors, or muted text for inactive inputs, with an optional leading icon.

- **When to use** — explain format rules, limits, units, or where a read-only value comes from under a single control.
- **When to use** — show validation or integration errors tied to a field without a separate notification block.
- **When to use** — align typography and spacing with the field via the same `size` tier as the control.
- **When not to use** — as the primary name of the field; use [Label](../label/COMPONENT.md) for that.
- **When not to use** — when [Input](../input/COMPONENT.md) already takes `hint` / `error` on the root, or [Textarea](../textarea/COMPONENT.md) already includes `Textarea.Hint` / `Textarea.Error` in the same field block.
- **When not to use** — for long prose or page-level messaging; prefer dedicated content or banner patterns.

## Composition

- **`Hint.Root`** — required wrapper: a `p` with `data-size` and `data-variant`, wrapped in `ControlSizeProvider` so size cascades to the icon slot.
- **`Hint.Icon`** — optional; render as the first child of `Hint.Root` when you need a decorative icon before the text.
- Order: `Hint.Root` contains optional `Hint.Icon` then text (or mixed `ReactNode`); no other named parts.

### Minimal example

```tsx
import { Hint } from "prime-ui-kit";

export function FieldHint() {
  return <Hint.Root>The invitation will be valid for 7 days.</Hint.Root>;
}
```

## Rules

- **Variants:** `default` is secondary helper text; `error` is for validation or failure copy; `disabled` matches visually inactive fields (there is no separate `disabled` boolean on the root).
- **Sizing:** `size` is one of `s`, `m`, `l`, `xl`; pick the same tier as the paired field for consistent type and icon gap.
- **Semantics:** the root is always a `<p>` — there is no `asChild` or element polymorphism.
- **Association:** give `Hint.Root` a stable `id` and point the control at it with `aria-describedby` so assistive tech reads hint after the label.
- **Errors:** you may pass `role="alert"` or live-region attributes through `…rest` on `Hint.Root` if your form flow requires it.
- **`Hint.Icon`** is `aria-hidden`; do not rely on it to convey meaning without redundant text.
- **State:** text and `variant` are fully controlled by the parent (no built-in validation or open state).

## API

### Hint.Root

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| size | `HintSize` (`"s" \| "m" \| "l" \| "xl"`) | `"m"` | No | Nominal size aligned with the field. |
| variant | `"default" \| "error" \| "disabled"` | `"default"` | No | Text tone: secondary, danger, or disabled content. |
| children | `React.ReactNode` | — | No | Text; optionally include `Hint.Icon`. |
| className | `string` | — | No | Additional class on the root `p`. |
| …rest | `React.HTMLAttributes<HTMLParagraphElement>` | — | No | Native paragraph attributes (`id`, `role`, `aria-*`, etc.). |

### Hint.Icon

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| children | `React.ReactNode` | — | Yes | Icon markup (for example SVG). |
| className | `string` | — | No | Additional class on the wrapper `span`. |
| …rest | `React.HTMLAttributes<HTMLSpanElement>` | — | No | Other attributes on the wrapper. |

## Related

- [Label](../label/COMPONENT.md) — primary field caption and `htmlFor` / `id` wiring.
- [Input](../input/COMPONENT.md) — field composition with optional built-in hint and error.
- [Textarea](../textarea/COMPONENT.md) — multiline field with the same metadata pattern where applicable.
- [Button](../button/COMPONENT.md) — actions that trigger validation and updated hint copy or `variant`.
