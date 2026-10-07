# Hint

**Category:** inputs
**Kind:** primitive

> Help text or a validation error under a field.

## When to use
- Under a control without `hint` / `error` props (DigitInput, a custom control) where you wire the ids yourself: format rules, limits, where the value comes from.
- As the error message of such a control (`invalid`), in the same slot as the hint.

## When not to use
- Input, Textarea, Select, Checkbox and other fields with `hint` / `error` props → pass the props; they render Hint and link the ids ([Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md)).
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
└─ Hint.Icon   optional leading icon, centred on the first line (aria-hidden)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Hint.Root
`ref` → `HTMLParagraphElement`. A `<p>` with the support text; provides its tier to nested icons. + native `<p>` props (`id`, `role`, `className`, …).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the paired field: 12/16 for xs–m, 13/20 for l and xl. |
| `invalid` | `boolean` | `false` | Error styling: danger text that drops in (fade + 4 px from above). |
| `disabled` | `boolean` | `false` | Disabled text color, next to a disabled control. |
| `children` | `ReactNode` | — | Text, optionally with `Hint.Icon` first. |

### Hint.Icon
No ref. An `aria-hidden` `<span>` holding a glyph: 14 px for xs–m, 16 px for l and xl, centred on the first line. + native `<span>` props.

## Variants
Hint has no `variant` or `tone`; its states are flags.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16, muted, icon 14 | Under an `xs` field | |
| `s` | 12/16, muted, icon 14 | Under an `s` field | |
| `m` | 12/16, muted, icon 14 | Under an `m` field | yes |
| `l` | 13/20, muted, icon 16 | Under an `l` field | |
| `xl` | 13/20, muted, icon 16 | Under an `xl` field | |

The hint is always smaller than the field text; use the field's size.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `invalid` | Danger text, drops in | Validation error | `false` |
| `disabled` | Disabled text | Under a disabled control | `false` |

**Combinations** — one element switches between the hint text and the error text with `invalid` (no layout jump); add `role="alert"` to an error shown after a user action. `invalid` and `disabled` together make no sense. There is no success state: use neutral text, or a [Banner](../banner/COMPONENT.md) for a result.

## States
| State | Driven by | DOM |
|---|---|---|
| error | `invalid` | `data-invalid="true"`; the message drops in over `fast` (fade + `--prime-space-1` from above, no shake, no layout shift) and the color eases from the hint color |
| disabled | `disabled` | `data-disabled="true"` |
| size | `size` | `data-size` |

Hint is not interactive: hover and focus belong to the field.

## Layout & spacing
- Field → hint: the tier `hint-gap` (`--prime-control-<size>-hint-gap`), set by the field layout, not by Hint.
- Icon → text gap: `--prime-space-1`. Long text wraps (`overflow-wrap: anywhere`).

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Give the hint an `id` and put it into the control's `aria-describedby` so screen readers read it with the field.
- Add `role="alert"` to an error that appears after a user action.
- `Hint.Icon` is decorative; the text carries the meaning.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Help text under a control without its own `hint` prop, linked to it by `id` and `aria-describedby`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier, matching the field above: 12/16 for xs–m, 13/20 for l and xl — `size`. |
| [states.tsx](examples/states.tsx) | Default help text next to an error and a hint under a disabled control — `invalid`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading icon centred on the first line, in the default and the error state — `Hint.Icon`. |
| [hint-or-error.tsx](examples/hint-or-error.tsx) | After a check the error replaces the hint in the same element, without a layout jump, and is announced — `invalid`, `role`. |

## Mistakes
- `<Hint.Root>` under an Input → use `hint` / `error` on `Input.Root`; it links the ids itself.
- A separate hint and error element at the same time → one element; the error replaces the hint.
- Hint without `id` + `aria-describedby` → the screen reader does not connect it to the field.
- Hint size different from the field size → use the same `size`.

## Related
- **Built from:** —
- **See also:** [Label](../label/COMPONENT.md), [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [DigitInput](../digit-input/COMPONENT.md)
