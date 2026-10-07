# TagSelect

**Category:** selection
**Kind:** field

> A multi-value field that shows the picked values as coloured tags, filters as you type and can create new tags.

## When to use
- Several values from a dictionary shown as removable chips: labels, cities, channels, watchers.
- Users may add a value that is not in the list (`creatable`).
- Users maintain the dictionary themselves: rename, recolor or delete options from the list (`onOptionUpdate`, `onOptionDelete`).

## When not to use
- One value → use [Select](../select/COMPONENT.md).
- A few values from a short closed list where chips are not needed → use [Select](../select/COMPONENT.md) with `multiple`.
- 2–6 independent options that should all be visible → use [Checkbox](../checkbox/COMPONENT.md).
- Values shown outside a field → use [Badge](../badge/COMPONENT.md) (`onRemove` for removable ones).

## Import
```tsx
import { TagSelect, type TagSelectOption } from "prime-ui-kit";
```

## Anatomy
```
TagSelect                       field frame: label · control · hint/error (single export)
├── control                     field fill, one row at rest, wraps when focused
│   ├── chip row                ScrollContainer: Badge chips (one tier down) · «+N» Badge · input
│   │   └── <input role="combobox">
│   └── chevron
└── list (portal)               role="listbox", multi-select
    ├── panel hint              labels.panelHint
    ├── «Создать» row           with `creatable`
    └── option row              Checkbox.Indicator · Badge [· «⋯» Button → Popover menu]
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### TagSelect
`ref` → `HTMLDivElement` (the field frame). The field frame with a chip row and an `<input role="combobox">`, and a portaled multi-select list; options come as data.

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `TagSelectOption[]` | — (required) | Available tags: `{ value, label, color?, disabled? }`. |
| `value` | `string[]` | — | Controlled picked values. |
| `defaultValue` | `string[]` | `[]` | Initial picked values, uncontrolled. |
| `onValueChange` | `(value: string[]) => void` | — | Called with the new list after a pick, a removal or a creation. |
| `open` | `boolean` | — | Controlled open state of the list. |
| `defaultOpen` | `boolean` | `false` | Initial open state, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: field click, Escape, an outside press. |
| `creatable` | `boolean` | `false` | A typed text that is not an option can be added (the Create row or Enter). |
| `onCreate` | `(value: string) => void` | — | A new value was created, not picked from `options`. |
| `defaultColor` | `PaletteColor` | `"gray"` | Chip color of values without an option color, created ones included. |
| `onOptionUpdate` | `(value: string, updates: { label?: string; color?: PaletteColor }) => void` | — | Enables the row «⋯» menu with the tag name and color; `value` never changes. |
| `onOptionDelete` | `(value: string) => void` | — | Enables «Удалить» in the row menu; the value also leaves the selection. |
| `label` | `ReactNode` | — | Field label above; names the input. |
| `hint` | `ReactNode` | — | Support text under the field; linked by `aria-describedby`. |
| `error` | `ReactNode` | — | Error message; replaces the hint and implies `invalid`. |
| `required` | `boolean` | `false` | Red `*` after the label and `aria-required` on the input. |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `invalid` | `boolean` | `false` | Danger inset ring and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Disabled field and chips; the list never opens. |
| `placeholder` | `string` | `""` | Text in the input while no tag is picked. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier; the list uses the same tier, chips one tier down. |
| `focusRing` | `boolean` | `true` | `false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring. |
| `id` | `string` | — | Id of the input; generated when omitted. |
| `labels` | `Partial<TagSelectLabels>` | — | Built-in strings, see Labels (`colorNames` merges by key). |
| `aria-label · aria-labelledby` | `string` | — | Name of the input and the list when there is no `label`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

## Variants
No `variant` or `tone`. The control is the field look; chips are soft Badges on the field's wash (neutral chips a stronger wash, hue chips a wash of their hue); the list is the shared floating panel.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 field, xs chips | Dense filters | |
| `s` | 32 field, xs chips | Compact panels | |
| `m` | 36 field, s chips | Regular forms | yes |
| `l` | 40 field, m chips | Spacious forms | |
| `xl` | 48 field, l chips | Touch-first screens | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `creatable` | a «Создать» row with the preview chip while the typed text is new | The dictionary is open | `false` |
| `onOptionUpdate` / `onOptionDelete` | a «⋯» button on the highlighted row opening a rename / color / delete menu | Users keep their own tags | |
| `disabled` | disabled fill, muted chips, no list | Not editable now | `false` |
| `invalid` / `error` | danger inset ring (+ the message) | Validation failed | |

## States
| State | Driven by | DOM |
|---|---|---|
| collapsed / expanded | focus inside or the list open | `data-expanded="true"` on the control: every chip on up to three rows (then scroll with edge fades); the height animates |
| open | focus, typing, arrows | `data-state="open"` on the control; list `data-state`, `data-side` |
| overflow | more chips than fit at rest | a «+N» Badge button with `labels.more` and the hidden labels in `title` |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` on the input |
| disabled | `disabled` | `data-disabled="true"`, native `disabled` on the input |
| option highlighted / selected / disabled | keyboard and pointer / value / option `disabled` | `data-highlighted`, `aria-selected` + checked indicator, `data-disabled` |

## Layout & spacing
- The field is 100% wide; set the width with the layout.
- Chips sit `--prime-space-1` apart; the chip row keeps `--prime-focus-space` so chip rings are never cut.
- The list is at least the field width and `--prime-panel-min-width`; max height `--prime-panel-max-height`, flips near the viewport edge.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `ArrowDown` · `ArrowUp` | Open the list and move the highlight over the options. |
| `Enter` · `Space` | Tick or untick the highlighted option; on the Create row, create the tag. |
| `Backspace` | In an empty input removes the last tag. |
| `ArrowLeft` · `ArrowRight` | From the start of the input move focus over the tags and back to the input. |
| `Delete` | On a tag removes it; focus moves to the neighbour tag. |
| `Escape` | Closes the list. |

### ARIA
- The input is `role="combobox"` with `aria-expanded` and `aria-controls`; the list is `role="listbox"` with `aria-multiselectable`, options are `role="option"` with `aria-selected`.
- The highlight goes through `aria-activedescendant`; the checkbox in a row is decorative.
- A removal is announced with `labels.removed` in a live region; the remove button is named by `labels.remove`.
- The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `panelHint` | `"Выберите вариант или создайте новый"` | Line above the list; `""` hides it. |
| `create` | `"Создать"` | Action text before the preview of a new tag. |
| `remove` | `"Удалить {label}"` | Accessible name of a chip's remove button; `{label}` is the tag text. |
| `more` | `"Показать ещё {count}"` | Accessible name of the «+N» chip; `{count}` is the number of hidden tags. |
| `removed` | `"Удалено: {label}"` | Screen-reader announcement after a tag is removed. |
| `edit` | `"Изменить тег {label}"` | Accessible name of a row's «⋯» menu button. |
| `name` | `"Название тега"` | Accessible name of the tag name field in the menu. |
| `delete` | `"Удалить"` | Delete button in the menu. |
| `colors` | `"Цвета"` | Heading of the color list in the menu. |
| `colorNames` | `"По умолчанию · Красный · Оранжевый · …"` | Names of the palette colors in the menu, by `PaletteColor` key. |
| `optional` | `"необязательно"` | Muted marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled tag field: focus opens the list, typing filters it, picked tags become chips — `label`, `options`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier with two picked tags; chips sit one tier below the field — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a disabled and an invalid one, with a disabled option in the list — `disabled`, `invalid`. |
| [validation.tsx](examples/validation.tsx) | Required and optional markers, a hint, and an error that replaces the hint in the same row — `required`, `optional`, `hint`, `error`. |
| [creatable.tsx](examples/creatable.tsx) | A typed text that is not in the list becomes a new tag from the Create row or Enter — `creatable`, `onCreate`, `defaultColor`. |
| [many-tags.tsx](examples/many-tags.tsx) | More tags than fit: at rest one row with «+N», focused every tag on up to three wrapped rows that scroll — `defaultValue`. |
| [manage-tags.tsx](examples/manage-tags.tsx) | Users keep their own tag dictionary: the row «⋯» menu renames, recolors or deletes an option — `onOptionUpdate`, `onOptionDelete`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value: a preset button replaces the tags and the count follows them — `value`, `onValueChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the list: a button opens it from code, Escape or an outside press closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | A new task form: the required labels field is checked on submit and its error replaces the hint — `required`, `error`, `creatable`. |

## Mistakes
- `TagSelect.Root` → TagSelect is a single export: `<TagSelect …/>`.
- Options as JSX children → pass `options` data.
- `onOptionUpdate` without updating your `options` → the rename disappears on the next render; keep `options` in state.
- A TagSelect for one value → use Select.

## Related
- **Built from:** [Badge](../badge/COMPONENT.md) (chips, «+N»), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator`), [ScrollContainer](../scroll-container/COMPONENT.md) (chip row, list), [Popover](../popover/COMPONENT.md), [Button](../button/COMPONENT.md), [Input](../input/COMPONENT.md) and [Divider](../divider/COMPONENT.md) (row menu), [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) (field frame)
- **See also:** [Select](../select/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Checkbox](../checkbox/COMPONENT.md)
