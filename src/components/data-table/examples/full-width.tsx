import { DataTable, type DataTableColumn } from "prime-ui-kit";

import styles from "./examples-demos.module.css";

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

/** Соответствует `playground/snippets/data-table/full-width.tsx`. */
export default function DataTableFullWidthExample() {
  return (
    <div className={styles.narrowCard}>
      <p className={styles.lead}>
        Узкий контейнер: корень таблицы тянется на 100% ширины родителя (сетка карточки, колонка
        формы).
      </p>
      <DataTable.Root columns={columns} rows={rows} showPagination={false} pageSize={10} />
    </div>
  );
}
