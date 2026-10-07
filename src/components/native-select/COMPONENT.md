# NativeSelect

**Category:** selection
**Kind:** field

> The system `<select>` in the kit's field look: the operating system's picker opens on phones.

## When to use
- Mobile-first forms where the OS picker is easier than a floating list.
- A short list of plain text options that must post with a form (`name`, FormData).
- Settings screens where the native control and its keyboard are expected.

## When not to use
- Options with icons, pictures, descriptions or a search field → use [Select](../select/COMPONENT.md).
- Several values → use [Select](../select/COMPONENT.md) with `multiple` or [TagSelect](../tag-select/COMPONENT.md).
- Two to five options that should all be visible → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md).

## Import
```tsx
import { NativeSelect } from "prime-ui-kit";
```

## Anatomy
```
NativeSelect          field frame: label row · control · support row
├── Label             from `label` (required / optional markers)
├── <select>          the system control, field fill, tier height
│   └── <option> / <optgroup>   the consumer's children (+ the placeholder option)
├── chevron           kit icon over the end (aria-hidden)
└── Hint              from `hint` / `error`
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### NativeSelect
`ref` → `HTMLSelectElement`. The system `<select>` in the field look with the label row and the support row; the kit chevron over its end. + native `<select>` props except `size` and `multiple`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Field label above; a `<label htmlFor>` of the select. |
| `hint` | `ReactNode` | — | Support text under the field; linked by `aria-describedby`. |
| `error` | `ReactNode` | — | Error message; replaces the hint and implies `invalid`. |
| `required` | `boolean` | `false` | Red `*` after the label and native `required`. |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `invalid` | `boolean` | `false` | Danger inset ring and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Disabled field fill and text. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier: height, padding, text; the label and the hint follow it. |
| `placeholder` | `string` | — | Empty first option shown in the placeholder color while nothing is picked. |
| `value` | `string` | — | Controlled value (native); with `onValueChange` or `onChange`. |
| `defaultValue` | `string` | — | Initial value, uncontrolled. |
| `onValueChange` | `(value: string) => void` | — | Called with the picked value; native `onChange` still fires. |
| `focusRing` | `boolean` | `true` | `false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring. |
| `labels` | `Partial<NativeSelectLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | Native `<option>` and `<optgroup>` elements. |
| `…rest` | `Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" \| "multiple">` | — | `id`, `name`, `onChange`, `aria-*`, `className` (on the field wrapper) and the other select attributes. |

## Variants
One look, the Select trigger's: field fill, inset control border, tier radius; the open list is drawn by the browser and the OS.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 high, text 12/16 | Dense toolbars | |
| `s` | 32 high, text 13/20 | Compact forms | |
| `m` | 36 high, text 14/20 | Most forms | yes |
| `l` | 40 high, text 16/24 | Roomy forms | |
| `xl` | 48 high, text 16/24 | Touch-first screens | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `required` | red `*` after the label | The form cannot be sent without it | `false` |
| `optional` | muted «необязательно» | Most fields are required | |
| `invalid` / `error` | danger inset ring (+ the message) | Validation failed | |
| `disabled` | disabled fill and text | Not editable now | `false` |
| `focusRing={false}` | no focus ring | Focus is obvious otherwise | `true` |

## States
| State | Driven by | DOM |
|---|---|---|
| placeholder shown | `placeholder` and no value | the empty first option is selected; placeholder text color |
| invalid | `invalid` or `error` | `aria-invalid="true"`, `data-invalid="true"` |
| disabled | `disabled` | native `disabled` |
| size | `size` | `data-size` |
| focus ring off | `focusRing={false}` | `data-focus-ring="false"` |

## Layout & spacing
- Full width of its column; label → field and field → hint gaps come from the tier (`label-gap`, `hint-gap`).
- The chevron sits padX from the end; the text keeps padX + icon + padX free on that side.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` · `ArrowDown` | Open the system list (browser and OS behaviour). |
| `ArrowUp` · `ArrowDown` | On the closed field change the value (in most browsers). |

### ARIA
- It is a real `<select>`: the role, the keyboard and the list come from the browser and the OS.
- `label` is a `<label htmlFor>`; the hint and the error are linked by `aria-describedby`, the error sets `aria-invalid`.
- The chevron is decorative (`aria-hidden`).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `optional` | `"необязательно"` | Muted marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled system select with a hint; the OS picker opens on phones — `label`, `hint`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the label and the hint follow the field tier — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a disabled and an invalid one — `disabled`, `invalid`. |
| [validation.tsx](examples/validation.tsx) | Required and optional markers, a hint, and an error that replaces the hint in the same row — `required`, `optional`, `hint`, `error`. |
| [option-groups.tsx](examples/option-groups.tsx) | Options under group headings with the native optgroup, and a placeholder while nothing is picked — `placeholder`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value: the plan drives the price under the field — `value`, `onValueChange`. |
| [in-form.tsx](examples/in-form.tsx) | A delivery form for phones: the native value goes into FormData, the required city is checked on submit — `name`, `required`, `error`. |

## Mistakes
- `Select.Item` parts as children → NativeSelect takes plain `<option>` / `<optgroup>`.
- Rich options (icons, descriptions) → the system list cannot draw them; use Select.
- A placeholder as the only label → keep `label`; the placeholder is just the empty option.
- Several values with `multiple` → not supported; use Select `multiple` or TagSelect.

## Related
- **Built from:** [Label](../label/COMPONENT.md), [Hint](../hint/COMPONENT.md) (field frame)
- **See also:** [Select](../select/COMPONENT.md), [Radio](../radio/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
