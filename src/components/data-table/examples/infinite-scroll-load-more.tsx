import { DataTable, type DataTableColumn } from "prime-ui-kit";
import * as React from "react";

type LogRow = {
  id: string;
  time: string;
  level: "info" | "warn" | "error";
  message: string;
};

const fullDataset: LogRow[] = [
  { id: "L1", time: "10:01:02", level: "info", message: "Сервис запущен" },
  { id: "L2", time: "10:01:08", level: "info", message: "Подключение к БД" },
  { id: "L3", time: "10:02:11", level: "warn", message: "Медленный запрос 420 ms" },
  { id: "L4", time: "10:03:44", level: "error", message: "Таймаут внешнего API" },
  { id: "L5", time: "10:04:01", level: "info", message: "Повтор запроса OK" },
  { id: "L6", time: "10:05:30", level: "info", message: "Деплой v1.2.0" },
  { id: "L7", time: "10:06:12", level: "warn", message: "Очередь > 500" },
  { id: "L8", time: "10:07:00", level: "info", message: "Стабилизация очереди" },
];

const columns: DataTableColumn<LogRow>[] = [
  { id: "time", header: "Время", accessor: "time", sortable: true, minWidth: "7rem" },
  { id: "level", header: "Уровень", accessor: "level", sortable: true, minWidth: "6rem" },
  { id: "message", header: "Сообщение", accessor: "message", sortable: true, minWidth: "16rem" },
];

/**
 * Сначала догружается локальный срез (`infiniteBatchSize`), затем при `hasMore` вызывается `onLoadMore`
 * (имитация запроса к API с задержкой).
 */
export default function DataTableInfiniteScrollLoadMoreExample() {
  const [loaded, setLoaded] = React.useState(4);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const rows = fullDataset.slice(0, loaded);
  const hasMore = loaded < fullDataset.length;

  const onLoadMore = React.useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    window.setTimeout(() => {
      setLoaded((n) => Math.min(n + 3, fullDataset.length));
      setLoadingMore(false);
    }, 400);
  }, [hasMore, loadingMore]);

  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      infiniteScroll
      initialVisibleRows={3}
      infiniteBatchSize={2}
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={onLoadMore}
      showPagination={false}
      scrollHeight={220}
    />
  );
}
