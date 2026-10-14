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

Checkbox.Indicator     the box alone, no input — a mark inside option / menu rows and toggle tiles (used without Root)
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
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the box, the text and the gap. Without it the tier of its host (a form, a panel, a table), else `m`. |
| `shape` | `"square" \| "circle"` | `"square"` | Outline of the box: `square` is the rounded square; `circle` is a full circle (a selection mark in lists and chats). Size, the check draw-in, the indeterminate bar and states are the same. |
| `optional` | `boolean` | `false` | Muted `labels.optional` after the label text; the field may stay off. |
| `labels` | `Partial<CheckboxLabels>` | — | Built-in strings, see Labels. |
| `hint` | `ReactNode` | — | Help text under the label text. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger ring on the unchecked box and `aria-invalid`. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Disabled fill, dimmed label and hint, no toggling. |
| `readOnly` | `boolean` | `false` | The state is shown and focusable but does not change (`aria-readonly`); no hover or press. The native checkbox ignores `readOnly`, so the root guards the toggle. |
| `id` | `string` | — | Id of the input (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `aria-describedby` | `string` | — | Merged before the hint/error ids. |
| `children` | `ReactNode` | — | `Checkbox.Label`. Without it only the box renders — give the root an `aria-label`. |
| `className` | `string` | — | Class on the field `<div>`. |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange">` | — | `name`, `value`, `required` (also a red `*` after the text), `aria-label`, `onBlur`… on the native input. |

### Checkbox.Label
`ref` → `HTMLSpanElement`. The visible text in the text column of the label row. Native `<span>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `HTMLAttributes<HTMLSpanElement>` | — | `children`, `className` and the other span attributes. |

### Checkbox.Indicator
`ref` → `HTMLSpanElement`. The box alone, without an input (`aria-hidden`, no focus or clicks) for rows that carry the state themselves: `role="option"` + `aria-selected`, `role="menuitemcheckbox"` + `aria-checked`, a toggle `<button>` + `aria-pressed`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `false` | Shows the check. |
| `indeterminate` | `boolean` | `false` | Shows the bar; wins over `checked`. |
| `disabled` | `boolean` | `false` | Disabled fill. |
| `shape` | `"square" \| "circle"` | `"square"` | Outline of the box: `square` is the rounded square; `circle` is a full circle (a selection mark in lists and chats). The rest is the same. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | — | Box tier; without it the nearest control size (the Select or menu it sits in), else `m`. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className`, `data-*` and the other span attributes. |

## Variants
Checkbox has no `variant` / `tone` / `color`.

### shape
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `square` | rounded square (radius from the tier) | forms, settings, tables | yes |
| `circle` | full circle, the same size, check and states | selection marks in lists and chat messages | |

The circle changes only the outline (`--prime-radius-full`); the check draw-in, the indeterminate bar, focus ring and touch target are the square's. `Checkbox.Indicator` takes the same `shape`.

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
| `optional` | muted `labels.optional` after the text | a form where most fields are required | `false` |

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
| invalid | `invalid` or a non-empty `error` | `data-invalid="true"`, `aria-invalid` on the input; danger ring on the unchecked box and on focus; the row shakes once when an error arrives (`data-shake`) |
| disabled | `disabled` | `data-disabled="true"` on the root; `fill-muted` box, disabled text, `cursor: not-allowed` |
| read-only | `readOnly` | `aria-readonly="true"` on the input, `data-readonly="true"` on the root; the state stays, no hover or press, default cursor |
| pressed | pointer press | the box scales to the compact press scale |
| focus-visible | keyboard focus | outer focus ring around the box |

Root also carries `data-size`; the box carries `data-shape`. Controlled: `checked` + `onCheckedChange`. Uncontrolled: `defaultChecked` (+ optional `onCheckedChange`). There is no native `onChange` prop.

## Layout & spacing
- Grid `[box][text]`; the hint or error sits under the text column, not under the box.
- Checkboxes in a column: a label-less [Fieldset](../fieldset/COMPONENT.md) stacks them at the form rhythm (name it with `aria-label`); the form around the group spaces it from its actions.
- Long labels wrap (`overflow-wrap: anywhere`); the field shrinks to its content with `max-width: 100%`.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves focus to the checkbox. |
| `Space` | Toggles it. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A native `<input type="checkbox">` (visually hidden over the box, so validation bubbles point at it), wrapped by the `<label>` row.
- `aria-invalid` is set when invalid; `aria-describedby` = your ids + the hint or the error id.
- Without visible text, pass `aria-label` on `Checkbox.Root` (it lands on the input).
- `required` goes to the native input and draws a red `*` after the text; the `*` is `aria-hidden`, the input reports the requirement.
- `Checkbox.Indicator` is `aria-hidden`; the host row carries `aria-selected` / `aria-checked` / `aria-pressed`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A checkbox with its label; a click anywhere on the row toggles it — `Checkbox.Label`, `defaultChecked`. |
| [variants.tsx](examples/variants.tsx) | The rounded square next to the circle, in three states — `shape`. |
| [sizes.tsx](examples/sizes.tsx) | Every size; the box and the text follow the control tier — `size`. |
| [states.tsx](examples/states.tsx) | Every state side by side, each labelled by its prop — `defaultChecked`, `indeterminate`, `readOnly`, `invalid`, `disabled`. |
| [without-label.tsx](examples/without-label.tsx) | Bare boxes in table rows, named for assistive tech and submitted with the form — `aria-label`, `name`, `value`. |
| [indicator.tsx](examples/indicator.tsx) | The box alone on selectable tiles: the toggle button carries `aria-pressed`, the box only shows it — `Checkbox.Indicator`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the selection; «select all» turns indeterminate on a partial one — `checked`, `onCheckedChange`, `indeterminate`. |
| [in-form.tsx](examples/in-form.tsx) | Consent in a sign-up form: the required tick and an optional subscription, a hint under the text, an error after a submit without the tick — `required`, `optional`, `hint`, `error`. |

## Mistakes
- `<Checkbox.Root onChange={…}>` → use `onCheckedChange={(checked) => …}`.
- `<Checkbox.Root>Текст</Checkbox.Root>` → wrap the text in `Checkbox.Label`, so it sits in the text column.
- `invalid` plus `error` → just pass `error`.
- Several checkboxes for one-of-many → use `Radio.Group`.
- A checkbox that saves instantly («Тёмная тема») → use `Switch`.
- `style` on `Checkbox.Root` expecting to style the field → it goes to the hidden input; use `className`.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (the `required` / `optional` marks), [Hint](../hint/COMPONENT.md) (`hint`, `error`), [VisuallyHidden](../visually-hidden/COMPONENT.md); the row is a native `<label>`
- **See also:** [Radio](../radio/COMPONENT.md), [Switch](../switch/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md); `Checkbox.Indicator` inside [Select](../select/COMPONENT.md) and [TagSelect](../tag-select/COMPONENT.md) rows
