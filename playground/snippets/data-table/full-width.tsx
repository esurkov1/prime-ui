import { DataTable, type DataTableColumn } from "@/components/data-table/DataTable";

type Row = { id: string; task: string; hours: number };

const rows: Row[] = [
  { id: "T-12", task: "Сверстать отчёт по спринту", hours: 3 },
  { id: "T-13", task: "Проверить миграции БД", hours: 1.5 },
  { id: "T-14", task: "Обновить подсказки в форме входа", hours: 2 },
];

const columns: DataTableColumn<Row>[] = [
  { id: "id", header: "Задача", accessor: "id", sortable: true, minWidth: "6rem" },
  { id: "task", header: "Описание", accessor: "task", sortable: true, minWidth: "12rem" },
  {
    id: "hours",
    header: "Часы",
    accessor: "hours",
    sortable: true,
    align: "end",
    minWidth: "5rem",
    cell: (row) =>
      row.hours.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 1 }),
  },
];

export default function DataTableFullWidthSnippet() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "28rem",
        padding: "var(--prime-sys-spacing-x3)",
        borderRadius: "var(--prime-sys-shape-radius-m)",
        border: "1px dashed var(--prime-sys-color-border-subtle)",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: "0 0 0.75rem",
          fontSize: "var(--prime-sys-size-control-s-supportText)",
          color: "var(--prime-sys-color-content-secondary)",
        }}
      >
        Узкий контейнер: корень таблицы тянется на 100% ширины родителя (сетка карточки, колонка
        формы).
      </p>
      <DataTable.Root columns={columns} rows={rows} showPagination={false} pageSize={10} />
    </div>
  );
}
