# TagSelect

**Category:** selection

> A multi-select field that shows the chosen values as coloured tags, filters as you type and can create new tags.

## When to use
- Several values from a dictionary shown as removable chips: labels, cities, channels, watchers.
- Users may add a value that is not in the list (`creatable`).
- Users maintain the dictionary themselves: rename, recolor or delete options from the list (`onOptionUpdate`, `onOptionDelete`).

## When not to use
- One value → use [Select](../select/COMPONENT.md) instead.
- A few values from a short closed list where chips are not needed → use [Select](../select/COMPONENT.md) with `multiple` instead.
- 2–6 independent options that should all be visible → use [Checkbox](../checkbox/COMPONENT.md) instead.
- Values shown outside a field → use [Badge](../badge/COMPONENT.md) (`onRemove` for removable ones).

## Import
```tsx
import { TagSelect, type TagSelectOption } from "prime-ui-kit";
```

## Anatomy
Single part `TagSelect.Root`. It renders:
```
field frame: label · control · hint/error
└─ control (field fill)
   ├─ chips (Badge with `onRemove`, one tier below the field) · «+N» chip button when collapsed
   ├─ text input (role="combobox")
   └─ chevron
portal panel (role="listbox"): panel hint · «Создать» row · option rows (checkbox + tag [+ «⋯» menu])
```

## API

### TagSelect.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `TagSelectOption[]` | — (required) | Dictionary: `{ value: string; label: string; color?: PaletteColor; disabled?: boolean }`. |
| `value` | `string[]` | — | Controlled selection in the order it was added; use with `onValueChange`. |
| `defaultValue` | `string[]` | `[]` | Initial selection in uncontrolled mode. |
| `onValueChange` | `(value: string[]) => void` | — | Called after adding, removing or creating a tag. |
| `open` | `boolean` | — | Controlled panel state. |
| `defaultOpen` | `boolean` | `false` | Initial panel state. |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the panel opens or closes. |
| `creatable` | `boolean` | `false` | Typing a value that is not in `options` shows a «Создать» row; Enter adds it. |
| `onCreate` | `(value: string) => void` | — | Called only for a created value (not for picks from `options`). |
| `defaultColor` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Chip colour for values without an option colour, including created ones. |
| `onOptionUpdate` | `(value: string, updates: { label?: string; color?: PaletteColor }) => void` | — | Enables the row «⋯» menu with name field and colour list. `value` never changes. |
| `onOptionDelete` | `(value: string) => void` | — | Enables «Удалить» in the row menu; the value is also removed from the selection. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier; the list uses the same tier, chips one tier down (`xs` chips at both `xs` and `s`). |
| `label` | `ReactNode` | — | Label above the field. |
| `required` | `boolean` | `false` | Red `*` after the label, `aria-required`. |
| `optional` | `boolean` | — | Muted `labels.optional` marker. |
| `hint` | `ReactNode` | — | Hint under the field. |
| `error` | `ReactNode` | — | Error message in the hint slot; non-empty implies `invalid`. |
| `invalid` | `boolean` | — | Danger ring and `aria-invalid` without a message. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring. |
| `disabled` | `boolean` | `false` | Disables the field, chips and the panel. |
| `placeholder` | `string` | `""` | Input placeholder while nothing is selected. |
| `id` | `string` | auto (`useId`) | Id of the text input. |
| `labels` | `Partial<TagSelectLabels>` | Russian defaults | System strings, see Accessibility. |
| `aria-label` | `string` | — | Name of the input and listbox without a visible `label`. |
| `aria-labelledby` | `string` | — | Id of the element that names the field. |
| `className` | `string` | — | Class on the field frame `div`. |

No other native props, no ref, no hidden form input (submit `value` from state).

## Variants
No `variant`/`tone`. Axes: `size`, chip `color` (per option / `defaultColor`), behaviour flags (`creatable`, manageable rows).

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px field, `xs` chips (no smaller tier), 24px list rows | dense filters | |
| `s` | 32px field, `xs` chips, 28px rows | compact panels | |
| `m` | 36px field, `s` chips, 32px rows | regular forms | yes |
| `l` | 40px field, `m` chips, 36px rows | spacious forms | |
| `xl` | 48px field, `l` chips, 40px rows | touch-first screens | |

### color (option `color` / `defaultColor`)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral soft tag | people, plain values | `defaultColor` |
| `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | soft tag of the hue | categories that users recognise by colour | |

### Behaviour flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `creatable` | «+ Создать [preview tag]» row while the query has no exact match | open vocabularies (labels) | `false` |
| `onOptionUpdate` / `onOptionDelete` set | each enabled row gets a «⋯» button opening a Popover: name field, «Удалить», colour list | user-managed dictionaries | off |

**Combinations**
- `creatable` + `onOptionUpdate` → created tags can be renamed/recoloured at once; keep `options` in state and merge updates (see [manage-tags.tsx](examples/manage-tags.tsx)).
- `onOptionDelete` without keeping `options` in state → the option comes back on the next render; always remove it from your `options`.
- `labels={{ panelHint: "" }}` hides the line above the list — use it for plain dictionaries (people).

**Sizes** — single-row field height equals `--prime-control-<tier>-height`, aligned with Input and Select of the same tier.

**Hierarchy** — inside a Card the field fill switches to the surface variant like Input next to it.

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| collapsed | no focus inside, panel closed | control without `data-expanded` | one row; chips that do not fit go into a «+N» chip (`title` lists them) |
| expanded | focus inside or panel open | `data-expanded="true"` | all chips on several rows (up to three, then the field scrolls) |
| open | typing / click / ↑ ↓ | `data-state="open"`, `aria-expanded` on input; panel `data-state`, `data-side` | panel under the field; selected options first with a check, then the rest |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` | inset `danger-border` ring, error text |
| disabled | `disabled` | `data-disabled="true"`, native `disabled` | disabled field fill, dimmed chips |
| option disabled | `options[i].disabled` | row `data-disabled`, native `disabled` | dimmed tag, not selectable, excluded from search |
| focus-visible | keyboard | `data-focus-ring="false"` when `focusRing={false}` | inset focus ring on the control |

The panel opens only when it has rows (matches or a create row) and closes when it has none. It follows the overlay contract: outside press and Escape close it; the manage Popover is a separate topmost layer.
Controlled: `value` + `onValueChange`, `open` + `onOpenChange`. Uncontrolled: `defaultValue`, `defaultOpen`.

## Layout & spacing
- Field is 100% wide; set width with the layout.
- Label → field: tier `label-gap`; field → field in a form: `--prime-space-5`.
- Chips are one tier below the field and never change the single-row height in the collapsed state.

## Accessibility
- The only tab stop is the text input (`role="combobox"`, `aria-autocomplete="list"`, `aria-controls`, `aria-activedescendant`, `aria-describedby`, `aria-required`, `aria-invalid`).
- Listbox `role="listbox"` `aria-multiselectable`, rows `role="option"` with `aria-selected`.
- Keyboard: ↑ / ↓ open and move, Enter / Space toggle the highlighted row (or create), Escape closes, Backspace in an empty input removes the last chip, ← from the start of the input moves to chips, ← / → between chips, Delete / Backspace on a chip remove it (focus moves to a neighbour). Removal is announced in a polite live region.
- `labels` keys (defaults):
  - `panelHint` — «Выберите вариант или создайте новый» (`""` hides it)
  - `create` — «Создать»
  - `remove` — «Удалить {label}» (chip remove button)
  - `more` — «Показать ещё {count}» («+N» button)
  - `removed` — «Удалено: {label}» (live announcement)
  - `edit` — «Изменить тег {label}» («⋯» button)
  - `name` — «Название тега» (name field in the menu)
  - `delete` — «Удалить»
  - `colors` — «Цвета» (colour list heading)
  - `colorNames` — gray «По умолчанию», red «Красный», orange «Оранжевый», yellow «Жёлтый», green «Зелёный», blue «Синий», purple «Фиолетовый», pink «Розовый», sky «Голубой», teal «Бирюзовый»
  - `optional` — «необязательно»

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All size tiers with chips | Matching other controls |
| [states.tsx](examples/states.tsx) | Empty, «+N» overflow, error, disabled, disabled option | Reference for every state |
| [manage-tags.tsx](examples/manage-tags.tsx) | Controlled, `creatable`, `onOptionUpdate`, `onOptionDelete`, custom `labels` | User-managed tag dictionary |
| [in-form.tsx](examples/in-form.tsx) | Card form with `creatable` labels and `optional` watchers next to Input | Tag fields in forms |

```tsx
import { TagSelect, type TagSelectOption } from "prime-ui-kit";

const options: TagSelectOption[] = [
  { value: "bug", label: "Ошибка", color: "red" },
  { value: "feature", label: "Новая функция", color: "blue" },
];

export function LabelsField() {
  return (
    <TagSelect.Root label="Метки" options={options} defaultValue={["bug"]} creatable />
  );
}
```

## Mistakes
- Children like `<TagSelect.Item>` → there are none; pass `options`.
- `onChange` → use `onValueChange` (`string[]`).
- `onOptionDelete` / `onOptionUpdate` without updating your `options` state → changes are lost.
- Using it for a single value → use `Select`.
- Expecting `name` / form submission → there is no hidden input; submit `value` from state.

## Related
[Select](../select/COMPONENT.md) · [Badge](../badge/COMPONENT.md) · [Input](../input/COMPONENT.md) · [Popover](../popover/COMPONENT.md)
