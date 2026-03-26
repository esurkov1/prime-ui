import { DataTable, type DataTableColumn, type DataTableSortState } from "prime-ui-kit";
import * as React from "react";

type TaskRow = {
  id: string;
  title: string;
  assignee: string;
  priority: number;
};

const rows: TaskRow[] = [
  { id: "T-01", title: "Сверстать отчёт", assignee: "Аня", priority: 2 },
  { id: "T-02", title: "Починить билд", assignee: "Борис", priority: 1 },
  { id: "T-03", title: "Обновить зависимости", assignee: "Вика", priority: 3 },
  { id: "T-04", title: "Ревью API", assignee: "Гриша", priority: 2 },
  { id: "T-05", title: "Документация полей", assignee: "Даша", priority: 4 },
  { id: "T-06", title: "E2E флейки", assignee: "Егор", priority: 1 },
];

const columns: DataTableColumn<TaskRow>[] = [
  { id: "id", header: "ID", accessor: "id", sortable: true, minWidth: "5rem" },
  { id: "title", header: "Задача", accessor: "title", sortable: true, minWidth: "14rem" },
  {
    id: "assignee",
    header: "Исполнитель",
    accessor: "assignee",
    sortable: true,
    minWidth: "10rem",
  },
  {
    id: "priority",
    header: "Приоритет",
    accessor: "priority",
    sortable: true,
    align: "end",
    minWidth: "8rem",
  },
];

/**
 * Управляемые `sort` и `page`: родитель синхронизирует состояние с URL, стором или формой фильтров.
 */
export default function DataTableControlledSortAndPageExample() {
  const [sort, setSort] = React.useState<DataTableSortState>({
    columnId: "priority",
    order: "asc",
  });
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
      pageSize={3}
      siblingCount={1}
    />
  );
}
