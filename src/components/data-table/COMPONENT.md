# DataTable

**Category:** data-display
**Kind:** composite

> A data table with sorting, pages or infinite scroll, row selection, row groups, rows that open a record, a column chooser, nested rows and loading / empty / error states.

## When to use
- Lists of records with several attributes to compare: orders, invoices, users, campaigns.
- Data that needs sorting, paging, bulk selection or a filter toolbar.
- Thousands of records the server sorts and pages (`source="server"` + `rowCount`): the table shows the one page the server returned.
- Rows that open a record: a page (`getRowHref`, a real link) or a drawer in place (`onRowClick`).
- Rows grouped by a key with a header and totals per group (`getRowGroup`).
- Records whose order is data the user sets: pipeline stages, a price list, priorities (`onReorder`).
- Hierarchical rows (`getRowChildren`) or rows with a detail panel (`renderExpanded`).
- Wide numeric reports with a sticky head and first column.
- Wide records on narrow screens: let people choose the columns (`DataTable.ColumnsMenu`) instead of dropping them.
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
import { DataTable, type DataTableColumn } from "prime-ui-kit";
```
Exported types: `DataTableColumn<Row>`, `DataTableProps<Row>`, `DataTableSortState`, `DataTableOrder`, `DataTableGroup<Row>`, `DataTableRowClickEvent`, `DataTableColumnsMenuProps`, `DataTableLabels`.

## Anatomy
```
DataTable                           card-fill block, radius 12, clips its content
├── toolbar                         optional panel above the table (search, filters, bulk actions)
│   └── DataTable.ColumnsMenu       the column chooser: a Button and a Dropdown of check items
├── scroll viewport                 ScrollContainer, both axes, in a frame that holds the edge shadows
│   └── table
│       ├── thead                   [handle] [select all] [toggle] head cells; sortable heads hold a button
│       └── tbody                   rows · sub-rows · detail rows · skeleton / empty / error row
│           (one per group)         with getRowGroup: a <th scope="rowgroup"> header row, then its rows
│                                   with onReorder: a Dnd.Sortable tbody, each row led by a Dnd.Handle
└── footer                          range «Показано 1–5 из 23» · Pagination · infinite-scroll status
```
Columns are data (`DataTableColumn<Row>[]`), not child parts. The one part, `DataTable.ColumnsMenu`, goes into `toolbar` and reads the table it sits in.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### DataTable
Generic over `Row`; `ref` → `HTMLDivElement`. A card-fill block with an optional toolbar, a scrolling `<table>` and a footer (range, Pagination, infinite-scroll status); passes its tier to the controls inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn<Row>[]` | — (required) | Column definitions, see `DataTableColumn<Row>`. |
| `hiddenColumns` | `string[]` | — | Ids of columns that are not rendered (head, body, skeleton and state rows), controlled; widths are measured again. A column with `hideable: false` stays; sorting by a hidden column keeps the row order. `DataTable.ColumnsMenu` in `toolbar` changes it. |
| `defaultHiddenColumns` | `string[]` | `[]` | Initially hidden column ids, uncontrolled. |
| `onHiddenColumnsChange` | `(hiddenColumns: string[]) => void` | — | The hidden ids changed (`DataTable.ColumnsMenu`). The kit stores nothing: keep the list (local storage, the user's settings) and pass it back to restore the choice. |
| `rows` | `Row[]` | — (required) | Data; sorted in memory when a sort is set. With `source="server"` — the page (or the loaded batches) as the server returned it. |
| `source` | `"client" \| "server"` | `"client"` | Who sorts and pages the rows. `client` — the table sorts `rows` and slices pages itself. `server` — the owner fetches one page, already sorted: the table never re-sorts or slices `rows`; `sort` / `page` changes are the request, `rowCount` drives Pagination and the range; a page or sort change keeps the rows on screen with `aria-busy` while `loading`, and the new page cross-fades in. Control `page` and set it to 1 when the search or filters change. «Select all» covers the rows on screen; ids from other pages stay in `selected`. |
| `rowCount` | `number` | `rows.length` | Total rows on the server (`source="server"`): the page count and «Показано {from}–{to} из {total}». |
| `getRowKey` | `(row: Row, index: number) => Key` | — | Stable row id (position by default); selection, expansion and the enter animation of new rows are keyed by it. Pass it whenever sorting, selection or expansion is used. |
| `getRowLabel` | `(row: Row) => string` | — | Human row name for the checkbox and toggle names (`{label}` in `labels`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Density and control tier: rows from 36 · 36 · 44 · 52 · 52 px (`--prime-table-row-height-<size>`); passed to checkboxes, toggles, Pagination and nested controls. |
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
| `error` | `ReactNode` | — | Load error: replaces the body with the message in `role="alert"`. |
| `toolbar` | `ReactNode` | — | Panel above the table (search, filters, bulk actions); stacks below 30rem of table width. |
| `selectable` | `boolean` | `false` | Leading checkbox column with «select all», Shift range, press-and-drag and Space. |
| `selected` | `Key[]` | — | Selected row ids, controlled. |
| `defaultSelected` | `Key[]` | `[]` | Initially selected ids, uncontrolled. |
| `onSelectedChange` | `(selected: Key[]) => void` | — | Selection change. |
| `onReorder` | `(id: Key, beforeId: Key \| null) => void \| Promise<void>` | — | Rows reorder: a leading handle column (drag by the handle, a touch hold, Alt + ↑ / ↓ on it). The row `id` is placed in front of `beforeId` (`getRowKey` values, `null` = last); on a page, a row put last stands in front of the first row of the next page. Apply it with `moveBefore`. Return a promise to save on a server: the row stays in its new place with a spinner in its handle cell and `aria-busy`, a rejection glides it back. Off while the table is sorted by a column (the handles are disabled, a tooltip says why); with `getRowGroup` rows move inside their group; not combined with `getRowChildren` / `renderExpanded`. |
| `getRowChildren` | `(row: Row) => Row[] \| undefined` | — | Sub-rows rendered under the parent with the same columns, indented by depth. |
| `renderExpanded` | `(row: Row) => ReactNode` | — | Full-width detail row under an expanded row. |
| `isRowExpandable` | `(row: Row) => boolean` | — | Which rows get an expand toggle; by default rows with sub-rows, or every row with `renderExpanded`. |
| `expanded` | `Key[]` | — | Expanded row ids, controlled. |
| `defaultExpanded` | `Key[]` | `[]` | Initially expanded ids, uncontrolled. |
| `onExpandedChange` | `(expanded: Key[]) => void` | — | Expansion change. |
| `infiniteBatchSize` | `number` | `20` | Rows revealed per scroll step. |
| `hasMore` | `boolean` | `false` | More rows can be loaded from the server. |
| `loadingMore` | `boolean` | `false` | A server batch is loading: footer status, `aria-busy`. |
| `onLoadMore` | `() => void \| Promise<void>` | — | Called at the end when every loaded row is shown and `hasMore` is set. A returned promise shows the loading status until it settles; after a rejection the table stops asking until the rows change (show the error yourself). |
| `scrollHeight` | `number \| string \| "fill"` | `360 with paging="infinite"` | Max height of the scroll viewport (number = px); `"fill"` — the table takes the height of its flex / grid parent (or a sized block), the rows scroll inside, infinite paging follows it. |
| `stickyHeader` | `boolean` | `false` | The head sticks while the body scrolls (with `scrollHeight`); on screens lower than 480px it scrolls with the rows. |
| `stickyFirstColumn` | `boolean` | `false` | The first visible column (with the selection and toggle columns) sticks while scrolling sideways; the start edge shadow falls from its end edge. |
| `showHeader` | `boolean` | `true` | Render `<thead>`. |
| `fullWidth` | `boolean` | `true` | The table spans its container; `false` sizes it by its content. |
| `rowDividers` | `boolean` | `true` | Hairlines between rows. |
| `columnDividers` | `boolean` | `true` | Hairlines between content columns. |
| `striped` | `boolean` | `false` | Every second row one opaque step off the table fill. |
| `highlightRowOnHover` | `boolean` | `true` | Row wash on hover (and a pressed wash on clickable rows). |
| `highlightColumnOnHover` | `boolean` | `false` | Column wash under the pointer (head and cells). |
| `getRowHref` | `(row: Row) => string` | — | The row is a link: the key cell (first visible column) holds a real `<a>`, and the same link, hidden from assistive tech and Tab, covers every other cell — a click, ⌘/Ctrl-click, a middle click and «open in new tab» work anywhere on the row. Tab stops on the link; the focused row is ringed. Keep controls out of the key cell. |
| `onRowClick` | `(row: Row, index: number, event: DataTableRowClickEvent) => void` | — | Opens a row in place (a drawer, a panel): the row takes focus and opens on a click, Enter or Space. Never from a control inside the row (links, buttons, fields, labels, ARIA widgets, `data-row-click-ignore`) or from a portal (a ⋯ menu item). With `getRowHref` it gets only plain clicks: `event.preventDefault()` there routes in the app; modified clicks stay the browser's. |
| `isRowClickable` | `(row: Row) => boolean` | `every row` | Which rows open (`getRowHref` and `onRowClick` alike); `false` for a total or a service row — no link, no focus, no cursor. |
| `getRowGroup` | `(row: Row) => string \| number` | — | Group key of a row: each group gets a header row and its own `<tbody>`. Groups keep the order in which they first appear in `rows`; a sort orders the rows inside each group; a group split by paging repeats its header. |
| `renderGroupHeader` | `(group: DataTableGroup<Row>) => ReactNode` | `the group key` | Content of a group header; `group.rows` holds every row of the group (all pages) for totals. Children are laid out start / end in the visible width. |
| `stickyGroupHeaders` | `boolean` | `false` | Group headers stick under the head (or the top edge) while their rows scroll. |
| `labels` | `Partial<DataTableLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the root `<div>`. |

### DataTable.ColumnsMenu
`ref` → `HTMLButtonElement` (the trigger). The column chooser of the table it sits in — place it into `toolbar`: an outline neutral Button one tier below the table (`view.columns` icon, `labels.columns`) opening a Dropdown with a check item per column and `labels.showAllColumns`. Writes the table's hidden columns; a `hideable: false` column stays checked and disabled, and the last visible column cannot be hidden. Throws outside a DataTable toolbar.

| Prop | Type | Default | Description |
|---|---|---|---|
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Side of the trigger the menu opens on. |
| `align` | `"auto" \| "start" \| "center" \| "end"` | `"auto"` | Alignment to the trigger. `auto` (default) lines the panel up with the trigger edge that has more room beyond it: a trigger near the end of the screen lines up its end edge and the panel grows toward the start, and the other way near the start; `start`, `center` or `end` fix it (still flipping at the screen edge). |
| `…rest` | `Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" \| "children">` | — | `className`, `aria-label` and the other attributes of the trigger button. |

### DataTableColumn<Row>
One column of `columns`: data, not a part.

| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | Unique column id (sort state, `data-column-id`). |
| `header` | `ReactNode` | — (required) | Head content. |
| `accessor` | `keyof Row \| ((row: Row) => unknown)` | — | Cell value (rendered as text, `—` for empty) and the default sort value. |
| `cell` | `(row: Row) => ReactNode` | — | Custom cell content. |
| `sortable` | `boolean` | — | The head becomes a sort button with `aria-sort`. |
| `sortAccessor` | `(row: Row) => unknown` | — | Value to sort by instead of `accessor`. |
| `sortComparator` | `(a: Row, b: Row, order: DataTableOrder) => number` | — | Custom comparison. |
| `align` | `"start" \| "center" \| "end"` | `"start" ("end" with numeric)` | Cell alignment; heads do not follow it. |
| `headerAlign` | `"start" \| "center" \| "end"` | `"start"` | Head alignment; the sort icon stays at the end edge. |
| `numeric` | `boolean` | — | Tabular figures, no wrapping, end alignment unless `align` is set. |
| `truncate` | `boolean` | — | One line with an ellipsis; width from `maxWidth` (or `width`); string values get a `title`. |
| `grow` | `boolean` | — | Takes the free width and wraps its text; the table then fills its container. With `minWidth` it never gets narrower: below that the table scrolls instead of cells overlapping. |
| `hideable` | `boolean` | `true` | The column can be hidden through `hiddenColumns` and `DataTable.ColumnsMenu`; `false` for the key column that names the row. |
| `scale` | `boolean \| { min?: number; max?: number }` | — | Heatmap: each cell is shaded by its numeric value (`sortAccessor`, else `accessor`) on the five-step chart scale (`--prime-color-chart-scale-1…5`, text `--prime-color-chart-scale-fg` on steps 4–5); `data-scale` on the cell. `true` spans the column's minimum to maximum over all rows; `{ min, max }` fixes either end. The value stays in the cell; non-numbers stay plain. |
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

Row height is a minimum: cells pad vertically by (row height − control one tier down) / 2, so one text line or a control one tier down keeps the tier height and taller content grows the row. Checkboxes use the table tier; expand toggles are square ghost Buttons one tier down (`xs` for xs–m, `s` for l–xl).

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
replaces `rows` with the first batch — the table starts over from the top. Selection is a set of ids:
ids from other pages stay in `selected`, «select all» and its indeterminate state speak for the rows
on screen.

### scrollHeight
| Value | Looks like | Use when | Default |
|---|---|---|---|
| a number / a CSS length | the viewport grows with the rows up to that height, then scrolls | a table inside a card or a dashboard block | 360 with `paging="infinite"`, else none |
| `"fill"` | the table takes the height of its flex / grid parent (or a sized block); toolbar and footer keep theirs, the rows scroll | a log or a register that takes the rest of the page (`PageContent.Root fill`), a pane | |

### Opening a row
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `getRowHref` | the key cell's text is a link; the same link covers the row (pointer, status-bar URL, ⌘-click, middle click, context menu) | the record has its own page; add `onRowClick` to route plain clicks in the app | |
| `onRowClick` | the row takes focus and opens on a click, Enter or Space | the record opens in place: a Drawer, a side panel | |
| `isRowClickable` | `false`: the row neither links nor opens | totals, service and placeholder rows | every row |

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
| `stickyGroupHeaders` | group header rows stick under the head while their rows scroll | long grouped tables in a `scrollHeight` window | `false` |
| column `hideable` | `false`: the column stays even when listed in `hiddenColumns`; checked and disabled in `DataTable.ColumnsMenu` | the key column that names the row | `true` |
| `showHeader` | head row shown | off only for self-explanatory key/value tables | `true` |
| `fullWidth` | spans the container; `false` = content width | `false` for short lookup tables in wide layouts | `true` |
| column `numeric` | tabular figures, end-aligned, no wrap | numbers, money | — |
| column `truncate` | one line with an ellipsis and a `title` | long names in narrow columns | — |
| column `scale` | each cell shaded by its value on the five-step chart scale, the value kept in the cell | a heatmap: counts by person × month, load by day | — |

## States
| State | Driven by | DOM |
|---|---|---|
| loading (no rows) | `loading` | skeleton rows (`data-skeleton`), `role="status"` with `labels.loading`, `aria-busy` on the table, `data-loading` on the root |
| loading more | `loading` with rows, `loadingMore`, or a pending promise from `onLoadMore` | `aria-busy`; footer `labels.loadingMore`; no new request until it settles (after a rejection, until the rows change) |
| refreshing | `loading` with rows on screen (a refetch, another server page or sort) | the rows, head, toolbar and footer stay; `aria-busy` on the table, `data-loading` on the root — no skeleton |
| new server page | `source="server"` and `rows` replaced (not appended) | the body remounts with the swap fade (`swapMotion`), the viewport scrolls to its top; no per-row enter |
| empty | no rows and not loading | compact EmptyPage with `empty` or `labels.empty` (`role="status"`), or the `empty` node |
| error | `error` | body replaced by a `role="alert"` message in `danger-text`; range and infinite status hidden |
| sorted | `sort` / `defaultSort` | `aria-sort` and `data-sorted` on the head; the sort icon: unsorted `text-disabled`, hover `text-muted`, sorted `text-secondary` — never accent |
| selected | `selected` / `defaultSelected` | `aria-selected` rows with `accent-soft` fill; polite `labels.selectedCount` |
| expanded | `expanded` / `defaultExpanded` | `data-expanded` on the parent row (one step darker); toggle `aria-expanded`, chevron turns 90° |
| new rows | rows new in `rows` (by `getRowKey`) | `data-animate`: top-level cells drop in from above (`enterMotion`) |
| sub-rows and detail panels | an expand / a collapse | both fold open and shut through `grid-template-rows` (0fr ↔ 1fr) with the fade on the same `base` curve; the row height and padding live inside the track, so nothing is left to jump. Sub-rows: `data-fold` on the row (`opening` · `open` · `closed`); a collapsed row's sub-rows stay mounted until the fold ends. Detail row: `data-state`; it unmounts after the close |
| overflowing sideways | the table is wider than its viewport | `data-overflow-start` (scrolled from the start) and `data-overflow-end` (more to the end) on the root: a soft shadow over that edge, from the end edge of the sticky first column for the start; fades in and out over `fast` |
| hidden columns | `hiddenColumns` / `defaultHiddenColumns`, `DataTable.ColumnsMenu` | the listed columns (except `hideable: false`) are not rendered in the head, rows, skeleton or state rows; widths are measured again |
| opening rows | `getRowHref` / `onRowClick`, `isRowClickable` | `data-clickable` (pointer, pressed wash) on rows that open; link rows: `data-link`, an `<a data-row-link>` in every content cell; in-place rows: `tabindex="0"`. Focus (the link, or the row) rings the whole row with the hover wash |
| grouped | `getRowGroup` | one `<tbody>` per group run on screen, opened by a `<th scope="rowgroup">` row one ladder step off the table; `data-sticky` on it with `stickyGroupHeaders` |
| reorderable | `onReorder` (no expandable rows) | `data-reorderable` on the root; a leading handle column; each run of rows (the page, or each group) is a `Dnd.Sortable` `<tbody>`; a lifted row leaves a dashed gap row across every column, its neighbours glide (`base`), the copy flies in a one-row table at the row's column widths and sets down on its new place; a keyboard move glides the same way |
| saving a move | `onReorder` returned a pending promise | the row stays in its new place, `aria-busy`, its cells at 60% and a Spinner in its handle cell; a rejection glides it back |
| reorder off | a sort by a column | the handles are disabled with a Tooltip (`labels.reorderSorted`); no drag, no Alt + arrows |
| heatmap cell | column `scale` and a numeric value | `data-scale="1"…"5"` on the cell: its base is `--prime-color-chart-scale-<n>`, text `--prime-color-chart-scale-fg` on 4–5; the range spans all rows (or the fixed `min` / `max`), so paging and sorting never change a shade |
| filling the parent | `scrollHeight="fill"` | `data-scroll-height="fill"` on the root; the viewport takes the free height |
| state swap | the body moves between loading, rows, empty and error | the body fades in over `base` (opacity only, the same swap motion as [Crossfade](../crossfade/COMPONENT.md)); the head stays still; nothing moves on the first render |

Root attributes: `data-size`, `data-row-dividers`, `data-column-dividers`, `data-sticky-header`, `data-sticky-first-column`, `data-table-width` (`fill` · `auto` · `grow`), `data-highlight-row`, `data-highlight-column`, `data-striped`, `data-loading`, `data-reorderable`, `data-selectable`, `data-expandable`, `data-dragging` (while drag-selecting), `data-overflow-start` · `data-overflow-end` (edges that hide columns), `data-scroll-height` (`fill`). Sorting and paging swap rows instantly; everything is still under `prefers-reduced-motion`.

## Layout & spacing
- The root is a layer of the surface ladder (`data-depth`, one above its host): it fills its container on `--prime-color-layer-current`, radius 12, and clips full-bleed head and rows; zebra rows and the sticky column are one ladder step off it, the head two. On a card or in a modal it is the next layer by itself — never wrap it in a Card.
- Toolbar padding `--prime-space-3` × cell padding, items `gap: --prime-space-2`; below 30rem of table width toolbar and footer stack.
- The footer has a hairline on top: range on the left, Pagination on the right. The range shows only with more than one page or with infinite scroll.
- Columns scroll sideways inside the table, never the page; pin the identifying column with `stickyFirstColumn`. Works from 320 px.
- While columns are hidden past an edge, that edge shows a `--prime-space-4` shadow (the theme scrim at 40%) over the content; it takes no space and follows RTL. With `stickyFirstColumn` the start shadow falls from the pinned column's end edge.
- Fewer columns, less scrolling: put `DataTable.ColumnsMenu` in `toolbar` (the key column `hideable: false`). The kit stores nothing: keep `onHiddenColumnsChange`'s list where the app keeps settings and pass it back as `hiddenColumns`. Never hide columns silently by width.
- Row height per `size` is public: `--prime-table-row-height-xs` · `-s` · `-m` · `-l` · `-xl` (36 · 36 · 44 · 52 · 52). A placeholder outside the table that stands in its geometry (a heatmap, a matrix skeleton) uses the same token.
- A row that opens keeps controls out of its key cell (that cell is the link); controls in other cells stand above the row's link. Mark a custom widget with `data-row-click-ignore`.
- Group headers: the name at the start, totals at the end (`renderGroupHeader` returns both, the kit lays them out across the visible width), head-tier text in `text-secondary`, row height = the head height.
- `scrollHeight="fill"` needs a parent with a height: a flex or grid column with `min-height: 0`, `PageContent.Root fill` in an `AppShell.Root fillViewport`, or a sized pane.
- The sticky head stops sticking on screens lower than 480px (landscape phones), so it never takes a large share of the height.
- Cell content: text, two-line text (title + `caption`), an Avatar with text, a Badge, or a control one tier down (`s` in an `m` table). Toolbar controls use `s` in an `m` table.
- Column widths: `width` / `minWidth` / `maxWidth` strings; never size cells with custom CSS.
- Sub-rows indent by `--dt-indent` per level (avatar of the tier + gap); override it on the root for other leading content.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through sort buttons, checkboxes, expand toggles, row links and rows that open in place. |
| `Enter` · `Space` | Sorts by the column, toggles the row, or opens the focused row (`onRowClick`); Enter on a row link follows it. |
| `Space` | Toggles the focused row checkbox. |
| `Shift + Space` | Selects the range from the last toggled row. |
| `Alt + ↑` · `Alt + ↓` | On a row handle (`onReorder`), moves the row one place up or down. |
| `Escape` | Cancels a row drag; the row goes back to its place. |

### ARIA
- Native `<table>` semantics; head cells are `scope="col"`; sortable heads hold a `<button>` and expose `aria-sort`; the whole head cell shows the inset focus ring.
- A link row has one link for assistive tech: the `<a>` in the key cell, named by its text. Its copies over the other cells are `aria-hidden` and `tabindex="-1"`, so the pointer can use the whole row. An in-place row is focusable itself (`tabindex="0"`) and reads as its cells. Either way the focused row shows a ring around all its cells.
- A row never opens from a control inside it (links, buttons, fields, `label`, `summary`, ARIA widgets, `data-row-click-ignore`), from a text selection, or from a React event that bubbled out of a portal (a ⋯ menu item).
- A group header is a `<th scope="rowgroup">` across every column, first in its own `<tbody>`.
- `DataTable.ColumnsMenu` is a menu button: `menuitemcheckbox` items with `aria-checked`; the key column is `aria-disabled`.
- Row checkboxes are named by `labels.selectRow` with `{label}` from `getRowLabel` (pass it so the names are unique); the head checkbox by `labels.selectAll`, `indeterminate` on a partial selection.
- After a selection change a polite live region announces `labels.selectedCount`; selected rows carry `aria-selected`.
- A row handle is a button named by `labels.reorderRow` with `aria-keyshortcuts`; a pick-up, a drop and a keyboard move are announced in a polite live region («Договор: позиция 2 из 6»). While its move is saved the row is `aria-busy`; while the table is sorted the handles are disabled and a tooltip gives `labels.reorderSorted`.
- The expand toggle is a button with `aria-expanded`, `aria-controls` (detail row or sub-rows) and `labels.expand` / `labels.collapse`.
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
| `columns` | `"Колонки"` | Text of the `DataTable.ColumnsMenu` trigger; `{shown}` and `{total}` are column counts. |
| `showAllColumns` | `"Показать все"` | The `DataTable.ColumnsMenu` item that shows every column again. |
| `reorderRow` | `"Переместить строку {label}"` | `aria-label` of a row's drag handle (`onReorder`); `{label}` is `getRowLabel(row)`. |
| `reorderSorted` | `"Порядок задан сортировкой. Сбросьте её, чтобы перемещать строки"` | Tooltip of the disabled handles while the table is sorted by a column. |

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Recent orders: sortable columns, a status Badge, numeric sums and five rows per page — `columns`, `getRowKey`, `pageSize`. |
| [sizes.tsx](examples/sizes.tsx) | Every density: rows from 36 to 52 px, the head at the control height of the tier — `size`. |
| [numeric.tsx](examples/numeric.tsx) | An inventory report: number columns align to the end in tabular figures, a long name stays on one line with a title — `numeric`, `truncate`, `maxWidth`. |
| [heatmap.tsx](examples/heatmap.tsx) | Deals closed per manager and month as a heatmap: each count shades its cell on the chart scale and stays readable in it — `scale`, `numeric`. |
| [content-width.tsx](examples/content-width.tsx) | A short lookup table sized by its content with a centered column, and a `grow` column that takes the free width and wraps — `fullWidth`, `align`, `grow`. |
| [appearance.tsx](examples/appearance.tsx) | Row styling: zebra rows without lines, a column wash under the pointer, a headless key/value list — `striped`, `rowDividers`, `highlightColumnOnHover`, `columnDividers`, `showHeader`. |
| [toolbar.tsx](examples/toolbar.tsx) | A campaign list with search, a status filter and export above the table; the empty text when nothing matches — `toolbar`, `empty`. |
| [selection.tsx](examples/selection.tsx) | Team members with checkboxes: Shift+click range, press-and-drag, «select all» and bulk actions in the toolbar — `selectable`, `selected`, `onSelectedChange`, `getRowLabel`. |
| [nested-rows.tsx](examples/nested-rows.tsx) | Partners with their expense lines: sub-rows indented under the parent's name, a chevron toggle, together with selection and sorting — `getRowChildren`, `expanded`, `onExpandedChange`. |
| [detail-panel.tsx](examples/detail-panel.tsx) | Order details in a full-width row under an expanded order, aligned with the first content column — `renderExpanded`, `defaultExpanded`. |
| [sticky.tsx](examples/sticky.tsx) | Monthly sales by region in a 280 px window: the head and the region column stay while scrolling both ways — `stickyHeader`, `stickyFirstColumn`, `scrollHeight`. |
| [row-link.tsx](examples/row-link.tsx) | Invoices whose rows are links: ⌘-click or a middle click opens a new tab, a plain click routes inside the app, the totals row and the ⋯ menu never open a row — `getRowHref`, `onRowClick`, `isRowClickable`. |
| [row-open.tsx](examples/row-open.tsx) | Deals that open in a side panel: a click, or Enter and Space on the focused row; the panel keeps the last deal while it slides away — `onRowClick`. |
| [reorder.tsx](examples/reorder.tsx) | Pipeline stages put in order by the handle or Alt + ↑ / ↓; each move is saved with a spinner in its handle, and sorting by a column turns the handles off — `onReorder`, `getRowLabel`. |
| [groups.tsx](examples/groups.tsx) | Payments grouped by month with the month's total in its header row; headers stay on top while their rows scroll — `getRowGroup`, `renderGroupHeader`, `stickyGroupHeaders`. |
| [columns-visibility.tsx](examples/columns-visibility.tsx) | Orders with the column chooser in the toolbar; the choice outlives a reload in local storage, the order number always stays — `DataTable.ColumnsMenu`, `hiddenColumns`, `onHiddenColumnsChange`, `hideable`. |
| [infinite-scroll.tsx](examples/infinite-scroll.tsx) | An audit log that reveals loaded rows in batches and then asks the server for more — `paging`, `infiniteBatchSize`, `hasMore`, `loadingMore`, `onLoadMore`. |
| [server.tsx](examples/server.tsx) | A CRM deal list the server sorts, pages and searches; a new search returns to page 1 — `source`, `rowCount`, `sort`, `page`, `loading`. |
| [fill-height.tsx](examples/fill-height.tsx) | An audit log that fills the height of its panel and loads older entries while scrolling; the status shows while the request is pending — `scrollHeight`, `paging`, `onLoadMore`. |
| [states.tsx](examples/states.tsx) | Loading skeleton, an empty period and a load error with a retry: the head stays, only the body changes — `loading`, `loadingRows`, `empty`, `error`. |
| [controlled.tsx](examples/controlled.tsx) | Sort and page owned by the parent (a URL or a store): a header click goes asc → desc → none, a new sort returns to page 1 — `sort`, `onSortChange`, `page`, `onPageChange`. |
| [narrow.tsx](examples/narrow.tsx) | A 320 px support queue: columns scroll inside the table with the first one pinned, the toolbar and footer reflow and the pager turns compact — `stickyFirstColumn`, `size`. |

## Mistakes
- No `getRowKey` with `selectable`, expansion or sorting → selection follows positions, not records.
- Numbers in a plain column → set `numeric` (alignment and tabular figures).
- A custom «Ничего не найдено» row inside `rows` → use `empty`.
- A spinner instead of rows → use `loading` (the skeleton keeps the head and the layout).
- Wrapping the table in a Card for a border → the table is already a bounded block.
- A custom checkbox column → use `selectable` (range, drag and announcements built in).
- Up / down arrow buttons in a cell to order rows → use `onReorder` (drag, touch hold, Alt + arrows, announcements, server save built in).
- Applying the new order before the server answers and undoing it by hand → return the request's promise from `onReorder` and apply after it resolves: the table keeps the row in place meanwhile and moves it back on a rejection.
- A long table in a `scrollHeight` window without `stickyHeader` → the head scrolls away.
- `paging="none"` for hundreds of rows → use `pages` or `infinite`.
- Dropping columns below a breakpoint → people lose data without knowing it; offer `DataTable.ColumnsMenu`.
- A hand-built column chooser from Dropdown items → `DataTable.ColumnsMenu` (key column, last visible column, «Показать все» built in).
- Letting the key column be hidden → set `hideable: false` on it, so every row keeps its name.
- Wrapping the table in an `overflow-x` box of your own → it already scrolls inside and shows the edge shadows.
- `onRowClick` with `navigate()` for a record page → use `getRowHref` (⌘-click, new tab, status-bar URL) and route the plain click in `onRowClick` with `event.preventDefault()`.
- Checking `event.target` in `onRowClick` to skip a button or a menu in the row → the table already ignores controls and portals; mark a custom widget with `data-row-click-ignore`.
- A totals row that opens like a record → `isRowClickable`.
- Group headers faked with sub-rows or a row in `rows` → use `getRowGroup` + `renderGroupHeader`.
- Computing the table height from the window → `scrollHeight="fill"` in a parent with a height.
- Showing your own spinner while `onLoadMore` runs → return its promise; the table shows the status.
- A server page passed with the default `source` → the table re-sorts it and counts pages from that one page; set `source="server"` and `rowCount`.
- Clearing `rows` while the next server page loads → the body flashes to a skeleton; keep the old rows and set `loading`.
- A new search that keeps the current page → set `page` to 1 together with the search.

## Related
- **Built from:** [Checkbox](../checkbox/COMPONENT.md), [Button](../button/COMPONENT.md), [Dropdown](../dropdown/COMPONENT.md) (`DataTable.ColumnsMenu`), [Pagination](../pagination/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md) (loading rows, in the table tier), [Dnd](../dnd/COMPONENT.md) (`onReorder`: `Dnd.Sortable as="tbody"`, `Dnd.Handle`), [Tooltip](../tooltip/COMPONENT.md) and [Spinner](../spinner/COMPONENT.md) (handle hint and busy state), Icon (sort arrows, the expand chevron, the `DataTable.ColumnsMenu` trigger)
- **See also:** [SmartFilter](../smart-filter/COMPONENT.md), [PageToolbar](../page-toolbar/COMPONENT.md), [Gantt](../gantt/COMPONENT.md), [Kanban](../kanban/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [Card](../card/COMPONENT.md)
