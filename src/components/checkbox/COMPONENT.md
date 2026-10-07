# Checkbox

**Category:** selection

> A checkbox for an independent yes/no choice that submits with a form: checked, indeterminate, groups.

## When to use
- Independent on/off options that are saved together with a form (consents, sets of options).
- Multi-select in lists and table rows, with a parent «select all» that becomes `indeterminate` on a partial selection.
- Accepting terms with a required validation message.

## When not to use
- One choice out of several mutually exclusive options → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) instead.
- A setting that applies immediately, without a submit → use [Switch](../switch/COMPONENT.md) instead.
- Picking several values from a long list in a compact field → use [TagSelect](../tag-select/COMPONENT.md) or [Select](../select/COMPONENT.md) with `multiple` instead.

## Import
```tsx
import { Checkbox } from "prime-ui-kit";
```

## Anatomy
```
Checkbox.Root          wrapper grid + context; ref and input props go to the hidden native input
├─ Checkbox.Label      clickable row: renders the native input, the box and the text
├─ Checkbox.Hint       description under the text column (optional)
└─ Checkbox.Error      error message under the text column (optional, makes the field invalid)
```
The native `input type="checkbox"` is rendered inside `Checkbox.Label`, so a Root without `Checkbox.Label` renders an empty `Checkbox.Label` itself: `<Checkbox.Root aria-label="…" />` is a valid bare control (tables, settings rows).

## API

### Checkbox.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | — | Controlled checked state; use with `onCheckedChange`. |
| `defaultChecked` | `boolean` | `false` | Initial state in uncontrolled mode. |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the new state on click or Space. |
| `indeterminate` | `boolean` | `false` | Mixed state (partial «select all»); wins over `checked` visually and is synced to `input.indeterminate`. |
| `invalid` | `boolean` | `false` | Invalid look and `aria-invalid`; also set automatically while `Checkbox.Error` is mounted. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier of the box, gap and label text. |
| `fullWidth` | `boolean` | `false` | Stretch to the container width; by default the field is as wide as its content. |
| `disabled` | `boolean` | `false` | Disables the input; dims box, label and hint. |
| `id` | `string` | auto (`useId`) | Id of the native input; hint/error ids derive from it. |
| `aria-describedby` | `string` | — | Extra description ids; merged with the mounted hint and error ids. |
| `className` | `string` | — | Class on the wrapper `div`. |
| `children` | `ReactNode` | — | `Checkbox.Label`, `Checkbox.Hint`, `Checkbox.Error`. |

+ native `<input>` props except `type`, `size`, `checked`, `defaultChecked`, `onChange`, `children` (`name`, `value`, `required`, `aria-label`, `onBlur`, `style`, …) — they are applied to the hidden native input, not to the wrapper.
Ref: `forwardRef` → `HTMLInputElement`. No `asChild`.

### Checkbox.Label
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Label text. Empty → only the box is rendered; then set `aria-label` on `Checkbox.Root`. |
| `className` | `string` | — | Class on the `<label>` row. |

+ native `<label>` HTML attributes except `htmlFor` and `size` (wired from context).
Ref: `forwardRef` → `HTMLLabelElement`.

### Checkbox.Hint
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Description text, aligned with the text column; added to `aria-describedby`. |
| `className` | `string` | — | Class on the `<p>`. |

+ native `<p>` props except `id` (fixed to `<inputId>-hint`). No ref.

### Checkbox.Error
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Error text in `danger-text`; while mounted the field is invalid. |
| `className` | `string` | — | Class on the `<p>`. |

+ native `<p>` props except `id` (fixed to `<inputId>-error`). No ref.

## Variants
Checkbox has no `variant`/`tone`/`color`. Axes: `size`, `fullWidth`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 14px box, 4px gap, 12/16 text | dense tables, filters in a 28px toolbar | |
| `s` | 16px box, 8px gap, 13/20 text | compact forms and side panels | |
| `m` | 18px box, 8px gap, 14/20 text | regular forms and settings | yes |
| `l` | 20px box, 8px gap, 16/24 text | spacious forms, onboarding | |
| `xl` | 24px box (radius 6), 12px gap, 16/24 text | touch-first screens | |

### fullWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | field shrinks to its content, text wraps inside the container | choices placed side by side or in a list | yes |
| `true` | field stretches to 100% of the container | the label row must fill a grid cell or a card row | |

**Combinations**
- Match the checkbox `size` to the fields and buttons of the same form (`m` with `m`).
- `indeterminate` only on a parent checkbox that controls a group; leaf options never use it.
- `invalid` together with a `Checkbox.Error` text is redundant — the error already sets it. Use bare `invalid` only when the message is shown elsewhere.

**Sizes** — the box is optically centred on the first text line; label text follows the tier text size (12 · 13 · 14 · 16 · 16).

**Hierarchy** — a parent checkbox sits above its children; nested options are indented by the box width plus the gap so they align with the parent text (see [settings-card.tsx](examples/settings-card.tsx)).

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| unchecked | `checked={false}` / default | `data-state="unchecked"` | box `fill-strong`, hover `fill-strong-hover` |
| checked | `checked` / `defaultChecked` | `data-state="checked"` | box `accent-default` (hover `accent-hover`), check mark in `accent-fg` drawn in with a stroke reveal |
| indeterminate | `indeterminate` | `data-state="indeterminate"`, `input.indeterminate` | accent box with a horizontal bar |
| invalid | `invalid` or mounted `Checkbox.Error` | `data-invalid="true"`, `aria-invalid` on input | unchecked box gets a `danger-border` inset ring; focus ring turns `danger-border` |
| disabled | `disabled` | `data-disabled="true"` on root and label | box `fill-muted`, mark `text-disabled`, `cursor: not-allowed`, hint dimmed |
| active | pointer press | — | box scales to 92% |
| focus-visible | keyboard focus | — | outer focus ring around the box |

Root also carries `data-size` and `data-full-width="true"` when `fullWidth`.
Controlled: `checked` + `onCheckedChange`. Uncontrolled: `defaultChecked` (+ optional `onCheckedChange`). There is no native `onChange` prop.

## Layout & spacing
- Grid `[box][text]`; `Checkbox.Hint` / `Checkbox.Error` sit under the text column, not under the box.
- Checkboxes in a vertical list: gap `--prime-space-3` (12px); separate fields/groups: `--prime-space-5` (20px); group → group `--prime-space-8`.
- Group several checkboxes in a `role="group"` container named by a `Typography.Root` heading via `aria-labelledby` (gap on the container, no margins); nested options indent by `calc(var(--prime-control-m-choice) + var(--prime-control-m-gap))`.
- Long labels wrap (`overflow-wrap: anywhere`); the field is `max-width: 100%` and works from 320px.

## Accessibility
- Native `<input type="checkbox">` (visually hidden, still in the box for validation bubbles), associated with the `<label>` via `htmlFor`.
- Keyboard: Tab focuses, Space toggles.
- `aria-invalid` is set when invalid; `aria-describedby` = your ids + hint id + error id (only mounted parts).
- Without visible text, pass `aria-label` on `Checkbox.Root` (it lands on the input).
- `required` goes to the native input; no visual asterisk is drawn — state it in the label text or a hint.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All size tiers | Choosing the tier next to other controls |
| [states.tsx](examples/states.tsx) | Unchecked, checked, indeterminate, invalid, disabled | Reference for every state |
| [hint-error.tsx](examples/hint-error.tsx) | `Checkbox.Hint` and `Checkbox.Error` | Consents and options that need an explanation or validation |
| [select-all.tsx](examples/select-all.tsx) | Controlled «select all» with `indeterminate` | Bulk selection in lists |
| [settings-card.tsx](examples/settings-card.tsx) | Named group with parent and nested options, disabled option with hint, inside a Card with `Card.Actions` (primary last) | Grouped preferences in a settings form |
| [without-label.tsx](examples/without-label.tsx) | Empty `Checkbox.Label` + `aria-label`, `name`/`value` | Row selection in tables |

```tsx
import { Checkbox } from "prime-ui-kit";

export function TermsCheckbox() {
  return (
    <Checkbox.Root name="terms" required>
      <Checkbox.Label>Принимаю условия оферты</Checkbox.Label>
      <Checkbox.Hint>Без этого мы не сможем оформить заказ.</Checkbox.Hint>
    </Checkbox.Root>
  );
}
```

## Mistakes
- `<Checkbox.Root onChange={…}>` → use `onCheckedChange={(checked) => …}`.
- `<Checkbox.Root>Текст</Checkbox.Root>` → wrap the text in `Checkbox.Label`; text placed directly in Root is not the checkbox's label.
- `invalid` plus `Checkbox.Error` → just mount `Checkbox.Error`.
- Several checkboxes for one-of-many → use `Radio.Root` with items.
- Checkbox that saves instantly («Тёмная тема») → use `Switch`.
- `style` on `Checkbox.Root` expecting to style the wrapper → it goes to the hidden input; use `className`.

## Related
[Radio](../radio/COMPONENT.md) · [Switch](../switch/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md) · [Label](../label/COMPONENT.md) · [Hint](../hint/COMPONENT.md)
