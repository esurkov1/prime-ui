/** Orders without a row-actions column: the column chooser stands in the tools above the table with the count of shown columns; the choice outlives a reload in local storage, the order number always stays — `DataTableColumnsMenu`, `hiddenColumns`, `onHiddenColumnsChange`, `hideable`. */
import { Badge, DataTable, type DataTableColumn, DataTableColumnsMenu } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Status = "paid" | "shipped" | "waiting";
type Order = {
  id: string;
  client: string;
  manager: string;
  city: string;
  status: Status;
  date: string;
  items: number;
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
    items: 12,
    total: 184_500,
  },
  {
    id: "№ 1041",
    client: "ИП Козлов",
    manager: "Игорь Волков",
    city: "Казань",
    status: "waiting",
    date: "03.10.2026",
    items: 3,
    total: 27_900,
  },
  {
    id: "№ 1042",
    client: "АО «Технопарк»",
    manager: "Ольга Смирнова",
    city: "Санкт-Петербург",
    status: "shipped",
    date: "04.10.2026",
    items: 40,
    total: 612_000,
  },
  {
    id: "№ 1043",
    client: "ООО «Лето»",
    manager: "Мария Орлова",
    city: "Екатеринбург",
    status: "paid",
    date: "05.10.2026",
    items: 7,
    total: 58_350,
  },
  {
    id: "№ 1044",
    client: "ООО «Гранит»",
    manager: "Игорь Волков",
    city: "Новосибирск",
    status: "shipped",
    date: "06.10.2026",
    items: 18,
    total: 241_800,
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id", hideable: false },
  { id: "client", header: "Клиент", accessor: "client" },
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
  { id: "items", header: "Позиций", accessor: "items", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

/** The kit keeps nothing: the app stores the choice where it likes (here, local storage). */
const STORAGE_KEY = "orders.hiddenColumns";
const DEFAULT_HIDDEN = ["city", "items"];

function readHidden(): string[] {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as string[]) : DEFAULT_HIDDEN;
  } catch {
    return DEFAULT_HIDDEN;
  }
}

export default function DataTableColumnsVisibilityExample() {
  const [hidden, setHidden] = React.useState(readHidden);

  const changeHidden = (next: string[]) => {
    setHidden(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Private mode or a full storage: the choice lasts until the reload.
    }
  };

  return (
    <div className={styles.withTools}>
      <div className={styles.tools}>
        <DataTableColumnsMenu
          columns={COLUMNS}
          hiddenColumns={hidden}
          onHiddenColumnsChange={changeHidden}
        />
      </div>
      <DataTable
        columns={COLUMNS}
        hiddenColumns={hidden}
        rows={ORDERS}
        getRowKey={(row) => row.id}
        stickyFirstColumn
      />
    </div>
  );
}
