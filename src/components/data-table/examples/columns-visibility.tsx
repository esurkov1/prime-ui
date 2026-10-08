/** Orders with a column chooser in the toolbar: fewer columns, less sideways scrolling; the order number always stays — `hiddenColumns`, `hideable`, `toolbar`. */
import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
  Dropdown,
  Icon,
  Typography,
} from "prime-ui-kit";
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

export default function DataTableColumnsVisibilityExample() {
  const [hidden, setHidden] = React.useState<string[]>(["city", "items"]);
  const shown = COLUMNS.length - hidden.length;

  const toggle = (id: string, visible: boolean) =>
    setHidden((current) => (visible ? current.filter((c) => c !== id) : [...current, id]));

  return (
    <DataTable
      columns={COLUMNS}
      hiddenColumns={hidden}
      rows={ORDERS}
      getRowKey={(row) => row.id}
      stickyFirstColumn
      toolbar={
        <div className={styles.toolbar}>
          <Typography as="span" variant="body-s" tone="secondary">
            Заказы за неделю: {ORDERS.length}
          </Typography>
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root variant="outline" tone="neutral" size="s">
                <Button.Icon>
                  <Icon name="view.preview" />
                </Button.Icon>
                Колонки: {shown} из {COLUMNS.length}
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align="end" size="s">
              <Dropdown.Group label="Колонки таблицы">
                {COLUMNS.map((column) => (
                  <Dropdown.CheckboxItem
                    key={column.id}
                    checked={!hidden.includes(column.id)}
                    disabled={column.hideable === false}
                    onCheckedChange={(visible) => toggle(column.id, visible)}
                  >
                    {column.header}
                  </Dropdown.CheckboxItem>
                ))}
              </Dropdown.Group>
              <Dropdown.Separator />
              <Dropdown.Item disabled={hidden.length === 0} onSelect={() => setHidden([])}>
                Показать все
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
      }
    />
  );
}
