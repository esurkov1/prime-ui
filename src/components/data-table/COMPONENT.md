# DataTable

**Category:** data-display
**Kind:** composite

> A data table with sorting, pages or infinite scroll, row selection, nested rows and loading / empty / error states.

## When to use
- Lists of records with several attributes to compare: orders, invoices, users, campaigns.
- Data that needs sorting, paging, bulk selection or a filter toolbar.
- Hierarchical rows (`getRowChildren`) or rows with a detail panel (`renderExpanded`).
- Wide numeric reports with a sticky head and first column.
- Wide records on narrow screens: let people choose the columns (`hiddenColumns`) instead of dropping them.

## When not to use
- One or two KPIs → use [Card](../card/COMPONENT.md).
- A short list of events without columns → use [Timeline](../timeline/COMPONENT.md).
- A page with nothing to show yet (first run, no permissions) → use [EmptyPage](../empty-page/COMPONENT.md); inside a table pass it to `empty`.
- Page navigation outside a table → use [Pagination](../pagination/COMPONENT.md).
- Picking values from a list → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).

## Import
```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";
```
Exported types: `DataTableColumn<Row>`, `DataTableProps<Row>`, `DataTableSortState`, `DataTableOrder`, `DataTableLabels`.

## Anatomy
```
DataTable                           card-fill block, radius 12, clips its content
├── toolbar                         optional panel above the table (search, filters, bulk actions)
├── scroll viewport                 ScrollContainer, both axes, in a frame that holds the edge shadows
│   └── table
│       ├── thead                   [select all] [toggle] head cells; sortable heads hold a button
│       └── tbody                   rows · sub-rows · detail rows · skeleton / empty / error row
└── footer                          range «Показано 1–5 из 23» · Pagination · infinite-scroll status
```
DataTable is a single component: columns are data (`DataTableColumn<Row>[]`), not child parts.

## API

<!-- Generated from api.ts by `bun run docs:build`. Edit api.ts, not this section. -->

### DataTable
Generic over `Row`; `ref` → `HTMLDivElement`. A card-fill block with an optional toolbar, a scrolling `<table>` and a footer (range, Pagination, infinite-scroll status); passes its tier to the controls inside.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn<Row>[]` | — (required) | Column definitions, see `DataTableColumn<Row>`. |
| `hiddenColumns` | `string[]` | — | Ids of columns that are not rendered (head, body, skeleton and state rows); widths are measured again. A column with `hideable: false` stays. The list and the control that changes it (a column chooser in `toolbar`) belong to the consumer; sorting by a hidden column keeps the row order. |
| `rows` | `Row[]` | — (required) | Data; sorted in memory when a sort is set. |
| `getRowKey` | `(row: Row, index: number) => Key` | — | Stable row id (position by default); selection, expansion and the enter animation of new rows are keyed by it. Pass it whenever sorting, selection or expansion is used. |
| `getRowLabel` | `(row: Row) => string` | — | Human row name for the checkbox and toggle names (`{label}` in `labels`). |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Density and control tier: rows from 36 · 36 · 44 · 52 · 52 px; passed to checkboxes, toggles, Pagination and nested controls. |
| `paging` | `"pages" \| "infinite" \| "none"` | `"pages"` | `pages` — Pagination in the footer when there is more than one page; `infinite` — rows are revealed while scrolling; `none` — every row at once. |
| `pageSize` | `number` | `10` | Rows per page; also the first batch with `paging="infinite"`. |
| `page` | `number` | — | Current page (1-based), controlled. |
| `defaultPage` | `number` | `1` | Initial page, uncontrolled. |
| `onPageChange` | `(page: number) => void` | — | Page change from the pager; a sort change also returns to page 1. |
| `sort` | `DataTableSortState` | — | Current sort, controlled: `{ columnId, order: "asc" \| "desc" }` or `null`. |
| `defaultSort` | `DataTableSortState` | `null` | Initial sort, uncontrolled. |
| `onSortChange` | `(sort: DataTableSortState) => void` | — | A head click cycles asc → desc → none. |
| `loading` | `boolean` | `false` | Skeleton rows while there are no rows; with rows only `aria-busy`. |
| `loadingRows` | `number` | `min(pageSize, 5)` | Number of skeleton rows. |
| `empty` | `ReactNode` | `labels.empty` | Empty-state content: a string goes into a compact EmptyPage, a node (e.g. a full `EmptyPage`) is rendered as is. |
| `error` | `ReactNode` | — | Load error: replaces the body with the message in `role="alert"`. |
| `toolbar` | `ReactNode` | — | Panel above the table (search, filters, bulk actions); stacks below 30rem of table width. |
| `selectable` | `boolean` | `false` | Leading checkbox column with «select all», Shift range, press-and-drag and Space. |
| `selected` | `Key[]` | — | Selected row ids, controlled. |
| `defaultSelected` | `Key[]` | `[]` | Initially selected ids, uncontrolled. |
| `onSelectedChange` | `(selected: Key[]) => void` | — | Selection change. |
| `getRowChildren` | `(row: Row) => Row[] \| undefined` | — | Sub-rows rendered under the parent with the same columns, indented by depth. |
| `renderExpanded` | `(row: Row) => ReactNode` | — | Full-width detail row under an expanded row. |
| `isRowExpandable` | `(row: Row) => boolean` | — | Which rows get an expand toggle; by default rows with sub-rows, or every row with `renderExpanded`. |
| `expanded` | `Key[]` | — | Expanded row ids, controlled. |
| `defaultExpanded` | `Key[]` | `[]` | Initially expanded ids, uncontrolled. |
| `onExpandedChange` | `(expanded: Key[]) => void` | — | Expansion change. |
| `infiniteBatchSize` | `number` | `20` | Rows revealed per scroll step. |
| `hasMore` | `boolean` | `false` | More rows can be loaded from the server. |
| `loadingMore` | `boolean` | `false` | A server batch is loading: footer status, `aria-busy`. |
| `onLoadMore` | `() => void \| Promise<void>` | — | Called at the end when every loaded row is shown and `hasMore` is set. |
| `scrollHeight` | `number \| string` | `360 with paging="infinite"` | Max height of the scroll viewport (number = px). |
| `stickyHeader` | `boolean` | `false` | The head sticks while the body scrolls (with `scrollHeight`); on screens lower than 480px it scrolls with the rows. |
| `stickyFirstColumn` | `boolean` | `false` | The first visible column (with the selection and toggle columns) sticks while scrolling sideways; the start edge shadow falls from its end edge. |
| `showHeader` | `boolean` | `true` | Render `<thead>`. |
| `fullWidth` | `boolean` | `true` | The table spans its container; `false` sizes it by its content. |
| `rowDividers` | `boolean` | `true` | Hairlines between rows. |
| `columnDividers` | `boolean` | `true` | Hairlines between content columns. |
| `striped` | `boolean` | `false` | Every second row one opaque step off the table fill. |
| `highlightRowOnHover` | `boolean` | `true` | Row wash on hover (and a pressed wash on clickable rows). |
| `highlightColumnOnHover` | `boolean` | `false` | Column wash under the pointer (head and cells). |
| `onRowClick` | `(row: Row, index: number, event: MouseEvent<HTMLTableRowElement>) => void` | — | Row click; rows get a pointer cursor. |
| `labels` | `Partial<DataTableLabels>` | — | Built-in strings, see Labels. |
| `…rest` | `Omit<HTMLAttributes<HTMLDivElement>, "children">` | — | `className` and the other attributes of the root `<div>`. |

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
| `hideable` | `boolean` | `true` | The column can be hidden through `hiddenColumns`; `false` for the key column that names the row. |
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

Column widths come from the content and then hold still: once rows are laid out the widths are frozen, so searching, filtering, paging and opening sub-rows do not move the columns. A column widens when new content no longer fits, never narrows; widths are measured again when the column set or the container width changes. `grow` columns keep taking the free width.

### paging
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `pages` | `pageSize` rows, footer range and Pagination (compact on narrow widths) | tables people return to and reference | yes |
| `infinite` | rows revealed while scrolling in a `scrollHeight` window, footer status | logs and feeds | |
| `none` | every row, no footer | short lists, reports in a scroll window | |

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
| `highlightRowOnHover` | `fill-subtle` wash on the hovered row | interactive lists | `true` |
| `highlightColumnOnHover` | `fill-subtle` wash on the hovered column | comparison tables | `false` |
| `stickyHeader` · `stickyFirstColumn` | opaque sticky head / first column with a hairline edge; on screens lower than 480px the head scrolls with the rows | long / wide tables in a `scrollHeight` window | `false` |
| column `hideable` | `false`: the column stays even when listed in `hiddenColumns` | the key column that names the row | `true` |
| `showHeader` | head row shown | off only for self-explanatory key/value tables | `true` |
| `fullWidth` | spans the container; `false` = content width | `false` for short lookup tables in wide layouts | `true` |
| column `numeric` | tabular figures, end-aligned, no wrap | numbers, money | — |
| column `truncate` | one line with an ellipsis and a `title` | long names in narrow columns | — |

## States
| State | Driven by | DOM |
|---|---|---|
| loading (no rows) | `loading` | skeleton rows (`data-skeleton`), `role="status"` with `labels.loading`, `aria-busy` on the table, `data-loading` on the root |
| loading more | `loading` with rows, `loadingMore` | `aria-busy`; footer `labels.loadingMore` |
| empty | no rows and not loading | compact EmptyPage with `empty` or `labels.empty` (`role="status"`), or the `empty` node |
| error | `error` | body replaced by a `role="alert"` message in `danger-text`; range and infinite status hidden |
| sorted | `sort` / `defaultSort` | `aria-sort` and `data-sorted` on the head; the sort icon: unsorted `text-disabled`, hover `text-muted`, sorted `text-secondary` — never accent |
| selected | `selected` / `defaultSelected` | `aria-selected` rows with `accent-soft` fill; polite `labels.selectedCount` |
| expanded | `expanded` / `defaultExpanded` | `data-expanded` on the parent row (one step darker); toggle `aria-expanded`, chevron turns 90° |
| new rows | rows mounted by an expand or new in `rows` (by `getRowKey`) | `data-animate`: cells drop in from above (`enterMotion`); detail panels open and close through `grid-template-rows` (`data-state` on the detail row; it unmounts after the close) |
| overflowing sideways | the table is wider than its viewport | `data-overflow-start` (scrolled from the start) and `data-overflow-end` (more to the end) on the root: a soft shadow over that edge, from the end edge of the sticky first column for the start; fades in and out over `fast` |
| hidden columns | `hiddenColumns` | the listed columns (except `hideable: false`) are not rendered in the head, rows, skeleton or state rows; widths are measured again |
| state swap | the body moves between loading, rows, empty and error | the body fades in over `base` (opacity only, the same swap motion as [Crossfade](../crossfade/COMPONENT.md)); the head stays still; nothing moves on the first render |

Root attributes: `data-size`, `data-row-dividers`, `data-column-dividers`, `data-sticky-header`, `data-sticky-first-column`, `data-table-width` (`fill` · `auto` · `grow`), `data-highlight-row`, `data-highlight-column`, `data-striped`, `data-loading`, `data-selectable`, `data-expandable`, `data-dragging` (while drag-selecting), `data-overflow-start` · `data-overflow-end` (edges that hide columns). Sorting and paging swap rows instantly; everything is still under `prefers-reduced-motion`.

## Layout & spacing
- The root fills its container on `--prime-color-card-bg`, radius 12, and clips full-bleed head and rows; on a card or a modal it becomes a sunken block — never wrap it in a Card.
- Toolbar padding `--prime-space-3` × cell padding, items `gap: --prime-space-2`; below 30rem of table width toolbar and footer stack.
- The footer has a hairline on top: range on the left, Pagination on the right. The range shows only with more than one page or with infinite scroll.
- Columns scroll sideways inside the table, never the page; pin the identifying column with `stickyFirstColumn`. Works from 320 px.
- While columns are hidden past an edge, that edge shows a `--prime-space-4` shadow (the theme scrim at 40%) over the content; it takes no space and follows RTL. With `stickyFirstColumn` the start shadow falls from the pinned column's end edge.
- Fewer columns, less scrolling: put a column chooser in `toolbar` (a Dropdown with a `Dropdown.CheckboxItem` per column, the key column `hideable: false` shown checked and disabled) and pass `hiddenColumns`. Never hide columns silently by width.
- The sticky head stops sticking on screens lower than 480px (landscape phones), so it never takes a large share of the height.
- Cell content: text, two-line text (title + `caption`), an Avatar with text, a Badge, or a control one tier down (`s` in an `m` table). Toolbar controls use `s` in an `m` table.
- Column widths: `width` / `minWidth` / `maxWidth` strings; never size cells with custom CSS.
- Sub-rows indent by `--dt-indent` per level (avatar of the tier + gap); override it on the root for other leading content.

## Accessibility

### Keyboard
| Key | Action |
|---|---|
| `Tab` | Moves through sort buttons, checkboxes and expand toggles. |
| `Enter` · `Space` | Sorts by the column or toggles the row. |
| `Space` | Toggles the focused row checkbox. |
| `Shift + Space` | Selects the range from the last toggled row. |

### ARIA
- Native `<table>` semantics; head cells are `scope="col"`; sortable heads hold a `<button>` and expose `aria-sort`; the whole head cell shows the inset focus ring.
- Row checkboxes are named by `labels.selectRow` with `{label}` from `getRowLabel` (pass it so the names are unique); the head checkbox by `labels.selectAll`, `indeterminate` on a partial selection.
- After a selection change a polite live region announces `labels.selectedCount`; selected rows carry `aria-selected`.
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

## Examples
| Example | Shows |
|---|---|
| [overview.tsx](examples/overview.tsx) | Recent orders: sortable columns, a status Badge, numeric sums and five rows per page — `columns`, `getRowKey`, `pageSize`. |
| [sizes.tsx](examples/sizes.tsx) | Every density: rows from 36 to 52 px, the head at the control height of the tier — `size`. |
| [numeric.tsx](examples/numeric.tsx) | An inventory report: number columns align to the end in tabular figures, a long name stays on one line with a title — `numeric`, `truncate`, `maxWidth`. |
| [content-width.tsx](examples/content-width.tsx) | A short lookup table sized by its content with a centered column, and a `grow` column that takes the free width and wraps — `fullWidth`, `align`, `grow`. |
| [appearance.tsx](examples/appearance.tsx) | Row styling: zebra rows without lines, a column wash under the pointer, a headless key/value list — `striped`, `rowDividers`, `highlightColumnOnHover`, `columnDividers`, `showHeader`. |
| [toolbar.tsx](examples/toolbar.tsx) | A campaign list with search, a status filter and export above the table; the empty text when nothing matches — `toolbar`, `empty`. |
| [selection.tsx](examples/selection.tsx) | Team members with checkboxes: Shift+click range, press-and-drag, «select all» and bulk actions in the toolbar — `selectable`, `selected`, `onSelectedChange`, `getRowLabel`. |
| [nested-rows.tsx](examples/nested-rows.tsx) | Partners with their expense lines: sub-rows indented under the parent's name, a chevron toggle, together with selection and sorting — `getRowChildren`, `expanded`, `onExpandedChange`. |
| [detail-panel.tsx](examples/detail-panel.tsx) | Order details in a full-width row under an expanded order, aligned with the first content column — `renderExpanded`, `defaultExpanded`. |
| [sticky.tsx](examples/sticky.tsx) | Monthly sales by region in a 280 px window: the head and the region column stay while scrolling both ways — `stickyHeader`, `stickyFirstColumn`, `scrollHeight`. |
| [columns-visibility.tsx](examples/columns-visibility.tsx) | Orders with a column chooser in the toolbar: fewer columns, less sideways scrolling; the order number always stays — `hiddenColumns`, `hideable`, `toolbar`. |
| [infinite-scroll.tsx](examples/infinite-scroll.tsx) | An audit log that reveals loaded rows in batches and then asks the server for more — `paging`, `infiniteBatchSize`, `hasMore`, `loadingMore`, `onLoadMore`. |
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
- A long table in a `scrollHeight` window without `stickyHeader` → the head scrolls away.
- `paging="none"` for hundreds of rows → use `pages` or `infinite`.
- Dropping columns below a breakpoint → people lose data without knowing it; offer a column chooser with `hiddenColumns`.
- Letting the key column be hidden → set `hideable: false` on it, so every row keeps its name.
- Wrapping the table in an `overflow-x` box of your own → it already scrolls inside and shows the edge shadows.

## Related
- **Built from:** [Checkbox](../checkbox/COMPONENT.md), [Button](../button/COMPONENT.md), [Pagination](../pagination/COMPONENT.md), [ScrollContainer](../scroll-container/COMPONENT.md), [EmptyPage](../empty-page/COMPONENT.md), [Skeleton](../skeleton/COMPONENT.md) (loading rows, in the table tier)
- **See also:** [SmartFilter](../smart-filter/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Avatar](../avatar/COMPONENT.md), [Card](../card/COMPONENT.md)
