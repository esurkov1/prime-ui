/** `toolbar` above the table: search Input, SegmentedControl filter and an `s` action; `empty` when the filter finds nothing. Use for filterable lists; the row wraps on narrow widths. */

import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
  Icon,
  Input,
  SegmentedControl,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Status = "active" | "paused" | "archived";
type Campaign = { id: string; name: string; status: Status; clicks: number; ctr: number };

const statusLabel: Record<Status, string> = {
  active: "Активна",
  paused: "Пауза",
  archived: "Архив",
};
const statusColor = { active: "green", paused: "orange", archived: "gray" } as const;

const rows: Campaign[] = [
  { id: "c1", name: "Осенняя распродажа", status: "active", clicks: 18_420, ctr: 3.4 },
  { id: "c2", name: "Возврат корзины", status: "active", clicks: 6_105, ctr: 5.1 },
  { id: "c3", name: "Новые клиенты — поиск", status: "paused", clicks: 2_390, ctr: 1.8 },
  { id: "c4", name: "Ретаргетинг 30 дней", status: "active", clicks: 9_874, ctr: 2.7 },
  { id: "c5", name: "Летний промокод", status: "archived", clicks: 31_002, ctr: 4.0 },
  { id: "c6", name: "Бренд — медийка", status: "paused", clicks: 1_120, ctr: 0.9 },
  { id: "c7", name: "Чёрная пятница — тизер", status: "active", clicks: 4_560, ctr: 2.2 },
];

const int = new Intl.NumberFormat("ru-RU");
const pct = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const columns: DataTableColumn<Campaign>[] = [
  {
    id: "name",
    header: "Кампания",
    accessor: "name",
    sortable: true,
    truncate: true,
    maxWidth: "16rem",
  },
  {
    id: "status",
    header: "Статус",
    accessor: "status",
    cell: (row) => (
      <Badge.Root color={statusColor[row.status]}>{statusLabel[row.status]}</Badge.Root>
    ),
  },
  {
    id: "clicks",
    header: "Клики",
    accessor: "clicks",
    sortable: true,
    numeric: true,
    cell: (row) => int.format(row.clicks),
  },
  {
    id: "ctr",
    header: "CTR, %",
    accessor: "ctr",
    sortable: true,
    numeric: true,
    cell: (row) => pct.format(row.ctr),
  },
];

export default function DataTableToolbarExample() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<"all" | Status>("all");

  const filtered = rows.filter(
    (row) =>
      (status === "all" || row.status === status) &&
      row.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <DataTable.Root
      columns={columns}
      rows={filtered}
      getRowKey={(row) => row.id}
      pageSize={5}
      empty="Ничего не найдено — измените запрос или фильтр"
      toolbar={
        <div className={styles.toolbar}>
          <div className={`${styles.toolbarGroup} ${styles.toolbarGrow}`}>
            <Input.Root size="s" className={styles.search}>
              <Input.Wrapper>
                <Input.Icon side="start">
                  <Icon name="action.search" strokeWidth={2} />
                </Input.Icon>
                <Input.Field
                  type="search"
                  placeholder="Поиск кампаний"
                  aria-label="Поиск кампаний"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Input.Wrapper>
            </Input.Root>
            <SegmentedControl.Root
              size="s"
              aria-label="Статус"
              value={status}
              onValueChange={(v) => setStatus(v as "all" | Status)}
            >
              <SegmentedControl.Item value="all">Все</SegmentedControl.Item>
              <SegmentedControl.Item value="active">Активные</SegmentedControl.Item>
              <SegmentedControl.Item value="paused">На паузе</SegmentedControl.Item>
            </SegmentedControl.Root>
          </div>
          <Button.Root variant="outline" tone="neutral" size="s">
            Экспорт
          </Button.Root>
        </div>
      }
    />
  );
}
