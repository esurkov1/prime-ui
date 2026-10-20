/** An audit log that fills the height of its panel and loads older entries while scrolling; the status shows while the request is pending, and a long detail stays on one line in a fixed column that keeps its width as rows scroll in — `scrollHeight`, `paging`, `onLoadMore`, `truncate`, `width`. */
import { DataTable, type DataTableColumn } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type LogRow = { id: number; event: string; detail: string; user: string; time: string };

const EVENTS = ["Вход в систему", "Изменён тариф", "Загружен файл", "Создан отчёт", "Выход"];
const DETAILS = [
  "Тариф «Бизнес»",
  "Счёт № 2041",
  "Договор аренды склада на Варшавском шоссе, приложение 3 к дополнительному соглашению",
  "Отчёт по выручке за третий квартал с разбивкой по филиалам и менеджерам",
];
const USERS = ["Анна Смирнова", "Борис Котов", "Вера Ильина", "Глеб Орлов", "Дарья Лис"];

const LOG: LogRow[] = Array.from({ length: 120 }, (_, i) => ({
  id: 4800 - i,
  event: EVENTS[i % EVENTS.length],
  // The long details come further down the log: they scroll into a column already laid out.
  detail: DETAILS[i < 60 ? i % 2 : 2 + (i % 2)],
  user: USERS[(i * 2) % USERS.length],
  time: `${String(18 - (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

const COLUMNS: DataTableColumn<LogRow>[] = [
  { id: "id", header: "№", accessor: "id", numeric: true, width: "5rem" },
  { id: "event", header: "Событие", accessor: "event" },
  { id: "detail", header: "Объект", accessor: "detail", truncate: true, width: "16rem" },
  { id: "user", header: "Пользователь", accessor: "user" },
  { id: "time", header: "Время", accessor: "time", numeric: true },
];

const BATCH = 30;

export default function DataTableFillHeightExample() {
  const [loaded, setLoaded] = React.useState(BATCH);

  // The returned promise is the loading state: the table shows its status until it settles.
  const loadMore = () =>
    new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setLoaded((count) => Math.min(count + BATCH, LOG.length));
        resolve();
      }, 700);
    });

  return (
    <div className={styles.fillStage}>
      <DataTable
        columns={COLUMNS}
        rows={LOG.slice(0, loaded)}
        getRowKey={(row) => row.id}
        paging="infinite"
        pageSize={BATCH}
        hasMore={loaded < LOG.length}
        onLoadMore={loadMore}
        scrollHeight="fill"
        stickyHeader
      />
    </div>
  );
}
