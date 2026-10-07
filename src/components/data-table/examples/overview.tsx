/** Recent orders: sortable columns, a status Badge, numeric sums and five rows per page — `columns`, `getRowKey`, `pageSize`. */
import { Badge, DataTable, type DataTableColumn } from "prime-ui-kit";

type OrderStatus = "paid" | "shipping" | "refund";
type Order = { id: string; customer: string; status: OrderStatus; items: number; total: number };

const STATUS: Record<OrderStatus, { label: string; color: "green" | "blue" | "red" }> = {
  paid: { label: "Оплачен", color: "green" },
  shipping: { label: "В пути", color: "blue" },
  refund: { label: "Возврат", color: "red" },
};

const ORDERS: Order[] = [
  { id: "№ 48 213", customer: "Алина Морозова", status: "paid", items: 3, total: 12_480 },
  { id: "№ 48 212", customer: "Сергей Фёдоров", status: "shipping", items: 1, total: 54_990 },
  { id: "№ 48 211", customer: "Ольга Лебедева", status: "paid", items: 6, total: 8_730 },
  { id: "№ 48 210", customer: "Тимур Ахмедов", status: "refund", items: 2, total: 3_200 },
  { id: "№ 48 209", customer: "Ксения Волкова", status: "shipping", items: 4, total: 21_650 },
  { id: "№ 48 208", customer: "Павел Никитин", status: "paid", items: 1, total: 2_490 },
  { id: "№ 48 207", customer: "Елена Зайцева", status: "paid", items: 2, total: 17_300 },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Order>[] = [
  { id: "id", header: "Заказ", accessor: "id", width: "7rem" },
  { id: "customer", header: "Покупатель", accessor: "customer", sortable: true },
  {
    id: "status",
    header: "Статус",
    accessor: "status",
    sortable: true,
    cell: (row) => (
      <Badge.Root color={STATUS[row.status].color}>{STATUS[row.status].label}</Badge.Root>
    ),
  },
  { id: "items", header: "Товаров", accessor: "items", numeric: true },
  {
    id: "total",
    header: "Сумма",
    accessor: "total",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.total),
  },
];

export default function DataTableOverviewExample() {
  return <DataTable columns={COLUMNS} rows={ORDERS} getRowKey={(row) => row.id} pageSize={5} />;
}
