/** Tree rows with `getRowChildren`: sub-rows under the parent indented by the avatar width, a chevron toggle, controlled `expanded`, together with selection and sorting. Use for hierarchical data (partners → expenses). */

import { Building2, Car, Wallet } from "lucide-react";
import { Avatar, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Entry = {
  id: string;
  name: string;
  note: string;
  kind: "partner" | "company" | "payout" | "car";
  share: number;
  amount: number;
  children?: Entry[];
};

const rows: Entry[] = [
  {
    id: "denis",
    name: "Денис",
    note: "Партнёр",
    kind: "partner",
    share: 50,
    amount: 184_000,
    children: [
      {
        id: "denis-company",
        name: "Расходы компании",
        note: "доля 50%",
        kind: "company",
        share: 50,
        amount: 62_000,
      },
      {
        id: "denis-payout",
        name: "Выплата партнёру",
        note: "за сентябрь",
        kind: "payout",
        share: 50,
        amount: 122_000,
      },
    ],
  },
  {
    id: "olga",
    name: "Ольга",
    note: "Партнёр",
    kind: "partner",
    share: 30,
    amount: 110_400,
    children: [
      {
        id: "olga-company",
        name: "Расходы компании",
        note: "доля 30%",
        kind: "company",
        share: 30,
        amount: 37_200,
      },
      {
        id: "olga-car",
        name: "Toyota Camry · А 123 ВС",
        note: "аренда",
        kind: "car",
        share: 30,
        amount: 73_200,
      },
    ],
  },
  { id: "ivan", name: "Иван", note: "Инвестор", kind: "partner", share: 20, amount: 73_600 },
];

const rub = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const icons = { company: Building2, payout: Wallet, car: Car };

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

const columns: DataTableColumn<Entry>[] = [
  {
    id: "name",
    header: "Участник",
    accessor: "name",
    sortable: true,
    cell: (row) => {
      const Icon = row.kind === "partner" ? null : icons[row.kind];
      return (
        <div className={styles.customer}>
          {Icon ? (
            <span className={styles.iconBox} aria-hidden="true">
              <Icon />
            </span>
          ) : (
            <Avatar.Root size="m" color="purple">
              <Avatar.Fallback>{initials(row.name)}</Avatar.Fallback>
            </Avatar.Root>
          )}
          <div className={styles.customerText}>
            <span>{row.name}</span>
            <Typography.Root as="span" variant="caption" tone="muted" truncate>
              {row.note}
            </Typography.Root>
          </div>
        </div>
      );
    },
  },
  {
    id: "share",
    header: "Доля",
    accessor: "share",
    sortable: true,
    numeric: true,
    cell: (row) => `${row.share}%`,
  },
  {
    id: "amount",
    header: "Сумма",
    accessor: "amount",
    sortable: true,
    numeric: true,
    cell: (row) => rub.format(row.amount),
  },
];

export default function DataTableNestedRowsExample() {
  const [expanded, setExpanded] = React.useState<React.Key[]>(["denis"]);

  return (
    <DataTable.Root
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      getRowChildren={(row) => row.children}
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectable
      showPagination={false}
    />
  );
}
