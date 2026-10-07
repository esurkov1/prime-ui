/** Partners with their expense lines: sub-rows indented under the parent's name, a chevron toggle, together with selection and sorting — `getRowChildren`, `expanded`, `onExpandedChange`. */
import { Avatar, DataTable, type DataTableColumn, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Entry = {
  id: string;
  name: string;
  note: string;
  share: number;
  amount: number;
  children?: Entry[];
};

const ENTRIES: Entry[] = [
  {
    id: "denis",
    name: "Денис Карпов",
    note: "Партнёр",
    share: 50,
    amount: 184_000,
    children: [
      {
        id: "denis-company",
        name: "Расходы компании",
        note: "доля 50%",
        share: 50,
        amount: 62_000,
      },
      {
        id: "denis-payout",
        name: "Выплата партнёру",
        note: "за сентябрь",
        share: 50,
        amount: 122_000,
      },
    ],
  },
  {
    id: "olga",
    name: "Ольга Белова",
    note: "Партнёр",
    share: 30,
    amount: 110_400,
    children: [
      { id: "olga-company", name: "Расходы компании", note: "доля 30%", share: 30, amount: 37_200 },
      {
        id: "olga-car",
        name: "Toyota Camry · А 123 ВС",
        note: "аренда",
        share: 30,
        amount: 73_200,
      },
    ],
  },
  { id: "ivan", name: "Иван Сорокин", note: "Инвестор", share: 20, amount: 73_600 },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

const COLUMNS: DataTableColumn<Entry>[] = [
  {
    id: "name",
    header: "Участник",
    accessor: "name",
    sortable: true,
    cell: (row) => (
      <div className={styles.person}>
        {row.children ? (
          <Avatar.Root color="purple">
            <Avatar.Fallback>{initials(row.name)}</Avatar.Fallback>
          </Avatar.Root>
        ) : null}
        <div className={styles.personText}>
          <span>{row.name}</span>
          <Typography as="span" variant="caption" tone="muted" truncate>
            {row.note}
          </Typography>
        </div>
      </div>
    ),
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
    cell: (row) => RUB.format(row.amount),
  },
];

export default function DataTableNestedRowsExample() {
  const [expanded, setExpanded] = React.useState<React.Key[]>(["denis"]);

  return (
    <DataTable
      columns={COLUMNS}
      rows={ENTRIES}
      getRowKey={(row) => row.id}
      getRowLabel={(row) => row.name}
      getRowChildren={(row) => row.children}
      expanded={expanded}
      onExpandedChange={setExpanded}
      selectable
      paging="none"
    />
  );
}
