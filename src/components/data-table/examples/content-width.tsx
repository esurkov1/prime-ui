/** `fillWidth` (default) stretches the table to its container; `fillWidth={false}` sizes it by content; a column can be centered with `align="center"`; a `grow` column takes the free width and wraps long text. Use content width for short lookup tables inside wide layouts, `grow` for description columns. */

import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Task = { id: string; task: string; hours: number; note: string };

const rows: Task[] = [
  {
    id: "T-12",
    task: "Сверстать отчёт по спринту",
    hours: 3,
    note: "Сводка по закрытым задачам, графики скорости команды и список того, что переносится в следующий спринт.",
  },
  {
    id: "T-13",
    task: "Проверить миграции БД",
    hours: 1.5,
    note: "Прогнать миграции на копии продовой базы и сравнить время выполнения с прошлым релизом.",
  },
  {
    id: "T-14",
    task: "Обновить подсказки в форме входа",
    hours: 2,
    note: "Тексты ошибок и подсказок под полями, согласовать формулировки с поддержкой.",
  },
];

const hours = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

const columns: DataTableColumn<Task>[] = [
  { id: "id", header: "Задача", accessor: "id" },
  { id: "task", header: "Описание", accessor: "task" },
  { id: "hours", header: "Часы", align: "center", cell: (row) => hours.format(row.hours) },
];

const withNotes: DataTableColumn<Task>[] = [
  { id: "id", header: "Задача", accessor: "id" },
  { id: "task", header: "Название", accessor: "task" },
  { id: "note", header: "Комментарий", accessor: "note", grow: true },
];

export default function DataTableContentWidthExample() {
  return (
    <div className={styles.stack}>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          fillWidth (по умолчанию)
        </Typography.Root>
        <DataTable.Root columns={columns} rows={rows} getRowKey={(row) => row.id} />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          fillWidth=&#123;false&#125;
        </Typography.Root>
        <DataTable.Root
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          fillWidth={false}
        />
      </div>
      <div className={styles.group}>
        <Typography.Root variant="code" tone="muted">
          grow: колонка «Комментарий» переносит текст
        </Typography.Root>
        <DataTable.Root columns={withNotes} rows={rows} getRowKey={(row) => row.id} />
      </div>
    </div>
  );
}
