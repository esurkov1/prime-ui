# DataTable

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## About

`DataTable.Root` renders a semantic `<table>` inside a scroll viewport, with optional client-side sorting, classic pagination or infinite-scroll slicing, sticky header and sticky first column, and a footer with row counts (and pagination or infinite-scroll hints).

- **Use** when you need sortable tabular data with built-in pagination or “load more while scrolling” without building table chrome from scratch.
- **Use** when row hover / column hover highlights or zebra striping should stay consistent with kit tokens via `size` and `ControlSizeProvider`.
- **Use** when the first column must stay visible during horizontal scroll (`stickyFirstColumn`).
- **Do not use** when you need arbitrary column pinning, resizable columns, or spreadsheet-style keyboard grid navigation — the table does not implement those.
- **Do not use** when sorting or filtering must run on the server only without mirroring logic in the parent — sorting is applied in memory to the `rows` you pass; supply pre-sorted data or control `sort` yourself and replace `rows` accordingly.
- **Do not use** when you need a loading overlay on top of already rendered rows — `loading` only affects the body when there are zero rows to display.

## Composition

- **Public API** — a single compound entry: `DataTable` with `Root` (`DataTableRoot`). There are no other exported subcomponents.
- **Structure** — `ControlSizeProvider` wraps a root `div` (data attributes for size, dividers, header visibility, stickiness, hover highlights, zebra). Inside: `ScrollContainer` viewport → `<table>` with `<colgroup>`, optional `<thead>` (`<th>` per column), `<tbody>` with rows, and an `aria-hidden` sentinel at the bottom when `infiniteScroll` is on (for `IntersectionObserver` or scroll fallback).
- **Footer** — always shows a “shown range / total” line; if not `infiniteScroll` and `showPagination` and there is more than one page, it renders `Pagination.Root`; in infinite mode it may show a short status when more rows can be revealed or loaded.

### Minimal example

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Row = { id: string };

const columns: DataTableColumn<Row>[] = [{ id: "id", header: "ID", accessor: "id" }];
const rows: Row[] = [{ id: "1" }];

export function Example() {
  return <DataTable.Root columns={columns} rows={rows} />;
}
```

## Rules

- Pass **`columns`** with unique **`id`** and **`header`** for every column; **`accessor`** (key or function), **`cell`**, **`sortable`**, and the rest are optional.
- **Sort** — controlled: `sort` + `onSortChange`. Uncontrolled initial order: `defaultSort` (default `null`). Clicking a sortable header cycles **asc → desc → none** for that column; changing sort sets the page to **1** in paginated mode.
- **Page** — controlled: `page` + `onPageChange`. Uncontrolled: `defaultPage` (default `1`). Page index is clamped when row count changes. Toggling **`infiniteScroll`** resets the visible slice; leaving infinite mode resets page to **1** via internal effect.
- **Infinite scroll** — set `infiniteScroll`. The visible slice grows by **`infiniteBatchSize`** up to the current **`rows.length`** first; when the slice shows all local rows and **`hasMore`**, **`onLoadMore`** runs when the sentinel intersects (or on near-bottom scroll if `IntersectionObserver` is missing). **`initialVisibleRows`** defaults to **`pageSize`** when omitted.
- **`loading`** — shows **`loadingText`** in a single spanning row only when there are no displayed rows yet; it does not dim existing rows.
- **Empty** — when not loading and there are no rows, **`emptyText`** is shown in a spanning row.
- **Row keys** — provide **`getRowKey`** for stable identity; otherwise React **`key`** falls back to the row **index** (fragile if row order changes).
- **Localization** — default **`loadingText`**, **`emptyText`**, footer range text, and infinite-scroll hints are **Russian** in the implementation; override with props where needed.
- **Accessibility** — sortable headers use an inner control pattern inside **`th`** with **`scope="col"`**; sort icons are **`aria-hidden`**. Cells with **`onCellClick`** get **`role="button"`**, **`tabIndex={0}`**, and **Enter / Space**. There is no **`grid`** role or arrow-key cell navigation.

## API

### DataTable.Root

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| columns | `DataTableColumn<Row>[]` | — | Yes | Column definitions |
| rows | `Row[]` | — | Yes | Data rows (sorted in memory when `sort` applies) |
| size | `DataTableSize` | `"m"` | No | Row density; forwarded to nested `Pagination` unless `paginationSize` is set |
| className | `string` | — | No | Class on the outer wrapper |
| showHeader | `boolean` | `true` | No | Render `<thead>` |
| stickyHeader | `boolean` | `false` | No | Sticky header row |
| stickyFirstColumn | `boolean` | `false` | No | Sticky first column (and corner cell when header is sticky) |
| getRowKey | `(row: Row, index: number) => React.Key` | — | No | Stable row key; default is index |
| onRowClick | `(row: Row, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void` | — | No | Row click handler |
| loading | `boolean` | `false` | No | Loading state when no rows are displayed |
| loadingText | `React.ReactNode` | `"Загрузка данных…"` | No | Message in loading state |
| emptyText | `React.ReactNode` | `"Нет данных для отображения."` | No | Message when there are no rows |
| dividerStyle | `DataTableDividerStyle` | `"standard"` | No | Cell border style: `standard`, `dashed`, `dotted`, `none` |
| sort | `DataTableSortState` | — | No | Controlled sort (`null` or `{ columnId, order }`) |
| defaultSort | `DataTableSortState` | `null` | No | Initial sort when uncontrolled |
| onSortChange | `(sort: DataTableSortState) => void` | — | No | Sort change callback |
| page | `number` | — | No | Controlled current page (1-based) |
| defaultPage | `number` | `1` | No | Initial page when uncontrolled |
| onPageChange | `(page: number) => void` | — | No | Page change callback |
| pageSize | `number` | `10` | No | Rows per page in pagination mode; also default for `initialVisibleRows` in infinite mode |
| showPagination | `boolean` | `true` | No | Show `Pagination` when not in infinite mode and `totalPages > 1` |
| siblingCount | `number` | `1` | No | Page window size passed to `Pagination.Root` |
| paginationSize | `DataTableSize` | — | No | Pagination size; defaults to root `size` |
| infiniteScroll | `boolean` | `false` | No | Scroll viewport with growing slice / `onLoadMore` |
| initialVisibleRows | `number` | `pageSize` | No | Initial number of rows shown in infinite mode |
| infiniteBatchSize | `number` | `20` | No | Rows added per reach-end step before `onLoadMore` |
| hasMore | `boolean` | `false` | No | Server has more data after current `rows` |
| loadingMore | `boolean` | `false` | No | While an async `onLoadMore` is in progress |
| onLoadMore | `() => void \| Promise<void>` | — | No | Fetch next chunk when local slice is exhausted |
| scrollHeight | `number \| string` | `360` | No | Max height of the scroll viewport in infinite mode |
| highlightRowOnHover | `boolean` | `true` | No | Row hover highlight |
| highlightColumnOnHover | `boolean` | `false` | No | Column hover highlight (header + cells) |
| striped | `boolean` | `false` | No | Alternating row backgrounds |

### `DataTableColumn<Row>`

| Field | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| id | `string` | — | Yes | Column id (used for sort state and DOM data attributes) |
| header | `React.ReactNode` | — | Yes | Header content |
| accessor | `keyof Row \| ((row: Row) => unknown)` | — | No | Value for default cell text and sort (unless `sortAccessor` / `sortComparator` override) |
| cell | `(row: Row) => React.ReactNode` | — | No | Custom cell render |
| sortable | `boolean` | `false` | No | Header toggles sort on click |
| sortAccessor | `(row: Row) => unknown` | — | No | Value used for sorting (and default sort comparison) instead of `accessor` |
| sortComparator | `(a: Row, b: Row, order: DataTableOrder) => number` | — | No | Custom comparator; when set, default primitive compare is not used |
| align | `DataTableCellAlign` | `"start"` | No | `start`, `center`, or `end` |
| width | `string` | — | No | CSS `width` on `<col>` (fixed or preferred width) |
| minWidth | `string` | — | No | CSS `min-width` on `<col>` |
| maxWidth | `string` | — | No | CSS `max-width` on `<col>` |
| onHeaderClick | `(event: React.MouseEvent<HTMLTableCellElement>) => void` | — | No | Fires on header click before sort handling |
| onCellClick | `(row: Row, event: React.MouseEvent<HTMLTableCellElement> \| React.KeyboardEvent<HTMLTableCellElement>) => void` | — | No | Makes the cell focusable and keyboard-activable |

Exported types: `DataTableSortState`, `DataTableOrder`, `DataTableSize`, `DataTableCellAlign`, `DataTableDividerStyle`, `DataTableRootProps`, `DataTableColumn`.

## Related

- [Pagination](../pagination/COMPONENT.md) — used under the table for page navigation.
- [LinkButton](../link-button/COMPONENT.md), [Badge](../badge/COMPONENT.md), [Tag](../tag/COMPONENT.md) — common cell content; they pick up size from the table’s `ControlSizeProvider` unless overridden.
