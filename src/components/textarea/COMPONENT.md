# Textarea

**Category:** inputs

> Multi-line text field with label, hint, error and a character counter; grows with its content by default.

## When to use
- Free-form text longer than one line: comments, descriptions, reviews, support requests, notes.
- Text with a length limit shown to the user (`Textarea.Counter`).

## When not to use
- A single-line value (name, e-mail, search) → use [Input](../input/COMPONENT.md).
- A one-time code split into cells → use [DigitInput](../digit-input/COMPONENT.md).
- Read-only code or logs → use [CodeBlock](../code-block/COMPONENT.md).

## Import
```tsx
import { Textarea } from "prime-ui-kit";
```

## Anatomy
```
Textarea.Root       label row → field box with the native <textarea> → support row (hint | error · counter)
Textarea.Counter    goes into Textarea.Root `counter` (right side of the support row)
```
Unlike Input, Textarea has no Wrapper/Field parts: `Textarea.Root` renders the whole field and takes native `<textarea>` props directly.

## API

### Textarea.Root
`forwardRef` to `HTMLTextAreaElement`. + native `<textarea>` props except `size` and `children` (`value`, `defaultValue`, `onChange`, `placeholder`, `rows`, `maxLength`, `name`, `disabled`, `readOnly`, `required`, `aria-label`, …); they go to the `<textarea>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier for text, padding, radius, label and hint. One line of text sits exactly like an Input of the same size. |
| `invalid` | `boolean` | `false` | Danger inset ring, `aria-invalid`. A non-empty `error` implies it. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring on the field box (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay. |
| `label` | `ReactNode` | — | Label above the field (`<label htmlFor>`). Without it, set `aria-label`. |
| `required` | `boolean` | — | Native `required` on the textarea and a red `*` after the label. |
| `optional` | `boolean` | `false` | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the field; hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `counter` | `ReactNode` | — | Right side of the support row, usually `<Textarea.Counter />`. |
| `reserveSupportRow` | `boolean` | `false` | Always render the support row, so an appearing error does not shift the layout. |
| `autoResize` | `boolean` | `true` | Height follows the content (minimum three lines, no scrollbar, no resize handle). `false` → fixed height (minimum three lines or `rows`) with native vertical resize. |
| `onValueChange` | `(value: string) => void` | — | Called with the new string; native `onChange` still fires first. |
| `labels` | `Partial<TextareaLabels>` | see Accessibility | Built-in strings. |
| `id` | `string` | auto (`useId`) | Id of the textarea; hint id `${id}-hint`, error id `${id}-error`. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `className` | `string` | — | Class on the visible field box (not on the outer wrapper). |

### Textarea.Counter
| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `number` | — (required) | Current length. |
| `max` | `number` | — (required) | Limit; `current > max` turns the counter danger (`data-invalid="true"`). Add `maxLength` on the root for a hard limit. |
| `className` | `string` | — | Class on the `<span>`. |

## Variants
Textarea has no `variant` or `tone`: one field treatment (fill, no visible border).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Text 12/16, padX 8, radius 6, label 12/16, hint 12/16 | Dense panels next to `xs` controls | |
| `s` | Text 13/20, padX 8, radius 8, label 12/16, hint 12/16 | Compact side panels, comments in lists | |
| `m` | Text 14/20, padX 12, radius 8, label 13/20, hint 12/16 | Regular forms | yes |
| `l` | Text 16/24, padX 12, radius 10, label 14/20, hint 13/20 | Spacious forms, long reading text | |
| `xl` | Text 16/24, padX 16, radius 12, label 14/20, hint 13/20 | Hero forms next to `xl` inputs | |

**Sizes:** vertical padding = (control height − line height) / 2, so the first line aligns with an [Input](../input/COMPONENT.md) of the same size in the next column. Use the same size as the other fields of the form.

### autoResize
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | Box grows line by line with the text, minimum three lines, no resize handle | Comments, descriptions — most cases | yes |
| `false` | Fixed height (`rows` or three lines), native vertical resize handle, scrolls inside | Very long text where the page must not grow, or a fixed layout | |

### Visual flags
| Flag | Looks like | Use when | Default |
|---|---|---|---|
| `focusRing={false}` | No focus ring; focus fill and caret remain | A single composer field where focus is obvious | `true` |
| `reserveSupportRow` | Empty support row of hint height | Live validation, fields side by side | `false` |
| `required` / `optional` | Red `*` / muted «необязательно» after the label | Mark the minority of the form | — / `false` |

**Combinations**
- Recommended: `counter` + `maxLength` for a hard limit; `counter` without `maxLength` for a soft limit that shows overflow; `reserveSupportRow` + `error` for validation on submit.
- Pointless: `hint` and `error` at once (error replaces hint); `required` with `optional`.
- Forbidden: `focusRing={false}` on regular form fields (WCAG 2.4.7).

## States
| State | Driven by | DOM |
|---|---|---|
| hover | — | fill darkens (not when focused, disabled or read-only) |
| focus | keyboard focus | focus fill and inset focus ring on the field box; clicking the box padding focuses the textarea |
| no focus ring | `focusRing={false}` | `data-focus-ring="false"` on the field box |
| invalid | `invalid` or non-empty `error` | `data-invalid="true"` on the outer wrapper and the field box, `aria-invalid="true"`, danger ring |
| disabled | `disabled` | `data-disabled="true"` on the field box, disabled fill and text; label and hint dimmed |
| read-only | `readOnly` | `data-readonly="true"` on the field box, no hover, default cursor |
| reserved support row | `reserveSupportRow` | `data-reserve="true"` on the support row |
| counter over limit | `current > max` | `data-invalid="true"` on `Textarea.Counter` |

`data-size` is set on the outer wrapper and the field box. Controlled: `value` + `onValueChange` (or `onChange`). Uncontrolled: `defaultValue`.

## Layout & spacing
- Label → field: tier `label-gap` (`--prime-space-1` on xs/s, `--prime-space-2` on m–xl); field → support row: `--prime-space-1`.
- Field → field in a form: `--prime-space-5`; group → actions: `--prime-space-8`.
- Width is always `100%` of the parent; set the width with the layout column.
- Long words wrap (`overflow-wrap: anywhere`), so the field never overflows horizontally.

## Accessibility
- `label` renders `<label htmlFor>` bound to the textarea; without it set `aria-label`. A placeholder never replaces the label.
- Hint and error are linked via `aria-describedby`; the error replaces the hint.
- The field box is a `<div>`, not a `<label>`, so counter and hint never leak into the accessible name.
- `Textarea.Counter` shows `12/280` visually and announces `labels.counter` (`aria-live="polite"`).

| `labels` key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional` |
| `counter` | `"{current} из {max} символов"` | Screen-reader text of `Textarea.Counter`; `{current}` and `{max}` are replaced |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | `xs`…`xl` with label and hint | Picking a size |
| [with-label.tsx](examples/with-label.tsx) | `required`, `optional`, custom `labels.optional`, `aria-label` without a visible label | Marking fields |
| [hint-and-error.tsx](examples/hint-and-error.tsx) | Hint vs error replacing it | Validation messages |
| [states.tsx](examples/states.tsx) | Empty, filled, error, read-only, disabled | Checking all states |
| [surfaces.tsx](examples/surfaces.tsx) | Fill following the surface | Fields on canvas vs in cards/overlays |
| [controlled.tsx](examples/controlled.tsx) | `value` + `onValueChange` with `Textarea.Counter` | Length-limited text |
| [reserved-support-row.tsx](examples/reserved-support-row.tsx) | With and without `reserveSupportRow` while toggling an error | Validation without layout shift |
| [height-and-limits.tsx](examples/height-and-limits.tsx) | `autoResize` vs `autoResize={false}`, soft vs hard limit | Choosing height and limit behaviour |
| [in-form.tsx](examples/in-form.tsx) | Support request form in a card with Input, Textarea and actions | Form reference |

```tsx
import { Textarea } from "prime-ui-kit";

export function CommentField() {
  return (
    <Textarea.Root
      label="Комментарий"
      optional
      placeholder="Пожелания к заказу"
      hint="Курьер увидит этот текст."
    />
  );
}
```

## Mistakes
- `<Textarea.Root><textarea /></Textarea.Root>` → Textarea.Root renders the textarea itself; pass native props to the root.
- Counter without `maxLength` when the limit is hard → add `maxLength` so extra input is blocked.
- `className` expected on the outer wrapper → it lands on the field box; wrap the root in your own element for layout.
- Expecting a fixed height with the default `autoResize` → set `autoResize={false}` (and `rows`) for a fixed box with a resize handle.
- Only a placeholder, no label → add `label` or `aria-label`.

## Related
- [Input](../input/COMPONENT.md) — same field contract for one line.
- [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) — rendered by `label`, `hint`, `error`.
