/** Payments grouped by month with the month's total in its header row; headers stay on top while their rows scroll — `getRowGroup`, `renderGroupHeader`, `stickyGroupHeaders`. */
import { DataTable, type DataTableColumn, Typography } from "prime-ui-kit";

type Payment = { id: string; month: string; client: string; date: string; amount: number };

const PAYMENTS: Payment[] = [
  {
    id: "P-210",
    month: "Октябрь 2026",
    client: "ООО «Северный ветер»",
    date: "07.10",
    amount: 184_500,
  },
  { id: "P-209", month: "Октябрь 2026", client: "ИП Козлов", date: "04.10", amount: 27_900 },
  { id: "P-208", month: "Октябрь 2026", client: "АО «Технопарк»", date: "02.10", amount: 612_000 },
  { id: "P-207", month: "Сентябрь 2026", client: "ООО «Лето»", date: "28.09", amount: 58_350 },
  { id: "P-206", month: "Сентябрь 2026", client: "ООО «Гранит»", date: "21.09", amount: 241_800 },
  { id: "P-205", month: "Сентябрь 2026", client: "ИП Соколова", date: "15.09", amount: 12_400 },
  { id: "P-204", month: "Сентябрь 2026", client: "ООО «Вектор»", date: "03.09", amount: 96_000 },
  { id: "P-203", month: "Август 2026", client: "АО «Технопарк»", date: "29.08", amount: 305_000 },
  {
    id: "P-202",
    month: "Август 2026",
    client: "ООО «Северный ветер»",
    date: "18.08",
    amount: 75_200,
  },
  { id: "P-201", month: "Август 2026", client: "ИП Козлов", date: "06.08", amount: 31_600 },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const COLUMNS: DataTableColumn<Payment>[] = [
  { id: "client", header: "Плательщик", accessor: "client", sortable: true },
  { id: "date", header: "Дата", accessor: "date", numeric: true },
  {
    id: "amount",
    header: "Сумма",
    accessor: "amount",
    sortable: true,
    numeric: true,
    cell: (row) => RUB.format(row.amount),
  },
];

export default function DataTableGroupsExample() {
  return (
    <DataTable
      columns={COLUMNS}
      rows={PAYMENTS}
      getRowKey={(row) => row.id}
      getRowGroup={(row) => row.month}
      renderGroupHeader={(group) => (
        <>
          <span>
            {group.key} · {group.rows.length}
          </span>
          <Typography as="span" variant="caption" tone="secondary">
            {RUB.format(group.rows.reduce((sum, row) => sum + row.amount, 0))}
          </Typography>
        </>
      )}
      stickyGroupHeaders
      stickyHeader
      paging="none"
      scrollHeight={320}
    />
  );
}
