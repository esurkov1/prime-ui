# Checkbox

**Category:** selection
**Kind:** control

> A checkbox for an independent yes/no choice that submits with a form: checked, indeterminate, with a hint or an error.

## When to use
- Independent on/off options that are saved together with a form (consents, sets of options).
- Multi-select in lists and table rows, with a parent «select all» that becomes `indeterminate` on a partial selection.
- Accepting terms with a required validation message.

## When not to use
- One choice out of several mutually exclusive options → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) instead.
- A setting that applies immediately, without a submit → use [Switch](../switch/COMPONENT.md) instead.
- Picking several values from a long list in a compact field → use [TagSelect](../tag-select/COMPONENT.md) or [Select](../select/COMPONENT.md) with `multiple` instead.
- A checkbox look inside an option or menu row that carries `aria-selected` itself → `Checkbox.Indicator`, never a nested `Checkbox.Root`.

## Import
```tsx
import { Checkbox } from "prime-ui-kit";
```

## Anatomy
```
Checkbox.Root          field grid; ref and input props go to the native input
├─ <label> row         the native input, the box and the text (rendered by Root)
│  └─ Checkbox.Label   the visible text (optional)
└─ hint | error        support text under the text column (`hint`, `error`)

Checkbox.Indicator     the box alone, no input — a mark inside option / menu rows (used without Root)
```
`<Checkbox.Root aria-label="…" />` without `Checkbox.Label` is a valid bare control (table rows).

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Checkbox.Root
`ref` → `HTMLInputElement` (the native checkbox). Renders the field `<div>`, the `<label>` row with the input and the box, and the support row. Field-root rule for a leaf: `className` goes to the field `<div>`; `id`, `ref` and native input props to the input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled checked state. |
| `defaultChecked` | `boolean` | `false` | Initial state when uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state on every toggle (not while `readOnly`). |
| `indeterminate` | `boolean` | `false` | Mixed state (a partial «select all»): a bar instead of the check; wins over `checked` visually and sets the native `indeterminate`. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `host tier, else "m"` | Tier of the box, the text and the gap. Without it the tier of its host (a form, a panel, a table), else `m`. |
| `hint` | `ReactNode` | — | Help text under the label text. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger ring on the unchecked box and `aria-invalid`. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Disabled fill, dimmed label and hint, no toggling. |
| `readOnly` | `boolean` | `false` | The state is shown and focusable but does not change (`aria-readonly`); no hover or press. The native checkbox ignores `readOnly`, so the root guards the toggle. |
| `id` | `string` | — | Id of the input (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `children` | `ReactNode` | — | `Checkbox.Label`. Without it only the box renders — give the root an `aria-label`. |
| `className` | `string` | — | Class on the field `<div>`. |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange">` | — | `name`, `value`, `required`, `aria-label`, `onBlur`… on the native input. |

### Checkbox.Label
`ref` → `HTMLSpanElement`. The visible text in the text column of the label row. Native `<span>` props.

### Checkbox.Indicator
`ref` → `HTMLSpanElement`. The box alone, without an input (`aria-hidden`, no focus or clicks) for rows that carry the state themselves: `role="option"` + `aria-selected`, `role="menuitemcheckbox"` + `aria-checked`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Shows the check. |
| `indeterminate` | `boolean` | `false` | Shows the bar; wins over `checked`. |
| `disabled` | `boolean` | `false` | Disabled fill. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Box tier; without it the nearest control size (the Select or menu it sits in), else `m`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className`, `data-*` and the other span attributes. |

## Variants
Checkbox has no `variant` / `tone` / `color`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 14px box, 4px gap, 12/16 text | dense tables, filters in a 28px toolbar | |
| `s` | 16px box, 8px gap, 13/20 text | compact forms and side panels | |
| `m` | 18px box, 8px gap, 14/20 text | regular forms and settings | yes |
| `l` | 20px box, 8px gap, 16/24 text | spacious forms, onboarding | |
| `xl` | 24px box (radius 6), 12px gap, 16/24 text | touch-first screens | |

**Sizes:** the box is optically centred on the first text line; the text follows the tier text size (12 · 13 · 14 · 16 · 16). Match the checkbox `size` to the fields and buttons of the same form.

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `indeterminate` | accent box with a horizontal bar | a parent checkbox over a partially selected group | `false` |
| `invalid` | danger ring on the unchecked box | the message is shown elsewhere; otherwise pass `error` | `false` |
| `disabled` | muted box, dimmed text and hint | the option is unavailable | `false` |

**Combinations**
- `indeterminate` only on a parent checkbox that controls a group; leaf options never use it.
- `invalid` together with `error` is redundant — the error already sets it.
- Nested options are indented by the box width plus the gap so they align with the parent text.

## States
| State | Driven by | DOM |
|---|---|---|
| unchecked | `checked={false}` / default | `data-state="unchecked"`; box `fill-strong`, hover `fill-strong-hover` |
| checked | `checked` / `defaultChecked` | `data-state="checked"`; accent box, the check draws in |
| indeterminate | `indeterminate` | `data-state="indeterminate"`, `input.indeterminate`; accent box with a bar |
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"`, `aria-invalid` on the input; danger ring on the unchecked box and on focus |
| disabled | `disabled` | `data-disabled="true"` on the root; `fill-muted` box, disabled text, `cursor: not-allowed` |
| read-only | `readOnly` | `aria-readonly="true"` on the input, `data-readonly="true"` on the root; the state stays, no hover or press, default cursor |
| pressed | pointer press | the box scales to the compact press scale |
| focus-visible | keyboard focus | outer focus ring around the box |

Root also carries `data-size`. Controlled: `checked` + `onCheckedChange`. Uncontrolled: `defaultChecked` (+ optional `onCheckedChange`). There is no native `onChange` prop.

## Layout & spacing
- Grid `[box][text]`; the hint or error sits under the text column, not under the box.
- Checkboxes in a vertical list: gap `--prime-space-3`; separate fields: `--prime-space-5`; group → actions `--prime-space-8`.
- Long labels wrap (`overflow-wrap: anywhere`); the field shrinks to its content with `max-width: 100%`.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves focus to the checkbox. |
| `Space` | Toggles it. |

### ARIA
- A native `<input type="checkbox">` (visually hidden over the box, so validation bubbles point at it), wrapped by the `<label>` row.
- `aria-invalid` is set when invalid; `aria-describedby` = your ids + the hint or the error id.
- Without visible text, pass `aria-label` on `Checkbox.Root` (it lands on the input).
- `required` goes to the native input; no asterisk is drawn — state it in the text or the hint.
- `Checkbox.Indicator` is `aria-hidden`; the host row carries `aria-selected` / `aria-checked`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

No `labels`.

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A checkbox with its label; a click anywhere on the row toggles it. |
| [sizes.tsx](examples/sizes.tsx) | Every size; the box and the text follow the control tier — `size`. |
| [states.tsx](examples/states.tsx) | Every state side by side, each labelled by its prop — `checked`, `indeterminate`, `invalid`, `disabled`. |
| [without-label.tsx](examples/without-label.tsx) | Bare boxes in table rows, named by `aria-label` and submitted with `name` and `value`. |
| [indicator.tsx](examples/indicator.tsx) | The box alone in a multi-select list: the option row carries `aria-selected`, the box only shows it — `Checkbox.Indicator`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the selection; «select all» turns indeterminate on a partial one — `checked`, `onCheckedChange`, `indeterminate`. |
| [in-form.tsx](examples/in-form.tsx) | Consent in a sign-up form: a hint under the text, an error after a submit without the tick — `required`, `hint`, `error`. |

## Mistakes
- `<Checkbox.Root onChange={…}>` → use `onCheckedChange={(checked) => …}`.
- `<Checkbox.Root>Текст</Checkbox.Root>` → wrap the text in `Checkbox.Label`, so it sits in the text column.
- `invalid` plus `error` → just pass `error`.
- Several checkboxes for one-of-many → use `Radio.Group`.
- A checkbox that saves instantly («Тёмная тема») → use `Switch`.
- `style` on `Checkbox.Root` expecting to style the field → it goes to the hidden input; use `className`.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (the row), [Hint](../hint/COMPONENT.md) (`hint`, `error`)
- **See also:** [Radio](../radio/COMPONENT.md), [Switch](../switch/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
