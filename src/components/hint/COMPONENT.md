# Hint

**Category:** inputs (Поля ввода)

> Help text or a validation error under a field.

## When to use
- Under a control without `hint`/`error` props (DigitInput, ColorPicker, a custom control) or a hand-built field where you wire the ids yourself: format rules, limits, where the value comes from.
- As the error message of such a field (`invalid`), in the same slot as the hint.

## When not to use
- Input, Textarea, Checkbox and other fields with `hint` / `error` props → pass the props; they render Hint and link the ids ([Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md)).
- The field name → use [Label](../label/COMPONENT.md).
- A message about the whole page or form (success, warning) → use [Banner](../banner/COMPONENT.md) or a [Notification](../notification/COMPONENT.md).
- An explanation on hover → use [Tooltip](../tooltip/COMPONENT.md).

## Import
```tsx
import { Hint } from "prime-ui-kit";
```

## Anatomy
```
Hint.Root      <p> with the text
└─ Hint.Icon   optional leading icon, centered on the first line (aria-hidden)
```

## API

### Hint.Root
No ref. + native `<p>` props (`id`, `role`, `className`, …).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size of the paired field: xs/s/m 12/16 · l/xl 13/20. Also provided to nested icons via the control-size context. |
| `invalid` | `boolean` | — | Error message styling: danger text. |
| `disabled` | `boolean` | — | Disabled text color, next to a disabled control. |
| `children` | `ReactNode` | — | Text, optionally with `Hint.Icon` first. |
| `className` | `string` | — | Class on the `<p>`. |

### Hint.Icon
No ref. + native `<span>` props. Always `aria-hidden`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | An icon; drawn at 14px for xs/s/m and 16px for l/xl, centered on the first line. |
| `className` | `string` | — | Class on the `<span>`. |

## Variants
Hint has no `variant` or `tone`; its states are flags.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16, muted | Under an `xs` field | |
| `s` | 12/16, muted | Under an `s` field | |
| `m` | 12/16, muted, icon 14 | Under an `m` field | yes |
| `l` | 13/20, muted, icon 16 | Under an `l` field | |
| `xl` | 13/20, muted, icon 16 | Under an `xl` field | |

**Sizes:** the hint is always smaller than the field text; use the field's size.

### State flags
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| — (none) | Muted text, caption tracking | Help, format, limits | yes |
| `invalid` | Danger text | Validation error | — |
| `disabled` | Disabled text | Under a disabled control | — |

**Combinations**
- Recommended: one element that switches between hint text and error text with `invalid` (no layout jump); `role="alert"` for errors shown after a user action.
- Pointless: `invalid` and `disabled` together.
- There is no success state: use neutral text, or a [Banner](../banner/COMPONENT.md) for a result.

## States
| State | Driven by | DOM |
|---|---|---|
| error | `invalid` | `data-invalid="true"` |
| disabled | `disabled` | `data-disabled="true"` |
| size | `size` | `data-size` |

Hint is not interactive: hover and focus belong to the field.

## Layout & spacing
- Field → hint: the tier `hint-gap` (`--prime-control-<size>-hint-gap` = `--prime-space-1`), set by the field layout, not by Hint.
- Hint → icon gap: `--prime-space-1`. Long text wraps (`overflow-wrap: anywhere`).

## Accessibility
- Give the hint an `id` and put it into the control's `aria-describedby` so screen readers read it with the field.
- Add `role="alert"` to an error that appears after a user action.
- `Hint.Icon` is decorative; the text must carry the meaning.
- Hint has no `labels`.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` | Matching the field size |
| [states.tsx](examples/states.tsx) | Default, `invalid`, `disabled`, with `Hint.Icon` | Picking the message style |
| [field-states.tsx](examples/field-states.tsx) | Label + Select + Hint with `aria-describedby` in default / error / disabled | Hand-built fields |
| [hint-or-error.tsx](examples/hint-or-error.tsx) | Toggling `invalid` and text in the same element with `role="alert"` | Validation after an action |
| [in-form.tsx](examples/in-form.tsx) | Password change form using the Input `hint` / `error` props | Fields that have hint props |

```tsx
import { Hint } from "prime-ui-kit";

export function PhoneHint() {
  return <Hint.Root id="phone-hint">Формат: +7 900 000-00-00</Hint.Root>;
}
```

## Mistakes
- `<Hint.Root>` under an Input → use `hint` / `error` on `Input.Root`; it links the ids itself.
- A separate hint and error element at the same time → one element; the error replaces the hint.
- Hint without `id` + `aria-describedby` → the screen reader does not connect it to the field.
- Hint size different from the field size → use the same `size`.

## Related
- [Label](../label/COMPONENT.md) — the field name above.
- [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [DigitInput](../digit-input/COMPONENT.md), [Select](../select/COMPONENT.md).
