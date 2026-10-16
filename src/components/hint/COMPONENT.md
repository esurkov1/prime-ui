# Hint

**Category:** inputs
**Kind:** primitive

> Help text or a validation error under a field.

## When to use
- Under a control without `hint` / `error` props (an embedded `Datepicker.Panel`, a custom control), where you wire the ids yourself: format rules, limits, where the value comes from.
- As the error message of such a control (`invalid`), in the same slot as the hint.
- A status the field's value has (a deadline that nears, a check that passed): `tone`, with the status in the words.

## When not to use
- Input, Textarea, Select, Checkbox, Slider, SegmentedControl and other fields with `hint` / `error` props → pass the props; they render Hint and link the ids ([Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md), [Slider](../slider/COMPONENT.md)).
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
`ref` → `HTMLParagraphElement`. A `<p>` with the support text; provides its tier to nested icons.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the paired field: 12/16 for xs–m, 13/20 for l and xl. Without it the tier of its host, else `m`. |
| `tone` | `"neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Status color of the text (a deadline that nears, a check that passed). The words carry the status, the color repeats it; `invalid` and `disabled` take over the color. |
| `invalid` | `boolean` | `false` | Error styling: danger text that drops in (fade + 4 px from above). |
| `disabled` | `boolean` | `false` | Disabled text color, next to a disabled control. A disabled `Fieldset` around the hint sets it too. |
| `children` | `ReactNode` | — | Text, optionally with `Hint.Icon` first. |
| `…rest` | `HTMLAttributes<HTMLParagraphElement>` | — | `children`, `id`, `aria-live`, `className` and the other paragraph attributes. |

### Hint.Icon
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` holding a glyph: 14 px for xs–m, 16 px for l and xl, centred on the first line.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children` (the glyph), `className` and the other span attributes. |

## Variants
### tone
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `neutral` | Muted text | Format rules, limits, where the value comes from | yes |
| `success` | Success text | The value passed a check («ИНН проверен») | |
| `warning` | Warning text | The value needs attention soon («Осталось 12 дней») | |
| `danger` | Danger text, no `aria-invalid` | A status of the data, not a validation error («Срок истёк») | |

The words carry the status; the color only repeats it, and a `Hint.Icon` with the status glyph adds a shape. A validation error is `invalid` (or a field's `error`), never `tone="danger"`. `invalid` and `disabled` take over the tone's color.

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

**Combinations** — one element switches between the hint text and the error text with `invalid` (no layout jump); a standalone hint that changes after an action stays mounted with `aria-live="polite"` (inside a field the frame does it). `invalid` and `disabled` together make no sense. A result of the whole form goes to a [Banner](../banner/COMPONENT.md), not a toned hint.

## States
| State | Driven by | DOM |
|---|---|---|
| status | `tone` | `data-tone` with the shared text tone (none for `neutral`, and none while `invalid` or `disabled`); the color eases between tones |
| error | `invalid` | `data-invalid="true"`; the message drops in over `fast` (fade + `--prime-space-1` from above, no shake, no layout shift) when it arrives on a field already shown — an error the page mounts with stands still and the color eases from the hint color |
| disabled | `disabled`, or a disabled `Fieldset` around it | `data-disabled="true"` |
| size | `size`, else the host tier | `data-size` |

Hint is not interactive: hover and focus belong to the field.

## Layout & spacing
- Field → hint: the tier `--field-hint-gap`, set by the field layout, not by Hint. The text and the icon size come from the field tier (`--field-hint-size`, `--field-hint-lh`, `--field-hint-icon`).
- Icon → text gap: `--prime-space-1`. Long text wraps (`overflow-wrap: anywhere`).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No keyboard interaction.

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Give the hint an `id` and put it into the control's `aria-describedby` so screen readers read it with the field.
- Inside a field the frame announces an error that arrives: its support slot is a polite live region. A standalone Hint whose text changes after an action stays mounted with `aria-live="polite"`.
- `Hint.Icon` is decorative; the text carries the meaning.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Help text under a calendar that has no hint of its own, linked to it through `id` and `aria-describedby` — `id`. |
| [variants.tsx](examples/variants.tsx) | Status hints whose words carry the status and the color repeats it — `tone`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier, one per field tier: 12/16 for xs–m, 13/20 for l and xl — `size`. |
| [states.tsx](examples/states.tsx) | Default help text next to an error and a hint under a disabled control — `invalid`, `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading icon centred on the first line, in the default and the error state — `Hint.Icon`. |
| [hint-or-error.tsx](examples/hint-or-error.tsx) | After a check the error replaces the hint in the same element, without a layout jump, and a polite region reads it — `invalid`, `aria-live`. |

## Mistakes
- `<Hint.Root>` under an Input → use `hint` / `error` on `Input.Root`; it links the ids itself.
- A separate hint and error element at the same time → one element; the error replaces the hint.
- Hint without `id` + `aria-describedby` → the screen reader does not connect it to the field.
- Hint size different from the field size → use the same `size`, or none inside a sized host.
- `tone="danger"` for a validation error → `invalid` (or the field's `error`): only it sets `aria-invalid`.
- A status by color alone («12 д.» in orange) → the words say it («Осталось 12 дней»), the tone repeats it.
- `role="alert"` on a field error → none; the field frame announces it, a standalone hint takes `aria-live="polite"`.

## Related
- **Built from:** —
- **See also:** [Label](../label/COMPONENT.md), [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
