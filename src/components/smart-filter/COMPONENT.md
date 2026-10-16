# SmartFilter

**Category:** selection
**Kind:** composite

> The search and filter bar of lists and tables: the search first and a filter button with a panel of values and ranges, applied filters as removable tags, and a "show / hide" choice for every value.

## When to use
- Narrowing a list, table or log by several fields at once (service, method, status), where the user also types free text.
- Filters where "everything except this" matters as much as "only this": every value can be shown or hidden.
- Many values per field (dozens of services): the panel collapses them to «Ещё N» and narrows as the user types.
- Ranges next to the values: an amount from–to (`kind: "range"`), a period (`kind: "date-range"`), each one readable chip.
- An API that takes one value per field (`multiple: false`), a screen whose text search lives elsewhere (`searchable={false}`), values of different kinds in one field (`group`).

## When not to use
- One field with a few options → use [SegmentedControl](../segmented-control/COMPONENT.md), [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md) in the page's `Page.Tools`.
- A search outside a table or list page (inside a picker, a settings section, a panel) → [Input](../input/COMPONENT.md) with a search icon. Over a table or list page the search is SmartFilter even with no fields yet (`fields={[]}`): it grows into filters without a rebuild.
- Choosing values for a form field → use [TagSelect](../tag-select/COMPONENT.md).
- One period that drives a whole dashboard → [Datepicker](../datepicker/COMPONENT.md) in the page's `Page.Tools`; SmartFilter ranges filter rows of a list.

## Import
```tsx
import {
  SmartFilter,
  isSmartFilterRange,
  matchesSmartFilter,
  resolveSmartFilterValues,
} from "prime-ui-kit";
```

## Anatomy
```
SmartFilter.Root                  state + context, no DOM
├─ SmartFilter.Toolbar            [search Input (searchable)] [filter Button (count Badge)] — the anchor of the panel
│  └─ panel                       flush Popover as wide as the toolbar; sections split by Dividers
│     ├─ query row                ghost Button «Искать «text»» + Kbd ↵, while typing
│     ├─ field rows               field label · value Badges with a «−» Badge.Action · «Ещё N» Badge
│     │                           (groups: a caption over each group's values, role="group")
│     ├─ range rows               field label · Input «от» – Input «до» · or a Datepicker range field
│     ├─ no matches               compact EmptyPage naming the fields with nothing found
│     └─ footer                   hint · count · Reset Button
└─ SmartFilter.Chips              applied filters as removable Badges · add / clear all Buttons
```
The toolbar and the chips are separate parts so a page can put them in different places; both only need to be inside `Root`, which draws nothing of its own.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### SmartFilter.Root
No DOM, no ref. The value, the search and the panel state shared by its parts; the host places the parts.

| Prop | Type | Default | Description |
|---|---|---|---|
| `fields` | `readonly SmartFilterField[]` | — (required) | Fields of this screen, in display order; empty — only the search. Pass a stable reference. |
| `value` | `SmartFilterValue` | — | Value per field key, controlled: `{ include, exclude }` for an options field, `{ from, to }` (numbers or dates, `null` — open) for a range field. |
| `defaultValue` | `SmartFilterValue` | `{}` | Initial selection, uncontrolled. |
| `onValueChange` | `(value: SmartFilterValue) => void` | — | The whole next value; keys of fields this root does not show are kept. |
| `search` | `string` | — | Search text, controlled. |
| `defaultSearch` | `string` | `""` | Initial search text, uncontrolled. |
| `onSearchChange` | `(search: string) => void` | — | Every keystroke; debounce in the owner when it asks a server. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the filter button, the search, the tags and the panel. Without it the tier of its host, else `m`. |
| `collapsedLimit` | `number` | `12` | Values of one field shown before «Ещё N» (not while searching). |
| `labels` | `Partial<SmartFilterLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | `SmartFilter.Toolbar` and `SmartFilter.Chips`, anywhere inside — in a page bar the Root wraps `Page.Root`. |

### SmartFilter.Toolbar
`ref` → `HTMLDivElement`. A `<div>`: the search Input first, then the filter Button (a count Badge while filters apply), which shows only its icon and count when the search would get too little room; the anchor of the panel, a flush Popover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchable` | `boolean` | `true` | The search input. `false` — the filter button alone; the panel opens at its own width (24rem at most) and lists every field. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the toolbar. |

### SmartFilter.Chips
`ref` → `HTMLDivElement`. A `<div>` of applied filters as removable Badges with «Добавить фильтр» and «Сбросить все»; renders nothing without filters.

| Prop | Type | Default | Description |
|---|---|---|---|
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the chips row. |

### Types

#### `SmartFilterField`
One entry of `fields`: data, not a part. Selected values missing from `options` stay visible so they can be removed.

| Field | Type | Default | Description |
|---|---|---|---|
| `key` | `string` | — (required) | Key of the field in the value. |
| `label` | `string` | — (required) | Field name in the panel and the chips. |
| `kind` | `"options" \| "range" \| "date-range"` | `"options"` | `options` — values to show or hide; `range` — a number range in two Inputs; `date-range` — a period in the kit Datepicker. A range is one filter and one chip. |
| `options` | `{ value: string; label: string; icon?: ReactNode; group?: string }[]` | — (required) | `options` fields: values; `icon` is a decorative kit Icon before the label; values with one `group` stay together under that heading, groups in the order they first appear. |
| `finite` | `boolean` | `true` | `options` fields: a fixed set — hiding every value is refused. `false` for an open set (services, users). |
| `multiple` | `boolean` | `true` | `options` fields: many values at once. `false` — one value and no hiding: a press picks only that value, a second press clears it (an API that takes one value per field). |
| `formatValue` | `(value: number) => string` | Russian digit groups | `range` fields: a bound in the chip («1 000 ₽»). |
| `calendar` | `Pick<DatepickerPanelProps, "months" \| "presets" \| "prompt" \| "footer" \| "withTime" \| "isDayDisabled" \| "disableFuture" \| "today" \| "locale" \| "weekStartsOn" \| "labels">` | — | `date-range` fields: the calendar of the period, as on a report's own Datepicker — `presets`, `months`, `prompt`, `footer`, `withTime`; the chip names a matching preset («Период: Этот месяц»). Without it the panel opens one month with no presets. |

### Functions

#### `matchesSmartFilter(entry, item)`
`(entry: SmartFilterFieldValue \| undefined, item: string \| number \| Date \| null \| undefined) => boolean`

Checks one item's value against a field's entry on the client; an empty entry matches everything.

#### `resolveSmartFilterValues(entry, all)`
`(entry: SmartFilterFieldValue \| undefined, all: readonly string[]) => string[]`

Turns a fixed field's entry into the list of values to ask a server for.

#### `isSmartFilterRange(entry)`
`(entry: SmartFilterFieldValue \| undefined) => entry is SmartFilterRange<number> \| SmartFilterRange<Date>`

Tells a range entry from a selection.

## Variants

### size
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | toolbar 28; value and filter tags 20 (tags never go below `s`) | dense table toolbars | |
| `s` | toolbar 32; tags 20 | compact toolbars | |
| `m` | toolbar 36; tags 24 | most pages | yes |
| `l` | toolbar 40; tags 28 | roomier pages | |
| `xl` | toolbar 48; tags 32 | hero search | |

In the tag row «Добавить фильтр» is a pressable gray Badge of the tag tier and «Сбросить все» a
neutral LinkButton with the tags' text size, at the end of the row: every element of the row has the
same height and type.

### field `finite`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | the «−» of the last shown value is disabled | fixed sets (method, status) | yes |
| `false` | every value can be hidden | open sets (services, users) | |

### field `kind`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `options` | value Badges to show or hide | discrete values | yes |
| `range` | two Inputs «от» – «до»; chip «Сумма: 1 000–5 000» (`от 1 000`, `до 5 000` with one bound) | amounts, counts | |
| `date-range` | the kit Datepicker range field; chip in the Datepicker's words («Период: 1–15 мар») | a period | |

### field `multiple`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | many values, each shown or hidden | most fields | yes |
| `false` | one value, no «−»: a press picks it, a second press clears it | the API takes one value per field | |

### Toolbar `searchable`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `true` | search + filter button, the panel as wide as the toolbar | lists with free text | yes |
| `false` | the filter button alone; the panel at its own width (≤ 24rem) | the search lives elsewhere or there is none | |

## States
| State | Driven by | DOM |
|---|---|---|
| closed / open | filter button, search focus | button `aria-expanded`; the panel is a Popover below the toolbar |
| value neutral | no selection | gray Badge |
| value shown | press | the Badge's pressed (selected) look, `aria-pressed="true"`, `data-mode="include"` |
| value hidden | «−», Alt+click, Shift+Enter | red Badge with «НЕ», `data-mode="exclude"`; its «−» stays visible and unhides |
| cannot hide | last value of a `finite` field | the «−» is disabled |
| searching | `search` | only matching values, the match in `accent-text` (a `<mark>`); fields with nothing found in a compact EmptyPage; the «Искать» row closes the panel |
| range set | a bound typed (`range`: two Inputs «от» – «до») or a period picked (`date-range`: Datepicker `mode="range"`) | `{ from, to }` in the value; counts as one filter, one blue chip («Сумма: 1 000–5 000», «Период: 1–15 мар»); removing the chip clears both bounds and the inputs |
| range inverted | `from` above `to` | both bound inputs `aria-invalid` with the danger ring; nothing matches |
| single value | `multiple: false` | at most one value `aria-pressed`; no «−» |
| no filters | empty value | no count on the button, no Chips |
| compact button | the toolbar narrower than the search's 9rem plus the labelled button (search and fields both present) | the button shows its icon and the count Badge; its name stays «Фильтр» (`aria-label` without filters, a visually hidden label with them) |

## Layout & spacing
- The panel is a flush Popover at least as wide as the toolbar (`width="min-trigger"`), by its content up to twice the panel minimum when the toolbar is narrow; every section is a full-width row with its own padding (`--prime-space-3` × `--prime-space-4`, footer `--prime-space-2` × `--prime-space-4`), Dividers run edge to edge, the field label column is at least `--prime-space-24` (a longer name takes its own width, never breaking inside a word); a row narrower than 24rem stacks the label over the values (an intrinsic wrap, no breakpoint).
- The toolbar is one row of controls (`--prime-space-2` gap): the search first, growing from 9rem (`--prime-space-24` × 1.5), then the filter button at its own width. When less than 9rem is left beside the labelled button, the button shows only its icon and count and stays beside the search, which gives its width instead of wrapping. Every row stays one control high. The search and the button also stand alone: `searchable={false}` keeps the button, empty `fields` keep the search. Search first, filter second — the active filters (`SmartFilter.Chips`) sit under them.
- Chips are Badges of the toolbar tier on the badge scale (`xs` → `s`), so a tag sits lower than the controls above it; «Добавить фильтр» is a tag of the same tier and «Сбросить все» a LinkButton with the tag's text size.
- Values and chips wrap with `--prime-space-2` gaps; «Сбросить все» is pushed to the end. The chips row rises in with the first filter and closes up in place with the last (`partPresence`).
- Option groups stack `--prime-space-3` apart, a caption `--prime-space-1` above each group's values. A range row holds two equal Inputs with a dash between them, centred on the field label.
- While typing a search a range row stays only when its field name matches.
- The root draws nothing: its host places Toolbar and Chips, next to what they filter. A table among other blocks (KPI cards, a chart) takes them in its own tools row — the DataTable `toolbar` (the Toolbar) and `toolbarChips` (the Chips), with `SmartFilter.Root` around the DataTable. A page that is one list takes them in its bar — the Toolbar in `Page.Tools`, the Chips in `Page.Chips`, with `SmartFilter.Root` around `Page.Root`. Elsewhere a host stacks them (a `Card.Body`, a form column).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the panel values and their «−» (shown on focus). |
| `Enter` · `Space` | Shows only this value; pressing again clears it. |
| `Shift + Enter` | Hides the value. |
| `Enter` · `Escape` | In the search, close the panel. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- The filter button has `aria-expanded` and `aria-haspopup="dialog"`; the panel is a non-modal `role="dialog"` named by a visually hidden `labels.filter` title.
- Values are toggle buttons with `aria-pressed`; the «−» has its own name (`labels.hideValue` / `labels.unhideValue`); a hidden value carries the «НЕ» text, so meaning is never in color alone.
- Fields with nothing found are announced through `role="status"`.
- Range bounds are inputs named by `labels.fromLabel` / `labels.toLabel` («Сумма, от»); an inverted range marks both `aria-invalid`. A date range is the Datepicker field named by the field label.
- An option group is a `role="group"` named by its `group`.
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
| `from` | `"от"` | Placeholder of a range's lower bound. |
| `to` | `"до"` | Placeholder of a range's upper bound. |
| `fromLabel` | `"{field}, от"` | Accessible name of the lower bound input. |
| `toLabel` | `"{field}, до"` | Accessible name of the upper bound input. |
| `rangeFrom` | `"от {value}"` | Chip value of a range with only the lower bound. |
| `rangeTo` | `"до {value}"` | Chip value of a range with only the upper bound. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Filters above a request list: the filter button and the search, applied filters as tags, rows narrowed by the value and the text — `fields`, `value`, `search`, `matchesSmartFilter`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: the filter button, the search, the tags and the panel follow one tier — `size`. |
| [many-values.tsx](examples/many-values.tsx) | An open set of twenty services, degraded ones marked with an icon, collapsed after eight; typing narrows the panel and marks the match in accent — `finite`, `icon`, `collapsedLimit`. |
| [ranges.tsx](examples/ranges.tsx) | Deals narrowed by an amount from–to and a period from a calendar with presets, two months and an Apply footer; each range is one readable chip, and the bounds go to the server as from / to parameters — `kind`, `formatValue`, `calendar`, `matchesSmartFilter`, `isSmartFilterRange`. |
| [single-value.tsx](examples/single-value.tsx) | For an API that takes one value per field: the filter button without a search, a press picks only that value and nothing can be hidden — `searchable`, `multiple`. |
| [option-groups.tsx](examples/option-groups.tsx) | Values of different kinds in one field: owner types and people under their own headings — `options`, `group`. |
| [controlled.tsx](examples/controlled.tsx) | A saved view sets the value from outside; the selection is read back as the list to ask the server for — `value`, `onValueChange`, `resolveSmartFilterValues`. |
| [narrow.tsx](examples/narrow.tsx) | A 320 px column: the search shrinks next to the filter button and the tags wrap under them — `size`. |

## Mistakes
- Creating `fields` inline on every render → pass a stable array (a module constant or `useMemo`).
- A fixed field marked `finite: false` → the user can hide every value and get an empty list.
- Filtering the list with `includes` → use `matchesSmartFilter` (empty `include` is "any", `exclude` rejects; range bounds are inclusive, dates by whole days; an item with no value passes only an empty filter).
- Sending `include` to a server for a hidden value of a fixed field → use `resolveSmartFilterValues` («hide» becomes «all except», `[]` means no filter).
- Putting `Chips` outside `SmartFilter.Root` → every part needs the root; when Toolbar and Chips stand in different groups of a page bar, wrap `Page.Root` in it.
- A second row of filter buttons next to the toolbar → fields belong in `fields`.
- An amount or a period in its own Popover beside the toolbar → a `range` / `date-range` field; it gets a chip and the count.
- One field split in two because its values are of different kinds → one field with `group` on the options.
- Cutting the «−» and the search off on the client for a one-value API → `multiple: false` and `searchable={false}`.

## Related
- **Built from:** [Button](../button/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Input](../input/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Divider](../divider/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md), [Typography](../typography/COMPONENT.md), Icon (`action.search`, `action.filter`, `action.add`, `nav.chevronDown`), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Page](../../layout/page/COMPONENT.md) (`Page.Tools`, `Page.Chips`), [TagSelect](../tag-select/COMPONENT.md), [DataTable](../data-table/COMPONENT.md) (`toolbar`, `toolbarChips`)
