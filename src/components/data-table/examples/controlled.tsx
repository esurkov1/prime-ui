/** Sort and page owned by the parent (a URL or a store): a header click goes asc → desc → none, a new sort returns to page 1 — `sort`, `onSortChange`, `page`, `onPageChange`. */
import { DataTable, type DataTableColumn, type DataTableSortState } from "prime-ui-kit";
import * as React from "react";

type Order = { id: number; customer: string; city: string; total: number };

const CUSTOMERS = ["Анна Соколова", "Борис Кравец", "Вера Львова", "Глеб Миронов", "Дарья Носова"];
const CITIES = ["Москва", "Казань", "Самара", "Томск", "Пермь"];

const ORDERS: Order[] = Array.from({ length: 23 }, (_, i) => ({
  id: 5000 + i,
  customer: CUSTOMERS[i % CUSTOMERS.length],
  city: CITIES[(i * 3) % CITIES.length],
  total: 1200 + ((i * 7919) % 48_000),
}));

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "№", accessor: "id", sortable: true, numeric: true, width: "5rem" },
  { id: "customer", header: "Покупатель", accessor: "customer", sortable: true },
  { id: "city", header: "Город", accessor: "city", sortable: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

export default function DataTableControlledExample() {
  const [sort, setSort] = React.useState<DataTableSortState>({ columnId: "total", order: "desc" });
  const [page, setPage] = React.useState(1);

  return (
    <DataTable
      columns={COLUMNS}
      rows={ORDERS}
      getRowKey={(row) => row.id}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      page={page}
      onPageChange={setPage}
      pageSize={5}
    />
  );
}
