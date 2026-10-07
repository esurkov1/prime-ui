/** Controlled `sort` and `page`: a header click goes asc → desc → none, and a sort change returns to page 1. Use when sorting and paging live in the URL or a store. */

import { DataTable, type DataTableColumn, type DataTableSortState } from "prime-ui-kit";
import * as React from "react";

type Order = { id: number; customer: string; city: string; date: string; total: number };

const customers = ["Анна С.", "Борис К.", "Вера Л.", "Глеб М.", "Дарья Н.", "Егор П."];
const cities = ["Москва", "Казань", "Самара", "Томск", "Пермь"];

const rows: Order[] = Array.from({ length: 23 }, (_, i) => ({
  id: 5000 + i,
  customer: customers[i % customers.length],
  city: cities[(i * 3) % cities.length],
  date: `2026-09-${String((i % 28) + 1).padStart(2, "0")}`,
  total: 1200 + ((i * 7919) % 48_000),
}));

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});
const day = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

const columns: DataTableColumn<Order>[] = [
  { id: "id", header: "№", accessor: "id", sortable: true, numeric: true, width: "5rem" },
  { id: "customer", header: "Покупатель", accessor: "customer", sortable: true },
  { id: "city", header: "Город", accessor: "city", sortable: true },
  {
    id: "date",
    header: "Дата",
    accessor: "date",
    sortable: true,
    cell: (row) => day.format(new Date(row.date)),
  },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => rub.format(row.total),
  },
];

export default function DataTableSortingPaginationExample() {
  const [sort, setSort] = React.useState<DataTableSortState>({ columnId: "total", order: "desc" });
  const [page, setPage] = React.useState(1);

  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
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
