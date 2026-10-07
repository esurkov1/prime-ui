/** `infiniteScroll` reveals loaded rows in batches (`infiniteBatchSize`), then calls `onLoadMore` while `hasMore`; `loadingMore` shows the footer status. Use for logs and feeds instead of pages. */

import { DataTable, type DataTableColumn } from "prime-ui-kit";
import * as React from "react";

type LogRow = { id: number; event: string; user: string; time: string };

const events = ["Вход в систему", "Изменён тариф", "Загружен файл", "Создан отчёт", "Выход"];
const users = ["anna", "boris", "vera", "gleb", "darya"];

const all: LogRow[] = Array.from({ length: 90 }, (_, i) => ({
  id: i + 1,
  event: events[i % events.length],
  user: users[(i * 2) % users.length],
  time: `${String(9 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
}));

const columns: DataTableColumn<LogRow>[] = [
  { id: "id", header: "#", accessor: "id", numeric: true, width: "4rem" },
  { id: "event", header: "Событие", accessor: "event" },
  { id: "user", header: "Пользователь", accessor: "user" },
  { id: "time", header: "Время", accessor: "time", numeric: true },
];

export default function DataTableInfiniteScrollExample() {
  const [count, setCount] = React.useState(20);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const hasMore = count < all.length;

  const loadMore = React.useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setCount((n) => Math.min(n + 20, all.length));
      setLoadingMore(false);
    }, 600);
  }, [hasMore, loadingMore]);

  return (
    <DataTable.Root
      columns={columns}
      rows={all.slice(0, count)}
      getRowKey={(row) => row.id}
      stickyHeader
      infiniteScroll
      initialVisibleRows={10}
      infiniteBatchSize={10}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={loadMore}
      scrollHeight={300}
    />
  );
}
