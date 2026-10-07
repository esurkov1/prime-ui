# SmartFilter

**Category:** selection
**Kind:** composite

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
SmartFilter.Root                  state + context (flex column)
├─ SmartFilter.Toolbar            [filter Button (count Badge)] [search Input] — the anchor of the panel
│  └─ panel                       flush Popover as wide as the toolbar; sections split by Dividers
│     ├─ query row                ghost Button «Искать «text»» + Kbd ↵, while typing
│     ├─ field rows               field label · value Badges with a «−» Badge.Action · «Ещё N» Badge
│     ├─ no matches               compact EmptyPage naming the fields with nothing found
│     └─ footer                   hint · count · Reset Button
└─ SmartFilter.Chips              applied filters as removable Badges · add / clear all Buttons
```
The toolbar and the chips are separate parts so a page can put them in different places; both only need to be inside `Root`.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### SmartFilter.Root
`ref` → `HTMLDivElement`. A `<div>` (flex column) with the state and the context; sets `data-size`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `readonly SmartFilterField[]` | — (required) | Fields of this screen, in display order; empty — only the search. Pass a stable reference. |
| `value` | `SmartFilterValue` | — | Selection per field key, controlled: `{ include, exclude }` per field. |
| `defaultValue` | `SmartFilterValue` | `{}` | Initial selection, uncontrolled. |
| `onValueChange` | `(value: SmartFilterValue) => void` | — | The whole next value; keys of fields this root does not show are kept. |
| `search` | `string` | — | Search text, controlled. |
| `defaultSearch` | `string` | `""` | Initial search text, uncontrolled. |
| `onSearchChange` | `(search: string) => void` | — | Every keystroke; debounce in the owner when it asks a server. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Tier of the filter button, the search, the tags and the panel. |
| `collapsedLimit` | `number` | `12` | Values of one field shown before «Ещё N» (not while searching). |
| `labels` | `Partial<SmartFilterLabels>` | — | Built-in strings, see Labels. |
| `className` | `string` | — | Class on the root. |
| `children` | `ReactNode` | — (required) | `SmartFilter.Toolbar` and `SmartFilter.Chips`, anywhere inside. |

### SmartFilter.Toolbar
No ref. A `<div>`: the filter Button (a count Badge while filters apply) and a search Input; the anchor of the panel, a flush Popover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the toolbar. |

### SmartFilter.Chips
No ref. A `<div>` of applied filters as removable Badges with «Добавить фильтр» and «Сбросить все»; renders nothing without filters.

| Prop | Type | Default | Description |
|---|---|---|---|
| `className` | `string` | — | Class on the chips row. |

### SmartFilterField
One entry of `fields`: data, not a part. Selected values missing from `options` stay visible so they can be removed.

| Prop | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — (required) | Key of the field in the value. |
| `label` | `string` | — (required) | Field name in the panel and the chips. |
| `options` | `{ value: string; label: string; icon?: ReactNode }[]` | — (required) | Values; `icon` is a decorative kit Icon before the label. |
| `finite` | `boolean` | `true` | A fixed set: hiding every value is refused. `false` for an open set (services, users). |

### matchesSmartFilter · resolveSmartFilterValues
Helpers. `matchesSmartFilter(selection, value)` checks one value on the client (`include` empty = any, `exclude` rejects). `resolveSmartFilterValues(selection, all)` turns a fixed field into the list to ask a server for: «hide» becomes «all except», `[]` — no filter.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | toolbar 28; value and filter tags 16; secondary buttons `xs` | dense table toolbars | |
| `s` | toolbar 32; tags 20; buttons `xs` | compact toolbars | |
| `m` | toolbar 36; tags 24; buttons `xs` | most pages | yes |
| `l` | toolbar 40; tags 28; buttons `s` | roomier pages | |
| `xl` | toolbar 48; tags 32; buttons `m` | hero search | |

### field `finite`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | the «−» of the last shown value is disabled | fixed sets (method, status) | yes |
| `false` | every value can be hidden | open sets (services, users) | |

## States
| State | Driven by | DOM |
|---|---|---|
| closed / open | filter button, search focus | button `aria-expanded`; the panel is a Popover below the toolbar |
| value neutral | no selection | gray Badge |
| value shown | press | blue Badge, `aria-pressed="true"`, `data-mode="include"` |
| value hidden | «−», Alt+click, Shift+Enter | red Badge with «НЕ», `data-mode="exclude"`; its «−» stays visible and unhides |
| cannot hide | last value of a `finite` field | the «−» is disabled |
| searching | `search` | only matching values, the match in `accent-text` (a `<mark>`); fields with nothing found in a compact EmptyPage; the «Искать» row closes the panel |
| no filters | empty value | no count on the button, no Chips |

## Layout & spacing
- The panel is a flush Popover as wide as the toolbar; every section is a full-width row with its own padding (`--prime-space-3` × `--prime-space-4`, footer `--prime-space-2` × `--prime-space-4`), Dividers run edge to edge, the field label column is `--prime-space-24`.
- Values and chips wrap with `--prime-space-2` gaps; «Сбросить все» is pushed to the end.
- The root is a flex column (`--prime-space-3`): Toolbar, then Chips.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through the panel values and their «−» (shown on focus). |
| `Enter` · `Space` | Shows only this value; pressing again clears it. |
| `Shift + Enter` | Hides the value. |
| `Enter` · `Escape` | In the search, close the panel. |

### ARIA
- The filter button has `aria-expanded` and `aria-haspopup="dialog"`; the panel is a non-modal `role="dialog"` named by a visually hidden `labels.filter` title.
- Values are toggle buttons with `aria-pressed`; the «−» has its own name (`labels.hideValue` / `labels.unhideValue`); a hidden value carries the «НЕ» text, so meaning is never in color alone.
- Fields with nothing found are announced through `role="status"`.
- Every filter tag has a remove button named by `labels.remove`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `filter` | `"Фильтр"` | Filter button and panel name. |
| `searchPlaceholder` | `"Поиск"` | Placeholder and name of the search. |
| `clearSearch` | `"Очистить поиск"` | Name of the search clear button. |
| `searchText` | `"Искать «{query}»"` | The text search row while typing. |
| `noMatches` | `"{fields} — нет совпадений"` | Fields with nothing found while typing (compact EmptyPage). |
| `hint` | `"Нажмите значение, чтобы показать только его; «−» справа — скрыть"` | Panel footer hint. |
| `count` | `"Фильтров: {count}"` | Panel footer counter. |
| `reset` | `"Сбросить"` | Panel footer reset. |
| `more` | `"Ещё {count}"` | Collapsed values of a field. |
| `add` | `"Добавить фильтр"` | Chips row: opens the panel. |
| `clearAll` | `"Сбросить все"` | Chips row: clears every field. |
| `showValue` | `"Показать только {value}"` | Title of a value. |
| `hideValue` | `"Скрыть {value}"` | Name of the «−» of a value. |
| `unhideValue` | `"Не скрывать {value}"` | Name of the «−» of a hidden value. |
| `not` | `"НЕ"` | Prefix of a hidden value. |
| `chipInclude` | `"{field}: {value}"` | Text of a «show» tag. |
| `chipExclude` | `"{field}: не {value}"` | Text of a «hide» tag. |
| `remove` | `"Убрать фильтр «{value}»"` | Name of a tag's remove button. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Filters above a request list: the filter button and the search, applied filters as tags, rows narrowed by the value and the text — `fields`, `value`, `search`, `matchesSmartFilter`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: the filter button, the search, the tags and the panel follow one tier — `size`. |
| [many-values.tsx](examples/many-values.tsx) | An open set of twenty services, degraded ones marked with an icon, collapsed after eight; typing narrows the panel and marks the match in accent — `finite`, `icon`, `collapsedLimit`. |
| [controlled.tsx](examples/controlled.tsx) | A saved view sets the value from outside; the selection is read back as the list to ask the server for — `value`, `onValueChange`, `resolveSmartFilterValues`. |
| [narrow.tsx](examples/narrow.tsx) | A 320 px column: the search shrinks next to the filter button and the tags wrap under them — `size`. |

## Mistakes
- Creating `fields` inline on every render → pass a stable array (a module constant or `useMemo`).
- A fixed field marked `finite: false` → the user can hide every value and get an empty list.
- Filtering the list with `includes` → use `matchesSmartFilter` (empty `include` is "any", `exclude` rejects).
- Sending `include` to a server for a hidden value of a fixed field → use `resolveSmartFilterValues`.
- Putting `Chips` outside `SmartFilter.Root` → every part needs the root.
- A second row of filter buttons next to the toolbar → fields belong in `fields`.

## Related
- **Built from:** [Button](../button/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Input](../input/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Divider](../divider/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Typography](../typography/COMPONENT.md)
- **See also:** [TagSelect](../tag-select/COMPONENT.md), [DataTable](../data-table/COMPONENT.md)
