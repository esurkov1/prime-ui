/** Orders whose view menu shows, hides and reorders the columns: a grip at the end of each item drags it (a held press on touch), Alt + ↑ / ↓ moves the focused one, and the reset item puts the default columns and their order back — `DataTableColumnsMenu`, `columnOrder`, `onColumnOrderChange`, `defaultHiddenColumns`. */
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
    total: 184_500,
  },
  {
    id: "№ 1041",
    client: "ИП Козлов",
    manager: "Игорь Волков",
    city: "Казань",
    status: "waiting",
    total: 27_900,
  },
  {
    id: "№ 1042",
    client: "АО «Технопарк»",
    manager: "Ольга Смирнова",
    city: "Санкт-Петербург",
    status: "shipped",
    total: 612_000,
  },
  {
    id: "№ 1043",
    client: "ООО «Гранит»",
    manager: "Мария Орлова",
    city: "Новосибирск",
    status: "shipped",
    total: 241_800,
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id", hideable: false, reorderable: false },
  { id: "client", header: "Клиент", accessor: "client" },
  {
    id: "status",
    header: "Статус",
    cell: (row) => (
      <Badge.Root color={STATUS[row.status].color}>{STATUS[row.status].label}</Badge.Root>
    ),
  },
  { id: "manager", header: "Менеджер", accessor: "manager" },
  { id: "city", header: "Город", accessor: "city" },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

const DEFAULT_HIDDEN = ["city"];

export default function DataTableViewOrderExample() {
  const [hidden, setHidden] = React.useState(DEFAULT_HIDDEN);
  const [order, setOrder] = React.useState<string[]>([]);

  return (
    <div className={styles.withTools}>
      <div className={styles.tools}>
        <DataTableColumnsMenu
          columns={COLUMNS}
          hiddenColumns={hidden}
          defaultHiddenColumns={DEFAULT_HIDDEN}
          onHiddenColumnsChange={setHidden}
          columnOrder={order}
          onColumnOrderChange={setOrder}
        />
      </div>
      <DataTable
        columns={COLUMNS}
        hiddenColumns={hidden}
        columnOrder={order}
        onColumnOrderChange={setOrder}
        rows={ORDERS}
        getRowKey={(row) => row.id}
        stickyFirstColumn
      />
    </div>
  );
}
