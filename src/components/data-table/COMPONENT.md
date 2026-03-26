# DataTable

**Проектирование по умолчанию:** при проектировании экранов и примеров изначально выбирай **`m`** для `size` (где есть ось размера), если явно не оговорено иное.

## What it is

The `DataTable.Root` component is a table built on native `table` markup with optional column sorting, pagination or scroll mode with incremental loading, a sticky header, and a sticky first column.

## What it is for

- **Warehouse and shipping** — batches, routes, and arrival windows with sorting by volume and paginated browsing of long registers.
- **Finance and billing** — invoice and payment status summaries with right-aligned amounts and visual markers in cells.
- **Planning and reports** — wide quarter and totals grids with horizontal scrolling, a sticky first metric column, and header.
- **Support and contacts** — ticket catalogs with custom cells (links, actions) and row click to open a detail card.
- **Activity log** — long event feeds with infinite scroll and fetching the next chunks from the server.
- **Internal panels** — compact tables in a narrow card or form column where filling the container width matters.

## Use cases

Import from the `prime-ui-kit` package. Examples are grouped by screen intent and prop sets.

### Basic

Registry of medical rooms: four columns, sort by name, no external state.

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Room = { code: string; name: string; floor: number; seats: number };

const rows: Room[] = [
  { code: "A-12", name: "Therapy", floor: 2, seats: 3 },
  { code: "B-04", name: "Lab", floor: 1, seats: 2 },
  { code: "C-21", name: "X-ray", floor: 3, seats: 1 },
];

const columns: DataTableColumn<Room>[] = [
  { id: "code", header: "Code", accessor: "code", sortable: true, minWidth: "5rem" },
  { id: "name", header: "Room", accessor: "name", sortable: true, minWidth: "10rem" },
  {
    id: "floor",
    header: "Floor",
    accessor: "floor",
    sortable: true,
    align: "end",
    minWidth: "5rem",
  },
  {
    id: "seats",
    header: "Seats",
    accessor: "seats",
    sortable: true,
    align: "end",
    minWidth: "5rem",
  },
];

export function ClinicRoomsTable() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      pageSize={5}
      showPagination={rows.length > 5}
    />
  );
}
```

### Variants / sizes

Course catalog: `l` size, dashed dividers, and zebra striping for a long learner list.

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Enrollee = { id: string; name: string; track: string; progress: number };

const columns: DataTableColumn<Enrollee>[] = [
  { id: "name", header: "Participant", accessor: "name", sortable: true, minWidth: "11rem" },
  { id: "track", header: "Track", accessor: "track", sortable: true, minWidth: "9rem" },
  {
    id: "progress",
    header: "Progress, %",
    accessor: "progress",
    sortable: true,
    align: "end",
    minWidth: "7rem",
    cell: (row) => `${row.progress}%`,
  },
];

export function CourseRosterTable({ rows }: { rows: Enrollee[] }) {
  return (
    <DataTable.Root
      size="l"
      dividerStyle="dashed"
      striped
      columns={columns}
      rows={rows}
      defaultSort={{ columnId: "progress", order: "desc" }}
      pageSize={6}
    />
  );
}
```

### In context (form / modal / sidebar / …)

Contract approval sidebar: narrow width, table stretches to 100%, sticky header when scrolling inside the panel.

```tsx
import { DataTable, type DataTableColumn } from "prime-ui-kit";

type Clause = { id: string; title: string; owner: string; risk: "low" | "med" | "high" };

const columns: DataTableColumn<Clause>[] = [
  { id: "title", header: "Clause", accessor: "title", sortable: true, minWidth: "10rem" },
  { id: "owner", header: "Counsel", accessor: "owner", sortable: true, minWidth: "8rem" },
  {
    id: "risk",
    header: "Risk",
    accessor: "risk",
    sortable: true,
    minWidth: "6rem",
    cell: (row) => (row.risk === "high" ? "High" : row.risk === "med" ? "Medium" : "Low"),
  },
];

export function ContractClausesDrawer({ rows }: { rows: Clause[] }) {
  return (
    <aside style={{ width: 360, maxHeight: 420, display: "flex", flexDirection: "column" }}>
      <DataTable.Root
        className="contract-clauses-table"
        columns={columns}
        rows={rows}
        infiniteScroll
        stickyHeader
        scrollHeight={300}
        initialVisibleRows={8}
        infiniteBatchSize={10}
        showPagination={false}
        pageSize={8}
      />
    </aside>
  );
}
```

### Controlled mode

Taxi dispatch: parent holds sort by pickup ETA and page; when the sort column changes, the page is reset manually.

```tsx
import * as React from "react";
import { DataTable, type DataTableColumn, type DataTableSortState } from "prime-ui-kit";

type Ride = { id: string; district: string; etaMin: number; driver: string };

const columns: DataTableColumn<Ride>[] = [
  { id: "id", header: "Order", accessor: "id", sortable: true, minWidth: "6rem" },
  { id: "district", header: "District", accessor: "district", sortable: true, minWidth: "9rem" },
  {
    id: "etaMin",
    header: "Min to pickup",
    accessor: "etaMin",
    sortable: true,
    align: "end",
    minWidth: "8rem",
  },
  { id: "driver", header: "Driver", accessor: "driver", sortable: true, minWidth: "10rem" },
];

export function TaxiDispatchTable({ rows }: { rows: Ride[] }) {
  const [sort, setSort] = React.useState<DataTableSortState>({ columnId: "etaMin", order: "asc" });
  const [page, setPage] = React.useState(1);

  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      page={page}
      onPageChange={setPage}
      pageSize={4}
    />
  );
}
```

## Anatomy

- **`DataTable.Root`** — wrapper with `ControlSizeProvider`, `data-*` on the root `div` (size, dividers, header, stickiness, highlights, zebra).
- **Inside** — scrollable `div.viewport` with `table`, `colgroup`, optional `thead` with `th` (sort button or text), `tbody` with `tr`/`td`, and a bottom sentinel for `IntersectionObserver` in infinite-scroll mode.
- **Footer** — “Showing X–Y of Z” counter; in classic pagination mode — `Pagination.Root`; with incremental loading — status text.

## API

### DataTable.Root

| Prop | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| columns | `DataTableColumn<Row>[]` | — | Yes | Column configuration |
| rows | `Row[]` | — | Yes | Row data |
| size | `"s" \| "m" \| "l" \| "xl"` | `"m"` | No | Row size and cell tokens |
| className | `string` | — | No | Root wrapper class |
| showHeader | `boolean` | `true` | No | Show thead |
| stickyHeader | `boolean` | `false` | No | Sticky header |
| stickyFirstColumn | `boolean` | `false` | No | Sticky first column |
| getRowKey | `(row, index) => React.Key` | index | No | Row key |
| onRowClick | `(row, index, event) => void` | — | No | Row click |
| loading | `boolean` | `false` | No | Loading placeholder when the visible slice is empty |
| loadingText | `React.ReactNode` | default text | No | Loading text |
| emptyText | `React.ReactNode` | default text | No | Empty list text |
| dividerStyle | `"standard" \| "dashed" \| "dotted" \| "none"` | `"standard"` | No | Grid line style |
| sort | `DataTableSortState` | — | No | Controlled sort |
| defaultSort | `DataTableSortState` | `null` | No | Uncontrolled initial sort |
| onSortChange | `(sort) => void` | — | No | Sort change |
| page | `number` | — | No | Controlled page |
| defaultPage | `number` | `1` | No | Initial page |
| onPageChange | `(page) => void` | — | No | Page change |
| pageSize | `number` | `10` | No | Page size / initial slice |
| showPagination | `boolean` | `true` | No | Show pagination |
| siblingCount | `number` | `1` | No | Page number window in Pagination |
| paginationSize | `DataTableSize` | same as root | No | Pagination control size |
| infiniteScroll | `boolean` | `false` | No | Scroll mode with chunks |
| initialVisibleRows | `number` | `pageSize` | No | Initial visible row count |
| infiniteBatchSize | `number` | `20` | No | Step for growing the local slice |
| hasMore | `boolean` | `false` | No | Whether more data exists for `onLoadMore` |
| loadingMore | `boolean` | `false` | No | Loading-more flag |
| onLoadMore | `() => void \| Promise<void>` | — | No | Request next chunk |
| scrollHeight | `number \| string` | `360` | No | Scroll area height |
| highlightRowOnHover | `boolean` | `true` | No | Row highlight |
| highlightColumnOnHover | `boolean` | `false` | No | Column highlight |
| striped | `boolean` | `false` | No | Zebra striping |

### Column fields (`DataTableColumn<Row>`)

| Field | Type | Default | Required | Description |
|------|-----|---------|----------|-------------|
| id | `string` | — | Yes | Column id |
| header | `React.ReactNode` | — | Yes | Header |
| accessor | `keyof Row \| (row) => unknown` | — | No | Value for cell and sort |
| cell | `(row) => React.ReactNode` | — | No | Custom cell |
| sortable | `boolean` | `false` | No | Sort on click |
| sortAccessor | `(row) => unknown` | — | No | Value used only for sorting |
| sortComparator | `(a, b, order) => number` | — | No | Custom comparator |
| align | `"start" \| "center" \| "end"` | `"start"` | No | Alignment |
| width | `string` | — | No | col width |
| minWidth | `string` | — | No | Min col width |
| onHeaderClick | `(event) => void` | — | No | Extra click on th |
| onCellClick | `(row, event) => void` | — | No | Click / keyboard on cell |

Exported types: `DataTableSortState`, `DataTableOrder`, `DataTableSize`, `DataTableDividerStyle`, `DataTableCellAlign`, `DataTableRootProps`, `DataTableColumn`.

## Variants

- **`dividerStyle`** — `standard` (solid line), `dashed`, `dotted`, `none` (no lines between cells).
- **`size`** — four tiers `s`–`xl` for row height, padding, and text; affects nested controls via size context.

## States

- **Loading** — `loading` when there are no rows to show: one row with `loadingText`.
- **Empty** — when `loading === false` and zero rows, `emptyText` is shown.
- **Sort** — click cycle: none → asc → desc → none for that column; arrow indicator in the header.
- **Pagination** — page is clamped to range; when data changes in normal mode, page resets to 1 when switching away from infinite mode.
- **Infinite scroll** — local slice grows up to `rows.length` first, then `onLoadMore` is called when `hasMore`.

## Accessibility (a11y)

- Sortable column headers are an interactive region inside `th` with `scope="col"`.
- Cells with `onCellClick` get `role="button"`, `tabIndex={0}`, and Enter / Space handling.
- Sort direction icons are marked `aria-hidden`.
- The table does not add `grid` roles or extended arrow-key navigation — for complex behavior, configure that externally.

## Limitations and notes

- No built-in column resize by drag, pinning arbitrary columns (first column only), or built-in search/filtering.
- No loading overlay on top of already visible rows: `loading` only affects the view when there are no rows to show.
- For very large arrays without chunked loading, prefer `infiniteScroll` and data fetching rather than tens of thousands of rows in `rows` at once.
- Sorting runs in memory on the passed array; server-side sorting is the consumer’s responsibility (pass pre-sorted `rows` or manage them externally).

## Related components

- **Pagination** — rendered below the table in normal mode.
- **Badge**, **Tag** — typical cell content for statuses and labels (inherit table size unless overridden).
- **LinkButton** — links and actions inside cells.
- **ControlSizeProvider** — used inside the root; when nesting your own controls, you can rely on the same size context.
