# Radio

**Category:** selection (Выбор)

> Radio buttons for choosing exactly one option out of a small visible set.

## When to use
- One choice out of 2–7 visible options where the user benefits from seeing all of them at once: plan, payment method, delivery slot.
- Options that need a description under the label (`Radio.Hint`) or a reason why one is unavailable.
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
Radio.Group             role="radiogroup"; value, name, size and shared flags
└─ Radio.Root           one option (value); ref and input props go to the hidden native input
   ├─ Radio.Label       clickable row: renders the native input, the circle and the text
   ├─ Radio.Hint        description under the text column (optional)
   └─ Radio.Error       error message under the text column (optional, makes the option invalid)
```
`Radio.Root` must be inside `Radio.Group`; the native `input type="radio"` is rendered by `Radio.Label`.

## API

### Radio.Group
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected value; use with `onValueChange`. |
| `defaultValue` | `string` | — | Initial value in uncontrolled mode; nothing selected when omitted. |
| `onValueChange` | `(value: string) => void` | — | Called with the chosen option's `value` (click, Space, arrows). |
| `name` | `string` | auto (`useId`) | Native `name` shared by all radios. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier for every option. |
| `orientation` | `"vertical" \| "horizontal"` | `"vertical"` | Stack the options or lay them out in a wrapping row. |
| `invalid` | `boolean` | `false` | Invalid state for every option (`aria-invalid` on the group and inputs). |
| `required` | `boolean` | `false` | Native `required` on the radios and `aria-required` on the group. |
| `disabled` | `boolean` | `false` | Disables every option. |
| `fullWidth` | `boolean` | `false` | Stretch every option to the container width. |
| `className` | `string` | — | Class on the group `div`. |

+ native `<div>` props except `defaultValue`, `onChange`, `dir` (use `aria-label` / `aria-labelledby` to name the group).
Ref: `forwardRef` → `HTMLDivElement`.

### Radio.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value reported to the group when this option is chosen. |
| `invalid` | `boolean` | `false` | Invalid state for this option only; also set by the group or a mounted `Radio.Error`. |
| `disabled` | `boolean` | `false` | Disables this option (the group's `disabled` wins). |
| `id` | `string` | auto (`useId`) | Id of the native input; hint/error ids derive from it. |
| `aria-describedby` | `string` | — | Extra description ids; merged with the mounted hint and error ids. |
| `className` | `string` | — | Class on the option wrapper `div`. |
| `children` | `ReactNode` | — | `Radio.Label`, `Radio.Hint`, `Radio.Error`. |

+ native `<input>` props except `type`, `size`, `checked`, `defaultChecked`, `onChange`, `name`, `value`, `children` — applied to the hidden native input. `required` on `Radio.Root` is ignored (overridden by the group): set `required` on `Radio.Group`.
Ref: `forwardRef` → `HTMLInputElement`. No `asChild`.

### Radio.Label
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Label text. |
| `className` | `string` | — | Class on the `<label>` row. |

+ native `<label>` HTML attributes except `htmlFor` and `size`. Ref: `forwardRef` → `HTMLLabelElement`.

### Radio.Hint
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Description text under the label; added to `aria-describedby`. |
| `className` | `string` | — | Class on the `<p>`. |

+ native `<p>` props except `id`. No ref.

### Radio.Error
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | Error text in `danger-text`; while mounted the option is invalid. |
| `className` | `string` | — | Class on the `<p>`. |

+ native `<p>` props except `id`. No ref.

## Variants
No `variant`/`tone`/`color`. Axes on `Radio.Group`: `size`, `orientation`, `fullWidth`.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 14px circle, 4px gap, 12/16 text | dense filters and tables | |
| `s` | 16px circle, 8px gap, 13/20 text | compact forms and side panels | |
| `m` | 18px circle, 8px gap, 14/20 text | regular forms | yes |
| `l` | 20px circle, 8px gap, 16/24 text | spacious forms, onboarding | |
| `xl` | 24px circle, 12px gap, 16/24 text | touch-first screens | |

### orientation
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `vertical` | options stacked, gap `--prime-space-2` | options with descriptions, more than 3 options | yes |
| `horizontal` | options in a wrapping row, column gap `--prime-space-5`, row gap `--prime-space-2` | 2–4 short labels without hints | |

### fullWidth
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `false` | each option is as wide as its content | most cases | yes |
| `true` | each option stretches to the container width | options laid out in a grid or a card list | |

**Combinations**
- `orientation="horizontal"` with `Radio.Hint` on options → avoid: descriptions break the row; use vertical.
- `invalid` on the group plus one `Radio.Error` under the last option — show a group error once.
- `fullWidth` with `horizontal` is pointless: every option takes the full row.

**Sizes** — match the form: `m` radios next to `m` inputs and buttons. The circle is centred on the first text line.

**Hierarchy** — one group per question; name it with a visible heading (`Typography.Root` with an `id`) + `aria-labelledby` on `Radio.Group`, or with `aria-label`.

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| unselected | group `value` ≠ option `value` | `data-state="unchecked"` on option | circle `fill-strong`, hover `fill-strong-hover` |
| selected | group `value` = option `value` | `data-state="checked"` | circle `accent-default` (hover `accent-hover`) with a thumb-coloured dot (40%) that pops in |
| invalid | group `invalid`, option `invalid`, or mounted `Radio.Error` | `data-invalid="true"`, `aria-invalid` | unselected circle gets a `danger-border` inset ring; focus ring `danger-border` |
| disabled | group or option `disabled` | `data-disabled="true"`, `aria-disabled` on group | circle `fill-muted`, dot `text-disabled`, `cursor: not-allowed` |
| active | pointer press | — | circle scales to 92% |
| focus-visible | keyboard | — | outer focus ring around the circle |

Group carries `data-size`, `data-orientation`, `data-invalid`, `data-disabled`, `aria-orientation`, `aria-required`. Option carries `data-size`, `data-state`, `data-invalid`, `data-disabled`, `data-full-width`.
Controlled: `value` + `onValueChange`. Uncontrolled: `defaultValue`.

## Layout & spacing
- Options inside a group: gap `--prime-space-2` (vertical) — set your own gap via `className` when options have hints (e.g. `--prime-space-4`).
- Group heading → first option: `--prime-space-2` (gap on the parent, no margins); group → group: `--prime-space-8`.
- In a Card: content in `Card.Body`, buttons in `Card.Actions` as a direct child of `Card.Root` after the body, primary action last.
- Hint and error align with the text column, not with the circle.
- Long labels wrap; works from 320px (horizontal rows wrap).

## Accessibility
- Group: `role="radiogroup"`, `aria-orientation`, `aria-invalid`, `aria-required`, `aria-disabled`. Name it with `aria-labelledby` (pointing at a visible heading) or `aria-label`.
- Options are native `<input type="radio">` sharing one `name`: Tab enters the group, arrow keys move the selection, Space selects.
- Each input gets `aria-describedby` = your ids + hint id + error id.
- No `labels` keys.

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All size tiers | Choosing the tier next to other controls |
| [states.tsx](examples/states.tsx) | Unselected, selected, invalid, disabled | Reference for every state |
| [hint-error.tsx](examples/hint-error.tsx) | Required invalid group with hints and one error, named by a heading via `aria-labelledby` | Validating a one-of-many form question |
| [horizontal.tsx](examples/horizontal.tsx) | `orientation="horizontal"` with a heading via `aria-labelledby` | 2–4 short options in a row |
| [plan-picker.tsx](examples/plan-picker.tsx) | Controlled group in a Card with descriptions, a disabled option, summary text and `Card.Actions` (primary last) | A choice with consequences in a settings form |

```tsx
import { Radio } from "prime-ui-kit";

export function PeriodRadio() {
  return (
    <Radio.Group name="period" defaultValue="week" aria-label="Период отчёта">
      <Radio.Root value="week">
        <Radio.Label>Неделя</Radio.Label>
      </Radio.Root>
      <Radio.Root value="month">
        <Radio.Label>Месяц</Radio.Label>
      </Radio.Root>
    </Radio.Group>
  );
}
```

## Mistakes
- `Radio.Root` outside `Radio.Group` → always wrap options in `Radio.Group` (it throws without the context).
- `checked` / `onChange` on `Radio.Root` → put `value` / `onValueChange` on `Radio.Group`.
- `size` or `required` on `Radio.Root` → set them on `Radio.Group`.
- An error under every option → mark the group `invalid` and render one `Radio.Error`.
- Unnamed group → add `aria-labelledby` (visible heading) or `aria-label`.
- Raw `<p>` / `<legend>` with custom font CSS for the heading → use `Typography.Root` (e.g. `body-s`, `weight="medium"`, `tone="secondary"`).
- `Card.Actions` inside `Card.Body`, primary button first → put `Card.Actions` after `Card.Body`, primary last.

## Related
[Checkbox](../checkbox/COMPONENT.md) · [Switch](../switch/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md) · [Select](../select/COMPONENT.md)
