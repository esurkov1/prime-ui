# SmartFilter

**Category:** selection
**Kind:** composite

> The search and filter bar of lists and tables: the search first and a filter button with a panel of values and ranges, applied filters as removable tags, and a "show / hide" choice for every value.

## When to use
- Narrowing a list, table or log by several fields at once (service, method, status), where the user also types free text.
- Filters where "everything except this" matters as much as "only this": every value can be shown or hidden.
- Search and filters together («Евгений» whose status is «В аренде»): Enter pins the typed query as the first chip, and the list keeps the rows that match the query and every filter.
- Many values per field (dozens of services): the panel collapses them to «Ещё N» and narrows as the user types.
- Ranges next to the values: an amount from–to (`kind: "range"`), a period (`kind: "date-range"`), each one readable chip.
- One search with filters in a toolbar where a separate button adds nothing — a list page's own toolbar, a DataTable `toolbar`: `layout="combined"` puts the filter as a section at the end of the search field.
- An API that takes one value per field (`multiple: false`), a screen whose text search lives elsewhere (`searchable={false}`), values of different kinds in one field (`group`).

## When not to use
- One field with a few options → use [SegmentedControl](../segmented-control/COMPONENT.md), [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md) beside what it narrows: a table's `toolbar`, or the page's `Page.Tools` when it acts on the whole page.
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
│  │                              combined: [search Input · clear │ filter section (count Badge)], one field
│  └─ panel                       flush Popover as wide as the toolbar; sections split by Dividers
│     ├─ query row                ghost Button «Искать «text»» + Kbd ↵, while typing
│     ├─ field rows               field label · value Badges with a «−» Badge.Action · «Ещё N» Badge
│     │                           (groups: a caption over each group's values, role="group")
│     ├─ range rows               field label · Input «от» – Input «до» · or a Datepicker range field
│     ├─ no matches               compact EmptyPage naming the fields with nothing found
│     └─ footer                   Reset Button, while a filter is set
└─ SmartFilter.Chips              the pinned search, then applied filters, as removable Badges · add / clear all Buttons
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
| `search` | `string` | — | The query the list is searched by, controlled: the field's text while typing, then the pinned query of the search chip. |
| `defaultSearch` | `string` | `""` | Initial query, uncontrolled; a non-empty one starts pinned as the search chip. |
| `onSearchChange` | `(search: string) => void` | — | Every keystroke while no query is pinned, then on Enter only when the query changes, and on the chip's ×; debounce in the owner when it asks a server. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the filter button, the search, the tags and the panel. Without it the tier of its host, else `m`. |
| `collapsedLimit` | `number` | `12` | Values of one field shown before «Ещё N» (not while searching). |
| `labels` | `Partial<SmartFilterLabels>` | — | Built-in strings, see Labels. |
| `children` | `ReactNode` | — (required) | `SmartFilter.Toolbar` and `SmartFilter.Chips`, anywhere inside — in a page bar the Root wraps `Page.Root`. |

### SmartFilter.Toolbar
`ref` → `HTMLDivElement`. A `<div>`: the search Input, then the filter — a Button beside it or a section at the field's end — with a count Badge; only its icon and count when narrow. Empty `fields` — the search alone. The anchor of the panel, a flush Popover.

| Prop | Type | Default | Description |
|---|---|---|---|
| `searchable` | `boolean` | `true` | The search input. `false` — the filter button alone; the panel opens at its own width (24rem at most) and lists every field. |
| `layout` | `"split" \| "combined"` | `"split"` | Where the filter stands: `split` — a Button beside the search; `combined` — a section at the end of the search field, after a faint line, always shown. Needs `searchable`: without it, the plain button. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the toolbar. |

### SmartFilter.Chips
`ref` → `HTMLDivElement`. A `<div>`: the pinned search first, then the applied filters, as removable Badges, with «+ Фильтр» and «Сбросить все»; renders nothing without either.

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

In the tag row «+ Фильтр» is a pressable gray Badge of the tag tier and «Сбросить все» a
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

### Which shape
| Shape | Looks like | Use when |
|---|---|---|
| filter only — `searchable={false}` | the filter button alone; the panel at its own width | the text search lives elsewhere or the API has none |
| search only — `fields={[]}` | the search field alone, no button | a list or table page with no filter fields yet: it grows into filters without a rebuild |
| split — `layout="split"` | the search field and a «Фильтр» button beside it | the filter must be found at a glance: a page people open now and then, several filter fields |
| combined — `layout="combined"` | one field: the search, a faint line, the filter section (glyph, «Фильтр», count) at its end | a toolbar where a separate button adds nothing: a list page's own toolbar, a DataTable `toolbar`, a work screen used daily |

### Toolbar `layout`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `split` | the search, then the filter Button at its own width | the filter should read as its own control | yes |
| `combined` | one field frame: the search, then the filter section after a faint line — a field segment, always shown, with its own wash and inset focus ring; the clear «×» stays before the line | one search with filters where a button beside it adds nothing | |

Without `searchable` there is no field to hold the section: `combined` renders the plain button.

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
| typing | the field's text | only matching values, the match in `accent-text` (a `<mark>`); fields with nothing found in a compact EmptyPage; while no query is pinned the text is `search`, live |
| search pinned | Enter, the «Искать» row, or `search` set from outside | a blue Badge «Поиск: {query}» with a search icon first in `SmartFilter.Chips` (`data-search`); the field empties and keeps the focus, the panel stays open; typed text now only finds values, Enter puts it in the chip's place, Escape clears just the text; the pin is announced (`labels.searchCommitted`) |
| search cleared | the chip's ×, «Сбросить все» | `search` is `""`; the field drives it live again |
| range set | a bound typed (`range`: two Inputs «от» – «до») or a period picked (`date-range`: Datepicker `mode="range"`) | `{ from, to }` in the value; counts as one filter, one blue chip («Сумма: 1 000–5 000», «Период: 1–15 мар»); removing the chip clears both bounds and the inputs |
| range inverted | `from` above `to` | both bound inputs `aria-invalid` with the danger ring; nothing matches |
| single value | `multiple: false` | at most one value `aria-pressed`; no «−» |
| no filters | empty value, no pinned search | no count on the button, no Chips |
| combined | `layout="combined"` (search and fields both present) | the section is a `<button data-field-section>` after the input inside `Input.Wrapper`; the field rings its text while focus is in the search, the section draws its own inset ring (as every field segment) |
| compact filter | the search would keep less than 18rem beside the labelled filter (search and fields both present) — every phone width | the button (or the section) shows its icon and the count Badge; its name stays «Фильтр» (`aria-label` without filters, a visually hidden label with them) |

## Layout & spacing
- The panel is a flush Popover at least as wide as the toolbar (`width="min-trigger"`), by its content up to twice the panel minimum when the toolbar is narrow; every section is a full-width row with its own padding (`--prime-space-3` × `--prime-space-4`, footer `--prime-space-2` × `--prime-space-4`), Dividers run edge to edge, the field label column is at least `--prime-space-24` (a longer name takes its own width, never breaking inside a word); a row narrower than 24rem stacks the label over the values (an intrinsic wrap, no breakpoint).
- The toolbar is one row of controls (`--prime-space-2` gap): the search first, growing from 9rem (`--prime-space-24` × 1.5), then the filter button at its own width. When the search would keep less than 18rem (`--prime-space-24` × 3) beside the labelled filter, the filter shows only its icon and count and stays beside the search, which gives its width instead of wrapping. Every row stays one control high. The search and the button also stand alone: `searchable={false}` keeps the button, empty `fields` keep the search. Search first, filter second — the active filters (`SmartFilter.Chips`) sit under them.
- Narrow: every phone width (320–430) gets the compact form of its shape — split: the search beside an icon-only filter button with its count; combined: one field whose filter section keeps only its icon and count; filter only: the button keeps its label (the panel takes the width); search only: the field alone. The search keeps at least 15rem on the narrowest phone (320 px); the label returns from a tablet column up.
- Combined, the toolbar is one field: the filter section closes it at the field's full inner height with the field padding on both sides, in the field text; a faint line (a translucent tint, readable on every field fill) stands at its start, inset from the top and bottom by the tier gap. The section follows the field tier (`xs`–`xl`) and goes to its icon and count under the same width rule as the button.
- Search and filters together: one `search` string and one `value` map, combined by the owner with AND — a row stays when it contains the query and passes `matchesSmartFilter` for every field. The search is no filter: it adds no count to the button and no «НЕ».
- Chips are Badges of the toolbar tier on the badge scale (`xs` → `s`), so a tag sits lower than the controls above it; «+ Фильтр» is a tag of the same tier and «Сбросить все» a LinkButton with the tag's text size.
- Values and chips wrap with `--prime-space-2` gaps; «Сбросить все» is pushed to the end. The chips row, and the panel footer with its Reset, rise in with the first filter and close up in place with the last (`partPresence`).
- Option groups stack `--prime-space-3` apart, a caption `--prime-space-1` above each group's values. A range row holds two equal Inputs with a dash between them, centred on the field label.
- While typing a search a range row stays only when its field name matches.
- The root draws nothing: its host places Toolbar and Chips, next to what they filter. A table takes them in its own tools row on every page, the page that is only this table included — the DataTable `toolbar` (the Toolbar) and `toolbarChips` (the Chips), with `SmartFilter.Root` around the DataTable. A filter over several views of one set (a board and its list, a media grid, a schedule) takes the page's bar — the Toolbar in `Page.Tools`, the Chips in `Page.Chips`, with `SmartFilter.Root` around `Page.Root`. Elsewhere a host stacks them (a `Card.Body`, a form column).

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | From the search to the filter control — the button beside it, or the section at the field's end (`combined`). |
| `Enter` · `Space` | On the filter control, opens or closes the panel. |
| `Escape` | In the panel, closes it and returns focus to the filter control. |
| `Tab` | Moves through the panel values and their «−» (shown on focus). |
| `Enter` · `Space` | Shows only this value; pressing again clears it. |
| `Shift + Enter` | Hides the value. |
| `Enter` | In the search, pins the typed query as the search chip and empties the field (the panel stays for the filters); in an empty field, closes the panel. |
| `Escape` | In the search, clears the typed text (never the pinned query); in an empty field, closes the panel. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- A pinned query is said by a polite live region (`labels.searchCommitted`); the search chip's × is named by `labels.removeSearch` («Убрать поиск «Евгений»»).
- The filter control — the button, or the field's section (a `<button>` after the search input, never inside it) — has `aria-expanded` and `aria-haspopup="dialog"` and is named by `labels.filter` and the count; the panel is a non-modal `role="dialog"` named by a visually hidden `labels.filter` title.
- Values are toggle buttons with `aria-pressed`; the «−» has its own name (`labels.hideValue` / `labels.unhideValue`); a hidden value carries the «НЕ» text, so meaning is never in color alone.
- Fields with nothing found are announced through `role="status"`.
- Range bounds are inputs named by `labels.fromLabel` / `labels.toLabel` («Сумма, от»); an inverted range marks both `aria-invalid`. A date range is the Datepicker field named by the field label.
- An option group is a `role="group"` named by its `group`.
- Every filter tag has a remove button named by `labels.remove`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

#### SmartFilter.Root

| Key | Default | Used for |
|---|---|---|
| `filter` | `"Фильтр"` | Filter button and panel name. |
| `searchPlaceholder` | `"Поиск"` | Placeholder and name of the search. |
| `clearSearch` | `"Очистить поиск"` | Name of the search clear button. |
| `searchCommitted` | `"Поиск «{query}» добавлен к фильтрам"` | Announced when Enter pins a query. |
| `searchText` | `"Искать «{query}»"` | The text search row while typing. |
| `noMatches` | `"{fields} — нет совпадений"` | Fields with nothing found while typing (compact EmptyPage). |
| `reset` | `"Сбросить"` | Panel footer reset, shown while a filter is set. |
| `more` | `"Ещё {count}"` | Collapsed values of a field. |
| `add` | `"Фильтр"` | Chips row: opens the panel. |
| `clearAll` | `"Сбросить все"` | Chips row: clears every field and the search. |
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

#### SmartFilter.Chips

| Key | Default | Used for |
|---|---|---|
| `searchChip` | `"Поиск: {query}"` | Text of the search chip, the pinned query. |
| `removeSearch` | `"Убрать поиск «{query}»"` | Name of the search chip's remove button. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Filters above a request list: the filter button and the search, applied filters as tags, rows narrowed by the value and the text — `fields`, `value`, `search`, `matchesSmartFilter`. |
| [variants.tsx](examples/variants.tsx) | Four shapes of one toolbar: the filter button alone, the search alone, the search beside the button, one field with a filter section — `searchable`, `fields`, `layout`. |
| [sizes.tsx](examples/sizes.tsx) | Every size tier: the filter button, the search, the tags and the panel follow one tier — `size`. |
| [combined.tsx](examples/combined.tsx) | Orders narrowed from one field: the search on the left, the filter section with its count on the right, the same panel from either; on a phone the section keeps only its icon and count — `layout`, `search`, `value`. |
| [search-and-filters.tsx](examples/search-and-filters.tsx) | Clients found by a name and a status together: Enter pins the typed name as the first chip, the field empties for the next filter, and the list keeps the rows that match both — `search`, `value`, `labels`, `matchesSmartFilter`. |
| [many-values.tsx](examples/many-values.tsx) | An open set of twenty services, degraded ones marked with an icon, collapsed after eight; typing narrows the panel and marks the match in accent — `finite`, `icon`, `collapsedLimit`. |
| [ranges.tsx](examples/ranges.tsx) | Deals narrowed by an amount from–to and a period from a calendar with presets, two months and an Apply footer; each range is one readable chip, and the bounds go to the server as from / to parameters — `kind`, `formatValue`, `calendar`, `matchesSmartFilter`, `isSmartFilterRange`. |
| [single-value.tsx](examples/single-value.tsx) | For an API that takes one value per field: the filter button without a search, a press picks only that value and nothing can be hidden — `searchable`, `multiple`. |
| [option-groups.tsx](examples/option-groups.tsx) | Values of different kinds in one field: owner types and people under their own headings — `options`, `group`. |
| [controlled.tsx](examples/controlled.tsx) | A saved view sets the value from outside; the selection is read back as the list to ask the server for — `value`, `onValueChange`, `resolveSmartFilterValues`. |
| [narrow.tsx](examples/narrow.tsx) | A 320 px column, as on a phone: both shapes go compact — the search beside an icon-only filter button with its count, or one field whose filter section keeps only its icon; the tags wrap under them — `size`, `layout`. |

## Mistakes
- Creating `fields` inline on every render → pass a stable array (a module constant or `useMemo`).
- A fixed field marked `finite: false` → the user can hide every value and get an empty list.
- Filtering the list with `includes` → use `matchesSmartFilter` (empty `include` is "any", `exclude` rejects; range bounds are inclusive, dates by whole days; an item with no value passes only an empty filter).
- Sending `include` to a server for a hidden value of a fixed field → use `resolveSmartFilterValues` («hide» becomes «all except», `[]` means no filter).
- Reading the field's text for the list after Enter → read `search`: the field empties when the query is pinned, `search` keeps it.
- Putting `Chips` outside `SmartFilter.Root` → every part needs the root; when Toolbar and Chips stand in different groups of a page bar, wrap `Page.Root` in it.
- A filter button beside a search in a toolbar where it adds nothing → `layout="combined"`; a hand-made icon button inside the search field instead → the same, it is that section.
- A second row of filter buttons next to the toolbar → fields belong in `fields`.
- An amount or a period in its own Popover beside the toolbar → a `range` / `date-range` field; it gets a chip and the count.
- One field split in two because its values are of different kinds → one field with `group` on the options.
- Cutting the «−» and the search off on the client for a one-value API → `multiple: false` and `searchable={false}`.

## Related
- **Built from:** [Button](../button/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Input](../input/COMPONENT.md), [Datepicker](../datepicker/COMPONENT.md), [Popover](../popover/COMPONENT.md), [Divider](../divider/COMPONENT.md), [Kbd](../kbd/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [LinkButton](../link-button/COMPONENT.md), [Tooltip](../tooltip/COMPONENT.md) (through `internal/FieldAction`, shared with `Input.Action`), [Typography](../typography/COMPONENT.md), Icon (`action.search`, `action.filter`, `action.add`, `nav.chevronDown`), [VisuallyHidden](../visually-hidden/COMPONENT.md)
- **See also:** [Page](../../layout/page/COMPONENT.md) (`Page.Tools`, `Page.Chips`), [TagSelect](../tag-select/COMPONENT.md), [DataTable](../data-table/COMPONENT.md) (`toolbar`, `toolbarChips`)
