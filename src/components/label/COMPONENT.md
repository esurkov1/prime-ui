# Label

**Category:** inputs
**Kind:** primitive

> Field label (native `<label>`) with required and optional markers.

## When to use
- Above a control that has no built-in `label` prop: SegmentedControl, a custom control, or a hand-built field where you wire the ids yourself.
- When a label needs an icon (`Label.Icon`) or an inline clarification (`Label.Description`).

## When not to use
- Input, Textarea, Select and other fields with a `label` prop → pass `label`, `required`, `optional` to the field; it renders Label itself ([Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md)).
- Help or error text under a field → use [Hint](../hint/COMPONENT.md).
- Labels for checkboxes, radios and switches → use their own label parts ([Checkbox](../checkbox/COMPONENT.md), [Radio](../radio/COMPONENT.md), [Switch](../switch/COMPONENT.md)).
- Section or card headings → use [Typography](../typography/COMPONENT.md).
- A placeholder instead of a label → never; always render a label.

## Import
```tsx
import { Label } from "prime-ui-kit";
```

## Anatomy
```
Label.Root            <label>: text, then the required `*` or the optional marker
├─ Label.Icon         muted leading icon slot (sized by the label size, aria-hidden)
└─ Label.Description  muted inline clarification (units, context)
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Label.Root
`forwardRef` → `HTMLLabelElement`. The native `<label>`: text, then the required `*` or the optional marker; provides its size to the icons inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size of the paired field: xs/s 12/16 · m 13/20 · l/xl 14/20, weight 500. |
| `required` | `boolean` | — | Appends a red `*` (`aria-hidden`). Put native `required` on the control itself. |
| `optional` | `boolean` | — | Appends the muted optional marker (`labels.optional`). |
| `disabled` | `boolean` | — | Disabled color for the text and the markers, `aria-disabled`. |
| `labels` | `Partial<LabelLabels>` | — | Built-in strings, see Labels. |
| `htmlFor` | `string` | — | Id of a native control. For a custom control give the label an `id` and set `aria-labelledby` on the control. |
| `…rest` | `Omit<LabelHTMLAttributes<HTMLLabelElement>, "size">` | — | `id`, `className` and the other label attributes. |

### Label.Icon
No ref. A muted, non-shrinking icon slot (`aria-hidden`) before the text; kit icons take the label size. Native `<span>` props.

### Label.Description
No ref. Regular-weight muted text in the same line (units, context); part of the accessible name. Native `<span>` props.

## Variants
Label has no `variant` or `tone`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16, medium, primary | Above an `xs` field | |
| `s` | 12/16, medium, primary | Above an `s` field | |
| `m` | 13/20, medium, primary | Above an `m` field | yes |
| `l` | 14/20, medium, primary | Above an `l` field | |
| `xl` | 14/20, medium, primary | Above an `xl` field | |

**Sizes:** always the size of the field below. `xs`/`s` and `l`/`xl` share the type size; the difference is in the field height.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `required` | Red `*` right after the text | Most fields are optional — mark the required ones | — |
| `optional` | Muted regular «необязательно» right after the text | Most fields are required — mark the optional ones | — |
| `disabled` | Text, `*`, marker, description and icon in disabled color | The paired control is disabled | — |

**Combinations**
- Recommended: mark the minority of fields in a form; `Label.Description` for units («₽, без НДС»).
- Pointless: `required` and `optional` together.
- Forbidden: `required` without native `required` (or `aria-required`) on the control — the asterisk is decorative only.

## States
| State | Driven by | DOM |
|---|---|---|
| disabled | `disabled` | `data-disabled="true"`, `aria-disabled="true"` |
| size | `size` | `data-size` |

The label has no hover or focus state; clicking it focuses the control bound with `htmlFor`.

## Layout & spacing
- Label → field: the tier `label-gap` (`--prime-control-<size>-label-gap`: `--prime-space-1` on xs/s, `--prime-space-2` on m–xl) — the same gap fields use for their built-in label.
- Inline-flex, wraps long text (`overflow-wrap: anywhere`); markers are separated by `--prime-space-1`.

## Accessibility

### Keyboard
No keyboard interaction.

### ARIA
- Bind with `htmlFor` to a native control, or set `id` on the label and `aria-labelledby` on a custom control (SegmentedControl, DigitInput group).
- The `*` is `aria-hidden`; requiredness must come from the control (`required`).
- The optional marker and `Label.Description` are visible text and part of the accessible name; `Label.Icon` is `aria-hidden`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the text when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A standalone label above a control without its own `label`, linked through `aria-labelledby`. |
| [sizes.tsx](examples/sizes.tsx) | Every size; the label takes the size of the field below it — `size`. |
| [states.tsx](examples/states.tsx) | A default label next to a disabled one; the markers dim with the text — `disabled`. |
| [with-icon.tsx](examples/with-icon.tsx) | A muted icon before the text, sized by the label — `Label.Icon`. |
| [structure.tsx](examples/structure.tsx) | The required asterisk, the optional marker and an inline clarification — `required`, `optional`, `Label.Description`. |

## Mistakes
- `<Label.Root>` above an Input → use `label` on `Input.Root` instead.
- `required` on the label only → add native `required` on the control.
- `htmlFor` pointing at a custom control or a fieldset → use `id` + `aria-labelledby`.
- Label size different from the field size → use the same `size`.

## Related
- **Built from:** —
- **See also:** [Hint](../hint/COMPONENT.md) — text under the field; [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Select](../select/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
