# Radio

**Category:** selection
**Kind:** control

> Radio buttons for choosing exactly one option out of a small visible set.

## When to use
- One choice out of 2–7 visible options where the user benefits from seeing all of them at once: plan, payment method, delivery slot.
- Options that need a description under the text (`hint` on `Radio.Root`) or a reason why one is unavailable.
- A required one-of-many question in a form.

## When not to use
- 2–4 short view modes or filters that apply instantly → use [SegmentedControl](../segmented-control/COMPONENT.md) instead.
- A long list (8+ options) or limited space → use [Select](../select/COMPONENT.md) instead.
- Independent yes/no options → use [Checkbox](../checkbox/COMPONENT.md) instead.
- A single on/off setting → use [Switch](../switch/COMPONENT.md) instead.

## Import
```tsx
import { Radio } from "prime-ui-kit";
```

## Anatomy
```
Radio.Group             field: group label → role="radiogroup" → hint | error; value, name, size, flags
└─ Radio.Root           one option (value): the <label> row with the input and the circle, its hint
   └─ Radio.Label       the visible text of the option
```
`Radio.Root` must be inside `Radio.Group`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Radio.Group
`forwardRef` → `HTMLDivElement` (the `role="radiogroup"` element). Owns the value, the shared `name` and size; renders the group label above and the hint / error below the options.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled value (the `value` of the chosen `Radio.Root`). |
| `defaultValue` | `string` | — | Initial value when uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called with the value of the newly chosen option. |
| `name` | `string` | — | Native `name` shared by the radios; generated when omitted. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of every circle, text, the label and the hint. |
| `label` | `ReactNode` | — | Group heading above the options; names the radiogroup through `aria-labelledby`. Without it, pass `aria-label`. |
| `required` | `boolean` | `false` | Red `*` after the label, native `required` on the radios and `aria-required` on the group. |
| `optional` | `boolean` | `false` | Muted marker right after the label text (`labels.optional`). |
| `hint` | `ReactNode` | — | Help text under the options. Hidden while `error` is shown. |
| `error` | `ReactNode` | — | Error message under the options; implies `invalid`. |
| `invalid` | `boolean` | `false` | Danger ring on the unchecked circles and `aria-invalid` on the group and the inputs. A non-empty `error` implies it. |
| `disabled` | `boolean` | `false` | Disables every option. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | `vertical` stacks the options; `horizontal` lays them out in a wrapping row. Sets `aria-orientation`. |
| `labels` | `Partial<RadioGroupLabels>` | — | Built-in strings, see Labels. |
| `className` | `string` | — | Class on the outer field `<div>` (label, options, support row). |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" \| "onChange" \| "dir">` | — | `id`, `aria-label`, `aria-labelledby`, `aria-describedby` and the other attributes of the radiogroup element. |

### Radio.Root
`forwardRef` → `HTMLInputElement` (the native radio). One option inside `Radio.Group`: the `<label>` row with the input and the circle, and its hint; native input props go to the input.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value reported to the group when this option is chosen. |
| `hint` | `ReactNode` | — | Description under the option text, linked through `aria-describedby`. |
| `disabled` | `boolean` | `false` | Disables this option only. |
| `children` | `ReactNode` | — | `Radio.Label`. Without it only the circle renders — give the root an `aria-label`. |
| `className` | `string` | — | Class on the option `<div>`. |
| `…rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "size" \| "checked" \| "defaultChecked" \| "onChange" \| "name" \| "value">` | — | `id`, `aria-label`, `aria-describedby`, `onBlur`… on the native input. |

### Radio.Label
`ref` → `HTMLSpanElement`. The visible text in the text column of the option row. Native `<span>` props.

## Variants
No `variant` / `tone` / `color`.

### size (Radio.Group)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 14px circle, 4px gap, 12/16 text | dense filters and tables | |
| `s` | 16px circle, 8px gap, 13/20 text | compact forms and side panels | |
| `m` | 18px circle, 8px gap, 14/20 text | regular forms | yes |
| `l` | 20px circle, 8px gap, 16/24 text | spacious forms, onboarding | |
| `xl` | 24px circle, 12px gap, 16/24 text | touch-first screens | |

**Sizes:** match the form — `m` radios next to `m` inputs and buttons. The circle is centred on the first text line; the group label and hint take the same tier.

### orientation (Radio.Group)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `vertical` | options stacked, gap `--prime-space-2` | options with descriptions, more than 3 options | yes |
| `horizontal` | options in a wrapping row, column gap `--prime-space-5`, row gap `--prime-space-2` | 2–4 short labels without hints | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `required` | red `*` after the group label | the question must be answered | `false` |
| `optional` | muted «необязательно» after the group label | most questions are required | `false` |
| `invalid` | danger ring on the unselected circles | the message is shown elsewhere; otherwise pass `error` | `false` |
| `disabled` | muted circles and text | the whole question or one option is unavailable | `false` |

**Combinations**
- `orientation="horizontal"` with option hints → avoid: descriptions break the row; use vertical.
- One error per question: `error` on `Radio.Group`, never per option.
- `required` and `optional` together are pointless.

## States
| State | Driven by | DOM |
|---|---|---|
| unselected | group `value` ≠ option `value` | `data-state="unchecked"` on the option; circle `fill-strong`, hover `fill-strong-hover` |
| selected | group `value` = option `value` | `data-state="checked"`; accent circle with a thumb-coloured dot that grows in |
| invalid | `invalid` or a non-empty `error` on the group | `data-invalid="true"`, `aria-invalid` on the group and the inputs; danger ring on unselected circles |
| disabled | group or option `disabled` | `data-disabled="true"`, `aria-disabled` on the group; `fill-muted` circle, `cursor: not-allowed` |
| pressed | pointer press | the circle scales to the compact press scale |
| focus-visible | keyboard | outer focus ring around the circle |

The radiogroup carries `data-size`, `data-orientation`, `aria-orientation`, `aria-required`; options carry `data-size`, `data-state`, `data-invalid`, `data-disabled`. Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue`.

## Layout & spacing
- Group label → options: the tier `label-gap`; options → hint / error: the tier `hint-gap` (the same rhythm as fields).
- Options inside a group: gap `--prime-space-2`; group → group: `--prime-space-8`.
- An option hint aligns with the text column, not with the circle.
- Long labels wrap; horizontal rows wrap at narrow widths.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Focuses the selected option (or the first one when nothing is selected). |
| `ArrowDown` · `ArrowRight` · `ArrowUp` · `ArrowLeft` | Selects the next or previous option of the group (native radio behaviour). |
| `Space` | Selects the focused option. |

### ARIA
- `Radio.Group` is `role="radiogroup"`, named by its `label` through `aria-labelledby`, or by `aria-label`.
- `aria-required`, `aria-invalid` and `aria-orientation` sit on the group; the group hint or error is in its `aria-describedby`.
- Every option is a native `<input type="radio">` with the shared `name`; an option `hint` is linked through `aria-describedby`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Marker after the group label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled group of options with one chosen by default — `label`, `defaultValue`. |
| [sizes.tsx](examples/sizes.tsx) | Every size; the circle and the text follow the group tier — `size`. |
| [states.tsx](examples/states.tsx) | Every state, each in its own group and labelled by its prop — `value`, `invalid`, `disabled`. |
| [group.tsx](examples/group.tsx) | A required group with option descriptions and the group's error under the options — `label`, `required`, `hint`, `error`. |
| [orientation.tsx](examples/orientation.tsx) | Options stacked in a column and laid out in a wrapping row — `orientation`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the chosen plan and shows it in the hint — `value`, `onValueChange`. |

## Mistakes
- `Radio.Root` outside `Radio.Group` → it throws; every option needs the group.
- A heading made of `Typography` + `aria-labelledby` → pass `label` to `Radio.Group`.
- An error under one option → pass `error` to `Radio.Group`.
- Radios for an instant view switch → use `SegmentedControl`.
- Eight or more options → use `Select`.

## Related
- **Built from:** [Label](../label/COMPONENT.md) (group label, option rows), [Hint](../hint/COMPONENT.md) (`hint`, `error`)
- **See also:** [Checkbox](../checkbox/COMPONENT.md), [Switch](../switch/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md), [Select](../select/COMPONENT.md)
