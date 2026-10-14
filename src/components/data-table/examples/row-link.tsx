/** Invoices whose rows are links: ⌘-click or a middle click opens a new tab, a plain click routes inside the app, the totals row and the ⋯ menu never open a row — `getRowHref`, `onRowClick`, `isRowClickable`. */
import { Button, DataTable, type DataTableColumn, Dropdown, Icon, Typography } from "prime-ui-kit";
import * as React from "react";

import styles from "./examples.module.css";

type Invoice = { id: string; client: string; due: string; amount: number; total?: boolean };

const INVOICES: Invoice[] = [
  { id: "INV-1042", client: "ООО «Северный ветер»", due: "12.10.2026", amount: 184_500 },
  { id: "INV-1043", client: "ИП Козлов", due: "14.10.2026", amount: 27_900 },
  { id: "INV-1044", client: "АО «Технопарк»", due: "20.10.2026", amount: 612_000 },
];

const ROWS: Invoice[] = [
  ...INVOICES,
  {
    id: "total",
    client: "Итого к оплате",
    due: "",
    amount: INVOICES.reduce((sum, invoice) => sum + invoice.amount, 0),
    total: true,
  },
];

const RUB = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export default function DataTableRowLinkExample() {
  const [status, setStatus] = React.useState("Откройте счёт из списка");

  const columns: DataTableColumn<Invoice>[] = [
    { id: "client", header: "Клиент", accessor: "client", hideable: false },
    { id: "id", header: "Счёт", cell: (row) => (row.total ? "" : row.id) },
    { id: "due", header: "Оплатить до", accessor: "due", numeric: true },
    {
      id: "amount",
      header: "Сумма",
      accessor: "amount",
      numeric: true,
      cell: (row) => RUB.format(row.amount),
    },
    {
      id: "actions",
      header: "Действия",
      hideHeader: true,
      align: "end",
      cell: (row) =>
        row.total ? null : (
          <Dropdown.Root>
            <Dropdown.Trigger>
              <Button.Root
                variant="ghost"
                tone="neutral"
                size="s"
                aria-label={`Действия со счётом ${row.id}`}
              >
                <Button.Icon>
                  <Icon name="action.more" />
                </Button.Icon>
              </Button.Root>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item onSelect={() => setStatus(`${row.id} отправлен клиенту повторно`)}>
                Отправить повторно
              </Dropdown.Item>
              <Dropdown.Item onSelect={() => setStatus(`${row.id} скачан в PDF`)}>
                Скачать PDF
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={ROWS}
      getRowKey={(row) => row.id}
      paging="none"
      getRowHref={(row) => `/invoices/${row.id}`}
      isRowClickable={(row) => !row.total}
      onRowClick={(row, _index, event) => {
        // A client-side router goes here (navigate(href)); the page itself never reloads.
        event.preventDefault();
        setStatus(`Открыт ${row.id} · ${row.client}`);
      }}
      toolbar={
        <div className={styles.toolbar}>
          <Typography as="span" variant="body-s" tone="secondary" aria-live="polite">
            {status}
          </Typography>
        </div>
      }
    />
  );
}
