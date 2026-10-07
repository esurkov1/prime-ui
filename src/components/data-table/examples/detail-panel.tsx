/** Order details in a full-width row under an expanded order, aligned with the first content column — `renderExpanded`, `defaultExpanded`. */
import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Order = {
  id: string;
  number: string;
  customer: string;
  date: string;
  total: number;
  address: string;
  items: string;
};

const ORDERS: Order[] = [
  {
    id: "o1",
    number: "№ 10 482",
    customer: "Анна Соколова",
    date: "07.10.26",
    total: 12_480,
    address: "Москва, ул. Тверская, 12, кв. 45",
    items: "Кабель USB-C, 2 м × 2, док-станция × 1",
  },
  {
    id: "o2",
    number: "№ 10 481",
    customer: "Дмитрий Орлов",
    date: "06.10.26",
    total: 34_900,
    address: "Санкт-Петербург, Невский пр., 28",
    items: 'Монитор 27" × 1',
  },
  {
    id: "o3",
    number: "№ 10 477",
    customer: "Мария Ким",
    date: "05.10.26",
    total: 4_350,
    address: "Казань, ул. Баумана, 7",
    items: "Клавиатура × 1",
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "number", header: "Заказ", accessor: "number", minWidth: "8rem" },
  { id: "customer", header: "Покупатель", accessor: "customer", sortable: true },
  { id: "date", header: "Дата", accessor: "date", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

export default function DataTableDetailPanelExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={ORDERS}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.number}
      renderExpanded={(row) => (
        <dl className={styles.details}>
          <dt>
            <Typography as="span" variant="body-s" tone="muted">
              Адрес доставки
            </Typography>
          </dt>
          <dd>
            <Typography as="span" variant="body-s">
              {row.address}
            </Typography>
          </dd>
          <dt>
            <Typography as="span" variant="body-s" tone="muted">
              Состав
            </Typography>
          </dt>
          <dd>
            <Typography as="span" variant="body-s">
              {row.items}
            </Typography>
          </dd>
        </dl>
      )}
      defaultExpanded={["o1"]}
      paging="none"
    />
  );
}
