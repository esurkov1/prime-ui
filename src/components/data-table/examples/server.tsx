/** A CRM deal list the server sorts, pages and searches; a new search returns to page 1 — `source`, `rowCount`, `sort`, `page`, `loading`. */
import {
  Badge,
  DataTable,
  type DataTableColumn,
  type DataTableSortState,
  matchesSmartFilter,
  SmartFilter,
  type SmartFilterField,
  type SmartFilterValue,
} from "prime-ui-kit";
import * as React from "react";

type Stage = "new" | "talks" | "won" | "lost";
type Deal = { id: number; client: string; manager: string; stage: Stage; amount: number };
type DealsRequest = {
  page: number;
  sort: DataTableSortState;
  search: string;
  filter: SmartFilterValue;
};
type DealsPage = { rows: Deal[]; total: number };

const PAGE_SIZE = 8;
/** The fake server answers after this delay, like a real request. */
const LATENCY_MS = 600;

const STAGE: Record<Stage, { label: string; color: "blue" | "orange" | "green" | "gray" }> = {
  new: { label: "Новая", color: "blue" },
  talks: { label: "Переговоры", color: "orange" },
  won: { label: "Выиграна", color: "green" },
  lost: { label: "Проиграна", color: "gray" },
};
const STAGES = Object.keys(STAGE) as Stage[];

const CLIENTS = [
  "ООО «Вектор»",
  "АО «Северсталь-Логистик»",
  "ИП Смирнова",
  "ООО «Альфа-Трейд»",
  "ЗАО «Меридиан»",
  "ООО «Гринлайн»",
  "АО «Техносфера»",
  "ООО «Купол»",
  "ООО «Ространс»",
  "АО «Нордик Фудс»",
  "ООО «Пиксель Медиа»",
];
const MANAGERS = ["Анна Климова", "Илья Петров", "Марат Хасанов", "Ольга Тарасова"];

/** The server's table: 137 deals. */
const DEALS: Deal[] = Array.from({ length: 137 }, (_, i) => ({
  id: 2401 + i,
  client: CLIENTS[(i * 7) % CLIENTS.length],
  manager: MANAGERS[(i * 3) % MANAGERS.length],
  stage: STAGES[(i * 5) % STAGES.length],
  amount: 40_000 + ((i * 7919) % 97) * 12_500,
}));

const FIELDS: SmartFilterField[] = [
  {
    key: "stage",
    label: "Этап",
    options: STAGES.map((value) => ({ value, label: STAGE[value].label })),
  },
  {
    key: "manager",
    label: "Менеджер",
    options: MANAGERS.map((value) => ({ value, label: value })),
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Deal>[] = [
  { id: "id", header: "Сделка", accessor: "id", sortable: true, numeric: true, align: "start" },
  { id: "client", header: "Клиент", accessor: "client", sortable: true },
  { id: "manager", header: "Менеджер", accessor: "manager", sortable: true },
  {
    id: "stage",
    header: "Этап",
    accessor: "stage",
    cell: (row) => <Badge.Root color={STAGE[row.stage].color}>{STAGE[row.stage].label}</Badge.Root>,
  },
  {
    id: "amount",
    header: "Сумма",
    accessor: "amount",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.amount),
  },
];

const compare = (a: string | number, b: string | number) =>
  typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b), "ru");

/** Fake API: searches, filters, sorts and cuts one page on the «server», then answers late. */
function fetchDeals({ page, sort, search, filter }: DealsRequest): Promise<DealsPage> {
  const query = search.trim().toLowerCase();
  const found = DEALS.filter(
    (row) =>
      matchesSmartFilter(filter.stage, row.stage) &&
      matchesSmartFilter(filter.manager, row.manager) &&
      (String(row.id).includes(query) || row.client.toLowerCase().includes(query)),
  );
  if (sort) {
    const key = sort.columnId as keyof Deal;
    const direction = sort.order === "asc" ? 1 : -1;
    found.sort((a, b) => compare(a[key], b[key]) * direction);
  }
  const start = (page - 1) * PAGE_SIZE;
  const answer = { rows: found.slice(start, start + PAGE_SIZE), total: found.length };
  return new Promise((resolve) => window.setTimeout(() => resolve(answer), LATENCY_MS));
}

export default function DataTableServerExample() {
  const [filter, setFilter] = React.useState<SmartFilterValue>({});
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<DataTableSortState>({ columnId: "amount", order: "desc" });
  const [page, setPage] = React.useState(1);
  const [result, setResult] = React.useState<DealsPage>({ rows: [], total: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let latest = true;
    setLoading(true);
    fetchDeals({ page, sort, search, filter }).then((answer) => {
      // A newer request replaced this one: its answer is dropped.
      if (!latest) return;
      setResult(answer);
      setLoading(false);
    });
    return () => {
      latest = false;
    };
  }, [page, sort, search, filter]);

  // A new search or filter is another result set: back to its first page.
  const changeSearch = (next: string) => {
    setSearch(next);
    setPage(1);
  };
  const changeFilter = (next: SmartFilterValue) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <DataTable
      source="server"
      columns={COLUMNS}
      rows={result.rows}
      rowCount={result.total}
      getRowKey={(row) => row.id}
      pageSize={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
      sort={sort}
      onSortChange={setSort}
      loading={loading}
      empty="Сделок не найдено — измените запрос или фильтры"
      toolbar={
        <SmartFilter.Root
          fields={FIELDS}
          value={filter}
          onValueChange={changeFilter}
          search={search}
          onSearchChange={changeSearch}
        >
          <SmartFilter.Toolbar />
          <SmartFilter.Chips />
        </SmartFilter.Root>
      }
    />
  );
}
