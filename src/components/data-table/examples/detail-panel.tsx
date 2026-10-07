/** `renderExpanded` draws a full-width detail row under an expanded row, aligned with the first content column; with `stickyFirstColumn` the toggle sticks too. Use to show order details without leaving the list. */

import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Order = {
  id: string;
  number: string;
  customer: string;
  date: string;
  total: number;
  address: string;
  items: { name: string; qty: number }[];
};

const rows: Order[] = [
  {
    id: "o1",
    number: "№ 10 482",
    customer: "Анна Соколова",
    date: "07.10.26",
    total: 12_480,
    address: "Москва, ул. Тверская, 12, кв. 45",
    items: [
      { name: "Кабель USB-C, 2 м", qty: 2 },
      { name: "Док-станция", qty: 1 },
    ],
  },
  {
    id: "o2",
    number: "№ 10 481",
    customer: "Дмитрий Орлов",
    date: "06.10.26",
    total: 34_900,
    address: "Санкт-Петербург, Невский пр., 28",
    items: [{ name: 'Монитор 27"', qty: 1 }],
  },
  {
    id: "o3",
    number: "№ 10 477",
    customer: "Мария Ким",
    date: "05.10.26",
    total: 4_350,
    address: "Казань, ул. Баумана, 7",
    items: [{ name: "Клавиатура", qty: 1 }],
  },
];

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const columns: DataTableColumn<Order>[] = [
  { id: "number", header: "Заказ", accessor: "number", minWidth: "8rem" },
  { id: "customer", header: "Покупатель", accessor: "customer", sortable: true, minWidth: "12rem" },
  { id: "date", header: "Дата", accessor: "date", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => rub.format(row.total),
  },
];

export default function DataTableDetailPanelExample() {
  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.number}
      renderExpanded={(row) => (
        <dl className={styles.details}>
          <dt>
            <Typography.Root as="span" variant="body-s" tone="muted">
              Адрес доставки
            </Typography.Root>
          </dt>
          <dd>
            <Typography.Root as="span" variant="body-s">
              {row.address}
            </Typography.Root>
          </dd>
          <dt>
            <Typography.Root as="span" variant="body-s" tone="muted">
              Состав
            </Typography.Root>
          </dt>
          <dd>
            <Typography.Root as="span" variant="body-s">
              {row.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}
            </Typography.Root>
          </dd>
        </dl>
      )}
      defaultExpanded={["o1"]}
      stickyFirstColumn
      showPagination={false}
    />
  );
}
