/** Store dashboard: a row of `stat-trend` cards and a recent-orders table with avatar, status badge and `numeric` sums. Use as the skeleton of an overview screen. */

import {
  Avatar,
  Badge,
  Button,
  Card,
  DataTable,
  type DataTableColumn,
  SegmentedControl,
  Typography,
} from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type OrderStatus = "paid" | "shipping" | "refund";
type Order = {
  id: string;
  customer: string;
  email: string;
  status: OrderStatus;
  items: number;
  total: number;
};

const status: Record<OrderStatus, { label: string; color: "green" | "blue" | "red" }> = {
  paid: { label: "Оплачен", color: "green" },
  shipping: { label: "В пути", color: "blue" },
  refund: { label: "Возврат", color: "red" },
};

const orders: Order[] = [
  {
    id: "№ 48 213",
    customer: "Алина Морозова",
    email: "alina.m@mail.ru",
    status: "paid",
    items: 3,
    total: 12_480,
  },
  {
    id: "№ 48 212",
    customer: "Сергей Фёдоров",
    email: "s.fedorov@yandex.ru",
    status: "shipping",
    items: 1,
    total: 54_990,
  },
  {
    id: "№ 48 211",
    customer: "Ольга Лебедева",
    email: "olga.l@gmail.com",
    status: "paid",
    items: 6,
    total: 8_730,
  },
  {
    id: "№ 48 210",
    customer: "Тимур Ахмедов",
    email: "timur@ahmedov.ru",
    status: "refund",
    items: 2,
    total: 3_200,
  },
  {
    id: "№ 48 209",
    customer: "Ксения Волкова",
    email: "k.volkova@mail.ru",
    status: "shipping",
    items: 4,
    total: 21_650,
  },
  {
    id: "№ 48 208",
    customer: "Павел Никитин",
    email: "p.nikitin@corp.ru",
    status: "paid",
    items: 1,
    total: 2_490,
  },
  {
    id: "№ 48 207",
    customer: "Елена Зайцева",
    email: "zaytseva@gmail.com",
    status: "paid",
    items: 2,
    total: 17_300,
  },
];

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

const columns: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id", width: "7rem" },
  {
    id: "customer",
    header: "Покупатель",
    accessor: "customer",
    sortable: true,
    minWidth: "14rem",
    cell: (row) => (
      <span className={styles.customer}>
        <Avatar.Root size="s" color="purple">
          <Avatar.Fallback>{initials(row.customer)}</Avatar.Fallback>
        </Avatar.Root>
        <span className={styles.customerText}>
          <span>{row.customer}</span>
          <Typography.Root as="span" variant="caption" tone="muted" truncate>
            {row.email}
          </Typography.Root>
        </span>
      </span>
    ),
  },
  {
    id: "status",
    header: "Статус",
    accessor: "status",
    sortable: true,
    cell: (row) => (
      <Badge.Root color={status[row.status].color}>{status[row.status].label}</Badge.Root>
    ),
  },
  { id: "items", header: "Товаров", accessor: "items", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => rub.format(row.total),
  },
];

export default function DataTableDashboardExample() {
  const [period, setPeriod] = React.useState("30");

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardHeader}>
        <Typography.Root as="h3" variant="heading-s">
          Продажи
        </Typography.Root>
        <SegmentedControl.Root aria-label="Период" value={period} onValueChange={setPeriod}>
          <SegmentedControl.Item value="7">7 дней</SegmentedControl.Item>
          <SegmentedControl.Item value="30">30 дней</SegmentedControl.Item>
          <SegmentedControl.Item value="90">Квартал</SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>

      <div className={styles.kpis}>
        <Card.Root variant="stat-trend">
          <Card.Label>Выручка</Card.Label>
          <Card.Value>₽ 4,82 млн</Card.Value>
          <Card.Delta tone="success">+12,4% к прошлому периоду</Card.Delta>
        </Card.Root>
        <Card.Root variant="stat-trend">
          <Card.Label>Заказы</Card.Label>
          <Card.Value>1 284</Card.Value>
          <Card.Delta tone="success">+86 заказов</Card.Delta>
        </Card.Root>
        <Card.Root variant="stat-trend">
          <Card.Label>Средний чек</Card.Label>
          <Card.Value>₽ 3 754</Card.Value>
          <Card.Delta tone="neutral">без изменений</Card.Delta>
        </Card.Root>
        <Card.Root variant="stat-trend">
          <Card.Label>Возвраты</Card.Label>
          <Card.Value>2,1%</Card.Value>
          <Card.Delta tone="danger">+0,4 п. п.</Card.Delta>
        </Card.Root>
      </div>

      <DataTable.Root
        columns={columns}
        rows={orders}
        getRowKey={(row) => row.id}
        defaultSort={null}
        pageSize={5}
        onRowClick={() => {}}
        toolbar={
          <div className={styles.toolbar}>
            <Typography.Root as="span" variant="body-s" tone="secondary">
              Последние заказы
            </Typography.Root>
            <Button.Root variant="ghost" tone="neutral" size="s">
              Все заказы
            </Button.Root>
          </div>
        }
      />
    </div>
  );
}
