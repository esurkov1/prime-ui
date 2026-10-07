# Label

**Category:** inputs (Поля ввода)

> Field label (native `<label>`) with required and optional markers.

## When to use
- Above a control that has no built-in `label` prop: DigitInput, ColorPicker, custom controls, or a hand-built field where you wire the ids yourself.
- When a label needs an icon (`Label.Icon`) or an inline clarification (`Label.Sub`) next to a standalone control.

## When not to use
- Input, Textarea (and other fields with a `label` prop) → pass `label`, `required`, `optional` to the field; it renders Label itself ([Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md)).
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
Label.Root        <label>: text, then the required `*` or the optional marker
├─ Label.Icon     muted leading icon slot (sized by the label size)
└─ Label.Sub      muted inline clarification (units, context)
```

## API

### Label.Root
`forwardRef` to `HTMLLabelElement`. + native `<label>` props except `size` (`htmlFor`, `id`, `className`, …).

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size of the paired field: xs/s 12/16 · m 13/20 · l/xl 14/20, weight 500. |
| `required` | `boolean` | — | Appends a red `*` (`aria-hidden`). Put native `required` on the control itself. |
| `optional` | `boolean` | — | Appends the muted optional marker (`labels.optional`). |
| `disabled` | `boolean` | — | Disabled text color for the text and markers, `aria-disabled`. |
| `labels` | `Partial<LabelLabels>` | see Accessibility | Built-in strings. |
| `htmlFor` | `string` | — | Id of the associated native control. For custom controls give the label an `id` and use `aria-labelledby` on the control. |

### Label.Icon
+ native `<span>` props. Muted, non-shrinking icon slot; provides the label size to the icon through the control-size context.

### Label.Sub
+ native `<span>` props. Regular weight, muted text in the same line.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 12/16, medium, primary | Above an `xs` field | |
| `s` | 12/16, medium, primary | Above an `s` field | |
| `m` | 13/20, medium, primary | Above an `m` field | yes |
| `l` | 14/20, medium, primary | Above an `l` field | |
| `xl` | 14/20, medium, primary | Above an `xl` field | |

**Sizes:** always the size of the field below. `xs`/`s` and `l`/`xl` share the type size; the difference is in the field height.

### Markers
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| `required` | Red `*` right after the text | Most fields are optional — mark the required ones | — |
| `optional` | Muted regular «необязательно» right after the text | Most fields are required — mark the optional ones | — |
| `disabled` | Text, `*`, marker, sub and icon in disabled color | The paired control is disabled | — |

**Combinations**
- Recommended: mark the minority of fields in a form; `Label.Sub` for units ("₽, без НДС").
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
- Bind with `htmlFor` to a native control, or set `id` on the label and `aria-labelledby` on a custom control (Select trigger, DigitInput group).
- The `*` is `aria-hidden`; requiredness must come from the control (`required`).
- The optional marker is visible text and is part of the accessible name.

| `labels` key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the text when `optional` |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with `required` | Matching the field size |
| [markers.tsx](examples/markers.tsx) | `required`, `optional`, custom `labels.optional`, `Label.Sub` | Marking fields in a form |
| [states.tsx](examples/states.tsx) | Default and `disabled` with markers | Next to a disabled control |
| [with-icon.tsx](examples/with-icon.tsx) | `Label.Icon` on `m` and `l` | Icon before the label text |
| [in-form.tsx](examples/in-form.tsx) | Input built-in labels next to `Label.Root` over a Select (`aria-labelledby`) | Labelling controls without a `label` prop |

```tsx
import { Label } from "prime-ui-kit";

export function RoleLabel() {
  return (
    <Label.Root id="role-label" required>
      Роль
    </Label.Root>
  );
}
```

## Mistakes
- `<Label.Root>` above an Input → use `label` on `Input.Root` instead.
- `required` on the label only → add native `required` on the control.
- `htmlFor` pointing at a Select trigger or a fieldset → use `id` + `aria-labelledby`.
- Label size different from the field size → use the same `size`.

## Related
- [Hint](../hint/COMPONENT.md) — text under the field.
- [Input](../input/COMPONENT.md), [Textarea](../textarea/COMPONENT.md), [Select](../select/COMPONENT.md), [DigitInput](../digit-input/COMPONENT.md).
