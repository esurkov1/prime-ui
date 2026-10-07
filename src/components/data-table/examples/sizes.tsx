/** Density via `size`: rows 36 / 36 / 44 / 52 / 52, the header is the control height of the tier and one step smaller in text; badges follow by themselves. Use `s` for dense back-office lists, `m` by default. */

import { Badge, type ControlSize, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

import styles from "./examples.module.css";

type Invoice = { id: string; client: string; status: "paid" | "due"; amount: number };

const rows: Invoice[] = [
  { id: "INV-1042", client: "ООО «Северный ветер»", status: "paid", amount: 184_500 },
  { id: "INV-1043", client: "ИП Гончаров", status: "due", amount: 42_000 },
  { id: "INV-1044", client: "АО «Транслайн»", status: "paid", amount: 1_250_000 },
];

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const columns: DataTableColumn<Invoice>[] = [
  { id: "id", header: "Счёт", accessor: "id", width: "7rem" },
  { id: "client", header: "Клиент", accessor: "client", truncate: true, maxWidth: "16rem" },
  {
    id: "status",
    header: "Статус",
    cell: (row) =>
      row.status === "paid" ? (
        <Badge.Root color="green">Оплачен</Badge.Root>
      ) : (
        <Badge.Root color="orange">Ожидает</Badge.Root>
      ),
  },
  { id: "amount", header: "Сумма", numeric: true, cell: (row) => rub.format(row.amount) },
];

const densities: { size: ControlSize; note: string }[] = [
  { size: "xs", note: "строка 36 · шапка 28, 12/16 · ячейки 12/16" },
  { size: "s", note: "строка 36 · шапка 32, 12/16 · ячейки 13/20" },
  { size: "m", note: "по умолчанию · строка 44 · шапка 36, 13/20 · ячейки 14/20" },
  { size: "l", note: "строка 52 · шапка 40, 14/20 · ячейки 16/24" },
  { size: "xl", note: "строка 52 · шапка 48, 14/20 · ячейки 16/24" },
];

export default function DataTableSizesExample() {
  return (
    <div className={styles.stack}>
      {densities.map(({ size, note }) => (
        <div key={size} className={styles.group}>
          <Typography.Root variant="caption" tone="muted">
            <Typography.Root as="span" variant="code" tone="muted">
              size="{size}"
            </Typography.Root>{" "}
            — {note}
          </Typography.Root>
          <DataTable.Root
            size={size}
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.id}
            showPagination={false}
          />
        </div>
      ))}
    </div>
  );
}
