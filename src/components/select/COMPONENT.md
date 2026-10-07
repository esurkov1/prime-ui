# Select

**Category:** selection

> A dropdown field for choosing one value (or several with `multiple`) from a closed list.

## When to use
- One value from a closed list of 5+ options in forms, filters and settings: country, role, time zone.
- A long list where search helps (`Select.Content searchable`, `keywords`).
- A few values from a short list shown as a comma-separated text (`multiple`).
- Options that need a thumbnail, a second line or a trailing meta (rich options).
- The OS picker on mobile-first forms (`native`).

## When not to use
- 2–5 options that should all be visible → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md) instead.
- Many values shown as removable tags, or creating new values → use [TagSelect](../tag-select/COMPONENT.md) instead.
- Free text input → use [Input](../input/COMPONENT.md) instead.
- A menu of actions (not a value) → use [Dropdown](../dropdown/COMPONENT.md) instead.
- Global search / command palette → use [CommandMenu](../command-menu/COMPONENT.md) instead.
- Dates → use [Datepicker](../datepicker/COMPONENT.md) instead.

## Import
```tsx
import { Select } from "prime-ui-kit";
```

## Anatomy
```
Select.Root                     field frame: label · control · hint/error; value and open state
├─ Select.Trigger               role="combobox" button (combobox mode)
│  ├─ Select.TriggerIcon        leading icon (optional)
│  ├─ Select.Value              selected label / placeholder, or a render function
│  └─ Select.Badge              status badge at the trailing edge (optional)
└─ Select.Content               portal panel: search row (optional), listbox, empty / loading rows
   ├─ Select.Group              role="group"
   │  ├─ Select.GroupLabel      group heading
   │  └─ Select.Item            role="option"
   │     ├─ Select.ItemIcon     icon before the text (optional)
   │     ├─ Select.ItemMedia    thumbnail tile (optional, makes the row two-line)
   │     ├─ Select.ItemText     title (optional; plain text children also work)
   │     ├─ Select.ItemDescription  muted second line (optional)
   │     └─ Select.ItemMeta     trailing meta before the check (optional)
   └─ Select.Separator          hairline between groups
```
`native` mode: `Select.Root native > Select.Item | Select.Group > (Select.GroupLabel, Select.Item)` — no Trigger/Content; it renders a system `<select>` (`Select.Group` → `<optgroup>`, `Select.Separator` is ignored).

## API

### Select.Root
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` (`string[]` with `multiple`) | — | Controlled value; use with `onValueChange`. |
| `defaultValue` | `string` (`string[]` with `multiple`) | — (`[]` with `multiple`) | Initial value in uncontrolled mode. |
| `onValueChange` | `(value: string) => void` (`(value: string[]) => void` with `multiple`) | — | Called after a pick or clear (`""` / `[]` after clearing). |
| `multiple` | `boolean` | `false` | Multi-select: value is `string[]` in pick order, options toggle, the panel stays open. |
| `native` | `boolean` | `false` | Render the system `<select>` from the same `Select.Item` parts. |
| `open` | `boolean` | — | Controlled open state (combobox mode only). |
| `defaultOpen` | `boolean` | `false` | Initial open state (combobox mode only). |
| `onOpenChange` | `(open: boolean) => void` | — | Called when the panel opens or closes (combobox mode only). |
| `clearable` | `boolean` | `false` | Clear button in the trigger and Delete / Backspace on it while a value is set (combobox mode only). |
| `loading` | `boolean` | `false` | Spinner instead of the chevron, `aria-busy`, a status row in the panel (combobox mode only). |
| `placeholder` | `string` | — | Text while empty (in `native` single mode an empty `<option>`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Size tier of the trigger, panel items, label and hint. |
| `label` | `ReactNode` | — | Label above the field, linked to the control. |
| `required` | `boolean` | `false` | Red `*` after the label; `aria-required` (native: `required`). |
| `optional` | `boolean` | — | Muted `labels.optional` marker after the label. |
| `hint` | `ReactNode` | — | Hint under the field; in `aria-describedby`. |
| `error` | `ReactNode` | — | Error message in the hint slot; a non-empty `error` implies `invalid`. |
| `invalid` | `boolean` | — | Danger ring and `aria-invalid` without a message. |
| `focusRing` | `boolean` | `true` | `false` hides only the visual focus ring (`data-focus-ring="false"`). |
| `disabled` | `boolean` | — | Disables the field. |
| `id` | `string` | auto (`useId`) | Id of the trigger or native `<select>`. |
| `labels` | `Partial<SelectLabels>` | Russian defaults | System strings, see Accessibility. |
| `className` | `string` | — | Class on the field frame `div`. |
| `children` | `ReactNode` | — (required) | `Trigger` + `Content`; in `native` mode `Item` / `Group` directly. |
| `name` | `string` | — | `native` only: form field name. |
| `aria-label` / `aria-labelledby` / `aria-describedby` | `string` | — | `native` only: naming of the `<select>`. |

No ref on Root. In combobox mode there is no hidden form input — submit the value from state.

### Select.Trigger
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Select.TriggerIcon`, `Select.Value`, `Select.Badge`; the chevron slot is added automatically. |
| `className` | `string` | — | Class on the `<button>`. |

+ native `<button>` props except `id`, `type`, `role` (`aria-label`, `onClick`, `onKeyDown`, … — your handlers run first).
Ref: `forwardRef` → `HTMLButtonElement`.

### Select.Value
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `(item: { value: string; label: string }) => ReactNode` | — | Single mode only: renders the selected option (e.g. `ItemMedia` + `ItemText` + `ItemDescription`); not called while empty. |
| `className` | `string` | — | Class on the value `<span>`. |

With `multiple`, the labels of selected options are joined with `", "`.

### Select.TriggerIcon
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Leading icon, tier icon size, `text-muted`. |
| `className` | `string` | — | Class on the `<span>`. |

+ native `<span>` props.

### Select.Badge
| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | `"gray"` | Hue of the soft badge (one tier below the field). |
| `children` | `ReactNode` | — (required) | Badge text. |
| `className` | `string` | — | Class on the badge. |

### Select.Content
| Prop | Type | Default | Description |
|---|---|---|---|
| `searchable` | `boolean` | `false` | Search row at the top; filters items by label, description and `keywords`. |
| `className` | `string` | — | Class on the portal panel. |
| `children` | `ReactNode` | — (required) | Items, groups, separators. They stay mounted while closed so `Select.Value` knows the labels. |

### Select.Item
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Option value. |
| `label` | `string` | — | Label shown in the trigger and used for typeahead; falls back to `Select.ItemText`, plain text children, then `value`. |
| `keywords` | `string` | — | Extra search words (synonyms, transliteration). |
| `disabled` | `boolean` | — | Not selectable, skipped by arrows. |
| `className` | `string` | — | Class on the option `div`. |
| `children` | `ReactNode` | — (required) | Text and rich parts (direct children). |

Ref: `forwardRef` → `HTMLDivElement`. No other native props.

### Select.ItemIcon
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | Icon before the option text. |
| `className` | `string` | — | Class on the `<span>`. |

+ native `<span>` props.

### Select.ItemMedia
| Prop | Type | Default | Description |
|---|---|---|---|
| `color` | `"gray" \| "blue" \| "green" \| "orange" \| "red" \| "yellow" \| "purple" \| "sky" \| "pink" \| "teal"` | — | Tile hue (soft fill + hue icon); without it a neutral fill. |
| `children` | `ReactNode` | — (required) | An icon or an `<img>` (covers the tile). |
| `className` | `string` | — | Class on the tile. |

### Select.ItemText · Select.ItemDescription · Select.ItemMeta
| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — (required) | ItemText: title (its text is the option label). ItemDescription: muted second line, searchable. ItemMeta: trailing muted tabular value. |
| `className` | `string` | — | Class on the `<span>`. |

### Select.Group · Select.GroupLabel · Select.Separator
| Part | Props | Notes |
|---|---|---|
| `Select.Group` | native `<div>` props | `role="group"`. |
| `Select.GroupLabel` | native `<div>` props | Group heading in caption style of the tier. |
| `Select.Separator` | native `<hr>` props | Hairline between groups. |

## Variants
No `variant`/`tone`. Axes: `size`, mode (`multiple`, `native`), visual flags (`clearable`, `loading`, `searchable`), `color` (Badge, ItemMedia), rich option layout.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28px trigger, 8px padX, 12/16 text, 24px items | dense table filters | |
| `s` | 32px trigger, 8px padX, 13/20 text, 28px items | compact toolbars and side panels | |
| `m` | 36px trigger, 12px padX, 14/20 text, 32px items | regular forms | yes |
| `l` | 40px trigger, 12px padX, 16/24 text, 36px items | spacious forms | |
| `xl` | 48px trigger, 16px padX, 16/24 text, 40px items | touch-first screens | |

### mode
| Value | Looks like | Use when | Default |
|---|---|---|---|
| single combobox | trigger with value + chevron, portal panel with a check on the selected row | most cases | yes |
| `multiple` | rows with a checkbox on the left, panel stays open, trigger shows labels joined by commas | a few values from a short list | |
| `native` | system `<select>` with the same field fill and chevron; `multiple` → a list box 4 rows tall | mobile-first forms, very simple lists | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `clearable` | × before the chevron while a value is set | the field is optional and can be reset | `false` |
| `loading` | spinner instead of the chevron, «Загрузка…» row in the panel | options load asynchronously | `false` |
| `searchable` (Content) | search row with a hairline at the top of the panel | more than ~10 options | `false` |

### color (Select.Badge, Select.ItemMedia)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `gray` | neutral soft fill (Badge uses `fill-strong` so it reads on the field) | neutral status | Badge default |
| `blue` · `green` · `orange` · `red` · `yellow` · `purple` · `sky` · `pink` · `teal` | soft fill of the hue, hue text/icon | categorising options or showing a status | |
| none (ItemMedia) | neutral tile | thumbnails / images | ItemMedia default |

### Rich option layout
| Value | Looks like | Use when | Default |
|---|---|---|---|
| plain | one line of text, check on the right | most lists | yes |
| rich (`ItemMedia` or `ItemDescription`) | two lines with a tile on the left (`data-rich`); trigger grows the same way via a `Select.Value` function | products, people, vehicles | |

**Combinations**
- `multiple` + `native` → allowed (system multi list) but rare; prefer combobox `multiple` or TagSelect.
- `native` + `clearable` / `loading` / `searchable` / `open` → not supported (combobox-only props).
- `Select.Value` render function + `multiple` → ignored; the trigger shows joined labels.
- `invalid` + `error` → redundant; `error` implies `invalid`.

**Sizes** — trigger height equals `--prime-control-<tier>-height`, so it lines up with Button, Input, SegmentedControl, Datepicker trigger of the same size. The panel uses the trigger's tier for item height and text.

**Hierarchy** — inside a Card the field fill variable `--prime-color-field-bg` switches to `field-bg-surface` (currently the same value); keep all fields of a form at one size.

## States
| State | Driven by | DOM | Looks like |
|---|---|---|---|
| empty | no value | `data-placeholder="true"` on Value | placeholder in `text-placeholder` |
| hover | pointer | — | field fill darkens 6% toward text |
| open | `open` / click / Arrow keys | trigger `data-state="open"`, `aria-expanded`; panel `data-state`, `data-side` | `field-bg-focus` fill, chevron rotates 180° |
| focus-visible | keyboard | — | inset focus ring (unless `focusRing={false}`) |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` | inset `danger-border` ring; error text below |
| disabled | `disabled` | `data-disabled="true"`, native `disabled` | `field-bg-disabled`, `text-disabled`, `cursor: not-allowed` |
| loading | `loading` | `data-loading="true"`, `aria-busy` | spinner, status row |
| searching | typing in search | panel `data-searching="true"` | filtered rows, empty state «Ничего не найдено» + hint |
| option highlighted / selected / disabled | keyboard / value / `disabled` | `data-highlighted`, `data-selected`, `aria-selected`, `data-disabled`, `aria-disabled` | row fill / check icon / dimmed |

Root frame carries `data-size`, `data-invalid`, `data-disabled`; trigger also `data-size`, `data-focus-ring`. Panel follows the overlay contract: closes on outside press (focus follows the pointer) and on Escape (focus returns to the trigger); Tab closes it.
Controlled: `value` + `onValueChange`, `open` + `onOpenChange`. Uncontrolled: `defaultValue`, `defaultOpen`.

## Layout & spacing
- Trigger is 100% wide; set the width with the layout (grid column, max-width wrapper).
- Label → field: tier `label-gap`; field → hint: tier `hint-gap`; field → field in a form: `--prime-space-5`.
- Panel: at least `--prime-panel-min-width`, at most twice that, max height `--prime-panel-max-height` (scrolls); flips near the viewport edge.
- Long values truncate with an ellipsis in the trigger.

## Accessibility
- Trigger: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`, `aria-invalid`, `aria-required`, `aria-busy`, `aria-describedby` (hint/error). Without a visible `label`, set `aria-label` on `Select.Trigger` (or on Root in `native`).
- Listbox: `role="listbox"`, `aria-multiselectable` with `multiple`, options `role="option"` with `aria-selected`; focus stays on the listbox / search with `aria-activedescendant`.
- Keyboard: on trigger Enter / Space / ↑ / ↓ open, Delete / Backspace clear (`clearable`); in the panel ↑ / ↓ / Home / End move, Enter / Space pick, Escape closes, Tab closes, printable keys do typeahead by label (repeat a letter to cycle).
- `labels` keys (defaults):
  - `search` — «Поиск» (search placeholder and name)
  - `empty` — «Ничего не найдено»
  - `emptyHint` — «Попробуйте изменить запрос» (shown while searching)
  - `loading` — «Загрузка…»
  - `clear` — «Очистить» (clear button tooltip)
  - `optional` — «необязательно»

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [sizes.tsx](examples/sizes.tsx) | All size tiers | Aligning with other controls |
| [states.tsx](examples/states.tsx) | Placeholder, selected, clearable, loading, error, disabled, empty list | Reference for every state |
| [search-groups.tsx](examples/search-groups.tsx) | `searchable`, `keywords`, groups, separator, disabled option | Long lists |
| [multiple.tsx](examples/multiple.tsx) | Controlled `multiple` | A few values from a short list |
| [rich-options.tsx](examples/rich-options.tsx) | ItemMedia (colours), ItemText, ItemDescription, ItemMeta, `Select.Value` render function | Options with thumbnails and meta |
| [in-form.tsx](examples/in-form.tsx) | Card form: `required`, `hint`, `optional`, groups, `TriggerIcon`, item `label` | Selects inside forms |
| [controlled.tsx](examples/controlled.tsx) | `value` + `onValueChange`, `aria-label` on trigger | Selection drives other UI; surfaces |
| [native.tsx](examples/native.tsx) | `native` with label and hint | OS picker on mobile |
| [with-badge.tsx](examples/with-badge.tsx) | `Select.ItemIcon` in options, `Select.Badge` with `color` following the value | The chosen option carries a status |

```tsx
import { Select } from "prime-ui-kit";

export function RoleSelect() {
  return (
    <Select.Root label="Роль" defaultValue="editor" placeholder="Выберите роль">
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="viewer">Наблюдатель</Select.Item>
        <Select.Item value="editor">Редактор</Select.Item>
        <Select.Item value="admin">Администратор</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
```

## Mistakes
- `onChange` on Root → use `onValueChange`.
- `<Select.Trigger>Текст</Select.Trigger>` without `Select.Value` → the selected label never shows; put `<Select.Value />` inside.
- Unmounting `Select.Content` while closed → the trigger loses option labels; keep it rendered (it hides itself).
- `error` text plus `invalid` → `error` alone is enough.
- `clearable` / `searchable` with `native` → not supported; use the combobox mode.
- Expecting `name` to submit the combobox value → only `native` has `name`; submit from state.
- Rich parts wrapped in a custom component → `ItemMedia` / `ItemText` / `ItemDescription` / `ItemMeta` must be direct children (fragments are fine).

## Related
[TagSelect](../tag-select/COMPONENT.md) · [Radio](../radio/COMPONENT.md) · [SegmentedControl](../segmented-control/COMPONENT.md) · [Dropdown](../dropdown/COMPONENT.md) · [Input](../input/COMPONENT.md) · [Datepicker](../datepicker/COMPONENT.md)
