import { Badge, DataTable, type DataTableColumn, Tag } from "prime-ui-kit";
import * as React from "react";

type OrderRow = {
  id: string;
  customer: string;
  amount: number;
  region: string;
  status: "Оплачен" | "В работе" | "Просрочен";
};

const rows: OrderRow[] = [
  { id: "ORD-104", customer: "ООО «Север»", amount: 128_400, region: "СЗФО", status: "Оплачен" },
  { id: "ORD-105", customer: "ИП Ким", amount: 42_100, region: "ДВФО", status: "В работе" },
  { id: "ORD-106", customer: "АО «Транзит»", amount: 901_000, region: "ЦФО", status: "Оплачен" },
  { id: "ORD-107", customer: "ООО «Логистик»", amount: 15_750, region: "ЮФО", status: "Просрочен" },
  {
    id: "ORD-108",
    customer: "Самозанятый Орлов",
    amount: 6_200,
    region: "ПФО",
    status: "В работе",
  },
  { id: "ORD-109", customer: "ООО «Полюс»", amount: 333_000, region: "УФО", status: "Оплачен" },
  { id: "ORD-110", customer: "КФХ «Рядок»", amount: 88_500, region: "ЮФО", status: "В работе" },
  { id: "ORD-111", customer: "АНО «Школа»", amount: 12_000, region: "СКФО", status: "Просрочен" },
];

function statusColor(status: OrderRow["status"]) {
  if (status === "Оплачен") return "green";
  if (status === "Просрочен") return "red";
  return "yellow";
}

const columns: DataTableColumn<OrderRow>[] = [
  {
    id: "id",
    header: "Заказ",
    accessor: "id",
    sortable: true,
    minWidth: "8.5rem",
  },
  {
    id: "customer",
    header: "Клиент",
    accessor: "customer",
    sortable: true,
    minWidth: "12rem",
  },
  {
    id: "amount",
    header: "Сумма, ₽",
    accessor: "amount",
    sortable: true,
    align: "end",
    minWidth: "9rem",
    cell: (row) => row.amount.toLocaleString("ru-RU"),
  },
  {
    id: "region",
    header: "Округ",
    accessor: "region",
    sortable: true,
    minWidth: "6rem",
    cell: (row) => <Tag.Root>{row.region}</Tag.Root>,
  },
  {
    id: "status",
    header: "Статус",
    accessor: "status",
    sortable: true,
    minWidth: "9rem",
    cell: (row) => (
      <Badge.Root color={statusColor(row.status)} variant="light">
        {row.status}
      </Badge.Root>
    ),
  },
];

/**
 * Полноценная таблица: сортировка по умолчанию, пагинация (`pageSize` меньше числа строк),
 * стабильные ключи строк и типичное оформление ячеек через `Tag` / `Badge`.
 */
export default function DataTableCanonicalOrdersExample() {
  const [lastOpened, setLastOpened] = React.useState<string | null>(null);

  return (
    <div>
      {lastOpened ? (
        <p style={{ marginBottom: "0.75rem" }}>Открыт заказ: {lastOpened}</p>
      ) : (
        <p style={{ marginBottom: "0.75rem" }}>
          Клик по строке выбирает заказ для сценария «открыть».
        </p>
      )}
      <DataTable.Root
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.id}
        defaultSort={{ columnId: "amount", order: "desc" }}
        pageSize={4}
        onRowClick={(row) => setLastOpened(row.id)}
      />
    </div>
  );
}
