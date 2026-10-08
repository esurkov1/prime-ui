# Select

**Category:** selection
**Kind:** field

> A field for choosing one value (or several with `multiple`) from a closed list.

## When to use
- One value from a closed list of 5+ options in forms, filters and settings: country, role, time zone.
- A long list where search helps (`Select.Content searchable`, `keywords`).
- A few values from a short list shown as comma-separated text (`multiple`).
- Options that need a picture, a second line or a trailing value (rich options).

## When not to use
- 2–5 options that should all be visible → use [Radio](../radio/COMPONENT.md) or [SegmentedControl](../segmented-control/COMPONENT.md).
- The OS picker on a mobile-first form → use [NativeSelect](../native-select/COMPONENT.md).
- Many values shown as removable tags, or creating new values → use [TagSelect](../tag-select/COMPONENT.md).
- Free text → use [Input](../input/COMPONENT.md).
- A menu of actions (not a value) → use [Dropdown](../dropdown/COMPONENT.md).
- Global search / command palette → use [CommandMenu](../command-menu/COMPONENT.md).
- Dates → use [Datepicker](../datepicker/COMPONENT.md).

## Import
```tsx
import { Select } from "prime-ui-kit";
```

## Anatomy
```
Select.Root                       field frame: label · control · hint/error; value, open, search
├── Select.Trigger                <button role="combobox">: [icon] [value] [clear] [chevron]
│   ├── Select.TriggerIcon        optional leading glyph
│   └── Select.Value              picked label or placeholder (renderValue for a rich trigger)
└── Select.Content                portaled panel, mounted while open
    ├── search row                with `searchable`
    ├── role="listbox"
    │   ├── Select.Group          role="group", named by `label`
    │   │   └── Select.Item       role="option": [checkbox] [icon / Thumbnail] [text] [meta] [check]
    │   │       ├── Select.ItemIcon
    │   │       ├── Select.ItemText · Select.ItemDescription
    │   │       └── Select.ItemMeta
    │   └── Select.Separator      full-bleed Divider
    └── empty state               compact EmptyPage
```

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### Select.Root
`ref` → `HTMLDivElement`. The field frame (label row · control · support row) holding the value, the open state and the search query.

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string \| string[]` | — | Controlled value; `string[]` with `multiple`. |
| `defaultValue` | `string \| string[]` | — | Initial value, uncontrolled. |
| `onValueChange` | `(value: string) => void \| (value: string[]) => void` | — | Called with the picked value (`""` after clearing), or the new list with `multiple`. |
| `multiple` | `boolean` | `false` | Several values: checkboxes in the list, the list stays open on a pick, labels joined in the trigger. |
| `open` | `boolean` | — | Controlled open state of the list. |
| `defaultOpen` | `boolean` | `false` | Initial open state, uncontrolled. |
| `onOpenChange` | `(open: boolean) => void` | — | Called on every open and close: trigger, pick, Escape, an outside press. |
| `label` | `ReactNode` | — | Field label above; names the trigger. |
| `hint` | `ReactNode` | — | Support text under the field; linked by `aria-describedby`. |
| `error` | `ReactNode` | — | Error message; replaces the hint and implies `invalid`. |
| `required` | `boolean` | `false` | Red `*` after the label and `aria-required` on the trigger. |
| `optional` | `boolean` | — | Muted `labels.optional` after the label. |
| `invalid` | `boolean` | `false` | Danger inset ring and `aria-invalid`. |
| `disabled` | `boolean` | `false` | Disabled field; the list never opens. |
| `loading` | `boolean` | `false` | Spinner instead of the chevron, `aria-busy`, a status row in the list. |
| `clearable` | `boolean` | `false` | A clear segment before the chevron while a value is set; `Delete` / `Backspace` on the trigger clear too. |
| `placeholder` | `string` | — | Text in the trigger while nothing is picked. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Field tier: trigger height, padding, text; the list rows, the label and the hint follow it. |
| `focusRing` | `boolean` | `true` | `false` hides the visual focus ring (`data-focus-ring="false"`), never focus or the error ring. |
| `id` | `string` | — | Id of the trigger; generated when omitted. |
| `labels` | `Partial<SelectLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | Trigger and Content. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "id" \| "children" \| "defaultValue" \| "defaultChecked" \| "onChange">` | — | `className`, `data-*` and the other attributes of the field frame `<div>` (field-root rule: `className`, `ref` and the rest → frame, `id` → control). |

### Select.Trigger
`ref` → `HTMLButtonElement`. `<button role="combobox">` with the value, the clear segment and the chevron (a Spinner while `loading`). + native button props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `Select.TriggerIcon`, `Select.Value`, optionally a Badge after it. |

### Select.Value
`ref` → `HTMLSpanElement`. The picked label (labels joined with `multiple`) with an ellipsis, or the placeholder.

| Prop | Type | Default | Description |
|---|---|---|---|
| `renderValue` | `(item: { value: string; label: string }) => ReactNode` | — | Single mode: draws the picked option in the trigger with the row parts (Thumbnail, ItemText, ItemDescription); not called while empty. |
| `…rest` | `Omit<HTMLAttributes<HTMLSpanElement>, "children">` | — | `className` and the other span attributes. |

### Select.TriggerIcon · Select.ItemIcon
`ref` → `HTMLSpanElement`. An `aria-hidden` `<span>` with a leading glyph at the tier icon size: before the value / before the option label. + native `<span>` props.

### Select.Content
`ref` → `HTMLDivElement` (the panel). Portal + the floating list panel, mounted while open and during its exit animation (closed, the items render hidden in place so the trigger knows their labels), shown with the overlay motion. Holds the search row, the `role="listbox"` and the empty state. Below 640px of viewport the panel is a bottom sheet: a scrim, a grab handle, swipe down to close, page scroll locked.

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchable` | `boolean` | `false` | A search field on top; items filter by label, description and `keywords`. |
| `children` | `ReactNode` | — (required) | Items, groups, separators. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children" \| "hidden" \| "onKeyDown" \| "onAnimationEnd">` | — | `className` and the other attributes of the panel. |

### Select.Item
`ref` → `HTMLDivElement`. `role="option"` with `aria-selected`; a check on the end (single) or a Checkbox.Indicator in front (`multiple`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — (required) | Value of the option. |
| `label` | `string` | — | Text in the trigger and for typeahead; defaults to `Select.ItemText`, then the plain text. |
| `keywords` | `string` | — | Extra words for the search. |
| `disabled` | `boolean` | `false` | Muted, skipped by the keyboard, not selectable. |
| `children` | `ReactNode` | — (required) | Text, or `Select.ItemIcon`, `Thumbnail.Root`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta` as direct children. |

### Select.ItemText · Select.ItemDescription · Select.ItemMeta
`ref` → `HTMLSpanElement`. Rich option parts: the title (its text is the label) / a muted second line (searchable; makes the row two-line) / a trailing muted value before the check. A `Thumbnail.Root` child is the leading media, sized to the tier unless it sets `size`. + native `<span>` props.

### Select.Group
`ref` → `HTMLDivElement`. `<div role="group">` named by its `label`; hidden while the search leaves none of its options. + native `<div>` props.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | — | Heading of the group (caption, muted); also its accessible name. |

### Select.Separator
`ref` → `HTMLDivElement`. A full-bleed Divider between groups; hidden while searching.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the divider. |

## Variants
No `variant` or `tone`. The trigger is the field look (fill, inset control border, tier radius); the panel is the shared floating surface with menu rows.

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | 28 trigger, 12/16 text, 24 rows | Dense table filters | |
| `s` | 32 trigger, 13/20 text, 28 rows | Compact toolbars and side panels | |
| `m` | 36 trigger, 14/20 text, 32 rows | Regular forms | yes |
| `l` | 40 trigger, 16/24 text, 36 rows | Spacious forms | |
| `xl` | 48 trigger, 16/24 text, 40 rows | Touch-first screens | |

### Flags
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `multiple` | checkbox on the left of every row, the list stays open, labels joined in the trigger | A few values from a short list | `false` |
| `clearable` | × segment before the chevron while a value is set (full height, one hover wash) | The field is optional and can be reset | `false` |
| `loading` | spinner instead of the chevron, a «Загрузка…» row in the list | Options load asynchronously | `false` |
| `searchable` (Content) | search row with a faint hairline at the top of the list | More than ~10 options | `false` |
| rich options | `Thumbnail.Root` or `Select.ItemDescription` in an item: a two-line row; the trigger the same with `renderValue` | Products, people, delivery tariffs | |

**Combinations** — `renderValue` is single-mode only; with `multiple` the trigger shows the joined labels. `error` implies `invalid`. A status Badge can follow `Select.Value` inside the trigger; it takes the tier one step down by itself.

## States
| State | Driven by | DOM |
|---|---|---|
| empty | no value | `data-placeholder="true"` on Value, placeholder color |
| open | `open` / click / arrows | trigger `data-state="open"`, `aria-expanded`; panel `data-state`, `data-side`; chevron turns 180° |
| invalid | `invalid` or `error` | `data-invalid="true"`, `aria-invalid` on the trigger; error text below; the control shakes once when an error arrives (`data-shake` on the frame) |
| disabled | `disabled` | native `disabled`, `data-disabled="true"` |
| loading | `loading` | `data-loading="true"`, `aria-busy`; status row in the list |
| searching | typing in the search | panel `data-searching="true"`; groups without matches and separators hide; the match in an option's title, description and plain text is a `<mark>` in `accent-text` (not in the trigger) |
| sheet | viewport below 640px | a scrim and a full-width bottom sheet with an `aria-hidden` grab handle around the panel; the sheet carries `data-state`, the panel keeps its role and ref; page scroll locked; a swipe down from the handle closes it |
| option highlighted / selected / disabled | keyboard and pointer / value / `disabled` | `data-highlighted`, `data-selected` + `aria-selected`, `data-disabled` + `aria-disabled`; highlight is a fill only |

## Layout & spacing
- The trigger is 100% wide; set the width with the layout (grid column, max-width wrapper).
- Label → field: tier `label-gap`; field → hint: tier `hint-gap`; field → field in a form: `--prime-space-5`.
- Panel: at least the trigger width and `--prime-panel-min-width`, at most twice that; max height `--prime-panel-max-height` (scrolls); flips near the viewport edge.
- Long values truncate with an ellipsis in the trigger.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Enter` · `Space` · `ArrowDown` · `ArrowUp` | On the trigger open the list; focus moves into the search or the list. |
| `ArrowDown` · `ArrowUp` · `Home` · `End` | In the list move the highlight over the enabled options, wrapping. |
| `Enter` · `Space` | Pick the highlighted option; a single pick closes the list and returns focus to the trigger. |
| `A–Я` | Typeahead: the highlight jumps to the option starting with the letter or the typed prefix. |
| `Delete` · `Backspace` | On the trigger with `clearable` clear the value. |
| `Escape` | Closes the list; focus returns to the trigger. |
| `Tab` | Returns focus to the trigger, closes the list and moves on from the trigger. |

### ARIA
- The trigger is `role="combobox"` with `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`; `label` names it.
- The list is `role="listbox"` (`aria-multiselectable` with `multiple`); options are `role="option"` with `aria-selected`; the highlight goes through `aria-activedescendant`.
- The hint and the error are linked by `aria-describedby`; the error sets `aria-invalid`; loading sets `aria-busy`.
- An outside press closes the list without moving focus back: focus follows the pointer (foundation §8).

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `search` | `"Поиск"` | Placeholder and accessible name of the search field. |
| `empty` | `"Ничего не найдено"` | Empty state: no items or nothing matches. |
| `emptyHint` | `"Попробуйте изменить запрос"` | Second line of the empty state while searching; `""` hides it. |
| `loading` | `"Загрузка…"` | Status row while `loading`. |
| `clear` | `"Очистить"` | Tooltip of the clear segment. |
| `optional` | `"необязательно"` | Muted marker after the label when `optional`. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | A labelled field with a placeholder; picking an option closes the list and shows its label — `label`, `placeholder`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier; the label, the list rows and the hint take the tier of the field — `size`. |
| [states.tsx](examples/states.tsx) | A default field next to a disabled, a loading, an invalid one and a list with nothing in it — `disabled`, `loading`, `invalid`, `labels`. |
| [validation.tsx](examples/validation.tsx) | Live validation: unassigning the owner shakes the field and drops the error in, picking someone clears it; required and optional markers and a hint — `required`, `optional`, `hint`, `error`. |
| [with-icon.tsx](examples/with-icon.tsx) | A leading icon in the trigger and an icon before every option label — `Select.TriggerIcon`, `Select.ItemIcon`. |
| [multiple.tsx](examples/multiple.tsx) | Several values: checkboxes in the list, the list stays open on a pick, labels joined in the trigger — `multiple`. |
| [searchable.tsx](examples/searchable.tsx) | A long list with a search field: options match their label and keywords, groups and the separator hide while searching — `searchable`, `keywords`, `Select.Group`. |
| [clearable.tsx](examples/clearable.tsx) | An optional field that can be reset: a clear segment before the chevron, Delete or Backspace on the trigger — `clearable`. |
| [rich-options.tsx](examples/rich-options.tsx) | Options with a picture, a second line and a price; the trigger draws the picked option with the same parts — `renderValue`, `Select.ItemText`, `Select.ItemDescription`, `Select.ItemMeta`. |
| [controlled.tsx](examples/controlled.tsx) | The parent owns the value: the plan drives the price under the field and a button resets it — `value`, `onValueChange`. |
| [controlled-open.tsx](examples/controlled-open.tsx) | The parent owns the list: a button opens it from code, a pick or Escape closes it — `open`, `onOpenChange`. |
| [in-form.tsx](examples/in-form.tsx) | Regional settings form: the required country is checked on submit, the error shakes the field and leaves once a country is picked, a calm note confirms the save — `required`, `error`, `hint`. |

## Mistakes
- A Label + `aria-labelledby` next to the field → pass `label`, `hint`, `error` to `Select.Root`.
- A function inside `Select.Value` → use `renderValue`.
- `Select.Group` with a separate heading element → pass the heading as `label`.
- Rich parts wrapped in your own `<div>` → put them as direct children of the item.
- A system select via a prop → use [NativeSelect](../native-select/COMPONENT.md).
- Mixing sizes in one form → keep every field of a form at one `size`.

## Related
- **Built from:** [ScrollContainer](../scroll-container/COMPONENT.md) (list), [Checkbox](../checkbox/COMPONENT.md) (`Checkbox.Indicator` in `multiple`), [Spinner](../spinner/COMPONENT.md) (`loading`), [EmptyPage](../empty-page/COMPONENT.md) (empty state), [Divider](../divider/COMPONENT.md) (`Separator`), [Thumbnail](../thumbnail/COMPONENT.md) (rich media), [Label](../label/COMPONENT.md) and [Hint](../hint/COMPONENT.md) (field frame)
- **See also:** [NativeSelect](../native-select/COMPONENT.md), [TagSelect](../tag-select/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md), [Radio](../radio/COMPONENT.md), [SegmentedControl](../segmented-control/COMPONENT.md)
