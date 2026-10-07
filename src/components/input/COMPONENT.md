# Input

**Category:** inputs
**Kind:** field

> Single-line text field with label, hint, error and slots for icons, affixes, a badge, a clear button and a counter.

## When to use
- Any single-line value: name, e-mail, phone, search query, amount, URL, code.
- Search fields with a leading icon and a clear button.
- Values with a fixed prefix/suffix (`https://`, domain, `₽`, `%`).
- As the reference field: Select, Datepicker, TagSelect and Textarea follow the same label / field / support-row contract.

## When not to use
- Multi-line text → use [Textarea](../textarea/COMPONENT.md).
- One-time codes split into cells → use [DigitInput](../digit-input/COMPONENT.md).
- Choosing from a fixed list → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).
- Dates → use [Datepicker](../datepicker/COMPONENT.md).
- A standalone label or message without an Input field → use [Label](../label/COMPONENT.md) / [Hint](../hint/COMPONENT.md).
- Global search across the app in a dialog → use [CommandMenu](../command-menu/COMPONENT.md).

## Import
```tsx
import { Input } from "prime-ui-kit";
```

## Anatomy
```
Input.Root            label row, field body, support row; provides size / invalid / ids
└─ Input.Wrapper      the visible field (fill, hover, focus ring, invalid ring)
   ├─ Input.Affix          tinted section flush with the edge (start | end)
   ├─ Input.Icon           decorative icon (start | end)
   ├─ Input.InlineAffix    muted text next to the value (start | end)
   ├─ Input.Field          native <input>
   ├─ Input.Badge          soft palette badge at the trailing edge
   └─ Input.ClearButton    trailing clear action: a full-height segment at the end edge
Input.Counter         goes into Input.Root `counter` (support row, right side)
```
The trailing side has a fixed CSS `order`, independent of JSX order: value · end inline affix · badge · end icon · clear button · end affix. All `side="start"` slots share one order before the value, so among them the JSX order decides — write them as affix, icon, inline affix.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Input.Root
No ref (renders a `<div>`). Does not forward native props. Size, label, support row and the context for `Wrapper` and `Field`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier for height, padding, radius, text, label and hint. Also provided to nested controls via the control-size context. |
| `label` | `ReactNode` | — | Label above the field, rendered as `<label htmlFor>`. Without it, give `Input.Field` an `aria-label`. |
| `required` | `boolean` | `false` | Red `*` after the label (`aria-hidden`) and native `required` on `Input.Field`. |
| `optional` | `boolean` | `false` | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the field. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message in the hint slot; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger inset ring on the field, `aria-invalid` on the input. A non-empty `error` implies it. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring on `Input.Wrapper` (`data-focus-ring="false"`); focus, keyboard, ARIA and the invalid ring stay. |
| `counter` | `ReactNode` | — | Right side of the support row, usually `<Input.Counter />`. |
| `reserveSupportRow` | `boolean` | `false` | Always render the support row (min height = hint line height), so an appearing error does not shift the layout. |
| `id` | `string` | — | Id of the `<input>` (auto-generated when omitted); hint id is `<id>-hint`, error id is `<id>-error`. |
| `labels` | `Partial<InputLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | Usually `Input.Wrapper`. |
| `className` | `string` | — | Class on the `<div>`. |

### Input.Wrapper
No ref. The visible field: fill, hover, focus ring, invalid ring.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | `Field` and the slots: `Icon`, `Affix`, `InlineAffix`, `Badge`, `ClearButton`. |
| `className` | `string` | — | Class on the field `<div>`; `data-size` and `data-invalid` come from the root. |

### Input.Field
`forwardRef` → `HTMLInputElement`. The native `<input>`; `id`, `aria-invalid` and `aria-describedby` come from the root.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onValueChange` | `(value: string) => void` | — | Called with the new string; native `onChange` still fires first. |
| `aria-describedby` | `string` | — | Merged with the hint/error ids from the root. |
| `required` | `boolean` | — | Overrides the root's `required` for the native input. |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "size">` | — | `value`, `defaultValue`, `onChange`, `type`, `disabled`, `readOnly`, `maxLength`, `placeholder`… |

### Input.Icon
No ref. Decorative icon (`aria-hidden`), centered between the edge and the text.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | — (required) | Side of the value. |
| `children` | `ReactNode` | — (required) | An icon; kit icons without an explicit `size` take the field tier. |
| `className` | `string` | — | Class on the `<span>`. |

### Input.Affix
No ref. Tinted section flush with the edge (`aria-hidden`); the wrapper drops its padding there.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | — (required) | Edge the section sits on. |
| `children` | `ReactNode` | — (required) | Static text: protocol, domain, country code. |
| `className` | `string` | — | Class on the `<div>`. |

### Input.InlineAffix
No ref. Muted unit next to the value (`aria-hidden`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"start" \| "end"` | — (required) | Side of the value. |
| `children` | `ReactNode` | — (required) | Short unit: `₽`, `%`, `кг`. |
| `className` | `string` | — | Class on the `<span>`. |

### Input.Badge
No ref. Soft palette badge one tier below the field, at the trailing edge.

| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Palette hue of the soft badge. |
| `children` | `ReactNode` | — (required) | Short status text. |
| `className` | `string` | — | Class on the `<span>`. |

### Input.ClearButton
`forwardRef` → `HTMLButtonElement`. A full-height clear segment at the end edge, named by `labels.clear`, with `aria-controls` on the input. Render it only while the field has a value.

| Prop | Type | Default | Description |
|---|---|---|---|
| `onClick` | `MouseEventHandler<HTMLButtonElement>` | — | Clear the value here. Afterwards focus returns to the input unless `event.preventDefault()` was called. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children" \| "aria-label">` | — | The other button attributes. |

### Input.Counter
No ref. Character counter for the support row; shows `14/40` and announces `labels.counter`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `current` | `number` | — (required) | Current length. |
| `max` | `number` | — (required) | Limit; `current > max` turns the counter danger (`data-invalid="true"`). |
| `className` | `string` | — | Class on the `<span>`. |

## Variants
Input has no `variant` or `tone`: there is one field treatment (fill, no visible border).

### size (Input.Root)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 high, text 12/16, padX 8, radius 6, label 12/16, hint 12/16 | Dense table toolbars, inline filters | |
| `s` | 32 high, text 13/20, padX 8, radius 8, label 12/16, hint 12/16 | Compact panels, side filters | |
| `m` | 36 high, text 14/20, padX 12, radius 8, label 13/20, hint 12/16 | Regular forms and pages | yes |
| `l` | 40 high, text 16/24, padX 12, radius 10, label 14/20, hint 13/20 | Spacious forms, onboarding | |
| `xl` | 48 high, text 16/24, padX 16, radius 12, label 14/20, hint 13/20 | Hero search, landing forms | |

**Sizes:** a field of size T lines up with Button, Select, Datepicker trigger, SegmentedControl and Tabs of size T in one row (same height and radius). Label and hint always use the same tier as the field.

### side (Input.Icon / Input.Affix / Input.InlineAffix)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | Before the value. Icon: muted, centered between edge and text (edge → icon = icon → text = field padX). Affix: tinted `fill-subtle` section flush with the edge. Inline affix: muted text before the value | Search icon, `https://`, currency sign before the number | — (required) |
| `end` | After the value. Same treatments at the trailing side; numeric fields with an end inline affix align the value to the end | Lock icon on read-only, domain suffix, units `₽ % кг` | — |

### color (Input.Badge)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | Soft badge on a stronger neutral wash (`fill-strong`) so it stays visible on the field fill | Neutral status ("Черновик") | yes |
| `blue` | Soft blue badge | "Новое", informational marks | |
| `green` | Soft green badge | "Проверен", verified values | |
| `orange` | Soft orange badge | "Не заполнено", needs attention | |
| `red` | Soft red badge | Rejected or blocked value | |
| `yellow` | Soft yellow badge | Pending | |
| `purple` | Soft purple badge | Category marks | |
| `sky` | Soft sky badge | Category marks | |
| `pink` | Soft pink badge | Category marks | |
| `teal` | Soft teal badge | Category marks | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `focusRing={false}` | No focus ring; the field still switches to the focus fill, caret visible | A single search field where focus is obvious | `true` |
| `reserveSupportRow` | Empty support row of hint height under the field | Fields validated on the fly; neighbouring fields in one grid row | `false` |
| `required` / `optional` | Red `*` / muted «необязательно» after the label | Mark the minority: required when most are optional, optional when most are required | `false` |

**Combinations**
- Recommended: `Input.Icon side="start"` + `Input.ClearButton` for search; `Input.Affix` on both sides for URLs; `Input.InlineAffix side="end"` with `inputMode="decimal"` for amounts.
- Allowed but rare: `Input.Badge` together with an end icon (badge sits before the icon).
- Pointless: `required` and `optional` together; `hint` and `error` together (the error replaces the hint); `invalid` without any message in a form where the user needs to know what is wrong.
- Forbidden: `focusRing={false}` on regular form fields (WCAG 2.4.7).

**Hierarchy:** keep one size for all fields of a form; mark required/optional consistently; use the badge only for a status of the value, not for decoration.

## States
| State | Driven by | DOM |
|---|---|---|
| default / hover | — | hover darkens the fill (not when disabled, read-only or focused) |
| focus | keyboard focus on the input | wrapper gets the focus fill and an inset focus ring (`:has(input:focus-visible)`) |
| no focus ring | `focusRing={false}` | `data-focus-ring="false"` on the wrapper |
| invalid | `invalid` or non-empty `error` | `data-invalid="true"` on root and wrapper, `aria-invalid="true"` on the input, danger inset ring, danger focus ring |
| disabled | native `disabled` on `Input.Field` | disabled fill, disabled text and icons, `cursor: not-allowed`, clear button disabled look |
| read-only | native `readOnly` on `Input.Field` | no hover, default cursor |
| reserved support row | `reserveSupportRow` | `data-reserve="true"` on the support row |
| counter over limit | `current > max` | `data-invalid="true"` on `Input.Counter` |

Size: `data-size` on root and wrapper. Slots: `data-side="start" | "end"`.

Controlled: `value` + `onChange` (or `onValueChange`) on `Input.Field`. Uncontrolled: `defaultValue`. Both are native input props.

## Layout & spacing
- Label → field gap: tier `label-gap` (`--prime-space-1` on xs/s, `--prime-space-2` on m–xl). Field → support row: `--prime-space-1`.
- Field → field in a form: `--prime-space-5` (20); group → actions: `--prime-space-8` (32).
- `Input.Root` is `width: 100%` and `min-width: 0`; there is no `fullWidth` prop — the width comes from the parent (grid column, flex item, capped wrapper).
- Use `reserveSupportRow` on fields that share a grid row so their bottoms stay aligned when only one shows an error.
- The value truncates with an ellipsis before badges, icons and affixes; the field height never changes.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses the field, then the clear button when it is shown. |
| `Enter` · `Space` | On the clear button: clears the value and returns focus to the field. |

### ARIA
- `label` renders a `<label htmlFor>` bound to the input. Without `label`, set `aria-label` on `Input.Field`. A placeholder never replaces the label.
- Hint and error are linked through `aria-describedby`; the error replaces the hint and sets `aria-invalid="true"`.
- `Input.Icon`, `Input.Affix`, `Input.InlineAffix` are `aria-hidden`: put the meaning in the label (e.g. "Сумма, ₽").
- `Input.ClearButton` is a real button named by `labels.clear`, with `aria-controls` on the input.
- `Input.Counter` shows `14/40` visually and announces `labels.counter` through `aria-live="polite"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the label when `optional`. |
| `clear` | `"Очистить"` | Accessible name of `Input.ClearButton`. |
| `counter` | `"{current} из {max} символов"` | Screen-reader text of `Input.Counter`; `{current}` and `{max}` are replaced. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled field with a hint under it — `label`, `hint`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the label and the hint follow the field tier — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a disabled and a read-only one — `disabled`, `readOnly`. |
| [validation.tsx](examples/validation.tsx) | Required and optional markers, a hint, an error and a support row that does not shift — `required`, `optional`, `hint`, `error`, `reserveSupportRow`. |
| [with-icon.tsx](examples/with-icon.tsx) | A decorative icon at either end of the value — `Input.Icon`, `side`. |
| [affixes.tsx](examples/affixes.tsx) | A fixed prefix and suffix flush with the edges and a unit next to the value — `Input.Affix`, `Input.InlineAffix`. |
| [with-badge.tsx](examples/with-badge.tsx) | A soft status badge at the end of the field; the height does not change — `Input.Badge`, `color`. |
| [without-focus-ring.tsx](examples/without-focus-ring.tsx) | A single search field where the caret and the lighter fill show focus — `focusRing`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value: a clear button and a character counter follow it — `value`, `onValueChange`, `Input.ClearButton`, `Input.Counter`. |
| [in-form.tsx](examples/in-form.tsx) | Company details form: required fields checked on submit, neighbours keep their bottoms aligned — `required`, `error`, `reserveSupportRow`. |

## Mistakes
- `<Input.Field placeholder="Email" />` without a label → add `label` on `Input.Root` or `aria-label` on the field.
- `<Input.Root disabled>` → `disabled` goes on `Input.Field`.
- `<Input.Root fullWidth>` → there is no such prop; the root already fills its parent.
- Passing both `hint` and `error` expecting both to show → only the error is shown.
- Rendering `Input.ClearButton` for an empty field → render it only when there is a value.
- Setting `className` with a custom border or background on `Input.Wrapper` → the fill comes from the surface context; fields inside Card/Modal already switch.
- `tone="danger"` / `error` as a boolean → use `invalid` or an `error` message.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (`label`), [Hint](../hint/COMPONENT.md) (`hint`, `error`), [Badge](../badge/COMPONENT.md) (`Input.Badge`)
- **See also:** [Textarea](../textarea/COMPONENT.md), [Select](../select/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [TagSelect](../tag-select/COMPONENT.md) — fields with the same contract
