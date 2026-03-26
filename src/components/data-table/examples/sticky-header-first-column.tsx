import { DataTable, type DataTableColumn } from "prime-ui-kit";

type MetricRow = {
  id: string;
  name: string;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  total: number;
};

const rows: MetricRow[] = [
  { id: "a", name: "Выручка", m1: 120, m2: 132, m3: 128, m4: 141, total: 521 },
  { id: "b", name: "Себестоимость", m1: 54, m2: 58, m3: 56, m4: 61, total: 229 },
  { id: "c", name: "Валовая прибыль", m1: 66, m2: 74, m3: 72, m4: 80, total: 292 },
  { id: "d", name: "OPEX", m1: 22, m2: 23, m3: 24, m4: 25, total: 94 },
  { id: "e", name: "EBITDA", m1: 44, m2: 51, m3: 48, m4: 55, total: 198 },
];

const columns: DataTableColumn<MetricRow>[] = [
  { id: "name", header: "Показатель", accessor: "name", sortable: true, minWidth: "11rem" },
  { id: "m1", header: "Янв", accessor: "m1", sortable: true, align: "end", minWidth: "5rem" },
  { id: "m2", header: "Фев", accessor: "m2", sortable: true, align: "end", minWidth: "5rem" },
  { id: "m3", header: "Мар", accessor: "m3", sortable: true, align: "end", minWidth: "5rem" },
  { id: "m4", header: "Апр", accessor: "m4", sortable: true, align: "end", minWidth: "5rem" },
  {
    id: "total",
    header: "Итого",
    accessor: "total",
    sortable: true,
    align: "end",
    minWidth: "6rem",
  },
];

/**
 * Горизонтальный скролл + `stickyHeader` и `stickyFirstColumn`: первая колонка и шапка остаются на месте.
 * Для демо включён `infiniteScroll` с короткой высотой viewport, чтобы был вертикальный скролл внутри таблицы.
 */
export default function DataTableStickyHeaderFirstColumnExample() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      stickyHeader
      stickyFirstColumn
      showPagination={false}
      infiniteScroll
      initialVisibleRows={rows.length}
      scrollHeight={200}
    />
  );
}
