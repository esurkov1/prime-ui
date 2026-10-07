# SmartFilter

**Category:** selection

> A filter bar for lists and tables: a filter button and a search with a panel of values, applied filters as removable tags, and a "show / hide" choice for every value.

## When to use
- Narrowing a list, table or log by several fields at once (service, method, status), where the user also types free text.
- Filters where "everything except this" matters as much as "only this": every value can be shown or hidden.
- Many values per field (dozens of services): the panel collapses them to «Ещё N» and narrows as the user types.

## When not to use
- One field with a few options → use [SegmentedControl](../segmented-control/COMPONENT.md), [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md) in the toolbar.
- Only a text search → use [Input](../input/COMPONENT.md) with a search icon.
- Choosing values for a form field → use [TagSelect](../tag-select/COMPONENT.md).
- Filtering by a range (dates, price) → use [Datepicker](../datepicker/COMPONENT.md) or [Slider](../slider/COMPONENT.md); SmartFilter works on discrete values.

## Import
```tsx
import { SmartFilter, matchesSmartFilter, resolveSmartFilterValues } from "prime-ui-kit";
```

## Anatomy
```
SmartFilter.Root                  state + context, no panel of its own (flex column)
├─ SmartFilter.Toolbar            [Filter button (count Badge)] [search Input] — the anchor of the panel
│  └─ panel (Popover.Content)     portaled, as wide as the toolbar
│     ├─ query row                Button «Искать «text»» + Kbd ↵, while typing
│     ├─ field rows               Typography label · value Badges with «−» Badge.Action (· «Ещё N» Badge), Divider between
│     ├─ no-matches note          Typography caption, while typing
│     └─ footer                   Divider · hint · count · Reset Button
└─ SmartFilter.Chips              applied filters as Badge ×N · add / clear all Buttons (nothing without filters)
```
Everything is built from kit components (Button, Badge, Input, Icon, Popover, Divider, Typography, Kbd, Badge with `onRemove`, `onPress` and `Badge.Action`); the component's own CSS only lays them out. The toolbar and the chips are separate parts so a page can put them in different places (the toolbar in a header strip, the chips under it). The panel opens on the filter button and when the search gets focus.

## API

### SmartFilter.Root
`<div>`. No ref forwarding.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `readonly SmartFilterField[]` | — (required) | Fields of this screen, in display order. Empty: only the search remains, no button. Pass a stable reference. |
| `value` | `SmartFilterValue` | — | Controlled selection per field key. |
| `defaultValue` | `SmartFilterValue` | `{}` | Initial selection, uncontrolled. |
| `onValueChange` | `(value: SmartFilterValue) => void` | — | Called with the whole next value. Keys of fields this root does not show are kept. |
| `search` | `string` | — | Controlled search text. |
| `defaultSearch` | `string` | `""` | Initial search text, uncontrolled. |
| `onSearchChange` | `(search: string) => void` | — | Called on every keystroke (debounce in the owner when it queries a server). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the button, the search, the tags and the panel. |
| `collapsedLimit` | `number` | `12` | Values of one field shown before «Ещё N» (not while searching). |
| `labels` | `Partial<SmartFilterLabels>` | Russian defaults | Built-in strings, see Accessibility. |
| `className` | `string` | — | Extra class on the root. |
| `children` | `ReactNode` | — (required) | `SmartFilter.Toolbar` and `SmartFilter.Chips`. |

Sets `data-size`.

### SmartFilter.Toolbar
`<div>` (the anchor of the panel). No ref forwarding. Throws outside `SmartFilter.Root`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class (e.g. a flex-basis). |

The button is a `Button` (`soft` neutral, toolbar `size`) with a blue `Badge` counter while filters apply; the search is an `Input` (`type="search"`, `Icon action.search`) with a clear button. Enter and Escape in the search close the panel.

### SmartFilter.Chips
`<div>`. No ref forwarding. Renders nothing without filters.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Extra class. |

Each applied value is a removable `Badge`: blue «Метод: PUT» for show, red «Сервис: не billing» for hide; × removes it. Badges use the badge tier of the root `size` (24px at `m`), smaller than the toolbar. "Добавить фильтр" (ghost button) opens the panel, "Сбросить все" clears every field of this root.

### SmartFilterField
| Key | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — | Key of the field in the value. |
| `label` | `string` | — | Field name in the panel and the chips. |
| `options` | `SmartFilterOption[]` | — | `{ value, label, leading? }`: `leading` is a decorative mark before the label (a status dot, an icon). |
| `finite` | `boolean` | `true` | A fixed set: hiding every value is refused. `false` for an open set (services, users). |

Selected values that are missing from `options` (a deleted service) stay visible so they can be removed.

### SmartFilterValue
`Record<string, { include: string[]; exclude: string[] }>`. `include` = show only these (empty = any), `exclude` = hide these. A value is never in both; a field without values is absent.

### Helpers
| Export | Use |
|---|---|
| `matchesSmartFilter(selection, value)` | Client-side check of one value: `include` empty means any, `exclude` rejects. `selection` may be `undefined` (passes). |
| `resolveSmartFilterValues(selection, all)` | For a fixed field: the list to ask a server for. "Hide" becomes "all except"; `[]` means no filter (also when everything is included). |

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | toolbar 28; value and filter tags 16; secondary buttons `xs` | Dense table toolbars | |
| `s` | toolbar 32; tags 20; buttons `xs` | Compact toolbars | |
| `m` | toolbar 36; tags 24; buttons `xs` | Most pages | yes |
| `l` | toolbar 40; tags 28; buttons `s` | Roomier pages | |
| `xl` | toolbar 48; tags 32; buttons `m` | Hero search | |

Values and applied filters are `Badge`s of the root `size` (badge tiers sit below control tiers), so plates are always smaller than the toolbar's button and field.

## States
| State | How it shows |
|---|---|
| closed / open | The filter button has `aria-expanded` and `data-state`; the panel is a `Popover` below the toolbar. |
| value neutral | Gray `Badge`. |
| value shown | Blue `Badge`, `aria-pressed="true"`, `data-mode="include"`. |
| value hidden | Red `Badge` with «НЕ» before the label, `data-mode="exclude"`; its «−» stays visible (`persistent`) and unhides it. |
| hover / focus of a value | The «−» `Badge.Action` slides in at the end and the text moves toward the start; the badge width does not change, neighbours do not move. |
| press | Shows only this value (press again to clear). Alt+click and Shift+Enter hide. |
| cannot hide | The «−» is disabled: hiding it would leave a fixed field empty. |
| searching | The panel shows only matching values with the match underlined, fields with nothing found are named in a note, and a row "Искать «…»" closes the panel. |
| no filters | No count on the button, no `Chips`. |

## Layout & spacing
- The panel is as wide as the toolbar and aligned to its start; it keeps the popover's own padding and gap, rows are separated by `Divider`; field label column `--prime-space-24`, label and values on one baseline.
- Values wrap with `--prime-space-2` gaps; chips wrap the same way with "Сбросить все" pushed to the end.
- The root is a flex column (`--prime-space-3`): `Toolbar` then `Chips`. The parts only need to be inside `Root`, not direct children: put the toolbar in a header strip and the chips in another container if the page asks for it.

## Accessibility
- The filter button: `aria-expanded`, `aria-haspopup="dialog"`; the panel is a non-modal `role="dialog"` named by its (visually hidden) title; Escape closes it, an outside press too; presses on the toolbar do not.
- Keyboard: Tab reaches each value and then its «−» (revealed on focus); Enter / Space on a value shows it; **Shift+Enter** hides it; **Alt+click** hides with the mouse.
- Values are toggle buttons (`aria-pressed` while shown); the «−» has its own name («Скрыть …» / «Не скрывать …»). A hidden value carries the «НЕ» text, so meaning is never in color alone.
- The count and the chips tell the state without opening the panel; every chip has a remove button with a name.

`labels` keys (`{query}`, `{value}`, `{field}`, `{fields}`, `{count}` are substituted):

| Key | Default |
|---|---|
| `filter` | `Фильтр` |
| `searchPlaceholder` | `Поиск` |
| `clearSearch` | `Очистить поиск` |
| `searchText` | `Искать «{query}»` |
| `noMatches` | `{fields} — нет совпадений` |
| `hint` | `Нажмите значение, чтобы показать только его; «−» справа — скрыть` |
| `count` | `Фильтров: {count}` |
| `reset` | `Сбросить` |
| `more` | `Ещё {count}` |
| `add` | `Добавить фильтр` |
| `clearAll` | `Сбросить все` |
| `showValue` | `Показать только {value}` |
| `hideValue` | `Скрыть {value}` |
| `unhideValue` | `Не скрывать {value}` |
| `not` | `НЕ` |
| `chipInclude` | `{field}: {value}` |
| `chipExclude` | `{field}: не {value}` |
| `remove` | `Убрать фильтр «{value}»` |

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [http-requests.tsx](examples/http-requests.tsx) | Toolbar + chips over a list narrowed with `matchesSmartFilter` and the search text | The main case: a list with several filterable fields |
| [many-values.tsx](examples/many-values.tsx) | Open field with twenty services, status dots, `collapsedLimit`, a preset hidden value | Services, users, projects |
| [controlled.tsx](examples/controlled.tsx) | Controlled value set by preset buttons, read back with `resolveSmartFilterValues` | Filters from a URL, a saved view or a server query |
| [sizes.tsx](examples/sizes.tsx) | `s`, `m`, `l` | Matching the surrounding controls |

```tsx
import { SmartFilter } from "prime-ui-kit";

export function Example() {
  const [value, setValue] = useState({});
  return (
    <SmartFilter.Root fields={fields} value={value} onValueChange={setValue}>
      <SmartFilter.Toolbar />
      <SmartFilter.Chips />
    </SmartFilter.Root>
  );
}
```

## Mistakes
- Creating `fields` inline on every render → pass a stable array (a module constant or `useMemo`).
- A fixed field marked `finite: false` → the user can hide every value and get an empty list; leave `finite` on for fixed sets.
- Filtering the list yourself with `includes` → use `matchesSmartFilter`, which treats an empty `include` as "any" and applies `exclude`.
- Sending `include` to a server for a hidden value of a fixed field → use `resolveSmartFilterValues`, it turns "hide" into "all except".
- Putting `Chips` outside `SmartFilter.Root` → every part needs the root.
- A second filter row of buttons next to the toolbar → fields belong in `fields`.
- Restyling values or tags with own CSS → they are kit `Badge`s; change the kit, not the filter.

## Related
[Popover](../popover/COMPONENT.md) · [Badge](../badge/COMPONENT.md) · [Input](../input/COMPONENT.md) · [TagSelect](../tag-select/COMPONENT.md) · [DataTable](../data-table/COMPONENT.md)
