# Textarea

**Category:** inputs
**Kind:** field

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
Unlike Input, Textarea has no Wrapper / Field parts: `Textarea.Root` renders the whole field and takes native `<textarea>` props directly.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Textarea.Root
`forwardRef` → `HTMLTextAreaElement`. Renders the label row, the field box with the native `<textarea>` and the support row; native `<textarea>` props go to the textarea.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier for text, padding, radius, label and hint. One line of text sits exactly like an Input of the same size. |
| `label` | `ReactNode` | — | Label above the field (`<label htmlFor>`). Without it, set `aria-label`. |
| `required` | `boolean` | — | Native `required` on the textarea and a red `*` after the label (`aria-hidden`). |
| `optional` | `boolean` | `false` | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger inset ring on the field box, `aria-invalid` on the textarea. A non-empty `error` implies it. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring on the field box (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay. |
| `counter` | `ReactNode` | — | Right side of the support row, usually `<Textarea.Counter />`. |
| `reserveSupportRow` | `boolean` | `false` | Always render the support row (min height = hint line height), so an appearing error does not shift the layout. |
| `autoResize` | `boolean` | `true` | Height follows the content (minimum three lines, no scrollbar, no resize handle). `false` → fixed height (three lines or `rows`) with native vertical resize. |
| `onValueChange` | `(value: string) => void` | — | Called with the new string; native `onChange` still fires first. |
| `id` | `string` | — | Id of the `<textarea>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `labels` | `Partial<TextareaLabels>` | — | Built-in strings, see Labels. |
| `className` | `string` | — | Class on the visible field box (not on the outer wrapper). |
| `…rest` | `Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" \| "children">` | — | `value`, `defaultValue`, `onChange`, `placeholder`, `rows`, `maxLength`, `name`, `disabled`, `readOnly`, `aria-label`… |

### Textarea.Counter
`ref` → `HTMLSpanElement`. Character counter for the support row; shows `14/280` and announces `labels.counter`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `number` | — (required) | Current length. |
| `max` | `number` | — (required) | Limit; `current > max` turns the counter danger (`data-invalid="true"`). Add `maxLength` on the root for a hard limit. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other attributes of the `<span>`. |

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

### Flags
| Value | Looks like | Use when | Default |
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
- Label → field: tier `label-gap` (`--prime-space-1` on xs/s, `--prime-space-2` on m–xl); field → support row: tier `hint-gap`.
- Field → field in a form: `--prime-space-5`; group → actions: `--prime-space-8`.
- Width is always `100%` of the parent; set the width with the layout column.
- Long words wrap (`overflow-wrap: anywhere`), so the field never overflows horizontally.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses the field; Enter inserts a line break instead of submitting the form. |

### ARIA
- `label` renders `<label htmlFor>` bound to the textarea; without it set `aria-label`. A placeholder never replaces the label.
- Hint and error are linked via `aria-describedby`; the error replaces the hint and sets `aria-invalid="true"`.
- The field box is a `<div>`, not a `<label>`, so counter and hint never leak into the accessible name; clicking its padding focuses the textarea.
- `Textarea.Counter` shows `12/280` visually and announces `labels.counter` (`aria-live="polite"`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |
| `counter` | `"{current} из {max} символов"` | Screen-reader text of `Textarea.Counter`; `{current}` and `{max}` are replaced. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled multi-line field with a hint; the height follows the text — `label`, `hint`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; text, padding, label and hint follow the tier — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a read-only and a disabled one — `readOnly`, `disabled`. |
| [validation.tsx](examples/validation.tsx) | Required and optional markers, a hint, an error and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. |
| [auto-resize.tsx](examples/auto-resize.tsx) | A field that grows with its text next to a fixed one with a resize handle — `autoResize`, `rows`. |
| [without-focus-ring.tsx](examples/without-focus-ring.tsx) | A single reply composer where the caret and the lighter fill show focus — `focusRing`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the text; the counter follows it and `maxLength` stops extra input — `value`, `onValueChange`, `Textarea.Counter`, `maxLength`. |
| [in-form.tsx](examples/in-form.tsx) | Support request form: the description is checked on submit and its error does not shift the form — `required`, `error`, `reserveSupportRow`. |

## Mistakes
- `<Textarea.Root><textarea /></Textarea.Root>` → Textarea.Root renders the textarea itself; pass native props to the root.
- Counter without `maxLength` when the limit is hard → add `maxLength` so extra input is blocked.
- `className` expected on the outer wrapper → it lands on the field box; wrap the root in your own element for layout.
- Expecting a fixed height with the default `autoResize` → set `autoResize={false}` (and `rows`) for a fixed box with a resize handle.
- Only a placeholder, no label → add `label` or `aria-label`.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`)
- **See also:** [Input](../input/COMPONENT.md) — the same field contract for one line; [CodeBlock](../code-block/COMPONENT.md)
