# DataTable

**Category:** data-display

> A data table with sorting, pagination or infinite scroll, row selection, nested rows and loading / empty / error states.

## When to use
- Lists of records with several attributes to compare: orders, invoices, users, campaigns.
- Data that needs sorting, paging, bulk selection or a filter toolbar.
- Hierarchical rows (`getRowChildren`) or rows with a detail panel (`renderExpanded`).
- Wide numeric reports with a sticky header and first column.

## When not to use
- One or two KPIs → use [Card](../card/COMPONENT.md) (`mini`, `stat-trend`).
- A short list of events without columns → use `Card variant="list"` or [Timeline](../timeline/COMPONENT.md).
- A page with nothing to show yet (first-run, no permissions) → use [EmptyPage](../empty-page/COMPONENT.md); inside a table pass it to `empty`.
- Page navigation on its own (outside a table) → use [Pagination](../pagination/COMPONENT.md).
- Picking values from a list → use [Select](../select/COMPONENT.md) or [TagSelect](../tag-select/COMPONENT.md).

## Import
```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";
```
Exported types: `DataTableColumn<Row>`, `DataTableRootProps<Row>`, `DataTableSortState`, `DataTableOrder`, `DataTableLabels`.

## Anatomy
```
DataTable.Root                      card-fill block, radius 12, clips its content
├── toolbar                         optional slot above the table (search, filters, bulk actions)
├── scroll viewport (ScrollContainer, both axes)
│   └── table
│       ├── thead                   head cells; sortable headers are buttons
│       │   └── [select-all] [toggle] column headers…
│       └── tbody                   rows · sub-rows · detail rows · skeleton / empty / error row
└── footer                          range «Показано 1–5 из 23» · Pagination · infinite-scroll status
```
DataTable is a single configurable component: columns are data (`DataTableColumn<Row>[]`), not child parts.

## API

### DataTable.Root
Generic over `Row`. No ref forwarding, no `asChild`, no native prop spreading (only `className`). Sizes nested controls through the control-size context.

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumn<Row>[]` | — (required) | Column definitions, see below. |
| `rows` | `Row[]` | — (required) | Data; sorted in memory when a sort is set. |
| `size` | `"xs" \| "s" \| "m" \| "l" \| "xl"` | `"m"` | Density and control tier; passed to checkboxes, toggles, pagination and nested controls. |
| `className` | `string` | — | Class on the root. |
| `toolbar` | `ReactNode` | — | Slot above the table; wraps / stacks below 30rem table width. |
| `showHeader` | `boolean` | `true` | Render `<thead>`. |
| `stickyHeader` | `boolean` | `false` | Header sticks while the body scrolls. |
| `stickyFirstColumn` | `boolean` | `false` | First column (with selection / toggle columns) sticks while scrolling horizontally. |
| `getRowKey` | `(row: Row, index: number) => React.Key` | position | Stable row id; selection and expansion are keyed by it. Pass it whenever sorting, selection or expansion is used. |
| `getRowLabel` | `(row: Row) => string` | — | Human row name for checkbox / toggle `aria-label`s. |
| `onRowClick` | `(row: Row, index: number, event: React.MouseEvent<HTMLTableRowElement>) => void` | — | Row click; rows get a pointer cursor. |
| `loading` | `boolean` | `false` | Skeleton rows while there are no rows; with rows only `aria-busy`. |
| `loadingRows` | `number` | `min(pageSize, 5)` | Number of skeleton rows. |
| `empty` | `ReactNode` | `labels.empty` | Empty-state content (text or EmptyPage). |
| `error` | `ReactNode` | — | Replaces the body with a message in `role="alert"`. |
| `labels` | `Partial<DataTableLabels>` | see Accessibility | Built-in strings. |
| `dividerStyle` | `"standard" \| "dashed" \| "dotted" \| "none"` | `"standard"` | Row divider line. |
| `columnDividers` | `boolean` | `true` | Vertical hairlines between content columns; `false` keeps only row separators. |
| `striped` | `boolean` | `false` | Zebra rows. |
| `highlightRowOnHover` | `boolean` | `true` | Row wash on hover (and pressed wash on clickable rows). |
| `highlightColumnOnHover` | `boolean` | `false` | Column wash under the pointer (head + cells). |
| `fillWidth` | `boolean` | `true` | Table spans the container; `false` sizes it by content. |
| `sort` | `DataTableSortState` | — | Controlled sort `{ columnId, order: "asc" \| "desc" } \| null`. |
| `defaultSort` | `DataTableSortState` | `null` | Initial sort (uncontrolled). |
| `onSortChange` | `(sort: DataTableSortState) => void` | — | Header click cycles asc → desc → none; the page resets to 1. |
| `page` | `number` | — | Controlled page (from 1). |
| `defaultPage` | `number` | `1` | Initial page (uncontrolled). |
| `onPageChange` | `(page: number) => void` | — | Page change. |
| `pageSize` | `number` | `10` | Rows per page (also the first batch in infinite scroll). |
| `showPagination` | `boolean` | `true` | Show Pagination in the footer when there is more than one page. |
| `siblingCount` | `number` | `1` | Pagination siblings around the current page. |
| `paginationSize` | `ControlSize` | `size` | Pagination size independent of the table. |
| `infiniteScroll` | `boolean` | `false` | Reveal rows while scrolling instead of pages. |
| `initialVisibleRows` | `number` | `pageSize` | Rows shown first in infinite scroll. |
| `infiniteBatchSize` | `number` | `20` | Rows revealed per scroll step. |
| `hasMore` | `boolean` | `false` | More rows can be loaded from the server. |
| `loadingMore` | `boolean` | `false` | A server batch is loading (footer status, `aria-busy`). |
| `onLoadMore` | `() => void \| Promise<void>` | — | Called at the end when all loaded rows are shown and `hasMore`. |
| `scrollHeight` | `number \| string` | `360` with `infiniteScroll`, else — | Max height of the scroll viewport (number = px). |
| `selectable` | `boolean` | `false` | Leading checkbox column with select-all, Shift range, drag and Space. |
| `selected` | `React.Key[]` | — | Controlled selected ids. |
| `defaultSelected` | `React.Key[]` | `[]` | Initially selected ids (uncontrolled). |
| `onSelectedChange` | `(selected: React.Key[]) => void` | — | Selection change. |
| `getRowChildren` | `(row: Row) => Row[] \| undefined` | — | Sub-rows rendered under the parent with the same columns, indented by depth. |
| `renderExpanded` | `(row: Row) => ReactNode` | — | Full-width detail row under an expanded row. |
| `isRowExpandable` | `(row: Row) => boolean` | has sub-rows or `renderExpanded` set | Which rows get an expand toggle. |
| `expanded` | `React.Key[]` | — | Controlled expanded ids. |
| `defaultExpanded` | `React.Key[]` | `[]` | Initially expanded ids (uncontrolled). |
| `onExpandedChange` | `(expanded: React.Key[]) => void` | — | Expansion change. |

### DataTableColumn&lt;Row&gt;
| Prop | Type | Default | Description |
|---|---|---|---|
| `id` | `string` | — (required) | Unique column id (sort state, `data-column-id`). |
| `header` | `ReactNode` | — (required) | Header content. |
| `accessor` | `keyof Row \| ((row: Row) => unknown)` | — | Cell value (rendered as text, `—` for null) and default sort value. |
| `cell` | `(row: Row) => ReactNode` | — | Custom cell rendering. |
| `sortable` | `boolean` | — | Header becomes a sort button with `aria-sort`. |
| `sortAccessor` | `(row: Row) => unknown` | — | Value used for sorting instead of `accessor`. |
| `sortComparator` | `(a: Row, b: Row, order: DataTableOrder) => number` | — | Custom comparison. |
| `align` | `"start" \| "center" \| "end"` | `"start"` (`"end"` when `numeric`) | Cell alignment. Headers do not follow it (see `headerAlign`). |
| `headerAlign` | `"start" \| "center" \| "end"` | `"start"` | Header alignment. Every header starts at the start edge by default, also over numeric columns, with the sort indicator at the end edge. |
| `numeric` | `boolean` | — | `tabular-nums`, no wrapping, end alignment unless `align` is set. |
| `truncate` | `boolean` | — | One line with ellipsis; width from `maxWidth` (or `width`); string values get a `title`. |
| `grow` | `boolean` | — | The column takes the free width and wraps its text (descriptions, comments); the table then fills its container instead of growing to its content width. |
| `width` | `string` | — | CSS width of the column. |
| `minWidth` | `string` | — | CSS min width. |
| `maxWidth` | `string` | — | CSS max width. |
| `onHeaderClick` | `(event: React.MouseEvent<HTMLTableCellElement>) => void` | — | Header cell click (before sorting). |
| `onCellClick` | `(row: Row, event: React.MouseEvent<HTMLTableCellElement> \| React.KeyboardEvent<HTMLTableCellElement>) => void` | — | Makes the cell a `role="button"` with `tabIndex=0`; Enter / Space trigger it. |

## Variants

### size (density)
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `xs` | Rows from 36, head 28, text 12/16, cell padding 8 × 4 | Very dense admin grids | |
| `s` | Rows from 36, head 32, text 13/20, cell padding 12 × 4 | Dense back-office lists, narrow containers | |
| `m` | Rows from 44, head 36 (13/20 head text), cells 14/20, cell padding 12 × 6 | Most tables | yes |
| `l` | Rows from 52, head 40, text 16/24, cell padding 12 × 8 | Spacious lists, large avatars | |
| `xl` | Rows from 52, head 48, text 16/24, cell padding 16 × 6 | Large touch-friendly tables | |

Column widths come from the content (automatic table layout) and then hold still: once rows are laid out the widths are frozen, so searching, filtering, paging and opening sub-rows do not move the columns (collapsed sub-rows are measured in advance, hidden). A column widens when new content no longer fits, never narrows; the widths are measured again when the column set or the container width changes. `grow` columns keep taking the free width.

Row height is a minimum, not a fixed value. Cells carry vertical padding = (row height − control one
tier down) / 2, so a single line of text or a cell control one tier down (in an `m` table: an `s`
Button, Select or Input) keeps the row at its tier height, and taller content — an avatar with a
name and a secondary line, wrapped text — grows the row with the same padding above and below. Never
force row heights with CSS.

The head is the control height of the tier with text one step smaller (muted, weight 500). Checkboxes use the table tier; expand toggles are square ghost buttons one tier down (`xs` for xs–m, `s` for l–xl). Toolbar controls should use `s` in an `m` table.

### dividerStyle
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `standard` | 1px solid `border-subtle` between rows | Normal tables | yes |
| `dashed` | Dashed hairline | Lighter separation in comparison tables | |
| `dotted` | Dotted hairline | Very light separation, print-like reports | |
| `none` | No row lines | Together with `striped`, or short tables | |

### Column `align`
| Value | Looks like | Use when | Default |
|---|---|---|---|
| `start` | Text at the start | Text columns | yes (non-numeric) |
| `center` | Centered | Short symmetric values (icons, flags, hours) | |
| `end` | At the end | Numbers, money (set automatically by `numeric`) | yes (`numeric`) |

Headers keep `start` whatever the cell alignment: the header row reads as one line of labels, and the sort indicator sits at the end edge, above end-aligned numbers. Set `headerAlign` only for a deliberate exception.

### Visual flags
| Flag | Looks like when on | Use when | Default |
|---|---|---|---|
| `striped` | Every second row one opaque step off the table fill | Long numeric grids | `false` |
| `columnDividers` | Hairlines between content columns (none inside the selection / expand lead) | Default; turn off only for 2–3 column key/value lists | `true` |
| `highlightRowOnHover` | `fill-subtle` wash on the hovered row | Interactive lists | `true` |
| `highlightColumnOnHover` | `fill-subtle` wash on the hovered column | Comparison tables | `false` |
| `stickyHeader` / `stickyFirstColumn` | Opaque sticky head / first column with a hairline edge | Long / wide tables in a `scrollHeight` window | `false` |
| `showHeader` | Head row shown | Turn off only for self-explanatory key/value tables | `true` |
| `fillWidth` | Table spans the container; `false` = content width | `false` for short lookup tables in wide layouts | `true` |
| column `numeric` | Tabular figures, end-aligned, no wrap | Numbers, money, dates as numbers | — |
| column `truncate` | Single line with ellipsis and `title` | Long names in narrow columns | — |

**Combinations**
- Recommended: `numeric` for every number column; `striped` + `dividerStyle="none"`; `selectable` + bulk actions in `toolbar`; `stickyHeader` + `scrollHeight` for long tables.
- Allowed but rare: `columnDividers={false}` for short key/value lists; `showHeader={false}` for key/value lists.
- Avoid: `striped` together with dashed or dotted row lines (noise); `selectable` / expansion / sorting without `getRowKey` (ids shift when sorting); `infiniteScroll` together with pagination expectations (pagination is hidden in infinite mode).

**Sizes**
Default `m` (rows from 44px) lines up with `m` buttons and inputs on the page; toolbar controls and controls inside cells use `s` (one tier down) so they never stretch a row. `size` also drives the pagination unless `paginationSize` is set.

**Hierarchy**
One primary action per toolbar (`soft` / `solid`), others `outline` or `ghost`; destructive bulk action `variant="soft" tone="danger"`.

## States
| State | Driven by | DOM |
|---|---|---|
| loading (no rows) | `loading` | Skeleton rows (`data-skeleton`), `role="status"` with `labels.loading`, `aria-busy` on the table, `data-loading` on the root |
| loading (with rows) / loading more | `loading`, `loadingMore` | `aria-busy`; footer `labels.loadingMore` |
| empty | no rows and not loading | Centered muted body-s text (`empty` or `labels.empty`) |
| error | `error` | Body replaced by `role="alert"` message in `danger-text`; range and infinite-scroll status hidden, Pagination still shows when `rows` exceed `pageSize` |
| sorted | `sort` / `defaultSort` | `aria-sort` on the header, `data-sortable`, `data-sorted`. One sort icon per sortable column, always at the end edge of the head cell for every `headerAlign`: unsorted ⇅ in `text-disabled`, hover `text-muted`, sorted ↑ / ↓ in `text-secondary` — never accent |
| selected | `selected` / `defaultSelected` | `aria-selected` on rows, `accent-soft` fill; polite «Выбрано: N» |
| expanded | `expanded` / `defaultExpanded` | `data-expanded` on the parent row (one step darker, first cell weight 500); toggle `aria-expanded` |
| hover | pointer | Row / column wash per highlight flags |

Root data attributes: `data-size`, `data-divider`, `data-column-dividers`, `data-show-header`, `data-sticky-header`, `data-sticky-first-column`, `data-table-width="fill" | "auto"`, `data-highlight-row`, `data-highlight-column`, `data-striped`, `data-loading`, `data-selectable`, `data-expandable`, `data-dragging` (while drag-selecting).
Cell / row attributes: `data-align`, `data-numeric`, `data-first-column`, `data-column-id`, `data-column-hovered`, `data-stripe="alt"`, `data-clickable`, `data-depth`, `data-animate` (rows mounted by the latest expand, and rows whose `getRowKey` id is new in `rows` — not on the first fill), `data-select-index`.

Motion: animated rows fade in while settling by `--prime-space-1` (`base` + `enter`); detail panels open through `grid-template-rows`. Removed rows unmount at once; sorting and page changes swap rows instantly. Instant under `prefers-reduced-motion`.

Controlled vs uncontrolled: `sort`, `page`, `selected`, `expanded` are controlled with their `on…Change`; `defaultSort`, `defaultPage`, `defaultSelected`, `defaultExpanded` are the uncontrolled starting values.

## Layout & spacing
- The root fills its container (`width: 100%`) on `--prime-color-card-bg`, radius 12, and clips full-bleed head and rows; on a card or modal it becomes a sunken block.
- Toolbar padding `--prime-space-3` × cell padding; items `gap: var(--prime-space-2)`; below 30rem table width toolbar and footer stack.
- The footer has a hairline on top, range text left, Pagination right (compact on narrow widths). The range line appears only when there is more than one page or with infinite scroll; a table that shows every row has no footer.
- Columns scroll horizontally inside the table; use `stickyFirstColumn` for the identifying column. Works from 320px.
- Cell content: plain text, two-line text (title + `caption` secondary line), an Avatar with text, a Badge (one tier down), or a control one tier down. Row height follows the content; keep two-line cells to two lines.
- Column widths: pass `width` / `minWidth` / `maxWidth` strings (e.g. `"14rem"`); do not size cells with custom CSS.
- Sub-rows indent by `--dt-indent` per level (avatar of the tier + gap); override it on the root for other leading content.

## Accessibility
- Native `<table>` semantics; header cells are `scope="col"`. Sortable headers contain a `<button>` and expose `aria-sort`. The whole head cell shows the inset focus ring.
- Selection: the header checkbox (`labels.selectAll`, indeterminate when partial), row checkboxes (`labels.selectRow(getRowLabel(row))`), Space toggles, Shift+click / Shift+Space selects a range, press-and-drag sets the same state on passed rows; a polite live region announces `labels.selectedCount(n)`.
- Expansion: the toggle is a button with `aria-expanded`, `aria-controls` (detail row / sub-rows) and `labels.expand` / `labels.collapse`.
- `onCellClick` cells are `role="button"`, focusable, Enter / Space; inset focus ring.
- Pass `getRowLabel` so checkbox and toggle names are unique.
- `labels` (`DataTableLabels`):
  - `loading` — `"Загрузка данных…"`
  - `empty` — `"Нет данных для отображения."`
  - `range(from, to, total)` — `` `Показано ${from}–${to} из ${total}` ``
  - `loadingMore` — `"Догружаем строки…"`
  - `scrollForMore` — `"Прокрутите вниз для загрузки"`
  - `selectAll` — `"Выбрать все строки"`
  - `selectRow(label?)` — `` `Выбрать: ${label}` `` or `"Выбрать строку"`
  - `selectedCount(count)` — `` `Выбрано: ${count}` ``
  - `expand(label?)` — `` `Развернуть: ${label}` `` or `"Развернуть строку"`
  - `collapse(label?)` — `` `Свернуть: ${label}` `` or `"Свернуть строку"`

## Examples
| File | Scenario | When to use this pattern |
|---|---|---|
| [dashboard.tsx](examples/dashboard.tsx) | KPI cards + recent orders with avatar, badge, `numeric` | Overview screens |
| [sizes.tsx](examples/sizes.tsx) | Densities xs–xl | Choosing density |
| [numeric.tsx](examples/numeric.tsx) | `numeric`, `truncate` + `maxWidth` | Inventories and reports |
| [sorting-pagination.tsx](examples/sorting-pagination.tsx) | Controlled `sort` and `page` | Sorting / paging in URL or store |
| [selection.tsx](examples/selection.tsx) | `selectable` with bulk actions in `toolbar` | Bulk operations |
| [nested-rows.tsx](examples/nested-rows.tsx) | `getRowChildren`, controlled `expanded`, with selection | Hierarchical data |
| [detail-panel.tsx](examples/detail-panel.tsx) | `renderExpanded` + `stickyFirstColumn` | Details without leaving the list |
| [toolbar.tsx](examples/toolbar.tsx) | Search, SegmentedControl filter, export; `empty` on no match | Filterable lists |
| [states.tsx](examples/states.tsx) | `loading` + `loadingRows`, `empty`, `error` with retry | Tables backed by requests |
| [sticky.tsx](examples/sticky.tsx) | `stickyHeader` + `stickyFirstColumn` in a `scrollHeight` window (`infiniteScroll` with `initialVisibleRows={rows.length}`, so all rows render without pagination) | Wide reports |
| [infinite-scroll.tsx](examples/infinite-scroll.tsx) | `infiniteScroll`, `hasMore`, `loadingMore`, `onLoadMore` | Logs and feeds |
| [appearance.tsx](examples/appearance.tsx) | `striped`, `dividerStyle` none / dashed / dotted, `highlightColumnOnHover`, `columnDividers={false}`, no header | Row styling |
| [content-width.tsx](examples/content-width.tsx) | `fillWidth` vs `fillWidth={false}`, `align="center"`, a `grow` column with wrapped comments | Short lookup tables, description columns |
| [narrow.tsx](examples/narrow.tsx) | 320px container, `size="s"`, sticky first column, compact pagination | Mobile layouts |

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Invoice = { id: string; client: string; amount: number };

const columns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Счёт", accessor: "id" },
  { id: "client", header: "Клиент", accessor: "client", sortable: true },
  { id: "amount", header: "Сумма, ₽", accessor: "amount", numeric: true, sortable: true },
];

export function InvoiceTable({ rows }: { rows: Invoice[] }) {
  return <DataTable.Root columns={columns} rows={rows} getRowKey={(row) => row.id} />;
}
```

## Mistakes
- No `getRowKey` with `selectable` or sorting → selection follows positions, not records; always pass it.
- Numbers in a plain column → set `numeric` (alignment and tabular figures).
- A custom «Ничего не найдено» row inside `rows` → use `empty`.
- Rendering a spinner instead of rows → use `loading` (skeleton keeps the header and layout).
- Wrapping the table in a Card for a border → the table is already a bounded block with its own fill.
- Custom checkbox column → use `selectable` (range, drag, announcements built in).
- `scrollHeight` without `stickyHeader` on long tables → the header scrolls away.

## Related
- [Pagination](../pagination/COMPONENT.md) — used in the footer.
- [Checkbox](../checkbox/COMPONENT.md) — selection column.
- [ScrollContainer](../scroll-container/COMPONENT.md) — the scroll viewport.
- [EmptyPage](../empty-page/COMPONENT.md) — rich empty state via `empty`.
- [Badge](../badge/COMPONENT.md), [Avatar](../avatar/COMPONENT.md) — typical cell content.
- [Card](../card/COMPONENT.md) — KPIs above a table.
