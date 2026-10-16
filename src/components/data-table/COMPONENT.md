# DataTable

**Category:** data-display
**Kind:** composite

> A data table with sorting, pages or infinite scroll, row selection, row groups, rows that open a record, a column chooser, nested rows and loading / empty / error states.

## When to use
- Lists of records with several attributes to compare: orders, invoices, users, campaigns.
- Data that needs sorting, paging or bulk selection.
- Thousands of records the server sorts and pages (`source="server"` + `rowCount`): the table shows the one page the server returned.
- Rows that open a record: a page (`getRowHref`, a real link) or a drawer in place (`onRowClick`).
- Rows grouped by a key with a header and totals per group (`getRowGroup`).
- Records whose order is data the user sets: pipeline stages, a price list, priorities (`onReorder`; the grip ends the row, `reorderHandle` moves it).
- Tables people arrange for themselves: their own column order and set (`columnOrder` + `hiddenColumns`, saved by the app).
- Hierarchical rows (`getRowChildren`) or rows with a detail panel (`renderExpanded`).
- Wide numeric reports with a sticky head and first column.
- Wide records on narrow screens: let people choose the columns (`columnsMenu` over the row actions, else `DataTableColumnsMenu` in the page's tools) instead of dropping them.
- A log or a register that takes the rest of the page height (`scrollHeight="fill"`).

## When not to use
- One or two KPIs → use [Card](../card/COMPONENT.md).
- A short list of events without columns → use [Timeline](../timeline/COMPONENT.md).
- Records whose start and end dates are compared on a calendar (occupancy, a project plan) → use [Gantt](../gantt/COMPONENT.md).
- Work items moved by hand between statuses → use [Kanban](../kanban/COMPONENT.md).
- A page with nothing to show yet (first run, no permissions) → use [EmptyPage](../empty-page/COMPONENT.md); inside a table pass it to `empty`.
- Page navigation outside a table → use [Pagination](../pagination/COMPONENT.md).
- Picking values from a list → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).

## Import
```tsx
import { DataTable, type DataTableColumn, DataTableColumnsMenu } from "prime-ui-kit";
```
Exported types: `DataTableColumn<Row>`, `DataTableProps<Row>`, `DataTableSortState`, `DataTableOrder`, `DataTableGroup<Row>`, `DataTableRowClickEvent`, `DataTableLabels`, `DataTableColumnsMenuProps<Row>`, `DataTableColumnsMenuLabels`.

## Anatomy
```
DataTable                           card-fill block, radius 12, clips its content
├── toolbar                         optional panel for several table controls (bulk actions, own search + filters)
├── scroll viewport                 ScrollContainer, both axes, in a frame that holds the edge shadows
│   └── table
│       ├── thead                   [grip] [select all] [toggle] head cells [end grip cell]; sortable heads hold a button
│       │                           columnsMenu: an icon Button + Dropdown in the row-actions head cell (the last
│       │                           column, hideHeader); with columnOrder a Dnd.Sortable list inside
│       │                           columnOrder: the head row is a Dnd.Sortable; a header moves alone (drag, Alt + ← / →)
│       └── tbody                   rows · sub-rows · detail rows · skeleton / empty / error row
│           (one per group)         with getRowGroup: a <th scope="rowgroup"> header row, then its rows
│                                   with onReorder: a Dnd.Sortable tbody; a Dnd.Handle ends each row (reorderHandle
│                                   "end"), leads it ("start"), or the row itself is the grip ("row")
└── footer                          range «Показано 1–5 из 23» · Pagination · infinite-scroll status
```
```
DataTableColumnsMenu                the column chooser outside the table, for the page's tools
├── soft Button                     view.columns icon · labels.columns · Badge with the count of shown columns
└── Dropdown                        a «Показывать» group of check items (with onColumnOrderChange a Dnd.Sortable list,
                                    a grip ends each item) · «Показать все» · «Исходный порядок»
```
Columns are data (`DataTableColumn<Row>[]`), not child parts; the table has no parts. The column chooser has one place per table: the `columnsMenu` flag puts it in the head of the row-actions column; a table without one gets `DataTableColumnsMenu` in the page's tools (`Page.Tools`), bound to the same `hiddenColumns` / `columnOrder` state — never in `toolbar` alone.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### DataTable
Generic `DataTable<Row>`; `ref` → `HTMLDivElement`. A card-fill block with an optional toolbar, a scrolling `<table>` and a footer (range, Pagination, infinite-scroll status); passes its tier to the controls inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn<Row>[]` | — (required) | Column definitions, see `DataTableColumn<Row>`. |
| `hiddenColumns` | `string[]` | — | Ids of columns that are not rendered, controlled. A column with `hideable: false` stays. The column chooser (`columnsMenu`, `DataTableColumnsMenu`) changes it. |
| `defaultHiddenColumns` | `string[]` | `[]` | Initially hidden column ids, uncontrolled. |
| `onHiddenColumnsChange` | `(hiddenColumns: string[]) => void` | — | The hidden ids changed (`columnsMenu`). The kit stores nothing: keep the list (local storage, the user's settings) and pass it back to restore the choice. |
| `columnOrder` | `string[]` | — | Column ids in screen order, hidden ones keeping their place, controlled. Any prop of this triad makes columns reorder: a header drag (the body stays until the drop), Alt + ← / → on a header, grips in the column chooser. |
| `defaultColumnOrder` | `string[]` | — | Initial column order, uncontrolled; `[]` — the order of `columns`, reorderable. |
| `onColumnOrderChange` | `(columnOrder: string[]) => void` | — | The order changed: a header dropped, a keyboard move, a chooser grip or «Исходный порядок». The kit stores nothing: keep it with `hiddenColumns` and pass it back. |
| `columnsMenu` | `boolean` | `false` | The column chooser in the head of the row-actions column (the last one, `hideHeader`); reorders with `columnOrder`. Without that column it renders nothing and warns: use `DataTableColumnsMenu` in the page's tools. |
| `rows` | `Row[]` | — (required) | Data; sorted in memory when a sort is set. With `source="server"` — the page (or the loaded batches) as the server returned it. |
| `source` | `"client" \| "server"` | `"client"` | Who sorts and pages the rows. `client`: the table sorts `rows` and slices pages. `server`: `rows` is one page, already sorted; `sort` / `page` changes are the request, `rowCount` drives Pagination. |
| `rowCount` | `number` | `rows.length` | Total rows on the server (`source="server"`): the page count and «Показано {from}–{to} из {total}». |
| `getRowKey` | `(row: Row, index: number) => Key` | — | Stable row id (position by default; sub-rows too, `index` among siblings); selection, expansion and the enter animation of new rows are keyed by it. Pass it whenever sorting, selection or expansion is used. |
| `getRowLabel` | `(row: Row) => string` | — | Human row name for the checkbox and toggle names (`{label}` in `labels`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Density and control tier: rows from 36 · 36 · 44 · 52 · 52 px (`--prime-table-row-height-<size>`); passed to checkboxes, toggles, Pagination and nested controls. Without it the tier of the host. |
| `paging` | `"pages" \| "infinite" \| "none"` | `"pages"` | `pages` — Pagination in the footer when there is more than one page; `infinite` — rows are revealed while scrolling; `none` — every row at once. |
| `pageSize` | `number` | `10` | Rows per page; also the first batch with `paging="infinite"` (with `source="server"` every loaded row is shown). |
| `page` | `number` | — | Current page (1-based), controlled. |
| `defaultPage` | `number` | `1` | Initial page, uncontrolled. |
| `onPageChange` | `(page: number) => void` | — | Page change from the pager; a sort change also returns to page 1. |
| `sort` | `DataTableSortState` | — | Current sort, controlled: `{ columnId, order: "asc" \| "desc" }` or `null`. |
| `defaultSort` | `DataTableSortState` | `null` | Initial sort, uncontrolled. |
| `onSortChange` | `(sort: DataTableSortState) => void` | — | A head click cycles asc → desc → none. |
| `loading` | `boolean` | `false` | Skeleton rows while there are no rows; with rows on screen (a refetch, another server page) they stay and the table gets `aria-busy`. |
| `loadingRows` | `number` | `min(pageSize, 5)` | Number of skeleton rows. |
| `empty` | `ReactNode` | `labels.empty` | Empty-state content: a string goes into a compact EmptyPage, a node (e.g. a full `EmptyPage`) is rendered as is. |
| `loadError` | `ReactNode` | — | Load error: replaces the body with the message in `role="alert"`. |
| `toolbar` | `ReactNode` | — | Panel above the table for several controls of the table itself (bulk actions on the selected rows, a table-local search with filters); stacks below 30rem of table width. |
| `selectable` | `boolean` | `false` | Leading checkbox column with «select all», Shift range, press-and-drag and Space. |
| `selected` | `Key[]` | — | Selected row ids, controlled. |
| `defaultSelected` | `Key[]` | `[]` | Initially selected ids, uncontrolled. |
| `onSelectedChange` | `(selected: Key[]) => void` | — | Selection change. |
| `onReorder` | `(id: Key, beforeId: Key \| null) => void \| Promise<void>` | — | Rows reorder (by a grip, see `reorderHandle`). Row `id` goes in front of `beforeId` (`null` = last); apply it with `moveBefore`, return a promise to save. Off while sorted by a column. |
| `reorderHandle` | `"start" \| "end" \| "row"` | `"end"` | Where a row is picked up (`onReorder`): `end` — a grip ends the row; `start` — a grip column leads it; `row` — no grip, the whole row is carried and takes Alt + ↑ / ↓ itself. |
| `getRowChildren` | `(row: Row) => Row[] \| undefined` | — | Sub-rows rendered under the parent with the same columns, indented by depth. |
| `renderExpanded` | `(row: Row) => ReactNode` | — | Full-width detail row under an expanded row. |
| `isRowExpandable` | `(row: Row) => boolean` | — | Which rows get an expand toggle; by default rows with sub-rows, or every row with `renderExpanded`. |
| `expanded` | `Key[]` | — | Expanded row ids, controlled. |
| `defaultExpanded` | `Key[]` | `[]` | Initially expanded ids, uncontrolled. |
| `onExpandedChange` | `(expanded: Key[]) => void` | — | Expansion change. |
| `infiniteBatchSize` | `number` | `20` | Rows revealed per scroll step. |
| `hasMore` | `boolean` | `false` | More rows can be loaded from the server. |
| `loadingMore` | `boolean` | `false` | A server batch is loading: footer status, `aria-busy`. |
| `onLoadMore` | `() => void \| Promise<void>` | — | Called at the end when every loaded row is shown and `hasMore` is set. A returned promise shows the loading status until it settles; a rejected one stops asking until the rows change. |
| `scrollHeight` | `number \| string \| "fill"` | `360` with `paging="infinite"`, else none | Max height of the scroll viewport (number = px); `"fill"` — the table takes the height of its flex / grid parent (or a sized block), the rows scroll inside, infinite paging follows it. |
| `stickyHeader` | `boolean` | `false` | The head sticks while the body scrolls (with `scrollHeight`); on screens lower than 480px it scrolls with the rows. |
| `stickyFirstColumn` | `boolean` | `false` | The first visible column (with the selection and toggle columns) sticks while scrolling sideways; the start edge shadow falls from its end edge. |
| `stickyLastColumn` | `boolean` | `false` | The last visible column (row actions) sticks to the end edge while scrolling sideways; the end edge shadow falls from its start edge. |
| `showHeader` | `boolean` | `true` | Render `<thead>`. |
| `fullWidth` | `boolean` | `true` | The table spans its container; `false` sizes the table and its surface by its content (up to the container's width, then it scrolls). |
| `rowDividers` | `boolean` | `true` | Hairlines between rows. |
| `columnDividers` | `boolean` | `true` | Hairlines between content columns. |
| `striped` | `boolean` | `false` | Every second row one opaque step off the table fill. |
| `highlightRowOnHover` | `boolean` | `true` | Row wash on hover (and a pressed wash on clickable rows). |
| `highlightColumnOnHover` | `boolean` | `false` | Column wash under the pointer (head and cells). |
| `getRowHref` | `(row: Row) => string` | — | The row is a link: a real `<a>` in the key cell (first visible column), and the same link covers the whole row. Keep controls out of the key cell. |
| `onRowClick` | `(row: Row, index: number, event: DataTableRowClickEvent) => void` | — | Opens a row in place (a drawer, a panel) on a click, Enter or Space; never from a control inside the row. With `getRowHref` it gets plain clicks: `event.preventDefault()` routes in the app. |
| `isRowClickable` | `(row: Row) => boolean` | every row | Which rows open (`getRowHref` and `onRowClick` alike); `false` for a total or a service row — no link, no focus, no cursor. |
| `getRowGroup` | `(row: Row) => string \| number` | — | Group key of a row: each group gets a header row and its own `<tbody>`. Groups keep the order in which they first appear in `rows`; a sort orders the rows inside each group; a group split by paging repeats its header. |
| `renderGroupHeader` | `(group: DataTableGroup<Row>) => ReactNode` | the group key | Content of a group header; `group.rows` holds every row of the group (all pages) for totals. Children are laid out start / end in the visible width. |
| `stickyGroupHeaders` | `boolean` | `false` | Group headers stick under the head (or the top edge) while their rows scroll. |
| `collapsedGroups` | `(string \| number)[]` | — | Collapsed group keys, controlled. Any prop of this triad makes groups fold: a chevron toggle leads each header, rows fold like sub-rows. «Select all» and paging still count collapsed rows. |
| `defaultCollapsedGroups` | `(string \| number)[]` | — | Initially collapsed group keys, uncontrolled; `[]` — every group open but foldable. |
| `onCollapsedGroupsChange` | `(collapsedGroups: (string \| number)[]) => void` | — | The collapsed group keys changed (a group header toggle). |
| `labels` | `Partial<DataTableLabels>` | — | Built-in strings, see Labels. |
| `className` | `string` | — | Class on the root `<div>`. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | The other attributes of the root `<div>`. |

### DataTableColumnsMenu
Generic `DataTableColumnsMenu<Row>`; `ref` → `HTMLButtonElement`. The column chooser outside the table, for the page's tools: a soft Button «Колонки» with the count of shown columns, opening the same menu as `columnsMenu`. Bound to the table's state.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn<Row>[]` | — (required) | The table's `columns`, in the order of the code. |
| `hiddenColumns` | `string[]` | — (required) | The ids the table hides: the same list its `hiddenColumns` reads. |
| `onHiddenColumnsChange` | `(hiddenColumns: string[]) => void` | — (required) | A column was shown or hidden, or «Показать все». |
| `columnOrder` | `string[]` | — | The table's `columnOrder`. |
| `onColumnOrderChange` | `(columnOrder: string[]) => void` | — | Turns the items into a sortable list (a grip, Alt + ↑ / ↓) with «Исходный порядок»; the new order of every column. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | host tier, else `"m"` | Tier of the trigger and the menu. |
| `labels` | `Partial<DataTableColumnsMenuLabels>` | — | The chooser's strings: `columns`, `showColumns`, `showAllColumns`, `resetColumnOrder`, `reorderColumn`. |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" \| "type">` | — | `className` and the other attributes of the trigger button. |

### Types

#### `DataTableColumn<Row>`
One column of `columns`: data, not a part.

| Field | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | Unique column id (sort state, `data-column-id`). |
| `header` | `ReactNode` | — (required) | Head content. |
| `accessor` | `keyof Row \| ((row: Row) => unknown)` | — | Cell value (rendered as text, `—` for empty) and the default sort value. |
| `cell` | `(row: Row) => ReactNode` | — | Custom cell content. |
| `sortable` | `boolean` | — | The head becomes a sort button with `aria-sort`. |
| `sortAccessor` | `(row: Row) => unknown` | — | Value to sort by instead of `accessor`. |
| `sortComparator` | `(a: Row, b: Row, order: DataTableOrder) => number` | — | Custom comparison. |
| `align` | `"start" \| "center" \| "end"` | `"start"` (`"end"` with `numeric`) | Cell alignment; heads do not follow it. |
| `headerAlign` | `"start" \| "center" \| "end"` | `"start"` | Head alignment; the sort icon stays at the end edge. |
| `hideHeader` | `boolean` | `false` | `header` names the column for assistive tech only (an action column): the head cell looks empty. |
| `description` | `string` | — | What the column means: an info glyph after the header opens it as a tooltip; the header cell is described by it (`aria-describedby`). |
| `numeric` | `boolean` | — | Tabular figures, no wrapping, end alignment unless `align` is set. |
| `truncate` | `boolean` | — | One line with an ellipsis; width from `maxWidth` (or `width`); string values get a `title`. |
| `grow` | `boolean` | — | Takes the free width and wraps its text; the table then fills its container. With `minWidth` it never gets narrower: below that the table scrolls instead of cells overlapping. |
| `hideable` | `boolean` | `true` | The column can be hidden through `hiddenColumns` and `columnsMenu`; `false` for the key column that names the row and for the row-actions column. |
| `reorderable` | `boolean` | `true` | The column moves when columns reorder (`columnOrder`); `false` holds its place: no column moves past it, the chooser shows a lock. A `hideHeader` column and a pinned first or last column (`stickyFirstColumn`, `stickyLastColumn`) hold theirs too. |
| `scale` | `boolean \| { min?: number; max?: number }` | — | Heatmap: each cell is shaded by its numeric value on the five-step chart scale. `true` spans the column's minimum to maximum over all rows; `{ min, max }` fixes either end. |
| `width · minWidth · maxWidth` | `string` | — | CSS sizes of the column (`"14rem"`). |

## Variants

### size (density)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | rows from 36, head 28, text 12/16, cell padding 8 | very dense admin grids | |
| `s` | rows from 36, head 32, text 13/20 | dense back-office lists, narrow containers | |
| `m` | rows from 44, head 36 (13/20 head text), cells 14/20 | most tables | yes |
| `l` | rows from 52, head 40, text 16/24 | spacious lists, large avatars | |
| `xl` | rows from 52, head 48, text 16/24, cell padding 16 | large touch-friendly tables | |

Without `size` the table takes the tier of its host (a sized form, panel or popover), else `m`.

Row height is a minimum: cells pad vertically by (row height − control one tier down) / 2, so one text line or a control one tier down keeps the tier height and taller content grows the row. Checkboxes use the table tier; expand toggles are square ghost Buttons of a fixed small tier (`xs` for xs–m, `s` for l–xl).

Column widths come from the content and then hold still: once rows are laid out the widths are frozen, so searching, filtering, paging and opening sub-rows do not move the columns. A column widens when later content does not fit it, never narrows; widths are measured again when the column set or the container width changes. `grow` columns keep taking the free width.

### paging
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `pages` | `pageSize` rows, footer range and Pagination (compact on narrow widths) | tables people return to and reference | yes |
| `infinite` | rows revealed while scrolling in a `scrollHeight` window, footer status | logs and feeds | |
| `none` | every row, no footer | short lists, reports in a scroll window | |

### source
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `client` | the table sorts `rows` in memory and slices the page itself | every row is loaded (up to a few thousand) | yes |
| `server` | `rows` shown exactly as given (no sort, no slice); Pagination and the range count from `rowCount`; a new page cross-fades in at the top, the old one stays with `aria-busy` while `loading` | the server sorts, pages and searches (CRM lists, registers) | |

With `source="server"` the owner turns `sort`, `page` and its search / filters into a request: control
`page` and set it to 1 whenever the search or a filter changes (a sort change already calls
`onPageChange(1)`); keep the previous rows while the request runs and pass `loading`. With
`paging="infinite"` every loaded row is shown, `onLoadMore` fetches the next batch, and a new sort
replaces `rows` with the first batch — the table starts over from the top; after an `onLoadMore`
rejection the table stops asking until the rows change, so show the error yourself. Selection is a set of ids:
ids from other pages stay in `selected`, «select all» and its indeterminate state speak for the rows
on screen.

### scrollHeight
| Value | Looks like | Use when | Default |
|---|---|---|---|
| a number / a CSS length | the viewport grows with the rows up to that height, then scrolls | a table inside a card or a dashboard block | 360 with `paging="infinite"`, else none |
| `"fill"` | the table takes the height of its flex / grid parent (or a sized block); toolbar and footer keep theirs, the rows scroll | a log or a register that takes the rest of the page (`Page.Root fill`), a pane | |

### Opening a row
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `getRowHref` | the key cell's text is a link; the same link covers the row (pointer, status-bar URL, ⌘-click, middle click, context menu) | the record has its own page; add `onRowClick` to route plain clicks in the app | |
| `onRowClick` | the row takes focus and opens on a click, Enter or Space | the record opens in place: a Drawer, a side panel | |
| `isRowClickable` | `false`: the row neither links nor opens | totals, service and placeholder rows | every row |

With both `getRowHref` and `onRowClick`, `onRowClick` gets only plain clicks: `event.preventDefault()` there routes in the app, while ⌘/Ctrl-clicks, middle clicks and «open in new tab» stay the browser's.

### reorderHandle
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `end` | a grip (`Dnd.Handle`) ends every row, in the trailing cell under the column chooser; it sticks with `stickyLastColumn` | most tables: the kit's place for a grip (List, FieldList, Kanban), clear of the selection and the key cell | yes |
| `start` | a grip column leads every row, before the checkboxes; it sticks with `stickyFirstColumn` | a list whose order is its main point (stages, a playlist) read from the start edge | |
| `row` | no grip: the whole row is carried (the cursor says so; a finger holds still), the row itself takes Tab and Alt + ↑ / ↓; its text cannot be selected, the checkbox cell only selects | short lists of settings or priorities with nothing to select, copy or open by a link in their rows | |

### column `align`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | text at the start | text columns | yes (non-numeric) |
| `center` | centered | short symmetric values | |
| `end` | at the end | numbers, money (set by `numeric`) | yes (`numeric`) |

Heads keep `start` whatever the cell alignment, with the sort icon at the end edge; set `headerAlign` only for a deliberate exception.

### Flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `rowDividers` | hairlines between rows | default; off together with `striped` | `true` |
| `columnDividers` | hairlines between content columns (none inside the lead columns) | default; off for 2–3 column key/value lists | `true` |
| `striped` | every second row one opaque step off the fill | long numeric grids | `false` |
| `highlightRowOnHover` | `fill-subtle-active` wash on the hovered row (stronger than a zebra step, so a hovered row never takes a zebra row's color) | interactive lists | `true` |
| `highlightColumnOnHover` | `fill-subtle-active` wash on the hovered column | comparison tables | `false` |
| `stickyHeader` · `stickyFirstColumn` | opaque sticky head / first column with a hairline edge; on screens lower than 480px the head scrolls with the rows | long / wide tables in a `scrollHeight` window | `false` |
| `stickyLastColumn` | the last visible column sticks to the end edge, opaque in the row's fill (hover, zebra, selected, expanded), with a hairline on its start edge | a row actions column (⋯ menu, an icon Button) of a table wider than its container | `false` |
| `stickyGroupHeaders` | group header rows stick under the head while their rows scroll | long grouped tables in a `scrollHeight` window | `false` |
| `collapsedGroups` · `defaultCollapsedGroups` · `onCollapsedGroupsChange` | any of the three makes groups fold: a chevron toggle leads each group header, a collapsed group shows its header alone | long grouped tables where people work one group at a time; `defaultCollapsedGroups={[]}` starts with every group open | off |
| `columnsMenu` | an icon-only ghost Button (`view.columns`) in the head cell of the row-actions column (the last column, `hideHeader`), lined up with the ⋯ under it; it opens the column chooser. Without that column nothing renders and the table warns | a table with row actions and more columns than a narrow screen holds; without row actions, `DataTableColumnsMenu` in the page's tools | `false` |
| column `hideable` | `false`: the column stays even when listed in `hiddenColumns`; checked and disabled in the column chooser | the key column that names the row, the row-actions column | `true` |
| `columnOrder` · `defaultColumnOrder` · `onColumnOrderChange` | any of the three makes columns reorder: a press that moves on a header carries the header alone (a finger holds still) while the body stays, Alt + ← / → on the header, grips in the column chooser plus «Исходный порядок» | tables people arrange for themselves; `defaultColumnOrder={[]}` starts in the order of `columns` | off |
| column `reorderable` | `false`: the column holds its place — its header carries nothing, no column moves past it, the chooser shows a lock. A `hideHeader` column and a pinned first / last column hold theirs too | the key column, a total that must stay last | `true` |
| `showHeader` | head row shown | off only for self-explanatory key/value tables | `true` |
| `fullWidth` | spans the container; `false` = content width | `false` for short lookup tables in wide layouts | `true` |
| column `numeric` | tabular figures, end-aligned, no wrap | numbers, money | — |
| column `truncate` | one line with an ellipsis and a `title` | long names in narrow columns | — |
| column `description` | an info glyph after the header; its tooltip holds the text, the header cell is described by it | a header that needs a word more («Маржа», an event type) | — |
| column `scale` | each cell shaded by its value on the five-step chart scale, the value kept in the cell | a heatmap: counts by person × month, load by day | — |

`scale: true` gives each column its own range (its minimum to maximum over all rows), so the same value can take different shades in two columns. Several columns that read as one heatmap (one column per month) share a scale when each gets the same fixed `{ min, max }` — both ends, since an open end is still the column's own: `scale: { min: 0, max: 25 }` on every month column ([heatmap.tsx](examples/heatmap.tsx)).

## States
| State | Driven by | DOM |
|---|---|---|
| loading (no rows) | `loading` | skeleton rows (`data-skeleton`), `role="status"` with `labels.loading`, `aria-busy` on the table, `data-loading` on the root |
| loading more | `hasMore` with every loaded row shown calls `onLoadMore`; `loadingMore`, or its pending promise | `aria-busy`; footer `labels.loadingMore`; no new request until it settles (after a rejection, until the rows change) |
| refreshing | `loading` with rows on screen (a refetch, another server page or sort) | the rows, head, toolbar and footer stay; `aria-busy` on the table, `data-loading` on the root — no skeleton |
| new server page | `source="server"` and `rows` replaced (not appended) | the body remounts with the swap fade (`swapMotion`), the viewport scrolls to its top; no per-row enter |
| empty | no rows and not loading | compact EmptyPage with `empty` or `labels.empty` (`role="status"`), or the `empty` node; centred in the visible width, not across every column of a wide table |
| error | `loadError` | body replaced by a `role="alert"` message in `danger-text`, centred in the visible width; range and infinite status hidden |
| sorted | `sort` / `defaultSort` | `aria-sort` and `data-sorted` on the head; the sort icon: unsorted `text-disabled`, hover `text-muted`, sorted `text-secondary` — never accent |
| selected | `selectable` with `selected` / `defaultSelected` | `data-selectable` on the root, a leading checkbox column; `aria-selected` rows with `accent-soft` fill; polite `labels.selectedCount` |
| expanded | `expanded` / `defaultExpanded` | `data-expanded` on the parent row (one step darker); toggle `aria-expanded`, chevron turns 90° |
| new rows | rows new in `rows` (by `getRowKey`) | `data-animate`: top-level cells drop in from above (`enterMotion`) |
| sub-rows and detail panels | an expand / a collapse | both fold open and shut through the kit's Disclosure (`0fr ↔ 1fr`, the fade and a short slide on the same `base` clock; a detail opens on the enter curve); the row height and padding live inside the fold, so nothing is left to jump. Sub-rows: `data-fold` on the row (`open` · `closed`), every cell's content a Disclosure; a collapsed row's sub-rows stay mounted until the fold ends. Detail row: `data-state`; it unmounts after the close |
| overflowing sideways | the table is wider than its viewport | `data-overflow-start` (scrolled from the start) and `data-overflow-end` (more to the end) on the root: a soft shadow over that edge, from the end edge of the sticky first column for the start and from the start edge of the sticky last column for the end; fades in and out over `fast` |
| hidden columns | `hiddenColumns` / `defaultHiddenColumns`, `columnsMenu`, `DataTableColumnsMenu` | the listed columns (except `hideable: false`) are not rendered in the head, rows, skeleton or state rows; widths are measured again; a sort by a hidden column keeps the row order |
| opening rows | `getRowHref` / `onRowClick`, `isRowClickable` | `data-clickable` (pointer, pressed wash) on rows that open; link rows: `data-link`, an `<a data-row-link>` in every content cell; in-place rows: `tabindex="0"`. Focus (the link, or the row) rings the whole row with the hover wash |
| grouped | `getRowGroup` | one `<tbody>` per group run on screen, opened by a `<th scope="rowgroup">` row one ladder step off the table; `data-sticky` on it with `stickyGroupHeaders` |
| collapsed group | `collapsedGroups` / `defaultCollapsedGroups` | `data-collapsed` on the group header row, its toggle `aria-expanded="false"` with the chevron at rest; the group's `<tbody>` holds the header alone, its rows only lay out the column widths in the hidden measuring body. Its rows fold away and back like sub-rows (`data-fold`, `base`), whether a toggle or the owner changed the keys. «Select all» still takes the rows of collapsed groups; paging still counts them |
| reorderable | `onReorder` (not with `getRowChildren` / `renderExpanded`) | `data-reorderable` and `data-reorder-handle` (`end` · `start` · `row`) on the root; a grip ending each row in the trailing cell, a leading grip column, or the row itself (drag, a touch hold, Alt + ↑ / ↓ on the grip or the row); each run of rows (the page, or each group) is a `Dnd.Sortable` `<tbody>`, so with `getRowGroup` rows move inside their group; a row put last on a page stands in front of the first row of the next page; a lifted row leaves a dashed gap row across every column, its neighbours glide (`base`), the copy flies in a one-row table at the row's column widths and sets down on its new place; a keyboard move glides the same way |
| saving a move | `onReorder` returned a pending promise | the row stays in its new place, `aria-busy`, its cells at 60% and its grip busy (Dnd: a spinner in the disabled handle); a rejection glides it back |
| reorder off | a sort by a column | the handles are disabled with a Tooltip (`labels.reorderSorted`); no drag, no Alt + arrows (rows that are their own grip just hold still) |
| reorderable columns | `columnOrder` / `defaultColumnOrder` / `onColumnOrderChange` | the head row is a `Dnd.Sortable as="tr"`: each movable head cell is a `Dnd.SortableItem` (`dragFromControls`, so a press on the sort button picks it up too); a plain one is a tab stop (`tabindex="0"`, `aria-keyshortcuts`, the inset ring), a sortable one passes the keys from its sort button; the chooser's items are a `Dnd.Sortable` list with a grip (or a lock) at their end. A new order rebuilds the body once and the cells of the column that moved fade in (`enterMotion` `.enterFade`); a move from outside the head row (the chooser, the owner) glides the head cells (`base`), each column keeps its width by id |
| carrying a column | a header press that travelled 4 px (a finger: held 280 ms) | Dnd's gesture: a copy of the header alone flies on the lift shadow; the header stays in its column as Dnd's gap (the dashed, tinted slot of every sortable list, `data-lifted`) and glides with the other headers to where they will stand (`base`; at once under reduced motion), and the viewport scrolls near its edges. The body stays still the whole gesture. The drop lands the copy on the header's new place and rebuilds the body once (the moved column fades in); Escape glides the headers back, nothing else moved; the click that ends a drag never sorts |
| heatmap cell | column `scale` and a numeric value (`sortAccessor`, else `accessor`) | `data-scale="1"…"5"` on the cell: its base is `--prime-color-chart-scale-<n>`, text `--prime-color-chart-scale-fg` on 4–5; the range spans all rows (or the fixed `min` / `max`), so paging and sorting never change a shade; the value stays in the cell, non-numbers stay plain |
| filling the parent | `scrollHeight="fill"` | `data-scroll-height="fill"` on the root; the viewport takes the free height |
| state swap | the body moves between loading, rows, empty and error | the body fades in over `base` (opacity only, the same swap motion as [Crossfade](../crossfade/COMPONENT.md)); the head stays still; nothing moves on the first render |

Root attributes: `data-size`, `data-row-dividers`, `data-column-dividers`, `data-sticky-header`, `data-sticky-first-column`, `data-sticky-last-column`, `data-table-width` (`fill` · `auto` · `grow`), `data-highlight-row`, `data-highlight-column`, `data-striped`, `data-loading`, `data-reorderable`, `data-reorder-handle`, `data-selectable`, `data-expandable`, `data-dragging` (while drag-selecting), `data-overflow-start` · `data-overflow-end` (edges that hide columns), `data-scroll-height` (`fill`). Sorting and paging swap rows instantly; everything is still under `prefers-reduced-motion`.

## Layout & spacing
- The root is a layer of the surface ladder (`data-depth`, one above its host): it fills its container on `--prime-color-layer-current`, radius 12, and clips full-bleed head and rows; zebra rows and the sticky column are one ladder step off it, the head two. On a card or in a modal it is the next layer by itself — never wrap it in a Card.
- `toolbar` holds several controls of the table itself: bulk actions on the selected rows, or the search and filters of a table that is not the page's main region (a section of a record, a Drawer). One control never gets a bar: the column chooser is `columnsMenu` over the row actions or `DataTableColumnsMenu` in `Page.Tools`; the page's search, filters, period, view, figures and actions go to its top bar (`Page.Tools`, `Page.Actions`, `Page.Description`).
- Toolbar padding `--prime-space-3` × cell padding, items `gap: --prime-space-2`; below 30rem of table width toolbar and footer stack.
- The footer has a hairline on top: range on the left, Pagination on the right. The range shows only with more than one page or with infinite scroll.
- Columns scroll sideways inside the table, never the page; pin the identifying column with `stickyFirstColumn` and the row actions column with `stickyLastColumn` (it pins the last visible column, so hiding it pins the one before). A 320 px column holds the table without breaking it.
- While columns are hidden past an edge, that edge shows a `--prime-space-4` shadow (`--prime-color-bg-edge-shadow`) over the content; it takes no space and follows RTL. With `stickyFirstColumn` the start shadow falls from the pinned column's end edge; with `stickyLastColumn` the end shadow falls from the pinned column's start edge. With `stickyHeader` the pinned head cells hold both corners.
- Layers, bottom to top: every cell that scrolls · the pinned columns (lead cells, the first and the last column, the end grip cell) · sticky group headers · the sticky head · the corners (head cells pinned to a column edge). Each cell keeps what it holds inside its own layer, so a control in a scrolled cell — a Switch, an icon Button, a focus ring — always passes under the pinned columns and the head, whatever its own stacking. A head label truncates inside its cell and never runs under the next one.
- Fewer columns, less scrolling: offer the column chooser (the key column and the row-actions column `hideable: false`). The kit stores nothing: keep `onHiddenColumnsChange`'s list where the app keeps settings and pass it back as `hiddenColumns`. Never hide columns silently by width.
- The column chooser has one place per table. Over the row actions (`columnsMenu`): an icon-only ghost neutral Button one tier below the table (the `view.columns` icon; `labels.columns` is its name and its Tooltip) in the head cell of the row-actions column (the last visible column, `hideHeader`), lined up with the ⋯ buttons under it, sticking with that column under `stickyLastColumn`. Without row actions: `DataTableColumnsMenu` in the page's tools (`Page.Tools`, or the host's own toolbar) — a soft neutral Button with the icon, `labels.columns` and a Badge with the count of shown columns, at the host tier — bound to the same `hiddenColumns` (and `columnOrder`) state the table reads. Both open the same Dropdown: a `labels.showColumns` group heading over one check item per column (the check at the end).
- Reorderable rows: the grip is the fixed `xs` `Dnd.Handle`. At the end it takes a trailing cell (the grip plus the end padding), after the row actions; at the start a leading cell before the checkboxes (the first column's padding is the gap to it). Rows that are their own grip (`row`) add no cell.
- Reorderable columns move only between the columns that hold their place: the selection, toggle, grip and trailing cells never move, a pinned first or last column stays at its edge, a `hideHeader` (row actions) or `reorderable: false` column keeps its slot. A hidden column keeps its slot in `columnOrder` too, so showing it again puts it back where it was. Keep `columnOrder` with `hiddenColumns` where the app keeps settings. The chooser's Dropdown opens below (lined up with the trigger's end edge over the row actions), lists every column in table order and ends with `labels.showAllColumns` (and `labels.resetColumnOrder` with `columnOrder`); a `hideable: false` column stays checked and disabled, and the last visible column cannot be hidden. With `columnOrder` the items are a `Dnd.Sortable` list, a grip (or a lock) ending each item after its check mark.
- Row height per `size` is public: `--prime-table-row-height-xs` · `-s` · `-m` · `-l` · `-xl` (36 · 36 · 44 · 52 · 52). A placeholder outside the table that stands in its geometry (a heatmap, a matrix skeleton) uses the same token.
- A row that opens keeps controls out of its key cell (that cell is the link); controls in other cells stand above the row's link. Mark a custom widget with `data-row-click-ignore`.
- Group headers: the name at the start, totals at the end (`renderGroupHeader` returns both, the kit lays them out across the visible width), head-tier text in `text-secondary`, row height = the head height. With collapsible groups the chevron toggle (the expand toggle's ghost Button) leads the header at the cell padding.
- The empty and error content stands in a sticky box of the visible width: a wide table centres it in the viewport, and it stays there while the table scrolls sideways.
- A trend per row: a compact [Sparkline](../sparkline/COMPONENT.md) (`layout="compact"`) in a cell fits the row height; its pointer and keys never open the row.
- Long data needs no slicing: past 100 rows a body in a bounded viewport (`scrollHeight`, `"fill"`, `paging="infinite"`) renders only the rows around the view; spacer rows keep the scrollbar exact, the focused row stays rendered, rows carry `aria-rowindex` and the table `aria-rowcount`. Grouped (`getRowGroup`), reorderable (`onReorder`) and `renderExpanded` bodies, and a table the page scrolls, render every row. The browser's find-in-page sees only rendered rows: give a long table a search (the page's `SmartFilter`).
- `scrollHeight="fill"` needs a parent with a height: a flex or grid column with `min-height: 0`, `Page.Root fill` in an `AppShell.Root fillViewport`, or a sized pane.
- The sticky head stops sticking on screens lower than 480px (landscape phones), so it never takes a large share of the height.
- Cell content: text, two-line text (title + `caption`), an Avatar with text, a Badge, or a control one tier down (`s` in an `m` table). Toolbar controls and the column chooser in the head use `s` in an `m` table.
- Column widths: `width` / `minWidth` / `maxWidth` strings; never size cells with custom CSS.
- Sub-rows indent by `--dt-indent` per level (avatar of the tier + gap); override it on the root for other leading content.

## Accessibility

### Keyboard
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Action |
|---|---|
| `Tab` | Moves through the toolbar, sort buttons, plain headers that move their column (`columnOrder`), the column chooser (`columnsMenu`, `DataTableColumnsMenu`), row handles, checkboxes, expand toggles, row links, rows that open in place or move themselves (`reorderHandle="row"`) and Pagination. |
| `Enter` · `Space` | Sorts by the column, toggles the row or the group, or opens the focused row (`onRowClick`); Enter on a row link follows it. |
| `Space` | Toggles the focused row checkbox. |
| `Shift + Space` | Selects the range from the last toggled row. |
| `Alt + ↑` · `Alt + ↓` | On a row handle, or on the row itself with `reorderHandle="row"` (`onReorder`), moves the row one place up or down; on an item of the column chooser (`columnOrder`), moves that column one place. |
| `Alt + ←` · `Alt + →` | On a header (its sort button, or the plain header) with `columnOrder`, moves the column one place back or on; focus stays on it. A column that holds its place does not move and no column steps over it. The direction follows the writing direction (`dir="rtl"`: ← goes on). |
| `Escape` | Cancels a row drag or a header drag; the row or the headers glide back, the body never moved. |

### ARIA
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

- Native `<table>` semantics; head cells are `scope="col"` (the head cells of the grip columns are `<td>`); sortable heads hold a `<button>` and expose `aria-sort`; the whole head cell shows the inset focus ring.
- With `columnOrder` the head row is a `Dnd.Sortable`: a header that moves its column carries `aria-keyshortcuts` on its focus target (the sort button; a plain header is a tab stop of its own with Dnd's role description); a pick-up, a drop and a keyboard move are announced by Dnd («Сумма: позиция 3 из 7»). In the column chooser each item keeps `menuitemcheckbox` with `aria-keyshortcuts`, its grip (`labels.reorderColumn`) is out of the Tab order, a column that holds its place shows a lock named «Закреплено».
- A link row has one link for assistive tech: the `<a>` in the key cell, named by its text. Its copies over the other cells are `aria-hidden` and `tabindex="-1"`, so the pointer can use the whole row. An in-place row is focusable itself (`tabindex="0"`) and reads as its cells. Either way the focused row shows a ring around all its cells.
- A row never opens from a control inside it (links, buttons, fields, `label`, `summary`, ARIA widgets, `data-row-click-ignore`), from a text selection, or from a React event that bubbled out of a portal (a ⋯ menu item).
- A group header is a `<th scope="rowgroup">` across every column, first in its own `<tbody>`.
- The column chooser is a menu button: the icon one (`columnsMenu`) named by `labels.columns` (its tooltip says the same), `DataTableColumnsMenu` by its text and count. Its items are a group named `labels.showColumns` of `menuitemcheckbox` with `aria-checked`; the key column is `aria-disabled`. In the row-actions head cell the column keeps its own name (`aria-labelledby`).
- Row checkboxes are named by `labels.selectRow` with `{label}` from `getRowLabel` (pass it so the names are unique); the head checkbox by `labels.selectAll`, `indeterminate` on a partial selection.
- After a selection change a polite live region announces `labels.selectedCount`; selected rows carry `aria-selected`.
- A row handle is a button named by `labels.reorderRow` with `aria-keyshortcuts`; with `reorderHandle="row"` the row itself is the tab stop with `aria-keyshortcuts` and a role description, and reads as its cells. A pick-up, a drop and a keyboard move are announced in a polite live region («Договор: позиция 2 из 6»). While its move is saved the row is `aria-busy`; while the table is sorted the handles are disabled and a tooltip gives `labels.reorderSorted` (rows that are their own grip just stop moving).
- The expand toggle is a button with `aria-expanded`, `aria-controls` (detail row or sub-rows) and `labels.expand` / `labels.collapse`.
- A group toggle (collapsible groups) is a button in the group header with `aria-expanded`, `aria-controls` (the group's rows, while open; not on reorderable rows, which carry no id) and `labels.expandGroup` / `labels.collapseGroup` with `{group}`.
- A column `description` describes its header cell (`aria-describedby`); its tooltip opens from the sort button, or from the info glyph (a tab stop named `labels.columnInfo`) on a plain header.
- Loading sets `aria-busy` and a `labels.loading` status; the error is `role="alert"`; the default empty state is `role="status"`.

### Labels
<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

| Key | Default | Used for |
|---|---|---|
| `loading` | `"Загрузка данных…"` | Screen-reader status while skeleton rows are shown. |
| `empty` | `"Нет данных для отображения."` | Default empty-state text. |
| `range` | `"Показано {from}–{to} из {total}"` | Footer range line; `{from}`, `{to}`, `{total}` are replaced. |
| `loadingMore` | `"Догружаем строки…"` | Footer status while `loadingMore`. |
| `scrollForMore` | `"Прокрутите вниз для загрузки"` | Footer hint when more rows can appear by scrolling. |
| `selectAll` | `"Выбрать все строки"` | Name of the head «select all» checkbox. |
| `selectRow` | `"Выбрать строку {label}"` | Name of a row checkbox; `{label}` is `getRowLabel(row)`, empty without it. |
| `selectedCount` | `"Выбрано: {count}"` | Polite announcement after the selection changes. |
| `expand` | `"Развернуть строку {label}"` | Name of the toggle of a collapsed row. |
| `collapse` | `"Свернуть строку {label}"` | Name of the toggle of an expanded row. |
| `columns` | `"Колонки"` | Name and tooltip of the icon trigger (`columnsMenu`), the text of `DataTableColumnsMenu`; `{shown}` and `{total}` are column counts. |
| `showColumns` | `"Показывать"` | The heading of the chooser's list of columns. |
| `showAllColumns` | `"Показать все"` | The column chooser item that shows every column again. |
| `resetColumnOrder` | `"Исходный порядок"` | The column chooser item that puts the order of `columns` back (`columnOrder`). |
| `reorderColumn` | `"Переместить колонку {label}"` | Name of a column's grip in the column chooser (`columnOrder`); `{label}` is its header. |
| `reorderRow` | `"Переместить строку {label}"` | `aria-label` of a row's drag handle (`onReorder`); `{label}` is `getRowLabel(row)`. |
| `reorderSorted` | `"Порядок задан сортировкой. Сбросьте её, чтобы перемещать строки"` | Tooltip of the disabled handles while the table is sorted by a column. |
| `expandGroup` | `"Развернуть группу {group}"` | Name of the toggle of a collapsed group; `{group}` is the group key. |
| `collapseGroup` | `"Свернуть группу {group}"` | Name of the toggle of an expanded group; `{group}` is the group key. |
| `columnInfo` | `"Пояснение"` | Name of the info glyph of a column with a `description`; the tooltip holds the text. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Recent orders: sortable columns, a status Badge, numeric sums and five rows per page — `columns`, `getRowKey`, `pageSize`. |
| [sizes.tsx](examples/sizes.tsx) | Every density: rows from 36 to 52 px, the head at the control height of the tier — `size`. |
| [numeric.tsx](examples/numeric.tsx) | An inventory report: number columns align to the end in tabular figures, a long name stays on one line with a title, formatted cells sort by their raw number article numbers in natural order and a header that needs a word more explains itself in a tooltip — `numeric`, `truncate`, `maxWidth`, `sortAccessor`, `sortComparator`, `description`. |
| [heatmap.tsx](examples/heatmap.tsx) | Deals closed per manager and month as a heatmap: each count shades its cell on the chart scale and stays readable in it — `scale`, `numeric`. |
| [trend.tsx](examples/trend.tsx) | Clients with revenue by month as a compact Sparkline in a cell of each row, next to the half-year total — `cell`, `width`. |
| [content-width.tsx](examples/content-width.tsx) | A short lookup table sized by its content with a centered column, and a `grow` column that takes the free width and wraps — `fullWidth`, `align`, `grow`. |
| [appearance.tsx](examples/appearance.tsx) | Row styling: zebra rows without lines, a column wash under the pointer, a headless key/value list — `striped`, `rowDividers`, `highlightColumnOnHover`, `columnDividers`, `showHeader`. |
| [toolbar.tsx](examples/toolbar.tsx) | A campaign table with its own search and status filter above it — two table-scoped controls; the empty text when nothing matches — `toolbar`, `empty`. |
| [selection.tsx](examples/selection.tsx) | Team members with checkboxes: Shift+click range, press-and-drag, «select all» and bulk actions in the toolbar — `selectable`, `selected`, `onSelectedChange`, `getRowLabel`. |
| [nested-rows.tsx](examples/nested-rows.tsx) | Partners with their expense lines: sub-rows indented under the parent's name, a chevron toggle, together with selection and sorting — `getRowChildren`, `expanded`, `onExpandedChange`. |
| [detail-panel.tsx](examples/detail-panel.tsx) | Order details in a full-width row under an expanded order, aligned with the first content column; a cancelled order has nothing to show and gets no toggle — `renderExpanded`, `defaultExpanded`, `isRowExpandable`. |
| [sticky.tsx](examples/sticky.tsx) | Monthly sales by region in a 280 px window: the head and the region column stay while scrolling both ways — `stickyHeader`, `stickyFirstColumn`, `scrollHeight`. |
| [actions-column.tsx](examples/actions-column.tsx) | Orders wider than the table: the order number stays at the start, the ⋯ row actions at the end with the column chooser in their header cell, and the columns between scroll sideways — `stickyFirstColumn`, `stickyLastColumn`, `columnsMenu`. |
| [row-link.tsx](examples/row-link.tsx) | Invoices whose rows are links: ⌘-click or a middle click opens a new tab, a plain click routes inside the app, the totals row and the ⋯ menu never open a row — `getRowHref`, `onRowClick`, `isRowClickable`. |
| [row-open.tsx](examples/row-open.tsx) | Deals that open in a side panel: a click, or Enter and Space on the focused row; the panel keeps the last deal while it slides away — `onRowClick`. |
| [reorder.tsx](examples/reorder.tsx) | Pipeline stages put in order by a grip at the end of the row, at its start or by the whole row, or with Alt + ↑ / ↓; each move is saved with a spinner in its grip, and sorting by a column turns reordering off — `onReorder`, `reorderHandle`, `getRowLabel`. |
| [groups.tsx](examples/groups.tsx) | Payments grouped by month with the month's total in its header row; headers stay on top while their rows scroll, a past month folds away — `getRowGroup`, `renderGroupHeader`, `stickyGroupHeaders`, `defaultCollapsedGroups`. |
| [columns-visibility.tsx](examples/columns-visibility.tsx) | Orders without a row-actions column: the column chooser stands in the tools above the table with the count of shown columns; the choice outlives a reload in local storage, the order number always stays — `DataTableColumnsMenu`, `hiddenColumns`, `onHiddenColumnsChange`, `hideable`. |
| [column-order.tsx](examples/column-order.tsx) | Orders whose columns a manager puts in place by dragging a header — it moves alone and the gap opens among the headers where it lands — or with Alt + ← / →, and shows, hides and reorders in the chooser over the row menu; the order number stays first and the row menu last, and the choice outlives a reload — `columnOrder`, `onColumnOrderChange`, `reorderable`, `columnsMenu`, `hiddenColumns`. |
| [infinite-scroll.tsx](examples/infinite-scroll.tsx) | An audit log that reveals loaded rows in batches and then asks the server for more — `paging`, `infiniteBatchSize`, `hasMore`, `loadingMore`, `onLoadMore`. |
| [server.tsx](examples/server.tsx) | A CRM deal list the server sorts, pages and searches; a new search returns to page 1 — `source`, `rowCount`, `sort`, `page`, `loading`. |
| [fill-height.tsx](examples/fill-height.tsx) | An audit log that fills the height of its panel and loads older entries while scrolling; the status shows while the request is pending — `scrollHeight`, `paging`, `onLoadMore`. |
| [states.tsx](examples/states.tsx) | Loading skeleton, an empty period and a load error with a retry: the head stays, only the body changes — `loading`, `loadingRows`, `empty`, `loadError`. |
| [controlled.tsx](examples/controlled.tsx) | Sort, page and the column choice owned by the parent (a URL or a store): a header click goes asc → desc → none, a new sort returns to page 1 — `sort`, `onSortChange`, `page`, `onPageChange`, `hiddenColumns`, `onHiddenColumnsChange`. |
| [narrow.tsx](examples/narrow.tsx) | A 320 px support queue: columns scroll inside the table with the first one pinned, the column chooser stays in reach above it, the footer reflows and the pager turns compact — `stickyFirstColumn`, `DataTableColumnsMenu`, `size`. |
| [screen.tsx](examples/screen.tsx) | A list page: the title, a line of figures, search, filters and the one primary action in its top bar, a DataTable of invoices with statuses, row actions, pages and a filtered empty state — `empty`, `pageSize`, `stickyFirstColumn`. |

## Mistakes
- No `getRowKey` with `selectable`, expansion or sorting → selection follows positions, not records.
- Numbers in a plain column → set `numeric` (alignment and tabular figures).
- An explanation squeezed into the header text, or a hand-made icon with a Tooltip inside `header` → `description`.
- A custom «Ничего не найдено» row inside `rows` → use `empty`.
- A spinner instead of rows → use `loading` (the skeleton keeps the head and the layout).
- Wrapping the table in a Card for a border → the table is already a bounded block.
- A custom checkbox column → use `selectable` (range, drag and announcements built in).
- Up / down arrow buttons in a cell to order rows → use `onReorder` (drag, touch hold, Alt + arrows, announcements, server save built in).
- A grip column added by hand, or the grip moved with CSS → `reorderHandle` (`end` by default, `start`, or `row`).
- `reorderHandle="row"` on link rows (`getRowHref`) or rows with text to copy → the link takes every press and the text cannot be selected; keep a grip (`end`).
- Up / down arrows or a «Порядок колонок» dialog to reorder columns, or a hand-made header drag → `columnOrder` (header drag, Alt + ← / →, chooser grips, announcements built in); keep it with `hiddenColumns` in the user's settings.
- Moving body cells while a header is carried, or a drag that carries the whole column → the head row alone moves; the body takes the order once, on the drop.
- Removing a column from `columns` to «delete» it for a user → hide it (`hiddenColumns`); its data and its place in `columnOrder` stay.
- Applying the new order before the server answers and undoing it by hand → return the request's promise from `onReorder` and apply after it resolves: the table keeps the row in place meanwhile and moves it back on a rejection.
- A long table in a `scrollHeight` window without `stickyHeader` → the head scrolls away.
- `paging="none"` for hundreds of rows → use `pages` or `infinite`.
- Dropping columns below a breakpoint → people lose data without knowing it; offer the column chooser.
- A hand-built column chooser from Dropdown items → `columnsMenu` over the row actions, else `DataTableColumnsMenu` (key column, last visible column, «Показать все», reorder built in).
- `columnsMenu` on a table without a row-actions column → nothing renders and the table warns; put `DataTableColumnsMenu` in `Page.Tools`, bound to the same `hiddenColumns`.
- A toolbar with one button (the column chooser, «Экспорт», «Создать») → a whole bar above the table for one control; the chooser stands over the row actions or in `Page.Tools`, the page's actions go to `Page.Actions`.
- The page's search, filters, period, view or figures in `toolbar` → they belong to the page's top bar (`Page.Tools`, `Page.Actions`, `Page.Description`); `toolbar` keeps several controls of the table itself (bulk actions, the search and filters of a table in a section or a Drawer).
- Letting the key column be hidden → set `hideable: false` on it, so every row keeps its name.
- Wrapping the table in an `overflow-x` box of your own → it already scrolls inside and shows the edge shadows.
- A row actions column that scrolls out of view in a wide table, or a hand-made `position: sticky` on it → make it the last column and set `stickyLastColumn`.
- `onRowClick` with `navigate()` for a record page → use `getRowHref` (⌘-click, new tab, status-bar URL) and route the plain click in `onRowClick` with `event.preventDefault()`.
- Checking `event.target` in `onRowClick` to skip a button or a menu in the row → the table already ignores controls and portals; mark a custom widget with `data-row-click-ignore`.
- A totals row that opens like a record → `isRowClickable`.
- Group headers faked with sub-rows or a row in `rows` → use `getRowGroup` + `renderGroupHeader`.
- A fold button of your own in `renderGroupHeader`, or filtering a group's rows out of `rows` to hide them → pass `defaultCollapsedGroups={[]}` (or the controlled pair): the toggle, its names, the fold motion and «select all» are built in.
- Columns of one heatmap with `scale: true` each → the same value gets another shade per column; give every column the same `{ min, max }`.
- Computing the table height from the window → `scrollHeight="fill"` in a parent with a height.
- Showing your own spinner while `onLoadMore` runs → return its promise; the table shows the status.
- A server page passed with the default `source` → the table re-sorts it and counts pages from that one page; set `source="server"` and `rowCount`.
- Clearing `rows` while the next server page loads → the body flashes to a skeleton; keep the old rows and set `loading`.
- A new search that keeps the current page → set `page` to 1 together with the search.

## Related
- **Built from:** [Checkbox](../checkbox/COMPONENT.md), [Button](../button/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md) (the column chooser), [Pagination](../pagination/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [VisuallyHidden](../visually-hidden/COMPONENT.md) (loading status, selection announcement), [Skeleton](../skeleton/COMPONENT.md) (loading rows, in the table tier), [Dnd](../dnd/COMPONENT.md) (`onReorder`: `Dnd.Sortable as="tbody"`, `Dnd.Handle`; `columnOrder`: the head row as a `Dnd.Sortable as="tr"`, the chooser's `Dnd.Sortable` list, `Dnd.Handle`, the lock), [Badge](../badge/COMPONENT.md) (the count on `DataTableColumnsMenu`), [Tooltip](../tooltip/COMPONENT.md) (handle hint, a column `description`, the column chooser), Icon (sort arrows, the info glyph of a column `description`, the expand chevron, the column chooser trigger); `useVirtualRows` (the window of a long body); `useFlipList` (the head cells glide to an order set from outside the head row); `enterMotion` (the moved column fades in)
- **See also:** [Sparkline](../sparkline/COMPONENT.md) (`layout="compact"` in a cell), [SmartFilter](../smart-filter/COMPONENT.md), [Page](../../layout/page/COMPONENT.md) (`Page.Tools`, `Page.Chips`), [Gantt](../gantt/COMPONENT.md), [Kanban](../kanban/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [Card](../card/COMPONENT.md)
