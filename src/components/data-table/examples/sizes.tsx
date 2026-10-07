/** Every density: rows from 36 to 52 px, the head at the control height of the tier — `size`. */
import { Badge, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Invoice = { id: string; client: string; paid: boolean; amount: number };

const INVOICES: Invoice[] = [
  { id: "INV-1042", client: "ООО «Северный ветер»", paid: true, amount: 184_500 },
  { id: "INV-1043", client: "ИП Гончаров", paid: false, amount: 42_000 },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Счёт", accessor: "id", width: "7rem" },
  { id: "client", header: "Клиент", accessor: "client" },
  {
    id: "status",
    header: "Статус",
    cell: (row) =>
      row.paid ? (
        <Badge.Root color="green">Оплачен</Badge.Root>
      ) : (
        <Badge.Root color="orange">Ожидает</Badge.Root>
      ),
  },
  { id: "amount", header: "Сумма", numeric: true, cell: (row) => RUB.format(row.amount) },
];

const SIZES = ["xs", "s", "m", "l", "xl"] as const;

export default function DataTableSizesExample() {
  return (
    <div className={styles.specimens}>
      {SIZES.map((size) => (
        <div key={size} className={styles.specimen}>
          <DataTable
            size={size}
            columns={COLUMNS}
            rows={INVOICES}
            getRowKey={(row) => row.id}
            paging="none"
          />
          <Typography.Root as="span" variant="caption" tone="muted">
            {size}
          </Typography.Root>
        </div>
      ))}
    </div>
  );
}
