/** An audit log that fills the height of its panel and loads older entries while scrolling; the status shows while the request is pending — `scrollHeight`, `paging`, `onLoadMore`. */
import { DataTable, type DataTableColumn } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type LogRow = { id: number; event: string; user: string; time: string };

const EVENTS = ["Вход в систему", "Изменён тариф", "Загружен файл", "Создан отчёт", "Выход"];
const USERS = ["Анна Смирнова", "Борис Котов", "Вера Ильина", "Глеб Орлов", "Дарья Лис"];

const LOG: LogRow[] = Array.from({ length: 120 }, (_, i) => ({
  id: 4800 - i,
  event: EVENTS[i % EVENTS.length],
  user: USERS[(i * 2) % USERS.length],
  time: `${String(18 - (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

const COLUMNS: DataTableColumn<LogRow>[] = [
  { id: "id", header: "№", accessor: "id", numeric: true, width: "5rem" },
  { id: "event", header: "Событие", accessor: "event" },
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
