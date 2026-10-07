/** An audit log that reveals loaded rows in batches and then asks the server for more — `paging`, `infiniteBatchSize`, `hasMore`, `loadingMore`, `onLoadMore`. */
import { DataTable, type DataTableColumn } from "prime-ui-kit";
import * as React from "react";

type LogRow = { id: number; event: string; user: string; time: string };

const EVENTS = ["Вход в систему", "Изменён тариф", "Загружен файл", "Создан отчёт", "Выход"];
const USERS = ["anna", "boris", "vera", "gleb", "darya"];

const LOG: LogRow[] = Array.from({ length: 90 }, (_, i) => ({
  id: i + 1,
  event: EVENTS[i % EVENTS.length],
  user: USERS[(i * 2) % USERS.length],
  time: `${String(9 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

const COLUMNS: DataTableColumn<LogRow>[] = [
  { id: "id", header: "#", accessor: "id", numeric: true, width: "4rem" },
  { id: "event", header: "Событие", accessor: "event" },
  { id: "user", header: "Пользователь", accessor: "user" },
  { id: "time", header: "Время", accessor: "time", numeric: true },
];

export default function DataTableInfiniteScrollExample() {
  const [loaded, setLoaded] = React.useState(20);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const hasMore = loaded < LOG.length;

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setLoaded((count) => Math.min(count + 20, LOG.length));
      setLoadingMore(false);
    }, 600);
  };

  return (
    <DataTable
      columns={COLUMNS}
      rows={LOG.slice(0, loaded)}
      getRowKey={(row) => row.id}
      paging="infinite"
      stickyHeader
      initialVisibleRows={10}
      infiniteBatchSize={10}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={loadMore}
      scrollHeight={300}
    />
  );
}
