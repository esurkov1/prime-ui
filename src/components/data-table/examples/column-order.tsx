/** Orders whose columns a manager puts in place by dragging a header — it moves alone and the gap opens among the headers where it lands — or with Alt + ← / →, and shows, hides and reorders in the chooser over the row menu; the order number stays first and the row menu last, and the choice outlives a reload — `columnOrder`, `onColumnOrderChange`, `reorderable`, `columnsMenu`, `hiddenColumns`. */
import { Badge, Button, DataTable, type DataTableColumn, Dropdown, Icon } from "prime-ui-kit";
import * as React from "react";

type Status = "paid" | "shipped" | "waiting";
type Order = {
  id: string;
  client: string;
  manager: string;
  city: string;
  status: Status;
  date: string;
  total: number;
};

const STATUS: Record<Status, { label: string; color: "green" | "blue" | "orange" }> = {
  paid: { label: "Оплачен", color: "green" },
  shipped: { label: "Отгружен", color: "blue" },
  waiting: { label: "Ждёт оплаты", color: "orange" },
};

const ORDERS: Order[] = [
  {
    id: "№ 1040",
    client: "ООО «Северный ветер»",
    manager: "Ольга Смирнова",
    city: "Москва",
    status: "paid",
    date: "02.10.2026",
    total: 184_500,
  },
  {
    id: "№ 1041",
    client: "ИП Козлов",
    manager: "Игорь Волков",
    city: "Казань",
    status: "waiting",
    date: "03.10.2026",
    total: 27_900,
  },
  {
    id: "№ 1042",
    client: "АО «Технопарк»",
    manager: "Ольга Смирнова",
    city: "Санкт-Петербург",
    status: "shipped",
    date: "04.10.2026",
    total: 612_000,
  },
  {
    id: "№ 1043",
    client: "ООО «Лето»",
    manager: "Мария Орлова",
    city: "Екатеринбург",
    status: "paid",
    date: "05.10.2026",
    total: 58_350,
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id", hideable: false, reorderable: false },
  { id: "client", header: "Клиент", accessor: "client", sortable: true },
  { id: "manager", header: "Менеджер", accessor: "manager" },
  { id: "city", header: "Город", accessor: "city" },
  {
    id: "status",
    header: "Статус",
    cell: (row) => (
      <Badge.Root color={STATUS[row.status].color}>{STATUS[row.status].label}</Badge.Root>
    ),
  },
  { id: "date", header: "Дата", accessor: "date", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
  {
    id: "actions",
    header: "Действия",
    hideHeader: true,
    hideable: false,
    align: "end",
    cell: (row) => (
      <Dropdown.Root>
        <Dropdown.Trigger>
          <Button.Root variant="ghost" tone="neutral" aria-label={`Действия с заказом ${row.id}`}>
            <Button.Icon>
              <Icon name="action.more" />
            </Button.Icon>
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Открыть заказ</Dropdown.Item>
          <Dropdown.Item>Скачать счёт</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
  },
];

/** The kit keeps nothing: the app stores the order and the hidden columns where it likes. */
const STORAGE_KEY = "orders.columns";
type ColumnView = { order: string[]; hidden: string[] };
const DEFAULT_VIEW: ColumnView = { order: [], hidden: ["city"] };

function readView(): ColumnView {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved
      ? { ...DEFAULT_VIEW, ...(JSON.parse(saved) as Partial<ColumnView>) }
      : DEFAULT_VIEW;
  } catch {
    return DEFAULT_VIEW;
  }
}

export default function DataTableColumnOrderExample() {
  const [view, setView] = React.useState(readView);

  const changeView = (next: ColumnView) => {
    setView(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private mode or a full storage: the choice lasts until the reload.
    }
  };

  return (
    <DataTable
      columns={COLUMNS}
      columnOrder={view.order}
      onColumnOrderChange={(order) => changeView({ ...view, order })}
      hiddenColumns={view.hidden}
      onHiddenColumnsChange={(hidden) => changeView({ ...view, hidden })}
      rows={ORDERS}
      getRowKey={(row) => row.id}
      columnsMenu
    />
  );
}
