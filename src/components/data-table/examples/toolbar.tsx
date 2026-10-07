/** A campaign list with search, a status filter and export above the table; the empty text when nothing matches — `toolbar`, `empty`. */
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

const STATUS: Record<Status, { label: string; color: "green" | "orange" | "gray" }> = {
  active: { label: "Активна", color: "green" },
  paused: { label: "Пауза", color: "orange" },
  archived: { label: "Архив", color: "gray" },
};

const CAMPAIGNS: Campaign[] = [
  { id: "c1", name: "Осенняя распродажа", status: "active", clicks: 18_420, ctr: 3.4 },
  { id: "c2", name: "Возврат корзины", status: "active", clicks: 6_105, ctr: 5.1 },
  { id: "c3", name: "Новые клиенты — поиск", status: "paused", clicks: 2_390, ctr: 1.8 },
  { id: "c4", name: "Ретаргетинг 30 дней", status: "active", clicks: 9_874, ctr: 2.7 },
  { id: "c5", name: "Летний промокод", status: "archived", clicks: 31_002, ctr: 4.0 },
  { id: "c6", name: "Бренд — медийка", status: "paused", clicks: 1_120, ctr: 0.9 },
  { id: "c7", name: "Чёрная пятница — тизер", status: "active", clicks: 4_560, ctr: 2.2 },
];

const INT = new Intl.NumberFormat("ru-RU");
const PCT = new Intl.NumberFormat("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const COLUMNS: DataTableColumn<Campaign>[] = [
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
      <Badge.Root color={STATUS[row.status].color}>{STATUS[row.status].label}</Badge.Root>
    ),
  },
  {
    id: "clicks",
    header: "Клики",
    accessor: "clicks",
    sortable: true,
    numeric: true,
    cell: (row) => INT.format(row.clicks),
  },
  {
    id: "ctr",
    header: "CTR, %",
    accessor: "ctr",
    sortable: true,
    numeric: true,
    cell: (row) => PCT.format(row.ctr),
  },
];

export default function DataTableToolbarExample() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");

  const found = CAMPAIGNS.filter(
    (row) =>
      (status === "all" || row.status === status) &&
      row.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <DataTable
      columns={COLUMNS}
      rows={found}
      getRowKey={(row) => row.id}
      pageSize={5}
      empty="Ничего не найдено — измените запрос или фильтр"
      toolbar={
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <Input.Root size="s" className={styles.search}>
              <Input.Wrapper>
                <Input.Icon side="start">
                  <Icon name="action.search" />
                </Input.Icon>
                <Input.Field
                  type="search"
                  placeholder="Поиск кампаний"
                  aria-label="Поиск кампаний"
                  value={query}
                  onValueChange={setQuery}
                />
              </Input.Wrapper>
            </Input.Root>
            <SegmentedControl.Root
              size="s"
              aria-label="Статус"
              value={status}
              onValueChange={setStatus}
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
