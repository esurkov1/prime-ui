import * as React from "react";

import {
  DataTable,
  type DataTableColumn,
  type DataTableSortState,
} from "@/components/data-table/DataTable";

type ShipmentRow = {
  id: string;
  route: string;
  pallets: number;
  eta: string;
};

const rows: ShipmentRow[] = [
  { id: "SH-901", route: "Склад → Новосибирск", pallets: 12, eta: "26.03" },
  { id: "SH-902", route: "Склад → Казань", pallets: 8, eta: "27.03" },
  { id: "SH-903", route: "Склад → Ростов", pallets: 20, eta: "28.03" },
  { id: "SH-904", route: "Склад → Калининград", pallets: 6, eta: "29.03" },
  { id: "SH-905", route: "Склад → Екатеринбург", pallets: 15, eta: "30.03" },
  { id: "SH-906", route: "Склад → Воронеж", pallets: 9, eta: "31.03" },
];

const columns: DataTableColumn<ShipmentRow>[] = [
  { id: "id", header: "Отгрузка", accessor: "id", sortable: true, minWidth: "8rem" },
  { id: "route", header: "Маршрут", accessor: "route", sortable: true, minWidth: "14rem" },
  {
    id: "pallets",
    header: "Паллеты",
    accessor: "pallets",
    sortable: true,
    align: "end",
    minWidth: "7rem",
  },
  { id: "eta", header: "ETA", accessor: "eta", sortable: true, minWidth: "6rem" },
];

export default function DataTableControlledSnippet() {
  const [sort, setSort] = React.useState<DataTableSortState>({
    columnId: "pallets",
    order: "desc",
  });
  const [page, setPage] = React.useState(1);

  return (
    <DataTable.Root
      className="examplePreviewBleed"
      columns={columns}
      rows={rows}
      sort={sort}
      onSortChange={(next) => {
        setSort(next);
        setPage(1);
      }}
      page={page}
      onPageChange={setPage}
      pageSize={3}
      siblingCount={1}
    />
  );
}
