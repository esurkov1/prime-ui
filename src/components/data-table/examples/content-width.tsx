/** A short lookup table sized by its content with a centered column, and a `grow` column that takes the free width and wraps — `fullWidth`, `align`, `grow`. */
import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Task = { id: string; task: string; hours: number; note: string };

const TASKS: Task[] = [
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

const HOURS = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

const LOOKUP_COLUMNS: DataTableColumn<Task>[] = [
  { id: "id", header: "Задача", accessor: "id" },
  { id: "task", header: "Описание", accessor: "task" },
  { id: "hours", header: "Часы", align: "center", cell: (row) => HOURS.format(row.hours) },
];

const NOTE_COLUMNS: DataTableColumn<Task>[] = [
  { id: "id", header: "Задача", accessor: "id" },
  { id: "task", header: "Название", accessor: "task" },
  { id: "note", header: "Комментарий", accessor: "note", grow: true },
];

export default function DataTableContentWidthExample() {
  return (
    <>
      <div className={styles.specimen}>
        <DataTable
          columns={LOOKUP_COLUMNS}
          rows={TASKS}
          getRowKey={(row) => row.id}
          fullWidth={false}
        />
        <Typography.Root as="span" variant="caption" tone="muted">
          fullWidth=&#123;false&#125; · align="center"
        </Typography.Root>
      </div>
      <div className={styles.specimen}>
        <DataTable columns={NOTE_COLUMNS} rows={TASKS} getRowKey={(row) => row.id} />
        <Typography.Root as="span" variant="caption" tone="muted">
          grow
        </Typography.Root>
      </div>
    </>
  );
}
